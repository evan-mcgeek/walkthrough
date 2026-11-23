import { afterEach, describe, expect, test } from 'vitest';
import type { SessionView } from '../src/session';
import type { WalkthroughView } from '../src/decisions';
import { ONE_STEP, makeRepo, type Repo } from './helpers';

let repo: Repo;
afterEach(async () => {
  repo.run('stop');
  await repo.settled();
});

const post = (page: string, route: string, body: unknown) =>
  fetch(new URL(`${route}?token=${new URL(page).pathname.split('/')[2] ?? ''}`, page), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
const shownAt = async (page: string) => (await (await fetch(`${page}data/walkthrough.json`)).json()) as WalkthroughView;
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
    repo.record(ONE_STEP);
    const listener = await listening();

    expect((await post(repo.url(), '/ask', { step: '1', text: 'Why is app 2 now?' })).status).toBe(200);

    const { status, stdout } = await listener.ended;
    expect(status).toBe(0);
    expect(handed(stdout)).toEqual([expect.objectContaining({ kind: 'ask', step: '1', text: 'Why is app 2 now?' })]);
    expect(handed(stdout)[0]?.['id']).toMatch(/^[0-9a-f]{8}$/);
    expect((await sessionAt(repo.url())).state).toBe('working');
  });

  test('hands over what the person sent while nobody listened, at once', async () => {
    repo = makeRepo();
    repo.run('start');
    repo.record(ONE_STEP);
    await post(repo.url(), '/ask', { step: '1', text: 'First?' });
    await post(repo.url(), '/ask', { step: '1', text: 'Second?' });

    const { status, stdout } = await repo.background('listen').ended;

    expect(status).toBe(0);
    expect(handed(stdout).map(request => request['text'])).toEqual(['First?', 'Second?']);
  });

  test('a newer listener takes over and the older one exits with 3', async () => {
    repo = makeRepo();
    repo.run('start');
    repo.record(ONE_STEP);
    const older = await listening();

    const newer = repo.background('listen');
    const { status, stderr } = await older.ended;
    expect(status).toBe(3);
    expect(stderr).toContain('another walkthrough listen took over');

    await post(repo.url(), '/ask', { step: '1', text: 'Who gets this?' });
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
    repo.record(ONE_STEP);

    expect((await post(repo.url(), '/ask', { step: '1', text: '  ' })).status).toBe(400);
    expect((await post(repo.url(), '/ask', { step: 'nope', text: 'Why?' })).status).toBe(400);
    expect((await post(repo.url(), '/reply', { to: 'nope', text: 'Yes' })).status).toBe(400);
    expect((await sessionAt(repo.url())).conversation).toEqual([]);
  });

  test('refuses text over 4000 characters, saying so, rather than cutting it', async () => {
    repo = makeRepo();
    repo.run('start');
    repo.record(ONE_STEP);

    const refused = await post(repo.url(), '/ask', { step: '1', text: 'a'.repeat(4001) });
    const decided = await post(repo.url(), '/decide', { item: { type: 'step', id: '1' }, action: 'flag', note: 'b'.repeat(4001) });

    for (const answer of [refused, decided]) {
      expect(answer.status).toBe(400);
      expect(await answer.json()).toEqual({ error: 'That text is 4001 characters long; the most it can be is 4000.' });
    }
    expect((await sessionAt(repo.url())).conversation).toEqual([]);
    expect((await post(repo.url(), '/ask', { step: '1', text: 'a'.repeat(4000) })).status).toBe(200);
    expect((await sessionAt(repo.url())).conversation[0]?.text).toHaveLength(4000);
  });
});

