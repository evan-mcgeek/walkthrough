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
  outfile: path.join(out, 'walkthrough.mjs'),
});
await build({
  entryPoints: [path.join(root, 'src', 'page', 'app.ts')],
  bundle: true,
  format: 'esm',
  target: 'es2022',
  outfile: path.join(out, 'page', 'app.js'),
});
for (const file of ['index.html', 'style.css'])
  fs.copyFileSync(path.join(root, 'src', 'page', file), path.join(out, 'page', file));
