import fs from 'node:fs';
import path from 'node:path';
import { afterEach, describe, expect, test } from 'vitest';
import { ONE_STEP, makeRepo, postTo, type Repo, until, viewAt } from './helpers';

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

const THREAD = {
  id: '1042',
  file: 'login.ts',
  lines: [1, 1],
  author: 'dana-k',
  at: '2026-11-23T09:30:00Z',
  body: 'Does this let everyone in?',
  replies: [{ author: 'ryo-t', at: '2026-11-24T10:00:00Z', body: 'Yes, for now.' }],
};

function started(...args: string[]) {
  repo = makeRepo();
  repo.run('start', ...args);
  repo.record(ONE_STEP);
  return repo.url();
}

describe('walkthrough listen', () => {
  test('wakes for Ask AI and the submit only, and say --answer replies in the thread', async () => {
    const page = started('--pr', '212');
    expect((await postTo(page, '/comment', { file: 'login.ts', lines: [1, 1], text: 'Nit.' })).status).toBe(200);
    expect((await postTo(page, '/viewed', { file: 'login.ts', viewed: true })).status).toBe(200);
    const [thread] = (await viewAt(page)).threads;
    expect((await postTo(page, '/ask', { thread: thread?.id, text: 'Is this safe?' })).status).toBe(200);
    expect((await postTo(page, '/submit', { type: 'approve', summary: 'Fine.' })).status).toBe(200);

    const { status, stdout } = await repo.background('listen').ended;

    expect(status).toBe(0);
    const [ask, submit] = lines(stdout);
    expect(lines(stdout)).toHaveLength(2);
    expect(ask).toMatchObject({ kind: 'ask', text: 'Is this safe?', file: 'login.ts', lines: [1, 1], thread: [{ by: 'you', body: 'Nit.' }] });
    expect(submit).toMatchObject({ kind: 'submit', type: 'approve', summary: 'Fine.' });

    expect(repo.run('say', '--answer', String(ask?.['id']), 'Yes: nothing reads it.').stdout).toBe('Answered on the page.\n');
    const comments = (await viewAt(page)).threads[0]?.comments;
    expect(comments?.map(one => [one.by, one.body, !!one.pending, !!one.answer])).toEqual([
      ['you', 'Nit.', false, false],
      ['you', 'Is this safe?', false, false],
      ['ai', 'Yes: nothing reads it.', false, true],
    ]);
    expect(repo.run('say', 'No id').status).toBe(1);
  });

  test('a newer listener takes over and the older one exits with 3; stopping the page ends it', async () => {
    started();
    const older = repo.background('listen');
    await new Promise(resolve => setTimeout(resolve, 700));
    const newer = repo.background('listen');

    expect((await older.ended).status).toBe(3);
    repo.run('stop');
    expect(lines((await newer.ended).stdout)).toEqual([{ kind: 'stopped' }]);
  });
});

