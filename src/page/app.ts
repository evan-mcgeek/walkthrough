// The review page: the header, the AI's steps with their files on the left, and the open step or the Summary.
import type { WalkthroughView } from '../review';
import type { Viewer } from '../viewer';
import { chooseTheme, loadViewer } from './appearance';
import { attrs, el, postQuietly, region, showAlert, showUnreachable } from './dom';
import { pick } from './files';
import { icon } from './icons';
import { animate, FADE_IN, reduced } from './motion';
import { ago, aiReviewing, allFiles, baseName, commentCount, PAGE, pendingComments, phone, plural, state, stepOfFile } from './state';
import { StepPane } from './step';
import { type Reveal, SummaryPane } from './summary';

const header = region('header');
const nav = region('nav');
const main = region('main');
const pill = attrs(el('button', { type: 'button', className: 'new-pill', hidden: true }), { 'aria-live': 'polite' });
const content = el('div', { className: 'content' });
main.append(pill, content);
// Threads stay in view while a wide diff scrolls sideways, so they need the width the pane shows.
new ResizeObserver(() => {
  main.style.setProperty('--pane', `${String(content.clientWidth)}px`);
}).observe(content);

let theme: Viewer['theme'] = 'system';
let stopped = false;
const panes = new Map<string, { key: string; pane: StepPane }>();
const summary = new SummaryPane(target => {
  reveal(target);
});
/** What arrived where it would have moved the page, folded until the pill opens it. */
let arrived: HTMLElement[] = [];

const stepAddress = (id: string) => `step-${id}`;
const firstAddress = () => (state.view.steps[0] ? stepAddress(state.view.steps[0].id) : '');

type At = { kind: 'summary' } | { kind: 'step'; pane: StepPane } | { kind: 'preparing' };

/** The step or Summary the address names; a step gone falls back to the first. */
function current(): At {
  const address = decodeURIComponent(location.hash.slice(1));
  if (!state.view.steps.length) return { kind: 'preparing' };
  if (address === 'summary') return { kind: 'summary' };
  const step = state.view.steps.find(one => stepAddress(one.id) === address) ?? state.view.steps[0];
  return step ? { kind: 'step', pane: paneOf(step.id) } : { kind: 'preparing' };
}

function paneOf(id: string): StepPane {
  const step = state.view.steps.find(one => one.id === id);
  if (!step) throw new Error(`no step ${id}`);
  const key = JSON.stringify([step.diff, step.files, step.folded]);
  const kept = panes.get(id);
  if (kept?.key === key) return kept.pane;
  const pane = new StepPane(step, main);
  panes.set(id, { key, pane });
  pane.update(() => false, go);
  return pane;
}

function go(address: string): void {
  pick(null);
  if (decodeURIComponent(location.hash.slice(1)) !== address) history.pushState(null, '', `#${address}`);
  document.body.classList.remove('drawer-open');
  moved();
}

/** After moving to another step or the Summary: what was held opens, the pane enters, and the page starts at its top. */
function moved(): void {
  for (const one of arrived) one.classList.remove('arriving');
  arrived = [];
  render(true, true);
  main.scrollTop = 0;
  const shown = content.firstElementChild;
  if (shown)
    animate(shown, 'pane-enter', reduced() ? FADE_IN : [{ opacity: 0, transform: 'translateX(12px)' }, { opacity: 1, transform: 'none' }], {
      ms: 'base',
      curve: reduced() ? 'linear' : 'ease-out',
    });
  content.querySelector<HTMLElement>('.step-title')?.focus({ preventScroll: true });
}

function reveal({ thread: id, edit, file }: Reveal): void {
  const thread = state.view.threads.find(one => one.id === id);
  const stepId = thread ? thread.step : file === undefined ? undefined : stepOfFile(file)?.id;
  if (stepId === undefined || stepId === null) return;
  go(stepAddress(stepId));
  const pane = paneOf(stepId).fileNamed(thread?.file ?? file ?? '');
  if (!pane) return;
  pane.open();
  const shown = thread && pane.thread(thread.id);
  const target = shown ? shown.row : pane.box;
  main.scrollTop += target.getBoundingClientRect().top - main.getBoundingClientRect().top - (shown ? 120 : 0);
  if (shown && edit) shown.box.edit(edit);
}

