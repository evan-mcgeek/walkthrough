import { afterEach, describe, expect, test } from 'vitest';
import type { WalkthroughView } from '../src/decisions';
import type { SessionView } from '../src/session';
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
const handed = (stdout: string) => stdout.trim().split('\n').map(line => JSON.parse(line) as Record<string, unknown>);
const decide = (body: unknown) => post(repo.url(), '/decide', body);
const step1 = { type: 'step', id: '1' };

/** A started walkthrough with step "1", a checklist item "1" and the note whose id this returns. */
function started(): string {
  repo = makeRepo();
  repo.run('start');
  repo.record(ONE_STEP);
  repo.record({ title: 'Criteria', items: [{ status: 'met', text: 'A person can log in.' }] }, 'checklist');
  const noted = repo.record([{ step: '1', label: 'Draft', text: 'Could this be shorter?' }], 'note');
  return /([0-9a-f]{8})/.exec(noted.stdout)?.[1] ?? '';
}

describe('deciding with the default step actions', () => {
  test('a step with no actions defined offers Approve and Flag, Flag asking for a note', async () => {
    started();

    const { actions } = await shownAt(repo.url());

    expect(actions).toEqual({
      'step:1': [
        { id: 'approve', label: 'Approve' },
        { id: 'flag', label: 'Flag', note: true },
      ],
    });
  });

  test('taking an action wakes listen with the decision and shows the step decided', async () => {
    started();
    const listener = repo.background('listen');

    expect((await decide({ item: step1, action: 'flag', note: 'Too broad.' })).status).toBe(200);

    const [decision] = handed((await listener.ended).stdout);
    expect(decision).toEqual({
      kind: 'decision',
      id: expect.stringMatching(/^[0-9a-f]{8}$/) as unknown,
      from: 'page',
      at: expect.any(String) as unknown,
      item: step1,
      action: 'flag',
      note: 'Too broad.',
    });
    expect((await shownAt(repo.url())).decided['step:1']).toMatchObject({ id: decision?.['id'], action: 'flag' });
    expect((await sessionAt(repo.url())).state).toBe('working');
    expect(repo.run('say', '--answer', String(decision?.['id']), 'Noted.').status).toBe(0);
  });
});

