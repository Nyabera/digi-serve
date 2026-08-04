#!/usr/bin/env bash
set -euo pipefail

EXPECTED_ROOT="${FAIDIA_ROOT:-/Users/blaq/Downloads/faidia}"

pass() {
  printf "PASS: %s\n" "$1"
}

fail() {
  printf "FAIL: %s\n" "$1" >&2
  exit 1
}

[[ "$(pwd)" == "$EXPECTED_ROOT" ]] \
  && pass "Current directory is correct" \
  || fail "Run this verifier from $EXPECTED_ROOT"

REQUIRED_FILES=(
  "features/officer-dashboard/components/overview-metric-strip.tsx"
  "features/officer-dashboard/components/sla-workload-donut.tsx"
  "features/officer-dashboard/components/officer-dashboard-body.tsx"
  "features/officer-dashboard/components/officer-dashboard-body.module.css"
  "features/demo-engine/fixtures/officer-dashboard.reference.ts"
)

for FILE in "${REQUIRED_FILES[@]}"; do
  [[ -f "$FILE" ]] \
    && pass "File exists: $FILE" \
    || fail "Missing file: $FILE"
done

grep -Fq 'data-d29r23d-overview-strip="true"' \
  features/officer-dashboard/components/overview-metric-strip.tsx \
  && pass "Modern overview-strip marker exists" \
  || fail "Modern overview-strip marker is missing"

grep -Fq 'data-d29r23d-two-level-donut="true"' \
  features/officer-dashboard/components/sla-workload-donut.tsx \
  && pass "Two-level SLA donut marker exists" \
  || fail "Two-level SLA donut marker is missing"

PIE_COUNT="$(
  grep -c '<Pie' \
    features/officer-dashboard/components/sla-workload-donut.tsx \
    || true
)"
[[ "$PIE_COUNT" -ge 2 ]] \
  && pass "Two Recharts pie layers exist" \
  || fail "Expected at least two Recharts Pie layers"

grep -Fq '<OverviewMetricStrip metrics={model.metrics} />' \
  features/officer-dashboard/components/officer-dashboard-body.tsx \
  && pass "Officer dashboard renders the modern overview strip" \
  || fail "Officer dashboard does not render the modern overview strip"

grep -Fq '<SlaWorkloadDonut data={sla} />' \
  features/officer-dashboard/components/officer-dashboard-body.tsx \
  && pass "Officer dashboard renders the two-level SLA donut" \
  || fail "Officer dashboard does not render the two-level SLA donut"

grep -Fq 'grid-template-columns: minmax(230px, 1.45fr) repeat(5, minmax(130px, 1fr));' \
  features/officer-dashboard/components/officer-dashboard-body.module.css \
  && pass "Desktop overview-strip grid contract exists" \
  || fail "Desktop overview-strip grid contract is missing"

grep -Fq 'grid-template-columns: minmax(150px, 0.78fr) minmax(190px, 1.08fr) minmax(150px, 0.82fr);' \
  features/officer-dashboard/components/officer-dashboard-body.module.css \
  && pass "Aligned SLA/workload grid contract exists" \
  || fail "Aligned SLA/workload grid contract is missing"

grep -Fq 'min-height: 138px' \
  features/officer-dashboard/components/officer-dashboard-body.module.css \
  && pass "Overview-strip targets exceed the 44px minimum" \
  || fail "Overview-strip interactive target sizing is missing"

BREAKPOINT_COUNT="$(
  grep -Ec '@media[[:space:]]*[(]max-width:' \
    features/officer-dashboard/components/officer-dashboard-body.module.css \
    || true
)"
[[ "$BREAKPOINT_COUNT" -ge 2 ]] \
  && pass "At least two responsive breakpoints exist" \
  || fail "Expected at least two responsive breakpoints"

if grep -Fq '👋' \
  features/demo-engine/fixtures/officer-dashboard.reference.ts; then
  fail "The Officer greeting still contains the wave emoji"
else
  pass "Officer greeting contains no wave emoji"
fi

grep -Fq 'detailedReportHref: "/demo/officer/sla-monitor"' \
  features/demo-engine/fixtures/officer-dashboard.reference.ts \
  && pass "Detailed SLA report points to the functional Officer SLA page" \
  || fail "Detailed SLA report link was not updated"

if grep -R -nE \
  'createClient[(]|supabase[.]|axios[.]|fetch[[:space:]]*[(]|XMLHttpRequest|new[[:space:]]+WebSocket' \
  features/officer-dashboard/components/overview-metric-strip.tsx \
  features/officer-dashboard/components/sla-workload-donut.tsx; then
  fail "D29R-23D must not add network access"
else
  pass "D29R-23D adds no network access"
fi

git diff --check
pass "Git diff contains no whitespace errors"

printf "\nD29R-23D focused verification passed.\n"
