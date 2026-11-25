import { afterEach, describe, expect, test } from 'vitest';
import type { Walkthrough } from '../src/walkthrough';
import { git, makeRepo, type Repo } from './helpers';

let repo: Repo;
afterEach(() => {
  repo.run('stop');
});

const shownAt = async (page: string) => (await (await fetch(`${page}data/walkthrough.json`)).json()) as Walkthrough;

const LOOK = { file: 'login.ts', start: 1, end: 1, label: 'Who gets in' };
const loginSteps = [
  { title: 'Login check', explanation: 'Adds a login function that lets everyone in.', files: ['login.ts'], look: [LOOK] },
  { title: 'App version', explanation: 'Bumps the app.', files: [{ path: 'app.ts', folded: 'Generated from the schema' }] },
];

describe('walkthrough files', () => {
  test('lists every changed file at its head path, in path order, without judging any', () => {
    repo = makeRepo({ start: { 'auth.ts': 'export const auth = 1;\n' }, feature: { 'schema.json': '{}\n' } });
    git(repo.dir, 'mv', 'auth.ts', 'session.ts');
    git(repo.dir, 'commit', '-m', 'Rename auth');
    repo.run('start');

    const listed = repo.run('files');

    expect(listed.stderr).toBe('');
    expect(listed.stdout).toBe(['app.ts', 'login.ts', 'schema.json', 'session.ts', ''].join('\n'));
  });
});

describe('walkthrough steps', () => {
  test('records the steps in order, each with its diff, Look at pointers and folded files, and prints their ids', async () => {
    repo = makeRepo();
    repo.run('start');
    expect((await shownAt(repo.url())).steps).toEqual([]);

    const recorded = repo.record(loginSteps);

    expect(recorded.stdout).toBe('Recorded 2 steps: 1 (Login check), 2 (App version).\n');
    const [login, app] = (await shownAt(repo.url())).steps;
    expect(login).toMatchObject({ id: '1', files: ['login.ts'], look: [LOOK] });
    expect(login?.diff).toContain('+export const login = () => true;');
    expect(app).toMatchObject({ id: '2', files: ['app.ts'], folded: { 'app.ts': 'Generated from the schema' }, look: [] });
  });

  test('refuses steps that leave a file out, point outside their diff or label a pointer in more than 4 words, and keeps the old steps', async () => {
    repo = makeRepo();
    repo.run('start');
    repo.record(loginSteps);

    const [login, app] = loginSteps;
    expect(repo.record([login]).stderr).toContain('no step has app.ts');
    expect(repo.record([{ ...login, look: [{ ...LOOK, end: 3 }] }, app]).stderr).toContain('points to lines 1-3 of login.ts, which are not in its diff');
    expect(repo.record([{ ...login, look: [{ ...LOOK, label: 'one two three four five' }] }, app]).stderr).toContain('a label of 1 to 4 words');
    expect((await shownAt(repo.url())).steps.map(step => step.title)).toEqual(['Login check', 'App version']);
  });
});

describe('walkthrough guide', () => {
  test('prints the new shapes, and the steps it gives as an example are recorded as they are', () => {
    repo = makeRepo();
    const guide = repo.run('guide').stdout;
    for (const shape of ['walkthrough open', 'walkthrough ready', 'walkthrough comment --file', 'walkthrough threads --file', 'walkthrough criteria --file', '{"kind": "submit"', 'walkthrough say --answer'])
      expect(guide).toContain(shape);
    for (const gone of ['checklist', 'decisions', 'actions', '--question', 'note --file']) expect(guide).not.toContain(gone);

    const example = /\nwalkthrough steps[\s\S]*?\n(\[\n[\s\S]*?\n\])\n/.exec(guide)?.[1] ?? '';
    const steps = JSON.parse(example) as { files: (string | { path: string })[] }[];
    const paths = steps.flatMap(step => step.files.map(file => (typeof file === 'string' ? file : file.path)));
    const thirty = Array.from({ length: 30 }, (_, at) => `line ${String(at + 1)}`).join('\n');
    repo.run('stop');
    repo = makeRepo({ feature: Object.fromEntries(paths.map(file => [file, `${thirty}\n`])) });
    repo.run('start');

    const recorded = repo.record([...steps, { title: 'Login', explanation: 'Login.', files: ['login.ts', 'app.ts'] }]);

    expect(recorded.stderr).toBe('');
  });
});
