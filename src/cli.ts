import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import { parseArgs } from 'node:util';
import { currentBranch, currentChange } from './change';
import { prune, pruneDaily } from './prune';
import { ensureServer, serve, serverRunning, stopServer } from './server';
import { listen, say } from './session';
import { buildSteps, changeFiles, parseSteps } from './steps';
import { openWalkthrough, readWalkthrough, recordSteps, type Walkthrough, walkthroughDir } from './walkthrough';

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

/** The current branch's walkthrough and its folder; it must have been started. */
function current(): { dir: string; walkthrough: Walkthrough } {
  const branch = currentBranch(process.cwd());
  const dir = walkthroughDir(branch);
  const walkthrough = readWalkthrough(dir);
  if (!walkthrough) throw new Error(`there is no walkthrough of ${branch.branch}; run walkthrough start`);
  return { dir, walkthrough };
}

function files(): void {
  const { files: changed, mechanical } = changeFiles(current().walkthrough, process.cwd());
  const lines = ['Group these files into steps:'];
  for (const { path } of changed) if (!mechanical.has(path)) lines.push(`  ${path}`);
  if (mechanical.size > 0) lines.push('Mechanical, collapsed into the last step by walkthrough itself:');
  for (const [path, reason] of mechanical) lines.push(`  ${path} (${reason})`);
  console.log(lines.join('\n'));
}

function steps(): void {
  const cwd = process.cwd();
  const inputs = parseSteps(fs.readFileSync(0, 'utf8'));
  const { steps: recorded } = recordSteps(walkthroughDir(currentBranch(cwd)), walkthrough =>
    buildSteps(cwd, walkthrough, inputs),
  );
  const mechanical = recorded.at(-1);
  if (mechanical?.kind !== 'mechanical') {
    console.log(`Recorded ${plural(recorded.length, 'step')}.`);
    return;
  }
  console.log(
    `Recorded ${plural(recorded.length, 'step')}, the last one mechanical with ${plural(mechanical.files.length, 'file')}.`,
  );
  for (const problem of mechanical.problems) console.log(`Consistency problem: ${problem}`);
}

async function listenCommand(): Promise<void> {
  const { dir } = current();
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
  say(current().dir, text, values);
  console.log('Said on the page.');
}

const COMMANDS: Record<string, (args: string[]) => Promise<void> | void> = {
  start,
  files,
  // The skill's steps, as a JSON array on standard input.
  steps,
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
  if (!command)
    throw new Error(
      'usage: walkthrough start [--target <branch>] | files | steps < steps.json | listen | say [--answer <id>] [--question] <text> | stop | prune',
    );
  await command(rest);
} catch (error) {
  console.error(`walkthrough: ${(error as Error).message}`);
  process.exitCode = 1;
}
