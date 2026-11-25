// A step's files: a file header in a bordered box, the diff diff2html draws, and threads under their lines.
import { html } from 'diff2html';
import { type DiffFile, LineType } from 'diff2html/lib-esm/types';
import { parseDiff } from '../diff';
import { previewType } from '../preview';
import type { ThreadView } from '../review';
import type { Step } from '../walkthrough';
import { attrs, el } from './dom';
import { icon } from './icons';
import { renderMarkdown } from './markdown';
import { grow, reduced } from './motion';
import { commentCount, plural, send, state, threadBy, threadsIn } from './state';
import { composer, ThreadBox } from './threads';

/** Lines picked for a new comment; one composer at a time on the page. */
export let picked: { step: string; file: string; start: number; end: number } | null = null;

export function pick(next: typeof picked): void {
  picked = next;
  state.render(true);
  const cell = next && document.querySelector<HTMLElement>('.composer-line .thread-cell');
  if (!cell) return;
  cell.querySelector('textarea')?.focus({ preventScroll: true });
  // The composer is still opening, so this scrolls to where its foot will be.
  const scroller = cell.closest('.main');
  const below = cell.getBoundingClientRect().top + cell.scrollHeight - (scroller?.getBoundingClientRect().bottom ?? innerHeight);
  if (scroller && below > 0) scroller.scrollBy({ top: below, behavior: reduced() ? 'instant' : 'smooth' });
}

/** Files the person opened or folded themselves, by path; the others fold while viewed, generated or large. */
const folds = new Map<string, boolean>();
/** Files that changed since the person viewed them, opened again once each time that happens. */
const reopened = new Set<string>();
const LARGE_FILE = 400;
const SVG = 'http://www.w3.org/2000/svg';

/** Says whether something at `element` is above the bottom of what the reader sees, so adding it would move what they read. */
export type Shows = (element: Element) => boolean;

export class FilePane {
  readonly box = el('section', { className: 'file' });
  private readonly header = el('div', { className: 'file-header' });
  private readonly body = el('div', { className: 'file-body' });
  private readonly rows = new Map<number, HTMLTableRowElement>();
  /** Runs of added and removed lines, by their first and last row. */
  private readonly runs: { type: 'add' | 'del'; from: HTMLTableRowElement; to: HTMLTableRowElement }[] = [];
  private readonly threads = new Map<string, { row: HTMLTableRowElement; box: ThreadBox }>();
  private readonly stripe = document.createElementNS(SVG, 'svg');
  private composerRow: HTMLTableRowElement | null = null;
  /** Whether the threads were drawn before, so what is new since then can arrive. */
  private drawn = false;
  private readonly name: string;
  private readonly changedLines: number;
  private previewing = false;
  private readonly preview: HTMLElement | null;
  private readonly diffBox: HTMLElement;

  constructor(
    private readonly step: Step,
    parsed: DiffFile,
    diff: Element | null,
  ) {
    this.name = parsed.isDeleted ? parsed.oldName : parsed.newName;
    this.changedLines = parsed.addedLines + parsed.deletedLines;
    this.box.dataset['file'] = this.name;
    this.diffBox = el('div', { className: 'diff-scroll' }, ...(diff ? [diff] : []));
    const inner = el('div', { className: 'file-inner' }, this.diffBox, this.stripe);
    this.preview = this.previewBox(parsed);
    if (this.preview) inner.append(this.preview);
    this.body.append(inner);
    this.box.append(this.header, this.body);
    this.stripe.classList.add('overview-stripe');
    attrs(this.stripe, { 'aria-hidden': 'true', preserveAspectRatio: 'none' });
    this.prepareRows();
    this.drawHeader(parsed);
  }

  get file(): string {
    return this.name;
  }

  closed(): boolean {
    const { view } = state;
    return folds.get(this.name) ?? (view.viewed.includes(this.name) || this.name in (this.step.folded ?? {}) || this.changedLines > LARGE_FILE);
  }

  /** Opens the file and its lines, scrolls them into view with 120px above, and flashes them. */
  look(start: number, end: number, scroller: HTMLElement): void {
    if (this.closed()) {
      folds.set(this.name, false);
      this.update(() => false);
    }
    if (this.previewing) void this.showPreview(false);
    const first = this.rows.get(start);
    if (!first) return;
    const top = first.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop - 120;
    scroller.scrollTo({ top, behavior: reduced() ? 'instant' : 'smooth' });
    for (const [line, row] of this.rows)
      if (line >= start && line <= end) {
        // Restarted in this task, so a second click flashes again.
        for (const cell of row.cells) for (const running of cell.getAnimations()) running.cancel();
        row.classList.remove('flash');
        row.getBoundingClientRect();
        row.classList.add('flash');
      }
  }

