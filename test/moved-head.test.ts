import fs from 'node:fs';
import path from 'node:path';
import { afterEach, describe, expect, test } from 'vitest';
import type { WalkthroughView } from '../src/decisions';
import type { SessionView } from '../src/session';
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

  test('walkthrough decisions gives a reopened step the decision it had before', async () => {
    await decidedTwice();
    moveHead({ 'login.ts': 'export const login = () => false;\n' });
    repo.run('start');

    const lines = repo
      .run('decisions')
      .stdout.trim()
      .split('\n')
      .map(line => JSON.parse(line) as Record<string, unknown>);

    expect(lines[0]).toMatchObject({ item: { type: 'step', id: '1' }, decision: null, reopened: { action: 'approve' } });
    expect(lines[1]).toMatchObject({ item: { type: 'step', id: '2' }, decision: { action: 'approve' } });
    expect(lines[1]).not.toHaveProperty('reopened');
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
    const { decided } = await shown();
    repo.run('stop', ...range);

    expect(again.stdout).toContain('The head moved: 1 of 2 steps still decided, 0 reopened.');
    expect(decided['step:2']).toMatchObject({ action: 'approve' });
  });
});

describe('notes and asks whose place is gone', () => {
  test('are kept and shown detached, and a note on lines follows its file to the step that has it', async () => {
    repo = makeRepo({ feature: { 'login.ts': 'one\ntwo\nthree\n' } });
    repo.run('start');
    repo.record([LOGIN, APP]);
    const noted = repo.record(
      [
        { step: '2', label: 'Step', text: 'On the app step.' },
        { step: '2', file: 'app.ts', lines: [1, 1], label: 'Line', text: 'On the app line.' },
        { step: '1', file: 'login.ts', lines: [3, 3], label: 'Gone', text: 'On line three.' },
      ],
      'note',
    );
    const [onStep, onLine, onGoneLine] = noted.stdout.match(/[0-9a-f]{8}/g) ?? [];
    expect((await post('/ask', { step: '2', text: 'Why?' })).status).toBe(200);
    moveHead({ 'login.ts': 'one\ntwo\n' });
    repo.run('start');

    repo.record([{ title: 'All', explanation: 'Everything.', files: ['login.ts', 'app.ts'] }]);

    const { conversation } = (await (await fetch(`${repo.url()}data/session.json`)).json()) as SessionView;
    const asked = conversation.find(entry => entry.from === 'page' && entry.kind === 'ask');
    expect((await shown()).anchored).toEqual({
      [onStep ?? '']: null,
      [onLine ?? '']: '1',
      [onGoneLine ?? '']: null,
      [asked?.id ?? '']: null,
    });
  });
});

describe('notes and asks on lines whose content changed', () => {
  test('are detached, while those on unchanged lines stay', async () => {
    repo = makeRepo({ feature: { 'login.ts': 'one\ntwo\nthree\n' } });
    repo.run('start');
    repo.record([LOGIN, APP]);
    const noted = repo.record(
      [
        { step: '1', file: 'login.ts', lines: [2, 2], label: 'Two', text: 'On line two.' },
        { step: '1', file: 'login.ts', lines: [3, 3], label: 'Three', text: 'On line three.' },
      ],
      'note',
    );
    const [onTwo, onThree] = noted.stdout.match(/[0-9a-f]{8}/g) ?? [];
    expect((await post('/ask', { step: '1', file: 'login.ts', lines: [1, 2], text: 'Why?' })).status).toBe(200);
    expect((await post('/ask', { step: '1', file: 'login.ts', lines: [3, 3], text: 'And?' })).status).toBe(200);
    moveHead({ 'login.ts': 'one\nTWO\nthree\n' });

    repo.run('start');

    const { conversation } = (await (await fetch(`${repo.url()}data/session.json`)).json()) as SessionView;
    const [why, and] = conversation.filter(entry => entry.from === 'page' && entry.kind === 'ask');
    expect((await shown()).anchored).toEqual({
      [onTwo ?? '']: null,
      [onThree ?? '']: '1',
      [why?.id ?? '']: null,
      [and?.id ?? '']: '1',
    });
  });
});

const CART ={ title: 'Cart', explanation: 'Adds a cart.', files: ['cart.ts'] };

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
