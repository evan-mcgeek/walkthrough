# Copy: every string on the page

Every string the page shows. GitHub's word wherever GitHub has one (marked **GH**). `<…>` is a value the page fills in; N and M are numbers. Any string on the existing page that is not listed here is removed.

## Header and menu

| String | Where | Note |
|---|---|---|
| `<branch>` / `#<N> <title>` | header label | branch in mono; number in secondary ink, title in sans |
| `<branch>` · Walkthrough / `#<N> <title>` · Walkthrough | browser tab title | tells open walkthroughs apart; "Reviewing · " before it during the Opening |
| N / M files viewed | header progress | **GH** |
| Finish review | header, primary | **GH** ("Finish your review"); tooltip "Go to the Summary (G S)" |
| Theme | menu | System, Light, Dark |
| Colorblind | menu, checkbox in the Theme group | **GH** (GitHub's "colorblind" themes, spelt as GitHub spells it); decision 22; replaces "Colour-blind diff" |
| End session | menu | |
| Steps and files | phone header button, accessible name | |

## Step list

| String | Where | Note |
|---|---|---|
| `<N>` `<step title>` | step row | |
| `<file name>` | file row | tooltip: full path |
| Viewed / Not viewed | file tick, accessible name | **GH** |
| N comment(s) | comment count, tooltip | **GH** |
| Summary | last row | |

## A step

| String | Where | Note |
|---|---|---|
| Look at: | before the pointers | |
| `<file>` `<lines>` `<2–4 words>` | each pointer | written by the AI |
| More | after the explanation | |
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
| Comment on this file | file header icon button, accessible name and tooltip; the file composer's accessible name | **GH**; built in 0.1.5, kept (decision 25); Tooltip cap, 12 |
| Diff / Preview | image file, switch | **GH** |
| Before / After | image preview, under each side | |
| Preview failed. | image preview, when an image does not load | |

## Comments and threads

| String | Where | Note |
|---|---|---|
| Suggested change | header row of a suggestion block in a comment; tag on its Summary row | **GH**; decision 21; no Apply or Commit button |
| You | your name on your comments | |
| AI | the AI's name | |
| `[AI]` | prefix of the AI's pending comments (not its Ask AI answers) | |
| `<handle>` | a colleague | from the code host |
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
| Leave a comment | composer placeholder, on lines and on a file | **GH** |
| Cancel | composer | **GH** |
| Update comment | composer, primary, when editing a pending comment | **GH** |
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
| `<file>:<line>` · `<file>` · `<file>:<start>–<end>` | link under a criterion: to the AI comment (partly or not met; `<file>` alone for a comment on the whole file), or to the lines that meet it (met) | decision 35; mono accent, as the Summary's other links; tooltip "`<path>` line N: go to the comment" or "`<path>` lines N–M: go to the lines" (Tooltip, 12) |
| `<what is missing>` | after the link, under a partly or not met criterion | decision 35; written by the session; 12 words; the gap, never the fix (the fix is the comment's) |
| `<why not checked>` | under a not checked criterion | decision 35; written by the session; 8 words, e.g. "Needs the running app." |
| Finish your review | review box title | **GH** |
| Comment / Approve / Request changes | review type | **GH** |
| Submit review | pull request | **GH** |
| Send to agent | your own change | no review type on your own change; disabled with no comments (decision 11) |
| Add a comment to send it. | under a disabled Send to agent | |
| No comments. Add one on a line. | Going out, when empty | |
| Changed since last view | file header, after new commits touch a file you marked Viewed | GitHub’s words |
| Review submitted | after submitting | no code host named (decision 6) |
| `<type>`, with N comments, on #N. | after submitting | |
| View review | after submitting, and on the farewell | opens the posted review |
| End session | quiet button after submitting or sending; also in the menu | no confirm |
| Sent to the agent | own change, after sending | |
| N comments. The agent is fixing them; follow along there. | own change, after sending (Summary box) | with one comment: "1 comment. The agent is fixing it; follow along there." |

## Opening

| String | Where | Note |
|---|---|---|
| N files changed | header, while the review is not ready | replaces the viewed count |
| AI reviewing | header indicator with the spinner, while the review is not ready | |
| Steps appear here when the AI is done. | step list, while the review is not ready | |
| No steps yet. | step list, once the session stopped before ready | |
| Preparing the walkthrough | main pane title | |
| The AI is finishing its review, usually within a minute. | under the title | |
| N changed files | file list heading | **GH** |
| The AI couldn’t prepare the walkthrough | title, once the session stopped before ready | |
| It stopped before the review was done. Nothing was posted. | under the error title | |
| Start it over in your agent: | under it | then the command and Copy command, as on the farewell (decision 10: no Try again) |
| Wait, what?! · Hmm… · Nice. | the desk scene’s speech bubbles (decorative; the SVG’s accessible name is “The AI at its desk, reading the change”) | |

## After the session

| String | Where | Note |
|---|---|---|
| Session ended | farewell title | |
| Review submitted | outcome box, pull request, submitted | |
| `<type>`, with N comments, on #N. | under it | |
| View review | button in that box | |
| Nothing was posted. | outcome box, pull request, not submitted | |
| Your N comments and Viewed marks are kept for next time. | under it | with no comments: "Your Viewed marks are kept for next time." |
| Sent to the agent | outcome box, your own change, sent | |
| N comments. The agent picks them up in your conversation. | under it (farewell) | with one comment: "1 comment. The agent picks it up in your conversation." |
| Nothing was sent to the agent. | outcome box, your own change, not sent | |
| Pick it up again | section heading | |
| Run this in your agent: | before the command | |
| `/walkthrough:pr <N>` · `/walkthrough` | the command, mono | pull request · your own change |
| Copy command → Copied | button beside the command | "Copied" for 2s |
| A new commit reopens only the steps that changed. | under the command | |
| You can close this tab. | last line | not on the lost-session screen |
| The session isn’t running | title, when the page loses its server | replaces "Could not reach the walkthrough page." |
| This page lost its session. | outcome box | |
| Nothing is lost; your comments and Viewed marks are saved. | under it | |
| Try again | primary, in that box | reconnects at once; the page also keeps polling and comes back by itself when the session answers again |

## Walkthroughs list

| String | Where | Note |
|---|---|---|
| Could not reach the list. Run walkthrough list to reopen. | banner, when the list page loses its server | |
| Sent to the agent | Review column, your own change once sent | your own change has no review type; a pull request shows Comment, Approve or Request changes |

## Alerts

| String | Where | Note |
|---|---|---|
| That text is N characters long; the most it can be is M. | alert, when a comment or summary is over the limit | |
| The walkthrough could not do that (N). | alert, when the server refuses with no reason | the server's own reason replaces it when it gives one |

## Back on a new head, moved code, screenshots, keys

New strings from decisions 12 to 20. Cap is the slot's cap from `DESIGN.md` → Words, or the one given here.

| String | Where | Cap | Note |
|---|---|---|---|
| Changes since your last review | header switch label and menu item | GitHub's phrase (5 words) | **GH**; shown only after you reviewed an earlier head; tooltip "Changes since your last review (C)" |
| All changes | header switch label and menu item | Button, 3 | **GH** ("Show all changes" in GitHub's menu) |
| N commits · M files | under "Changes since your last review" in the menu | Chip, 4 | "1 commit" when one |
| M files | under "All changes" in the menu | Chip, 4 | |
| No changes since your last review. | a step with nothing new, in that view | Empty state, 8 | |
| The files are as you viewed them. | under it | Empty state, 8 | |
| Show all changes | button beside it | Button, 3 | **GH**; switches the view |
| Changed since last view | file header | Tag, 4 | **GH**; already in use; now on every file whose diff changed |
| The branch has new commits. Run the walkthrough again to see them: | one line under the header, every screen, when your branch moved | Notice, 12 | followed by `/walkthrough:update` and Copy command; the pull request case is not drawn (decision 15) |
| Outdated | thread header and Summary row | Tag, 2 | **GH** |
| AI marked this conversation as resolved. | a thread the AI resolved | Thread line, GitHub's sentence | **GH** ("… marked this conversation as resolved.") |
| Show resolved / Hide resolved | button on that line | Button, 3 | **GH** |
| Unresolve conversation | thread foot, when open | Button, 3 | **GH** |
| Resolved conversations | Summary section heading | Heading, 3 | GitHub's words; lists what the AI resolved since your last review |
| Resolved | Summary row tag | Tag, 2 | **GH** |
| Pending | on the AI-resolved line, in its step and on the Summary, until Submit review | Tag, 2 | **GH**; the existing tag; not on your own change |
| Moved from `<file>` lines N–M | diff row above moved lines | Diff row, 8 | "line N" when one; "Moved from lines N–M" in the same file; links to where they left; at 390 the file name only, the whole label as tooltip (decision 24) |
| N lines moved to `<file>` line M | diff row where moved lines left | Diff row, 8 | "1 line moved to …"; same file: "N lines moved to line M"; links to where they arrive |
| `<alt text>` | caption under the author's screenshot | the author's words | from the pull request; none if it has none |
| Open the screenshot: `<alt text>` | accessible name of the closed screenshot | Tooltip, 12 | |
| Open the screenshot | accessible name of the closed screenshot when it has no alt text | Tooltip, 12 | |
| Close the screenshot | accessible name of the open image | Tooltip, 12 | a click on it closes the screenshot |
| Close | under the open screenshot | Button, 3 | also Esc or a click on the image |
| Viewed (V) · Changes since your last review (C) | tooltips of the Viewed checkbox and the changes switch | Tooltip, 12 | the key in brackets, as "Go to the Summary (G S)"; no key caps; J and K show nowhere, as on GitHub |

## Colorblind, copied code, comments on a whole file

New and changed strings from decisions 22 to 25 (features built in 0.1.5). Cap as above.

| String | Where | Cap | Note |
|---|---|---|---|
| Colorblind | menu, checkbox item in the Theme group | Switch label or menu item, 3 | **GH**; was "Colour-blind diff" |
| Copied from `<file>` lines N–M | diff row above copied lines | Diff row, 8 | was "Copied from `<file>` line N"; "line N" when one; "Copied from lines N–M" in the same file; links to the source, plain text when the change does not show it; at 390 the file name only, the whole label as tooltip |
| Moved from `<file>` lines N–M | diff row above moved lines | Diff row, 8 | was "line N"; full row under "Back on a new head" above |
| `<file name>` | Summary row link for a file comment, no line | the file name | tooltip: "`<path>`: go to the comment" |

## Accessible names, tooltips and the walkthroughs list

Strings the built page already shows, added here so the list is complete. Cap as above.

| String | Where | Cap | Note |
|---|---|---|---|
| Menu | the header's … button and its menu, accessible name | Button, 3 | |
| Changes | the changes switch's menu, accessible name | Button, 3 | |
| Finish | the header's Finish review at 390 | Button, 3 | **GH** |
| binary | file header in place of +N −N, for a binary file | Tag, 2 | **GH** |
| Preview of `<path>` | an image file's preview, region name | Tooltip, 12 | |
| Show `<path>` as | the Diff / Preview switch, group name | Tooltip, 12 | |
| `<path>`, before · `<path>`, after | an image preview's alt text | Tooltip, 12 | |
| Before · W×H · After · W×H | under each side of an image preview | Tag, 4 | the image's size in pixels |
| Leave a comment | the summary box's placeholder | Hint, 8 | **GH** |
| Summary | the summary box, accessible name | Button, 3 | |
| `<file>` `<lines>` | a Look at pointer's tooltip | Tooltip, 12 | |
| Summary | the last step's next link | Button, 3 | |
| `<date and time>` | a comment time's tooltip | as the reader's locale writes it | **GH** |
| Walkthrough | the tab title before the page names the change | Heading, 3 | |
| Walkthroughs | the list page's title and tab | Heading, 3 | |
| Walkthrough · Viewed · Review · Last activity | the list's column headers | Heading, 3 | |
| Stop | the list page's header button | Button, 3 | stops the list's server |
| No walkthroughs. Run /walkthrough. | the list, when empty | Empty state, 8 | |
| List stopped. You can close this tab. | the list's banner after Stop | Notice, 12 | |
| N / M files viewed | the list's Viewed column | Chip, 4 | **GH** |
| `<time ago>` | the list's Last activity column | as the reader's locale writes it | |
| The list could not do that (N). | alert on the list page, when its server refuses with no reason | Notice, 12 | as "The walkthrough could not do that (N)." |

## Strings to remove from the existing page

Any string not listed above is removed. Grep the templates for at least: "GitHub" and "Claude Code" in any page string, "Could not reach the walkthrough page.", Approve and Flag on steps, Undecided, Decided, N decided, Changed since you decided, Still open, Goes out, Verdict, the session status words, Session messages, Being checked notices, New finding banners, Add to fixes, Not an issue, Accept, Reject, Ignore, Checklist and its Met / Partly / Not met buttons, Files to skim, Help, Icons, Keys, Appearance, Swipe to decide, Colour-blind diff, and "Copied from … line" with a single line where a range is copied.
