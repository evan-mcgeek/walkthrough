// The walkthroughs of one repo, for the list page.
import fs from 'node:fs';
import path from 'node:path';
import { walkthroughView } from './decisions';
import { itemKey, nameOf } from './items';

export type Segment = 'decided' | 'reopened' | 'read' | 'unread';

/** `id` is the walkthrough's folder in the repo's state; `segments` are its steps in order; `last` is when the session or the person last changed it. */
export type Listed = {
  id: string;
  name: string;
  kind?: string;
  /** The label of the verdict the person chose, while it holds. */
  verdict?: string;
  target: string;
  steps: number;
  decided: number;
  read: number;
  segments: Segment[];
  last: string;
};

// What the session records and what the person does; not the server's own files.
const ACTIVITY = ['walkthrough.json', 'conversation.jsonl', 'read.json'];

export function listView(repoDir: string): Listed[] {
  const entries = fs.existsSync(repoDir) ? fs.readdirSync(repoDir, { withFileTypes: true }) : [];
  const listed = entries.flatMap(entry => {
    const dir = path.join(repoDir, entry.name);
    const view = entry.isDirectory() ? walkthroughView(dir) : null;
    if (!view) return [];
    const segments = view.steps.map((step): Segment => {
      const key = itemKey({ type: 'step', id: step.id });
      if (view.decided[key]) return 'decided';
      if (view.reopened[key]) return 'reopened';
      return view.read.includes(step.id) ? 'read' : 'unread';
    });
    const verdict = view.decided['verdict'];
    const changed = ACTIVITY.map(file => fs.statSync(path.join(dir, file), { throwIfNoEntry: false })?.mtimeMs ?? 0);
    return [
      {
        id: entry.name,
        name: nameOf(view),
        ...(view.kindLabel !== undefined && { kind: view.kindLabel }),
        ...(verdict && { verdict: view.actions['verdict']?.find(one => one.id === verdict.action)?.label ?? verdict.action }),
        target: view.target,
        steps: view.steps.length,
        decided: segments.filter(segment => segment === 'decided').length,
        read: view.read.length,
        segments,
        last: new Date(Math.max(...changed)).toISOString(),
      },
    ];
  });
  return listed.sort((one, other) => other.last.localeCompare(one.last));
}

/** The list page's data; the repo's state folder is named `<repo>-<hash>` by currentRepo. */
export const listPage = (repoDir: string) => ({
  repo: path.basename(repoDir).replace(/-[0-9a-f]{8}$/, ''),
  walkthroughs: listView(repoDir),
});
