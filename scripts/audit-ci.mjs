import { spawnSync } from 'node:child_process';

const acceptedAdvisories = new Map([
  ['GHSA-6G55-P6WH-862Q', 'PostCSS is nested under Next.js and only processes trusted repository CSS during the static build.'],
  ['GHSA-R28C-9Q8G-F849', 'PostCSS is nested under Next.js and only processes trusted repository CSS during the static build.'],
  ['GHSA-F88M-G3JW-G9CJ', 'Sharp is an optional Next.js build dependency and is not present in the exported static site.'],
]);

const npmExecutable = process.env.npm_execpath ? process.execPath : process.platform === 'win32' ? 'npm.cmd' : 'npm';
const npmArguments = process.env.npm_execpath
  ? [process.env.npm_execpath, 'audit', '--omit=dev', '--json']
  : ['audit', '--omit=dev', '--json'];
const audit = spawnSync(npmExecutable, npmArguments, {
  encoding: 'utf8',
  maxBuffer: 10 * 1024 * 1024,
});

if (audit.error) throw audit.error;

let report;
try {
  report = JSON.parse(audit.stdout);
} catch {
  console.error(audit.stderr || audit.stdout || 'npm audit returned no readable report.');
  process.exit(1);
}

if (report.error) {
  console.error(`npm audit failed: ${report.error.summary ?? report.error.message ?? 'unknown error'}`);
  process.exit(1);
}

const vulnerabilities = report.vulnerabilities ?? {};
const severityRank = { info: 0, low: 1, moderate: 2, high: 3, critical: 4 };
const findings = new Map();
const accepted = new Map();

function inspectPackage(packageName, trail = new Set()) {
  if (trail.has(packageName)) return false;
  const vulnerability = vulnerabilities[packageName];
  if (!vulnerability) {
    findings.set(`unresolved:${packageName}`, {
      packageName,
      severity: 'high',
      title: `Unresolved vulnerability reference: ${packageName}`,
      url: '',
    });
    return true;
  }

  const nextTrail = new Set(trail).add(packageName);
  let inspectedHighAdvisory = false;
  for (const via of vulnerability.via ?? []) {
    if (typeof via === 'string') {
      inspectedHighAdvisory = inspectPackage(via, nextTrail) || inspectedHighAdvisory;
      continue;
    }
    if ((severityRank[via.severity] ?? 0) < severityRank.high) continue;
    inspectedHighAdvisory = true;

    const advisory = via.url?.match(/GHSA-[0-9A-Z-]+/i)?.[0]?.toUpperCase();
    if (advisory && acceptedAdvisories.has(advisory)) {
      accepted.set(advisory, acceptedAdvisories.get(advisory));
      continue;
    }

    const key = advisory ?? `${via.source ?? packageName}:${via.title}`;
    findings.set(key, {
      packageName: via.name ?? packageName,
      severity: via.severity,
      title: via.title,
      url: via.url ?? '',
    });
  }

  if ((severityRank[vulnerability.severity] ?? 0) >= severityRank.high && !inspectedHighAdvisory) {
    findings.set(`unclassified:${packageName}`, {
      packageName,
      severity: vulnerability.severity,
      title: `High-severity vulnerability has no inspectable advisory: ${packageName}`,
      url: '',
    });
  }
  return inspectedHighAdvisory;
}

for (const [packageName, vulnerability] of Object.entries(vulnerabilities)) {
  if ((severityRank[vulnerability.severity] ?? 0) >= severityRank.high) {
    inspectPackage(packageName);
  }
}

if (findings.size > 0) {
  console.error('Security audit failed with unaccepted high or critical advisories:');
  for (const finding of findings.values()) {
    console.error(`- [${finding.severity}] ${finding.packageName}: ${finding.title}${finding.url ? ` (${finding.url})` : ''}`);
  }
  process.exit(1);
}

console.log('Security audit passed: no unaccepted high or critical advisories.');
for (const [advisory, reason] of accepted) {
  console.log(`- Accepted ${advisory}: ${reason}`);
}
