// The plugin's PreToolUse hook: approves the CLI's own commands and the session's writes to an inbox for the whole session,
// which the skill's allowed-tools only does until the next turn; anything else is left to the person's permissions.
import fs from 'node:fs';
import { inInbox } from './paths';

const PLAIN = /[A-Za-z0-9_./:=@%+,-]/;
// Mid-word, as in HEAD~2 or a1b2c3^1; a shell may glob them, which changes a word but runs nothing.
const REVISION = /[~^]/;

type Word = { text: string; globbed: boolean };

// The words of a command that runs nothing but itself: plain words, single quotes, and double quotes that expand nothing.
function words(command: string): Word[] | null {
  const found: Word[] = [];
  let text: string | null = null;
  let globbed = false;
  for (let at = 0; at < command.length; at++) {
    const char = command.charAt(at);
    let part = char;
    if (char === ' ' || char === '\t') {
      if (text !== null) found.push({ text, globbed });
      text = null;
      globbed = false;
      continue;
    } else if (char === "'" || char === '"') {
      const end = command.indexOf(char, at + 1);
      part = command.slice(at + 1, end);
      if (end < 0 || (char === '"' && /[$`\\!]/.test(part))) return null;
      // zsh's RC_QUOTES reads '' inside single quotes as a quote.
      if (char === "'" && command.charAt(end + 1) === "'") return null;
      at = end;
    } else if (char === '\\') {
      part = command.charAt(++at);
      if (!part || part === '\n') return null;
    } else if (REVISION.test(char) && text !== null) globbed = true;
    else if (!PLAIN.test(char) || (char === '=' && text === null)) return null;
    text = (text ?? '') + part;
  }
  if (text !== null) found.push({ text, globbed });
  return found;
}

// `--out` writes wherever it names, so an export stays with the person.
function ownCommand(command: string): boolean {
  const found = words(command);
  if (found?.[0]?.text !== 'walkthrough') return false;
  return found.every(({ text }, at) => {
    if (text === '--out' || text.startsWith('--out=') || text.startsWith('--file=')) return false;
    if (text !== '--file') return true;
    const file = found[at + 1];
    return file !== undefined && !file.globbed && inInbox(file.text);
  });
}

function approved({ tool_name, tool_input }: { tool_name?: string; tool_input?: Record<string, unknown> }): boolean {
  const field = (name: string) => (typeof tool_input?.[name] === 'string' ? tool_input[name] : '');
  if (tool_name === 'Bash') return ownCommand(field('command'));
  if (tool_name === 'Write' || tool_name === 'Edit') return field('file_path').startsWith('/') && inInbox(field('file_path'));
  return false;
}

try {
  if (approved(JSON.parse(fs.readFileSync(0, 'utf8')) as Parameters<typeof approved>[0]))
    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'PreToolUse',
          permissionDecision: 'allow',
          permissionDecisionReason: "The walkthrough plugin's own command or inbox",
        },
      }),
    );
} catch {
  // An input the hook cannot read gets no decision, so the usual permissions apply.
}
