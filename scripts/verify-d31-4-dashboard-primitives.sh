#!/usr/bin/env bash
set -euo pipefail

ROOT="${FAIDIA_ROOT:-/Users/blaq/Downloads/faidia}"
EXPECTED_BRANCH="feat/demo-dashboard-redesign"
D31_DIR="docs/demo-engine-base/d31-dashboard-redesign"
COMPONENT_DIR="features/demo-engine/dashboards/shared/components"
CSS_FILE="$COMPONENT_DIR/dashboard-primitives.module.css"

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
  "$COMPONENT_DIR/dashboard-card.tsx"
  "$COMPONENT_DIR/dashboard-grid.tsx"
  "$COMPONENT_DIR/dashboard-zone.tsx"
  "$COMPONENT_DIR/dashboard-section-heading.tsx"
  "$COMPONENT_DIR/dashboard-metric.tsx"
  "$COMPONENT_DIR/dashboard-status-badge.tsx"
  "$COMPONENT_DIR/dashboard-progress.tsx"
  "$COMPONENT_DIR/dashboard-table.tsx"
  "$COMPONENT_DIR/dashboard-chart-frame.tsx"
  "$COMPONENT_DIR/dashboard-tabs.tsx"
  "$COMPONENT_DIR/dashboard-primitives.types.ts"
  "$COMPONENT_DIR/index.ts"
  "$CSS_FILE"
  "$D31_DIR/D31-DASHBOARD-PRIMITIVES.md"
  "$D31_DIR/D31-4-CHECKLIST.md"
)

for file in "${required[@]}"; do
  [[ -s "$file" ]] || fail "Missing or empty file: $file"
done

pass "All D31-4 primitive files exist"

exports=(
  "DashboardCard"
  "DashboardGrid"
  "DashboardGridItem"
  "DashboardZone"
  "DashboardSectionHeading"
  "DashboardMetricStrip"
  "DashboardMetric"
  "DashboardStatusBadge"
  "DashboardProgress"
  "DashboardTable"
  "DashboardChartFrame"
  "DashboardTabs"
)

for component in "${exports[@]}"; do
  grep -Fq "$component" \
    "$COMPONENT_DIR/index.ts" \
    || fail "Missing primitive export: $component"
done

grep -Fq 'export * from "./components";' \
  features/demo-engine/dashboards/shared/index.ts \
  || fail "Shared dashboard index does not export primitives"

pass "All shared primitives are exported"

grep -Fq "repeat(" "$CSS_FILE" \
  || fail "Dashboard grid CSS is missing"
grep -Fq "minmax(0, 1fr)" "$CSS_FILE" \
  || fail "Grid does not use minmax(0, 1fr)"
grep -Fq "min-width: 0" "$CSS_FILE" \
  || fail "Primitive CSS does not protect grid children"
grep -Fq "overflow-x: auto" "$CSS_FILE" \
  || fail "Table or tabs horizontal overflow is missing"

pass "Grid, overflow, and responsive layout rules exist"

grep -Fq 'role="progressbar"' \
  "$COMPONENT_DIR/dashboard-progress.tsx" \
  || fail "Progress primitive lacks progressbar semantics"

for role in tablist tab tabpanel; do
  grep -Fq "role=\"$role\"" \
    "$COMPONENT_DIR/dashboard-tabs.tsx" \
    || fail "Tabs primitive lacks role=$role"
done

for key in ArrowLeft ArrowRight Home End; do
  grep -Fq "\"$key\"" \
    "$COMPONENT_DIR/dashboard-tabs.tsx" \
    || fail "Tabs keyboard support is missing: $key"
done

grep -Fq "<table" \
  "$COMPONENT_DIR/dashboard-table.tsx" \
  || fail "Typed table does not use a semantic table"

grep -Fq 'scope="col"' \
  "$COMPONENT_DIR/dashboard-table.tsx" \
  || fail "Typed table headings do not declare column scope"

pass "Accessibility semantics and keyboard support exist"

grep -Fq "useState"   "$COMPONENT_DIR/dashboard-chart-frame.tsx"   || fail "Chart frame does not store measured dimensions in state"

grep -Fq "measuredWidth"   "$COMPONENT_DIR/dashboard-chart-frame.tsx"   || fail "Chart frame does not expose a state-backed numeric width"

grep -Fq "measuredHeight"   "$COMPONENT_DIR/dashboard-chart-frame.tsx"   || fail "Chart frame does not expose a state-backed numeric height"

if grep -Eq "useEffect|useLayoutEffect|useSyncExternalStore"   "$COMPONENT_DIR/dashboard-chart-frame.tsx"; then
  fail "Chart frame still uses a prohibited measurement path"
fi

grep -Fq "ResizeObserver" \
  "$COMPONENT_DIR/dashboard-chart-frame.tsx" \
  || fail "Chart frame does not measure its container"



grep -Fq "width: measuredWidth" \
  "$COMPONENT_DIR/dashboard-chart-frame.tsx" \
  || fail "Chart frame does not expose numeric width"

grep -Fq "height: measuredHeight" \
  "$COMPONENT_DIR/dashboard-chart-frame.tsx" \
  || fail "Chart frame does not expose numeric height"

pass "Chart frame supplies measured numeric dimensions"

if grep -RniE \
  'demo-packs/tvet|RoleWorkspaceShell|InternalAppShell|OperationalWorkspaceShell|AdminWorkspaceShell' \
  "$COMPONENT_DIR" \
  --include='*.ts' \
  --include='*.tsx' \
  2>/dev/null | grep -q .; then
  fail "Shared primitives import pack content or shell ownership"
fi

if grep -Eq '(^|[[:space:]])\:root[[:space:]]*\{' "$CSS_FILE"; then
  fail "Primitive CSS mutates global :root"
fi

if grep -Eqi \
  '(^|[[:space:];])zoom[[:space:]]*:|transform[[:space:]]*:[[:space:]]*scale|background(-image)?[[:space:]]*:[^;]*url\(' \
  "$CSS_FILE"; then
  fail "Primitive CSS contains prohibited scaling or screenshot backgrounds"
fi

pass "Primitive package remains pack-neutral, shell-neutral, and locally scoped"

./scripts/verify-d31-2-shell-contracts.sh
pass "D31-2 shell contracts remain unchanged"

./scripts/verify-d31-3-dashboard-tokens.sh
pass "D31-3 token system remains valid"

git diff --check
pass "Git whitespace validation passed"

printf '\nD31-4 shared dashboard primitive verification passed.\n'
