// The person's review policy, which the CLI only compares with the template and copies, byte for byte; the session reads it.
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { readInput } from './input';
import { makeInbox, stateDir } from './paths';

const TEMPLATE = path.join(import.meta.dirname, '..', 'skills', 'walkthrough', 'REVIEW.md');

const policyPath = () =>
  path.join(process.env['XDG_CONFIG_HOME'] || path.join(os.homedir(), '.config'), 'walkthrough', 'REVIEW.md');

const read = (file: string) => fs.readFileSync(file);

// The sha256 of every template that ever shipped, current included, so an unchanged copy stays the template; a template change adds its hash.
const TEMPLATES = new Set([
  '15dd307ab303cbcc4a36c384360e1f1e3f889492a484151f7776697cb1c7abf0',
  '26442e1d66028540ef4b778ed9edec79a2bab15ba84c543fa584a4d7d611d6fc',
  '2c3d45728f9fda9bb67b6d5bd546ce51d300a0de0d4e4fb820b31cfc7229d87e',
  '407a443dbc1b85beedb76b2c9d910b508486f37bbb04c9d77804d35ec4d516e0',
  '861b6dbfccfb2976660872d1ffa1357c0ac3d831ab8609dded6e2504f923a92c',
  '92c69616a59edfa307d9a8926543aa369d2134bd0aefd71a13ee10b828a96359',
  '9af98052435443bb10e4fca9dabe52f60de24564bf55ba7909423b37cd663303',
  '9f08ac1081cb9c42e8b0d6a2cf515f02b00fc338d0d90acb5284ee9648d7f813',
  'b1e132469f1ddd7e0510aeafb7838227ad910716f3e5749a089a44e7b73ca1fa',
  'f74fac0a569c470d0bbdc07d5fa375e6cb824e2090c50ce77163fe8201df686b',
]);

function stateOf(policy: string): 'none' | 'template' | 'earlier' | 'yours' {
  if (!fs.existsSync(policy)) return 'none';
  const bytes = read(policy);
  if (bytes.equals(read(TEMPLATE))) return 'template';
  return TEMPLATES.has(crypto.createHash('sha256').update(bytes).digest('hex')) ? 'earlier' : 'yours';
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
    save(read(TEMPLATE), 'Copied the template to');
  } else if (action === 'save') {
    const text = readInput(values.file);
    if (!text.trim()) throw new Error('the review policy is empty; nothing was saved');
    save(text, 'Saved the review policy at');
  } else throw new Error('usage: walkthrough policy [show | init | save --file <file>]');
}
