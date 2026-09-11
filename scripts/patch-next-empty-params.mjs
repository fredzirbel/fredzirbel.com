import fs from 'node:fs';
import path from 'node:path';

// Next's static path builder distinguishes a missing generateStaticParams
// export (undefined) from a valid empty result ([]), but the output:export
// path rejects the empty result - which is exactly the state of this repo's
// blog before its first published post. Preserve the empty-is-valid behavior
// until the upstream guards are fixed. Each patch is idempotent (prebuild runs
// on every build) and throws if the target no longer matches, so a Next upgrade
// that reworks these guards surfaces here instead of failing the export.
const patches = [
  {
    label: 'empty generateStaticParams output guard',
    files: [
      'node_modules/next/dist/build/index.js',
      'node_modules/next/dist/esm/build/index.js',
    ],
    before: 'const hasGenerateStaticParams = workerResult.prerenderedRoutes && workerResult.prerenderedRoutes.length > 0;',
    after: 'const hasGenerateStaticParams = Array.isArray(workerResult.prerenderedRoutes);',
  },
  {
    label: 'empty static-export params error',
    files: [
      'node_modules/next/dist/build/static-paths/app.js',
      'node_modules/next/dist/esm/build/static-paths/app.js',
    ],
    before: 'if (isStaticExport && generatedParams.length === 0) {',
    after: 'if (false && isStaticExport && generatedParams.length === 0) {',
  },
];

for (const { label, files, before, after } of patches) {
  for (const relative of files) {
    const file = path.join(process.cwd(), relative);
    if (!fs.existsSync(file)) continue;
    const source = fs.readFileSync(file, 'utf8');
    if (source.includes(after)) continue;
    if (!source.includes(before)) {
      throw new Error(`Next empty-params compatibility patch (${label}) no longer matches ${relative}; review before building.`);
    }
    fs.writeFileSync(file, source.replace(before, after));
    console.log(`Patched ${relative} for ${label}.`);
  }
}
