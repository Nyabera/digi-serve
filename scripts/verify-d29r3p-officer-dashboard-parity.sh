#!/usr/bin/env bash

set -euo pipefail

EXPECTED_ROOT="/Users/blaq/Downloads/faidia"
EXPECTED_BRANCH="feat/demo-engine-base"

BODY_FILE="features/officer-dashboard/components/officer-dashboard-body.tsx"
STYLE_FILE="features/officer-dashboard/components/officer-dashboard-body.module.css"
DONUT_FILE="features/officer-dashboard/components/sla-donut.tsx"
MODEL_FILE="features/officer-dashboard/model/officer-dashboard-model.ts"
FIXTURE_FILE="features/demo-engine/fixtures/officer-dashboard.reference.ts"
ADAPTER_FILE="features/demo-engine/adapters/get-demo-officer-dashboard-model.ts"
PAGE_FILE="app/demo/officer/page.tsx"
SHELL_WRAPPER="components/demo/officer/officer-dashboard.tsx"
DOCUMENT_FILE="docs/demo-engine-base/DEMO-ENGINE-OFFICER-DASHBOARD-PARITY.md"
SCRIPT_FILE="scripts/verify-d29r3p-officer-dashboard-parity.sh"

pass() { printf "PASS: %s\n" "$1"; }
fail() { printf "FAIL: %s\n" "$1" >&2; exit 1; }

printf "\nFAIDIA D29R-3P measured Officer body parity\n"
printf "==========================================\n\n"

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
  "$BODY_FILE"
  "$STYLE_FILE"
  "$DONUT_FILE"
  "$MODEL_FILE"
  "$FIXTURE_FILE"
  "$ADAPTER_FILE"
  "$PAGE_FILE"
  "$SHELL_WRAPPER"
  "$DOCUMENT_FILE"
  "$SCRIPT_FILE"
)

for FILE in "${REQUIRED_FILES[@]}"; do
  [[ -f "$FILE" ]] \
    && pass "File exists: $FILE" \
    || fail "Missing file: $FILE"
done

grep -Fq "OfficerDashboard" "$PAGE_FILE" \
  && grep -Fq "getDefaultDemoClient" "$PAGE_FILE" \
  && pass "Officer route still mounts the existing shell wrapper" \
  || fail "Do not replace the Officer route with the uploaded direct-body page"

grep -Fq "InternalAppShell" "$SHELL_WRAPPER" \
  && grep -Fq "OfficerDashboardBody" "$SHELL_WRAPPER" \
  && pass "InternalAppShell remains mounted around the replacement body" \
  || fail "Officer shell wrapper is incomplete"

REQUIRED_BODY_TEXT=(
  "QueuePreview"
  "RecentHandoffs"
  "RecentMessages"
  "SlaWorkload"
  "Today’s work summary"
  'data-d29r3p-officer-body="true"'
)

for TEXT in "${REQUIRED_BODY_TEXT[@]}"; do
  grep -Fq -- "$TEXT" "$BODY_FILE" \
    && pass "Replacement body capability found: $TEXT" \
    || fail "Missing replacement body capability: $TEXT"
done

REQUIRED_STYLE_TEXT=(
  "padding: 12px 20px 32px 38px"
  "font-size: 24px"
  "height: 116px"
  "grid-template-columns: 1.12fr 1fr 1.02fr 0.99fr 0.99fr 0.92fr"
  "grid-template-columns: minmax(0, 3fr) minmax(0, 2fr)"
  "height: 55px"
  "height: 52px"
  "height: 44px"
  "width: 128px"
  "D29R-3P shell-gutter compensation"
  "D29R-3P responsive shell-gutter compensation"
)

for TEXT in "${REQUIRED_STYLE_TEXT[@]}"; do
  grep -Fq -- "$TEXT" "$STYLE_FILE" \
    && pass "Measured style found: $TEXT" \
    || fail "Missing measured style: $TEXT"
done

REQUIRED_FIXTURE_TEXT=(
  'greeting: "Good morning, Grace 👋"'
  "value: 18"
  "value: 7"
  "value: 3"
  "value: 24"
  "value: 11"
  "value: 12"
  "REQ-2026-0715"
  "REQ-2026-0718"
  "REQ-2026-0722"
  "REQ-2026-0726"
  "REQ-2026-0728"
  "percent: 92"
  "percent: 6"
  "percent: 2"
  "totalAssigned: 82"
  "inProgress: 39"
  "dueToday: 7"
  "overdue: 3"
)

for TEXT in "${REQUIRED_FIXTURE_TEXT[@]}"; do
  grep -Fq -- "$TEXT" "$FIXTURE_FILE" \
    && pass "Reference fixture found: $TEXT" \
    || fail "Missing reference fixture value: $TEXT"
done

FORBIDDEN_ROUTE_TEXT=(
  "/demo/officer/queue"
  "/demo/officer/handoffs"
  "/demo/officer/messages"
  "/demo/officer/reports/sla"
)

for TEXT in "${FORBIDDEN_ROUTE_TEXT[@]}"; do
  if grep -Fq -- "$TEXT" "$FIXTURE_FILE"; then
    fail "Fixture invents an unsupported route: $TEXT"
  fi
done

pass "Fixture links use the existing Demo Engine route inventory"

if grep -Fq "TableToolbar" "$BODY_FILE"; then
  fail "Dashboard preview must not restore the filter toolbar"
