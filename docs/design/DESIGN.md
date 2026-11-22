---
name: Walkthrough
description: A local, step-by-step code review page driven by a Claude Code session; the category-standard review layout, finished to IDE grade.
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
  indigo: "#3b5bdb"
  indigo-hover: "#2f4bc4"
  indigo-text: "#3348b8"
  indigo-wash: "#eef1fb"
  indigo-line: "#d4dbf6"
  on-indigo: "#ffffff"
  icon-knockout: "#ffffff"
  amber: "#8a5a00"
  amber-wash: "#fbf1dc"
  rust: "#9a3412"
  live: "#2b7a4b"
  diff-add: "#e8f6ec"
  diff-add-gutter: "#d3eedc"
  diff-del: "#fcebea"
  diff-del-gutter: "#f6d6d3"
  line-pick: "#e6eafb"
  line-pick-gutter: "#d2d9f7"
  canvas-dark: "#15181d"
  surface-dark: "#1b1f25"
  surface-tint-dark: "#232830"
  rule-dark: "#2c323b"
  rule-soft-dark: "#252a32"
  control-edge-dark: "#3a414b"
  ink-dark: "#e5e8ec"
  ink-secondary-dark: "#c3c8cf"
  muted-dark: "#9aa2ac"
  indigo-dark: "#6e86f0"
  indigo-hover-dark: "#8599f4"
  indigo-text-dark: "#a3b3ff"
  indigo-wash-dark: "#232b45"
  indigo-line-dark: "#34406b"
  on-indigo-dark: "#0f1424"
  icon-knockout-dark: "#15181d"
  amber-dark: "#e3b260"
  amber-wash-dark: "#33280f"
  rust-dark: "#f0a083"
  live-dark: "#6fcf97"
  diff-add-dark: "#14281c"
  diff-add-gutter-dark: "#193423"
  diff-del-dark: "#33191a"
  diff-del-gutter-dark: "#3f1f20"
  line-pick-dark: "#222a4a"
  line-pick-gutter-dark: "#2c3664"
typography:
  headline:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "21px"
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
    fontSize: "14.5px"
    fontWeight: 400
    lineHeight: 1.5
  body-ui:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "13.5px"
    fontWeight: 400
    lineHeight: 1.4
  label:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "13px"
    fontWeight: 650
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
  xs: "4px"
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
    backgroundColor: "{colors.indigo}"
    textColor: "{colors.on-indigo}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "34px"
  button-primary-hover:
    backgroundColor: "{colors.indigo-hover}"
  button-primary-active:
    backgroundColor: "{colors.indigo-hover}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "34px"
  button-secondary-hover:
    backgroundColor: "{colors.surface-tint}"
  button-offer:
    textColor: "{colors.ink-secondary}"
    rounded: "{rounded.md}"
    padding: "0 12px"
    height: "34px"
  button-ghost:
    textColor: "{colors.ink-secondary}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "34px"
  button-small:
    rounded: "{rounded.md}"
    padding: "0 12px"
    height: "28px"
  button-touch:
    height: "44px"
  icon-button:
    textColor: "{colors.muted}"
    rounded: "{rounded.sm}"
    padding: "4px"
  input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0 11px"
    height: "34px"
  textarea:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.md}"
    padding: "9px 11px"
    height: "84px"
  tag-undecided:
    textColor: "{colors.muted}"
    typography: "{typography.meta}"
    rounded: "{rounded.pill}"
    padding: "0 8px"
  tag-decided:
    backgroundColor: "{colors.surface-tint}"
    textColor: "{colors.ink-secondary}"
    rounded: "{rounded.pill}"
    padding: "0 8px"
  tag-reopened:
    textColor: "{colors.amber}"
    rounded: "{rounded.pill}"
    padding: "0 8px"
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
    textColor: "{colors.indigo-text}"
    rounded: "{rounded.xs}"
    padding: "0 4px"
  queue:
    backgroundColor: "{colors.surface}"
    width: "232px"
    padding: "12px 8px"
  queue-item:
    textColor: "{colors.ink}"
    typography: "{typography.body-ui}"
    rounded: "{rounded.md}"
    padding: "8px"
  queue-item-current:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
  segmented-button:
    padding: "4px 12px"
  layout-switch-button:
    padding: "4px 8px"
  segmented-pressed:
    backgroundColor: "{colors.indigo-wash}"
    textColor: "{colors.indigo-text}"
  header:
    height: "48px"
    padding: "0 16px"
  select:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.md}"
    padding: "0 30px 0 8px"
    height: "34px"
  notice-attention:
    backgroundColor: "{colors.amber-wash}"
    rounded: "{rounded.lg}"
    padding: "{spacing.s3}"
  ask-row:
    backgroundColor: "{colors.indigo-wash}"
    padding: "12px 16px 12px 116px"
  swipe-card:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.card}"
    padding: "{spacing.s4}"
  decision-chip:
    backgroundColor: "{colors.indigo-wash}"
    textColor: "{colors.indigo-text}"
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

