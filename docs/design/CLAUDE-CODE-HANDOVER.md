# Handover to Claude Code: build design rounds 4 and 5

Paste this into a Claude Code session opened in the Walkthrough repository.

---

You are implementing the Walkthrough review page's design, rounds 4 and 5. The design lives outside the repo; copy these files from the design artifact into `docs/design/` first and treat them as the source of truth:

| File | What it is |
|---|---|
| `HANDOFF.md` | The work list, round by round, with done-when checks. Start here: the **Round 4** and **Round 5** sections. |
| `DESIGN.md` | The design system as built plus rounds 4–5: tokens (Colors → Status table), components, motion, and **Words** (caps and the session's slot shapes). |
| `PRODUCT.md` | Behaviour and the plain-words glossary. |
| `COPY-round-5.md` | Every on-page string, old → new or "remove". |
| `screens.html` | The boards. The "Round 5" and "Round 4" sections at the top are the target; each Round 5 section shows Before (today) and After. |
| `prototype.html` | Interaction and motion reference (header, step, notes, action bar, queue, Summary verdict). |

## Constraints (do not break)
- Plain HTML and CSS, framework-free TypeScript, no component library; diff2html renders diffs, restyled through classes.
- Strict CSP: no inline `style` attributes or inline scripts in markup. CSSOM from the bundle (`el.style.setProperty`, `el.animate`) is fine.
- Tokens only, light and dark from one semantic set. WCAG 2.2 AA. Every colour and icon also has a word (visible, tooltip, or accessible name).
- Motion uses the DESIGN.md family (120/200/320ms, one 440ms verdict moment) and has a `prefers-reduced-motion` path. Start animations in the same task as the click; no `setTimeout` to begin motion.
- The tool never infers meaning from an action's label (ADR 0005): tone and consequence come from the session.

## Order of work
1. **Round 4 tokens and status set** (HANDOFF → Round 4): `--ok`, `--bad`, `--neu`, Listening neutral; step display states `cur | ok | flag | neu | reo | find | un`; bar fills (solid, hatched amber, outlined, faint, taller ink); queue and ledger icons; checklist colours and words; verdict tone; swipe chip.
2. **Session data:** add `tone`, `label`, `consequence`, `outcome`, `asks_reason`, `primary` to recorded actions and `kind`, `needs_decision` to notes (HANDOFF → Round 5 → 4). Defaults: Approve positive, Flag attention. Update the review-policy template with DESIGN.md → Words → Shapes.
3. **Copy:** apply `COPY-round-5.md` (grep the templates for every old string).
4. **Round 5 layout** (HANDOFF → Round 5, sections 1–6): header, To review rows and badges, step head chips and file-header counts, note actions and folded outcomes, action bar, Summary (Still open / Goes out / Checklist / decided fold / rail, before and after sending), Checklist page, Session messages page, Help (icons and keys), phone and swipe, list page and export.
5. **Motion:** port from `prototype.html` (decide chip into "N decided", ink stepper marker, verdict dock, tool-window collapse, file collapse, popovers), each with its reduced-motion path.

## How to check your work
- Run each done-when list in HANDOFF.md (Round 4, Round 5, and the global one).
- Compare light and dark at 1440 and 390 against the Round 5 "After" boards; take screenshots and look at them.
- Greyscale screenshot: every status still distinguishable by shape.
- Reduced motion on: no translate, scale or width animation; feedback still visible.
- Report anything you could not match, and any string over its cap.

## Out of scope
- Session liveness heartbeat (engineering note, not for this release).
- Kind label stays out of the header (it is the branch label's tooltip).
