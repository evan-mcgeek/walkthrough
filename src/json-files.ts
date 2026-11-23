// JSON files on disk: written whole or not at all, readable by the user alone.
import fs from 'node:fs';
import path from 'node:path';
import { lock } from 'proper-lockfile';

export function readJson<T>(file: string, fallback: T): T {
  try {
    return (readSavedJson(file) as T | undefined) ?? fallback;
  } catch {
    return fallback;
  }
}

/** Undefined when there is no such file; a file there that cannot be read throws, so it is never taken for none. */
export function readSavedJson(file: string): unknown {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return undefined;
    throw new Error(`cannot read ${file}: ${(error as Error).message}`);
  }
}

/** Written beside the file, flushed, and moved into place, so neither a reader nor a crash leaves half of it. */
export function writeJson(file: string, value: unknown): void {
  fs.mkdirSync(path.dirname(file), { recursive: true, mode: 0o700 });
  const beside = `${file}.${String(process.pid)}.tmp`;
  const fd = fs.openSync(beside, 'w', 0o600);
  try {
    fs.writeFileSync(fd, `${JSON.stringify(value, null, 2)}\n`);
    fs.fsyncSync(fd);
  } finally {
    fs.closeSync(fd);
  }
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
