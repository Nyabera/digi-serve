#!/usr/bin/env bash

set -euo pipefail

EXPECTED_ROOT="/Users/blaq/Downloads/faidia"
EXPECTED_BRANCH="feat/demo-engine-base"
STRUCTURE_FILE="docs/demo-engine-base/DEMO-ENGINE-STRUCTURE.md"
SCRIPT_FILE="scripts/verify-d4-demo-folders.sh"

pass() {
  printf "PASS: %s\n" "$1"
}

fail() {
  printf "FAIL: %s\n" "$1" >&2
  exit 1
}

printf "\nFAIDIA D4 folder verification\n"
printf "=============================\n\n"

[[ "$(pwd)" == "$EXPECTED_ROOT" ]] \
  && pass "Current directory is correct" \
  || fail "Run this script from $EXPECTED_ROOT"

[[ "$(git rev-parse --show-toplevel)" == "$EXPECTED_ROOT" ]] \
  && pass "Git repository root is correct" \
  || fail "Git repository root is incorrect"

[[ "$(git branch --show-current)" == "$EXPECTED_BRANCH" ]] \
  && pass "Current branch is $EXPECTED_BRANCH" \
  || fail "Expected branch $EXPECTED_BRANCH"

REQUIRED_DIRECTORIES=(
  "app/demo"
  "components/demo/shell"
  "components/demo/controls"
  "components/demo/homepages"
  "components/demo/public"
  "components/demo/forms"
  "components/demo/applicant"
  "components/demo/officer"
  "components/demo/department"
  "components/demo/supervisor"
  "components/demo/outcomes"
  "components/demo/reports"
  "components/demo/charts"
  "components/demo/shared"
  "features/demo/state"
  "features/demo/workflow"
  "features/demo/documents"
  "features/demo/reporting"
  "config/demo"
  "types/demo"
  "tests/demo/unit"
  "tests/demo/integration"
  "tests/demo/e2e"
  "public/demo/branding"
  "public/demo/documents"
)

for DIRECTORY in "${REQUIRED_DIRECTORIES[@]}"; do
  [[ -d "$DIRECTORY" ]] \
    && pass "Directory exists: $DIRECTORY" \
    || fail "Missing directory: $DIRECTORY"

  [[ -f "$DIRECTORY/.gitkeep" ]] \
    && pass "Tracking file exists: $DIRECTORY/.gitkeep" \
    || fail "Missing tracking file: $DIRECTORY/.gitkeep"
done

[[ -f "$STRUCTURE_FILE" ]] \
  && pass "$STRUCTURE_FILE exists" \
  || fail "$STRUCTURE_FILE does not exist"

UNEXPECTED_RUNTIME_FILES="$(
  find \
    app/demo \
    components/demo \
    features/demo \
    config/demo \
    types/demo \
    tests/demo \
    public/demo \
    -type f ! -name ".gitkeep" -print
)"

if [[ -z "$UNEXPECTED_RUNTIME_FILES" ]]; then
  pass "No runtime implementation exists"
else
  printf "\nUnexpected runtime files:\n%s\n" "$UNEXPECTED_RUNTIME_FILES" >&2
  fail "D4 may contain only .gitkeep files"
fi

UNEXPECTED_CHANGED_FILES=""

while IFS= read -r STATUS_LINE; do
  [[ -z "$STATUS_LINE" ]] && continue

  FILE_PATH="${STATUS_LINE:3}"

  case "$FILE_PATH" in
    app/demo/.gitkeep)
      ;;
    components/demo/*/.gitkeep)
      ;;
    features/demo/*/.gitkeep)
      ;;
    config/demo/.gitkeep)
      ;;
    types/demo/.gitkeep)
      ;;
    tests/demo/*/.gitkeep)
      ;;
    public/demo/*/.gitkeep)
      ;;
    "$STRUCTURE_FILE"|"$SCRIPT_FILE")
      ;;
    *)
      UNEXPECTED_CHANGED_FILES+="${FILE_PATH}"$'\n'
      ;;
  esac
done < <(git status --porcelain=v1 --untracked-files=all)

if [[ -z "$UNEXPECTED_CHANGED_FILES" ]]; then
  pass "Only D4-owned files are changed"
else
  printf "\nUnexpected changed files:\n%s\n" "$UNEXPECTED_CHANGED_FILES" >&2
  fail "D4 contains files outside its approved boundary"
fi

bash -n "$SCRIPT_FILE"
pass "Verification script syntax is valid"

printf "\n=============================\n"
printf "D4 VERIFICATION PASSED\n"
printf "The Demo Engine folder structure is ready to commit.\n\n"
