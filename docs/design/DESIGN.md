---
name: Walkthrough
description: A local, step-by-step code review page driven by a Claude Code session; the category-standard review layout at IDE density, signed with a walked W in Ultramarine.
colors:
  canvas: "#ffffff"
  surface: "#f6f7f9"
  surface-tint: "#eef0f3"
  rule: "#dde1e6"
  rule-soft: "#e9ecef"
  control-edge: "#d0d5dc"
  ink: "#1d2126"
  ink-secondary: "#3a4048"
  muted: "#5b636d"
  ultramarine: "#2433b8"
  ultramarine-hover: "#1b2896"
  ultramarine-text: "#2433b8"
  ultramarine-wash: "#eceefc"
  ultramarine-line: "#d3d7f7"
  on-ultramarine: "#ffffff"
  icon-knockout: "#ffffff"
  amber: "#8a5a00"
  ok: "#1a7340"
  ok-wash: "#e4f4ea"
  bad: "#b3261e"
  bad-wash: "#fbe7e5"
  amber-wash: "#fbf1dc"
  diff-add: "#e8f6ec"
  diff-add-gutter: "#d3eedc"
  diff-del: "#fcebea"
  diff-del-gutter: "#f6d6d3"
  stripe-add: "#3c9a5f"
  stripe-del: "#c8473b"
  line-pick: "#eef0fd"
  line-pick-gutter: "#d9ddf8"
  canvas-dark: "#15181d"
  surface-dark: "#1b1f25"
  surface-tint-dark: "#232830"
  rule-dark: "#2c323b"
  rule-soft-dark: "#252a32"
  control-edge-dark: "#3a414b"
  ink-dark: "#e5e8ec"
  ink-secondary-dark: "#c3c8cf"
  muted-dark: "#9aa2ac"
  ultramarine-dark: "#8c97ff"
  ultramarine-hover-dark: "#a3abff"
  ultramarine-text-dark: "#a9b1ff"
  ultramarine-wash-dark: "#1e2346"
  ultramarine-line-dark: "#333b70"
  on-ultramarine-dark: "#0b0f2e"
  icon-knockout-dark: "#15181d"
  amber-dark: "#e3b260"
  ok-dark: "#5fd38d"
  ok-wash-dark: "#15301f"
  bad-dark: "#ff8a80"
  bad-wash-dark: "#3b1a18"
  amber-wash-dark: "#33280f"
  diff-add-dark: "#14281c"
  diff-add-gutter-dark: "#193423"
  diff-del-dark: "#33191a"
  diff-del-gutter-dark: "#3f1f20"
  stripe-add-dark: "#4fbf7a"
  stripe-del-dark: "#ef7e6f"
  line-pick-dark: "#1d2242"
  line-pick-gutter-dark: "#2a3263"
typography:
  headline:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "19px"
    fontWeight: 650
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  title:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "17px"
    fontWeight: 650
    lineHeight: 1.4
  body:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.6
  body-note:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.55
  body-ui:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.4
  label:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "12.5px"
    fontWeight: 600
    lineHeight: 1.4
  meta:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.4
  code:
    fontFamily: "'JetBrains Mono', ui-monospace, monospace"
    fontSize: "12.5px"
    fontWeight: 400
    lineHeight: "21px"
  mono-label:
    fontFamily: "'JetBrains Mono', ui-monospace, monospace"
    fontSize: "12.5px"
    fontWeight: 500
    lineHeight: 1.4
rounded:
  hairline: "2px"
  control: "4px"
  sm: "5px"
  md: "6px"
  lg: "7px"
  xl: "8px"
  pill: "999px"
spacing:
  s1: "4px"
  s2: "8px"
  s3: "12px"
  s4: "16px"
  s5: "24px"
  s6: "32px"
