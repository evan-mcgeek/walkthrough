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

export function git(cwd: string, ...args: string[]): string {
  return gitWith(cwd, undefined, ...args);
}

export function gitWith(cwd: string, input: string | undefined, ...args: string[]): string {
  const result = spawnSync('git', args, { cwd, encoding: 'utf8', input, maxBuffer: 256 * 1024 * 1024 });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(result.stderr.trim() || `git ${args.join(' ')} failed`);
  return result.stdout;
}

/** The repo and the branch checked out in `cwd`. */
export function currentBranch(cwd: string): Pick<Change, 'repo' | 'branch'> {
  const branch = git(cwd, 'branch', '--show-current').trim();
  if (!branch) throw new Error('not on a branch; check out the branch to walk through');
  const commonDir = git(cwd, 'rev-parse', '--path-format=absolute', '--git-common-dir').trim();
  return { repo: path.basename(path.dirname(commonDir)), branch };
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

/** A changed file at its head path; `from` is its base path when it was renamed. */
export type ChangedFile = { path: string; from?: string };

export function changedFiles(cwd: string, base: string, head: string): ChangedFile[] {
  const fields = git(cwd, 'diff', '--name-status', '-z', '-M', '--no-ext-diff', base, head).split('\0');
  const files: ChangedFile[] = [];
  for (let at = 0; at < fields.length - 1; ) {
    const status = fields[at++] ?? '';
    const first = fields[at++] ?? '';
    if (status.startsWith('R')) files.push({ path: fields[at++] ?? '', from: first });
    else files.push({ path: first });
  }
  return files;
}

/** The diff of just these files; a renamed file needs its base path too for the rename to show. */
export const diffOf = (cwd: string, base: string, head: string, files: ChangedFile[]) =>
  files.length === 0
    ? ''
    : git(
        cwd,
        'diff',
        '--no-color',
        '--no-ext-diff',
        '-M',
        base,
        head,
        '--',
        ...files.flatMap(file => (file.from ? [file.from, file.path] : [file.path])),
      );

/** The file's text at `rev`, or null when it does not exist there. */
export function fileAt(cwd: string, rev: string, file: string): string | null {
  try {
    return git(cwd, 'cat-file', 'blob', `${rev}:${file}`);
  } catch {
    return null;
  }
}

function defaultTarget(cwd: string): string {
  try {
    return git(cwd, 'symbolic-ref', '--short', 'refs/remotes/origin/HEAD').trim();
  } catch {
    return 'origin/main';
  }
}
