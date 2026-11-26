import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { GOATCOUNTER_CODE, GOATCOUNTER_ENDPOINT, GOATCOUNTER_SCRIPT, trackClick } from '../lib/analytics.ts';

const headers = fs.readFileSync(new URL('../public/_headers', import.meta.url), 'utf8');
const csp = headers.match(/Content-Security-Policy: (.+)/)?.[1] ?? '';
const directive = (name) => csp.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${name} `)) ?? '';

test('CSP allows the GoatCounter script and only this site endpoint', () => {
  const host = `https://${GOATCOUNTER_CODE}.goatcounter.com`;
  assert.equal(GOATCOUNTER_ENDPOINT, `${host}/count`);
  assert.ok(directive('script-src').includes(new URL(GOATCOUNTER_SCRIPT).origin));
  assert.ok(directive('connect-src').includes(host), 'sendBeacon needs connect-src');
  assert.ok(directive('img-src').includes(host), 'image fallback needs img-src');
  assert.doesNotMatch(csp, /\*\.goatcounter\.com/, 'do not wildcard other GoatCounter sites');
});

test('trackClick emits GoatCounter event attributes', () => {
  assert.deepEqual(trackClick('resume-hero', 'Resume'), { 'data-goatcounter-click': 'resume-hero', 'data-goatcounter-title': 'Resume' });
  assert.deepEqual(trackClick('x'), { 'data-goatcounter-click': 'x' });
});
