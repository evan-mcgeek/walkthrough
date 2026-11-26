// How the person likes the page to look, shared by every walkthrough and the list.

export const THEMES = ['system', 'light', 'dark'] as const;
export type Viewer = { theme: (typeof THEMES)[number]; colourBlind: boolean };

export const DEFAULT_VIEWER: Viewer = { theme: 'system', colourBlind: false };

/** `base` with each setting `change` gives a known value for; anything else is ignored. */
export function mergeViewer(base: Viewer, change: unknown): Viewer {
  const given = typeof change === 'object' && change !== null ? (change as Record<string, unknown>) : {};
  const theme = THEMES.find(one => one === given['theme']) ?? base.theme;
  const colourBlind = typeof given['colourBlind'] === 'boolean' ? given['colourBlind'] : base.colourBlind;
  return { theme, colourBlind };
}
