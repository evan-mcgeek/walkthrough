# 04: Page and session loop

**What to build:**
Actions on the page reach the Claude Code session and its answers come back to the page.
The session runs `walkthrough listen` in the background; it exits when the person acts on the page, which wakes the session.
The session replies with `walkthrough say`, which the page shows.
Ask on a step works end to end, and the page shows whether the session is listening, working, waiting for the person, or quiet.

**Blocked by:** 01 Walking skeleton

**Status:** done

- [ ] Pressing Ask on a step makes a running `walkthrough listen` exit with that request.
- [ ] `walkthrough say` puts the answer on the page; the step's decision is unchanged.
- [ ] The chat stays usable while the page waits.
- [ ] The status chip shows listening, working, needs you, and quiet.
- [ ] Finishing a walkthrough stops the listener.
- [ ] The server stops itself after no page has been connected for a while.
- [ ] CLI tests cover listen exiting on a request and say reaching page state; a Playwright test covers Ask and the chip.
