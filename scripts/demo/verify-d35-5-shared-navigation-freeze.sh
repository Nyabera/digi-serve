#!/usr/bin/env bash
set -euo pipefail

BRANCH="demo/d35-shared-navigation-visual-refinement"

INTERNAL_CSS="components/demo/internal-shell/internal-shell.module.css"
APPLICANT_CSS="features/demo-applicant/components/applicant-workspace-shell.module.css"
GLOBALS="app/globals.css"
D35_4_DOC="docs/demo/D35-4-SHARED-NAVIGATION-VISUAL-ACCEPTANCE.md"
FREEZE_DOC="docs/demo/D35-5-SHARED-NAVIGATION-REFINEMENT-FREEZE.md"
FREEZE_VALUES="docs/demo/d35-freeze/FINAL-VISUAL-VALUES.txt"
FREEZE_HASHES="docs/demo/d35-freeze/SHA256SUMS"
VERIFY_FILE="scripts/demo/verify-d35-5-shared-navigation-freeze.sh"

ALLOWED=(
  "$FREEZE_DOC"
  "$FREEZE_VALUES"
  "$FREEZE_HASHES"
  "$VERIFY_FILE"
)

fail() {
  printf 'FAIL: %s\n' "$1" >&2
  exit 1
}

require_literal() {
  grep -Fq -- "$2" "$1" || fail "$3"
}

is_allowed() {
  local candidate="$1"
  local path

  for path in "${ALLOWED[@]}"; do
    [[ "$candidate" == "$path" ]] && return 0
  done

  return 1
}

[[ "$(git branch --show-current)" == "$BRANCH" ]] || \
  fail "Expected branch '$BRANCH'."

for file in \
  "$INTERNAL_CSS" \
  "$APPLICANT_CSS" \
  "$GLOBALS" \
  "$D35_4_DOC" \
  "$FREEZE_DOC" \
  "$FREEZE_VALUES" \
  "$FREEZE_HASHES" \
  "$VERIFY_FILE"
do
  [[ -f "$file" ]] || fail "Missing D35 freeze file: $file"
done

require_literal \
  "$D35_4_DOC" \
  "**ACCEPTED — HUMAN VISUAL SIGN-OFF RECORDED**" \
  "D35-4 visual acceptance is not recorded."

for literal in \
  "font-size: 0.7125rem;" \
  '"Source Code Pro"' \
  "font-weight: var(--font-weight-regular);" \
  "letter-spacing: 0.05px;" \
  "color: #666666;" \
  "border-radius: 0;" \
  "min-height: 2.025rem;" \
  "width: 1.35rem;" \
  "height: 1.35rem;" \
  "stroke-width: 1;" \
  "14.025rem"
do
  require_literal "$INTERNAL_CSS" "$literal" \
    "Missing frozen internal navigation value: $literal"
done

for literal in \
  "font-size: 0.7125rem;" \
  '"Source Code Pro"' \
  "font-weight: 400;" \
  "letter-spacing: 0.05px;" \
  "color: #666666;" \
  "border-radius: 0;" \
  "min-height: 35.64px;" \
  "width: 17.1px;" \
  "height: 17.1px;" \
  "stroke-width: 1;" \
  "214.2px"
do
  require_literal "$APPLICANT_CSS" "$literal" \
    "Missing frozen Applicant navigation value: $literal"
done

if grep -Fq 'data-internal-shell-role="DEPARTMENT"' "$INTERNAL_CSS"; then
  fail "Department was incorrectly included in the D35 internal-shell override."
fi

require_literal \
  "$GLOBALS" \
  "--sidebar-width-staff: 16.5rem;" \
  "Global sidebar-width token changed."

require_literal \
  "$GLOBALS" \
  "--sidebar-width-collapsed: 4.5rem;" \
  "Global collapsed sidebar token changed."

require_literal \
  "$GLOBALS" \
  "--sidebar-width-mobile: min(20rem, 86vw);" \
  "Global mobile sidebar token changed."

require_literal \
  "$GLOBALS" \
  "--control-height-compact: 2.5rem;" \
  "Global compact-control token changed."

require_literal \
  "$FREEZE_DOC" \
  "**COMPLETE — D35 SHARED NAVIGATION REFINEMENT FROZEN**" \
  "D35-5 freeze status is missing."

require_literal \
  "$FREEZE_VALUES" \
  "DEPARTMENT" \
  "Department exclusion is missing from the freeze values."

shasum -a 256 -c "$FREEZE_HASHES"

while IFS= read -r changed; do
  [[ -z "$changed" ]] && continue
  is_allowed "$changed" || fail "Unexpected D35-5 working-tree file: $changed"
done < <(git status --porcelain --untracked-files=all | sed 's/^.. //')

git diff --check

echo "PASS: D35-5 shared navigation freeze verification passed."
