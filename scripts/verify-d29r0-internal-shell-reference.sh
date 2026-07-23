#!/usr/bin/env bash

set -euo pipefail

EXPECTED_ROOT="/Users/blaq/Downloads/faidia"
EXPECTED_BRANCH="feat/demo-engine-base"

REFERENCE_DIR="public/demo/references/internal-shell"
DOCUMENT_FILE="docs/demo-engine-base/DEMO-ENGINE-INTERNAL-SHELL-REFERENCE.md"
SCRIPT_FILE="scripts/verify-d29r0-internal-shell-reference.sh"

pass() { printf "PASS: %s\n" "$1"; }
fail() { printf "FAIL: %s\n" "$1" >&2; exit 1; }

printf "\nFAIDIA D29R-0 internal-shell reference verification\n"
printf "==================================================\n\n"

[[ "$(pwd)" == "$EXPECTED_ROOT" ]] \
  && pass "Current directory is correct" \
  || fail "Run this script from $EXPECTED_ROOT"

[[ "$(git rev-parse --show-toplevel 2>/dev/null)" == "$EXPECTED_ROOT" ]] \
  && pass "Git repository root is correct" \
  || fail "Git repository root is incorrect"

[[ "$(git branch --show-current)" == "$EXPECTED_BRANCH" ]] \
  && pass "Current branch is $EXPECTED_BRANCH" \
  || fail "Expected branch $EXPECTED_BRANCH"

REQUIRED_REFERENCES=(
  "01-officer-dashboard.png"
  "02-officer-queue.png"
  "03-handoff-collaboration.png"
  "04-referral-composer.png"
  "05-workflow-invites.png"
  "06-returned-cases.png"
  "07-department-handoff-inbox.png"
)

[[ -d "$REFERENCE_DIR" ]] \
  && pass "Reference directory exists: $REFERENCE_DIR" \
  || fail "Missing reference directory: $REFERENCE_DIR"

for FILE in "${REQUIRED_REFERENCES[@]}"; do
  [[ -s "$REFERENCE_DIR/$FILE" ]] \
    && pass "Reference exists: $FILE" \
    || fail "Missing or empty reference: $FILE"
done

REFERENCE_COUNT="$(
  find "$REFERENCE_DIR" -maxdepth 1 -type f -name "*.png" \
    | wc -l | tr -d " "
)"

[[ "$REFERENCE_COUNT" -eq 7 ]] \
  && pass "Exactly seven approved PNG references are attached" \
  || fail "Expected exactly seven PNG references but found $REFERENCE_COUNT"

[[ -f "$DOCUMENT_FILE" ]] \
  && pass "Document exists: $DOCUMENT_FILE" \
  || fail "Missing document: $DOCUMENT_FILE"

REQUIRED_DOCUMENT_TEXT=(
  "D29R-0 freezes the visual and information-architecture reference"
  'app/globals.css'
  'The uploaded `design.md` is a Supabase Auth and SSR cookie-design document.'
  "var(--sidebar-width-staff)"
  "var(--topbar-height-desktop)"
  "var(--primary-soft)"
  ".nav-item"
  "Officer navigation"
  "Supervisor navigation"
  "Department navigation"
  "Admin navigation"
  'The current 14-route Demo Engine has no `/demo/admin` route.'
  "No new route may be created during D29R"
  "D29R-0 definition of done"
)

for TEXT in "${REQUIRED_DOCUMENT_TEXT[@]}"; do
  grep -Fq -- "$TEXT" "$DOCUMENT_FILE" \
    && pass "Documentation rule found: $TEXT" \
    || fail "Missing documentation rule: $TEXT"
done

PAGE_COUNT="$(
  find app/demo -type f -name "page.tsx" | wc -l | tr -d " "
)"

[[ "$PAGE_COUNT" -eq 14 ]] \
  && pass "The 14-route inventory remains intact" \
  || fail "Expected 14 route pages but found $PAGE_COUNT"

ALLOWED_FILES=(
  "$DOCUMENT_FILE"
  "$SCRIPT_FILE"
)

for FILE in "${REQUIRED_REFERENCES[@]}"; do
  ALLOWED_FILES+=("$REFERENCE_DIR/$FILE")
done

while IFS= read -r LINE; do
  [[ -z "$LINE" ]] && continue

  FILE_PATH="${LINE:3}"
  ALLOWED=false

  for ALLOWED_FILE in "${ALLOWED_FILES[@]}"; do
    if [[ "$FILE_PATH" == "$ALLOWED_FILE" ]]; then
      ALLOWED=true
      break
    fi
  done

  [[ "$ALLOWED" == true ]] \
    || fail "Unexpected changed file: $FILE_PATH"
done < <(git status --porcelain=v1 --untracked-files=all)

pass "Only D29R-0-owned files are changed"

if git diff -- \
  app/demo \
  components/demo \
  features/demo \
  config/demo \
  types/demo \
  | grep -q .; then
  fail "D29R-0 must not modify runtime, state, configuration or types"
else
  pass "Runtime, state, configuration and types are unchanged"
fi

bash -n "$SCRIPT_FILE"
pass "Verification script syntax is valid"

printf "\n==================================================\n"
printf "D29R-0 VERIFICATION PASSED\n"
printf "Internal-shell references and source of truth are attached.\n\n"
