#!/usr/bin/env bash
set -euo pipefail

ROOT="${FAIDIA_ROOT:-/Users/blaq/Downloads/faidia}"
EXPECTED_BRANCH="feat/demo-dashboard-redesign"

D31_DIR="docs/demo-engine-base/d31-dashboard-redesign"
ADMIN_DIR="features/demo-engine/dashboards/admin"
HF_DIR="$ADMIN_DIR/high-fidelity"
CONFIG="playwright.d31.config.ts"
SPEC="tests/visual/d31/admin-dashboard.pw.ts"
CONTRACT="$ADMIN_DIR/admin-dashboard.visual-contract.ts"
COMPARISON_DIR="$D31_DIR/admin-visual-comparison"
BASELINE="$D31_DIR/admin-baselines/ADMIN-DASHBOARD-BASELINE.json"

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
  "$CONFIG"
  "$SPEC"
  "$CONTRACT"
  "$BASELINE"
  "$D31_DIR/D31-ADMIN-VISUAL-FREEZE.md"
  "$D31_DIR/D31-11-VISUAL-REVIEW.md"
  "$D31_DIR/D31-11-CHECKLIST.md"
  "$COMPARISON_DIR/ADMIN-VISUAL-METRICS.json"
  "$COMPARISON_DIR/admin-implementation-overlay-50.png"
  "$COMPARISON_DIR/admin-design-overlay-50.png"
  "$COMPARISON_DIR/admin-mobile-overlay-50.png"
  "$COMPARISON_DIR/admin-implementation-current-page.png"
  "$COMPARISON_DIR/admin-design-current-page.png"
  "$COMPARISON_DIR/admin-mobile-current-page.png"
  "public/demo/references/dashboards/admin-dashboard-bundle-reference.png"
  "public/demo/references/dashboards/admin-dashboard-bundle-implementation-preview.png"
  "public/demo/references/dashboards/admin-dashboard-bundle-mobile-preview.png"
)

for file in "${required[@]}"; do
  [[ -s "$file" ]] || fail "Missing D31-11 file: $file"
done

[[ ! -e tests/visual/d31/admin-dashboard.spec.ts ]] \
  || fail "Vitest-discoverable Admin Playwright spec exists"

grep -Fq 'testMatch: "**/*.pw.ts"' "$CONFIG" \
  || fail "Playwright is not isolated to .pw.ts files"

grep -Fq "admin-dashboard.pw.ts" package.json \
  || fail "Package scripts do not use the isolated Admin Playwright file"

grep -Fq 'test.describe.configure({' "$SPEC" \
  || fail "Admin visual suite is not configured serially"

grep -Fq 'mode: "serial"' "$SPEC" \
  || fail "Admin visual suite is not serial"

for snapshot in \
  admin-body-desktop-1536.png \
  admin-body-desktop-1440.png \
  admin-body-reference-width-864.png \
  admin-body-tablet-1024.png \
  admin-body-mobile-390.png; do
  find tests/visual/d31/__screenshots__ \
    -type f \
    -name "$snapshot" \
    -print \
    -quit |
  grep -q . \
    || fail "Missing Admin screenshot baseline: $snapshot"
done

pass "Admin Playwright isolation and screenshot baselines are present"

python3 - <<'PY'
from pathlib import Path
import hashlib
import struct

expected = {
    Path(
        "public/demo/references/dashboards/"
        "admin-dashboard-bundle-reference.png"
    ): (
        864,
        1821,
        "4bf810f6d7d443e719f4536073df5dac6bdfd4612268b6d2a24e5828aee3ae96",
    ),
    Path(
        "public/demo/references/dashboards/"
        "admin-dashboard-bundle-implementation-preview.png"
    ): (
        1536,
        3327,
        "6f709a64dafc9a88d8e7ddf6399002076ac004b3d927e99e268fac9f8511458a",
    ),
    Path(
        "public/demo/references/dashboards/"
        "admin-dashboard-bundle-mobile-preview.png"
    ): (
        390,
        7624,
        "7e5f7d406dd10ee4f63f7a8263c375576e8257dc2222fa5e5513f9d2cdf242c4",
    ),
}

