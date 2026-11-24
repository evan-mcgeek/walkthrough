import { el, openDialog } from './dom';
import { icon, type IconName } from './icons';

/** Every key the page answers, in the order Help lists them; each part of the page binds the keys it acts on. */
const SHORTCUTS = [
  { caps: 'J / K', does: 'Next / previous step' },
  { caps: 'A', does: 'Approve and go to the next step' },
  { caps: 'F', does: 'Flag (asks for a note)' },
  { caps: '/', does: 'Ask about this step' },
  { caps: 'Click, Shift-click a line', does: 'Pick lines' },
  { caps: 'C', does: 'Comment on picked lines' },
  { caps: 'V', does: 'Mark the file as viewed' },
  { caps: '1 – 3', does: 'Show or hide a panel' },
  { caps: 'G then S', does: 'Go to the Summary' },
  { caps: '?', does: 'This sheet' },
] as const;

/** What each state icon means, in the words Help and the icon's tooltip use. */
export const MEANS: Partial<Record<IconName, string>> = {
  current: 'The step you are on',
  decided: 'Decided: positive, such as Approve',
  flagged: 'Decided: needs attention, such as Flag',
  'no-tone': 'Decided, no tone',
  warn: 'Open finding or problem: needs you',
  reopened: 'Changed since you decided',
  unread: 'Not decided yet',
  folded: 'Files to skim: the session says why',
  met: 'Met',
  partly: 'Partly met',
  'not-met': 'Not met',
  unchecked: 'Not checked yet',
};

/** The colour each state icon shows in, said in words beside it. */
const COLOURS: Partial<Record<IconName, string>> = {
  current: 'ink',
  decided: 'green',
  flagged: 'amber',
  'no-tone': 'grey',
  warn: 'amber',
  reopened: 'amber',
  unread: 'grey',
  met: 'green',
  partly: 'amber',
  'not-met': 'red',
  unchecked: 'grey',
};

const STEP_MARKS = ['current', 'decided', 'flagged', 'warn', 'reopened', 'no-tone', 'unread'] as const;
const CHECKLIST_MARKS = ['met', 'partly', 'not-met', 'unchecked'] as const;

/** A step's display state each icon shows, so Help draws it in the same colour as To review. */
const STATE_OF: Partial<Record<IconName, string>> = { current: 'cur', decided: 'ok', flagged: 'flag', 'no-tone': 'neu', warn: 'find', reopened: 'reo', unread: 'un' };

const SEGMENTS = [
  ['ok', 'Solid: decided, positive'],
  ['flag', 'Striped: needs you, flagged, a finding, or changed'],
  ['neu', 'Outlined: decided, no tone'],
  ['un', 'Faint: not decided yet'],
  ['cur', 'Where you are: solid ink, taller'],
] as const;

const STATUSES = [
  ['listening', 'Listening', 'The session is ready for your questions'],
  ['working', 'Working', 'The session is busy on something you asked'],
  ['needs-you', 'Needs you', 'The session asked you a question'],
  ['gone', 'Gone', 'The session stopped listening; what you send waits for it'],
] as const;

/** A legend table: what each mark shows, then what it means. */
const legend = (rows: [Node, string][]) =>
  el('table', { className: 'keys legend' }, el('tbody', {}, ...rows.map(([mark, means]) => el('tr', {}, el('td', {}, mark), el('td', {}, means)))));

const group = (name: string) => el('p', { className: 'popover-label' }, name);

function meanings(): HTMLElement[] {
  const rowIcon = (name: IconName) => {
    const mark = el('span', { className: 'help-mark' }, icon(name));
    mark.dataset['state'] = STATE_OF[name] ?? name;
    return mark;
  };
  const means = (name: IconName): [Node, string] => [rowIcon(name), `${MEANS[name] ?? ''} (${COLOURS[name] ?? ''})`];
  const checking = el('span', { className: 'help-mark' }, icon('unchecked'));
  const segments = SEGMENTS.map(([state, means]): [Node, string] => {
    const segment = el('span', { className: 'segment' });
    segment.dataset['state'] = state;
    return [segment, means];
  });
  const notes: [Node, string][] = [
    [el('span', { className: 'help-label finding' }, icon('warn'), 'Finding'), 'A problem the session found'],
    [el('span', { className: 'help-label' }, icon('message'), 'Note'), 'A remark from the session'],
    [el('span', { className: 'help-label' }, 'You asked'), 'Your question and its answer'],
    [el('span', { className: 'help-label own' }, icon('own'), 'Your comment'), 'Yours: the session gets it with your decisions'],
    [el('span', { className: 'help-label finding' }, icon('warn'), '1 finding'), 'On a file: go to its first finding'],
    [el('span', { className: 'help-label' }, icon('message'), '2 notes'), 'On a file: go to its first note'],
    [el('span', { className: 'help-label own' }, icon('own'), '1 yours'), 'On a file: go to your first comment on it'],
    [el('span', { className: 'help-label finding' }, icon('warn'), '2 open findings'), 'Under a step: go to the next open finding'],
  ];
  const findings = el('span', { className: 'help-label finding' }, icon('warn'));
  const statuses = STATUSES.map(([state, name, means]): [Node, string] => {
    const status = el('span', { className: 'status' }, state === 'working' ? icon('spinner') : el('span', { className: 'dot' }), name);
    status.dataset['state'] = state;
    return [status, means];
  });
  return [
    el(
      'div',
      { className: 'help-column' },
      el('h2', { className: 'popover-head', id: 'help-head' }, 'What things mean'),
      group('Steps in To review'),
      legend([
        ...STEP_MARKS.map(means),
        [checking, 'The session is still checking it'],
        [rowIcon('folded'), MEANS.folded ?? ''],
        [findings, 'Open findings, as "2 open findings": opens the step at the first'],
      ]),
      group('Checklist items'),
      legend(CHECKLIST_MARKS.map(means)),
      group('The progress bar'),
      legend(segments),
    ),
    el(
      'div',
      { className: 'help-column' },
      el('span', { className: 'popover-head' }),
      group('Notes on the code'),
      legend(notes),
      group('Session status'),
      legend(statuses),
    ),
  ];
}

/** Help: what every icon, colour and status on the page means, then the keyboard shortcuts. */
export function helpSheet(returnTo: () => Element | null): HTMLDialogElement {
  const rows = SHORTCUTS.map(({ caps, does }) => el('tr', {}, el('td', {}, el('kbd', {}, caps)), el('td', {}, does)));
  const keys = el(
    'div',
    { className: 'help-column' },
    el('h2', { className: 'popover-head', id: 'help-keys' }, icon('keyboard'), 'Keyboard shortcuts'),
    el('table', { className: 'keys' }, el('tbody', {}, ...rows)),
  );
  const dialog = openDialog('Help: what things mean', returnTo, ...meanings(), keys);
  dialog.classList.add('help');
  return dialog;
}

const bound = new Map<string, (event: KeyboardEvent) => void>();

/** `key` is a KeyboardEvent key, or two separated by a space for a sequence such as "g s". */
export function bind(key: string, run: (event: KeyboardEvent) => void): void {
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
  run(event);
  return true;
}

/** "Approve (A)": what a control does and the key that does it, as its tooltip says. */
export const withKey = (label: string, key: string) => `${label} (${key})`;
