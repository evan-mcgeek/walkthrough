// How the person likes the page to look, shared by every walkthrough, the list and an export; the page and the CLI both read it.

export const CHOICES = {
  accent: ['ultramarine', 'petrol', 'berry'],
  theme: ['system', 'light', 'dark'],
} as const;

type Choices = typeof CHOICES;
export type Viewer = { [Setting in keyof Choices]: Choices[Setting][number] };

export const DEFAULT_VIEWER: Viewer = { accent: 'ultramarine', theme: 'system' };

/** `base` with each setting `change` gives a known value for; anything else is ignored. */
export function mergeViewer(base: Viewer, change: unknown): Viewer {
  const given = typeof change === 'object' && change !== null ? (change as Record<string, unknown>) : {};
  const result = { ...base };
  for (const setting of Object.keys(CHOICES) as (keyof Choices)[]) {
    const value = given[setting];
    if ((CHOICES[setting] as readonly unknown[]).includes(value)) Object.assign(result, { [setting]: value });
  }
  return result;
}
