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
  neu: "#7b838d"
  marker-note: "#6b737d"
  ultramarine: "#2433b8"
  ultramarine-hover: "#1b2896"
  ultramarine-text: "#2433b8"
  ultramarine-wash: "#eceefc"
  ultramarine-line: "#d3d7f7"
  on-ultramarine: "#ffffff"
  icon-knockout: "#ffffff"
  petrol: "#0e6577"
  berry: "#9c1f62"
  amber: "#8a5a00"
  amber-wash: "#fbf1dc"
  ok: "#1a7340"
  ok-bg: "#e4f4ea"
  bad: "#b3261e"
  bad-bg: "#fbe7e5"
  live: "#3a4048"
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
  neu-dark: "#8a929c"
  marker-note-dark: "#9aa2ac"
  ultramarine-dark: "#8c97ff"
  ultramarine-hover-dark: "#a3abff"
  ultramarine-text-dark: "#a9b1ff"
  ultramarine-wash-dark: "#1e2346"
  ultramarine-line-dark: "#333b70"
  on-ultramarine-dark: "#0b0f2e"
  icon-knockout-dark: "#15181d"
  petrol-dark: "#5cc2d4"
  berry-dark: "#f07ab4"
  amber-dark: "#e3b260"
  amber-wash-dark: "#33280f"
  ok-dark: "#5fd38d"
  ok-bg-dark: "#15301f"
  bad-dark: "#ff8a80"
  bad-bg-dark: "#3b1a18"
  live-dark: "#c3c8cf"
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
  key:
    fontFamily: "'JetBrains Mono', ui-monospace, monospace"
    fontSize: "11.5px"
    fontWeight: 500
    lineHeight: 1.4
rounded:
  hairline: "2px"
  control: "4px"
  sm: "5px"
  md: "6px"
  lg: "7px"
  xl: "8px"
  card: "12px"
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
  button-offer:
    textColor: "{colors.ink-secondary}"
    rounded: "{rounded.control}"
    padding: "0 12px"
    height: "30px"
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
  state-undecided:
    textColor: "{colors.muted}"
    typography: "{typography.label}"
  state-decided:
    textColor: "{colors.ink-secondary}"
    typography: "{typography.label}"
  state-reopened:
    textColor: "{colors.amber}"
    typography: "{typography.label}"
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
  queue:
    backgroundColor: "{colors.surface}"
    width: "224px"
    padding: "12px 8px"
  queue-item:
    textColor: "{colors.ink}"
    typography: "{typography.body-ui}"
    rounded: "{rounded.md}"
    padding: "6px 8px"
  queue-item-current:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
  tool-window-title:
    textColor: "{colors.muted}"
    typography: "{typography.meta}"
  edge-stripe:
    backgroundColor: "{colors.surface}"
    width: "26px"
    padding: "8px 0"
  edge-stripe-button:
    textColor: "{colors.ink-secondary}"
    rounded: "{rounded.control}"
    padding: "8px 3px"
  edge-stripe-button-hover:
    backgroundColor: "{colors.surface-tint}"
    textColor: "{colors.ink}"
  segmented-button:
    padding: "4px 12px"
  segmented-pressed:
    backgroundColor: "{colors.surface-tint}"
    textColor: "{colors.ink}"
  kind-label:
    textColor: "{colors.muted}"
    padding: "0 0 0 12px"
  verdict-status:
    textColor: "{colors.ink-secondary}"
    typography: "{typography.label}"
  facts-rail:
    textColor: "{colors.ink-secondary}"
    width: "280px"
    padding: "2px 0 2px 16px"
  file-header:
    backgroundColor: "{colors.surface-tint}"
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
  verdict-option:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-secondary}"
    rounded: "{rounded.control}"
    padding: "5px 12px"
  verdict-option-chosen:
    backgroundColor: "{colors.surface-tint}"
    textColor: "{colors.ink}"
  draft-status:
    backgroundColor: "{colors.surface-tint}"
    textColor: "{colors.ink-secondary}"
    rounded: "{rounded.pill}"
    padding: "0 8px"
  key-cap:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.key}"
    rounded: "{rounded.control}"
    padding: "1px 6px"
  popover:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.md}"
    padding: "16px"
  notice-attention:
    backgroundColor: "{colors.amber-wash}"
    rounded: "{rounded.lg}"
    padding: "12px"
  ask-row:
    backgroundColor: "{colors.ultramarine-wash}"
    padding: "8px 12px 8px 116px"
  swipe-card:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.card}"
    padding: "16px"
  decision-chip:
    backgroundColor: "{colors.ultramarine-wash}"
    textColor: "{colors.ultramarine-text}"
    rounded: "{rounded.md}"
    padding: "4px 8px"
  decision-chip-flag:
    backgroundColor: "{colors.amber-wash}"
    textColor: "{colors.amber}"
  toast:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.xl}"
    padding: "12px 16px"
---

# Design System: Walkthrough

## Overview

**Creative North Star: "The Quiet Instrument"**

Walkthrough is the standard review arrangement played straight: a 44px header, a "To review" queue on the left, the open step on the right with an "In this step" facts rail beside its head, the diff and the agent's explanation carrying the screen, and a summary step that closes the queue with the verdict. It is built to be trusted on sight, at the finish level of a JetBrains IDE: cool white and near-white neutrals, hairline rules instead of boxes, one accent (Ultramarine by default) held to a few jobs, and drawn line icons that carry state so the chrome can stay nearly wordless.

Density is IDE density, not web-app density. Controls are 30px tall with 4px corners, interface text sits at 12.5 to 13px, the step title is 19px, and every number is tabular. State is a dot and a word, never an outlined pill. Containers are mostly removed: files, forms, comment lists and the summary sections are separated by a single top rule, not by cards. The diff earns its own instrument: gutter markers on lines with notes and a slim overview stripe down the right edge. Every surface ships in light and dark from the same semantic token set; theme and accent are each person's choice in Appearance. Motion is functional and short: it shows where a decided item went and what changed, then gets out of the way.

It refuses two looks by name: the code-host pull-request page clone, and the terminal costume. Monospace is a tool for code, file names, keys and labels, never an atmosphere.

**Key Characteristics:**
- Category-standard layout as IDE tool windows: queue, explanation column and checklist each have a title bar with a hide button and collapse to an edge stripe; the queue is open by default. No tool panel.
- One accent, Ultramarine by default (Petrol and Berry by choice), for the primary action, focus, links and the reviewer's own words, never status; pressed and selected controls are neutral.
- Findings outrank conversation: amber labels, amber gutter markers, and an Approve that steps down while findings are open.
- Reading prose is set for reading: primary ink, 15px/1.6, 68ch; notes 14px/1.55.
- One traffic-light status set everywhere: green decided-positive or met, amber needs you, red not met, grey not decided or no tone, ink where you are; every colour also has an icon and a word.
- A walked-W mark in the accent signs the header, export, favicon and the preparing state.
- System UI sans for everything human; JetBrains Mono for code, file names, keys and session labels.
- Rules, not boxes; flat at rest; one floating shadow.
- One 4px spacing scale (4, 8, 12, 16, 24, 32px) governs padding, gaps and rhythm.
- Motion in 120 / 200 / 320ms on one ease-out curve, plus one 440ms authored moment (the verdict docking into the header); reduced motion keeps only opacity and colour.

