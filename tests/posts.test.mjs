import assert from 'node:assert/strict';
import test from 'node:test';
import { parsePostFile } from '../lib/posts.ts';

const valid = `---
title: Detection Notes
description: A useful description.
date: 2026-07-19
---
Body
`;

test('post schema supplies safe defaults', () => {
  const post = parsePostFile('detection-notes.md', valid);
  assert.equal(post.slug, 'detection-notes');
  assert.deepEqual(post.tags, []);
  assert.equal(post.draft, false);
  assert.equal(post.date.toISOString().slice(0, 10), '2026-07-19');
});

for (const [name, raw, expected] of [
  ['missing title', valid.replace('title: Detection Notes', 'title:'), 'title'],
  ['missing description', valid.replace('description: A useful description.', 'description:'), 'description'],
  ['bad date', valid.replace('2026-07-19', 'not-a-date'), 'date'],
  ['bad tags', valid.replace('---\nBody', 'tags: security\n---\nBody'), 'tags'],
  ['bad draft', valid.replace('---\nBody', 'draft: yes please\n---\nBody'), 'draft'],
]) {
  test(`post schema rejects ${name} with the filename`, () => {
    assert.throws(() => parsePostFile('detection-notes.md', raw), (error) => {
      assert.match(error.message, /detection-notes\.md/);
      assert.match(error.message, new RegExp(expected));
      return true;
    });
  });
}

test('post schema requires lowercase kebab-case filenames', () => {
  assert.throws(() => parsePostFile('Detection Notes.md', valid), /lowercase kebab-case/);
});
