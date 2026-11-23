// The person's review policy, which the CLI only compares with the template and copies, byte for byte; the session reads it.
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { readInput } from './input';
import { makeInbox, stateDir } from './paths';

const TEMPLATE = path.join(import.meta.dirname, '..', 'skills', 'walkthrough', 'REVIEWER.md');

const policyPath = () =>
  path.join(process.env['XDG_CONFIG_HOME'] || path.join(os.homedir(), '.config'), 'walkthrough', 'REVIEWER.md');

const read = (file: string) => fs.readFileSync(file);

// What init copied, so a copy left unchanged is still the template after a release changes it.
const copiedPath = () => path.join(path.dirname(policyPath()), '.template-sha256');
const sha256 = (bytes: Buffer) => crypto.createHash('sha256').update(bytes).digest('hex');

function stateOf(policy: string): 'none' | 'template' | 'earlier' | 'yours' {
  if (!fs.existsSync(policy)) return 'none';
  const bytes = read(policy);
  if (bytes.equals(read(TEMPLATE))) return 'template';
  const copied = fs.existsSync(copiedPath()) ? fs.readFileSync(copiedPath(), 'utf8').trim() : '';
  return sha256(bytes) === copied ? 'earlier' : 'yours';
}

function status(): void {
  const policy = policyPath();
  const inbox = makeInbox(stateDir());
  const state = stateOf(policy);
  if (state === 'none') console.log(`none: there is no review policy at ${policy}, so the template applies.`);
  else if (state === 'template') console.log(`template: the review policy at ${policy} is the unchanged template.`);
  else if (state === 'earlier')
    console.log(`template: the review policy at ${policy} is an earlier unchanged template, so the current template applies.`);
  else console.log(`yours: the review policy at ${policy} is the person's own.`);
  console.log(`Write a new version to files in ${inbox} and save it with walkthrough policy save --file <file>.`);
}

function save(text: Buffer | string, what: string): void {
  const policy = policyPath();
  fs.mkdirSync(path.dirname(policy), { recursive: true });
  fs.writeFileSync(policy, text);
  console.log(`${what} ${policy}.`);
}

export function policyCommand(args: string[]): void {
  const { positionals, values } = parseArgs({ args, allowPositionals: true, options: { file: { type: 'string' } } });
  const [action, ...rest] = positionals;
  if (rest.length > 0) throw new Error('usage: walkthrough policy [show | init | save --file <file>]');
  if (action === undefined) status();
  else if (action === 'show') process.stdout.write(read(stateOf(policyPath()) === 'yours' ? policyPath() : TEMPLATE));
  else if (action === 'init') {
    if (fs.existsSync(policyPath())) throw new Error(`there is a review policy at ${policyPath()} already`);
    const template = read(TEMPLATE);
    save(template, 'Copied the template to');
    fs.writeFileSync(copiedPath(), `${sha256(template)}\n`);
  } else if (action === 'save') {
    const text = readInput(values.file);
    if (!text.trim()) throw new Error('the review policy is empty; nothing was saved');
    save(text, 'Saved the review policy at');
  } else throw new Error('usage: walkthrough policy [show | init | save --file <file>]');
}
