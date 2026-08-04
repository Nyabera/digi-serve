#!/usr/bin/env bash
set -euo pipefail

ROOT="${FAIDIA_ROOT:-/Users/blaq/Downloads/faidia}"
EXPECTED_BRANCH="feat/demo-dashboard-redesign"
DATA_DIR="features/demo-engine/dashboards/data"
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
  "$DATA_DIR/dashboard-data.shared.ts"
  "$DATA_DIR/demo-pack-dashboard.snapshot.ts"
  "$DATA_DIR/dashboard-adapter.utilities.ts"
  "$DATA_DIR/officer-dashboard.types.ts"
  "$DATA_DIR/officer-dashboard.adapter.ts"
  "$DATA_DIR/supervisor-dashboard.types.ts"
  "$DATA_DIR/supervisor-dashboard.adapter.ts"
  "$DATA_DIR/admin-dashboard.types.ts"
  "$DATA_DIR/admin-dashboard.adapter.ts"
  "$DATA_DIR/dashboard-data.validation.ts"
  "$DATA_DIR/index.ts"
  "$D31_DIR/D31-DASHBOARD-DATA-CONTRACTS.md"
  "$D31_DIR/D31-5-CHECKLIST.md"
)

for file in "${required[@]}"; do
  [[ -s "$file" ]] || fail "Missing or empty file: $file"
done

pass "All D31-5 dashboard data files exist"

for contract in \
  OfficerDashboardData \
  SupervisorDashboardData \
  AdminDashboardData \
  DashboardAdapterContext; do
  grep -RFn "$contract" \
    "$DATA_DIR" \
    --include='*.ts' \
    >/dev/null \
    || fail "Missing dashboard contract: $contract"
done

for adapter in \
  adaptOfficerDashboard \
  adaptSupervisorDashboard \
  adaptAdminDashboard \
  createDashboardPackSnapshot; do
  grep -RFn "$adapter" \
    "$DATA_DIR" \
    --include='*.ts' \
    >/dev/null \
    || fail "Missing dashboard adapter: $adapter"
done

pass "Officer, Supervisor, Admin, and Demo Pack adapters exist"

grep -Fq 'import type {' \
  "$DATA_DIR/demo-pack-dashboard.snapshot.ts" \
  || fail "Demo Pack snapshot does not use a type-only import"

grep -Fq 'DemoPack' \
  "$DATA_DIR/demo-pack-dashboard.snapshot.ts" \
  || fail "Demo Pack snapshot is not typed against DemoPack"

pass "Demo Pack boundary is explicit and typed"

if grep -RniE \
  'from ["'\'']react["'\'']|from ["'\'']recharts["'\'']|\.module\.css|RoleWorkspaceShell|InternalAppShell|OperationalWorkspaceShell|AdminWorkspaceShell|demo-packs/tvet' \
  "$DATA_DIR" \
  --include='*.ts' \
  2>/dev/null | grep -q .; then
  fail "Dashboard data layer imports UI, shell, CSS, or TVET fixture modules"
fi

pass "Dashboard data package is UI-neutral, shell-neutral, and pack-neutral"

if grep -RniE \
  'Date\.now\(|Math\.random\(|randomUUID\(' \
  "$DATA_DIR" \
  --include='*.ts' \
  2>/dev/null | grep -q .; then
  fail "Dashboard adapters contain non-deterministic values"
fi

grep -Fq \
  'DEFAULT_DASHBOARD_REFERENCE_DATE' \
  "$DATA_DIR/dashboard-data.shared.ts" \
  || fail "Fixed dashboard reference date is missing"

pass "Dashboard adapters are deterministic"

for zone in \
  '"zone-1"' \
  '"zone-2"' \
  '"zone-3"' \
  '"zone-4"' \
  '"zone-5"'; do
  grep -Fq "$zone" \
    features/demo-engine/dashboards/shared/dashboard-theme.ts \
    || fail "Reference zone geometry is missing: $zone"
done

grep -Fq "departmentHealth" \
  "$DATA_DIR/supervisor-dashboard.types.ts" \
  || fail "Supervisor Zone 1 contract is missing"

grep -Fq "officerCapacity" \
  "$DATA_DIR/supervisor-dashboard.types.ts" \
  || fail "Supervisor Zone 2 contract is missing"

grep -Fq "serviceFlow" \
  "$DATA_DIR/supervisor-dashboard.types.ts" \
  || fail "Supervisor Zone 3 contract is missing"

grep -Fq "auditHighlights" \
  "$DATA_DIR/supervisor-dashboard.types.ts" \
  || fail "Supervisor Zone 4 contract is missing"

grep -Fq "institutionHealth" \
  "$DATA_DIR/admin-dashboard.types.ts" \
  || fail "Admin Zone 1 contract is missing"

grep -Fq "workflowBottlenecks" \
  "$DATA_DIR/admin-dashboard.types.ts" \
  || fail "Admin Zone 2 contract is missing"

grep -Fq "payments" \
  "$DATA_DIR/admin-dashboard.types.ts" \
  || fail "Admin Zone 3 contract is missing"

grep -Fq "scheduledReports" \
  "$DATA_DIR/admin-dashboard.types.ts" \
  || fail "Admin Zone 5 contract is missing"

pass "Supervisor and Admin zone contracts align with the references"

for validator in \
  validateOfficerDashboardData \
  validateSupervisorDashboardData \
  validateAdminDashboardData; do
  grep -Fq "$validator" \
    "$DATA_DIR/dashboard-data.validation.ts" \
    || fail "Missing data validator: $validator"
done

pass "All three role data validators exist"

grep -Fq "adaptOfficerDashboard" \
  "$DATA_DIR/index.ts" \
  || fail "Officer adapter is not exported"
grep -Fq "adaptSupervisorDashboard" \
  "$DATA_DIR/index.ts" \
  || fail "Supervisor adapter is not exported"
grep -Fq "adaptAdminDashboard" \
  "$DATA_DIR/index.ts" \
  || fail "Admin adapter is not exported"

pass "Dashboard data barrel exports are complete"

./scripts/verify-d31-2-shell-contracts.sh
pass "D31-2 shell contracts remain valid"

./scripts/verify-d31-3-dashboard-tokens.sh
pass "D31-3 token system remains valid"

./scripts/verify-d31-4-dashboard-primitives.sh
pass "D31-4 primitive system remains valid"

git diff --check
pass "Git whitespace validation passed"

printf '\nD31-5 dashboard data-contract verification passed.\n'
