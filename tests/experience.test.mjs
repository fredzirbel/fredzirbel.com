import assert from 'node:assert/strict';
import test from 'node:test';

import { roles } from '../lib/portfolio.ts';

test('experience content reflects the current resume', () => {
  assert.deepEqual(roles.map((role) => role.bullets.length), [4, 3, 2]);
  assert.match(roles[0].bullets.join(' '), /2,500\+ customer environments/);
  assert.match(roles[0].bullets.join(' '), /in-house AI platform/);
  assert.match(roles[1].bullets.join(' '), /500\+ KVP and regex suppression filters/);
});