describe('walkthrough say', () => {
  test('puts the answer to an ask on the page and leaves the step undecided', async () => {
    repo = makeRepo();
    repo.run('start');
    repo.record(ONE_STEP);
    const listener = await listening();
    await post(repo.url(), '/ask', { step: '1', text: 'Why is app 2 now?' });
    const [asked] = handed((await listener.ended).stdout);

    const said = repo.run('say', '--answer', String(asked?.['id']), 'Login needs the second app.');

    expect(said.stdout).toContain('Said on the page.');
    expect((await sessionAt(repo.url())).conversation).toEqual([
      expect.objectContaining({ from: 'page', kind: 'ask', step: '1', text: 'Why is app 2 now?' }),
      expect.objectContaining({ from: 'session', answer: asked?.['id'], text: 'Login needs the second app.' }),
    ]);
    expect((await shownAt(repo.url())).decided['step:1']).toBeNull();
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
  // Short, so a test sees the session not come back after answering.
  const BACK_WITHIN = { WALKTHROUGH_BACK_WITHIN_MS: '300' };
  const stateAt = async () => (await sessionAt(repo.url())).state;
  const asked = async (text: string) => {
    const listener = await listening();
    await post(repo.url(), '/ask', { step: '1', text });
    return handed((await listener.ended).stdout)[0]?.['id'] as string;
  };

  test('is working from start until a session listens', async () => {
    repo = makeRepo();
    repo.run('start');

    expect(await stateAt()).toBe('working');
    await listening();
  });

  test('stays working on an unanswered request however long it takes, and is gone once answered and not back', async () => {
    // Long enough that the CLI's exit and a fetch after the answer stay inside it on a loaded machine.
    repo = makeRepo({ env: { WALKTHROUGH_BACK_WITHIN_MS: '2000' } });
    repo.run('start');
    repo.record(ONE_STEP);
    const id = await asked('Why is app 2 now?');

    await new Promise(resolve => setTimeout(resolve, 1000));
    expect(await stateAt()).toBe('working');

    repo.run('say', '--answer', id, 'Login needs the second app.');
    expect(await stateAt()).toBe('working');
    await until('the session is gone', async () => (await stateAt()) === 'gone', 8000);
  });

  test('is listening again when the session comes back after answering', async () => {
    repo = makeRepo({ env: BACK_WITHIN });
    repo.run('start');
    repo.record(ONE_STEP);
    repo.run('say', '--answer', await asked('Why?'), 'Because.');

    await listening();
    await new Promise(resolve => setTimeout(resolve, 600));
    expect(await stateAt()).toBe('listening');
  });

  test('stays working on a reply until the session answers it', async () => {
    repo = makeRepo({ env: BACK_WITHIN });
    repo.run('start');
    repo.run('say', '--question', 'Only staff?');
    const listener = repo.background('listen');
    const [question] = (await sessionAt(repo.url())).conversation;
    await post(repo.url(), '/reply', { to: question?.id, text: 'Yes' });
    const [replied] = handed((await listener.ended).stdout);

    await new Promise(resolve => setTimeout(resolve, 600));
    expect(await stateAt()).toBe('working');

    expect(repo.run('say', '--answer', String(replied?.['id']), 'Limited it to staff.').status).toBe(0);
    await until('the session is gone', async () => (await stateAt()) === 'gone');
  });

  test.each(['SIGTERM', 'SIGKILL'] as const)('is gone at once when the listener ends by %s', async signal => {
    repo = makeRepo();
    repo.run('start');
    const listener = await listening();

    listener.child.kill(signal);
    await listener.ended;

    expect(await stateAt()).toBe('gone');
  });
});

describe('walkthrough say --question --choice', () => {
  test('offers the choices with the question, and a choice reaches the listener as the reply', async () => {
    repo = makeRepo();
    repo.run('start');
    expect(repo.run('say', '--question', '--choice', 'Staff only', '--choice', 'Everyone', 'Who may log in?').status).toBe(0);
    const listener = repo.background('listen');

    const [question] = (await sessionAt(repo.url())).conversation;
    expect(question).toMatchObject({ question: true, text: 'Who may log in?', choices: ['Staff only', 'Everyone'] });
    await post(repo.url(), '/reply', { to: question?.id, text: 'Everyone' });

    expect(handed((await listener.ended).stdout)).toEqual([
      expect.objectContaining({ kind: 'reply', to: question?.id, text: 'Everyone' }),
    ]);
  });

  test('refuses choices without a question, and an empty choice', () => {
    repo = makeRepo();
    repo.run('start');

    const loose = repo.run('say', '--choice', 'Yes', 'Shall I?');
    expect(loose.status).toBe(1);
    expect(loose.stderr).toContain('--choice needs --question');
    const empty = repo.run('say', '--question', '--choice', ' ', 'Shall I?');
    expect(empty.status).toBe(1);
    expect(empty.stderr).toContain('a choice needs text');
  });
});

describe('the page server', () => {
  test('stops itself once no page has polled it for a while, and ends the listener', async () => {
    repo = makeRepo({ env: { WALKTHROUGH_IDLE_MS: '1500' } });
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
  });
});
