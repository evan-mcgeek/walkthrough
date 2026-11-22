// The session's checklist: its title, statuses and texts are the session's own; this checks only their shape and that linked steps exist.
import type { Checklist, Walkthrough } from './walkthrough';

const filled = (value: unknown): value is string => typeof value === 'string' && value.trim() !== '';
const shapeError = 'the checklist must be a JSON object on standard input; see walkthrough guide';

export function parseChecklist(text: string, { steps }: Walkthrough): Checklist {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error(shapeError);
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) throw new Error(shapeError);
  const { title, items } = parsed as Record<string, unknown>;
  if (!filled(title)) throw new Error('the checklist needs a title');
  if (!Array.isArray(items)) throw new Error('the checklist: items must be a list');
  const known = new Set(steps.map(step => step.id));
  const unknown: string[] = [];
  const checked = items.map((one: unknown, at) => {
    const name = `item ${String(at + 1)}`;
    const { status, text: itemText, steps: links = [] } = (one ?? {}) as Record<string, unknown>;
    if (!filled(status)) throw new Error(`${name} needs a status`);
    if (!filled(itemText)) throw new Error(`${name} needs a text`);
    if (!Array.isArray(links) || !links.every(filled)) throw new Error(`${name}: steps must be a list of step ids`);
    for (const link of links)
      if (!known.has(link)) unknown.push(`${name} links to step ${link}, which this walkthrough does not have`);
    return { id: String(at + 1), status, text: itemText, steps: links };
  });
  if (unknown.length > 0) throw new Error(`the checklist was not recorded:\n  ${unknown.join('\n  ')}`);
  return { title, items: checked };
}