## Brand

**The mark** is a W walked in four round-capped strokes (2.3 stroke on a 16px grid, round joins); the last stroke sits at 40% opacity, the part of the walk still to go. In the page it is drawn in the current accent on the canvas, so it follows the person's Appearance choice. For the favicon and app icon it is knocked out of an Ultramarine rounded square (22% corner radius) with the strokes in the on-accent colour; the favicon switches to the dark-theme Ultramarine under a dark colour scheme. Master files: `project/brand/mark.svg`, `project/brand/favicon.svg`, and `app-icon-16/32/180/512.png` rendered from the favicon SVG with provenance embedded.

**The lockup** is the mark plus "Walkthrough" in the UI sans at 700. In the header: 16px mark, 8px gap, -0.01em tracking, ink text. The display lockup (brand sheet): 34px mark, 14px gap, 34px text, -0.02em. The export page uses a quiet lockup: 14px mark, 13px text in muted ink, the mark still in the accent.

**The loader.** The Preparing state uses the mark as its indicator (20px, accent): its walked strokes and its final stroke pulse in turn between 25% and full opacity over 1.4s on the ease-out curve, offset 0.3s. Under reduced motion the mark is still. The Working status in the header keeps its small spinner.

### Named Rules
**The One Mark Rule.** The mark appears only in the accent on canvas, or knocked out of an Ultramarine square. Never outlined, rotated, set in a status colour, or used as a decorative bullet.

## Colors

A cool grey neutral scale with a single, person-configurable accent and one traffic-light status set (green, amber, red, grey, plus the ink current-step marker), each token defined once as a light and dark pair (`light-dark()`); the theme follows the system unless the person picks one, and an accent class re-points the accent family.

### Primary (the accent)
- **Ultramarine** (light `ultramarine`, dark `ultramarine-dark`): the default accent and the brand colour. The primary button fill (with an inset 1px bottom shade), focus rings (2px, 2px offset), the text caret, the gutter "+" for a new comment, and the mark. It never carries status: not in the progress bar, not in the queue.
- **Ultramarine Hover** (`ultramarine-hover`): the primary button's hover and active fill. A disabled primary stays plain Ultramarine on hover.
- **Ultramarine Text** (`ultramarine-text`): the accent at text contrast, for links, step-number links, the Working status, the selected-line gutter number, the reviewer's own gutter marker and "Your comment" label.
- **Ultramarine Wash / Ultramarine Line** (`ultramarine-wash`, `ultramarine-line`): the reviewer's own comments (wash fill, line border), the focused-input halo (3px), the Ask-about-lines row and step-link borders.
- **Petrol and Berry** (`petrol`, `berry`, with dark pairs): alternative accent presets a person can pick in Appearance. Each re-points the whole accent family (fill, hover, text, wash, line, selection) together; the sidecar carries the full sets.

### Status (one traffic-light set)
The same five meanings in the header bar, To review, the Summary ledger, the checklist, the Help legend and the swipe chips. Every colour also carries an icon and a word; the set reads in greyscale by icon (and in the bar by fill pattern).

| Token | Light | Dark | Means | Icon | Contrast on canvas / surface tint (light; dark) |
|---|---|---|---|---|---|
| **Decided Green** (`ok`, wash `ok-bg`) | #1a7340 / #e4f4ea | #5fd38d / #15301f | Decided with a positive action (Approve, Ready for colleagues); checklist met | filled circle with a check (step); circle with a check (checklist) | 5.9 / 5.2; 9.5 / 7.9 |
| **Needs-you Amber** (`amber`, `amber-wash`) | #8a5a00 / #fbf1dc | #e3b260 / #33280f | Flagged (decided with an attention action), an open finding, changed since you decided, a new finding, a problem; checklist partly met; also "Needs you" and "Offline · retrying" statuses, attention banners | filled circle with a flag; warning triangle; return arrow; circle with a minus (partly) | 5.9 / 5.2; 9.2 / 7.6 |
| **Not-met Red** (`bad`, wash `bad-bg`) | #b3261e / #fbe7e5 | #ff8a80 / #3b1a18 | Checklist not met, only | circle with a cross | 6.5 / 5.7; 7.8 / 6.5 |
| **No-tone Grey** (`neu`) | #7b838d | #8a929c | Decided with an action that has no tone | filled circle with a dash; an outlined segment in the bar | icon only; label in secondary ink |
| **Not decided** (`muted`) | #5b636d | #9aa2ac | Not decided yet (read or not); checklist not checked yet | hollow ring; dashed ring | 6.1 / 5.3; 6.9 / 5.7 |
| **Current** (`ink`) | #1d2126 | #e5e8ec | The step you are on: the bar marker and the queue icon | ring with a centre dot | 16.2 / 14.2; 14.5 / 12.1 |

Green and red share a luminance, as do green and amber (1.0–1.2:1), so colour is never the only cue. Status green is its own token, deeper and bluer than the diff's addition stripe (#3c9a5f) and never drawn as a line wash; the Listening status is no longer green (it is secondary ink), so a green dot always means "approved". `rust` is retired and points at `bad`.
- **Amber** also marks findings (label, gutter marker, stripe tick, "N open findings" in the action bar), folded-file problems, attention notices and banners (wash fill, no border), the Flag chip during a swipe, and the session's question box (1px amber border).
- **Bad** is icon and text colour only, wherever a not met item shows; it never fills a surface, and nothing fills with `bad-bg` yet. `ok-bg` fills only the Approve chip during a swipe.
- **Listening** (`live`): the Listening session status dot and label, in secondary ink. It is session health, never a decision.

### Diff
- **Addition / Deletion** (`diff-add`, `diff-add-gutter`, `diff-del`, `diff-del-gutter`): diff2html line backgrounds, with the gutter one step deeper than the code cell. Preview-mode insertions use the addition wash full-bleed.
- **Stripe Add / Stripe Del** (`stripe-add`, `stripe-del`): saturated run marks in the overview stripe only, drawn at 55% and 60% opacity.
- **Picked Lines** (`line-pick`, `line-pick-gutter`): lines the reviewer has selected to ask or comment about; gutter number turns accent text, semibold.

