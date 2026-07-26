#!/usr/bin/env bash
set -euo pipefail

EXPECTED_ROOT="${FAIDIA_ROOT:-/Users/blaq/Downloads/faidia}"
EXPECTED_BRANCH="${FAIDIA_BRANCH:-feat/demo-engine-base}"
COMPONENT="components/demo/reports/reports-dashboard.tsx"
STYLES="components/demo/reports/reports-dashboard.module.css"

pass() { printf "PASS: %s\n" "$1"; }
fail() { printf "FAIL: %s\n" "$1" >&2; exit 1; }

[[ "$(pwd)" == "$EXPECTED_ROOT" ]] \
  && pass "Current directory is correct" \
  || fail "Run this verifier from $EXPECTED_ROOT"

CURRENT_BRANCH="$(git branch --show-current 2>/dev/null || true)"
[[ -z "$CURRENT_BRANCH" || "$CURRENT_BRANCH" == "$EXPECTED_BRANCH" ]] \
  && pass "Current branch is acceptable" \
  || fail "Expected branch $EXPECTED_BRANCH"

[[ -f "$COMPONENT" ]] || fail "Missing $COMPONENT"
[[ -f "$STYLES" ]] || fail "Missing $STYLES"

grep -Fq "useSyncExternalStore" "$COMPONENT" \
  && pass "Hydration-safe chart readiness exists" \
  || fail "Hydration-safe chart readiness is missing"

grep -Fq "function ReportResponsiveContainer" "$COMPONENT" \
  && pass "Shared report chart wrapper exists" \
  || fail "Shared report chart wrapper is missing"

grep -Fq "minHeight={1}" "$COMPONENT" \
  && grep -Fq "minWidth={1}" "$COMPONENT" \
  && pass "ResponsiveContainer receives stable minimum dimensions" \
  || fail "Stable ResponsiveContainer dimensions are missing"

WRAPPER_COUNT="$(grep -o '<ReportResponsiveContainer>' "$COMPONENT" | wc -l | tr -d ' ')"
[[ "$WRAPPER_COUNT" -ge 5 ]] \
  && pass "All report chart families use the shared wrapper ($WRAPPER_COUNT)" \
  || fail "Expected at least 5 shared wrapper uses but found $WRAPPER_COUNT"

if grep -Fq '<ResponsiveContainer height="100%" width="100%">' "$COMPONENT"; then
  fail "A direct percentage-only ResponsiveContainer still exists"
else
  pass "No direct percentage-only chart container remains"
fi

REQUIRED_CHARTS=(
  "LineChart"
  "ComposedChart"
  "PieChart"
  "BarChart"
  "FunnelChart"
)

for CHART in "${REQUIRED_CHARTS[@]}"; do
  grep -Fq "$CHART" "$COMPONENT" \
    && pass "Chart remains present: $CHART" \
    || fail "Missing chart: $CHART"
done

grep -Fq "D29R-14: stable Recharts measurement contract" "$STYLES" \
  && pass "Local Recharts CSS contract exists" \
  || fail "Local Recharts CSS contract is missing"

grep -Fq ':global(.recharts-responsive-container)' "$STYLES" \
  && pass "Reports override the route-wide Recharts minimum" \
  || fail "Reports Recharts override is missing"

PAGE_COUNT="$(
  find app/demo -type f -name "page.tsx" | wc -l | tr -d " "
)"
[[ "$PAGE_COUNT" -eq 14 ]] \
  && pass "The 14-page route inventory remains intact" \
  || fail "Expected 14 routes but found $PAGE_COUNT"

if grep -nE \
  'createClient\(|supabase\.|\bfetch[[:space:]]*\(|axios\.' \
  "$COMPONENT"; then
  fail "Reports chart repair must not add network or Supabase access"
else
  pass "Reports chart repair adds no network or Supabase dependency"
fi

bash -n scripts/verify-d29r14-reports-chart-rendering.sh
pass "Verifier syntax is valid"

printf "\nD29R-14 REPORTS CHART RENDERING VERIFICATION PASSED\n"
