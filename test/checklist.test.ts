import { afterEach, describe, expect, test } from 'vitest';
import type { Walkthrough } from '../src/walkthrough';
import { makeRepo, type Repo } from './helpers';

let repo: Repo;
afterEach(() => {
  repo.run('stop');
});

const recordChecklist = (checklist: unknown) => repo.record(checklist, 'checklist');

const shownAt = async (page: string) => (await (await fetch(`${page}data/walkthrough.json`)).json()) as Walkthrough;

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
    expect(recorded.stdout).toContain('Recorded the checklist Acceptance criteria with 3 items.');
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
      items: [{ id: '1', status: 'asked', text: 'Why now?', steps: ['2'] }],
    });
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
      ['not json', 'the checklist must be a JSON object on standard input; see walkthrough guide'],
      [[], 'the checklist must be a JSON object on standard input; see walkthrough guide'],
      [{ title: ' ', items: [] }, 'the checklist needs a title'],
      [{ title: 'T', items: {} }, 'the checklist: items must be a list'],
      [{ title: 'T', items: [{ text: 'A.' }] }, 'item 1 needs a status'],
      [{ title: 'T', items: [{ status: 'met', text: '' }] }, 'item 1 needs a text'],
      [{ title: 'T', items: [{ status: 'met', text: 'A.', steps: [1] }] }, 'item 1: steps must be a list of step ids'],
    ] as const) {
      const refused = recordChecklist(input);
      expect(refused.status).toBe(1);
      expect(refused.stderr).toContain(problem);
    }
  });

  test('is absent until the session records one', async () => {
    repo = makeRepo();
    repo.run('start');

    expect((await shownAt(repo.url())).checklist).toBeUndefined();
  });

  test('walkthrough guide gives its shape, and its example records as it is', () => {
    repo = makeRepo();
    const guide = repo.run('guide').stdout;
    expect(guide).toContain('walkthrough checklist < checklist.json');
    expect(guide).toContain('{"title": string, "items": [{"status": string, "text": string, "steps": [step id, ...]}, ...]}');
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