### Neutral
- **Canvas** (`canvas`): page and main pane background; also inputs, the current queue item, verdict options and popovers.
- **Surface** (`surface`): the queue rail, the edge stripes of hidden tool windows, secondary buttons, the code pane, the overview stripe, key caps, banners and the session-message rows.
- **Surface Tint** (`surface-tint`): hover fill (including edge-stripe buttons) and every pressed or chosen neutral state (segmented controls, Viewed, the chosen verdict and accent option), counters, file chips, draft pills, inline code, skeleton bars, and the file header row.
- **Rule / Rule Soft / Control Edge** (`rule`, `rule-soft`, `control-edge`): primary dividers; secondary dividers between list rows, under file headers and beside the stripe; the 1px edge of every control and the rule above each file.
- **Ink / Ink Secondary / Muted** (`ink`, `ink-secondary`, `muted`): primary text and all reading prose; secondary labels, decided state, verdict status, quotes and table values; the single secondary grey per theme, for metadata, counts, undecided state, status-gone, placeholders, line numbers, hunk headers and resting icons.
- **Progress** (`rule` for not decided, `neu` for decided without tone): the faint fill of a step not decided, and the 1.5px inset edge of an outlined segment decided without tone.
- **Marker Note** (`marker-note`): the gutter marker and stripe tick for an agent note that is not a finding. A data mark, quieter than muted in light so findings outrank it.

### Named Rules
**The Toned Decision Rule.** A recorded decision takes its action's tone, and only its tone: positive is green, attention is amber, no tone is grey, always with its icon and its label in words. The session gives each action its tone from the review policy; the tool never infers it. The chosen verdict follows the same rule (Approve and Ready for colleagues green, Request changes and Needs fixes amber, Comment grey). Buttons never take status colour: Approve stays the accent or a neutral button; only state is coloured. The swipe chip previews the state it will record (green for Approve, amber for Flag).

**The One Accent Rule.** The accent marks the primary action, focus, the caret, links, picked lines, the reviewer's own words and the rule beside a File Note or the current "Files" entry; never status. It is never a heading colour, a pressed-control fill, a section fill or a decorative accent; the one surface it fills is the reviewer's own comment.

**The Your Voice Rule.** The reviewer's own words (their comments, their gutter marker, the "+" that starts one, the picked-range label) wear the accent. The agent's notes stay on the canvas.

**The Findings First Rule.** A finding always reads above conversation: amber label with its icon, amber gutter marker and stripe tick, a count in the facts rail. While a step has open findings, Approve drops its primary fill and the action bar says "N open findings".

**The Three Greys Rule.** Text and interface icons use exactly three greys per theme: ink, secondary ink and muted. Data marks (neu, marker-note) are fills on the instrument, not text.

**The Traffic Light Rule.** Green is decided-positive or met; amber is needs you (flagged, a finding, changed, partly met); red is not met; grey is not decided yet or decided without tone; ink is where you are. Nothing else on the page is green, amber or red except the diff's own additions and deletions, which stay washes. If a new state does not mean one of those, it is grey.

## Typography

**UI Font:** system-ui (with -apple-system, Segoe UI, Roboto, sans-serif)
**Code / Label Font:** JetBrains Mono 400/500/600 (with ui-monospace, monospace)

**Character:** The platform's own sans makes the page sit with the reviewer's tools rather than perform; JetBrains Mono is the one deliberate voice, used where exact characters matter. There is no display tier: the largest text in the product is the 19px step title.

### Hierarchy
- **Headline** (650, 19px, 1.25, -0.01em): the open step's title, on desktop, phone and swipe cards. Page titles on the list and export pages sit at 20 to 22px, same weight.
- **Title** (650, 17px): export section headings.
- **Body** (400, 15px, 1.6, primary ink): the agent's explanation and any reading prose, held to 68ch.
- **Body Note** (400, 14px, 1.55, primary ink): note and comment paragraphs. Markdown previews sit at 14.5px; summary lists and tables at 14px. A file's explanation under its header is a File Note (see Layout): the same size and line height in secondary ink.
- **Body UI** (400, 13px): buttons (500), queue items (13.5px), notices, checklist items, menus, key-sheet rows.
- **Label** (500 to 650, 12.5px): state dot labels, note headers, the kind label, verdict status, the facts rail, the Viewed toggle; small buttons.
- **Meta** (500/600, 12px): counters, facts-rail heading, popover section labels, sub-lines under queue items.
- **Code** (400, 12.5px / 21px line): diff lines; hunk headers drop to 12px in muted ink.
- **Mono Label** (500, 12 to 12.5px): file names in file headers and the facts rail, the session label, file chips, list-page walkthrough names, draft locations.
- **Key** (500, 11.5px mono): key caps in Help.

### Prose
Inside explanations, notes and comments: 12px between blocks; headings at the size of the text around them in 650 with 16px above and 4px below (no size jump, weight alone); disc lists (decimal for ordered) with muted markers, 24px indent and 4px between items; inline code on surface tint with 4px corners and 0 4px padding at 0.9em; links in accent text, underlined at a 2px offset; block quotes in secondary ink behind a 2px rule in the control edge, 12px from the text.
The File Note takes the same shape with the rule in the accent, as the one coloured side bar on the page.

### Named Rules
**The Mono Means Literal Rule.** Monospace appears only on text that is literally code, a path, a key or an identifier the reviewer may copy. Headings, buttons and statuses stay in the UI sans.

**The Tabular Count Rule.** Every progress figure, count, line number and step number uses tabular figures.

**The Sentence Case Rule.** No uppercase, no tracking-out, no labels above headings. Hierarchy comes from weight (650 against 400) and ink step, not case.

## Layout

The desktop frame is a fixed 44px header over a row of panes arranged as JetBrains-style tool windows around the step. The queue ("To review", open by default) is a 224px rail on the surface tone at left; the open step fills the main pane (16px top and bottom, 24px sides). The explanation column splits a 420px prose column (24px padding, its own action bar at the foot) from the code, which moves to the surface tone. The checklist is a 288px column at the right that ends with a "Whole walkthrough" block above a rule. Each window has a title bar with a hide button (keys 1 to 3). A hidden queue or explanation column collapses into a 26px edge stripe at the left, and a hidden checklist into one at the right, so nothing disappears without leaving a handle. When the queue is hidden, previous and next step navigation sits above the title. Which windows are open is kept for the person with their Appearance, so every walkthrough opens the way they left the last one.
The step head is a two-column grid: the title, state and explanation up to 68ch, and the "In this step" facts rail (220 to 280px) at the right, 32px apart. Below it come the files, then the action bar, docked to the bottom of the pane as a sticky row above a soft hairline. Diff files are not cards: each file opens with a full-bleed sticky header row on surface tint under a 1px control-edge rule, and each file after the first sits 32px below the one before it, opened or collapsed, so where one file ends reads at a glance and opening a file moves nothing above it.
A folded step's shown diffs and the export keep the same rhythm.
A file's own explanation, when the session gave one, has two places.
With the explanation column hidden (the default) and at 390px, it is a File Note between the header and the diff: 14px secondary ink at 1.55, held to 68ch, its text starting where the note rows' does (116px in; on a phone the rule sits at the file's left edge) behind a 2px accent rule, 12px above and below.
With the explanation column open, the code pane holds only code: under the step's overview the column lists the step's explained files, in the step's order, under the heading "Files" (Meta, muted), each as its path in Mono Label ink linking to the file and its explanation below in Body.
The link opens the file if it is collapsed and scrolls it to the top of the code pane; the entry for the file at the top of the code pane, or the last file once the pane is scrolled to its end, is current, marked by a 2px accent rule in the column's padding.
The export follows the person's panels the same way: the "Files" list under each overview when the column is on, File Notes otherwise.
Code scrolls horizontally inside its file instead of clipping, with the 10px overview stripe pinned at the right edge. Note rows, the "N more notes" row and the Ask-about-lines composer indent 116px so their text aligns with the code column, not the gutter.

