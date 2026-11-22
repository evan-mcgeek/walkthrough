import { afterEach, describe, expect, test } from 'vitest';
import type { SessionView } from '../src/session';
import type { Walkthrough } from '../src/walkthrough';
import { makeRepo, type Repo } from './helpers';

let repo: Repo;
afterEach(() => {
  repo.run('stop');
});

const post = (page: string, route: string, body: unknown) =>
  fetch(new URL(`${route}?token=${new URL(page).pathname.split('/')[2] ?? ''}`, page), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
const shownAt = async (page: string) => (await (await fetch(`${page}data/walkthrough.json`)).json()) as Walkthrough;
const sessionAt = async (page: string) => (await (await fetch(`${page}data/session.json`)).json()) as SessionView;

async function until(what: string, done: () => Promise<boolean>, ms = 5000) {
  for (const end = Date.now() + ms; Date.now() < end; await new Promise(resolve => setTimeout(resolve, 50)))
    if (await done()) return;
  throw new Error(`${what} did not happen within ${String(ms / 1000)}s`);
}

/** A background `walkthrough listen`, once the page shows the session listening. */
async function listening() {
  const listener = repo.background('listen');
  await until('the session listens', async () => (await sessionAt(repo.url())).state === 'listening');
  return listener;
}

const handed = (stdout: string) => stdout.trim().split('\n').map(line => JSON.parse(line) as Record<string, unknown>);

describe('walkthrough listen', () => {
  test('exits with the question the person asks on a step', async () => {
    repo = makeRepo();
    repo.run('start');
    const listener = await listening();

    expect((await post(repo.url(), '/ask', { step: 'change', text: 'Why is app 2 now?' })).status).toBe(200);

    const { status, stdout } = await listener.ended;
    expect(status).toBe(0);
    expect(handed(stdout)).toEqual([
      expect.objectContaining({ kind: 'ask', step: 'change', text: 'Why is app 2 now?', id: expect.any(String) }),
    ]);
    expect((await sessionAt(repo.url())).state).toBe('working');
  });

  test('hands over what the person sent while nobody listened, at once', async () => {
    repo = makeRepo();
    repo.run('start');
    await post(repo.url(), '/ask', { step: 'change', text: 'First?' });
    await post(repo.url(), '/ask', { step: 'change', text: 'Second?' });

    const { status, stdout } = await repo.background('listen').ended;

    expect(status).toBe(0);
    expect(handed(stdout).map(request => request['text'])).toEqual(['First?', 'Second?']);
  });

  test('a newer listener takes over and the older one exits with 3', async () => {
    repo = makeRepo();
    repo.run('start');
    const older = await listening();

    const newer = repo.background('listen');
    const { status, stderr } = await older.ended;
    expect(status).toBe(3);
    expect(stderr).toContain('another walkthrough listen took over');

    await post(repo.url(), '/ask', { step: 'change', text: 'Who gets this?' });
    expect(handed((await newer.ended).stdout)[0]).toMatchObject({ text: 'Who gets this?' });
  });

  test('stopping the walkthrough ends the listener and says so', async () => {
    repo = makeRepo();
    repo.run('start');
    const listener = await listening();

    repo.run('stop');

    const { status, stdout } = await listener.ended;
    expect(status).toBe(0);
    expect(handed(stdout)).toEqual([{ kind: 'stopped' }]);
  });

  test('refuses a question with no text or about a step the walkthrough does not have', async () => {
    repo = makeRepo();
    repo.run('start');

    expect((await post(repo.url(), '/ask', { step: 'change', text: '  ' })).status).toBe(400);
    expect((await post(repo.url(), '/ask', { step: 'nope', text: 'Why?' })).status).toBe(400);
    expect((await post(repo.url(), '/reply', { to: 'nope', text: 'Yes' })).status).toBe(400);
    expect((await sessionAt(repo.url())).conversation).toEqual([]);
  });
});

describe('walkthrough say', () => {
  test('puts the answer to an ask on the page and leaves the step undecided', async () => {
    repo = makeRepo();
    repo.run('start');
    const listener = await listening();
    await post(repo.url(), '/ask', { step: 'change', text: 'Why is app 2 now?' });
    const [asked] = handed((await listener.ended).stdout);

    const said = repo.run('say', '--answer', String(asked?.['id']), 'Login needs the second app.');

    expect(said.stdout).toContain('Said on the page.');
    expect((await sessionAt(repo.url())).conversation).toEqual([
      expect.objectContaining({ from: 'page', kind: 'ask', step: 'change', text: 'Why is app 2 now?' }),
      expect.objectContaining({ from: 'session', answer: asked?.['id'], text: 'Login needs the second app.' }),
    ]);
    expect((await shownAt(repo.url())).steps[0]?.decision).toBeNull();
  });

  test('refuses an answer to a request the page never sent', () => {
    repo = makeRepo();
    repo.run('start');

    const said = repo.run('say', '--answer', 'deadbeef', 'Hello');

    expect(said.status).toBe(1);
    expect(said.stderr).toContain('the page sent no request deadbeef');
  });

  test('a question needs the person until they reply, and the reply reaches the listener', async () => {
    repo = makeRepo();
    repo.run('start');
    repo.run('say', '--question', 'Is the login meant to accept everyone?');
    const listener = repo.background('listen');

    const { conversation, state } = await sessionAt(repo.url());
    expect(state).toBe('needs-you');
    const question = conversation[0];
    expect((await post(repo.url(), '/reply', { to: question?.id, text: 'No, only staff.' })).status).toBe(200);

    expect(handed((await listener.ended).stdout)).toEqual([
      expect.objectContaining({ kind: 'reply', to: question?.id, text: 'No, only staff.' }),
    ]);
    expect((await sessionAt(repo.url())).state).toBe('working');
  });
});

describe('the session status', () => {
  test('is quiet until a session listens', async () => {
    repo = makeRepo();
    repo.run('start');

    expect((await sessionAt(repo.url())).state).toBe('quiet');
  });
});

describe('the page server', () => {
  test('stops itself once no page has polled it for a while, and ends the listener', async () => {
    repo = makeRepo({ WALKTHROUGH_IDLE_MS: '1500' });
    repo.run('start');
    const listener = await listening();
    const polledUntil = Date.now() + 2500;
    while (Date.now() < polledUntil) {
      await sessionAt(repo.url());
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Outside the page's own address, so asking does not count as a page.
    const root = new URL('/', repo.url());
    expect((await fetch(root)).status).toBe(404);

    await until('the idle server stops', () => fetch(root).then(() => false, () => true), 5000);
    expect(handed((await listener.ended).stdout)).toEqual([{ kind: 'stopped' }]);
  }, 15_000);
});
