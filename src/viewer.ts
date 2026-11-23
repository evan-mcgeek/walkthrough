// How the person likes the page to look and which panels it shows, shared by every walkthrough, the list and an export.

export const CHOICES = {
  accent: ['ultramarine', 'petrol', 'berry'],
  theme: ['system', 'light', 'dark'],
} as const;

/** The page's tool windows, in the order of the keys 1 to 3 that show and hide them. */
export const PANELS = ['queue', 'checklist', 'explanation'] as const;
export type Panel = (typeof PANELS)[number];

type Choices = typeof CHOICES;
export type Viewer = { [Setting in keyof Choices]: Choices[Setting][number] } & { panels: Record<Panel, boolean> };

export const DEFAULT_VIEWER: Viewer = {
  accent: 'ultramarine',
  theme: 'system',
  panels: { queue: true, checklist: false, explanation: false },
};

const fields = (value: unknown): Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value) ? (value as Record<string, unknown>) : {};

/** `base` with each setting `change` gives a known value for; anything else is ignored. */
export function mergeViewer(base: Viewer, change: unknown): Viewer {
  const given = fields(change);
  const result: Viewer = { ...base, panels: { ...base.panels } };
  for (const setting of Object.keys(CHOICES) as (keyof Choices)[]) {
    const value = given[setting];
    if ((CHOICES[setting] as readonly unknown[]).includes(value)) Object.assign(result, { [setting]: value });
  }
  const panels = fields(given['panels']);
  for (const panel of PANELS) if (typeof panels[panel] === 'boolean') result.panels[panel] = panels[panel];
  return result;
}