Spacing runs on one 4px scale (`s1` to `s6`: 4, 8, 12, 16, 24, 32px): 4px under the title row, 8px between controls in a row and inside note rows, 12px inside notices and between list rows, 16px between blocks and inside the main pane's top and bottom, 24px for pane sides, 32px for page padding and the head-to-rail gap. Control padding: buttons 0 12px, small buttons 0 8px, counters and file chips 0 8px, step-number links 0 4px, segmented buttons 4px 12px, icon buttons 4px, the decision chip 4px 8px. Deliberate off-scale values: 2px between queue rows, the 116px code-column indent, and 40px export side padding.

At 390px the header moves the panel show/hide controls and End session into a "More" menu, where they are checkable menu items and the explanation column is disabled with a "Wider screens" note; the progress bar moves to its own full-width strip under the header, the queue becomes a select with a drawn chevron, the diff scrolls horizontally inside the file while the note stays pinned left, and primary actions become a sticky bottom bar of 44px touch targets. The phone can also decide by swipe deck (see Components); its buttons stay for anyone who does not swipe.

## Elevation & Depth

Flat by default. Depth comes from tonal steps (canvas against the surface rail) and hairline rules. One shadow exists, for things that float: the More menu, popovers (Appearance, Help) and the top card of the phone swipe deck (the card beneath carries none). Two contact cues are allowed and nothing else: the primary button's inset 1px bottom shade, and the 1px contact shadow under the gutter "+" so it reads above the line numbers. The current queue item is "lifted" with a 1px rule ring, not a shadow.

### Shadow Vocabulary
- **Float** (sidecar `float`): menus, popovers and the top swipe card only.
- **Primary shade** (sidecar `primary-shade`): the primary button only.
- **Gutter lift** (sidecar `gutter-lift`): the gutter "+" only.

### Named Rules
**The Rules Not Boxes Rule.** Files, forms, comment lists, summary sections and folded-file lists are separated by a single top rule, never enclosed in a bordered card. Boxes are kept for things that interrupt or move: notices, the session's question, menus and popovers, the toast, the swipe cards and the reviewer's own comments.

## Shapes

Small, tight radii. 4px on every control (buttons, inputs, icon buttons, the Viewed toggle, verdict and accent options, key caps, step links, inline code, focus outlines); 5px on file chips, menu items and the gutter "+"; 6px on joined segmented groups, menus, popovers, textareas and quotes; 7px on notices; 8px on the question box, the toast and your own comments; 12px on phone swipe cards; 2px on progress segments. Counters and draft-status pills are full pills; decision state is never a pill. State dots are 8px circles with a 1.5px edge. The progress bar is a row of 5px-high segments with 3px gaps, one per step; the current step's is 9px high. Icons are drawn on a 16px grid with 1.6 to 1.8px strokes and round caps (13 to 15px where they sit inside text); the select chevron is drawn from the same set, never the browser's.

## Components

### Buttons
Restrained and exact; the label carries the meaning.
- **Shape:** 4px corners, 30px tall, 12px horizontal padding, 13px at 500.
- **Primary:** accent fill, on-accent text, 600 weight, inset 1px bottom shade. One per action group (Approve), and only when the step has no open findings. Hover and active deepen to the hover tone; disabled keeps the accent.
- **Secondary:** surface fill, 1px control edge; hover steps to surface tint, except when disabled.
- **Ghost:** no fill or edge, secondary ink. "Finish review" in the header is a small ghost button.
- **Session offer:** a secondary button with a dashed control edge, secondary ink and a muted message icon, for actions the session offers on a step.
- **Small:** 26px tall, 8px padding, 12.5px. **Touch:** 44px tall at 390px.
- **Focus:** 2px accent outline, 2px offset. **Disabled:** 50% opacity. **Press:** scales to .97 over 120ms; hover fills change linearly over 120ms.
- **Tooltips** name the shortcut, for example "Approve and go to the next step (A)".

### State (not pills)
Step state is an 8px dot plus a 12.5px 500 word, with no outline or fill around it: **Undecided** is a hollow muted dot; **Decided: <label>** a filled dot in its tone (green, amber, or secondary ink for no tone); **Changed since you decided** a dashed amber dot in amber. In the summary's decided table the dot is dropped and the label sits in 600 ink.

### Inputs / Fields
- **Style:** canvas fill, 1px control edge, 4px corners, 30px tall; textareas 6px corners, min 84px, resizable.
- **Focus:** edge turns accent with a 3px accent-wash halo; caret is accent.
- **Placeholder:** muted ink; the Ask box names its key ("Ask about this step… ( / )").
- **Select:** native select with its own arrow removed, 30px right padding, and a muted drawn 16px chevron.

