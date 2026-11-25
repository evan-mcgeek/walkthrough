# Copy: every string on the page

Every string the page shows. GitHub's word wherever GitHub has one (marked **GH**). `<…>` is a value the page fills in; N and M are numbers. Any string on the existing page that is not listed here is removed.

## Header and menu

| String | Where | Note |
|---|---|---|
| `<branch>` / `#<N> <title>` | header label | branch in mono; number in secondary ink, title in sans |
| `<branch>` · Walkthrough / `#<N> <title>` · Walkthrough | browser tab title | tells open walkthroughs apart |
| N / M files viewed | header progress | **GH** |
| AI reviewing | header indicator, while the AI is still reviewing | tooltip: "The AI is still reviewing; comments may arrive" |
| Finish review | header, primary | **GH** ("Finish your review"); tooltip "Go to the Summary (G S)" |
| Theme | menu | System, Light, Dark |
| End session | menu | |
| Steps and files | phone header button, accessible name | |

## Step list

| String | Where | Note |
|---|---|---|
| `<N>` `<step title>` | step row | |
| `<file name>` | file row | tooltip: full path |
| Viewed / Not viewed | file tick, accessible name | **GH** |
| N comment(s) | comment count, tooltip | **GH** |
| AI still reviewing this step | spinner tooltip | |
| Summary | last row | |

## A step

| String | Where | Note |
|---|---|---|
| Look at: | before the pointers | |
| `<file>` `<lines>` `<2–4 words>` | each pointer | written by the AI |
| More | after the explanation | |
| The AI is still reviewing this step. | under the explanation, while it is | |
| `<previous step title>` / `<next step title>` | step-to-step links | |

## Files

| String | Where | Note |
|---|---|---|
| `<path>` +N −N | file header | **GH** |
| N comments | tooltip on the count | **GH** |
| Viewed | checkbox | **GH** |
| Collapse / Expand `<path>` | chevron, accessible name | |
| Generated from the schema | folded generated file | written by the session (the reason), one line |
| Comment on line N | line number button, accessible name | **GH** |

## Comments and threads

| String | Where | Note |
|---|---|---|
| You | your name on your comments | |
| AI | the AI's name | |
| `[AI]` | prefix of the AI's pending comments (not its Ask AI answers) | |
| `<handle>` | a colleague | from the pull request |
| Pending | tag on a pending comment | **GH** |
| `<time>` (now, 2 days ago) | comment header | **GH** |
| Edit | icon button | **GH** |
| Delete | icon button | **GH** |
| Reply… | thread reply field placeholder | **GH** |
| Resolve | colleagues' threads | **GH** ("Resolve conversation") |
| Ask AI | in a thread and in the composer | |
| Ask AI: `<question>` | your question in the thread | stays on the page; never goes out |
| Answering… | beside the spinner while the AI writes its reply | |
| AI is answering | dots, accessible name | |
| Leave a comment | composer placeholder | **GH** |
| Cancel | composer | **GH** |
| Add comment | composer, primary | **GH** ("Add single comment" / "Start a review": one button, the review is always pending) |
| 1 new comment above / N new comments above | pill | |

## Summary

| String | Where | Note |
|---|---|---|
| Summary | title and step-list row | |
| Going out | heading over pending comments | |
| Sent | same heading after submitting | |
| N unresolved thread(s) | count link | **GH** |
| N files not viewed | count link | **GH** ("viewed") |
| Acceptance criteria | heading | |
| checked by the AI | after the heading | |
| Met / Partly met / Not met / Not checked | criterion status | |
| Finish your review | review box title | **GH** |
| Comment / Approve / Request changes | review type | **GH** |
| Submit review | pull request | **GH** |
| Send to agent | your own change | disabled with no comments unless Approve or Request changes is chosen |
| Add a comment, or choose Approve or Request changes. | under a disabled Send to agent | |
| No comments. Add one on a line, or answer the AI’s. | Going out, when empty | |
| Changed since last view | file header, after new commits touch a file you marked Viewed | GitHub’s words |
| Review submitted | after submitting | |
| `<type>`, with N comments, on #N. | after submitting | |
| View review | after submitting | links to the address the session records; no code host is named on the page |
| Sent to the agent | own change, after sending | |
| N comments; it fixes them in the Claude Code chat. | own change, after sending | |

## Strings to remove from the existing page

Any string not listed above is removed. Grep the templates for at least: Approve and Flag on steps, Undecided, Decided, N decided, Changed since you decided, Still open, Goes out, Verdict, the session status words, Session messages, Being checked notices, New finding banners, Add to fixes, Not an issue, Accept, Reject, Ignore, Checklist and its Met / Partly / Not met buttons, Files to skim, Help, Icons, Keys, Appearance, Swipe to decide.
