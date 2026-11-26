// Builds plugin/dist: the CLI (which also serves the page), the plugin's hook and the page, bundled with no runtime dependencies.
import { build } from 'esbuild';
import crypto from 'node:crypto';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import * as linguist from 'linguist-languages';
import { grammars, injections } from 'tm-grammars';

const root = path.resolve(import.meta.dirname, '..');
const out = path.join(root, 'plugin', 'dist');

/**
 * Which grammar each file name and language name takes, from Linguist joined to tm-grammars, and each grammar's sha256 and embedded grammars,
 * with those Shiki embeds only for code the text names, such as a fenced block's language.
 */
async function grammarData() {
  const require = createRequire(import.meta.url);
  const folder = path.dirname(require.resolve('tm-grammars/grammars/json.json'));
  const byName = new Map();
  for (const grammar of grammars)
    for (const name of [grammar.name, grammar.displayName, ...(grammar.aliases ?? [])]) if (!byName.has(name.toLowerCase())) byName.set(name.toLowerCase(), grammar.name);
  const byScope = new Map(grammars.map(grammar => [grammar.scopeName, grammar.name]));
  const extensions = {};
  const filenames = {};
  const names = Object.fromEntries(byName);
  // A grammar found by the language's own name beats one it borrows by scope, so `.md` is Markdown and not GCC Machine Description.
  const claims = new Map();
  for (const language of Object.values(linguist)) {
    const named = [language.name, ...(language.aliases ?? [])].map(name => byName.get(name.toLowerCase())).find(Boolean);
    const grammar = named ?? byScope.get(language.tmScope);
    if (!grammar) continue;
    for (const name of [language.name, ...(language.aliases ?? [])]) names[name.toLowerCase()] ??= grammar;
    for (const name of language.filenames ?? []) filenames[name] ??= grammar;
    (language.extensions ?? []).forEach((extension, at) => {
      const rank = (at === 0 ? 2 : 0) + (named ? 1 : 0);
      const key = extension.toLowerCase();
      if ((claims.get(key) ?? -1) >= rank) return;
      claims.set(key, rank);
      extensions[key] = grammar;
    });
  }
  const files = {};
  for (const grammar of [...grammars, ...injections]) {
    const shiki = grammar.embedded && (await import(`@shikijs/langs/${grammar.name}`).catch(() => null))?.default.find(one => one.name === grammar.name);
    const lazy = shiki?.embeddedLangsLazy?.filter(name => grammar.embedded.includes(name));
    files[grammar.name] = {
      sha256: crypto.createHash('sha256').update(fs.readFileSync(path.join(folder, `${grammar.name}.json`))).digest('hex'),
      ...(grammar.embedded && { embedded: grammar.embedded }),
      ...(lazy?.length && { lazy }),
    };
  }
  const { version } = JSON.parse(fs.readFileSync(path.join(folder, '..', 'package.json'), 'utf8'));
  return { version, extensions, filenames, names, grammars: files };
}

fs.rmSync(out, { recursive: true, force: true });
const GRAMMARS = JSON.stringify(await grammarData());
// The CLI, and the worker it colours code in.
for (const [entry, file] of [['cli.ts', 'walkthrough.mjs'], ['highlight-worker.ts', 'highlight-worker.mjs']])
  await build({
    entryPoints: [path.join(root, 'src', entry)],
    bundle: true,
    platform: 'node',
    format: 'esm',
    target: 'node22',
    define: { GRAMMARS },
    // Bundled CommonJS dependencies require Node's own modules, which an ES module has no require for.
    banner: { js: "import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);" },
    outfile: path.join(out, file),
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
// The design's master brand files ship as they are: Walky's head for the tab, one per session state, and the app icon.
const brand = path.join(root, 'docs', 'design', 'brand');
for (const asset of ['favicon-reading.svg', 'favicon-awake.svg', 'favicon-done.svg', 'favicon-asleep.svg']) fs.copyFileSync(path.join(brand, 'mascot', asset), path.join(out, 'page', asset));
fs.copyFileSync(path.join(brand, 'app-icon-180.png'), path.join(out, 'page', 'app-icon-180.png'));
