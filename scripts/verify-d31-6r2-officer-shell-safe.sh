#!/usr/bin/env bash
set -euo pipefail

ROOT="${FAIDIA_ROOT:-/Users/blaq/Downloads/faidia}"
EXPECTED_BRANCH="feat/demo-dashboard-redesign"
HF_DIR="features/demo-engine/dashboards/officer/high-fidelity"
COMPONENT="$HF_DIR/OfficerDashboardHighFidelity.tsx"
CSS="$HF_DIR/officer-dashboard-reference.css"
PAGE="app/demo/officer/page.tsx"
DOC_DIR="docs/demo-engine-base/d31-dashboard-redesign"

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
  "$COMPONENT"
  "$CSS"
  "$HF_DIR/index.ts"
  "$PAGE"
  "$DOC_DIR/D31-6R2-SHELL-SAFE-CUTOFF-CORRECTION.md"
  "$DOC_DIR/D31-6R2-CHECKLIST.md"
)

for file in "${required[@]}"; do
  [[ -s "$file" ]] || fail "Missing or empty file: $file"
done

pass "D31-6R2 files exist"

grep -Fq 'd31-officer-reference officer-dashboard--' "$COMPONENT" \
  || fail "Officer component does not carry the local CSS scope"

grep -Fq 'embedded = true' "$COMPONENT" \
  || fail "Officer component does not default to embedded mode"

grep -Fq '<OfficerDashboardHighFidelity embedded />' "$PAGE" \
  || fail "Officer route does not explicitly render embedded mode"

grep -Fq 'officer-dashboard-reference.css' "$PAGE" \
  || fail "Officer route does not import the corrected stylesheet"

pass "Officer route renders the corrected embedded component"

grep -Fq '.d31-officer-reference.officer-dashboard' "$CSS" \
  || fail "Scoped dashboard root is missing"

grep -Fq 'container-type: inline-size' "$CSS" \
  || fail "Dashboard inline-size container is missing"

grep -Fq '@container officer-dashboard (max-width: 1320px)' "$CSS" \
  || fail "1320px shell container breakpoint is missing"

grep -Fq '@container officer-dashboard (max-width: 1120px)' "$CSS" \
  || fail "1120px shell container breakpoint is missing"

grep -Fq '@container officer-dashboard (max-width: 760px)' "$CSS" \
  || fail "760px compact container breakpoint is missing"

pass "Container-aware shell breakpoints exist"

for token in \
  'min-height: 145px' \
  'min-height: 443px' \
  'min-height: 422px' \
  'min-height: 168px' \
  'min-height: 267px' \
  'width: min(620px, 100%)' \
  'grid-template-columns: repeat(4, minmax(0, 1fr)) max-content' \
  'margin: auto auto 0'; do
  grep -Fq "$token" "$CSS" \
    || fail "Corrected shell-safe token is missing: $token"
done

if grep -Fq 'min-width: 900px' "$CSS"; then
  fail "Legacy 900px work-table minimum still exists"
fi

pass "Known clipping rules are corrected"

if grep -Eq '^[[:space:]]*:root[[:space:]]*\{' "$CSS"; then
  fail "Corrected stylesheet mutates global :root"
fi

if grep -Eq '^[[:space:]]*(html|body)[[:space:]]*\{' "$CSS"; then
  fail "Corrected stylesheet contains an unscoped html/body rule"
fi

if grep -Eq '^[[:space:]]*\.card([[:space:]:,.{]|$)' "$CSS"; then
  fail "Corrected stylesheet contains an unscoped .card selector"
fi

if grep -Eq '^[[:space:]]*(button|select)([[:space:]:,.{]|$)' "$CSS"; then
  fail "Corrected stylesheet contains an unscoped control selector"
fi

pass "Corrected CSS is isolated from the shared shell"

if grep -RniE \
  'RoleWorkspaceShell|InternalAppShell|OperationalWorkspaceShell|AdminWorkspaceShell' \
  "$HF_DIR" \
  --include='*.ts' \
  --include='*.tsx' \
  2>/dev/null | grep -q .; then
  fail "Officer body incorrectly owns a shell"
fi

pass "Officer body remains shell-neutral"

node -e 'require.resolve("lucide-react")' \
  || fail "lucide-react is not installed"

node -e 'require.resolve("@fontsource-variable/plus-jakarta-sans")' \
  || fail "Plus Jakarta Sans variable package is not installed"

./scripts/verify-d31-2-shell-contracts.sh
./scripts/verify-d31-3-dashboard-tokens.sh
./scripts/verify-d31-4-dashboard-primitives.sh
./scripts/verify-d31-5-dashboard-data.sh

git diff --check
pass "D31-6R2 Officer shell-safe verification passed"
