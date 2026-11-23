import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, test } from 'vitest';
import { git } from './helpers';

const RELEASE = path.resolve(import.meta.dirname, '..', 'scripts', 'release.mjs');
const IDENTITY = { GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@t', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@t' };

/** A development repo shaped like this one, with a build that only writes plugin/dist. */
function project(dir: string) {
  const files: Record<string, string> = {
    'scripts/build.mjs':
      "import fs from 'node:fs';\nfs.mkdirSync(new URL('../plugin/dist', import.meta.url), { recursive: true });\n" +
      "fs.writeFileSync(new URL('../plugin/dist/walkthrough.mjs', import.meta.url), '');\n",
    'plugin/README.md': 'plugin\n',
    '.claude-plugin/marketplace.json': JSON.stringify({ plugins: [{ name: 'walkthrough', source: './plugin' }] }),
    '.gitignore': 'plugin/dist/\n',
    LICENSE: 'MIT\n',
    'README.md': 'readme\n',
  };
  for (const [name, text] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(dir, name)), { recursive: true });
    fs.writeFileSync(path.join(dir, name), text);
  }
  fs.copyFileSync(RELEASE, path.join(dir, 'scripts', 'release.mjs'));
  git(dir, 'add', '-A');
  git(dir, 'commit', '-m', 'Start');
}

const release = (dir: string) =>
  spawnSync(process.execPath, [path.join(dir, 'scripts', 'release.mjs')], {
    cwd: dir,
    encoding: 'utf8',
    env: { ...process.env, ...IDENTITY },
  });

describe('npm run release', () => {
  test('in a fresh clone goes on from the release branch on origin, so the documented push goes through', () => {
    const root = fs.mkdtempSync(path.join(process.env['WALKTHROUGH_TEST_SANDBOX'] ?? '', 'release-'));
    const origin = path.join(root, 'origin.git');
    const first = path.join(root, 'first');
    const fresh = path.join(root, 'fresh');
    git(root, 'init', '--bare', '-b', 'main', origin);
    git(root, 'init', '-b', 'main', first);
    project(first);
    expect(release(first).status).toBe(0);
    git(first, 'remote', 'add', 'origin', origin);
    git(first, 'push', 'origin', 'main', 'release');

    git(root, 'clone', origin, fresh);
    fs.appendFileSync(path.join(fresh, 'README.md'), 'more\n');
    git(fresh, 'commit', '-am', 'More');
    const released = release(fresh);

    expect(released.stderr).toBe('');
    expect(git(fresh, 'rev-parse', 'release^')).toBe(git(fresh, 'rev-parse', 'origin/release'));
    git(fresh, 'push', 'origin', 'main', 'release');
  });
});
