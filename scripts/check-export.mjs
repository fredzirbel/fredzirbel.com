import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

const root = process.cwd();
const out = path.join(root, 'out');
const read = (relative) => fs.readFileSync(path.join(out, relative), 'utf8');
const home = read('index.html').replaceAll('<!-- -->', '');
const blog = read('blog/index.html').replaceAll('<!-- -->', '');
const sitemap = read('sitemap.xml');
const headers = read('_headers');

for (const text of ['16 min', '300+', '500+', 'Security Analyst', 'Available to interview', 'No sponsorship required', 'View case studies', 'View résumé', 'Contact me']) assert.ok(home.includes(text), `homepage is missing ${text}`);
assert.match(home, /data-cert-count="6"/);
assert.ok(home.includes('ISACA CISM') && home.includes('In Progress'));
assert.ok(home.includes('/fred-zirbel-resume.pdf'));
assert.doesNotMatch(home, /Coming soon|learning cybersecurity/i);
assert.doesNotMatch(blog, /Coming soon/i);
for (const slug of ['soc-box', 'sigil', 'homesoc']) {
  assert.ok(fs.existsSync(path.join(out, 'projects', slug, 'index.html')), `missing project route: ${slug}`);
  assert.ok(sitemap.includes(`https://fredzirbel.com/projects/${slug}/`), `project missing from sitemap: ${slug}`);
}
assert.ok(fs.existsSync(path.join(out, 'blog', 'reconstructing-a-synthetic-phishing-intrusion', 'index.html')));
assert.ok(fs.existsSync(path.join(out, 'fred-zirbel-resume.pdf')));
assert.match(headers, /Content-Security-Policy:/);
assert.match(headers, /Strict-Transport-Security: max-age=31536000/);
assert.ok(fs.existsSync(path.join(out, 'opengraph-image')));

const scripts = [...home.matchAll(/<script[^>]+src="([^"]+)"/g)].map((match) => match[1]).filter((source) => source.startsWith('/_next/static/'));
const bytes = [...new Set(scripts)].reduce((total, source) => total + gzipSync(fs.readFileSync(path.join(out, source.replace(/^\//, '').replaceAll('/', path.sep)))).byteLength, 0);
const budget = 325 * 1024;
assert.ok(bytes <= budget, `initial homepage JavaScript is ${(bytes / 1024).toFixed(1)} KiB gzip; budget is 325 KiB`);
console.log(`Export checks passed; initial homepage JavaScript: ${(bytes / 1024).toFixed(1)} KiB gzip.`);
