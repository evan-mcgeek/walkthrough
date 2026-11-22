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
});
