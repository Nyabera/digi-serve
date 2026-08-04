#!/usr/bin/env bash

set -euo pipefail

EXPECTED_ROOT="/Users/blaq/Downloads/faidia"
EXPECTED_BRANCH="feat/demo-engine-base"
REPORT_PAGE="app/demo/reports/page.tsx"
OUTCOME_PAGE="app/demo/outcomes/[requestId]/page.tsx"
REPORT_SHELL="components/demo/reports/operational-reports-shell.tsx"
REPORT_COMPONENT="components/demo/reports/reports-dashboard.tsx"
REPORT_DATA="components/demo/reports/report-data.ts"
REPORT_CSS="components/demo/reports/reports-dashboard.module.css"
REPORT_INDEX="components/demo/reports/index.ts"
OUTCOME_SHELL="components/demo/outcomes/controlled-outcome-shell.tsx"
OUTCOME_BODY="components/demo/outcomes/controlled-outcome-workspace.tsx"
FRAME_FILE="components/demo/shell-pages/internal-secondary-page-frame.tsx"
STYLE_FILE="components/demo/shell-pages/internal-secondary-page-shell.module.css"
DESIGN_FILE="docs/demo-engine-base/REPORTS-DASHBOARD-DESIGN.md"
DOCUMENT_FILE="docs/demo-engine-base/DEMO-ENGINE-REPORTS-OUTCOMES-SHELL-INTEGRATION.md"
NODE_SCRIPT="scripts/verify-d29r7-recharts-dashboard.mjs"
SCRIPT_FILE="scripts/verify-d29r7-reports-outcomes-shell.sh"
D24_SCRIPT="scripts/verify-d24-controlled-outcome.sh"
D25_SCRIPT="scripts/verify-d25-operational-reports.sh"
BUILD_MAP="public/demo/references/reports/recharts-build-map.png"
SELECTED_REFERENCE="public/demo/references/reports/selected-reference.png"

pass() { printf "PASS: %s\n" "$1"; }
fail() { printf "FAIL: %s\n" "$1" >&2; exit 1; }

printf "\nFAIDIA D29R-7 Reports and outcomes shell integration\n"
printf "===================================================\n\n"

[[ "$(pwd)" == "$EXPECTED_ROOT" ]] && pass "Current directory is correct" || fail "Run this script from $EXPECTED_ROOT"
[[ "$(git branch --show-current)" == "$EXPECTED_BRANCH" ]] && pass "Current branch is $EXPECTED_BRANCH" || fail "Expected branch $EXPECTED_BRANCH"

REQUIRED_FILES=(
  "$REPORT_PAGE" "$OUTCOME_PAGE" "$REPORT_SHELL" "$REPORT_COMPONENT"
  "$REPORT_DATA" "$REPORT_CSS" "$REPORT_INDEX" "$OUTCOME_SHELL"
  "$OUTCOME_BODY" "$FRAME_FILE" "$STYLE_FILE" "$DESIGN_FILE"
  "$DOCUMENT_FILE" "$NODE_SCRIPT" "$SCRIPT_FILE" "$D24_SCRIPT"
  "$D25_SCRIPT" "$BUILD_MAP" "$SELECTED_REFERENCE"
)
for FILE in "${REQUIRED_FILES[@]}"; do
  [[ -f "$FILE" ]] && pass "File exists: $FILE" || fail "Missing file: $FILE"
done

node "$NODE_SCRIPT"
pass "Body-only Recharts dashboard verification passed"

grep -Fq "OperationalReportsShell" "$REPORT_PAGE" \
  && grep -Fq "getDefaultDemoClient" "$REPORT_PAGE" \
  && pass "Reports route retains the shared-shell boundary" \
  || fail "Reports route is not shell-integrated"

grep -Fq "InternalAppShell" "$REPORT_SHELL" \
  && grep -Fq "ReportsDashboard" "$REPORT_SHELL" \
  && ! grep -Fq "InternalSecondaryPageFrame" "$REPORT_SHELL" \
  && pass "Reports body renders once inside InternalAppShell" \
  || fail "Reports shell has duplicate or missing page chrome"

grep -Fq "ControlledOutcomeShell" "$OUTCOME_PAGE" \
  && grep -Fq "InternalAppShell" "$OUTCOME_SHELL" \
  && grep -Fq "ControlledOutcomeWorkspace" "$OUTCOME_SHELL" \
  && pass "Controlled outcome remains inside the shared shell" \
  || fail "Outcome shell integration is incomplete"

