# Walkthrough: final handoff

The build spec for the Walkthrough review page. It replaces every earlier brief, round and handover. Where a board and this file disagree, this file wins; say so in your PR.

## Paste this into Claude Code

> You are building the final design of the Walkthrough review page in this repository. The design bundle is in `docs/design/` (unzipped from `walkthrough-design-handoff.zip`; it replaces anything that was there). Read `docs/design/HANDOFF.md` first, then `VISION.md`, and work through HANDOFF's "Build order", one pull request per stage. Measurements and tokens are in `DESIGN.md`, every string in `COPY.md`, every state on the boards in `screens.html` (open it in a browser), interaction and motion in `prototype.html`. Where a board and HANDOFF disagree, HANDOFF wins; say so in the PR. Before each PR, check that stage against "Done when". At the end, report anything you could not match, any string over its cap, and any contrast pair under its floor.

## The files

| File | What it is |
|---|---|
| `HANDOFF.md` | This file: decisions, what to remove, what to build, in what order, and when it is done. |
| `VISION.md` | The product in one page. GitHub's pull request review page, made better by AI. Binding, except where a founder decision below differs. |
| `DESIGN.md` | Tokens (light, dark and Colorblind, syntax included, with contrast tables), type, spacing, every component with measurements, motion, word caps. |
| `PRODUCT.md` | Behaviour and the glossary. |
| `COPY.md` | Every string the page shows, with its cap. Anything not in it is removed. |
| `screens.html` | The boards: every state, light and dark, 1440 and 390. Also the source for the desk scene and farewell robot SVG and CSS. |
| `prototype.html` | Clickable reference for interaction and motion (not for decisions 18, 19 and 21 onward; see the table below). |
| `mascot.html` | Walky's page: the figure, expressions, favicons, scenes, README banners and the rules, from the files in `brand/`. |
| `brand/` | The mark, favicons, app icons; the mascot Walky (`brand/mascot/`, light and dark, with a README); README and social banners (`brand/banner/`, with a README and the `<picture>` snippet). |

## Where each decision is drawn

| Decisions | Boards in `screens.html` | In `prototype.html` |
|---|---|---|
| 1 to 11 | Opening a review, Header, Steps and files, A step, Files, Comments and threads, The Summary, After End session, The session isn't running | yes, except 2, 3, the Opening and the lost session |
| 12 to 17 | Changes since your last review, Outdated and resolved, The page is behind the branch | 12 to 14, 16, 17 ("Back after new commits") |
| 18 to 20 | Moved code, The author's screenshot, Keyboard | keys J, K, C, V only |
| 21 | Suggested changes | no |
| 22 to 25 | Colorblind (with the stripe check), Copied code, Comments on a whole file | no |
| 26 to 30 | Syntax colours on every background (with the contrast grid), Code in comments, explanations and answers, A file taking its colours, What stays plain | no |
| 31 to 33 | `mascot.html` (Favicons) for 31 and 32; every board uses the new control edge (33) | no |
| 34 | every board and the prototype use the new accent and fill | yes |
| 35 | Acceptance criteria that say what is missing and where (listed and folded, light, dark, Colorblind, 390) | no |

Boards drawn before decision 26 show plain code; decision 26 colours them too. Decisions 22 to 25 and 27 change features already built in 0.1.5; each says what is built, what is kept and what changes.

## Founder decisions

These override `VISION.md` where they differ.

