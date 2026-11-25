// Builds plugin/dist: the CLI (which also serves the page), the plugin's hook and the page, bundled with no runtime dependencies.
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
  entryPoints: [path.join(root, 'src', 'hook.ts')],
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node22',
  outfile: path.join(out, 'hook.mjs'),
});
await build({
  entryPoints: ['app.ts', 'list.ts', 'style.css'].map(file => path.join(root, 'src', 'page', file)),
  bundle: true,
  format: 'esm',
  target: 'es2022',
  // Fonts are inlined so the page and its one-file export need nothing but the stylesheet.
  loader: { '.woff2': 'dataurl' },
  outdir: path.join(out, 'page'),
});
for (const page of ['index.html', 'list.html']) fs.copyFileSync(path.join(root, 'src', 'page', page), path.join(out, 'page', page));
// The design's master brand files ship as they are, for the favicon and the app icon.
for (const asset of ['favicon.svg', 'favicon-reviewing.svg', 'app-icon-180.png']) fs.copyFileSync(path.join(root, 'docs', 'design', 'brand', asset), path.join(out, 'page', asset));
