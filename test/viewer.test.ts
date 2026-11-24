import { describe, expect, test } from 'vitest';
import { DEFAULT_VIEWER, mergeViewer } from '../src/viewer';

describe('the viewer settings', () => {
  test('follow the system until the person picks a theme, and ignore what they do not know', () => {
    expect(DEFAULT_VIEWER).toEqual({ theme: 'system' });
    expect(mergeViewer(DEFAULT_VIEWER, { theme: 'dark' })).toEqual({ theme: 'dark' });
    expect(mergeViewer({ theme: 'dark' }, { theme: 'neon', accent: 'berry' })).toEqual({ theme: 'dark' });
    expect(mergeViewer(DEFAULT_VIEWER, null)).toEqual({ theme: 'system' });
  });
});
