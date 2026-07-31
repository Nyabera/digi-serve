#!/usr/bin/env bash
set -euo pipefail

ROOT="${FAIDIA_ROOT:-/Users/blaq/Downloads/faidia}"
COMPONENT="features/demo-engine/dashboards/officer/high-fidelity/OfficerDashboardHighFidelity.tsx"
CSS="features/demo-engine/dashboards/officer/high-fidelity/officer-dashboard-reference.css"
ROUTE="app/demo/officer/page.tsx"

cd "$ROOT"

fail() {
  printf 'FAIL: %s\n' "$1" >&2
  exit 1
}

for file in "$COMPONENT" "$CSS" "$ROUTE"; do
  [[ -s "$file" ]] || fail "Missing or empty file: $file"
done

grep -Fq "todayLabel?: string" "$COMPONENT" \
  || fail "Dynamic date prop is missing"

grep -Fq "This is what your day looks like today" "$COMPONENT" \
  || fail "Updated dashboard subtitle is missing"

grep -Fq "className=\"row-action\"" "$COMPONENT" \
  || fail "Action overflow layout is missing"

grep -Fq "MoreVertical" "$COMPONENT" \
  || fail "Action overflow icon is missing"

grep -Fq 'export const dynamic = "force-dynamic"' "$ROUTE" \
  || fail "Officer route is not request-time dynamic"

grep -Fq 'timeZone: "Africa/Nairobi"' "$ROUTE" \
  || fail "Officer route date does not use Nairobi time"

grep -Fq "D31-6R5B TABLE AND HEADER START" "$CSS" \
  || fail "D31-6R5B CSS block is missing"

grep -Fq "content: none !important" "$CSS" \
  || fail "The anonymous pseudo table cell is not disabled"

grep -Fq "box-shadow: inset 2px 0 0 var(--row-accent)" "$CSS" \
  || fail "The replacement row accent is missing"

grep -Fq "width: 16.5% !important" "$CSS" \
  || fail "Service-column width is missing"

grep -Fq "width: 9% !important" "$CSS" \
  || fail "Action-column width is missing"

grep -Fq "calc(2.5vw - 8px)" "$CSS" \
  || fail "The eight-pixel greeting reduction is missing"

git diff --check
printf 'PASS: D31-6R5B Officer table and header verification passed\n'
