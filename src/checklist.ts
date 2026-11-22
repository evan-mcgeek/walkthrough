// The session's checklist: its title, statuses and texts are the session's own; this checks only their shape and that linked steps exist.
import { fieldsOf, filled, parseObject } from './input';
import type { Checklist, Walkthrough } from './walkthrough';

export function parseChecklist(text: string, { steps }: Walkthrough): Checklist {
  const { title, items } = parseObject(text, 'the checklist');
  if (!filled(title)) throw new Error('the checklist needs a title');
  if (!Array.isArray(items)) throw new Error('the checklist: items must be a list');
  const known = new Set(steps.map(step => step.id));
  const unknown: string[] = [];
  const checked = items.map((one: unknown, at) => {
    const name = `item ${String(at + 1)}`;
    const { status, text: itemText, steps: links = [] } = fieldsOf(one);
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
