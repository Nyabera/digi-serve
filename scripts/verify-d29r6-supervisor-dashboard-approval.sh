#!/usr/bin/env bash

set -euo pipefail

EXPECTED_ROOT="/Users/blaq/Downloads/faidia"
EXPECTED_BRANCH="feat/demo-engine-base"

DASHBOARD_PAGE="app/demo/supervisor/page.tsx"
APPROVAL_PAGE="app/demo/supervisor/approvals/[requestId]/page.tsx"
DASHBOARD_CONTAINER="components/demo/supervisor/supervisor-dashboard-workspace.tsx"
APPROVAL_CONTAINER="components/demo/supervisor/supervisor-approval-workspace.tsx"
DASHBOARD_BODY="features/supervisor-approvals/components/supervisor-dashboard-body.tsx"
APPROVAL_BODY="features/supervisor-approvals/components/supervisor-approval-body.tsx"
STYLE_FILE="features/supervisor-approvals/components/supervisor-workspace.module.css"
MODEL_FILE="features/supervisor-approvals/model/supervisor-approval-model.ts"
FIXTURE_FILE="features/demo-engine/fixtures/supervisor-approvals.reference.ts"
ADAPTER_FILE="features/demo-engine/adapters/get-demo-supervisor-approvals-reference.ts"
DOCUMENT_FILE="docs/demo-engine-base/DEMO-ENGINE-SUPERVISOR-DASHBOARD-APPROVAL-REDESIGN.md"
SCRIPT_FILE="scripts/verify-d29r6-supervisor-dashboard-approval.sh"
LEGACY_SCRIPT="scripts/verify-d23-supervisor-approval.sh"

pass() { printf "PASS: %s\n" "$1"; }
fail() { printf "FAIL: %s\n" "$1" >&2; exit 1; }

printf "\nFAIDIA D29R-6 Supervisor dashboard and approval\n"
printf "==============================================\n\n"

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
  "$DASHBOARD_PAGE"
  "$APPROVAL_PAGE"
  "$DASHBOARD_CONTAINER"
  "$APPROVAL_CONTAINER"
  "$DASHBOARD_BODY"
  "$APPROVAL_BODY"
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

grep -Fq "SupervisorDashboardWorkspace" "$DASHBOARD_PAGE" \
  && grep -Fq "getDefaultDemoClient" "$DASHBOARD_PAGE" \
  && pass "Supervisor dashboard route is configured" \
  || fail "Supervisor dashboard route is incomplete"

grep -Fq "SupervisorApprovalWorkspace" "$APPROVAL_PAGE" \
  && grep -Fq "requestId" "$APPROVAL_PAGE" \
  && pass "Supervisor approval route is configured" \
  || fail "Supervisor approval route is incomplete"

REQUIRED_CONTAINER_TEXT=(
  "InternalAppShell"
  "useDemoState"
  '"SET_FORM_VALUE"'
  '"ADD_ACTIVITY_EVENT"'
  '"__supervisorDecision:record"'
  '"__supervisorDecision:status"'
  '"__supervisorDecision:publicStatus"'
  '"APPROVED"'
  '"REJECTED"'
  '"RETURNED_FOR_CLARIFICATION"'
  '"SUPERVISOR_CLARIFICATION_REQUIRED"'
  '"ADDITIONAL_CHECKS_IN_PROGRESS"'
  '"request_approved"'
  '"request_rejected"'
  '"request_returned_for_clarification"'
  "parseModernFinanceResult"
  "parseLegacyFinanceResult"
)

for TEXT in "${REQUIRED_CONTAINER_TEXT[@]}"; do
  grep -R -Fq -- "$TEXT" \
    "$DASHBOARD_CONTAINER" "$APPROVAL_CONTAINER" \
    && pass "Supervisor workflow capability found: $TEXT" \
    || fail "Missing Supervisor workflow capability: $TEXT"
done

REQUIRED_BODY_TEXT=(
  "Registrar oversight"
  "Approval Queue"
  "Officer Workload"
  "Stage Timing"
  "Requires Attention"
  "Registrar approval"
  "Request Summary"
  "Approval Gate"
  "Finance Result"
  "Submitted Record"
  "Registrar Decision"
  "Approve request"
  "Record rejection"
  "Return to Student Records"
  "Continue to outcome issuance"
  'data-d29r6-supervisor-dashboard="true"'
  'data-d29r6-supervisor-approval="true"'
)

for TEXT in "${REQUIRED_BODY_TEXT[@]}"; do
  grep -R -Fq -- "$TEXT" \
    "$DASHBOARD_BODY" "$APPROVAL_BODY" "$FIXTURE_FILE" \
    && pass "Supervisor body capability found: $TEXT" \
    || fail "Missing Supervisor body capability: $TEXT"
