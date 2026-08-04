#!/usr/bin/env bash

set -euo pipefail

EXPECTED_ROOT="/Users/blaq/Downloads/faidia"
EXPECTED_BRANCH="feat/demo-engine-base"

PAGE_FILE="app/demo/officer/requests/[requestId]/page.tsx"
CONTAINER_FILE="components/demo/officer/officer-request-review.tsx"
BODY_FILE="features/officer-review/components/officer-review-referral-body.tsx"
STYLE_FILE="features/officer-review/components/officer-review-referral-body.module.css"
MODEL_FILE="features/officer-review/model/officer-review-model.ts"
FIXTURE_FILE="features/demo-engine/fixtures/officer-review.reference.ts"
ADAPTER_FILE="features/demo-engine/adapters/get-demo-officer-review-reference.ts"
DOCUMENT_FILE="docs/demo-engine-base/DEMO-ENGINE-OFFICER-REVIEW-REFERRAL-REDESIGN.md"
SCRIPT_FILE="scripts/verify-d29r4-officer-review-referral.sh"
LEGACY_SCRIPT="scripts/verify-d21-officer-review-referral.sh"

pass() { printf "PASS: %s\n" "$1"; }
fail() { printf "FAIL: %s\n" "$1" >&2; exit 1; }

printf "\nFAIDIA D29R-4 Officer review and referral\n"
printf "========================================\n\n"

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
  "$CONTAINER_FILE"
  "$BODY_FILE"
  "$STYLE_FILE"
  "$MODEL_FILE"
  "$FIXTURE_FILE"
  "$ADAPTER_FILE"
  "$DOCUMENT_FILE"
  "$SCRIPT_FILE"
  "$LEGACY_SCRIPT"
)

for FILE in "${REQUIRED_FILES[@]}"; do
  [[ -f "$FILE" ]] \
    && pass "File exists: $FILE" \
    || fail "Missing file: $FILE"
done

grep -Fq "OfficerRequestReview" "$PAGE_FILE" \
  && grep -Fq "getDefaultDemoClient" "$PAGE_FILE" \
  && pass "Existing request route remains intact" \
  || fail "Request route must retain its configuration boundary"

REQUIRED_CONTAINER_TEXT=(
  "InternalAppShell"
  "OfficerReviewReferralBody"
  "useDemoState"
  '"SET_FORM_VALUE"'
  '"ADD_ACTIVITY_EVENT"'
  '"request_opened_by_officer"'
  '"first_action_taken"'
  '"internal_note_added"'
  '"document_returned"'
  '"handoff_created"'
  '"PENDING_ACCEPTANCE"'
  '"WAITING_ON_FINANCE"'
  '"ADDITIONAL_CHECKS_IN_PROGRESS"'
  "Student Records"
  'data-d29r3-officer-shell="true"'
)

for TEXT in "${REQUIRED_CONTAINER_TEXT[@]}"; do
  grep -Fq -- "$TEXT" "$CONTAINER_FILE" \
    && pass "Workflow capability found: $TEXT" \
    || fail "Missing workflow capability: $TEXT"
done

REQUIRED_BODY_TEXT=(
  "Share Workflow / Refer Case"
  "Application Details"
  "Notes (Internal)"
  "Recent Collaboration / Audit Trail"
  "Share / Refer Workflow"
  "Share With (Department)"
  "Officer"
  "Reason for Sharing"
  "Urgency"
  "Message to Officer"
  "Expected Output"
  "Due Date"
  "What will be shared"
  "Share Preview"
  "Request Correction"
  "Send for Review"
  'data-d29r4-officer-review-body="true"'
)

for TEXT in "${REQUIRED_BODY_TEXT[@]}"; do
  grep -Fq -- "$TEXT" "$BODY_FILE" \
    && pass "Review body capability found: $TEXT" \
    || fail "Missing review body capability: $TEXT"
done

