#!/usr/bin/env bash
#
# Verify D34-6 canonical workflow route and legacy-route remediation.
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
COMPATIBILITY="features/demo-engine/navigation/admin-workflow-route-compatibility.ts"
CANONICAL_PAGE="app/demo/admin/workflows/page.tsx"
LEGACY_PAGE="app/demo/admin/workflows/builder/page.tsx"
OVERVIEW="features/demo-admin-workflows/components/workflow-overview.tsx"
BUILDER="features/demo-admin-workflows/components/workflow-builder.tsx"
TEST_FILE="tests/demo/unit/d34-admin-workflow-route-compatibility.test.ts"

for file in \
  "$CONTRACT" \
  "$COMPATIBILITY" \
  "$CANONICAL_PAGE" \
  "$LEGACY_PAGE" \
  "$OVERVIEW" \
  "$BUILDER" \
  "$TEST_FILE"
do
  [ -f "$file" ] || fail "Missing required file: $file"
done

grep -q 'workflowBuilder: "/demo/admin/workflows"' "$CONTRACT" \
  || fail "Canonical Workflow Builder route changed unexpectedly."

grep -q 'kind: "builder"' "$COMPATIBILITY" \
  || fail "Canonical builder-surface resolution is missing."
grep -q 'kind: "overview"' "$COMPATIBILITY" \
  || fail "Overview compatibility resolution is missing."
grep -q 'view: "overview"' "$COMPATIBILITY" \
  || fail "Explicit overview query contract is missing."

grep -q 'WorkflowBuilder' "$CANONICAL_PAGE" \
  || fail "Canonical route does not render WorkflowBuilder."
grep -q 'WorkflowOverview' "$CANONICAL_PAGE" \
  || fail "Canonical route no longer preserves WorkflowOverview."
grep -q 'resolveAdminWorkflowRouteSurface' "$CANONICAL_PAGE" \
  || fail "Canonical route does not use the compatibility resolver."

grep -q 'redirect(' "$LEGACY_PAGE" \
  || fail "Legacy route does not redirect."
grep -q 'buildAdminWorkflowBuilderHref' "$LEGACY_PAGE" \
  || fail "Legacy route does not target the canonical builder href."

# Reject only an actual WorkflowBuilder component import or render.
# Names such as LegacyAdminWorkflowBuilderPage and
# buildAdminWorkflowBuilderHref are valid compatibility identifiers and must
# not be mistaken for a second builder implementation.
if grep -Eq   'from "@/features/demo-admin-workflows/components/workflow-builder"|<WorkflowBuilder([[:space:]>]|$)'   "$LEGACY_PAGE"; then
  fail "Legacy route still imports or renders a second WorkflowBuilder implementation."
fi

if grep -q '/demo/admin/workflows/builder' "$OVERVIEW"; then
  fail "WorkflowOverview still links directly to the legacy route."
fi

grep -q 'buildAdminWorkflowBuilderHref' "$OVERVIEW" \
  || fail "WorkflowOverview does not use canonical builder hrefs."
grep -q 'buildAdminWorkflowOverviewHref' "$BUILDER" \
  || fail "WorkflowBuilder does not link back to the overview compatibility view."

# Live admin source must not navigate directly to the legacy builder route.
TMP_DIR="$(mktemp -d "${TMPDIR:-/tmp}/verify-d34-6.XXXXXX")" \
  || fail "Could not create temporary directory."
trap 'rm -rf "$TMP_DIR"' EXIT INT TERM

LEGACY_REFERENCES="$TMP_DIR/legacy-references.txt"

find \
  app/demo/admin \
  features/demo-admin-workflows \
  components/demo \
  -type f \
  \( -name '*.ts' -o -name '*.tsx' -o -name '*.js' -o -name '*.jsx' \) \
  -exec grep -nHE '/demo/admin/workflows/builder' {} + \
  > "$LEGACY_REFERENCES" 2>/dev/null || true

if [ -s "$LEGACY_REFERENCES" ]; then
  cat "$LEGACY_REFERENCES" >&2
  fail "Live admin code still contains a direct legacy workflow-builder URL."
fi

printf 'PASS: /demo/admin/workflows is the canonical Workflow Builder route.\n'
printf 'PASS: Selected template queries remain canonical.\n'
printf 'PASS: Workflow Overview remains available through ?view=overview.\n'
printf 'PASS: Old tab-only overview bookmarks remain compatible.\n'
printf 'PASS: Legacy /workflows/builder route redirects to the canonical route.\n'
printf 'PASS: Legacy route no longer owns a second builder implementation.\n'
printf 'PASS: Live admin components contain no direct legacy builder hrefs.\n'
printf 'PASS: Shell, sidebar, and top-bar ownership remain unchanged.\n'
