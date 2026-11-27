# Roadmap

Where Walkthrough has been and where it goes next, in order.
[VISION.md](VISION.md) says what it is and what stays out; [the releases](https://github.com/evan-mcgeek/walkthrough/releases) hold the full notes.
Each item ahead names the job from VISION.md it does: (1) keeps the AI shallow, on the ticket and on what matters; (2) helps the human notice what matters.
The pull request that ships or drops an item updates this file.

## Done

### 0.0.2 (2026-11-22 to 2026-11-24): first build

- A CLI that owns the walkthrough's state, a local page, and two Claude Code skills, installed as a plugin.
- The person's review policy, kept outside every project and copied from a template.

### 0.1.0 (2026-11-25): rebuilt to the vision, GitHub's review page made better by AI

- Steps with "Look at" pointers, the AI's pending `[AI]` comments, colleagues' threads and the acceptance criteria.
- Ask AI answers in the thread; nothing else wakes the session.
- One Summary and one submit: a finished review on a pull request, a fix list on your own change.

### 0.1.1 (2026-11-25): the page opens when the review is nearly done

- The Opening shows the AI at work and the changed files until the review is ready, then the whole walkthrough appears at once.
- The tab names the change and shows when the AI is reviewing.

### 0.1.2 (2026-11-25): endings

- End session shows a farewell with what went out and the command to pick it up again.
- A page that loses its session says so and comes back by itself.
- Your own change has no review type; Send to agent needs at least one comment.
- Starting again at a head you already reviewed reopens the page as you left it, without reviewing again.

### 0.1.3 (2026-11-25): reviewers by size

- Before any reviewer starts, the session says the change's size and the runs the policy names for it, and runs exactly those.

### 0.1.4 (2026-11-25): the review learns

- The review policy learns from the review: once a review goes out, the session suggests one policy line when the AI comments the person deleted or reworded share a cause that would come up again.
- Reviewers by risk: a change that touches risky areas gets the full set of reviewers at any size, and each run's model is picked by what it could miss.
- Steps by attention: the step that most needs attention comes early where the order allows, and the session says when a change is too big to walk through well.

### 0.1.5 (2026-11-26): since your last review

- Changes since your last review: back on a new head after a review, the page opens on GitHub's switch and shows only what is new.
- The page says when your branch has new commits since the walkthrough, with the command to run it again.
- Outdated comments sit at the top of their file with the code they were written on.
- The AI resolves its own comment once the new code fixes it; the resolve goes out with your next review, and the Summary lists it under Resolved conversations.
- Moved code shows once, where it arrives, linked to where it left; copied code says where it was copied from.
- The author's screenshot on the step it shows.
- GitHub's keys: J and K through the files, V for Viewed, C for the changes switch.
- Comments on a whole file, and colour-blind diff colours.
- `/walkthrough:init` sets everything up before a first review, and offers to write your comments in your voice.
- The first step opens with what the change makes behave differently.

### 0.1.6 (2026-11-26): code that reads like code

- Syntax colours in every diff, suggested change and code block, from GitHub's own themes, made to read on every background; a language's grammar downloads the first time a change uses it, checked against a hash, and colouring never holds up the page.
- Suggested changes: a short fix in a comment shows as GitHub's "Suggested change", the lines it replaces and the new ones; nothing on the page applies it.
- Colorblind, GitHub's word, swaps green and red for blue and orange everywhere they appear, and the overview stripe's marks reach 3:1.
- Copied and moved code name the lines they came from, and a rule shows where a copy ends.
- Comments on a whole file sit first in the band above the diff; the AI can leave one too, for what no single line holds.
- Code in a comment, an explanation or an answer only when the point is code, as the review policy now says.
- The line you read stays put when an answer arrives above it, and the new-comment pill no longer narrows the diff.
- Walky, the mascot: the README banner, and the tab icon by session state (reading, awake, done, ended, asleep).
- Every control's edge reaches 3:1 on every grey, and the primary button is a calmer mid-tone in dark.

### 0.1.7 (2026-11-26): the next review, and criteria that say why

- `/walkthrough:update` after the fixes: only what changed since your last review, with whether each comment was addressed, or the whole change again; the fix list ends by asking the agent to run it.
- Acceptance criteria say what is missing and where: gaps first, each linked to the AI comment that closes it; a met one links to the lines that meet it, and a not checked one says why.
- On a branch with a slash in its name, the session records its steps and comments without asking for permission.
- The AI's comments keep the order they were given, and the new-comment pill goes to the highest one.

### 0.1.8 (2026-11-27): your own pull request, and coming back

- A pull request you opened offers no Approve or Request changes: its author can only comment, so Submit review goes out as a comment.
- Coming back to a pull request goes on with the same walkthrough: its label is always `PR <number>`, a review an earlier session left halfway keeps its steps and comments, and the session says what the walkthrough already holds.
- A page server an older release of the plugin started is replaced, so the page always has what the release you run ships, such as syntax colours.
- A release makes its own tag, and a release run by hand keeps its notes.

### 0.1.9 (2026-11-27): a step list that folds, calmer motion, and Geist Mono

- Code, paths and file names in Geist Mono, self-hosted, half a pixel larger, with ligatures off and no shift when the font loads.
- The step list folds every step but the one you are on to its title and "N of M viewed"; a file row's Viewed mark, name and comment count each do their own job; the list resizes and its Summary stays at the foot.
- Moving between files scrolls and then marks where you landed; other changes fade, with no pops or jumps; a jump into a folded file opens it and lands on its line.
- At 390 a file header takes two rows, with the whole path.
- Fixes: a first load the network drops is tried again instead of leaving the page blank; End session leaves no request to fail; Close returns the keyboard to the screenshot in Safari; quick Viewed clicks reach the server in order.
- The page tests pass in Chromium, Firefox and WebKit, and no test reaches the web.

## Now

- Nothing in progress.

## Next

- The page says when a pull request's branch has new commits: how the page learns that it moved is still open, to rethink. (2)
