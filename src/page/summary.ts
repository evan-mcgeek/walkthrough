// The Summary: "Finish your review" made visible, with what goes out, what is left, the criteria and the review box.
import type { CommentView, ReviewType, ThreadView } from '../review';
import type { Criterion } from '../walkthrough';
import { attrs, el } from './dom';
import { icon, type IconName } from './icons';
import { baseName, linesLabel, markdown, notViewed, pendingComments, plural, send, sentComments, state, unresolved } from './state';
import { avatar } from './threads';

const TYPES: [ReviewType, string][] = [
  ['comment', 'Comment'],
  ['approve', 'Approve'],
  ['request-changes', 'Request changes'],
];
const CRITERIA: Record<Criterion['status'], [IconName, string]> = {
  met: ['met', 'Met'],
  partly: ['partly', 'Partly met'],
  'not-met': ['not-met', 'Not met'],
  'not-checked': ['unchecked', 'Not checked'],
};

/** What the Summary links to: a thread, which it can open for editing, or a file. */
export type Reveal = { thread?: string; edit?: string; file?: string };

export class SummaryPane {
  readonly box = el('section', { className: 'summary' });
  private draft = '';
  private type: ReviewType = 'comment';
  private drawn = '';
  private sending = false;
  /** Whether the last drawing showed the review sent; unset before the first. */
  private shownSent: boolean | undefined;

  constructor(private readonly reveal: (target: Reveal) => void) {}

  update(): void {
    const { view } = state;
    const key = JSON.stringify([pendingComments(), view.submitted, view.criteria, unresolved().length, notViewed().length, view.pr, this.sending]);
    if (key === this.drawn) return;
    this.drawn = key;
    const focused = document.activeElement;
    const typing = focused instanceof HTMLTextAreaElement && this.box.contains(focused) ? [focused.selectionStart, focused.selectionEnd] : null;
    const submitted = view.submitted;
    const rows = submitted ? sentComments(submitted.id) : pendingComments();
    const going = el(
      'section',
      { className: 'summary-section' },
      el('h2', { className: 'section-head' }, submitted ? 'Sent' : 'Going out', el('span', { className: 'counter' }, String(rows.length))),
      ...(rows.length
        ? [el('ul', { className: 'going-out' }, ...rows.map(({ thread, comment }) => this.row(thread, comment, !submitted)))]
        : submitted
          ? []
          : [el('p', { className: 'empty' }, 'No comments. Add one on a line, or answer the AI’s.')]),
      ...(submitted ? [] : this.counts()),
    );
    const left = el('div', { className: 'summary-lists' }, going, ...this.criteria());
    const right = submitted ? this.done(submitted.comments) : this.reviewBox();
    this.box.replaceChildren(el('h1', { className: 'step-title', tabIndex: -1 }, 'Summary'), el('div', { className: 'summary-grid' }, left, right));
    if (submitted && this.shownSent === false) right.classList.add('arrive');
    this.shownSent = !!submitted;
    if (typing) {
      const area = this.box.querySelector('textarea');
      area?.focus();
      area?.setSelectionRange(typing[0] ?? null, typing[1] ?? null);
    }
  }

  private row(thread: ThreadView, comment: CommentView, pending: boolean): HTMLElement {
    const where = `${baseName(thread.file)}:${linesLabel(thread.lines)}`;
    const link =
      thread.step === null
        ? el('span', { className: 'where', title: thread.file }, where)
        : el('a', { className: 'where', href: '#', title: thread.file, onclick: (event: MouseEvent) => { event.preventDefault(); this.reveal({ thread: thread.id }); } }, where);
    const text = markdown(comment.body, 'row-text').textContent.replace(/\s+/g, ' ').trim();
    const actions = pending
      ? [
          el(
            'span',
            { className: 'comment-actions' },
            attrs(el('button', { type: 'button', className: 'icon-button', title: 'Edit', onclick: () => { this.reveal({ thread: thread.id, edit: comment.id }); } }, icon('edit')), { 'aria-label': 'Edit' }),
            attrs(el('button', { type: 'button', className: 'icon-button', title: 'Delete', onclick: () => void send('comment', { comment: comment.id, delete: true }) }, icon('trash')), { 'aria-label': 'Delete' }),
          ),
        ]
      : [];
    const body = el('span', { className: 'row-text', title: text }, ...(comment.by === 'ai' ? [el('code', { className: 'ai-tag' }, '[AI]'), ' '] : []), text);
    return el('li', { className: 'going-row' }, avatar(comment), link, body, ...actions);
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
          ...criteria.map(({ text, status }) => {
            const [mark, word] = CRITERIA[status];
            return el('li', { className: `criterion ${status}` }, icon(mark), el('span', { className: 'criterion-text', title: text }, text), el('span', { className: 'criterion-word' }, word));
          }),
        ),
      ),
    ];
  }

  private reviewBox(): HTMLElement {
    const own = !state.view.pr;
    const area = el('textarea', { className: 'composer-text', placeholder: 'Leave a comment', value: this.draft, rows: 3 });
    attrs(area, { 'aria-label': 'Summary' });
    area.oninput = () => {
      this.draft = area.value;
    };
    const blocked = () => own && this.type === 'comment' && pendingComments().length === 0;
    const submit = el('button', { type: 'button', className: 'btn primary wide', disabled: blocked() || this.sending }, own ? 'Send to agent' : 'Submit review');
    const note = el('p', { className: 'review-note', hidden: !blocked() }, 'Add a comment, or choose Approve or Request changes.');
    attrs(submit, { 'aria-describedby': 'review-note' });
    note.id = 'review-note';
    const radios = TYPES.map(([value, label]) => {
      const radio = el('input', { type: 'radio', name: 'review-type', value, checked: value === this.type });
      radio.onchange = () => {
        this.type = value;
        submit.disabled = blocked();
        note.hidden = !blocked();
      };
      return el('label', { className: 'radio' }, radio, label);
    });
    submit.onclick = async () => {
      this.sending = true;
      submit.disabled = true;
      const done = await send('submit', { type: this.type, summary: this.draft.trim() });
      this.sending = false;
      if (done) this.draft = '';
      else this.update();
    };
    return el(
      'div',
      { className: 'review-box' },
      el('h2', { className: 'section-head' }, 'Finish your review'),
      area,
      attrs(el('div', { className: 'radios' }, ...radios), { role: 'radiogroup', 'aria-label': 'Finish your review' }),
      submit,
      note,
    );
  }

  private done(count: number): HTMLElement {
    const { view } = state;
    const submitted = view.submitted;
    const type = TYPES.find(([value]) => value === submitted?.type)?.[1] ?? '';
    const lines = view.pr
      ? [
          el('strong', {}, 'Review submitted'),
          el('p', {}, `${type}, with ${plural(count, 'comment')}, on #${view.pr.number}.`),
          ...(submitted?.address ? [el('a', { href: submitted.address, target: '_blank', rel: 'noopener noreferrer' }, 'View review')] : []),
        ]
      : [el('strong', {}, 'Sent to the agent'), ...(count ? [el('p', {}, `${plural(count, 'comment')}; it fixes them in the Claude Code chat.`)] : [])];
    return attrs(el('div', { className: 'review-box done' }, icon('met'), el('div', {}, ...lines)), { role: 'status' });
  }
}
