// The Summary: "Finish your review" made visible, with what goes out, what is left, the criteria and the review box.
import type { CommentView, ReviewType, ThreadView } from '../review';
import type { Criterion } from '../walkthrough';
import { attrs, el } from './dom';
import { sentLine, them, TYPE_NAMES, viewReview } from './end';
import { icon, type IconName } from './icons';
import { baseName, linesLabel, markdown, notViewed, pendingComments, plural, send, sentComments, state, suggestionCode, threadStep, unresolved } from './state';
import { animate, duration, FADE_IN, reduced, shrink, tick } from './motion';
import { avatar } from './threads';

const TYPES = Object.entries(TYPE_NAMES) as [ReviewType, string][];
const CRITERIA: Record<Criterion['status'], [IconName, string]> = {
  met: ['met', 'Met'],
  partly: ['partly', 'Partly met'],
  'not-met': ['not-met', 'Not met'],
  'not-checked': ['unchecked', 'Not checked'],
};
/** Gaps first, then what the AI could not check, then what is met; the ticket's order within each. */
const ORDER: Criterion['status'][] = ['not-met', 'partly', 'not-checked', 'met'];
const linesWord = (lines: [number, number]) => `${lines[0] === lines[1] ? 'line' : 'lines'} ${linesLabel(lines)}`;

/** The text on one line, without its suggestion blocks, which show only in the thread. */
function rowText(body: string): { text: string; suggests: boolean } {
  const box = markdown(body, 'row-text');
  const blocks = [...box.querySelectorAll('pre > code.language-suggestion')];
  for (const block of blocks) block.parentElement?.remove();
  return { text: box.textContent.replace(/\s+/g, ' ').trim(), suggests: blocks.length > 0 };
}

/** The AI's resolves not sent yet, or sent with the review the Summary shows as submitted. */
const resolvedByAi = () => state.view.threads.filter(one => one.resolvedBy === 'ai' && (one.resolveReview === undefined || one.resolveReview === state.view.submitted?.id));

/** What the Summary links to: a thread, which it can open for editing, a file, or lines of it to flash. */
export type Reveal = { thread?: string; edit?: string; file?: string; lines?: [number, number] };

export class SummaryPane {
  readonly box = el('section', { className: 'summary' });
  private draft = '';
  private type: ReviewType = 'comment';
  private drawn = '';
  private sending = false;
  /** Whether the last drawing showed the review sent; unset before the first. */
  private shownSent: boolean | undefined;
  private shownCount: number | undefined;
  /** Rows deleted and still closing, by comment, with the comment that followed each. */
  private readonly leaving = new Map<string, { row: HTMLElement; next: string | undefined }>();
  /** The review box fading out while the review is sent. */
  private sentBox: { box: HTMLElement; fading: Animation } | null = null;

  constructor(
    private readonly reveal: (target: Reveal) => void,
    private readonly end: () => void,
  ) {}

