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
  progress-read: "#a3aab4"
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
  rust: "#9a3412"
  live: "#2b7a4b"
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
  progress-read-dark: "#5a626d"
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
  rust-dark: "#f0a083"
  live-dark: "#6fcf97"
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
  bottom-strip:
    backgroundColor: "{colors.surface}"
    height: "28px"
    padding: "0 8px"
  bottom-strip-button:
    textColor: "{colors.ink-secondary}"
    rounded: "{rounded.control}"
    padding: "2px 8px"
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
- Category-standard layout as IDE tool windows: queue, explanation column, checklist and tool panel each have a title bar with a hide button and collapse to an edge stripe or bottom strip; the queue is open by default.
- One accent, Ultramarine by default (Petrol and Berry by choice), for the primary action, focus, links, decided progress and the reviewer's own words; pressed and selected controls are neutral.
- Findings outrank conversation: amber labels, amber gutter markers, and an Approve that steps down while findings are open.
- Reading prose is set for reading: primary ink, 15px/1.6, 68ch; notes 14px/1.55.
- Decisions and verdicts are neutral grey; no decision ever reads as approval by colour.
- A walked-W mark in the accent signs the header, export, favicon and the preparing state.
- System UI sans for everything human; JetBrains Mono for code, file names, keys and session labels.
- Rules, not boxes; flat at rest; one floating shadow.
- One 4px spacing scale (4, 8, 12, 16, 24, 32px) governs padding, gaps and rhythm.
- Motion in 120 / 200 / 320ms on one ease-out curve; reduced motion keeps only opacity and colour.

## Brand

**The mark** is a W walked in four round-capped strokes (2.3 stroke on a 16px grid, round joins); the last stroke sits at 40% opacity, the part of the walk still to go. In the page it is drawn in the current accent on the canvas, so it follows the person's Appearance choice. For the favicon and app icon it is knocked out of an Ultramarine rounded square (22% corner radius) with the strokes in the on-accent colour; the favicon switches to the dark-theme Ultramarine under a dark colour scheme. Master files: `project/brand/mark.svg`, `project/brand/favicon.svg`, and `app-icon-16/32/180/512.png` rendered from the favicon SVG with provenance embedded.

**The lockup** is the mark plus "Walkthrough" in the UI sans at 700. In the header: 16px mark, 8px gap, -0.01em tracking, ink text. The display lockup (brand sheet): 34px mark, 14px gap, 34px text, -0.02em. The export page uses a quiet lockup: 14px mark, 13px text in muted ink, the mark still in the accent.

**The loader.** The Preparing state uses the mark as its indicator (20px, accent): its walked strokes and its final stroke pulse in turn between 25% and full opacity over 1.4s on the ease-out curve, offset 0.3s. Under reduced motion the mark is still. The Working status in the header keeps its small spinner.

### Named Rules
**The One Mark Rule.** The mark appears only in the accent on canvas, or knocked out of an Ultramarine square. Never outlined, rotated, set in a status colour, or used as a decorative bullet.

## Colors

A cool grey neutral scale with a single, person-configurable accent and three narrowly scoped status hues, each token defined once as a light and dark pair (`light-dark()`); the theme follows the system unless the person picks one, and an accent class re-points the accent family.

### Primary (the accent)
- **Ultramarine** (light `ultramarine`, dark `ultramarine-dark`): the default accent and the brand colour. The primary button fill (with an inset 1px bottom shade), focus rings (2px, 2px offset), the text caret, the active tool-panel tab underline, decided segments of the progress bar, the gutter "+" for a new comment, and the mark.
- **Ultramarine Hover** (`ultramarine-hover`): the primary button's hover and active fill. A disabled primary stays plain Ultramarine on hover.
- **Ultramarine Text** (`ultramarine-text`): the accent at text contrast, for links, step-number links, the Working status, the selected-line gutter number, the reviewer's own gutter marker and "Your comment" label.
- **Ultramarine Wash / Ultramarine Line** (`ultramarine-wash`, `ultramarine-line`): the reviewer's own comments (wash fill, line border), the focused-input halo (3px), the Ask-about-lines row and step-link borders.
- **Petrol and Berry** (`petrol`, `berry`, with dark pairs): alternative accent presets a person can pick in Appearance. Each re-points the whole accent family (fill, hover, text, wash, line, selection) together; the sidecar carries the full sets.

