#!/usr/bin/env bash
set -euo pipefail

# D29R-3P supersession bridge
if [[ -x "scripts/verify-d29r3p-officer-dashboard-parity.sh" ]]; then
  exec ./scripts/verify-d29r3p-officer-dashboard-parity.sh
fi

EXPECTED_ROOT="/Users/blaq/Downloads/faidia"
EXPECTED_BRANCH="feat/demo-engine-base"
PAGE_FILE="app/demo/officer/page.tsx"
DASHBOARD_FILE="components/demo/officer/officer-dashboard.tsx"
STYLE_FILE="components/demo/officer/officer-dashboard.module.css"
VIEW_MODEL_FILE="features/demo/view-models/officer-dashboard-view-model.ts"
INTEGRATION_STYLE_FILE="app/demo/demo-internal-shell.css"
LAYOUT_FILE="app/demo/layout.tsx"
DOCUMENT_FILE="docs/demo-engine-base/DEMO-ENGINE-OFFICER-DASHBOARD-REDESIGN.md"
SCRIPT_FILE="scripts/verify-d29r3-officer-dashboard.sh"

pass() { printf "PASS: %s\n" "$1"; }
fail() { printf "FAIL: %s\n" "$1" >&2; exit 1; }

printf "\nFAIDIA D29R-3 Officer dashboard verification\n"
printf "===========================================\n\n"

[[ "$(pwd)" == "$EXPECTED_ROOT" ]] && pass "Current directory is correct" || fail "Run this script from $EXPECTED_ROOT"
[[ "$(git branch --show-current)" == "$EXPECTED_BRANCH" ]] && pass "Current branch is $EXPECTED_BRANCH" || fail "Expected branch $EXPECTED_BRANCH"

REQUIRED_FILES=(
  "$PAGE_FILE"
  "$DASHBOARD_FILE"
  "$STYLE_FILE"
  "$VIEW_MODEL_FILE"
  "$INTEGRATION_STYLE_FILE"
  "$LAYOUT_FILE"
  "$DOCUMENT_FILE"
  "$SCRIPT_FILE"
  "components/demo/internal-shell/internal-app-shell.tsx"
  "components/demo/internal-ui/metric-card.tsx"
  "components/demo/internal-ui/internal-data-table.tsx"
)

for FILE in "${REQUIRED_FILES[@]}"; do
  [[ -f "$FILE" ]] && pass "File exists: $FILE" || fail "Missing file: $FILE"
done

grep -Fq 'import "./demo-internal-shell.css";' "$LAYOUT_FILE" && pass "Demo layout imports the internal-shell integration stylesheet" || fail "Demo layout must import ./demo-internal-shell.css"

REQUIRED_DASHBOARD_TEXT=(
  "InternalAppShell"
  "InternalPageHeader"
  "MetricCard"
  "InternalDataTable"
  "TableToolbar"
  "QueuePagination"
  "MessageList"
  "DeadlineList"
  "Assigned to me"
  "Due today"
  "Overdue"
  "Waiting on applicant"
  "Waiting on department"
  "Completed today"
  "My queue"
  "Recent handoffs"
  "Recent applicant messages"
  "Upcoming deadlines"
  "Department SLA"
  'data-d29r3-officer-shell="true"'
)

for TEXT in "${REQUIRED_DASHBOARD_TEXT[@]}"; do
  grep -Fq -- "$TEXT" "$DASHBOARD_FILE" && pass "Officer capability found: $TEXT" || fail "Missing Officer capability: $TEXT"
done

for TEXT in buildOfficerDashboardViewModel fallbackQueue fallbackHandoffs officerStatusTone; do
  grep -Fq -- "$TEXT" "$VIEW_MODEL_FILE" && pass "Officer view-model capability found: $TEXT" || fail "Missing Officer view-model capability: $TEXT"
done

for TEXT in 'repeat(6, minmax(0, 1fr))' 'minmax(19rem, 22rem)' 'var(--border)' 'var(--surface)' 'var(--primary)' '@media (max-width: 63.99rem)' '@media (max-width: 47.99rem)'; do
  grep -Fq -- "$TEXT" "$STYLE_FILE" && pass "Officer styling found: $TEXT" || fail "Missing Officer styling: $TEXT"
done

grep -Fq 'body:has([data-d29r3-officer-shell="true"])' "$INTEGRATION_STYLE_FILE" && pass "Legacy Demo Control Bar is hidden on the redesigned Officer route" || fail "Officer route must hide the legacy full-width Demo Control Bar"

if grep -nE "from[[:space:]]+[\"'][^\"']*supabase|createClient\(|supabase\." "$PAGE_FILE" "$DASHBOARD_FILE" "$VIEW_MODEL_FILE"; then
  fail "D29R-3 runtime files must not call Supabase"
else
  pass "No Supabase runtime dependency found"
fi

PAGE_COUNT="$(find app/demo -type f -name 'page.tsx' | wc -l | tr -d ' ')"
[[ "$PAGE_COUNT" -eq 14 ]] && pass "The 14-route inventory remains intact" || fail "Expected 14 route pages but found $PAGE_COUNT"

ALLOWED_FILES=(
  "$PAGE_FILE"
  "$DASHBOARD_FILE"
  "$STYLE_FILE"
  "$VIEW_MODEL_FILE"
  "$INTEGRATION_STYLE_FILE"
  "$LAYOUT_FILE"
  "$DOCUMENT_FILE"
  "$SCRIPT_FILE"
)

while IFS= read -r LINE; do
  [[ -z "$LINE" ]] && continue
  FILE_PATH="${LINE:3}"
  ALLOWED=false
  for ALLOWED_FILE in "${ALLOWED_FILES[@]}"; do
    if [[ "$FILE_PATH" == "$ALLOWED_FILE" ]]; then ALLOWED=true; break; fi
  done
  [[ "$ALLOWED" == true ]] || fail "Unexpected changed file: $FILE_PATH"
done < <(git status --porcelain=v1 --untracked-files=all)

pass "Only D29R-3-owned files are changed"
bash -n "$SCRIPT_FILE"
pass "Verification script syntax is valid"

printf "\n===========================================\n"
printf "D29R-3 VERIFICATION PASSED\n"
printf "The Officer dashboard and queue redesign is ready.\n\n"
