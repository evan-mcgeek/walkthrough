import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { afterEach, describe, expect, test } from 'vitest';
import type { WalkthroughView } from '../src/review';
import type { Walkthrough } from '../src/walkthrough';
import { git, ONE_STEP, makeRepo, type Repo } from './helpers';

let repo: Repo;
afterEach(() => {
  repo.run('stop');
});

/** The state folder of the walkthrough of the current branch. */
const walkthroughFolder = (of: Repo) =>
  path.join(of.state, fs.readdirSync(of.state).find(name => name.startsWith('shop-')) ?? '', 'branch-feature%2Flogin');

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

  test('--pr makes it a pull request with its number and title, kept until a later start gives another', async () => {
    repo = makeRepo();
    const pr = async () => ((await (await fetch(`${repo.url()}data/walkthrough.json`)).json()) as Walkthrough).pr;

    repo.run('start');
    expect(await pr()).toBeUndefined();
    expect(repo.run('start', '--pr', '212', '--title', 'Due dates for tasks').stderr).toBe('');
    expect(await pr()).toEqual({ number: '212', title: 'Due dates for tasks' });
    repo.run('start');
    expect(await pr()).toEqual({ number: '212', title: 'Due dates for tasks' });
    expect(repo.run('start', '--title', 'Alone').stderr).toContain('--title goes with --pr');
  });

  test('a target with no remote branch of its name is the local branch', () => {
    repo = makeRepo();
    git(repo.dir, 'branch', 'release', repo.base);

    const started = repo.run('start', '--target', 'release');

    expect(started.stderr).toBe('');
    expect(started.stdout).toContain(
      `Walkthrough of feature/login against release: ${repo.base.slice(0, 7)}..${repo.head.slice(0, 7)}`,
    );
  });

  test('leaves uncommitted edits out and warns about them', async () => {
    repo = makeRepo();
    fs.writeFileSync(path.join(repo.dir, 'app.ts'), 'export const app = 3;\n');
    fs.writeFileSync(path.join(repo.dir, 'draft.ts'), 'export const draft = 1;\n');

    const started = repo.run('start');
    repo.record(ONE_STEP);

    expect(started.stdout).toContain('Warning: 2 uncommitted changes are left out of this walkthrough.');
    const shown = (await (await fetch(`${repo.url()}data/walkthrough.json`)).json()) as Walkthrough;
    expect(shown.steps[0]?.diff).toContain('+export const app = 2;');
    expect(shown.steps[0]?.diff).not.toContain('app = 3');
    expect(shown.steps[0]?.diff).not.toContain('draft');
  });

  test('says a shallow clone hides the history the change starts from, and how to fetch it', () => {
    repo = makeRepo();
    git(repo.dir, 'push', 'origin', 'feature/login');
    const shallow = path.join(path.dirname(repo.dir), 'shallow');
    git(path.dirname(repo.dir), 'clone', '--depth', '1', '--no-single-branch', `file://${path.join(path.dirname(repo.dir), 'origin.git')}`, shallow);
    git(shallow, 'checkout', 'feature/login');

    const started = repo.runIn(shallow, 'start');

    expect(started.status).toBe(1);
    expect(started.stderr).toBe(
      'walkthrough: origin/main and feature/login share no history this clone has; it is shallow, so run git fetch --unshallow first\n',
    );
  });

  test('serves the page on localhost behind a private token, without opening it', async () => {
    repo = makeRepo();

    const started = repo.run('start');

    expect(started.stdout).toContain('The page is not open yet; walkthrough open opens it.');
    expect(repo.opened()).toEqual([]);
    const url = new URL(repo.url());
    expect(url.hostname).toBe('127.0.0.1');
    expect(url.pathname).toMatch(/^\/s\/[0-9a-f]{48}\/$/);
    const page = await fetch(url);
    expect(page.status).toBe(200);
    expect(await page.text()).toContain('<title>Walkthrough</title>');
    expect(page.headers.get('content-security-policy')).toContain("script-src 'self'");
    const shown = (await (await fetch(`${url.href}data/walkthrough.json`)).json()) as Walkthrough;
    expect(shown).toMatchObject({ branch: 'feature/login', base: repo.base, head: repo.head });
  });

  test('starts at the same moment share one page server', async () => {
    repo = makeRepo();

    const ended = await Promise.all([1, 2, 3].map(() => repo.background('start').ended));

    expect(ended.map(one => one.status)).toEqual([0, 0, 0]);
    const { pid } = JSON.parse(fs.readFileSync(path.join(walkthroughFolder(repo), 'server.json'), 'utf8')) as { pid: number };
    const servers = spawnSync('pgrep', ['-f', `serve ${walkthroughFolder(repo)}`], { encoding: 'utf8' }).stdout.trim().split('\n');
    expect(servers).toEqual([String(pid)]);
  });

  test('answers a poll for an unchanged walkthrough with no body, and a changed one in full', async () => {
    repo = makeRepo();
    repo.run('start');
    const data = `${repo.url()}data/walkthrough.json`;
    const first = await fetch(data);
    const tag = first.headers.get('etag') ?? '';

    const unchanged = await fetch(data, { headers: { 'if-none-match': tag } });
    repo.record(ONE_STEP);
    const changed = await fetch(data, { headers: { 'if-none-match': tag } });

    expect(tag).not.toBe('');
    expect(unchanged.status).toBe(304);
    expect(await unchanged.text()).toBe('');
    expect(changed.status).toBe(200);
    expect(((await changed.json()) as Walkthrough).steps).toHaveLength(1);
    expect(changed.headers.get('etag')).not.toBe(tag);
  });

  test('refuses to start over a saved walkthrough it cannot read, and leaves it as it is', () => {
    repo = makeRepo();
    repo.run('start');
    repo.run('stop');
    const saved = path.join(repo.state, fs.readdirSync(repo.state).find(name => name.startsWith('shop-')) ?? '', 'branch-feature%2Flogin', 'walkthrough.json');
    fs.writeFileSync(saved, '{"kind": "bran');

    const started = repo.run('start');

    expect(started.status).toBe(1);
    expect(started.stderr).toContain(`cannot read ${saved}`);
    expect(fs.readFileSync(saved, 'utf8')).toBe('{"kind": "bran');
    expect(repo.record(ONE_STEP).stderr).toContain(`cannot read ${saved}`);
  });

  test('the inbox of a branch with a slash is one the plugin hook approves unquoted', () => {
    repo = makeRepo();
    const inbox = /files in (\S+) and pass/.exec(repo.run('start').stdout)?.[1] ?? '';
    const hook = spawnSync('node', [path.resolve(import.meta.dirname, '..', 'plugin', 'dist', 'hook.mjs')], {
      input: JSON.stringify({ tool_name: 'Bash', tool_input: { command: `walkthrough comment --file ${inbox}/comments.json` } }),
      encoding: 'utf8',
      env: { ...process.env, WALKTHROUGH_STATE: repo.state },
    });

    expect(inbox).toBe(path.join(walkthroughFolder(repo), 'inbox'));
    expect(hook.stdout).toContain('"permissionDecision":"allow"');
  });

  test('a walkthrough in the folder an earlier release named moves to the new name with its steps', () => {
    repo = makeRepo();
    repo.run('start');
    repo.record(ONE_STEP);
    repo.run('stop');
    const folder = walkthroughFolder(repo);
    const earlier = path.join(path.dirname(folder), 'branch-feature~login');
    fs.renameSync(folder, earlier);

    expect(repo.run('start').stdout).toContain(', 1 step.');
    expect(fs.existsSync(earlier)).toBe(false);
  });

  test('a walkthrough saved by an earlier release keeps its place, and its steps are recorded again', async () => {
    repo = makeRepo();
    repo.run('start');
    repo.record(ONE_STEP);
    repo.run('stop');
    const saved = path.join(repo.state, fs.readdirSync(repo.state).find(name => name.startsWith('shop-')) ?? '', 'branch-feature%2Flogin', 'walkthrough.json');
    const earlier = JSON.parse(fs.readFileSync(saved, 'utf8')) as { steps: Record<string, unknown>[] };
    earlier.steps = earlier.steps.map(step => ({ ...step, look: undefined, kind: 'step', assumptions: [] }));
    fs.writeFileSync(saved, JSON.stringify({ ...earlier, kindLabel: 'own', checklist: { title: 'Criteria', items: [] } }));

    expect(repo.run('start').stdout).toContain('0 steps');

    const shown = await shownAt(repo.url());
    expect(shown.steps).toEqual([]);
    expect(shown).not.toHaveProperty('checklist');
    expect(repo.record(ONE_STEP).stdout).toBe('Recorded 1 step: 2 (Login).\n');
  });

  test('serves no folder outside its state', () => {
    repo = makeRepo();
    const elsewhere = path.join(path.dirname(repo.dir), 'elsewhere');
    fs.mkdirSync(elsewhere);
    fs.writeFileSync(path.join(elsewhere, 'token'), 'my notes\n');
    fs.writeFileSync(path.join(elsewhere, 'server.json'), '{"a":1}\n');

    const served = spawnSync(path.resolve(import.meta.dirname, '..', 'plugin', 'bin', 'walkthrough'), ['serve', elsewhere], {
      encoding: 'utf8',
      env: { ...process.env, WALKTHROUGH_STATE: repo.state },
      timeout: 10_000,
    });

    expect(served.status).toBe(1);
    expect(served.stderr).toContain('serves only a walkthrough folder');
    expect(fs.readFileSync(path.join(elsewhere, 'token'), 'utf8')).toBe('my notes\n');
    expect(fs.readFileSync(path.join(elsewhere, 'server.json'), 'utf8')).toBe('{"a":1}\n');
  });
});

