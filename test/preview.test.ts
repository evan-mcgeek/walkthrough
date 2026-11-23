import fs from 'node:fs';
import path from 'node:path';
import { afterEach, expect, test } from 'vitest';
import { pixelSize } from '../src/preview';
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

test('serves a changed image as it was at the base, under its base path when renamed, and no other base file', async () => {
  const svg = (width: number) => `<svg xmlns="http://www.w3.org/2000/svg" width="${String(width)}" height="4"/>\n`;
  repo = makeRepo({
    start: { 'icons/cart.svg': svg(1), 'icons/old.svg': svg(2), 'docs/flow.svg': svg(3) },
    feature: { 'icons/cart.svg': svg(10), 'icons/added.svg': svg(4), 'docs/guide.md': '![Flow](flow.svg)\n' },
  });
  git(repo.dir, 'mv', 'icons/old.svg', 'icons/new.svg');
  git(repo.dir, 'commit', '-m', 'Rename the icon');
  repo.run('start');
  const baseOf = (file: string) => fetch(`${repo.url()}file?path=${encodeURIComponent(file)}&at=base`);

  const cart = await baseOf('icons/cart.svg');
  const renamed = await baseOf('icons/old.svg');

  expect(cart.status).toBe(200);
  expect(await cart.text()).toBe(svg(1));
  expect(cart.headers.get('content-type')).toBe('image/svg+xml');
  expect(cart.headers.get('content-security-policy')).toContain('sandbox');
  expect(renamed.status).toBe(200);
  expect(await renamed.text()).toBe(svg(2));
  expect(await (await fileAt('icons/cart.svg')).text()).toBe(svg(10));
  expect((await baseOf('icons/new.svg')).status).toBe(404);
  expect((await baseOf('icons/added.svg')).status).toBe(404);
  expect((await baseOf('docs/flow.svg')).status).toBe(404);
  expect((await baseOf('app.ts')).status).toBe(404);
});

test('reads the pixel size from the header of each raster image the page previews, and none from anything else', () => {
  const bytes = (...parts: (string | number[])[]) => Buffer.concat(parts.map(part => (typeof part === 'string' ? Buffer.from(part, 'latin1') : Buffer.from(part))));
  const jpeg = bytes([0xff, 0xd8, 0xff, 0xe0, 0, 4, 0, 0, 0xff, 0xc0, 0, 11, 8], [0x03, 0x20, 0x05, 0x00], [3, 1, 0x22, 0]);
  const webp = (chunk: string, body: number[]) => bytes('RIFF', [0, 0, 0, 0], 'WEBP', chunk, [0, 0, 0, 0], body, new Array<number>(10).fill(0));
  const bmp = bytes('BM', new Array<number>(16).fill(0), [0x00, 0x05, 0, 0], [0xe0, 0xfc, 0xff, 0xff]);

  expect(pixelSize(PNG)).toEqual({ width: 1, height: 1 });
  expect(pixelSize(bytes('GIF89a', [0x00, 0x05, 0x20, 0x03, 0, 0]))).toEqual({ width: 1280, height: 800 });
  expect(pixelSize(jpeg)).toEqual({ width: 1280, height: 800 });
  expect(pixelSize(webp('VP8X', [0, 0, 0, 0, 0xff, 0x04, 0, 0x1f, 0x03, 0]))).toEqual({ width: 1280, height: 800 });
  expect(pixelSize(webp('VP8L', [0x2f, 0xff, 0xc4, 0xc7, 0]))).toEqual({ width: 1280, height: 800 });
  expect(pixelSize(webp('VP8 ', [0, 0, 0, 0x9d, 0x01, 0x2a, 0x00, 0x05, 0x20, 0x03]))).toEqual({ width: 1280, height: 800 });
  expect(pixelSize(bmp)).toEqual({ width: 1280, height: 800 });
  expect(pixelSize(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"/>'))).toBeNull();
  expect(pixelSize(Buffer.from([0xff, 0xd8, 0xff]))).toBeNull();
});
