# 58: Round 5 motion

**What to build:**
Port the motion in docs/design/prototype.html to the round 5 page: the decide chip into "N decided" (its text fades before it lands; the old count stays until the new one fades in), the ink stepper marker, the verdict dock, hiding and showing To review (rows and header arrive together), file collapse and Viewed, popovers, and the send button fading in when it becomes active.
Each has a reduced-motion path (opacity and colour only; a flagged step's amber fill fades in).

**Blocked by:** 57

**Design:** docs/design/prototype.html, DESIGN.md (Motion), HANDOFF.md (Motion)

- [ ] Each motion matches the prototype, normal and reduced
- [ ] Repeated or interrupted clicks stack no ghosts and leave no row half-collapsed
- [ ] The designer's open items checked: the 5px shift after Viewed under reduced motion; closing a popover, changing the verdict twice, note actions, reopening a Viewed file, fast repeated decisions

**Status:** ready-for-agent
