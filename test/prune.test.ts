import fs from 'node:fs';
import path from 'node:path';
import { afterEach, describe, expect, test } from 'vitest';
import { git, makeRepo, type Repo } from './helpers';

let repo: Repo;
afterEach(() => {
  repo.run('stop');
});

const saved = (branch: string) => fs.existsSync(path.join(repo.state, 'shop', `branch-${branch.replaceAll('/', '~')}`));

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
    fs.writeFileSync(path.join(repo.state, 'shop', 'last-prune.json'), JSON.stringify({ at: dayAgo }));
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

  test('refuses an id that names no walkthrough', () => {
    repo = makeRepo();

    const pruned = repo.run('prune', 'feature/nothing');

    expect(pruned.status).toBe(1);
    expect(pruned.stderr).toContain('there is no walkthrough of feature/nothing');
  });

  test('says so when the repo has no saved walkthrough', () => {
    repo = makeRepo();

    const pruned = repo.run('prune');

    expect(pruned.stderr).toBe('');
    expect(pruned.stdout).toContain('No walkthrough to remove.');
  });
});
