// The review page: the header, the AI's steps with their files on the left, and the open step or the Summary.
import type { WalkthroughView } from '../review';
import { DEFAULT_VIEWER } from '../viewer';
import { chooseViewer, loadViewer } from './appearance';
import { attrs, el, menuKeys, postQuietly, region, showAlert, stopReading } from './dom';
import { commandBox, type Ending, endScreen } from './end';
import { type FilePane, goTo, pick, setViewed } from './files';
import { icon } from './icons';
import { animate, duration, FADE_IN, fadeAway, fadeOut, flash, grow, reduced, settle, tick } from './motion';
import { moving, shownMoves } from './moves';
import { Opening, openingNav } from './opening';
import { ago, allFiles, baseName, commentCount, PAGE, pendingComments, phone, plural, state, stepOfFile, threadStep } from './state';
import { changes, ChangesSwitch, shownFiles, shownSince } from './since';
import { StepPane } from './step';
import { type Reveal, SummaryPane } from './summary';

const header = region('header');
const nav = region('nav');
const main = region('main');
const pill = attrs(el('button', { type: 'button', className: 'new-pill', hidden: true }), { 'aria-live': 'polite' });
const content = el('div', { className: 'content' });
// The pill floats over the diff in a dock with no height, so showing it never narrows or moves the page.
main.append(el('div', { className: 'pill-dock' }, pill), content);
// Threads stay in view while a wide diff scrolls sideways, so they need the width the pane shows.
new ResizeObserver(() => {
  main.style.setProperty('--pane', `${String(content.clientWidth)}px`);
}).observe(content);

let viewer = { ...DEFAULT_VIEWER };
let stopped = false;
const panes = new Map<string, { key: string; pane: StepPane }>();
const summary = new SummaryPane(
  target => {
    reveal(target);
  },
  () => {
    endSession();
  },
);
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

