// The session groups and orders the change into steps; this checks only structure, such as every changed file being in exactly one step.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { changedFiles, diffOf } from './change';
import { fieldsOf, filled, parseList } from './input';
import { inInbox } from './paths';
import { shownLines } from './lines';
import type { Look, Step, Walkthrough } from './walkthrough';

export type StepInput = Pick<Step, 'title' | 'explanation' | 'files' | 'folded' | 'look'> & {
  /** A new screenshot, or null to remove the one the step had; left out, the step keeps its own. */
  screenshot?: { file: string; alt: string } | null;
};

const MAX_LOOK = 2;
const LOOK_WORDS = 4;
const wordCount = (text: string) => text.trim().split(/\s+/).length;

function parseLook(given: unknown, name: string): Look {
  const { file, start, end, label } = fieldsOf(given);
  if (!filled(file)) throw new Error(`${name} needs a file`);
  if (!Number.isInteger(start) || !Number.isInteger(end) || (start as number) < 1 || (start as number) > (end as number))
    throw new Error(`${name} needs a start and an end line, the start first`);
  if (!filled(label) || wordCount(label) > LOOK_WORDS) throw new Error(`${name} needs a label of 1 to ${String(LOOK_WORDS)} words`);
  return { file, start: start as number, end: end as number, label: label.trim() };
}

