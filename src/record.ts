// What the session records besides its steps: its own comments, colleagues' threads and the acceptance criteria; this checks shape only.
import { fieldsOf, filled, parseList } from './input';
import { isLines, type Place, placeIn } from './lines';
import { withoutPrefix } from './review';
import { lookShown } from './steps';
import { type Criterion, CRITERION_STATUSES, type Said, type Thread, type Walkthrough } from './walkthrough';

const placed = (walkthrough: Walkthrough, where: Record<string, unknown>, name: string): Place => {
  try {
    return placeIn(walkthrough, where);
  } catch (error) {
    throw new Error(`${name}: ${(error as Error).message}`);
  }
};

export function parseComments(text: string, walkthrough: Walkthrough): { place: Place; body: string }[] {
  return parseList(text, 'the comments', (fields, number) => {
    const name = `comment ${String(number)}`;
    if (!filled(fields['body'])) throw new Error(`${name} needs a body`);
    const body = withoutPrefix(fields['body']);
    if (!body) throw new Error(`${name} needs a body`);
    return { place: placed(walkthrough, fields, name), body };
  });
}

const isTime = (value: unknown): value is string => filled(value) && !Number.isNaN(Date.parse(value));

function said(fields: Record<string, unknown>, name: string): Said {
  const { author, at, body } = fields;
  if (!filled(author)) throw new Error(`${name} needs an author`);
  if (!isTime(at)) throw new Error(`${name} needs a time, such as 2026-11-23T09:30:00Z`);
  if (!filled(body)) throw new Error(`${name} needs a body`);
  return { author: author.trim(), at, body };
}

export function parseThreads(text: string, walkthrough: Walkthrough): Thread[] {
  const ids = new Set<string>();
  return parseList(text, 'the threads', (fields, number) => {
    const name = `thread ${String(number)}`;
    const { id, replies = [], resolved = false } = fields;
    if (!filled(id)) throw new Error(`${name} needs an id`);
    if (ids.has(id)) throw new Error(`${name}: two threads have the id ${id}`);
    ids.add(id);
    if (typeof resolved !== 'boolean') throw new Error(`${name}: resolved must be true or false`);
    if (!Array.isArray(replies)) throw new Error(`${name}: replies must be a list`);
    return {
      id,
      ...placed(walkthrough, fields, name),
      ...said(fields, name),
      ...(resolved && { resolved: true as const }),
      replies: replies.map((reply: unknown, at) => said(fieldsOf(reply), `${name}, reply ${String(at + 1)}`)),
    };
  });
}

/** Each criterion carries what its status shows: a gap its AI comment and what is missing, met its lines in a step's diff, not checked its reason. */
export function parseCriteria(text: string, walkthrough: Walkthrough, aiComments: Set<string>): Criterion[] {
  return parseList(text, 'the criteria', ({ text: criterion, status, comment, missing, file, lines, reason }, number) => {
    const name = `criterion ${String(number)}`;
    if (!filled(criterion)) throw new Error(`${name} needs a text`);
    if (!CRITERION_STATUSES.includes(status as Criterion['status'])) throw new Error(`${name}: status must be one of ${CRITERION_STATUSES.join(', ')}`);
    const checked = { text: criterion.trim(), status: status as Criterion['status'] };
    if (status === 'partly' || status === 'not-met') {
      if (!filled(comment) || !aiComments.has(comment.trim()))
        throw new Error(`${name} is ${status}: comment must be the id of your comment that closes the gap, as walkthrough comment printed it`);
      if (!filled(missing)) throw new Error(`${name} is ${status}: it needs missing, what is missing`);
      return { ...checked, comment: comment.trim(), missing: missing.trim() };
    }
    if (status === 'met') {
      if (!filled(file) || !isLines(lines)) throw new Error(`${name} is met: it needs the file and lines that meet it`);
      const step = walkthrough.steps.find(one => one.files.includes(file));
      if (!step || !lookShown(step, { file, start: lines[0], end: lines[1] }))
        throw new Error(`${name}: lines ${String(lines[0])}-${String(lines[1])} of ${file} are not in a step's diff`);
      return { ...checked, file, lines };
    }
    if (!filled(reason)) throw new Error(`${name} is not-checked: it needs a reason`);
    return { ...checked, reason: reason.trim() };
  });
}
