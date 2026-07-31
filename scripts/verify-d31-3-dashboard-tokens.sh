#!/usr/bin/env bash
set -euo pipefail

ROOT="${FAIDIA_ROOT:-/Users/blaq/Downloads/faidia}"
EXPECTED_BRANCH="feat/demo-dashboard-redesign"
D31_DIR="docs/demo-engine-base/d31-dashboard-redesign"
SHARED_DIR="features/demo-engine/dashboards/shared"
CSS_FILE="$SHARED_DIR/dashboard-tokens.module.css"
TS_FILE="$SHARED_DIR/dashboard-theme.ts"

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
  "$CSS_FILE"
  "$TS_FILE"
  "$SHARED_DIR/dashboard-token-contract.ts"
  "$SHARED_DIR/index.ts"
  "$D31_DIR/DEMO-DASHBOARD-TOKEN-SPEC.md"
  "$D31_DIR/D31-3-CHECKLIST.md"
)

for file in "${required[@]}"; do
  [[ -s "$file" ]] || fail "Missing or empty file: $file"
done

pass "All D31-3 token files exist"

if grep -Eq '(^|[[:space:]])\:root[[:space:]]*\{' "$CSS_FILE"; then
  fail "Dashboard tokens must not mutate global :root"
fi

grep -Fq ".theme {" "$CSS_FILE" \
  || fail "Scoped dashboard theme class is missing"

for role in officer supervisor admin; do
  grep -Fq \
    ".theme[data-dashboard-role=\"$role\"]" \
    "$CSS_FILE" \
    || fail "Role-specific token scope is missing: $role"
done

pass "Dashboard tokens are locally scoped for all three roles"

required_tokens=(
  "--d31-dashboard-font-display"
  "--d31-dashboard-font-body"
  "--d31-dashboard-canvas"
  "--d31-dashboard-surface"
  "--d31-dashboard-text-strong"
  "--d31-dashboard-text-muted"
  "--d31-dashboard-border"
  "--d31-dashboard-primary"
  "--d31-dashboard-success"
  "--d31-dashboard-warning"
  "--d31-dashboard-danger"
  "--d31-dashboard-purple"
  "--d31-dashboard-teal"
  "--d31-dashboard-grid-gap"
  "--d31-dashboard-zone-gap"
  "--d31-dashboard-card-padding"
  "--d31-dashboard-page-max"
  "--d31-dashboard-title-size"
  "--d31-dashboard-kpi-size"
  "--d31-dashboard-table-row-height"
  "--d31-dashboard-touch-target"
)

for token in "${required_tokens[@]}"; do
  grep -Fq -- "$token" "$CSS_FILE" \
    || fail "Required CSS token is missing: $token"
done

pass "Required colour, typography, spacing and geometry tokens exist"

if grep -Eqi \
  '(^|[[:space:];])zoom[[:space:]]*:|transform[[:space:]]*:[[:space:]]*scale|background(-image)?[[:space:]]*:[^;]*url\(' \
  "$CSS_FILE"; then
  fail "Dashboard token CSS contains prohibited scaling or image backgrounds"
fi

pass "Token CSS contains no scaling or screenshot-background shortcuts"

grep -Fq "width: 1568" "$TS_FILE" \
  || fail "Officer width is missing"
grep -Fq "height: 1003" "$TS_FILE" \
  || fail "Officer height is missing"
grep -Fq "width: 864" "$TS_FILE" \
  || fail "Long-dashboard width is missing"
grep -Fq "height: 1821" "$TS_FILE" \
  || fail "Long-dashboard height is missing"
grep -Fq "columns: 12" "$TS_FILE" \
  || fail "12-column grid contract is missing"
grep -Fq "minimumTouchTarget: 44" "$TS_FILE" \
  || fail "44px touch-target contract is missing"

pass "Reference geometry and accessibility measurements are represented"

./scripts/verify-d31-2-shell-contracts.sh
pass "D31-2 shell contracts remain unchanged"

git diff --check
pass "Git whitespace validation passed"

printf '\nD31-3 dashboard-token verification passed.\n'
