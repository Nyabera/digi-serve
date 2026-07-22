#!/usr/bin/env bash

set -euo pipefail

EXPECTED_ROOT="/Users/blaq/Downloads/faidia"
EXPECTED_BRANCH="feat/demo-engine-base"

ROUTE_FILE="app/demo/department/page.tsx"
DASHBOARD_FILE="components/demo/department/department-processing-dashboard.tsx"
OFFICER_FILE="components/demo/officer/officer-request-review.tsx"
DOCUMENT_FILE="docs/demo-engine-base/DEMO-ENGINE-DEPARTMENT-PROCESSING.md"
SCRIPT_FILE="scripts/verify-d22-department-processing.sh"

pass() { printf "PASS: %s\n" "$1"; }
fail() { printf "FAIL: %s\n" "$1" >&2; exit 1; }

printf "\nFAIDIA D22 department-processing verification\n"
printf "============================================\n\n"

[[ "$(pwd)" == "$EXPECTED_ROOT" ]] \
  && pass "Current directory is correct" \
  || fail "Run this script from $EXPECTED_ROOT"

[[ "$(git branch --show-current)" == "$EXPECTED_BRANCH" ]] \
  && pass "Current branch is $EXPECTED_BRANCH" \
  || fail "Expected branch $EXPECTED_BRANCH"

REQUIRED_FILES=(
  "$ROUTE_FILE"
  "$DASHBOARD_FILE"
  "$OFFICER_FILE"
  "$DOCUMENT_FILE"
  "$SCRIPT_FILE"
)

for FILE in "${REQUIRED_FILES[@]}"; do
  [[ -f "$FILE" ]] \
    && pass "File exists: $FILE" \
    || fail "Missing file: $FILE"
done

REQUIRED_DASHBOARD_TEXT=(
  "Receiving department workspace"
  "Accept referral"
  "Decline referral"
  "Record Finance result"
  "Return for clarification"
  '"CLEAR"'
  '"HOLD"'
  '"CANNOT_VERIFY"'
  '"PENDING_ACCEPTANCE"'
  '"ACCEPTED"'
  '"COMPLETED"'
  '"SET_FORM_VALUE"'
  '"ADD_ACTIVITY_EVENT"'
  'addActivity("handoff_accepted"'
  'addActivity("handoff_completed"'
  "Student Records still owns the parent request"
  "Complete and return"
)

for TEXT in "${REQUIRED_DASHBOARD_TEXT[@]}"; do
  grep -Fq "$TEXT" "$DASHBOARD_FILE" \
    && pass "Department capability found: $TEXT" \
    || fail "Missing department capability: $TEXT"
done

REQUIRED_OFFICER_TEXT=(
  '"ACCEPTED"'
  '"COMPLETED"'
  '"DECLINED"'
  '"RETURNED_FOR_CLARIFICATION"'
  "Finance complete"
  "Finance review in progress"
)

for TEXT in "${REQUIRED_OFFICER_TEXT[@]}"; do
  grep -Fq "$TEXT" "$OFFICER_FILE" \
    && pass "D21 compatibility found: $TEXT" \
    || fail "Missing D21 compatibility: $TEXT"
done

if grep -nE \
  "from[[:space:]]+[\"'][^\"']*supabase|createClient\\(|supabase\\." \
  "$ROUTE_FILE" "$DASHBOARD_FILE" "$OFFICER_FILE"; then
  fail "D22 runtime files must not call Supabase"
else
  pass "No Supabase runtime dependency found"
fi

PAGE_COUNT="$(
  find app/demo -type f -name "page.tsx" | wc -l | tr -d " "
)"

[[ "$PAGE_COUNT" -eq 14 ]] \
  && pass "The 14-route inventory remains intact" \
  || fail "Expected 14 route pages but found $PAGE_COUNT"

ALLOWED_FILES=(
  "$ROUTE_FILE"
  "$DASHBOARD_FILE"
  "$OFFICER_FILE"
  "$DOCUMENT_FILE"
  "$SCRIPT_FILE"
)

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

pass "Only D22-owned files are changed"

bash -n "$SCRIPT_FILE"
pass "Verification script syntax is valid"

printf "\n============================================\n"
printf "D22 VERIFICATION PASSED\n"
printf "The Finance processing and return journey is ready.\n\n"
