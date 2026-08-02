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

pass() {
  printf 'PASS: %s\n' "$1"
}

for file in "$COMPONENT" "$CSS" "$ROUTE"; do
  [[ -s "$file" ]] || fail "Missing or empty file: $file"
done

grep -Fq "D31-6R5A PARITY FIX START" "$CSS" \
  || fail "D31-6R5A CSS correction is missing"

grep -Fq "min-width: 900px !important" "$CSS" \
  || fail "The protected work-table minimum is missing"

grep -Fq "display: table-cell !important" "$CSS" \
  || fail "Native table-cell restoration is missing"

grep -Fq "word-break: keep-all !important" "$CSS" \
  || fail "Service-name collapse protection is missing"

grep -Fq "grid-template-rows: 422px 168px !important" "$CSS" \
  || fail "The compact Case Signals / Handoffs stack is missing"

grep -Fq "height: 41px !important" "$CSS" \
  || fail "Compact handoff rows are missing"

grep -Fq "Hello, I uploaded the requested documents" "$COMPONENT" \
  || fail "The approved first Case Signals message is missing"

grep -Fq "OfficerDashboardHighFidelity embedded" "$ROUTE" \
  || fail "Officer route no longer renders the embedded dashboard"

python3 - "$CSS" <<'PY'
from pathlib import Path
import re
import sys

css = Path(sys.argv[1]).read_text(encoding="utf-8")
match = re.search(
    r"/\* D31-6R5A PARITY FIX START \*/(.*?)/\* D31-6R5A PARITY FIX END \*/",
    css,
    flags=re.S,
)

if not match:
    raise SystemExit("FAIL: Could not parse the D31-6R5A override block")

block = match.group(1)

for selector in ("button {", "select {", "body {", "html {", ":root {"):
    for line in block.splitlines():
        if line.strip().startswith(selector):
            raise SystemExit(
                f"FAIL: Unscoped selector in D31-6R5A block: {line.strip()}"
            )

print("PASS: D31-6R5A override remains locally scoped")
PY

git diff --check
pass "D31-6R5A Officer parity verification passed"
