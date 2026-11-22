// Saved walkthroughs are removed once they are over; anything not proven over is kept.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { currentRepo } from './change';
import { locked, readJson, writeJson } from './json-files';
import { stateDir } from './paths';
import { stopServer } from './server';
import { readWalkthrough, type Walkthrough } from './walkthrough';

/** Why the walkthrough is over, or null unless git or GitHub says so: a lookup that fails keeps it. */
function over(cwd: string, { branch, head }: Walkthrough): string | null {
  // Another repo can have the same folder name, and so the same state folder.
  if (spawnSync('git', ['cat-file', '-e', `${head}^{commit}`], { cwd }).status !== 0) return null;
  if (spawnSync('git', ['show-ref', '--exists', `refs/heads/${branch}`], { cwd }).status === 2)
    return 'its branch is gone';
  const list = spawnSync('gh', ['pr', 'list', '--head', branch, '--state', 'all', '--json', 'state'], {
    cwd,
    encoding: 'utf8',
    timeout: 15_000,
  });
  if (list.status !== 0) return null;
  let states: unknown[];
  try {
    states = (JSON.parse(list.stdout) as { state?: unknown }[]).map(pr => pr.state);
  } catch {
    return null;
  }
  // A branch can have a closed pull request and a newer open one.
  if (states.length === 0 || !states.every(state => state === 'MERGED' || state === 'CLOSED')) return null;
  return `its pull request is ${states.includes('MERGED') ? 'merged' : 'closed'}`;
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
    if (!walkthrough || !why) continue;
    await stopServer(dir);
    fs.rmSync(dir, { recursive: true, force: true });
    removed.push(`Removed the walkthrough of ${walkthrough.branch}: ${why}.`);
  }
  return removed;
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
