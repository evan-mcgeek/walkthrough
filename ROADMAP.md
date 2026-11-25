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

## Now

- A design round for "Next", with Claude Design.

## Next: design first

- Changes since your last review: on a new head, show what changed since the person last reviewed. (2)
- The page says when it is behind the branch. (2)
- Outdated comments, and the AI resolves its own comment once the new code fixes it. (2)

## Later

- Moved code shown as moved, not as a deletion and an addition. (2)
- The author's screenshot on a step that changes the UI. (2)
- Moving between steps and files with GitHub's keys. (2)
