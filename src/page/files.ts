// A step's files: a file header in a bordered box, the diff diff2html draws, and threads under their lines.
import { html } from 'diff2html';
import { type DiffFile, LineType } from 'diff2html/lib-esm/types';
import { parseDiff } from '../diff';
import { previewType } from '../preview';
import type { ThreadView } from '../review';
import type { Step } from '../walkthrough';
import { attrs, el } from './dom';
import { colourCode, colourDiff, colourSuggestions } from './highlight';
import { icon } from './icons';
import { renderMarkdown } from './markdown';
import { flash, grow, placePane, scrollPane } from './motion';
import { drawMoves } from './moves';
import { commentCount, outdatedIn, plural, send, state, threadBy, threadsIn } from './state';
import { composer, ThreadBox } from './threads';

/** Lines picked for a new comment, or a file with none for a comment on the whole file; one composer at a time on the page. */
export let picked: { step: string; file: string; start?: number; end?: number } | null = null;

export function pick(next: typeof picked): void {
  picked = next;
  state.render(true);
  const cell = next && document.querySelector<HTMLElement>('.composer-line .thread-cell');
  if (!cell) return;
  cell.querySelector('textarea')?.focus({ preventScroll: true });
  // The composer is still opening, so this scrolls to where its foot will be.
  const scroller = cell.closest('.main');
  const below = cell.getBoundingClientRect().top + cell.scrollHeight - (scroller?.getBoundingClientRect().bottom ?? innerHeight);
  if (scroller instanceof HTMLElement && below > 0) scrollPane(scroller, scroller.scrollTop + below);
}

/** Files the person opened or folded themselves, by path; the others fold while viewed, generated or large. */
const folds = new Map<string, boolean>();
/** Files that changed since the person viewed them, opened again once each time that happens. */
const reopened = new Set<string>();
const LARGE_FILE = 400;
const SVG = 'http://www.w3.org/2000/svg';

/** Marks a file Viewed or not, from its header, its row in the step list or V, as one state; Viewed folds the file. */
export function setViewed(file: string, now: boolean): void {
  const { view } = state;
  if (view.viewed.includes(file) === now) return;
  state.view = {
    ...view,
    viewed: now ? [...view.viewed, file] : view.viewed.filter(one => one !== file),
    changed: view.changed.filter(one => one !== file),
  };
  folds.set(file, now);
  state.render(true);
  void send('viewed', { file, viewed: now });
}

/** Brings `target` to `above` px under the top of `scroller`, smoothly or at once. */
export function goTo(scroller: HTMLElement, target: Element, above: number, smooth: boolean): void {
  const top = scroller.scrollTop + target.getBoundingClientRect().top - scroller.getBoundingClientRect().top - above;
  if (smooth) scrollPane(scroller, top);
  else placePane(scroller, top);
}

/** Says whether something at `element` is above the bottom of what the reader sees, so adding it would move what they read. */
export type Shows = (element: Element) => boolean;

