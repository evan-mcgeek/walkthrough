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
});
