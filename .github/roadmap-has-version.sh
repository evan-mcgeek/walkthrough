#!/usr/bin/env bash
# Fails unless ROADMAP.md has a "### <version>" section for the version in package.json.
set -euo pipefail
version=$(node -p "require('./package.json').version")
if ! grep -qE "^### ${version//./\\.}( |$)" ROADMAP.md; then
  echo "::error file=ROADMAP.md::No section for $version: move what this release ships from Now into a \"### $version (<date>): <title>\" section under Done."
  exit 1
fi
