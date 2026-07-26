#!/usr/bin/env bash
set -euo pipefail

EXPECTED_ROOT="${FAIDIA_ROOT:-/Users/blaq/Downloads/faidia}"
COMPONENT="components/demo/reports/reports-dashboard.tsx"
DATA="components/demo/reports/report-data.ts"
STYLES="components/demo/reports/reports-dashboard.module.css"
DOC="docs/demo-engine-base/D29R-16-REPORTS-10-CHART-DASHBOARD.md"

pass() { printf "PASS: %s\n" "$1"; }
fail() { printf "FAIL: %s\n" "$1" >&2; exit 1; }

[[ "$(pwd)" == "$EXPECTED_ROOT" ]] \
  && pass "Current directory is correct" \
  || fail "Run this verifier from $EXPECTED_ROOT"

for FILE in "$COMPONENT" "$DATA" "$STYLES" "$DOC"; do
  [[ -f "$FILE" ]] && pass "File exists: $FILE" || fail "Missing file: $FILE"
done

REQUIRED_TITLES=(
  "Workload vs throughput"
  "SLA health"
  "Backlog age by department"
  "Workflow completion"
  "Turnaround-time trend"
  "Requests by service"
  "Department handoff delays"
  "Officer workload and productivity"
  "Request outcomes"
  "Demand pattern"
)

for TITLE in "${REQUIRED_TITLES[@]}"; do
  grep -Fq "title=\"$TITLE\"" "$COMPONENT" \
    && pass "Report exists: $TITLE" \
    || fail "Missing report: $TITLE"
done

TITLE_COUNT="$(grep -c '^[[:space:]]*title="' "$COMPONENT" | tr -d ' ')"
[[ "$TITLE_COUNT" -eq 10 ]] \
  && pass "Exactly ten report cards are configured" \
  || fail "Expected ten report cards but found $TITLE_COUNT"

TAKEAWAY_COUNT="$(grep -Fc 'takeaways={[' "$COMPONENT" | tr -d ' ')"
[[ "$TAKEAWAY_COUNT" -eq 10 ]] \
  && pass "Every report has a takeaway group" \
  || fail "Expected ten takeaway groups but found $TAKEAWAY_COUNT"

grep -Fq 'aria-label={`Explain ${title}`}' "$COMPONENT" \
  && grep -Fq 'aria-expanded={isInfoOpen}' "$COMPONENT" \
  && pass "Information buttons are interactive and accessible" \
  || fail "Chart information-button behavior is incomplete"

grep -Fq 'data-layout={layout}' "$COMPONENT" \
  && grep -Fq 'Mosaic' "$COMPONENT" \
  && grep -Fq '3 × 1' "$COMPONENT" \
  && grep -Fq 'layout === "mosaic"' "$COMPONENT" \
  && pass "Mosaic and 3 × 1 layout selector exists" \
  || fail "Chart-grid layout selector is incomplete"

grep -Fq 'grid-template-columns: repeat(6, minmax(0, 1fr))' "$STYLES" \
  && grep -Fq 'grid-column: span 2' "$STYLES" \
  && grep -Fq 'grid-column: span 3' "$STYLES" \
  && grep -Fq 'grid-template-columns: repeat(3, minmax(0, 1fr))' "$STYLES" \
  && pass "Mosaic and three-column CSS contracts exist" \
  || fail "Chart-grid CSS contracts are missing"

for MARKER in MeasuredChart ResizeObserver getBoundingClientRect cloneElement; do
  grep -Fq "$MARKER" "$COMPONENT" \
    && pass "Measured rendering capability found: $MARKER" \
    || fail "Missing measured rendering capability: $MARKER"
done

if grep -Fq 'ResponsiveContainer' "$COMPONENT"; then
  fail "Reports must not return to ResponsiveContainer"
else
  pass "Reports retains measured chart rendering"
fi

for CHART in ComposedChart PieChart BarChart FunnelChart LineChart ScatterChart; do
  grep -Fq "$CHART" "$COMPONENT" \
    && pass "Chart implementation found: $CHART" \
    || fail "Missing chart implementation: $CHART"
done

for COLOR in '#5C6BC0' '#42A5F5' '#26A69A' '#66BB6A' '#FFB300' '#EF5350' '#78909C'; do
  grep -Fq "$COLOR" "$COMPONENT" "$DATA" \
    && pass "Material colour found: $COLOR" \
    || fail "Missing Material colour: $COLOR"
done

grep -Fq 'fontSize: 9' "$COMPONENT" \
  && pass "Compact chart-label typography is configured" \
  || fail "Compact chart-label typography is missing"

PAGE_COUNT="$(find app/demo -type f -name 'page.tsx' | wc -l | tr -d ' ')"
[[ "$PAGE_COUNT" -eq 14 ]] \
  && pass "The 14-page route inventory remains intact" \
  || fail "Expected 14 page routes but found $PAGE_COUNT"

if grep -nE 'createClient\(|supabase\.|\bfetch[[:space:]]*\(|axios\.' "$COMPONENT" "$DATA"; then
  fail "Reports update must not add network or Supabase access"
else
  pass "Reports update adds no network or Supabase dependency"
fi

bash -n scripts/verify-d29r16-reports-dashboard.sh
pass "Verifier syntax is valid"

printf "\nD29R-16 TEN-CHART REPORTS DASHBOARD VERIFICATION PASSED\n"
