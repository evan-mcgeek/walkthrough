# 55: One traffic-light status set

**What to build:**
A reviewer could not tell how far along they were: the header bar and To review drew progress in two legends that disagree (a decided step blue in the bar, grey in the queue), with two greys for read and not read.
Round 4 of the design replaces both with one set, the same in the header bar, To review, the Summary, the verdict, the checklist, the swipe chip and Help: green decided positive or met, amber needs you, red not met, grey undecided or tone-less, ink for the current step.

Build "Round 4: one traffic-light status set" in `docs/design/HANDOFF.md`, with `DESIGN.md` (Colors → Status) and the "Round 4" boards in `screens.html`:

1. Tokens `--ok`/`--ok-bg`, `--bad`/`--bad-bg` (`--rust` aliases `--bad`), `--neu`, and `--live` now secondary ink, light and dark; the accent carries no status anywhere.
2. Actions carry `"tone": "positive" | "attention" | "none"` in the actions file (left out means none); the CLI stores and validates the value only, the guide documents it with an example, and the default step actions are Approve positive and Flag attention (ADR 0005: the session picks the tone from the review policy).
3. A step's display state from the handoff (cur, ok, flag, neu, reo, find, un); read but undecided has no look of its own, still tracked in data.
4. The header bar, To review icons and sub-lines, "N decided", the Summary ledger, the verdict, the checklist, the swipe chip and Help as the handoff says.
5. The review policy template gives each step and verdict action its tone; its new hash ships in `src/policy.ts`.
6. Copy the round 4 `DESIGN.md`, `PRODUCT.md`, `HANDOFF.md`, `screens.html` and `prototype.html` into `docs/design/`, keeping what tickets 53 and 54 added to DESIGN.md (file spacing, finding counts, note buttons).

Design: round 4 on the canvas (HANDOFF.md "Round 4", DESIGN.md Colors → Status, Screens "Round 4" boards).

**Blocked by:** 54 Findings you can reach (both edit src/page/app.ts)

**Status:** ready-for-agent

- [ ] Tokens added; no status selector uses the accent.
- [ ] `tone` recorded, validated, documented; defaults on Approve and Flag.
- [ ] Bar, queue, Summary, verdict, checklist, swipe and Help match the round 4 boards in light and dark, 1440px and 390px.
- [ ] A greyscale screenshot still tells every state apart.
- [ ] Template tones and hash; design files in docs/design.
