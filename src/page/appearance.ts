import type { Viewer } from '../viewer';
import { postQuietly } from './dom';

/** Puts the person's theme on the root, where the tokens read it. */
export function showTheme(theme: Viewer['theme']): void {
  document.documentElement.dataset['theme'] = theme;
}

/** The person's theme, shown; the default when the server cannot say. */
export async function loadViewer(): Promise<Viewer['theme']> {
  try {
    const answer = await fetch('data/viewer.json');
    if (answer.ok) {
      const { theme } = (await answer.json()) as Viewer;
      showTheme(theme);
      return theme;
    }
  } catch {
    // The page says the server is gone once it polls.
  }
  return 'system';
}

export function chooseTheme(theme: Viewer['theme']): void {
  showTheme(theme);
  void postQuietly('viewer', { theme });
}
