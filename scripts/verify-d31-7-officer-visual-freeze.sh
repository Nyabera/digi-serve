#!/usr/bin/env bash
set -euo pipefail

ROOT="${FAIDIA_ROOT:-/Users/blaq/Downloads/faidia}"
EXPECTED_BRANCH="feat/demo-dashboard-redesign"

D31_DIR="docs/demo-engine-base/d31-dashboard-redesign"
BASELINE="$D31_DIR/officer-baselines/OFFICER-DASHBOARD-BASELINE.json"
CONTRACT="features/demo-engine/dashboards/officer/officer-dashboard.visual-contract.ts"
CONFIG="playwright.d31.config.ts"
SPEC="tests/visual/d31/officer-dashboard.pw.ts"
OLD_SPEC="tests/visual/d31/officer-dashboard.spec.ts"
REFERENCE="public/demo/references/dashboards/officer-dashboard.png"

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
  "$BASELINE"
  "$CONTRACT"
  "$CONFIG"
  "$SPEC"
  "$REFERENCE"
  "$D31_DIR/D31-OFFICER-VISUAL-FREEZE.md"
  "$D31_DIR/D31-7-CHECKLIST.md"
  "$D31_DIR/visual-overlays/officer-reference-overlay.png"
  "$D31_DIR/visual-overlays/officer-implementation-reference.png"
)

for file in "${required[@]}"; do
  [[ -s "$file" ]] || fail "Missing D31-7 file: $file"
done

[[ ! -e "$OLD_SPEC" ]] \
  || fail "Vitest-discoverable Playwright spec still exists"

grep -Fq 'testMatch: "**/*.pw.ts"' "$CONFIG" \
  || fail "Playwright is not isolated to .pw.ts files"

if grep -Fq "reducedMotion" "$CONFIG"; then
  fail "Unsupported reducedMotion remains in Playwright config"
fi

grep -Fq "officer-dashboard.pw.ts" package.json \
  || fail "Package scripts do not use the isolated Playwright filename"

grep -Fq 'page.getByRole("status")' "$SPEC" \
  || fail "Status-feedback assertion is missing"

if grep -Fq '.my-rhythm-card svg' "$SPEC"; then
  fail "Stale My Rhythm SVG assertion remains"
fi

grep -Fq '.rhythm-card .rhythm-chart' "$SPEC" \
  || fail "Rhythm chart assertion is missing"

grep -Fq '.rhythm-card .sla-ring' "$SPEC" \
  || fail "SLA ring assertion is missing"

snapshot_count="$(
  find tests/visual/d31/__screenshots__ \
    -maxdepth 1 \
    -type f \
    -name '*.png' |
  wc -l |
  tr -d ' '
)"

[[ "$snapshot_count" -ge 5 ]] \
  || fail "Expected at least five visual baselines"

python3 - "$BASELINE" <<'PY'
from pathlib import Path
import hashlib
import json
import sys

baseline = json.loads(
    Path(sys.argv[1]).read_text(encoding="utf-8")
)

isolation = baseline.get("testRunnerIsolation", {})

if isolation.get("playwrightPattern") != "**/*.pw.ts":
    raise SystemExit(
        "FAIL: Incorrect Playwright isolation pattern."
    )

if isolation.get("vitestPatternCollision") is not False:
    raise SystemExit(
        "FAIL: Vitest collision is not recorded as resolved."
    )

for record in baseline.get("files", []):
    path = Path(record["path"])

    if not path.is_file():
        raise SystemExit(
            f"FAIL: Frozen file is missing: {path}"
        )

    current = hashlib.sha256(path.read_bytes()).hexdigest()

    if current != record["sha256"]:
        raise SystemExit(
            f"FAIL: Frozen Officer file changed: {path}"
        )

print("PASS: Officer visual-freeze hashes match")
PY

./scripts/verify-d31-2-shell-contracts.sh
git diff --check

pass "D31-7 isolated visual freeze verification passed"
