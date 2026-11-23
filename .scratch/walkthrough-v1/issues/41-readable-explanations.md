# 41: Readable explanations

**What to build:**
The step explanation today is 14.5px secondary ink at line height 1.5, and session Markdown inside it (paragraphs, lists, headings, inline code, quotes) has almost no styling of its own.
1. Explanation prose in primary ink, 15px at line height 1.6, kept to about 68ch, with clear spacing between paragraphs.
2. Proper styles for Markdown inside explanations, per-file explanations and notes: lists with real indents and spacing, small headings in the label weight, inline code on a light tint at 0.9em, quotes behind a 2px rule, links in the brand text colour.
3. Same treatment in light and dark, at 390px, and in the export; contrast stays at AA or better.
4. Update DESIGN.md's typography section to match, and check the board's look still holds.

Design: extend DESIGN.md's existing tokens and components.

**Blocked by:** 36 Two flows, two commands

**Status:** ready-for-agent
