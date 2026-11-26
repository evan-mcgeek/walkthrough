// One comment component for everyone, threads of them, and the composer they are written in.
import type { Code } from '../lines';
import type { CommentView, ThreadView } from '../review';
import { attrs, el } from './dom';
import { colourLines } from './highlight';
import { icon } from './icons';
import { ago, goesOut, markdown, send, suggestionCode } from './state';

const initials = (handle: string) =>
  handle
    .split(/[-_.\s]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part.charAt(0).toUpperCase())
    .join('') || '?';

export const authorName = (comment: Pick<CommentView, 'by' | 'author'>) =>
  comment.by === 'you' ? 'You' : comment.by === 'ai' ? 'AI' : (comment.author ?? '');

/** You in an accent circle, the AI in an ink square, a colleague in a grey circle; the name beside it says who. */
export function avatar(comment: Pick<CommentView, 'by' | 'author'>): HTMLElement {
  const text = comment.by === 'you' ? 'Y' : comment.by === 'ai' ? 'AI' : initials(comment.author ?? '');
  return attrs(el('span', { className: `avatar avatar-${comment.by}` }, text), { 'aria-hidden': 'true' });
}

/** The body as it shows: `[AI]` before an AI comment that goes out, "Ask AI:" before a question to it, a suggestion on `code` as a suggested change. */
export function commentBody(comment: CommentView, code?: Code): HTMLElement {
  const body = markdown(comment.ask ? `Ask AI: ${comment.body}` : comment.body, 'comment-text', code);
  if (goesOut(comment)) (body.querySelector('p') ?? body).prepend(el('span', { className: 'ai-tag' }, '[AI]'), ' ');
  return body;
}

type ComposerOptions = {
  placeholder: string;
  text?: string;
  primary: string;
  onPrimary: (text: string) => Promise<boolean>;
  onAsk?: (text: string) => Promise<boolean>;
  onCancel: () => void;
};

export function composer({ placeholder, text = '', primary, onPrimary, onAsk, onCancel }: ComposerOptions): HTMLElement {
  const area = el('textarea', { className: 'composer-text', placeholder, value: text, rows: 3 });
  area.setAttribute('aria-label', placeholder);
  const add = el('button', { type: 'button', className: 'btn primary small', disabled: !text.trim() }, primary);
  const busy = (doing: boolean) => {
    for (const button of box.querySelectorAll('button')) button.disabled = doing;
    if (!doing) add.disabled = !area.value.trim();
  };
  const run = async (action: (text: string) => Promise<boolean>) => {
    if (!area.value.trim()) {
      area.focus();
      return;
    }
    busy(true);
    if (!(await action(area.value.trim()))) busy(false);
  };
  area.oninput = () => {
    add.disabled = !area.value.trim();
  };
  area.onkeydown = event => {
    if (event.key === 'Escape') {
      event.preventDefault();
      onCancel();
    } else if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      void run(onPrimary);
    }
  };
  add.onclick = () => void run(onPrimary);
  const box = el(
    'div',
    { className: 'composer' },
    area,
    el(
      'div',
      { className: 'composer-row' },
      ...(onAsk ? [askButton(() => void run(onAsk))] : []),
      el('span', { className: 'spacer' }),
      el('button', { type: 'button', className: 'btn ghost small', onclick: onCancel }, 'Cancel'),
      add,
    ),
  );
  return box;
}

export const askButton = (onclick: () => void) => el('button', { type: 'button', className: 'btn small ask', onclick }, icon('ask'), 'Ask AI');

function iconButton(name: 'edit' | 'trash', label: string, onclick: () => void): HTMLButtonElement {
  return attrs(el('button', { type: 'button', className: 'icon-button', title: label, onclick }, icon(name)), { 'aria-label': label });
}