components:
  button-primary:
    backgroundColor: "{colors.ultramarine}"
    textColor: "{colors.on-ultramarine}"
    rounded: "{rounded.control}"
    padding: "0 12px"
    height: "30px"
  button-primary-hover:
    backgroundColor: "{colors.ultramarine-hover}"
  button-primary-active:
    backgroundColor: "{colors.ultramarine-hover}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0 12px"
    height: "30px"
  button-secondary-hover:
    backgroundColor: "{colors.surface-tint}"
  button-ghost:
    textColor: "{colors.ink-secondary}"
    rounded: "{rounded.control}"
    padding: "0 12px"
    height: "30px"
  button-small:
    rounded: "{rounded.control}"
    padding: "0 8px"
    height: "26px"
  button-touch:
    height: "44px"
  icon-button:
    textColor: "{colors.muted}"
    rounded: "{rounded.control}"
    padding: "4px"
  input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0 11px"
    height: "30px"
  textarea:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.md}"
    padding: "9px 11px"
    height: "84px"
  select:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.md}"
    padding: "0 30px 0 8px"
    height: "34px"
  pending-tag:
    textColor: "{colors.amber}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
  counter:
    backgroundColor: "{colors.surface-tint}"
    textColor: "{colors.muted}"
    rounded: "{rounded.pill}"
    padding: "0 8px"
  chip-file:
    backgroundColor: "{colors.surface-tint}"
    typography: "{typography.mono-label}"
    rounded: "{rounded.sm}"
    padding: "0 8px"
  step-link:
    textColor: "{colors.ultramarine-text}"
    rounded: "{rounded.control}"
    padding: "0 4px"
  header:
    height: "44px"
    padding: "0 16px"
  file-header:
    backgroundColor: "{colors.canvas}"
    height: "36px"
  viewed-toggle:
    textColor: "{colors.muted}"
    rounded: "{rounded.control}"
    padding: "4px 6px"
  viewed-toggle-pressed:
    backgroundColor: "{colors.surface-tint}"
    textColor: "{colors.ink-secondary}"
  overview-stripe:
    backgroundColor: "{colors.surface}"
    width: "10px"
  gutter-marker:
    size: "16px"
  your-comment:
    backgroundColor: "{colors.ultramarine-wash}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "12px 16px"
  add-comment:
    backgroundColor: "{colors.ultramarine}"
    textColor: "{colors.on-ultramarine}"
    rounded: "{rounded.sm}"
    size: "20px"
  popover:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.md}"
    padding: "16px"
  ask-row:
    backgroundColor: "{colors.ultramarine-wash}"
    padding: "8px 12px 8px 116px"
---

# Design System: Walkthrough

## Overview

**Creative North Star: "The Quiet Instrument"**

`VISION.md` is binding: Walkthrough is GitHub's pull request review page, made better by AI. The layout is GitHub's arrangement in this system's materials: a 44px header, the AI's steps with their files on the left where GitHub has its file tree, the open step on the right with its files, diffs and threads, and a Summary that is GitHub's "Finish your review" made visible.

Density is IDE density: controls 30px tall with 4px corners, interface text at 12.5 to 13px, the step title at 20px, every number tabular. The page says little; the diff, the threads and the AI's short explanation carry the screen.

It borrows GitHub's concepts and words, not its look: no header bands, tab strips or avatar timelines, and never the terminal costume.

**Key Characteristics:**
- GitHub's concepts in GitHub's words: Viewed, line comments, threads, Reply, Resolve, Pending, Finish your review, Comment / Approve / Request changes, Submit review.
- The AI adds: steps in reading order, "Look at:" links, one or two sentences of explanation, its own `[AI]` comments as pending comments, answers in threads, and a read-only check of the acceptance criteria.
- One comment component for everyone; the author reads from the avatar (your accent circle, the AI's ink square, a colleague's grey circle) and the `[AI]` prefix.
- One accent, Ultramarine, for the primary action, focus, links, "Look at" links and your own avatar; never status.
- Colour for meaning only where GitHub has it: diff additions and deletions, the amber Pending tag, and the criteria marks (green met, amber partly, red not met, grey not checked).
- Reading prose at 15px/1.6 within 72ch; comments at 14px/1.55.
- A walked-W mark in the accent signs the header and favicon.
- System UI sans for everything human; JetBrains Mono for code, paths and line numbers.
- Flat at rest; files and threads are bordered boxes because you act on them; one floating shadow for menus and the new-comment pill.
- One 4px spacing scale (4, 8, 12, 16, 24, 32px).
- Motion in 120 / 200 / 320ms on one ease-out curve, serving fewer things: files folding, Viewed, moving between steps, "Look at" landing, a comment growing in place, the new-comment pill, popovers, submitting, and the AI-reviewing indicator; reduced motion keeps opacity and colour only.

