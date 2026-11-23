import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { afterEach, describe, expect, test } from 'vitest';
import { git, makeRepo, type Repo } from './helpers';

const LOGIN = ['--base', 'origin/main', '--head', 'feature/login', '--label', 'Login'];

let repo: Repo;
afterEach(() => {
  repo.run('stop');
  repo.run('stop', ...LOGIN);
});

/** The repo's folder of saved walkthroughs: its name and a short hash of where it is. */
const repoState = () =>
  path.join(repo.state, fs.readdirSync(repo.state).find(name => /^shop-[0-9a-f]{8}$/.test(name)) ?? '');
const saved = (branch: string) => fs.existsSync(path.join(repoState(), `branch-${branch.replaceAll('/', '~')}`));

/** A walkthrough saved for `feature/login` and one for `feature/cart`, both pages stopped, left on `feature/cart`. */
function twoWalkthroughs() {
  repo = makeRepo();
  repo.run('start');
  repo.run('stop');
  git(repo.dir, 'checkout', '-b', 'feature/cart', 'main');
  fs.writeFileSync(path.join(repo.dir, 'cart.ts'), 'export const cart = [];\n');
  git(repo.dir, 'add', '-A');
  git(repo.dir, 'commit', '-m', 'Add cart');
  repo.run('start');
  repo.run('stop');
}

/** Merges `feature/login` into origin's main, where its walkthrough's target is. */
function mergeLogin() {
  const branch = git(repo.dir, 'branch', '--show-current');
  git(repo.dir, 'checkout', 'main');
  git(repo.dir, 'merge', '--no-ff', '-m', 'Merge login', 'feature/login');
  git(repo.dir, 'push', 'origin', 'main');
  git(repo.dir, 'checkout', branch);
}