/** A thread under its line, or at the top of its file once outdated; it keeps its own state, such as an open reply, across the page's redraws. */
export class ThreadBox {
  readonly box = el('div', { className: 'thread' });
  private readonly list = el('div', { className: 'thread-comments' });
  private readonly foot = el('div', { className: 'thread-foot' });
  private readonly outdated = el('div', { className: 'outdated', hidden: true });
  private readonly body = el('div', { className: 'thread-body' }, el('div', { className: 'thread-inner' }, this.outdated, this.list, this.foot));
  private readonly resolvedPending = el('span', { className: 'pending-tag' }, 'Pending');
  private readonly resolvedText = el('span', { className: 'resolved-text' }, el('strong', {}, 'AI'), ' marked this conversation as resolved.');
  private readonly showButton = attrs(el('button', { type: 'button', className: 'btn small ghost' }), { 'aria-expanded': 'false' });
  /** The collapsed line of a thread the AI resolved. */
  private readonly resolvedLine = el(
    'div',
    { className: 'resolved-line' },
    avatar({ by: 'ai' }),
    this.resolvedText,
    el('span', { className: 'spacer' }),
    this.showButton,
  );
  private showResolved = false;
  private drawnFoot = '';
  private readonly shown = new Map<string, { element: HTMLElement; key: string }>();
  private answering: HTMLElement | null = null;
  private editing: string | null = null;
  private replying = false;
  private thread: ThreadView;

  constructor(thread: ThreadView) {
    this.thread = thread;
    this.box.dataset['thread'] = thread.id;
    this.box.append(this.body);
    this.showButton.onclick = () => {
      this.show(!this.showResolved);
    };
    this.update(thread);
  }

  /** Opens or closes a thread the AI resolved; any other thread is always open. */
  show(open = true): void {
    this.showResolved = open;
    const folded = this.thread.resolvedBy === 'ai' && !open;
    this.box.classList.toggle('folded', folded);
    this.body.inert = folded;
    this.showButton.textContent = open ? 'Hide resolved' : 'Show resolved';
    this.showButton.setAttribute('aria-expanded', String(open));
  }

  private drawOutdated(): void {
    const { thread } = this;
    this.outdated.hidden = thread.step !== null;
    if (thread.step !== null || this.outdated.hasChildNodes()) return;
    // A gap row stands where the numbers jump, between two hunks.
    const texts = (thread.code ?? []).map(([, text]) => el('span', {}, text));
    const code = (thread.code ?? []).flatMap(([number], at, all) => [
      ...(at > 0 && number !== (all[at - 1]?.[0] ?? 0) + 1 ? [attrs(el('div', { className: 'outdated-gap' }), { 'aria-hidden': 'true' })] : []),
      el('div', { className: 'outdated-line' }, el('span', { className: 'outdated-number' }, String(number)), texts[at] ?? ''),
    ]);
    colourLines(texts, thread.file);
    this.outdated.append(
      el('div', { className: 'outdated-head' }, el('span', { className: 'outdated-path', title: thread.file }, thread.file), el('span', { className: 'outdated-tag' }, 'Outdated')),
      ...(code.length ? [el('div', { className: 'outdated-code' }, ...code)] : []),
    );
  }

  /** Brings the thread up to date; returns the comments that arrived, which the file may hold behind the pill. */
  update(thread: ThreadView): HTMLElement[] {
    this.thread = thread;
    const byAi = thread.resolvedBy === 'ai';
    this.box.classList.toggle('resolved', !!thread.resolved && !byAi);
    this.box.classList.toggle('ai-resolved', byAi);
    // In the page only while they apply, so a thread never holds a hidden "Pending".
    if (!byAi) this.resolvedLine.remove();
    else if (!this.resolvedLine.isConnected) this.box.prepend(this.resolvedLine);
    if (thread.resolvePending) {
      if (!this.resolvedPending.isConnected) this.resolvedText.after(this.resolvedPending);
    }
    else this.resolvedPending.remove();
    this.show(this.showResolved);
    this.drawOutdated();
    const arrived: HTMLElement[] = [];
    const ids = new Set(thread.comments.map(one => one.id));
    for (const [id, { element }] of this.shown)
      if (!ids.has(id)) {
        element.remove();
        this.shown.delete(id);
      }
    let before: Element | null = null;
    for (const comment of thread.comments) {
      const key = JSON.stringify([comment.body, comment.pending, comment.review, comment.waiting, this.editing === comment.id, suggestionCode(thread)]);
      const was = this.shown.get(comment.id);
      let element = was?.element;
      if (!was || (was.key !== key && this.editing !== comment.id) || (this.editing === comment.id && !was.element.querySelector('textarea'))) {
        element = this.commentRow(comment);
        if (was) was.element.replaceWith(element);
        else {
          if (this.shown.size) arrived.push(element);
          // An answer takes the place of its "Answering…" row.
          if (comment.answer) element.classList.add('arrive');
        }
        this.shown.set(comment.id, { element, key });
      }
      if (element && (element.parentElement !== this.list || element.previousElementSibling !== before)) {
        if (before) before.after(element);
        else this.list.prepend(element);
      }
      before = element ?? before;
    }
    const waiting = thread.comments.some(one => one.waiting);
    if (waiting && !this.answering)
      this.answering = el(
        'div',
        { className: 'comment answering arrive' },
        avatar({ by: 'ai' }),
        el('span', { className: 'answering-text' }, attrs(icon('spinner'), { role: 'img', 'aria-label': 'AI is answering' }), 'Answering…'),
      );
    if (waiting && this.answering && this.list.lastElementChild !== this.answering) this.list.append(this.answering);
    if (!waiting) {
      this.answering?.remove();
      this.answering = null;
    }
    this.drawFoot();
    return arrived.filter(element => !element.classList.contains('arrive'));
  }

