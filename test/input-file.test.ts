import fs from 'node:fs';
import path from 'node:path';
import { afterEach, describe, expect, test } from 'vitest';
import type { Walkthrough } from '../src/walkthrough';
import { ONE_STEP, inboxOf, makeRepo, postTo, type Repo, viewAt } from './helpers';

let repo: Repo;
afterEach(async () => {
  repo.run('stop');
  await repo.settled();
});

describe('recording from a file', () => {
  test('start prints an inbox, and steps takes a file written there and removes it', async () => {
    repo = makeRepo();
    const inbox = inboxOf(repo.run('start'));
    const file = path.join(inbox, 'steps.json');
    fs.writeFileSync(file, JSON.stringify(ONE_STEP));

    const recorded = repo.run('steps', '--file', file);

    expect(recorded.stderr).toBe('');
    expect(recorded.stdout).toContain('Recorded 1 step: 1 (Login).');
    expect(fs.existsSync(file)).toBe(false);
    const shown = (await (await fetch(`${repo.url()}data/walkthrough.json`)).json()) as Walkthrough;
    expect(shown.steps.map(step => step.title)).toEqual(['Login']);
  });

  test('comment, threads, criteria and say take a file too, and the inbox is emptied', async () => {
    repo = makeRepo();
    const inbox = inboxOf(repo.run('start'));
    repo.record(ONE_STEP);
    const fileWith = (name: string, input: string) => {
      const file = path.join(inbox, name);
      fs.writeFileSync(file, input);
      return file;
    };
    const recordFrom = (command: string, input: unknown) => repo.run(command, '--file', fileWith(`${command}.json`, JSON.stringify(input)));

    expect(recordFrom('comment', [{ file: 'login.ts', lines: [1, 1], body: 'Open to all.' }]).stdout).toContain('Recorded 1 comment');
    expect(recordFrom('threads', []).stdout).toBe('Recorded 0 threads.\n');
    expect(recordFrom('criteria', [{ text: 'Logs in', status: 'met' }]).stdout).toBe('Recorded 1 criterion.\n');
    await postTo(repo.url(), '/ask', { file: 'login.ts', lines: [1, 1], text: 'Why?' });
    const ask = JSON.parse((await repo.background('listen').ended).stdout) as { id: string };
    const text = 'It\'s "quoted", with `code` and $HOME,\n\non two lines.';
    expect(repo.run('say', '--answer', ask.id, '--file', fileWith('say.md', text)).stdout).toBe('Answered on the page.\n');
    expect((await viewAt(repo.url())).threads.flatMap(one => one.comments).at(-1)?.body).toBe(text);
    expect(fs.readdirSync(inbox)).toEqual([]);
  });

  test('a file outside an inbox is read and kept', () => {
    repo = makeRepo();
    repo.run('start');
    const file = path.join(path.dirname(repo.dir), 'steps.json');
    fs.writeFileSync(file, JSON.stringify(ONE_STEP));

    expect(repo.run('steps', '--file', file).stdout).toContain('Recorded 1 step');
    expect(fs.existsSync(file)).toBe(true);
  });
});
