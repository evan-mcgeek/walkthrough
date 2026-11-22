// The change under review, read from git objects only: nothing is checked out.
import { spawnSync } from 'node:child_process';
import path from 'node:path';

export type Change = {
  /** The repo's folder name, shared by all its worktrees. */
  repo: string;
  branch: string;
  /** The remote-tracking branch the base is taken from, such as origin/main. */
  target: string;
  base: string;
  head: string;
  diff: string;
  /** Uncommitted and untracked paths, which the change leaves out. */
  uncommitted: number;
};

function git(cwd: string, ...args: string[]): string {
  const result = spawnSync('git', args, { cwd, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(result.stderr.trim() || `git ${args.join(' ')} failed`);
  return result.stdout;
}

/** The folder name of the repo `cwd` is in, shared by all its worktrees. */
export const currentRepo = (cwd: string) =>
  path.basename(path.dirname(git(cwd, 'rev-parse', '--path-format=absolute', '--git-common-dir').trim()));

/** The repo and the branch checked out in `cwd`. */
export function currentBranch(cwd: string): Pick<Change, 'repo' | 'branch'> {
  const branch = git(cwd, 'branch', '--show-current').trim();
  if (!branch) throw new Error('not on a branch; check out the branch to walk through');
  return { repo: currentRepo(cwd), branch };
}

/** The current branch from the merge-base with `origin/<target>` (the remote's default branch unless given) to its head commit. */
export function currentChange(cwd: string, targetBranch?: string): Change {
  const { repo, branch } = currentBranch(cwd);
  const target = targetBranch ? `origin/${targetBranch}` : defaultTarget(cwd);
  try {
    git(cwd, 'rev-parse', '--verify', '--quiet', `${target}^{commit}`);
  } catch {
    throw new Error(`there is no ${target}; pass --target <branch>`);
  }
  const head = git(cwd, 'rev-parse', 'HEAD').trim();
  const base = git(cwd, 'merge-base', target, head).trim();
  return {
    repo,
    branch,
    target,
    base,
    head,
    diff: git(cwd, 'diff', '--no-color', '--no-ext-diff', base, head),
    uncommitted: git(cwd, 'status', '--porcelain').split('\n').filter(Boolean).length,
  };
}

function defaultTarget(cwd: string): string {
  try {
    return git(cwd, 'symbolic-ref', '--short', 'refs/remotes/origin/HEAD').trim();
  } catch {
    return 'origin/main';
  }
}
