// A walkthrough's saved state: one folder per walkthrough under the state folder, written only by this CLI.
import path from 'node:path';
import type { Change } from './change';
import { locked, readJson, writeJson } from './json-files';
import { stateDir } from './paths';

export const DECISIONS = ['approved'] as const;
export type Decision = (typeof DECISIONS)[number];
export type MechanicalFile = { path: string; reason: string };
/** `whole` is the entire change until the skill records its steps; `mechanical` is always last. */
export type Step = { id: string; title: string; diff: string; decision: Decision | null } & (
  | { kind: 'whole' }
  | { kind: 'logical'; what: string; why: string; files: string[]; tests: string[] }
  | { kind: 'mechanical'; files: MechanicalFile[]; problems: string[] }
);
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

/** The saved walkthrough of the change when it is pinned to the same base and head, else a new one replacing it. */
export function openWalkthrough(change: Change): {
  dir: string;
  walkthrough: Walkthrough;
  opened: 'new' | 'resumed' | 'replaced';
} {
  const dir = walkthroughDir(change);
  return locked(file(dir), () => {
    const saved = readWalkthrough(dir);
    if (saved?.head === change.head && saved.base === change.base)
      return { dir, walkthrough: saved, opened: 'resumed' };
    const walkthrough: Walkthrough = {
      kind: 'branch',
      branch: change.branch,
      target: change.target,
      base: change.base,
      head: change.head,
      steps: [{ id: 'change', kind: 'whole', title: 'The whole change', diff: change.diff, decision: null }],
    };
    writeJson(file(dir), walkthrough);
    return { dir, walkthrough, opened: saved ? 'replaced' : 'new' };
  });
}

/** Replaces the steps, and with them every decision; `build` sees the saved walkthrough under the lock. */
export function recordSteps(dir: string, build: (walkthrough: Walkthrough) => Step[]): Walkthrough {
  return locked(file(dir), () => {
    const walkthrough = readWalkthrough(dir);
    if (!walkthrough) throw new Error('there is no walkthrough of this branch yet; run walkthrough start first');
    walkthrough.steps = build(walkthrough);
    writeJson(file(dir), walkthrough);
    return walkthrough;
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
