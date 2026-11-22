// A throwaway repo with an origin and a feature branch, and the walkthrough CLI run in it with a fake browser.
import { spawn, spawnSync } from 'node:child_process';
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

type Files = Record<string, string>;

/** The default change as one step, recorded as step 1. */
export const ONE_STEP = [{ title: 'Login', explanation: 'Adds login.', files: ['login.ts', 'app.ts'] }];

const commit = (cwd: string, message: string, files: Files) => {
  for (const [name, text] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(cwd, name)), { recursive: true });
    fs.writeFileSync(path.join(cwd, name), text);
  }
  git(cwd, 'add', '-A');
  git(cwd, 'commit', '-m', message);
  return git(cwd, 'rev-parse', 'HEAD');
};

export type Repo = ReturnType<typeof makeRepo>;

/**
 * `feature/login` branched from main at `base`, adding `login.ts` and changing `app.ts`; main moved on after it.
 * `start` adds files to main's first commit and `feature` to the branch's commit; `env` is added to the CLI's environment.
 * The working copy is left on the feature branch.
 */
export function makeRepo({
  start = {},
  feature = {},
  env: extraEnv = {},
}: { start?: Files; feature?: Files; env?: Record<string, string> } = {}) {
  const root = fs.mkdtempSync(path.join(process.env['WALKTHROUGH_TEST_SANDBOX'] ?? '', 'repo-'));
  const dir = path.join(root, 'shop');
  const state = path.join(root, 'state');
  const bin = path.join(root, 'bin');
  const logs = path.join(root, 'logs');
  for (const folder of [dir, bin, logs]) fs.mkdirSync(folder);

  git(root, 'init', '--bare', '-b', 'main', 'origin.git');
  git(dir, 'init', '-b', 'main');
  git(dir, 'remote', 'add', 'origin', path.join(root, 'origin.git'));
  const base = commit(dir, 'Start the shop', { 'app.ts': 'export const app = 1;\n', ...start });
  git(dir, 'push', '-u', 'origin', 'main');
  git(dir, 'remote', 'set-head', 'origin', 'main');
  git(dir, 'checkout', '-b', 'feature/login');
  const head = commit(dir, 'Add login', {
    'login.ts': 'export const login = () => true;\n',
    'app.ts': 'export const app = 2;\n',
    ...feature,
  });
  git(dir, 'checkout', 'main');
  commit(dir, 'Main moves on', { 'other.ts': 'export const other = 1;\n' });
  git(dir, 'push', 'origin', 'main');
  git(dir, 'checkout', 'feature/login');

  const log = (name: string) => path.join(logs, name);
  for (const opener of ['open', 'xdg-open'])
    fs.writeFileSync(path.join(bin, opener), `#!/bin/sh\necho "$@" >> "${log('open')}"\n`, { mode: 0o755 });
  const env = { ...process.env, PATH: `${bin}:${process.env['PATH'] ?? ''}`, WALKTHROUGH_STATE: state, ...extraEnv };
  const running: Promise<unknown>[] = [];
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
    /** Runs the CLI in the background, as the session runs `listen`: what it printed and how it ended. */
    background: (...args: string[]) => {
      const child = spawn(CLI, args, { cwd: dir, env });
      let stdout = '';
      let stderr = '';
      child.stdout.on('data', (chunk: Buffer) => (stdout += chunk.toString()));
      child.stderr.on('data', (chunk: Buffer) => (stderr += chunk.toString()));
      const ended = new Promise<{ status: number | null; stdout: string; stderr: string }>(resolve =>
        child.on('exit', status => {
          resolve({ status, stdout, stderr });
        }),
      );
      running.push(ended);
      return { child, ended };
    },
    /** Waits for every background CLI to end, so none writes into the sandbox while it is removed. */
    settled: () => Promise.all(running),
    /** Records with `command` the way the skill does, as JSON on standard input; a string goes in as it is. */
    record: (input: unknown, command = 'steps') =>
      spawnSync(CLI, [command], {
        cwd: dir,
        encoding: 'utf8',
        env,
        input: typeof input === 'string' ? input : JSON.stringify(input),
      }),
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
