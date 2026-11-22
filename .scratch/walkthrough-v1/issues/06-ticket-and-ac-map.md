# 06: Ticket and AC map

**What to build:**
The walkthrough opens with the ticket's ACs, each linked to the steps that deliver it or marked not found.
The ticket comes from the ticket key in the branch name, else the pull request title, with an override.
Decision comments are read and a later comment overrides an earlier one.
A fresh spec reviewer builds the AC map.
With no ticket the panel says so and accepts pasted ACs.

**Blocked by:** 05 Steps

**Status:** wontfix

Superseded by the re-scope of 2026-11-22 (ADR 0005): see tickets 16-27.

- [ ] The ticket key is taken from the branch name, else the PR title, and can be overridden.
- [ ] Description and decision comments are read; a later comment overrides an earlier one.
- [ ] The spec reviewer runs in a fresh context that never sees the author session.
- [ ] Every AC links to its steps or shows as not found.
- [ ] With no ticket, the AC panel says so and accepts pasted ACs.
- [ ] A Playwright test covers the AC panel with a not-found AC.
