import { afterEach, describe, expect, test } from 'vitest';
import { ONE_STEP, makeRepo, type Repo } from './helpers';

const RANGE = ['--base', 'origin/main', '--head', 'feature/login', '--label', 'Login change'];

let repo: Repo;
afterEach(async () => {
  repo.run('stop', '--list');
  repo.run('stop', ...RANGE);
  repo.run('stop');
  await repo.settled();
});

const post = (page: string, route: string, body: unknown, token = new URL(page).pathname.split('/')[2] ?? '') =>
  fetch(new URL(`${route}?token=${token}`, page), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });

/** The branch walkthrough with its one step approved and read, then a range one started after it; neither page runs. */
async function twoWalkthroughs() {
  repo = makeRepo();
  repo.run('start');
  repo.record(ONE_STEP);
  await post(repo.url(), '/read', { step: '1' });
  await post(repo.url(), '/decide', { item: { type: 'step', id: '1' }, action: 'approve' });
  repo.run('start', ...RANGE);
  repo.run('stop', ...RANGE);
  repo.run('stop');
}

describe('walkthrough list', () => {
  test('serves the repo walkthroughs, latest activity first, with their progress', async () => {
    await twoWalkthroughs();

    const listed = repo.run('list');

    expect(listed.stderr).toBe('');
    expect(listed.stdout).toContain('The list of walkthroughs is open in your browser.');
    const url = new URL(repo.url());
    expect(url.hostname).toBe('127.0.0.1');
    expect(url.pathname).toMatch(/^\/s\/[0-9a-f]{48}\/$/);
    expect((await fetch(url)).headers.get('content-security-policy')).toContain("script-src 'self'");
    const { repo: name, walkthroughs: list } = (await (await fetch(`${url.href}data/list.json`)).json()) as { repo: string; walkthroughs: { last: string }[] };
    expect(name).toBe('shop');
    expect(list).toEqual([
      { id: 'range-Login%20change', name: 'Login change', target: 'origin/main', steps: 0, decided: 0, read: 0, segments: [], last: expect.any(String) as unknown },
      { id: 'branch-feature~login', name: 'feature/login', target: 'origin/main', steps: 1, decided: 1, read: 1, segments: ['decided'], last: expect.any(String) as unknown },
    ]);
    expect(Date.parse(list[0]?.last ?? '')).toBeGreaterThanOrEqual(Date.parse(list[1]?.last ?? ''));
  });

  test('gives each step a progress segment in step order: decided, read or unread', async () => {
    repo = makeRepo();
    repo.run('start');
    repo.record([
      { title: 'Login', explanation: 'Adds login.', files: ['login.ts'] },
      { title: 'App', explanation: 'Bumps the app.', files: ['app.ts'] },
    ]);
    await post(repo.url(), '/read', { step: '2' });
    repo.run('stop');
    repo.run('list');

    const { walkthroughs } = (await (await fetch(`${repo.url()}data/list.json`)).json()) as { walkthroughs: { segments: string[] }[] };

    expect(walkthroughs.map(one => one.segments)).toEqual([['unread', 'read']]);
  });

  test('opens a walkthrough by starting its page server, and nothing outside the list', async () => {
    await twoWalkthroughs();
    repo.run('list');
    const list = repo.url();

    const opened = await post(list, '/open', { id: 'branch-feature~login' });

    expect(opened.status).toBe(200);
    const { url } = (await opened.json()) as { url: string };
    expect((await (await fetch(`${url}data/walkthrough.json`)).json()) as unknown).toMatchObject({ branch: 'feature/login' });
    expect((await post(list, '/open', { id: '..' })).status).toBe(400);
    expect((await post(list, '/open', { id: 'branch-feature~login' }, '0'.repeat(48))).status).toBe(404);
    expect((await fetch(`${new URL(list).origin}/s/${'0'.repeat(48)}/data/list.json`)).status).toBe(404);
  });

  test('stop --list ends the list page, and a second list reuses a running one', async () => {
    await twoWalkthroughs();
    repo.run('list');
    const url = repo.url();
    repo.run('list');
    expect(repo.url()).toBe(url);

    expect(repo.run('stop', '--list').stdout).toContain('Stopped the list of walkthroughs.');

    await expect(fetch(url)).rejects.toThrow();
    expect(repo.run('stop', '--list').stdout).toContain('The list of walkthroughs was not running.');
  });
});
