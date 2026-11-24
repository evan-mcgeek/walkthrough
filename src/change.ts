// The change under review, read from git objects only: nothing is checked out.
import { execFile, spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';

export type Source =
  | { kind: 'branch'; branch: string; target?: string }
  | { kind: 'range'; base: string; head: string; label: string };

export type Change = {
  /** The revision the base is the merge-base with: a remote-tracking branch such as origin/main, a local branch with none, or a range's base branch, else its commit. */
  target: string;
  base: string;
  head: string;
  /** Uncommitted and untracked paths when the head is checked out, which the change leaves out. */
  uncommitted: number;
};

export function git(cwd: string, ...args: string[]): string {
  return gitWith(cwd, undefined, ...args);
}

const MAX_BUFFER = 256 * 1024 * 1024;

export function gitWith(cwd: string, input: string | undefined, ...args: string[]): string {
  const result = spawnSync('git', args, { cwd, encoding: 'utf8', input, maxBuffer: MAX_BUFFER });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(result.stderr.trim() || `git ${args.join(' ')} failed`);
  return result.stdout;
}

const execGit = promisify(execFile);

// Without blocking, so a lock held meanwhile is kept fresh.
async function gitAsync(cwd: string, ...args: string[]): Promise<string> {
  try {
    return (await execGit('git', args, { cwd, encoding: 'utf8', maxBuffer: MAX_BUFFER })).stdout;
  } catch (error) {
    throw new Error((error as { stderr?: string }).stderr?.trim() || `git ${args.join(' ')} failed`);
  }
}

// Shared by all its worktrees; the hash of its git folder keeps two repos of the same name apart.
export const commonDir = (cwd: string) =>
  fs.realpathSync(git(cwd, 'rev-parse', '--path-format=absolute', '--git-common-dir').trim());

export function currentRepo(cwd: string): string {
  const common = commonDir(cwd);
  const hash = crypto.createHash('sha256').update(common).digest('hex').slice(0, 8);
  return `${path.basename(path.dirname(common))}-${hash}`;
}

export function currentBranch(cwd: string): string {
  const branch = git(cwd, 'branch', '--show-current').trim();
  if (!branch) throw new Error('not on a branch; check out the branch to walk through, or pass --base and --head');
  return branch;
}

function commitOf(cwd: string, rev: string): string | null {
  try {
    return git(cwd, 'rev-parse', '--verify', '--quiet', `${rev}^{commit}`).trim();
  } catch {
    return null;
  }
}

// A revision such as HEAD~1 or FETCH_HEAD means another commit later, so prune could not tell from it when a range is over.
function branchOf(cwd: string, rev: string): string | null {
  const name = git(cwd, 'rev-parse', '--symbolic-full-name', rev).trim();
  return /^refs\/(heads|remotes)\//.test(name) ? name.replace(/^refs\/(heads|remotes)\//, '') : null;
}

export async function changeOf(cwd: string, source: Source): Promise<Change> {
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
    const shallow = git(cwd, 'rev-parse', '--is-shallow-repository').trim() === 'true';
    throw new Error(
      `${target} and ${range ? source.head : source.branch} share no history${shallow ? ' this clone has; it is shallow, so run git fetch --unshallow first' : ''}`,
    );
  }
  // No steps means the session is still preparing them, so a change without files would never be ready.
  if ((await changedFiles(cwd, base, head)).length === 0)
    throw new Error(`nothing changed from ${target} to ${range ? source.head : source.branch}`);
  return {
    target: range ? (branchOf(cwd, target) ?? commitOf(cwd, target) ?? target) : target,
    base,
    head,
    uncommitted:
      commitOf(cwd, 'HEAD') === head ? git(cwd, 'status', '--porcelain').split('\n').filter(Boolean).length : 0,
  };
}

/** `from` is the base path of a renamed file. */
export type ChangedFile = { path: string; from?: string };

export async function changedFiles(cwd: string, base: string, head: string): Promise<ChangedFile[]> {
  const fields = (await gitAsync(cwd, 'diff', '--name-status', '-z', '-M', '--no-ext-diff', base, head)).split('\0');
  const files: ChangedFile[] = [];
  for (let at = 0; at < fields.length - 1; ) {
    const status = fields[at++] ?? '';
    const first = fields[at++] ?? '';
    if (status.startsWith('R')) files.push({ path: fields[at++] ?? '', from: first });
    else files.push({ path: first });
  }
  return files;
}

// An order file line is a wildmatch pattern, so each path is escaped to match only itself.
const orderOf = (files: ChangedFile[]) => files.map(file => file.path.replace(/[\\*?[\]#!]/g, '\\$&')).join('\n');

/** The diff of just these files, in their order; a renamed file needs its base path too for the rename to show. */
export async function diffOf(cwd: string, base: string, head: string, files: ChangedFile[]): Promise<string> {
  if (files.length === 0) return '';
  // A file, not /dev/stdin: on Linux a child's stdin is a socket, which git cannot open by path.
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'walkthrough-order-'));
  const order = path.join(dir, 'order');
  fs.writeFileSync(order, orderOf(files), { mode: 0o600 });
  try {
    return await gitAsync(
      cwd,
      'diff',
      '--no-color',
      '--no-ext-diff',
      '-M',
      `-O${order}`,
      base,
      head,
      '--',
      // Paths are from the repo top and name only themselves, wherever the command runs.
      ...files.flatMap(file => (file.from ? [file.from, file.path] : [file.path])).map(one => `:(top,literal)${one}`),
    );
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

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
