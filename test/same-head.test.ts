import fs from 'node:fs';
import path from 'node:path';
import { afterEach, describe, expect, test } from 'vitest';
import { git, makeRepo, ONE_STEP, postTo, type Repo } from './helpers';

let repo: Repo;
afterEach(async () => {
  repo.run('stop');
  await repo.settled();
});

const AGAIN = 'Already reviewed at this head';

describe('starting again at the same head', () => {
  test('says once, from what is saved, that the ready walkthrough is already reviewed', async () => {
    repo = makeRepo();
    repo.run('start', '--pr', '212');
    repo.record(ONE_STEP);
    expect(repo.run('start').stdout).not.toContain(AGAIN);

    expect(repo.run('ready').status).toBe(0);
    repo.record([{ file: 'login.ts', lines: [1, 1], body: 'Everyone gets in.' }], 'comment');
    expect(repo.run('start').stdout).toContain(`${AGAIN}: 1 comment pending.\n`);

    expect((await postTo(repo.url(), '/submit', { type: 'approve' })).status).toBe(200);
    expect(repo.run('start').stdout).toContain(`${AGAIN}: 1 comment in the submitted review.\n`);
  });

  test('your own change says what went to the agent; a moved head says nothing of it', async () => {
    repo = makeRepo();
    repo.run('start');
    repo.record(ONE_STEP);
    repo.run('ready');
    expect(repo.run('start').stdout).toContain(`${AGAIN}: 0 comments pending.\n`);
    await postTo(repo.url(), '/comment', { file: 'login.ts', lines: [1, 1], text: 'Nit.' });
    expect((await postTo(repo.url(), '/submit', { summary: '' })).status).toBe(200);
    expect(repo.run('start').stdout).toContain(`${AGAIN}: 1 comment sent to the agent.\n`);
    expect(repo.run('posted').status).toBe(0);
    expect(repo.run('comments').stdout).toBe('');
    expect(repo.run('comments', '--all').stdout).toContain('"body":"Nit."');

    fs.writeFileSync(path.join(repo.dir, 'app.ts'), 'export const app = 3;\n');
    git(repo.dir, 'commit', '-am', 'More');
    expect(repo.run('start').stdout).not.toContain(AGAIN);
  });
});
