// A walkthrough's saved state: one folder per walkthrough under the state folder, written only by this CLI.
import path from 'node:path';
import type { Change, Source } from './change';
import { type Action, type Item, itemKey, nameOf } from './items';
import { locked, readJson, writeJson } from './json-files';
import { stateDir } from './paths';

export type FoldedFile = { path: string; reason: string };
export type Step = { id: string; title: string; diff: string } & (
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
  /** Changed files no step has since the head moved, until the steps are recorded again. */
  unplaced?: string[];
  /** The highest step id given out, so the id of a step gone is never given again. */
  lastStep?: number;
  checklist?: Checklist;
  /** The highest checklist item id given out, never given again. */
  lastChecklistItem?: number;
  actions?: Record<string, Action[]>;
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

export const readWalkthrough = (dir: string) => readJson<Walkthrough | null>(file(dir), null);

export function openWalkthrough(
  dir: string,
  source: Source,
  change: Change,
  carry: (moved: Walkthrough) => Promise<{ steps: Step[]; unplaced: string[] }>,
): Promise<{
  walkthrough: Walkthrough;
  opened: 'new' | 'resumed' | 'moved';
}> {
  return locked(file(dir), async () => {
    const saved = readWalkthrough(dir);
    if (saved?.head === change.head && saved.base === change.base) return { walkthrough: saved, opened: 'resumed' };
    if (saved) {
      const moved = { ...saved, target: change.target, base: change.base, head: change.head };
      const { steps, unplaced } = await carry(moved);
      setSteps(moved, steps);
      moved.unplaced = unplaced;
      writeJson(file(dir), moved);
      return { walkthrough: moved, opened: 'moved' };
    }
    const walkthrough: Walkthrough = {
      ...(source.kind === 'branch' ? { kind: 'branch', branch: source.branch } : { kind: 'range', label: source.label }),
      target: change.target,
      base: change.base,
      head: change.head,
      steps: [],
    };
    writeJson(file(dir), walkthrough);
    return { walkthrough, opened: 'new' };
  });
}

function update<T>(dir: string, change: (walkthrough: Walkthrough) => T | Promise<T>): Promise<T> {
  return locked(file(dir), async () => {
    const walkthrough = readWalkthrough(dir);
    if (!walkthrough) throw new Error('there is no such walkthrough yet; run walkthrough start first');
    const changed = await change(walkthrough);
    writeJson(file(dir), walkthrough);
    return changed;
  });
}

function keepActions(walkthrough: Walkthrough, keep: (key: string) => boolean): Record<string, Action[]> {
  return Object.fromEntries(Object.entries(walkthrough.actions ?? {}).filter(([key]) => keep(key)));
}

function setSteps(walkthrough: Walkthrough, steps: Step[]) {
  walkthrough.steps = steps;
  delete walkthrough.unplaced;
  walkthrough.lastStep = Math.max(walkthrough.lastStep ?? 0, ...steps.map(step => Number(step.id)));
  const kept = new Set(steps.map(step => itemKey({ type: 'step', id: step.id })));
  walkthrough.actions = keepActions(walkthrough, key => !key.startsWith('step:') || kept.has(key));
}

export function recordSteps(dir: string, build: (walkthrough: Walkthrough) => Promise<Step[]>): Promise<Walkthrough> {
  return update(dir, async walkthrough => {
    setSteps(walkthrough, await build(walkthrough));
    return walkthrough;
  });
}

export function recordChecklist(dir: string, build: (walkthrough: Walkthrough) => Checklist): Promise<Checklist> {
  return update(dir, walkthrough => {
    const checklist = build(walkthrough);
    walkthrough.checklist = checklist;
    const ids = checklist.items.map(item => item.id);
    walkthrough.lastChecklistItem = Math.max(walkthrough.lastChecklistItem ?? 0, ...ids.map(Number));
    const kept = new Set(ids.map(id => itemKey({ type: 'checklist', id })));
    walkthrough.actions = keepActions(walkthrough, key => !key.startsWith('checklist:') || kept.has(key));
    return checklist;
  });
}

export function recordActions(dir: string, build: (walkthrough: Walkthrough) => { item: Item; actions: Action[] }[]) {
  return update(dir, walkthrough => {
    const recorded = build(walkthrough);
    const named = new Map(recorded.map(({ item, actions }) => [itemKey(item), actions]));
    walkthrough.actions = {
      ...keepActions(walkthrough, key => !named.has(key)),
      ...Object.fromEntries([...named].filter(([, actions]) => actions.length)),
    };
    return recorded;
  });
}
