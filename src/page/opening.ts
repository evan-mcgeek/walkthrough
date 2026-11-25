// The Opening: what the page shows until the session runs `walkthrough ready`, or the session gone before it did.
import { attrs, el } from './dom';
import { deskScene } from './desk';
import { commandBox } from './end';
import { icon } from './icons';
import { plural, state } from './state';

export class Opening {
  readonly box = el('div', { className: 'opening' });
  private scene: ReturnType<typeof deskScene> | null = null;
  private drawn = '';

  update(): void {
    const { sessionGone, changedFiles, pr } = state.view;
    const key = JSON.stringify([sessionGone, changedFiles, pr?.number]);
    if (key === this.drawn) return;
    this.drawn = key;
    const files = plural(changedFiles.length, 'changed file');
    if (sessionGone) {
      this.scene?.stop();
      this.scene = null;
      this.box.replaceChildren(this.failed(), this.fileList(files));
      return;
    }
    this.scene ??= deskScene();
    this.box.replaceChildren(
      this.scene.box,
      attrs(
        el(
          'div',
          {},
          el('h1', { className: 'opening-title' }, 'Preparing the walkthrough'),
          el('p', { className: 'opening-line' }, 'The AI is finishing its review, usually within a minute.'),
        ),
        { role: 'status' },
      ),
      this.fileList(files),
    );
  }

  /** Lets the scene go, once the walkthrough shows. */
  stop(): void {
    this.scene?.stop();
    this.scene = null;
  }

  private failed(): HTMLElement {
    return attrs(
      el(
        'div',
        { className: 'opening-failed' },
        icon('not-met'),
        el(
          'div',
          {},
          el('h1', { className: 'opening-title' }, 'The AI couldn’t prepare the walkthrough'),
          el('p', { className: 'opening-line' }, 'It stopped before the review was done. Nothing was posted.'),
          el('p', { className: 'end-line opening-lead' }, 'Start it over in your agent:'),
          commandBox(),
        ),
      ),
      { role: 'status' },
    );
  }

  private fileList(files: string): HTMLElement {
    const { changedFiles } = state.view;
    const sum = (key: 'additions' | 'deletions') => changedFiles.reduce((total, one) => total + (one[key] ?? 0), 0);
    return el(
      'section',
      { className: 'changed-files' },
      el('h2', {}, files, el('span', { className: 'changed-total' }, `+${String(sum('additions'))} −${String(sum('deletions'))}`)),
      el(
        'ul',
        {},
        ...changedFiles.map(({ path, additions, deletions }) =>
          el(
            'li',
            {},
            el('span', { className: 'changed-path', title: path }, path),
            ...(additions === undefined
              ? []
              : [el('span', { className: 'changed-stat' }, el('span', { className: 'added' }, `+${String(additions)}`), ' ', el('span', { className: 'deleted' }, `−${String(deletions ?? 0)}`))]),
          ),
        ),
      ),
    );
  }
}

const PLACEHOLDERS = [
  ['w70', 'w45', 'w35'],
  ['w55', 'w40', 'w50'],
  ['w80', 'w30', 'w45'],
];

/** The step list while there are no steps to show: one line, three quiet rows unless the session is gone, and the Summary. */
export function openingNav(): Node[] {
  const gone = state.view.sessionGone;
  const rows = gone
    ? []
    : PLACEHOLDERS.map(([step = '', ...files]) =>
        el(
          'li',
          { className: 'step-placeholder' },
          el('span', { className: 'step-row' }, el('span', { className: 'step-number' }), el('span', { className: `placeholder-bar ${step}` })),
          el('ul', { className: 'file-list' }, ...files.map(width => el('li', {}, el('span', { className: `placeholder-bar ${width}` })))),
        ),
      );
  return [
    el('p', { className: 'steps-note' }, gone ? 'No steps yet.' : 'Steps appear here when the AI is done.'),
    attrs(el('ol', { className: 'steps' }, ...rows), { 'aria-hidden': 'true' }),
    el('span', { className: 'step-row summary-row still' }, icon('summary'), el('span', { className: 'step-name' }, 'Summary'), el('span', { className: 'file-count' }, '0')),
  ];
}
