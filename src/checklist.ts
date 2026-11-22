// The session's checklist: its title, statuses and texts are the session's own; this checks only their shape and that linked steps exist.
import { fieldsOf, filled, parseObject } from './input';
import type { Checklist, Walkthrough } from './walkthrough';

// An item keeps the id the session names, else that of an item recorded before with the same text, else one never given out,
// so a decision follows its item rather than its place.
export function parseChecklist(text: string, { steps, checklist, lastChecklistItem = 0 }: Walkthrough): Checklist {
  const { title, items } = parseObject(text, 'the checklist');
  if (!filled(title)) throw new Error('the checklist needs a title');
  if (!Array.isArray(items)) throw new Error('the checklist: items must be a list');
  const before = checklist?.items ?? [];
  const known = new Set(steps.map(step => step.id));
  const unknown: string[] = [];
  const kept = new Set<string>();
  const checked = items.map((one: unknown, at) => {
    const name = `item ${String(at + 1)}`;
    const { id, status, text: itemText, steps: links = [] } = fieldsOf(one);
    if (!filled(status)) throw new Error(`${name} needs a status`);
    if (!filled(itemText)) throw new Error(`${name} needs a text`);
    if (!Array.isArray(links) || !links.every(filled)) throw new Error(`${name}: steps must be a list of step ids`);
    if (id !== undefined && !filled(id))
      throw new Error(`${name}: id must be the id of an item, as walkthrough checklist printed it`);
    if (id !== undefined && !before.some(old => old.id === id)) throw new Error(`${name}: the checklist has no item ${id} to keep`);
    if (id !== undefined && kept.has(id)) throw new Error(`${name}: item ${id} is kept twice`);
    if (id !== undefined) kept.add(id);
    for (const link of links)
      if (!known.has(link)) unknown.push(`${name} links to step ${link}, which this walkthrough does not have`);
    return { id, status, text: itemText, steps: links };
  });
  if (unknown.length > 0) throw new Error(`the checklist was not recorded:\n  ${unknown.join('\n  ')}`);
  let next = Math.max(lastChecklistItem, ...before.map(old => Number(old.id)));
  return {
    title,
    items: checked.map(({ id, ...item }) => {
      const same = id ?? before.find(old => old.text === item.text && !kept.has(old.id))?.id ?? String(++next);
      kept.add(same);
      return { id: same, ...item };
    }),
  };
}
