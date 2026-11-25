// The review page: the header, the AI's steps with their files on the left, and the open step or the Summary.
import type { WalkthroughView } from '../review';
import type { Viewer } from '../viewer';
import { chooseTheme, loadViewer } from './appearance';
import { attrs, el, postQuietly, region, showAlert, showUnreachable } from './dom';
import { pick } from './files';
import { icon } from './icons';
import { animate, duration, FADE_IN, fadeOut, grow, reduced, settle, tick } from './motion';
import { Opening, openingNav } from './opening';
import { ago, allFiles, baseName, commentCount, PAGE, pendingComments, phone, plural, state, stepOfFile } from './state';
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
/** Shown until the walkthrough is ready. */
let opening: Opening | null = null;

const stepAddress = (id: string) => `step-${id}`;
const firstAddress = () => (state.view.steps[0] ? stepAddress(state.view.steps[0].id) : '');

type At = { kind: 'summary' } | { kind: 'step'; pane: StepPane } | { kind: 'opening' };

/** The step or Summary the address names; a step gone falls back to the first. */
function current(): At {
  const address = decodeURIComponent(location.hash.slice(1));
  if (!state.view.ready) return { kind: 'opening' };
  if (address === 'summary') return { kind: 'summary' };
  const step = state.view.steps.find(one => stepAddress(one.id) === address) ?? state.view.steps[0];
  return step ? { kind: 'step', pane: paneOf(step.id) } : { kind: 'opening' };
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
  showDrawer(false);
  moved();
}

/** After moving to another step or the Summary: what was held opens, the old pane leaves, the new one enters, and the page starts at its top. */
function moved(): void {
  for (const one of arrived) one.classList.remove('arriving');
  arrived = [];
  const old = content.firstElementChild;
  const scrolled = main.scrollTop;
  // Stopped while still in the page: a pane taken out of it no longer lists what plays on it.
  if (old) settle(old);
  render(true, true);
  main.scrollTop = 0;
  const shown = content.firstElementChild;
  if (shown && shown !== old) {
    settle(shown);
    shown.removeAttribute('inert');
    shown.removeAttribute('aria-hidden');
    // The Opening leaves by itself.
    const leaving = old instanceof HTMLElement && !old.classList.contains('opening');
    if (leaving) leave(old, scrolled);
    const still = reduced();
    animate(shown, 'pane-enter', still ? FADE_IN : [{ opacity: 0, transform: 'translateX(12px)' }, { opacity: 1, transform: 'none' }], {
      ms: 'base',
      curve: still ? 'linear' : 'ease-out',
      delay: leaving ? LEAVE_MS : 0,
    });
  }
  content.querySelector<HTMLElement>('.step-title')?.focus({ preventScroll: true });
}

const LEAVE_MS = 100;

/** The pane moved away from stays where it was read and leaves to the left, then goes. */
function leave(old: HTMLElement, scrolled: number): void {
  attrs(old, { inert: '', 'aria-hidden': 'true' });
  content.append(old);
  const at = `translateY(${String(-scrolled)}px)`;
  const still = reduced();
  const leaving = animate(old, 'pane-leave', [{ opacity: 1, transform: at }, { opacity: 0, transform: still ? at : `${at} translateX(-12px)` }], {
    ms: LEAVE_MS,
    curve: still ? 'linear' : 'ease-in',
    fill: 'forwards',
  });
  leaving.finished.then(
    () => {
      if (content.firstElementChild !== old) old.remove();
    },
    () => {},
  );
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
  // A pane still leaving would scroll along with the one landing here.
  for (const leaving of content.querySelectorAll(':scope > [inert]')) leaving.remove();
  if (shown && edit) shown.box.edit(edit);
}

/** The first thing at or below the top of the pane, to keep where it is while the page changes around it. */
function readingAnchor(): { element: Element; top: number } | null {
  const top = main.getBoundingClientRect().top;
  for (const element of content.firstElementChild?.querySelectorAll('.step-head, .file-header, tr, .step-foot') ?? []) {
    const box = element.getBoundingClientRect();
    if (box.height && box.bottom > top) return { element, top: box.top };
  }
  return null;
}

