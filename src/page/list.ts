import type { Listed } from '../list';
import { plural } from '../words';
import { el, type PageName, post as postTo, region, showUnreachable } from './dom';
import { icon } from './icons';

type ListPage = { repo: string; walkthroughs: Listed[] };

const header = region('header');
const main = region('main');

const PAGE: PageName = { name: 'list', reopen: 'Run walkthrough list again to reopen it.' };
const post = (route: string, body: Record<string, unknown>) => postTo(PAGE, route, body);

async function open(one: Listed): Promise<void> {
  const answer = await post('open', { id: one.id });
  if (answer) location.assign(((await answer.json()) as { url: string }).url);
}

async function stop(): Promise<void> {
  if (!(await post('stop', {}))) return;
  clearInterval(poller);
  header.querySelector('.header-end')?.remove();
  const banner = region('alert');
  banner.className = 'banner';
  banner.replaceChildren(el('span', { className: 'banner-text' }, el('strong', {}, 'The list has stopped.'), ' You can close this tab.'));
  banner.hidden = false;
  main.classList.add('stopped');
  main.inert = true;
}

const UNITS = [
  ['day', 86_400],
  ['hour', 3_600],
  ['minute', 60],
] as const;

/** "2 minutes ago", "yesterday", or "now" within the last minute. */
function ago(iso: string): string {
  const seconds = (Date.parse(iso) - Date.now()) / 1000;
  const format = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
  for (const [unit, size] of UNITS) if (Math.abs(seconds) >= size) return format.format(Math.round(seconds / size), unit);
  return format.format(0, 'second');
}

function progress(one: Listed): HTMLElement {
  if (!one.steps) return el('span', { className: 'list-progress' }, 'Preparing');
  const bar = el(
    'span',
    { className: 'list-bar' },
    ...one.segments.map(state => {
      // A decided segment is filled as in the page's header, which draws its fill as a child.
      const segment = el('span', { className: 'segment' }, ...(state === 'decided' ? [el('span', { className: 'segment-fill' })] : []));
      segment.dataset['state'] = state;
      return segment;
    }),
  );
  bar.setAttribute('aria-hidden', 'true');
  return el('span', { className: 'list-progress' }, bar, `${String(one.decided)} of ${plural(one.steps, 'step')} decided, ${String(one.read)} read`);
}

function row(one: Listed): HTMLTableRowElement {
  const name = el('button', { type: 'button', className: 'list-open', onclick: () => void open(one) }, one.name);
  name.dataset['key'] = `open:${one.id}`;
  return el(
    'tr',
    {},
    // The id is what walkthrough prune takes to remove this one.
    el('td', {}, name, el('code', { className: 'list-id' }, one.id)),
    el('td', {}, progress(one)),
    el('td', { className: 'muted' }, el('time', { dateTime: one.last, title: new Date(one.last).toLocaleString() }, ago(one.last))),
  );
}

let shown = '';

function render(page: ListPage): void {
  // A redraw keeps the walkthrough the keyboard was on.
  const focused = document.activeElement instanceof HTMLElement ? document.activeElement.dataset['key'] : undefined;
  header.replaceChildren(
    el('span', { className: 'logo' }, icon('mark'), 'Walkthrough'),
    el('span', { className: 'session-label' }, page.repo),
    el('div', { className: 'header-end' }, el('button', { type: 'button', className: 'btn small', onclick: () => void stop() }, 'Stop')),
  );
  const head = el('tr', {}, ...['Walkthrough', 'Progress', 'Last activity'].map(name => el('th', { scope: 'col' }, name)));
  main.replaceChildren(
    el('h1', { className: 'list-title' }, 'Walkthroughs'),
    el('p', { className: 'muted list-sub' }, 'In this repository'),
    page.walkthroughs.length
      ? el('table', { className: 'walkthroughs' }, el('thead', {}, head), el('tbody', {}, ...page.walkthroughs.map(row)))
      : el('p', { className: 'list-empty' }, 'This repo has no walkthroughs; run /walkthrough to start one.'),
  );
  if (focused !== undefined) document.querySelector<HTMLElement>(`[data-key="${CSS.escape(focused)}"]`)?.focus();
}

const load = async () => {
  const answer = await fetch('data/list.json');
  if (!answer.ok) throw new Error(String(answer.status));
  return answer.text();
};

shown = await load();
render(JSON.parse(shown) as ListPage);
// The list changes as sessions record and the person decides, and an open list keeps its server from stopping idle.
const poller = setInterval(() => {
  load()
    .then(text => {
      if (text !== shown) render(JSON.parse((shown = text)) as ListPage);
      else for (const time of main.querySelectorAll('time')) time.textContent = ago(time.dateTime);
    })
    .catch(() => {
      showUnreachable(PAGE);
    });
}, 5000);
