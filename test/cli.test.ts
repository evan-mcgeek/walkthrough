import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { afterEach, describe, expect, test } from 'vitest';
import type { WalkthroughView } from '../src/decisions';
import type { Walkthrough } from '../src/walkthrough';
import { git, ONE_STEP, makeRepo, type Repo } from './helpers';

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

  test('keeps the kind the session gives as it is, until a later start gives another', async () => {
    repo = makeRepo();
    const kind = async () => ((await (await fetch(`${repo.url()}data/walkthrough.json`)).json()) as Walkthrough).kindLabel;

    expect(repo.run('start', '--kind', ' Team review ').stderr).toBe('');
    expect(await kind()).toBe('Team review');
    repo.run('start');
    expect(await kind()).toBe('Team review');
    repo.run('start', '--kind', 'requested');
    expect(await kind()).toBe('requested');

    const blank = repo.run('start', '--kind', ' ');
    expect(blank.status).toBe(1);
    expect(blank.stderr).toContain('--kind needs a label');
    expect(await kind()).toBe('requested');
    expect(repo.run('guide').stdout).toContain(
      'walkthrough start [--target <branch> | --base <rev> --head <rev> --label <text>] [--kind <label>]',
    );
  });

  test('a walkthrough started without a kind has none', async () => {
    repo = makeRepo();
    repo.run('start');
    expect(((await (await fetch(`${repo.url()}data/walkthrough.json`)).json()) as Walkthrough).kindLabel).toBeUndefined();
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

  test('serves the page on localhost behind a private token and opens it in the browser', async () => {
    repo = makeRepo();

    const started = repo.run('start');

    expect(started.stdout).toContain('The page is open in your browser.');
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
    expect(new Set(repo.opened()).size).toBe(1);
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
    const saved = path.join(repo.state, fs.readdirSync(repo.state).find(name => name.startsWith('shop-')) ?? '', 'branch-feature~login', 'walkthrough.json');
    fs.writeFileSync(saved, '{"kind": "bran');

    const started = repo.run('start');

    expect(started.status).toBe(1);
    expect(started.stderr).toContain(`cannot read ${saved}`);
    expect(fs.readFileSync(saved, 'utf8')).toBe('{"kind": "bran');
    expect(repo.record(ONE_STEP).stderr).toContain(`cannot read ${saved}`);
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
const approve = { item: { type: 'step', id: '1' }, action: 'approve' };

describe('deciding on a step', () => {
  test('an approve decision is saved and resumed after the page server restarts', async () => {
    repo = makeRepo();
    repo.run('start');
    repo.record(ONE_STEP);

    const answer = await post(repo.url(), '/decide', approve);
    expect(answer.status).toBe(200);
    repo.run('stop');
    const again = repo.run('start');

    expect(again.stdout).toContain('Resumed: 1 of 1 step decided.');
    expect((await shownAt(repo.url())).decided['step:1']).toMatchObject({ action: 'approve' });
  });

  test('a decision on an unknown step or of an unknown action is refused', async () => {
    repo = makeRepo();
    repo.run('start');
    repo.record(ONE_STEP);

    expect((await post(repo.url(), '/decide', { ...approve, item: { type: 'step', id: 'nope' } })).status).toBe(400);
    expect((await post(repo.url(), '/decide', { ...approve, action: 'merged' })).status).toBe(400);
    expect((await shownAt(repo.url())).decided['step:1']).toBeNull();
  });
});

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
    expect(await statusOf(page, '/decide', 'POST', json)).toBe(404);
    expect(await statusOf(page, `/decide?token=${wrong}`, 'POST', json)).toBe(404);
    expect(await statusOf(page, `/decide?token=${token}`, 'POST', { 'content-type': 'text/plain' })).toBe(415);
    expect(await statusOf(page, pathname, 'GET', { host: `attacker.example:${new URL(page).port}` })).toBe(403);
    expect(await statusOf(page, pathname, 'GET', { origin: 'http://attacker.example' })).toBe(403);
    expect(await statusOf(page, pathname, 'GET', { origin: `http://${host}` })).toBe(200);
    expect((await post(page, '/decide', approve, wrong)).status).toBe(404);
    expect((await shownAt(page)).decided['step:1']).toBeNull();
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

    expect((await post(repo.url(), '/stop', {})).status).toBe(200);

    await until('the page server ends', () => fetch(repo.url()).then(() => false, () => true));
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

    const usage = repo.run('notes');

    expect(usage.status).toBe(1);
    expect(usage.stderr).not.toMatch(/ < \S+\.json/);
    for (const command of ['steps', 'checklist', 'note', 'actions']) expect(usage.stderr).toContain(`${command} --file <file>`);
    expect(usage.stderr).toContain('(<text> | --file <file>)');
  });
});
