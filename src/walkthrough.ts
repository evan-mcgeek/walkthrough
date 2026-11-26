// A walkthrough's saved state: one folder per walkthrough under the state folder, written only by this CLI.
import path from 'node:path';
import type { Change, Source } from './change';
import type { Lines } from './lines';
import { locked, readJson, readSavedJson, writeJson } from './json-files';
import { stateDir } from './paths';

/** One of the lines the AI points the person to first: `start` to `end` of `file`, named in a few words. */
export type Look = { file: string; start: number; end: number; label: string };
export type Step = {
  id: string;
  title: string;
  explanation: string;
  files: string[];
  /** The one-line reason a generated or copied file arrives folded, by its path. */
  folded?: Record<string, string>;
  look: Look[];
  diff: string;
};
export const CRITERION_STATUSES = ['met', 'partly', 'not-met', 'not-checked'] as const;
export type Criterion = { text: string; status: (typeof CRITERION_STATUSES)[number] };
export type Said = { author: string; at: string; body: string };
/** A colleague's thread already on the change, by the id the session gave it. */
export type Thread = Said & { id: string; file: string; lines: Lines; resolved?: true; replies: Said[]; linesHash?: string; code?: string[] };
export type Walkthrough = ({ kind: 'branch'; branch: string } | { kind: 'range'; label: string }) & {
  /** The revision the base was taken from; the head merged into it means the walkthrough is over. */
  target: string;
  /** Set for a pull request: the review goes out with Submit review, else to the agent. */
  pr?: { number: string; title: string };
  base: string;
  head: string;
  /** Empty until the session records its steps. */
  steps: Step[];
  /** Changed files no step has since the head moved, until the steps are recorded again. */
  unplaced?: string[];
  /** The highest step id given out, so the id of a step gone is never given again. */
  lastStep?: number;
  /** False until the session runs `ready`; a walkthrough saved without it is ready. */
  ready?: boolean;
  /** Set once the page was opened in the browser. */
  opened?: true;
  criteria?: Criterion[];
  threads?: Thread[];
};

const file = (dir: string) => path.join(dir, 'walkthrough.json');

// `~` cannot appear in a branch name, so `/` maps to it one to one; a label is encoded whole.
export function walkthroughDir(repo: string, source: Source): string {
  const name =
    source.kind === 'branch'
      ? `branch-${source.branch.replaceAll('/', '~')}`
      : `range-${encodeURIComponent(source.label)}`;
  if (Buffer.byteLength(name) > 255)
    throw new Error(`${nameOf(source)} is too long to name a walkthrough; pass a shorter --label`);
  return path.join(stateDir(), repo, name);
}

/** A range's target is a commit when its base named no branch. */
export const targetName = (target: string) => (/^[0-9a-f]{40,64}$/.test(target) ? target.slice(0, 7) : target);

export const nameOf = (named: { kind: 'branch'; branch: string } | { kind: 'range'; label: string }) =>
  named.kind === 'branch' ? named.branch : named.label;

const EARLIER_FIELDS = ['kindLabel', 'commentHint', 'checking', 'checklist', 'lastChecklistItem', 'actions', 'hints', 'reviewing'];

/** A walkthrough saved by an earlier release keeps its place and ids, but its steps, in an older shape, are recorded again. */
function current(saved: Walkthrough | null): Walkthrough | null {
  if (!saved) return null;
  const upgraded = Object.fromEntries(Object.entries(saved).filter(([key]) => !EARLIER_FIELDS.includes(key))) as Walkthrough;
  if (!saved.steps.every(step => Array.isArray(step.look) && step.files.every(one => typeof one === 'string'))) upgraded.steps = [];
  return upgraded;
}

export const readWalkthrough = (dir: string) => current(readJson<Walkthrough | null>(file(dir), null));
// Before a write: a saved walkthrough taken for none would be started over, giving its step ids out again.
const savedWalkthrough = (dir: string) => current((readSavedJson(file(dir)) as Walkthrough | undefined) ?? null);

export function openWalkthrough(
  dir: string,
  source: Source,
  change: Change,
  /** Given to this start; left out, the one given before stays. */
  pr: Walkthrough['pr'],
  carry: (moved: Walkthrough) => Promise<{ steps: Step[]; unplaced: string[] }>,
): Promise<{ walkthrough: Walkthrough; opened: 'new' | 'resumed' | 'moved' }> {
  return locked(file(dir), async () => {
    const saved = savedWalkthrough(dir);
    const given = pr ? { pr } : {};
    if (saved?.head === change.head && saved.base === change.base) {
      if (!pr || JSON.stringify(saved.pr) === JSON.stringify(pr)) return { walkthrough: saved, opened: 'resumed' };
      const relabelled = { ...saved, pr };
      writeJson(file(dir), relabelled);
      return { walkthrough: relabelled, opened: 'resumed' };
    }
    if (saved) {
      const moved = { ...saved, ...given, target: change.target, base: change.base, head: change.head, ready: false };
      const { steps, unplaced } = await carry(moved);
      setSteps(moved, steps);
      // Before any steps, the page shows the session preparing them instead.
      if (saved.steps.length && unplaced.length) moved.unplaced = unplaced;
      writeJson(file(dir), moved);
      return { walkthrough: moved, opened: 'moved' };
    }
    const walkthrough: Walkthrough = {
      ...(source.kind === 'branch' ? { kind: 'branch', branch: source.branch } : { kind: 'range', label: source.label }),
      target: change.target,
      ...given,
      base: change.base,
      head: change.head,
      steps: [],
      ready: false,
    };
    writeJson(file(dir), walkthrough);
    return { walkthrough, opened: 'new' };
  });
}

export function updateWalkthrough<T>(dir: string, change: (walkthrough: Walkthrough) => T | Promise<T>): Promise<T> {
  return locked(file(dir), async () => {
    const walkthrough = savedWalkthrough(dir);
    if (!walkthrough) throw new Error('there is no such walkthrough yet; run walkthrough start first');
    const changed = await change(walkthrough);
    writeJson(file(dir), walkthrough);
    return changed;
  });
}

function setSteps(walkthrough: Walkthrough, steps: Step[]) {
  walkthrough.steps = steps;
  delete walkthrough.unplaced;
  walkthrough.lastStep = Math.max(walkthrough.lastStep ?? 0, ...steps.map(step => Number(step.id)));
}

export function recordSteps(dir: string, build: (walkthrough: Walkthrough) => Promise<Step[]>): Promise<Walkthrough> {
  return updateWalkthrough(dir, async walkthrough => {
    setSteps(walkthrough, await build(walkthrough));
    return walkthrough;
  });
}

/** Marks the review ready once every changed file is in a step; says whether the page was ever opened before. */
export function markReady(dir: string): Promise<boolean> {
  return updateWalkthrough(dir, walkthrough => {
    if (!walkthrough.steps.length) throw new Error('record the steps before the walkthrough is ready');
    const left = walkthrough.unplaced ?? [];
    if (left.length) throw new Error(`these files are in no step yet: ${left.join(', ')}; record the steps again with them`);
    walkthrough.ready = true;
    const opened = walkthrough.opened === true;
    walkthrough.opened = true;
    return opened;
  });
}

export const markOpened = (dir: string) =>
  updateWalkthrough(dir, walkthrough => {
    walkthrough.opened = true;
  });