### Navigation
- **Header (44px):** the 18px mark alone (the wordmark lives in the favicon, export and brand sheet), the mono branch or pull-request label (its tooltip names the kind: "Your change", "Review request"), the segmented progress bar (180px) with "Step 4 of 9" ("Summary" on the Summary), then at the right: verdict status (once chosen), Finish (flag icon + word, a secondary button), the session status, and More (…), which holds Appearance, Help and End session. The decided count lives in the bar, not in words. No panel controls live in the header.
- **Kind label:** not shown in the header; the session's words for the kind are the branch label's tooltip and the list page's column, with no icon, since the tool knows only the session's free text (ADR 0005).
- **Progress bar:** one segment per step: decided-positive green, needs-you amber drawn hatched (135°, 3px amber and 2px amber at 45%) so it differs from green in greyscale, decided-without-tone an outlined segment (no fill, 1.5px inset `neu` edge), not decided a faint rule-tone fill (read or not). Every state differs by shape as well as colour, so the bar reads in greyscale: solid (approved), hatched (needs you), outlined (no tone), faint (not decided), taller ink (where you are). Red never appears in the bar: it is the checklist's colour, shown on the Checklist edge and rows. The current step's segment is solid ink and taller (9px against 5px, 2px corners), whatever its state, so it reads at a glance in light and dark on any accent; it walks to the new segment on navigation. At 390px the bar runs full width under the header and "N decided" sits beside the step picker. Every segment has a tooltip naming the step and its state in words ("6 Overdue styling: not read yet").
- **Diff-Preview switch:** joined segmented control, 1px control edge, 6px group corners; pressed is surface tint with ink, never the accent.
- **Verdict status:** a flag icon plus the chosen verdict in 12.5px 500, both in the verdict's tone (green, amber, or secondary ink for no tone), here and on the list page.
- **Session status:** quiet when all is well: Listening is a 7px secondary-ink dot alone, its words in the tooltip ("Listening: questions reach the session now") and for screen readers. Any other state shows its 13px 600 label beside the dot: Working (accent text with a spinning icon), Needs you (amber dot with a 3px amber-wash ring), Offline · retrying (amber, with an offline icon, when the server is unreachable), Session gone and Stopped (muted hollow dot).
- **Step nav:** previous and next icon buttons plus "Step 4" in 13px, shown above the title only when the queue is hidden.
- **More menu:** on desktop, Appearance and Help; at 390px, Swipe to decide, the panels as menu-item checkboxes, then a rule separator above Appearance, Help and End session.

### Tool Windows
The IDE pattern, played straight.
- **Title bar:** each window names itself in 12px 600 muted text ("To review 8" with its counter, "Explanation", "Checklist"), with a 14px minus icon button at the right to hide it; its tooltip names the key ("Hide Checklist (2)").
- **Edge stripe:** a hidden side window leaves a 26px column on the surface tone behind a hairline, holding vertical buttons in 12px secondary ink with an 11.5px muted tabular count ("To review 8", "Explanation" on the left; "Checklist 2/5" on the right). Left-stripe labels read bottom-up, right-stripe labels top-down. Buttons have 4px corners and hover to surface tint with ink; tooltips name the key ("Show Checklist (2)"). An empty stripe is not drawn.
- **No tool panel:** there is no bottom panel or strip. Notes live on their lines (counted in "In this step"); session messages and notes on removed code live on the Session messages page, whose row in To review counts both ("1 file not in a step · 2 on removed code"). Keys 1 to 3 toggle To review, Checklist and Explanation.

### Queue ("To review")
The signature rail, headed "To review" with a counter. Rows are a 16px state icon, the 13.5px title and at most one right-aligned badge; status lives in the icon, and its words are in the row's tooltip and in Help. Badges: an amber warning with a count (open findings, problems; tooltip "1 open finding"), amber "new" (a finding after you decided), a grey count on Session messages. "Being checked" is the only sub-line. Icons take the traffic-light set: the current step an ink ring with a centre dot; not decided (read or not) a muted hollow ring; an open finding an amber triangle; changed since you decided the amber return arrow. Inside "N decided": Approve a green filled check, Flag an amber filled flag, a tone-less action a grey filled dash, each with its outcome in its tone in the tooltip. Session messages muted. Criteria never appear here; they live on the Checklist. The current item is canvas-filled with a 1px rule ring and 600 weight. Decided items fold into "N decided" at the rail's foot. The Summary is the last row, set off by a rule above and marked with a list icon in secondary ink.
A step the session is still checking keeps its state icon with the muted sub-line "Being checked", led by the being-checked spinner. A decided step that gets a finding after the decision comes back above the fold with its decided icon and the amber "new" badge; its decision stays.
Choosing a row with open findings opens the step at its first open finding, focused in the middle of the pane; the phone's step picker names it the same way ("Overdue styling · 2 open findings").
A row that would hold more than one badge shows the first that holds: "new", the open findings, then a folded step's problems.

### In This Step (chips)
Under the one-sentence explanation, one row of 26px pill chips (1px rule, 13px corners), wrapping: each file (file icon, mono name, green `+N`, red `−N`, an amber warning badge with the count of open findings; a click jumps to the file), the session's notes as a speech-bubble chip with a count, your own comments as an accent person chip with a count, a 16px divider, then the linked checklist criteria (status icon in its colour plus the criterion), and an "N assumption" chip (tooltip "Assumed without reading the code") that opens the assumptions. Every chip's tooltip says it in words. No separate facts rail.

### Checklist
A page and a panel (288px), one line per criterion: its status icon, the ticket's sentence cut with an ellipsis, its linked step numbers, and a segmented control (Met, Partly, Not met) in which the session's mark is pressed; pressing another overrules it; none pressed is not checked yet. The session's evidence opens under the row on click (surface fill, 7px corners, 72ch). Criteria never appear in To review; the right edge button reads "Checklist 2/5".
The session's optional description sits under the title as one 13px muted line, such as "Each acceptance criterion from the tickets, and the steps that deliver it."
The step numbers are plain accent-text links, underlined on hover, each with its step's title as its tooltip; "Steps" and its numbers wrap as one piece.
The status words and the icon take the status's colour: met in `ok` green with a circle with a check, partly met in amber with a circle with a minus, not met in `bad` red with a circle with a cross, not checked yet muted with a dashed ring.
The same colours mark the item's icon wherever it shows: the panel, its page, the Summary and the step's chips.
Inline code in an item's text never breaks inside the code.

