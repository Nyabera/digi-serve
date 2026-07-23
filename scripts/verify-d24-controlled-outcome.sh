#!/usr/bin/env bash

set -euo pipefail

EXPECTED_ROOT="/Users/blaq/Downloads/faidia"
EXPECTED_BRANCH="feat/demo-engine-base"

ROUTE_FILE="app/demo/outcomes/[requestId]/page.tsx"
WORKSPACE_FILE="components/demo/outcomes/controlled-outcome-workspace.tsx"
DOCUMENT_FILE="docs/demo-engine-base/DEMO-ENGINE-CONTROLLED-OUTCOME.md"
SCRIPT_FILE="scripts/verify-d24-controlled-outcome.sh"

pass() { printf "PASS: %s\n" "$1"; }
fail() { printf "FAIL: %s\n" "$1" >&2; exit 1; }

printf "\nFAIDIA D24 controlled-outcome verification\n"
printf "=========================================\n\n"

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
  "params: Promise"
  "searchParams: Promise"
  "getDefaultDemoClient"
  'requestedService ?? "transcript-request"'
  "candidate.active"
  "notFound()"
  "ControlledOutcomeWorkspace"
)

for TEXT in "${REQUIRED_ROUTE_TEXT[@]}"; do
  grep -Fq "$TEXT" "$ROUTE_FILE" \
    && pass "Outcome route capability found: $TEXT" \
    || fail "Missing outcome route capability: $TEXT"
done

REQUIRED_WORKSPACE_TEXT=(
  '"use client"'
  "useDemoState"
  "Controlled outcome issuance"
  "Issued document workspace"
  '"DEMO_TRANSCRIPT"'
  '"CONTROLLED_DOWNLOAD"'
  '"PHYSICAL_COLLECTION"'
  '"ISSUED"'
  '"DELIVERED"'
  '"COLLECTED"'
  "Registrar APPROVED decision is required"
  "immutable issued outcome already exists"
  "buildTranscriptHtml"
  "createChecksum"
  "exact issued demonstration copy"
  "Preview exact issued copy"
  "Download exact demo transcript"
  "Record physical collection"
  '"OUTCOME_ISSUED"'
  '"READY_FOR_DOWNLOAD"'
  '"READY_FOR_COLLECTION"'
  '"COMPLETED"'
  'addActivity("document_issued"'
  'addActivity("outcome_issued"'
  'addActivity("request_completed"'
  'href={`/demo/track/${requestId}`}'
)

for TEXT in "${REQUIRED_WORKSPACE_TEXT[@]}"; do
  grep -Fq "$TEXT" "$WORKSPACE_FILE" \
    && pass "Outcome capability found: $TEXT" \
    || fail "Missing outcome capability: $TEXT"
done

REQUIRED_DOCUMENT_TEXT=(
  "D24 replaces the outcome placeholder with controlled demonstration issuance and applicant access."
  "D24 separates approval, issuance and completion."
  "The exact synthetic copy is stored at issuance and is not regenerated differently on later access."
  "Issuance alone does not complete the request."
  "The D24 outcome is:"
  "## 9. D24 definition of done"
)

for TEXT in "${REQUIRED_DOCUMENT_TEXT[@]}"; do
  grep -Fq "$TEXT" "$DOCUMENT_FILE" \
    && pass "Documentation rule found: $TEXT" \
    || fail "Missing documentation rule: $TEXT"
done

grep -Fq \
  'href={`/demo/outcomes/${requestId}`}' \
  components/demo/supervisor/supervisor-approval-workspace.tsx \
  && pass "D23 approval continues into D24 issuance" \
  || fail "D23 must link approved requests into D24"

if grep -nE \
  "from[[:space:]]+[\"'][^\"']*supabase|createClient\\(|supabase\\." \
  "$ROUTE_FILE" "$WORKSPACE_FILE"; then
  fail "D24 runtime files must not call Supabase"
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
  "components/demo/supervisor/supervisor-approval-workspace.tsx"
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

pass "Only D24-owned files are changed"

bash -n "$SCRIPT_FILE"
pass "Verification script syntax is valid"

printf "\n=========================================\n"
printf "D24 VERIFICATION PASSED\n"
printf "Controlled issuance and recorded delivery are ready.\n\n"
