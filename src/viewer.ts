// How the person likes the page to look, shared by every walkthrough and the list.

export const THEMES = ['system', 'light', 'dark'] as const;
export type Viewer = { theme: (typeof THEMES)[number] };

export const DEFAULT_VIEWER: Viewer = { theme: 'system' };

/** `base` with the theme `change` gives, when it is a known one; anything else is ignored. */
export function mergeViewer(base: Viewer, change: unknown): Viewer {
  const theme = typeof change === 'object' && change !== null ? (change as Record<string, unknown>)['theme'] : undefined;
  return THEMES.includes(theme as Viewer['theme']) ? { theme: theme as Viewer['theme'] } : { ...base };
}
