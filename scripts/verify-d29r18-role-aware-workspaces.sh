#!/usr/bin/env bash
set -euo pipefail

EXPECTED_ROOT="${FAIDIA_ROOT:-/Users/blaq/Downloads/faidia}"

pass() { printf "PASS: %s\n" "$1"; }
fail() { printf "FAIL: %s\n" "$1" >&2; exit 1; }

[[ "$(pwd)" == "$EXPECTED_ROOT" ]] \
  && pass "Current directory is correct" \
  || fail "Run this verifier from $EXPECTED_ROOT"

FILES=(
  "features/demo/roles/demo-workspace-role.tsx"
  "components/demo/role-switcher/demo-workspace-switcher.tsx"
  "components/demo/internal-shell/internal-navigation.ts"
  "components/demo/internal-shell/internal-app-shell.tsx"
  "components/demo/reports/operational-reports-shell.tsx"
)

for FILE in "${FILES[@]}"; do
  [[ -f "$FILE" ]] \
    && pass "File exists: $FILE" \
    || fail "Missing file: $FILE"
done

for ROLE in APPLICANT OFFICER SUPERVISOR ADMIN; do
  grep -Fq "\"$ROLE\"" \
    features/demo/roles/demo-workspace-role.tsx \
    && pass "Role exists: $ROLE" \
    || fail "Missing role: $ROLE"
done

grep -Fq "DemoWorkspaceRoleProvider" app/demo/layout.tsx \
  && pass "Role provider is mounted" \
  || fail "Role provider is missing"

grep -Fq "DemoWorkspaceSwitcher" \
  components/demo/internal-shell/internal-app-shell.tsx \
  && pass "Shared role selector is mounted" \
  || fail "Shared role selector is missing"

if sed -n '/const officerNavigation/,/const departmentNavigation/p' \
  components/demo/internal-shell/internal-navigation.ts \
  | grep -Fq "Operational reports"; then
  fail "Officer navigation still exposes Reports"
else
  pass "Officer navigation does not expose Reports"
fi

grep -Fq "Department reports" \
  components/demo/internal-shell/internal-navigation.ts \
  && pass "Supervisor gets department reports" \
  || fail "Supervisor department reports are missing"

grep -Fq "Reports dashboard" \
  components/demo/internal-shell/internal-navigation.ts \
  && pass "Admin gets institution reports" \
  || fail "Admin reports are missing"

grep -Fq 'role === "SUPERVISOR" || role === "ADMIN"' \
  components/demo/reports/operational-reports-shell.tsx \
  && pass "Reports access guard exists" \
  || fail "Reports access guard is missing"

grep -Fq "viewerRole" \
  components/demo/reports/reports-dashboard.tsx \
  && grep -Fq "lockedDepartment" \
  components/demo/reports/reports-dashboard.tsx \
  && pass "Reports accept role scope" \
  || fail "Reports role scope is missing"

PAGE_COUNT="$(
  find app/demo -type f -name "page.tsx" | wc -l | tr -d " "
)"

[[ "$PAGE_COUNT" -eq 14 ]] \
  && pass "The 14-page route inventory remains intact" \
  || fail "Expected 14 pages but found $PAGE_COUNT"

if grep -R -nE \
  "createClient\(|supabase\.|\bfetch[[:space:]]*\(|axios\." \
  features/demo/roles components/demo/role-switcher; then
  fail "Role handling must not use Supabase or network access"
else
  pass "Role handling adds no Supabase or network access"
fi

printf "\nD29R-18 ROLE-AWARE WORKSPACE VERIFICATION PASSED\n"
