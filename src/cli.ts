import { spawnSync } from 'node:child_process';
import { parseArgs } from 'node:util';
import { currentBranch, currentChange } from './change';
import { ensureServer, serve, stopServer } from './server';
import { openWalkthrough, walkthroughDir } from './walkthrough';

const short = (sha: string) => sha.slice(0, 7);
const plural = (count: number, word: string) => `${String(count)} ${word}${count === 1 ? '' : 's'}`;

async function start(args: string[]): Promise<void> {
  const { values } = parseArgs({ args, options: { target: { type: 'string' } } });
  const change = currentChange(process.cwd(), values.target);
  const { dir, walkthrough } = openWalkthrough(change);
  console.log(
    `Walkthrough of ${change.branch} against ${change.target}: ${short(change.base)}..${short(change.head)}, ${plural(walkthrough.steps.length, 'step')}.`,
  );
  if (change.uncommitted > 0)
    console.log(
      `Warning: ${plural(change.uncommitted, 'uncommitted change')} ${change.uncommitted === 1 ? 'is' : 'are'} left out of this walkthrough.`,
    );
  const url = await ensureServer(dir);
  // The address carries the page's token, so it goes to the browser and is not printed.
  const opened = spawnSync(process.platform === 'darwin' ? 'open' : 'xdg-open', [url], { stdio: 'ignore' });
  console.log(
    opened.status === 0
      ? 'The page is open in your browser.'
      : `Could not open a browser; the page address is in ${dir}/server.json.`,
  );
}

const COMMANDS: Record<string, (args: string[]) => Promise<void> | void> = {
  start,
  stop: async () => {
    const stopped = await stopServer(walkthroughDir(currentBranch(process.cwd())));
    console.log(stopped ? 'Stopped the walkthrough page.' : 'The walkthrough page was not running.');
  },
  // The detached page server that start runs.
  serve: ([dir = '']) => {
    serve(dir);
  },
};

const [name = '', ...rest] = process.argv.slice(2);
const command = COMMANDS[name];
try {
  if (!command) throw new Error('usage: walkthrough start [--target <branch>] | stop');
  await command(rest);
} catch (error) {
  console.error(`walkthrough: ${(error as Error).message}`);
  process.exitCode = 1;
}
