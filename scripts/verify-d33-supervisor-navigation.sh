#!/usr/bin/env bash
set -Eeuo pipefail

# Reusable D33-6 verification command.
# Run from the repository root.

EXPECTED_BRANCH="demo/d33-supervisor-navigation-consolidation"

fail() {
  printf '\nFAIL: %s\n' "$*" >&2
  exit 1
}

info() {
  printf '\n==> %s\n' "$*"
}

git rev-parse --show-toplevel >/dev/null 2>&1 ||
  fail "Run this verifier from inside the digi-serve repository."

cd "$(git rev-parse --show-toplevel)"

[[ "$(git branch --show-current)" == "$EXPECTED_BRANCH" ]] ||
  fail "Expected branch $EXPECTED_BRANCH."

for command_name in npm node git; do
  command -v "$command_name" >/dev/null 2>&1 ||
    fail "Required command '$command_name' is unavailable."
done

if [[ ! -x node_modules/.bin/vitest ]] ||
   [[ ! -x node_modules/.bin/tsc ]] ||
   [[ ! -x node_modules/.bin/eslint ]] ||
   [[ ! -x node_modules/.bin/playwright ]]; then
  info "Installing locked project dependencies with npm ci"
  npm ci
fi

info "Verifying the 13 canonical supervisor page files"
node <<'NODE_ROUTES'
const fs = require("node:fs");
const path = require("node:path");

const routes = [
  "",
  "department-queue",
  "unassigned-work",
  "team-workload",
  "approval-queue",
  "escalations",
  "department-handoffs",
  "shared-work",
  "sla-monitor",
  "overdue-work",
  "officer-performance",
  "department-reports",
  "audit-trail",
];

for (const route of routes) {
  const pagePath = route
    ? path.join(
        "app",
        "demo",
        "supervisor",
        route,
        "page.tsx",
      )
    : path.join(
        "app",
        "demo",
        "supervisor",
        "page.tsx",
      );

  if (!fs.existsSync(pagePath)) {
    throw new Error(`Missing canonical supervisor page: ${pagePath}`);
  }
}

console.log(`PASS: ${routes.length} canonical supervisor pages exist.`);
NODE_ROUTES

info "Running D33-1 through D33-5 focused unit tests"
npm test -- \
  tests/demo/unit/supervisor-navigation-contract.test.ts \
  tests/demo/unit/supervisor-route-surface.test.ts \
  tests/demo/unit/supervisor-shell-ownership.test.ts \
  tests/demo/unit/supervisor-navigation-activation.test.ts \
  tests/demo/unit/supervisor-link-consolidation.test.ts

info "Running TypeScript checks"
npm run typecheck

info "Running focused lint checks"
npx eslint \
  features/demo-engine/navigation/supervisor-navigation-contract.ts \
  components/demo/internal-shell/internal-navigation.ts \
  components/demo/internal-shell/internal-sidebar.tsx \
  features/demo/roles/demo-workspace-role.tsx \
  features/demo-engine/dashboards/data/supervisor-dashboard.adapter.ts \
  features/demo-engine/fixtures/supervisor-approvals.reference.ts \
  features/demo-operations/components/supervisor-route-surface.tsx \
  tests/demo/unit/supervisor-navigation-contract.test.ts \
  tests/demo/unit/supervisor-route-surface.test.ts \
  tests/demo/unit/supervisor-shell-ownership.test.ts \
  tests/demo/unit/supervisor-navigation-activation.test.ts \
  tests/demo/unit/supervisor-link-consolidation.test.ts \
  tests/acceptance/d33/supervisor-navigation-shell.pw.ts \
  playwright.d33.config.ts

info "Running production build"
npm run build

info "Running D33-6 browser acceptance"
npx playwright test --config=playwright.d33.config.ts

printf '\nPASS: D33-6 verification completed successfully.\n'
printf 'Canonical routes: 13\n'
printf 'Navigation groups: 5\n'
printf 'Visible navigation items: 14\n'
printf 'Canonical route items: 13\n'
printf 'Actions: 1\n'
printf 'Desktop browser acceptance: pass\n'
printf 'Mobile browser acceptance: pass\n'
printf 'Legacy approval ownership: pass\n'
printf 'Shell preservation: pass\n'
