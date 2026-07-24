import assert from 'node:assert/strict';
import test from 'node:test';
import { getProjects, parseProjectFile } from '../lib/projects.ts';

const valid = `---
title: Example
description: Example case study.
repository: https://github.com/fredzirbel/example
order: 1
tags: [Python]
---
${['Problem', 'Audience', 'Contribution', 'Architecture', 'Decisions', 'Security controls', 'Validation', 'Limitations', 'Lessons', 'Screenshots', 'Repository'].map((heading) => `## ${heading}\n\nContent.`).join('\n\n')}
`;

test('project schema validates the structured case-study contract', () => {
  const project = parseProjectFile('example.md', valid);
  assert.equal(project.slug, 'example');
  assert.equal(project.order, 1);
  assert.deepEqual(project.tags, ['Python']);
});

test('project schema rejects a missing required section', () => {
  assert.throws(() => parseProjectFile('example.md', valid.replace('## Limitations', '### Limitations')), /Limitations/);
});

test('three public project routes have stable unique ordering', () => {
  const projects = getProjects();
  assert.deepEqual(projects.map((project) => project.slug), ['soc-box', 'sigil', 'homesoc']);
  assert.equal(new Set(projects.map((project) => project.order)).size, 3);
});