1. **The final submit happens in the app**, from Submit review on the Summary, not on GitHub.
2. **Replaced by decision 11.** Your own change has no review type.
3. **Viewed resets when a file changes:** when new commits touch a file you marked Viewed, Viewed clears, the file opens again, its tick in the step list goes back to a ring, the files-viewed count in the page header drops, and the file header shows "Changed since last view".
4. **Ask AI stays on the page.** Your "Ask AI: …" question and the AI's answer are not pending, carry no Edit, Delete or `[AI]`, and never go out.
5. **`[AI]` marks only the AI's pending comments**, the ones that go out with the review.
6. **No code host or agent product is named on the page.** "Review submitted", "View review", "on #212", "the agent", "your agent": never "GitHub" or "Claude Code" in a string the page shows.
7. **End session needs no confirm.** The walkthrough, comments and Viewed marks are saved on disk; ending loses nothing.
8. **Submit review posts a finished review**, not a pending one: the session posts it with the chosen type, the summary and every pending comment.
9. **The page opens near the end of the review.** `walkthrough start` does not open the browser; the session opens it with `walkthrough open` once its reviewers have reported, and the Opening (desk scene) plays while it records the comments and criteria.
10. **The Opening lasts until the review is ready**, not until the first step: `walkthrough ready` shows the whole walkthrough at once. "AI reviewing" shows only in the Opening's header; the step spinners and "The AI is still reviewing this step." are not built. If the session stops before ready (once a `walkthrough listen` ran, none alive for 15 seconds), the failure offers the command to start it over with Copy command; there is no Try again, since the page cannot restart a session.
11. **Your own change has no review type.** Its Summary has the summary box and Send to agent, without Comment, Approve or Request changes. Send to agent is disabled with no comments, with the line "Add a comment to send it." This replaces decision 2.

