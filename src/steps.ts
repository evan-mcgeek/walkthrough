// The session groups, orders and folds the change into steps; this checks only that every changed file is in exactly one step.
import { changedFiles, diffOf } from './change';
import { filled, parseList } from './input';
import type { FoldedFile, Step, Walkthrough } from './walkthrough';

export type StepInput =
  | { title: string; explanation: string; assumptions: string[]; files: string[] }
  | { title: string; folded: true; files: FoldedFile[]; problems: string[] };

const isFoldedFile = (file: unknown): file is FoldedFile =>
  typeof file === 'object' && file !== null && filled((file as FoldedFile).path) && filled((file as FoldedFile).reason);

export function parseSteps(text: string): StepInput[] {
  return parseList(text, 'the steps', (step, number): StepInput => {
    const name = `step ${String(number)}`;
    const { title, explanation, files, folded, problems = [], assumptions = [] } = step;
    if (!filled(title)) throw new Error(`${name} needs a title`);
    if (!Array.isArray(files)) throw new Error(`${name}: files must be a list`);
    if (folded === true) {
      if (!files.every(isFoldedFile))
        throw new Error(`${name}: every file of a folded step needs a path and a reason`);
      if (!Array.isArray(problems) || !problems.every(filled))
        throw new Error(`${name}: problems must be a list of text`);
      return {
        title,
        folded,
        files: files.map(({ path, reason }) => ({ path, reason })),
        problems,
      };
    }
    if (!filled(explanation)) throw new Error(`${name} needs an explanation`);
    if (!files.every(filled)) throw new Error(`${name}: files must be a list of paths`);
    if (!Array.isArray(assumptions) || !assumptions.every(filled))
      throw new Error(`${name}: assumptions must be a list of text`);
    return { title, explanation, assumptions, files };
  });
}

const pathOf = (file: string | FoldedFile) => (typeof file === 'string' ? file : file.path);
export const pathsOf = (step: StepInput | Step) => step.files.map(pathOf);

// Ids follow files rather than places, so decisions, notes and links follow them; a gone id is never reused.
// The pairs sharing most files are matched first, so a step split in two leaves its id with the larger part.
function stepIds({ steps, lastStep = 0 }: Walkthrough, inputs: StepInput[]): string[] {
  let next = Math.max(lastStep, ...steps.map(step => Number(step.id)));
  const pairs = inputs.flatMap((input, at) => {
    const files = new Set(pathsOf(input));
    return steps.map((step, old) => ({ at, old, id: step.id, shared: pathsOf(step).filter(one => files.has(one)).length }));
  });
  pairs.sort((one, other) => other.shared - one.shared || one.old - other.old || one.at - other.at);
  const ids: (string | undefined)[] = inputs.map(() => undefined);
  const taken = new Set<string>();
  for (const { at, id, shared } of pairs)
    if (shared > 0 && ids[at] === undefined && !taken.has(id)) {
      ids[at] = id;
      taken.add(id);
    }
  return ids.map(id => id ?? String(++next));
}

export async function buildSteps(cwd: string, walkthrough: Walkthrough, inputs: StepInput[]): Promise<Step[]> {
  const { base, head } = walkthrough;
  const changed = new Map((await changedFiles(cwd, base, head)).map(file => [file.path, file]));
  const problems: string[] = [];
  const placed = new Set<string>();
  for (const one of inputs.flatMap(pathsOf)) {
    if (!changed.has(one)) problems.push(`${one} is not changed in this walkthrough`);
    else if (placed.has(one)) problems.push(`${one} is in more than one step`);
    placed.add(one);
  }
  const left = [...changed.keys()].filter(one => !placed.has(one));
  if (left.length > 0) problems.push(`no step has ${left.join(', ')}`);
  if (problems.length > 0) throw new Error(`the steps were not recorded:\n  ${[...new Set(problems)].join('\n  ')}`);
  const ids = stepIds(walkthrough, inputs);
  return Promise.all(inputs.map(async (input, at): Promise<Step> => {
    const common = {
      id: ids[at] ?? '',
      title: input.title,
      diff: await diffOf(cwd, base, head, pathsOf(input).flatMap(one => changed.get(one) ?? [])),
    };
    return 'folded' in input
      ? { ...common, kind: 'folded', files: input.files, problems: input.problems }
      : { ...common, kind: 'step', explanation: input.explanation, assumptions: input.assumptions, files: input.files };
  }));
}

export async function carrySteps(cwd: string, { base, head, steps }: Walkthrough): Promise<{ steps: Step[]; unplaced: string[] }> {
  const changed = new Map((await changedFiles(cwd, base, head)).map(file => [file.path, file]));
  const diff = (files: (string | FoldedFile)[]) =>
    diffOf(cwd, base, head, files.flatMap(one => changed.get(pathOf(one)) ?? []));
  const carried = await Promise.all(
    steps.map(async (step): Promise<Step | null> => {
      if (step.kind === 'folded') {
        const files = step.files.filter(one => changed.has(one.path));
        return files.length ? { ...step, files, diff: await diff(files) } : null;
      }
      const files = step.files.filter(one => changed.has(one));
      return files.length ? { ...step, files, diff: await diff(files) } : null;
    }),
  );
  const kept = carried.filter(step => step !== null);
  const placed = new Set(kept.flatMap(pathsOf));
  return { steps: kept, unplaced: [...changed.keys()].filter(file => !placed.has(file)) };
}
