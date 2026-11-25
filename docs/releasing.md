# Releasing

A merged pull request labelled `release` releases Walkthrough.

1. Bump the version in `package.json` (and its lock) and `plugin/.claude-plugin/plugin.json`, in a commit titled `Version <version>`.
2. In the same commit, move what the release ships from Now in `ROADMAP.md` into a `### <version> (<date>): <title>` section under Done, and add anything else it ships.
3. Open the pull request to `main` and label it `release`; the Roadmap check fails until `ROADMAP.md` has that section.
4. When it merges, the Release workflow (`.github/workflows/release.yml`):
   1. stops if `v<version>` is tagged already, so a release without a version bump publishes nothing, or if `ROADMAP.md` has no section for it;
   2. runs the lint, the tests in Chromium and `claude plugin validate`;
   3. builds the plugin onto the `release` branch with `npm run release` and pushes it;
   4. tags that build `v<version>` and makes its GitHub Release, with the pull request's description as notes.

The marketplace installs from the `release` branch, so an install or `claude plugin update walkthrough@walkthrough` takes the new version once the branch is pushed.

If a release stops part-way, run the workflow by hand on `main` (Actions, Release, Run workflow).
It releases the version in `package.json` when that version has no tag yet.

A pull request from a fork gets a read-only token, so merging one labelled `release` cannot publish.
Release from a branch in this repository: merge the fork's work first, then open the version bump from your own branch.
