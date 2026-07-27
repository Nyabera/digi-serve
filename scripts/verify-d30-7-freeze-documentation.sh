#!/usr/bin/env bash
set -euo pipefail

ROOT="${FAIDIA_ROOT:-/Users/blaq/Downloads/faidia}"
EXPECTED_BRANCH="feat/demo-engine-base"
D30_DIR="docs/demo-engine-base/d30-freeze"

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
  "$D30_DIR/D30-DEMO-FREEZE.md"
  "$D30_DIR/DEMO-ENGINE-INVENTORY.md"
  "$D30_DIR/DEMO-ACCEPTANCE-CHECKLIST.md"
  "$D30_DIR/DEMO-ROUTE-FILES.txt"
  "$D30_DIR/DEMO-LAYOUT-FILES.txt"
  "$D30_DIR/DEMO-ROLE-ACCESS-MATRIX.md"
  "$D30_DIR/DEMO-DATA-MAP.md"
  "$D30_DIR/DEMO-RESET-BEHAVIOUR.md"
  "$D30_DIR/DEMO-KNOWN-LIMITATIONS.md"
  "$D30_DIR/DEMO-PRESENTATION-SCRIPT.md"
  "$D30_DIR/DEMO-ENVIRONMENT.txt"
  "$D30_DIR/D30-7-CHECKLIST.md"
  "$D30_DIR/screenshots/tvet/.gitkeep"
)

for file in "${required[@]}"; do
  [[ -e "$file" ]] || fail "Missing required file: $file"
done

pass "Required freeze documentation exists"

grep -Fq "Frozen engine scope" \
  "$D30_DIR/D30-DEMO-FREEZE.md" \
  || fail "Main freeze scope is missing"

grep -Fq "Post-freeze" \
  "$D30_DIR/D30-DEMO-FREEZE.md" \
  || fail "Post-freeze policy is missing"

pass "Main freeze document is complete"

[[ "$(grep -Ec '^/demo' "$D30_DIR/DEMO-ROUTE-FILES.txt" || true)" -gt 0 ]] \
  || fail "Route inventory is empty"

[[ "$(grep -Ec 'layout\.tsx$' "$D30_DIR/DEMO-LAYOUT-FILES.txt" || true)" -gt 0 ]] \
  || fail "Layout inventory is empty"

pass "Route and layout inventories contain data"

grep -Fq "email sharing works in Demo mode" \
  "$D30_DIR/DEMO-ACCEPTANCE-CHECKLIST.md" \
  || fail "Referral acceptance coverage is missing"

grep -Fq "personal SLA charts render" \
  "$D30_DIR/DEMO-ACCEPTANCE-CHECKLIST.md" \
  || fail "Officer SLA coverage is missing"

grep -Fq "/demo/admin" \
  "$D30_DIR/DEMO-ACCEPTANCE-CHECKLIST.md" \
  || fail "Admin acceptance coverage is missing"

pass "Critical acceptance coverage exists"

grep -Fq "browser-seeded" \
  "$D30_DIR/DEMO-KNOWN-LIMITATIONS.md" \
  || fail "Browser-state limitation is missing"

grep -Fq "Applicant" \
  "$D30_DIR/DEMO-ROLE-ACCESS-MATRIX.md" \
  || fail "Role matrix is incomplete"

pass "Limitations and role matrix are documented"

git diff --check
pass "Git whitespace validation passed"

printf '\nD30-7 freeze-documentation verification passed.\n'
