import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

const root = process.cwd();
const out = path.join(root, 'out');
const read = (relative) => fs.readFileSync(path.join(out, relative), 'utf8');
const home = read('index.html');
const renderedHome = home.replaceAll('<!-- -->', '');
const renderedBlog = read('blog/index.html').replaceAll('<!-- -->', '');
const renderedNotFound = read('404.html').replaceAll('<!-- -->', '');
const sitemap = read('sitemap.xml');
const headers = read('_headers');

assert.match(home, /data-count="2500"[^>]*>2,500<\/span>/, 'static 2,500+ stat missing');
assert.match(home, /data-count="9"[^>]*>9<\/span>/, 'static 9 stat missing');
assert.match(home, /data-count="7"[^>]*>7<\/span>/, 'static 7 stat missing');
assert.match(renderedHome, /and I (?:document|write)/, 'about copy is missing whitespace before its publication state');
for (const text of ['Security Analyst', 'Dallas, TX', 'No sponsorship required now or in the future', 'Interviewing now', 'approximately six minutes per alert', 'View case studies', 'View résumé', 'Contact me']) {
  assert.ok(renderedHome.includes(text), `homepage is missing ${text}`);
}
assert.ok(fs.existsSync(path.join(out, 'fred-zirbel-resume.pdf')), 'résumé PDF was not exported');
for (const [page, output] of [['home', renderedHome], ['blog', renderedBlog], ['404', renderedNotFound]]) {
  assert.doesNotMatch(output, /[—–]/, `${page} output contains a long dash`);
}
const hasPosts = home.includes('href="/blog/');
if (hasPosts) {
  assert.ok(home.includes('href="/blog/"'), 'published blog must be linked from the homepage');
  assert.ok(sitemap.includes('https://fredzirbel.com/blog/'), 'published blog index must be in sitemap');
} else {
  assert.ok(!home.includes('href="/blog/"'), 'empty blog must not be linked from the homepage');
  assert.ok(!sitemap.includes('/blog/'), 'empty blog index must be omitted from sitemap');
}
assert.ok(!fs.existsSync(path.join(out, 'blog', 'coming-soon')), 'placeholder blog route was exported');
assert.match(headers, /Content-Security-Policy:/);
assert.match(headers, /Strict-Transport-Security: max-age=31536000/);
assert.match(headers, /X-Robots-Tag: noindex/);
assert.ok(fs.existsSync(path.join(out, 'opengraph-image')), 'Open Graph image was not generated');

const scripts = [...home.matchAll(/<script[^>]+src="([^"]+)"/g)]
  .map((match) => match[1])
  .filter((source) => source.startsWith('/_next/static/'));
const unique = [...new Set(scripts)];
const bytes = unique.reduce((total, source) => {
  const file = path.join(out, source.replace(/^\//, '').replaceAll('/', path.sep));
  return total + gzipSync(fs.readFileSync(file)).byteLength;
}, 0);
const budget = 325 * 1024;
assert.ok(bytes <= budget, `initial homepage JavaScript is ${(bytes / 1024).toFixed(1)} KiB gzip; budget is 325 KiB`);
console.log(`Export checks passed; initial homepage JavaScript: ${(bytes / 1024).toFixed(1)} KiB gzip.`);
