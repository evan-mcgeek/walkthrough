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
    explanation: 'Adds a login function that lets everyone in, with its test.',
    files: ['login.ts', 'login.test.ts'],
  },
  { title: 'App version', explanation: 'Bumps the app constant because the app now has login.', files: ['app.ts'] },
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
  test('records the steps in the given order, each with its explanation and its own diff', async () => {
    repo = makeRepo({ feature: { 'login.test.ts': "test('login', () => {});\n" } });
    repo.run('start');

    const recorded = repo.record(loginSteps);

    expect(recorded.stderr).toBe('');
    expect(recorded.status).toBe(0);
    expect(recorded.stdout).toContain('Recorded 2 steps.');
    const { steps } = await shownAt(repo.url());
    expect(steps.map(step => step.title)).toEqual(['Login check', 'App version']);
    expect(steps[0]).toMatchObject({
      id: '1',
      kind: 'step',
      explanation: 'Adds a login function that lets everyone in, with its test.',
      files: ['login.ts', 'login.test.ts'],
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
      { title: 'Login', explanation: 'Adds login.', files: ['login.ts', 'other.ts'] },
      { title: 'Folded', folded: true, files: [{ path: 'login.ts', reason: 'Listed twice.' }] },
    ]);

    expect(refused.status).toBe(1);
    expect(refused.stderr).toContain('login.ts is in more than one step');
    expect(refused.stderr).toContain('other.ts is not changed in this walkthrough');
    expect(refused.stderr).toContain('no step has app.ts, login.test.ts');
    expect((await shownAt(repo.url())).steps.map(step => step.kind)).toEqual(['whole']);
  });

  test('refuses a step without an explanation', () => {
    repo = makeRepo();
    repo.run('start');

    const refused = repo.record([{ title: 'All', explanation: '', files: ['login.ts', 'app.ts'] }]);

    expect(refused.status).toBe(1);
    expect(refused.stderr).toContain('step 1 needs an explanation');
  });

  test('keeps a renamed file together with its old path in its step diff', async () => {
    repo = makeRepo({ start: { 'auth.ts': 'export const auth = 1;\nexport const two = 2;\n' } });
    git(repo.dir, 'mv', 'auth.ts', 'session.ts');
    git(repo.dir, 'commit', '-m', 'Rename auth');
    repo.run('start');

    expect(
      repo.record([{ title: 'All', explanation: 'Everything.', files: ['login.ts', 'app.ts', 'session.ts'] }]).stderr,
    ).toBe('');

    expect((await shownAt(repo.url())).steps[0]?.diff).toContain('rename from auth.ts');
  });
});

describe('folded steps', () => {
  const noProblems = {
    title: 'Regenerated files',
    folded: true,
    files: [{ path: 'schema.json', reason: 'Regenerated from the schema source.' }],
  };
  const folded = { ...noProblems, problems: ['schema.json still lists the removed field.'] };

  test('records a folded step where the session put it, with a reason per file and the problems it found', async () => {
    repo = makeRepo({ feature: { 'schema.json': '{"field": 1}\n' } });
    repo.run('start');

    const recorded = repo.record([loginSteps[1], folded, { ...loginSteps[0], files: ['login.ts'] }]);

    expect(recorded.stderr).toBe('');
    expect(recorded.stdout).toContain('Recorded 3 steps, 1 of them folded.');
    const { steps } = await shownAt(repo.url());
    expect(steps.map(step => step.kind)).toEqual(['step', 'folded', 'step']);
    expect(steps[1]).toMatchObject({
      id: '2',
      kind: 'folded',
      title: 'Regenerated files',
      files: [{ path: 'schema.json', reason: 'Regenerated from the schema source.' }],
      problems: ['schema.json still lists the removed field.'],
      decision: null,
    });
    expect(steps[1]?.diff).toContain('+{"field": 1}');
    expect(steps[1]?.diff).not.toContain('login');
  });

  test('a folded step needs a reason for each file; its problems may be left out', async () => {
    repo = makeRepo({ feature: { 'schema.json': '{}\n' } });
    repo.run('start');

    const refused = repo.record([...loginSteps, { ...folded, files: [{ path: 'schema.json', reason: ' ' }] }]);

    expect(refused.status).toBe(1);
    expect(refused.stderr).toContain('step 3: every file of a folded step needs a path and a reason');

    expect(repo.record([{ ...loginSteps[0], files: ['login.ts'] }, loginSteps[1], noProblems]).stderr).toBe('');
    expect((await shownAt(repo.url())).steps[2]).toMatchObject({ kind: 'folded', problems: [] });
  });
});

describe('walkthrough guide', () => {
  test('prints the shape of every recording command and of what listen prints', () => {
    repo = makeRepo();

    const guide = repo.run('guide');

    expect(guide.stderr).toBe('');
    expect(guide.status).toBe(0);
    for (const shape of [
      'walkthrough steps',
      '{"title": string, "explanation": string, "files": [path, ...]}',
      '{"title": string, "folded": true, "files": [{"path": path, "reason": string}, ...], "problems": [string, ...]}',
      'walkthrough listen',
      '{"kind": "ask", "id": string, "step": string, "text": string}',
      '{"kind": "reply", "id": string, "to": string, "text": string}',
      '{"kind": "stopped"}',
      'walkthrough say',
    ])
      expect(guide.stdout).toContain(shape);
  });

  test('the steps it gives as an example are recorded as they are', () => {
    const example = /Example:\n(\[[\s\S]*?\n\])\n/.exec(makeRepo().run('guide').stdout)?.[1] ?? '';
    const steps = JSON.parse(example) as { files: (string | { path: string })[] }[];
    const paths = steps.flatMap(step => step.files.map(file => (typeof file === 'string' ? file : file.path)));
    repo = makeRepo({ feature: Object.fromEntries(paths.map(file => [file, `${file}\n`])) });
    repo.run('start');

    const recorded = repo.record([...steps, { title: 'Login', explanation: 'Login.', files: ['login.ts', 'app.ts'] }]);

    expect(recorded.stderr).toBe('');
    expect(recorded.status).toBe(0);
  });
});
