import fs from 'node:fs';
import path from 'node:path';
import { afterEach, describe, expect, test } from 'vitest';
import type { SessionView } from '../src/session';
import type { Walkthrough } from '../src/walkthrough';
import { ONE_STEP, inboxOf, makeRepo, type Repo } from './helpers';

let repo: Repo;
afterEach(() => {
  repo.run('stop');
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

  test('the checklist, notes and actions take a file too', () => {
    repo = makeRepo();
    const inbox = inboxOf(repo.run('start'));
    repo.record(ONE_STEP);
    const recordFrom = (command: string, input: unknown) => {
      const file = path.join(inbox, `${command}.json`);
      fs.writeFileSync(file, JSON.stringify(input));
      return repo.run(command, '--file', file);
    };

    expect(recordFrom('checklist', { title: 'Criteria', items: [{ status: 'met', text: 'Log in.' }] }).stdout).toContain(
      'Recorded the checklist Criteria with 1 item',
    );
    expect(recordFrom('note', [{ step: '1', label: 'Risk', text: 'Open to all.' }]).stdout).toContain('Recorded 1 note');
    expect(recordFrom('actions', [{ item: { type: 'walkthrough' }, actions: [{ id: 'go', label: 'Go' }] }]).stdout).toBe(
      'Recorded the actions of 1 item.\n',
    );
    expect(fs.readdirSync(inbox)).toEqual([]);
  });

  test('say takes its text from a file', async () => {
    repo = makeRepo();
    const inbox = inboxOf(repo.run('start'));
    const file = path.join(inbox, 'say.md');
    const text = 'It\'s "quoted", with `code` and $HOME,\n\non two lines.';
    fs.writeFileSync(file, text);

    expect(repo.run('say', '--file', file).stdout).toBe('Said on the page.\n');
    const session = (await (await fetch(`${repo.url()}data/session.json`)).json()) as SessionView;
    expect(session.conversation[0]?.text).toBe(text);
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