### Status
- **Reopened Amber** (`amber`, `amber-wash`): findings (label, gutter marker, stripe tick, "N open findings" in the action bar), reopened steps and progress segments, "Needs you" and "Offline · retrying" statuses, attention notices and banners (wash fill, no border), folded-file problems, the Flag chip during a swipe, and the session's question box (1px amber border). Amber means "this changed, is wrong, or wants you".
- **Not-met Rust** (`rust`): checklist items, facts-rail criteria and queue entries whose status is not met. Icon colour only; it never fills a surface.
- **Listening Green** (`live`): the Listening session status dot and label. It is session health, never a decision, nothing else.

### Diff
- **Addition / Deletion** (`diff-add`, `diff-add-gutter`, `diff-del`, `diff-del-gutter`): diff2html line backgrounds, with the gutter one step deeper than the code cell. Preview-mode insertions use the addition wash full-bleed.
- **Stripe Add / Stripe Del** (`stripe-add`, `stripe-del`): saturated run marks in the overview stripe only, drawn at 55% and 60% opacity.
- **Picked Lines** (`line-pick`, `line-pick-gutter`): lines the reviewer has selected to ask or comment about; gutter number turns accent text, semibold.

### Neutral
- **Canvas** (`canvas`): page and main pane background; also inputs, the current queue item, verdict options and popovers.
- **Surface** (`surface`): the queue rail, the edge stripes and bottom strip of hidden tool windows, secondary buttons, the code pane, the overview stripe, key caps, banners and the session-message rows.
- **Surface Tint** (`surface-tint`): hover fill (including edge-stripe and bottom-strip buttons) and every pressed or chosen neutral state (segmented controls, Viewed, the chosen verdict and accent option), counters, file chips, reason and draft pills, inline code, skeleton bars.
- **Rule / Rule Soft / Control Edge** (`rule`, `rule-soft`, `control-edge`): primary dividers; secondary dividers between list rows, under file headers and beside the stripe; the 1px edge of every control.
- **Ink / Ink Secondary / Muted** (`ink`, `ink-secondary`, `muted`): primary text and all reading prose; secondary labels, decided state, verdict status, quotes and table values; the single secondary grey per theme, for metadata, counts, undecided state, status-gone, placeholders, line numbers, hunk headers and resting icons.
- **Progress Read** (`progress-read`): read and current segments of the progress bar.
- **Marker Note** (`marker-note`): the gutter marker and stripe tick for an agent note that is not a finding. A data mark, quieter than muted in light so findings outrank it.

### Named Rules
**The Grey Verdict Rule.** A recorded decision or verdict is shown in neutral greys only: decided is a filled dot in secondary ink, the chosen verdict is an ink border on surface tint. Green appears in exactly two places, diff additions and the Listening status, and never next to a decision. (The swipe chip is gesture feedback, not recorded state: accent for Approve, amber for Flag.)

**The One Accent Rule.** The accent marks the primary action, focus, the caret, links, decided progress, picked lines and the reviewer's own words. It is never a heading colour, a pressed-control fill, a section fill or a decorative accent; the one surface it fills is the reviewer's own comment.

**The Your Voice Rule.** The reviewer's own words (their comments, their gutter marker, the "+" that starts one, the picked-range label) wear the accent. The agent's notes stay on the canvas.

**The Findings First Rule.** A finding always reads above conversation: amber label with its icon, amber gutter marker and stripe tick, a count in the facts rail. While a step has open findings, Approve drops its primary fill and the action bar says "N open findings".

**The Three Greys Rule.** Text and interface icons use exactly three greys per theme: ink, secondary ink and muted. Data marks (progress-read, marker-note) are fills on the instrument, not text.

**The Narrow Status Rule.** Amber is reopened, finding or attention; rust is not met; green is listening. If a new state does not mean one of those, it is grey.

## Typography

**UI Font:** system-ui (with -apple-system, Segoe UI, Roboto, sans-serif)
**Code / Label Font:** JetBrains Mono 400/500/600 (with ui-monospace, monospace)

**Character:** The platform's own sans makes the page sit with the reviewer's tools rather than perform; JetBrains Mono is the one deliberate voice, used where exact characters matter. There is no display tier: the largest text in the product is the 19px step title.

