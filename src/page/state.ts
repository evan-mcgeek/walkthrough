// The view the page shows, what it sends, and what the modules that draw it share.
import type { CommentView, ThreadView, WalkthroughView } from '../review';
import type { Step } from '../walkthrough';
import { type PageName, post } from './dom';
import { renderMarkdown } from './markdown';

export const PAGE: PageName = { name: 'walkthrough', reopen: 'Run /walkthrough to reopen.' };

export const state = {
  view: undefined as unknown as WalkthroughView,
  /** Redraws what changed; `own` when the change is what the person just did, which never waits behind the pill. */
  render: (() => {}) as (own: boolean) => void,
  /** Counts what the page sent, so a poll that left before an answer does not put back what it replaced. */
  sends: 0,
  /** Set when the page shows what the server never took, so the next poll fetches the view whole. */
  stale: false,
};

export const phone = matchMedia('(max-width: 760px)');

/** Sends what the person did and shows the view the server answers with at once. */
export async function send(route: string, body: Record<string, unknown>): Promise<boolean> {
  state.sends++;
  const answer = await post(PAGE, route, body);
  if (!answer) {
    state.stale = true;
    return false;
  }
  state.view = (await answer.json()) as WalkthroughView;
  state.render(true);
  return true;
}

export const allFiles = () => state.view.steps.flatMap(step => step.files);
export const stepOfFile = (file: string): Step | undefined => state.view.steps.find(step => step.files.includes(file));
export const pendingComments = () =>
  state.view.threads.flatMap(thread => thread.comments.filter(one => one.pending).map(comment => ({ thread, comment })));
export const sentComments = (review: string) =>
  state.view.threads.flatMap(thread => thread.comments.filter(one => one.review === review).map(comment => ({ thread, comment })));
export const threadsIn = (step: string, file: string) => state.view.threads.filter(one => one.step === step && one.file === file);
export const commentCount = (step: string, file: string) => threadsIn(step, file).reduce((sum, one) => sum + one.comments.length, 0);
export const unresolved = () => state.view.threads.filter(one => one.colleague && !one.resolved && one.step !== null);
export const notViewed = () => allFiles().filter(file => !state.view.viewed.includes(file));

/** Who started a thread, which its gutter mark and stripe tick show. */
export const threadBy = (thread: ThreadView) => (thread.colleague ? 'colleague' : (thread.comments[0]?.by ?? 'you'));

export const plural = (count: number, one: string, many = `${one}s`) => `${String(count)} ${count === 1 ? one : many}`;
export const linesLabel = ([first, last]: [number, number]) => (first === last ? String(first) : `${String(first)}–${String(last)}`);
export const baseName = (file: string) => file.slice(file.lastIndexOf('/') + 1);

export function markdown(text: string, className: string): HTMLElement {
  const box = document.createElement('div');
  box.className = `markdown ${className}`.trim();
  // Raw HTML in the text shows as text, and markdown-it drops script links, so this is safe to put in the page.
  box.innerHTML = renderMarkdown(text);
  return box;
}

const UNITS = [
  ['year', 31_536_000],
  ['month', 2_592_000],
  ['day', 86_400],
  ['hour', 3_600],
  ['minute', 60],
] as const;
const relative = new Intl.RelativeTimeFormat('en', { numeric: 'always' });

/** "now" within the last minute, else "2 days ago". */
export function ago(iso: string): string {
  const seconds = (Date.parse(iso) - Date.now()) / 1000;
  for (const [unit, size] of UNITS) if (Math.abs(seconds) >= size) return relative.format(Math.round(seconds / size), unit);
  return 'now';
}

export const goesOut = (comment: CommentView) => comment.by === 'ai' && (comment.pending === true || comment.review !== undefined);