## Brand

**The mark** is a W walked in four round-capped strokes (2.3 stroke on a 16px grid, round joins); the last stroke sits at 40% opacity, the part of the walk still to go. In the page it is drawn in the current accent on the canvas, so it follows the person's Appearance choice. For the favicon and app icon it is knocked out of an Ultramarine rounded square (22% corner radius) with the strokes in the on-accent colour; the favicon switches to the dark-theme Ultramarine under a dark colour scheme. Master files: `project/brand/mark.svg`, `project/brand/favicon.svg`, and `app-icon-16/32/180/512.png` rendered from the favicon SVG with provenance embedded.

**The lockup** is the mark plus "Walkthrough" in the UI sans at 700. In the header: 16px mark, 8px gap, -0.01em tracking, ink text. The display lockup (brand sheet): 34px mark, 14px gap, 34px text, -0.02em. The export page uses a quiet lockup: 14px mark, 13px text in muted ink, the mark still in the accent.

**The loader.** The Preparing state uses the mark as its indicator (20px, accent): its walked strokes and its final stroke pulse in turn between 25% and full opacity over 1.4s on the ease-out curve, offset 0.3s. Under reduced motion the mark is still. The Working status in the header keeps its small spinner.

### Named Rules
**The One Mark Rule.** The mark appears only in the accent on canvas, or knocked out of an Ultramarine square. Never outlined, rotated, set in a status colour, or used as a decorative bullet.

## Colors

A cool grey neutral scale with one fixed accent, Ultramarine, and status colour only where GitHub has the same meaning (diff washes, the amber Pending tag) or the AI's criteria check needs it; each token is defined once as a light and dark pair (`light-dark()`). The theme follows the system unless the person picks one from the menu.

### Primary (the accent)
- **Ultramarine** (light `ultramarine`, dark `ultramarine-dark`): the default accent and the brand colour. The primary button fill (with an inset 1px bottom shade), focus rings (2px, 2px offset), the text caret, the gutter "+" for a new comment, and the mark. It never carries status: not in the files-viewed bar, not in the step list.
- **Ultramarine Hover** (`ultramarine-hover`): the primary button's hover and active fill. A disabled primary stays plain Ultramarine on hover.
- **Ultramarine Text** (`ultramarine-text`): the accent at text contrast, for links, step-number links, the "Look at" links, the selected-line gutter number, the reviewer's own gutter marker and "Your comment" label.
- **Ultramarine Wash / Ultramarine Line** (`ultramarine-wash`, `ultramarine-line`): the "Look at" link border and hover, your avatar, the focused-input halo (3px), the Ask-about-lines row and step-link borders.

### Status
Status colour survives only where GitHub has the same meaning or the AI's criteria check needs it. Each still carries an icon and a word.

| Token | Light | Dark | Means now |
|---|---|---|---|
| `ok` / `ok-wash` | #1a7340 / #e4f4ea | #5fd38d / #15301f | Criterion met; the "submitted" box |
| `amber` / `amber-wash` | #8a5a00 / #fbf1dc | #e3b260 / #33280f | The Pending tag on a comment; criterion partly met |
| `bad` / `bad-wash` | #b3261e / #fbe7e5 | #ff8a80 / #3b1a18 | Criterion not met |
| `muted` | #5b636d | #9aa2ac | Criterion not checked; files not viewed |


### Diff
- **Addition / Deletion** (`diff-add`, `diff-add-gutter`, `diff-del`, `diff-del-gutter`): diff2html line backgrounds, with the gutter one step deeper than the code cell. Preview-mode insertions use the addition wash full-bleed.
- **Stripe Add / Stripe Del** (`stripe-add`, `stripe-del`): saturated run marks in the overview stripe only, drawn at 55% and 60% opacity.
- **Picked Lines** (`line-pick`, `line-pick-gutter`): lines the reviewer has selected to ask or comment about; gutter number turns accent text, semibold.