### Hierarchy
- **Headline** (650, 19px, 1.25, -0.01em): the open step's title, on desktop, phone and swipe cards. Page titles on the list and export pages sit at 20 to 22px, same weight.
- **Title** (650, 17px): export section headings.
- **Body** (400, 15px, 1.6, primary ink): the agent's explanation and any reading prose, held to 68ch.
- **Body Note** (400, 14px, 1.55, primary ink): note and comment paragraphs. The explanation column and Markdown previews sit at 14.5px; per-file explanations, summary lists and tables at 14px.
- **Body UI** (400, 13px): buttons (500), queue items (13.5px), notices, checklist items, menus, key-sheet rows.
- **Label** (500 to 650, 12.5px): state dot labels, note headers, the kind label, verdict status, the facts rail, the Viewed toggle; small buttons.
- **Meta** (500/600, 12px): counters, facts-rail heading, popover section labels, sub-lines under queue items.
- **Code** (400, 12.5px / 21px line): diff lines; hunk headers drop to 12px in muted ink.
- **Mono Label** (500, 12 to 12.5px): file names in file headers and the facts rail, the session label, file chips, list-page walkthrough names, draft locations.
- **Key** (500, 11.5px mono): key caps in the shortcut sheet.

### Prose
Inside explanations, notes and comments: 12px between blocks; h2 and h3 at 15px 650 with 24px above and 8px below (no size jump, weight alone); disc lists (decimal for ordered) with muted markers, 22px indent and 4px between items; inline code on surface tint with 4px corners and 1px 5px padding at .86em; links in accent text, underlined 1px at a 3px offset; block quotes as a surface box (6px corners, 12px 16px padding, secondary ink), never a coloured side bar.

### Named Rules
**The Mono Means Literal Rule.** Monospace appears only on text that is literally code, a path, a key or an identifier the reviewer may copy. Headings, buttons and statuses stay in the UI sans.

**The Tabular Count Rule.** Every progress figure, count, line number and step number uses tabular figures.

**The Sentence Case Rule.** No uppercase, no tracking-out, no labels above headings. Hierarchy comes from weight (650 against 400) and ink step, not case.

## Layout

The desktop frame is a fixed 44px header over a row of panes arranged as JetBrains-style tool windows around the step. The queue ("To review", open by default) is a 224px rail on the surface tone at left; the open step fills the main pane (16px top and bottom, 24px sides). The explanation column splits a 420px prose column (24px padding, its own action bar at the foot) from the code, which moves to the surface tone. The checklist is a 288px column at the right that ends with a "Whole walkthrough" block above a rule. The tool panel stacks a tabbed panel under the step. Each window has a title bar with a hide button (keys 1 to 4). A hidden queue or explanation column collapses into a 26px edge stripe at the left, a hidden checklist into one at the right, and a hidden tool panel into a 28px strip of its tabs along the bottom, so nothing disappears without leaving a handle. When the queue is hidden, previous and next step navigation sits above the title. Which windows are open is kept for the person with their Appearance, so every walkthrough opens the way they left the last one.
The step head is a two-column grid: the title, state and explanation up to 68ch, and the "In this step" facts rail (220 to 280px) at the right, 32px apart. Below it come the files, then the action bar, docked to the bottom of the pane as a sticky row above a soft hairline. Diff files are not cards: each file opens with a full-bleed sticky header row on a hairline, open files sit 16px apart, and collapsed files stack with no gap between them. A per-file explanation, when present, sits between the header and the diff. Code scrolls horizontally inside its file instead of clipping, with the 10px overview stripe pinned at the right edge. Note rows, the "N more notes" row and the Ask-about-lines composer indent 116px so their text aligns with the code column, not the gutter.

Spacing runs on one 4px scale (`s1` to `s6`: 4, 8, 12, 16, 24, 32px): 4px under the title row, 8px between controls in a row and inside note rows, 12px inside notices and between list rows, 16px between blocks and files and inside the main pane's top and bottom, 24px for pane sides, 32px for page padding and the head-to-rail gap. Control padding: buttons 0 12px, small buttons 0 8px, counters, reasons and file chips 0 8px, step-number links 0 4px, segmented buttons 4px 12px, bottom-strip buttons 2px 8px, icon buttons 4px, the decision chip 4px 8px. Deliberate off-scale values: 2px between queue rows, the 116px code-column indent, and 40px export side padding.

At 390px the header moves the panel show/hide controls and Stop into a "More" menu, where they are checkable menu items and the explanation column is disabled with a "Wider screens" note; the progress bar moves to its own full-width strip under the header, the queue becomes a select with a drawn chevron, the diff scrolls horizontally inside the file while the note stays pinned left, and primary actions become a sticky bottom bar of 44px touch targets. The phone can also decide by swipe deck (see Components); its buttons stay for anyone who does not swipe.

