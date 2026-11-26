---
description: Review a change you walked through again once it has new commits, such as the fixes from its fix list, choosing between only what changed with whether each comment was addressed, and the whole change. Use when the person runs /walkthrough:update, or once you have committed the fixes from a walkthrough's fix list.
argument-hint: [pull request number or link]
allowed-tools: Bash(walkthrough *)
---

# Updating a walkthrough

The change was walked through before and has new commits since, such as the fixes from its fix list: $ARGUMENTS

1. For a pull request, named there or walked through with `/walkthrough:pr`, invoke `/walkthrough:pr` with its number or link using your skill tool.
   Otherwise invoke `/walkthrough` with your skill tool, for the branch or range the walkthrough was of.
2. Follow that skill.
   Its `walkthrough start` prints "Last reviewed at <head>", and the skill then asks the person whether to review only what changed or the whole change.
3. When start prints "Already reviewed at this head" instead, tell the person in one line that nothing was committed since the last review, and go on as that skill says.
