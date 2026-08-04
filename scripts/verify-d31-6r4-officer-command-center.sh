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
  || fail "Officer route is not rendering the embedded v4 body"

grep -Fq 'data-dashboard-version="command-center-v4"' "$COMPONENT" \
  || fail "The supplied command-center v4 component is not installed"

grep -Fq "d31-officer-reference officer-dashboard" "$COMPONENT" \
  || fail "The locally identifiable Officer root is missing"

grep -Fq "<colgroup>" "$COMPONENT" \
  || fail "The stable eight-column colgroup is missing"

for column in \
  col-service \
  col-applicant \
  col-request \
  col-next \
  col-stage \
  col-sla \
  col-status \
  col-action; do
  grep -Fq "className=\"$column\"" "$COMPONENT" \
    || fail "Missing table column: $column"
done

if grep -Fq "Good afternoon" "$COMPONENT"; then
  fail "The body still duplicates the shell greeting"
fi

if grep -Fq "Workload pulse" "$COMPONENT"; then
  fail "The body still duplicates the workload summary"
fi

grep -Fq "grid-template-columns: minmax(0, 1.94fr) minmax(420px, 1fr);" "$CSS" \
  || fail "The v4 top-grid geometry is missing"

grep -Fq "grid-template-columns: 1.13fr 1fr 0.9fr 1.48fr;" "$CSS" \
  || fail "The v4 lower-card proportions are missing"

grep -Fq "grid-template-columns: 61px 32px minmax(0, 1fr);" "$CSS" \
  || fail "Recent Activity alignment is missing"

grep -Fq ".officer-dashboard .work-table .col-service { width: 16%; }" "$CSS" \
  || fail "Service-column width is missing"

grep -Fq ".officer-dashboard .work-table .col-action { width: 8.5%; }" "$CSS" \
  || fail "Action-column width is missing"

grep -Fq "height: 74px;" "$CSS" \
  || fail "The v4 work-row rhythm is missing"

grep -Fq ".officer-dashboard .period-select" "$CSS" \
  || fail "The period selector block is missing"

grep -Fq "width: 102px;" "$CSS" \
  || fail "The 102px period-selector width is missing"

grep -Fq "height: 36px;" "$CSS" \
  || fail "The 36px period-selector height is missing"

grep -Fq "@container officer-dashboard (max-width: 1080px)" "$CSS" \
  || fail "The shell-width stacking breakpoint is missing"

grep -Fq "@container officer-dashboard (max-width: 760px)" "$CSS" \
  || fail "The compact table-scrolling breakpoint is missing"

python3 - "$CSS" <<'PY'
from pathlib import Path
import re
import sys

css = Path(sys.argv[1]).read_text(encoding="utf-8")
css = re.sub(r"/\*.*?\*/", "", css, flags=re.S)

for line_number, line in enumerate(css.splitlines(), start=1):
    stripped = line.strip()

    if not stripped or stripped.startswith("@"):
        continue

    if re.match(r"^(?::root|html|body|button|select|\*)\b", stripped):
        raise SystemExit(
            f"FAIL: Unscoped selector at line {line_number}: {stripped}"
        )

print("PASS: No unscoped root or control selector remains")
PY

pass "D31-6R4 Officer command-center verification passed"

git diff --check
pass "Git whitespace validation passed"
