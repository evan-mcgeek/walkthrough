/** The design's drawn 16px line icons; each takes its colour from the text around it (currentColor). */

type Shape = readonly [tag: 'path' | 'circle' | 'rect', attributes: Record<string, string | number>];

const round = { fill: 'none', stroke: 'currentColor', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
const line = (d: string, width = 1.7): Shape => ['path', { d, ...round, 'stroke-width': width }];
const ring = (extra: Record<string, string | number> = {}): Shape =>
  ['circle', { cx: 8, cy: 8, r: 6.2, fill: 'none', stroke: 'currentColor', 'stroke-width': 1.6, ...extra }];
const block = (x: number, y: number, width: number, height: number, opacity = 1): Shape =>
  ['rect', { x, y, width, height, rx: 1, fill: 'currentColor', ...(opacity < 1 && { opacity }) }];

const ICONS = {
  /** Queue and step states. */
  unread: [ring()],
  read: [ring(), ['path', { d: 'M8 1.8a6.2 6.2 0 0 1 0 12.4z', fill: 'currentColor' }]],
  // The tick is cut out of the disc in the canvas colour.
  decided: [
    ['circle', { cx: 8, cy: 8, r: 7, fill: 'currentColor' }],
    ['path', { d: 'M4.8 8.2l2.1 2.1 4.3-4.6', ...round, 'stroke-width': 1.8, class: 'knockout' }],
  ],
  reopened: [line('M13 8a5 5 0 1 1-1.6-3.7'), line('M11.8 1.8v3h-3')],
  folded: [block(2, 3, 12, 3), block(2, 8, 12, 2, 0.55), block(2, 12, 12, 2, 0.3)],
  message: [line('M2.5 3.5h11v7h-6l-3 2.5v-2.5h-2z', 1.5)],
  /** Checklist statuses. */
  met: [ring(), line('M5 8.2l2 2 4-4.3')],
  'not-met': [ring(), line('M5.6 5.6l4.8 4.8M10.4 5.6l-4.8 4.8')],
  partly: [ring(), line('M5 8h6')],
  unchecked: [ring({ 'stroke-dasharray': '2.4 2.2' })],
  /** Notices and session. */
  warn: [
    ['path', { d: 'M8 2l6.5 11.5h-13z', ...round, 'stroke-width': 1.5 }],
    line('M8 6.5v3.2', 1.6),
    ['circle', { cx: 8, cy: 11.6, r: 0.9, fill: 'currentColor' }],
  ],
  unlink: [line('M6.5 9.5l-1.8 1.8a2 2 0 0 1-2.8-2.8L3.7 6.7M9.5 6.5l1.8-1.8a2 2 0 0 1 2.8 2.8l-1.8 1.8M5 3V1.5M3 5H1.5M11 13v1.5M13 11h1.5', 1.5)],
  offline: [line('M2 6a9 9 0 0 1 12 0M4.3 8.5a5.6 5.6 0 0 1 7.4 0M6.6 11a2.2 2.2 0 0 1 2.8 0M2.5 2.5l11 11', 1.5)],
  ask: [
    ring({ 'stroke-width': 1.5 }),
    line('M6.3 6.3a1.8 1.8 0 1 1 2.4 1.7c-.5.2-.7.6-.7 1.1v.3', 1.5),
    ['circle', { cx: 8, cy: 11.4, r: 0.9, fill: 'currentColor' }],
  ],
  spinner: [
    ['circle', { cx: 8, cy: 8, r: 6, fill: 'none', stroke: 'currentColor', 'stroke-opacity': 0.25, 'stroke-width': 2 }],
    line('M8 2a6 6 0 0 1 6 6', 2),
  ],
  /** Files and controls. */
  file: [['path', { d: 'M4 1.8h5l3 3v9.4H4z M9 1.8v3h3', ...round, 'stroke-width': 1.5 }]],
  more: [3.5, 8, 12.5].map((cx): Shape => ['circle', { cx, cy: 8, r: 1.4, fill: 'currentColor' }]),
  'chevron-right': [line('M6 4l4 4-4 4')],
  'chevron-down': [line('M4 6l4 4 4-4')],
  previous: [line('M10 3.5L5.5 8l4.5 4.5')],
  next: [line('M6 3.5L10.5 8 6 12.5')],
  /** Layouts. */
  'layout-queue': [block(1, 2, 5, 12), block(7.3, 2, 7.7, 12, 0.5)],
  'layout-three': [block(1, 2, 3.5, 12), block(5.8, 2, 5, 12, 0.5), block(12, 2, 3, 12)],
  'layout-split': [block(1, 2, 6.3, 12, 0.5), block(8.7, 2, 6.3, 12)],
  'layout-panel': [block(1, 2, 3.5, 12), block(5.8, 2, 9.2, 7.5, 0.5), block(5.8, 10.7, 9.2, 3.3)],
} satisfies Record<string, readonly Shape[]>;

export type IconName = keyof typeof ICONS;

const SVG = 'http://www.w3.org/2000/svg';

/** An icon that is decoration beside its text, or, given a label, an image that says what it shows. */
export function icon(name: IconName, label?: string): SVGSVGElement {
  const svg = document.createElementNS(SVG, 'svg');
  for (const [key, value] of Object.entries({ viewBox: '0 0 16 16', width: 16, height: 16, focusable: 'false' }))
    svg.setAttribute(key, String(value));
  svg.classList.add('icon', `icon-${name}`);
  if (label) {
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', label);
  } else svg.setAttribute('aria-hidden', 'true');
  for (const [tag, attributes] of ICONS[name] as readonly Shape[]) {
    const shape = document.createElementNS(SVG, tag);
    for (const [key, value] of Object.entries(attributes)) shape.setAttribute(key, String(value));
    svg.append(shape);
  }
  return svg;
}
