import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, test } from 'vitest';
import { makeRepo } from './helpers';

const TEMPLATE = fs.readFileSync(path.resolve(import.meta.dirname, '..', 'plugin', 'skills', 'walkthrough', 'REVIEWER.md'), 'utf8');

const policyIn = (config: string) => path.join(config, 'walkthrough', 'REVIEWER.md');

describe('walkthrough policy', () => {
  test('goes from none to the template to the person own, comparing and copying bytes only', () => {
    const config = fs.mkdtempSync(path.join(process.env['WALKTHROUGH_TEST_SANDBOX'] ?? '', 'config-'));
    const repo = makeRepo({ env: { XDG_CONFIG_HOME: config } });
    const policy = policyIn(config);

    const none = repo.run('policy');
    expect(none.stderr).toBe('');
    expect(none.stdout).toContain(`none: there is no review policy at ${policy}, so the template applies.`);
    expect(repo.run('policy', 'show').stdout).toBe(TEMPLATE);

    expect(repo.run('policy', 'init').stdout).toBe(`Copied the template to ${policy}.\n`);
    expect(fs.readFileSync(policy, 'utf8')).toBe(TEMPLATE);
    expect(repo.run('policy').stdout).toContain(`template: the review policy at ${policy} is the unchanged template.`);
    expect(repo.run('policy', 'init').stderr).toContain(`there is a review policy at ${policy} already`);

    const inbox = /files in (\S+) and save/.exec(none.stdout)?.[1] ?? '';
    const draft = path.join(inbox, 'REVIEWER.md');
    fs.writeFileSync(draft, `${TEMPLATE}\n- One more rule.\n`);
    expect(repo.run('policy', 'save', '--file', draft).stdout).toBe(`Saved the review policy at ${policy}.\n`);
    expect(fs.existsSync(draft)).toBe(false);
    expect(repo.run('policy').stdout).toContain(`yours: the review policy at ${policy} is the person's own.`);
    expect(repo.run('policy', 'show').stdout).toBe(`${TEMPLATE}\n- One more rule.\n`);
  });

  test('refuses to save an empty policy', () => {
    const config = fs.mkdtempSync(path.join(process.env['WALKTHROUGH_TEST_SANDBOX'] ?? '', 'config-'));
    const repo = makeRepo({ env: { XDG_CONFIG_HOME: config } });
    const empty = path.join(config, 'empty.md');
    fs.writeFileSync(empty, '\n');

    expect(repo.run('policy', 'save', '--file', empty).stderr).toContain('the review policy is empty');
    expect(fs.existsSync(policyIn(config))).toBe(false);
  });
});