done

REQUIRED_STYLE_TEXT=(
  "padding: 12px 20px 32px 38px"
  "height: 116px"
  "repeat(6, minmax(0, 1fr))"
  "minmax(0, 3fr)"
  "minmax(0, 2fr)"
  "height: 55px"
  "min-height: 50px"
  "minmax(340px, 2fr)"
  "min-height: 92px"
  "@media (max-width: 74.99rem)"
  "@media (max-width: 47.99rem)"
)

for TEXT in "${REQUIRED_STYLE_TEXT[@]}"; do
  grep -Fq -- "$TEXT" "$STYLE_FILE" \
    && pass "Measured Supervisor style found: $TEXT" \
    || fail "Missing measured Supervisor style: $TEXT"
done

REQUIRED_FIXTURE_TEXT=(
  "value: 82"
  "value: 6"
  "value: 9"
  "value: 7"
  "value: 5"
  'value: "2.4d"'
  "REQ-DEMO-001"
  "REQ-DEMO-002"
  "REQ-DEMO-003"
  "REQ-DEMO-004"
  "REQ-DEMO-005"
  "Grace Wanjiku"
  "Amina Hassan"
  "Marcus Lee"
  "Miriam Wekesa"
)

for TEXT in "${REQUIRED_FIXTURE_TEXT[@]}"; do
  grep -Fq -- "$TEXT" "$FIXTURE_FILE" \
    && pass "Supervisor fixture found: $TEXT" \
    || fail "Missing Supervisor fixture value: $TEXT"
done

grep -Fq \
  'href={`/demo/outcomes/${model.requestId}`}' \
  "$APPROVAL_BODY" \
  && pass "Approval continues to the plural controlled-outcome route" \
  || fail "Approval must link to /demo/outcomes/[requestId]"

if grep -R -nE \
  "from[[:space:]]+[\"'][^\"']*supabase|createClient\\(|supabase\\." \
  "$DASHBOARD_CONTAINER" "$APPROVAL_CONTAINER" \
  "$DASHBOARD_BODY" "$APPROVAL_BODY" "$MODEL_FILE" "$FIXTURE_FILE" "$ADAPTER_FILE"; then
  fail "D29R-6 runtime files must not call Supabase"
else
  pass "No Supabase dependency found"
fi

if grep -R -nE \
  '\bfetch\s*\(|\baxios(?:\.|\s*\()|XMLHttpRequest|new[[:space:]]+WebSocket' \
  "$DASHBOARD_CONTAINER" "$APPROVAL_CONTAINER" \
  "$DASHBOARD_BODY" "$APPROVAL_BODY" "$MODEL_FILE" "$FIXTURE_FILE" "$ADAPTER_FILE"; then
  fail "D29R-6 runtime files must not add network access"
else
  pass "No network dependency found"
fi

grep -Fq "D29R-6 supersession bridge" "$LEGACY_SCRIPT" \
  && pass "D23 verifier delegates to D29R-6" \
  || fail "D23 verifier must delegate to D29R-6"

PROTECTED_FILES=(
  "app/demo/layout.tsx"
  "components/demo/internal-shell/internal-app-shell.tsx"
  "components/demo/internal-shell/internal-sidebar.tsx"
  "components/demo/internal-shell/internal-topbar.tsx"
  "components/demo/internal-shell/internal-navigation.ts"
  "components/demo/internal-shell/internal-shell.module.css"
  "features/demo/state"
  "config/demo"
  "types/demo"
  "components/demo/outcomes"
  "app/demo/outcomes"
)

for FILE in "${PROTECTED_FILES[@]}"; do
  if ! git diff --quiet -- "$FILE" \
    || ! git diff --cached --quiet -- "$FILE"; then
    fail "Protected file changed: $FILE"
  fi
done

pass "Protected shell, state, configuration and outcome files are unchanged"

PAGE_COUNT="$(
  find app/demo -type f -name "page.tsx" | wc -l | tr -d " "
)"

[[ "$PAGE_COUNT" -eq 14 ]] \
  && pass "The 14-route inventory remains intact" \
  || fail "Expected 14 route pages but found $PAGE_COUNT"

ALLOWED_PREFIXES=(
  "$DASHBOARD_PAGE"
  "$APPROVAL_PAGE"
  "components/demo/supervisor/"
  "features/supervisor-approvals/"
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

pass "Only D29R-6-owned files are changed"

bash -n "$SCRIPT_FILE"
pass "Verification script syntax is valid"

printf "\n==============================================\n"
printf "D29R-6 VERIFICATION PASSED\n"
printf "The Supervisor dashboard and Registrar approval redesign is ready.\n\n"