## Elevation & Depth

Flat by default. Depth comes from tonal steps (canvas against the surface rail) and hairline rules. One shadow exists, for things that float: the actions menu, popovers (Appearance, shortcut sheet) and the top card of the phone swipe deck (the card beneath carries none). Two contact cues are allowed and nothing else: the primary button's inset 1px bottom shade, and the 1px contact shadow under the gutter "+" so it reads above the line numbers. The current queue item is "lifted" with a 1px rule ring, not a shadow.

### Shadow Vocabulary
- **Float** (sidecar `float`): menus, popovers and the top swipe card only.
- **Primary shade** (sidecar `primary-shade`): the primary button only.
- **Gutter lift** (sidecar `gutter-lift`): the gutter "+" only.

### Named Rules
**The Rules Not Boxes Rule.** Files, forms, comment lists, summary sections and folded-file lists are separated by a single top rule, never enclosed in a bordered card. Boxes are kept for things that interrupt or move: notices, the session's question, the detached section (dashed), menus and popovers, the toast, the swipe cards and the reviewer's own comments.

## Shapes

Small, tight radii. 4px on every control (buttons, inputs, icon buttons, the Viewed toggle, verdict and accent options, key caps, step links, inline code, focus outlines); 5px on file chips, menu items and the gutter "+"; 6px on joined segmented groups, menus, popovers, textareas and quotes; 7px on notices; 8px on the question box, the detached section, the toast and your own comments; 12px on phone swipe cards; 2px on progress segments. Counters, reasons and draft-status pills are full pills; decision state is never a pill. State dots are 8px circles with a 1.5px edge. The progress bar is a row of 5px-high segments with 3px gaps, one per step. Icons are drawn on a 16px grid with 1.6 to 1.8px strokes and round caps (13 to 15px where they sit inside text); the select chevron is drawn from the same set, never the browser's.

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
Step state is an 8px dot plus a 12.5px 500 word, with no outline or fill around it: **Undecided** is a hollow muted dot; **Decided: <label>** a filled dot in secondary ink; **Reopened** a dashed amber dot in amber. In the summary's decided table the dot is dropped and the label sits in 600 ink.

### Inputs / Fields
- **Style:** canvas fill, 1px control edge, 4px corners, 30px tall; textareas 6px corners, min 84px, resizable.
- **Focus:** edge turns accent with a 3px accent-wash halo; caret is accent.
- **Placeholder:** muted ink; the Ask box names its key ("Ask about this step… ( / )").
- **Select:** native select with its own arrow removed, 30px right padding, and a muted drawn 16px chevron.

### Navigation
- **Header (44px):** the 16px lockup, the kind label, the mono branch or pull-request label, segmented progress bar (180px) with "3/9", then at the right: verdict status (once chosen), Finish review, session status, Stop, and a More (…) icon button for Appearance and shortcuts. No panel controls live in the header.
- **Kind label:** the session's own words for the kind (for example "Your change" or "Review request") in 12.5px muted text, set off by a 1px rule on its left with 12px padding; no icon, since the tool knows only the session's free text (ADR 0005). At 390px the kind takes the label's place next to the logo, the label stays for screen readers only, the count is dropped, and the progress bar runs full width under the header.
- **Progress bar:** decided segments in the accent, read and current in progress-read grey, reopened in amber, unread in the rule tone.
- **Diff-Preview switch:** joined segmented control, 1px control edge, 6px group corners; pressed is surface tint with ink, never the accent.
- **Verdict status:** a muted flag icon plus the chosen verdict in 12.5px 500 secondary ink. Neutral, whatever the verdict.
- **Session status:** a 7px dot plus 13px 600 label: Listening (green), Working (accent text with a spinning icon), Needs you (amber dot with a 3px amber-wash ring), Offline · retrying (amber, with an offline icon, when the server is unreachable), Gone and Stopped (muted hollow dot).
- **Step nav:** previous and next icon buttons plus "Step 4" in 13px, shown above the title only when the queue is hidden.
- **More menu:** on desktop, Appearance and Keyboard shortcuts; at 390px, Swipe to decide, the panels as menu-item checkboxes, then a rule separator above Appearance and Stop.

