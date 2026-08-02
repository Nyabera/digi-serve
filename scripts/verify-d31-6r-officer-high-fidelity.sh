#!/usr/bin/env bash
set -euo pipefail

ROOT="${FAIDIA_ROOT:-/Users/blaq/Downloads/faidia}"
EXPECTED_BRANCH="feat/demo-dashboard-redesign"
HF_DIR="features/demo-engine/dashboards/officer/high-fidelity"
CSS="$HF_DIR/officer-dashboard-reference.css"
COMPONENT="$HF_DIR/OfficerDashboardHighFidelity.tsx"
PAGE="app/demo/officer/page.tsx"

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

for file in \
  "$CSS" \
  "$COMPONENT" \
  "$HF_DIR/index.ts" \
  "$PAGE" \
  docs/demo-engine-base/d31-dashboard-redesign/D31-6-HIGH-FIDELITY-CORRECTION.md \
  docs/demo-engine-base/d31-dashboard-redesign/D31-6R-CHECKLIST.md; do
  [[ -s "$file" ]] || fail "Missing or empty file: $file"
done

pass "High-fidelity Officer dashboard files exist"

grep -Fq 'officer-dashboard d31-officer-reference' "$COMPONENT" \
  || fail "High-fidelity root scope is missing"

grep -Fq 'OfficerDashboardHighFidelity' "$PAGE" \
  || fail "Officer route does not render the high-fidelity component"

grep -Fq 'officer-dashboard-reference.css' "$PAGE" \
  || fail "Officer route does not import the high-fidelity stylesheet"

pass "Officer route is wired to the canonical bundle implementation"

if grep -Eq '^[[:space:]]*:root[[:space:]]*\{' "$CSS"; then
  fail "High-fidelity CSS mutates global :root"
fi

if grep -Eq '^[[:space:]]*(html|body)[[:space:]]*\{' "$CSS"; then
  fail "High-fidelity CSS contains an unscoped HTML or body rule"
fi

if grep -Eq '^[[:space:]]*\.card([[:space:]:,{]|$)' "$CSS"; then
  fail "High-fidelity CSS contains an unscoped card selector"
fi

grep -Fq '.d31-officer-reference' "$CSS" \
  || fail "High-fidelity CSS scope is missing"

pass "Bundle CSS is isolated from the shared role shell"

required_geometry=(
  'grid-template-columns: minmax(0, 1.735fr) minmax(430px, 1fr)'
  'height: 145px'
  'height: 443px'
  'height: 422px'
  'height: 168px'
  'height: 267px'
  'grid-template-columns: 1.2fr 1.17fr 0.99fr 1.5fr'
  'max-width: 1740px'
)

for token in "${required_geometry[@]}"; do
  grep -Fq "$token" "$CSS" \
    || fail "Reference geometry token is missing: $token"
done

pass "Reference card heights, grids and page width are preserved"

for content in \
  'Good afternoon, Grace' \
  'Today&apos;s work plan' \
  'Case signals' \
  'Recent handoffs' \
  'Recent Activity' \
  'Up Next' \
  'Action Required' \
  'My rhythm' \
  '92%'; do
  grep -Fq "$content" "$COMPONENT" \
    || fail "Reference content is missing: $content"
done

pass "Reference information hierarchy remains intact"

if grep -RniE \
  'RoleWorkspaceShell|InternalAppShell|OperationalWorkspaceShell|AdminWorkspaceShell' \
  "$HF_DIR" \
  --include='*.ts' \
  --include='*.tsx' \
  2>/dev/null | grep -q .; then
  fail "High-fidelity body incorrectly owns a role shell"
fi

pass "Officer body remains shell-neutral"

node -e 'require.resolve("lucide-react")' \
  || fail "lucide-react is not installed"

./scripts/verify-d31-2-shell-contracts.sh
./scripts/verify-d31-3-dashboard-tokens.sh
./scripts/verify-d31-4-dashboard-primitives.sh
./scripts/verify-d31-5-dashboard-data.sh

git diff --check
pass "D31-6R high-fidelity verification passed"