/** The step's pane in the view shown, drawn again when what it shows changes. */
function paneOf(id: string): StepPane {
  const step = state.view.steps.find(one => one.id === id);
  if (!step) throw new Error(`no step ${id}`);
  const since = shownSince();
  const moves = shownMoves().filter(({ from, to }) => step.files.includes(from.file) || step.files.includes(to.file));
  const key = JSON.stringify([step.diff, step.files, step.folded, since && step.files.map(file => since.files[file] ?? null), moves, step.copies]);
  const kept = panes.get(`${String(!!since)}:${id}`);
  if (kept?.key === key) return kept.pane;
  const pane = new StepPane(step, main, since);
  panes.set(`${String(!!since)}:${id}`, { key, pane });
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
  onFile = null;
  const to = current();
  // Moving to a step opens it, even one its chevron folded.
  if (to.kind === 'step' && stepFolds.get(to.pane.step.id) === false) stepFolds.delete(to.pane.step.id);
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

/** The pane moved away from stays where it was read and leaves, to the left unless `slide` is false, then goes. */
function leave(old: HTMLElement, scrolled: number, slide = true): void {
  attrs(old, { inert: '', 'aria-hidden': 'true' });
  content.append(old);
  const at = `translateY(${String(main.scrollTop - scrolled)}px)`;
  const still = reduced() || !slide;
  const leaving = animate(old, 'pane-leave', [{ opacity: 1, transform: at }, { opacity: 0, transform: still ? at : `${at} translateX(-12px)` }], {
    ms: slide ? LEAVE_MS : 'fast',
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

/** Goes to a file, a thread or lines and marks them: in the step you are on by a scroll, in another after the pane swap. */
function reveal({ thread: id, edit, file, lines }: Reveal): void {
  if (file !== undefined && lines) {
    const look = { file, start: lines[0], end: lines[1], label: '' };
    const found = paneOfFile(file);
    if (!found?.pane?.look(look.start, look.end, main, found.smooth)) changes.look(look);
    return;
  }
  const thread = state.view.threads.find(one => one.id === id);
  const stepId = thread ? threadStep(thread) : file === undefined ? undefined : stepOfFile(file)?.id;
  if (stepId === undefined) return;
  const name = thread?.file ?? file ?? '';
  // What changed since the last review may leave out the file or the thread's lines.
  const found = paneOf(stepId).fileNamed(name);
  const widen = changes.since && (!found || (thread && !found.thread(thread.id)));
  if (widen) changes.since = false;
  const at = current();
  const smooth = !widen && at.kind === 'step' && at.pane.step.id === stepId;
  if (smooth) {
    pick(null);
    showDrawer(false);
  } else go(stepAddress(stepId));
  const pane = paneOf(stepId).fileNamed(name);
  if (!pane) return;
  pane.open();
  // A pane still leaving would scroll along with the one landing here.
  for (const leaving of content.querySelectorAll(':scope > [inert]')) leaving.remove();
  onFile = name;
  drawOnFile();
  const shown = thread && pane.thread(thread.id);
  if (shown) {
    shown.box.show();
    goTo(main, shown.row, 120, smooth);
    const marked = pane.linesOf(thread.id);
    flash(marked.length ? marked : [shown.row]);
  } else pane.mark(main, smooth);
  // The keyboard goes where the page went, as it goes to the step title after a pane swap; the step list may have closed under it.
  pane.focus();
  if (shown && edit) shown.box.edit(edit);
}

/** The first thing at or below the top of the pane, to keep where it is while the page changes around it. */
function readingAnchor(): { element: Element; top: number } | null {
  const top = main.getBoundingClientRect().top;
  for (const element of content.firstElementChild?.querySelectorAll('.step-head, .file-header, tr, .step-foot') ?? []) {
    const box = element.getBoundingClientRect();
    // A file header stuck at the top stays put while the lines under it move.
    const stuck = element.classList.contains('file-header') && (element.parentElement?.getBoundingClientRect().top ?? top) < top;
    if (box.height && box.bottom > top && !stuck) return { element, top: box.top };
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
  for (const one of arrived) one.classList.remove('arriving');
  // The highest on the page, whatever order they arrived in; a folded one has no place until it shows.
  const [first] = [...arrived].sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
  for (const one of arrived) grow(one.querySelector<HTMLElement>(':scope > td > .thread-cell') ?? one);
  arrived = [];
  drawPill();
  if (first) {
    goTo(main, first, 120, true);
    flash([first]);
  }
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
const changesSwitch = new ChangesSwitch();
const behindLine = attrs(el('div', { className: 'behind', hidden: true }), { role: 'status' });
header.after(behindLine);
header.append(
  attrs(el('span', { className: 'mark' }, icon('mark')), { 'aria-hidden': 'true' }),
  attrs(el('button', { type: 'button', className: 'icon-button steps-button', onclick: toggleDrawer }, icon('sidebar')), {
    'aria-label': 'Steps and files',
    'aria-expanded': 'false',
    'aria-controls': 'nav',
  }),
  changeLabel,
  changesSwitch.box,
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
  // The tab says what the session is doing, so it reads from the tab strip; static heads, since background tabs barely animate.
  const reviewing = !view.ready && !view.sessionGone && !ending;
  const title = `${reviewing ? 'Reviewing · ' : ''}${view.pr ? `#${view.pr.number} ${view.pr.title}` : name} · Walkthrough`;
  if (document.title !== title) document.title = title;
  const asleep = ending?.kind === 'lost' || view.sessionGone;
  const ended = ending?.kind === 'ended' ? (view.submitted ? 'done' : 'ended') : null;
  const favicon = `favicon-${asleep ? 'asleep' : (ended ?? (view.ready ? 'awake' : 'reading'))}.svg`;
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
  changesSwitch.update();
  changesSwitch.box.hidden = onSummary || !ready || !view.since;
  if (changesSwitch.box.hidden) changesSwitch.close(false);
  // At phone width the switch is the first row of the step.
  if (phone.matches && changesSwitch.box.parentElement !== main) content.before(changesSwitch.box);
  else if (!phone.matches && changesSwitch.box.parentElement !== header) changeLabel.after(changesSwitch.box);
  drawBehind(view.behind && !view.sessionGone && !ending);
  if (!ready && !view.sessionGone) {
    settle(reviewingNow);
    if (!reviewingNow.isConnected) filesChanged.after(reviewingNow);
  } else if (reviewingNow.isConnected)
    fadeOut(reviewingNow, 'base', () => {
      reviewingNow.remove();
    });
}

/** The line under the header once the branch has commits the walkthrough does not show. */
function drawBehind(behind: boolean): void {
  if (behindLine.hidden === !behind) return;
  if (behind && !behindLine.hasChildNodes())
    behindLine.append(icon('info'), el('span', { className: 'behind-text' }, 'The branch has new commits. Run the walkthrough again to see them:'), commandBox(true));
  // The line goes in above the pane without motion, and the pane scrolls by its height so the line being read stays put.
  const top = main.getBoundingClientRect().top;
  behindLine.hidden = !behind;
  main.scrollTop += main.getBoundingClientRect().top - top;
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
  fadeAway(menu);
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
        viewer = chooseViewer(viewer, { theme: one });
      },
      viewer.theme === one,
    ),
  );
  const colourBlind = item('Colorblind', 'menuitemcheckbox', () => {
    viewer = chooseViewer(viewer, { colourBlind: !viewer.colourBlind });
  }, viewer.colourBlind);
  colourBlind.prepend(el('span', { className: 'menu-check' }, icon('checkbox')));
  const opened = attrs(
    el(
      'div',
      { className: 'menu' },
      attrs(el('div', {}, el('p', { className: 'menu-label', id: 'menu-theme' }, 'Theme'), ...themes, colourBlind), { role: 'group', 'aria-labelledby': 'menu-theme' }),
      el('hr'),
      item('End session', 'menuitem', endSession),
    ),
    { role: 'menu', 'aria-label': 'Menu' },
  );
  menuKeys(opened, () => {
    closeMenu(true);
  });
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

/** The farewell shows before the server stops, as the page draws it from what it holds; nothing needs a confirm, as all of it is saved. */
function endSession(): void {
  stopped = true;
  clearInterval(poller);
  showEnd('ended');
  stopReading();
  void postQuietly('stop', {});
}

const endPage = el('main', { className: 'end-page', hidden: true });
document.body.append(endPage);
let ending: { kind: Ending; stop: () => void; scrolled: [number, number] } | null = null;

/** What the farewell and the lost session hide: the panes and the header's controls. */
const walkthroughParts = () => [frame, ...[...header.children].filter((one): one is HTMLElement => one instanceof HTMLElement && !one.matches('.mark, .change-label'))];

/** The walkthrough fading out under the screen that replaces it, settled and hidden once faded. */
function settleWalkthrough(): void {
  document.body.classList.remove('fading');
  for (const part of walkthroughParts()) {
    settle(part);
    part.inert = false;
  }
}

/** Puts the farewell or the lost session in place of the walkthrough, which stays as it was underneath; the walkthrough fades out, then the screen fades in. */
function showEnd(kind: Ending): void {
  if (ending?.kind === kind) return;
  const fromWalkthrough = !ending;
  ending?.stop();
  closeMenu(false);
  showDrawer(false);
  showAlert(null);
  const screen = endScreen(kind, poll);
  ending = { kind, stop: screen.stop, scrolled: ending?.scrolled ?? [main.scrollTop, nav.scrollTop] };
  endPage.replaceChildren(screen.box);
  endPage.hidden = false;
  endPage.scrollTop = 0;
  // Fading first, so the walkthrough is never hidden in between and keeps its scroll while it fades.
  if (fromWalkthrough) document.body.classList.add('fading');
  document.body.classList.add('ended');
  drawHeader(current().kind === 'summary');
  endPage.querySelector<HTMLElement>('.end-title')?.focus({ preventScroll: true });
  if (!fromWalkthrough) {
    animate(endPage, 'end-in', FADE_IN, { ms: 'base', curve: 'linear' });
    return;
  }
  const fades = walkthroughParts().map(part => {
    part.inert = true;
    return animate(part, 'end-leave', [{ opacity: 1 }, { opacity: 0 }], { ms: 'fast', curve: 'ease-in', fill: 'forwards' }).finished;
  });
  animate(endPage, 'end-in', FADE_IN, { ms: 'base', curve: 'linear', delay: duration('fast') });
  Promise.all(fades).then(settleWalkthrough, () => {});
}

/** The server answered again: the walkthrough comes back where it was. */
function hideEnd(): void {
  if (!ending) return;
  const [mainTop, navTop] = ending.scrolled;
  ending.stop();
  ending = null;
  settleWalkthrough();
  endPage.hidden = true;
  endPage.replaceChildren();
  document.body.classList.remove('ended');
  render(true);
  // After the redraw, which may put the behind line back and scroll by its height.
  main.scrollTop = mainTop;
  nav.scrollTop = navTop;
  content.querySelector<HTMLElement>('.step-title')?.focus({ preventScroll: true });
}

// The step list is drawn again only when the steps change; Viewed, counts, folds and the current row change in place.
let drawnNav = '';
type NavFile = { file: string; row: HTMLElement; mark: HTMLElement; count: HTMLElement; shown: number };
type NavStep = { id: string; item: HTMLElement; row: HTMLElement; toggle: HTMLElement; meta: HTMLElement; files: NavFile[] };
let navSteps: NavStep[] = [];
/** Steps folded or opened by their chevron, kept while the page is open; the others are open only while you are on them. */
const stepFolds = new Map<string, boolean>();
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


/** A file's row: its Viewed checkbox, its name going to the file and its comment count going to the first comment. */
function navFile(step: string, file: string, id: string): NavFile {
  const mark = attrs(el('button', { type: 'button', className: 'viewed-mark', title: 'Viewed' }, icon('ring'), icon('met')), {
    role: 'checkbox',
    'aria-label': 'Viewed',
    'aria-describedby': id,
  });
  mark.dataset['key'] = `mark:${file}`;
  mark.onclick = () => {
    setViewed(file, !state.view.viewed.includes(file));
  };
  const name = el('a', { className: 'file-name', id, href: `#${stepAddress(step)}`, title: file }, baseName(file));
  name.dataset['key'] = `file:${file}`;
  name.onclick = event => {
    event.preventDefault();
    reveal({ file });
  };
  const count = el('a', { className: 'file-count', href: `#${stepAddress(step)}`, hidden: true }, icon('message'), '');
  count.dataset['key'] = `count:${file}`;
  count.onclick = event => {
    event.preventDefault();
    // The first as the page draws them: the band above the diff, then down the lines.
    const first = paneOf(step).fileNamed(file)?.firstThread();
    if (first) reveal({ thread: first });
  };
  const row = el('div', { className: 'file-row' }, mark, name, count);
  row.dataset['file'] = file;
  return { file, row, mark, count, shown: -1 };
}

function buildNav(): void {
  const focused = document.activeElement instanceof HTMLElement && nav.contains(document.activeElement) ? document.activeElement.dataset['key'] : undefined;
  const scrolled = nav.scrollTop;
  navSteps = state.view.steps.map((step, index) => {
    const row = navLink(stepAddress(step.id), 'step-row', el('span', { className: 'step-number' }, String(index + 1)), el('span', { className: 'step-name', title: step.title }, step.title));
    row.dataset['key'] = `step:${step.id}`;
    row.classList.toggle('quiet', shownFiles(step).length === 0);
    const files = shownFiles(step).map((file, at) => navFile(step.id, file, `nav-file-${String(index)}-${String(at)}`));
    const list = el('ul', { className: 'file-list', id: `nav-files-${String(index)}` }, ...files.map(one => el('li', {}, one.row)));
    const toggle = attrs(el('button', { type: 'button', className: 'icon-button step-toggle' }, icon('chevron-right')), { 'aria-controls': list.id });
    toggle.dataset['key'] = `fold:${step.id}`;
    toggle.onclick = () => {
      stepFolds.set(step.id, !navSteps.find(one => one.id === step.id)?.item.classList.contains('open'));
      drawNav(current());
    };
    const meta = el('p', { className: 'step-meta' });
    const item = el('li', { className: 'step-item' }, el('div', { className: 'step-line' }, toggle, row), meta, el('div', { className: 'step-files' }, list));
    return { id: step.id, item, row, toggle, meta, files };
  });
  nav.replaceChildren(el('ol', { className: 'steps' }, ...navSteps.map(({ item }) => item)), el('div', { className: 'summary-dock' }, summaryRow));
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
  const key = JSON.stringify(view.steps.map(step => [step.id, step.title, step.files, shownFiles(step)]));
  if (key !== drawnNav) {
    drawnNav = key;
    buildNav();
  }
  const here = at.kind === 'step' ? at.pane.step.id : at.kind;
  for (const { id, item, row, toggle, meta, files } of navSteps) {
    if (here === id) row.setAttribute('aria-current', 'page');
    else row.removeAttribute('aria-current');
    const open = stepFolds.get(id) ?? here === id;
    item.classList.toggle('open', open);
    const fold = open ? 'Hide files' : 'Show files';
    attrs(toggle, { 'aria-expanded': String(open), 'aria-label': fold, title: fold });
    const list = item.querySelector<HTMLElement>('.step-files');
    if (list) list.inert = !open;
    let viewed = 0;
    let comments = 0;
    for (const one of files) {
      const seen = view.viewed.includes(one.file);
      if (seen) viewed++;
      one.row.classList.toggle('viewed', seen);
      one.mark.setAttribute('aria-checked', String(seen));
      const count = commentCount(id, one.file);
      comments += count;
      if (count === one.shown) continue;
      one.count.hidden = count === 0;
      one.count.title = `${plural(count, 'comment')}: go to the first`;
      one.count.setAttribute('aria-label', `${plural(count, 'comment')} on ${baseName(one.file)}: go to the first`);
      one.count.lastChild?.replaceWith(String(count));
      if (one.shown > 0 && count > 0) tick(one.count);
      one.shown = count;
    }
    meta.hidden = open || files.length === 0;
    meta.replaceChildren(
      el('span', {}, viewed ? `${String(viewed)} of ${String(files.length)} viewed` : plural(files.length, 'file')),
      ...(comments ? [attrs(el('span', { className: 'file-count', title: plural(comments, 'comment') }, icon('message'), String(comments)), { role: 'img', 'aria-label': plural(comments, 'comment') })] : []),
    );
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

// The step list's right edge resizes it while the page is open; at phone width the list is a drawer and the edge is hidden.
const WIDTH = { least: 200, most: 400, start: 248, key: 16 } as const;
const frame = nav.parentElement ?? document.body;
let stepListWidth: number = WIDTH.start;
const edge = attrs(el('div', { className: 'step-list-edge', tabIndex: 0, title: 'Resize the step list' }), {
  role: 'separator',
  'aria-label': 'Resize the step list',
  'aria-orientation': 'vertical',
  'aria-controls': 'nav',
  'aria-valuemin': String(WIDTH.least),
  'aria-valuemax': String(WIDTH.most),
});

function resizeStepList(width: number): void {
  stepListWidth = Math.round(Math.min(WIDTH.most, Math.max(WIDTH.least, width)));
  frame.style.setProperty('--step-list-width', `${String(stepListWidth)}px`);
  edge.setAttribute('aria-valuenow', String(stepListWidth));
}

edge.onpointerdown = event => {
  if (event.button !== 0) return;
  event.preventDefault();
  edge.setPointerCapture(event.pointerId);
  edge.classList.add('dragging');
};
edge.onpointermove = event => {
  if (edge.hasPointerCapture(event.pointerId)) resizeStepList(event.clientX - frame.getBoundingClientRect().left);
};
edge.onlostpointercapture = () => {
  edge.classList.remove('dragging');
};
edge.ondblclick = () => {
  resizeStepList(WIDTH.start);
};
edge.onkeydown = event => {
  const by = event.key === 'ArrowLeft' ? -WIDTH.key : event.key === 'ArrowRight' ? WIDTH.key : 0;
  if (!by) return;
  event.preventDefault();
  resizeStepList(stepListWidth + by);
};
resizeStepList(WIDTH.start);
nav.after(edge);

/** Redraws what changed, keeping the line being read where it is; `own` for what the person did, which shows in place. */
function render(own: boolean, navigated = false): void {
  followSince();
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
  drawOnFile();
  for (const time of content.querySelectorAll<HTMLTimeElement>('time.comment-time')) time.textContent = ago(time.dateTime);
}

let sinceFor = '';

/** Back on a new head after a review, the page opens on what changed since. */
function followSince(): void {
  const { since, head } = state.view;
  const key = since ? `${since.head}:${head}` : '';
  if (key === sinceFor) return;
  sinceFor = key;
  changes.since = !!since;
}

/** Switches between all changes and those since the last review, keeping the step and the file read where they are. */
function showChanges(since: boolean): void {
  const top = main.getBoundingClientRect().top;
  const reading = [...content.querySelectorAll<HTMLElement>(':scope > :first-child .file')].find(box => box.getBoundingClientRect().bottom > top);
  const was = reading?.getBoundingClientRect().top;
  const old = content.firstElementChild;
  const scrolled = main.scrollTop;
  if (old) settle(old);
  changes.since = since;
  render(true, true);
  // A pane shown before may have left with the page's last move.
  const shown = content.firstElementChild;
  if (shown) {
    settle(shown);
    shown.removeAttribute('inert');
    shown.removeAttribute('aria-hidden');
  }
  const same = reading && content.querySelector(`:scope > :first-child .file[data-file="${CSS.escape(reading.dataset['file'] ?? '')}"]`);
  if (same && was !== undefined) main.scrollTop += same.getBoundingClientRect().top - was;
  // Same step, other content: the panes cross-fade where they are, with no slide.
  if (old instanceof HTMLElement && shown && shown !== old) {
    leave(old, scrolled, false);
    animate(shown, 'pane-enter', FADE_IN, { ms: 'base', curve: 'linear' });
  }
}
changes.choose = showChanges;
changes.look = ({ file, start, end }) => {
  if (!changes.since) return;
  showChanges(false);
  const at = current();
  if (at.kind === 'step') at.pane.fileNamed(file)?.look(start, end, main, false);
};

/** Opens the step that changes the file and gives the file's pane there; `smooth` when it is the step you are on, which scrolls rather than swaps. */
function paneOfFile(file: string): { pane: FilePane | undefined; smooth: boolean } | undefined {
  const step = stepOfFile(file);
  const at = current();
  if (!step || at.kind === 'opening') return undefined;
  const smooth = at.kind === 'step' && at.pane.step.id === step.id;
  if (!smooth) go(stepAddress(step.id));
  for (const leaving of content.querySelectorAll(':scope > [inert]')) leaving.remove();
  return { pane: paneOf(step.id).fileNamed(file), smooth };
}

moving.show = (move, to) => {
  const { file, line } = move[to];
  const found = paneOfFile(file);
  if (to === 'from') found?.pane?.lookDeparture(line, main, found.smooth);
  else found?.pane?.look(line, line + move.count - 1, main, found.smooth);
};
moving.copied = ({ from: { file, line }, count }) => {
  const look = { file, start: line, end: line + count - 1, label: '' };
  const found = paneOfFile(file);
  if (!found?.pane?.look(look.start, look.end, main, found.smooth)) changes.look(look);
};

/** The file J, K and V act on; it carries the focus ring in the diff and in the step list. */
let onFile: string | null = null;

function drawOnFile(): void {
  for (const box of content.querySelectorAll<HTMLElement>('.file')) box.classList.toggle('on', box.dataset['file'] === onFile);
  for (const { files } of navSteps) for (const one of files) one.row.classList.toggle('on', one.file === onFile);
}

/** The first file of the step shown that reaches below the top of the pane. */
function fileAtTop(): string | undefined {
  const top = main.getBoundingClientRect().top;
  return [...content.querySelectorAll<HTMLElement>(':scope > :first-child .file')].find(box => box.getBoundingClientRect().bottom > top)?.dataset['file'];
}

/** J and K: the next or previous file the view shows, through the steps in reading order; with none on yet, the file at the top. */
function moveFile(by: 1 | -1): void {
  const at = current();
  if (at.kind !== 'step') return;
  const { steps } = state.view;
  const order = steps.flatMap((step, index) => shownFiles(step).map(file => ({ step: step.id, index, file })));
  const here = steps.findIndex(step => step.id === at.pane.step.id);
  const top = fileAtTop();
  const on = order.findIndex(one => one.file === onFile);
  const next =
    on === -1
      ? (order.find(one => one.file === top) ?? (by > 0 ? order.find(one => one.index > here) : order.findLast(one => one.index < here)))
      : order[on + by];
  if (!next) return;
  const smooth = next.step === at.pane.step.id;
  if (!smooth) go(stepAddress(next.step));
  onFile = next.file;
  drawOnFile();
  for (const leaving of content.querySelectorAll(':scope > [inert]')) leaving.remove();
  paneOf(next.step).fileNamed(next.file)?.mark(main, smooth);
}

/** V: Viewed on the file you are on, or else the one at the top. */
function toggleViewed(): void {
  onFile ??= fileAtTop() ?? null;
  drawOnFile();
  if (onFile) setViewed(onFile, !state.view.viewed.includes(onFile));
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
  render(true);
});

let pendingKey = '';
document.addEventListener('keydown', event => {
  // One Esc closes one thing, the innermost open; a composer or a menu that took it has prevented it.
  if (event.key === 'Escape') {
    if (event.defaultPrevented) return;
    const close = changesSwitch.isOpen
      ? () => {
          changesSwitch.close(true);
        }
      : menu
        ? () => {
            closeMenu(true);
          }
        : document.body.classList.contains('drawer-open')
          ? () => {
              toggleDrawer();
              header.querySelector<HTMLElement>('.steps-button')?.focus();
            }
          : null;
    if (close) {
      event.preventDefault();
      close();
      return;
    }
  }
  const typing = event.target instanceof HTMLElement && event.target.closest('textarea, select, [contenteditable], input:not([type="checkbox"], [type="radio"])');
  if (typing || event.altKey || event.ctrlKey || event.metaKey) return;
  const keys: Record<string, () => void> = {
    j: () => {
      moveFile(1);
    },
    k: () => {
      moveFile(-1);
    },
    v: toggleViewed,
    c: () => {
      changesSwitch.open();
    },
  };
  const key = event.shiftKey || !Object.hasOwn(keys, event.key) ? undefined : keys[event.key];
  if (key && state.view.ready && !ending && !menu) {
    event.preventDefault();
    key();
  }
  if (pendingKey === 'g' && event.key === 's' && state.view.ready && !ending) go('summary');
  pendingKey = event.key === 'g' ? 'g' : '';
});

const POLL_MS = 1500;
// One failed poll can be a blip; the second says the session isn't running.
const LOST_AFTER = 2;
let polling = false;
let failed = 0;
let tag = '';

function poll(): void {
  if (polling || stopped) return;
  polling = true;
  const since = state.sends;
  if (state.stale) tag = '';
  state.stale = false;
  fetch('data/walkthrough.json', tag ? { headers: { 'if-none-match': tag } } : {})
    .then(async answer => {
      if (answer.status !== 304 && !answer.ok) throw new Error(String(answer.status));
      if (stopped) return;
      failed = 0;
      const fresh = answer.status !== 304 && since === state.sends;
      if (fresh) {
        tag = answer.headers.get('etag') ?? '';
        state.view = (await answer.json()) as WalkthroughView;
      }
      if (ending) hideEnd();
      else if (fresh) render(false);
    })
    .catch(() => {
      if (!stopped && ++failed >= LOST_AFTER) showEnd('lost');
    })
    .finally(() => {
      polling = false;
    });
}

PAGE.lost = poll;
viewer = await loadViewer();
// A first load that fails, as when the system briefly suspends the network, is tried again on the poll's beat.
let first: Response | undefined;
while (!first)
  first = await fetch('data/walkthrough.json').catch(
    () =>
      new Promise<undefined>(done => {
        setTimeout(done, POLL_MS);
      }),
  );
tag = first.headers.get('etag') ?? '';
state.view = (await first.json()) as WalkthroughView;
if (!location.hash && firstAddress()) history.replaceState(null, '', `#${firstAddress()}`);
render(true, true);
const poller = setInterval(poll, POLL_MS);