export class FilePane {
  readonly box = el('section', { className: 'file' });
  private readonly header = el('div', { className: 'file-header' });
  private readonly body = el('div', { className: 'file-body' });
  private readonly rows = new Map<number, HTMLTableRowElement>();
  /** Runs of added and removed lines, by their first and last row. */
  private readonly runs: { type: 'add' | 'del'; from: HTMLTableRowElement; to: HTMLTableRowElement }[] = [];
  /** Each thread with what holds it: a row under its line, or its own box in the band above the diff. */
  private readonly threads = new Map<string, { row: HTMLElement; box: ThreadBox }>();
  /** Above the diff: the composer for the whole file, its threads oldest first, then outdated threads. */
  private readonly band = el('div', { className: 'file-threads', hidden: true });
  private readonly stripe = document.createElementNS(SVG, 'svg');
  private composerRow: HTMLElement | null = null;
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
    private readonly shown: Shown = {},
  ) {
    this.name = parsed.isDeleted ? parsed.oldName : parsed.newName;
    this.changedLines = parsed.addedLines + parsed.deletedLines;
    this.box.dataset['file'] = this.name;
    this.diffBox = el('div', { className: 'diff-scroll' }, ...(diff ? [diff] : []));
    const area = el('div', { className: 'diff-area' }, this.diffBox, this.stripe);
    this.preview = this.previewBox(parsed);
    if (this.preview) area.append(this.preview);
    this.body.append(el('div', { className: 'file-inner' }, this.band, area));
    this.box.append(this.header, this.body);
    this.stripe.classList.add('overview-stripe');
    attrs(this.stripe, { 'aria-hidden': 'true', preserveAspectRatio: 'none' });
    if (diff) drawMoves(diff, this.name, step.copies);
    this.prepareRows();
    this.drawHeader(parsed);
  }

  get file(): string {
    return this.name;
  }

  closed(): boolean {
    const { view } = state;
    return folds.get(this.name) ?? (!!this.shown.quiet || view.viewed.includes(this.name) || this.name in (this.step.folded ?? {}) || this.changedLines > LARGE_FILE);
  }

  /**
   * Opens the file and its lines, brings them into view with 120px above, and flashes them; false when the diff does not show them.
   * `smooth` scrolls there, as on the step you are on; otherwise the pane that just swapped in starts there.
   */
  look(start: number, end: number, scroller: HTMLElement, smooth = true): boolean {
    if (!this.rows.has(start)) return false;
    return this.flashRows(
      [...this.rows].flatMap(([line, row]) => (line >= start && line <= end ? [row] : [])),
      scroller,
      smooth,
    );
  }

  /** The same for the row that says lines moved away from `line`. */
  lookDeparture(line: number, scroller: HTMLElement, smooth = true): boolean {
    const row = this.diffBox.querySelector<HTMLTableRowElement>(`tr[data-moved-from="${String(line)}"]`);
    return this.flashRows(row ? [row] : [], scroller, smooth);
  }

  /** Brings the file's header to the top of the pane and flashes it. */
  mark(scroller: HTMLElement, smooth: boolean): void {
    goTo(scroller, this.box, 16, smooth);
    flash([this.header]);
  }

  /** The rows of a thread's lines, to mark when it is reached; none on a whole file or once outdated, as those lines are gone. */
  linesOf(id: string): HTMLTableRowElement[] {
    const thread = state.view.threads.find(one => one.id === id);
    const lines = thread?.step === null ? undefined : thread?.lines;
    return lines ? [...this.rows].flatMap(([line, row]) => (line >= lines[0] && line <= lines[1] ? [row] : [])) : [];
  }

  /** The thread that shows first in the file, in the band above the diff or under its lines. */
  firstThread(): string | undefined {
    return this.box.querySelector<HTMLElement>('[data-thread]')?.dataset['thread'];
  }

  /** Takes the keyboard to the file, at its header. */
  focus(): void {
    this.header.querySelector<HTMLElement>('.file-toggle')?.focus({ preventScroll: true });
  }

  private flashRows(rows: HTMLTableRowElement[], scroller: HTMLElement, smooth: boolean): boolean {
    const [first] = rows;
    if (!first) return false;
    if (this.closed()) {
      folds.set(this.name, false);
      this.update(() => false);
    }
    if (this.previewing) void this.showPreview(false);
    goTo(scroller, first, 120, smooth);
    flash(rows);
    return true;
  }

  thread(id: string): { row: HTMLElement; box: ThreadBox } | undefined {
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
    const arrived = this.drawThreads(shows, closed);
    colourSuggestions(this.box, this.name, view.head);
    return arrived;
  }

  private drawHeader(parsed: DiffFile): void {
    const chevron = el('button', { type: 'button', className: 'icon-button file-toggle' }, icon('chevron-right'));
    chevron.onclick = () => {
      folds.set(this.name, !this.closed());
      this.update(() => false);
    };
    const viewed = el('input', { type: 'checkbox' });
    viewed.onchange = () => {
      setViewed(this.name, viewed.checked);
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
      el('label', { className: 'viewed-toggle', title: 'Viewed (V)' }, viewed, 'Viewed'),
      attrs(
        el('button', { type: 'button', className: 'icon-button file-comment', title: 'Comment on this file', onclick: () => {
          if (this.fileComposing()) {
            // A draft survives a second click: only an empty composer closes.
            const draft = this.band.querySelector<HTMLTextAreaElement>('.composer textarea');
            if (draft?.value.trim()) draft.focus();
            else pick(null);
          } else {
            this.open();
            pick({ step: this.step.id, file: this.name });
          }
        } }, icon('message')),
        { 'aria-label': 'Comment on this file', 'aria-pressed': 'false' },
      ),
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
      }
      if (number && line && (this.shown.commentable?.has(line) ?? true)) {
        number.tabIndex = this.diffBox.querySelector('.line-num2[role="button"]') ? -1 : 0;
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
        const numbers = [...this.diffBox.querySelectorAll<HTMLElement>('.line-num2[role="button"]')];
        const target = numbers[numbers.indexOf(number) + (event.key === 'ArrowDown' ? 1 : -1)];
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
    if (extend && same && picked?.start !== undefined) pick({ ...picked, start: Math.min(picked.start, line), end: Math.max(picked.start, line) });
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
        const row = thread.lines && this.rows.get(thread.lines[1]);
        return row ? [mark(`tick ${threadBy(thread)}`, row.offsetTop, 3)] : [];
      }),
    );
  }

  /** Puts each thread under its last line, in the band above the diff once outdated or when on the whole file, and the composer where it was picked; returns what arrived where it would move the page. */
  private drawThreads(shows: Shows, closed: boolean): HTMLElement[] {
    const here = threadsIn(this.step.id, this.name);
    const onFile = here.filter(one => !one.lines).sort((one, other) => Date.parse(one.comments[0]?.at ?? '') - Date.parse(other.comments[0]?.at ?? ''));
    const banded = [...onFile, ...outdatedIn(this.step.id, this.name)];
    const arrived: HTMLElement[] = [];
    const ids = new Set([...here, ...banded].map(one => one.id));
    for (const [id, { row }] of this.threads)
      if (!ids.has(id) || (row.parentElement === this.band) !== banded.some(one => one.id === id)) {
        row.remove();
        this.threads.delete(id);
      }
    for (const old of this.diffBox.querySelectorAll('.gutter-mark')) old.remove();
    if (banded.length) this.band.hidden = false;
    for (const thread of [...banded, ...here.filter(one => one.lines)]) {
      const anchor = thread.step !== null && thread.lines ? this.rows.get(thread.lines[1]) : undefined;
      const holder = anchor ?? (banded.includes(thread) ? this.band : undefined);
      if (!holder) continue;
      const held = !closed && shows(holder);
      const kept = this.threads.get(thread.id);
      if (kept) {
        const fresh = kept.box.update(thread);
        if (held) arrived.push(...fresh.map(hold));
        else for (const one of fresh) one.classList.add('arrive');
        continue;
      }
      const box = new ThreadBox(thread);
      const row = anchor ? threadRow(box.box) : box.box;
      row.dataset['thread'] = thread.id;
      if (anchor) this.placeAfter(anchor, row);
      else holder.append(row);
      this.threads.set(thread.id, { row, box });
      if (held) arrived.push(hold(row));
      else if (this.drawn) for (const one of box.box.querySelectorAll('.comment')) one.classList.add('arrive');
    }
    this.drawn = true;
    banded.forEach((thread, at) => {
      const row = this.threads.get(thread.id)?.row;
      const now = this.band.children[at + (this.composerRow?.parentElement === this.band ? 1 : 0)];
      if (row && row !== now) this.band.insertBefore(row, now ?? null);
    });
    for (const thread of here) this.markThread(thread);
    this.drawComposer();
    this.header.querySelector('.file-comment')?.setAttribute('aria-pressed', String(this.fileComposing()));
    this.band.hidden = !this.band.childElementCount;
    this.drawStripe();
    return arrived;
  }

  private fileComposing(): boolean {
    return picked?.step === this.step.id && picked.file === this.name && picked.start === undefined;
  }

  private placeAfter(anchor: HTMLTableRowElement, row: HTMLElement): void {
    let last: Element = anchor;
    while (last.nextElementSibling?.classList.contains('thread-row')) last = last.nextElementSibling;
    last.after(row);
  }

  private markThread(thread: ThreadView): void {
    const row = thread.lines && this.rows.get(thread.lines[1]);
    // Inside the line number, so the mark sits just before it and never on the old number.
    const cell = row?.querySelector('.line-num2');
    if (!row || !cell) return;
    const by = threadBy(thread);
    if (!cell.querySelector('.gutter-mark'))
      cell.prepend(attrs(el('span', { className: `gutter-mark ${by}` }, icon(by === 'you' ? 'own' : 'message')), { 'aria-hidden': 'true' }));
  }

  private drawComposer(): void {
    const mine = picked?.step === this.step.id && picked.file === this.name ? picked : null;
    const lines: [number, number] | null = mine?.start !== undefined && mine.end !== undefined ? [mine.start, mine.end] : null;
    for (const [line, row] of this.rows) row.classList.toggle('picked', !!lines && line >= lines[0] && line <= lines[1]);
    const key = mine && (lines ? lines.join('-') : 'file');
    if (this.composerRow && this.composerRow.dataset['lines'] !== key) {
      this.composerRow.remove();
      this.composerRow = null;
    }
    if (!mine || this.composerRow) return;
    const anchor = lines && this.rows.get(lines[1]);
    if (lines && !anchor) return;
    const where = { file: this.name, ...(lines && { lines }) };
    const box = composer({
      placeholder: 'Leave a comment',
      ...(!lines && { label: 'Comment on this file' }),
      primary: 'Add comment',
      onPrimary: async text => {
        const done = await send('comment', { ...where, text });
        if (done) pick(null);
        return done;
      },
      onAsk: async text => {
        const done = await send('ask', { ...where, text });
        if (done) pick(null);
        return done;
      },
      onCancel: () => {
        pick(null);
      },
    });
    const thread = el('div', { className: 'thread' }, box);
    this.composerRow = anchor ? threadRow(thread) : el('div', {}, el('div', { className: 'thread-cell' }, thread));
    this.composerRow.classList.add('composer-line');
    this.composerRow.dataset['lines'] = key ?? '';
    if (anchor) this.placeAfter(anchor, this.composerRow);
    else this.band.prepend(this.composerRow);
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
    colourCode(box);
  }
}

