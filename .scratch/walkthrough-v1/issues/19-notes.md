# 19: Notes on steps and lines

**What to build:**
The session can pin notes to a step or to a line range of a file in it: a label it chooses, Markdown text rendered safely, a low-priority flag, and replies.
Low-priority notes are grouped behind a count.
An ask from the page can be pinned to a selected line range, and the session's answer becomes a note on that range.

**Blocked by:** 16 Strip the rules out of the tool

**Status:** ready-for-agent

- [ ] Notes appear at their step, and line notes beside their lines in the diff.
- [ ] Low-priority notes sit behind an "N more" control.
- [ ] Replies show as a thread under the note.
- [ ] Selecting lines and asking sends the range with the question; the answer lands on that range.
- [ ] Session Markdown renders without raw HTML under the strict CSP.
