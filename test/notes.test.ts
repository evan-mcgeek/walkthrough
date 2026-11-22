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

/** A started walkthrough whose one step "1" adds cart.ts, lines 1-5 at the head. */
function started(env: Record<string, string> = {}): Repo {
  const cart = ['const a = 1;', 'const b = 2;', 'const c = 3;', 'const d = 4;', 'const e = 5;', ''].join('\n');
  const made = makeRepo({ feature: { 'cart.ts': cart }, env });
  made.run('start');
  made.record([{ title: 'Cart', explanation: 'Adds a cart.', files: ['login.ts', 'app.ts', 'cart.ts'] }]);
  return made;
}
const note = (notes: unknown) => repo.record(notes, 'note');

describe('walkthrough note', () => {
  test('pins notes to a step and to lines of a file in it, low priority when asked', async () => {
    repo = started();

    const noted = note([
      { step: '1', label: 'Risk', text: 'Login lets **everyone** in.' },
      { step: '1', file: 'cart.ts', lines: [2, 4], label: 'Finding', text: 'These could be one.', low: true },
    ]);

    expect(noted.stderr).toBe('');
    expect(noted.status).toBe(0);
    expect(noted.stdout).toMatch(/^Recorded 2 notes: [0-9a-f]{8} \(Risk\), [0-9a-f]{8} \(Finding\)\.\n$/);
    const { conversation } = await sessionAt(repo.url());
    const hash = conversation[1]?.from === 'session' ? conversation[1].note?.linesHash : undefined;
    expect(hash).toMatch(/^[0-9a-f]{16}$/);
    expect(conversation).toEqual([
      expect.objectContaining({ from: 'session', text: 'Login lets **everyone** in.', note: { step: '1', label: 'Risk' } }),
      expect.objectContaining({
        from: 'session',
        text: 'These could be one.',
        note: { step: '1', file: 'cart.ts', lines: [2, 4], linesHash: hash, label: 'Finding', low: true },
      }),
    ]);
  });

  test('records nothing and names the problem when a note does not fit the walkthrough', async () => {
    repo = started();
    const refused = (one: Record<string, unknown>) =>
      note([{ step: '1', label: 'Fine', text: 'Fine.' }, { step: '1', label: 'L', text: 'T', ...one }]);

    expect(refused({ step: 'nope' }).stderr).toContain('note 2: the walkthrough has no step nope');
    expect(refused({ label: ' ' }).stderr).toContain('note 2 needs a label');
    expect(refused({ text: '' }).stderr).toContain('note 2 needs text');
    expect(refused({ lines: [1, 1] }).stderr).toContain('note 2: lines need a file');
    expect(refused({ file: 'cart.ts' }).stderr).toContain('note 2: a file needs lines, as [first, last]');
    expect(refused({ file: 'cart.ts', lines: [3, 2] }).stderr).toContain('note 2: a file needs lines, as [first, last]');
    expect(refused({ file: 'shop.ts', lines: [1, 1] }).stderr).toContain('note 2: step 1 does not change shop.ts');
    expect(refused({ file: 'cart.ts', lines: [4, 9] }).stderr).toContain(
      'note 2: lines 4-9 of cart.ts are not in the diff of step 1',
    );
    expect(refused({ low: 'yes' }).stderr).toContain('note 2: low must be true or false');
    expect(note({}).stderr).toContain('the notes must be a JSON array on standard input');
    expect(refused({ step: 'nope' }).status).toBe(1);
    expect((await sessionAt(repo.url())).conversation).toEqual([]);
  });

  test('takes a reply to a note to the listener with the note it is about, and the session answers it', async () => {
    repo = started();
    note([{ step: '1', label: 'Risk', text: 'Login lets everyone in.' }]);
    const [pinned] = (await sessionAt(repo.url())).conversation;
    const listener = repo.background('listen');

    expect((await post(repo.url(), '/reply', { to: pinned?.id, text: 'On purpose for now.' })).status).toBe(200);

    const [replied] = handed((await listener.ended).stdout);
    expect(replied).toMatchObject({
      kind: 'reply',
      to: pinned?.id,
      text: 'On purpose for now.',
      about: { label: 'Risk', text: 'Login lets everyone in.' },
    });
    expect(repo.run('say', '--answer', String(replied?.['id']), 'Then I leave it.').status).toBe(0);
    expect((await sessionAt(repo.url())).conversation.map(entry => entry.text)).toEqual([
      'Login lets everyone in.',
      'On purpose for now.',
      'Then I leave it.',
    ]);
  });

  test('keeps the session working on a reply to a note until the session answers it', async () => {
    repo = started({ WALKTHROUGH_BACK_WITHIN_MS: '300' });
    note([{ step: '1', label: 'Risk', text: 'Login lets everyone in.' }]);
    const [pinned] = (await sessionAt(repo.url())).conversation;
    const listener = repo.background('listen');
    await post(repo.url(), '/reply', { to: pinned?.id, text: 'On purpose for now.' });
    const [replied] = handed((await listener.ended).stdout);

    await new Promise(resolve => setTimeout(resolve, 600));
    expect((await sessionAt(repo.url())).state).toBe('working');

    expect(repo.run('say', '--answer', String(replied?.['id']), 'Then I leave it.').status).toBe(0);
    for (const end = Date.now() + 5000; Date.now() < end; await new Promise(resolve => setTimeout(resolve, 50)))
      if ((await sessionAt(repo.url())).state === 'gone') return;
    throw new Error('the session is not gone after answering');
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

    const noted = note(notes);

    expect(noted.stderr).toBe('');
    expect(noted.stdout).toContain('Recorded 2 notes');
  });
});

describe('an ask about lines', () => {
  test('reaches the listener with the file and lines it is about', async () => {
    repo = started();
    const listener = repo.background('listen');

    const asked = await post(repo.url(), '/ask', { step: '1', file: 'cart.ts', lines: [1, 3], text: 'Why three?' });

    expect(asked.status).toBe(200);
    expect(handed((await listener.ended).stdout)).toEqual([
      expect.objectContaining({ kind: 'ask', step: '1', file: 'cart.ts', lines: [1, 3], text: 'Why three?' }),
    ]);
  });

  test('is refused when the lines are not in the step', async () => {
    repo = started();

    for (const where of [{ file: 'cart.ts', lines: [6, 7] }, { file: 'cart.ts' }, { lines: [1, 1] }])
      expect((await post(repo.url(), '/ask', { step: '1', ...where, text: 'Why?' })).status).toBe(400);
    expect((await sessionAt(repo.url())).conversation).toEqual([]);
  });
});
