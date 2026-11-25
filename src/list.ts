// The walkthroughs of one repo, for the list page.
import fs from 'node:fs';
import path from 'node:path';
import { type ReviewType, walkthroughView } from './review';
import { nameOf } from './walkthrough';

/** `id` is the walkthrough's folder in the repo's state; `last` is when the session or the person last changed it. */
export type Listed = {
  id: string;
  name: string;
  files: number;
  viewed: number;
  /** The review type, or `sent` for your own change, which has none. */
  submitted?: ReviewType | 'sent';
  last: string;
};

// What the session records and what the person does; not the server's own files.
const ACTIVITY = ['walkthrough.json', 'review.jsonl', 'viewed.json'];

export function listView(repoDir: string): Listed[] {
  const entries = fs.existsSync(repoDir) ? fs.readdirSync(repoDir, { withFileTypes: true }) : [];
  const listed = entries.flatMap((entry): Listed[] => {
    const dir = path.join(repoDir, entry.name);
    const view = entry.isDirectory() ? walkthroughView(dir) : null;
    if (!view) return [];
    const changed = ACTIVITY.map(file => fs.statSync(path.join(dir, file), { throwIfNoEntry: false })?.mtimeMs ?? 0);
    return [
      {
        id: entry.name,
        name: view.pr ? `#${view.pr.number} ${view.pr.title}` : nameOf(view),
        files: view.steps.flatMap(step => step.files).length,
        viewed: view.viewed.length,
        ...(view.submitted && { submitted: view.submitted.type ?? 'sent' }),
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
