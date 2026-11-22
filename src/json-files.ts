// JSON files on disk: read without throwing, written whole or not at all, readable by the user alone.
import fs from 'node:fs';
import path from 'node:path';
import { lock } from 'proper-lockfile';

export function readJson<T>(file: string, fallback: T): T {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8').replace(/^﻿/, '')) as T;
  } catch {
    return fallback;
  }
}

/** Written beside the file and moved into place, so a reader never sees half of it. */
export function writeJson(file: string, value: unknown): void {
  fs.mkdirSync(path.dirname(file), { recursive: true, mode: 0o700 });
  const beside = `${file}.${String(process.pid)}.tmp`;
  fs.writeFileSync(beside, `${JSON.stringify(value, null, 2)}\n`, { mode: 0o600 });
  fs.renameSync(beside, file);
}

/** Runs `work` while no other process does so for `file`: one read-change-write at a time; never taken again inside `work`. */
export async function locked<T>(file: string, work: () => T | Promise<T>): Promise<T> {
  fs.mkdirSync(path.dirname(file), { recursive: true, mode: 0o700 });
  // The lock is refreshed while held, so only a lock whose holder died goes stale.
  const release = await lock(file, { realpath: false, retries: { forever: true, minTimeout: 10, maxTimeout: 100 } });
  try {
    return await work();
  } finally {
    await release();
  }
}
