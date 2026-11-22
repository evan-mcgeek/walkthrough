import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, test } from 'vitest';
import { locked } from '../src/json-files';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const folder = () => fs.mkdtempSync(path.join(process.env['WALKTHROUGH_TEST_SANDBOX'] ?? '', 'lock-'));

describe('locked', () => {
  test('a lock held longer than the stale window is not taken from its holder', async () => {
    const file = path.join(folder(), 'state.json');
    const order: string[] = [];
    const first = locked(file, async () => {
      order.push('first in');
      await sleep(12_000);
      order.push('first out');
    });
    await sleep(100);

    await locked(file, () => {
      order.push('second in');
    });
    await first;

    expect(order).toEqual(['first in', 'first out', 'second in']);
  }, 30_000);

  test('a lock left by a process that died is taken over', async () => {
    const file = path.join(folder(), 'state.json');
    fs.mkdirSync(`${file}.lock`);
    const longAgo = new Date(Date.now() - 60_000);
    fs.utimesSync(`${file}.lock`, longAgo, longAgo);

    expect(await locked(file, () => 'in')).toBe('in');
  });
});