/** The first thing at or below the top of the pane, to keep where it is while the page changes around it. */
function readingAnchor(): { element: Element; top: number } | null {
  const top = main.getBoundingClientRect().top;
  for (const element of content.querySelectorAll('.step-head, .file-header, tr, .step-foot')) {
    const box = element.getBoundingClientRect();
    if (box.height && box.bottom > top) return { element, top: box.top };
  }
  return null;
}

function drawPill(): void {
  arrived = arrived.filter(one => one.isConnected && one.classList.contains('arriving'));
  const count = arrived.reduce((sum, one) => sum + Math.max(1, one.querySelectorAll('.comment').length), 0);
  pill.hidden = count === 0;
  pill.replaceChildren(icon('up'), count === 1 ? '1 new comment above' : `${String(count)} new comments above`);
}

pill.onclick = () => {
  const [first] = arrived;
  for (const one of arrived) {
    one.classList.remove('arriving');
    one.classList.add('grow');
  }
  arrived = [];
  drawPill();
  if (first) main.scrollTop += first.getBoundingClientRect().top - main.getBoundingClientRect().top - 120;
};

let drawnHeader = '';

function drawHeader(onSummary: boolean): void {
  const { view } = state;
  const files = allFiles().length;
  const viewed = view.viewed.length;
  const reviewing = aiReviewing();
  const name = view.kind === 'branch' ? view.branch : view.label;
  const key = JSON.stringify([view.pr, name, files, viewed, reviewing, onSummary]);
  if (key === drawnHeader) return;
  drawnHeader = key;
  const focused = document.activeElement instanceof HTMLElement && header.contains(document.activeElement) ? document.activeElement.dataset['key'] : undefined;
  const fill = el('i');
  fill.style.setProperty('width', `${String(files ? (viewed / files) * 100 : 0)}%`);
  const label = view.pr
    ? el('span', { className: 'change-label', title: `#${view.pr.number} ${view.pr.title}` }, el('span', { className: 'pr-number' }, `#${view.pr.number}`), ` ${view.pr.title}`)
    : el('code', { className: 'change-label branch', title: name }, name);
  const steps = attrs(el('button', { type: 'button', className: 'icon-button steps-button', onclick: toggleDrawer }, icon('sidebar')), {
    'aria-label': 'Steps and files',
    'aria-expanded': String(document.body.classList.contains('drawer-open')),
    'aria-controls': 'nav',
  });
  steps.dataset['key'] = 'steps';
  const finish = el(
    'a',
    { className: 'btn primary small finish', href: '#summary', title: 'Go to the Summary (G S)', hidden: onSummary },
    el('span', { className: 'long' }, 'Finish review'),
    el('span', { className: 'short' }, 'Finish'),
  );
  attrs(finish, { 'aria-label': 'Finish review' });
  finish.onclick = event => {
    event.preventDefault();
    go('summary');
  };
  finish.dataset['key'] = 'finish';
  const more = attrs(
    el('button', { type: 'button', className: 'icon-button menu-button', onclick: toggleMenu }, icon('more')),
    { 'aria-label': 'Menu', 'aria-haspopup': 'menu', 'aria-expanded': 'false' },
  );
  more.dataset['key'] = 'menu';
  const reviewingNow = reviewing
    ? [
        attrs(el('span', { className: 'ai-reviewing', title: 'The AI is still reviewing; comments may arrive' }, icon('spinner'), el('span', { className: 'long' }, 'AI reviewing')), {
          role: 'status',
          'aria-label': 'AI reviewing',
        }),
      ]
    : [];
  closeMenu(false);
  header.replaceChildren(
    attrs(el('span', { className: 'mark' }, icon('mark')), { 'aria-hidden': 'true' }),
    steps,
    label,
    el(
      'span',
      { className: 'files-viewed' },
      attrs(el('span', { className: 'bar' }, fill), { 'aria-hidden': 'true' }),
      el('span', { className: 'count' }, `${String(viewed)} / ${String(files)}`, el('span', { className: 'long' }, ' files viewed')),
    ),
    ...reviewingNow,
    el('span', { className: 'spacer' }),
    finish,
    more,
  );
  if (focused !== undefined) header.querySelector<HTMLElement>(`[data-key="${focused}"]`)?.focus();
}

function toggleDrawer(): void {
  const open = document.body.classList.toggle('drawer-open');
  header.querySelector('.steps-button')?.setAttribute('aria-expanded', String(open));
  if (open) nav.querySelector<HTMLElement>('[aria-current="page"]')?.focus();
}

let menu: HTMLElement | null = null;