describe('the review', () => {
  test("the AI's comments, colleagues' threads and the person's comments, replies and resolves go out at submit, and posted records where", async () => {
    const page = started('--pr', '212');
    expect(repo.record([{ file: 'login.ts', lines: [1, 1], body: '[AI] Everyone gets in.' }], 'comment').stdout).toMatch(/^Recorded 1 comment: [0-9a-f]{8}\.\n$/);
    expect(repo.record([THREAD], 'threads').stdout).toBe('Recorded 1 thread.\n');
    const ai = (await viewAt(page)).threads.find(one => !one.colleague);
    expect(ai?.comments[0]).toMatchObject({ by: 'ai', body: 'Everyone gets in.', pending: true });

    await postTo(page, '/comment', { comment: ai?.id, text: 'Everyone gets in; check the password.' });
    await postTo(page, '/comment', { thread: '1042', text: 'It should not.' });
    await postTo(page, '/resolve', { thread: '1042' });
    await postTo(page, '/comment', { file: 'app.ts', lines: [1, 1], text: 'Gone soon.' });
    const mine = (await viewAt(page)).threads.find(one => one.file === 'app.ts');
    expect((await postTo(page, '/comment', { comment: mine?.id, delete: true })).status).toBe(200);
    expect((await postTo(page, '/resolve', { thread: '1042' })).status).toBe(400);

    expect(lines(repo.run('comments').stdout)).toEqual([
      { kind: 'reply', id: expect.any(String) as unknown, by: 'you', thread: '1042', body: 'It should not.' },
      { kind: 'comment', id: ai?.id, by: 'ai', file: 'login.ts', lines: [1, 1], body: '[AI] Everyone gets in; check the password.' },
      { kind: 'resolve', thread: '1042' },
    ]);

    expect((await postTo(page, '/submit', { summary: 'No type.' })).status).toBe(400);
    expect((await postTo(page, '/submit', { type: 'request-changes', summary: 'Two things.' })).status).toBe(200);
    expect((await postTo(page, '/submit', { type: 'approve' })).status).toBe(400);
    expect((await postTo(page, '/comment', { comment: ai?.id, delete: true })).status).toBe(400);
    expect(lines(repo.run('comments').stdout)).toHaveLength(3);
    expect((await viewAt(page)).submitted).toMatchObject({ type: 'request-changes', summary: 'Two things.', comments: 2, posted: false });

    expect(repo.run('posted', '--address', 'https://example.test/review/1').stdout).toBe('Recorded that the review went to https://example.test/review/1.\n');
    expect((await viewAt(page)).submitted).toMatchObject({ posted: true, address: 'https://example.test/review/1' });
    expect(repo.run('comments').stdout).toBe('');
    expect(repo.run('posted').stderr).toContain('no review that is not posted');
  });

  test('your own change goes to the agent with its comments and no review type', async () => {
    const page = started();

    expect((await postTo(page, '/submit', { summary: '' })).status).toBe(400);
    expect((await postTo(page, '/comment', { file: 'login.ts', lines: [1, 1], text: 'Nit.' })).status).toBe(200);
    expect((await postTo(page, '/submit', { type: 'approve', summary: '' })).status).toBe(400);
    expect((await postTo(page, '/submit', { summary: 'Fix these.' })).status).toBe(200);
    const { submitted } = await viewAt(page);
    expect(submitted).toMatchObject({ summary: 'Fix these.', comments: 1 });
    expect(submitted).not.toHaveProperty('type');

    const { stdout } = await repo.background('listen').ended;
    expect(lines(stdout)).toEqual([{ kind: 'submit', id: expect.any(String) as unknown, summary: 'Fix these.' }]);
  });

  test('comments --all shows the AI comments the person deleted and what the AI first wrote in those they reworded', async () => {
    const page = started();
    repo.record(
      [
        { file: 'login.ts', lines: [1, 1], body: 'Kept.' },
        { file: 'login.ts', lines: [1, 1], body: 'Reworded.' },
        { file: 'app.ts', lines: [1, 1], body: 'Dropped.' },
      ],
      'comment',
    );
    const ids = Object.fromEntries(lines(repo.run('comments').stdout).map(one => [one.body as string, one.id as string]));
    expect((await postTo(page, '/comment', { comment: ids['[AI] Reworded.'], text: 'Said better.' })).status).toBe(200);
    expect((await postTo(page, '/comment', { comment: ids['[AI] Dropped.'], delete: true })).status).toBe(200);

    expect(lines(repo.run('comments').stdout).map(one => one.body)).toEqual(['[AI] Kept.', '[AI] Said better.']);
    expect(lines(repo.run('comments', '--all').stdout)).toEqual([
      expect.objectContaining({ body: '[AI] Kept.' }),
      expect.objectContaining({ body: '[AI] Said better.', wrote: '[AI] Reworded.' }),
      expect.objectContaining({ by: 'ai', file: 'app.ts', lines: [1, 1], body: '[AI] Dropped.', deleted: true }),
    ]);
  });

  test('before ready, the session counts as gone once its listen ran and none has been alive for 15 seconds', async () => {
    const page = started();
    const listener = path.join(repo.state, fs.readdirSync(repo.state).find(name => name.startsWith('shop-')) ?? '', 'branch-feature~login', 'listener.json');
    const ago = (seconds: number) => {
      const then = new Date(Date.now() - seconds * 1000);
      fs.utimesSync(listener, then, then);
    };
    expect((await viewAt(page)).sessionGone).toBe(false);

    const { child } = repo.background('listen');
    await until('listen starts', () => Promise.resolve(fs.existsSync(listener)));
    ago(20);
    expect((await viewAt(page)).sessionGone).toBe(false);

    child.kill('SIGKILL');
    await until('listen ends', () => Promise.resolve(child.exitCode !== null || child.signalCode !== null));
    ago(5);
    expect((await viewAt(page)).sessionGone).toBe(false);
    ago(20);
    expect((await viewAt(page)).sessionGone).toBe(true);

    repo.run('start');
    expect(fs.existsSync(listener)).toBe(false);
    expect((await viewAt(page)).sessionGone).toBe(false);

    // A listen from an older release records its pid only.
    fs.writeFileSync(listener, JSON.stringify({ state: 'listening', pid: process.pid }));
    ago(20);
    expect((await viewAt(page)).sessionGone).toBe(false);
  });

  test('records the criteria, and refuses what does not fit', async () => {
    const page = started();

    expect(repo.record([{ text: 'Logs in', status: 'partly' }], 'criteria').stdout).toBe('Recorded 1 criterion.\n');
    expect(repo.record([{ text: 'Logs in', status: 'done' }], 'criteria').stderr).toContain('status must be one of met, partly, not-met, not-checked');
    expect(repo.record([{ file: 'login.ts', lines: [5, 5], body: 'x' }], 'comment').stderr).toContain('lines 5-5 of login.ts are not in its diff');
    expect(await viewAt(page)).toMatchObject({ criteria: [{ text: 'Logs in', status: 'partly' }] });
  });
});