function drawPill(): void {
  arrived = arrived.filter(one => one.isConnected && one.classList.contains('arriving'));
  const count = arrived.reduce((sum, one) => sum + Math.max(1, one.querySelectorAll('.comment').length), 0);
  if (count) {
    settle(pill);
    pill.hidden = false;
    pill.replaceChildren(icon('up'), count === 1 ? '1 new comment above' : `${String(count)} new comments above`);
  } else if (!pill.hidden)
    fadeOut(
      pill,
      'fast',
      () => {
        pill.hidden = true;
      },
      'ease-in',
    );
}

pill.onclick = () => {
  const [first] = arrived;
  for (const one of arrived) one.classList.remove('arriving');
  for (const one of arrived) grow(one.querySelector<HTMLElement>(':scope > td > .thread-cell') ?? one);
  arrived = [];
  drawPill();
  if (first)
    main.scrollTo({
      top: main.scrollTop + first.getBoundingClientRect().top - main.getBoundingClientRect().top - 120,
      behavior: reduced() ? 'instant' : 'smooth',
    });
};

// The header is drawn once and changed in place, so its count, bar and indicator can move.
const viewedFill = el('i');
const viewedNumber = el('span', { className: 'viewed-number' });
const viewedTotal = document.createTextNode('');
const filesViewed = el(
  'span',
  { className: 'files-viewed' },
  attrs(el('span', { className: 'bar' }, viewedFill), { 'aria-hidden': 'true' }),
  el('span', { className: 'count' }, viewedNumber, viewedTotal, el('span', { className: 'long' }, ' files viewed')),
);
const filesChanged = el('span', { className: 'files-changed', hidden: true });
const reviewingNow = attrs(el('span', { className: 'ai-reviewing' }, icon('spinner'), el('span', { className: 'long' }, 'AI reviewing')), {
  role: 'status',
  'aria-label': 'AI reviewing',
});
const finish = attrs(
  el('a', { className: 'btn primary small finish', href: '#summary', title: 'Go to the Summary (G S)' }, el('span', { className: 'long' }, 'Finish review'), el('span', { className: 'short' }, 'Finish')),
  { 'aria-label': 'Finish review' },
);
finish.onclick = event => {
  event.preventDefault();
  go('summary');
};
let changeLabel: HTMLElement = el('span');
header.append(
  attrs(el('span', { className: 'mark' }, icon('mark')), { 'aria-hidden': 'true' }),
  attrs(el('button', { type: 'button', className: 'icon-button steps-button', onclick: toggleDrawer }, icon('sidebar')), {
    'aria-label': 'Steps and files',
    'aria-expanded': 'false',
    'aria-controls': 'nav',
  }),
  changeLabel,
  filesViewed,
  filesChanged,
  el('span', { className: 'spacer' }),
  finish,
  attrs(el('button', { type: 'button', className: 'icon-button menu-button', onclick: toggleMenu }, icon('more')), {
    'aria-label': 'Menu',
    'aria-haspopup': 'menu',
    'aria-expanded': 'false',
  }),
);
let drawnLabel = '';
let shownViewed: number | undefined;

function drawHeader(onSummary: boolean): void {
  const { view } = state;
  const name = view.kind === 'branch' ? view.branch : view.label;
  const label = JSON.stringify([view.pr, name]);
  if (label !== drawnLabel) {
    drawnLabel = label;
    const fresh = view.pr
      ? el('span', { className: 'change-label', title: `#${view.pr.number} ${view.pr.title}` }, el('span', { className: 'pr-number' }, `#${view.pr.number}`), ` ${view.pr.title}`)
      : el('code', { className: 'change-label branch', title: name }, name);
    changeLabel.replaceWith(fresh);
    changeLabel = fresh;
  }
  // The tab says the AI is still reviewing, so it reads from the tab strip; a static mark, since background tabs barely animate.
  const reviewing = !view.ready && !view.sessionGone;
  const title = `${reviewing ? 'Reviewing · ' : ''}${view.pr ? `#${view.pr.number} ${view.pr.title}` : name} · Walkthrough`;
  if (document.title !== title) document.title = title;
  const favicon = reviewing ? 'favicon-reviewing.svg' : 'favicon.svg';
  const icon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (icon && icon.getAttribute('href') !== favicon) icon.setAttribute('href', favicon);
  const files = allFiles().length;
  const viewed = view.viewed.length;
  viewedTotal.data = ` / ${String(files)}`;
  viewedFill.style.setProperty('width', `${String(files ? (viewed / files) * 100 : 0)}%`);
  if (viewed !== shownViewed) {
    viewedNumber.textContent = String(viewed);
    if (shownViewed !== undefined) tick(viewedNumber);
    shownViewed = viewed;
  }
  const ready = view.ready;
  filesViewed.hidden = !ready;
  filesChanged.hidden = ready;
  const changed = view.changedFiles.length;
  if (!ready) filesChanged.replaceChildren(el('span', {}, plural(changed, 'file'), el('span', { className: 'long' }, ' changed')));
  finish.hidden = onSummary || !ready;
  if (!ready && !view.sessionGone) {
    settle(reviewingNow);
    if (!reviewingNow.isConnected) filesChanged.after(reviewingNow);
  } else if (reviewingNow.isConnected)
    fadeOut(reviewingNow, 'base', () => {
      reviewingNow.remove();
    });
}