function closeMenu(refocus: boolean): void {
  if (!menu) return;
  menu.remove();
  menu = null;
  const button = header.querySelector<HTMLElement>('.menu-button');
  button?.setAttribute('aria-expanded', 'false');
  if (refocus) button?.focus();
}

function toggleMenu(): void {
  if (menu) {
    closeMenu(true);
    return;
  }
  const item = (label: string, role: string, choose: () => void, checked?: boolean) => {
    const button = attrs(el('button', { type: 'button', className: 'menu-item', tabIndex: -1 }, label), { role });
    if (checked !== undefined) button.setAttribute('aria-checked', String(checked));
    button.onclick = () => {
      closeMenu(true);
      choose();
    };
    return button;
  };
  const names = { system: 'System', light: 'Light', dark: 'Dark' } as const;
  const themes = (['system', 'light', 'dark'] as const).map(one =>
    item(
      names[one],
      'menuitemradio',
      () => {
        theme = one;
        chooseTheme(one);
      },
      theme === one,
    ),
  );
  const opened = attrs(
    el(
      'div',
      { className: 'menu' },
      attrs(el('div', {}, el('p', { className: 'menu-label', id: 'menu-theme' }, 'Theme'), ...themes), { role: 'group', 'aria-labelledby': 'menu-theme' }),
      el('hr'),
      item('End session', 'menuitem', () => void endSession()),
    ),
    { role: 'menu', 'aria-label': 'Menu' },
  );
  opened.onkeydown = event => {
    const items = [...opened.querySelectorAll<HTMLElement>('.menu-item')];
    const at = document.activeElement instanceof HTMLElement ? items.indexOf(document.activeElement) : -1;
    const step = event.key === 'ArrowDown' ? 1 : event.key === 'ArrowUp' ? -1 : 0;
    if (step) {
      event.preventDefault();
      items[(at + step + items.length) % items.length]?.focus();
    } else if (event.key === 'Escape' || event.key === 'Tab') {
      event.preventDefault();
      closeMenu(true);
    }
  };
  menu = opened;
  header.append(opened);
  header.querySelector('.menu-button')?.setAttribute('aria-expanded', 'true');
  animate(opened, 'menu-in', FADE_IN, { ms: 'fast', curve: 'linear' });
  (opened.querySelector<HTMLElement>('[aria-checked="true"]') ?? opened.querySelector<HTMLElement>('.menu-item'))?.focus();
}

document.addEventListener('pointerdown', event => {
  const button = header.querySelector('.menu-button');
  if (menu && event.target instanceof Node && !menu.contains(event.target) && !button?.contains(event.target)) closeMenu(false);
});

async function endSession(): Promise<void> {
  await postQuietly('stop', {});
  stopped = true;
  clearInterval(poller);
  showUnreachable(PAGE);
}

let drawnNav = '';

function drawNav(at: At): void {
  const { view } = state;
  const here = at.kind === 'step' ? at.pane.step.id : at.kind;
  const counts = view.steps.map(step => step.files.map(file => commentCount(step.id, file)));
  const pending = pendingComments().length;
  const key = JSON.stringify([view.steps.map(step => [step.id, step.title, step.files]), view.viewed, view.reviewing, !!view.submitted, counts, pending, here]);
  if (key === drawnNav) return;
  drawnNav = key;
  const focused = document.activeElement instanceof HTMLElement && nav.contains(document.activeElement) ? document.activeElement.dataset['key'] : undefined;
  const scrolled = nav.scrollTop;
  const link = (address: string, className: string, ...children: (Node | string)[]) => {
    const row = el('a', { className, href: `#${address}` }, ...children);
    row.onclick = event => {
      event.preventDefault();
      go(address);
    };
    return row;
  };
  const steps = view.steps.map((step, index) => {
    const reviewing = view.reviewing.includes(step.id) && !view.submitted;
    const row = link(
      stepAddress(step.id),
      'step-row',
      el('span', { className: 'step-number' }, String(index + 1)),
      el('span', { className: 'step-name', title: step.title }, step.title),
      ...(reviewing ? [attrs(el('span', { className: 'step-reviewing', title: 'AI still reviewing this step' }, icon('spinner')), { role: 'img', 'aria-label': 'AI still reviewing this step' })] : []),
    );
    row.dataset['key'] = `step:${step.id}`;
    if (here === step.id) row.setAttribute('aria-current', 'page');
    const files = step.files.map((file, at) => {
      const seen = view.viewed.includes(file);
      const count = counts[index]?.[at] ?? 0;
      const fileRow = el(
        'a',
        { className: `file-row${seen ? ' viewed' : ''}`, href: `#${stepAddress(step.id)}`, title: file },
        icon(seen ? 'met' : 'ring', seen ? 'Viewed' : 'Not viewed'),
        el('span', { className: 'file-name' }, baseName(file)),
        ...(count ? [el('span', { className: 'file-count', title: plural(count, 'comment') }, icon('message'), String(count))] : []),
      );
      fileRow.dataset['key'] = `file:${file}`;
      fileRow.onclick = event => {
        event.preventDefault();
        reveal({ file });
      };
      return el('li', {}, fileRow);
    });
    return el('li', { className: here === step.id ? 'current' : '' }, row, el('ul', { className: 'file-list' }, ...files));
  });
  const last = link('summary', 'step-row summary-row', icon('summary'), el('span', { className: 'step-name' }, 'Summary'), el('span', { className: 'file-count' }, String(pending)));
  last.dataset['key'] = 'summary';
  if (here === 'summary') last.setAttribute('aria-current', 'page');
  nav.replaceChildren(el('ol', { className: 'steps' }, ...steps), last);
  nav.scrollTop = scrolled;
  if (focused !== undefined) nav.querySelector<HTMLElement>(`[data-key="${CSS.escape(focused)}"]`)?.focus();
}

