import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, test } from 'vitest';
import { readViewer, saveViewer } from '../src/server';

const file = () => path.join(fs.mkdtempSync(path.join(process.env['WALKTHROUGH_TEST_SANDBOX'] ?? '', 'viewer-')), 'viewer.json');
const QUEUE_ONLY = { queue: true, checklist: false, explanation: false };

describe('the viewer settings', () => {
  test('are the defaults until the person chooses: Ultramarine, the system theme and the queue alone', () => {
    expect(readViewer(file())).toEqual({ accent: 'ultramarine', theme: 'system', panels: QUEUE_ONLY });
  });

  test('keep what the person chose, one setting or panel at a time', () => {
    const saved = file();
    saveViewer({ accent: 'berry' }, saved);
    saveViewer({ theme: 'dark' }, saved);
    saveViewer({ panels: { queue: false } }, saved);
    saveViewer({ panels: { checklist: true } }, saved);

    expect(readViewer(saved)).toEqual({
      accent: 'berry',
      theme: 'dark',
      panels: { queue: false, checklist: true, explanation: false },
    });
  });

  test('ignore what they do not know and fall back for a garbled file', () => {
    const saved = file();
    saveViewer({ accent: 'lime', theme: 'light', panels: { checklist: 'yes', side: true }, extra: 1 }, saved);
    expect(readViewer(saved)).toEqual({ accent: 'ultramarine', theme: 'light', panels: QUEUE_ONLY });

    fs.writeFileSync(saved, '{ not json');
    expect(readViewer(saved)).toEqual({ accent: 'ultramarine', theme: 'system', panels: QUEUE_ONLY });
    fs.writeFileSync(saved, JSON.stringify({ accent: 'petrol', theme: 7, panels: [true] }));
    expect(readViewer(saved)).toEqual({ accent: 'petrol', theme: 'system', panels: QUEUE_ONLY });
  });

  test('ignore the tool panel an older file still names, and drop it on the next save', () => {
    const saved = file();
    fs.writeFileSync(saved, JSON.stringify({ accent: 'berry', theme: 'dark', panels: { queue: false, checklist: true, explanation: false, tools: true } }));
    expect(readViewer(saved)).toEqual({ accent: 'berry', theme: 'dark', panels: { queue: false, checklist: true, explanation: false } });

    saveViewer({ panels: { explanation: true } }, saved);
    expect(JSON.parse(fs.readFileSync(saved, 'utf8'))).toEqual({ accent: 'berry', theme: 'dark', panels: { queue: false, checklist: true, explanation: true } });
  });
});