  thread(id: string): { row: HTMLTableRowElement; box: ThreadBox } | undefined {
    return this.threads.get(id);
  }

  open(): void {
    if (!this.closed()) return;
    folds.set(this.name, false);
    this.update(() => false);
  }

  /** Brings the file up to date; returns what arrived where the reader would see it move, which waits behind the pill. */
  update(shows: Shows): HTMLElement[] {
    const { view } = state;
    if (!view.changed.includes(this.name)) reopened.delete(this.name);
    else if (!reopened.has(this.name)) {
      reopened.add(this.name);
      folds.delete(this.name);
    }
    const closed = this.closed();
    this.box.classList.toggle('closed', closed);
    this.box.classList.toggle('viewed', view.viewed.includes(this.name));
    const toggle = this.header.querySelector('.file-toggle');
    if (toggle) attrs(toggle, { 'aria-expanded': String(!closed), 'aria-label': `${closed ? 'Expand' : 'Collapse'} ${this.name}` });
    this.body.inert = closed;
    const checkbox = this.header.querySelector<HTMLInputElement>('.viewed-toggle input');
    if (checkbox) checkbox.checked = view.viewed.includes(this.name);
    const count = commentCount(this.step.id, this.name);
    const counter = this.header.querySelector<HTMLElement>('.file-comments');
    if (counter) {
      counter.hidden = count === 0;
      counter.title = plural(count, 'comment');
      counter.lastChild?.replaceWith(String(count));
    }
    const changed = this.header.querySelector<HTMLElement>('.changed-tag');
    if (changed) changed.hidden = !view.changed.includes(this.name);
    return this.drawThreads(shows, closed);
  }

  private drawHeader(parsed: DiffFile): void {
    const chevron = el('button', { type: 'button', className: 'icon-button file-toggle' }, icon('chevron-right'));
    chevron.onclick = () => {
      folds.set(this.name, !this.closed());
      this.update(() => false);
    };
    const viewed = el('input', { type: 'checkbox' });
    viewed.onchange = () => {
      const now = viewed.checked;
      const { view } = state;
      state.view = {
        ...view,
        viewed: now ? [...view.viewed, this.name] : view.viewed.filter(one => one !== this.name),
        changed: view.changed.filter(one => one !== this.name),
      };
      folds.set(this.name, now);
      state.render(true);
      void send('viewed', { file: this.name, viewed: now });
    };
    const stats = parsed.isBinary
      ? [el('span', { className: 'file-stats' }, 'binary')]
      : [el('span', { className: 'file-stats' }, el('span', { className: 'added' }, `+${String(parsed.addedLines)}`), ' ', el('span', { className: 'deleted' }, `−${String(parsed.deletedLines)}`))];
    const reason = this.step.folded?.[this.name];
    this.header.append(
      chevron,
      el('span', { className: 'file-path', title: this.name }, this.name),
      ...stats,
      el('span', { className: 'file-comments', hidden: true }, icon('message'), '0'),
      el('span', { className: 'changed-tag', hidden: true }, 'Changed since last view'),
      ...(reason ? [el('span', { className: 'folded-reason', title: reason }, reason)] : []),
      el('span', { className: 'spacer' }),
      ...(this.preview ? [this.previewToggle()] : []),
      el('label', { className: 'viewed-toggle' }, viewed, 'Viewed'),
    );
  }