### Diff, Markers and Overview Stripe
diff2html line-by-line, restyled through classes: 46px number columns in muted ink, 12.5/21px mono code with 16px right padding, addition and deletion washes with deeper gutters, picked lines in the line-pick tone. Hunk headers lose their fill and sit in muted ink.
- **Gutter markers:** a line that carries a note shows a 13px icon in a 16px box at the left of its new-line number: amber warning triangle for a finding, accent person for your own comment, marker-note speech bubble for any other note.
- **Overview stripe:** a 10px column at the right edge of each file's diff, on the surface tone behind a soft rule: added and removed runs as 6px-wide stripe-add and stripe-del bars, and each note as a 3px full-width tick in its marker colour. It maps the whole file at a glance and never scrolls with the code.
- **Notes:** one row under the line, spanning the table in UI sans: the kind label in 12.5px (a finding's in amber with its icon; its tooltip carries the line), the body at 14/1.55 in primary ink up to 66ch, and the actions at the right (see Note Actions and Outcomes). Replies indent under the body behind a 2px rule. At 390px the row stacks. The same holds for notes on a step and on a folded step. A file header carries the same counts: an amber warning with the open findings, a muted bubble with the notes, each jumping to the first. "N more notes" is an accent-text link on a row with no fill. The Ask-about-lines composer is a row in the accent wash with accent-line rules.

### Files to Skim (the folded step)
The step is titled "Files to skim" on the page. A session writes a sentence per file, so the step reads reasons as text.
- **Summary (collapsed):** one 40px line in a 1px rule box with 7px corners: the chevron, "18 files" (never wrapping), then each distinct reason once, joined by " · " in muted 13px text and cut with one ellipsis at the end of the line, then the problem count as a reopened tag. The summary's tooltip lists every distinct reason. Opened, the reasons leave the line.
- **Problems:** the session's problems sit right under the summary, 8px below it, whether the files are open or not: amber-wash rows with 6px corners, a warning icon and the problem in ink.
- **Files (opened):** a list under a rule, one row per file on soft rules with 12px padding: the mono path, the reason as 13px secondary-ink text that wraps, and a small Show diff button at the right; the three columns line up from row to row, the path column taking at most 45%. At 390px the reason moves under the path, full width, and Show diff stays beside the path.
- **Export:** the files are listed open with their diffs, each headed by its path and reason in the same two columns, each file after the first 32px below the one before it behind a control-edge rule, the problem above the list; no Show diff buttons. An image shows as "Binary image · W × H · replaced".

### File Header
A 36px sticky row on surface tint under a 1px control-edge rule: a chevron toggle (collapse/expand), the mono file name, tabular +/- counts, the file's notes, and a Viewed toggle at the right.
The notes come in the marks "In this step" uses, only the counts above zero: amber "1 finding" with its icon, muted "2 notes" with the note icon, accent "1 yours" with the person icon, each 12.5px 500 with 4px between.
Each count is a small button (2px 6px, 4px corners, hovering to the canvas) that opens the file if it is collapsed or Viewed and goes to the first such note in it, focused in the middle of the pane; its tooltip says so ("Go to the first finding in this file").
At 390px the counts take a row of their own under the name, lined up with it. Viewed is an eye icon button (4px corners, 4px 6px, muted); once pressed it shows the eye plus "Viewed" in secondary ink. On the tinted row, hover and pressed step to the canvas so they still show. Viewed is a reading mark, not a decision, and never takes the accent.

### Your Comments
The reviewer's own comment is an accent-wash box with a 1px accent-line border, 8px corners and 12px 16px padding, up to 70ch: a "Your comment" heading in 650 accent text with a person icon, edit and delete icon buttons in accent text, the 14/1.55 body in primary ink, and a 12.5px destination hint (for example "Joins the fix list"). On hover or focus of a line number, a 20px accent "+" square appears in the gutter to start a comment; a picked range offers "Ask about lines" and "Comment".

### Action Bar
Docked at the foot of the step: Approve (check-circle icon, word, key cap A) and Flag (flag icon, word, key cap F), 34px tall; any session offers; then the Ask field with a question icon filling the row; and, while findings are open, an amber "⚠ N open" link with a warning icon that closes the row. While findings are open Approve is a secondary button.
That count is a button with the tooltip "Next finding": each press scrolls to and focuses the next open finding in the step, in the page's order, wrapping to the first; it hovers to the amber wash. A decided step's "1 new finding" does the same with its new findings.
While the session is still checking the step, its actions are held: drawn disabled, followed by the muted 12.5px hint "Decide after the check", and the A and F keys and the swipe deck decide nothing. The Ask box stays live.

### Summary Step
Reads in ten seconds: how much is left, what goes out, the one button that sends. Title "Summary", then one plain 14.5px count line in secondary ink ("4 left · 8 go out"; after sending "Sent · 8 went out"; no big-number tiles). Two columns, 32px apart, up to 1080px:
- **Still open:** one 36px row per step, finding or note that needs the person, on soft rules: its status icon in its status colour, title (13.5px ink, a link to the exact place with its file unfolded) and, after " · ", the one-line reason in secondary ink, cut with an ellipsis; its own small buttons at the right (a finding's actions, or Approve and Flag). A step being checked shows the being-checked spinner and "Being checked" in muted. No "Undecided": the group heading and the icon say it.
- **Goes out:** your comments (accent text with the person icon) and the session's drafts, one line each with a muted mono "file:line", the text cut with an ellipsis, a tag only when it differs (Edited, Dropped on surface tint; a dropped draft struck through and muted) and Edit and Drop icon buttons. Every kept draft goes out with the final send. The count in the heading is what goes out.
- **Checklist:** one line per criterion, the ticket's sentence and a segmented control (Met, Partly, Not met); the session's mark is the pressed button, another press overrules it; none pressed means not checked yet.
- **Decided:** decided steps fold into one line, "5 steps decided", which opens them; each row's icon and outcome take its tone (Approve green, Flag and Changed amber, a tone-less label in secondary ink).
- **Finish rail (288px):** sticky, behind a 1px rule with 24px left padding. The session's verdict options stacked full width (radio buttons: canvas, 1px control edge, 4px corners; chosen = secondary-ink border, surface tint, 600, filled icon in the verdict's tone), the one send button ("Send review", "Send fix list") with the finish icon, disabled until a verdict is chosen, and one 12.5px hint ("2 comments and 6 drafts go out."). After sending the rail is a green-wash box: check icon, "Sent", one line saying what went ("2 comments and 6 drafts, as a pending review."), then a link to it. The session's replies never sit here: they go to Session messages. At 390px the rail drops under the list behind a top rule.

### Help
Opened with ? or from More. A canvas popover (1px rule, 6px corners, float shadow, 16px padding). Buttons and badges say what they do, so Help keeps two columns only: **Icons**: every step and checklist state with its icon, colour and word (where you are, approved, flagged, needs you, changed, decided with no tone, not decided yet; met, partly, not met), the progress-bar fills (green, hatched amber, outlined grey, faint) and the ink current-step marker; then **Keys**. Every icon and colour on the page is said in words here and in its tooltip.

### Popovers: Appearance and Help
Canvas, 1px rule, 6px corners, float shadow, 16px padding. **Appearance** (300px): an Accent radio list (16px swatch with 4px corners, name, "(default)" on Ultramarine; chosen = surface tint, 600) and a Theme radio row (System, Light, Dark) in the verdict-option style, then "Saved for you on this machine." **Help** (1040px, 60px from the top, one column at 390px): two-column tables, rows on soft rules; its key caps in 11.5px mono ink on the surface tone with a 1px control edge, a 2px bottom edge and 4px corners.

### Note Actions and Outcomes
- **Kind:** the head shows the session's kind word, its label ("Finding", "Question", "Nit", "Draft"). A note with actions needs a decision and carries its icon and its actions; one without (a Question with its answer, a Note) has no buttons and folds once read.
- **Actions:** named by the session for what happens, at most 3 words ("Add to fixes", "Not an issue"). Each may carry a consequence of at most 8 words; the primary action's shows as one muted line under the buttons ("Add to fixes: goes on the fix list."), every action's in its tooltip. At 390px the line stays, since there is no hover. Buttons are neutral; status colour belongs to the outcome.
- **Optional reason:** an action that asks why (a rejection, Flag) opens an inline field with the placeholder "Why? (optional)" and its own button; sending it empty is fine.
- **After deciding:** the note folds to one line: the outcome icon and word in its tone (green check "Added to fixes"; grey cross "Not an issue"; grey eye "Ignored"), then "Kind: text" muted and cut, then Undo and Change. Ignored notes stay in place, at 75% opacity, and count nowhere.
- **Drafts:** a draft in the files shows Edit and Drop, never Post; every kept draft goes out with the final send, as the Summary's Goes out list says.

### Session Messages
The only place the session speaks outside the steps. One line per message, unread first with an 8px accent dot; a question opens in place with its answer buttons and a Reply field; read messages fold to one line in secondary ink. Groups below, each one line per item: "On removed code" (notes and your comments whose lines are gone, with "was on file:line") and "Not in any step" (changed files). The To review row counts unread messages. The session's answers to comments and decisions are not shown, and comments never wake the session.

### Notices
- **Neutral:** surface fill, 1px rule, 7px radius, muted icon.
- **Attention:** amber wash, no border, amber icon. Full-width banners use the same pair under the header.
- **Being checked:** a neutral notice under the step title, led by the being-checked spinner: "Still checking this step. Findings may arrive."
- **New finding banner:** the attention banner under the header names a finding that lands on a step the person read or decided ("New finding on step 8, Ultramarine, accents and Appearance, which you approved."; several read as one, "3 new findings on steps 8 and 10."), with a small "Go to step" button and a close icon button to dismiss it. It is for the open page only; after a reload the queue sub-line carries it.
- **Late finding on the step:** opening a decided step that got a finding after the decision shows an amber-wash line under the title ("A finding arrived after you approved. Your decision stays; change it if the finding matters."), the note labelled "line N · new since you approved", and an action bar of Change decision, the Ask box and "1 new finding" in amber. "approved" is the person's own decision: Approve and Flag read "approved" and "flagged", another label "chose <label in lower case>"; several findings read "2 findings arrived … if the findings matter.". At 390px the step picker names the step "· New finding". The export, read by others too, leaves the line and the "new since" words out.
- **Session question:** canvas fill, 1px amber border, 8px radius, amber 650 heading.
- **Notes on removed code:** not a box: a section of the Session messages page under a rule, headed with its icon and count and a line saying why they wait there; each note a row with its icon in a gutter, its label, "was on <file> line N" in muted text, the old line as it read when the note was pinned (12px mono, muted, its shared indent removed; older notes that never stored it show none), then its text.
- **Undo toast:** inverted (ink fill, canvas text and icon), 8px radius, 14px text, with an underlined Undo link in 650. It rises 12px over 200ms after a 120ms delay.

### Image Diff
Changed images get the same Diff / Preview switch. Preview shows Before and After side by side, each in a 160 × 120 box with 6px corners on a 16px transparency checker (surface tint against canvas), captioned in 12.5px muted text with the pixel size.

### Phone Swipe Deck
At 390px a step can be decided by swiping its card: right approves, left flags (and opens the Flag note). Cards are canvas with a 1px rule, 12px corners and 16px padding, holding the title, explanation, a three-line mini diff and any finding in an amber-wash callout. Mid-drag, a decision chip fades in at the top corner (green wash and text for Approve, amber for Flag: it previews the state it will record) and edge labels appear. The next card waits beneath at scale .95, 14px lower and 60% opacity, growing to full as the top card leaves; its text stays hidden until the top card has cleared.

### Motion
One family (the Preparing state's pulsing mark, the Working spinner and the being-checked spinner are the only loops): `ease-out` cubic-bezier(0.16, 1, 0.3, 1) for things arriving or settling, `ease-in` cubic-bezier(0.7, 0, 0.84, 0) for things leaving, at 120ms (fast), 200ms (base) and 320ms (slow).
A click takes effect at once and the motion follows: every animation starts in the task that changed the state, a leaving element stays drawn, inert and hidden from assistive technology until its exit ends, and the exit's own end, never a timer, takes it away.
The swipe card is the one exception: it decides once its flight ends.
A redraw from polling continues what is playing and starts nothing new.
- **Decide:** the queue row hides (60ms) and the rows below close up (height 320ms ease-out after 120ms) while a chip of the row (float shadow) lifts off and travels into "N decided" at the rail's foot (translate and 92% scale, 320ms ease-out, opacity held to 75% then out).
  "N decided" flashes the surface tint (200ms after 240ms) and its number rises in as the chip lands (200ms after 240ms); the other counts tick from .55 opacity and 2px low (200ms).
  A row whose decision is taken back while it leaves drops its chip and its picture at once.
- **Stepper:** an ink marker (9px, the width of one segment) walks to the current segment (translateX, 320ms ease-out).
  Each segment fills from the left under it, grey when read and the accent when decided (scaleX, 320ms ease-out).
  After a decision the marker waits 180ms so the fill reads first, and it fades out (200ms) where no step is shown, on the Summary and the pages of their own.
- **Pane swap:** sequential, never crossfaded: the old pane leaves to -12px (100ms, linear fade), then the new one enters from +12px (200ms ease-out after 100ms).
  The step's action bar leaves with its pane, Finish review included.
- **Reveal:** assumptions open by grid rows (320ms) with the chevron turning 90° (120ms); extra notes rise 4px (200ms, 40ms stagger).
- **Attention:** "Needs you" pulses its amber ring twice (1.2s) and then holds still.
- **Being checked:** the faded dashed ring with a solid quarter-arc turning once every 1.2 seconds, in front of "Being checked" in To review, on the "Still checking this step" notice and on the step's Summary row.
- **Swipe:** the card follows the finger, rotating 0.025° per pixel of travel; on release it flies out (200ms ease-in) with its fade held back until late (80ms after 120ms).
- **Verdict (the one authored moment):** choosing a verdict lifts the chosen label off its option as a chip, its text laid exactly on the option's, and docks it onto the label in the header's verdict slot: transform 440ms ease-out, opacity held to 62% then out (linear) while the slot's label fades in over the same window, so the label never drops out.
  The slot opens by width (320ms ease-out); on a change the old label, kept in the slot, fades out (200ms) under the arriving chip and the slot's width eases to the new label.
  At phone width the header has no slot, so nothing flies.
- **Tool windows** (To review and Checklist): hiding one fades its contents (100ms linear), then its width closes (200ms ease-out after 60ms) while what it holds keeps its open width, and a new edge stripe opens by the same amount at the same time, so nothing beside it jumps; the edge button fades in after 200ms (120ms).
  Showing grows the width from the stripe's (320ms ease-out) with the contents fading in after 120ms (200ms).
  The explanation column, a layout of the step rather than a window beside it, snaps.
- **Files:** a file closes by its height (200ms ease-out after an 80ms content fade) and opens by its height (320ms ease-out) with its contents fading in after 80ms (200ms); the files below move with it and nothing above it moves, and the chevron turns 90° (120ms ease-out).
  Viewed folds the file, dims its name (200ms colour) and reveals the "Viewed" label in its toggle (width and fade, 200ms).
  A file turned back mid-motion goes on from the height it has.
- **Popovers** (Appearance, Help and the menus): open from the control that opened them, 120ms fade with a 200ms settle from 4px up at 98% scale.
  Appearance and Help close at once and stay drawn, inert, while they fade (80ms ease-in); a menu closes at once.
- **Accent:** the accent family is registered as colours (`@property`), so changing the accent cross-fades it over 320ms; theme switches snap.
- **Reduced motion:** no translate, rotate or scale anywhere: opacity and colour only.
  Queue rows fade (200ms), then snap shut, with no chip and no flash; the stepper's marker snaps and segments fill by opacity; the swipe card only fades.
  Tool windows fade their contents (120ms), then snap, the edge button fading in after; showing snaps the width and fades the contents in.
  Files fade their contents, then snap, and the chevron snaps.
  The verdict chip is skipped: the header slot fades in (200ms), and on a change the old label fades out (100ms) before the new one fades in (100ms).
  Popovers only fade.
  The accent still cross-fades, as colour.
  The being-checked arc stops and its words stay.

## Words

The page's own words have caps; the session's words have shapes, written into the review-policy template the session follows.

### Caps for the page
| Slot | Cap |
|---|---|
| Button | 3 words |
| Badge or queue sub-line | 4 words (prefer an icon and a count) |
| Tag | 2 words |
| Hint | 8 words, only for a consequence a label hides |
| Notice or banner | 12 words |
| Empty state | 8 words |
| Tooltip | 12 words |
| Chip | 4 words |

Rules: one place per thing (elsewhere at most a count that leads to it); one line per row, cut with an ellipsis, the whole text on the item and in its tooltip; say what happens, not the state machine ("Changed since you approved", not "Reopened"); no word a shape already says.

### Shapes for the session's words
| Slot | Shape | Good | Bad |
|---|---|---|---|
| Step explanation | 1 sentence, 25 words max, shown; up to 3 more behind More | "Both handlers accept an optional dueDate and store it as a Date or null." | "This step teaches the API to accept a due date on create and update. Both handlers read an optional…" (6 sentences up front) |
| Note or finding | 1 sentence, 20 words: what is wrong and what it breaks; evidence behind Why, 3 lines max; no verifier verdicts inline | "A typo in the date becomes null and clears it, instead of a 400." | "Verifier: WEAKENED to a taste call. parseDueDate returns null when…" (12 lines) |
| Criterion | The ticket's own sentence, 12 words max; status one of Met, Partly, Not met, plus 6 words why | "Invalid dates rejected with a clear error" · "Not met: bad dates become null" | The evidence paragraph as the criterion text |
| Answer to an ask | 2 sentences, the first answers directly | "No: 30 February rolls over to 2 March. isNaN won't catch it." | "Great question! Let's look at how Date parsing works…" |
| Session message | 2 sentences, 30 words; a question ends with its answer options | "Is 30 February a 400 or a rollover? Your rules don't say." | A status report of what the session did, step by step |
| Draft comment | 2 sentences, 40 words, starts with [AI] | "[AI] Return 400 for an invalid dueDate, with the field name." | A paragraph restating the finding and the policy |
| Action label and consequence | Label 3 words naming the outcome; consequence 8 words; outcome 3 words, past tense | "Add to fixes" · "Goes on the fix list." · "Added to fixes" | "Accept" with no consequence |

### Rules retired in round 5
- The header's kind label, the "Session" prefix on Listening, the decided count in words, and End session in the header.
- The "In this step" facts rail (now chips).
- Accept and Reject as default note action names (actions are named for their outcome).
- Help as a full glossary of every status in words (now icons and keys only; tooltips carry the rest).
- Criteria rows in To review (they live on the Checklist).
- Per-draft Post (drafts go out with the final send).

## Do's and Don'ts

### Do:
- **Do** route every colour through the semantic tokens and switch theme and accent by class; the shipped page runs under a strict CSP, so all styling lives in classes, never inline styles.
- **Do** restyle diff2html's line-by-line output through classes to the diff tokens above rather than shipping its default theme.
- **Do** show state as a dot and a word: hollow for undecided, filled grey for decided, dashed amber for reopened.
- **Do** mark every noted line in the gutter and in the overview stripe, findings in amber.
- **Do** take Approve's primary fill away while a step has open findings, and say how many.
- **Do** carry state with the drawn icon set first and a short text label second, and name the shortcut in every tooltip.
- **Do** set explanations in primary ink at 15px/1.6 and notes at 14px/1.55, within 68ch.
- **Do** keep the summary to one plain count line and ruled sections, with the verdict right under Still open and the finishing action waiting for it.
- **Do** keep the action bar sticky at the foot of the main pane and give touch targets 44px at 390px.
- **Do** take every padding and gap from the 4px scale (4, 8, 12, 16, 24, 32px), control padding included.
- **Do** give every interactive control a hover, focus-visible and disabled state.
- **Do** use the three duration tokens and two curves for all motion, and ship the reduced-motion version (opacity and colour only) with every animation.
- **Do** self-host JetBrains Mono for the shipped app; a strict CSP will not load it from a font CDN.

### Don't:
- **Don't** colour a button with a status colour (no green Approve), or use green, amber or red for anything outside the traffic-light set; don't let colour carry a state without its icon and word.
- **Don't** imitate a code-host pull-request page (its header bands, tab strip, avatar-heavy timeline, its Viewed checkbox) or dress the page as a terminal (dark-only, all-mono, prompt glyphs).
- **Don't** draw state as outlined or filled pills.
- **Don't** fill pressed or selected controls (segmented controls, Viewed, verdict and accent options) with the accent; pressed is surface tint and ink.
- **Don't** put panel controls in the header; a window hides from its own title bar and comes back from its stripe.
- **Don't** add uppercase or tracked-out labels, or small labels above headings.
- **Don't** wrap files, forms or comment lists in bordered cards; use a top rule.
- **Don't** give block quotes or callouts a coloured side bar; quotes sit behind a control-edge rule, and only a File Note and the current "Files" entry carry an accent rule.
- **Don't** add big-number stat tiles to the summary.
- **Don't** add shadows beyond the float shadow, the primary shade and the gutter lift.
- **Don't** crossfade panes or bounce anything; motion leaves before it enters and settles without overshoot.
- **Don't** add a fourth text grey.
- **Don't** use the accent for headings, decoration or status.
- **Don't** use text glyphs or emoji as status icons; use the drawn SVG set.
