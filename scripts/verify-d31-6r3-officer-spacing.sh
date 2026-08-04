#!/usr/bin/env bash
set -euo pipefail

ROOT="${FAIDIA_ROOT:-/Users/blaq/Downloads/faidia}"
EXPECTED_BRANCH="feat/demo-dashboard-redesign"
TARGET_DIR="features/demo-engine/dashboards/officer/high-fidelity"
COMPONENT="$TARGET_DIR/OfficerDashboardHighFidelity.tsx"
CSS="$TARGET_DIR/officer-dashboard-reference.css"
ROUTE="app/demo/officer/page.tsx"

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

for file in "$COMPONENT" "$CSS" "$ROUTE"; do
  [[ -s "$file" ]] || fail "Missing or empty file: $file"
done

grep -Fq "OfficerDashboardHighFidelity embedded" "$ROUTE" \
  || fail "Officer route is not rendering embedded high-fidelity dashboard"

grep -Fq 'data-dashboard-version="spacious-v3"' "$COMPONENT" \
  || fail "The supplied v3 Officer component is not installed"

grep -Fq "d31-officer-reference officer-dashboard" "$COMPONENT" \
  || fail "The Officer component does not expose the scoped root"

grep -Fq "grid-template-columns: minmax(0, 1.96fr) minmax(410px, 0.96fr)" "$CSS" \
  || fail "The wider desktop top-grid allocation is missing"

for token in \
  "th:nth-child(1) { width: 18.5%" \
  "th:nth-child(3) { width: 12.5%" \
  "th:nth-child(4) { width: 21%" \
  "th:nth-child(6) { width: 10%" \
  "th:nth-child(7) { width: 9%" \
  "th:nth-child(8) { width: 7%"; do
  grep -Fq "$token" "$CSS" \
    || fail "Missing work-plan column allocation: $token"
done

grep -Fq "height: 58px" "$CSS" \
  || fail "58px work-plan rows are missing"

grep -Fq "width: calc(100% + 28px)" "$CSS" \
  || fail "The desktop dashboard-frame bleed is missing"

grep -Fq "@container officer-dashboard (max-width: 1120px)" "$CSS" \
  || fail "The shell-safe stacking breakpoint is missing"

grep -Fq "@container officer-dashboard (max-width: 760px)" "$CSS" \
  || fail "The compact scrolling breakpoint is missing"

if grep -Eq '(^|[[:space:]])(:root|html|body)[[:space:]]*\{' "$CSS"; then
  fail "Unscoped root, html, or body selector remains"
fi

if grep -Eq '^[[:space:]]*button[[:space:]]*\{' "$CSS"; then
  fail "Unscoped bare button selector remains"
fi

if grep -Eq '100vh' "$CSS" | grep -v "standalone"; then
  fail "Embedded dashboard still contains an unsafe viewport-height rule"
fi

pass "D31-6R3 Officer spacing and scoping checks passed"

git diff --check
pass "Git whitespace validation passed"
