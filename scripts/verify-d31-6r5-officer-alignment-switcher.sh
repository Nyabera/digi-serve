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
  || fail "Officer route is not rendering the embedded D31-6R5 body"

grep -Fq 'data-dashboard-version="spacious-v3.1"' "$COMPONENT" \
  || fail "The supplied spacious-v3.1 component is not installed"

grep -Fq "d31-officer-reference officer-dashboard" "$COMPONENT" \
  || fail "The scoped Officer root is missing"

python3 - "$COMPONENT" <<'PY'
from pathlib import Path
import sys

component = Path(sys.argv[1]).read_text(encoding="utf-8")

required_literals = [
    "Good afternoon, Grace",
    "Workload pulse",
    "Case signals",
    "Recent handoffs",
    "Recent Activity",
    "Up Next",
    "Action Required",
    "My rhythm",
]

for literal in required_literals:
    if literal not in component:
        raise SystemExit(
            f"FAIL: Restored dashboard region is missing: {literal}"
        )

work_plan_variants = (
    "Today's work plan",
    "Today&apos;s work plan",
    "Today’s work plan",
)

if not any(value in component for value in work_plan_variants):
    raise SystemExit(
        "FAIL: Restored dashboard region is missing: Today's work plan"
    )

print("PASS: All restored dashboard regions are present")
PY

grep -Fq "<colgroup>" "$COMPONENT" \
  || fail "The semantic work-plan colgroup is missing"

for column in \
  col-service \
  col-applicant \
  col-request \
  col-next-action \
  col-stage \
  col-sla \
  col-status \
  col-action; do
  grep -Fq "className=\"$column\"" "$COMPONENT" \
    || fail "Missing work-plan column: $column"
done

grep -Fq '<td data-label="Service">' "$COMPONENT" \
  || fail "Service is no longer a native table cell"

grep -Fq 'className="service-cell"' "$COMPONENT" \
  || fail "The inner Service-cell grid is missing"

grep -Fq "planTabIcons" "$COMPONENT" \
  || fail "The three-part icon switcher is missing"

grep -Fq 'className="plan-tab-icon"' "$COMPONENT" \
  || fail "Switcher icons are missing"

for token in \
  "grid-template-columns: minmax(0, 1.96fr) minmax(410px, 0.96fr);" \
  "grid-template-columns: repeat(3, minmax(0, 1fr));" \
  "background: linear-gradient(135deg, #0a68f2 0%, #0757d8 100%);" \
  "grid-template-columns: 58px 31px minmax(0, 1fr);" \
  "width: 98px;" \
  "height: 32px;" \
  "@container officer-dashboard (max-width: 1120px)" \
  "@container officer-dashboard (max-width: 760px)"; do
  grep -Fq "$token" "$CSS" \
    || fail "Missing D31-6R5 CSS contract: $token"
done

grep -Fq ".d31-officer-reference.officer-dashboard" "$CSS" \
  || fail "Root Officer selectors are not locally scoped"

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

    if re.match(
        r"^(?::root|html|body|button|select|\.card|\.dashboard-frame)\b",
        stripped,
    ):
        raise SystemExit(
            f"FAIL: Unscoped selector at line {line_number}: {stripped}"
        )

print("PASS: Dashboard CSS remains locally scoped")
PY

if grep -Fq 'data-dashboard-version="command-center-v4"' "$COMPONENT"; then
  fail "The rejected command-center v4 component is still installed"
fi

pass "D31-6R5 Officer alignment and switcher verification passed"

git diff --check
pass "Git whitespace validation passed"