Walkthrough is the standard review arrangement played straight: a 48px header, a queue of what is left on the left, the open step on the right, the diff and the agent's explanation carrying the screen. It is built to be trusted on sight, at the finish level of a JetBrains IDE: cool white and near-white neutrals, hairline rules instead of boxes, one indigo for whatever is interactive, selected or in progress, and drawn 16px line icons that carry state so the chrome can stay nearly wordless.

Density is IDE density, not web-app density. Interface text sits at 13 to 13.5px, the step title tops out at 21px, and every number is tabular. Containers are mostly removed: files, forms, comment lists and the folded step are separated by a single top rule, not by cards. Depth exists only for things that float (the actions menu). Every surface ships in light and dark from the same semantic token set, and dark mode follows the system. Motion is functional and short: it shows where a decided item went and what changed, then gets out of the way.

It refuses two looks by name: the code-host pull-request page clone, and the terminal costume. Monospace is a tool for code, file names and labels, never an atmosphere.

**Key Characteristics:**
- Category-standard layout; four switchable layouts ("What's left" default, "Explanation beside code", "Three columns", "Tool panel") share one component set.
- Cool neutral scale with one indigo; amber and rust are state, not decoration.
- Decisions are neutral grey; no decision ever reads as approval by colour.
- System UI sans for everything human; JetBrains Mono for code, file names and session labels.
- Rules, not boxes; flat at rest; one floating shadow.
- Drawn SVG line icons at 16px carry status; text labels confirm, never shout.
- One 4px spacing scale (4, 8, 12, 16, 24, 32px) governs padding, gaps and rhythm.
- Motion in 120 / 200 / 320ms on one ease-out curve; reduced motion keeps only opacity and colour.

## Colors

A cool grey neutral scale with a single indigo accent and three narrowly scoped status hues, defined once per theme and switched by a light/dark class.

### Primary
- **Review Indigo** (light `indigo`, dark `indigo-dark`): the primary button fill, focus rings (2px, 2px offset), the text caret, the active tab underline, the current and read queue icons, and decided segments of the progress bar. It is the colour of "you can act here" and "this is where you are".
- **Indigo Hover** (`indigo-hover`): the primary button's hover and active fill, one step deeper than indigo in light and one step lighter in dark. A disabled primary stays plain indigo on hover.
- **Indigo Text** (`indigo-text`): indigo at text contrast, for links, step-number links, the pressed state of segmented controls, the Working status and the selected-line gutter number.
- **Indigo Wash / Indigo Line** (`indigo-wash`, `indigo-line`): the pressed segment fill, the focused-input halo (3px), the Ask-about-lines row, read and current progress segments, and step-link borders.

### Status
- **Reopened Amber** (`amber`, `amber-wash`): reopened steps and tags, "Needs you" status, attention notices and banners (wash fill, no border), folded-file problems, findings on the phone card, the Flag chip during a swipe, and the session's question box (1px amber border). Amber means "this changed or wants you".
- **Not-met Rust** (`rust`): checklist items and queue entries whose status is not met. Icon colour only; it never fills a surface.
- **Listening Green** (`live`): the Listening session status dot and label. It is session health, never a decision, nothing else.

### Diff
- **Addition / Deletion** (`diff-add`, `diff-add-gutter`, `diff-del`, `diff-del-gutter`): diff2html line backgrounds, with the gutter one step deeper than the code cell. Preview-mode insertions use the addition wash full-bleed.
- **Picked Lines** (`line-pick`, `line-pick-gutter`): lines the reviewer has selected to ask about; gutter number turns indigo text, semibold.

### Neutral
- **Canvas** (`canvas`): page and main pane background; also input fields and the current queue item, which reads as lifted against the queue.
- **Surface** (`surface`): the queue rail, secondary buttons, the code pane, banners and the session-message rows.
- **Surface Tint** (`surface-tint`): hover fill, decided tags, counters, file chips, reason pills, skeleton bars.
- **Rule / Rule Soft / Control Edge** (`rule`, `rule-soft`, `control-edge`): primary dividers; secondary dividers between list rows and under file headers; the 1px edge of every control (buttons, inputs, segmented switches, tags).
- **Ink / Ink Secondary / Muted** (`ink`, `ink-secondary`, `muted`): primary text; explanation prose and secondary labels; the single secondary grey per theme, for metadata, counts, status-gone, placeholders, line numbers, hunk headers and resting icons.

