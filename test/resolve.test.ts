import fs from 'node:fs';
import path from 'node:path';
import { afterEach, describe, expect, test } from 'vitest';
import { git, makeRepo, ONE_STEP, postTo, type Repo, viewAt } from './helpers';

let repo: Repo;
afterEach(async () => {
  repo.run('stop');
  await repo.settled();
});

const lines = (stdout: string) =>
  stdout
    .trim()
    .split('\n')
    .filter(Boolean)
    .map(line => JSON.parse(line) as Record<string, unknown>);

const THREAD = { id: '1042', file: 'login.ts', lines: [1, 1], author: 'dana-k', at: '2026-11-23T09:30:00Z', body: 'Does this let everyone in?' };

function started(...args: string[]) {
  repo = makeRepo();
  repo.run('start', ...args);
  repo.record(ONE_STEP);
  repo.run('ready');
  return repo.url();
}

const aiComment = (body: string, file = 'login.ts') => /: ([0-9a-f]{8})\.$/.exec(repo.record([{ file, lines: [1, 1], body }], 'comment').stdout.trim())?.[1] ?? '';
const threadOf = async (page: string, id: string) => (await viewAt(page)).threads.find(one => one.id === id);

describe('walkthrough resolve', () => {
  test('on a pull request, resolves only an AI comment that went out; the resolve is pending until the next submit and can be taken back until then', async () => {
    const page = started('--pr', '212');
    const fixed = aiComment('Everyone gets in.');
    const dropped = aiComment('Dropped.', 'app.ts');
    repo.record([THREAD], 'threads');
    await postTo(page, '/comment', { comment: dropped, delete: true });
    await postTo(page, '/comment', { file: 'app.ts', lines: [1, 1], text: 'Mine.' });
    const mine = (await viewAt(page)).threads.find(one => one.comments[0]?.by === 'you')?.id ?? '';
    await postTo(page, '/resolve', { thread: '1042' });
    expect(await threadOf(page, '1042')).toMatchObject({ resolvedBy: 'you', resolvePending: true, unresolvable: true });
    expect((await postTo(page, '/unresolve', { thread: '1042' })).status).toBe(200);
    expect(await threadOf(page, '1042')).not.toHaveProperty('resolved');

    expect(repo.run('resolve', fixed).stderr).toContain(`the comment ${fixed} is still pending`);
    expect((await postTo(page, '/submit', { type: 'comment', summary: '' })).status).toBe(200);
    repo.run('posted');
    expect(repo.run('resolve', dropped).stderr).toContain(`the comment ${dropped} was deleted`);
    expect(repo.run('resolve', '1042').stderr).toContain('the comment 1042 is not yours');
    expect(repo.run('resolve', mine).stderr).toContain(`the comment ${mine} is not yours`);
    expect(repo.run('resolve', 'nope').stderr).toContain('no thread starts with the comment nope');
    expect((await viewAt(page)).submitted).not.toBeNull();

    expect(repo.run('resolve', fixed).stdout).toBe(`Resolved the thread of comment ${fixed}.\n`);
    expect(repo.run('resolve', fixed).stderr).toContain('already resolved');
    expect(await threadOf(page, fixed)).toMatchObject({ resolved: true, resolvedBy: 'ai', resolvePending: true, unresolvable: true });
    expect((await viewAt(page)).submitted).toBeNull();
    const resolveLine = { kind: 'resolve', thread: fixed, by: 'ai', file: 'login.ts', lines: [1, 1], body: '[AI] Everyone gets in.' };
    expect(lines(repo.run('comments').stdout)).toEqual([resolveLine]);

    expect((await postTo(page, '/unresolve', { thread: fixed })).status).toBe(200);
    expect(await threadOf(page, fixed)).not.toHaveProperty('resolved');
    expect(repo.run('comments').stdout).toBe('');
    repo.run('resolve', fixed);
    expect((await postTo(page, '/comment', { thread: fixed, text: 'Thanks.' })).status).toBe(200);

    expect((await postTo(page, '/submit', { type: 'approve', summary: '' })).status).toBe(200);
    const sent = await threadOf(page, fixed);
    expect(sent).toMatchObject({ resolved: true, resolvedBy: 'ai', resolveReview: (await viewAt(page)).submitted?.id });
    expect(sent).not.toHaveProperty('resolvePending');
    expect(sent).not.toHaveProperty('unresolvable');
    expect((await postTo(page, '/unresolve', { thread: fixed })).status).toBe(400);
    expect(lines(repo.run('comments').stdout)).toEqual([expect.objectContaining({ kind: 'reply', thread: fixed, body: 'Thanks.' }), resolveLine]);
  });

  test("on your own change, the AI's resolve is never pending, never goes out and can always be taken back", async () => {
    const page = started();
    const fixed = aiComment('Everyone gets in.');
    expect((await postTo(page, '/submit', { summary: '' })).status).toBe(200);
    repo.run('posted');

    expect(repo.run('resolve', fixed).status).toBe(0);
    const thread = await threadOf(page, fixed);
    expect(thread).toMatchObject({ resolved: true, resolvedBy: 'ai', unresolvable: true });
    expect(thread).not.toHaveProperty('resolvePending');
    expect((await viewAt(page)).submitted).not.toBeNull();
    expect(repo.run('comments').stdout).toBe('');
    expect(lines(repo.run('comments', '--all').stdout)).toContainEqual(expect.objectContaining({ kind: 'resolve', thread: fixed, by: 'ai' }));

    expect((await postTo(page, '/unresolve', { thread: fixed })).status).toBe(200);
    expect(await threadOf(page, fixed)).not.toHaveProperty('resolved');
  });
});

describe('an outdated comment', () => {
  test('keeps the code it was written on and names the step that now holds its file; one whose file left the change names none', async () => {
    repo = makeRepo();
    repo.run('start');
    repo.record(ONE_STEP);
    repo.run('ready');
    const page = repo.url();
    await postTo(page, '/comment', { file: 'app.ts', lines: [1, 1], text: 'On the app.' });
    repo.record([THREAD], 'threads');

    fs.writeFileSync(path.join(repo.dir, 'app.ts'), 'export const app = 3;\n');
    fs.rmSync(path.join(repo.dir, 'login.ts'));
    git(repo.dir, 'add', '-A');
    git(repo.dir, 'commit', '-m', 'More');
    repo.run('start');

    const { threads } = await viewAt(page);
    expect(threads.find(one => one.file === 'app.ts')).toMatchObject({ step: null, code: ['export const app = 2;'], fileStep: '1' });
    const gone = threads.find(one => one.id === '1042');
    expect(gone).toMatchObject({ step: null, code: ['export const login = () => true;'] });
    expect(gone).not.toHaveProperty('fileStep');
  });
});
