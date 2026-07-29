export const impactMetrics = [
  { value: '16 min', label: 'average time to investigation', detail: 'Fast, evidence-led alert ownership' },
  { value: '300+', label: 'investigations each month', detail: 'Across identity, email, endpoint, and cloud' },
  { value: '500+', label: 'suppression filters engineered', detail: 'KVP and regex logic reducing recurring noise' },
] as const;

export const projects = [
  {
    slug: 'soc-box',
    name: 'SOC Box',
    subtitle: "The SOC analyst's toolbox",
    repository: 'https://github.com/fredzirbel/SOCBox',
    description:
      'A containerized investigation workspace for URL detonation, multi-source IP enrichment, and Defender XDR/Sentinel KQL generation.',
    tags: ['Python', 'FastAPI', 'Playwright', 'KQL'],
  },
  {
    slug: 'sigil',
    name: 'SIGIL',
    subtitle: 'Detection-as-code for Sigma rules',
    repository: 'https://github.com/fredzirbel/SIGIL',
    description:
      'A pipeline that validates, converts, tests, and maps Sigma detections before they reach production SIEMs.',
    tags: ['Python', 'Sigma', 'MITRE ATT&CK', 'CI/CD'],
  },
  {
    slug: 'homesoc',
    name: 'HomeSOC',
    subtitle: 'Live homelab detection engineering',
    repository: 'https://github.com/fredzirbel/homesoc-platform',
    description:
      'A Proxmox-hosted ELK detection platform that routes OPNsense and Proxmox telemetry through Logstash into Elasticsearch, Kibana, and analyst-ready alerts.',
    tags: ['ELK Stack', 'Proxmox', 'OPNsense', 'Detection'],
  },
] as const;

export const roles = [
  {
    title: 'Principal Security Analyst',
    period: 'Jul 2026 - Present',
    bullets: [
      'Lead complex, customer requested deep dive investigations into phishing, malware, and identity intrusions across an MDR operation protecting 2,500+ customer environments. Correlate evidence from 30+ security products to determine scope, root cause, and required containment.',
      'Maintain a 16 minute average time to investigation while handling 300+ alerts monthly, enabling timely customer escalation and containment.',
      'Execute live containment and remediation through a dual authorization workflow that removes attacker access and malicious artifacts, then translate scope, impact, and recovery status into decisions for customer stakeholders during high priority incidents.',
      'Train and mentor L1 analysts to use the in-house AI platform effectively, improving investigation efficiency, correlation quality, and client ready writeups.',
    ],
  },
  {
    title: 'Senior Security Analyst',
    period: 'Jul 2025 - Jul 2026',
    bullets: [
      'Reconstructed attacker activity with custom KQL across email, identity, and endpoint evidence while correlating indicators across customer environments to identify shared campaigns, establish root cause, and enable coordinated response.',
      'Briefed customer stakeholders during three to five weekly high priority incident calls, delivering findings, attribution, and remediation guidance that informed response decisions.',
      'Engineered 500+ KVP and regex suppression filters while validating five or more daily orchestration changes, eliminating thousands of recurring false positives and preventing faulty logic from reaching production.',
    ],
  },
  {
    title: 'Security Analyst',
    period: 'Oct 2024 - Jul 2025',
    bullets: [
      'Triaged identity, phishing, malware, and endpoint alerts across four EDR and SIEM platforms while developing custom KQL to accelerate incident scoping in Microsoft Sentinel and Defender.',
      'Produced client ready escalations with attribution, investigation context, and remediation guidance, giving senior responders an actionable basis for customer communication.',
    ],
  },
] as const;

export const earnedCertifications = [
  { name: 'CompTIA SecurityX (CASP+)', org: 'comptia', href: null },
  { name: 'CompTIA CySA+', org: 'comptia', href: 'https://www.credly.com/badges/169e383d-80ba-4a0a-b12b-b1cf447bac8e' },
  { name: 'CompTIA PenTest+', org: 'comptia', href: 'https://www.credly.com/badges/8ed7f32d-6a82-4aab-9079-8fec5bcef846/public_url' },
  { name: 'CompTIA Security+', org: 'comptia', href: 'https://www.credly.com/badges/9283e8db-5d15-40a4-af14-5b44b5fcc42c' },
  { name: 'CompTIA A+', org: 'comptia', href: 'https://www.credly.com/badges/c183d3cb-6f71-4313-abfd-2bae18629f53' },
  { name: 'ISC2 Certified in Cybersecurity', org: 'isc2', href: 'https://www.credly.com/badges/bca3d97b-0a51-4905-9804-8aa872f78404/public_url' },
] as const;

export const capabilityGroups = [
  { heading: 'Detection', items: ['KQL', 'Sigma', 'Microsoft Sentinel', 'Splunk ES', 'MITRE ATT&CK'] },
  { heading: 'Investigation', items: ['Defender XDR', 'CrowdStrike Falcon', 'Cortex XDR', 'SentinelOne', 'Sumo Logic'] },
  { heading: 'Engineering', items: ['Python', 'FastAPI', 'Docker', 'GitHub Actions', 'ELK Stack'] },
] as const;
