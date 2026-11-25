# Walkthrough: final handoff

The build spec for the Walkthrough review page. It replaces every earlier brief, round and handover. Where a board and this file disagree, this file wins; say so in your PR.

## Paste this into Claude Code

> You are building the final design of the Walkthrough review page in this repository. Copy `HANDOFF.md`, `VISION.md`, `DESIGN.md`, `PRODUCT.md`, `COPY.md`, `screens.html` and `prototype.html` from the design artifact into `docs/design/`, replacing anything there. Read `HANDOFF.md` first and work through it in order. Report anything you could not match and any string over its cap.

## The files

| File | What it is |
|---|---|
| `HANDOFF.md` | This file: decisions, what to remove, what to build, and when it is done. |
| `VISION.md` | The product in one page. GitHub's pull request review page, made better by AI. Binding, except where a founder decision below differs. |
| `DESIGN.md` | Tokens, type, spacing, every component with measurements, motion, word caps. Sidecar tokens in `.impeccable/design.json` if present. |
| `PRODUCT.md` | Behaviour and the glossary. |
| `COPY.md` | Every string the page shows. Anything not in it is removed. |
| `screens.html` | The boards: every state, light and dark, 1440 and 390. |
| `prototype.html` | Clickable reference for interaction and motion. |

## Founder decisions

These override `VISION.md` where they differ.

1. **The final submit happens in the app**, from Submit review on the Summary, not on GitHub.
2. **Send to agent with no comments** is disabled while Comment is chosen, with the line "Add a comment, or choose Approve or Request changes." Choosing Approve or Request changes enables it. Your own change gets the same three review types as a pull request.
3. **Viewed resets when a file changes:** when new commits touch a file you marked Viewed, Viewed clears, the file opens again, its tick in the step list goes back to a ring, the files-viewed count in the page header drops, and the file header shows "Changed since last view".
4. **Ask AI stays on the page.** Your "Ask AI: …" question and the AI's answer are not pending, carry no Edit, Delete or `[AI]`, and never go out.
5. **`[AI]` marks only the AI's pending comments**, the ones that go out with the review.
6. **No code host or agent product is named on the page.** "Review submitted", "View review", "on #212", "the agent", "your agent": never "GitHub" or "Claude Code" in a string the page shows.
7. **End session needs no confirm.** The walkthrough, comments and Viewed marks are saved on disk; ending loses nothing.
8. **Submit review posts a finished review**, not a pending one: the session posts it with the chosen type, the summary and every pending comment.
9. **The page opens near the end of the review.** `walkthrough start` does not open the browser; the session opens it with `walkthrough open` once its reviewers have reported, and the Opening (desk scene) plays while it records the comments and criteria.
10. **The Opening lasts until the review is ready**, not until the first step: `walkthrough ready` shows the whole walkthrough at once. "AI reviewing" shows only in the Opening's header; the step spinners and "The AI is still reviewing this step." are not built. If the session stops before ready (once a `walkthrough listen` ran, none alive for 15 seconds), the failure offers the command to start it over with Copy command; there is no Try again, since the page cannot restart a session.
11. **Your own change has no review type.** Its Summary has the summary box and Send to agent, without Comment, Approve or Request changes. Send to agent is disabled with no comments, with the line "Add a comment to send it." This replaces decision 2.

Decisions 8 to 11 came after this bundle was drawn: where section 2, `DESIGN.md`, the boards or the prototype differ from them, they win.

## Constraints that do not move

- Plain HTML and CSS, framework-free TypeScript, no component library. diff2html renders diffs, restyled through classes.
- Strict CSP: no inline `style` attributes or inline scripts. CSSOM from the bundle (`el.style.setProperty`, `el.animate`) is fine; `setAttribute('style', …)` is not.
- Tokens only, one semantic set with light and dark values; the theme follows the system unless the menu sets one. One accent, Ultramarine; no accent picker.
- 4px spacing scale (4, 8, 12, 16, 24, 32). 4px control corners.
- WCAG 2.2 AA. Every icon and colour also carries a word (visible, tooltip or accessible name). 44px targets at 390.
- Motion from the one family in `DESIGN.md` → Motion, with a reduced-motion path (opacity and colour only). Start animations in the same task as the click; never start motion from `setTimeout`.
- The page's controls are fixed and the same for everyone; no review rules live in the code. The AI speaks only in threads.
- Fixtures use the sample todo app adding due dates. No real names.

