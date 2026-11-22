import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import { parseArgs, type ParseArgsConfig } from 'node:util';
import { changedFiles, changeOf, currentBranch, currentRepo, type Source } from './change';
import { parseChecklist } from './checklist';
import { prune, pruneDaily, pruneOne } from './prune';
import { ensureServer, serve, serverRunning, stopServer } from './server';
import { listen, say } from './session';
import { GUIDE } from './guide';
import { buildSteps, parseSteps } from './steps';
import { nameOf, openWalkthrough, readWalkthrough, recordChecklist, recordSteps, walkthroughDir } from './walkthrough';

const short = (sha: string) => sha.slice(0, 7);
const plural = (count: number, word: string) => `${String(count)} ${word}${count === 1 ? '' : 's'}`;

type Options = NonNullable<ParseArgsConfig['options']>;
const SOURCE_OPTIONS = {
  target: { type: 'string' },
  base: { type: 'string' },
  head: { type: 'string' },
  label: { type: 'string' },
} as const satisfies Options;

/** The command's own arguments, and the walkthrough its source options name, the same way for every command; `branch` stands in for the current one. */
function located<T extends Options>(
  args: string[],
  {
    options = {} as T,
    allowPositionals = false,
    branch,
  }: { options?: T; allowPositionals?: boolean; branch?: string | undefined } = {},
) {
  const parsed = parseArgs({ args, allowPositionals, options: { ...SOURCE_OPTIONS, ...options } });
  const { target, base, head, label } = parsed.values as Partial<Record<keyof typeof SOURCE_OPTIONS, string>>;
  const cwd = process.cwd();
  let source: Source;
  if (base === undefined && head === undefined && label === undefined)
    source = { kind: 'branch', branch: branch ?? currentBranch(cwd), ...(target !== undefined && { target }) };
  else if (!base || !head) throw new Error('--base and --head go together, and --label needs them');
  else if (target !== undefined) throw new Error('--target is for the current branch; a range has its --base');
  else source = { kind: 'range', base, head, label: label ?? `${base}..${head}` };
  return { ...parsed, cwd, source, dir: walkthroughDir(currentRepo(cwd), source) };
}

async function start(args: string[]): Promise<void> {
  const { cwd, source, dir } = located(args);
  const change = changeOf(cwd, source);
  for (const line of await pruneDaily(cwd)) console.log(line);
  const { walkthrough, opened } = openWalkthrough(dir, source, change);
  const { steps } = walkthrough;
  console.log(
    `Walkthrough of ${nameOf(source)} against ${change.target}: ${short(change.base)}..${short(change.head)}, ${plural(steps.length, 'step')}.`,
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

/** As `located`, for a walkthrough that must have been started. */
function current<T extends Options>(args: string[], config: { options?: T; allowPositionals?: boolean } = {}) {
  const found = located(args, config);
  const walkthrough = readWalkthrough(found.dir);
  if (!walkthrough) throw new Error(`there is no walkthrough of ${nameOf(found.source)}; run walkthrough start`);
  return { ...found, walkthrough };
}

function files(args: string[]): void {
  const { base, head } = current(args).walkthrough;
  for (const { path } of changedFiles(process.cwd(), base, head)) console.log(path);
}

function steps(args: string[]): void {
  const { cwd, dir } = located(args);
  const inputs = parseSteps(fs.readFileSync(0, 'utf8'));
  const { steps: recorded } = recordSteps(dir, walkthrough => buildSteps(cwd, walkthrough, inputs));
  const folded = recorded.filter(step => step.kind === 'folded').length;
  console.log(`Recorded ${plural(recorded.length, 'step')}${folded ? `, ${String(folded)} of them folded` : ''}.`);
}

function checklist(args: string[]): void {
  const text = fs.readFileSync(0, 'utf8');
  const { title, items } = recordChecklist(located(args).dir, walkthrough => parseChecklist(text, walkthrough));
  console.log(`Recorded the checklist ${title} with ${plural(items.length, 'item')}.`);
}

async function listenCommand(args: string[]): Promise<void> {
  const { dir } = current(args);
  const taken = await listen(dir, () => serverRunning(dir));
  if (taken === 'replaced') {
    console.error('walkthrough: another walkthrough listen took over; this one gets nothing more.');
    process.exitCode = 3;
  } else if (taken === 'stopped') console.log(JSON.stringify({ kind: 'stopped' }));
  else for (const request of taken) console.log(JSON.stringify(request));
}

function sayCommand(args: string[]): void {
  const { values, positionals, dir } = current(args, {
    options: { answer: { type: 'string' }, question: { type: 'boolean' } },
    allowPositionals: true,
  });
  const text = positionals.join(' ').trim();
  if (!text) throw new Error('usage: walkthrough say [--answer <request id>] [--question] <text>');
  say(dir, text, values);
  console.log('Said on the page.');
}

const COMMANDS: Record<string, (args: string[]) => Promise<void> | void> = {
  start,
  files,
  // The session's steps, as a JSON array on standard input.
  steps,
  // The session's checklist, as a JSON object on standard input.
  checklist,
  guide: () => {
    process.stdout.write(GUIDE);
  },
  listen: listenCommand,
  say: sayCommand,
  stop: async args => {
    const stopped = await stopServer(located(args).dir);
    console.log(stopped ? 'Stopped the walkthrough page.' : 'The walkthrough page was not running.');
  },
  prune: async args => {
    if (args.length === 0) {
      const removed = await prune(process.cwd());
      console.log(removed.length > 0 ? removed.join('\n') : 'No walkthrough to remove.');
      return;
    }
    const { positionals } = parseArgs({ args, allowPositionals: true, options: SOURCE_OPTIONS });
    const { source, dir } = located(args, { allowPositionals: true, branch: positionals[0] });
    if (positionals.length > 0 && source.kind === 'range') throw new Error('name a branch or a range, not both');
    console.log(await pruneOne(dir, nameOf(source)));
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
      'usage: walkthrough <command> [--target <branch> | --base <rev> --head <rev> [--label <text>]]\n' +
        '  commands: start | guide | files | steps < steps.json | checklist < checklist.json | listen\n' +
        '    | say [--answer <id>] [--question] <text> | stop | prune [<branch>]\n' +
        '  every command but guide finds the walkthrough from the options start was given: none for the current branch',
    );
  await command(rest);
} catch (error) {
  console.error(`walkthrough: ${(error as Error).message}`);
  process.exitCode = 1;
}
