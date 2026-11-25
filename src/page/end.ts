// After the session: the farewell End session leaves, or the robot asleep once the page lost its server; both drawn from what the page holds.
import type { ReviewType } from '../review';
import { attrs, el } from './dom';
import { byeScene } from './desk';
import { icon } from './icons';
import { pendingComments, plural, state } from './state';

const COPIED_MS = 2000;
export const TYPE_NAMES: Record<ReviewType, string> = { comment: 'Comment', approve: 'Approve', 'request-changes': 'Request changes' };

/** "Request changes, with 5 comments, on #212.", or on your own change "5 comments." */
export function sentLine(): string {
  const { pr, submitted } = state.view;
  const comments = plural(submitted?.comments ?? 0, 'comment');
  return pr ? `${submitted?.type ? TYPE_NAMES[submitted.type] : ''}, with ${comments}, on #${pr.number}.` : `${comments}.`;
}

/** "it" for one comment sent, else "them". */
export const them = () => (state.view.submitted?.comments === 1 ? 'it' : 'them');

/** Opens the posted review, once the session recorded where it is. */
export const viewReview = (): HTMLElement[] => {
  const address = state.view.submitted?.address;
  return address ? [el('a', { className: 'btn small', href: address, target: '_blank', rel: 'noopener noreferrer' }, icon('external'), 'View review')] : [];
};

/** The command that starts this walkthrough again, with Copy command. */
export function commandBox(): HTMLElement {
  const command = state.view.pr ? `/walkthrough:pr ${state.view.pr.number}` : '/walkthrough';
  const word = el('span', {}, 'Copy command');
  const copy = attrs(el('button', { type: 'button', className: 'btn small' }, icon('copy'), word), { 'aria-live': 'polite' });
  let shown = 0;
  copy.onclick = () => {
    void navigator.clipboard.writeText(command).then(() => {
      word.textContent = 'Copied';
      clearTimeout(shown);
      shown = window.setTimeout(() => {
        word.textContent = 'Copy command';
      }, COPIED_MS);
    });
  };
  return el('div', { className: 'command' }, el('code', {}, command), copy);
}

export type Ending = 'ended' | 'lost';

/** The screen for `ending`; Try again calls `retry`, and `stop` lets the robot go. */
export function endScreen(ending: Ending, retry: () => void): { box: HTMLElement; stop: () => void } {
  const { pr, submitted } = state.view;
  const lost = ending === 'lost';
  const robot = byeScene(lost ? 'asleep' : submitted ? 'happy' : 'plain');
  const pending = pendingComments().length;
  const kept = pending ? `Your ${plural(pending, 'comment')} and Viewed marks are kept for next time.` : 'Your Viewed marks are kept for next time.';
  const outcome = lost
    ? box(false, 'This page lost its session.', 'Nothing is lost; your comments and Viewed marks are saved.', [
        el('button', { type: 'button', className: 'btn small primary', onclick: retry }, 'Try again'),
      ])
    : submitted
      ? pr
        ? box(true, 'Review submitted', sentLine(), viewReview())
        : box(true, 'Sent to the agent', `${sentLine()} The agent picks ${them()} up in your conversation.`, [])
      : box(false, pr ? 'Nothing was posted.' : 'Nothing was sent to the agent.', kept, []);
  const page = el(
    'div',
    { className: 'end' },
    robot.box,
    el('h1', { className: 'end-title', tabIndex: -1 }, lost ? 'The session isn’t running' : 'Session ended'),
    outcome,
    el(
      'section',
      { className: 'pick-up' },
      el('h2', {}, 'Pick it up again'),
      el('p', { className: 'end-line' }, 'Run this in your agent:'),
      commandBox(),
      el('p', { className: 'end-line' }, 'A new commit reopens only the steps that changed.'),
    ),
    ...(lost ? [] : [el('p', { className: 'end-line bye' }, 'You can close this tab.')]),
  );
  return { box: page, stop: robot.stop };
}

/** What went out, with a check, or what did not, with the info mark. */
function box(sent: boolean, title: string, line: string, actions: HTMLElement[]): HTMLElement {
  return el(
    'div',
    { className: `outcome ${sent ? 'sent' : 'kept'}` },
    icon(sent ? 'met' : 'info'),
    el('div', {}, el('strong', {}, title), el('p', {}, line), ...(actions.length ? [el('p', { className: 'outcome-actions' }, ...actions)] : [])),
  );
}