REQUIRED_STYLE_TEXT=(
  "padding: 12px 20px 32px 38px"
  "minmax(340px, 0.72fr)"
  "minmax(0, 1.28fr)"
  "min-height: 50px"
  "height: 42px"
  "min-height: 142px"
  "border-radius: 10px"
  "@media (max-width: 74.99rem)"
  "@media (max-width: 47.99rem)"
)

for TEXT in "${REQUIRED_STYLE_TEXT[@]}"; do
  grep -Fq -- "$TEXT" "$STYLE_FILE" \
    && pass "Measured review style found: $TEXT" \
    || fail "Missing measured review style: $TEXT"
done

if grep -Fq "bg-[#07090f]" "$CONTAINER_FILE" \
  || grep -Fq "Officer request review" "$CONTAINER_FILE"; then
  fail "Legacy dark-header review layout remains"
else
  pass "Legacy dark-header layout is removed"
fi

if grep -R -nE \
  "from[[:space:]]+[\"'][^\"']*supabase|createClient\\(|supabase\\." \
  "$CONTAINER_FILE" "$BODY_FILE" "$MODEL_FILE" "$FIXTURE_FILE" "$ADAPTER_FILE"; then
  fail "D29R-4 runtime files must not call Supabase"
else
  pass "No Supabase dependency found"
fi

if grep -R -nE \
  '\bfetch\s*\(|\baxios(?:\.|\s*\()|XMLHttpRequest|new[[:space:]]+WebSocket' \
  "$CONTAINER_FILE" "$BODY_FILE" "$MODEL_FILE" "$FIXTURE_FILE" "$ADAPTER_FILE"; then
  fail "D29R-4 runtime files must not add network access"
else
  pass "No network dependency found"
fi

grep -Fq \
  "D29R-4 supersession bridge" \
  "$LEGACY_SCRIPT" \
  && pass "D21 verifier delegates to D29R-4" \
  || fail "D21 verifier must delegate to D29R-4"

PROTECTED_FILES=(
  "app/demo/layout.tsx"
  "$PAGE_FILE"
  "components/demo/internal-shell/internal-app-shell.tsx"
  "components/demo/internal-shell/internal-sidebar.tsx"
  "components/demo/internal-shell/internal-topbar.tsx"
  "components/demo/internal-shell/internal-navigation.ts"
  "components/demo/internal-shell/internal-shell.module.css"
)

for FILE in "${PROTECTED_FILES[@]}"; do
  if ! git diff --quiet -- "$FILE" \
    || ! git diff --cached --quiet -- "$FILE"; then
    fail "Protected shell or route file changed: $FILE"
  fi
done

pass "Protected shell and route files are unchanged"

PAGE_COUNT="$(
  find app/demo -type f -name "page.tsx" | wc -l | tr -d " "
)"

[[ "$PAGE_COUNT" -eq 14 ]] \
  && pass "The 14-route inventory remains intact" \
  || fail "Expected 14 route pages but found $PAGE_COUNT"

ALLOWED_PREFIXES=(
  "$CONTAINER_FILE"
  "features/officer-review/"
  "$FIXTURE_FILE"
  "$ADAPTER_FILE"
  "$DOCUMENT_FILE"
  "$SCRIPT_FILE"
  "$LEGACY_SCRIPT"
)

while IFS= read -r LINE; do
  [[ -z "$LINE" ]] && continue

  FILE_PATH="${LINE:3}"
  ALLOWED=false

  for PREFIX in "${ALLOWED_PREFIXES[@]}"; do
    if [[ "$FILE_PATH" == "$PREFIX" ]] \
      || [[ "$FILE_PATH" == "$PREFIX"* ]]; then
      ALLOWED=true
      break
    fi
  done

  [[ "$ALLOWED" == true ]] \
    || fail "Unexpected changed file: $FILE_PATH"
done < <(git status --porcelain=v1 --untracked-files=all)

pass "Only D29R-4-owned files are changed"

bash -n "$SCRIPT_FILE"
pass "Verification script syntax is valid"

printf "\n========================================\n"
printf "D29R-4 VERIFICATION PASSED\n"
printf "The Officer review and referral redesign is ready.\n\n"
