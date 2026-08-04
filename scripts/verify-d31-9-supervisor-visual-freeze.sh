#!/usr/bin/env bash
set -euo pipefail

ROOT="${FAIDIA_ROOT:-/Users/blaq/Downloads/faidia}"
EXPECTED_BRANCH="feat/demo-dashboard-redesign"

D31_DIR="docs/demo-engine-base/d31-dashboard-redesign"
SUPERVISOR_DIR="features/demo-engine/dashboards/supervisor"
SPEC="tests/visual/d31/supervisor-dashboard.pw.ts"
CONFIG="playwright.d31.config.ts"
BASELINE="$D31_DIR/supervisor-baselines/SUPERVISOR-DASHBOARD-BASELINE.json"
COMPARISON_DIR="$D31_DIR/supervisor-visual-comparison"
CONTRACT="$SUPERVISOR_DIR/supervisor-dashboard.visual-contract.ts"

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
  "$CONFIG"
  "$BASELINE"
  "$CONTRACT"
  "$D31_DIR/D31-SUPERVISOR-VISUAL-FREEZE.md"
  "$D31_DIR/D31-9-CHECKLIST.md"
  "$D31_DIR/D31-9-VISUAL-REVIEW.md"
  "$D31_DIR/supervisor-reference-source/README.md"
  "$D31_DIR/supervisor-reference-source/SUPERVISOR-DASHBOARD-SPEC.md"
  "$D31_DIR/supervisor-reference-source/SupervisorDashboard.tsx.txt"
  "$D31_DIR/supervisor-reference-source/supervisor-dashboard.css.txt"
  "$D31_DIR/supervisor-reference-source/supervisor-dashboard-data.ts.txt"
  "$COMPARISON_DIR/supervisor-current-full-page.png"
  "$COMPARISON_DIR/supervisor-current-normalized-to-design.png"
  "$COMPARISON_DIR/supervisor-design-overlay-50.png"
  "$COMPARISON_DIR/supervisor-current-normalized-to-bundle-preview.png"
  "$COMPARISON_DIR/supervisor-bundle-preview-overlay-50.png"
  "$COMPARISON_DIR/SUPERVISOR-VISUAL-METRICS.json"
  "public/demo/references/dashboards/supervisor-dashboard-bundle-reference.png"
  "public/demo/references/dashboards/supervisor-dashboard-bundle-implementation-preview.png"
)

for file in "${required[@]}"; do
  [[ -s "$file" ]] || fail "Missing D31-9 file: $file"
done

[[ ! -e tests/visual/d31/supervisor-dashboard.spec.ts ]] \
  || fail "Vitest-discoverable Supervisor Playwright spec exists"

grep -Fq 'testMatch: "**/*.pw.ts"' "$CONFIG" \
  || fail "Playwright is not isolated to .pw.ts files"

grep -Fq "supervisor-dashboard.pw.ts" package.json \
  || fail "Supervisor visual scripts do not use the isolated Playwright file"

for snapshot in \
  supervisor-body-desktop-1536.png \
  supervisor-body-desktop-1440.png \
  supervisor-body-reference-width-864.png \
  supervisor-body-tablet-1024.png \
  supervisor-body-mobile-390.png; do
  find tests/visual/d31/__screenshots__ \
    -maxdepth 1 \
    -type f \
    -name "$snapshot" \
    -print \
    -quit |
  grep -q . \
    || fail "Missing Supervisor screenshot baseline: $snapshot"
done

python3 - <<'PY'
from pathlib import Path
import hashlib
import json
import struct

expected = {
    Path(
        "public/demo/references/dashboards/"
        "supervisor-dashboard-bundle-reference.png"
    ): (
        864,
        1821,
        "10d6c51289bb10f8bbf9ad804ff5bc7fb42cc537d8f4cd5accf61b662fb38ab0",
    ),
    Path(
        "public/demo/references/dashboards/"
        "supervisor-dashboard-bundle-implementation-preview.png"
    ): (
        1536,
        2842,
        "3587424a66b54c147d12b490a2dcdc52d33d059a6acad2685f50cfb013a55088",
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
            f"FAIL: Supplied reference hash changed: {path}"
        )

print("PASS: Supplied Supervisor reference assets match")
PY

python3 - "$COMPARISON_DIR/SUPERVISOR-VISUAL-METRICS.json" <<'PY'
from pathlib import Path
import json
import sys

metrics = json.loads(
    Path(sys.argv[1]).read_text(
        encoding="utf-8"
    )
)

for key in [
    "designReference",
    "bundleImplementationPreview",
]:
    score = metrics.get(key, {}).get(
        "parityScore"
    )

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

print("PASS: Supervisor visual comparison metrics are valid")
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

if baseline.get("stage") != "D31-9":
    raise SystemExit(
        "FAIL: Incorrect Supervisor baseline stage."
    )

if baseline.get(
    "approvedImplementation"
) != "D31-8":
    raise SystemExit(
        "FAIL: Incorrect approved Supervisor implementation."
    )

for record in baseline.get("files", []):
    path = Path(record["path"])

    if not path.is_file():
        raise SystemExit(
            f"FAIL: Frozen file is missing: {path}"
        )

    digest = hashlib.sha256(
        path.read_bytes()
    ).hexdigest()

    if digest != record["sha256"]:
        raise SystemExit(
            f"FAIL: Frozen Supervisor file changed: {path}"
        )

print("PASS: Supervisor visual-freeze hashes match")
PY

grep -Fq 'data-dashboard-role="supervisor"' \
  "$SUPERVISOR_DIR/supervisor-dashboard.tsx" \
  || fail "Supervisor production root marker is missing"

for id in \
  supervisor-zone-one \
  supervisor-zone-two \
  supervisor-zone-three \
  supervisor-zone-four; do
  grep -Fq "id=\"$id\"" \
    "$SUPERVISOR_DIR/supervisor-dashboard.tsx" \
    || fail "Missing Supervisor zone id: $id"
done

./scripts/verify-d31-7-officer-visual-freeze.sh
pass "D31-7 Officer freeze remains valid"

./scripts/verify-d31-8-supervisor-dashboard.sh
pass "D31-8 Supervisor reconstruction remains valid"

git diff --check
pass "D31-9 Supervisor visual freeze verification passed"
