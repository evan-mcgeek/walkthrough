import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs, type ParseArgsConfig } from 'node:util';
import { changedFiles, changeOf, currentBranch, currentRepo, type Source } from './change';
import { prune, pruneDaily, pruneOne } from './prune';
import { ensureServer, serve, serverRunning, stopServer } from './server';
import { exportPage } from './export';
import { listView } from './list';
import { GUIDE } from './guide';
import { policyCommand } from './policy';
import { plural } from './words';
import { makeInbox, stateDir } from './paths';
import { readInput } from './input';
import { buildSteps, carrySteps, parseSteps } from './steps';
import { parseComments, parseCriteria, parseThreads } from './record';
import { aiComments, aiResolve, answer, forgetStoppedListener, handedAsk, listen, markPosted, reviewComments, walkthroughView } from './review';
import {
  markOpened,
  markReady,
  nameOf,
  openWalkthrough,
  readWalkthrough,
  recordSteps,
  targetName,
  updateWalkthrough,
  walkthroughDir,
} from './walkthrough';

const short = (sha: string) => sha.slice(0, 7);

type Options = NonNullable<ParseArgsConfig['options']>;
const SOURCE_OPTIONS = {
  target: { type: 'string' },
  base: { type: 'string' },
  head: { type: 'string' },
  label: { type: 'string' },
} as const satisfies Options;

// `branch` stands in for the current branch.
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
  // Two changes fetched to the same name, such as FETCH_HEAD, would otherwise share one walkthrough.
  else if (!label?.trim()) throw new Error('--base and --head need a --label that names the change');
  else source = { kind: 'range', base, head, label };
  return { ...parsed, cwd, source, dir: walkthroughDir(currentRepo(cwd), source) };
}

async function start(args: string[]): Promise<void> {
  const { cwd, source, dir, values } = located(args, { options: { pr: { type: 'string' }, title: { type: 'string' } } });
  const number = values.pr?.trim();
  if (number === '') throw new Error('--pr needs the number of the pull request');
  if (values.title !== undefined && number === undefined) throw new Error('--title goes with --pr');
  const pr = number === undefined ? undefined : { number, title: values.title?.trim() || nameOf(source) };
  const change = await changeOf(cwd, source);
  for (const line of await pruneDaily(cwd)) console.log(line);
  const { walkthrough, opened } = await openWalkthrough(dir, source, change, pr, moved => carrySteps(cwd, moved));
  const inbox = makeInbox(dir);
  const { steps } = walkthrough;
  console.log(
    `Walkthrough of ${nameOf(source)} against ${targetName(change.target)}: ${short(change.base)}..${short(change.head)}, ${plural(steps.length, 'step')}.`,
  );
  if (opened === 'resumed') {
    const line = reviewedLine(dir);
    if (line) console.log(line);
  }
  if (opened === 'moved' && steps.length > 0) {
    console.log(`The head moved: ${plural(steps.length, 'step')} kept their files that still change.`);
    const left = walkthrough.unplaced ?? [];
    if (left.length > 0) console.log(`In no step yet: ${left.join(', ')}. Record the steps again with these in new steps.`);
  }
  if (change.uncommitted > 0)
    console.log(
      `Warning: ${plural(change.uncommitted, 'uncommitted change')} ${change.uncommitted === 1 ? 'is' : 'are'} left out of this walkthrough.`,
    );
  console.log(`Write what you record to files in ${inbox} and pass each with --file.`);
  // A listen left from before is not this session's, which the page waits for until it is ready.
  if (walkthrough.ready === false) await forgetStoppedListener(dir);
  await ensureServer(dir);
  console.log('The page is not open yet; walkthrough open opens it.');
}

/** What a ready walkthrough at this head already holds, so the session reopens it rather than reviews it again. */
function reviewedLine(dir: string): string | undefined {
  const view = walkthroughView(dir);
  if (!view?.ready) return undefined;
  const { submitted } = view;
  const pending = view.threads.flatMap(thread => thread.comments).filter(one => one.pending).length;
  const where = submitted ? (view.pr ? 'in the submitted review' : 'sent to the agent') : 'pending';
  return `Already reviewed at this head: ${plural(submitted ? submitted.comments : pending, 'comment')} ${where}.`;
}

