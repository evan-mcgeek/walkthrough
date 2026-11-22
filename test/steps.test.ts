import { afterEach, describe, expect, test } from 'vitest';
import type { Walkthrough } from '../src/walkthrough';
import { git, makeRepo, type Repo } from './helpers';

let repo: Repo;
afterEach(() => {
  repo.run('stop');
});

const shownAt = async (page: string) => (await (await fetch(`${page}data/walkthrough.json`)).json()) as Walkthrough;

const loginSteps = [
  {
    title: 'Login check',
    what: 'Adds a login function that lets everyone in.',
    why: 'The app needs a login entry point.',
    files: ['login.ts'],
    tests: ['login.test.ts'],
  },
  { title: 'App version', what: 'Bumps the app constant.', why: 'The app now has login.', files: ['app.ts'], tests: [] },
];

describe('walkthrough steps', () => {
  test('records the steps in the given order, each with its own diff and its tests', async () => {
    repo = makeRepo({ feature: { 'login.test.ts': "test('login', () => {});\n" } });
    repo.run('start');

    const recorded = repo.record(loginSteps);

    expect(recorded.stderr).toBe('');
    expect(recorded.status).toBe(0);
    expect(recorded.stdout).toContain('Recorded 2 steps.');
    const { steps } = await shownAt(repo.url());
    expect(steps.map(step => step.title)).toEqual(['Login check', 'App version']);
    expect(steps[0]).toMatchObject({
      kind: 'logical',
      what: 'Adds a login function that lets everyone in.',
      why: 'The app needs a login entry point.',
      files: ['login.ts'],
      tests: ['login.test.ts'],
      decision: null,
    });
    expect(steps[0]?.diff).toContain('+export const login = () => true;');
    expect(steps[0]?.diff).toContain("+test('login', () => {});");
    expect(steps[0]?.diff).not.toContain('app = 2');
    expect(steps[1]?.diff).toContain('+export const app = 2;');
    expect(steps[1]?.diff).not.toContain('login');
  });

  test('refuses steps that leave a changed file out, repeat one, or name one outside the change, and keeps the old steps', async () => {
    repo = makeRepo({ feature: { 'login.test.ts': "test('login', () => {});\n" } });
    repo.run('start');

    const refused = repo.record([
      { title: 'Login', what: 'Adds login.', why: 'Needed.', files: ['login.ts', 'other.ts'], tests: ['login.ts'] },
    ]);

    expect(refused.status).toBe(1);
    expect(refused.stderr).toContain('login.ts is listed more than once');
    expect(refused.stderr).toContain('other.ts is not changed in this walkthrough');
    expect(refused.stderr).toContain('no step has app.ts, login.test.ts');
    expect((await shownAt(repo.url())).steps.map(step => step.kind)).toEqual(['whole']);
  });

  test('refuses a step without what changed and why', () => {
    repo = makeRepo();
    repo.run('start');

    const refused = repo.record([{ title: 'All', what: '', files: ['login.ts', 'app.ts'] }]);

    expect(refused.status).toBe(1);
    expect(refused.stderr).toContain('step 1 needs a what');
  });

  test('keeps a renamed file together with its old path in its step diff', async () => {
    repo = makeRepo({ start: { 'auth.ts': 'export const auth = 1;\nexport const two = 2;\n' } });
    git(repo.dir, 'mv', 'auth.ts', 'session.ts');
    git(repo.dir, 'commit', '-m', 'Rename auth');
    repo.run('start');

    expect(
      repo.record([{ title: 'All', what: 'Everything.', why: 'Login.', files: ['login.ts', 'app.ts', 'session.ts'] }])
        .stderr,
    ).toBe('');

    expect((await shownAt(repo.url())).steps[0]?.diff).toContain('rename from auth.ts');
  });
});
