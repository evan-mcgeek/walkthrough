import { afterEach, describe, expect, test } from 'vitest';
import { git, makeRepo, type Repo } from './helpers';

let repo: Repo;
afterEach(() => {
  repo.run('stop');
});

describe('walkthrough start', () => {
  test('pins the walkthrough to the merge-base and head without checking anything out', () => {
    repo = makeRepo();
    const status = git(repo.dir, 'status', '--porcelain');

    const started = repo.run('start');

    expect(started.stderr).toBe('');
    expect(started.status).toBe(0);
    expect(started.stdout).toContain(
      `Walkthrough of feature/login against origin/main: ${repo.base.slice(0, 7)}..${repo.head.slice(0, 7)}`,
    );
    expect(git(repo.dir, 'branch', '--show-current')).toBe('feature/login');
    expect(git(repo.dir, 'status', '--porcelain')).toBe(status);
    expect(git(repo.dir, 'worktree', 'list').split('\n')).toHaveLength(1);
  });
});