  /** Opens a pending comment of the thread in the composer. */
  edit(id: string): void {
    this.editing = id;
    this.update(this.thread);
    this.box.querySelector<HTMLElement>(`[data-comment="${CSS.escape(id)}"] textarea`)?.focus();
  }

  private commentRow(comment: CommentView): HTMLElement {
    const row = el('div', { className: `comment comment-${comment.by}` });
    row.dataset['comment'] = comment.id;
    const head = el(
      'div',
      { className: 'comment-head' },
      el('strong', { className: 'comment-name' }, authorName(comment)),
      ...(comment.pending ? [el('span', { className: 'pending-tag' }, 'Pending')] : []),
      el('time', { className: 'comment-time', dateTime: comment.at, title: new Date(comment.at).toLocaleString() }, ago(comment.at)),
    );
    if (comment.pending && this.editing !== comment.id)
      head.append(
        el(
          'span',
          { className: 'comment-actions' },
          iconButton('edit', 'Edit', () => {
            this.edit(comment.id);
          }),
          iconButton('trash', 'Delete', () => void send('comment', { comment: comment.id, delete: true })),
        ),
      );
    const body =
      this.editing === comment.id
        ? composer({
            placeholder: 'Leave a comment',
            text: comment.body,
            primary: 'Update comment',
            onPrimary: async text => {
              this.editing = null;
              const done = await send('comment', { comment: comment.id, text });
              if (!done) this.editing = comment.id;
              return done;
            },
            onCancel: () => {
              this.editing = null;
              this.update(this.thread);
            },
          })
        : commentBody(comment, suggestionCode(this.thread));
    row.append(avatar(comment), el('div', { className: 'comment-main' }, head, body));
    return row;
  }

  private drawFoot(): void {
    const { thread } = this;
    if (this.replying) {
      if (this.foot.querySelector('.composer')) return;
      const box = composer({
        placeholder: 'Reply…',
        primary: 'Add comment',
        onPrimary: async text => this.closeAfter(await send('comment', { thread: thread.id, text })),
        onAsk: async text => this.closeAfter(await send('ask', { thread: thread.id, text })),
        onCancel: () => {
          this.replying = false;
          this.drawFoot();
          this.foot.querySelector<HTMLElement>('.reply-field')?.focus();
        },
      });
      this.foot.replaceChildren(box);
      this.foot.classList.add('composing');
      box.querySelector('textarea')?.focus();
      return;
    }
    const key = JSON.stringify([thread.colleague && !thread.resolved, thread.unresolvable]);
    if (this.foot.querySelector('.reply-field') && key === this.drawnFoot) return;
    this.drawnFoot = key;
    this.foot.classList.remove('composing');
    const open = () => {
      this.replying = true;
      this.drawFoot();
    };
    // Resolve and Unresolve swap in place, so the focus moves to whichever now shows.
    const flip = async (route: 'resolve' | 'unresolve') => {
      if (await send(route, { thread: thread.id })) this.foot.querySelector<HTMLElement>('.resolve, .unresolve, .reply-field')?.focus();
    };
    // A button that looks like a reply field and opens the composer in its place.
    const field = el('button', { type: 'button', className: 'reply-field', onclick: open }, 'Reply…');
    this.foot.replaceChildren(
      field,
      askButton(open),
      ...(thread.colleague && !thread.resolved ? [el('button', { type: 'button', className: 'btn small resolve', onclick: () => void flip('resolve') }, 'Resolve')] : []),
      ...(thread.unresolvable ? [el('button', { type: 'button', className: 'btn small unresolve', onclick: () => void flip('unresolve') }, 'Unresolve conversation')] : []),
    );
  }

  private closeAfter(done: boolean): boolean {
    if (done) {
      this.replying = false;
      this.drawFoot();
    }
    return done;
  }
}
