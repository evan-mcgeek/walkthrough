// Saved walkthroughs are removed once git shows they are over, or when asked; anything not proven over is kept.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { currentRepo } from './change';
import { locked, readJson, writeJson } from './json-files';
import { stateDir } from './paths';
import { stopServer } from './server';
import { readWalkthrough, type Walkthrough, walkthroughDir } from './walkthrough';

const gitStatus = (cwd: string, ...args: string[]) => spawnSync('git', args, { cwd, stdio: 'ignore' }).status;

/** Why the walkthrough is over, or null unless git says so. */
function over(cwd: string, { branch, target, head }: Walkthrough): string | null {
  // Another repo can have the same folder name, and so the same state folder.
  if (gitStatus(cwd, 'cat-file', '-e', `${head}^{commit}`) !== 0) return null;
  if (gitStatus(cwd, 'show-ref', '--exists', `refs/heads/${branch}`) === 2) return 'its branch is gone';
  if (gitStatus(cwd, 'merge-base', '--is-ancestor', head, target) === 0) return `its head is merged into ${target}`;
  return null;
}

async function remove(dir: string, walkthrough: Walkthrough, why: string): Promise<string> {
  await stopServer(dir);
  fs.rmSync(dir, { recursive: true, force: true });
  return `Removed the walkthrough of ${walkthrough.branch}: ${why}.`;
}

/** Removes the repo's walkthroughs that are over, stopping their pages, and says what was removed. */
export async function prune(cwd: string): Promise<string[]> {
  const repoDir = path.join(stateDir(), currentRepo(cwd));
  const removed: string[] = [];
  if (!fs.existsSync(repoDir)) return removed;
  for (const entry of fs.readdirSync(repoDir, { withFileTypes: true, encoding: 'utf8' })) {
    const dir = path.join(repoDir, entry.name);
    const walkthrough = entry.isDirectory() ? readWalkthrough(dir) : null;
    const why = walkthrough && over(cwd, walkthrough);
    if (walkthrough && why) removed.push(await remove(dir, walkthrough, why));
  }
  return removed;
}

/** Removes the repo's walkthrough of `branch` whether or not it is over. */
export async function pruneOne(cwd: string, branch: string): Promise<string> {
  const dir = walkthroughDir({ repo: currentRepo(cwd), branch });
  const walkthrough = readWalkthrough(dir);
  if (!walkthrough) throw new Error(`there is no walkthrough of ${branch}`);
  return remove(dir, walkthrough, 'asked to');
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** Prunes the repo's walkthroughs unless that was done in the last day. */
export async function pruneDaily(cwd: string): Promise<string[]> {
  const marker = path.join(stateDir(), currentRepo(cwd), 'last-prune.json');
  const due = locked(marker, () => {
    const { at = '' } = readJson<{ at?: string }>(marker, {});
    if (Date.now() - Date.parse(at) < DAY_MS) return false;
    writeJson(marker, { at: new Date().toISOString() });
    return true;
  });
  return due ? prune(cwd) : [];
}
