# Walkthrough: implementation handoff

For the agent implementing this design in the existing build. Read in this order: this file, then `DESIGN.md` (the system, as built plus this round), `PRODUCT.md` (behaviour, glossary), then the boards in `screens.html` and the interactions in `prototype.html`. The boards are the visual reference. Where this file and a board disagree, this file wins; say so in your PR.

## Constraints that do not move

- Plain HTML and CSS, framework-free TypeScript, no component library. diff2html renders diffs, restyled through classes.
- Strict CSP: no inline `style` attributes or inline scripts in markup. Setting styles via CSSOM from your bundled script (`el.style.setProperty`, `el.animate`) is fine; `setAttribute('style', …)` is not.
- Tokens only. Every colour is a semantic token with light and dark values (`DESIGN.md` → Colors, sidecar `.impeccable/design.json`). The accent family (`--acc`, `--acc-tx`, `--acc-bg`, `--acc-line`, `--acc-hover`, `--on-acc`) can be re-pointed per person (Ultramarine default, Petrol, Berry).
- Spacing on the 4px scale (4, 8, 12, 16, 24, 32). 4px control corners.
- WCAG 2.2 AA. Every icon and colour also carries words: a visible label, a tooltip, or both.
- Motion: 120 / 200 / 320ms, ease-out `cubic-bezier(0.16,1,0.3,1)` arriving, ease-in `cubic-bezier(0.7,0,0.84,0)` leaving, one 440ms authored moment (the verdict). Every animation has a `prefers-reduced-motion` path: opacity and colour only.
- Sample data in tests and fixtures stays the todo app adding due dates. No real names.

## Work items, in suggested order

### 1. Plain words (copy only, do this first)

Replace on-page strings. Internal names in code and data stay as they are.

| Find | Replace |
|---|---|
| `3/9` beside the progress bar | `Step 4 of 9 · 3 decided`; on the Summary `Summary · 7 decided` |
| Session status `Listening` etc. | Prefix a muted `Session` (desktop only; dropped at 390px) |
| `Stop` / `Stop Walkthrough` | `End session` |
| `Reopened`, `Reopened: changed since you chose X` | `Changed since you decided` (queue sub-line, tag); `Changed since you chose X.` (step); `Changed` (Summary decision column) |
| `Folded files` (step title, queue, export) | `Files to skim` |
| `1 assumption` / `Assumed, not read` | `1 thing assumed, not checked` / `Assumed, not checked` |
| `Detached` | `Notes on removed code` |
| `From the session` (queue row) | `Session messages` |
| `Hand fixes to the author` | `Send the fix list to the session` |
| `[AI] drafts` (Summary heading) | `Comments the session drafted` (the `[AI]` prefix on posted text stays) |
| `Ask about this step… ( / )` | `Ask about this step…` (key goes in the tooltip) |
| Checklist edge `Checklist 2/5` | `Checklist 2 of 5 met` |

Full glossary: `PRODUCT.md` → Plain words.

### 2. Remove the tool panel

- Delete the tool panel, its bottom strip (`Notes / From the session / Detached`), and key 4. Panels are To review, Checklist and Explanation on keys 1 to 3; update tooltips, the shortcut list and the phone More menu.
- Notes on removed code and session messages move to the **Session messages** page (a queue row). Its sub-line counts both: `1 file not in a step · 2 on removed code`. Page order: the changed-files-not-in-a-step notice, `From the session N`, `Notes on removed code N` (each item: label, `was on <file> line N` muted, the old line in mono, the note text; your own comments keep the accent label).
- Board: Screens → No tool panel.

### 3. Stepper (header progress)

- Current step segment: solid ink (`--tx`), 9px tall against 5px, 2px corners, regardless of the step's state. Bar uses `align-items:center`.
- Other segments: decided `--acc`, read `--seg-read`, not read `--line`, changed-since-decided `--amb`.
- Each segment has a tooltip: `6 Overdue styling: not read yet`.
- Text beside it: `Step N of M · D decided` / `Summary · D decided`, `white-space:nowrap`.
- At 390px: the bar runs full width under the header; `D decided` sits right of the step picker.
- Motion: a single absolutely positioned ink marker walks to the current segment (`transform: translateX(i × (segment width + 3px))`, 320ms ease-out). Segment fills are pseudo-elements scaling X from the left (read: grey `::before`, decided: accent `::after`, 320ms). After a decision the marker waits 180ms so the fill reads first. On the Summary the marker fades out. Reduced motion: marker snaps, fills fade.
- Boards: Screens → The stepper shows where you are. Interaction: Prototype.

### 4. Summary: ledger plus Finish rail

Replace the stacked sections (Still open / Verdict / Decided table / Flagged / Your comments / Checklist).