12. **The AI resolves its own comment once the new code fixes it.** On a new head the AI marks its earlier comment resolved, without a reply. The page shows it in GitHub's resolved look ("AI marked this conversation as resolved.", Show resolved); you can open it, reply, or Unresolve conversation. Until your next Submit review the resolve is pending, like a pending comment: its resolved line carries GitHub's "Pending" tag, in its step and under "Resolved conversations" on the Summary. Submit review sends it with the review; then the tag goes and it is resolved for real. On your own change there is no code host: the resolve stays on the page, carries no "Pending", and never goes anywhere.
13. **Back after your review, the page opens on "Changes since your last review"**, GitHub's own switch, in the header after the change's label; "All changes" is the other choice. It shows only when you reviewed an earlier head. Chosen over marking new lines inline: a GitHub reviewer reads the switch without help, while inline marks would need a legend.
14. **In "Changes since your last review"** the step list keeps only files changed since then; a step with nothing new stays, quiet, and says "No changes since your last review." with Show all changes; diffs show only what is new; a new step carries no label (the AI's explanation may say it is new). The files-viewed count stays over all files.
15. **When the branch moves and nobody runs the walkthrough again**, one line under the header on every screen says "The branch has new commits. Run the walkthrough again to see them:" with the command and Copy command. The page never catches up by itself. Submit review still works and reviews the head on screen. Drawn for your own branch (`/walkthrough`); for a pull request, how the page learns that the branch moved is still open, so that case is not drawn.
16. **Outdated comments** move to the top of their file with GitHub's "Outdated" and the lines they were written on. On the Summary their row keeps a link, now to that thread, and shows "Outdated". Pending ones keep Edit and Delete.
17. **The Summary lists conversations the AI resolved** under "Resolved conversations", one row each with its link and, until Submit review, "Pending", since those resolves go out with the review (decision 12).
18. **Moved code** shows once, where it arrives, under "Moved from …", on the surface tone with no + or −; where it left, one row says "N lines moved to …"; the two link to each other. Lines changed while moving stay a deletion and an addition.
19. **The author's screenshot** sits on the step the AI places it on, under the explanation: 240 × 156 closed, the width of the step (up to 960) open, in place, never a lightbox; the caption is the author's alt text. A step without one is unchanged. A screenshot the AI cannot place on a step is shown nowhere.
20. **Keys follow GitHub where it has them:** J and K for the next and previous file (through the steps in reading order), C for the changes switch; V toggles Viewed and Esc closes. No list of keys and no ? sheet: a key shows only in the tooltip of the control it presses, in brackets, as Finish review already does with "Go to the Summary (G S)": "Viewed (V)", "Changes since your last review (C)".
21. **Suggested changes, shown but never applied.** The AI may write a fix as GitHub's suggestion block when it fits in a few lines on the lines it commented; otherwise it says it in a sentence (one line in the review policy, see `DESIGN.md` → Words). The page shows the block inside the comment as GitHub's "Suggested change": the commented lines as deleted, the suggestion as added, in the diff tokens. It is part of the comment: Edit and Delete while pending, its row on the Summary, out with Submit review. The page has no Apply or Commit button: applying changes the branch, which is the author's act, not the reviewer's, and would reach the code host before the human submits (principle 7). On a pull request the author commits it there; on your own change Send to agent carries it and the agent applies it. Not in this decision: letting the reviewer insert a suggestion of their own.

22. **Colorblind.** *Built in 0.1.5:* a "Colour-blind diff" checkbox in the menu's Theme group that turns added and removed lines blue and orange, and also the Opening's counts and the desk scene's code bars. *Kept:* a checkbox in the Theme group, so it works with System, Light and Dark. *Changed:* it is named with GitHub's word, "Colorblind" (GitHub's spelling), and it swaps the whole green and red pair wherever it appears, through the `ok`/`bad` and diff tokens: diff washes and gutters, the overview stripe, +/− counts in file headers and the Opening, the desk scene, suggestion blocks, criteria icons and words, and the submitted note. Values are GitHub's Protanopia and Deuteranopia palette, with the gutters adjusted in light and dark so muted line numbers reach 4.5:1 (`DESIGN.md` → Colors → Colorblind). Amber stays. Tritanopia is not offered.
23. **The overview stripe meets 3:1.** *Built:* marks at 55% (added) and 60% (removed) opacity, 1.8:1 and 2.4:1 against the stripe in light. *Changed:* full colour in every palette (3.3:1 and 4.4:1 light, 7.1:1 and 6.2:1 dark, 4.7:1 or more with Colorblind). While there, `diff-del-gutter` light moved from #f6d6d3 to #f7d9d6 so muted line numbers reach 4.5:1 on removed lines (they were 4.49:1).
24. **Copied code.** *Built:* "Copied from `<file>` line N" above a run of added lines. *Kept:* the lines stay additions, + and green, since the source still exists and the copy is new code to review; that is what tells a copy from a move (no + or −, a source row). *Changed:* the label gives the source's range ("Copied from tests/tasks.test.ts lines 20–23"; in the same file "Copied from lines 4–6") and links to it; a 2px muted rule runs from the label down the copied lines and turns under the last one, so the end of the copy shows when more additions follow; at 390 the label shows the file name only, the whole label in its tooltip. "Moved from" takes the same shape: a range, and the file name only at 390. Copies show only for unchanged runs, as built.
25. **Comments on a whole file.** *Built:* an icon button "Comment on this file" after Viewed; file threads in a band above the diff, under outdated threads; the Summary row names the file with no line; no suggested change (decision 21). *Kept:* the button and its place (GitHub's), the band, the Summary row, no suggestion. *Changed:* in the band, file threads come first and outdated threads after them, since a file thread is about the code on screen; the composer opens at the top of the band, under the button, which shows pressed while it is open; the AI may comment on a file, with [AI] and Pending like its line comments (the review policy may use it for something no single line holds, such as a missing test); the Summary row's tooltip gives the full path; file threads count in the file's comment count.

26. **Syntax colours, GitHub's, made to read on every background.** Code is coloured with Shiki's github-light and github-dark, each file highlighted whole (the old and new versions each as one piece of code). The page tokenizes with both themes and maps each theme colour to a syntax token, written as a class, so there is no inline style (CSP) and the page's values apply. Where GitHub's colour falls under 4.5:1 on a background code sits on, the token moves in its own hue just far enough: in light comment, keyword, constant, tag and variable (variable from 2.4:1 to 4.5:1); in dark comment (2.2:1 to 4.5:1), keyword and entity. String, regexp and invalid keep GitHub's values, and so do constant, tag and variable in dark and entity in light. Values and every ratio: `DESIGN.md` → Colors → Syntax. Bold, italic and underline from the themes are dropped. Colorblind keeps the syntax tokens. Not coloured: hunk headers, line numbers, inline code, paths.
27. **Changed words keep their wash, lighter.** *Built in 0.1.5:* diff2html's word marks in `diff-add-word` / `diff-del-word`, at GitHub's values (light #b9e5c6 / #f4c4bf, dark #1f4a2e / #5a2626, Colorblind dark #26508a / #764223). *Kept:* the marks, square, under the code. *Changed:* lighter in light and less deep in dark (`DESIGN.md` → Colors), because on the built values GitHub's comment colour falls to 2.1:1 (dark) and 1.7:1 (Colorblind dark), and lifting every token to 4.5:1 there would turn comments and keywords nearly white. They still sit 1.2 to 1.4:1 from their line wash. They come from the diff, so they show while a file is still plain.
28. **Code blocks, GitHub's fenced markdown,** in comments, explanations and answers: coloured by the language the fence names, plain with no language, on the surface tint. Suggested changes and an outdated thread's quoted code are coloured as their file. The review policy keeps blocks to 6 lines, only when the point is code (`DESIGN.md` → Words).
29. **Colours never hold the page and never move.** During the Opening the page highlights the first step's files, so the walkthrough arrives coloured; the other files are highlighted in reading order behind the page. A file reached before its colours shows plain and takes them in place in one frame: no fade, no spinner, no word, no layout change, under reduced motion the same.
30. **What stays plain:** a line over 1,000 characters (as on GitHub), a file in a language Shiki does not know, a code block whose fence names none. Nothing on the page says so.

31. **The tab's favicons are readable at 16px.** *Built:* closed eyes (asleep) and happy arcs (done) were 2.2-unit strokes on the 32 grid, about 1px at 16px. *Changed:* every eye is at least 2px at 16px: asleep's closed eyes are filled bars (6.5 × 4), done's arcs are 3 units thick and further apart. Files: `brand/mascot/favicon-*.svg`.
32. **A session that ended with nothing sent has its own favicon, "ended".** *Built:* the tab showed "done" for any ended session, because "awake" would claim a session is still running. *Changed:* "done" (happy arcs) only when something went out; "ended" (two round dot eyes, the farewell's "nothing sent" face) when nothing did. The tab: Opening → reading; running → awake; session isn't running (or the Opening failed) → asleep; ended after Submit review or Send to agent → done; ended with nothing sent → ended. File: `brand/mascot/favicon-ended.svg`.
33. **Control edges clear 3:1 on every grey.** *Built:* control borders at #8390a3 / #5e6a7a, 3:1 on canvas and surface but 2.8 and 2.7:1 on the surface tint used for hover and pressed. *Changed:* `control-edge` is GitHub's emphasis border, light #818b98, dark #6e7681: 3.0 to 3.5:1 (light) and 3.2 to 3.9:1 (dark) on canvas, surface, surface tint and picked lines. One value for every control, so none needs a second border token wherever it sits.

34. **The accent, toned down.** *Built:* Ultramarine #2433b8 in light (as saturated as the hue gets at that depth) and, in dark, the primary button filled with the bright #8c97ff and dark text, the brightest thing on the page. *Changed:* light Ultramarine and its text tone become #2d3a9e (hover #252f85). Dark keeps #8c97ff and #a9b1ff for rings, the caret, links and marks, but the three filled things (the primary button, your avatar and the gutter "+") take new fill tokens, #4f5bd5 with hover #5b67e0 and white text (5.5:1 and 4.7:1). In light the fill tokens equal Ultramarine. The mark, favicon and app icons follow (`brand/`).

35. **Acceptance criteria say what is missing and where.** *Built:* each criterion showed an icon, the ticket's words and a status word, in the ticket's order, linking nowhere; "Partly met" said neither what nor where. *Kept:* the section, its place and note, the icons, words and colours, read-only rows. *Changed:* rows go not met, partly met, not checked, met. A partly or not met row links to the AI comment that says how to close the gap (on its lines, or on its file) and adds what is missing in at most 12 words; the comment holds the fix and the row never repeats it. A met row links to the lines that meet it, opening them as "Look at" does. A not checked row says why in at most 8 words. Met rows stay listed, not folded. The session records, per criterion: status, the comment it links or the line range, the missing line, the reason. `DESIGN.md` → Summary; `COPY.md` → Summary.

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

- **Header (44px):** mark · the change's label (a PR as `#212` in secondary ink plus the title in sans 600; a branch in mono) · "N / M files viewed" with a 72px bar · Finish review · menu (Theme, End session). "AI reviewing" and its spinner show only in the Opening (decision 10). At 390: mark, steps button, "N / M", Finish (hidden on the Summary), menu.
- **Step list (248px, left):** the AI's steps in reading order; under each, its files with a Viewed tick and a comment count; Summary last with the count of pending comments (comments only, not resolved conversations). No spinners (decision 10). At 390 it opens over the page from the steps button and closes when you pick a step.
- **A step:** title (20px), "Look at:" with one or two pointers, one or two sentences with More, its files, then previous and next named by the steps' titles. Every step is complete when it appears (decision 10).
- **Look at:** `{file, start, end, label}`, label 2–4 words. Click opens the file if folded, scrolls the range into view with 120px above, flashes it in the line-pick tone.
- **Files:** GitHub's header in a bordered box: chevron, path, +/−, comment count, Viewed, Comment on this file (decision 25: file threads first in the band above the diff, then outdated ones; the composer at its top). Viewed folds the file. A generated file arrives folded with one line saying why. After new commits: "Changed since last view" (decision 3).
- **Syntax colours (decisions 26 to 30):** Shiki with github-light and github-dark, run off the main path (a worker or idle time) so it never holds a paint. Tokenize each file version whole with both themes (`codeToTokens` with `themes: {light, dark}`) and map each token's colour pair to a class; never write Shiki's inline styles. The pairs (light|dark → class → token): `#6A737D|#6A737D` → `sx-c` comment; `#D73A49|#F97583` → `sx-k` keyword; `#005CC5|#79B8FF` → `sx-n` constant; `#6F42C1|#B392F0` → `sx-e` entity; `#22863A|#85E89D` → `sx-t` tag; `#032F62|#9ECBFF` → `sx-s` string; `#032F62|#DBEDFF` → `sx-r` regexp; `#E36209|#FFAB70` → `sx-v` variable; `#B31D28|#FDAEB7` → `sx-x` invalid; `#24292E|#E1E4E8` and anything else → no class (ink). Drop font styles. Split diff2html's word marks around token spans so both show. Highlight the first step's files during the Opening, then the rest in reading order; a file reached first shows plain and swaps in place. Lines over 1,000 characters and unknown languages stay plain.
- **Diff:** line numbers are buttons; click or Shift-click opens a composer under the line. Gutter bubble for a thread: ink for the AI, accent for you, muted for a colleague. Overview stripe at the right, hidden at 390, marks at full colour (decision 23). Copied lines stay additions under "Copied from … lines N–M" with the muted rule to their last line (decision 24).
- **Changes since your last review (decisions 13, 14):** a small secondary button in the header after the label (branch icon, current choice, chevron) opening a menu with "All changes" and "Changes since your last review", each with a muted count line; shown only when you reviewed an earlier head, and it opens on "Changes since your last review"; C opens it. In that view the step list keeps only changed files; a step with none stays, muted, and its page says "No changes since your last review." with Show all changes; diffs show only what is new. At 390 it is the first row of the main pane.
- **Behind the branch (decision 15):** one line under the header on every screen, with the command and Copy command, for your own branch only. The page never catches up by itself.
- **Outdated and resolved (decisions 12, 16, 17):** outdated threads move to a band at the top of their file with "Outdated" and the lines they were written on; the AI's resolved comments show GitHub's collapsed resolved line with "Pending" until Submit review (none on your own change), Show resolved, and Unresolve conversation; the Summary lists "Resolved conversations".
- **Moved code (decision 18):** a label row "Moved from `<file>` lines N–M" above lines on the surface tone with no + or −, and one row "N lines moved to …" where they left; the two link to each other. At 390 the label shows the file name only (decision 24).
- **Copied code (decision 24):** copied lines stay additions under "Copied from `<file>` lines N–M" (no file name in the same file), linked to the source, with a 2px muted rule from the label to the last copied line.
- **The author's screenshot (decision 19):** on the step the AI places it, under the explanation, 240 × 156 closed, opening in place to the step's width; caption is the alt text; one it cannot place is shown nowhere.
- **Keys (decision 20):** J and K next and previous file through the steps, C the changes switch, V Viewed, Esc closes; each key only in its control's tooltip, in brackets.
- **Comments on a whole file (decision 25):** the "Comment on this file" icon button after Viewed opens the composer at the top of the file's band; file threads first, then outdated ones; no suggested change; the Summary row names the file with no line.
- **Code blocks (decisions 28, 30):** GitHub's fenced blocks in comments, explanations and answers, on the surface tint, coloured by the fence's language, plain with none. Inline code is never coloured.
- **Suggested change (decision 21):** inside a comment, after its text, GitHub's block: a header row "Suggested change", then the commented lines as deletions and the suggestion as additions, with line numbers; no Apply or Commit button. On the Summary the row shows "Suggested change" as a tag before the comment's text; the code shows in its thread.
- **Comments and threads:** one component for everyone. Avatar, name, Pending tag, time, Edit and Delete on pending comments only; body; the foot has Reply, Ask AI, and Resolve on colleagues' threads. Composer: textarea, Ask AI, Cancel, Add comment.
- **Ask AI:** in a thread or on picked lines. Posts "Ask AI: …", shows the AI's avatar, spinner and "Answering…", then the answer as a reply (decision 4). Only Ask AI wakes the AI.
- **Arriving comments never move the page:** a comment landing above or in view is inserted folded and announced by "1 new comment above"; clicking scrolls to it and opens it.
- **Summary ("Finish your review"):**
  - Going out (N): every pending comment, one row each: avatar, `file:line` link (full path as tooltip), text up to two lines, Edit, Delete. At 390 the link sits on its own line. Empty: "No comments. Add one on a line."
  - "N unresolved threads" and "N files not viewed" as links that go there.
  - Acceptance criteria, checked by the AI, read-only (decision 35): not met, partly met, not checked, met; each row an icon, the criterion and its status word, then a link (to the AI comment for a gap, to the lines for met) and what is missing, or why it was not checked.
  - The review box: on a pull request, summary textarea, Comment / Approve / Request changes and Submit review; on your own change, summary textarea and Send to agent, with no review type, disabled with no comments under the line "Add a comment to send it." (decision 11).
  - After sending: the box becomes "Review submitted", one line ("Request changes, with 5 comments, on #212."), View review (opens the posted review) and a quiet End session (text button, no fill); on your own change "Sent to the agent", "N comments. The agent is fixing them; follow along there." and the same quiet End session. "Going out" becomes "Sent" without Edit or Delete; the counts row goes away.
- **Opening (until the review is ready):** the session opens the page near the end of its review (decision 9) and the Opening lasts until `walkthrough ready` (decision 10); see `DESIGN.md` → Components → Opening and the board "Opening a review". The header shows "N files changed", "AI reviewing" with the spinner, and no Finish review; the step list shows "Steps appear here when the AI is done." and three placeholder rows; the main pane shows the desk scene, "Preparing the walkthrough", "The AI is finishing its review, usually within a minute." and the changed files with +/−. When the review is ready the whole walkthrough appears at once. If the session stops first: "The AI couldn't prepare the walkthrough", "It stopped before the review was done. Nothing was posted.", then "Start it over in your agent:" and the command (`/walkthrough:pr <N>` or `/walkthrough`) with Copy command, the farewell's component. There is no Try again: the page cannot restart a session. The page needs only the change's file list (path, additions, deletions), which it already has.
- **The desk scene:** copy the SVG and its CSS from `screens.html` (`.desk6`, keyframes `cd6`, `rh6`, `re6`, `hap6`, `sm6`, `mo6`, `bh6`, `cb6`, `ck6`, `b16`, `b26`, `b36`, `m16`, `m26`; source of truth for timings is the 24s story in `DESIGN.md`). Add the class `rdpause` to its container when `document.hidden` is true or an `IntersectionObserver` reports it offscreen, and remove it when visible again. Remove the scene from the DOM once the walkthrough is shown.
- **The farewell and asleep robot:** the same robot in `screens.html` as `.bye6` (keyframes `wave6`, `zz6`), with the monitor off. Happy eyes when something was sent, dot eyes when nothing was, closed eyes and "z" when the session isn't running.
- **After End session:** End session (from the menu, or the quiet button after sending) stops the server, so before it does, the page swaps itself to the farewell drawn from what it already holds: header with the mark and label only; the robot waving once (happy eyes if something was sent); "Session ended"; one outcome box (Review submitted + View review / Nothing was posted. / Sent to the agent / Nothing was sent to the agent.); "Pick it up again" with the command in mono (`/walkthrough:pr <N>`, or `/walkthrough` for your own change) and Copy command ("Copied" for 2s); "A new commit reopens only the steps that changed."; "You can close this tab." No step list, no links back in. Boards: "After End session".
- **The session isn't running:** when the page loses its server without End session (the agent closed, sleep, a crash), it replaces the old "Could not reach the walkthrough page." banner with the same layout: the robot asleep at its desk, "The session isn't running", a box saying nothing is lost with Try again (reconnects if the session is still there), then "Pick it up again" with the command. Decide it after two failed polls, not on the first. The page keeps polling, so it also comes back by itself when the session answers again. Board: "The session isn't running".
- **The tab's favicon (decisions 31, 32):** the head favicons from `brand/mascot/`, swapped by state: reading during the Opening, awake while the session runs, asleep when it isn't running or the Opening failed, done after the session ends with something sent, ended when it ends with nothing sent.
- **Menu:** Theme (System, Light, Dark, and the Colorblind checkbox, decision 22) and End session. Nothing else.

## 3. Build order

One pull request per stage; each ends with its part of "Done when" passing in light, dark and at 390.

1. **Remove** everything in section 1, with its styles, strings and session fields.
2. **Tokens:** the full light, dark and Colorblind set from `DESIGN.md` (frontmatter and Colors), syntax tokens and word marks included, as CSS custom properties; the theme and Colorblind set from the menu.
3. **The shell:** header, menu, step list, a step, Look at, files with Viewed and Comment on this file, the diff with gutter, stripe, moved and copied code.
4. **Comments:** threads, composer, Ask AI, arriving comments, suggested changes, file threads, code blocks.
5. **The Summary** and submitting, both kinds (pull request and your own change).
6. **Session states:** the Opening with the desk scene, After End session, The session isn't running.
7. **Back on a new head:** Changes since your last review, Viewed reset, outdated and resolved, the behind line.
8. **Syntax colours** (decisions 26 to 30), after the diff is stable.
9. **Screenshot and keys** (decisions 19, 20).
10. **Motion** last, from `prototype.html` and `DESIGN.md` → Motion, then a reduced-motion pass.

## 4. Motion

Port it from `prototype.html`; specs in `DESIGN.md` → Motion. Loops: the dashed checking spinner; the opening desk scene (only until the review is ready, paused when hidden); the asleep robot's "z" on the lost-session screen. The farewell robot waves once and stops. Known rough edges from the last motion review, worth a look while porting: under reduced motion the Viewed fold snaps a second time near the end; a deleted Summary row can jump sideways at the start of its exit.

## 5. Done when

- Nothing from section 1 is on any screen; grep the templates for the strings in `COPY.md` → "Strings to remove".
- Every string is in `COPY.md` and within its cap (`DESIGN.md` → Words).
- You, the AI and a colleague are told apart at a glance by avatar (and `[AI]` on comments that go out), with no legend.
- Posting, an AI reply arriving, or a new AI comment never shifts the line you are reading (test scrolled mid-file).
- Submit review sends one review with the chosen type and every pending comment, from the app; nothing leaves before. Send to agent follows decision 11.
- Viewed resets as in decision 3, and the header count follows.
- No string on the page names a code host or an agent product (decision 6).
- End session shows the farewell before the server stops, with no confirm; losing the server shows "The session isn't running" after two failed polls. Copy command copies the exact command.
- Back on a new head after a review, the page opens on "Changes since your last review"; switching to All changes and back keeps your place and Viewed marks.
- A step with nothing new says so and still lists its files; a file whose diff changed has lost Viewed and says "Changed since last view".
- When the branch moves, the behind line shows on every screen of an open walkthrough (the Opening, steps and the Summary, not the farewell or the lost session) within one poll; nothing else changes until the walkthrough runs again.
- An outdated thread never sits on a line that no longer holds its code; the AI's resolved comments go out with the next Submit review.
- Moved lines appear once, with both ends linked; J, K, C and V work and appear in no list.
- Light and dark at 1440 and 390 match the boards; focus is visible everywhere; 200% zoom does not clip the header; reduced motion keeps opacity and colour only.
- Every coloured token is 4.5:1 or more on its background in light, dark and Colorblind; the page carries no inline style for colours; a file taking its colours moves nothing, and the line you read stays put.
- Every partly or not met criterion links to a comment and says what is missing in 12 words or fewer, never the fix; every met one links to its lines; every not checked one says why in 8 words or fewer.
- In dark, the primary button is a mid-tone fill with white text; no filled accent uses #8c97ff; light Ultramarine is #2d3a9e everywhere, the mark and icons included.
- Every control edge is 3:1 or more against canvas, surface, surface tint and picked lines, at rest, on hover and pressed; each favicon's eyes are at least 2px at 16px, and the tab never shows awake or done after a session that sent nothing.
- With Colorblind on, no green or red is left in the diff, the counts, the stripe or the status colours, in light and dark (syntax colours keep their hues, decision 26); every stripe mark is 3:1 against the stripe.
- A copy's last line is visible without reading line numbers; a copy never looks like a move.
- Comment on this file opens its composer at the top of the file; file threads sit above outdated ones; a file comment's Summary row has no line and goes to the thread.
- A fenced code block is coloured by its language and plain without one; a line over 1,000 characters and a file in an unknown language stay plain, with no label.
- An AI comment with a suggestion shows "Suggested change" with the lines it replaces and the new lines; nothing on the page applies it.

## Not drawn

- Open founder question (decision 35): should a criterion also show on the step whose code meets or misses it, or only on the Summary? Drawn: only on the Summary.
- Under design, not decided: a diagram of the flow on a step (board "Diagram of the flow (design round, not decided)"). Recommended shape: only on a step that crosses three or more parts or branches; collapsible, closed on every step until its one line opens it, and that line closes it again; recorded by the session with the step, each arrow citing a line in the diff; one line naming the parts opens it; arrows link to their lines, the step's own arrows in ink; a branch as an alt box; up to 5 parts and 7 arrows; a numbered list at 390; drawn by the page from data, no Mermaid renderer. Its strings are not in `COPY.md` until it is decided.
- The image diff in this design (keep Diff / Preview on a transparency checker as built).
- The two Send to agent states and "Changed since last view" at 390 (same components, one column).
- The "Copied" state, the farewell with no comments, and "The session isn't running" for your own change (same layout, `/walkthrough`).
- The opening scene was reviewed frame by frame (seeked keyframes), not as a recorded run: check real-time playback, the exit into the whole walkthrough, and pausing when hidden. The farewell wave and the "z" drift have not had a motion review.
- The behind-the-branch line for a pull request: to rethink (decision 15).
- The motion of Show resolved and the screenshot has not had a motion review.
- Not drawn for decisions 22 to 25: Colorblind's effect on the farewell and lost-session screens (the robot is ink only, so nothing changes), a copy of a single line, a file comment on a folded or generated file (same band once it opens), and a resolved colleague file thread (GitHub's collapsed resolved look, as in decision 17).
- Not drawn for decisions 26 to 30: boards before decision 26 in colour (they show plain code), and syntax colours in the prototype.
- Out of scope: a session liveness heartbeat; a Tritanopia palette.
