import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

const root = process.cwd();
const out = path.join(root, 'out');
const read = (relative) => fs.readFileSync(path.join(out, relative), 'utf8');
const rawHome = read('index.html');
const home = rawHome.replaceAll('<!-- -->', '');
const blog = read('blog/index.html').replaceAll('<!-- -->', '');
const sitemap = read('sitemap.xml');
const headers = read('_headers');

for (const text of ['16 min', '300+', '500+', 'Security Operations', 'Detection Engineering', 'Available to interview', 'No sponsorship required', 'View projects', 'View resume', 'Contact me']) assert.ok(home.includes(text), `homepage is missing ${text}`);
assert.ok(home.indexOf('View resume') < home.indexOf('View projects'), 'resume call to action should precede projects');
assert.ok(home.indexOf('id="experience"') < home.indexOf('id="work"'), 'experience should precede projects');
assert.ok(home.includes('href="https://www.criticalstart.com/"') && home.includes('Promoted from Security Analyst to Principal Security Analyst'), 'experience employer and promotion context are missing');
assert.match(home, /data-cert-count="6"/);
assert.ok(home.includes('ISACA CISM') && home.includes('In Progress'));
assert.ok(home.includes('/fred-zirbel-resume.pdf'));
for (const repository of ['https://github.com/fredzirbel/SOCBox', 'https://github.com/fredzirbel/SIGIL', 'https://github.com/fredzirbel/homesoc-platform']) assert.ok(home.includes(repository), `homepage is missing project repository: ${repository}`);
assert.doesNotMatch(home, /case stud|résumé/i);
assert.doesNotMatch(home, /Turn alerts into action|>VIEW</i);
assert.ok(home.includes('Engineering skills reflect active learning and hands-on project work, not claimed expert proficiency.'));
assert.ok(home.includes('>04</span>Credentials') && home.includes('>05</span>Contact'), 'visible section numbering should remain sequential without posts');
assert.equal([...home.matchAll(/>Download resume</g)].length, 0, 'contact should not contain a download resume action');
for (const contact of ['me@fredzirbel.com', 'https://github.com/fredzirbel', 'https://linkedin.com/in/fredzirbel']) assert.ok(home.includes(contact), `contact section is missing ${contact}`);
assert.doesNotMatch(home, /reconstructing a synthetic phishing intrusion/i);
assert.doesNotMatch(home, /Coming soon|learning cybersecurity/i);
assert.doesNotMatch(blog, /Coming soon/i);
assert.ok(!fs.existsSync(path.join(out, 'projects', 'index.html')), 'internal projects route should not be exported');
assert.doesNotMatch(sitemap, /\/projects\//);
assert.ok(!fs.existsSync(path.join(out, 'blog', 'reconstructing-a-synthetic-phishing-intrusion', 'index.html')), 'example blog post should not be exported');
const hasPosts = rawHome.includes('href="/blog/');
if (hasPosts) {
  assert.ok(home.includes('href="/blog/"'), 'published blog must be linked from the homepage');
  assert.ok(sitemap.includes('https://fredzirbel.com/blog/'), 'published blog index must be in sitemap');
} else {
  assert.ok(!home.includes('href="/blog/"'), 'empty blog must not be linked from the homepage');
  assert.ok(!sitemap.includes('/blog/'), 'empty blog index must be omitted from sitemap');
}
assert.ok(fs.existsSync(path.join(out, 'fred-zirbel-resume.pdf')));
assert.ok(fs.readFileSync(path.join(out, 'fred-zirbel-resume.pdf')).includes(Buffer.from('Fred Zirbel - Resume')), 'resume PDF title metadata is incorrect');
assert.ok(home.indexOf('ISACA CISM') < home.indexOf('CompTIA SecurityX'), 'in-progress certification should precede earned certifications');
assert.match(headers, /Content-Security-Policy:/);
assert.match(headers, /Strict-Transport-Security: max-age=31536000/);
assert.match(headers, /X-Robots-Tag: noindex/);
assert.ok(fs.existsSync(path.join(out, 'opengraph-image')));

const scripts = [...rawHome.matchAll(/<script[^>]+src="([^"]+)"/g)].map((match) => match[1]).filter((source) => source.startsWith('/_next/static/'));
const bytes = [...new Set(scripts)].reduce((total, source) => total + gzipSync(fs.readFileSync(path.join(out, source.replace(/^\//, '').replaceAll('/', path.sep)))).byteLength, 0);
const budget = 325 * 1024;
assert.ok(bytes <= budget, `initial homepage JavaScript is ${(bytes / 1024).toFixed(1)} KiB gzip; budget is 325 KiB`);
console.log(`Export checks passed; initial homepage JavaScript: ${(bytes / 1024).toFixed(1)} KiB gzip.`);
