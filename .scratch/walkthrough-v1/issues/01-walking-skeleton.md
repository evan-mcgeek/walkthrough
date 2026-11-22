# 01: Walking skeleton

**What to build:**
Running `/walkthrough` on the current branch creates a change walkthrough and opens the page.
The plugin installs as a Claude Code plugin with its skill and the `walkthrough` CLI.
The CLI records a walkthrough pinned to the base (merge-base with the target branch) and the head commit, and serves the page on localhost behind a private token.
The page shows the whole change as one step with a plain-text diff; approving it is saved and survives closing and reopening.
This ticket also sets up both test seams from the spec: the CLI run against a throwaway git repo with a temporary state and config folder and a fake `gh` on `PATH`, and Playwright against the served page.

**Blocked by:** None (can start immediately)

**Status:** done

- [ ] The plugin installs in Claude Code and `/walkthrough` is available.
- [ ] A walkthrough of the current branch is pinned to the merge-base and head SHAs; nothing is checked out.
- [ ] Uncommitted edits are left out and reported as a warning.
- [ ] State lives under the walkthrough state folder and is written only through CLI commands, with locked JSON writes.
- [ ] The server binds localhost, requires the URL token, checks host and origin, accepts only JSON POST bodies and sends CSP headers.
- [ ] The page shows the change as one step with a plain-text diff, and an approve decision is saved.
- [ ] Reopening the walkthrough resumes it with the decision intact.
- [ ] `walkthrough stop` and the page's Stop button end the server.
- [ ] CLI tests and a Playwright test cover the above, including a request without the token being refused.
