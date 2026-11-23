import { afterEach, describe, expect, test } from 'vitest';
import type { WalkthroughView } from '../src/decisions';
import { makeRepo, type Repo } from './helpers';

let repo: Repo;
afterEach(() => {
  repo.run('stop');
});

const recordChecklist = (checklist: unknown) => repo.record(checklist, 'checklist');

const shownAt = async (page: string) => (await (await fetch(`${page}data/walkthrough.json`)).json()) as WalkthroughView;
const decide = (id: string) =>
  fetch(new URL(`/decide?token=${new URL(repo.url()).pathname.split('/')[2] ?? ''}`, repo.url()), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ item: { type: 'checklist', id }, action: 'ok' }),
  });
const item = (text: string, more: Record<string, unknown> = {}) => ({ status: 'met', text, ...more });
/** A checklist of A ("1") and B ("2"), each offering OK, both decided OK. */
async function decidedChecklist() {
  repo = makeRepo();
  repo.run('start');
  repo.record(steps);
  recordChecklist({ title: 'Criteria', items: [item('A.'), item('B.')] });
  const ok = [{ id: 'ok', label: 'OK' }];
  repo.record([{ item: { type: 'checklist', id: '1' }, actions: ok }, { item: { type: 'checklist', id: '2' }, actions: ok }], 'actions');
  for (const id of ['1', '2']) expect((await decide(id)).status).toBe(200);
}

const steps = [
  { title: 'Login check', explanation: 'Adds a login function.', files: ['login.ts'] },
  { title: 'App version', explanation: 'Bumps the app constant.', files: ['app.ts'] },
];

const checklist = {
  title: 'Acceptance criteria',
  items: [
    { status: 'met', text: 'A person can log in.', steps: ['1'] },
    { status: 'not yet', text: 'The app shows its version.', steps: ['1', '2'] },
    { status: 'open question', text: 'Who may log in?' },
  ],
};

