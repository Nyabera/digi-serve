#!/usr/bin/env bash
set -euo pipefail

ROOT="${FAIDIA_ROOT:-/Users/blaq/Downloads/faidia}"
EXPECTED_BRANCH="feat/demo-engine-base"
D30_DIR="docs/demo-engine-base/d30-freeze"

MANIFEST="$D30_DIR/D30-13-RESPONSIVE-MANIFEST.json"
RESULTS="$D30_DIR/D30-13-RESPONSIVE-RESULTS.json"
FREEZE="$D30_DIR/responsive-baseline/D30-13-RESPONSIVE-FREEZE.json"
SCREENSHOT_DIR="$D30_DIR/screenshots/responsive"

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
  "$MANIFEST"
  "$RESULTS"
  "$FREEZE"
  "$D30_DIR/D30-13-RESPONSIVE-EVIDENCE.md"
  "$D30_DIR/D30-13-RESPONSIVE-ACCEPTANCE.md"
  "$D30_DIR/D30-13-CHECKLIST.md"
  "playwright.d30-responsive.config.ts"
  "tests/acceptance/d30/demo-responsive-acceptance.pw.ts"
  "scripts/run-d30-13-responsive-acceptance.sh"
)

for file in "${required[@]}"; do
  [[ -s "$file" ]] || fail "Missing D30-13 file: $file"
done

[[ ! -e tests/acceptance/d30/demo-responsive-acceptance.spec.ts ]] \
  || fail "Vitest-discoverable responsive Playwright test exists"

grep -Fq \
  'testMatch:' \
  playwright.d30-responsive.config.ts \
  || fail "Responsive Playwright testMatch is missing"

grep -Fq \
  'demo-responsive-acceptance.pw.ts' \
  playwright.d30-responsive.config.ts \
  || fail "Responsive Playwright isolation is missing"

python3 - \
  "$MANIFEST" \
  "$RESULTS" \
  "$FREEZE" <<'PY'
from pathlib import Path
import hashlib
import json
import sys

manifest = json.loads(
    Path(sys.argv[1]).read_text(
        encoding="utf-8"
    )
)

results = json.loads(
    Path(sys.argv[2]).read_text(
        encoding="utf-8"
    )
)

freeze = json.loads(
    Path(sys.argv[3]).read_text(
        encoding="utf-8"
    )
)

if manifest.get(
    "stage"
) != "D30-13":
    raise SystemExit(
        "FAIL: Incorrect responsive-manifest stage."
    )

if results.get(
    "stage"
) != "D30-13":
    raise SystemExit(
        "FAIL: Incorrect responsive-results stage."
    )

if results.get(
    "status"
) != "passed":
    raise SystemExit(
        "FAIL: Responsive acceptance did not pass."
    )

expected = manifest.get(
    "totals",
    {},
).get(
    "responsiveCases",
    0,
)

coverage = results.get(
    "responsiveCases",
    {},
)

if coverage.get(
    "expected"
) != expected:
    raise SystemExit(
        "FAIL: Responsive expected count does not match the manifest."
    )

if coverage.get(
    "passed"
) != expected:
    raise SystemExit(
        "FAIL: Not every responsive case passed."
    )

if coverage.get(
    "missing",
    [],
):
    raise SystemExit(
        "FAIL: Responsive cases are missing."
    )

if coverage.get(
    "failed",
    [],
):
    raise SystemExit(
        "FAIL: Responsive cases failed."
    )

if freeze.get(
    "stage"
) != "D30-13":
    raise SystemExit(
        "FAIL: Incorrect responsive-freeze stage."
    )

for record in freeze.get(
    "files",
    [],
):
    path = Path(
        record["path"]
    )

    if not path.is_file():
        raise SystemExit(
            f"FAIL: Frozen D30-13 file is missing: {path}"
        )

    digest = hashlib.sha256(
        path.read_bytes()
    ).hexdigest()

    if digest != record["sha256"]:
        raise SystemExit(
            f"FAIL: Frozen D30-13 file changed: {path}"
        )

print(
    f"PASS: All {expected} responsive cases are recorded as passing"
)
print("PASS: D30-13 responsive-freeze hashes match")
PY

expected_screenshots="$(
  python3 - "$MANIFEST" <<'PY'
from pathlib import Path
import json
import sys

manifest = json.loads(
    Path(sys.argv[1]).read_text(
        encoding="utf-8"
    )
)

print(
    manifest["totals"][
        "responsiveCases"
    ]
)
PY
)"

actual_screenshots="$(
  find "$SCREENSHOT_DIR" \
    -type f \
    -name '*.png' \
    | wc -l \
    | tr -d ' '
)"

[[ "$actual_screenshots" == "$expected_screenshots" ]] \
  || fail \
    "Expected $expected_screenshots screenshots; found $actual_screenshots"

./scripts/verify-d30-12-route-acceptance.sh
pass "D30-12 route acceptance remains valid"

git diff --check
pass "D30-13 responsive acceptance verification passed"
