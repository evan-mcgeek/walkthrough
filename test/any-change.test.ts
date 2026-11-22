import fs from 'node:fs';
import path from 'node:path';
import { afterEach, describe, expect, test } from 'vitest';
import type { Walkthrough } from '../src/walkthrough';
import { git, makeRepo, type Repo } from './helpers';

const LOGIN = ['--base', 'origin/main', '--head', 'feature/login', '--label', 'Login'];

let repos: Repo[] = [];
afterEach(() => {
  for (const one of repos) {
    one.run('stop');
    one.run('stop', ...LOGIN);
  }
  repos = [];
});
const newRepo = (...args: Parameters<typeof makeRepo>) => {
  const made = makeRepo(...args);
  repos.push(made);
  return made;
};

const shownAt = async (page: string) => (await (await fetch(`${page}data/walkthrough.json`)).json()) as Walkthrough;

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
  });
});
