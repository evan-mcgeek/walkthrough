// JSON files on disk: read without throwing, written whole or not at all, readable by the user alone.
import fs from 'node:fs';
import path from 'node:path';

/** The file's content, or `fallback` when it is missing or not JSON. */
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

const held = new Set<string>();
/** Runs `work` while no other process does so for `file`: one read-change-write at a time. Taken again inside, it is held already. */
export function locked<T>(file: string, work: () => T): T {
  const lock = `${file}.lock`;
  if (held.has(lock)) return work();
  fs.mkdirSync(path.dirname(file), { recursive: true, mode: 0o700 });
  for (;;) {
    try {
      fs.mkdirSync(lock);
      break;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error;
      // A lock left by a process that died is taken over.
      const age = Date.now() - (fs.statSync(lock, { throwIfNoEntry: false })?.mtimeMs ?? 0);
      if (age > 5000) fs.rmSync(lock, { recursive: true, force: true });
      else Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 10);
    }
  }
  held.add(lock);
  try {
    return work();
  } finally {
    held.delete(lock);
    fs.rmSync(lock, { recursive: true, force: true });
  }
}
