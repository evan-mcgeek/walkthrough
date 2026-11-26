import { DEFAULT_VIEWER, type Viewer } from '../viewer';
import { postQuietly } from './dom';

/** Puts the person's settings on the root, where the tokens read them. */
function showViewer({ theme, colourBlind }: Viewer): void {
  const root = document.documentElement;
  root.dataset['theme'] = theme;
  root.toggleAttribute('data-colour-blind', colourBlind);
}

/** The person's settings, shown; the defaults when the server cannot say. */
export async function loadViewer(): Promise<Viewer> {
  try {
    const answer = await fetch('data/viewer.json');
    if (answer.ok) {
      const viewer = (await answer.json()) as Viewer;
      showViewer(viewer);
      return viewer;
    }
  } catch {
    // The page says the server is gone once it polls.
  }
  return { ...DEFAULT_VIEWER };
}

/** Shows and keeps the changed settings; the server merges them into what it stores. */
export function chooseViewer(viewer: Viewer, change: Partial<Viewer>): Viewer {
  const chosen = { ...viewer, ...change };
  showViewer(chosen);
  void postQuietly('viewer', change);
  return chosen;
}
