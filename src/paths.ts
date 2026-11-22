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
