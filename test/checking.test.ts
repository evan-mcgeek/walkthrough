import { afterEach, describe, expect, test } from 'vitest';
import type { WalkthroughView } from '../src/decisions';
import { makeRepo, type Repo } from './helpers';

let repo: Repo;
afterEach(async () => {
  repo.run('stop');
  await repo.settled();
});

const THREE_STEPS = [
  { title: 'Login', explanation: 'Adds login.', files: ['login.ts'] },
  { title: 'App', explanation: 'Bumps the app.', files: ['app.ts'] },
  { title: 'Cart', explanation: 'Adds a cart.', files: ['cart.ts'] },
];

const shownAt = async (page: string) => (await (await fetch(`${page}data/walkthrough.json`)).json()) as WalkthroughView;
const decide = (body: unknown) =>
  fetch(new URL(`/decide?token=${new URL(repo.url()).pathname.split('/')[2] ?? ''}`, repo.url()), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });

function started(): void {
  repo = makeRepo({ feature: { 'cart.ts': 'export const cart = [];\n' } });
  repo.run('start');
  repo.record(THREE_STEPS);
}

describe('walkthrough checking', () => {
  test('records the steps being checked in reading order, replacing the set before, and prints it', async () => {
    started();

    const all = repo.run('checking', '3', '1', '2');
    expect(all.stderr).toBe('');
    expect(all.stdout).toBe('Checking 3 steps: 1, 2, 3.\n');
    expect((await shownAt(repo.url())).checking).toEqual(['1', '2', '3']);

    expect(repo.run('checking', '3').stdout).toBe('Checking 1 step: 3.\n');
    expect((await shownAt(repo.url())).checking).toEqual(['3']);

    expect(repo.run('checking').stdout).toBe('Checking no steps.\n');
    expect((await shownAt(repo.url())).checking).toEqual([]);
  });

  test('refuses an id that names no step, and records nothing', async () => {
    started();
    repo.run('checking', '1');

    const refused = repo.run('checking', '2', '7', '9');

    expect(refused.status).toBe(1);
    expect(refused.stderr).toBe('walkthrough: the walkthrough has no steps 7, 9; nothing was recorded\n');
    expect((await shownAt(repo.url())).checking).toEqual(['1']);
  });

  test('recording the steps again keeps the ids that still name a step and drops the rest', async () => {
    started();
    repo.run('checking', '1', '3');

    repo.record([
      { title: 'Login and app', explanation: 'Adds login.', files: ['login.ts', 'app.ts'] },
      { title: 'Cart', explanation: 'Adds a cart.', files: ['cart.ts'] },
    ]);

    expect((await shownAt(repo.url())).checking).toEqual(['1', '3']);
    repo.record([
      { title: 'Everything', explanation: 'All of it.', files: ['login.ts', 'app.ts', 'cart.ts'] },
    ]);
    expect((await shownAt(repo.url())).checking).toEqual(['1']);
  });

  test('a decision on a step being checked is refused with why; once the set drops it, it is taken', async () => {
    started();
    repo.run('checking', '2');

    const refused = await decide({ item: { type: 'step', id: '2' }, action: 'approve' });
    expect(refused.status).toBe(409);
    expect(await refused.json()).toEqual({ error: 'Decide after the check.' });
    expect((await shownAt(repo.url())).decided['step:2']).toBeNull();
    expect((await decide({ item: { type: 'step', id: '1' }, action: 'approve' })).status).toBe(200);

    repo.run('checking');

    expect((await decide({ item: { type: 'step', id: '2' }, action: 'approve' })).status).toBe(200);
  });
});
