import fs from 'node:fs';
import path from 'node:path';
import { afterEach, describe, expect, test } from 'vitest';
import { git, makeRepo, postTo, type Repo, viewAt } from './helpers';

let repo: Repo;
afterEach(async () => {
  repo.run('stop');
  await repo.settled();
});

const LOGIN = { title: 'Login', explanation: 'Adds login.', files: ['login.ts'] };
const APP = { title: 'App', explanation: 'Bumps the app.', files: ['app.ts'] };

/** Commits `files` on the feature branch, moving its head. */
function moveHead(files: Record<string, string>) {
  for (const [name, text] of Object.entries(files)) fs.writeFileSync(path.join(repo.dir, name), text);
  git(repo.dir, 'add', '-A');
  git(repo.dir, 'commit', '-m', 'More');
}

describe('a new head', () => {
  test('makes the walkthrough not ready again; keeps the steps by their files, clears Viewed on a changed file and detaches comments on lines that changed', async () => {
    repo = makeRepo();
    repo.run('start');
    repo.record([LOGIN, APP]);
    const page = repo.url();
    expect(repo.run('ready').status).toBe(0);
    for (const file of ['login.ts', 'app.ts']) {
      await postTo(page, '/viewed', { file, viewed: true });
      await postTo(page, '/comment', { file, lines: [1, 1], text: `On ${file}.` });
    }
    expect((await viewAt(page)).viewed.sort()).toEqual(['app.ts', 'login.ts']);

    moveHead({ 'app.ts': 'export const app = 3;\n', 'cart.ts': 'export const cart = [];\n' });
    const started = repo.run('start');

    expect(started.stdout).toContain('In no step yet: cart.ts.');
    const view = await viewAt(page);
    expect(view.ready).toBe(false);
    expect(view.changedFiles.map(one => one.path).sort()).toEqual(['app.ts', 'cart.ts', 'login.ts']);
    expect(repo.run('ready').stderr).toContain('these files are in no step yet: cart.ts');
    expect(view.steps.map(step => [step.id, step.title])).toEqual([['1', 'Login'], ['2', 'App']]);
    expect(view.viewed).toEqual(['login.ts']);
    expect(view.changed).toEqual(['app.ts']);
    expect(view.threads.map(thread => [thread.file, thread.step])).toEqual([['login.ts', '1'], ['app.ts', null]]);
    expect(repo.run('comments').stdout).toContain('"outdated":true');

    expect(repo.record([{ title: 'Cart', explanation: 'Cart.', files: ['cart.ts'] }, LOGIN, APP]).stdout).toBe(
      'Recorded 3 steps: 3 (Cart), 1 (Login), 2 (App).\n',
    );
    expect(repo.run('ready').status).toBe(0);
    expect((await viewAt(page)).ready).toBe(true);
  });
});