## 1. Remove from the existing page

Delete these, their styles, their strings and the session fields only they read:

- Approve and Flag on steps, the action bar, step decisions, decided counts, "N decided", the progress bar of decisions and its marker, "Undecided", "Changed since you decided", Change and Undo.
- The verdict as its own choice, the header verdict status and its motion.
- The To review queue (states, badges, sub-lines), tool windows, edge stripes, the explanation column, the "In this step" chips.
- The Summary ledger, "Still open", "Decided", "N left · N go out".
- Findings as their own object; note kinds; Accept, Reject, Ignore, "Add to fixes", "Not an issue"; outcomes and consequences.
- Session status words (Listening, Working, Needs you, Gone, Offline), the Session messages page, "The session asks", being-checked notices and held actions, late-finding banners and "new" badges.
- The checklist page and panel, the Met / Partly / Not met control and overriding.
- Files to skim as a step, the swipe deck, Appearance and the accent picker, the Help sheet and every legend, the "Step N of M" line.
- Session fields: action `tone`, `label`, `consequence`, `outcome`, `asks_reason`, `primary`; note `kind`, `needs_decision`.

## 2. Build the page

Measurements are in `DESIGN.md` → Components; strings in `COPY.md`; states on the boards.

- **Header (44px):** mark · the change's label (a PR as `#212` in secondary ink plus the title in sans 600; a branch in mono) · "N / M files viewed" with a 72px bar · "AI reviewing" with the spinner while the AI works · Finish review · menu (Theme, End session). At 390: mark, steps button, "N / M", the spinner alone, Finish (hidden on the Summary), menu.
- **Step list (248px, left):** the AI's steps in reading order; under each, its files with a Viewed tick and a comment count; a spinner on steps the AI has not finished; Summary last with the pending count. At 390 it opens over the page from the steps button and closes when you pick a step.
- **A step:** title (20px), "Look at:" with one or two pointers, one or two sentences with More, its files, then previous and next named by the steps' titles. While the AI has not finished the step: "The AI is still reviewing this step." with the spinner.
- **Look at:** `{file, start, end, label}`, label 2–4 words. Click opens the file if folded, scrolls the range into view with 120px above, flashes it in the line-pick tone.
- **Files:** GitHub's header in a bordered box: chevron, path, +/−, comment count, Viewed. Viewed folds the file. A generated file arrives folded with one line saying why. After new commits: "Changed since last view" (decision 3).
- **Diff:** line numbers are buttons; click or Shift-click opens a composer under the line. Gutter bubble for a thread: ink for the AI, accent for you, muted for a colleague. Overview stripe at the right, hidden at 390.
- **Comments and threads:** one component for everyone. Avatar, name, Pending tag, time, Edit and Delete on pending comments only; body; the foot has Reply, Ask AI, and Resolve on colleagues' threads. Composer: textarea, Ask AI, Cancel, Add comment.
- **Ask AI:** in a thread or on picked lines. Posts "Ask AI: …", shows the AI's avatar, spinner and "Answering…", then the answer as a reply (decision 4). Only Ask AI wakes the AI.
- **Arriving comments never move the page:** a comment landing above or in view is inserted folded and announced by "1 new comment above"; clicking scrolls to it and opens it.
- **Summary ("Finish your review"):**
  - Going out (N): every pending comment, one row each: avatar, `file:line` link (full path as tooltip), text up to two lines, Edit, Delete. At 390 the link sits on its own line. Empty: "No comments. Add one on a line."
  - "N unresolved threads" and "N files not viewed" as links that go there.
  - Acceptance criteria, checked by the AI, read-only: icon, criterion, Met / Partly met / Not met / Not checked.
  - The review box: summary textarea, Comment / Approve / Request changes, Submit review (pull request) or Send to agent (your own change, decision 2).
  - After sending: the box becomes "Review submitted", one line ("Request changes, with 5 comments, on #212."), View review (opens the posted review) and a quiet End session (text button, no fill); on your own change "Sent to the agent", one line, and the same quiet End session. "Going out" becomes "Sent" without Edit or Delete; the counts row, "AI reviewing" and the step spinners go away.
