/** The design's drawn 16px line icons; each takes its colour from the text around it (currentColor). */

type Shape = readonly [tag: 'path' | 'circle' | 'rect', attributes: Record<string, string | number>];

const round = { fill: 'none', stroke: 'currentColor', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
const line = (d: string, width = 1.7): Shape => ['path', { d, ...round, 'stroke-width': width }];
const ring = (extra: Record<string, string | number> = {}): Shape =>
  ['circle', { cx: 8, cy: 8, r: 6.2, fill: 'none', stroke: 'currentColor', 'stroke-width': 1.6, ...extra }];

const ICONS = {
  /** The brand's walked W: the last stroke, still to go, is lighter. */
  mark: [
    ['path', { d: 'M1.6 3.2L4.6 12.8L8 5.6L11.4 12.8', ...round, 'stroke-width': 2.3 }],
    ['path', { d: 'M11.4 12.8L14.4 3.2', ...round, 'stroke-width': 2.3, opacity: 0.4 }],
  ],
  sidebar: [
    ['rect', { x: 1.5, y: 2.5, width: 13, height: 11, rx: 2, fill: 'none', stroke: 'currentColor', 'stroke-width': 1.4 }],
    ['rect', { x: 2.6, y: 3.6, width: 3.4, height: 8.8, rx: 0.8, fill: 'currentColor' }],
  ],
  /** The one spinner: the dashed ring with its turning arc, while the AI works. */
  spinner: [
    ring({ 'stroke-opacity': 0.45, 'stroke-dasharray': '2.4 2.2' }),
    line('M8 1.8a6.2 6.2 0 0 1 6.2 6.2', 1.9),
  ],
  more: [3.5, 8, 12.5].map((cx): Shape => ['circle', { cx, cy: 8, r: 1.4, fill: 'currentColor' }]),
  message: [line('M2.5 3.5h11v7h-6l-3 2.5v-2.5h-2z', 1.5)],
  own: [
    ['circle', { cx: 8, cy: 5.6, r: 2.6, fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5 }],
    line('M3 13.5c.8-2.4 2.7-3.6 5-3.6s4.2 1.2 5 3.6', 1.5),
  ],
  summary: [line('M3 3.5h10M3 8h10M3 12.5h6', 1.6)],
  /** A file not viewed yet; `met` doubles as a viewed one. */
  ring: [ring()],
  met: [ring(), line('M5 8.2l2 2 4-4.3')],
  'not-met': [ring(), line('M5.6 5.6l4.8 4.8M10.4 5.6l-4.8 4.8')],
  partly: [ring(), line('M5 8h6')],
  unchecked: [ring({ 'stroke-dasharray': '2.4 2.2' })],
  eye: [
    ['path', { d: 'M1.5 8s2.4-4.5 6.5-4.5S14.5 8 14.5 8 12.1 12.5 8 12.5 1.5 8 1.5 8z', ...round, 'stroke-width': 1.4 }],
    ['circle', { cx: 8, cy: 8, r: 2, fill: 'currentColor' }],
  ],
  ask: [
    ring({ 'stroke-width': 1.5 }),
    line('M6.3 6.3a1.8 1.8 0 1 1 2.4 1.7c-.5.2-.7.6-.7 1.1v.3', 1.5),
    ['circle', { cx: 8, cy: 11.4, r: 0.9, fill: 'currentColor' }],
  ],
  edit: [line('M10.5 2.8l2.7 2.7-7.4 7.4-3.2.5.5-3.2z', 1.4)],
  trash: [line('M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5l.7 8.5h5.6l.7-8.5', 1.4)],
  'chevron-right': [line('M6 4l4 4-4 4')],
  previous: [line('M10 3.5L5.5 8l4.5 4.5')],
  next: [line('M6 3.5L10.5 8 6 12.5')],
  up: [line('M4 10l4-4 4 4')],
  warn: [
    ['path', { d: 'M8 2l6.5 11.5h-13z', ...round, 'stroke-width': 1.5 }],
    line('M8 6.5v3.2', 1.6),
    ['circle', { cx: 8, cy: 11.6, r: 0.9, fill: 'currentColor' }],
  ],
  offline: [line('M2 6a9 9 0 0 1 12 0M4.3 8.5a5.6 5.6 0 0 1 7.4 0M6.6 11a2.2 2.2 0 0 1 2.8 0M2.5 2.5l11 11', 1.5)],
  file: [['path', { d: 'M4 1.8h5l3 3v9.4H4z M9 1.8v3h3', ...round, 'stroke-width': 1.5 }]],
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