### Named Rules
**The Grey Verdict Rule.** A recorded decision is shown in neutral greys only: the decided tag is surface tint with secondary ink. Green appears in exactly two places, diff additions and the Listening status, and never next to a decision. (The swipe chip is gesture feedback, not recorded state: indigo for Approve, amber for Flag.)

**The One Indigo Rule.** Indigo marks interaction, selection, focus and progress. It is never a heading colour, a section fill or a decorative accent.

**The Three Greys Rule.** Text and icons use exactly three greys per theme: ink, secondary ink and muted. A fourth, "fainter" grey is not part of the system.

**The Narrow Status Rule.** Amber is reopened or attention; rust is not met; green is listening. If a new state does not mean one of those, it is grey.

## Typography

**UI Font:** system-ui (with -apple-system, Segoe UI, Roboto, sans-serif)
**Code / Label Font:** JetBrains Mono 400/500/600 (with ui-monospace, monospace)

**Character:** The platform's own sans makes the page sit with the reviewer's tools rather than perform; JetBrains Mono is the one deliberate voice, used where exact characters matter. There is no display tier: the largest text in the product is the 21px step title.

### Hierarchy
- **Headline** (650, 21px, 1.25, -0.01em): the open step's title; 19px at 390px wide and on swipe cards. Page titles on the list and export pages sit at 20 to 22px, same weight.
- **Title** (650, 17px): export section headings; 16px for Markdown headings inside a preview.
- **Body** (400, 14.5px, 1.5): the agent's explanation and preview prose, held to 66 to 72ch.
- **Body UI** (400, 13.5px, 1.35 to 1.5): queue items, notes, notices, checklist items, menu items, buttons (500).
- **Label** (650, 13px): queue and section headers, note labels, form headers.
- **Meta** (500/600, 12 to 12.5px): counters, tags, sub-lines under queue items, hints, reply authors.
- **Code** (400, 12.5px / 21px line): diff lines; hunk headers drop to 12px in muted ink.
- **Mono Label** (500, 12 to 12.5px): file names in file headers, the session label in the header, file chips, list-page walkthrough names, detached "was" locations.

### Named Rules
**The Mono Means Literal Rule.** Monospace appears only on text that is literally code, a path, or an identifier the reviewer may copy. Headings, buttons and statuses stay in the UI sans.

**The Tabular Count Rule.** Every progress figure, count, line number and step number uses tabular figures.

**The Sentence Case Rule.** No uppercase, no tracking-out, no labels above headings. Hierarchy comes from weight (650 against 400) and ink step, not case.

## Layout

The desktop frame is a fixed 48px header over a row of panes. "What's left" (default) puts a 232px queue rail on the surface tone at left and the open step in the main pane (24px top and bottom, 32px sides). The other three layouts rearrange the same parts: "Three columns" adds a 288px side pane; "Explanation beside code" splits a 400px prose pane from a code pane on the surface tone; "Tool panel" stacks a tabbed panel under the step. All four keep identical functions.

The main pane is a column: title row, explanation, assumptions toggle, files, then the action bar, docked to the bottom of the pane as a sticky row above a soft hairline. Diff files are not cards: each file opens with a full-bleed sticky header row on a hairline, and files sit 24px apart. Note rows, the "N more notes" row and the Ask-about-lines composer indent 116px so their text aligns with the code column, not the gutter.

Spacing runs on one 4px scale (`s1` to `s6`: 4, 8, 12, 16, 24, 32px): 8px between controls in a row and within a title row, 12px inside notices and between list rows, 16px for form and notice spacing, 24px between blocks and files, 32px for pane sides and page padding. Control padding is on the same scale: buttons 0 16px, small, offered and note buttons 0 12px, tags, counters, reasons and file chips 0 8px, step-number links 0 4px, segmented buttons 4px 12px, layout-switch buttons 4px 8px, icon buttons 4px, queue rows 8px, the decision chip 4px 8px. The only off-scale values are deliberate: 2px between queue rows, the 116px code-column indent, and 40px export side padding.

