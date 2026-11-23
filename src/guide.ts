// What `walkthrough guide` prints: the format of every command the session records with or reads from.
const example = [
  {
    title: 'Session store',
    explanation: 'Adds a store that keeps login sessions, with its test.\n\nLogin needs somewhere to keep sessions.',
    assumptions: ['Sessions are only read by the login handler.'],
    files: [{ path: 'src/session-store.ts', explanation: 'Keeps sessions in memory, keyed by their id.' }, 'test/session-store.test.ts'],
  },
  {
    title: 'Regenerated API description',
    folded: true,
    files: [{ path: 'docs/api.json', reason: 'Regenerated from the session store.' }],
    problems: [],
  },
];

const notesExample = [
  { step: '1', label: 'Risk', text: 'Sessions never expire, so a stolen one works **forever**.', finding: true },
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
    { status: 'met', mark: 'met', text: 'Sessions survive a restart.', steps: ['1'] },
    { status: 'not shown', mark: 'not-met', text: 'Expired sessions are removed.', steps: [] },
  ],
};

const actionsExample = [
  {
    item: { type: 'note', id: '5f0c2a9e' },
    actions: [
      { id: 'accept', label: 'Accept' },
      { id: 'edit', label: 'Edit first', edit: true },
      { id: 'drop', label: 'Drop', note: true },
    ],
  },
  { item: { type: 'step', id: '1' }, actions: [{ id: 'approve', label: 'Approve' }, { id: 'fix', label: 'Needs a fix', note: true }] },
  {
    item: { type: 'verdict' },
    hint: 'Sent with the review.',
    actions: [
      { id: 'approve', label: 'Approve' },
      { id: 'changes', label: 'Request changes' },
      { id: 'comment', label: 'Comment' },
    ],
  },
  { item: { type: 'walkthrough' }, hint: 'Posts your comments as one review.', actions: [{ id: 'post', label: 'Post my review' }] },
];