describe('walkthrough actions', () => {
  test('the session defines the actions of steps, notes, checklist items and the whole walkthrough', async () => {
    const noteId = started();
    const offered = [
      { item: step1, actions: [{ id: 'ship', label: 'Ship it' }] },
      {
        item: { type: 'note', id: noteId },
        actions: [
          { id: 'accept', label: 'Accept' },
          { id: 'edit', label: 'Edit', edit: true },
          { id: 'drop', label: 'Drop', note: true },
        ],
      },
      { item: { type: 'checklist', id: '1' }, actions: [{ id: 'check', label: 'Checked' }] },
      { item: { type: 'walkthrough' }, actions: [{ id: 'post', label: 'Post my comments' }] },
    ];

    const recorded = repo.record(offered, 'actions');

    expect(recorded.stderr).toBe('');
    expect(recorded.stdout).toBe('Recorded the actions of 4 items.\n');
    expect((await shownAt(repo.url())).actions).toEqual({
      'step:1': [{ id: 'ship', label: 'Ship it' }],
      [`note:${noteId}`]: offered[1]?.actions,
      'checklist:1': [{ id: 'check', label: 'Checked' }],
      walkthrough: [{ id: 'post', label: 'Post my comments' }],
    });
    expect((await decide({ item: step1, action: 'approve' })).status).toBe(400);
    expect((await decide({ item: step1, action: 'ship' })).status).toBe(200);
    expect((await decide({ item: { type: 'walkthrough' }, action: 'post' })).status).toBe(200);
    expect((await decide({ item: { type: 'checklist', id: '1' }, action: 'check' })).status).toBe(200);
    const listener = repo.background('listen');
    const note = { type: 'note', id: noteId };
    expect((await decide({ item: note, action: 'edit', text: 'Shorter?' })).status).toBe(200);
    expect(handed((await listener.ended).stdout).at(-1)).toMatchObject({ item: note, action: 'edit', text: 'Shorter?' });
  });

  test('recording again replaces only the items named, and an empty list brings back the defaults', async () => {
    started();
    repo.record([{ item: step1, actions: [{ id: 'ship', label: 'Ship it' }] }], 'actions');
    repo.record([{ item: { type: 'walkthrough' }, actions: [{ id: 'done', label: 'Done' }] }], 'actions');
    expect(Object.keys((await shownAt(repo.url())).actions)).toEqual(['step:1', 'walkthrough']);

    repo.record([{ item: step1, actions: [] }], 'actions');

    expect((await shownAt(repo.url())).actions['step:1']?.map(action => action.id)).toEqual(['approve', 'flag']);
  });

  test('recording the steps or the checklist again keeps the actions of items that keep their id', async () => {
    started();
    repo.record(
      [
        { item: step1, actions: [{ id: 'ship', label: 'Ship it' }] },
        { item: { type: 'checklist', id: '1' }, actions: [{ id: 'check', label: 'Checked' }] },
      ],
      'actions',
    );

    repo.record(ONE_STEP);
    repo.record({ title: 'Criteria', items: [{ status: 'met', text: 'Other.' }] }, 'checklist');

    expect(Object.keys((await shownAt(repo.url())).actions)).toEqual(['step:1']);
    repo.record([{ item: { type: 'checklist', id: '2' }, actions: [{ id: 'check', label: 'Checked' }] }], 'actions');
    repo.record({ title: 'Criteria', items: [{ status: 'not met', text: 'Other.' }] }, 'checklist');
    expect(Object.keys((await shownAt(repo.url())).actions)).toEqual(['step:1', 'checklist:2']);
    expect((await shownAt(repo.url())).actions['step:1']?.[0]?.id).toBe('ship');
  });

  test('a step that is gone takes its actions with it', async () => {
    started();
    repo.record([{ title: 'Login', explanation: 'Adds login.', files: ['login.ts'] }, { title: 'App', explanation: 'Bumps.', files: ['app.ts'] }]);
    repo.record([{ item: { type: 'step', id: '2' }, actions: [{ id: 'ship', label: 'Ship it' }] }], 'actions');

    repo.record(ONE_STEP);

    expect(Object.keys((await shownAt(repo.url())).actions)).toEqual(['step:1']);
  });

  test('records nothing and names the problem when an action does not fit', async () => {
    started();
    const ok = { item: step1, actions: [{ id: 'ship', label: 'Ship it' }] };
    const action = (fields: Record<string, unknown>) => ({ item: step1, actions: [{ id: 'a', label: 'A', ...fields }] });

    for (const [input, problem] of [
      [{ item: { type: 'step', id: '9' }, actions: [] }, 'entry 2: the walkthrough has no step 9'],
      [{ item: { type: 'note', id: 'nope' }, actions: [] }, 'entry 2: the walkthrough has no note nope'],
      [{ item: { type: 'file' }, actions: [] }, 'entry 2: the item must be a step, a note, a checklist item or the walkthrough'],
      [{ item: step1, actions: {} }, 'entry 2: actions must be a list'],
      [action({ id: ' ' }), 'entry 2: action 1 needs an id'],
      [action({ label: '' }), 'entry 2: action 1 needs a label'],
      [action({ note: 'yes' }), 'entry 2: action 1: note must be true or false'],
      [action({ edit: true }), 'entry 2: action 1: only a note or a checklist item has text to edit'],
      [
        {
          item: step1,
          actions: [
            { id: 'a', label: 'A' },
            { id: 'a', label: 'B' },
          ],
        },
        'entry 2: two actions have the id a',
      ],
    ] as const) {
      const answer = repo.record([ok, input], 'actions');
      expect(answer.status).toBe(1);
      expect(answer.stderr).toContain(problem);
    }
    expect(repo.record({}, 'actions').stderr).toContain('the actions must be a JSON array on standard input');
    expect((await shownAt(repo.url())).actions['step:1']?.[0]?.id).toBe('approve');
  });

  test('walkthrough guide gives its shape, and its example records as it is', () => {
    const noteId = started();
    const guide = repo.run('guide').stdout;
    expect(guide).toContain('walkthrough actions < actions.json');
    const example = /Example actions, for a note with the id 5f0c2a9e:\n(\[[\s\S]*?\n\])\n/.exec(guide)?.[1] ?? '';

    const recorded = repo.record(example.replace('5f0c2a9e', noteId), 'actions');

    expect(recorded.stderr).toBe('');
    expect(recorded.status).toBe(0);
  });
});

const decisionsNow = () =>
  repo
    .run('decisions')
    .stdout.trim()
    .split('\n')
    .map(line => JSON.parse(line) as { item: unknown; decision: Record<string, unknown> | null });

