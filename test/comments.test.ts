import { afterEach, describe, expect, test } from 'vitest';
import type { WalkthroughView } from '../src/decisions';
import { makeRepo, type Repo } from './helpers';

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
const lines = (stdout: string) => stdout.trim().split('\n').filter(Boolean).map(line => JSON.parse(line) as Record<string, unknown>);
const comment = (text: string, at: [number, number] = [1, 1]) => post('/comment', { step: '1', file: 'login.ts', lines: at, text });
const idOf = async (answer: Response) => {
  const { conversation } = (await answer.json()) as { conversation: { id: string; kind?: string }[] };
  return conversation.filter(entry => entry.kind === 'comment').at(-1)?.id ?? '';
};

function started(...options: string[]) {
  repo = makeRepo({ feature: { 'login.ts': 'export const login = () => true;\nexport const logout = () => true;\n' } });
  repo.run('start', ...options);
  repo.record([{ title: 'Login', explanation: 'Adds login.', files: ['login.ts', 'app.ts'] }]);
}

describe('the person’s own comments', () => {
  test('a comment, its edit and its deletion wake no one: the session reads them with walkthrough comments when it acts on them', async () => {
    started();

    const id = await idOf(await comment('Name the user.', [1, 2]));
    expect(lines(repo.run('comments').stdout)).toEqual([{ id, step: '1', file: 'login.ts', lines: [1, 2], text: 'Name the user.' }]);
    expect((await post('/comment', { comment: id, text: 'Name the user, please.' })).status).toBe(200);
    expect(lines(repo.run('comments').stdout)).toEqual([expect.objectContaining({ id, text: 'Name the user, please.' })]);
    expect((await post('/comment', { comment: id, delete: true })).status).toBe(200);
    expect(repo.run('comments').stdout.trim()).toBe('');
    expect((await post('/ask', { step: '1', text: 'Why?' })).status).toBe(200);

    expect(lines((await repo.background('listen').ended).stdout)).toEqual([expect.objectContaining({ kind: 'ask', text: 'Why?' })]);
  });

  test('a comment keeps what its lines said when it was made, for when its code is removed', async () => {
    started();

    await comment('Name the user.', [1, 2]);

    const { conversation } = (await (await fetch(`${repo.url()}data/session.json`)).json()) as { conversation: Record<string, unknown>[] };
    expect(conversation.at(-1)).toMatchObject({ kind: 'comment', linesText: ['export const login = () => true;', 'export const logout = () => true;'] });
  });

  test('walkthrough comments lists each comment as it is now, and one the session marked posted can no longer change', async () => {
    started();
    const kept = await idOf(await comment('Keep this.'));
    const gone = await idOf(await comment('Drop this.', [2, 2]));
    await post('/comment', { comment: kept, text: 'Keep this, edited.' });
    await post('/comment', { comment: gone, delete: true });

    expect(lines(repo.run('comments').stdout)).toEqual([{ id: kept, step: '1', file: 'login.ts', lines: [1, 1], text: 'Keep this, edited.' }]);

    const marked = repo.run('posted', kept);
    expect(marked.stdout.trim()).toBe('Marked 1 comment posted.');
    expect((await shown()).posted).toEqual([kept]);
    expect(lines(repo.run('comments').stdout)).toEqual([expect.objectContaining({ id: kept, posted: true })]);
    expect((await post('/comment', { comment: kept, text: 'Too late.' })).status).toBe(400);
    expect((await post('/comment', { comment: kept, delete: true })).status).toBe(400);
  });

  test('a comment needs lines in the step and words; an edit needs a comment still there', async () => {
    started();
    const id = await idOf(await comment('Fine.'));
    await post('/comment', { comment: id, delete: true });

    expect((await post('/comment', { step: '1', text: 'On the whole step.' })).status).toBe(400);
    expect((await comment('   ')).status).toBe(400);
    expect((await comment('Off the diff.', [9, 9])).status).toBe(400);
    expect((await post('/comment', { comment: id, text: 'Back?' })).status).toBe(400);
    expect((await post('/comment', { comment: 'nope', delete: true })).status).toBe(400);
    const refused = repo.run('posted', 'nope');
    expect(refused.status).toBe(1);
    expect(refused.stderr).toContain('the page sent no comment nope');
  });

  test('walkthrough guide says comments never come through listen, and prints the commands that list and mark them', () => {
    repo = makeRepo();

    const { stdout } = repo.run('guide');

    expect(stdout).not.toContain('"kind": "comment"');
    for (const shape of [
      'line comments, their edits and their deletions never come through listen and need no answer',
      'walkthrough comments\n',
      'walkthrough posted <comment id>...\n',
      '"finding": true flags the note as a finding',
    ])
      expect(stdout).toContain(shape);
  });

  test('start --comments gives the page the session’s words for what becomes of a comment, kept by a later start', async () => {
    started('--comments', 'Joins the fix list');

    expect((await shown()).commentHint).toBe('Joins the fix list');
    repo.run('stop');
    repo.run('start');
    expect((await shown()).commentHint).toBe('Joins the fix list');
  });
});
