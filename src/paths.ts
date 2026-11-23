import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

// Under test, the user's own state is refused: a test that reaches it fails instead of changing it.
const outsideOwn = (dir: string): string => {
  if (!process.env['WALKTHROUGH_TEST_SANDBOX']) return dir;
  const own = path.join(os.userInfo().homedir, '.local', 'state', 'walkthrough');
  const full = path.resolve(dir);
  if (full === own || full.startsWith(own + path.sep)) throw new Error(`a test reached ${full}; tests keep to their sandbox`);
  return dir;
};

export const stateDir = () =>
  outsideOwn(
    process.env['WALKTHROUGH_STATE'] ||
      path.join(process.env['XDG_STATE_HOME'] || path.join(os.homedir(), '.local', 'state'), 'walkthrough'),
  );

// The session writes what it records to files in an inbox, which the plugin's hook lets it write without a prompt.
const INBOX = 'inbox';

export function makeInbox(dir: string): string {
  const inbox = path.join(dir, INBOX);
  fs.mkdirSync(inbox, { recursive: true, mode: 0o700 });
  return inbox;
}

// A folder that is in the state once links are followed.
export function inState(dir: string): boolean {
  try {
    return fs.realpathSync(dir).startsWith(fs.realpathSync(stateDir()) + path.sep);
  } catch {
    return false;
  }
}

// A file directly in a folder named inbox under the state, not a link out of it.
export function inInbox(file: string): boolean {
  const parent = path.dirname(path.resolve(file));
  if (path.basename(parent) !== INBOX || !inState(parent)) return false;
  try {
    const stat = fs.lstatSync(file, { throwIfNoEntry: false });
    return !stat || stat.isFile();
  } catch {
    return false;
  }
}
