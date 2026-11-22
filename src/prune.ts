// Saved walkthroughs are removed once git shows they are over, or when asked; anything not proven over is kept.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { currentRepo } from './change';
import { locked, readJson, writeJson } from './json-files';
import { stateDir } from './paths';
import { stopServer } from './server';
import { nameOf } from './items';
import { readWalkthrough, type Walkthrough } from './walkthrough';

const gitStatus = (cwd: string, ...args: string[]) => spawnSync('git', args, { cwd, stdio: 'ignore' }).status;

function over(cwd: string, walkthrough: Walkthrough): string | null {
  const { target, head } = walkthrough;
  if (walkthrough.kind === 'branch' && gitStatus(cwd, 'show-ref', '--exists', `refs/heads/${walkthrough.branch}`) === 2)
    return 'its branch is gone';
  if (gitStatus(cwd, 'merge-base', '--is-ancestor', head, target) === 0) return `its head is merged into ${target}`;
  return null;
}

async function remove(dir: string, name: string, why: string): Promise<string> {
  await stopServer(dir);
  fs.rmSync(dir, { recursive: true, force: true });
  return `Removed the walkthrough of ${name}: ${why}.`;
}

export async function prune(cwd: string): Promise<string[]> {
  const repoDir = path.join(stateDir(), currentRepo(cwd));
  const removed: string[] = [];
  if (!fs.existsSync(repoDir)) return removed;
  for (const entry of fs.readdirSync(repoDir, { withFileTypes: true, encoding: 'utf8' })) {
    const dir = path.join(repoDir, entry.name);
    const walkthrough = entry.isDirectory() ? readWalkthrough(dir) : null;
    const why = walkthrough && over(cwd, walkthrough);
    if (walkthrough && why) removed.push(await remove(dir, nameOf(walkthrough), why));
  }
  return removed;
}

export async function pruneOne(dir: string, name: string): Promise<string> {
  if (!readWalkthrough(dir)) throw new Error(`there is no walkthrough of ${name}`);
  return remove(dir, name, 'asked to');
}

const DAY_MS = 24 * 60 * 60 * 1000;

export async function pruneDaily(cwd: string): Promise<string[]> {
  const marker = path.join(stateDir(), currentRepo(cwd), 'last-prune.json');
  const due = await locked(marker, () => {
    const { at = '' } = readJson<{ at?: string }>(marker, {});
    if (Date.now() - Date.parse(at) < DAY_MS) return false;
    writeJson(marker, { at: new Date().toISOString() });
    return true;
  });
  return due ? prune(cwd) : [];
}
