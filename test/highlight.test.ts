import fs from 'node:fs';
import path from 'node:path';
import { afterEach, expect, test } from 'vitest';
import type { Run } from '../src/colours';
import { makeRepo, type Repo } from './helpers';

let repo: Repo;
afterEach(async () => {
  repo.run('stop');
  await repo.settled();
});

const FILES = { 'README.md': '# Shop\n\nSells things.\n', 'bin/shop': 'echo shop\n' };
const cached = (name: string) => path.join(repo.state, 'grammars', '1.32.22', `${name}.json`);

const tokens = async (file: string) => {
  const answer = await fetch(`${repo.url()}tokens?rev=${repo.head}&path=${encodeURIComponent(file)}`);
  return (await answer.json()) as Run[][] | 'plain';
};
const keys = (lines: Run[][] | 'plain') => (lines === 'plain' ? [] : lines.flat().map(([, key]) => key).filter(Boolean));

test('a file takes the grammar its name maps to, downloaded once into the cache; a file with no extension stays plain', async () => {
  repo = makeRepo({ feature: FILES });
  repo.run('start');

  // `const` is a keyword.
  expect(keys(await tokens('login.ts'))).toContain('k');
  // A Markdown heading is a constant, which GCC Machine Description, Linguist's other `.md`, would not make it.
  expect(keys(await tokens('README.md'))).toContain('n');
  expect(await tokens('bin/shop')).toBe('plain');
  expect(fs.readFileSync(cached('typescript'))).toEqual(fs.readFileSync(path.join(process.env['WALKTHROUGH_GRAMMARS'] ?? '', 'typescript.json')));
});

test('a cached grammar that is not the one recorded at build is refused and dropped, and the file stays plain', async () => {
  repo = makeRepo();
  fs.mkdirSync(path.dirname(cached('typescript')), { recursive: true });
  fs.writeFileSync(cached('typescript'), JSON.stringify({ name: 'typescript', scopeName: 'source.ts', patterns: [] }));
  repo.run('start');

  expect(await tokens('login.ts')).toBe('plain');
  expect(fs.existsSync(cached('typescript'))).toBe(false);
});

test('WALKTHROUGH_GRAMMARS is where grammars come from; a grammar it lacks leaves the file plain', async () => {
  const empty = fs.mkdtempSync(path.join(process.env['WALKTHROUGH_TEST_SANDBOX'] ?? '', 'grammars-'));
  repo = makeRepo({ env: { WALKTHROUGH_GRAMMARS: empty } });
  repo.run('start');

  expect(await tokens('login.ts')).toBe('plain');
  expect(fs.existsSync(cached('typescript'))).toBe(false);
});

test('the server answers while a large file is being coloured', async () => {
  const large = Array.from({ length: 10_000 }, (_, at) => `export const value${String(at)} = compute(${String(at)}, 'text', /x+/g); // ${String(at)}`).join('\n');
  repo = makeRepo({ feature: { 'large.ts': `${large}\n` } });
  repo.run('start');
  // The grammar is loaded, so what follows is the colouring itself.
  expect(keys(await tokens('login.ts'))).toContain('k');

  let coloured = false;
  const colouring = tokens('large.ts').then(lines => {
    coloured = true;
    return lines;
  });
  const answer = await fetch(`${repo.url()}data/walkthrough.json`);
  expect(answer.ok).toBe(true);
  expect(coloured).toBe(false);
  expect(keys(await colouring)).toContain('k');
});
