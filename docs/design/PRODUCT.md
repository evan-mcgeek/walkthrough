# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Developers reviewing a code change step by step, in two jobs weighted equally:

- checking an AI agent's work before it goes to colleagues;
- reviewing a colleague's pull request.

Typical scene: a reviewer at a laptop, alongside a running Claude Code session. The page must also work at 390px wide.

## Product Purpose

Walkthrough is an open-source, local code review tool. It shows a change one step at a time so a person can understand it, comment on it and decide on it. Success: every step reads as clearly decided or clearly undecided, the reviewer's decisions and notes reach the session, and comments meant for colleagues leave in a form the reviewer has approved.

## Positioning

A Claude Code session drives the page: it records the steps, explanations, assumptions, notes and checklist, and offers the actions. The person reads, decides and asks; their decisions go back to the session, which answers on the page. The tool has no review rules of its own. Everything the agent shows comes from the person's own review rules and the project's instructions.

## Operating Context

- Runs locally; a page per walkthrough, plus a small page listing open walkthroughs (label, progress, last activity).
- Input is a branch's agent work or a pull request; whole-walkthrough actions such as "Post my comments" go back through the session.
- Session status is judged from evidence and always reads as "Session: Listening / Working / Needs you / Gone" (Needs you: the session asked a question). The server can be unreachable, and the reviewer can End session.

## Capabilities and Constraints

- Steps: title, the agent's Markdown explanation, an optional list of what the agent assumed rather than read (kept apart from the explanation), the files the step covers (a step can cover several files), and their diffs. One step, "Files to skim" (internally the folded step), groups files the agent judged skippable, each with its reason as a sentence and any problem.
- Read (seen on the page) is tracked separately from decided. An undecided item never reads as approved. Decisions stay changeable until the end. A step whose code changes after a decision shows "Changed since you decided" (internally: reopened); a note whose code no longer exists moves to "Notes on removed code" (internally: detached), never dropped.
- Notes pin to a step or a line range, with an agent-chosen label, Markdown text, replies and their own actions. Low-priority notes are grouped behind "N more".
- Checklist: titled by the agent, items with agent-chosen statuses and links to steps.
- Actions are offered by the agent on a step, note, checklist item or the whole walkthrough. They may ask for a note or let the person edit text (such as a draft comment, which starts with "[AI]") before accepting. Built-in step actions are only Approve and Flag (Flag asks for a note); Ask is a separate box on every step, and picking diff lines opens "Ask about <file> lines a-b".
- Status uses one traffic-light set everywhere (header bar, queue, Summary, checklist, Help): green for a decision with a positive action or a met item, amber for needs you (flagged, open finding, changed since you decided, partly met), red for a checklist item not met, grey for not decided yet or a decision whose action has no tone, ink for where you are. Each action the session records carries a tone from the review policy (positive, attention, none); Approve is positive and Flag attention by default. Every colour also has an icon and a word. Items show "Undecided", "Decided: <label>" or "Changed since you chose <label>".
- Notes, asks and checklist links whose code is gone live under "Notes on removed code" on the Session messages page. A notice lists changed files that are in no step yet. Session messages that belong to no step show in "Session messages". Checklist items can say "N linked step(s) no longer in the change".
- Export: the walkthrough as one read-only HTML file (no buttons, boxes, status or End session).
- Two kinds of walkthrough: your own change (`/walkthrough`), which ends with a fix list handed to an author session; and a review request (`/walkthrough:pr`) on someone else's pull request, which ends with your comments and accepted or edited `[AI]` drafts posted as one review. The header names the kind quietly.
- Panels work like JetBrains tool windows: the To review queue, Checklist (with whole-walkthrough actions) and Explanation column each have a title bar with a hide button; a hidden panel collapses to a labelled button on its window edge (left: To review, Explanation; right: Checklist), so nothing is ever out of reach. Keys 1–3 toggle them. There is no tool panel: notes sit on their lines, and session messages and notes on removed code have their own Session messages page. Default: the queue open, the rest on their edges. On a phone they live in the More menu.
- Files within a step collapse individually; large and folded files start collapsed. "Viewed" collapses a file and is not a decision.
- The session may add a short explanation per file, above its diff; the step explanation stays as the overview.
- The person can add their own line comments ("+" on a line, or a Shift-click range). They are never `[AI]`, stay editable and deletable until posted, and join the fix list (own change) or the posted review (review request).
- A Summary step closes the queue: decisions by label, flags with notes, your comments, `[AI]` drafts (accepted, edited, dropped), checklist status, still-open items (undecided and reopened listed as such), and the finishing action.
- Final verdict: chosen only on the Summary, right under what is still open; labels come from the session (review request: Approve / Request changes / Comment; own change: Ready for colleagues / Needs fixes). "No verdict yet" until chosen; the finishing action waits for it. Once chosen it shows quietly in the header and on the list page as a status in its action's tone (Toned Decision rule). A "Finish review" control in the header jumps to the Summary.
- When a step has open findings, Approve and Flag carry equal weight and the action bar says how many findings are open; findings are marked in the line gutter and on the diff's overview stripe.
- Appearance: accent and theme (System / Light / Dark) per person. Keyboard: J/K, A, F, /, C, V, 1–3, G S, and ? for Help, which explains every icon, colour and status in words beside the shortcuts; every tooltip names its key.
- Changed Markdown and image files get a Diff / Preview switch.
- Keyboard: next and previous step, take an action, focus the note box.
- Built as plain HTML and CSS with a framework-free TypeScript page; no component library. Strict CSP: no inline styles or scripts, everything through classes. Diffs are rendered by diff2html in line-by-line mode.
- Light and dark themes follow the system setting unless the person sets one in Appearance.
- Keyboard: j / k and arrow keys move between steps (not while typing); Tab reaches every action; line picking works from the keyboard.
- Status: built with plain, unstyled markup; this design replaces its look. A prototype exists. Its code was not available when this record was written; designs should be checked against it when it is.

