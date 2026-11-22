# 18: Page opens before steps exist

**What to build:**
`start` opens the page at once in a preparing state, and steps, notes and checklist appear on the open page as soon as the session records them, without a reload.
The walkthrough data is polled like the session state, and polling never moves the step being read.

**Blocked by:** 16 Strip the rules out of the tool

**Status:** ready-for-agent

- [ ] The page shows a preparing state until steps are recorded.
- [ ] Recording steps updates an open page within the poll interval.
- [ ] The current step and any opened folded diff stay as they were across updates.
