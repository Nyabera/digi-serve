#!/usr/bin/env bash
set -euo pipefail

ROOT="${FAIDIA_ROOT:-/Users/blaq/Downloads/faidia}"
EXPECTED_BRANCH="feat/demo-dashboard-redesign"
OFFICER_DIR="features/demo-engine/dashboards/officer"
PAGE_FILE="app/demo/officer/page.tsx"
D31_DIR="docs/demo-engine-base/d31-dashboard-redesign"
CSS_FILE="$OFFICER_DIR/officer-dashboard.module.css"

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
  "$OFFICER_DIR/officer-dashboard.tsx"
  "$OFFICER_DIR/officer-dashboard.module.css"
  "$OFFICER_DIR/officer-work-plan-tabs.tsx"
  "$OFFICER_DIR/officer-case-signal-tabs.tsx"
  "$OFFICER_DIR/officer-rhythm-panel.tsx"
  "$OFFICER_DIR/index.ts"
  "$PAGE_FILE"
  "$D31_DIR/D31-OFFICER-DASHBOARD.md"
  "$D31_DIR/D31-6-CHECKLIST.md"
)

for file in "${required[@]}"; do
  [[ -s "$file" ]] || fail "Missing or empty file: $file"
done

pass "All D31-6 Officer dashboard files exist"

grep -Fq "getActiveDemoPack" "$PAGE_FILE" \
  || fail "Officer page does not load the active Demo Pack"
grep -Fq "adaptOfficerDashboard" "$PAGE_FILE" \
  || fail "Officer page does not use the D31-5 adapter"
grep -Fq "validateOfficerDashboardData" "$PAGE_FILE" \
  || fail "Officer page does not validate its view model"
grep -Fq "<OfficerDashboard data={data}" "$PAGE_FILE" \
  || fail "Officer page does not mount the reconstructed dashboard"

page_lines="$(wc -l < "$PAGE_FILE" | tr -d ' ')"
[[ "$page_lines" -le 40 ]] \
  || fail "Officer route is not thin: $page_lines lines"

pass "Officer route remains thin and adapter-driven"

for label in \
  "Workload pulse" \
  "Today's work plan" \
  "Case signals" \
  "Recent handoffs" \
  "Recent Activity" \
  "Up Next" \
  "Action Required" \
  "My rhythm"; do
  grep -RFn "$label" \
    "$OFFICER_DIR" \
    --include='*.tsx' \
    >/dev/null \
    || fail "Missing Officer reference section: $label"
done

pass "Officer dashboard contains every reference section"

for primitive in \
  DashboardCard \
  DashboardMetricStrip \
  DashboardTable \
  DashboardStatusBadge \
  DashboardProgress \
  DashboardChartFrame \
  DashboardTabs; do
  grep -RFn "$primitive" \
    "$OFFICER_DIR" \
    --include='*.tsx' \
    >/dev/null \
    || fail "Officer dashboard does not use shared primitive: $primitive"
done

pass "Officer dashboard is composed from D31 shared primitives"

grep -Fq 'data-dashboard-role="officer"' \
  "$OFFICER_DIR/officer-dashboard.tsx" \
  || fail "Officer dashboard role token scope is missing"
grep -Fq "dashboard-tokens.module.css" \
  "$OFFICER_DIR/officer-dashboard.tsx" \
  || fail "Officer dashboard theme class is missing"

pass "Officer dashboard uses the scoped D31 theme"

for route in \
  "/demo/officer/requests/" \
  "/demo/officer/department-inbox" \
  "/demo/officer/documents" \
  "/demo/officer/queue" \
  "/demo/officer/sla-monitor"; do
  grep -RFn "$route" \
    features/demo-engine/dashboards/data \
    "$OFFICER_DIR" \
    --include='*.ts' \
    --include='*.tsx' \
    >/dev/null \
    || fail "Expected Officer interaction route is missing: $route"
done

pass "Officer actions retain real route destinations"

python3 - <<'PY'
from pathlib import Path
import re

directory = Path(
    "features/demo-engine/dashboards/officer"
)

source = "\n".join(
    path.read_text(encoding="utf-8")
    for path in directory.glob("*.tsx")
)

h1_count = len(
    re.findall(r"<h1(?:\s|>)", source)
)

if h1_count != 1:
    raise SystemExit(
        f"FAIL: Expected one Officer h1; found {h1_count}."
    )

if "headingLevel={2}" not in source:
    raise SystemExit(
        "FAIL: Officer panels do not declare h2 headings."
    )

for role in (
    "tablist",
    "tab",
    "tabpanel",
):
    shared_tabs = Path(
        "features/demo-engine/dashboards/shared/components/"
        "dashboard-tabs.tsx"
    ).read_text(encoding="utf-8")

    if f'role="{role}"' not in shared_tabs:
        raise SystemExit(
            f"FAIL: Shared tabs lost role={role}."
        )

print("PASS: Officer heading and tab semantics are present")
PY

if grep -RniE \
  'demo-packs/tvet|DemoRequestConfig|Drizzle|Supabase|useDemoPack\(' \
  "$OFFICER_DIR" \
  --include='*.ts' \
  --include='*.tsx' \
  2>/dev/null | grep -q .; then
  fail "Officer JSX bypasses the typed dashboard data boundary"
fi

pass "Officer JSX does not read raw pack or database records"

if grep -RniE \
  'RoleWorkspaceShell|InternalAppShell|OperationalWorkspaceShell|AdminWorkspaceShell' \
  "$OFFICER_DIR" \
  --include='*.ts' \
  --include='*.tsx' \
  2>/dev/null | grep -q .; then
  fail "Officer dashboard body attempts to own shell chrome"
fi

if grep -Eq '(^|[[:space:]])\:root[[:space:]]*\{' "$CSS_FILE"; then
  fail "Officer CSS mutates global :root"
fi

if grep -Eqi \
  '(^|[[:space:];])zoom[[:space:]]*:|background(-image)?[[:space:]]*:[^;]*url\(' \
  "$CSS_FILE"; then
  fail "Officer CSS contains prohibited scaling or screenshot backgrounds"
fi

if grep -RFn "ResponsiveContainer" \
  "$OFFICER_DIR" \
  --include='*.tsx' \
  >/dev/null; then
  fail "Officer dashboard must use measured numeric chart dimensions"
fi

pass "Officer body remains shell-neutral and uses measured chart geometry"

grep -Fq "overflow-x: auto" \
  features/demo-engine/dashboards/shared/components/dashboard-primitives.module.css \
  || fail "Table overflow protection is missing"

grep -Fq "minmax(0, 1fr)" "$CSS_FILE" \
  || fail "Officer composition lacks protected grid columns"

pass "Officer responsive layout protects tables and grid children"

./scripts/verify-d31-2-shell-contracts.sh
pass "D31-2 shell contracts remain valid"

./scripts/verify-d31-3-dashboard-tokens.sh
pass "D31-3 token system remains valid"

./scripts/verify-d31-4-dashboard-primitives.sh
pass "D31-4 primitive system remains valid"

./scripts/verify-d31-5-dashboard-data.sh
pass "D31-5 data contracts remain valid"

git diff --check
pass "Git whitespace validation passed"

printf '\nD31-6 Officer dashboard verification passed.\n'
