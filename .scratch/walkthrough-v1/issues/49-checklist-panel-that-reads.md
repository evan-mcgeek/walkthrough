# 49: A checklist panel that says what it is

**What to build:**
In the checklist panel the person sees an icon, the item's text squeezed beside a row of step-number pills, and a bare counter such as "19/26".
Seen in a real walkthrough of this repo (light theme, 1440px, checklist panel open): an item linked to five steps wraps its text one or two words a line ("start --" / "kind"), the status the session wrote never shows in the panel, and the person could not tell what the list was for or what "19/26" counted.

1. Each item in the panel reads top to bottom: the state icon and the item's text at the full width of the panel, then one muted line under the text with the session's status and the linked steps, such as "partly met: V still runs after Stop · Steps 4, 10, 13".
   The step numbers are plain links in that line, each with its step's title as its tooltip, not pills; "Step 2" for one, "Steps 2, 3" for several, none when the item links no step.
   A status whose mark is "partly" or "not-met" is in amber text; "met" and "unchecked" stay muted.
2. The counter beside the title says what it counts: "19 of 26 met", with the same words for a screen reader.
3. The checklist can carry the session's own one-line description, shown in muted text under its title in the panel and on the checklist page, such as "Each acceptance criterion from the tickets, and the steps that deliver it."
   It is an optional `"description"` field of the checklist file; `walkthrough guide` documents it and its example uses it; the CLI stores it as given and never reads it (ADR 0005).
4. Inline code in an item's text does not break across lines inside the code ("start --" / "kind").
5. The checklist page (opened from the queue or the panel's title) and the Summary's checklist section follow the same item layout.
6. Check it with this repo's real checklist (21 items, statuses of a few words, items linked to one to five steps) in light and dark, 1440px and 390px, and in the export; update DESIGN.md's checklist description.

Design: extend DESIGN.md's existing tokens and components.

**Blocked by:** 48 File explanations in the explanation column (both edit src/page/app.ts)

**Status:** in progress

- [ ] Panel items: full-width text, then one muted line with the status and the step links; amber for partly and not met.
- [ ] Counter reads "N of M met".
- [ ] The optional description is recorded, documented in the guide, and shown under the title.
- [ ] Inline code in item text keeps together.
- [ ] Checklist page and Summary use the same item layout.
- [ ] Checked in light, dark, 1440px, 390px and the export; DESIGN.md matches.

## Seams under test

- The CLI: `walkthrough checklist` records and serves a description, refuses a description that is not text, and the guide's example records as it is.
- The page: an item's status and step links in one line under its text; the counter's words; the description under the title.