### Neutral
- **Canvas** (`canvas`): page and main pane background; also inputs, thread boxes, the current step row in the step list, and popovers.
- **Surface** (`surface`): the step list, file headers, secondary buttons, the code pane, the overview stripe, and the AI's comment rows.
- **Surface Tint** (`surface-tint`): hover fill and every pressed or chosen neutral state (a checked Viewed pill), counters, step numbers, inline code.
- **Rule / Rule Soft / Control Edge** (`rule`, `rule-soft`, `control-edge`): primary dividers; secondary dividers between list rows, under file headers and beside the stripe; the 1px edge of every control.
- **Ink / Ink Secondary / Muted** (`ink`, `ink-secondary`, `muted`): primary text and all reading prose; secondary labels, the PR number, a viewed file's tick, quotes and table values; the single secondary grey per theme, for metadata, counts, placeholders, line numbers, hunk headers, a criterion not checked, and resting icons.
- **Files viewed bar** (`rule` track, `ink-secondary` fill): the 72px bar in the header.
- **Overview stripe marks:** additions and deletions in the stripe colours; a comment by the AI or a colleague in muted, yours in the accent. Hidden at 390.

### Named Rules

**The One Accent Rule.** The accent marks the primary action, focus, the caret, links, picked lines and the reviewer's own words; never status. It is never a heading colour, a pressed-control fill, a section fill or a decorative accent; the one surface it fills is the reviewer's own comment.

**The Your Voice Rule.** The reviewer's own words (their comments, their gutter marker, the "+" that starts one, the picked-range label) wear the accent. The agent's notes stay on the canvas.


**The Three Greys Rule.** Text and interface icons use exactly three greys per theme: ink, secondary ink and muted. Data marks (the overview stripe, the files-viewed bar) are fills on the instrument, not text.


## Typography

**UI Font:** system-ui (with -apple-system, Segoe UI, Roboto, sans-serif)
**Code / Label Font:** JetBrains Mono 400/500/600 (with ui-monospace, monospace)

**Character:** The platform's own sans makes the page sit with the reviewer's tools rather than perform; JetBrains Mono is the one deliberate voice, used where exact characters matter. There is no display tier: the largest text in the product is the 20px step title.

### Hierarchy
- **Headline** (650, 20px desktop / 19px phone, 1.25, -0.01em): the open step's title and the Summary heading.
- **Body** (400, 15px, 1.6, primary ink): the AI's explanation under the step title, held to 72ch.
- **Body Note** (400, 14px, 1.55, primary ink): comment and reply paragraphs; Summary rows at 13.5px.
- **Body UI** (400, 13px): buttons (500), step-list titles, menus, criteria rows, the review box.
- **Label** (500 to 650, 12.5px): comment headers (name 600, time muted), the header's files-viewed count and "AI reviewing", the Viewed pill; small buttons. The PR title in the header is 13.5px at 600.
- **Meta** (500/600, 12px): counters, the Pending tag, section labels such as "checked by the AI".
- **Code** (400, 12.5px / 21px line): diff lines; hunk headers drop to 12px in muted ink.
- **Mono Label** (500, 11.5 to 12.5px): paths in file headers, file names in the step list, `file:line` links in the Summary and "Look at" links, the branch label, the `[AI]` prefix.

### Prose
Inside explanations, notes and comments: 12px between blocks; h2 and h3 at 15px 650 with 24px above and 8px below (no size jump, weight alone); disc lists (decimal for ordered) with muted markers, 22px indent and 4px between items; inline code on surface tint with 4px corners and 1px 5px padding at .86em; links in accent text, underlined 1px at a 3px offset; block quotes as a surface box (6px corners, 12px 16px padding, secondary ink), never a coloured side bar.

### Named Rules
**The Mono Means Literal Rule.** Monospace appears only on text that is literally code, a path, a key or an identifier the reviewer may copy. Headings, buttons and statuses stay in the UI sans.

**The Tabular Count Rule.** Every progress figure, count, line number and step number uses tabular figures.

**The Sentence Case Rule.** No uppercase, no tracking-out, no labels above headings. Hierarchy comes from weight (650 against 400) and ink step, not case.

## Layout

The desktop frame is a fixed 44px header over two panes: the step list (248px, surface tone, its own scroll) at left, and the main pane (24px top, 32px sides) holding the open step or the Summary. The step head runs to 72ch; files and threads use the full width of the main pane, threads capped at 760px. The Summary is two columns: the lists (flexible) and the sticky review box (340px), 32px apart, up to 1120px.

