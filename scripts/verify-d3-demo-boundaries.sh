#!/usr/bin/env bash

set -euo pipefail

EXPECTED_ROOT="/Users/blaq/Downloads/faidia"
EXPECTED_BRANCH="feat/demo-engine-base"
BOUNDARY_FILE="docs/demo-engine-base/DEMO-ENGINE-BOUNDARIES.md"
SCRIPT_FILE="scripts/verify-d3-demo-boundaries.sh"

pass() {
  printf "PASS: %s\n" "$1"
}

fail() {
  printf "FAIL: %s\n" "$1" >&2
  exit 1
}

printf "\nFAIDIA D3 boundary verification\n"
printf "================================\n\n"

CURRENT_DIRECTORY="$(pwd)"
GIT_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"
CURRENT_BRANCH="$(git branch --show-current 2>/dev/null || true)"

[[ "$CURRENT_DIRECTORY" == "$EXPECTED_ROOT" ]] \
  && pass "Current directory is $EXPECTED_ROOT" \
  || fail "Run this script from $EXPECTED_ROOT"

[[ "$GIT_ROOT" == "$EXPECTED_ROOT" ]] \
  && pass "Git repository root is correct" \
  || fail "Git repository root is incorrect: $GIT_ROOT"

[[ "$CURRENT_BRANCH" == "$EXPECTED_BRANCH" ]] \
  && pass "Current branch is $EXPECTED_BRANCH" \
  || fail "Expected branch $EXPECTED_BRANCH but found $CURRENT_BRANCH"

[[ -f "$BOUNDARY_FILE" ]] \
  && pass "$BOUNDARY_FILE exists" \
  || fail "$BOUNDARY_FILE does not exist"

[[ -f "$SCRIPT_FILE" ]] \
  && pass "$SCRIPT_FILE exists" \
  || fail "$SCRIPT_FILE does not exist"

REQUIRED_BOUNDARIES=(
  'Route namespace: `/demo`'
  'Production Supabase writes: Prohibited'
  'Synthetic state is the source for the demo.'
  'Homepage variants share one journey.'
  'Production code must never depend on Demo Engine code.'
  '## 1. Purpose'
  '## 2. Architectural position'
  '## 3. Route namespace'
  '## 4. Demo-owned paths'
  '## 5. Protected production routes'
  '## 6. Protected Stage 8 design files'
  '## 7. Design Lab boundary'
  '## 8. Production service protection'
  '## 9. Synthetic data boundary'
  '## 10. Simulated document upload'
  '## 11. Demo state system'
  '## 12. Shared demonstration journey'
  '## 13. Homepage variants'
  '## 14. Client configuration boundary'
  '## 15. Internal and applicant-visible statuses'
  '## 16. Reporting boundary'
  '## 17. Explicit non-goals'
  '## 18. Dependency direction'
  '## 19. Cursor task boundary'
  '## 20. Stage completion procedure'
  '## 21. D3 definition of done'
)

for REQUIRED_TEXT in "${REQUIRED_BOUNDARIES[@]}"; do
  if grep -Fq "$REQUIRED_TEXT" "$BOUNDARY_FILE"; then
    pass "Boundary found: $REQUIRED_TEXT"
  else
    fail "Missing required boundary: $REQUIRED_TEXT"
  fi
done

UNEXPECTED_FILES=""

while IFS= read -r STATUS_LINE; do
  [[ -z "$STATUS_LINE" ]] && continue

  FILE_PATH="${STATUS_LINE:3}"

  case "$FILE_PATH" in
    "$BOUNDARY_FILE"|"$SCRIPT_FILE")
      ;;
    *)
      UNEXPECTED_FILES+="${FILE_PATH}"$'\n'
      ;;
  esac
done < <(git status --porcelain=v1 --untracked-files=all)

if [[ -n "$UNEXPECTED_FILES" ]]; then
  printf "\nUnexpected changed files:\n%s\n" "$UNEXPECTED_FILES" >&2
  fail "D3 must modify only its two owned files"
fi

pass "Only D3-owned files are changed"

bash -n "$SCRIPT_FILE"
pass "Verification script syntax is valid"

HEADING_COUNT="$(grep -c '^## [0-9]\+\.' "$BOUNDARY_FILE")"

if [[ "$HEADING_COUNT" -eq 21 ]]; then
  pass "All 21 numbered sections exist"
else
  fail "Expected 21 numbered sections but found $HEADING_COUNT"
fi

printf "\n================================\n"
printf "D3 VERIFICATION PASSED\n"
printf "The Demo Engine boundaries are ready to commit.\n\n"
