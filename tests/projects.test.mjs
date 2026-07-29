import assert from 'node:assert/strict';
import test from 'node:test';
import { capabilityGroups, projects as portfolioProjects } from '../lib/portfolio.ts';

test('project cards link directly to Fred Zirbel GitHub repositories', () => {
  assert.deepEqual(portfolioProjects.map((project) => project.slug), ['soc-box', 'sigil', 'homesoc']);
  for (const project of portfolioProjects) {
    assert.match(project.repository, /^https:\/\/github\.com\/fredzirbel\//);
  }
});

test('HomeSOC content reflects the current ELK architecture', () => {
  const card = portfolioProjects.find((project) => project.slug === 'homesoc');
  assert.ok(card);
  assert.ok(card.tags.includes('ELK Stack'));
  assert.match(card.description, /Elasticsearch/);
  assert.doesNotMatch(card.description, /OpenSearch/i);

  const engineering = capabilityGroups.find((group) => group.heading === 'Engineering');
  assert.ok(engineering);
  assert.ok(engineering.items.includes('ELK Stack'));
});
