// A walkthrough's saved state: one folder per walkthrough under the state folder, written only by this CLI.
import path from 'node:path';
import type { Change, Source } from './change';
import { locked, readJson, writeJson } from './json-files';
import { stateDir } from './paths';

export const DECISIONS = ['approved'] as const;
export type Decision = (typeof DECISIONS)[number];
export type FoldedFile = { path: string; reason: string };
/** A `folded` step is one the session marked so. */
export type Step = { id: string; title: string; diff: string; decision: Decision | null } & (
  | { kind: 'step'; explanation: string; assumptions: string[]; files: string[] }
  | { kind: 'folded'; files: FoldedFile[]; problems: string[] }
);
export type ChecklistItem = { id: string; status: string; text: string; steps: string[] };
export type Checklist = { title: string; items: ChecklistItem[] };
export type Walkthrough = ({ kind: 'branch'; branch: string } | { kind: 'range'; label: string }) & {
  /** The revision the base was taken from; the head merged into it means the walkthrough is over. */
  target: string;
  base: string;
  head: string;
  /** Empty until the session records its steps. */
  steps: Step[];
  checklist?: Checklist;
};

const file = (dir: string) => path.join(dir, 'walkthrough.json');

/** What the walkthrough of `source` is called: its branch or its label. */
export const nameOf = (source: Source | Walkthrough) => (source.kind === 'branch' ? source.branch : source.label);

/**
 * The folder of the walkthrough of `source` in the repo `repo`.
 * `~` cannot appear in a branch name, so `/` maps to it one to one; a label is encoded whole.
 */
export function walkthroughDir(repo: string, source: Source): string {
  const name =
    source.kind === 'branch'
      ? `branch-${source.branch.replaceAll('/', '~')}`
      : `range-${encodeURIComponent(source.label)}`;
  if (Buffer.byteLength(name) > 255)
    throw new Error(`${nameOf(source)} is too long to name a walkthrough; pass a shorter --label`);
  return path.join(stateDir(), repo, name);
}

export const readWalkthrough = (dir: string) => readJson<Walkthrough | null>(file(dir), null);

/** The saved walkthrough of the change when it is pinned to the same base and head, else a new one replacing it. */
export function openWalkthrough(
  dir: string,
  source: Source,
  change: Change,
): {
  walkthrough: Walkthrough;
  opened: 'new' | 'resumed' | 'replaced';
} {
  return locked(file(dir), () => {
    const saved = readWalkthrough(dir);
    if (saved?.head === change.head && saved.base === change.base) return { walkthrough: saved, opened: 'resumed' };
    const walkthrough: Walkthrough = {
      ...(source.kind === 'branch' ? { kind: 'branch', branch: source.branch } : { kind: 'range', label: source.label }),
      target: change.target,
      base: change.base,
      head: change.head,
      steps: [],
    };
    writeJson(file(dir), walkthrough);
    return { walkthrough, opened: saved ? 'replaced' : 'new' };
  });
}

/** Replaces the steps, and with them every decision; `build` sees the saved walkthrough under the lock. */
export function recordSteps(dir: string, build: (walkthrough: Walkthrough) => Step[]): Walkthrough {
  return locked(file(dir), () => {
    const walkthrough = readWalkthrough(dir);
    if (!walkthrough) throw new Error('there is no such walkthrough yet; run walkthrough start first');
    walkthrough.steps = build(walkthrough);
    writeJson(file(dir), walkthrough);
    return walkthrough;
  });
}

/** Replaces the checklist; `build` sees the saved walkthrough under the lock. */
export function recordChecklist(dir: string, build: (walkthrough: Walkthrough) => Checklist): Checklist {
  return locked(file(dir), () => {
    const walkthrough = readWalkthrough(dir);
    if (!walkthrough) throw new Error('there is no walkthrough of this branch yet; run walkthrough start first');
    walkthrough.checklist = build(walkthrough);
    writeJson(file(dir), walkthrough);
    return walkthrough.checklist;
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
