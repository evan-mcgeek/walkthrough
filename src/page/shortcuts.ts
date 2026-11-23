import { el, openDialog } from './dom';
import { icon } from './icons';

/** Every key the page answers, in the order the sheet lists them; each part of the page binds the keys it acts on. */
const SHORTCUTS = [
  { caps: 'J / K', does: 'Next / previous step' },
  { caps: 'A', does: 'Approve and go to the next step' },
  { caps: 'F', does: 'Flag (asks for a note)' },
  { caps: '/', does: 'Ask about this step' },
  { caps: 'Click, Shift-click a line', does: 'Pick lines' },
  { caps: 'C', does: 'Comment on picked lines' },
  { caps: 'V', does: 'Mark the file as viewed' },
  { caps: '1 – 4', does: 'Show or hide a panel' },
  { caps: 'G then S', does: 'Go to the Summary' },
  { caps: '?', does: 'This sheet' },
] as const;

const bound = new Map<string, () => void>();

/** `key` is a KeyboardEvent key, or two separated by a space for a sequence such as "g s". */
export function bind(key: string, run: () => void): void {
  bound.set(key, run);
}

export const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));

/** The first key of a sequence, waiting a moment for the second. */
let started: { key: string; at: number } | null = null;
const SEQUENCE_MS = 1500;

/** Runs the shortcut `event` presses, unless the person is typing or in a menu or a popover; says whether it ran one. */
export function runShortcut(event: KeyboardEvent): boolean {
  if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || isTyping(event.target)) return false;
  // A popover holds the page still even once the focus has left it for the browser's own controls.
  if (document.querySelector('dialog[open]') || (event.target instanceof Element && event.target.closest('[role="menu"]'))) return false;
  const first = started && Date.now() - started.at < SEQUENCE_MS ? started.key : null;
  started = null;
  const run = (first !== null ? bound.get(`${first} ${event.key}`) : undefined) ?? bound.get(event.key);
  if (!run) {
    if ([...bound.keys()].some(key => key.startsWith(`${event.key} `))) started = { key: event.key, at: Date.now() };
    return false;
  }
  // So "/" opens no quick find and lands in no box it focuses.
  event.preventDefault();
  run();
  return true;
}

/** "Approve (A)": what a control does and the key that does it, as its tooltip says. */
export const withKey = (label: string, key: string) => `${label} (${key})`;

export function shortcutSheet(returnTo: () => Element | null): HTMLDialogElement {
  const rows = SHORTCUTS.map(({ caps, does }) => el('tr', {}, el('td', {}, el('kbd', {}, caps)), el('td', {}, does)));
  const dialog = openDialog('Keyboard shortcuts', returnTo, el('table', { className: 'keys' }, el('tbody', {}, ...rows)));
  dialog.classList.add('sheet');
  dialog.querySelector('.popover-head')?.prepend(icon('keyboard'));
  return dialog;
}
