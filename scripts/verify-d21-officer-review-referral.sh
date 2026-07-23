#!/usr/bin/env bash

set -euo pipefail

# D29R-4 supersession bridge
if [[ -x "scripts/verify-d29r4-officer-review-referral.sh" ]]; then
  exec ./scripts/verify-d29r4-officer-review-referral.sh
fi

EXPECTED_ROOT="/Users/blaq/Downloads/faidia"
EXPECTED_BRANCH="feat/demo-engine-base"

ROUTE_FILE="app/demo/officer/requests/[requestId]/page.tsx"
REVIEW_FILE="components/demo/officer/officer-request-review.tsx"
DOCUMENT_FILE="docs/demo-engine-base/DEMO-ENGINE-OFFICER-REVIEW-REFERRAL.md"
SCRIPT_FILE="scripts/verify-d21-officer-review-referral.sh"

pass() {
  printf "PASS: %s\n" "$1"
}

fail() {
  printf "FAIL: %s\n" "$1" >&2
  exit 1
}

printf "\nFAIDIA D21 officer-review-and-referral verification\n"
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

REQUIRED_FILES=(
  "$ROUTE_FILE"
  "$REVIEW_FILE"
  "$DOCUMENT_FILE"
  "$SCRIPT_FILE"
)

for REQUIRED_FILE in "${REQUIRED_FILES[@]}"; do
  [[ -f "$REQUIRED_FILE" ]] \
    && pass "File exists: $REQUIRED_FILE" \
    || fail "Missing file: $REQUIRED_FILE"
done

REQUIRED_ROUTE_TEXT=(
  "params: Promise"
  "searchParams: Promise"
  "SERVICE_BY_REQUEST_ID"
  "getDefaultDemoClient"
  "candidate.active"
  "notFound()"
  "client.departments.map"
  "OfficerRequestReview"
)

for REQUIRED_TEXT in "${REQUIRED_ROUTE_TEXT[@]}"; do
  grep -Fq "$REQUIRED_TEXT" "$ROUTE_FILE" \
    && pass "Officer request route capability found: $REQUIRED_TEXT" \
    || fail "Missing officer request route capability: $REQUIRED_TEXT"
done

REQUIRED_REVIEW_TEXT=(
  '"use client"'
  "useDemoState"
  "Officer request review"
  "Applicant responses"
  "Submitted document metadata"
  "Completeness assessment"
  "Internal notes"
  "Request applicant correction"
  "Create departmental referral"
  "Student Records keeps the parent request"
  '"SET_FORM_VALUE"'
  '"ADD_ACTIVITY_EVENT"'
  'addActivity("request_opened_by_officer"'
  'addActivity("first_action_taken"'
  'addActivity("document_returned"'
  'addActivity("handoff_created"'
  '"PENDING_ACCEPTANCE"'
  '"WAITING_ON_FINANCE"'
  '"ADDITIONAL_CHECKS_IN_PROGRESS"'
)

for REQUIRED_TEXT in "${REQUIRED_REVIEW_TEXT[@]}"; do
  grep -Fq "$REQUIRED_TEXT" "$REVIEW_FILE" \
    && pass "Officer review capability found: $REQUIRED_TEXT" \
    || fail "Missing officer review capability: $REQUIRED_TEXT"
done

REQUIRED_DOCUMENT_TEXT=(
  "D21 replaces the officer request-details placeholder with a functional review workspace."
  "D21 implements a referral, not a transfer."
  "Student Records keeps parent-request ownership"
  "The initial referral status is PENDING_ACCEPTANCE."
  "Internal notes are staff-only demonstration data."
  "## 8. D21 definition of done"
)

for REQUIRED_TEXT in "${REQUIRED_DOCUMENT_TEXT[@]}"; do
  grep -Fq "$REQUIRED_TEXT" "$DOCUMENT_FILE" \
    && pass "Documentation rule found: $REQUIRED_TEXT" \
    || fail "Missing documentation rule: $REQUIRED_TEXT"
done

RUNTIME_FILES=(
  "$ROUTE_FILE"
  "$REVIEW_FILE"
)

if grep -nE \
  "from[[:space:]]+[\"'][^\"']*supabase|createClient\\(|supabase\\." \
  "${RUNTIME_FILES[@]}"; then
  fail "D21 runtime files must not import or call Supabase"
else
  pass "No Supabase runtime dependency found"
fi

grep -Fq \
  'href={`/demo/officer/requests/${row.id}`}' \
  components/demo/officer/officer-dashboard.tsx \
  && pass "D20 queue continues into the D21 request route" \
  || fail "D20 queue must link to the D21 request route"

PAGE_COUNT="$(
  find app/demo -type f -name "page.tsx" | wc -l | tr -d " "
)"

[[ "$PAGE_COUNT" -eq 14 ]] \
  && pass "The 14-route inventory remains intact" \
  || fail "Expected 14 route pages but found $PAGE_COUNT"

UNEXPECTED_CHANGED_FILES=""

while IFS= read -r STATUS_LINE; do
  [[ -z "$STATUS_LINE" ]] && continue

  FILE_PATH="${STATUS_LINE:3}"

  case "$FILE_PATH" in
    "$ROUTE_FILE"|\
    "$REVIEW_FILE"|\
    "$DOCUMENT_FILE"|\
    "$SCRIPT_FILE")
      ;;
    *)
      UNEXPECTED_CHANGED_FILES+="${FILE_PATH}"$'\n'
      ;;
  esac
done < <(git status --porcelain=v1 --untracked-files=all)

if [[ -z "$UNEXPECTED_CHANGED_FILES" ]]; then
  pass "Only D21-owned files are changed"
else
  printf "\nUnexpected changed files:\n%s\n" \
    "$UNEXPECTED_CHANGED_FILES" >&2
  fail "D21 contains files outside its approved boundary"
fi

bash -n "$SCRIPT_FILE"
pass "Verification script syntax is valid"

printf "\n==================================================\n"
printf "D21 VERIFICATION PASSED\n"
printf "The officer review and referral workspace is ready.\n\n"
