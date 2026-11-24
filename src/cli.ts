import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs, type ParseArgsConfig } from 'node:util';
import { changedFiles, changeOf, currentBranch, currentRepo, type Source } from './change';
import { parseChecklist } from './checklist';
import { prune, pruneDaily, pruneOne } from './prune';
import { ensureServer, serve, serverRunning, stopServer } from './server';
import { parseNotes } from './notes';
import { commentsOf } from './comments';
import { conversationOf, listen, markPosted, note, postedOf, say, starting } from './session';
import { type Decision, decisionsOf, parseActions, walkthroughView } from './decisions';
import { exportPage } from './export';
import { listView } from './list';
import { GUIDE } from './guide';
import { policyCommand } from './policy';
import { plural } from './words';
import { nameOf, targetName } from './items';
import { makeInbox, stateDir } from './paths';
import { readInput } from './input';
import { buildSteps, carrySteps, parseSteps } from './steps';
import {
  openWalkthrough,
  readWalkthrough,
  recordActions,
  recordChecking,
  recordChecklist,
  recordSteps,
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
  const { cwd, source, dir, values } = located(args, { options: { kind: { type: 'string' }, comments: { type: 'string' } } });
  const kind = values.kind?.trim();
  if (kind === '') throw new Error('--kind needs a label that names the kind of walkthrough');
  const hint = values.comments?.trim();
  if (hint === '') throw new Error('--comments needs words that say what becomes of the person\'s comments');
  const labelled = { ...(kind !== undefined && { kindLabel: kind }), ...(hint !== undefined && { commentHint: hint }) };
  const change = await changeOf(cwd, source);
  for (const line of await pruneDaily(cwd)) console.log(line);
  const { walkthrough, opened } = await openWalkthrough(dir, source, change, labelled, moved => carrySteps(cwd, moved));
  await starting(dir);
  const inbox = makeInbox(dir);
  const { steps } = walkthrough;
  console.log(
    `Walkthrough of ${nameOf(source)} against ${targetName(change.target)}: ${short(change.base)}..${short(change.head)}, ${plural(steps.length, 'step')}.`,
  );
  const view = walkthroughView(dir);
  const count = (of: Record<string, unknown> = {}) => String(steps.filter(step => of[`step:${step.id}`]).length);
  if (opened === 'resumed') console.log(`Resumed: ${count(view?.decided)} of ${plural(steps.length, 'step')} decided.`);
  if (opened === 'moved' && steps.length > 0) {
    console.log(
      `The head moved: ${count(view?.decided)} of ${plural(steps.length, 'step')} still decided, ${count(view?.reopened)} reopened.`,
    );
    const left = walkthrough.unplaced ?? [];
    if (left.length > 0) console.log(`In no step yet: ${left.join(', ')}. Record the steps again with these in new steps.`);
  }
  if (change.uncommitted > 0)
    console.log(
      `Warning: ${plural(change.uncommitted, 'uncommitted change')} ${change.uncommitted === 1 ? 'is' : 'are'} left out of this walkthrough.`,
    );
  console.log(`Write what you record to files in ${inbox} and pass each with --file.`);
  openPage(await ensureServer(dir), 'The page', dir);
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
  const { steps: recorded } = await recordSteps(dir, walkthrough => buildSteps(cwd, walkthrough, inputs));
  const folded = recorded.filter(step => step.kind === 'folded').length;
  const ids = recorded.map(step => `${step.id} (${step.title})`).join(', ');
  console.log(`Recorded ${plural(recorded.length, 'step')}${folded ? `, ${String(folded)} of them folded` : ''}: ${ids}.`);
}

async function checking(args: string[]): Promise<void> {
  const { dir, positionals } = located(args, { allowPositionals: true });
  const ids = await recordChecking(dir, positionals);
  console.log(ids.length ? `Checking ${plural(ids.length, 'step')}: ${ids.join(', ')}.` : 'Checking no steps.');
}

async function notes(args: string[]): Promise<void> {
  const { dir, walkthrough, values } = current(args, FILE_OPTION);
  const noted = await note(dir, parseNotes(readInput(values.file), walkthrough));
  const list = noted.map(entry => `${entry.id} (${entry.note.label})`).join(', ');
  console.log(`Recorded ${plural(noted.length, 'note')}${noted.length ? `: ${list}` : ''}.`);
}