  private prepareRows(): void {
    const all = [...this.diffBox.querySelectorAll<HTMLTableRowElement>('tbody > tr')];
    const types = all.map(row => (row.querySelector('td.d2h-ins') ? 'add' : row.querySelector('td.d2h-del') ? 'del' : null));
    all.forEach((row, at) => {
      const number = row.querySelector<HTMLElement>('.line-num2');
      const line = Number(number?.textContent.trim());
      if (number && line) {
        this.rows.set(line, row);
        row.dataset['line'] = String(line);
        number.tabIndex = this.rows.size === 1 ? 0 : -1;
        attrs(number, { role: 'button', 'aria-label': `Comment on line ${String(line)}` });
      }
      const type = types[at];
      if (!type || types[at - 1] === type) return;
      let end = at;
      while (types[end + 1] === type) end++;
      const to = all[end];
      if (to) this.runs.push({ type, from: row, to });
    });
    this.diffBox.onclick = event => {
      const number = event.target instanceof Element ? event.target.closest<HTMLElement>('.line-num2[role="button"]') : null;
      if (number) this.choose(Number(number.closest('tr')?.dataset['line']), event.shiftKey);
    };
    this.diffBox.onkeydown = event => {
      const number = event.target instanceof HTMLElement && event.target.matches('.line-num2[role="button"]') ? event.target : null;
      if (!number) return;
      const line = Number(number.closest('tr')?.dataset['line']);
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.choose(line, event.shiftKey);
      } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        const lines = [...this.rows.keys()];
        const next = lines[lines.indexOf(line) + (event.key === 'ArrowDown' ? 1 : -1)];
        const target = next === undefined ? null : this.rows.get(next)?.querySelector<HTMLElement>('.line-num2');
        if (target) {
          number.tabIndex = -1;
          target.tabIndex = 0;
          target.focus();
        }
      }
    };
  }

  private choose(line: number, extend: boolean): void {
    const same = picked?.step === this.step.id && picked.file === this.name;
    if (extend && same && picked) pick({ ...picked, start: Math.min(picked.start, line), end: Math.max(picked.start, line) });
    else pick({ step: this.step.id, file: this.name, start: line, end: line });
  }

  /** The whole file's runs and threads, placed by where their rows sit now that threads take room between them. */
  private drawStripe(): void {
    const total = this.diffBox.querySelector('table')?.offsetHeight ?? 0;
    if (!total) return;
    const mark = (className: string, top: number, height: number) => {
      const rect = document.createElementNS(SVG, 'rect');
      rect.classList.add(...className.split(' '));
      attrs(rect, { y: `${String((top / total) * 100)}%`, height: `${String((height / total) * 100)}%`, x: '2', width: '6' });
      return rect;
    };
    this.stripe.replaceChildren(
      ...this.runs.map(({ type, from, to }) => mark(`run-${type}`, from.offsetTop, to.offsetTop + to.offsetHeight - from.offsetTop)),
      ...threadsIn(this.step.id, this.name).flatMap(thread => {
        const row = this.rows.get(thread.lines[1]);
        return row ? [mark(`tick ${threadBy(thread)}`, row.offsetTop, 3)] : [];
      }),
    );
  }

  /** Puts each thread under its last line and, at the lines picked, the composer; returns what arrived where it would move the page. */
  private drawThreads(shows: Shows, closed: boolean): HTMLElement[] {
    const here = threadsIn(this.step.id, this.name);
    const arrived: HTMLElement[] = [];
    const ids = new Set(here.map(one => one.id));
    for (const [id, { row }] of this.threads)
      if (!ids.has(id)) {
        row.remove();
        this.threads.delete(id);
      }
    for (const old of this.diffBox.querySelectorAll('.gutter-mark')) old.remove();
    for (const thread of here) {
      const anchor = this.rows.get(thread.lines[1]);
      if (!anchor) continue;
      const held = !closed && shows(anchor);
      const kept = this.threads.get(thread.id);
      if (kept) {
        const fresh = kept.box.update(thread);
        if (held) arrived.push(...fresh.map(hold));
        else for (const one of fresh) one.classList.add('arrive');
        continue;
      }
      const box = new ThreadBox(thread);
      const row = threadRow(box.box);
      row.dataset['thread'] = thread.id;
      this.placeAfter(anchor, row);
      this.threads.set(thread.id, { row, box });
      if (held) arrived.push(hold(row));
      else if (this.drawn) for (const one of box.box.querySelectorAll('.comment')) one.classList.add('arrive');
    }
    this.drawn = true;
    for (const thread of here) this.markThread(thread);
    this.drawComposer();
    this.drawStripe();
    return arrived;
  }

  private placeAfter(anchor: HTMLTableRowElement, row: HTMLTableRowElement): void {
    let last: Element = anchor;
    while (last.nextElementSibling?.classList.contains('thread-row')) last = last.nextElementSibling;
    last.after(row);
  }

  private markThread(thread: ThreadView): void {
    const row = this.rows.get(thread.lines[1]);
    // Inside the line number, so the mark sits just before it and never on the old number.
    const cell = row?.querySelector('.line-num2');
    if (!row || !cell) return;
    const by = threadBy(thread);
    if (!cell.querySelector('.gutter-mark'))
      cell.prepend(attrs(el('span', { className: `gutter-mark ${by}` }, icon(by === 'you' ? 'own' : 'message')), { 'aria-hidden': 'true' }));
  }

  private drawComposer(): void {
    const mine = picked?.step === this.step.id && picked.file === this.name ? picked : null;
    for (const [line, row] of this.rows) row.classList.toggle('picked', !!mine && line >= mine.start && line <= mine.end);
    const key = mine && `${String(mine.start)}-${String(mine.end)}`;
    if (this.composerRow && this.composerRow.dataset['lines'] !== key) {
      this.composerRow.remove();
      this.composerRow = null;
    }
    if (!mine || this.composerRow) return;
    const anchor = this.rows.get(mine.end);
    if (!anchor) return;
    const lines: [number, number] = [mine.start, mine.end];
    const box = composer({
      placeholder: 'Leave a comment',
      primary: 'Add comment',
      onPrimary: async text => {
        const done = await send('comment', { file: this.name, lines, text });
        if (done) pick(null);
        return done;
      },
      onAsk: async text => {
        const done = await send('ask', { file: this.name, lines, text });
        if (done) pick(null);
        return done;
      },
      onCancel: () => {
        pick(null);
      },
    });
    this.composerRow = threadRow(el('div', { className: 'thread' }, box));
    this.composerRow.classList.add('composer-line');
    this.composerRow.dataset['lines'] = key ?? '';
    this.placeAfter(anchor, this.composerRow);
    const cell = this.composerRow.querySelector<HTMLElement>('.thread-cell');
    if (cell) grow(cell);
  }

  private previewBox(parsed: DiffFile): HTMLElement | null {
    const head = parsed.isDeleted ? null : parsed.newName;
    const type = previewType(head ?? parsed.oldName);
    if (!type || (head === null && !type.startsWith('image/'))) return null;
    return attrs(el('div', { className: 'preview', hidden: true }), { role: 'region', 'aria-label': `Preview of ${this.name}` });
  }

  private previewToggle(): HTMLElement {
    const choices = (['Diff', 'Preview'] as const).map((label, at) =>
      attrs(el('button', { type: 'button', onclick: () => void this.showPreview(at === 1) }, label), { 'aria-pressed': String(at === 0) }),
    );
    return attrs(el('div', { className: 'segmented' }, ...choices), { role: 'group', 'aria-label': `Show ${this.name} as` });
  }

  private async showPreview(previewing: boolean): Promise<void> {
    const box = this.preview;
    if (!box) return;
    this.previewing = previewing;
    this.header.querySelectorAll('.segmented button').forEach((button, at) => {
      button.setAttribute('aria-pressed', String(previewing === (at === 1)));
    });
    this.diffBox.hidden = previewing;
    this.stripe.classList.toggle('hidden', previewing);
    box.hidden = !previewing;
    if (!previewing || box.hasChildNodes()) return;
    const parsed = parseDiff(this.step.diff).find(one => (one.isDeleted ? one.oldName : one.newName) === this.name);
    if (!parsed) return;
    const at = (path: string) => `file?path=${encodeURIComponent(path)}`;
    if (previewType(this.name)?.startsWith('image/')) {
      const figure = (side: 'Before' | 'After', source: string) => {
        const caption = el('figcaption', {}, side);
        const image = el('img', { src: source, alt: `${this.name}, ${side.toLowerCase()}` });
        image.onload = () => {
          caption.textContent = `${side} · ${String(image.naturalWidth)}×${String(image.naturalHeight)}`;
        };
        return el('figure', {}, el('div', { className: 'image-box' }, image), caption);
      };
      box.replaceChildren(
        el(
          'div',
          { className: 'image-compare' },
          ...(parsed.isNew ? [] : [figure('Before', `${at(parsed.oldName)}&at=base`)]),
          ...(parsed.isDeleted ? [] : [figure('After', at(parsed.newName))]),
        ),
      );
      return;
    }
    const answer = await fetch(at(this.name)).catch(() => null);
    const added = new Set(parsed.blocks.flatMap(block => block.lines).flatMap(line => (line.type === LineType.INSERT && line.newNumber ? [line.newNumber] : [])));
    if (!answer?.ok) {
      box.replaceChildren(el('p', { className: 'muted' }, 'Preview failed.'));
      return;
    }
    box.innerHTML = renderMarkdown(await answer.text(), this.name, added);
    box.classList.add('markdown');
  }
}

/** A row under a diff line holding a thread or the composer; the cell is what opens and closes. */
const threadRow = (content: HTMLElement) => el('tr', { className: 'thread-row' }, el('td', { colSpan: 2 }, el('div', { className: 'thread-cell' }, content)));

/** A row or comment that arrived where it would move the page: folded until the pill opens it. */
function hold(element: HTMLElement): HTMLElement {
  element.classList.add('arriving');
  return element;
}

/** The step's files, drawn once per diff. */
export function drawFiles(step: Step): FilePane[] {
  const parsed = parseDiff(step.diff);
  const holder = el('div');
  // diff2html escapes the code it draws, so its markup is safe to put in the page.
  holder.innerHTML = html(parsed, { outputFormat: 'line-by-line', drawFileList: false, matching: 'lines' });
  const wrappers = [...holder.querySelectorAll('.d2h-file-wrapper')];
  const panes = parsed.map((file, at) => new FilePane(step, file, wrappers[at]?.querySelector('.d2h-file-diff') ?? null));
  // A step shows its files in the order the session gave them.
  return step.files.flatMap(file => panes.filter(pane => pane.file === file));
}