for TEXT in "__supervisorDecision:record" "__outcome:record" "document_issued" "outcome_downloaded" "outcome_collected" "request_completed" "Issue exact demo transcript"; do
  grep -Fq -- "$TEXT" "$OUTCOME_BODY" && pass "Outcome capability preserved: $TEXT" || fail "Missing outcome capability: $TEXT"
done

if grep -R -nE "from[[:space:]]+[\"'][^\"']*supabase|createClient\\(|supabase\\." "$REPORT_SHELL" "$REPORT_COMPONENT" "$REPORT_DATA"; then
  fail "Reports update must not call Supabase"
else
  pass "No Supabase dependency found"
fi

if grep -R -nE '\bfetch\s*\(|\baxios(?:\.|\s*\()|XMLHttpRequest|new[[:space:]]+WebSocket' "$REPORT_SHELL" "$REPORT_COMPONENT" "$REPORT_DATA"; then
  fail "Reports update must not add network access"
else
  pass "No network dependency found"
fi

PAGE_COUNT="$(find app/demo -type f -name "page.tsx" | wc -l | tr -d " ")"
[[ "$PAGE_COUNT" -eq 14 ]] && pass "The 14-route inventory remains intact" || fail "Expected 14 route pages but found $PAGE_COUNT"

if find app/demo -path "*/outcome/*" -name "page.tsx" -print -quit | grep -q .; then
  fail "Singular /demo/outcome route must not exist"
else
  pass "Plural /demo/outcomes route remains canonical"
fi

PROTECTED_FILES=(
  "components/demo/internal-shell"
  "components/demo/reports/operational-reports-dashboard.tsx"
  "$OUTCOME_BODY"
  "features/demo/state"
  "config/demo"
  "types/demo"
  "components/demo/officer"
  "components/demo/department"
  "components/demo/supervisor"
)
for FILE in "${PROTECTED_FILES[@]}"; do
  if ! git diff --quiet -- "$FILE" || ! git diff --cached --quiet -- "$FILE"; then
    fail "Protected file changed: $FILE"
  fi
done
pass "Existing shell, outcome logic and redesigned workspaces are unchanged"

ALLOWED_PREFIXES=(
  "app/demo/reports/page.tsx"
  "components/demo/reports/operational-reports-shell.tsx"
  "components/demo/reports/reports-dashboard.tsx"
  "components/demo/reports/reports-dashboard.module.css"
  "components/demo/reports/report-data.ts"
  "components/demo/reports/index.ts"
  "components/demo/outcomes/controlled-outcome-shell.tsx"
  "components/demo/shell-pages/"
  "docs/demo-engine-base/DEMO-ENGINE-REPORTS-OUTCOMES-SHELL-INTEGRATION.md"
  "docs/demo-engine-base/REPORTS-DASHBOARD-DESIGN.md"
  "public/demo/references/reports/"
  "scripts/verify-d29r7-recharts-dashboard.mjs"
  "scripts/verify-d29r7-reports-outcomes-shell.sh"
  "scripts/verify-d24-controlled-outcome.sh"
  "scripts/verify-d25-operational-reports.sh"
  "app/demo/outcomes/[requestId]/page.tsx"
  "$REPORT_SHELL" "$REPORT_COMPONENT" "$REPORT_DATA" "$REPORT_CSS"
  "$REPORT_INDEX" "$DESIGN_FILE" "$DOCUMENT_FILE" "$NODE_SCRIPT"
  "$SCRIPT_FILE" "$BUILD_MAP" "$SELECTED_REFERENCE"
)
while IFS= read -r LINE; do
  [[ -z "$LINE" ]] && continue
  FILE_PATH="${LINE:3}"
  ALLOWED=false
  for PREFIX in "${ALLOWED_PREFIXES[@]}"; do
    if [[ "$FILE_PATH" == "$PREFIX" ]] || [[ "$FILE_PATH" == "$PREFIX"* ]]; then
      ALLOWED=true
      break
    fi
  done
  [[ "$ALLOWED" == true ]] || fail "Unexpected changed file: $FILE_PATH"
done < <(git status --porcelain=v1 --untracked-files=all)
pass "Only the D29R-7 reports update files are changed"

bash -n "$SCRIPT_FILE"
pass "Verification script syntax is valid"

printf "\n===================================================\n"
printf "D29R-7 RECHARTS UPDATE VERIFICATION PASSED\n"
printf "Reports use the supplied body-only Recharts design inside the shared shell.\n\n"
