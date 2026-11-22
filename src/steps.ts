// The skill groups and orders the change into steps; this checks that grouping and builds the steps from git.
import { changedFiles, diffOf } from './change';
import type { Step, Walkthrough } from './walkthrough';

export type StepInput = { title: string; what: string; why: string; files: string[]; tests: string[] };

/** The steps the skill sent, in its order, or an error naming what is wrong with their shape. */
export function parseSteps(text: string): StepInput[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('the steps must be a JSON array on standard input');
  }
  if (!Array.isArray(parsed)) throw new Error('the steps must be a JSON array on standard input');
  return parsed.map((one: unknown, at) => {
    const step = (one ?? {}) as Record<string, unknown>;
    const text = (field: string) => {
      const value = step[field];
      if (typeof value !== 'string' || !value.trim()) throw new Error(`step ${String(at + 1)} needs a ${field}`);
      return value;
    };
    const paths = (field: string) => {
      const value = step[field] ?? [];
      if (!Array.isArray(value) || !value.every(item => typeof item === 'string'))
        throw new Error(`step ${String(at + 1)}: ${field} must be a list of paths`);
      return value;
    };
    return { title: text('title'), what: text('what'), why: text('why'), files: paths('files'), tests: paths('tests') };
  });
}

/** The steps of the walkthrough's change as `inputs` group them. */
export function buildSteps(cwd: string, walkthrough: Walkthrough, inputs: StepInput[]): Step[] {
  const { base, head } = walkthrough;
  const changed = new Map(changedFiles(cwd, base, head).map(file => [file.path, file]));
  const filesOf = (paths: string[]) => paths.flatMap(one => changed.get(one) ?? []);
  const problems: string[] = [];
  const placed = new Set<string>();
  for (const one of inputs.flatMap(input => [...input.files, ...input.tests])) {
    if (!changed.has(one)) problems.push(`${one} is not changed in this walkthrough`);
    else if (placed.has(one)) problems.push(`${one} is listed more than once`);
    placed.add(one);
  }
  const left = [...changed.keys()].filter(one => !placed.has(one));
  if (left.length > 0) problems.push(`no step has ${left.join(', ')}`);
  if (problems.length > 0) throw new Error(`the steps were not recorded:\n  ${[...new Set(problems)].join('\n  ')}`);
  return inputs.map((input, at) => ({
    id: String(at + 1),
    kind: 'logical',
    ...input,
    diff: diffOf(cwd, base, head, filesOf([...input.files, ...input.tests])),
    decision: null,
  }));
}
