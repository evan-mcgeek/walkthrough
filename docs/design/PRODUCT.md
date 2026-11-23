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
- Session status is judged from evidence: Listening, Working, Needs you (the session asked a question), Gone. The server can be unreachable, and the reviewer can Stop.

## Capabilities and Constraints

- Steps: title, the agent's Markdown explanation, an optional list of what the agent assumed rather than read (kept apart from the explanation), the files the step covers (a step can cover several files), and their diffs. One folded step groups files the agent judged skippable (lockfile, generated), each with its reason and any problem.
- Read (seen on the page) is tracked separately from decided. An undecided item never reads as approved. Decisions stay changeable until the end. A step whose code changes reopens; a note whose code no longer exists shows as detached, never dropped.
- Notes pin to a step or a line range, with an agent-chosen label, Markdown text, replies and their own actions. Low-priority notes are grouped behind "N more".
- Checklist: titled by the agent, items with agent-chosen statuses and links to steps.
- Actions are offered by the agent on a step, note, checklist item or the whole walkthrough. They may ask for a note or let the person edit text (such as a draft comment, which starts with "[AI]") before accepting. Built-in step actions are only Approve and Flag (Flag asks for a note); Ask is a separate box on every step, and picking diff lines opens "Ask about <file> lines a-b".
- Decided states use neutral colours: no decision label may read as approval by colour. Items show "Undecided", "Decided: <label>" or "Reopened: changed since you chose <label>".
- Detached notes, asks and checklist links live in a "Detached" section above the steps. A notice lists changed files that are in no step yet. Session messages that belong to no step show in "From the session". Checklist items can say "N linked step(s) no longer in the change".
- Export: the walkthrough as one read-only HTML file (no buttons, boxes, status or Stop).
- Changed Markdown and image files get a Diff / Preview switch.
- Keyboard: next and previous step, take an action, focus the note box.
- Built as plain HTML and CSS with a framework-free TypeScript page; no component library. Strict CSP: no inline styles or scripts, everything through classes. Diffs are rendered by diff2html in line-by-line mode.
- Light and dark themes follow the system setting. A manual override is undecided.
- Keyboard: j / k and arrow keys move between steps (not while typing); Tab reaches every action; line picking works from the keyboard.
- Status: built with plain, unstyled markup; this design replaces its look. A prototype exists. Its code was not available when this record was written; designs should be checked against it when it is.

## Brand Commitments

Name: Walkthrough. Universal: no company, team or bound design system.

Identity: the W-path mark (a W walked in four strokes, the last lighter: still to go), wordmark set in the UI sans at 700, favicon and app icon on violet. Brand colour: Walkthrough violet (#5b3fd6 light, #9b86ff dark), used only for the primary action, progress, selection, focus and the mark. Assets in docs/design/brand/.

Look: the category-standard review layout, chosen by the user over invented visual worlds. Craft bar: JetBrains IDEs. Must not read as a GitHub/GitLab clone or as a terminal costume. Chrome text kept to a minimum.

Layout: four switchable layouts with identical functions; "What's left" (a queue of what still needs the reviewer) opens by default.

## Evidence on Hand

- `project/BRIEF.md`: the design brief and settled page model.
- Sample content is invented: a small todo app adding due dates, nine steps. There are no real users, companies, tickets, testimonials or metrics; do not fabricate any.

## Product Principles

1. The diff and the agent's explanation are the content; chrome stays text-light.
2. State is never ambiguous: undecided, read, decided, reopened and detached each read as themselves.
3. The agent proposes, the person decides. Nothing leaves for colleagues without the person's explicit action.
4. The tool imposes no rules; it presents what the session derived from the person's own rules.
5. Keyboard first at a laptop, still usable on a phone.

## Accessibility & Inclusion

WCAG 2.2 AA.
