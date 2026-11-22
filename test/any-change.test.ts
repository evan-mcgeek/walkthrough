import fs from 'node:fs';
import path from 'node:path';
import { afterEach, describe, expect, test } from 'vitest';
import type { SessionView } from '../src/session';
import type { Walkthrough } from '../src/walkthrough';
import { git, makeRepo, type Repo } from './helpers';

const LOGIN = ['--base', 'origin/main', '--head', 'feature/login', '--label', 'Login'];

let repos: Repo[] = [];
afterEach(async () => {
  for (const one of repos) {
    one.run('stop');
    one.run('stop', ...LOGIN);
    await one.settled();
  }
  repos = [];
});
const newRepo = (...args: Parameters<typeof makeRepo>) => {
  const made = makeRepo(...args);
  repos.push(made);
  return made;
};

const shownAt = async (page: string) => (await (await fetch(`${page}data/walkthrough.json`)).json()) as Walkthrough;
const sessionAt = async (page: string) => (await (await fetch(`${page}data/session.json`)).json()) as SessionView;
const post = (page: string, route: string, body: unknown) =>
  fetch(new URL(`${route}?token=${new URL(page).pathname.split('/')[2] ?? ''}`, page), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });

async function until(what: string, done: () => Promise<boolean>, ms = 5000) {
  for (const end = Date.now() + ms; Date.now() < end; await new Promise(resolve => setTimeout(resolve, 50)))
    if (await done()) return;
  throw new Error(`${what} did not happen within ${String(ms / 1000)}s`);
}

describe('walkthrough start of a range', () => {
  test('walks through the base and head it is given, from their merge-base, without checking anything out', async () => {
    const repo = newRepo();
    git(repo.dir, 'checkout', '--detach', 'main');
    fs.writeFileSync(path.join(repo.dir, 'draft.ts'), 'export const draft = 1;\n');
    const status = git(repo.dir, 'status', '--porcelain');

    const started = repo.run('start', ...LOGIN);

    expect(started.stderr).toBe('');
    expect(started.status).toBe(0);
    expect(started.stdout).toContain(
      `Walkthrough of Login against origin/main: ${repo.base.slice(0, 7)}..${repo.head.slice(0, 7)}`,
    );
    expect(started.stdout).not.toContain('uncommitted');
    expect(git(repo.dir, 'status', '--porcelain')).toBe(status);
    expect(git(repo.dir, 'rev-parse', 'HEAD')).toBe(git(repo.dir, 'rev-parse', 'main'));
    const shown = await shownAt(repo.url());
    expect(shown).toMatchObject({ kind: 'range', label: 'Login', base: repo.base, head: repo.head });
    expect(shown.steps[0]?.diff).toContain('+export const login');
    expect(shown.steps[0]?.diff).not.toContain('other');
  });

  test('without a label it is named by its range', () => {
    const repo = newRepo();

    const started = repo.run('start', '--base', repo.base, '--head', 'feature/login');
    repo.run('stop', '--base', repo.base, '--head', 'feature/login');

    expect(started.stdout).toContain(`Walkthrough of ${repo.base}..feature/login against ${repo.base}`);
  });

  test('refuses a range that is half given, mixed with a target, or names no commit', () => {
    const repo = newRepo();

    expect(repo.run('start', '--base', 'origin/main').stderr).toContain('--base and --head go together');
    expect(repo.run('start', '--label', 'Login').stderr).toContain('--base and --head go together');
    expect(repo.run('start', ...LOGIN, '--target', 'main').stderr).toContain('--target is for the current branch');
    const missing = repo.run('start', '--base', 'origin/main', '--head', 'nope');
    expect(missing.status).toBe(1);
    expect(missing.stderr).toContain('there is no commit nope');
    expect(repo.run('start', 'feature/login').stderr).toContain('Unexpected argument');
  });
});

describe('where a walkthrough is kept', () => {
  test('two repos with the same folder name keep separate walkthroughs', async () => {
    const first = newRepo();
    const second = newRepo({ env: { WALKTHROUGH_STATE: first.state } });
    first.run('start');
    const firstPage = first.url();
    expect((await post(firstPage, '/decide', { step: 'change', decision: 'approved' })).status).toBe(200);

    const started = second.run('start');

    expect(started.stdout).not.toContain('Resumed');
    expect((await shownAt(second.url())).steps[0]?.decision).toBeNull();
    expect(second.run('stop').stdout).toContain('Stopped the walkthrough page.');
    expect((await shownAt(firstPage)).steps[0]?.decision).toBe('approved');
  });

  test('every command finds the walkthrough of a range by the options start was given', async () => {
    const repo = newRepo();
    repo.run('start');
    const branchPage = repo.url();
    repo.run('start', ...LOGIN);
    const rangePage = repo.url();

    expect(repo.run('files', ...LOGIN).stdout.trim().split('\n').sort()).toEqual(['app.ts', 'login.ts']);
    expect(repo.record([{ title: 'Login', explanation: 'Login.', files: ['login.ts', 'app.ts'] }], ...LOGIN).status).toBe(0);
    expect((await shownAt(rangePage)).steps.map(step => step.title)).toEqual(['Login']);
    expect((await shownAt(branchPage)).steps.map(step => step.title)).toEqual(['The whole change']);

    expect(repo.run('say', ...LOGIN, 'Hello range').status).toBe(0);
    expect((await sessionAt(rangePage)).conversation.map(entry => entry.text)).toEqual(['Hello range']);
    expect((await sessionAt(branchPage)).conversation).toEqual([]);

    const listener = repo.background('listen', ...LOGIN);
    await until('the session listens', async () => (await sessionAt(rangePage)).state === 'listening');
    expect((await post(rangePage, '/ask', { step: '1', text: 'Why?' })).status).toBe(200);
    expect((await listener.ended).stdout).toContain('"text":"Why?"');

    expect(repo.run('stop', ...LOGIN).stdout).toContain('Stopped the walkthrough page.');
    await expect(fetch(rangePage)).rejects.toThrow();
    expect((await fetch(branchPage)).status).toBe(200);

    const unlabelled = repo.run('files', '--base', 'origin/main', '--head', 'feature/login');
    expect(unlabelled.status).toBe(1);
    expect(unlabelled.stderr).toContain('there is no walkthrough of origin/main..feature/login');
  });
});