async function openCommand(args: string[]): Promise<void> {
  const { dir } = current(args);
  await markOpened(dir);
  openPage(await ensureServer(dir), 'The page', dir);
}

async function ready(args: string[]): Promise<void> {
  const { dir } = current(args);
  const opened = await markReady(dir);
  console.log('The walkthrough is ready; the page shows it whole.');
  if (!opened) openPage(await ensureServer(dir), 'The page', dir);
}

// The address carries the page's token, so it goes to the browser and is not printed.
function openPage(url: string, what: string, dir: string): void {
  const browser = spawnSync(process.platform === 'darwin' ? 'open' : 'xdg-open', [url], { stdio: 'ignore' });
  console.log(
    browser.status === 0
      ? `${what} is open in your browser.`
      : `Could not open a browser; the address of ${what.toLowerCase()} is in ${dir}/server.json.`,
  );
}

const repoDir = () => path.join(stateDir(), currentRepo(process.cwd()));

async function list(args: string[]): Promise<void> {
  parseArgs({ args, options: {} });
  openPage(await ensureServer(repoDir(), true), 'The list of walkthroughs', repoDir());
}

function current<T extends Options>(args: string[], config: { options?: T; allowPositionals?: boolean } = {}) {
  const found = located(args, config);
  const walkthrough = readWalkthrough(found.dir);
  if (!walkthrough) throw new Error(`there is no walkthrough of ${nameOf(found.source)}; run walkthrough start`);
  return { ...found, walkthrough };
}

async function files(args: string[]): Promise<void> {
  const { base, head } = current(args).walkthrough;
  for (const { path } of await changedFiles(process.cwd(), base, head)) console.log(path);
}

const FILE_OPTION = { options: { file: { type: 'string' } } } as const;

async function steps(args: string[]): Promise<void> {
  const { cwd, dir, values } = located(args, FILE_OPTION);
  const inputs = parseSteps(readInput(values.file));
  const { steps: recorded } = await recordSteps(dir, walkthrough => buildSteps(cwd, dir, walkthrough, inputs));
  console.log(`Recorded ${plural(recorded.length, 'step')}: ${recorded.map(step => `${step.id} (${step.title})`).join(', ')}.`);
}

async function commentCommand(args: string[]): Promise<void> {
  const { dir, walkthrough, values } = current(args, FILE_OPTION);
  const recorded = await aiComments(dir, parseComments(readInput(values.file), walkthrough));
  console.log(`Recorded ${plural(recorded.length, 'comment')}${recorded.length ? `: ${recorded.map(one => one.id).join(', ')}` : ''}.`);
}

async function threads(args: string[]): Promise<void> {
  const { dir, values } = located(args, FILE_OPTION);
  const text = readInput(values.file);
  const recorded = await updateWalkthrough(dir, walkthrough => (walkthrough.threads = parseThreads(text, walkthrough)));
  console.log(`Recorded ${plural(recorded.length, 'thread')}.`);
}

async function criteria(args: string[]): Promise<void> {
  const { dir, values } = located(args, FILE_OPTION);
  const recorded = parseCriteria(readInput(values.file));
  await updateWalkthrough(dir, walkthrough => {
    walkthrough.criteria = recorded;
  });
  console.log(`Recorded ${String(recorded.length)} ${recorded.length === 1 ? 'criterion' : 'criteria'}.`);
}

function comments(args: string[]): void {
  const { dir, values } = current(args, { options: { all: { type: 'boolean' } } });
  for (const line of reviewComments(dir, values.all)) console.log(JSON.stringify(line));
}

async function resolveCommand(args: string[]): Promise<void> {
  const { dir, positionals } = current(args, { allowPositionals: true });
  const [id] = positionals;
  if (positionals.length !== 1 || !id) throw new Error('usage: walkthrough resolve <comment id>');
  await aiResolve(dir, id);
  console.log(`Resolved the thread of comment ${id}.`);
}

