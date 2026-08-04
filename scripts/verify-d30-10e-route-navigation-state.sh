#!/usr/bin/env bash
set -euo pipefail

ROOT="${FAIDIA_ROOT:-/Users/blaq/Downloads/faidia}"
EXPECTED_BRANCH="feat/demo-engine-base"
D30_DIR="docs/demo-engine-base/d30-freeze"

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
  "features/demo-engine/navigation/demo-route-registry.ts"
  "features/demo-engine/navigation/demo-navigation-state.ts"
  "features/demo-engine/navigation/index.ts"
  "components/demo/role-switch/demo-role-navigation-bridge.tsx"
  "app/demo/verify-certificate/page.tsx"
  "app/demo/applicant/profile/page.tsx"
  "app/demo/applicant/documents/page.tsx"
  "app/demo/officer/documents/page.tsx"
  "$D30_DIR/D30-10E-ROUTE-NAVIGATION-STATE.md"
  "$D30_DIR/D30-10E-CHECKLIST.md"
)

for file in "${required[@]}"; do
  [[ -s "$file" ]] || fail "Missing or empty file: $file"
done

pass "Required D30-10E files exist"

for route in \
  "/demo/verify-certificate" \
  "/demo/applicant/profile" \
  "/demo/applicant/documents" \
  "/demo/officer/documents" \
  "/demo/admin/workflows" \
  "/demo/admin/workflows/builder"; do
  grep -Fq "$route" \
    features/demo-engine/navigation/demo-route-registry.ts \
    || fail "Route registry is missing $route"
done

pass "All D30 feature routes are centrally registered"

grep -Fq "DEMO_ROLE_HOME_ROUTES" \
  components/demo/role-switch/demo-role-navigation-bridge.tsx \
  || fail "Role bridge does not consume the route registry"

grep -Fq "resolveDemoRoleFromPath" \
  components/demo/role-switch/demo-role-navigation-bridge.tsx \
  || fail "Role bridge does not resolve role state from pathname"

grep -Fq "DemoRoleNavigationBridge" \
  app/demo/layout.tsx \
  || fail "Demo layout does not mount the role bridge"

pass "Role navigation and route-state bridge are connected"

grep -Fq 'href: "/demo/track"' \
  features/demo-applicant/components/applicant-workspace-shell.tsx \
  || fail "Applicant My Requests route is missing"

grep -Fq 'href: "/demo/applicant/documents"' \
  features/demo-applicant/components/applicant-workspace-shell.tsx \
  || fail "Applicant My Documents route is missing"

grep -Fq 'href: "/demo/applicant/profile"' \
  features/demo-applicant/components/applicant-workspace-shell.tsx \
  || fail "Applicant My Profile route is missing"

grep -Fq "/demo/officer/documents" \
  components/demo/internal-shell/internal-navigation.ts \
  || fail "Officer Documents Hub route is missing"

pass "Applicant and Officer workspace navigation is connected"

python3 - <<'PY'
from pathlib import Path
import re

path = Path(
    "components/demo/homepage/savannah-homepage.tsx"
)
source = path.read_text(encoding="utf-8")

route = 'href="/demo/verify-certificate"'
count = source.count(route)

if count != 1:
    raise SystemExit(
        "FAIL: Expected exactly one homepage verification "
        f"link; found {count}."
    )

footer = re.search(
    r"<footer\b[\s\S]*?</footer>",
    source,
)

if not footer or route not in footer.group(0):
    raise SystemExit(
        "FAIL: Verification link is not inside the homepage footer."
    )

before_footer = source[: footer.start()]

if route in before_footer:
    raise SystemExit(
        "FAIL: Verification link still appears before the footer."
    )

print("PASS: Verify Certificate appears in the homepage footer only")
PY

grep -Fq 'applicant: DEMO_ROUTES.applicant.home' \
  features/demo-engine/navigation/demo-route-registry.ts \
  || fail "Applicant role-home mapping is missing"

grep -Fq 'officer: DEMO_ROUTES.officer.home' \
  features/demo-engine/navigation/demo-route-registry.ts \
  || fail "Officer role-home mapping is missing"

grep -Fq 'supervisor: DEMO_ROUTES.supervisor.home' \
  features/demo-engine/navigation/demo-route-registry.ts \
  || fail "Supervisor role-home mapping is missing"

grep -Fq 'admin: DEMO_ROUTES.admin.home' \
  features/demo-engine/navigation/demo-route-registry.ts \
  || fail "Admin role-home mapping is missing"

pass "All role-switch destinations are centralized"

npm run demo:validate -- tvet
pass "TVET Demo Pack passes configuration validation"

git diff --check
pass "Git whitespace validation passed"

printf '\nD30-10E route, navigation and Demo-state verification passed.\n'