else
  pass "Dashboard queue remains a compact five-row preview"
fi

if grep -Fq "internal-dashboard-body" "$BODY_FILE"; then
  fail "Replacement body must use its measured CSS module, not the interim token wrapper"
else
  pass "Replacement body uses the measured CSS module"
fi

SUPERSEDED_FILES=(
  "components/internal/body/action-link.tsx"
  "components/internal/body/page-intro.tsx"
  "components/internal/body/section-panel.tsx"
  "components/internal/charts/sla-donut.tsx"
  "components/internal/charts/workload-snapshot.tsx"
  "components/internal/feed/activity-list.tsx"
  "components/internal/feed/message-preview-list.tsx"
  "components/internal/metrics/metric-card.tsx"
  "components/internal/metrics/metric-grid.tsx"
  "components/internal/status/status-badge.tsx"
  "components/internal/status/priority-badge.tsx"
  "components/internal/table/compact-action-button.tsx"
  "components/internal/table/operations-table.tsx"
  "components/internal/table/row-icon.tsx"
  "components/internal/table/stacked-cell.tsx"
  "components/internal/table/table-footer.tsx"
  "components/internal/internal-body.module.css"
  "components/internal/operational-icons.tsx"
  "features/officer-dashboard/components/queue-preview-panel.tsx"
  "features/officer-dashboard/components/recent-handoffs-panel.tsx"
  "features/officer-dashboard/components/recent-messages-panel.tsx"
  "features/officer-dashboard/components/sla-workload-panel.tsx"
)

for FILE in "${SUPERSEDED_FILES[@]}"; do
  [[ ! -e "$FILE" ]] \
    || fail "Superseded interim file still exists: $FILE"
done

pass "Superseded interim body components are removed"

PROTECTED_FILES=(
  "components/demo/internal-shell/internal-app-shell.tsx"
  "components/demo/internal-shell/internal-sidebar.tsx"
  "components/demo/internal-shell/internal-topbar.tsx"
  "components/demo/internal-shell/internal-navigation.ts"
  "components/demo/internal-shell/internal-shell.module.css"
  "app/demo/layout.tsx"
  "app/demo/officer/page.tsx"
)

for FILE in "${PROTECTED_FILES[@]}"; do
  if ! git diff --quiet -- "$FILE" \
    || ! git diff --cached --quiet -- "$FILE"; then
    fail "Protected shell or route file changed: $FILE"
  fi
done

pass "Protected shell and route files are unchanged"

if grep -R -nE \
  "from[[:space:]]+[\"'][^\"']*supabase|createClient\\(|supabase\\." \
  "$BODY_FILE" "$DONUT_FILE" "$MODEL_FILE" "$FIXTURE_FILE" "$ADAPTER_FILE"; then
  fail "Replacement body must not call Supabase"
else
  pass "No Supabase dependency found"
fi

if grep -R -nE \
  '\bfetch\s*\(|\baxios(?:\.|\s*\()|XMLHttpRequest|new[[:space:]]+WebSocket' \
  "$BODY_FILE" "$DONUT_FILE" "$MODEL_FILE" "$FIXTURE_FILE" "$ADAPTER_FILE"; then
  fail "Replacement body must not add network access"
else
  pass "No network dependency found"
fi

if grep -Fq "D29R-3P — internal dashboard body tokens" app/globals.css; then
  fail "Interim global token block still exists; the measured replacement is CSS-module scoped"
else
  pass "No interim D29R-3P global token block remains"
fi

PAGE_COUNT="$(
  find app/demo -type f -name "page.tsx" | wc -l | tr -d " "
)"

[[ "$PAGE_COUNT" -eq 14 ]] \
  && pass "The 14-route inventory remains intact" \
  || fail "Expected 14 route pages but found $PAGE_COUNT"

ALLOWED_PREFIXES=(
  "app/globals.css"
  "components/demo/officer/officer-dashboard.tsx"
  "components/internal/"
  "features/officer-dashboard/"
  "features/demo-engine/adapters/get-demo-officer-dashboard-model.ts"
  "features/demo-engine/fixtures/officer-dashboard.reference.ts"
  "docs/demo-engine-base/D29R-"
  "docs/demo-engine-base/DEMO-ENGINE-OFFICER-DASHBOARD-PARITY.md"
  "scripts/verify-d29r3p-officer-dashboard-parity.sh"
  "scripts/verify-d29r3-officer-dashboard.sh"
)

while IFS= read -r LINE; do
  [[ -z "$LINE" ]] && continue

  FILE_PATH="${LINE:3}"
  ALLOWED=false

  for ALLOWED_PREFIX in "${ALLOWED_PREFIXES[@]}"; do
    if [[ "$FILE_PATH" == "$ALLOWED_PREFIX" ]] \
      || [[ "$FILE_PATH" == "$ALLOWED_PREFIX"* ]]; then
      ALLOWED=true
      break
    fi
  done

  [[ "$ALLOWED" == true ]] \
    || fail "Unexpected changed file: $FILE_PATH"
done < <(git status --porcelain=v1 --untracked-files=all)

pass "Only D29R-3P body-parity files are changed"

bash -n "$SCRIPT_FILE"
pass "Verification script syntax is valid"

printf "\n==========================================\n"
printf "D29R-3P MEASURED BODY VERIFICATION PASSED\n"
printf "The Officer body is ready for visual comparison at 1672 × 941.\n\n"