async function posted(args: string[]): Promise<void> {
  const { dir, values } = current(args, { options: { address: { type: 'string' } } });
  const address = values.address?.trim();
  if (address !== undefined && !/^https?:\/\//.test(address)) throw new Error('--address must be a web address');
  await markPosted(dir, address);
  console.log(address ? `Recorded that the review went to ${address}.` : 'Recorded that the review went out.');
}

function exportCommand(args: string[]): void {
  const { values, dir, walkthrough } = current(args, { options: { out: { type: 'string' } } });
  const out = path.resolve(values.out ?? path.join(dir, 'export.html'));
  fs.writeFileSync(out, exportPage(dir));
  console.log(`Exported the walkthrough of ${nameOf(walkthrough)} to ${out}.`);
}

async function listenCommand(args: string[]): Promise<void> {
  const { dir } = current(args);
  const taken = await listen(dir, () => serverRunning(dir));
  if (taken === 'replaced') {
    console.error('walkthrough: another walkthrough listen took over; this one gets nothing more.');
    process.exitCode = 3;
  } else if (taken === 'stopped') console.log(JSON.stringify({ kind: 'stopped' }));
  else
    for (const event of taken)
      console.log(
        JSON.stringify(
          event.kind === 'ask' ? handedAsk(dir, event) : event.kind === 'submit' ? { kind: 'submit', id: event.id, type: event.type, summary: event.summary } : event,
        ),
      );
}

async function sayCommand(args: string[]): Promise<void> {
  const { values, positionals, dir } = current(args, {
    options: { answer: { type: 'string' }, file: { type: 'string' } },
    allowPositionals: true,
  });
  if (values.file !== undefined && positionals.length > 0) throw new Error('say takes its text or a --file, not both');
  const text = (values.file === undefined ? positionals.join(' ') : readInput(values.file)).trim();
  if (!text || values.answer === undefined) throw new Error('usage: walkthrough say --answer <ask id> (<text> | --file <file>)');
  await answer(dir, values.answer, text);
  console.log('Answered on the page.');
}

const COMMANDS: Record<string, (args: string[]) => Promise<void> | void> = {
  start,
  files,
  steps,
  open: openCommand,
  ready,
  comment: commentCommand,
  threads,
  criteria,
  comments,
  resolve: resolveCommand,
  posted,
  list,
  export: exportCommand,
  guide: () => {
    process.stdout.write(GUIDE);
  },
  listen: listenCommand,
  policy: policyCommand,
  say: sayCommand,
  stop: async args => {
    if (args.includes('--list')) {
      parseArgs({ args, options: { list: { type: 'boolean' } } });
      const stopped = await stopServer(repoDir());
      console.log(stopped ? 'Stopped the list of walkthroughs.' : 'The list of walkthroughs was not running.');
      return;
    }
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
    const listed = readWalkthrough(dir) ? undefined : listView(repoDir()).find(one => one.id === positionals[0] || decodeURIComponent(one.id) === positionals[0]);
    console.log(await (listed ? pruneOne(path.join(repoDir(), listed.id), listed.name) : pruneOne(dir, nameOf(source))));
  },
  // The detached page server that start runs.
  serve: ([dir = '', mode]) => {
    serve(dir, mode === '--list');
  },
};

const [name = '', ...rest] = process.argv.slice(2);
const command = COMMANDS[name];
try {
  if (!command)
    throw new Error(
      'usage: walkthrough <command> [--target <branch> | --base <rev> --head <rev> --label <text>]\n' +
        '  commands: start [--pr <number> [--title <text>]] | guide | files | steps --file <file> | open | ready\n' +
        '    | comment --file <file> | threads --file <file> | criteria --file <file> | listen | say --answer <id> (<text> | --file <file>)\n' +
        '    | comments | resolve <comment id> | posted [--address <url>] | stop | prune [<branch> | <id>] | export [--out <file>] | list | stop --list\n' +
        '    | policy [show | init | save --file <file>]\n' +
        '  every command but guide, list and policy finds the walkthrough from the options start was given: none for the current branch',
    );
  await command(rest);
} catch (error) {
  console.error(`walkthrough: ${(error as Error).message}`);
  process.exitCode = 1;
}