- **Opening (before the first step):** see `DESIGN.md` → Components → Opening and the board "Opening a review". The header shows "N files changed", "AI preparing steps" and no Finish review; the step list shows the line "Steps appear here as the AI writes them." and three placeholder rows; the main pane shows the desk scene, "Preparing the walkthrough", one sentence, and the changed files with +/−. As soon as the first step exists it replaces all of this; later steps join the list as the AI writes them. If preparing fails: "The AI couldn't prepare the walkthrough", one sentence, Try again, then the command (`/walkthrough:pr <N>` or `/walkthrough`) with Copy command, the same component as the farewell's "Pick it up again". The page needs only the PR's file list (path, additions, deletions), which it already has.
- **The desk scene:** copy the SVG and its CSS from `screens.html` (`.desk6`, keyframes `cd6`, `rh6`, `re6`, `hap6`, `sm6`, `mo6`, `bh6`, `cb6`, `ck6`, `b16`, `b26`, `b36`, `m16`, `m26`; source of truth for timings is the 24s story in `DESIGN.md`). Add the class `rdpause` to its container when `document.hidden` is true or an `IntersectionObserver` reports it offscreen, and remove it when visible again. Remove the scene from the DOM once the first step is shown.
- **The farewell and asleep robot:** the same robot in `screens.html` as `.bye6` (keyframes `wave6`, `zz6`), with the monitor off. Happy eyes when something was sent, dot eyes when nothing was, closed eyes and "z" when the session isn't running.
- **After End session:** End session (from the menu, or the quiet button after sending) stops the server, so before it does, the page swaps itself to the farewell drawn from what it already holds: header with the mark and label only; the robot waving once (happy eyes if something was sent); "Session ended"; one outcome box (Review submitted + View review / Nothing was posted. / Sent to the agent / Nothing was sent to the agent.); "Pick it up again" with the command in mono (`/walkthrough:pr <N>`, or `/walkthrough` for your own change) and Copy command ("Copied" for 2s); "A new commit reopens only the steps that changed."; "You can close this tab." No step list, no links back in. Boards: "After End session".
- **The session isn't running:** when the page loses its server without End session (the agent closed, sleep, a crash), it replaces the old "Could not reach the walkthrough page." banner with the same layout: the robot asleep at its desk, "The session isn't running", a box saying nothing is lost with Try again (reconnects if the session is still there), then "Pick it up again" with the command. Decide it after two failed polls, not on the first. The page keeps polling, so it also comes back by itself when the session answers again. Board: "The session isn't running".
- **Menu:** Theme (System, Light, Dark) and End session. Nothing else.

## 3. Motion

Port it from `prototype.html`; specs in `DESIGN.md` → Motion. Loops: the dashed checking spinner; the opening desk scene (only until the first step, paused when hidden); the asleep robot's "z" on the lost-session screen. The farewell robot waves once and stops. Known rough edges from the last motion review, worth a look while porting: under reduced motion the Viewed fold snaps a second time near the end; a deleted Summary row can jump sideways at the start of its exit.

## 4. Done when

- Nothing from section 1 is on any screen; grep the templates for the strings in `COPY.md` → "Strings to remove".
- Every string is in `COPY.md` and within its cap (`DESIGN.md` → Words).
- You, the AI and a colleague are told apart at a glance by avatar (and `[AI]` on comments that go out), with no legend.
- Posting, an AI reply arriving, or a new AI comment never shifts the line you are reading (test scrolled mid-file).
- Submit review sends one review with the chosen type and every pending comment, from the app; nothing leaves before. Send to agent follows decision 2.
- Viewed resets as in decision 3, and the header count follows.
- No string on the page names a code host or an agent product (decision 6).
- End session shows the farewell before the server stops, with no confirm; losing the server shows "The session isn't running" after two failed polls. Copy command copies the exact command.
- Light and dark at 1440 and 390 match the boards; focus is visible everywhere; 200% zoom does not clip the header; reduced motion keeps opacity and colour only.

## Not drawn

- The theme menu open, and the image diff in this design (keep Diff / Preview on a transparency checker as built).
- The two Send to agent states and "Changed since last view" at 390 (same components, one column).
- The prototype does not act out decisions 2 and 3, the opening or the lost session; it does act out End session after Submit review (the farewell) and Copy command.
- The "Copied" state, the farewell with no comments, and "The session isn't running" for your own change (same layout, `/walkthrough`).
- The opening scene was reviewed frame by frame (seeked keyframes), not as a recorded run: check real-time playback, the exit into the first step, and pausing when hidden. The farewell wave and the "z" drift have not had a motion review.
- Out of scope: a session liveness heartbeat.
