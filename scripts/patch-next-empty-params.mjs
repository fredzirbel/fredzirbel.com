import fs from 'node:fs';
import path from 'node:path';

// Next 16.2.10's static path builder distinguishes a missing
// generateStaticParams export (undefined) from a valid empty result ([]), but
// the output:export guard later collapses both states by checking length > 0.
// Preserve that distinction until the upstream guard is fixed.
const files = [
  'node_modules/next/dist/build/index.js',
  'node_modules/next/dist/esm/build/index.js',
];
const before = 'const hasGenerateStaticParams = workerResult.prerenderedRoutes && workerResult.prerenderedRoutes.length > 0;';
const after = 'const hasGenerateStaticParams = Array.isArray(workerResult.prerenderedRoutes);';

for (const relative of files) {
  const file = path.join(process.cwd(), relative);
  const source = fs.readFileSync(file, 'utf8');
  if (source.includes(after)) continue;
  if (!source.includes(before)) {
    throw new Error(`Next empty-params compatibility patch no longer matches ${relative}; review before building.`);
  }
  fs.writeFileSync(file, source.replace(before, after));
  console.log(`Patched ${relative} for empty generateStaticParams output.`);
}
