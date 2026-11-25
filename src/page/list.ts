import type { Listed } from '../list';
import { loadViewer } from './appearance';
import { el, type PageName, post as postTo, region, showAlert, showUnreachable } from './dom';
import { icon } from './icons';

const TYPES = { comment: 'Comment', approve: 'Approve', 'request-changes': 'Request changes' } as const;

type ListPage = { repo: string; walkthroughs: Listed[] };

const header = region('header');
const main = region('main');

const PAGE: PageName = { name: 'list', reopen: 'Run walkthrough list to reopen.' };
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
  banner.replaceChildren(el('span', { className: 'banner-text' }, el('strong', {}, 'List stopped.'), ' You can close this tab.'));
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
  return el('span', { className: 'list-progress' }, `${String(one.viewed)} / ${String(one.files)} files viewed`);
}

function row(one: Listed): HTMLTableRowElement {
  const name = el('button', { type: 'button', className: 'list-open', onclick: () => void open(one) }, one.name);
  name.dataset['key'] = `open:${one.id}`;
  // Roles keep the table a table to a screen reader once the phone layout restyles its rows.
  return el(
    'tr',
    { role: 'row' },
    // The id is what walkthrough prune takes to remove this one.
    el('td', { role: 'cell' }, el('div', { className: 'list-name' }, name), el('code', { className: 'list-id' }, decodeURIComponent(one.id))),
    el('td', { role: 'cell' }, progress(one)),
    el('td', { role: 'cell' }, one.submitted ? TYPES[one.submitted] : ''),
    el('td', { role: 'cell', className: 'muted' }, el('time', { dateTime: one.last, title: new Date(one.last).toLocaleString() }, ago(one.last))),
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
  const head = el(
    'tr',
    { role: 'row' },
    ...['Walkthrough', 'Viewed', 'Review', 'Last activity'].map(name => el('th', { scope: 'col', role: 'columnheader' }, name)),
  );
  main.replaceChildren(
    el('h1', { className: 'list-title' }, 'Walkthroughs'),
    page.walkthroughs.length
      ? el(
          'table',
          { className: 'walkthroughs', role: 'table' },
          el('thead', { role: 'rowgroup' }, head),
          el('tbody', { role: 'rowgroup' }, ...page.walkthroughs.map(row)),
        )
      : el('p', { className: 'list-empty' }, 'No walkthroughs. Run /walkthrough.'),
  );
  if (focused !== undefined) document.querySelector<HTMLElement>(`[data-key="${CSS.escape(focused)}"]`)?.focus();
}

const load = async () => {
  const answer = await fetch('data/list.json');
  if (!answer.ok) throw new Error(String(answer.status));
  return answer.text();
};

await loadViewer();
shown = await load();
render(JSON.parse(shown) as ListPage);
// The list changes as sessions record and the person decides, and an open list keeps its server from stopping idle.
const poller = setInterval(() => {
  load()
    .then(text => {
      if (document.body.classList.contains('unreachable')) showAlert(null);
      if (text !== shown) render(JSON.parse((shown = text)) as ListPage);
      else for (const time of main.querySelectorAll('time')) time.textContent = ago(time.dateTime);
    })
    .catch(() => {
      showUnreachable(PAGE);
    });
}, 5000);
