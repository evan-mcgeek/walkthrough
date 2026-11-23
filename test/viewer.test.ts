import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, test } from 'vitest';
import { readViewer, saveViewer } from '../src/server';

const file = () => path.join(fs.mkdtempSync(path.join(process.env['WALKTHROUGH_TEST_SANDBOX'] ?? '', 'viewer-')), 'viewer.json');

describe('the viewer settings', () => {
  test('are the defaults until the person chooses', () => {
    expect(readViewer(file())).toEqual({ accent: 'ultramarine', theme: 'system' });
  });

  test('keep what the person chose, one setting at a time', () => {
    const saved = file();
    saveViewer({ accent: 'berry' }, saved);
    saveViewer({ theme: 'dark' }, saved);

    expect(readViewer(saved)).toEqual({ accent: 'berry', theme: 'dark' });
  });

  test('ignore what they do not know and fall back for a garbled file', () => {
    const saved = file();
    saveViewer({ accent: 'lime', theme: 'light', extra: 1 }, saved);
    expect(readViewer(saved)).toEqual({ accent: 'ultramarine', theme: 'light' });

    fs.writeFileSync(saved, '{ not json');
    expect(readViewer(saved)).toEqual({ accent: 'ultramarine', theme: 'system' });
    fs.writeFileSync(saved, JSON.stringify({ accent: 'petrol', theme: 7 }));
    expect(readViewer(saved)).toEqual({ accent: 'petrol', theme: 'system' });
  });
});
