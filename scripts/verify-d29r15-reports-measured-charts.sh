#!/usr/bin/env bash
set -euo pipefail

EXPECTED_ROOT="${FAIDIA_ROOT:-/Users/blaq/Downloads/faidia}"
COMPONENT="components/demo/reports/reports-dashboard.tsx"
STYLES="components/demo/reports/reports-dashboard.module.css"

pass() { printf "PASS: %s\n" "$1"; }
fail() { printf "FAIL: %s\n" "$1" >&2; exit 1; }

[[ "$(pwd)" == "$EXPECTED_ROOT" ]] \
  && pass "Current directory is correct" \
  || fail "Run this verifier from $EXPECTED_ROOT"

[[ -f "$COMPONENT" ]] || fail "Missing $COMPONENT"
[[ -f "$STYLES" ]] || fail "Missing $STYLES"

grep -Fq "function MeasuredChart" "$COMPONENT" \
  && pass "Measured chart host exists" \
  || fail "Measured chart host is missing"

grep -Fq "ResizeObserver" "$COMPONENT" \
  && grep -Fq "getBoundingClientRect" "$COMPONENT" \
  && pass "Charts measure their rendered boxes" \
  || fail "Chart measurement logic is incomplete"

grep -Fq "cloneElement(children" "$COMPONENT" \
  && pass "Numeric dimensions are passed to chart roots" \
  || fail "Chart roots do not receive measured dimensions"

if grep -Fq "ResponsiveContainer" "$COMPONENT"; then
  fail "Reports still depends on ResponsiveContainer"
else
  pass "Reports no longer depends on ResponsiveContainer"
fi

HOST_COUNT="$(grep -o '<MeasuredChart>' "$COMPONENT" | wc -l | tr -d ' ')"
[[ "$HOST_COUNT" -ge 5 ]] \
  && pass "All chart families use measured hosts ($HOST_COUNT)" \
  || fail "Expected at least 5 measured hosts but found $HOST_COUNT"

for CHART in LineChart ComposedChart PieChart BarChart FunnelChart; do
  grep -Fq "$CHART" "$COMPONENT" \
    && pass "Chart remains present: $CHART" \
    || fail "Missing chart: $CHART"
done

grep -Fq "D29R-15: measured Reports chart hosts" "$STYLES" \
  && pass "Measured chart CSS contract exists" \
  || fail "Measured chart CSS contract is missing"

if grep -nE 'createClient\(|supabase\.|\bfetch[[:space:]]*\(|axios\.' "$COMPONENT"; then
  fail "Chart repair must not add network or Supabase access"
else
  pass "Chart repair adds no network or Supabase dependency"
fi

bash -n scripts/verify-d29r15-reports-measured-charts.sh
pass "Verifier syntax is valid"

printf "\nD29R-15 REPORTS MEASURED-CHART VERIFICATION PASSED\n"
