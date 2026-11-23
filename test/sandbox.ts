// Imported by both test configs, so it runs once in the runner's main process and every worker inherits the sandbox.
// HOME and the walkthrough folders point into a temp folder, so no test touches real state.
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { alive } from '../src/processes';
import { shareHistory } from './helpers';

function serverRecords(sandbox: string): string[] {
  try {
    return fs
      .readdirSync(sandbox, { recursive: true, encoding: 'utf8' })
      .filter(found => path.basename(found) === 'server.json')
      .map(found => path.join(sandbox, found));
  } catch {
    return [];
  }
}

if (!process.env['WALKTHROUGH_TEST_SANDBOX']) {
  // Tests run the built plugin, so even a run of one file tests the source as it is now.
  execFileSync(process.execPath, [path.resolve(import.meta.dirname, '..', 'scripts', 'build.mjs')], { stdio: 'inherit' });
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
    // A test that failed before its teardown leaves its page server up for the idle timeout.
    for (const found of serverRecords(sandbox))
      try {
        const record = JSON.parse(fs.readFileSync(found, 'utf8')) as { pid: number; started: string };
        if (alive(record)) process.kill(record.pid, 'SIGTERM');
      } catch {
        // A record gone or half written has no server to stop.
      }
    try {
      // macOS gives the Documents, Downloads and Library folders it creates in a home an "everyone deny delete" ACL.
      if (process.platform === 'darwin') spawnSync('chmod', ['-R', '-N', home]);
      fs.rmSync(sandbox, { recursive: true, force: true, maxRetries: 5 });
    } catch (error) {
      console.error(`could not remove the test sandbox: ${String(error)}`);
    }
  });
  // A signal no runner handles ends the process without 'exit'; Playwright handles neither.
  for (const signal of ['SIGTERM', 'SIGHUP'] as const)
    process.once(signal, () => {
      if (!process.listenerCount(signal)) process.exit(128 + os.constants.signals[signal]);
    });
  // Its git runs also have xcrun look git up for the new HOME once here, not in every worker at once, which timed out under load.
  shareHistory();
}
