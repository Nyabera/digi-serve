#!/usr/bin/env bash
set -euo pipefail

ROOT="${FAIDIA_ROOT:-/Users/blaq/Downloads/faidia}"
EXPECTED_BRANCH="feat/demo-dashboard-redesign"

D31_DIR="docs/demo-engine-base/d31-dashboard-redesign"
SPEC="tests/visual/d31/cross-role-dashboard-regression.pw.ts"
DOC="$D31_DIR/D31-CROSS-ROLE-REGRESSION-AND-FREEZE.md"
SUMMARY="$D31_DIR/D31-FREEZE-SUMMARY.md"
RESULTS="$D31_DIR/D31-12-REGRESSION-RESULTS.json"
FREEZE="$D31_DIR/d31-freeze/D31-DASHBOARD-FREEZE.json"

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
  "$SPEC"
  "$DOC"
  "$SUMMARY"
  "$RESULTS"
  "$FREEZE"
  "scripts/verify-d31-7-officer-visual-freeze.sh"
  "scripts/verify-d31-9-supervisor-visual-freeze.sh"
  "scripts/verify-d31-11-admin-visual-freeze.sh"
)

for file in "${required[@]}"; do
  [[ -s "$file" ]] || fail "Missing D31-12 file: $file"
done

[[ ! -e tests/visual/d31/cross-role-dashboard-regression.spec.ts ]] \
  || fail "Vitest-discoverable cross-role Playwright test exists"

grep -Fq 'test.describe.configure({' "$SPEC" \
  || fail "Cross-role Playwright suite is not configured serially"

grep -Fq 'mode: "serial"' "$SPEC" \
  || fail "Cross-role Playwright suite is not serial"

grep -Fq \
  "const dashboardSelectors" \
  "$SPEC" \
  || fail "Cross-role selector map is missing"

grep -Fq \
  ".officer-dashboard" \
  "$SPEC" \
  || fail "Officer dashboard selector fallback is missing"

grep -Fq \
  'dashboardSelectors[role]' \
  "$SPEC" \
  || fail "Cross-role suite does not use the selector map"

python3 - "$RESULTS" <<'PY'
from pathlib import Path
import json
import sys

results = json.loads(
    Path(sys.argv[1]).read_text(
        encoding="utf-8"
    )
)

if results.get("stage") != "D31-12":
    raise SystemExit(
        "FAIL: Incorrect regression-results stage."
    )

required = [
    "shellContract",
    "officerFreeze",
    "supervisorFreeze",
    "adminFreeze",
    "officerVisual",
    "supervisorVisual",
    "adminVisual",
    "crossRoleVisual",
    "demoPackValidation",
    "typeScript",
    "lint",
    "vitest",
    "productionBuild",
    "gitWhitespace",
]

checks = results.get("checks", {})

failed = [
    name
    for name in required
    if checks.get(name) != "passed"
]

if failed:
    raise SystemExit(
        "FAIL: Regression result is incomplete: "
        + ", ".join(failed)
    )

print("PASS: D31-12 regression-results record is complete")
PY

python3 - "$FREEZE" <<'PY'
from pathlib import Path
import hashlib
import json
import sys

freeze = json.loads(
    Path(sys.argv[1]).read_text(
        encoding="utf-8"
    )
)

if freeze.get("stage") != "D31-12":
    raise SystemExit(
        "FAIL: Incorrect D31 master-freeze stage."
    )

roles = freeze.get(
    "roleBaselines",
    {},
)

for role in [
    "officer",
    "supervisor",
    "admin",
]:
    baseline = roles.get(role)

    if not baseline:
        raise SystemExit(
            f"FAIL: Missing {role} role baseline."
        )

    if not Path(baseline).is_file():
        raise SystemExit(
            f"FAIL: Missing {role} baseline file: {baseline}"
        )

records = freeze.get("files", [])

if not records:
    raise SystemExit(
        "FAIL: D31 master freeze contains no files."
    )

for record in records:
    path = Path(record["path"])

    if not path.is_file():
        raise SystemExit(
            f"FAIL: Frozen D31 file is missing: {path}"
        )

    digest = hashlib.sha256(
        path.read_bytes()
    ).hexdigest()

    if digest != record["sha256"]:
        raise SystemExit(
            f"FAIL: Frozen D31 file changed: {path}"
        )

print(
    f"PASS: {len(records)} D31 master-freeze hashes match"
)
PY

SHELL_VERIFIER="$(
  find scripts -maxdepth 1 -type f \
    -name 'verify-d31-2*shell*.sh' \
    -print |
  head -1
)"

[[ -n "$SHELL_VERIFIER" ]] \
  || fail "Could not locate D31-2 shell verifier"

"$SHELL_VERIFIER"
pass "D31-2 shell contract remains valid"

./scripts/verify-d31-7-officer-visual-freeze.sh
pass "D31-7 Officer freeze remains valid"

./scripts/verify-d31-9-supervisor-visual-freeze.sh
pass "D31-9 Supervisor freeze remains valid"

./scripts/verify-d31-11-admin-visual-freeze.sh
pass "D31-11 Admin freeze remains valid"

git diff --check
pass "D31-12 dashboard freeze verification passed"