describe('decisions', () => {
  test('an undecided item is undecided on the page, in walkthrough decisions and after a restart', async () => {
    const noteId = started();

    const { decided } = await shownAt(repo.url());

    expect(decided).toEqual({ 'step:1': null, [`note:${noteId}`]: null, 'checklist:1': null, walkthrough: null });
    expect(decisionsNow()).toEqual([
      { item: step1, decision: null },
      { item: { type: 'note', id: noteId }, decision: null },
      { item: { type: 'checklist', id: '1' }, decision: null },
      { item: { type: 'walkthrough' }, decision: null },
    ]);
    repo.run('stop');
    expect(repo.run('start').stdout).toContain('Resumed: 0 of 1 step decided.');
    expect((await shownAt(repo.url())).decided['step:1']).toBeNull();
  });

  test('a decision can be changed; the log keeps every change and the latest counts', async () => {
    started();
    await decide({ item: step1, action: 'approve' });

    await decide({ item: step1, action: 'flag', note: 'On second thought, no.' });

    const taken = (await sessionAt(repo.url())).conversation.filter(entry => entry.from === 'page');
    expect(taken.map(entry => entry.kind === 'decision' && entry.action)).toEqual(['approve', 'flag']);
    expect((await shownAt(repo.url())).decided['step:1']).toMatchObject({ action: 'flag', note: 'On second thought, no.' });
    expect(decisionsNow()[0]?.decision).toMatchObject({ action: 'flag', note: 'On second thought, no.' });
  });

  test('a decision is refused when its item, action, note or text does not fit', async () => {
    const noteId = started();
    repo.record(
      [{ item: { type: 'note', id: noteId }, actions: [{ id: 'edit', label: 'Edit', edit: true }] }],
      'actions',
    );
    const note = { type: 'note', id: noteId };

    for (const body of [
      { item: { type: 'step', id: 'nope' }, action: 'approve' },
      { item: 'step:1', action: 'approve' },
      { item: step1, action: 'merge' },
      { item: step1, action: 'flag' },
      { item: step1, action: 'flag', note: '  ' },
      { item: step1, action: 'approve', note: 'Why not.' },
      { item: step1, action: 'approve', text: 'New text.' },
      { item: note, action: 'edit' },
      { item: { type: 'checklist', id: '1' }, action: 'approve' },
    ])
      expect((await decide(body)).status, JSON.stringify(body)).toBe(400);

    expect((await sessionAt(repo.url())).conversation.filter(entry => entry.from === 'page')).toEqual([]);
  });

  test('a decision stays with what it was about: a step recorded again with another diff is undecided', async () => {
    started();
    await decide({ item: step1, action: 'approve' });
    repo.record(ONE_STEP);
    expect((await shownAt(repo.url())).decided['step:1']).toMatchObject({ action: 'approve' });

    repo.record([
      { title: 'Login', explanation: 'Adds login.', files: ['login.ts'] },
      { title: 'App', explanation: 'Bumps the app.', files: ['app.ts'] },
    ]);

    expect((await shownAt(repo.url())).decided).toMatchObject({ 'step:1': null, 'step:2': null });
  });

  test('a checklist item recorded again with its id and other text is reopened with the decision it had', async () => {
    started();
    repo.record([{ item: { type: 'checklist', id: '1' }, actions: [{ id: 'no', label: 'Disagree', note: true }] }], 'actions');
    await decide({ item: { type: 'checklist', id: '1' }, action: 'no', note: 'Not yet.' });

    repo.record({ title: 'Criteria', items: [{ id: '1', status: 'not met', text: 'A person can log in, not yet shown.' }] }, 'checklist');

    const view = await shownAt(repo.url());
    expect(view.decided['checklist:1']).toBeNull();
    expect(view.reopened['checklist:1']).toMatchObject({ action: 'no', note: 'Not yet.' });
    const listed = handed(repo.run('decisions').stdout).find(line => JSON.stringify(line.item).includes('checklist'));
    expect(listed).toMatchObject({ decision: null, reopened: { action: 'no', note: 'Not yet.' } });
  });
});

describe('read steps', () => {
  test('a step the page has shown is read, apart from decided, and stays so', async () => {
    started();

    expect((await post(repo.url(), '/read', { step: '1' })).status).toBe(200);
    expect((await post(repo.url(), '/read', { step: '1' })).status).toBe(200);

    const shown = await shownAt(repo.url());
    expect(shown.read).toEqual(['1']);
    expect(shown.decided['step:1']).toBeNull();
    repo.run('stop');
    repo.run('start');
    expect((await shownAt(repo.url())).read).toEqual(['1']);
    expect((await post(repo.url(), '/read', { step: '9' })).status).toBe(400);
  });

  test('a step recorded again with another diff is unread', async () => {
    started();
    await post(repo.url(), '/read', { step: '1' });

    repo.record([
      { title: 'Login', explanation: 'Adds login.', files: ['login.ts'] },
      { title: 'App', explanation: 'Bumps the app.', files: ['app.ts'] },
    ]);

    expect((await shownAt(repo.url())).read).toEqual([]);
  });
});