- Head: `Summary` + `N still open` state, then one 14.5px count line.
- Grid: `minmax(0,1fr) 288px`, 32px gap, max 1080px. At 390px one column, rail under the ledger behind a top rule.
- **Ledger** (one `<table>`, two `<tbody>` groups: `Still open N`, `Decided N`): number (muted, tabular), state icon, title link (13.5px 500), decision in words at the right (`Approve`/`Flag` secondary ink; `Undecided`/`Being checked` muted; `Changed` amber). Under the title at 13px: the flag note in quotes; your own comments in accent text with the person icon and muted mono `file:line`; why it is open. Review requests add `Comments the session drafted` under the ledger.
- **Finish rail** (sticky, 1px left rule, 24px padding): `Verdict`, `No verdict yet.` / `Your verdict: <label>`, the session's verdict options stacked full width as radios, the primary finishing action (disabled until a verdict), any secondary action, a 12.5px hint naming what goes where, then the checklist (compact).
- Boards: Screens → Summary step (own change and review request, with and without verdict, 390px) and Being checked → Summary.

### 5. Help sheet

- `?` or More → `Help: what things mean`. Three columns: queue icons in words; progress-bar colours and the ink marker; note labels (Finding, Note, Thread, Your comment); session statuses; then keyboard shortcuts.
- Board: Screens → Help: what things mean.

### 6. Round 3 states

- **Being checked:** neutral notice under the title with the dashed not-checked icon (`The session is still checking this step. Findings may still arrive.`); queue sub-line `Being checked` (muted, never amber); Approve and Flag disabled with hint `Decide once the session has checked this step.` (Ask and line comments stay live; A, F and swipe decide nothing); Summary lists it as `Being checked`.
- **Late finding:** amber banner under the header (`New finding on step 8, <title>, which you approved.` / `3 new findings on steps 3 and 8.`) with `Go to step` and a dismiss; the decided step returns to the queue with its decided icon and amber `New finding`. On the step itself (new): an amber-wash line under the title (`A finding arrived after you approved. Your decision stays; change it if the finding matters.`), the note labelled `line N · new since you approved`, and an action bar of `Change decision`, Ask, and amber `1 new finding`.
- **Files to skim** (folded step): collapsed summary line (chevron, `18 files` never wrapping, distinct reasons joined by ` · ` with one ellipsis, problem tag); problems shown under it even when collapsed; opened, a grid of path (max 45%) / reason (wraps) / Show diff; at 390px the reason goes under the path. Insert `<wbr>` after `/` in paths so they break cleanly. Export lists every file open with path, reason and diff; images read `Binary image · W × H · replaced`.
- **File headers:** on surface tint under a control-edge rule, each file after the first 32px below the one before it, opened or collapsed (this replaced the flush headers first drawn here; DESIGN.md has it).
- **Notes:** the note block is `max-width: 66ch`; its actions are buttons under its text beside Reply on step notes, line notes and notes on Files to skim (this replaced the `…` menu first drawn here; DESIGN.md has it).

### 7. Motion (see `prototype.html`; specs in `DESIGN.md` → Motion)

| Interaction | Normal | Reduced |
|---|---|---|
| Decide (Approve/Flag) | Row lifts as a chip (clone, float shadow) and travels into `N decided` (320ms ease-out, opacity held to 75% then linear out); original row hides (60ms); rows below close (height 320ms after 120ms); `N decided` flashes surface tint (200ms after 240ms); its new count fades in after 240ms (WAAPI `fill:'backwards'`, no timers) | Row fades 200ms, then snaps shut; no chip |
| Verdict | Chosen label flies as a chip into the header verdict slot (transform 440ms ease-out; opacity held to 62% then linear out); slot fades in over the same 62–100% window; on a change the old label fades under it and the slot width eases | Slot fades in; old label out then new in |
| Hide/show To review | Contents fade 100ms, width collapses 200ms after 60ms, edge button fades in after 200ms; show reverses with width 320ms | Contents fade, width snaps |
| File collapse / Viewed | Grid rows: open 320ms, close 200ms after an 80ms content fade; chevron rotates 90° in 120ms; Viewed folds the file and reveals the `Viewed` label | Content fades, rows snap |
| Pane swap | Old pane leaves to −12px (100ms), new enters from +12px (200ms after 100ms); the leaving pane collapses with a 1ms animation at 100ms, not a timer | Fades only |
| Popovers | Open 120ms fade + 200ms settle from 4px up at 98% scale, from the opener's corner; close 80ms ease-in | Fade only |
| Accent change | Registered `@property` colours cross-fade 320ms | Same |

Rules learned in review: start every animation in the same task as the click (no `setTimeout` to begin motion); keep the leaving element painted until its exit ends; give layout transitions explicit selectors so broader `transition` rules don't override them.

## Done when

- Every string in item 1 is gone from the page (grep the templates).
- No element relies on colour or an icon alone; Help lists every icon and colour used.
- Light and dark, 1440 and 390, match the boards; keyboard focus is visible everywhere; 200% zoom does not clip the header.
- Each motion row above works in both normal and reduced motion, and repeated or interrupted clicks don't stack ghosts or leave rows half-collapsed.

## Known open items

- Kind label: the boards show an icon; as built it has none (ADR 0005). Keep it icon-less.
- Not drawn: the swipe deck while a step is being checked, Session messages in the export, the Help sheet at 390px.
- Not re-reviewed after the last change: the ink stepper marker's motion, and the decided count waiting for the chip.