describe('walkthrough prune', () => {
  test('removes the walkthrough whose head is already merged into its target and keeps the other', () => {
    twoWalkthroughs();
    mergeLogin();

    const pruned = repo.run('prune');

    expect(pruned.stderr).toBe('');
    expect(pruned.status).toBe(0);
    expect(pruned.stdout).toContain('Removed the walkthrough of feature/login: its head is merged into origin/main.');
    expect(saved('feature/login')).toBe(false);
    expect(saved('feature/cart')).toBe(true);
  });

  test('removes the walkthrough whose branch is gone', () => {
    twoWalkthroughs();
    git(repo.dir, 'branch', '-D', 'feature/login');

    const pruned = repo.run('prune');

    expect(pruned.stdout).toContain('Removed the walkthrough of feature/login: its branch is gone.');
    expect(saved('feature/login')).toBe(false);
    expect(saved('feature/cart')).toBe(true);
  });

  test('removes the walkthrough whose branch is gone on a git older than show-ref --exists', () => {
    twoWalkthroughs();
    git(repo.dir, 'branch', '-D', 'feature/login');
    const real = spawnSync('which', ['git'], { encoding: 'utf8' }).stdout.trim();
    fs.writeFileSync(
      path.join(path.dirname(repo.dir), 'bin', 'git'),
      `#!/bin/sh\n[ "$1" = show-ref ] && [ "$2" = --exists ] && exit 129\nexec "${real}" "$@"\n`,
      { mode: 0o755 },
    );

    const pruned = repo.run('prune');

    expect(pruned.stdout).toContain('Removed the walkthrough of feature/login: its branch is gone.');
    expect(saved('feature/cart')).toBe(true);
  });

  test('keeps every walkthrough whose branch exists and is not merged', () => {
    twoWalkthroughs();

    const pruned = repo.run('prune');

    expect(pruned.status).toBe(0);
    expect(pruned.stdout).toContain('No walkthrough to remove.');
    expect(saved('feature/login')).toBe(true);
    expect(saved('feature/cart')).toBe(true);
  });

  test('keeps the walkthroughs of another repo with the same folder name', () => {
    twoWalkthroughs();
    mergeLogin();
    const other = path.join(fs.mkdtempSync(path.join(path.dirname(repo.dir), 'other-')), 'shop');
    fs.mkdirSync(other);
    git(other, 'init', '-b', 'main');
    git(other, 'commit', '--allow-empty', '-m', 'Start another shop');

    const pruned = repo.runIn(other, 'prune');

    expect(pruned.stdout).toContain('No walkthrough to remove.');
    expect(saved('feature/login')).toBe(true);
    expect(saved('feature/cart')).toBe(true);
  });

  test('ends the page of a walkthrough it removes', async () => {
    repo = makeRepo();
    repo.run('start');
    const url = repo.url();
    mergeLogin();

    repo.run('prune');

    await expect(fetch(url)).rejects.toThrow();
    expect(saved('feature/login')).toBe(false);
  });

  test('runs on start at most once a day', () => {
    twoWalkthroughs();
    mergeLogin();

    const again = repo.run('start');

    expect(again.stdout).not.toContain('Removed');
    expect(saved('feature/login')).toBe(true);

    const dayAgo = new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString();
    fs.writeFileSync(path.join(repoState(), 'last-prune.json'), JSON.stringify({ at: dayAgo }));
    const nextDay = repo.run('start');

    expect(nextDay.stdout).toContain('Removed the walkthrough of feature/login: its head is merged into origin/main.');
    expect(saved('feature/login')).toBe(false);
    expect(saved('feature/cart')).toBe(true);
  });

  test('removes the walkthrough named by its id even when it is not over, and ends its page', async () => {
    repo = makeRepo();
    repo.run('start');
    const url = repo.url();

    const pruned = repo.run('prune', 'feature/login');

    expect(pruned.stderr).toBe('');
    expect(pruned.stdout).toContain('Removed the walkthrough of feature/login: asked to.');
    expect(saved('feature/login')).toBe(false);
    await expect(fetch(url)).rejects.toThrow();
  });

  test('removes the walkthrough of a range whose head is merged into the base it was given', () => {
    repo = makeRepo();
    repo.run('start', ...LOGIN);
    repo.run('stop', ...LOGIN);
    mergeLogin();

    const pruned = repo.run('prune');

    expect(pruned.stderr).toBe('');
    expect(pruned.stdout).toContain('Removed the walkthrough of Login: its head is merged into origin/main.');
    expect(fs.existsSync(path.join(repoState(), 'range-Login'))).toBe(false);
  });

  test('keeps the walkthrough of a range whose base names no branch when that revision moves on', () => {
    repo = makeRepo();
    const LAST = ['--base', 'HEAD~1', '--head', 'HEAD', '--label', 'Last'];
    expect(repo.run('start', ...LAST).stdout).toContain(`against ${repo.base.slice(0, 7)}:`);
    repo.run('stop', ...LAST);
    for (const name of ['one', 'two']) {
      fs.writeFileSync(path.join(repo.dir, `${name}.ts`), `export const ${name} = 1;\n`);
      git(repo.dir, 'add', '-A');
      git(repo.dir, 'commit', '-m', name);
    }

    const pruned = repo.run('prune');

    expect(pruned.stdout).toContain('No walkthrough to remove.');
    expect(fs.existsSync(path.join(repoState(), 'range-Last'))).toBe(true);
  });

  test('removes the walkthrough of a range named by the options it was started with, and ends its page', async () => {
    repo = makeRepo();
    repo.run('start', ...LOGIN);
    const url = repo.url();

    const pruned = repo.run('prune', ...LOGIN);

    expect(pruned.stderr).toBe('');
    expect(pruned.stdout).toContain('Removed the walkthrough of Login: asked to.');
    await expect(fetch(url)).rejects.toThrow();
    expect(repo.run('prune', 'feature/login', ...LOGIN).stderr).toContain('name a branch or a range, not both');
  });

  test('removes the walkthrough named by its id on the list page, and ends its page', async () => {
    repo = makeRepo();
    repo.run('start', ...LOGIN);
    const url = repo.url();

    const pruned = repo.run('prune', 'range-Login');

    expect(pruned.stderr).toBe('');
    expect(pruned.stdout).toContain('Removed the walkthrough of Login: asked to.');
    expect(fs.existsSync(path.join(repoState(), 'range-Login'))).toBe(false);
    await expect(fetch(url)).rejects.toThrow();
  });

  test('refuses an id that names no walkthrough', () => {
    repo = makeRepo();
    repo.run('start');
    repo.run('stop');

    for (const id of ['feature/nothing', 'range-Nothing', '..', '.']) {
      const pruned = repo.run('prune', id);
      expect(pruned.status, id).toBe(1);
      expect(pruned.stderr, id).toContain(`there is no walkthrough of ${id}`);
    }
    expect(saved('feature/login')).toBe(true);
  });

  test('says so when the repo has no saved walkthrough', () => {
    repo = makeRepo();

    const pruned = repo.run('prune');

    expect(pruned.stderr).toBe('');
    expect(pruned.stdout).toContain('No walkthrough to remove.');
  });
});
