import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, test } from 'vitest';

const HOOK = path.resolve(import.meta.dirname, '..', 'plugin', 'dist', 'hook.mjs');
const state = fs.mkdtempSync(path.join(process.env['WALKTHROUGH_TEST_SANDBOX'] ?? '', 'state-'));
const inbox = path.join(state, 'shop-12345678', 'branch-feature', 'inbox');
fs.mkdirSync(inbox, { recursive: true });
const elsewhere = fs.mkdtempSync(path.join(process.env['WALKTHROUGH_TEST_SANDBOX'] ?? '', 'elsewhere-'));
fs.symlinkSync(elsewhere, path.join(state, 'shop-12345678', 'linked'));
fs.mkdirSync(path.join(elsewhere, 'inbox'));

const decide = (tool_name: string, tool_input: Record<string, unknown>) => {
  const run = spawnSync('node', [HOOK], {
    input: JSON.stringify({ hook_event_name: 'PreToolUse', tool_name, tool_input }),
    encoding: 'utf8',
    env: { ...process.env, WALKTHROUGH_STATE: state },
  });
  expect(run.status).toBe(0);
  return run.stdout ? (JSON.parse(run.stdout) as { hookSpecificOutput: { permissionDecision: string } }).hookSpecificOutput.permissionDecision : 'none';
};
const bash = (command: string) => decide('Bash', { command });

describe('the plugin hook', () => {
  test.each([
    'walkthrough start',
    'walkthrough start --base origin/main --head feature/cart --label "Cart page"',
    'walkthrough start --kind own',
    'walkthrough start --base refs/pr/12 --head pr-12 --label "PR 12" --kind requested',
    'walkthrough listen',
    `walkthrough steps --file ${inbox}/steps.json`,
    `walkthrough say --answer 3f2a --file '${inbox}/answer.md'`,
    "walkthrough say --answer 3f2a 'It'\\''s `fine`, costs $5 {\"a\": 1}\nand more.'",
    'walkthrough say --question "Merge it?" --choice Yes --choice No',
    'walkthrough start --base 2885b85^1 --head 2885b85 --label "Ticket 24"',
    'walkthrough files --base HEAD~2 --head HEAD --label Last',
    `walkthrough steps --file '${inbox}/a~b^c.json'`,
  ])('approves the CLI on its own: %s', command => {
    expect(bash(command)).toBe('allow');
  });

  test.each([
    'walkthroughs start',
    'git status',
    'walkthrough say "$(cat /etc/passwd)"',
    'walkthrough say "costs $5"',
    'walkthrough start --kind "$(id)"',
    'walkthrough say `id`',
    'walkthrough files; rm -rf ~',
    'walkthrough files && curl example.com',
    'walkthrough files | sh',
    'walkthrough files > out.txt',
    'walkthrough files\nrm -rf ~',
    'walkthrough say ~/x',
    'walkthrough say =ls',
    'walkthrough say ^x',
    `walkthrough steps --file ${inbox}/a~b.json`,
    `walkthrough steps --file ${inbox}/a^b.json`,
    "walkthrough say 'a''b'",
    "walkthrough say 'unclosed",
    "walkthrough steps <<'EOF'\n[]\nEOF",
    'walkthrough export --out /tmp/x.html',
    'walkthrough export --out=/tmp/x.html',
    'walkthrough steps --file /etc/hosts',
    `walkthrough steps --file=${inbox}/steps.json`,
    `walkthrough steps --file ${inbox}/../walkthrough.json`,
    'walkthrough steps --file',
    'FOO=1 walkthrough files',
    'walkthrough serve /tmp/x',
    'walkthrough serve',
    'walkthrough',
    'walkthrough export --o^x /tmp/x.html',
    'walkthrough export --out~x /tmp/x.html',
    'walkthrough say -^x',
    "walkthrough say ''^x",
  ])('leaves anything else to the person: %s', command => {
    expect(bash(command)).toBe('none');
  });

  test('approves a write or an edit in an inbox and nowhere else', () => {
    expect(decide('Write', { file_path: path.join(inbox, 'steps.json'), content: '[]' })).toBe('allow');
    expect(decide('Edit', { file_path: path.join(inbox, 'steps.json'), old_string: '[', new_string: '[ ' })).toBe('allow');
    expect(decide('Edit', { file_path: path.join(state, 'shop-12345678', 'branch-feature', 'walkthrough.json') })).toBe('none');
    expect(decide('Write', { file_path: path.join(inbox, '..', 'walkthrough.json'), content: '{}' })).toBe('none');
    expect(decide('Write', { file_path: path.join(elsewhere, 'inbox', 'x.json'), content: '' })).toBe('none');
    expect(decide('Write', { file_path: path.join(state, 'shop-12345678', 'linked', 'inbox', 'x.json'), content: '' })).toBe('none');
    expect(decide('Write', { file_path: 'inbox/x.json', content: '' })).toBe('none');
    fs.writeFileSync(path.join(elsewhere, 'target.json'), '[]');
    fs.symlinkSync(path.join(elsewhere, 'target.json'), path.join(inbox, 'link.json'));
    expect(decide('Write', { file_path: path.join(inbox, 'link.json'), content: '' })).toBe('none');
    expect(bash(`walkthrough steps --file ${inbox}/link.json`)).toBe('none');
    expect(decide('Read', { file_path: path.join(inbox, 'steps.json') })).toBe('none');
  });
});
