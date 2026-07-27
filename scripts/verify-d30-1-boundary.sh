#!/usr/bin/env bash
set -euo pipefail

ROOT="${FAIDIA_ROOT:-/Users/blaq/Downloads/faidia}"
EXPECTED_BRANCH="feat/demo-engine-base"
FREEZE_DIR="docs/demo-engine-base/d30-freeze"

cd "$ROOT"

fail() {
  printf "FAIL: %s\n" "$1" >&2
  exit 1
}

pass() {
  printf "PASS: %s\n" "$1"
}

[[ "$(git branch --show-current)" == "$EXPECTED_BRANCH" ]] \
  || fail "Expected branch $EXPECTED_BRANCH"

pass "Correct branch"

required_files=(
  "$FREEZE_DIR/DEMO-ENGINE-BOUNDARY.md"
  "$FREEZE_DIR/DEMO-BOUNDARY-EXCEPTIONS.md"
  "$FREEZE_DIR/D30-1-CHECKLIST.md"
  "$FREEZE_DIR/CURRENT-DEMO-ROUTES-AND-LAYOUTS.txt"
  "$FREEZE_DIR/CURRENT-DEMO-COMPONENTS.txt"
  "$FREEZE_DIR/CURRENT-TVET-REFERENCES.txt"
)

for file in "${required_files[@]}"; do
  [[ -s "$file" ]] || fail "Missing or empty file: $file"
done

pass "All D30-1 documents and inventories exist"

grep -Fq "# 2. Demo Engine responsibilities" \
  "$FREEZE_DIR/DEMO-ENGINE-BOUNDARY.md" \
  || fail "Demo Engine responsibilities are missing"

pass "Demo Engine responsibilities are documented"

grep -Fq "# 3. Demo Pack responsibilities" \
  "$FREEZE_DIR/DEMO-ENGINE-BOUNDARY.md" \
  || fail "Demo Pack responsibilities are missing"

pass "Demo Pack responsibilities are documented"

grep -Fq "# 4. Allowed dependency direction" \
  "$FREEZE_DIR/DEMO-ENGINE-BOUNDARY.md" \
  || fail "Dependency rules are missing"

pass "Dependency direction is documented"

grep -Fq "# 5. Boundary decision test" \
  "$FREEZE_DIR/DEMO-ENGINE-BOUNDARY.md" \
  || fail "Boundary decision test is missing"

pass "Boundary decision test is documented"

grep -Fq "Confirmed current exceptions" \
  "$FREEZE_DIR/DEMO-BOUNDARY-EXCEPTIONS.md" \
  || fail "Confirmed boundary exceptions are missing"

pass "Boundary exceptions are recorded"

grep -Fq "Savannah" \
  "$FREEZE_DIR/CURRENT-TVET-REFERENCES.txt" \
  || printf "NOTE: No Savannah reference was found in the generated inventory.\n"

route_count="$(
  grep -Ec '/(page|layout|loading|error|not-found)\.tsx$' \
    "$FREEZE_DIR/CURRENT-DEMO-ROUTES-AND-LAYOUTS.txt" \
    || true
)"

[[ "$route_count" -gt 0 ]] \
  || fail "No Demo routes or layouts were recorded"

pass "Demo route inventory contains $route_count entries"

component_count="$(
  grep -Ec '\.(ts|tsx|css)$' \
    "$FREEZE_DIR/CURRENT-DEMO-COMPONENTS.txt" \
    || true
)"

[[ "$component_count" -gt 0 ]] \
  || fail "No Demo components were recorded"

pass "Demo component inventory contains $component_count entries"

git diff --check

pass "Git whitespace validation passed"

printf "\nD30-1 boundary verification passed.\n"
