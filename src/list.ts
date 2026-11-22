// The walkthroughs of one repo, for the list page.
import fs from 'node:fs';
import path from 'node:path';
import { walkthroughView } from './decisions';
import { itemKey, nameOf } from './items';

/** `id` is the walkthrough's folder in the repo's state; `last` is when the session or the person last changed it. */
export type Listed = { id: string; name: string; target: string; steps: number; decided: number; read: number; last: string };

// What the session records and what the person does; not the server's own files.
const ACTIVITY = ['walkthrough.json', 'conversation.jsonl', 'read.json'];

export function listView(repoDir: string): Listed[] {
  const entries = fs.existsSync(repoDir) ? fs.readdirSync(repoDir, { withFileTypes: true }) : [];
  const listed = entries.flatMap(entry => {
    const dir = path.join(repoDir, entry.name);
    const view = entry.isDirectory() ? walkthroughView(dir) : null;
    if (!view) return [];
    const changed = ACTIVITY.map(file => fs.statSync(path.join(dir, file), { throwIfNoEntry: false })?.mtimeMs ?? 0);
    return [
      {
        id: entry.name,
        name: nameOf(view),
        target: view.target,
        steps: view.steps.length,
        decided: view.steps.filter(step => view.decided[itemKey({ type: 'step', id: step.id })]).length,
        read: view.read.length,
        last: new Date(Math.max(...changed)).toISOString(),
      },
    ];
  });
  return listed.sort((one, other) => other.last.localeCompare(one.last));
}
