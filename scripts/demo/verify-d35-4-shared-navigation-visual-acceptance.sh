#!/usr/bin/env bash
set -euo pipefail

BRANCH="demo/d35-shared-navigation-visual-refinement"
DOC="docs/demo/D35-4-SHARED-NAVIGATION-VISUAL-ACCEPTANCE.md"
PW_TEST="tests/acceptance/d35/shared-navigation-visual-acceptance.pw.ts"
VERIFY_FILE="scripts/demo/verify-d35-4-shared-navigation-visual-acceptance.sh"
EVIDENCE_DIR="docs/demo/d35-visual-acceptance"

EXPECTED=(
  "$DOC"
  "$PW_TEST"
  "$VERIFY_FILE"
  "$EVIDENCE_DIR/applicant-desktop.png"
  "$EVIDENCE_DIR/officer-desktop.png"
  "$EVIDENCE_DIR/supervisor-desktop.png"
  "$EVIDENCE_DIR/admin-desktop.png"
  "$EVIDENCE_DIR/department-control-desktop.png"
  "$EVIDENCE_DIR/admin-mobile.png"
  "$EVIDENCE_DIR/applicant-mobile.png"
)

fail() {
  printf 'FAIL: %s\n' "$1" >&2
  exit 1
}

is_expected() {
  local candidate="$1"
  local item

  for item in "${EXPECTED[@]}"; do
    [[ "$candidate" == "$item" ]] && return 0
  done

  return 1
}

[[ "$(git branch --show-current)" == "$BRANCH" ]] || \
  fail "Expected branch '$BRANCH'."

for file in "${EXPECTED[@]}"; do
  [[ -f "$file" ]] || fail "Missing D35-4 file: $file"

  if [[ "$file" == *.png ]]; then
    [[ -s "$file" ]] || fail "Empty D35-4 screenshot: $file"
  fi
done

for literal in \
  "EVIDENCE GENERATED — PENDING HUMAN VISUAL SIGN-OFF" \
  "applicant-desktop.png" \
  "officer-desktop.png" \
  "supervisor-desktop.png" \
  "admin-desktop.png" \
  "department-control-desktop.png" \
  "admin-mobile.png" \
  "applicant-mobile.png" \
  "PASS — approve D35-4 and proceed to D35-5 freeze"
do
  grep -Fq -- "$literal" "$DOC" || \
    fail "D35-4 acceptance document is missing: $literal"
done

while IFS= read -r changed; do
  [[ -z "$changed" ]] && continue
  is_expected "$changed" || \
    fail "Unexpected D35-4 working-tree file: $changed"
done < <(git status --porcelain --untracked-files=all | sed 's/^.. //')

git diff --check

echo "PASS: D35-4 visual acceptance evidence is complete."
echo "Human visual sign-off is still required."