  update(): void {
    const { view } = state;
    const key = JSON.stringify([pendingComments(), resolvedByAi(), view.submitted, view.criteria, unresolved().length, notViewed().length, view.pr, this.sending]);
    if (key === this.drawn) return;
    this.drawn = key;
    const focused = document.activeElement;
    const typing = focused instanceof HTMLTextAreaElement && this.box.contains(focused) ? [focused.selectionStart, focused.selectionEnd] : null;
    const submitted = view.submitted;
    const rows = submitted ? sentComments(submitted.id) : pendingComments();
    const counter = el('span', { className: 'counter' }, String(rows.length));
    const list = el('ul', { className: 'going-out' }, ...rows.map(({ thread, comment }) => this.leaving.get(comment.id)?.row ?? this.row(thread, comment, !submitted)));
    for (const { row, next } of this.leaving.values())
      if (row.parentElement !== list) list.insertBefore(row, [...list.children].find(one => one instanceof HTMLElement && one.dataset['comment'] === next) ?? null);
    const going = el(
      'section',
      { className: 'summary-section' },
      el('h2', { className: 'section-head' }, submitted ? 'Sent' : 'Going out', counter),
      ...(list.children.length ? [list] : []),
      ...(rows.length || submitted ? [] : [el('p', { className: 'empty' }, 'No comments. Add one on a line.')]),
      ...(submitted ? [] : this.counts()),
    );
    const left = el('div', { className: 'summary-lists' }, going, ...this.resolved(), ...this.criteria());
    const right = el('div', { className: 'review-side' }, submitted ? this.done() : this.reviewBox());
    this.box.replaceChildren(el('h1', { className: 'step-title', tabIndex: -1 }, 'Summary'), el('div', { className: 'summary-grid' }, left, right));
    if (submitted && this.shownSent === false) this.arrive(right);
    this.shownSent = !!submitted;
    if (this.shownCount !== undefined && this.shownCount !== rows.length) tick(counter);
    this.shownCount = rows.length;
    if (typing) {
      const area = this.box.querySelector('textarea');
      area?.focus();
      area?.setSelectionRange(typing[0] ?? null, typing[1] ?? null);
    }
  }

