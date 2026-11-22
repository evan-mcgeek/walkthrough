# 14: Thread walkthrough: replies to your review

**What to build:**
On a pull request the person reviewed that has new replies, `/walkthrough <PR number>` runs a thread walkthrough showing only threads with new activity and the commits since their review.
A fresh agent checks at the new head whether each reply or commit resolves the concern.
The person resolves, replies, or keeps blocking; thread resolutions apply only when they submit.

**Blocked by:** 13 Thread walkthrough: a review you received

**Status:** ready-for-agent

- [ ] Kind detection picks this walkthrough for a PR the person reviewed with new replies.
- [ ] Only threads with new activity and commits since the person's review are shown.
- [ ] Each thread gets a fresh-agent verdict at the new head.
- [ ] Resolve, Reply and Still blocking are saved; replies are drafted with the AI marker.
- [ ] Nothing changes on GitHub until the person submits.
- [ ] CLI tests cover the activity filter and the payload.
