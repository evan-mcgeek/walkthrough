import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import { parseArgs } from 'node:util';
import { currentBranch, currentChange } from './change';
import { ensureServer, serve, stopServer } from './server';
import { buildSteps, changeFiles, parseSteps } from './steps';
import { openWalkthrough, readWalkthrough, recordSteps, type Walkthrough, walkthroughDir } from './walkthrough';

const short = (sha: string) => sha.slice(0, 7);
const plural = (count: number, word: string) => `${String(count)} ${word}${count === 1 ? '' : 's'}`;

async function start(args: string[]): Promise<void> {
  const { values } = parseArgs({ args, options: { target: { type: 'string' } } });
  const change = currentChange(process.cwd(), values.target);
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

function savedWalkthrough(cwd: string): Walkthrough {
  const saved = readWalkthrough(walkthroughDir(currentBranch(cwd)));
  if (!saved) throw new Error('there is no walkthrough of this branch yet; run walkthrough start first');
  return saved;
}

function files(): void {
  const cwd = process.cwd();
  const { files: changed, mechanical } = changeFiles(savedWalkthrough(cwd), cwd);
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

const COMMANDS: Record<string, (args: string[]) => Promise<void> | void> = {
  start,
  files,
  // The skill's steps, as a JSON array on standard input.
  steps,
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
  if (!command) throw new Error('usage: walkthrough start [--target <branch>] | files | steps < steps.json | stop');
  await command(rest);
} catch (error) {
  console.error(`walkthrough: ${(error as Error).message}`);
  process.exitCode = 1;
}
