import { parseArgs } from 'node:util';
import { currentChange } from './change';
import { openWalkthrough } from './walkthrough';

const short = (sha: string) => sha.slice(0, 7);

function start(args: string[]): void {
  const { values } = parseArgs({ args, options: { target: { type: 'string' } } });
  const change = currentChange(process.cwd(), values.target);
  const { walkthrough } = openWalkthrough(change);
  const steps = walkthrough.steps.length;
  console.log(
    `Walkthrough of ${change.branch} against ${change.target}: ${short(change.base)}..${short(change.head)}, ${String(steps)} step${steps === 1 ? '' : 's'}.`,
  );
}

const COMMANDS: Record<string, (args: string[]) => void> = { start };

const [name = '', ...rest] = process.argv.slice(2);
const command = COMMANDS[name];
try {
  if (!command) throw new Error(`usage: walkthrough ${Object.keys(COMMANDS).join('|')}`);
  command(rest);
} catch (error) {
  console.error(`walkthrough: ${(error as Error).message}`);
  process.exitCode = 1;
}
