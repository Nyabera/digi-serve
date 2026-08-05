#!/usr/bin/env bash
#
# Verify D34-5 admin route-registry and role containment.
#

set -u
set -o pipefail

fail() {
  printf '\nFAIL: %s\n' "$1" >&2
  exit 1
}

for command_name in git grep awk sed sort find; do
  command -v "$command_name" >/dev/null 2>&1 \
    || fail "$command_name is unavailable."
done

ROOT="$(git rev-parse --show-toplevel 2>/dev/null)" \
  || fail "Run this inside the repository."
cd "$ROOT" || fail "Could not enter repository root."

CONTRACT="features/demo-engine/navigation/admin-navigation-contract.ts"
REGISTRY="features/demo-engine/navigation/demo-route-registry.ts"
TEST_FILE="tests/demo/unit/d34-admin-route-containment.test.ts"

for file in "$CONTRACT" "$REGISTRY" "$TEST_FILE"; do
  [ -f "$file" ] || fail "Missing required file: $file"
done

TMP_DIR="$(mktemp -d "${TMPDIR:-/tmp}/verify-d34-5.XXXXXX")" \
  || fail "Could not create temporary directory."
trap 'rm -rf "$TMP_DIR"' EXIT INT TERM

CONTRACT_ROUTES="$TMP_DIR/contract-routes.txt"
PAGE_CROSS="$TMP_DIR/page-cross.txt"
PAGE_REEXPORTS="$TMP_DIR/page-reexports.txt"
ADMIN_FEATURE_CROSS="$TMP_DIR/admin-feature-cross.txt"

grep -E '^[[:space:]]+[A-Za-z][A-Za-z0-9]*: "/demo/admin' \
  "$CONTRACT" \
  | sed -E 's/^[^"]*"([^"]+)".*$/\1/' \
  | LC_ALL=C sort -u > "$CONTRACT_ROUTES"

ROUTE_COUNT="$(wc -l < "$CONTRACT_ROUTES" | tr -d ' ')"
[ "$ROUTE_COUNT" -eq 21 ] \
  || fail "Expected 21 canonical admin routes; found $ROUTE_COUNT."

grep -q 'from "./admin-navigation-contract"' "$REGISTRY" \
  || fail "Route registry does not import the D34-1 contract."
grep -q 'home: ADMIN_ROUTE_HREFS.dashboard' "$REGISTRY" \
  || fail "Admin role home is not contract-derived."
grep -q 'workflows: ADMIN_ROUTE_HREFS.workflowBuilder' "$REGISTRY" \
  || fail "Existing workflows alias is not contract-derived."
grep -q '\.\.\.ADMIN_ROUTE_HREFS' "$REGISTRY" \
  || fail "Canonical admin routes are not registered."
grep -q 'legacyWorkflowBuilder: "/demo/admin/workflows/builder"' \
  "$REGISTRY" \
  || fail "Legacy workflow-builder route is not isolated for D34-6."

# Canonical page files must not navigate to another workspace.
find app/demo/admin -type f \
  \( -name 'page.tsx' -o -name 'page.ts' -o -name 'page.jsx' -o -name 'page.js' \) \
  -exec grep -nHE \
    '/demo/(officer|supervisor|department|applicant|public|reports)([/?#"]|$)' \
    {} + > "$PAGE_CROSS" 2>/dev/null || true

if [ -s "$PAGE_CROSS" ]; then
  cat "$PAGE_CROSS" >&2
  fail "An admin page contains a cross-workspace route reference."
fi

# Admin pages may reuse components, but may not re-export another workspace page.
find app/demo/admin -type f \
  \( -name 'page.tsx' -o -name 'page.ts' -o -name 'page.jsx' -o -name 'page.js' \) \
  -exec grep -nHE \
    'export[[:space:]]+\{[[:space:]]*default[[:space:]]*\}[[:space:]]+from[[:space:]]+["'\'']@?/?.*app/demo/(officer|supervisor|department|applicant|public)' \
    {} + > "$PAGE_REEXPORTS" 2>/dev/null || true

if [ -s "$PAGE_REEXPORTS" ]; then
  cat "$PAGE_REEXPORTS" >&2
  fail "An admin page re-exports another workspace page."
fi

# Admin-specific feature files must not contain direct navigation statements
# to another workspace. Text-only demo content is not treated as navigation.
: > "$ADMIN_FEATURE_CROSS"

for search_root in \
  features/demo-engine/dashboards/admin \
  features/demo-admin-workflows
do
  [ -d "$search_root" ] || continue

  find "$search_root" -type f \
    \( -name '*.ts' -o -name '*.tsx' -o -name '*.js' -o -name '*.jsx' \) \
    -exec grep -nHE \
      '(href[=:]|router\.(push|replace)|redirect|window\.location).*/demo/(officer|supervisor|department|applicant|public|reports)' \
      {} + >> "$ADMIN_FEATURE_CROSS" 2>/dev/null || true
done

if [ -s "$ADMIN_FEATURE_CROSS" ]; then
  cat "$ADMIN_FEATURE_CROSS" >&2
  fail "Admin feature code contains cross-workspace navigation."
fi

printf 'PASS: D34-1 remains the canonical admin route source.\n'
printf 'PASS: The shared demo registry exposes all 21 admin routes.\n'
printf 'PASS: Admin role home resolves to /demo/admin.\n'
printf 'PASS: Legacy workflow-builder URL is isolated for D34-6.\n'
printf 'PASS: Canonical admin pages contain no cross-workspace links.\n'
printf 'PASS: Canonical admin pages do not re-export other workspace pages.\n'
printf 'PASS: Admin feature navigation remains inside the admin workspace.\n'
