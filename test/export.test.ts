import fs from 'node:fs';
import path from 'node:path';
import { afterEach, describe, expect, test } from 'vitest';
import { ONE_STEP, makeRepo, type Repo } from './helpers';

let repo: Repo;
afterEach(async () => {
  repo.run('stop');
  await repo.settled();
});

const tokenOf = (url: string) => new URL(url).pathname.split('/')[2] ?? '';

describe('walkthrough export', () => {
  test('writes one HTML file that loads nothing else and carries no token or local path', () => {
    repo = makeRepo();
    repo.run('start');
    repo.record(ONE_STEP);
    repo.record([{ step: '1', file: 'login.ts', lines: [1, 1], label: 'Risk', text: 'Everyone gets in.' }], 'note');
    const out = path.join(path.dirname(repo.dir), 'login.html');

    const exported = repo.run('export', '--out', out);

    expect(exported.stderr).toBe('');
    expect(exported.stdout).toContain(`Exported the walkthrough of feature/login to ${out}.`);
    const html = fs.readFileSync(out, 'utf8');
    expect(html).toContain('Everyone gets in.');
    expect(html).toContain('export const login = () => true;');
    expect(html).toMatch(/<meta http-equiv="content-security-policy" content="default-src 'none'; script-src 'sha256-/);
    expect(html).not.toMatch(/<(script|link|img)\b[^>]*\b(src|href)="(?!data:)/i);
    // The favicon travels inside the file, after the policy that allows it.
    expect(html).toMatch(/content-security-policy[\s\S]*<link rel="icon" href="data:image\/svg\+xml;base64,/);
    // The self-hosted code font travels inside the file.
    expect(html).toContain('font-src data:');
    expect(html).toContain('data:font/woff2;base64,');
    expect(html).not.toContain(tokenOf(repo.url()));
    expect(html).not.toContain(repo.dir);
    expect(html).not.toContain(repo.state);
  });

  test('without --out writes into the walkthrough state, leaving the working copy alone', () => {
    repo = makeRepo();
    repo.run('start');

    const exported = repo.run('export');

    const out = /to (.+\.html)\.$/m.exec(exported.stdout)?.[1] ?? '';
    expect(out.startsWith(repo.state)).toBe(true);
    expect(fs.existsSync(out)).toBe(true);
    expect(repo.run('start').stdout).not.toContain('uncommitted');
  });

  test('walkthrough guide names export and list', () => {
    repo = makeRepo();

    const guide = repo.run('guide').stdout;

    expect(guide).toContain('walkthrough export [--out <file>]');
    expect(guide).toContain('walkthrough stop --list ends it');
  });

  test('of a walkthrough never started is refused', () => {
    repo = makeRepo();

    const exported = repo.run('export');

    expect(exported.status).toBe(1);
    expect(exported.stderr).toContain('there is no walkthrough of feature/login; run walkthrough start');
  });
});