/** The image types a screenshot may be, by the extension its copy is named with. */
export const SCREENSHOT_TYPES = { png: 'image/png', jpg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp' } as const;
const MAX_SCREENSHOT_BYTES = 5 * 1024 * 1024;

const imageType = (bytes: Buffer): keyof typeof SCREENSHOT_TYPES | null => {
  const starts = (text: string, at = 0) => bytes.subarray(at, at + text.length).equals(Buffer.from(text, 'latin1'));
  if (starts('\x89PNG\r\n\x1a\n')) return 'png';
  if (starts('\xff\xd8\xff')) return 'jpg';
  if (starts('GIF87a') || starts('GIF89a')) return 'gif';
  return starts('RIFF') && starts('WEBP', 8) ? 'webp' : null;
};

type Screenshot = { file: string; bytes: Buffer; name: string };

function readScreenshot(file: string, name: string): Screenshot | string {
  let bytes: Buffer;
  try {
    if (fs.statSync(file).size > MAX_SCREENSHOT_BYTES) return `${name}: its screenshot ${file} is over 5 MB`;
    bytes = fs.readFileSync(file);
  } catch {
    return `${name}: its screenshot ${file} cannot be read`;
  }
  const type = imageType(bytes);
  if (!type) return `${name}: its screenshot ${file} is not a PNG, JPEG, GIF or WebP image`;
  return { file, bytes, name: `${crypto.createHash('sha256').update(bytes).digest('hex')}.${type}` };
}

function parseScreenshot(given: unknown, name: string): NonNullable<StepInput['screenshot']> {
  const { file, alt = '' } = fieldsOf(given);
  if (!filled(file) || typeof alt !== 'string') throw new Error(`${name}: a screenshot is {"file": path, "alt": text}`);
  return { file, alt: alt.trim() };
}

export function parseSteps(text: string): StepInput[] {
  return parseList(text, 'the steps', (step, number): StepInput => {
    const name = `step ${String(number)}`;
    const { title, explanation, files, look = [], screenshot } = step;
    if (!filled(title)) throw new Error(`${name} needs a title`);
    if (!filled(explanation)) throw new Error(`${name} needs an explanation`);
    if (!Array.isArray(files) || !files.length) throw new Error(`${name}: files must be a list of at least one file`);
    const folded: Record<string, string> = {};
    const paths = files.map((file: unknown) => {
      if (filled(file)) return file;
      const { path, folded: reason } = fieldsOf(file);
      if (!filled(path) || !filled(reason)) throw new Error(`${name}: each file is a path, or a path with the reason it is folded`);
      folded[path] = reason.trim();
      return path;
    });
    if (!Array.isArray(look) || look.length > MAX_LOOK) throw new Error(`${name}: look must be a list of at most ${String(MAX_LOOK)} pointers`);
    return {
      title,
      explanation,
      files: paths,
      ...(Object.keys(folded).length && { folded }),
      look: look.map((one: unknown, at) => parseLook(one, `${name}, pointer ${String(at + 1)}`)),
      ...(screenshot !== undefined && { screenshot: screenshot === null ? null : parseScreenshot(screenshot, name) }),
    };
  });
}

// Ids follow files rather than places, so comments and Viewed follow them; a gone id is never reused.
// The pairs sharing most files are matched first, so a step split in two leaves its id with the larger part.
function stepIds({ steps, lastStep = 0 }: Walkthrough, inputs: StepInput[]): string[] {
  let next = Math.max(lastStep, ...steps.map(step => Number(step.id)));
  const pairs = inputs.flatMap((input, at) => {
    const files = new Set(input.files);
    return steps.map((step, old) => ({ at, old, id: step.id, shared: step.files.filter(one => files.has(one)).length }));
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

const lookShown = (step: Step, { file, start, end }: Look) => {
  const shown = step.files.includes(file) ? shownLines(step, file) : null;
  return !!shown?.has(start) && shown.has(end);
};

/** Checks the steps against the change, then copies each screenshot into `dir` by its content hash and removes it from an inbox. */
export async function buildSteps(cwd: string, dir: string, walkthrough: Walkthrough, inputs: StepInput[]): Promise<Step[]> {
  const { base, head } = walkthrough;
  const changed = new Map((await changedFiles(cwd, base, head)).map(file => [file.path, file]));
  const problems: string[] = [];
  const placed = new Set<string>();
  for (const one of inputs.flatMap(input => input.files)) {
    if (!changed.has(one)) problems.push(`${one} is not changed in this walkthrough`);
    else if (placed.has(one)) problems.push(`${one} is in more than one step`);
    placed.add(one);
  }
  const left = [...changed.keys()].filter(one => !placed.has(one));
  if (left.length > 0) problems.push(`no step has ${left.join(', ')}`);
  const shots = inputs.map((input, at) => (input.screenshot ? readScreenshot(input.screenshot.file, `step ${String(at + 1)}`) : null));
  problems.push(...shots.filter(shot => typeof shot === 'string'));
  if (problems.length > 0) throw new Error(`the steps were not recorded:\n  ${[...new Set(problems)].join('\n  ')}`);
  const ids = stepIds(walkthrough, inputs);
  const steps = await Promise.all(
    inputs.map(async ({ screenshot, ...input }, at): Promise<Step> => {
      const id = ids[at] ?? '';
      const shot = shots[at];
      const kept =
        screenshot && shot && typeof shot !== 'string'
          ? { name: shot.name, alt: screenshot.alt }
          : screenshot === undefined
            ? walkthrough.steps.find(old => old.id === id)?.screenshot
            : undefined;
      return {
        id,
        ...input,
        ...(kept && { screenshot: kept }),
        diff: await diffOf(cwd, base, head, input.files.flatMap(one => changed.get(one) ?? [])),
      };
    }),
  );
  const astray = steps.flatMap((step, at) =>
    step.look.filter(one => !lookShown(step, one)).map(one => `step ${String(at + 1)} points to lines ${String(one.start)}-${String(one.end)} of ${one.file}, which are not in its diff`),
  );
  if (astray.length) throw new Error(`the steps were not recorded:\n  ${astray.join('\n  ')}`);
  for (const shot of shots)
    if (shot && typeof shot !== 'string') {
      fs.writeFileSync(path.join(dir, shot.name), shot.bytes, { mode: 0o600 });
      if (inInbox(shot.file)) fs.rmSync(shot.file);
    }
  return steps;
}

/** At a new head each step keeps the files that still change and the pointers still in its diff; a step with no file left is gone. */
export async function carrySteps(cwd: string, { base, head, steps }: Walkthrough): Promise<{ steps: Step[]; unplaced: string[] }> {
  const changed = new Map((await changedFiles(cwd, base, head)).map(file => [file.path, file]));
  const carried = await Promise.all(
    steps.map(async (step): Promise<Step | null> => {
      const files = step.files.filter(one => changed.has(one));
      if (!files.length) return null;
      const moved: Step = { ...step, files, diff: await diffOf(cwd, base, head, files.flatMap(one => changed.get(one) ?? [])) };
      return { ...moved, look: moved.look.filter(one => lookShown(moved, one)) };
    }),
  );
  const kept = carried.filter(step => step !== null);
  const placed = new Set(kept.flatMap(step => step.files));
  return { steps: kept, unplaced: [...changed.keys()].filter(file => !placed.has(file)) };
}
