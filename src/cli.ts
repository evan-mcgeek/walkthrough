import { spawnSync } from 'node:child_process';
import { parseArgs } from 'node:util';
import { currentBranch, currentChange } from './change';
import { prune, pruneDaily } from './prune';
import { ensureServer, serve, serverRunning, stopServer } from './server';
import { listen, say } from './session';
import { openWalkthrough, readWalkthrough, walkthroughDir } from './walkthrough';

const short = (sha: string) => sha.slice(0, 7);
const plural = (count: number, word: string) => `${String(count)} ${word}${count === 1 ? '' : 's'}`;

async function start(args: string[]): Promise<void> {
  const { values } = parseArgs({ args, options: { target: { type: 'string' } } });
  const change = currentChange(process.cwd(), values.target);
  for (const line of await pruneDaily(process.cwd())) console.log(line);
  const { dir, walkthrough, opened } = openWalkthrough(change);
  const { steps } = walkthrough;
  console.log(
    `Walkthrough of ${change.branch} against ${change.target}: ${short(change.base)}..${short(change.head)}, ${plural(steps.length, 'step')}.`,
  );
  if (opened === 'resumed')
    console.log(
      `Resumed: ${String(steps.filter(step => step.decision).length)} of ${plural(steps.length, 'step')} decided.`,
    );
  if (opened === 'replaced') console.log('The head moved since the last walkthrough, so it starts over.');
  if (change.uncommitted > 0)
    console.log(
      `Warning: ${plural(change.uncommitted, 'uncommitted change')} ${change.uncommitted === 1 ? 'is' : 'are'} left out of this walkthrough.`,
    );
  const url = await ensureServer(dir);
  // The address carries the page's token, so it goes to the browser and is not printed.
  const browser = spawnSync(process.platform === 'darwin' ? 'open' : 'xdg-open', [url], { stdio: 'ignore' });
  console.log(
    browser.status === 0
      ? 'The page is open in your browser.'
      : `Could not open a browser; the page address is in ${dir}/server.json.`,
  );
}

/** The folder of the current branch's walkthrough, which must have been started. */
function currentDir(): string {
  const current = currentBranch(process.cwd());
  const dir = walkthroughDir(current);
  if (!readWalkthrough(dir)) throw new Error(`there is no walkthrough of ${current.branch}; run walkthrough start`);
  return dir;
}

async function listenCommand(): Promise<void> {
  const dir = currentDir();
  const taken = await listen(dir, () => serverRunning(dir));
  if (taken === 'replaced') {
    console.error('walkthrough: another walkthrough listen took over; this one gets nothing more.');
    process.exitCode = 3;
  } else if (taken === 'stopped') console.log(JSON.stringify({ kind: 'stopped' }));
  else for (const request of taken) console.log(JSON.stringify(request));
}

function sayCommand(args: string[]): void {
  const { values, positionals } = parseArgs({
    args,
    allowPositionals: true,
    options: { answer: { type: 'string' }, question: { type: 'boolean' } },
  });
  const text = positionals.join(' ').trim();
  if (!text) throw new Error('usage: walkthrough say [--answer <request id>] [--question] <text>');
  say(currentDir(), text, values);
  console.log('Said on the page.');
}

const COMMANDS: Record<string, (args: string[]) => Promise<void> | void> = {
  start,
  listen: listenCommand,
  say: sayCommand,
  stop: async () => {
    const stopped = await stopServer(walkthroughDir(currentBranch(process.cwd())));
    console.log(stopped ? 'Stopped the walkthrough page.' : 'The walkthrough page was not running.');
  },
  prune: async () => {
    const removed = await prune(process.cwd());
    console.log(removed.length > 0 ? removed.join('\n') : 'No walkthrough to remove.');
  },
  // The detached page server that start runs.
  serve: ([dir = '']) => {
    serve(dir);
  },
};

const [name = '', ...rest] = process.argv.slice(2);
const command = COMMANDS[name];
try {
  if (!command) throw new Error('usage: walkthrough start [--target <branch>] | listen | say [--answer <id>] [--question] <text> | stop | prune');
  await command(rest);
} catch (error) {
  console.error(`walkthrough: ${(error as Error).message}`);
  process.exitCode = 1;
}
