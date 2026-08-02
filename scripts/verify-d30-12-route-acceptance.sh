#!/usr/bin/env bash
set -euo pipefail

ROOT="${FAIDIA_ROOT:-/Users/blaq/Downloads/faidia}"
EXPECTED_BRANCH="feat/demo-engine-base"
D30_DIR="docs/demo-engine-base/d30-freeze"
MANIFEST="$D30_DIR/D30-12-ROUTE-MANIFEST.json"
RESULTS="$D30_DIR/D30-12-ACCEPTANCE-RESULTS.json"
EVIDENCE="$D30_DIR/D30-12-ACCEPTANCE-EVIDENCE.md"
D31_FREEZE="docs/demo-engine-base/d31-dashboard-redesign/d31-freeze/D31-DASHBOARD-FREEZE.json"

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
  "$EVIDENCE"
  "$D30_DIR/D30-12-ROUTE-ACCEPTANCE.md"
  "$D30_DIR/D30-12-CHECKLIST.md"
  "playwright.d30.config.ts"
  "tests/acceptance/d30/demo-route-acceptance.pw.ts"
  "scripts/generate-d30-12-route-manifest.mjs"
  "scripts/run-d30-12-route-acceptance.sh"
  "$D31_FREEZE"
)

for file in "${required[@]}"; do
  [[ -s "$file" ]] || fail "Missing D30-12 file: $file"
done

[[ ! -e tests/acceptance/d30/demo-route-acceptance.spec.ts ]] \
  || fail "Vitest-discoverable D30 Playwright spec exists"

grep -Fq 'testMatch:' \
  playwright.d30.config.ts \
  || fail "D30 Playwright testMatch is missing"

grep -Fq '"**/*.pw.ts"' \
  playwright.d30.config.ts \
  || fail "D30 Playwright tests are not isolated to .pw.ts"

python3 - \
  "$MANIFEST" \
  "$RESULTS" <<'PY'
from pathlib import Path
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

if manifest.get("stage") != "D30-12":
    raise SystemExit(
        "FAIL: Incorrect route-manifest stage."
    )

if results.get("stage") != "D30-12":
    raise SystemExit(
        "FAIL: Incorrect acceptance-results stage."
    )

if results.get("status") != "passed":
    raise SystemExit(
        "FAIL: Route acceptance did not pass."
    )

missing = [
    name
    for name, present
    in manifest.get(
        "requiredJourneys",
        {},
    ).items()
    if not present
]

if missing:
    raise SystemExit(
        "FAIL: Missing required journeys: "
        + ", ".join(missing)
    )

if (
    results.get(
        "playwright",
        {},
    ).get(
        "failed",
        0,
    )
    != 0
):
    raise SystemExit(
        "FAIL: Playwright failures are recorded."
    )

route_coverage = results.get(
    "routeCoverage",
    {},
)

resolved_routes = manifest.get(
    "totals",
    {},
).get(
    "resolvedRoutes",
    0,
)

if route_coverage.get(
    "expected"
) != resolved_routes:
    raise SystemExit(
        "FAIL: Route-coverage expectation does not match the resolved route count."
    )

if route_coverage.get(
    "passed"
) != resolved_routes:
    raise SystemExit(
        "FAIL: Not every resolved route has a passing route-specific test."
    )

if route_coverage.get(
    "missing",
    [],
):
    raise SystemExit(
        "FAIL: Route-specific tests are missing."
    )

if route_coverage.get(
    "failed",
    [],
):
    raise SystemExit(
        "FAIL: One or more route-specific tests failed."
    )

print(
    f"PASS: All {resolved_routes} resolved routes have passing route-specific tests"
)
print("PASS: D30-12 route manifest and results are valid")
PY

for image in \
  home.png \
  verify-certificate.png \
  track.png \
  officer.png \
  supervisor.png \
  admin.png; do
  [[ -s "$D30_DIR/screenshots/acceptance/$image" ]] \
    || fail "Missing route evidence screenshot: $image"
done

pass "Core route evidence screenshots exist"

D30_11_VERIFIER="$(
  find scripts -maxdepth 1 -type f \
    -name 'verify-d30-11*.sh' \
    -print |
  head -1
)"

[[ -n "$D30_11_VERIFIER" ]] \
  || fail "Could not locate D30-11 verifier"

"$D30_11_VERIFIER"
pass "D30-11 reset verifier remains valid"

./scripts/verify-d30-10f-freeze-alignment.sh
pass "D30-10F alignment remains valid"

python3 - "$D31_FREEZE" <<'PY'
from pathlib import Path
import hashlib
import json
import sys

freeze = json.loads(
    Path(sys.argv[1]).read_text(
        encoding="utf-8"
    )
)

integration_mutable_paths = {
    "package.json",
}

validated = 0

for record in freeze.get(
    "files",
    [],
):
    path = Path(record["path"])

    if path.as_posix() in integration_mutable_paths:
        continue

    if not path.is_file():
        raise SystemExit(
            f"FAIL: D31 frozen file is missing: {path}"
        )

    digest = hashlib.sha256(
        path.read_bytes()
    ).hexdigest()

    if digest != record["sha256"]:
        raise SystemExit(
            f"FAIL: D31 frozen file changed: {path}"
        )

    validated += 1

print(
    f"PASS: {validated} D31-owned master-freeze hashes remain intact"
)
PY

git diff --check
pass "D30-12 complete route-acceptance verification passed"
