// What `walkthrough guide` prints: the format of every command the session records with or reads from.
const example = [
  {
    title: 'Session store',
    explanation: 'Adds a store that keeps login sessions, with its test.\n\nLogin needs somewhere to keep sessions.',
    assumptions: ['Sessions are only read by the login handler.'],
    files: ['src/session-store.ts', 'test/session-store.test.ts'],
  },
  {
    title: 'Regenerated API description',
    folded: true,
    files: [{ path: 'docs/api.json', reason: 'Regenerated from the session store.' }],
    problems: [],
  },
];

export const GUIDE = `walkthrough files
  Prints every changed file of the walkthrough, one path per line, at its head path.

walkthrough steps < steps.json
  Records the steps, replacing the steps and decisions recorded before.
  Standard input is a JSON array of steps in reading order.
  Every file that walkthrough files prints must be in exactly one step; otherwise nothing is recorded and every problem is named.
  A step, with what the session assumed rather than read ("assumptions" may be left out):
    {"title": string, "explanation": string, "assumptions": [string, ...], "files": [path, ...]}
  A folded step, shown collapsed, with the session's reason for each file and any problems it found ("problems" may be left out):
    {"title": string, "folded": true, "files": [{"path": path, "reason": string}, ...], "problems": [string, ...]}
  Example:
${JSON.stringify(example, null, 2)}

walkthrough listen
  Waits for the person to act on the page, then prints one JSON line per thing they sent and exits:
    {"kind": "ask", "id": string, "step": string, "text": string}   a question about a step
    {"kind": "reply", "id": string, "to": string, "text": string}   a reply to a question the session asked
    {"kind": "stopped"}   the page was stopped or closed; nothing more will come
  Exit code 3: another walkthrough listen took over; this one gets nothing more.

walkthrough say [--answer <id>] [--question] <text>
  Puts the session's text on the page: an answer to the ask with that id, a question the person replies to, or else a note.
`;