describe('walkthrough checklist', () => {
  test('records the session title and items with their free text statuses and step links', async () => {
    repo = makeRepo();
    repo.run('start');
    repo.record(steps);

    const recorded = recordChecklist(checklist);

    expect(recorded.stderr).toBe('');
    expect(recorded.status).toBe(0);
    expect(recorded.stdout).toContain('Recorded the checklist Acceptance criteria with 3 items: 1, 2, 3.');
    expect((await shownAt(repo.url())).checklist).toEqual({
      title: 'Acceptance criteria',
      items: [
        { id: '1', status: 'met', text: 'A person can log in.', steps: ['1'] },
        { id: '2', status: 'not yet', text: 'The app shows its version.', steps: ['1', '2'] },
        { id: '3', status: 'open question', text: 'Who may log in?', steps: [] },
      ],
    });
  });

  test('replaces the checklist recorded before and keeps it when the steps are recorded again', async () => {
    repo = makeRepo();
    repo.run('start');
    repo.record(steps);
    recordChecklist(checklist);

    recordChecklist({ title: 'Open questions', items: [{ status: 'asked', text: 'Why now?', steps: ['2'] }] });
    repo.record(steps);

    expect((await shownAt(repo.url())).checklist).toEqual({
      title: 'Open questions',
      items: [{ id: '4', status: 'asked', text: 'Why now?', steps: ['2'] }],
    });
  });

  test('keeps the mark the session gives an item, which the page shows as its icon, whatever the status says', async () => {
    repo = makeRepo();
    repo.run('start');
    repo.record(steps);

    const recorded = recordChecklist({
      title: 'Criteria',
      items: [
        { status: 'not shown', mark: 'not-met', text: 'A.' },
        { status: 'half', mark: 'partly', text: 'B.' },
        { status: 'not met', text: 'C.' },
      ],
    });

    expect(recorded.stderr).toBe('');
    expect((await shownAt(repo.url())).checklist?.items.map(({ text, mark }) => [text, mark])).toEqual([
      ['A.', 'not-met'],
      ['B.', 'partly'],
      ['C.', undefined],
    ]);
  });

  test('refuses links to steps the walkthrough does not have, naming each, and keeps the old checklist', async () => {
    repo = makeRepo();
    repo.run('start');
    repo.record(steps);
    recordChecklist(checklist);

    const refused = recordChecklist({
      title: 'Broken',
      items: [
        { status: 'met', text: 'One.', steps: ['1', '7'] },
        { status: 'met', text: 'Two.', steps: ['change'] },
      ],
    });

    expect(refused.status).toBe(1);
    expect(refused.stderr).toContain('item 1 links to step 7, which this walkthrough does not have');
    expect(refused.stderr).toContain('item 2 links to step change, which this walkthrough does not have');
    expect((await shownAt(repo.url())).checklist?.title).toBe('Acceptance criteria');
  });

  test('refuses a checklist whose shape is wrong, naming what is wrong', () => {
    repo = makeRepo();
    repo.run('start');

    for (const [input, problem] of [
      ['not json', 'the checklist must be a JSON object; see walkthrough guide'],
      [[], 'the checklist must be a JSON object; see walkthrough guide'],
      [{ title: ' ', items: [] }, 'the checklist needs a title'],
      [{ title: 'T', items: {} }, 'the checklist: items must be a list'],
      [{ title: 'T', items: [{ text: 'A.' }] }, 'item 1 needs a status'],
      [{ title: 'T', items: [{ status: 'met', text: '' }] }, 'item 1 needs a text'],
      [{ title: 'T', items: [{ status: 'met', text: 'A.', steps: [1] }] }, 'item 1: steps must be a list of step ids'],
      [{ title: 'T', items: [{ status: 'met', text: 'A.', mark: 'done' }] }, 'item 1: mark must be one of met, partly, not-met, unchecked'],
    ] as const) {
      const refused = recordChecklist(input);
      expect(refused.status).toBe(1);
      expect(refused.stderr).toContain(problem);
    }
  });

  test('an item keeps its id, decision and actions by its text wherever it moves; a new item gets an id never given before', async () => {
    await decidedChecklist();

    const recorded = recordChecklist({ title: 'Criteria', items: [item('B.'), item('C.')] });

    expect(recorded.stdout).toContain('with 2 items: 2, 3.');
    const view = await shownAt(repo.url());
    expect(view.checklist?.items.map(one => [one.id, one.text])).toEqual([
      ['2', 'B.'],
      ['3', 'C.'],
    ]);
    expect(view.decided).toMatchObject({ 'checklist:2': { action: 'ok' }, 'checklist:3': null });
    expect(view.reopened).toEqual({});
    expect(Object.keys(view.actions)).toContain('checklist:2');
    expect(Object.keys(view.actions)).not.toContain('checklist:3');
    expect(recordChecklist({ title: 'Criteria', items: [item('A.'), item('B.')] }).stdout).toContain('items: 4, 2.');
  });

  test('an item recorded with its id keeps it under a new text, and only its own decision reopens', async () => {
    await decidedChecklist();

    const recorded = recordChecklist({ title: 'Criteria', items: [item('B.'), item('A, shown now.', { id: '1' })] });

    expect(recorded.stdout).toContain('items: 2, 1.');
    const view = await shownAt(repo.url());
    expect(view.decided).toMatchObject({ 'checklist:1': null, 'checklist:2': { action: 'ok' } });
    expect(Object.keys(view.reopened)).toEqual(['checklist:1']);
  });

  test('refuses an id that names no item of the checklist, or one kept twice', async () => {
    await decidedChecklist();

    for (const [items, problem] of [
      [[item('A.', { id: '9' })], 'item 1: the checklist has no item 9 to keep'],
      [[item('A.', { id: '1' }), item('B.', { id: '1' })], 'item 2: item 1 is kept twice'],
      [[item('A.', { id: 1 })], 'item 1: id must be the id of an item, as walkthrough checklist printed it'],
    ] as const) {
      const refused = recordChecklist({ title: 'Criteria', items });
      expect(refused.status).toBe(1);
      expect(refused.stderr).toContain(problem);
    }
    expect((await shownAt(repo.url())).checklist?.items.map(one => one.id)).toEqual(['1', '2']);
  });

  test('is absent until the session records one', async () => {
    repo = makeRepo();
    repo.run('start');

    expect((await shownAt(repo.url())).checklist).toBeUndefined();
  });

  test('walkthrough guide gives its shape, and its example records as it is', () => {
    repo = makeRepo();
    const guide = repo.run('guide').stdout;
    expect(guide).toContain('walkthrough checklist --file <file>');
    expect(guide).toContain('{"title": string, "items": [{"status": string, "mark": mark, "text": string, "steps": [step id, ...]}, ...]}');
    const example = /Example checklist:\n(\{[\s\S]*?\n\})\n/.exec(guide)?.[1] ?? '';
    repo.run('start');
    repo.record([
      { title: 'Login', explanation: 'Login.', files: ['login.ts'] },
      { title: 'App', explanation: 'App.', files: ['app.ts'] },
    ]);

    const recorded = recordChecklist(example);

    expect(recorded.stderr).toBe('');
    expect(recorded.status).toBe(0);
  });
});
