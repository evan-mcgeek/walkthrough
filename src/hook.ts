// The plugin's PreToolUse hook: approves the CLI's own commands and the session's writes to an inbox for the whole session,
// which the skill's allowed-tools only does until the next turn; anything else is left to the person's permissions.
import fs from 'node:fs';
import { inInbox } from './paths';

const PLAIN = /[A-Za-z0-9_./:=@%+,-]/;

// The words of a command that runs nothing but itself: plain words, single quotes, and double quotes that expand nothing.
export function words(command: string): string[] | null {
  const found: string[] = [];
  let word: string | null = null;
  for (let at = 0; at < command.length; at++) {
    const char = command.charAt(at);
    if (char === ' ' || char === '\t') {
      if (word !== null) found.push(word);
      word = null;
    } else if (char === "'" || char === '"') {
      const end = command.indexOf(char, at + 1);
      const quoted = command.slice(at + 1, end);
      if (end < 0 || (char === '"' && /[$`\\!]/.test(quoted))) return null;
      // zsh's RC_QUOTES reads '' inside single quotes as a quote.
      if (char === "'" && command.charAt(end + 1) === "'") return null;
      word = (word ?? '') + quoted;
      at = end;
    } else if (char === '\\') {
      const next = command.charAt(at + 1);
      if (!next || next === '\n') return null;
      word = (word ?? '') + next;
      at++;
    } else if (PLAIN.test(char) && !(char === '=' && word === null)) word = (word ?? '') + char;
    else return null;
  }
  if (word !== null) found.push(word);
  return found;
}

// `--out` writes wherever it names, so an export stays with the person.
function ownCommand(command: string): boolean {
  const found = words(command);
  if (found?.[0] !== 'walkthrough') return false;
  return found.every((word, at) => {
    if (word === '--out' || word.startsWith('--out=') || word.startsWith('--file=')) return false;
    if (word !== '--file') return true;
    const file = found[at + 1];
    return file !== undefined && inInbox(file);
  });
}

function approved({ tool_name, tool_input }: { tool_name?: string; tool_input?: Record<string, unknown> }): boolean {
  const field = (name: string) => (typeof tool_input?.[name] === 'string' ? tool_input[name] : '');
  if (tool_name === 'Bash') return ownCommand(field('command'));
  if (tool_name === 'Write') return field('file_path').startsWith('/') && inInbox(field('file_path'));
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