## Brand Commitments

Name: Walkthrough. Universal: no company, team or bound design system.

Identity: the W-path mark (a W walked in four strokes, the last lighter: still to go), wordmark set in the UI sans at 700, favicon and app icon on ultramarine. Accent: Ultramarine by default (#2433b8 light, #8c97ff dark), configurable per person (Petrol, Berry) in Appearance; used for the primary action, decided progress, focus, picked lines, your own comments and the mark. Assets in project/brand/.

Look: the category-standard review layout, chosen by the user over invented visual worlds. Craft bar: JetBrains IDEs. Must not read as a GitHub/GitLab clone or as a terminal costume. Chrome text kept to a minimum.

Layout: tool-window panels that hide to the window edges; default is the "What's left" queue plus the step.

## Evidence on Hand

- `project/BRIEF.md`: the design brief and settled page model.
- Sample content is invented: a small todo app adding due dates, nine steps. There are no real users, companies, tickets, testimonials or metrics; do not fabricate any.

## Product Principles

1. The diff and the agent's explanation are the content; chrome stays text-light.
2. State is never ambiguous: undecided, read, decided, changed since you decided, and notes on removed code each read as themselves.
6. Self-explanatory: a first-time user understands every label without a manual. Product words are plain ("Changed since you decided", not "Reopened"); every icon and colour is also said in words, in its tooltip and in Help.
3. The agent proposes, the person decides. Nothing leaves for colleagues without the person's explicit action.
4. The tool imposes no rules; it presents what the session derived from the person's own rules.
5. Keyboard first at a laptop, still usable on a phone.

## Plain words (glossary)

The page uses these words; internal names stay in code and data only.

| On the page | Means | Internal name |
|---|---|---|
| To review | The queue of what is still open | queue |
| N of 9 decided | Progress in the header | progress |
| Changed since you decided | The code changed after your Approve or Flag | reopened |
| Being checked | The session has not finished checking the step | checking |
| New finding | A finding arrived after you read or decided | late finding |
| Files to skim | The step of files the session says you need not read line by line | folded step |
| Notes on removed code | Notes whose lines no longer exist | detached |
| Session messages | Session messages that belong to no step | from the session |
| Thing assumed, not checked | What the session assumed rather than read | assumption |
| Comments the session drafted | `[AI]` draft comments for a review request | [AI] drafts |
| Send the fix list to the session | The own-change finishing action | hand fixes to the author |
| End session | Stops the Walkthrough session | Stop |

## Accessibility & Inclusion

WCAG 2.2 AA.