  /** The submitted note fades and rises in where the review box fades out, its check popping. */
  private arrive(side: HTMLElement): void {
    const note = side.firstElementChild;
    if (!note) return;
    const { box: old, fading } = this.sentBox ?? {};
    this.sentBox = null;
    let after = 0;
    if (old && fading?.playState === 'running') {
      side.append(attrs(old, { inert: '', 'aria-hidden': 'true' }));
      after = Math.max(0, duration('fast') - Number(fading.currentTime ?? 0));
      fading.finished.then(
        () => {
          old.remove();
        },
        () => {},
      );
    }
    const still = reduced();
    animate(note, 'review-done', still ? FADE_IN : [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { ms: 'base', curve: still ? 'linear' : 'ease-out', delay: after });
    const check = note.querySelector(':scope > .icon');
    if (check && !still) animate(check, 'review-check', [{ opacity: 0, transform: 'scale(.5)' }, { opacity: 1, transform: 'none' }], { ms: 'slow', curve: 'ease-out', delay: after + 40 });
  }

  /** The row fades, then closes, while the comment is deleted. */
  private delete(row: HTMLElement, id: string): void {
    const next = row.nextElementSibling instanceof HTMLElement ? row.nextElementSibling.dataset['comment'] : undefined;
    this.leaving.set(id, { row, next });
    row.inert = true;
    shrink(row, () => {
      this.leaving.delete(id);
      row.remove();
    });
    void send('comment', { comment: id, delete: true }).then(done => {
      if (done) return;
      this.leaving.delete(id);
      row.remove();
      this.drawn = '';
      this.update();
    });
  }

  /** The thread's file and lines, or the file alone for a comment on the whole file; a link to it while it shows in a step. */
  private where(thread: ThreadView): HTMLElement {
    const where = thread.lines ? `${baseName(thread.file)}:${linesLabel(thread.lines)}` : baseName(thread.file);
    return threadStep(thread) === undefined
      ? el('span', { className: 'where', title: thread.file }, where)
      : el('a', { className: 'where', href: '#', title: thread.lines ? thread.file : `${thread.file}: go to the comment`, onclick: (event: MouseEvent) => { event.preventDefault(); this.reveal({ thread: thread.id }); } }, where);
  }

  private row(thread: ThreadView, comment: CommentView, pending: boolean): HTMLElement {
    const link = this.where(thread);
    const { text, suggests } = rowText(comment.body);
    const item = el('li', { className: 'going-row' });
    item.dataset['comment'] = comment.id;
    const actions = pending
      ? [
          el(
            'span',
            { className: 'comment-actions' },
            attrs(el('button', { type: 'button', className: 'icon-button', title: 'Edit', onclick: () => { this.reveal({ thread: thread.id, edit: comment.id }); } }, icon('edit')), { 'aria-label': 'Edit' }),
            attrs(el('button', { type: 'button', className: 'icon-button', title: 'Delete', onclick: () => { this.delete(item, comment.id); } }, icon('trash')), { 'aria-label': 'Delete' }),
          ),
        ]
      : [];
    const body = el(
      'span',
      { className: 'row-text', title: comment.by === 'ai' ? `[AI] ${text}` : text },
      ...(thread.step === null && comment.id === thread.id ? [el('span', { className: 'outdated-tag' }, 'Outdated')] : []),
      ...(suggests && suggestionCode(thread) ? [el('span', { className: 'suggestion-tag' }, 'Suggested change')] : []),
      ...(comment.by === 'ai' ? [el('span', { className: 'ai-tag' }, '[AI]'), ' '] : []),
      text,
    );
    item.append(avatar(comment), link, body, ...actions);
    return item;
  }

  private counts(): HTMLElement[] {
    const open = unresolved();
    const files = notViewed();
    const links = [
      ...(open.length ? [el('a', { href: '#', onclick: (event: MouseEvent) => { event.preventDefault(); this.reveal({ thread: open[0]?.id ?? '' }); } }, icon('message'), plural(open.length, 'unresolved thread'))] : []),
      ...(files.length ? [el('a', { href: '#', onclick: (event: MouseEvent) => { event.preventDefault(); this.reveal({ file: files[0] ?? '' }); } }, icon('eye'), `${String(files.length)} ${files.length === 1 ? 'file' : 'files'} not viewed`)] : []),
    ];
    return links.length ? [el('p', { className: 'counts' }, ...links)] : [];
  }

  /** The conversations the AI resolved that go out with the review, or went out with the one submitted. */
  private resolved(): HTMLElement[] {
    const rows = resolvedByAi();
    if (!rows.length) return [];
    return [
      el(
        'section',
        { className: 'summary-section' },
        el('h2', { className: 'section-head' }, 'Resolved conversations', el('span', { className: 'counter' }, String(rows.length))),
        el(
          'ul',
          { className: 'going-out' },
          ...rows.map(thread => {
            const { text } = rowText(thread.comments[0]?.body ?? '');
            const item = el(
              'li',
              { className: 'going-row resolved-row' },
              avatar({ by: 'ai' }),
              this.where(thread),
              el(
                'span',
                { className: 'row-text', title: text },
                el('span', { className: 'resolved-tag' }, 'Resolved'),
                ...(thread.resolvePending ? [el('span', { className: 'pending-tag' }, 'Pending')] : []),
                text,
              ),
            );
            item.dataset['thread'] = thread.id;
            return item;
          }),
        ),
      ),
    ];
  }

  private criteria(): HTMLElement[] {
    const criteria = state.view.criteria ?? [];
    if (!criteria.length) return [];
    return [
      el(
        'section',
        { className: 'summary-section' },
        el('h2', { className: 'section-head' }, 'Acceptance criteria', el('span', { className: 'section-note' }, 'checked by the AI')),
        el(
          'ul',
          { className: 'criteria' },
          ...[...criteria]
            .sort((one, other) => ORDER.indexOf(one.status) - ORDER.indexOf(other.status))
            .map(criterion => {
              const { text, status } = criterion;
              const [mark, word] = CRITERIA[status];
              const shows = this.shows(criterion);
              return el(
                'li',
                { className: `criterion ${status}` },
                icon(mark),
                el('span', { className: 'criterion-body' }, el('span', { className: 'criterion-text' }, text), ...(shows.length ? [el('span', { className: 'criterion-shows' }, ...shows)] : [])),
                el('span', { className: 'criterion-word' }, word),
              );
            }),
        ),
      ),
    ];
  }

  /** A gap's link to the AI comment that closes it and what is missing; met's link to its lines; not checked's reason. */
  private shows({ comment, missing, file, lines, reason }: Criterion): (HTMLElement | string)[] {
    if (reason) return [reason];
    if (file && lines)
      return [
        el(
          'a',
          { className: 'where', href: '#', title: `${file} ${linesWord(lines)}: go to the lines`, onclick: (event: MouseEvent) => { event.preventDefault(); this.reveal({ file, lines }); } },
          `${baseName(file)}:${linesLabel(lines)}`,
        ),
      ];
    // A deleted comment takes its link with it.
    const thread = comment === undefined ? undefined : state.view.threads.find(one => one.comments.some(said => said.id === comment));
    const where = thread ? `${baseName(thread.file)}${thread.lines ? `:${linesLabel(thread.lines)}` : ''}` : '';
    const title = thread ? `${thread.file}${thread.lines ? ` ${linesWord(thread.lines)}` : ''}: go to the comment` : '';
    const link = !thread
      ? []
      : threadStep(thread) === undefined
        ? [el('span', { className: 'where', title }, where)]
        : [el('a', { className: 'where', href: '#', title, onclick: (event: MouseEvent) => { event.preventDefault(); this.reveal({ thread: thread.id }); } }, where)];
    return [...link, ...(missing ? [missing] : [])];
  }

  private reviewBox(): HTMLElement {
    const own = !state.view.pr;
    const area = el('textarea', { className: 'composer-text', placeholder: 'Leave a comment', value: this.draft, rows: 3 });
    attrs(area, { 'aria-label': 'Summary' });
    area.oninput = () => {
      this.draft = area.value;
    };
    // Your own change has no review type: it goes to the agent with its comments, so it needs one.
    const blocked = own && pendingComments().length === 0;
    const submit = el('button', { type: 'button', className: 'btn primary wide', disabled: blocked || this.sending }, own ? 'Send to agent' : 'Submit review');
    const note = el('p', { className: 'review-note', hidden: !blocked }, 'Add a comment to send it.');
    attrs(submit, { 'aria-describedby': 'review-note' });
    note.id = 'review-note';
    const radios = TYPES.map(([value, label]) => {
      const radio = el('input', { type: 'radio', name: 'review-type', value, checked: value === this.type });
      radio.onchange = () => {
        this.type = value;
      };
      return el('label', { className: 'radio' }, radio, label);
    });
    submit.onclick = async () => {
      this.sending = true;
      submit.disabled = true;
      const still = reduced();
      const fading = animate(box, 'review-leave', still ? [{ opacity: 1 }, { opacity: 0 }] : [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scale(.98)' }], {
        ms: 'fast',
        curve: 'ease-in',
        fill: 'forwards',
      });
      this.sentBox = { box, fading };
      const done = await send('submit', { ...(!own && { type: this.type }), summary: this.draft.trim() });
      this.sending = false;
      if (done) this.draft = '';
      else {
        this.sentBox = null;
        this.update();
      }
    };
    const box = el(
      'div',
      { className: 'review-box' },
      el('h2', { className: 'section-head' }, 'Finish your review'),
      area,
      ...(own ? [] : [attrs(el('div', { className: 'radios' }, ...radios), { role: 'radiogroup', 'aria-label': 'Finish your review' })]),
      submit,
      note,
    );
    return box;
  }

  private done(): HTMLElement {
    const end = el('button', { type: 'button', className: 'btn small ghost', onclick: this.end }, 'End session');
    const lines = state.view.pr
      ? [el('strong', {}, 'Review submitted'), el('p', {}, sentLine()), el('p', { className: 'outcome-actions' }, ...viewReview(), end)]
      : [el('strong', {}, 'Sent to the agent'), el('p', {}, `${sentLine()} The agent is fixing ${them()}; follow along there.`), el('p', { className: 'outcome-actions' }, end)];
    return attrs(el('div', { className: 'review-box done' }, icon('met'), el('div', {}, ...lines)), { role: 'status' });
  }
}
