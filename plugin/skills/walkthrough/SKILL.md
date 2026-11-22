---
name: walkthrough
description: Walk through the current branch's change on a local page, one step at a time, before it goes to colleagues. Use when the person runs /walkthrough or asks to walk through or review their branch.
allowed-tools: Bash(walkthrough *)
---

# Walkthrough

The `walkthrough` CLI owns all walkthrough state; never write files under its state folder yourself.

1. Run `walkthrough start` in the repo.
   If the person names the branch their change targets, pass `--target <branch>`.
2. Tell the person, in one or two lines, what the output says: the branch, the pinned base and head, and any warning.
   A warning about uncommitted changes means those edits are not in the walkthrough; say so plainly.
3. The page is open in their browser; they review and decide there.
   Running `walkthrough start` again on the same head reopens the walkthrough with their decisions intact.
4. When the person is done or asks to stop, run `walkthrough stop`.
