import { afterEach, describe, expect, test } from 'vitest';
import type { Walkthrough } from '../src/walkthrough';
import { makeRepo, type Repo } from './helpers';

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
});