async function checklist(args: string[]): Promise<void> {
  const { dir, values } = located(args, FILE_OPTION);
  const text = readInput(values.file);
  const { title, items } = await recordChecklist(dir, walkthrough => parseChecklist(text, walkthrough));
  const ids = items.map(item => item.id).join(', ');
  console.log(`Recorded the checklist ${title} with ${plural(items.length, 'item')}${items.length ? `: ${ids}` : ''}.`);
}

async function actions(args: string[]): Promise<void> {
  const { dir, values } = located(args, FILE_OPTION);
  const text = readInput(values.file);
  const recorded = await recordActions(dir, walkthrough => parseActions(text, walkthrough, conversationOf(dir)));
  console.log(`Recorded the actions of ${plural(recorded.length, 'item')}.`);
}

function decisions(args: string[]): void {
  const { dir, walkthrough } = current(args);
  const shown = ({ id, at, action, note, text }: Decision) => ({ id, at, action, note, text });
  for (const { item, decision, reopened } of decisionsOf(walkthrough, conversationOf(dir)))
    console.log(JSON.stringify({ item, decision: decision && shown(decision), ...(reopened && { reopened: shown(reopened) }) }));
}

function comments(args: string[]): void {
  const { dir } = current(args);
  const posted = postedOf(dir);
  for (const { id, step, file, lines, text } of commentsOf(conversationOf(dir)))
    console.log(JSON.stringify({ id, step, file, lines, text, ...(posted.includes(id) && { posted: true }) }));
}

async function posted(args: string[]): Promise<void> {
  const { dir, positionals } = current(args, { allowPositionals: true });
  if (!positionals.length) throw new Error('usage: walkthrough posted <comment id>...');
  await markPosted(dir, positionals);
  console.log(`Marked ${plural(positionals.length, 'comment')} posted.`);
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
  else {
    const conversation = conversationOf(dir);
    // A reply carries its note, so the session need not look it up.
    const about = (to: string) => {
      const noted = conversation.find(entry => entry.id === to && entry.from === 'session' && entry.note);
      return noted?.from === 'session' && noted.note ? { label: noted.note.label, text: noted.text } : undefined;
    };
    for (const request of taken)
      // Fingerprints only match a decision to its item and a question to its lines.
      console.log(
        JSON.stringify({
          ...request,
          on: undefined,
          linesHash: undefined,
          linesText: undefined,
          ...(request.kind === 'reply' && { about: about(request.to) }),
        }),
      );
  }
}

async function sayCommand(args: string[]): Promise<void> {
  const { values, positionals, dir } = current(args, {
    options: {
      answer: { type: 'string' },
      as: { type: 'string' },
      question: { type: 'boolean' },
      choice: { type: 'string', multiple: true },
      file: { type: 'string' },
    },
    allowPositionals: true,
  });
  if (values.file !== undefined && positionals.length > 0) throw new Error('say takes its text or a --file, not both');
  const text = (values.file === undefined ? positionals.join(' ') : readInput(values.file)).trim();
  if (!text)
    throw new Error(
      'usage: walkthrough say [--answer <request id> [--as <label>]] [--question [--choice <answer>]...] (<text> | --file <file>)',
    );
  const said = await say(dir, text, { ...values, label: values.as });
  console.log(said.note ? `Said on the page as note ${said.id} (${said.note.label}).` : 'Said on the page.');
}

const COMMANDS: Record<string, (args: string[]) => Promise<void> | void> = {
  start,
  files,
  steps,
  checking,
  note: notes,
  checklist,
  actions,
  decisions,
  comments,
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
    const listed = readWalkthrough(dir) ? undefined : listView(repoDir()).find(one => one.id === positionals[0]);
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
        '  commands: start [--kind <label>] [--comments <text>] | guide | files | steps --file <file> | checking [<step id>...]\n' +
        '    | checklist --file <file> | note --file <file> | actions --file <file> | decisions | comments | posted <comment id>... | listen\n' +
        '    | say [--answer <id> [--as <label>]] [--question [--choice <answer>]...] (<text> | --file <file>) | stop | prune [<branch> | <id>]\n' +
        '    | export [--out <file>] | list | stop --list | policy [show | init | save --file <file>]\n' +
        '  every command but guide, list and policy finds the walkthrough from the options start was given: none for the current branch',
    );
  await command(rest);
} catch (error) {
  console.error(`walkthrough: ${(error as Error).message}`);
  process.exitCode = 1;
}
