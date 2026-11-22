import { afterEach, describe, expect, test } from 'vitest';
import type { SessionView } from '../src/session';
import { makeRepo, type Repo } from './helpers';

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
const sessionAt = async (page: string) => (await (await fetch(`${page}data/session.json`)).json()) as SessionView;
const handed = (stdout: string) => stdout.trim().split('\n').map(line => JSON.parse(line) as Record<string, unknown>);

// Lines 1-5 of the head's cart.ts, all added by the change.
const cart = { 'cart.ts': ['const a = 1;', 'const b = 2;', 'const c = 3;', 'const d = 4;', 'const e = 5;', ''].join('\n') };

describe('walkthrough note', () => {
  test('pins notes to a step and to lines of a file in it, low priority when asked', async () => {
    repo = makeRepo({ feature: cart });
    repo.run('start');

    const noted = repo.note([
      { step: 'change', label: 'Risk', text: 'Login lets **everyone** in.' },
      { step: 'change', file: 'cart.ts', lines: [2, 4], label: 'Finding', text: 'These could be one.', low: true },
    ]);

    expect(noted.stderr).toBe('');
    expect(noted.status).toBe(0);
    expect(noted.stdout).toMatch(/^Recorded 2 notes: [0-9a-f]{8} \(Risk\), [0-9a-f]{8} \(Finding\)\.\n$/);
    expect((await sessionAt(repo.url())).conversation).toEqual([
      expect.objectContaining({
        from: 'session',
        text: 'Login lets **everyone** in.',
        note: { step: 'change', label: 'Risk' },
      }),
      expect.objectContaining({
        from: 'session',
        text: 'These could be one.',
        note: { step: 'change', file: 'cart.ts', lines: [2, 4], label: 'Finding', low: true },
      }),
    ]);
  });

  test('records nothing and names the problem when a note does not fit the walkthrough', async () => {
    repo = makeRepo({ feature: cart });
    repo.run('start');
    const refused = (note: Record<string, unknown>) =>
      repo.note([{ step: 'change', label: 'Fine', text: 'Fine.' }, { step: 'change', label: 'L', text: 'T', ...note }]);

    expect(refused({ step: 'nope' }).stderr).toContain('note 2: the walkthrough has no step nope');
    expect(refused({ label: ' ' }).stderr).toContain('note 2 needs a label');
    expect(refused({ text: '' }).stderr).toContain('note 2 needs text');
    expect(refused({ file: 'cart.ts' }).stderr).toContain('note 2: a file needs lines, as [first, last]');
    expect(refused({ file: 'cart.ts', lines: [3, 2] }).stderr).toContain('note 2: a file needs lines, as [first, last]');
    expect(refused({ file: 'shop.ts', lines: [1, 1] }).stderr).toContain('note 2: step change does not change shop.ts');
    expect(refused({ file: 'cart.ts', lines: [4, 9] }).stderr).toContain(
      'note 2: lines 4-9 of cart.ts are not in the diff of step change',
    );
    expect(refused({ low: 'yes' }).stderr).toContain('note 2: low must be true or false');
    expect(repo.note({}).stderr).toContain('the notes must be a JSON array on standard input');
    expect(refused({ step: 'nope' }).status).toBe(1);
    expect((await sessionAt(repo.url())).conversation).toEqual([]);
  });

  test('takes a reply to a note to the listener, and the session answers it', async () => {
    repo = makeRepo();
    repo.run('start');
    repo.note([{ step: 'change', label: 'Risk', text: 'Login lets everyone in.' }]);
    const [note] = (await sessionAt(repo.url())).conversation;
    const listener = repo.background('listen');

    expect((await post(repo.url(), '/reply', { to: note?.id, text: 'On purpose for now.' })).status).toBe(200);

    const [replied] = handed((await listener.ended).stdout);
    expect(replied).toMatchObject({ kind: 'reply', to: note?.id, text: 'On purpose for now.' });
    expect(repo.run('say', '--answer', String(replied?.['id']), 'Then I leave it.').status).toBe(0);
    expect((await sessionAt(repo.url())).conversation.map(entry => entry.text)).toEqual([
      'Login lets everyone in.',
      'On purpose for now.',
      'Then I leave it.',
    ]);
  });
});

describe('walkthrough guide', () => {
  test('prints the shape of a note and of an ask about lines', () => {
    repo = makeRepo();

    const { stdout } = repo.run('guide');

    for (const shape of [
      'walkthrough note < notes.json',
      '{"step": string, "label": string, "text": string, "low": boolean}',
      '{"step": string, "file": path, "lines": [first, last], "label": string, "text": string, "low": boolean}',
      '{"kind": "ask", "id": string, "step": string, "file": path, "lines": [first, last], "text": string}',
    ])
      expect(stdout).toContain(shape);
  });

  test('the notes it gives as an example are recorded as they are, on the example steps', () => {
    const guide = makeRepo().run('guide').stdout;
    const [steps = [], notes] = [...guide.matchAll(/Example:\n(\[[\s\S]*?\n\])\n/g)].map(
      match => JSON.parse(match[1] ?? '') as { files?: (string | { path: string })[] }[],
    );
    const paths = steps.flatMap(step => (step.files ?? []).map(file => (typeof file === 'string' ? file : file.path)));
    repo = makeRepo({ feature: Object.fromEntries(paths.map(file => [file, `${file}\n`])) });
    repo.run('start');
    repo.record([...steps, { title: 'Login', explanation: 'Login.', files: ['login.ts', 'app.ts'] }]);

    const noted = repo.note(notes);

    expect(noted.stderr).toBe('');
    expect(noted.stdout).toContain('Recorded 2 notes');
  });
});

describe('an ask about lines', () => {
  test('reaches the listener with the file and lines it is about', async () => {
    repo = makeRepo({ feature: cart });
    repo.run('start');
    const listener = repo.background('listen');

    const asked = await post(repo.url(), '/ask', { step: 'change', file: 'cart.ts', lines: [1, 3], text: 'Why three?' });

    expect(asked.status).toBe(200);
    expect(handed((await listener.ended).stdout)).toEqual([
      expect.objectContaining({ kind: 'ask', step: 'change', file: 'cart.ts', lines: [1, 3], text: 'Why three?' }),
    ]);
  });

  test('is refused when the lines are not in the step', async () => {
    repo = makeRepo({ feature: cart });
    repo.run('start');

    expect((await post(repo.url(), '/ask', { step: 'change', file: 'cart.ts', lines: [6, 7], text: 'Why?' })).status).toBe(
      400,
    );
    expect((await post(repo.url(), '/ask', { step: 'change', file: 'cart.ts', text: 'Why?' })).status).toBe(400);
    expect((await post(repo.url(), '/ask', { step: 'change', lines: [1, 1], text: 'Why?' })).status).toBe(400);
    expect((await sessionAt(repo.url())).conversation).toEqual([]);
  });
});
