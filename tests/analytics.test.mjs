import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { ANALYTICS_HOSTS, UMAMI_COLLECT_ORIGIN, UMAMI_SCRIPT, UMAMI_WEBSITE_ID, trackClick } from '../lib/analytics.ts';

const headers = fs.readFileSync(new URL('../public/_headers', import.meta.url), 'utf8');
const csp = headers.match(/Content-Security-Policy: (.+)/)?.[1] ?? '';
const directive = (name) => csp.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${name} `)) ?? '';

test('CSP allows only the Umami script and collect origins', () => {
  assert.ok(directive('script-src').includes(new URL(UMAMI_SCRIPT).origin));
  assert.ok(directive('connect-src').includes(UMAMI_COLLECT_ORIGIN), 'tracker sends with fetch');
  assert.doesNotMatch(csp, /\*\./, 'no wildcard hosts');
});

test('Umami config is well formed and limited to production hosts', () => {
  assert.match(UMAMI_WEBSITE_ID, /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
  assert.deepEqual(ANALYTICS_HOSTS, ['fredzirbel.com', 'www.fredzirbel.com']);
});

test('trackClick emits Umami event attributes', () => {
  assert.deepEqual(trackClick('resume-hero', 'Resume'), { 'data-umami-event': 'resume-hero', 'data-umami-event-label': 'Resume' });
  assert.deepEqual(trackClick('x'), { 'data-umami-event': 'x' });
});