/** A row under a diff line holding a thread or the composer; the cell is what opens and closes. */
const threadRow = (content: HTMLElement) => el('tr', { className: 'thread-row' }, el('td', { colSpan: 2 }, el('div', { className: 'thread-cell' }, content)));

/** A row or comment that arrived where it would move the page: folded until the pill opens it. */
function hold(element: HTMLElement): HTMLElement {
  element.classList.add('arriving');
  return element;
}

/** A file as a view other than All changes shows it: quiet when nothing in it changed since, folded; else only the lines in the step's own diff take comments. */
type Shown = { quiet?: true; commentable?: Set<number> };

/** The step's files, drawn once per diff; `own` is the step's own diff when `step` holds what changed since the last review. */
export function drawFiles(step: Step, { own, quiet }: { own?: Step; quiet?: true } = {}): FilePane[] {
  const parsed = parseDiff(step.diff);
  const ownFiles = own && parseDiff(own.diff);
  const shown = (file: DiffFile): Shown => {
    if (quiet) return { quiet };
    const mine = ownFiles?.find(one => one.newName === file.newName);
    return ownFiles ? { commentable: new Set(mine?.blocks.flatMap(block => block.lines.flatMap(line => (line.newNumber ? [line.newNumber] : [])))) } : {};
  };
  const holder = el('div');
  // diff2html escapes the code it draws, so its markup is safe to put in the page.
  holder.innerHTML = html(parsed, { outputFormat: 'line-by-line', drawFileList: false, matching: 'lines' });
  const tables = [...holder.querySelectorAll('.d2h-file-wrapper')].map(wrapper => wrapper.querySelector('.d2h-file-diff'));
  const panes = parsed.map((file, at) => new FilePane(step, file, tables[at] ?? null, shown(file)));
  // What changed since the last review starts from the head reviewed then.
  const revs = { base: own ? state.view.since?.head : state.view.base, head: state.view.head };
  parsed.forEach((file, at) => {
    const table = tables[at];
    if (table) void colourDiff(table, file, revs);
  });
  // A step shows its files in the order the session gave them.
  return step.files.flatMap(file => panes.filter(pane => pane.file === file));
}
