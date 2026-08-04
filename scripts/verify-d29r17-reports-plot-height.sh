#!/usr/bin/env bash
set -euo pipefail

EXPECTED_ROOT="${FAIDIA_ROOT:-/Users/blaq/Downloads/faidia}"
STYLES="components/demo/reports/reports-dashboard.module.css"
COMPONENT="components/demo/reports/reports-dashboard.tsx"

pass() { printf "PASS: %s\n" "$1"; }
fail() { printf "FAIL: %s\n" "$1" >&2; exit 1; }

[[ "$(pwd)" == "$EXPECTED_ROOT" ]] \
  && pass "Current directory is correct" \
  || fail "Run this verifier from $EXPECTED_ROOT"

[[ -f "$STYLES" ]] || fail "Missing $STYLES"
[[ -f "$COMPONENT" ]] || fail "Missing $COMPONENT"

grep -Fq "D29R-17: explicit Recharts plot sizing" "$STYLES" \
  && pass "Explicit plot sizing contract exists" \
  || fail "Explicit plot sizing contract is missing"

grep -Fq "min-height: 232px" "$STYLES" \
  && grep -Fq "flex: 0 0 232px" "$STYLES" \
  && pass "Standard plots have a measurable height" \
  || fail "Standard plot height is incomplete"

grep -Fq "min-height: 266px" "$STYLES" \
  && grep -Fq "flex: 0 0 266px" "$STYLES" \
  && pass "Tall plots have a measurable height" \
  || fail "Tall plot height is incomplete"

grep -Fq "min-height: 210px" "$STYLES" \
  && grep -Fq "min-height: 238px" "$STYLES" \
  && pass "Three-column plot heights are measurable" \
  || fail "Three-column plot heights are incomplete"

if python3 - <<'PY'
from pathlib import Path
import re

text = Path("components/demo/reports/reports-dashboard.module.css").read_text()
match = re.search(r"\.plot,\s*\n\.plotTall\s*\{([\s\S]*?)\n\}", text)
raise SystemExit(0 if match and "flex: 1" not in match.group(1) else 1)
PY
then
  pass "Plot hosts no longer use the collapsing flex: 1 rule"
else
  fail "Plot hosts still use flex: 1"
fi

grep -A5 -F ".takeawayBlock {" "$STYLES" \
  | grep -Fq 'var(--font-plus-jakarta-sans' \
  && pass "Key Takeaways uses Plus Jakarta Sans" \
  || fail "Key Takeaways font contract is missing"

grep -Fq "function MeasuredChart" "$COMPONENT" \
  && grep -Fq "ResizeObserver" "$COMPONENT" \
  && pass "Measured Recharts wrapper remains intact" \
  || fail "Measured Recharts wrapper is missing"

REQUIRED_RECHARTS=(
  "ComposedChart"
  "BarChart"
  "FunnelChart"
  "LineChart"
  "ScatterChart"
  "PieChart"
)

for CHART in "${REQUIRED_RECHARTS[@]}"; do
  grep -Fq "$CHART" "$COMPONENT" \
    && pass "Recharts component remains present: $CHART" \
    || fail "Missing Recharts component: $CHART"
done

bash -n scripts/verify-d29r17-reports-plot-height.sh
pass "Verifier syntax is valid"

printf "\nD29R-17 REPORTS PLOT HEIGHT VERIFICATION PASSED\n"
