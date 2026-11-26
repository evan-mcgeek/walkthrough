import fs from 'node:fs';
import path from 'node:path';
import { afterEach, expect, test } from 'vitest';
import { git, makeRepo, postTo, type Repo, until, viewAt } from './helpers';

let repo: Repo;
afterEach(async () => {
  repo.run('stop');
  await repo.settled();
});

const STEPS = [
  { title: 'Login', explanation: 'Adds login.', files: ['login.ts'] },
  { title: 'App', explanation: 'Bumps the app.', files: ['app.ts'] },
];

function commit(files: Record<string, string>) {
  for (const [name, text] of Object.entries(files)) fs.writeFileSync(path.join(repo.dir, name), text);
  git(repo.dir, 'add', '-A');
  git(repo.dir, 'commit', '-m', 'More');
  return git(repo.dir, 'rev-parse', 'HEAD');
}

function ready(...source: string[]) {
  for (const { status, stderr } of [repo.record(STEPS, 'steps', ...source), repo.run('ready', ...source)]) if (status !== 0) throw new Error(stderr);
}

test('since is null until a review at an earlier head, then holds the commits and only the files changed since', async () => {
  repo = makeRepo();
  repo.run('start');
  ready();
  const page = repo.url();
  expect((await viewAt(page)).since).toBeNull();
  await postTo(page, '/comment', { file: 'login.ts', lines: [1, 1], text: 'Check this.' });
  expect((await postTo(page, '/submit', { summary: '' })).status).toBe(200);
  expect((await viewAt(page)).since).toBeNull();

  commit({ 'app.ts': 'export const app = 3;\n' });
  commit({ 'app.ts': 'export const app = 4;\n', 'notes.txt': 'later\n' });
  fs.rmSync(path.join(repo.dir, 'notes.txt'));
  git(repo.dir, 'commit', '-am', 'Drop the notes');
  repo.run('start');
  expect((await viewAt(page)).since).toBeNull();
  ready();

  const { since } = await viewAt(page);
  expect(since?.head).toBe(repo.head);
  expect(since?.commits).toBe(3);
  expect(Object.keys(since?.files ?? {})).toEqual(['app.ts']);
  expect(since?.files['app.ts']).toContain('-export const app = 2;\n+export const app = 4;');
});

test('behind is set once the branch moves past the head shown, within one poll of the version', async () => {
  repo = makeRepo();
  repo.run('start');
  ready();
  const page = repo.url();
  const first = await fetch(`${page}data/walkthrough.json`);
  const tag = first.headers.get('etag') ?? '';
  expect(((await first.json()) as { behind: boolean }).behind).toBe(false);

  commit({ 'app.ts': 'export const app = 3;\n' });
  const again = await fetch(`${page}data/walkthrough.json`, { headers: { 'if-none-match': tag } });
  expect(again.status).toBe(200);
  expect(((await again.json()) as { behind: boolean }).behind).toBe(true);
});

test('a range is never behind, even when the branch it was taken from moves', async () => {
  repo = makeRepo();
  const range = ['--base', 'origin/main', '--head', 'feature/login', '--label', 'Login'];
  repo.run('start', ...range);
  ready(...range);
  const page = repo.url();
  commit({ 'app.ts': 'export const app = 3;\n' });
  await until('the view answers', async () => (await fetch(`${page}data/walkthrough.json`)).ok);
  expect((await viewAt(page)).behind).toBe(false);
});
