# Product

<!-- impeccable:product-schema 1 -->

`VISION.md` is the anchor: where this file and it disagree, `VISION.md` wins. This file restates it for design work.

## Platform

web

## Users

Developers reviewing a code change, in two jobs:

- reviewing their own agent's work before colleagues see it (`/walkthrough`);
- reviewing a colleague's pull request (`/walkthrough:pr <number or link>`).

Typical scene: a reviewer at a laptop with a Claude Code session running beside the page. Every screen also works at 390px for reading, Viewed, commenting, asking and submitting.

## Product Purpose

Walkthrough is GitHub's pull request review page, made better by AI: the same files, diffs, comments, threads and one review at the end, plus the AI's steps, explanations, comments and answers. The AI walks the human through the change one step at a time, in an order that makes sense.

Success is the best review from an AI and a human together: the AI stays shallow, on the ticket and on what matters, and writes short; the human notices every detail that matters.

## Positioning

A GitHub reviewer needs no help page, legend or hint. Every review concept is GitHub's: files, diffs, Viewed, line comments, threads, replies, Resolve, a pending review, and one submit with Comment, Approve or Request changes. The AI adds steps, "Look at" pointers, short explanations, its own comments, answers to the human's questions and a check of the acceptance criteria. Everything else works as on GitHub.

## Operating Context

- Runs locally; one page per walkthrough.
- The AI asks, once, in the Claude Code chat (not on the page), how well the person knows the feature, with four answers from "I know it well" to "It's new to me"; the answer sets how much it explains.
- The AI reads the ticket, splits the change into steps, gives each step "Look at" pointers and a short explanation, and leaves its comments on lines as pending review comments marked `[AI]`. Colleagues' existing threads show on their lines.
- The page opens near the end of the review and shows the AI at its desk until the review is ready; then the whole walkthrough appears at once.

## Capabilities and Constraints

- **Steps:** the AI's steps in reading order, each with its files. A step has its number and title, "Look at:" with one or two links to the lines that matter most, and one or two sentences of explanation (more behind More).
- **Files:** GitHub's file header: path, +/−, comment count, Viewed, collapse. Viewed folds the file and counts toward "N / M files viewed". Generated or copied files arrive folded with one line saying why.
- **Comments and threads:** one component for every comment: yours, the AI's (`[AI]`), and colleagues' threads. A pending comment (yours or the AI's) has Edit and Delete. A thread has Reply and, for colleagues' threads, Resolve. "Ask AI" sits in a thread and on picked lines; the question and the AI's answer stay on the page as a reply in that thread and never go out with the review. Deleting an AI comment is how you dismiss it.
- **The AI speaks in threads only.** It comments on lines and answers when asked. It never replies to a comment that was not a question to it, and the human's comments never wake it.
- **Comments arriving while you read** never move what you are reading: a new comment above or inside the view waits behind a "1 new comment above" pill and opens in place when you choose.
- **The Summary** is GitHub's "Finish your review" made visible: every pending comment that will go out, one line each with Edit, Delete and a link to its line; unresolved threads and files not yet viewed as counts that link to them; the acceptance criteria as the AI assessed them (read-only); then the summary box, Comment / Approve / Request changes, and Submit review. After submitting, one line says what went and where.
- **Your own change:** the same page; the Summary has the summary box and "Send to agent" with no review type, and your comments go back to the agent to fix.
- **The human decides:** nothing reaches GitHub or the author until the human submits.
- **Fixed controls:** the page's controls, labels and colours are the same for everyone. No language, code host, tracker or workflow rules live in the code (ADR 0005); the person's review policy holds them.
- Built as plain HTML and CSS with a framework-free TypeScript page; strict CSP; diffs by diff2html restyled through classes.

## Not in the tool

Approving or flagging steps, decided counts, a progress bar of decisions, a separate verdict, "still open" and "decided" states, findings with Accept or Reject, a chat or messages page, session status words, replies to comments that did not ask the AI, buttons or tones invented by the session, swipe decks, accent pickers, help sheets and legends.

## Brand Personality

Quiet, exact, trustworthy. The page reads like a well-made code host page with a better guide beside you.

## Anti-references

A dashboard of statuses; a chat app; a decision workflow; a GitHub clone that copies its look rather than its concepts; a terminal costume.

## Design Principles

1. GitHub-shaped: use GitHub's word for every review concept.
2. AI adds, never replaces.
3. Minimal and self-explanatory: if a control needs explaining, it is the wrong control.
4. Short: the page and the AI say little.
5. One place per thing.
6. Polish counts: motion and visual quality stay high, serving fewer things.

## Accessibility & Inclusion

WCAG 2.2 AA. Every icon and colour also has a word (visible or as its accessible name). Reduced motion keeps opacity and colour only.

## Evidence on Hand

- `VISION.md` (binding), `HANDOFF.md` (the build spec and founder decisions).
- Sample content is invented: a small todo app adding due dates. No real users, companies or metrics.