Spacing runs on one 4px scale (`s1` to `s6`: 4, 8, 12, 16, 24, 32px): 8px between controls and inside comment headers, 12px inside threads and between list rows, 16px between files, 24px around the step head and before the step-to-step links.

At 390px the step list opens from the header's steps button, the main pane takes 16px padding, threads stick to the left edge of the diff at full phone width, and the Summary stacks.

## Elevation & Depth

Flat by default. Depth comes from tonal steps (canvas against the surface step list) and hairline rules. One shadow exists, for things that float: the menu and the "1 new comment above" pill. Two contact cues are allowed and nothing else: the primary button's inset 1px bottom shade, and the 1px contact shadow under the gutter "+" so it reads above the line numbers. The current step row is "lifted" with a 1px rule ring, not a shadow.

### Shadow Vocabulary
- **Float** (sidecar `float`): the menu and the new-comment pill only.
- **Primary shade** (sidecar `primary-shade`): the primary button only.
- **Gutter lift** (sidecar `gutter-lift`): the gutter "+" only.

### Named Rules
**The Rules Not Boxes Rule.** Lists (the Summary's comment rows, criteria, the step list) are separated by single rules, never enclosed in cards. Boxes are kept for what you act on or what floats: a file (as on GitHub), a thread, the review box, the submitted note, the menu and the new-comment pill.

## Shapes

Small, tight radii. 4px on every control (buttons, inputs, icon buttons, inline code, focus outlines, "Look at" links, step-to-step links); 5px on menu items and the gutter "+"; 6px on files, menus, textareas and quotes; 8px on threads, the review box and the submitted note; 4px rounded squares for the AI's avatar. Full pills: counters, the Viewed pill, the Pending tag and the new-comment pill. Circles: avatars for you and colleagues (24px in threads, 20px in the Summary) and the 18px step numbers. The files-viewed bar is 72 by 4px with 2px ends. Icons are drawn on a 16px grid with 1.6 to 1.8px strokes and round caps (13 to 15px where they sit inside text); the one spinner is the dashed checking ring.

## Components

### Buttons
- **Shape:** 4px corners, 30px tall, 12px padding, 13px at 500. **Small:** 26px, 12.5px. **Touch:** 44px at 390px.
- **Primary:** accent fill, on-accent text, 600. One per view: Finish review in the header, Add comment in a composer, Submit review (or Send to agent) on the Summary.
- **Secondary:** surface fill, 1px control edge. Reply, Ask AI, Resolve, Cancel, step-to-step links.
- **Icon buttons:** Edit (pencil) and Delete (bin) on pending comments, 26px, muted icon, with a tooltip and an accessible name.
- **Focus:** 2px accent outline, 2px offset. **Disabled:** 50% opacity. **Press:** scale .97 over 120ms.

### Inputs
- Canvas fill, 1px control edge, 4px corners, 30px tall; comment and summary textareas 6px corners, min 64px, resizable. Placeholders are GitHub's: "Leave a comment", "Reply…".
- **Viewed:** GitHub's checkbox with the word, in a 26px bordered pill at the right of the file header; checked, the pill takes surface tint and the file folds. When new commits change a file you marked Viewed, Viewed clears, the file opens again, its step-list tick goes back to a ring, and a neutral pill beside the count reads "Changed since last view" (as on GitHub).
- **Review type:** three native radios, Comment, Approve, Request changes, accent-coloured, no descriptions.

### Header
44px: the 18px mark; the change's label: a pull request as GitHub sets it, the number in secondary ink and the title in the sans at 600 ("#212 Due dates for tasks"), or a branch in mono ("feature/due-dates"); "3 / 12 files viewed" with a 72px, 4px-tall bar in secondary ink; while the AI is still reviewing, the checking spinner and "AI reviewing" in 12.5px secondary ink (it fades out when the AI finishes); then Finish review (primary, small) and the menu (…) with Theme and End session. At 390px: mark, a steps button that opens the step list over the page, "3 / 12", the spinner without its word, Finish (not on the Summary), menu.

### Step list
248px on the surface tone where GitHub has its file tree. Each step is a row: a 18px numbered circle (ink-filled for the current step), the title cut with an ellipsis, and the checking spinner while the AI has not finished it. Under each step, its files in 12px mono with a Viewed tick (a muted ring, or a check in secondary ink when viewed; a viewed file's name goes muted) and a comment count with a bubble icon. The Summary is the last row, behind a rule, with the count of pending comments. Nothing else: no states, sub-lines or badges.

### Step
The title (20px; no step-number line above it: the step list shows where you are), "Look at:" with one or two links, one or two sentences of explanation at 15px/1.6 with More, then the files. At the foot, previous and next step as secondary buttons named by the steps' titles. While the AI has not finished the step, one muted line under the explanation: the spinner and "The AI is still reviewing this step."

### Look at
"Look at:" in 600 ink, then each pointer as a 24px link pill: a 1px accent-line border, 5px corners, a small arrow, the file name in mono and the line range in accent text, and two to four words naming the spot in secondary ink. Clicking opens the file if it is folded, scrolls the lines into view with 120px of context above, and flashes the range in the line-pick tone (fading over 1.4s).

### Files
GitHub's file header in a bordered box (1px rule, 7px corners): a 40px sticky header on the surface tone with the collapse chevron, the mono path, +N in green and −N in red, a comment count, and Viewed at the right. Viewed folds the file and mutes its path. A generated or copied file arrives folded with one muted line after its counts saying why ("Generated from the schema"). Files in a step are 16px apart.

### Diff and gutter
diff2html line-by-line, restyled through classes, as before: 46px number columns, 12.5/21px mono, addition and deletion washes, picked lines in the line-pick tone, hunk headers muted. A line number is a button: click (and Shift-click for a range) opens a composer under the line. A line with a thread shows a 13px bubble in its gutter: ink for an AI comment, accent person for yours, muted for a colleague's. The overview stripe stays (hidden at 390): additions and deletions, AI and colleague comments in muted, yours in the accent.

### Comments and threads
One component. A thread is a bordered box (1px rule, 8px corners, up to 760px) under its line. Each comment is a row: a 24px avatar (you: accent circle with your initial; the AI: an ink rounded square reading "AI"; a colleague: a grey circle with initials), the name (You, AI, or the colleague's handle), a Pending tag (amber outline, 12px) while it is pending, the time, and at the right Edit and Delete for pending comments; the body at 14/1.55; the AI's pending comments start with a mono `[AI]` (its answers to Ask AI do not, since they never go out). An AI comment row sits on a faint surface tone. The thread's foot holds a Reply field, Ask AI, and Resolve for colleagues' threads.
- **Composer:** on picked lines, a thread box holding a textarea, Ask AI at the left, and Cancel and Add comment at the right.
- **Ask AI:** posts your question in the thread ("Ask AI: …", no Pending tag: questions to the AI stay on the page and never go out) and the AI answers as a reply in the same thread; while it writes, a row with its avatar, the checking spinner and "Answering…" holds the place.
- **New comments while you read:** a comment that lands above or inside the view is added folded (0 height) and announced by a pill at the top right of the step, "1 new comment above", with an up arrow; clicking scrolls to it and opens it. Nothing you are reading moves.

### Summary
GitHub's "Finish your review" made visible, two columns 32px apart up to 1120px:
- **Going out (N):** every pending comment, yours and the AI's, one row each: avatar, its file name and line (`tasks.ts:29`, full path in the tooltip) as a mono accent link, the text in up to two lines, Edit and Delete. At 390 the link sits on its own line above the text.
- **Counts:** "1 unresolved thread" and "9 files not viewed", as links that go there.
- **Acceptance criteria, checked by the AI:** one line each, read-only: status icon, the criterion, and its word (Met, Partly met, Not met, Not checked) in its colour.
- **Finish your review** (sticky box, 340px): the summary textarea, the three review-type radios, and Submit review. The final submit happens here, in the app (founder decision; this overrides VISION.md's "submit there"). On your own change: the textarea, the same three radios, and Send to agent. With no comments, Send to agent is disabled while Comment is chosen, with one muted line under it: "Add a comment, or choose Approve or Request changes."; choosing Approve or Request changes enables it. The Going out list then reads "No comments. Add one on a line, or answer the AI’s."
- **After submitting:** the box becomes a green-wash note: a check, "Review submitted", one line ("Request changes, with 5 comments, on #212."), View review (secondary, with an external-link icon) and End session as a quiet text button (no fill, secondary ink; surface tint on hover); on your own change, "Sent to the agent", "Request changes, with 5 comments. The agent is fixing them; follow along there." and the same quiet End session. The Going out heading becomes "Sent" and loses its Edit and Delete.

### Opening (before the first step)
Until the AI's first step exists, the main pane holds, top-left in the step column: the desk scene (344 by 192, 280 wide at 390), the title "Preparing the walkthrough", one sentence on what is happening and how long it usually takes, then the changed files as GitHub lists them (a bordered box: "N changed files +A −D", one mono path per row with its +/−). The header shows "N files changed" instead of the viewed count, "AI preparing steps" with the spinner, and no Finish review. The step list says "Steps appear here as the AI writes them." above three static placeholder rows (`rule`-tone bars, no shimmer), and Summary with 0. If it fails: the error icon, "The AI couldn't prepare the walkthrough", one sentence, Try again (primary), then "If it fails again, start it over in your agent:" and the command box with Copy command (the same component as "Pick it up again"), and the same file list; no spinner, no scene.

**The desk scene.** The AI's own avatar (the ink rounded square) with a body, at a desk, reading code bars in the diff colours on a monitor; inline SVG, coloured only by tokens, so it follows the theme (the robot is ink in light, near-white in dark). One 24s story: reads → spots a red line ("Wait, what?!") → leans in ("Hmm…") → types; an `AI` badge lands on the line → reads on → green lines: three nods, a check, "Nice." → the screen fades and the story starts again. Speech bubbles are 11.5px sans 600 in a bordered bubble above the head.

### After the session
One centred column, 560px wide, under a header holding only the mark and the label: the robot scene (344 by 192; 280 at 390), the title, one outcome box, "Pick it up again", and a muted "You can close this tab." The outcome box is 8px corners with an 18px icon: green wash and a check for what went out, surface tone and an info icon for nothing sent or a lost session. "Pick it up again" sits behind a rule: 14px heading, one line, the command in a surface box (mono 13px, 6px corners) with a small secondary Copy command, then the line about new commits.
- **Session ended:** the robot from the opening, screen off, turned to you, waving once (happy eyes and a smile when something went out; dot eyes and a small smile when nothing did).
- **The session isn't running:** the same robot asleep, head tipped, eyes shut, two muted "z" drifting; Try again (primary) in the box.

### Menu
The header's … opens a small menu: Theme (System, Light, Dark) and End session. Nothing else.

### Phone (390)
The same page in one column: the step list opens from the header's steps button; steps read top to bottom; threads are full width; previous and next sit at the foot; the Summary stacks the review box under the lists.

### Image Diff
Kept: Diff / Preview, before and after side by side on a transparency checker.

### Motion
One family: ease-out cubic-bezier(0.16, 1, 0.3, 1) arriving, ease-in cubic-bezier(0.7, 0, 0.84, 0) leaving, 120 / 200 / 320ms. Loops: the checking spinner (header, step list, criteria being checked, and the AI answering in a thread), and the opening desk scene, the one authored moment, which plays only until the first step exists and pauses while the tab is hidden or the scene is offscreen; the asleep robot's "z" drift (4.8s, opacity and 3px) on the lost-session screen.
- **Steps:** sequential pane swap: the old step leaves to −12px over 100ms, the new one enters from +12px over 200ms after 100ms.
- **Files:** fold by grid rows (open 320ms; close 200ms after an 80ms content fade), chevron turning 90° in 120ms; Viewed folds the file, the tree's ring turns into a check (200ms, scale from .6), and the count ticks while the header bar grows (320ms).
- **Look at:** the main pane scrolls smoothly to the range, then the lines flash in the line-pick tone and fade over 1.4s.
- **A comment growing in place:** a composer or a new comment opens by grid rows (320ms) with its content fading in after 80ms; the AI's reply replaces its "Answering…" row, fading and rising 4px (320ms).
- **New-comment pill:** fades and drops 6px into place (200ms).
- **Summary:** a deleted comment fades (120ms) then its row closes (320ms); the count ticks. Submit: the review box fades out (120ms ease-in) and the submitted note fades and rises in after it (200ms), its check popping from .5.
- **AI reviewing:** the indicator and the step list's rings fade out (200ms) when the AI finishes.
- **Opening:** the desk scene's story uses the house ease-out for the jerk back, lean-in and bubble pops (200ms), ease-in for bubble exits (150ms); nothing bounces. When the first step arrives, the opening block fades out (120ms ease-in) and the step enters with the usual pane swap.
- **After the session:** the robot waves once (1.6s, after 400ms; ease-in-out swing, no overshoot) and then stays still.
- **Reduced motion:** no translate, scale or height animation; things fade, then snap; the spinner stands still; the desk scene is one still picture of the AI reading, with no bubbles; the farewell robot does not wave and the "z" stand still.


## Words

The page's own words have caps; the session's words have shapes, written into the review-policy template the session follows.

### Caps for the page
| Slot | Cap |
|---|---|
| Button | 3 words |
| Badge | 4 words (prefer an icon and a count) |
| Tag | 2 words |
| Hint | 8 words, only for a consequence a label hides |
| Notice or banner | 12 words |
| Empty state | 8 words |
| Tooltip | 12 words |
| Chip | 4 words |

Rules: one place per thing (elsewhere at most a count that leads to it); list rows hold one line, except Summary comment rows, which wrap to two; anything cut keeps its whole text in a tooltip; say what happens, not the state machine ("Changed since last view", not "Stale"); no word a shape already says; GitHub's word wherever GitHub has one.

### Shapes for the session's words
| Slot | Shape | Good | Bad |
|---|---|---|---|
| Step explanation | 1 to 2 sentences, 35 words, shown; the rest behind More. "Look at" pointers: 1 or 2, each 2 to 4 words | "Both handlers accept an optional dueDate and store it as a Date or null." | "This step teaches the API to accept a due date on create and update. Both handlers read an optional…" (6 sentences up front) |
| AI comment | 1 to 2 sentences, 30 words: what is wrong and what to do; no evidence, plans or verifier verdicts (they stay in the chat) | "A typo in the date becomes null and clears it, instead of a 400." | "Verifier: WEAKENED to a taste call. parseDueDate returns null when…" (12 lines) |
| Criterion | The ticket's own sentence, 12 words max; status one of Met, Partly met, Not met, Not checked | "Invalid dates rejected with a clear error" · "Not met: bad dates become null" | The evidence paragraph as the criterion text |
| Answer to an ask | 2 sentences, the first answers directly | "No: 30 February rolls over to 2 March. isNaN won't catch it." | "Great question! Let's look at how Date parsing works…" |
| Draft comment | 2 sentences, 40 words, starts with [AI] | "[AI] Return 400 for an invalid dueDate, with the field name." | A paragraph restating the finding and the policy |


## Do's and Don'ts

### Do:
- **Do** use GitHub's word for every review concept, and check `VISION.md` before adding anything.
- **Do** route every colour through the semantic tokens and switch theme by class; strict CSP, so all styling lives in classes.
- **Do** restyle diff2html's line-by-line output through classes to the diff tokens.
- **Do** keep one comment component for you, the AI and colleagues; tell them apart by avatar and, on comments that go out, the `[AI]` prefix.
- **Do** put Edit and Delete on every pending comment, and nowhere else.
- **Do** keep anything arriving while the person reads from moving the page.
- **Do** set explanations at 15px/1.6 within 72ch and comments at 14px/1.55.
- **Do** take every padding and gap from the 4px scale.
- **Do** give every interactive control a hover, focus-visible and disabled state, and 44px targets at 390px.
- **Do** ship the reduced-motion version with every animation.
- **Do** self-host JetBrains Mono.

### Don't:
- **Don't** add anything in VISION.md's "Not in the tool": step decisions, verdict chips, findings to accept, session status words or pages, chats, session-defined buttons or tones, swipe decks, accent pickers, help sheets or legends.
- **Don't** copy GitHub's look (header bands, tab strips, avatar timelines) or dress the page as a terminal.
- **Don't** colour a button by meaning; colour only diff lines, Pending, and criteria marks.
- **Don't** add uppercase or tracked-out labels, or labels above headings.
- **Don't** add shadows beyond the float shadow and the primary shade.
- **Don't** crossfade panes or bounce anything.
- **Don't** use the accent for headings, decoration or status.
- **Don't** use text glyphs or emoji as icons.
