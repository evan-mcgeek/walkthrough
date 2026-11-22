import fs from 'node:fs';
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
});
