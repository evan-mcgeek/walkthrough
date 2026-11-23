import fs from 'node:fs';
import path from 'node:path';
import { afterEach, expect, test } from 'vitest';
import { git, makeRepo, type Repo } from './helpers';

let repo: Repo;
afterEach(() => {
  repo.run('stop');
});

const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64',
);

/** A walkthrough whose change adds a Markdown file and an image, with the Markdown edited after the head commit. */
function previewRepo(): Repo {
  repo = makeRepo({ start: { 'README.md': '# Shop\n' }, feature: { 'docs/guide.md': '# Guide\n\nAt head.\n' } });
  fs.writeFileSync(path.join(repo.dir, 'logo.png'), PNG);
  git(repo.dir, 'add', 'logo.png');
  git(repo.dir, 'commit', '-m', 'Add the logo');
  fs.writeFileSync(path.join(repo.dir, 'docs', 'guide.md'), '# Guide\n\nNot committed.\n');
  repo.run('start');
  return repo;
}

const fileAt = (file: string) => fetch(`${repo.url()}file?path=${encodeURIComponent(file)}`);

test('serves a changed Markdown file and image as they are at the head commit', async () => {
  previewRepo();

  const markdown = await fileAt('docs/guide.md');
  const image = await fileAt('logo.png');

  expect(markdown.status).toBe(200);
  expect(markdown.headers.get('content-type')).toBe('text/markdown; charset=utf-8');
  expect(await markdown.text()).toBe('# Guide\n\nAt head.\n');
  expect(image.status).toBe(200);
  expect(image.headers.get('content-type')).toBe('image/png');
  expect(Buffer.from(await image.arrayBuffer())).toEqual(PNG);
  // An SVG opened on its own cannot run script in the page's origin.
  expect(image.headers.get('content-security-policy')).toContain('sandbox');
});

test('serves nothing outside the change, nothing it cannot preview, and nothing without the token', async () => {
  previewRepo();

  expect((await fileAt('README.md')).status).toBe(404);
  expect((await fileAt('login.ts')).status).toBe(404);
  expect((await fileAt('../state/token')).status).toBe(404);
  expect((await fetch(new URL('/file?path=logo.png', repo.url()))).status).toBe(404);
});

test('previews still load after the worktree the walkthrough was started in is removed', async () => {
  repo = makeRepo({ feature: { 'docs/guide.md': '# Guide\n' } });
  const worktree = path.join(path.dirname(repo.dir), 'login-worktree');
  git(repo.dir, 'checkout', 'main');
  git(repo.dir, 'worktree', 'add', worktree, 'feature/login');
  repo.runIn(worktree, 'start');
  git(repo.dir, 'worktree', 'remove', worktree);
  // Back on the branch, so stopping after the test finds its walkthrough.
  git(repo.dir, 'checkout', 'feature/login');

  const markdown = await fileAt('docs/guide.md');

  expect(markdown.status).toBe(200);
  expect(await markdown.text()).toBe('# Guide\n');
});

test('serves an unchanged image a changed Markdown file shows, and no other unchanged file', async () => {
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="4" height="4"/>\n';
  repo = makeRepo({
    start: { 'docs/img/flow.svg': svg, 'shared/logo.svg': svg, 'other.svg': svg, 'docs/notes.md': '# Notes\n' },
    feature: { 'docs/guide.md': '# Guide\n\n![Flow](img/flow.svg)\n\n![Logo](../shared/logo.svg)\n\n[Notes](notes.md)\n' },
  });
  repo.run('start');

  const flow = await fileAt('docs/img/flow.svg');

  expect(flow.status).toBe(200);
  expect(await flow.text()).toBe(svg);
  expect(flow.headers.get('content-security-policy')).toContain('sandbox');
  expect((await fileAt('shared/logo.svg')).status).toBe(200);
  expect((await fileAt('other.svg')).status).toBe(404);
  expect((await fileAt('docs/notes.md')).status).toBe(404);
});