### Tool Windows
The IDE pattern, played straight.
- **Title bar:** each window names itself in 12px 600 muted text ("To review 8" with its counter, "Explanation", "Checklist"; the tool panel's own tab row serves as its bar), with a 14px minus icon button at the right to hide it; its tooltip names the key ("Hide Checklist (2)").
- **Edge stripe:** a hidden side window leaves a 26px column on the surface tone behind a hairline, holding vertical buttons in 12px secondary ink with an 11.5px muted tabular count ("To review 8", "Explanation" on the left; "Checklist 2/5" on the right). Left-stripe labels read bottom-up, right-stripe labels top-down. Buttons have 4px corners and hover to surface tint with ink; tooltips name the key ("Show Checklist (2)"). An empty stripe is not drawn.
- **Bottom strip:** a hidden tool panel leaves a 28px row on the surface tone above a hairline, with one button per tab ("Notes 4", "From the session 1", "Detached 2"), styled as the stripe buttons.

### Queue ("To review")
The signature rail, headed "To review" with a counter. Items are a 16px state icon plus a 13.5px title and optional 12px sub-line. The current step has its own icon (a ring with a centre dot) in the accent; read steps use the accent half-filled icon; not read is a muted hollow ring; reopened amber; not met rust; session messages muted. The current item is canvas-filled with a 1px rule ring and 600 weight. Decided items fold into "N decided" at the rail's foot. The Summary is the last row, set off by a rule above and marked with a list icon in secondary ink.

### In This Step (facts rail)
Beside the step head, behind a 1px rule with 16px left padding, in 12.5px secondary ink under a 12px 600 muted "In this step" heading. Three groups separated by soft rules: the step's files (mono 12px names in ink, linkable, with tabular counts at the right); the note counts (amber "N finding" with its icon first, then muted "N notes", then accent "N yours"); and the linked checklist criteria with their status icons.

### Diff, Markers and Overview Stripe
diff2html line-by-line, restyled through classes: 46px number columns in muted ink, 12.5/21px mono code with 16px right padding, addition and deletion washes with deeper gutters, picked lines in the line-pick tone. Hunk headers lose their fill and sit in muted ink.
- **Gutter markers:** a line that carries a note shows a 13px icon in a 16px box at the left of its new-line number: amber warning triangle for a finding, accent person for your own comment, marker-note speech bubble for any other note.
- **Overview stripe:** a 10px column at the right edge of each file's diff, on the surface tone behind a soft rule: added and removed runs as 6px-wide stripe-add and stripe-del bars, and each note as a 3px full-width tick in its marker colour. It maps the whole file at a glance and never scrolls with the code.
- **Notes:** a note row spans the table in UI sans, label in 12.5px (a finding's label in amber with its icon), body 14/1.55 in primary ink, replies indented behind a 2px rule. "N more notes" is an accent-text link on a row with no fill. The Ask-about-lines composer is a row in the accent wash with accent-line rules.

### File Header
A 36px sticky row on the canvas: a chevron toggle (collapse/expand), the mono file name, tabular +/- counts, and a Viewed toggle at the right. Viewed is an eye icon button (4px corners, 4px 6px, muted); once pressed it shows the eye plus "Viewed" in secondary ink on surface tint. Viewed is a reading mark, not a decision, and never takes the accent.

### Your Comments
The reviewer's own comment is an accent-wash box with a 1px accent-line border, 8px corners and 12px 16px padding, up to 70ch: a "Your comment" heading in 650 accent text with a person icon, edit and delete icon buttons in accent text, the 14/1.55 body in primary ink, and a 12.5px destination hint (for example "Joins the fix list"). On hover or focus of a line number, a 20px accent "+" square appears in the gutter to start a comment; a picked range offers "Ask about lines" and "Comment".

### Action Bar
Docked at the foot of the step: Approve, Flag, any session offers, the Ask box. While the step has open findings, Approve is a secondary button and an amber "N open finding(s)" with a warning icon closes the row.

### Summary Step
The title with an "N still open" state, one plain 14.5px count line in secondary ink (no big-number tiles), then sections separated by rules (16px padding, 860px max): Still open, **Verdict**, Decided (a table by decision label with right-aligned counts), Flagged, Your comments, Checklist (compact), and [AI] drafts (status pill Accepted, Edited or Dropped on surface tint; a dropped draft is struck through and muted). The Verdict section reads "No verdict yet. Check what is still open, then choose." until chosen, then "Your verdict: <label>" with a Change link; its options are radio buttons offered by the session (canvas, 1px control edge, 4px corners, 5px 12px, muted icon), the chosen one with a secondary-ink border, surface tint, ink text at 600 and a filled icon; a 12.5px hint names where the verdict goes. A finish row closes the page: the primary action, disabled until a verdict is chosen, then a 13px hint on its own line.

### Popovers: Appearance and Shortcuts
Canvas, 1px rule, 6px corners, float shadow, 16px padding. **Appearance** (300px): an Accent radio list (16px swatch with 4px corners, name, "(default)" on Ultramarine; chosen = surface tint, 600) and a Theme radio row (System, Light, Dark) in the verdict-option style, then "Saved for you on this machine." **Keyboard shortcuts** (420px, opened with ?): a two-column table, rows on soft rules, key caps in 11.5px mono ink on the surface tone with a 1px control edge, a 2px bottom edge and 4px corners.

### Notices
- **Neutral:** surface fill, 1px rule, 7px radius, muted icon.
- **Attention:** amber wash, no border, amber icon. Full-width banners use the same pair under the header.
- **Session question:** canvas fill, 1px amber border, 8px radius, amber 650 heading.
- **Detached:** 1px dashed control edge, 8px radius.
- **Undo toast:** inverted (ink fill, canvas text and icon), 8px radius, 14px text, with an underlined Undo link in 650. It rises 12px over 200ms after a 120ms delay.

### Image Diff
Changed images get the same Diff / Preview switch. Preview shows Before and After side by side, each in a 160 × 120 box with 6px corners on a 16px transparency checker (surface tint against canvas), captioned in 12.5px muted text with the pixel size.

### Phone Swipe Deck
At 390px a step can be decided by swiping its card: right approves, left flags (and opens the Flag note). Cards are canvas with a 1px rule, 12px corners and 16px padding, holding the title, explanation, a three-line mini diff and any finding in an amber-wash callout. Mid-drag, a decision chip fades in at the top corner (accent wash and text for Approve, amber for Flag) and edge labels appear. The next card waits beneath at scale .95, 14px lower and 60% opacity, growing to full as the top card leaves; its text stays hidden until the top card has cleared.

### Motion
One family (the Preparing state's pulsing mark and the Working spinner are the only loops): `ease-out` cubic-bezier(0.16, 1, 0.3, 1) for things arriving or settling, `ease-in` cubic-bezier(0.7, 0, 0.84, 0) for things leaving, at 120ms (fast), 200ms (base) and 320ms (slow).
- **Decide:** the queue row slides 16px left (160ms ease-out) while fading (160ms linear), then its height collapses (320ms ease-out after 120ms). The progress segment fills left to right (320ms), and counts tick from .55 opacity and 2px low (200ms).
- **Pane swap:** sequential, never crossfaded: the old pane leaves to -12px (100ms, linear fade), then the new one enters from +12px (200ms ease-out after 100ms).
- **Reveal:** assumptions open by grid rows (320ms) with the chevron turning 90° (120ms); extra notes rise 4px (200ms, 40ms stagger).
- **Attention:** "Needs you" pulses its amber ring twice (1.2s) and then holds still.
- **Swipe:** the card follows the finger, rotating 0.025° per pixel of travel; on release it flies out (200ms ease-in) with its fade held back until late (80ms after 120ms).
- **Reduced motion:** no translate, rotate or scale anywhere: opacity and colour only. Queue rows fade then snap shut, segments fill by opacity, and the swipe card only fades.

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
- **Don't** colour any decision or verdict green, or tint Approve green; green is reserved for diff additions and the Listening status.
- **Don't** imitate a code-host pull-request page (its header bands, tab strip, avatar-heavy timeline, its Viewed checkbox) or dress the page as a terminal (dark-only, all-mono, prompt glyphs).
- **Don't** draw state as outlined or filled pills.
- **Don't** fill pressed or selected controls (segmented controls, Viewed, verdict and accent options) with the accent; pressed is surface tint and ink.
- **Don't** put panel controls in the header; a window hides from its own title bar and comes back from its stripe.
- **Don't** add uppercase or tracked-out labels, or small labels above headings.
- **Don't** wrap files, forms or comment lists in bordered cards; use a top rule.
- **Don't** give block quotes or callouts a coloured side bar; quotes are a surface box.
- **Don't** add big-number stat tiles to the summary.
- **Don't** add shadows beyond the float shadow, the primary shade and the gutter lift.
- **Don't** crossfade panes or bounce anything; motion leaves before it enters and settles without overshoot.
- **Don't** add a fourth text grey.
- **Don't** use the accent for headings or decoration, or use amber and rust for anything but findings, reopened, attention and not met.
- **Don't** use text glyphs or emoji as status icons; use the drawn SVG set.