for path, (
    expected_width,
    expected_height,
    expected_hash,
) in expected.items():
    with path.open("rb") as stream:
        if stream.read(8) != b"\x89PNG\r\n\x1a\n":
            raise SystemExit(
                f"FAIL: {path} is not a PNG."
            )

        length = struct.unpack(
            ">I",
            stream.read(4),
        )[0]
        chunk = stream.read(4)

        if chunk != b"IHDR" or length != 13:
            raise SystemExit(
                f"FAIL: {path} lacks IHDR."
            )

        width, height = struct.unpack(
            ">II",
            stream.read(8),
        )

    if (
        width,
        height,
    ) != (
        expected_width,
        expected_height,
    ):
        raise SystemExit(
            f"FAIL: Unexpected dimensions for {path}: "
            f"{width}x{height}"
        )

    digest = hashlib.sha256(
        path.read_bytes()
    ).hexdigest()

    if digest != expected_hash:
        raise SystemExit(
            f"FAIL: Admin reference hash changed: {path}"
        )

print("PASS: Supplied Admin reference assets match")
PY

python3 - "$COMPARISON_DIR/ADMIN-VISUAL-METRICS.json" <<'PY'
from pathlib import Path
import json
import sys

metrics = json.loads(
    Path(sys.argv[1]).read_text(
        encoding="utf-8"
    )
)

for key in [
    "implementationPreview",
    "designReference",
    "mobilePreview",
]:
    score = metrics.get(
        key,
        {},
    ).get("parityScore")

    if not isinstance(
        score,
        (int, float),
    ):
        raise SystemExit(
            f"FAIL: Missing numeric parity score: {key}"
        )

    if score < 0 or score > 100:
        raise SystemExit(
            f"FAIL: Invalid parity score: {key}={score}"
        )

print("PASS: Admin visual comparison metrics are valid")
PY

python3 - "$BASELINE" <<'PY'
from pathlib import Path
import hashlib
import json
import sys

baseline = json.loads(
    Path(sys.argv[1]).read_text(
        encoding="utf-8"
    )
)

if baseline.get("stage") != "D31-11":
    raise SystemExit(
        "FAIL: Incorrect Admin baseline stage."
    )

if baseline.get(
    "approvedImplementation"
) != "D31-10":
    raise SystemExit(
        "FAIL: Incorrect approved Admin implementation."
    )

isolation = baseline.get(
    "testRunnerIsolation",
    {},
)

if isolation.get(
    "playwrightPattern"
) != "**/*.pw.ts":
    raise SystemExit(
        "FAIL: Incorrect Playwright isolation pattern."
    )

if isolation.get(
    "vitestPatternCollision"
) is not False:
    raise SystemExit(
        "FAIL: Vitest collision is not recorded as resolved."
    )

for record in baseline.get("files", []):
    path = Path(record["path"])

    if not path.is_file():
        raise SystemExit(
            f"FAIL: Frozen Admin file is missing: {path}"
        )

    digest = hashlib.sha256(
        path.read_bytes()
    ).hexdigest()

    if digest != record["sha256"]:
        raise SystemExit(
            f"FAIL: Frozen Admin file changed: {path}"
        )

print("PASS: Admin visual-freeze hashes match")
PY

grep -Fq 'data-dashboard-role="admin"' \
  "$HF_DIR/AdminDashboardHighFidelity.tsx" \
  || fail "Admin production root marker is missing"

for id in \
  admin-zone-one \
  admin-zone-two \
  admin-zone-three \
  admin-zone-five; do
  grep -Fq "id=\"$id\"" \
    "$HF_DIR/AdminDashboardHighFidelity.tsx" \
    || fail "Missing Admin zone id: $id"
done

grep -Fq \
  "configured records" \
  "$SPEC" \
  || fail "Admin semantic test does not use data-aware record assertions"

if grep -Eq \
  'toHaveCount\([0-9]+\).*tbody|tbody[\s\S]{0,160}toHaveCount\([0-9]+\)' \
  "$SPEC"; then
  fail "Admin semantic test contains a rigid table-row count"
fi

pass "Admin production and semantic boundaries are valid"

./scripts/verify-d31-9-supervisor-visual-freeze.sh
pass "D31-9 Supervisor freeze remains valid"

./scripts/verify-d31-10-admin-dashboard.sh
pass "D31-10 Admin reconstruction remains valid"

git diff --check
pass "D31-11 Admin visual freeze verification passed"
