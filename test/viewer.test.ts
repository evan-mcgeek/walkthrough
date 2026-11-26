import { describe, expect, test } from 'vitest';
import { DEFAULT_VIEWER, mergeViewer } from '../src/viewer';

describe('the viewer settings', () => {
  test('follow the system until the person picks a theme, and ignore what they do not know', () => {
    expect(DEFAULT_VIEWER).toEqual({ theme: 'system', colourBlind: false });
    expect(mergeViewer(DEFAULT_VIEWER, { theme: 'dark' })).toEqual({ theme: 'dark', colourBlind: false });
    expect(mergeViewer({ theme: 'dark', colourBlind: false }, { theme: 'neon', accent: 'berry' })).toEqual({ theme: 'dark', colourBlind: false });
    expect(mergeViewer(DEFAULT_VIEWER, null)).toEqual({ theme: 'system', colourBlind: false });
  });

  test('keep the colour-blind diff apart from the theme', () => {
    const on = mergeViewer({ theme: 'dark', colourBlind: false }, { colourBlind: true });
    expect(on).toEqual({ theme: 'dark', colourBlind: true });
    expect(mergeViewer(on, { theme: 'light' })).toEqual({ theme: 'light', colourBlind: true });
    expect(mergeViewer(on, { colourBlind: 'yes' })).toEqual(on);
  });
});
