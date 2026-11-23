// The person's own line comments as they are now, shared by the CLI and the page.
import type { Lines, Place } from './notes';
import type { Entry } from './session';

export type Comment = Place & { id: string; file: string; lines: Lines; text: string };

/** Each comment with its latest edit, without those deleted. */
export function commentsOf(conversation: Entry[]): Comment[] {
  const comments = new Map<string, Comment>();
  for (const entry of conversation) {
    if (entry.from !== 'page') continue;
    if (entry.kind === 'comment' && entry.file !== undefined && entry.lines) {
      const { id, step, file, lines, linesHash, linesText, text } = entry;
      comments.set(id, { id, step, file, lines, ...(linesHash !== undefined && { linesHash }), ...(linesText && { linesText }), text });
    }
    const kept = 'comment' in entry ? comments.get(entry.comment) : undefined;
    if (kept && entry.kind === 'edit-comment') kept.text = entry.text;
    if (kept && entry.kind === 'delete-comment') comments.delete(kept.id);
  }
  return [...comments.values()];
}
