#!/usr/bin/env bash

set -euo pipefail

EXPECTED_ROOT="/Users/blaq/Downloads/faidia"
EXPECTED_BRANCH="feat/demo-engine-base"

ROUTE_FILE="app/demo/supervisor/page.tsx"
WORKSPACE_FILE="components/demo/supervisor/supervisor-approval-workspace.tsx"
DOCUMENT_FILE="docs/demo-engine-base/DEMO-ENGINE-SUPERVISOR-APPROVAL.md"
SCRIPT_FILE="scripts/verify-d23-supervisor-approval.sh"

pass() { printf "PASS: %s\n" "$1"; }
fail() { printf "FAIL: %s\n" "$1" >&2; exit 1; }

printf "\nFAIDIA D23 supervisor-approval verification\n"
printf "==========================================\n\n"

[[ "$(pwd)" == "$EXPECTED_ROOT" ]] \
  && pass "Current directory is correct" \
  || fail "Run this script from $EXPECTED_ROOT"

[[ "$(git branch --show-current)" == "$EXPECTED_BRANCH" ]] \
  && pass "Current branch is $EXPECTED_BRANCH" \
  || fail "Expected branch $EXPECTED_BRANCH"

REQUIRED_FILES=(
  "$ROUTE_FILE"
  "$WORKSPACE_FILE"
  "$DOCUMENT_FILE"
  "$SCRIPT_FILE"
)

for FILE in "${REQUIRED_FILES[@]}"; do
  [[ -f "$FILE" ]] \
    && pass "File exists: $FILE" \
    || fail "Missing file: $FILE"
done

REQUIRED_ROUTE_TEXT=(
  "getDefaultDemoClient"
  'candidate.slug === "transcript-request"'
  'department.name === "Registrar"'
  "SupervisorApprovalWorkspace"
  'requestId="REQ-DEMO-001"'
)

for TEXT in "${REQUIRED_ROUTE_TEXT[@]}"; do
  grep -Fq "$TEXT" "$ROUTE_FILE" \
    && pass "Supervisor route capability found: $TEXT" \
    || fail "Missing supervisor route capability: $TEXT"
done

REQUIRED_WORKSPACE_TEXT=(
  '"use client"'
  "useDemoState"
  "Supervisor approval workspace"
  "Registrar-profile Supervisor"
  "Required checks"
  "Finance result"
  '"CLEAR"'
  '"HOLD"'
  '"CANNOT_VERIFY"'
  "Approve request"
  "Final rejection"
  "Applicant-visible rejection reason"
  "Return for clarification"
  '"SET_FORM_VALUE"'
  '"ADD_ACTIVITY_EVENT"'
  '"APPROVED"'
  '"REJECTED"'
  'addActivity(eventName, at)'
  '"request_approved"'
  '"request_rejected"'
  'href={`/demo/outcome/${requestId}`}'
  "not generate, upload or issue the controlled"
)

for TEXT in "${REQUIRED_WORKSPACE_TEXT[@]}"; do
  grep -Fq "$TEXT" "$WORKSPACE_FILE" \
    && pass "Supervisor capability found: $TEXT" \
    || fail "Missing supervisor capability: $TEXT"
done

REQUIRED_DOCUMENT_TEXT=(
  "D23 replaces the supervisor placeholder with the Registrar approval workspace."
  "Only the Registrar-profile Supervisor may approve, reject or return the request for clarification."
  "A HOLD or CANNOT_VERIFY result cannot be approved."
  "Approval authorizes D24 outcome issuance."
  "D23 records the formal decision but does not issue the controlled outcome."
  "## 8. D23 definition of done"
)

for TEXT in "${REQUIRED_DOCUMENT_TEXT[@]}"; do
  grep -Fq "$TEXT" "$DOCUMENT_FILE" \
    && pass "Documentation rule found: $TEXT" \
    || fail "Missing documentation rule: $TEXT"
done

if grep -nE \
  "from[[:space:]]+[\"'][^\"']*supabase|createClient\\(|supabase\\." \
  "$ROUTE_FILE" "$WORKSPACE_FILE"; then
  fail "D23 runtime files must not call Supabase"
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
  "$WORKSPACE_FILE"
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

pass "Only D23-owned files are changed"

bash -n "$SCRIPT_FILE"
pass "Verification script syntax is valid"

printf "\n==========================================\n"
printf "D23 VERIFICATION PASSED\n"
printf "The Registrar approval journey is ready.\n\n"