const post = (page: string, route: string, body: unknown, token = new URL(page).pathname.split('/')[2] ?? '') =>
  fetch(new URL(`${route}?token=${token}`, page), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
const shownAt = async (page: string) => (await (await fetch(`${page}data/walkthrough.json`)).json()) as WalkthroughView;

/** The status the page server answers, with full control over the headers, which fetch does not allow for Host. */
const statusOf = (page: string, target: string, method: string, headers: Record<string, string>) =>
  new Promise<number | undefined>((resolve, reject) => {
    const { hostname, port } = new URL(page);
    const req = http.request({ hostname, port, path: target, method, headers }, res => {
      res.resume();
      resolve(res.statusCode);
    });
    req.on('error', reject);
    req.end(method === 'POST' ? '{}' : undefined);
  });

describe('the page server', () => {
  test('refuses a request without the token, from another host or origin, or without JSON', async () => {
    repo = makeRepo();
    repo.run('start');
    repo.record(ONE_STEP);
    const page = repo.url();
    const { host, pathname } = new URL(page);
    const token = pathname.split('/')[2] ?? '';
    const wrong = '0'.repeat(48);
    const json = { 'content-type': 'application/json' };

    expect(await statusOf(page, `/s/${wrong}/`, 'GET', {})).toBe(404);
    expect(await statusOf(page, `/s/${wrong}/data/walkthrough.json`, 'GET', {})).toBe(404);
    expect(await statusOf(page, '/viewed', 'POST', json)).toBe(404);
    expect(await statusOf(page, `/viewed?token=${wrong}`, 'POST', json)).toBe(404);
    expect(await statusOf(page, `/viewed?token=${token}`, 'POST', { 'content-type': 'text/plain' })).toBe(415);
    expect(await statusOf(page, pathname, 'GET', { host: `attacker.example:${new URL(page).port}` })).toBe(403);
    expect(await statusOf(page, pathname, 'GET', { origin: 'http://attacker.example' })).toBe(403);
    expect(await statusOf(page, pathname, 'GET', { origin: `http://${host}` })).toBe(200);
    expect((await post(page, '/viewed', { file: 'app.ts', viewed: true }, wrong)).status).toBe(404);
    expect((await shownAt(page)).viewed).toEqual([]);
  });
});

describe('walkthrough open and ready', () => {
  test('open opens the page; ready shows the whole walkthrough, opening the page only if it never was', async () => {
    repo = makeRepo();
    repo.run('start');
    const url = repo.url();

    expect(repo.run('ready').stderr).toContain('record the steps before the walkthrough is ready');
    repo.record(ONE_STEP);
    expect((await shownAt(url)).ready).toBe(false);
    expect(repo.run('open').stdout).toContain('The page is open in your browser.');
    expect(repo.opened()).toEqual([url]);
    expect(repo.run('ready').stdout).toBe('The walkthrough is ready; the page shows it whole.\n');
    expect(repo.opened()).toEqual([url]);
    expect(await shownAt(url)).toMatchObject({ ready: true, changedFiles: [] });

    repo.run('stop');
    repo = makeRepo();
    repo.run('start');
    repo.record(ONE_STEP);
    expect(repo.run('ready').stdout).toContain('The page is open in your browser.');
    expect(repo.opened()).toEqual([repo.url()]);
  });

  test('a walkthrough saved before ready existed counts as ready', async () => {
    repo = makeRepo();
    repo.run('start');
    repo.record(ONE_STEP);
    const saved = path.join(walkthroughFolder(repo), 'walkthrough.json');
    const earlier = JSON.parse(fs.readFileSync(saved, 'utf8')) as { ready?: boolean };
    delete earlier.ready;
    fs.writeFileSync(saved, JSON.stringify({ ...earlier, reviewing: ['1'] }));

    const shown = await shownAt(repo.url());
    expect(shown.ready).toBe(true);
    expect(shown).not.toHaveProperty('reviewing');
  });
});

describe('walkthrough stop', () => {
  test('ends the page server', async () => {
    repo = makeRepo();
    repo.run('start');
    const url = repo.url();

    const stopped = repo.run('stop');

    expect(stopped.stdout).toContain('Stopped the walkthrough page.');
    await expect(fetch(url)).rejects.toThrow();
    expect(repo.run('stop').stdout).toContain('The walkthrough page was not running.');
  });

  test('the page can end its own server', async () => {
    repo = makeRepo();
    repo.run('start');

    const url = repo.url();
    expect((await post(url, '/stop', {})).status).toBe(200);

    await until('the page server ends', () => fetch(url).then(() => false, () => true));
    expect(repo.run('stop').stdout).toContain('The walkthrough page was not running.');
  });
});

async function until(what: string, done: () => Promise<boolean>, ms = 5000) {
  for (const end = Date.now() + ms; Date.now() < end; await new Promise(resolve => setTimeout(resolve, 50)))
    if (await done()) return;
  throw new Error(`${what} did not happen within ${String(ms / 1000)}s`);
}

describe('an unknown command', () => {
  test('prints a usage that records from files, as the plugin lets run without asking', () => {
    repo = makeRepo();

    const usage = repo.run('decisions');

    expect(usage.status).toBe(1);
    expect(usage.stderr).not.toMatch(/ < \S+\.json/);
    for (const command of ['steps', 'comment', 'threads', 'criteria']) expect(usage.stderr).toContain(`${command} --file <file>`);
    expect(usage.stderr).toContain('(<text> | --file <file>)');
  });
});
