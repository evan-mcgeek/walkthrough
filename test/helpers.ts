// A throwaway repo with an origin and a feature branch, and the walkthrough CLI run in it with fakes for `gh` and the browser.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const CLI = path.resolve(import.meta.dirname, '..', 'plugin', 'bin', 'walkthrough');

export function git(cwd: string, ...args: string[]): string {
  const result = spawnSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', '-c', 'commit.gpgsign=false', ...args], {
    cwd,
    encoding: 'utf8',
  });
  if (result.status !== 0) throw new Error(`git ${args.join(' ')}: ${result.stderr}`);
  return result.stdout.trim();
}

const commit = (cwd: string, message: string, files: Record<string, string>) => {
  for (const [name, text] of Object.entries(files)) fs.writeFileSync(path.join(cwd, name), text);
  git(cwd, 'add', '-A');
  git(cwd, 'commit', '-m', message);
  return git(cwd, 'rev-parse', 'HEAD');
};

export type Repo = ReturnType<typeof makeRepo>;

/**
 * `feature/login` branched from main at `base`, adding `login.ts` and changing `app.ts`; main moved on after it.
 * The working copy is left on the feature branch.
 */
export function makeRepo() {
  const root = fs.mkdtempSync(path.join(process.env['WALKTHROUGH_TEST_SANDBOX'] ?? '', 'repo-'));
  const dir = path.join(root, 'shop');
  const state = path.join(root, 'state');
  const bin = path.join(root, 'bin');
  const logs = path.join(root, 'logs');
  for (const folder of [dir, bin, logs]) fs.mkdirSync(folder);

  git(root, 'init', '--bare', '-b', 'main', 'origin.git');
  git(dir, 'init', '-b', 'main');
  git(dir, 'remote', 'add', 'origin', path.join(root, 'origin.git'));
  const base = commit(dir, 'Start the shop', { 'app.ts': 'export const app = 1;\n' });
  git(dir, 'push', '-u', 'origin', 'main');
  git(dir, 'remote', 'set-head', 'origin', 'main');
  git(dir, 'checkout', '-b', 'feature/login');
  const head = commit(dir, 'Add login', {
    'login.ts': 'export const login = () => true;\n',
    'app.ts': 'export const app = 2;\n',
  });
  git(dir, 'checkout', 'main');
  commit(dir, 'Main moves on', { 'other.ts': 'export const other = 1;\n' });
  git(dir, 'push', 'origin', 'main');
  git(dir, 'checkout', 'feature/login');

  const log = (name: string) => path.join(logs, name);
  for (const opener of ['open', 'xdg-open'])
    fs.writeFileSync(path.join(bin, opener), `#!/bin/sh\necho "$@" >> "${log('open')}"\n`, { mode: 0o755 });
  fs.writeFileSync(path.join(bin, 'gh'), `#!/bin/sh\necho "$@" >> "${log('gh')}"\ncat >> "${log('gh-stdin')}"\n`, {
    mode: 0o755,
  });
  const env = { ...process.env, PATH: `${bin}:${process.env['PATH'] ?? ''}`, WALKTHROUGH_STATE: state };
  const lines = (name: string) =>
    fs.existsSync(log(name)) ? fs.readFileSync(log(name), 'utf8').trim().split('\n') : [];

  return {
    dir,
    state,
    base,
    head,
    run: (...args: string[]) => spawnSync(CLI, args, { cwd: dir, encoding: 'utf8', env }),
    /** Runs the CLI in another folder with this repo's state and fakes. */
    runIn: (cwd: string, ...args: string[]) => spawnSync(CLI, args, { cwd, encoding: 'utf8', env }),
    /** Makes the fake `gh` run `script` after logging its arguments. */
    gh: (script: string) => {
      fs.writeFileSync(path.join(bin, 'gh'), `#!/bin/sh\necho "$@" >> "${log('gh')}"\n${script}\n`, { mode: 0o755 });
    },
    /** Every command line the CLI ran `gh` with. */
    ghCalls: () => lines('gh'),
    /** Every address the CLI asked the browser to open. */
    opened: () => lines('open'),
    /** The page address the last start opened. */
    url: () => {
      const last = lines('open').at(-1);
      if (!last) throw new Error('no page was opened');
      return last;
    },
  };
}
