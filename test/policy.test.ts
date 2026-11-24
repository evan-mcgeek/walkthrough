import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, test } from 'vitest';
import { inboxOf, makeRepo } from './helpers';

const TEMPLATE = fs.readFileSync(path.resolve(import.meta.dirname, '..', 'plugin', 'skills', 'walkthrough', 'REVIEW.md'), 'utf8');

const policyIn = (config: string) => path.join(config, 'walkthrough', 'REVIEW.md');

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

    const draft = path.join(inboxOf(none), 'REVIEW.md');
    fs.writeFileSync(draft, `${TEMPLATE}\n- One more rule.\n`);
    expect(repo.run('policy', 'save', '--file', draft).stdout).toBe(`Saved the review policy at ${policy}.\n`);
    expect(fs.existsSync(draft)).toBe(false);
    expect(repo.run('policy').stdout).toContain(`yours: the review policy at ${policy} is the person's own.`);
    expect(repo.run('policy', 'show').stdout).toBe(`${TEMPLATE}\n- One more rule.\n`);
  });

  test('still takes a copied template for the template after a release changes it, and shows the new one', () => {
    const sandbox = process.env['WALKTHROUGH_TEST_SANDBOX'] ?? '';
    const config = fs.mkdtempSync(path.join(sandbox, 'config-'));
    const plugin = fs.mkdtempSync(path.join(sandbox, 'plugin-'));
    for (const folder of ['bin', 'dist', 'skills'])
      fs.cpSync(path.resolve(import.meta.dirname, '..', 'plugin', folder), path.join(plugin, folder), { recursive: true });
    const run = (...args: string[]) =>
      spawnSync(path.join(plugin, 'bin', 'walkthrough'), args, {
        cwd: sandbox,
        encoding: 'utf8',
        env: { ...process.env, XDG_CONFIG_HOME: config },
      });
    const policy = policyIn(config);
    run('policy', 'init');

    const released = `${TEMPLATE}\n- A rule from the next release.\n`;
    fs.writeFileSync(path.join(plugin, 'skills', 'walkthrough', 'REVIEW.md'), released);

    expect(run('policy').stdout).toContain(`template: the review policy at ${policy} is an earlier unchanged template`);
    expect(run('policy', 'show').stdout).toBe(released);
    expect(fs.readFileSync(policy, 'utf8')).toBe(TEMPLATE);
  });

  test('takes a copy of a template from an earlier release for the template', () => {
    const config = fs.mkdtempSync(path.join(process.env['WALKTHROUGH_TEST_SANDBOX'] ?? '', 'config-'));
    const repo = makeRepo({ env: { XDG_CONFIG_HOME: config } });
    const policy = policyIn(config);
    // The template before its last change.
    const earlier = execFileSync('git', ['cat-file', 'blob', 'd071979b832119d3f41e57b65eac563d02d24cd4'], {
      cwd: import.meta.dirname,
    });
    fs.mkdirSync(path.dirname(policy), { recursive: true });
    fs.writeFileSync(policy, earlier);

    expect(repo.run('policy').stdout).toContain(`template: the review policy at ${policy} is an earlier unchanged template`);
    expect(repo.run('policy', 'show').stdout).toBe(TEMPLATE);
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
