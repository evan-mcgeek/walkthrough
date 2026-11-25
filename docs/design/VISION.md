# Walkthrough: vision

This file is the anchor.
Read it before any feature, design brief, ticket, review or release.
A change that does not fit it is wrong, unless the person changes this file first.

## What it is

A peer-review tool where an AI and a human review a code change together.
It is GitHub's pull request review page, made better by AI: the same files, diffs, comments, threads and one review at the end, plus the AI's steps, explanations, comments and answers.
It is called Walkthrough because the AI walks the human through the change one step at a time, in an order that makes sense.

## The goal

The best review from an AI and a human working together:

- The AI does not go too deep and does not drift: it reviews against the ticket and its acceptance criteria, comments only where it matters, and writes short.
- The human notices every detail that matters: the change comes in a sensible order, each step says what to look at, and nothing else competes for attention.

## When it is used

- Reviewing your own agent's work before colleagues see it.
- Reviewing a colleague's pull request.

## The test for every feature

A feature belongs only if it does one of two jobs:

1. It keeps the AI shallow, on the ticket and on what matters.
2. It helps the human notice what matters.

If it does neither, it does not ship, however well it is drawn.

## Principles

1. **GitHub-shaped.** Every review concept is one a GitHub reviewer already knows: files, diffs, Viewed, line comments, threads, replies, Resolve, a pending review, and one submit with Comment, Approve or Request changes. Never invent a concept GitHub already has a word for.
2. **AI adds, never replaces.** The AI brings steps, explanations, its own comments, answers to the human's questions and a check of the acceptance criteria. Everything else works as on GitHub.
3. **Minimal and self-explanatory.** A reviewer who knows GitHub needs no help page, legend or hint. If a control needs explaining, it is the wrong control.
4. **Short.** The page says little and the AI writes little. The AI's working notes (evidence, verifier verdicts, plans) stay in the chat, never on the page.
5. **One place per thing.** A comment, a thread or a criterion appears once.
6. **The AI speaks in threads only.** It comments on lines, and it answers when the human asks it something. It never replies to a comment that was not a question to it, and the human's comments never wake it.
7. **The human decides.** Nothing reaches GitHub or the author until the human submits.
8. **Polish counts.** Motion and visual quality stay high; they serve fewer things, not more.
9. **Nothing specific in the tool** (ADR 0005). No language, code host, tracker or workflow rules live in the code; the person's review policy holds them. That rule is about review rules, not about the page: the page's controls are fixed and the same for everyone.
10. **Light to build.** A few tests that matter and a release check that takes minutes.

## The flow

1. Start with `/walkthrough` for your own change, or `/walkthrough:pr <number or link>` for a pull request.
2. The AI asks once how well you know the feature, with four answers, from "I know it well" to "It's new to me"; the answer sets how much it explains.
3. The AI reads the ticket, splits the change into steps, and gives each step "Look at" pointers to what matters and a short explanation.
4. The AI reviews and leaves its comments on the lines as pending review comments marked `[AI]`; colleagues' existing threads show on their lines.
5. You read step by step, mark files Viewed, comment on lines, edit or delete the AI's comments, reply in threads, and ask the AI in a thread.
6. You finish on the Summary, GitHub's "Finish your review" made visible: every comment that will go out, yours and the AI's, one line each with Edit, Delete and a link to its line, so you can dismiss what you do not want; unresolved threads and files not yet viewed, as counts; the acceptance criteria as the AI assessed them; then a summary, Comment, Approve or Request changes, and Submit.
   On a pull request it goes to GitHub as one review that you submit there; on your own change, your comments go back to the agent to fix.

## Not in the tool

Kept out on purpose, so they are not added back:

- Approving or flagging steps, a decided count or a progress bar of decisions: GitHub has Viewed per file and one review at the end.
- A separate verdict, or a Summary of step decisions with "still open" and "decided" states: the Summary shows what will go out, not what was decided.
- AI findings as their own object to accept or reject: an AI comment is a comment.
- A chat with the session on the page, session status words, a session messages page, replies to the human's comments.
- Buttons, labels or tones invented by the session.
- Swipe decks, accent pickers, help sheets and legends.

## Before adding anything

Name the GitHub concept it matches, or the AI job it does, and which of the two goals it serves.
If it needs a new word on the page, find GitHub's word first.
