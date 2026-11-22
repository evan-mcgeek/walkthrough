import fs from 'node:fs';
import path from 'node:path';
import { afterEach, describe, expect, test } from 'vitest';
import type { WalkthroughView } from '../src/decisions';
import { git, makeRepo, type Repo } from './helpers';

let repo: Repo;
afterEach(async () => {
  repo.run('stop');
  await repo.settled();
});

const post = (route: string, body: unknown) =>
  fetch(new URL(`${route}?token=${new URL(repo.url()).pathname.split('/')[2] ?? ''}`, repo.url()), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
const shown = async () => (await (await fetch(`${repo.url()}data/walkthrough.json`)).json()) as WalkthroughView;
const decide = (id: string, action = 'approve') => post('/decide', { item: { type: 'step', id }, action });

const LOGIN = { title: 'Login', explanation: 'Adds login.', files: ['login.ts'] };
const APP = { title: 'App', explanation: 'Bumps the app.', files: ['app.ts'] };

/** Commits `files` on the feature branch, moving its head. */
function moveHead(files: Record<string, string>) {
  for (const [name, text] of Object.entries(files)) fs.writeFileSync(path.join(repo.dir, name), text);
  git(repo.dir, 'add', '-A');
  git(repo.dir, 'commit', '-m', 'More');
}

/** A walkthrough of the branch with steps Login ("1") and App ("2"), both approved and read, and a checklist linking them. */
async function decidedTwice() {
  repo = makeRepo();
  repo.run('start');
  repo.record([LOGIN, APP]);
  repo.record({ title: 'Criteria', items: [{ status: 'met', text: 'Logs in.', steps: ['1', '2'] }] }, 'checklist');
  for (const id of ['1', '2']) {
    await decide(id);
    await post('/read', { step: id });
  }
}

describe('a new head', () => {
  test('keeps the walkthrough: unchanged steps stay decided, changed ones reopen, new files wait for a step', async () => {
    await decidedTwice();
    moveHead({ 'login.ts': 'export const login = () => false;\n', 'cart.ts': 'export const cart = [];\n' });

    const again = repo.run('start');

    expect(again.stderr).toBe('');
    expect(again.stdout).toContain('The head moved: 1 of 2 steps still decided, 1 reopened.');
    expect(again.stdout).toContain('In no step yet: cart.ts. Record the steps again with these in new steps.');
    const view = await shown();
    expect(view.head).toBe(git(repo.dir, 'rev-parse', 'HEAD'));
    expect(view.steps.map(step => [step.id, step.title])).toEqual([
      ['1', 'Login'],
      ['2', 'App'],
    ]);
    expect(view.steps[0]?.diff).toContain('+export const login = () => false;');
    expect(view.decided['step:1']).toBeNull();
    expect(view.reopened['step:1']).toMatchObject({ action: 'approve' });
    expect(view.decided['step:2']).toMatchObject({ action: 'approve' });
    expect(view.read).toEqual(['2']);
    expect(view.checklist?.items[0]?.steps).toEqual(['1', '2']);
  });

  test('drops a step none of whose files change any more', async () => {
    await decidedTwice();
    moveHead({ 'app.ts': 'export const app = 1;\n' });

    const again = repo.run('start');

    expect(again.stdout).toContain('The head moved: 1 of 1 step still decided, 0 reopened.');
    expect(again.stdout).not.toContain('In no step yet');
    expect((await shown()).steps.map(step => step.id)).toEqual(['1']);
  });

  test('a range started again with the same label at a new head keeps its walkthrough too', async () => {
    repo = makeRepo();
    const range = ['--base', 'origin/main', '--head', 'feature/login', '--label', 'Login'];
    repo.run('start', ...range);
    repo.record([LOGIN, APP], 'steps', ...range);
    await decide('2');
    moveHead({ 'login.ts': 'export const login = () => false;\n' });

    const again = repo.run('start', ...range);

    expect(again.stdout).toContain('The head moved: 1 of 2 steps still decided, 0 reopened.');
    expect((await shown()).decided['step:2']).toMatchObject({ action: 'approve' });
  });
});

const CART = { title: 'Cart', explanation: 'Adds a cart.', files: ['cart.ts'] };

describe('recording the steps again', () => {
  test('a step keeps its id, decision and read mark by its files, whatever its place, and prints the ids', async () => {
    await decidedTwice();

    const recorded = repo.record([APP, LOGIN]);

    expect(recorded.stdout).toBe('Recorded 2 steps: 2 (App), 1 (Login).\n');
    const view = await shown();
    expect(view.steps.map(step => step.id)).toEqual(['2', '1']);
    expect(view.decided).toMatchObject({ 'step:1': { action: 'approve' }, 'step:2': { action: 'approve' } });
    expect(view.reopened).toEqual({});
    expect(view.read).toEqual(['2', '1']);
  });

  test('new files go in new steps with new ids, never the id of a step gone', async () => {
    await decidedTwice();
    moveHead({ 'app.ts': 'export const app = 1;\n' });
    repo.run('start');
    moveHead({ 'cart.ts': 'export const cart = [];\n' });
    repo.run('start');

    const recorded = repo.record([LOGIN, CART]);

    expect(recorded.stdout).toBe('Recorded 2 steps: 1 (Login), 3 (Cart).\n');
    const view = await shown();
    expect(view.decided).toMatchObject({ 'step:1': { action: 'approve' }, 'step:3': null });
    expect(view.reopened).toEqual({});
  });

  test('a step taking files of several steps keeps the id of the one it shares most with, and is reopened', async () => {
    await decidedTwice();

    repo.record([{ title: 'All', explanation: 'Everything.', files: ['app.ts', 'login.ts'] }]);

    const view = await shown();
    expect(view.steps.map(step => step.id)).toEqual(['1']);
    expect(view.reopened['step:1']).toMatchObject({ action: 'approve' });
  });
});
