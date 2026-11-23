import type { Viewer } from '../viewer';
import { el, openDialog, postQuietly, radioGroup } from './dom';

/** Puts the person's accent and theme on the root, where the tokens read them. */
export function showViewer(viewer: Partial<Viewer>): void {
  Object.assign(document.documentElement.dataset, viewer);
}

/** The person's settings, or none when the server cannot say, which leaves the defaults the stylesheet starts with. */
export async function loadViewer(): Promise<void> {
  try {
    const answer = await fetch('data/viewer.json');
    if (answer.ok) showViewer((await answer.json()) as Viewer);
  } catch {
    // The page says the server is gone once it polls.
  }
}

const shown = (setting: keyof Viewer, fallback: string) => document.documentElement.dataset[setting] ?? fallback;

function choose(change: Partial<Viewer>): void {
  showViewer(change);
  void postQuietly('viewer', change);
}

export function appearanceDialog(returnTo: () => Element | null): HTMLDialogElement {
  const label = (text: string) => el('p', { className: 'popover-label' }, text);
  const accents = radioGroup(
    'Accent',
    [['ultramarine', 'Ultramarine (default)'], ['petrol', 'Petrol'], ['berry', 'Berry']],
    shown('accent', 'ultramarine') as Viewer['accent'],
    accent => {
      choose({ accent });
    },
  );
  accents.classList.add('accents');
  for (const radio of accents.children) radio.prepend(el('span', { className: `swatch ${(radio as HTMLElement).dataset['value'] ?? ''}` }));
  const themes = radioGroup(
    'Theme',
    [['system', 'System'], ['light', 'Light'], ['dark', 'Dark']],
    shown('theme', 'system') as Viewer['theme'],
    theme => {
      choose({ theme });
    },
  );
  themes.classList.add('options');
  const dialog = openDialog(
    'Appearance',
    returnTo,
    label('Accent'),
    accents,
    label('Theme'),
    themes,
    el('p', { className: 'hint' }, 'Saved for you on this machine.'),
  );
  dialog.classList.add('appearance');
  return dialog;
}