At 390px the header drops the layout switch and Stop into a "More" menu, the progress bar moves to its own full-width strip under the header, the queue becomes a select with a drawn chevron, the diff scrolls horizontally inside the file (620px table) while the note stays pinned left, and primary actions become a sticky bottom bar of 44px touch targets. The phone can also decide by swipe deck (see Components); its buttons stay for anyone who does not swipe.

## Elevation & Depth

Flat by default. Depth comes from tonal steps (canvas against the surface rail) and hairline rules. One shadow exists, for things that float: the actions menu and the top card of the phone swipe deck (the card beneath carries none). The current queue item is "lifted" with a 1px rule ring, not a shadow.

### Shadow Vocabulary
- **Float** (sidecar `float`): menus, popovers and the top swipe card only.

### Named Rules
**The Rules Not Boxes Rule.** Files, forms, comment lists and folded-file lists are separated by a single top rule, never enclosed in a bordered card. Boxes are kept for things that interrupt or move: notices, the session's question, the detached section (dashed), the menu, the toast and the swipe cards.

## Shapes

Small, tight radii: 6px on every control (buttons, inputs, segmented switches), 7px on notices, 8px on interrupting containers (menu, question box, detached section, toast), 12px on phone swipe cards, 5px on icon buttons, chips and menu items, 4px on step links and focus outlines, 2px on progress segments. Tags, counters and reason pills are full pills. The progress bar is a row of 5px-high segments with 3px gaps, one per step, coloured by state. Icons are drawn on a 16px grid with 1.6 to 1.8px strokes and round caps; the select chevron is drawn from the same set, never the browser's.

## Components

### Buttons
Restrained and exact; the label carries the meaning.
- **Shape:** gently squared (6px), 34px tall, 16px horizontal padding, 13.5px at 500.
- **Primary:** indigo fill, on-indigo text, 600 weight. One per action group (Approve). Hover and active deepen to indigo hover; disabled keeps indigo.
- **Secondary:** surface fill, 1px control edge; hover steps to surface tint, except when disabled.
- **Ghost:** no fill or edge, secondary ink.
- **Session offer:** a secondary button with a dashed control edge, secondary ink and a muted message icon, for actions the session offers on a step. The dash says "offered, not built in".
- **Small:** 28px tall, 12px padding, 13px. **Touch:** 44px tall at 390px.
- **Focus:** 2px indigo outline, 2px offset. **Disabled:** 50% opacity. **Press:** scales to .97 over 120ms; hover fills change linearly over 120ms.

### Tags and Pills
- **Undecided:** muted text, 1px control-edge outline, pill. **Decided:** surface-tint fill, no edge, secondary ink. **Reopened:** amber text and amber outline.
- **Counter / reason:** surface-tint pill, muted 12px tabular text.
- **File chip:** surface-tint, mono 12px, 5px radius, no border.

### Inputs / Fields
- **Style:** canvas fill, 1px control edge, 6px radius, 34px tall (textarea min 84px, resizable).
- **Focus:** edge turns indigo with a 3px indigo-wash halo; caret is indigo.
- **Placeholder:** muted ink.
- **Select:** native select with its own arrow removed, 30px right padding, and a muted drawn 16px chevron 9px from the edge.

### Navigation
- **Header:** logo (700), mono session label, segmented progress bar (180px) with "3/9" tabular count, layout switch, session status, Stop. No other chrome text.
- **Layout switch / Diff-Preview switch:** joined segmented control, 1px control edge, pressed segment indigo-wash with indigo text.
- **Tabs (Tool panel):** text tabs; selected is ink 600 with a 2px indigo inset underline.

### Queue ("What's left")
The signature rail. Items are a 16px state icon plus a 13.5px title and optional 12px sub-line. Icon colour carries state: muted for not read and for session messages, indigo for read and current, amber for reopened, rust for not met. The current item is canvas-filled with a 1px rule ring and 600 weight. Decided items fold into "N decided" at the rail's foot and render muted when opened.

### Session Status
A 7px dot plus 13px 600 label: Listening (green), Working (indigo text with a spinning icon, 1s linear), Needs you (amber dot with a 3px amber-wash ring), Gone (muted hollow dot).

### Diff and Notes
diff2html line-by-line, restyled through classes and laid out as described in Layout: 46px number columns in muted ink, 12.5/21px mono code, addition and deletion washes with deeper gutters, picked lines in the line-pick tone. Hunk headers lose their fill and sit in muted ink. A note row spans the table in UI sans, top and bottom rules, label in 650, replies indented behind a 2px rule. "N more notes" is an indigo-text link on a row with no fill. The Ask-about-lines composer is a row in the indigo wash with indigo-line rules: a "Ask about <file> lines a–b" label, a focused input, then small Cancel (ghost) and Ask (primary).

