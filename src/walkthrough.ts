// A walkthrough's saved state: one folder per walkthrough under the state folder, written only by this CLI.
import path from 'node:path';
import type { Change } from './change';
import { locked, readJson, writeJson } from './json-files';
import { stateDir } from './paths';

export const DECISIONS = ['approved'] as const;
export type Decision = (typeof DECISIONS)[number];
export type Step = { id: string; title: string; diff: string; decision: Decision | null };
export type Walkthrough = {
  kind: 'branch';
  branch: string;
  target: string;
  base: string;
  head: string;
  steps: Step[];
};

const file = (dir: string) => path.join(dir, 'walkthrough.json');

/** The folder of the walkthrough of `change`'s branch; `~` cannot appear in a branch name, so `/` maps to it one to one. */
export const walkthroughDir = (change: Pick<Change, 'repo' | 'branch'>) =>
  path.join(stateDir(), change.repo, `branch-${change.branch.replaceAll('/', '~')}`);

export const readWalkthrough = (dir: string) => readJson<Walkthrough | null>(file(dir), null);

/** The saved walkthrough of the change when it is pinned to the same head, else a new one. */
export function openWalkthrough(change: Change): { dir: string; walkthrough: Walkthrough; resumed: boolean } {
  const dir = walkthroughDir(change);
  return locked(file(dir), () => {
    const saved = readWalkthrough(dir);
    if (saved?.head === change.head && saved.base === change.base) return { dir, walkthrough: saved, resumed: true };
    const walkthrough: Walkthrough = {
      kind: 'branch',
      branch: change.branch,
      target: change.target,
      base: change.base,
      head: change.head,
      steps: [{ id: 'change', title: 'The whole change', diff: change.diff, decision: null }],
    };
    writeJson(file(dir), walkthrough);
    return { dir, walkthrough, resumed: false };
  });
}

/** The walkthrough with the decision recorded, or null when it has no such step. */
export function decide(dir: string, stepId: string, decision: Decision): Walkthrough | null {
  return locked(file(dir), () => {
    const walkthrough = readWalkthrough(dir);
    const step = walkthrough?.steps.find(one => one.id === stepId);
    if (!walkthrough || !step) return null;
    step.decision = decision;
    writeJson(file(dir), walkthrough);
    return walkthrough;
  });
}
