#!/usr/bin/env bash
set -euo pipefail

ROOT="${FAIDIA_ROOT:-/Users/blaq/Downloads/faidia}"
EXPECTED_BRANCH="feat/demo-dashboard-redesign"
SUPERVISOR_DIR="features/demo-engine/dashboards/supervisor"
PAGE_FILE="app/demo/supervisor/page.tsx"
D31_DIR="docs/demo-engine-base/d31-dashboard-redesign"
CSS_FILE="$SUPERVISOR_DIR/supervisor-dashboard.module.css"

cd "$ROOT"

fail() {
  printf 'FAIL: %s\n' "$1" >&2
  exit 1
}

pass() {
  printf 'PASS: %s\n' "$1"
}

[[ "$(git branch --show-current)" == "$EXPECTED_BRANCH" ]] \
  || fail "Expected branch $EXPECTED_BRANCH"

required=(
  "$SUPERVISOR_DIR/supervisor-dashboard.tsx"
  "$SUPERVISOR_DIR/supervisor-dashboard-charts.tsx"
  "$SUPERVISOR_DIR/supervisor-dashboard.module.css"
  "$SUPERVISOR_DIR/index.ts"
  "$PAGE_FILE"
  "$D31_DIR/D31-SUPERVISOR-DASHBOARD.md"
  "$D31_DIR/D31-8-CHECKLIST.md"
  "public/demo/references/dashboards/supervisor-dashboard.png"
)

for file in "${required[@]}"; do
  [[ -s "$file" ]] || fail "Missing D31-8 file: $file"
done

pass "All D31-8 Supervisor files exist"

grep -Fq "getActiveDemoPack" "$PAGE_FILE" \
  || fail "Supervisor route does not load the active Demo Pack"
grep -Fq "adaptSupervisorDashboard" "$PAGE_FILE" \
  || fail "Supervisor route does not use the D31-5 adapter"
grep -Fq "validateSupervisorDashboardData" "$PAGE_FILE" \
  || fail "Supervisor route does not validate its view model"
grep -Fq "<SupervisorDashboard data={data}" "$PAGE_FILE" \
  || fail "Supervisor route does not render SupervisorDashboard"

page_lines="$(wc -l < "$PAGE_FILE" | tr -d ' ')"
[[ "$page_lines" -le 35 ]] \
  || fail "Supervisor route is not thin: $page_lines lines"

pass "Supervisor route is thin and adapter-driven"

for zone in \
  "Department health" \
  "Work distribution and control" \
  "Department performance" \
  "Oversight and governance"; do
  grep -Fq "$zone" \
    "$SUPERVISOR_DIR/supervisor-dashboard.tsx" \
    || fail "Missing Supervisor zone: $zone"
done

for section in \
  "Approval lane" \
  "Critical attention" \
  "Unassigned work" \
  "Officer workload and capacity" \
  "Assignment centre" \
  "Department work queue" \
  "Handoff control" \
  "Escalations and exceptions" \
  "Document & payment exceptions" \
  "Service flow performance" \
  "SLA trend" \
  "Officer performance" \
  "Service performance" \
  "Department throughput" \
  "Applicant experience (CSAT)" \
  "Performance insights" \
  "Recent decisions" \
  "Department activity" \
  "Audit highlights" \
  "Team notifications" \
  "Reports and exports"; do
  grep -Fq "$section" \
    "$SUPERVISOR_DIR/supervisor-dashboard.tsx" \
    || fail "Missing Supervisor section: $section"
done

pass "All four zones and reference sections are present"

for primitive in \
  DashboardCard \
  DashboardMetricStrip \
  DashboardMetric \
  DashboardProgress \
  DashboardStatusBadge \
  DashboardZone \
  DashboardChartFrame; do
  grep -RFn "$primitive" \
    "$SUPERVISOR_DIR" \
    --include='*.tsx' \
    >/dev/null \
    || fail "Supervisor dashboard does not use primitive: $primitive"
done

pass "Supervisor dashboard reuses D31 shared primitives"

grep -Fq '"use client"' \
  "$SUPERVISOR_DIR/supervisor-dashboard-charts.tsx" \
  || fail "Supervisor chart leaf is not a Client Component"

if grep -Fq '"use client"' \
  "$SUPERVISOR_DIR/supervisor-dashboard.tsx"; then
  fail "The whole Supervisor dashboard was made client-side"
fi

grep -Fq 'data-dashboard-role="supervisor"' \
  "$SUPERVISOR_DIR/supervisor-dashboard.tsx" \
  || fail "Supervisor role token scope is missing"

grep -Fq 'data-dashboard-version="d31-supervisor-zones-v1"' \
  "$SUPERVISOR_DIR/supervisor-dashboard.tsx" \
  || fail "Supervisor dashboard version marker is missing"

pass "Server/client and role-token boundaries are correct"

if grep -RniE \
  'demo-packs/tvet|RoleWorkspaceShell|InternalAppShell|OperationalWorkspaceShell|AdminWorkspaceShell' \
  "$SUPERVISOR_DIR" \
  --include='*.ts' \
  --include='*.tsx' \
  2>/dev/null | grep -q .; then
  fail "Supervisor body imports pack content or shell ownership"
fi

if grep -Eiq \
  '(^|[;{[:space:]])zoom[[:space:]]*:|transform[[:space:]]*:[[:space:]]*scale\(' \
  "$CSS_FILE"; then
  fail "Supervisor CSS uses prohibited zoom or transform scale"
fi

# Reject only selectors that BEGIN globally. A descendant such as
# `.dashboard button {` is locally scoped and must not be treated as global.
if grep -Eq \
  '^[[:space:]]*(:root|html|body|button|select)([[:space:]:.#\[]|$)[^{]*\{' \
  "$CSS_FILE"; then
  fail "Supervisor CSS contains a top-level unscoped global selector"
fi

grep -Fq "container-type: inline-size" "$CSS_FILE" \
  || fail "Supervisor dashboard is not container-aware"
grep -Fq "minmax(0, 1fr)" "$CSS_FILE" \
  || fail "Supervisor grids do not protect narrow children"
grep -Fq "overflow-x: auto" "$CSS_FILE" \
  || fail "Supervisor tables lack controlled horizontal overflow"

pass "Supervisor CSS is scoped and proportion-safe"

heading_count="$(
  grep -o "<h1" \
    "$SUPERVISOR_DIR/supervisor-dashboard.tsx" |
  wc -l |
  tr -d ' '
)"

[[ "$heading_count" == "1" ]] \
  || fail "Expected one Supervisor h1, found $heading_count"

grep -Fq 'aria-label="Requests ready for supervisor approval"' \
  "$SUPERVISOR_DIR/supervisor-dashboard.tsx" \
  || fail "Approval table lacks an accessible name"

grep -Fq 'aria-label="Department work queue summary"' \
  "$SUPERVISOR_DIR/supervisor-dashboard.tsx" \
  || fail "Department queue table lacks an accessible name"

pass "Supervisor semantic structure is present"

./scripts/verify-d31-2-shell-contracts.sh
pass "D31-2 shell contract still passes"

./scripts/verify-d31-3-dashboard-tokens.sh
pass "D31-3 token verifier still passes"

./scripts/verify-d31-4-dashboard-primitives.sh
pass "D31-4 primitive verifier still passes"

./scripts/verify-d31-5-dashboard-data.sh
pass "D31-5 data verifier still passes"

./scripts/verify-d31-7-officer-visual-freeze.sh
pass "D31-7 Officer visual freeze still passes"

git diff --check
pass "D31-8 Supervisor dashboard verification passed"