### Image Diff
Changed images get the same Diff / Preview switch. Preview shows Before and After side by side, each in a 160 × 120 box with 6px corners on a 16px transparency checker (surface tint against canvas), captioned in 12.5px muted text with the pixel size.

### Notices
- **Neutral:** surface fill, 1px rule, 7px radius, muted icon.
- **Attention:** amber wash, no border, amber icon. Full-width banners use the same pair under the header.
- **Session question:** canvas fill, 1px amber border, 8px radius, amber 650 heading.
- **Detached:** 1px dashed control edge, 8px radius.
- **Undo toast:** inverted (ink fill, canvas text and icon), 8px radius, 14px text, with an underlined Undo link in 650. It rises 12px over 200ms after a 120ms delay.

### Phone Swipe Deck
At 390px a step can be decided by swiping its card: right approves, left flags (and opens the Flag note). Cards are canvas with a 1px rule, 12px corners and 16px padding, holding the title, explanation, a three-line mini diff and any finding in an amber-wash callout. Mid-drag, a decision chip fades in at the top corner (indigo wash and text for Approve, amber for Flag) and edge labels appear. The next card waits beneath at scale .95, 14px lower and 60% opacity, growing to full as the top card leaves; its text stays hidden until the top card has cleared. A hint line under the deck says how to swipe.

### Motion
One family: `ease-out` cubic-bezier(0.16, 1, 0.3, 1) for things arriving or settling, `ease-in` cubic-bezier(0.7, 0, 0.84, 0) for things leaving, at 120ms (fast), 200ms (base) and 320ms (slow).
- **Decide:** the queue row slides 16px left (160ms ease-out) while fading (160ms linear), then its height collapses (320ms ease-out after 120ms). The progress segment fills left to right (320ms), and counts tick from .55 opacity and 2px low (200ms).
- **Pane swap:** sequential, never crossfaded: the old pane leaves to -12px (100ms, linear fade), then the new one enters from +12px (200ms ease-out after 100ms).
- **Reveal:** assumptions open by grid rows (320ms) with the chevron turning 90° (120ms); extra notes rise 4px (200ms, 40ms stagger).
- **Attention:** "Needs you" pulses its amber ring twice (1.2s) and then holds still.
- **Swipe:** the card follows the finger, rotating 0.025° per pixel of travel; on release it flies out (200ms ease-in) with its fade held back until late (80ms after 120ms).
- **Reduced motion:** no translate, rotate or scale anywhere: opacity and colour only. Queue rows fade then snap shut, segments fill by opacity, and the swipe card only fades.

## Do's and Don'ts

### Do:
- **Do** route every colour through the semantic tokens and switch themes by class; the shipped page runs under a strict CSP, so all styling lives in classes, never inline styles.
- **Do** restyle diff2html's line-by-line output through classes to the diff tokens above rather than shipping its default theme.
- **Do** show decided state with the decided tag (surface tint, secondary ink) and the grey decided icon, and undecided with the outlined tag.
- **Do** carry state with the drawn 16px icon set first and a short text label second.
- **Do** keep the action bar sticky at the foot of the main pane and give touch targets 44px at 390px.
- **Do** take every padding and gap from the 4px scale (4, 8, 12, 16, 24, 32px), control padding included.
- **Do** give every interactive control a hover, focus-visible and disabled state; the primary uses indigo hover.
- **Do** use the three duration tokens and two curves for all motion, and ship the reduced-motion version (opacity and colour only) with every animation.
- **Do** self-host JetBrains Mono for the shipped app; a strict CSP will not load it from a font CDN.

### Don't:
- **Don't** colour any decision green, or tint Approve green; green is reserved for diff additions and the Listening status.
- **Don't** imitate a code-host pull-request page (its header bands, tab strip, avatar-heavy timeline) or dress the page as a terminal (dark-only, all-mono, prompt glyphs).
- **Don't** add uppercase or tracked-out labels, or small labels above headings.
- **Don't** wrap files, forms or comment lists in bordered cards; use a top rule.
- **Don't** add shadows beyond the float shadow on menus and the top swipe card.
- **Don't** crossfade panes or bounce anything; motion leaves before it enters and settles without overshoot.
- **Don't** add a fourth text grey between muted and the rules.
- **Don't** use indigo for headings or decoration, or use amber and rust for anything but reopened/attention and not met.
- **Don't** use text glyphs or emoji as status icons; use the drawn SVG set.
