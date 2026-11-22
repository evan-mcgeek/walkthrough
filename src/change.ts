// The change under review, read from git objects only: nothing is checked out.
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

/** What a walkthrough is of: the current branch against its target, or a range the session names, with a label to name it by. */
export type Source =
  | { kind: 'branch'; branch: string; target?: string }
  | { kind: 'range'; base: string; head: string; label: string };

export type Change = {
  /** The revision the base is the merge-base with: a remote-tracking branch such as origin/main, a local branch with none, or a range's base as given. */
  target: string;
  base: string;
  head: string;
  /** Uncommitted and untracked paths when the head is checked out, which the change leaves out. */
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

/** The repo `cwd` is in, shared by all its worktrees: its folder name and a short hash of its git folder, so two repos of the same name differ. */
export function currentRepo(cwd: string): string {
  const common = fs.realpathSync(git(cwd, 'rev-parse', '--path-format=absolute', '--git-common-dir').trim());
  const hash = crypto.createHash('sha256').update(common).digest('hex').slice(0, 8);
  return `${path.basename(path.dirname(common))}-${hash}`;
}

/** The branch checked out in `cwd`. */
export function currentBranch(cwd: string): string {
  const branch = git(cwd, 'branch', '--show-current').trim();
  if (!branch) throw new Error('not on a branch; check out the branch to walk through, or pass --base and --head');
  return branch;
}

/** The commit `rev` names, or null when it names none. */
function commitOf(cwd: string, rev: string): string | null {
  try {
    return git(cwd, 'rev-parse', '--verify', '--quiet', `${rev}^{commit}`).trim();
  } catch {
    return null;
  }
}

/** The change from the merge-base of the target and the head to the head; a branch's target is `origin/<target>`, or the local branch without one, and the remote's default branch unless given. */
export function changeOf(cwd: string, source: Source): Change {
  const range = source.kind === 'range';
  const target = range ? source.base : source.target ? targetBranch(cwd, source.target) : defaultTarget(cwd);
  if (!commitOf(cwd, target))
    throw new Error(range ? `there is no commit ${target}` : `there is no ${target}; pass --target <branch>`);
  const head = commitOf(cwd, range ? source.head : 'HEAD');
  if (!head) throw new Error(range ? `there is no commit ${source.head}` : `${source.branch} has no commit yet`);
  let base: string;
  try {
    base = git(cwd, 'merge-base', target, head).trim();
  } catch {
    throw new Error(`${target} and ${range ? source.head : source.branch} share no history`);
  }
  // No steps means the session is still preparing them, so a change without files would never be ready.
  if (changedFiles(cwd, base, head).length === 0)
    throw new Error(`nothing changed from ${target} to ${range ? source.head : source.branch}`);
  return {
    target,
    base,
    head,
    uncommitted:
      commitOf(cwd, 'HEAD') === head ? git(cwd, 'status', '--porcelain').split('\n').filter(Boolean).length : 0,
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

/** The file's content at `rev`, or null when it does not exist there. */
export function fileAt(cwd: string, rev: string, file: string): Buffer | null {
  const result = spawnSync('git', ['cat-file', 'blob', `${rev}:${file}`], { cwd, maxBuffer: 256 * 1024 * 1024 });
  return result.status === 0 ? result.stdout : null;
}

const targetBranch = (cwd: string, name: string) =>
  !commitOf(cwd, `origin/${name}`) && commitOf(cwd, `refs/heads/${name}`) ? name : `origin/${name}`;

function defaultTarget(cwd: string): string {
  try {
    return git(cwd, 'symbolic-ref', '--short', 'refs/remotes/origin/HEAD').trim();
  } catch {
    return 'origin/main';
  }
}
