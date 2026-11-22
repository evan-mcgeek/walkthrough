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

const notesExample = [
  { step: '1', label: 'Risk', text: 'Sessions never expire, so a stolen one works **forever**.' },
  {
    step: '1',
    file: 'src/session-store.ts',
    lines: [1, 1],
    label: 'Nit',
    text: 'The name could say what is stored.',
    low: true,
  },
];

const checklistExample = {
  title: 'Acceptance criteria',
  items: [
    { status: 'met', text: 'Sessions survive a restart.', steps: ['1'] },
    { status: 'not shown', text: 'Expired sessions are removed.', steps: [] },
  ],
};

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

walkthrough note < notes.json
  Pins notes to the page, after those pinned before, and prints each note's id.
  Standard input is a JSON array of notes; their text is Markdown, shown without any raw HTML.
  "step" is a step id ("1" for the first step).
  A note on a step, or on lines of a file in it, numbered as in the file at the head; the first and last line must be in the step's diff:
    {"step": string, "label": string, "text": string, "low": boolean}
    {"step": string, "file": path, "lines": [first, last], "label": string, "text": string, "low": boolean}
  "low": true puts the note behind a count of low-priority notes; it may be left out.
  When a note does not fit the walkthrough, nothing is recorded and the problem is named.
  Example:
${JSON.stringify(notesExample, null, 2)}

walkthrough checklist < checklist.json
  Records the checklist shown beside the steps, replacing the one recorded before; re-recording the steps keeps it.
  Standard input is a JSON object with a title and items in reading order.
  Title, status and text are the session's own words.
  An item's steps are the ids of the steps it links to ("1" for the first step); every id must exist, otherwise nothing is recorded ("steps" may be left out).
    {"title": string, "items": [{"status": string, "text": string, "steps": [step id, ...]}, ...]}
  Example checklist:
${JSON.stringify(checklistExample, null, 2)}

walkthrough listen
  Waits for the person to act on the page, then prints one JSON line per thing they sent and exits:
    {"kind": "ask", "id": string, "step": string, "text": string}   a question about a step
    {"kind": "ask", "id": string, "step": string, "file": path, "lines": [first, last], "text": string}   a question about lines of a step; the answer shows on those lines
    {"kind": "reply", "id": string, "to": string, "text": string}   a reply to a note or to a question the session asked
    {"kind": "stopped"}   the page was stopped or closed; nothing more will come
  Exit code 3: another walkthrough listen took over; this one gets nothing more.

walkthrough say [--answer <id>] [--question] <text>
  Puts the session's Markdown on the page: an answer to the ask or reply with that id, a question the person replies to, or else a note at the top.
`;
