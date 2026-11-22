import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { afterEach, describe, expect, test } from 'vitest';
import type { Walkthrough } from '../src/walkthrough';
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

  test('leaves uncommitted edits out and warns about them', async () => {
    repo = makeRepo();
    fs.writeFileSync(path.join(repo.dir, 'app.ts'), 'export const app = 3;\n');
    fs.writeFileSync(path.join(repo.dir, 'draft.ts'), 'export const draft = 1;\n');

    const started = repo.run('start');

    expect(started.stdout).toContain('Warning: 2 uncommitted changes are left out of this walkthrough.');
    const shown = (await (await fetch(`${repo.url()}data/walkthrough.json`)).json()) as Walkthrough;
    expect(shown.steps[0]?.diff).toContain('+export const app = 2;');
    expect(shown.steps[0]?.diff).not.toContain('app = 3');
    expect(shown.steps[0]?.diff).not.toContain('draft');
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
});

const post = (page: string, route: string, body: unknown, token = new URL(page).pathname.split('/')[2] ?? '') =>
  fetch(new URL(`${route}?token=${token}`, page), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
const shownAt = async (page: string) => (await (await fetch(`${page}data/walkthrough.json`)).json()) as Walkthrough;

describe('deciding on a step', () => {
  test('an approve decision is saved and resumed after the page server restarts', async () => {
    repo = makeRepo();
    repo.run('start');

    const answer = await post(repo.url(), '/decide', { step: 'change', decision: 'approved' });
    expect(answer.status).toBe(200);
    repo.run('stop');
    const again = repo.run('start');

    expect(again.stdout).toContain('Resumed: 1 of 1 step decided.');
    expect((await shownAt(repo.url())).steps[0]?.decision).toBe('approved');
  });

  test('a new head starts the walkthrough over and says so', async () => {
    repo = makeRepo();
    repo.run('start');
    await post(repo.url(), '/decide', { step: 'change', decision: 'approved' });
    fs.writeFileSync(path.join(repo.dir, 'login.ts'), 'export const login = () => false;\n');
    git(repo.dir, 'commit', '-am', 'Fix login');

    const again = repo.run('start');

    expect(again.stdout).toContain('The head moved since the last walkthrough, so it starts over.');
    expect((await shownAt(repo.url())).steps[0]?.decision).toBeNull();
  });

  test('a decision on an unknown step or of an unknown kind is refused', async () => {
    repo = makeRepo();
    repo.run('start');

    expect((await post(repo.url(), '/decide', { step: 'nope', decision: 'approved' })).status).toBe(400);
    expect((await post(repo.url(), '/decide', { step: 'change', decision: 'merged' })).status).toBe(400);
    expect((await shownAt(repo.url())).steps[0]?.decision).toBeNull();
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
    const page = repo.url();
    const { host, pathname } = new URL(page);
    const token = pathname.split('/')[2] ?? '';
    const wrong = '0'.repeat(48);
    const json = { 'content-type': 'application/json' };
    const decide = { step: 'change', decision: 'approved' };

    expect(await statusOf(page, `/s/${wrong}/`, 'GET', {})).toBe(404);
    expect(await statusOf(page, `/s/${wrong}/data/walkthrough.json`, 'GET', {})).toBe(404);
    expect(await statusOf(page, '/decide', 'POST', json)).toBe(404);
    expect(await statusOf(page, `/decide?token=${wrong}`, 'POST', json)).toBe(404);
    expect(await statusOf(page, `/decide?token=${token}`, 'POST', { 'content-type': 'text/plain' })).toBe(415);
    expect(await statusOf(page, pathname, 'GET', { host: `attacker.example:${new URL(page).port}` })).toBe(403);
    expect(await statusOf(page, pathname, 'GET', { origin: 'http://attacker.example' })).toBe(403);
    expect(await statusOf(page, pathname, 'GET', { origin: `http://${host}` })).toBe(200);
    expect((await post(page, '/decide', decide, wrong)).status).toBe(404);
    expect((await shownAt(page)).steps[0]?.decision).toBeNull();
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
