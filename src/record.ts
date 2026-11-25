// What the session records besides its steps: its own comments, colleagues' threads and the acceptance criteria; this checks shape only.
import { fieldsOf, filled, parseList } from './input';
import { type Place, placeIn } from './lines';
import { withoutPrefix } from './review';
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
    const { file, lines, linesHash } = placed(walkthrough, fields, name);
    return {
      id,
      file,
      lines,
      linesHash,
      ...said(fields, name),
      ...(resolved && { resolved: true as const }),
      replies: replies.map((reply: unknown, at) => said(fieldsOf(reply), `${name}, reply ${String(at + 1)}`)),
    };
  });
}

export function parseCriteria(text: string): Criterion[] {
  return parseList(text, 'the criteria', ({ text: criterion, status }, number) => {
    const name = `criterion ${String(number)}`;
    if (!filled(criterion)) throw new Error(`${name} needs a text`);
    if (!CRITERION_STATUSES.includes(status as Criterion['status'])) throw new Error(`${name}: status must be one of ${CRITERION_STATUSES.join(', ')}`);
    return { text: criterion.trim(), status: status as Criterion['status'] };
  });
}
