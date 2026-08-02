#!/usr/bin/env bash
set -euo pipefail

ROOT="${FAIDIA_ROOT:-/Users/blaq/Downloads/faidia}"
EXPECTED_BRANCH="feat/demo-dashboard-redesign"
D31_DIR="docs/demo-engine-base/d31-dashboard-redesign"
BASELINE="$D31_DIR/shell-baselines/OPERATIONAL-SHELL-BASELINE.json"

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
  "components/demo/workspace-shells/operational-workspace-shell.tsx"
  "components/demo/workspace-shells/admin-workspace-shell.tsx"
  "components/demo/workspace-shells/index.ts"
  "app/demo/officer/layout.tsx"
  "app/demo/supervisor/layout.tsx"
  "app/demo/admin/layout.tsx"
  "features/demo-engine/dashboards/config/dashboard-shell-contracts.ts"
  "$BASELINE"
  "$D31_DIR/D31-SHELL-CONTRACTS.md"
  "$D31_DIR/D31-SHELL-OWNERSHIP.md"
  "$D31_DIR/D31-2-CHECKLIST.md"
)

for file in "${required[@]}"; do
  [[ -s "$file" ]] || fail "Missing or empty file: $file"
done

pass "All D31-2 shell contract files exist"

grep -Fq "OperationalWorkspaceShell" \
  app/demo/officer/layout.tsx \
  || fail "Officer layout does not use OperationalWorkspaceShell"

grep -Eq 'role[[:space:]]*=[[:space:]]*"officer"' \
  app/demo/officer/layout.tsx \
  || fail "Officer layout does not declare the Officer role"

grep -Fq "OperationalWorkspaceShell" \
  app/demo/supervisor/layout.tsx \
  || fail "Supervisor layout does not use OperationalWorkspaceShell"

grep -Eq 'role[[:space:]]*=[[:space:]]*"supervisor"' \
  app/demo/supervisor/layout.tsx \
  || fail "Supervisor layout does not declare the Supervisor role"

grep -Fq "AdminWorkspaceShell" \
  app/demo/admin/layout.tsx \
  || fail "Admin layout does not use AdminWorkspaceShell"

pass "Officer, Supervisor and Admin layouts own the correct boundaries"

grep -Fq "RoleWorkspaceShell" \
  components/demo/workspace-shells/operational-workspace-shell.tsx \
  || fail "Operational boundary does not delegate to shared role shell"

grep -Fq 'role="admin"' \
  components/demo/workspace-shells/admin-workspace-shell.tsx \
  || fail "Admin boundary does not currently delegate with Admin role"

pass "Current shell delegation is explicit"

node <<'NODE'
const crypto = require("crypto");
const fs = require("fs");

const baselinePath =
  "docs/demo-engine-base/d31-dashboard-redesign/" +
  "shell-baselines/OPERATIONAL-SHELL-BASELINE.json";

const baseline = JSON.parse(
  fs.readFileSync(baselinePath, "utf8"),
);

const failures = [];

for (const record of baseline.records) {
  if (!fs.existsSync(record.file)) {
    failures.push(`missing ${record.file}`);
    continue;
  }

  const buffer = fs.readFileSync(record.file);
  const hash = crypto
    .createHash("sha256")
    .update(buffer)
    .digest("hex");

  if (hash !== record.sha256) {
    failures.push(`changed ${record.file}`);
  }
}

if (failures.length > 0) {
  console.error(
    "FAIL: Protected operational shell contract drifted:",
  );

  for (const failure of failures) {
    console.error(`  - ${failure}`);
  }

  process.exit(1);
}

console.log(
  `PASS: ${baseline.records.length} protected shell files match baseline`,
);
NODE

dashboard_roots=(
  "features/demo-engine/dashboards/officer"
  "features/demo-engine/dashboards/supervisor"
  "features/demo-engine/dashboards/admin"
)

for root in "${dashboard_roots[@]}"; do
  [[ -d "$root" ]] || continue

  if grep -RniE \
    'InternalAppShell|RoleWorkspaceShell|OperationalWorkspaceShell|AdminWorkspaceShell|InternalShellBoundaryProvider' \
    "$root" \
    --include='*.ts' \
    --include='*.tsx' \
    2>/dev/null | grep -q .; then
    fail "Dashboard body imports or mounts a shell inside $root"
  fi
done

pass "Dashboard body folders do not own shell chrome"

grep -Fq 'id: "operational"' \
  features/demo-engine/dashboards/config/dashboard-shell-contracts.ts \
  || fail "Typed operational shell contract is missing"

grep -Fq 'id: "organization-admin"' \
  features/demo-engine/dashboards/config/dashboard-shell-contracts.ts \
  || fail "Typed Admin shell contract is missing"

grep -Fq "D31-8 may replace" \
  "$D31_DIR/D31-SHELL-CONTRACTS.md" \
  || fail "Admin D31-8 transition is not documented"

pass "Typed and written shell contracts are aligned"

git diff --check
pass "Git whitespace validation passed"

printf '\nD31-2 shell-contract verification passed.\n'
