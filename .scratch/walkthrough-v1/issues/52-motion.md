# 52: Motion

**What to build:**
The Motion section of docs/design/DESIGN.md, with docs/design/prototype.html as the reference for timing and feel.

1. Tool windows hide and show (content fade, width collapse, edge stripe and its button), files open and close by grid rows with flush headers, the Summary's pane swap, popovers from their control, the accent cross-fade over registered colour properties (theme switches snap), the stepper's ink marker walking and segments filling, the decided row lifting into "N decided", and the one authored moment: the verdict docking into the header.
2. Reduced motion: no translate, rotate or scale anywhere; opacity and colour only, as DESIGN.md lists case by case.
3. Motion never delays input or state: a click takes effect at once and the animation follows; tests never wait on an animation to see state.

Design: docs/design/HANDOFF.md first (it wins over the boards where they differ), then docs/design/DESIGN.md (Motion) and docs/design/prototype.html.

**Blocked by:** 51 The Summary as a ledger (both edit src/page/app.ts)

**Status:** done
