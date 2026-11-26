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
    repo.record([{ file: 'login.ts', lines: [1, 1], body: 'Everyone gets in.\n\n```suggestion\nexport const login = () => false;\n```' }], 'comment');
    repo.record([{ text: 'Logs in', status: 'partly' }], 'criteria');
    const out = path.join(path.dirname(repo.dir), 'login.html');

    const exported = repo.run('export', '--out', out);

    expect(exported.stderr).toBe('');
    expect(exported.stdout).toContain(`Exported the walkthrough of feature/login to ${out}.`);
    const html = fs.readFileSync(out, 'utf8');
    expect(html).toContain('Everyone gets in.');
    expect(html).toContain('Logs in: Partly met');
    expect(html).toContain('<div class="suggestion-head">Suggested change</div>');
    expect(html).toMatch(/<tr class="suggestion-del">.*login = \(\) =&gt; true;<\/td><\/tr><tr class="suggestion-add">.*login = \(\) =&gt; false;/);
    expect(html.replace(/<\/?span[^>]*>/g, '')).toContain('login = () =&gt; true;');
    // Its code is coloured, with each colour's rule in the file's one stylesheet.
    expect(html).toContain('<span class="hl-d73a49-f97583">const</span>');
    expect(html).toContain('.hl-d73a49-f97583{color:light-dark(#d73a49,#f97583)}');
    expect(html).toMatch(/<meta http-equiv="content-security-policy" content="default-src 'none'; style-src 'sha256-/);
    expect(html).not.toMatch(/<(script|link|img)\b/i);
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

  test('of a walkthrough never started is refused', () => {
    repo = makeRepo();

    const exported = repo.run('export');

    expect(exported.status).toBe(1);
    expect(exported.stderr).toContain('there is no walkthrough of feature/login; run walkthrough start');
  });
});
