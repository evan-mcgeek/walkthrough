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
  entryPoints: [path.join(root, 'src', 'page', 'app.ts'), path.join(root, 'src', 'page', 'style.css')],
  bundle: true,
  format: 'esm',
  target: 'es2022',
  outdir: path.join(out, 'page'),
});
fs.copyFileSync(path.join(root, 'src', 'page', 'index.html'), path.join(out, 'page', 'index.html'));