export const GUIDE = `walkthrough start [--target <branch> | --base <rev> --head <rev> --label <text>] [--kind <label>] [--comments <text>]
  Starts or resumes a walkthrough and opens its page; nothing is checked out.
  --kind gives the walkthrough the session's own label for what kind it is, such as "own" or "requested";
  the page header and the list show it as given, nothing else reads it, and a later start keeps it unless it gives another.
  --comments gives the session's own words for what becomes of the person's line comments, such as "Joins the fix list";
  the page shows them under each comment, and a later start keeps them unless it gives others.
  Both are start's alone: the other commands find the walkthrough without them.
  With no options it is of the current branch against origin/<target>, or the local <target> when the remote has none, and the remote's default branch unless given.
  With --base and --head it is of that range, named by its --label, which a range needs: two changes fetched to the same name would share a walkthrough without it.
  Either way the change runs from the merge-base of the two to the head; a change with no changed file is refused.
  Every command below finds the walkthrough from the same options start was given, so pass them to each.
  When the head moved since, the walkthrough goes on at the new head: each step keeps the files that still change, a step with none left is gone,
  and start prints the changed files that no step has yet, which the page names too; record the steps again with those in new steps.
  It prints the walkthrough's inbox, a folder for the files the session records from.
  Example: walkthrough start --base origin/main --head feature/cart --label "Cart"

Recording from files
  steps, checklist, note, actions and policy save read what they record from the file --file names, or from standard input without it; say takes its text on the command line or from --file.
  Write each file with your file tool into the inbox start printed (walkthrough policy prints the policy's), then pass its path; the plugin lets both run without asking the person.
  The command removes a file from the inbox once it has read it, so each recording is a new file there.
  Pass other text on the command line in single quotes, writing a single quote in it as '\\''; anything the shell would expand or run makes the person approve the command.

walkthrough files
  Prints every changed file of the walkthrough, one path per line, at its head path.

walkthrough steps --file <file>
  Records the steps, replacing those recorded before, and prints each step's id and title in order.
  A step takes the id of the step recorded before that it shares the most files with, the earlier on a tie, unless a step sharing more took it, or else a new id; its notes and checklist links follow the id.
  A step keeps its decisions and read mark while its diff is unchanged; when the diff changes, it is reopened until the person decides again.
  The file is a JSON array of steps in reading order; a step shows its files in the order given.
  Every file that walkthrough files prints must be in exactly one step; otherwise nothing is recorded and every problem is named.
  A step, with what the session assumed rather than read ("assumptions" may be left out):
    {"title": string, "explanation": string, "assumptions": [string, ...], "files": [path, ...]}
  A path in a step's files may be given with a short explanation of that file, shown just above its diff, under the step's explanation:
    {"path": path, "explanation": string}
  A folded step, shown collapsed, with the session's reason for each file and any problems it found ("problems" may be left out):
    {"title": string, "folded": true, "files": [{"path": path, "reason": string}, ...], "problems": [string, ...]}
  Example:
${JSON.stringify(example, null, 2)}

walkthrough checking [<step id>...]
  Records the steps you are still checking, such as with the review policy's reviewers, replacing those recorded before; with no ids, none.
  It prints the set, such as "Checking 3 steps: 4, 5, 6." or "Checking no steps."; an id that names no step is refused, and nothing is recorded.
  Recording the steps again keeps the ids that still name a step and drops the rest.
  Why a step is being checked is yours to say; the CLI only stores the ids.
  While a step is being checked, the page says so on the step, lists it as being checked in what is left and on the Summary, and holds its actions:
  the person can read it, ask about it and comment on its lines, but cannot decide it, and a decision sent on it is refused, until you record the set again without it.

walkthrough note --file <file>
  Pins notes to the page, after those pinned before, and prints each note's id.
  The file is a JSON array of notes; their text is Markdown, shown without raw HTML or images, like all the session writes.
  "step" is a step id as walkthrough steps printed it.
  A note on a step, or on lines of a file in it, numbered as in the file at the head; the first and last line must be in the step's diff:
    {"step": string, "label": string, "text": string, "low": boolean}
    {"step": string, "file": path, "lines": [first, last], "label": string, "text": string, "low": boolean}
  "low": true puts the note behind a count of low-priority notes; it may be left out.
  "finding": true flags the note as a finding, whatever its label; it may be left out.
  The page marks a finding in amber in the line gutter and on the file's overview stripe, and while a step has findings the person has not decided, its Approve steps down and the step says how many are open.
  A finding pinned on a step after the person decided that step, and not decided itself, puts the step back in what is left with "New finding"; the step's decision stays as it was.
  When a finding lands on a step the person has read or decided, the open page also raises a banner naming it.
  When a note does not fit the walkthrough, nothing is recorded and the problem is named.
  A note whose step or lines later leave the change, or whose lines change, is kept and shown as detached; a note on lines follows its file to the step that has it.
  Example:
${JSON.stringify(notesExample, null, 2)}

walkthrough checklist --file <file>
  Records the checklist the page shows, replacing the one recorded before, and prints each item's id in order; recording the steps again or a new head keeps it.
  The file is a JSON object with a title and items in reading order.
  An item takes the id of the item recorded before with the same text, or else a new id; its decision and actions follow the id.
  To keep an item whose text you changed, give it its id with "id": the person's decision on it is reopened, and no other item's.
  Title, status and text are the session's own words.
  "mark" picks the icon beside the status: "met", "partly", "not-met" or "unchecked" ("mark" may be left out, which shows "unchecked").
  An item marked "not-met", or offering actions the person has not taken, is listed with the steps left, as something that still needs the person.
  An item's steps are the ids of the steps it links to, as walkthrough steps printed them; every id must exist, otherwise nothing is recorded ("steps" may be left out).
  A link to a step that is later gone shows as gone.
    {"title": string, "items": [{"status": string, "mark": mark, "text": string, "steps": [step id, ...]}, ...]}
    {"id": string, "status": string, "mark": mark, "text": string, "steps": [step id, ...]}   an item kept under a new text
  Example checklist:
${JSON.stringify(checklistExample, null, 2)}

walkthrough actions --file <file>
  Records the actions the page offers on items, replacing those recorded before on each item named; other items keep theirs.
  The file is a JSON array of items, each with its actions in the order shown; ids and labels are the session's own.
  An item is a step, a note (by the id walkthrough note printed), a checklist item (by the id walkthrough checklist printed), the verdict or the whole walkthrough:
    {"type": "step", "id": string}   {"type": "note", "id": string}   {"type": "checklist", "id": string}   {"type": "verdict"}   {"type": "walkthrough"}
  An action asks the person for a note with "note": true, and lets them edit the text of a note or checklist item first with "edit": true:
    [{"item": item, "hint": string, "actions": [{"id": string, "label": string, "note": boolean, "edit": boolean}, ...]}, ...]
  A step with no actions offers {"id": "approve", "label": "Approve"} and {"id": "flag", "label": "Flag", "note": true}; an empty list brings these back.
  Other items offer nothing until actions are recorded on them.
  The page ends with a Summary, after the last step: what is decided and still open, the verdict, and the walkthrough's actions.
  The verdict's actions are the choices of the person's verdict on the whole walkthrough, chosen only on the Summary; once chosen, the page shows it as a status.
  The walkthrough's actions close the Summary; the first is its finishing action, which waits for a verdict while the verdict offers choices and none is chosen.
  "hint", for the verdict or the walkthrough only, is the session's own words under its actions, such as where the verdict goes; it may be left out, and recording the item again without one drops it.
  A note offering an action with "edit": true is a draft: the Summary lists it as accepted or edited when the person took that action, and dropped when they took another.
  A step's or checklist item's actions last while its id does.
  When an item does not exist or an action does not fit, nothing is recorded and the problem is named.
  Example actions, for a note with the id 5f0c2a9e:
[
${actionsExample.map(one => `  ${JSON.stringify(one)}`).join(',\n')}
]

walkthrough decisions
  Prints every item and the person's latest decision on it, one JSON line each; an undecided item has "decision": null:
    {"item": item, "decision": {"id": string, "action": string, "note": string, "text": string} | null}
  A reopened item, whose content changed since the person decided it, also has "reopened" with that earlier decision, in the same shape.
  A decision stays on an item with the same id while what it was about is unchanged: a step's diff, a note's or checklist item's text, the verdict's and the walkthrough's base and head.
  The verdict is the line with {"type": "verdict"}: its decision's action is the verdict the person chose, or null before they choose one.
  A decision the person took back with Undo leaves the item undecided, with "decision": null and no "reopened".

walkthrough listen
  Waits for the person to act on the page, then prints one JSON line per thing they sent and exits:
    {"kind": "ask", "id": string, "step": string, "text": string}   a question about a step
    {"kind": "ask", "id": string, "step": string, "file": path, "lines": [first, last], "text": string}   a question about lines of a step; the answer is a note on those lines
    {"kind": "reply", "id": string, "to": string, "text": string}   a reply to a question the session asked
    {"kind": "reply", "id": string, "to": string, "text": string, "about": {"label": string, "text": string}}   a reply to a note, with that note's label and text
    {"kind": "decision", "id": string, "item": item, "action": string, "note": string, "text": string}   an action the person took; "note" when it asks for one, "text" the edited text when it allows editing
    {"kind": "decision", "id": string, "item": item, "clear": true}   the person took back their decision on the item with Undo; it is undecided again
    {"kind": "decision", "id": string, "item": {"type": "verdict"}, "action": string}   the verdict the person chose, or changed to, on the Summary
    {"kind": "comment", "id": string, "step": string, "file": path, "lines": [first, last], "text": string}   the person's own comment on those lines; its id is the comment's
    {"kind": "edit-comment", "id": string, "comment": string, "text": string}   the person changed the comment with id "comment" to this text
    {"kind": "delete-comment", "id": string, "comment": string}   the person deleted the comment with id "comment"
    {"kind": "stopped"}   the page was stopped or closed; nothing more will come
  The person can change a decision until the walkthrough ends; each change comes as a new decision, and the latest counts.
  Act on a clear as the review policy says, and answer it with say --answer like any decision.
  A comment is the person's own words, never yours: act on it, its edits and its deletion as the review policy says, and answer each with say --answer.
  Files the person collapses or marks viewed are their own reading marks and never reach the session.
  Exit code 3: another walkthrough listen took over; this one gets nothing more.

walkthrough comments
  Prints each of the person's comments as it is now, edits applied and deleted ones left out, one JSON line each:
    {"id": string, "step": string, "file": path, "lines": [first, last], "text": string, "posted": true}   "posted" only once marked posted

walkthrough posted <comment id>...
  Marks the person's comments posted, once they have gone out as the review policy says;
  the page then shows them as posted and no longer lets the person edit or delete them.
  An id that names no comment is refused, and nothing is marked.

walkthrough say [--answer <id> [--as <label>]] [--question [--choice <answer>]...] (<text> | --file <file>)
  Puts the session's Markdown on the page, from its text or the file --file names: an answer to the ask, reply or decision with that id, a question the person replies to, or else a note at the top.
  An answer to a question about lines is a note on those lines, labelled with --as, or "Answer" without it, and say prints its id:
  the person can reply to it like any note, and you can record actions on it.
  Each --choice is an answer the question offers as a button; the person's choice comes back as a reply with that text.
  Until every ask, reply and decision that listen handed over has its answer, the page shows the session working.

walkthrough export [--out <file>]
  Writes the walkthrough as it is now to one read-only HTML file that opens with no server: steps, diffs, notes with their threads, the checklist, decisions and the verdict.
  The file carries no page address or token; without --out it goes into the walkthrough's state, and the path is printed.
  With --out the person approves the command, since it writes where it names.

walkthrough policy [show | init | save --file <file>]
  The person's review policy; this compares and copies its bytes and never reads its rules.
  With no action it prints its state and path on the first line, then the inbox to write a new version to:
    none: there is no review policy at <path>, so the template applies.
    template: the review policy at <path> is the unchanged template.
    template: the review policy at <path> is an earlier unchanged template, so the current template applies.
    yours: the review policy at <path> is the person's own.
  show prints the policy, or the current template while it is none or a template; init copies the template there when there is none;
  save --file <file> replaces the policy with the file, which you write in that inbox.

walkthrough list
  Opens a page of the repo's walkthroughs with their progress, verdict and last activity; opening one starts its page when it is not running.
  It takes no source options; walkthrough stop --list ends it, and it stops by itself once no list page has been open for a while.
`;
