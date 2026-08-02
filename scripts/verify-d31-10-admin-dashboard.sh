#!/usr/bin/env bash
set -euo pipefail

ROOT="${FAIDIA_ROOT:-/Users/blaq/Downloads/faidia}"
EXPECTED_BRANCH="feat/demo-dashboard-redesign"

D31_DIR="docs/demo-engine-base/d31-dashboard-redesign"
ADMIN_DIR="features/demo-engine/dashboards/admin"
HF_DIR="$ADMIN_DIR/high-fidelity"
PAGE="app/demo/admin/page.tsx"
CSS="app/demo/admin/admin-dashboard-reference.css"
CONTRACT="$ADMIN_DIR/admin-dashboard.reference-contract.ts"

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
  "$PAGE"
  "$CSS"
  "$ADMIN_DIR/index.ts"
  "$CONTRACT"
  "$HF_DIR/AdminDashboardHighFidelity.tsx"
  "$HF_DIR/admin-dashboard-reference-data.ts"
  "$HF_DIR/index.ts"
  "$D31_DIR/D31-ADMIN-DASHBOARD.md"
  "$D31_DIR/D31-10-CHECKLIST.md"
  "$D31_DIR/admin-reference-source/README.md"
  "$D31_DIR/admin-reference-source/ADMIN-DASHBOARD-SPEC.md"
  "$D31_DIR/admin-reference-source/AdminDashboard.tsx.txt"
  "$D31_DIR/admin-reference-source/admin-dashboard.css.txt"
  "$D31_DIR/admin-reference-source/admin-dashboard-data.ts.txt"
  "public/demo/references/dashboards/admin-dashboard-bundle-reference.png"
  "public/demo/references/dashboards/admin-dashboard-bundle-implementation-preview.png"
  "public/demo/references/dashboards/admin-dashboard-bundle-mobile-preview.png"
)

for file in "${required[@]}"; do
  [[ -s "$file" ]] || fail "Missing D31-10 file: $file"
done

pass "All D31-10 Admin files exist"

for token in \
  getActiveDemoPack \
  adaptAdminDashboard \
  validateAdminDashboardData \
  assertDashboardDataValid \
  buildAdminDashboardReferenceData \
  AdminDashboardHighFidelity; do
  grep -Fq "$token" "$PAGE" \
    || fail "Admin route is missing: $token"
done

grep -Fq 'import "./admin-dashboard-reference.css"' "$PAGE" \
  || fail "Admin route does not load its scoped stylesheet"

page_lines="$(wc -l < "$PAGE" | tr -d ' ')"
[[ "$page_lines" -le 40 ]] \
  || fail "Admin route is not thin: $page_lines lines"

pass "Admin route is thin, validated and adapter-driven"

COMPONENT="$HF_DIR/AdminDashboardHighFidelity.tsx"

grep -Fq 'data-dashboard-role="admin"' "$COMPONENT" \
  || fail "Admin root role marker is missing"
grep -Fq 'data-dashboard-version="d31-admin-zones-v1"' "$COMPONENT" \
  || fail "Admin dashboard version marker is missing"

for pair in \
  'admin-zone-one|Institution-wide health' \
  'admin-zone-two|Operational visibility' \
  'admin-zone-three|Financial and document control' \
  'admin-zone-five|Governance and institutional insight'; do
  id="${pair%%|*}"
  title="${pair#*|}"

  grep -Fq "id=\"$id\"" "$COMPONENT" \
    || fail "Missing Admin zone id: $id"
  grep -Fq "$title" "$COMPONENT" \
    || fail "Missing Admin zone title: $title"
done

