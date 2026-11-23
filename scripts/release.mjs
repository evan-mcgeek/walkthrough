// Commits the built plugin to the local `release` branch, which holds only what a marketplace install needs.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const BRANCH = 'refs/heads/release';
const git = (args, { env, input } = {}) =>
  execFileSync('git', args, { cwd: root, encoding: 'utf8', env: { ...process.env, ...env }, input }).trim();
const revision = rev => {
  try {
    return git(['rev-parse', '--verify', '--quiet', rev]);
  } catch {
    return '';
  }
};

// So the release is the build of one commit.
if (git(['status', '--porcelain'])) {
  console.error('release: commit or set aside your changes first');
  process.exit(1);
}
execFileSync(process.execPath, [path.join(root, 'scripts', 'build.mjs')], { stdio: 'inherit' });

// A separate index, so the branch checked out and its index stay as they are.
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'walkthrough-release-'));
const env = { GIT_INDEX_FILE: path.join(scratch, 'index') };
try {
  git(['add', '--', 'plugin', 'LICENSE', 'README.md'], { env });
  git(['add', '--force', '--', 'plugin/dist'], { env });
  // On the release branch the plugin sits beside the manifest, which the development branch points at.
  const manifest = JSON.parse(fs.readFileSync(path.join(root, '.claude-plugin', 'marketplace.json'), 'utf8'));
  for (const plugin of manifest.plugins) plugin.source = './plugin';
  const blob = git(['hash-object', '-w', '--stdin'], { input: `${JSON.stringify(manifest, null, 2)}\n` });
  git(['update-index', '--add', '--cacheinfo', `100644,${blob},.claude-plugin/marketplace.json`], { env });
  const tree = git(['write-tree'], { env });

  const local = revision(BRANCH);
  // A fresh clone has the release branch only on origin, and installs track its history.
  const parent = local || revision('refs/remotes/origin/release');
  const head = revision('HEAD');
  if (parent && revision(`${parent}^{tree}`) === tree) {
    if (!local) git(['update-ref', BRANCH, parent, '']);
    console.log(`release: already up to date at ${parent.slice(0, 7)}`);
  } else {
    const commit = git([
      'commit-tree',
      tree,
      ...(parent ? ['-p', parent] : []),
      '-m',
      `Release ${git(['rev-parse', '--short', head])}`,
    ]);
    // Only if the branch has not moved meanwhile; an empty old value means it must not exist yet.
    git(['update-ref', BRANCH, commit, local]);
    console.log(`release: ${commit.slice(0, 7)} on release, built from ${head.slice(0, 7)}`);
  }
} finally {
  fs.rmSync(scratch, { recursive: true, force: true });
}
