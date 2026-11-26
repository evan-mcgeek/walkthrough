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
    const commented = repo.record([{ file: 'login.ts', lines: [1, 1], body: 'Everyone gets in.\n\n```suggestion\nexport const login = () => false;\n```' }], 'comment');
    const comment = /: ([0-9a-f]{8})\./.exec(commented.stdout)?.[1];
    repo.record([{ text: 'Logs in', status: 'partly', comment, missing: 'Anyone gets in.' }], 'criteria');
    const out = path.join(path.dirname(repo.dir), 'login.html');

    const exported = repo.run('export', '--out', out);

    expect(exported.stderr).toBe('');
    expect(exported.stdout).toContain(`Exported the walkthrough of feature/login to ${out}.`);
    const html = fs.readFileSync(out, 'utf8');
    expect(html).toContain('Everyone gets in.');
    expect(html).toContain('Logs in: Partly met. Anyone gets in.');
    expect(html).toContain('<div class="suggestion-head">Suggested change</div>');
    const text = html.replace(/<\/?span[^>]*>/g, '');
    expect(text).toMatch(/<tr class="suggestion-del">.*login = \(\) =&gt; true;<\/td><\/tr><tr class="suggestion-add">.*login = \(\) =&gt; false;/);
    expect(text).toContain('login = () =&gt; true;');
    // Its code, the suggested change's lines too, takes the syntax classes, whose tokens are in the file's one stylesheet.
    expect(html).toContain('<span class="sx-k">const</span>');
    expect(html).toMatch(/<tr class="suggestion-del">.*?<span class="sx-k">export<\/span>.*?<tr class="suggestion-add">.*?<span class="sx-k">export<\/span>/);
    expect(html).toContain('--syntax-keyword: light-dark(#b0282a, #f98795)');
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
