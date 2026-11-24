// What `walkthrough guide` prints: the format of every command the session records with or reads from.
const steps = [
  {
    title: 'Parse due dates in the API',
    explanation: 'Both handlers accept an optional dueDate and store it as a date or null.\n\nThe rest of the detail, shown behind More.',
    files: ['src/api/tasks.ts', { path: 'src/api/generated/client.ts', folded: 'Generated from the schema' }],
    look: [{ file: 'src/api/tasks.ts', start: 26, end: 29, label: 'parseDueDate' }],
  },
];
const comments = [{ file: 'src/api/tasks.ts', lines: [29, 29], body: 'A typo in the date becomes null and clears it. Return 400 with the field name.' }];
const threads = [
  {
    id: '1042',
    file: 'src/api/tasks.ts',
    lines: [22, 22],
    author: 'dana-k',
    at: '2026-11-23T09:30:00Z',
    body: 'Does a PATCH without dueDate wipe the date?',
    replies: [{ author: 'ryo-t', at: '2026-11-24T10:00:00Z', body: 'Yes. Fixing it in this PR.' }],
  },
];
const criteria = [
  { text: 'Optional due date on create and edit', status: 'met' },
  { text: 'Invalid dates rejected with a clear error', status: 'not-met' },
];

export const GUIDE = `walkthrough start [--target <branch> | --base <rev> --head <rev> --label <text>] [--pr <number> [--title <text>]]
  Starts or resumes a walkthrough and opens its page; nothing is checked out.
  With no options it is of the current branch against origin/<target>, or the local <target> when the remote has none, and the remote's default branch unless given.
  With --base and --head it is of that range, named by its --label.
  --pr makes it a pull request: the page shows "#<number> <title>" and ends with Submit review; without it, the change is the person's own and ends with Send to agent.
  Every command below finds the walkthrough from the same source options start was given, so pass them to each.
  When the head moved, each step keeps the files that still change and its Look at pointers still in its diff; start prints the files no step has yet; record the steps again with those.
  Comments on lines that changed stay in the review, detached from the diff.
  It prints the walkthrough's inbox, the folder for the files the session records from.

Recording from files
  steps, comment, threads, criteria and policy save read the file --file names, or standard input without it; say takes its text on the command line or from --file.
  Write each file with your file tool into the inbox start printed, then pass its path; the command removes it once read.
  Lines are numbered as in the file at the head, and must be in the step's diff. Text is Markdown, shown without raw HTML or images.

walkthrough files
  Prints every changed file, one path per line.

walkthrough steps --file <file>
  Records the steps in reading order, replacing those recorded before, and prints each step's id and title.
  Every changed file must be in exactly one step; otherwise nothing is recorded and every problem is named.
  A file is a path, or {"path": path, "folded": reason} for a generated or copied file, which arrives folded with its one-line reason.
  "look" holds one or two pointers to what to read first, each {"file": path, "start": line, "end": line, "label": 1 to 4 words}.
  A step keeps its id while it keeps most of its files, so the person's Viewed marks and comments follow it.
${JSON.stringify(steps, null, 2)}

walkthrough reviewing [<step id>...]
  Records the steps the AI is still reviewing, replacing the set before; with no ids, none, and the page's "AI reviewing" goes.

walkthrough comment --file <file>
  Adds the AI's pending comments on lines and prints their ids. They show as [AI] and go out with the review unless the person deletes them;
  the person can edit them. Write the body without the [AI] prefix.
${JSON.stringify(comments, null, 2)}

walkthrough threads --file <file>
  Records colleagues' existing threads on lines, replacing those recorded before. "id" is yours, such as the code host's thread id;
  replies and resolves the person adds come back with it. "resolved" may be given as true.
${JSON.stringify(threads, null, 2)}

walkthrough criteria --file <file>
  Records the acceptance criteria as checked, replacing those before; read-only on the page. status: met, partly, not-met or not-checked.
${JSON.stringify(criteria, null, 2)}

walkthrough listen
  Waits for the person, then prints one JSON line per thing they sent and exits. Only these wake it:
    {"kind": "ask", "id": string, "text": string, "file": path, "lines": [first, last], "thread": [{"by": "you" | "ai" | handle, "body": string}, ...]}
      Ask AI, on picked lines or in a thread; "thread" is what the thread said before. Answer with say --answer.
    {"kind": "submit", "id": string, "type": "comment" | "approve" | "request-changes", "summary": string}
      Submit review or Send to agent; read what goes out with walkthrough comments, act on it, then run walkthrough posted.
    {"kind": "stopped"}   the page was stopped; nothing more will come
  Comments, replies, edits, deletions, Resolve and Viewed never wake it.
  Exit code 3: another walkthrough listen took over.

walkthrough say --answer <ask id> (<text> | --file <file>)
  Answers an ask as a reply in its thread, in two sentences, the first answering directly. Answers stay on the page and never go out.

walkthrough comments
  Prints what goes out, one JSON line each: the review submitted and not yet posted, or else what is pending.
    {"kind": "comment", "id": string, "by": "you" | "ai", "file": path, "lines": [first, last], "body": string, "outdated": true}
      a new thread; "outdated" only when its lines changed since
    {"kind": "reply", "id": string, "by": "you" | "ai", "thread": id, "body": string}   in a colleague's thread or after a comment above
    {"kind": "resolve", "thread": id}   the person resolved a colleague's thread
  An AI comment's body starts with [AI].

walkthrough posted [--address <url>]
  Records that the submitted review went out, and where; the page then links View review to the address.

walkthrough export [--out <file>]
  Writes the walkthrough to one read-only HTML file: steps, explanations, diffs, comments and criteria.

walkthrough policy [show | init | save --file <file>]
  The person's review policy; this compares and copies its bytes and never reads its rules.
  With no action it prints its state (none, template or yours) and path, then the inbox to write a new version to.

walkthrough stop | list | stop --list | prune [<branch> | <id>]
  stop ends the page; list opens the repo's walkthroughs; prune removes walkthroughs that are over, or the one named.
`;
