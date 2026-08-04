#!/usr/bin/env bash

set -euo pipefail

EXPECTED_ROOT="/Users/blaq/Downloads/faidia"
EXPECTED_BRANCH="feat/demo-engine-base"

PAGE_FILE="app/demo/officer/page.tsx"
DASHBOARD_FILE="components/demo/officer/officer-dashboard.tsx"
DOCUMENT_FILE="docs/demo-engine-base/DEMO-ENGINE-OFFICER-DASHBOARD.md"
SCRIPT_FILE="scripts/verify-d20-officer-dashboard.sh"

pass() {
  printf "PASS: %s\n" "$1"
}

fail() {
  printf "FAIL: %s\n" "$1" >&2
  exit 1
}

printf "\nFAIDIA D20 officer-dashboard verification\n"
printf "=========================================\n\n"

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
  "$PAGE_FILE"
  "$DASHBOARD_FILE"
  "$DOCUMENT_FILE"
  "$SCRIPT_FILE"
)

for REQUIRED_FILE in "${REQUIRED_FILES[@]}"; do
  [[ -f "$REQUIRED_FILE" ]] \
    && pass "File exists: $REQUIRED_FILE" \
    || fail "Missing file: $REQUIRED_FILE"
done

REQUIRED_PAGE_TEXT=(
  "getDefaultDemoClient"
  ".filter((service) => service.active)"
  "client.departments.map"
  "OfficerDashboard"
  "organizationName={client.organization.name}"
)

for REQUIRED_TEXT in "${REQUIRED_PAGE_TEXT[@]}"; do
  grep -Fq "$REQUIRED_TEXT" "$PAGE_FILE" \
    && pass "Officer route capability found: $REQUIRED_TEXT" \
    || fail "Missing officer route capability: $REQUIRED_TEXT"
done

REQUIRED_DASHBOARD_TEXT=(
  '"use client"'
  "useDemoState"
  "FAIDIA officer workspace"
  "Open requests"
  "Awaiting review"
  "Referred"
  "Completed"
  "Officer queue"
  "Search the officer queue"
  "Filter officer queue by status"
  'href={`/demo/officer/requests/${row.id}`}'
  "D20 does not approve or reject requests"
  "Synthetic queue data only"
)

for REQUIRED_TEXT in "${REQUIRED_DASHBOARD_TEXT[@]}"; do
  grep -Fq "$REQUIRED_TEXT" "$DASHBOARD_FILE" \
    && pass "Officer dashboard capability found: $REQUIRED_TEXT" \
    || fail "Missing officer dashboard capability: $REQUIRED_TEXT"
done

REQUIRED_DOCUMENT_TEXT=(
  "D20 replaces the officer placeholder with the first functional internal workspace."
  "D20 is the queue and navigation stage."
  "The dashboard reads request data from the D7 shared browser state"
  "The dashboard does not create, update, approve, reject or refer a request."
  "## 7. D20 definition of done"
)

for REQUIRED_TEXT in "${REQUIRED_DOCUMENT_TEXT[@]}"; do
  grep -Fq "$REQUIRED_TEXT" "$DOCUMENT_FILE" \
    && pass "Documentation rule found: $REQUIRED_TEXT" \
    || fail "Missing documentation rule: $REQUIRED_TEXT"
done

RUNTIME_FILES=(
  "$PAGE_FILE"
  "$DASHBOARD_FILE"
)

if grep -nE \
  "from[[:space:]]+[\"'][^\"']*supabase|createClient\\(|supabase\\." \
  "${RUNTIME_FILES[@]}"; then
  fail "D20 runtime files must not import or call Supabase"
else
  pass "No Supabase runtime dependency found"
fi

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
    "$PAGE_FILE"|\
    "$DASHBOARD_FILE"|\
    "$DOCUMENT_FILE"|\
    "$SCRIPT_FILE")
      ;;
    *)
      UNEXPECTED_CHANGED_FILES+="${FILE_PATH}"$'\n'
      ;;
  esac
done < <(git status --porcelain=v1 --untracked-files=all)

if [[ -z "$UNEXPECTED_CHANGED_FILES" ]]; then
  pass "Only D20-owned files are changed"
else
  printf "\nUnexpected changed files:\n%s\n" \
    "$UNEXPECTED_CHANGED_FILES" >&2
  fail "D20 contains files outside its approved boundary"
fi

bash -n "$SCRIPT_FILE"
pass "Verification script syntax is valid"

printf "\n=========================================\n"
printf "D20 VERIFICATION PASSED\n"
printf "The officer dashboard is ready for technical checks.\n\n"
