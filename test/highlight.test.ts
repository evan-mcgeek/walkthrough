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

  // `const` in github-light and github-dark red.
  expect(keys(await tokens('login.ts'))).toContain('d73a49-f97583');
  // A Markdown heading is blue, which GCC Machine Description, Linguist's other `.md`, would not make it.
  expect(keys(await tokens('README.md'))).toContain('005cc5-79b8ff');
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
