import { spawnSync } from 'node:child_process';

export const psStart = (pid: number) =>
  spawnSync('ps', ['-p', String(pid), '-o', 'lstart='], { encoding: 'utf8' }).stdout.trim();

/** A pid can be reused by an unrelated process, so its start time must match too. */
export function alive(record: { pid: number; started: string }): boolean {
  try {
    process.kill(record.pid, 0);
  } catch {
    return false;
  }
  return psStart(record.pid) === record.started;
}