for section in \
  "Executive brief" \
  "Service Delivery Trend" \
  "Institutional Alerts" \
  "Department Performance Comparison" \
  "Institution-wide SLA Monitor" \
  "Requests by Status" \
  "Requests by Service" \
  "Workflow Bottlenecks" \
  "Handoff Network" \
  "Approvals and Escalations" \
  "Payment Overview" \
  "Document Operations" \
  "Certificate & Verification Activity" \
  "Renewals and Expiries" \
  "Audit & Compliance Risk Feed" \
  "Applicant Experience Funnel" \
  "Platform Adoption" \
  "External Coordination Leakage" \
  "Institutional Outcomes" \
  "System Health" \
  "Recent Administrative Activity" \
  "Scheduled Reports"; do
  grep -Fq "$section" "$COMPONENT" \
    || fail "Missing Admin dashboard section: $section"
done

pass "Admin zones and reference sections are present"

if grep -RniE \
  'ReferenceSidebar|adm-reference-sidebar|embedded=\{false\}|RoleWorkspaceShell|InternalAppShell|AdminWorkspaceShell' \
  "$ADMIN_DIR" \
  "$PAGE" \
  --include='*.ts' \
  --include='*.tsx' \
  2>/dev/null | grep -q .; then
  fail "Production Admin dashboard contains standalone or duplicate shell ownership"
fi

grep -Fq '"use client"' "$COMPONENT" \
  || fail "Interactive Admin dashboard is not a Client Component"

grep -Fq 'role="status"' "$COMPONENT" \
  || fail "Admin interaction feedback region is missing"

heading_count="$(
  grep -o "<h1" "$COMPONENT" |
  wc -l |
  tr -d ' '
)"
[[ "$heading_count" == "1" ]] \
  || fail "Expected one Admin h1, found $heading_count"

pass "Admin shell and interaction boundaries are correct"

python3 - "$CSS" <<'PY'
from pathlib import Path
import re
import sys

path = Path(sys.argv[1])
source = path.read_text(encoding="utf-8")

prohibited = {
    "@import": "font imports must remain global",
    "100vh": "fixed viewport-height canvas",
    "zoom:": "CSS zoom",
    "transform: scale(": "layout scale transform",
    "background-image: url(": "screenshot background",
}

for token, reason in prohibited.items():
    if token in source:
        raise SystemExit(
            f"FAIL: Admin CSS contains {reason}: {token}"
        )

for line_number, line in enumerate(
    source.splitlines(),
    start=1,
):
    stripped = line.strip()

    if (
        not stripped
        or stripped.startswith("@")
        or stripped == "}"
        or "{" not in stripped
    ):
        continue

    selector = stripped.split("{", 1)[0].strip()

    if not selector.startswith(
        (".admin-dashboard", ".adm-")
    ):
        raise SystemExit(
            "FAIL: Admin CSS contains an unprefixed selector "
            f"at line {line_number}: {selector}"
        )

for breakpoint in [
    "@media (max-width: 1200px)",
    "@media (max-width: 840px)",
    "@media (max-width: 560px)",
]:
    if breakpoint not in source:
        raise SystemExit(
            f"FAIL: Missing Admin responsive breakpoint: {breakpoint}"
        )

if "overflow-x: auto" not in source:
    raise SystemExit(
        "FAIL: Admin tables lack controlled horizontal overflow."
    )

print("PASS: Admin CSS is prefixed, responsive and shell-safe")
PY

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

grep -Fq \
  'bfcebb4334456890a9125ae5c91602b33d8948ec6d2782b202bc3be751aa7f46' \
  "$CONTRACT" \
  || fail "Admin source bundle hash is missing"

grep -Fq "looksLikeReferenceData" \
  "$HF_DIR/admin-dashboard-reference-data.ts" \
  || fail "Admin data bridge is missing its reference-shape guard"

pass "Admin reference and data bridge contracts are present"

./scripts/verify-d31-2-shell-contracts.sh
pass "D31-2 shell contract remains valid"

./scripts/verify-d31-9-supervisor-visual-freeze.sh
pass "D31-9 Supervisor visual freeze remains valid"

git diff --check
pass "D31-10 Admin dashboard verification passed"
