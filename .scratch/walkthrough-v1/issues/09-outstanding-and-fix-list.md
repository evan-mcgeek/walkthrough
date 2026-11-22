# 09: Outstanding list and fix list

**What to build:**
An own-branch change walkthrough ends with the outstanding list: ACs no step delivers, broken repo rules, and code that serves no AC.
It writes a fix list (step, location, the person's note, the finding) and copies a one-line prompt pointing at it, for the person to hand to an author session or a new one.
The walkthrough never fixes code itself.

**Blocked by:** 06 Ticket and AC map, 07 Findings and the finding gate

**Status:** wontfix

Superseded by the re-scope of 2026-11-22 (ADR 0005): see tickets 16-27.

- [ ] The outstanding list shows undelivered ACs, broken rules, and code serving no AC.
- [ ] The fix list holds every flagged step and accepted finding with location and note.
- [ ] A one-line prompt pointing at the fix list is copied.
- [ ] Finishing stops the listener.
- [ ] A CLI test covers the fix-list file contents; a Playwright test covers the outstanding list.
