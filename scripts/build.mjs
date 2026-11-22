// Builds plugin/dist: the CLI (which also serves the page) and the page, bundled with no runtime dependencies.
import { build } from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const out = path.join(root, 'plugin', 'dist');

fs.rmSync(out, { recursive: true, force: true });
await build({
  entryPoints: [path.join(root, 'src', 'cli.ts')],
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node22',
  // Bundled CommonJS dependencies require Node's own modules, which an ES module has no require for.
  banner: { js: "import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);" },
  outfile: path.join(out, 'walkthrough.mjs'),
});
await build({
  entryPoints: ['app.ts', 'list.ts', 'style.css'].map(file => path.join(root, 'src', 'page', file)),
  bundle: true,
  format: 'esm',
  target: 'es2022',
  outdir: path.join(out, 'page'),
});
for (const page of ['index.html', 'list.html']) fs.copyFileSync(path.join(root, 'src', 'page', page), path.join(out, 'page', page));