/** Redraws what changed, keeping the line being read where it is; `own` for what the person did, which shows in place. */
function render(own: boolean, navigated = false): void {
  const at = current();
  drawHeader(at.kind === 'summary');
  drawNav(at);
  document.body.dataset['view'] = at.kind;
  const anchor = navigated ? null : readingAnchor();
  if (at.kind === 'preparing') {
    if (!content.querySelector('.preparing')) content.replaceChildren(attrs(el('div', { className: 'preparing' }, icon('mark')), { 'aria-busy': 'true' }));
  } else if (at.kind === 'summary') {
    summary.update();
    if (content.firstElementChild !== summary.box) content.replaceChildren(summary.box);
  } else {
    if (content.firstElementChild !== at.pane.box) content.replaceChildren(at.pane.box);
    const bottom = main.getBoundingClientRect().bottom;
    // Something landing above the bottom of what the reader sees would push what they read.
    const shows = (element: Element) => !own && element.getBoundingClientRect().top < bottom;
    arrived.push(...at.pane.update(shows, go));
  }
  if (anchor?.element.isConnected) main.scrollTop += anchor.element.getBoundingClientRect().top - anchor.top;
  drawPill();
  for (const time of content.querySelectorAll<HTMLTimeElement>('time.comment-time')) time.textContent = ago(time.dateTime);
}

state.render = own => {
  render(own);
};

window.addEventListener('popstate', moved);
phone.addEventListener('change', () => {
  document.body.classList.remove('drawer-open');
});

let pendingKey = '';
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && document.body.classList.contains('drawer-open')) {
    toggleDrawer();
    header.querySelector<HTMLElement>('.steps-button')?.focus();
    return;
  }
  const typing = event.target instanceof HTMLElement && event.target.closest('input, textarea, [contenteditable]');
  if (typing || event.altKey || event.ctrlKey || event.metaKey) return;
  if (pendingKey === 'g' && event.key === 's' && state.view.steps.length) go('summary');
  pendingKey = event.key === 'g' ? 'g' : '';
});

const POLL_MS = 1500;
let polling = false;
let tag = '';

function poll(): void {
  if (polling || stopped) return;
  polling = true;
  const since = state.sends;
  fetch('data/walkthrough.json', tag ? { headers: { 'if-none-match': tag } } : {})
    .then(async answer => {
      if (document.body.classList.contains('unreachable')) showAlert(null);
      if (answer.status === 304 || since !== state.sends) return;
      if (!answer.ok) throw new Error(String(answer.status));
      tag = answer.headers.get('etag') ?? '';
      state.view = (await answer.json()) as WalkthroughView;
      render(false);
    })
    .catch(() => {
      showUnreachable(PAGE);
    })
    .finally(() => {
      polling = false;
    });
}

PAGE.retry = poll;
theme = await loadViewer();
const first = await fetch('data/walkthrough.json');
tag = first.headers.get('etag') ?? '';
state.view = (await first.json()) as WalkthroughView;
if (!location.hash && firstAddress()) history.replaceState(null, '', `#${firstAddress()}`);
render(true, true);
const poller = setInterval(poll, POLL_MS);
