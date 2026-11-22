// The session groups, orders and folds the change into steps; this checks only that every changed file is in exactly one step.
import { changedFiles, diffOf } from './change';
import type { FoldedFile, Step, Walkthrough } from './walkthrough';

export type StepInput =
  | { title: string; explanation: string; assumptions: string[]; files: string[] }
  | { title: string; folded: true; files: FoldedFile[]; problems: string[] };

const filled = (value: unknown): value is string => typeof value === 'string' && value.trim() !== '';
const isFoldedFile = (file: unknown): file is FoldedFile =>
  typeof file === 'object' && file !== null && filled((file as FoldedFile).path) && filled((file as FoldedFile).reason);

/** The steps the session sent, in its order, or an error naming what is wrong with their shape. */
export function parseSteps(text: string): StepInput[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('the steps must be a JSON array on standard input; see walkthrough guide');
  }
  if (!Array.isArray(parsed)) throw new Error('the steps must be a JSON array on standard input; see walkthrough guide');
  return parsed.map((one: unknown, at) => {
    const step = (one ?? {}) as Record<string, unknown>;
    const name = `step ${String(at + 1)}`;
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

const pathsOf = (input: StepInput) => input.files.map(file => (typeof file === 'string' ? file : file.path));

/** The steps of the walkthrough's change as `inputs` group them, or an error naming every file out of place. */
export function buildSteps(cwd: string, { base, head }: Walkthrough, inputs: StepInput[]): Step[] {
  const changed = new Map(changedFiles(cwd, base, head).map(file => [file.path, file]));
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
  return inputs.map((input, at) => {
    const common = {
      id: String(at + 1),
      title: input.title,
      diff: diffOf(cwd, base, head, pathsOf(input).flatMap(one => changed.get(one) ?? [])),
      decision: null,
    };
    return 'folded' in input
      ? { ...common, kind: 'folded', files: input.files, problems: input.problems }
      : { ...common, kind: 'step', explanation: input.explanation, assumptions: input.assumptions, files: input.files };
  });
}
