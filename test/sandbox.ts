// Loaded first by every test run: HOME and the walkthrough folders point into a temp folder, so no test touches real state.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

if (!process.env['WALKTHROUGH_TEST_SANDBOX']) {
  const realHome = os.homedir();
  const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), 'walkthrough-test-'));
  const home = path.join(sandbox, 'home');
  fs.mkdirSync(home);
  // Browsers stay where Playwright installed them under the real home.
  process.env['PLAYWRIGHT_BROWSERS_PATH'] ||= path.join(
    realHome,
    process.platform === 'darwin' ? 'Library/Caches' : '.cache',
    'ms-playwright',
  );
  Object.assign(process.env, {
    WALKTHROUGH_TEST_SANDBOX: sandbox,
    HOME: home,
    // macOS 27 refuses Playwright's Firefox the real app-data folder (microsoft/playwright#42768).
    CFFIXED_USER_HOME: home,
    XDG_STATE_HOME: path.join(home, '.local', 'state'),
    XDG_CONFIG_HOME: path.join(home, '.config'),
    WALKTHROUGH_STATE: path.join(sandbox, 'state'),
  });
  process.on('exit', () => {
    fs.rmSync(sandbox, { recursive: true, force: true });
  });
}
