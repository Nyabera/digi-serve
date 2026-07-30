#!/usr/bin/env bash
set -euo pipefail

ROOT="${FAIDIA_ROOT:-/Users/blaq/Downloads/faidia}"
EXPECTED_BRANCH="feat/demo-dashboard-redesign"
REFERENCE_DIR="public/demo/references/dashboards"
D31_DIR="docs/demo-engine-base/d31-dashboard-redesign"

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
  "$REFERENCE_DIR/officer-dashboard.png"
  "$REFERENCE_DIR/supervisor-dashboard.png"
  "$REFERENCE_DIR/admin-dashboard.png"
  "$REFERENCE_DIR/reference-manifest.json"
  "$REFERENCE_DIR/REFERENCE-SHA256.txt"
  "$REFERENCE_DIR/README.md"
  "$D31_DIR/REFERENCE-MEASUREMENTS.md"
  "$D31_DIR/OFFICER-REFERENCE-SPEC.md"
  "$D31_DIR/SUPERVISOR-REFERENCE-SPEC.md"
  "$D31_DIR/ADMIN-REFERENCE-SPEC.md"
  "$D31_DIR/D31-1-CHECKLIST.md"
)

for file in "${required[@]}"; do
  [[ -s "$file" ]] || fail "Missing or empty file: $file"
done

pass "All D31-1 reference assets and specifications exist"

node <<'NODE'
const fs = require("fs");
const path = require("path");

const directory =
  "public/demo/references/dashboards";

const expected = {
  "officer-dashboard.png": [1568, 1003],
  "supervisor-dashboard.png": [864, 1821],
  "admin-dashboard.png": [864, 1821],
};

function dimensions(file) {
  const buffer = fs.readFileSync(
    path.join(directory, file),
  );

  return [
    buffer.readUInt32BE(16),
    buffer.readUInt32BE(20),
  ];
}

for (const [file, size] of Object.entries(expected)) {
  const actual = dimensions(file);

  if (
    actual[0] !== size[0] ||
    actual[1] !== size[1]
  ) {
    throw new Error(
      `${file}: expected ${size.join("x")}, ` +
        `got ${actual.join("x")}`,
    );
  }

  console.log(
    `PASS: ${file} dimensions ${actual.join("x")}`,
  );
}
NODE

if command -v shasum >/dev/null 2>&1; then
  (
    cd "$REFERENCE_DIR"
    shasum -a 256 -c REFERENCE-SHA256.txt
  )
elif command -v sha256sum >/dev/null 2>&1; then
  (
    cd "$REFERENCE_DIR"
    sha256sum -c REFERENCE-SHA256.txt
  )
else
  fail "No SHA-256 verification command is available"
fi

pass "Reference hashes match the frozen files"

grep -Fq "Workload pulse: 8 columns" \
  "$D31_DIR/REFERENCE-MEASUREMENTS.md" \
  || fail "Officer grid measurement is missing"

grep -Fq "Zone 4 — Oversight and governance" \
  "$D31_DIR/SUPERVISOR-REFERENCE-SPEC.md" \
  || fail "Supervisor Zone 4 specification is missing"

grep -Fq "Zone 5 — Governance and institutional insight" \
  "$D31_DIR/ADMIN-REFERENCE-SPEC.md" \
  || fail "Admin Zone 5 specification is missing"

grep -Fq "missing Zone 4 is intentional" \
  "$D31_DIR/REFERENCE-MEASUREMENTS.md" \
  || fail "Admin missing Zone 4 decision is missing"

pass "Reference interpretation and zone decisions are documented"

git diff --check
pass "Git whitespace validation passed"

printf '\nD31-1 dashboard-reference verification passed.\n'