function showDrawer(open: boolean): void {
  document.body.classList.toggle('drawer-open', open);
  header.querySelector('.steps-button')?.setAttribute('aria-expanded', String(open));
}

function toggleDrawer(): void {
  const open = !document.body.classList.contains('drawer-open');
  showDrawer(open);
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

// The step list is drawn again only when the steps change; Viewed, counts, spinners and the current row change in place.
let drawnNav = '';
type NavFile = { file: string; row: HTMLElement; tick: HTMLElement; count: HTMLElement; shown: number };
let navSteps: { id: string; row: HTMLElement; files: NavFile[] }[] = [];
const pendingCount = el('span', { className: 'file-count' });
const summaryRow = navLink('summary', 'step-row summary-row', icon('summary'), el('span', { className: 'step-name' }, 'Summary'), pendingCount);
summaryRow.dataset['key'] = 'summary';
let shownPending: number | undefined;

function navLink(address: string, className: string, ...children: (Node | string)[]): HTMLAnchorElement {
  const row = el('a', { className, href: `#${address}` }, ...children);
  row.onclick = event => {
    event.preventDefault();
    go(address);
  };
  return row;
}

function buildNav(): void {
  const focused = document.activeElement instanceof HTMLElement && nav.contains(document.activeElement) ? document.activeElement.dataset['key'] : undefined;
  const scrolled = nav.scrollTop;
  navSteps = state.view.steps.map((step, index) => {
    const row = navLink(stepAddress(step.id), 'step-row', el('span', { className: 'step-number' }, String(index + 1)), el('span', { className: 'step-name', title: step.title }, step.title));
    row.dataset['key'] = `step:${step.id}`;
    const files = step.files.map(file => {
      const tick = attrs(el('span', { className: 'viewed-tick' }, icon('ring'), icon('met')), { role: 'img' });
      const count = el('span', { className: 'file-count' }, icon('message'), '');
      const fileRow = el('a', { className: 'file-row', href: `#${stepAddress(step.id)}`, title: file }, tick, el('span', { className: 'file-name' }, baseName(file)), count);
      fileRow.dataset['key'] = `file:${file}`;
      fileRow.onclick = event => {
        event.preventDefault();
        reveal({ file });
      };
      return { file, row: fileRow, tick, count, shown: -1 };
    });
    return { id: step.id, row, files };
  });
  const items = navSteps.map(({ row, files }) => el('li', {}, row, el('ul', { className: 'file-list' }, ...files.map(one => el('li', {}, one.row)))));
  nav.replaceChildren(el('ol', { className: 'steps' }, ...items), summaryRow);
  nav.scrollTop = scrolled;
  if (focused !== undefined) nav.querySelector<HTMLElement>(`[data-key="${CSS.escape(focused)}"]`)?.focus();
}

function drawNav(at: At): void {
  const { view } = state;
  if (at.kind === 'opening') {
    const key = view.sessionGone ? 'gone' : 'opening';
    if (key !== drawnNav) nav.replaceChildren(...openingNav());
    drawnNav = key;
    shownPending = undefined;
    return;
  }
  const key = JSON.stringify(view.steps.map(step => [step.id, step.title, step.files]));
  if (key !== drawnNav) {
    drawnNav = key;
    buildNav();
  }
  const here = at.kind === 'step' ? at.pane.step.id : at.kind;
  for (const { id, row, files } of navSteps) {
    if (here === id) row.setAttribute('aria-current', 'page');
    else row.removeAttribute('aria-current');
    for (const one of files) {
      const seen = view.viewed.includes(one.file);
      one.row.classList.toggle('viewed', seen);
      one.tick.setAttribute('aria-label', seen ? 'Viewed' : 'Not viewed');
      const count = commentCount(id, one.file);
      if (count === one.shown) continue;
      one.count.hidden = count === 0;
      one.count.title = plural(count, 'comment');
      one.count.lastChild?.replaceWith(String(count));
      if (one.shown > 0 && count > 0) tick(one.count);
      one.shown = count;
    }
  }
  if (here === 'summary') summaryRow.setAttribute('aria-current', 'page');
  else summaryRow.removeAttribute('aria-current');
  const pending = pendingComments().length;
  if (pending !== shownPending) {
    pendingCount.textContent = String(pending);
    if (shownPending !== undefined) tick(pendingCount);
    shownPending = pending;
  }
}

/** Redraws what changed, keeping the line being read where it is; `own` for what the person did, which shows in place. */
function render(own: boolean, navigated = false): void {
  const at = current();
  drawHeader(at.kind === 'summary');
  drawNav(at);
  document.body.dataset['view'] = at.kind;
  const anchor = navigated ? null : readingAnchor();
  const old = content.firstElementChild;
  // Everything recorded before ready shows in place, never behind the pill.
  const fromOpening = !!opening && old === opening.box;
  if (at.kind === 'opening') {
    opening ??= new Opening();
    opening.update();
    if (old !== opening.box) {
      content.replaceChildren(opening.box);
      main.scrollTop = 0;
    }
  } else if (at.kind === 'summary') {
    summary.update();
    if (content.firstElementChild !== summary.box) content.replaceChildren(summary.box);
  } else {
    if (content.firstElementChild !== at.pane.box) content.replaceChildren(at.pane.box);
    const bottom = main.getBoundingClientRect().bottom;
    // Something landing above the bottom of what the reader sees would push what they read.
    const shows = (element: Element) => !own && !fromOpening && element.getBoundingClientRect().top < bottom;
    arrived.push(...at.pane.update(shows, go));
  }
  if (fromOpening && content.firstElementChild !== old) leaveOpening();
  if (anchor?.element.isConnected) main.scrollTop += anchor.element.getBoundingClientRect().top - anchor.top;
  drawPill();
  for (const time of content.querySelectorAll<HTMLTimeElement>('time.comment-time')) time.textContent = ago(time.dateTime);
}

/** The Opening fades out, then the walkthrough enters as a step does. */
function leaveOpening(): void {
  const leaving = opening;
  const shown = content.firstElementChild;
  if (!leaving || !shown) return;
  opening = null;
  if (!location.hash && firstAddress()) history.replaceState(null, '', `#${firstAddress()}`);
  attrs(leaving.box, { inert: '', 'aria-hidden': 'true' });
  content.append(leaving.box);
  const scrolled = main.scrollTop;
  main.scrollTop = 0;
  const at = `translateY(${String(-scrolled)}px)`;
  animate(leaving.box, 'pane-leave', [{ opacity: 1, transform: at }, { opacity: 0, transform: at }], { ms: 'fast', curve: 'ease-in', fill: 'forwards' }).finished.then(
    () => {
      leaving.stop();
      leaving.box.remove();
    },
    () => {},
  );
  const still = reduced();
  animate(shown, 'pane-enter', still ? FADE_IN : [{ opacity: 0, transform: 'translateX(12px)' }, { opacity: 1, transform: 'none' }], {
    ms: 'base',
    curve: still ? 'linear' : 'ease-out',
    delay: duration('fast'),
  });
}

state.render = own => {
  render(own);
};

window.addEventListener('popstate', moved);
phone.addEventListener('change', () => {
  showDrawer(false);
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
  if (pendingKey === 'g' && event.key === 's' && state.view.ready) go('summary');
  pendingKey = event.key === 'g' ? 'g' : '';
});

const POLL_MS = 1500;
let polling = false;
let tag = '';

function poll(): void {
  if (polling || stopped) return;
  polling = true;
  const since = state.sends;
  if (state.stale) tag = '';
  state.stale = false;
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
