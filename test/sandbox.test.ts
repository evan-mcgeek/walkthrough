import fs from 'node:fs';
import path from 'node:path';
import { expect, test } from 'vitest';
import { serverRecords } from './sandbox';

test('the sandbox finds the server records in every state folder, past a folder it cannot read', () => {
  const sandbox = fs.mkdtempSync(path.join(process.env['WALKTHROUGH_TEST_SANDBOX'] ?? '', 'records-'));
  const record = (...at: string[]) => {
    const file = path.join(sandbox, ...at, 'server.json');
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, '{}');
    return file;
  };
  const shared = record('state', 'shop-12345678', 'branch-feature%2Flogin');
  const list = record('repo-a', 'state', 'shop-12345678');
  const locked = [path.join(sandbox, 'home', 'Library'), path.join(sandbox, 'state', 'locked')];
  for (const folder of locked) {
    fs.mkdirSync(folder, { recursive: true });
    fs.chmodSync(folder, 0o000);
  }
  try {
    expect(serverRecords(sandbox).sort()).toEqual([shared, list].sort());
  } finally {
    for (const folder of locked) fs.chmodSync(folder, 0o700);
  }
});
