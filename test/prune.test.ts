import fs from 'node:fs';
import path from 'node:path';
import { afterEach, describe, expect, test } from 'vitest';
import { git, makeRepo, type Repo } from './helpers';

let repo: Repo;
afterEach(() => {
  repo.run('stop');
});

const saved = (branch: string) => fs.existsSync(path.join(repo.state, 'shop', `branch-${branch.replaceAll('/', '~')}`));

/** The fake `gh` answers `pr list --head <branch>` with a pull request in each given state. */
const pullRequests = (states: Record<string, string[]>) => {
  const cases = Object.entries(states).map(
    ([branch, list]) => `  *"--head ${branch} "*) echo '${JSON.stringify(list.map(state => ({ state })))}' ;;`,
  );
  repo.gh(`case "$*" in\n${cases.join('\n')}\n  *) echo '[]' ;;\nesac`);
};

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

describe('walkthrough prune', () => {
  test('removes the walkthrough whose pull request is merged and keeps the one whose pull request is open', () => {
    twoWalkthroughs();
    pullRequests({ 'feature/login': ['MERGED'], 'feature/cart': ['OPEN'] });

    const pruned = repo.run('prune');

    expect(pruned.stderr).toBe('');
    expect(pruned.status).toBe(0);
    expect(pruned.stdout).toContain('Removed the walkthrough of feature/login: its pull request is merged.');
    expect(saved('feature/login')).toBe(false);
    expect(saved('feature/cart')).toBe(true);
  });

  test('removes the walkthrough whose pull request is closed, unless the branch has a newer open one', () => {
    twoWalkthroughs();
    pullRequests({ 'feature/login': ['CLOSED'], 'feature/cart': ['OPEN', 'CLOSED'] });

    const pruned = repo.run('prune');

    expect(pruned.stdout).toContain('Removed the walkthrough of feature/login: its pull request is closed.');
    expect(saved('feature/login')).toBe(false);
    expect(saved('feature/cart')).toBe(true);
  });

  test('removes the walkthrough whose branch is gone, even when GitHub cannot be asked', () => {
    twoWalkthroughs();
    git(repo.dir, 'branch', '-D', 'feature/login');
    repo.gh('exit 1');

    const pruned = repo.run('prune');

    expect(pruned.stdout).toContain('Removed the walkthrough of feature/login: its branch is gone.');
    expect(saved('feature/login')).toBe(false);
    expect(saved('feature/cart')).toBe(true);
  });

  test('keeps every walkthrough when GitHub cannot be asked or has no pull request for the branch', () => {
    twoWalkthroughs();
    repo.gh(`case "$*" in\n  *"--head feature/login "*) echo '[]' ;;\n  *) echo 'HTTP 502' >&2; exit 1 ;;\nesac`);

    const pruned = repo.run('prune');

    expect(pruned.status).toBe(0);
    expect(pruned.stdout).toContain('No walkthrough to remove.');
    expect(saved('feature/login')).toBe(true);
    expect(saved('feature/cart')).toBe(true);
    expect(repo.ghCalls()).toContain('pr list --head feature/cart --state all --json state');
  });

  test('keeps the walkthroughs of another repo with the same folder name', () => {
    twoWalkthroughs();
    pullRequests({ 'feature/login': ['MERGED'] });
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
    pullRequests({ 'feature/login': ['MERGED'] });

    repo.run('prune');

    await expect(fetch(url)).rejects.toThrow();
    expect(saved('feature/login')).toBe(false);
  });

  test('runs on start at most once a day', () => {
    twoWalkthroughs();
    pullRequests({ 'feature/login': ['MERGED'] });
    const asked = repo.ghCalls().length;

    const again = repo.run('start');

    expect(again.stdout).not.toContain('Removed');
    expect(repo.ghCalls()).toHaveLength(asked);
    expect(saved('feature/login')).toBe(true);

    const dayAgo = new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString();
    fs.writeFileSync(path.join(repo.state, 'shop', 'last-prune.json'), JSON.stringify({ at: dayAgo }));
    const nextDay = repo.run('start');

    expect(nextDay.stdout).toContain('Removed the walkthrough of feature/login: its pull request is merged.');
    expect(saved('feature/login')).toBe(false);
    expect(saved('feature/cart')).toBe(true);
  });

  test('says so when the repo has no saved walkthrough', () => {
    repo = makeRepo();

    const pruned = repo.run('prune');

    expect(pruned.stderr).toBe('');
    expect(pruned.stdout).toContain('No walkthrough to remove.');
  });
});
