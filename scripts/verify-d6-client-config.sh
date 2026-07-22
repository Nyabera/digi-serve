#!/usr/bin/env bash

set -euo pipefail

EXPECTED_ROOT="/Users/blaq/Downloads/faidia"
EXPECTED_BRANCH="feat/demo-engine-base"

TYPE_FILE="types/demo/client-config.ts"
CLIENT_FILE="config/demo/clients/savannah-technical-college.ts"
REGISTRY_FILE="config/demo/client-registry.ts"
INDEX_FILE="config/demo/index.ts"
SUMMARY_COMPONENT="components/demo/shared/demo-client-config-summary.tsx"
PLACEHOLDER_COMPONENT="components/demo/shared/demo-route-placeholder.tsx"
DEMO_INDEX="app/demo/page.tsx"
DOCUMENT_FILE="docs/demo-engine-base/DEMO-ENGINE-CLIENT-CONFIG.md"
SCRIPT_FILE="scripts/verify-d6-client-config.sh"

pass() {
  printf "PASS: %s\n" "$1"
}

fail() {
  printf "FAIL: %s\n" "$1" >&2
  exit 1
}

printf "\nFAIDIA D6 client configuration verification\n"
printf "===========================================\n\n"

[[ "$(pwd)" == "$EXPECTED_ROOT" ]] \
  && pass "Current directory is correct" \
  || fail "Run this script from $EXPECTED_ROOT"

[[ "$(git rev-parse --show-toplevel 2>/dev/null)" == "$EXPECTED_ROOT" ]] \
  && pass "Git repository root is correct" \
  || fail "Git repository root is incorrect"

[[ "$(git branch --show-current)" == "$EXPECTED_BRANCH" ]] \
  && pass "Current branch is $EXPECTED_BRANCH" \
  || fail "Expected branch $EXPECTED_BRANCH"

REQUIRED_FILES=(
  "$TYPE_FILE"
  "$CLIENT_FILE"
  "$REGISTRY_FILE"
  "$INDEX_FILE"
  "$SUMMARY_COMPONENT"
  "$PLACEHOLDER_COMPONENT"
  "$DEMO_INDEX"
  "$DOCUMENT_FILE"
  "$SCRIPT_FILE"
)

for REQUIRED_FILE in "${REQUIRED_FILES[@]}"; do
  [[ -f "$REQUIRED_FILE" ]] \
    && pass "File exists: $REQUIRED_FILE" \
    || fail "Missing file: $REQUIRED_FILE"
done

REQUIRED_TYPE_TEXT=(
  "export interface DemoClientConfig"
  "export interface DemoServiceConfig"
  "export interface DemoWorkflowConfig"
  "export interface DemoReportConfig"
  "export type DemoHomepageVariant = \"A\" | \"B\" | \"C\""
  "readonly schemaVersion: 1"
)

for REQUIRED_TEXT in "${REQUIRED_TYPE_TEXT[@]}"; do
  grep -Fq "$REQUIRED_TEXT" "$TYPE_FILE" \
    && pass "Type boundary found: $REQUIRED_TEXT" \
    || fail "Missing type boundary: $REQUIRED_TEXT"
done

REQUIRED_CLIENT_TEXT=(
  'name: "Savannah Technical College"'
  'id: "student-records"'
  'id: "finance"'
  'id: "registrar"'
  'slug: "transcript-request"'
  'slug: "student-clearance"'
  'slug: "certificate-replacement"'
  'defaultVariant: "A"'
  'availableVariants: ["A", "B", "C"]'
  'workflowId: "workflow-transcript-request"'
  'publicStatus: "Additional Checks in Progress"'
  'outcomeLabel: "Transcript Request Completion Notice"'
)

for REQUIRED_TEXT in "${REQUIRED_CLIENT_TEXT[@]}"; do
  grep -Fq "$REQUIRED_TEXT" "$CLIENT_FILE" \
    && pass "Client configuration found: $REQUIRED_TEXT" \
    || fail "Missing client configuration: $REQUIRED_TEXT"
done

REQUIRED_REGISTRY_TEXT=(
  'DEFAULT_DEMO_CLIENT_SLUG'
  'DEMO_CLIENTS'
  'getDemoClient'
  'getDefaultDemoClient'
  'listDemoClients'
)

for REQUIRED_TEXT in "${REQUIRED_REGISTRY_TEXT[@]}"; do
  grep -Fq "$REQUIRED_TEXT" "$REGISTRY_FILE" \
    && pass "Registry capability found: $REQUIRED_TEXT" \
    || fail "Missing registry capability: $REQUIRED_TEXT"
done

grep -Fq "getDefaultDemoClient" "$DEMO_INDEX" \
  && pass "Demo index consumes the default client" \
  || fail "Demo index does not consume the default client"

grep -Fq "DemoClientConfigSummary" "$DEMO_INDEX" \
  && pass "Demo index renders the configuration summary" \
  || fail "Demo index does not render the configuration summary"

grep -Fq "getDefaultDemoClient" "$PLACEHOLDER_COMPONENT" \
  && pass "Shared route placeholder consumes the default client" \
  || fail "Shared route placeholder does not consume the default client"

REQUIRED_DOCUMENT_TEXT=(
  "Client-specific differences must be configuration-driven."
  "D6 uses static TypeScript configuration and does not write to Supabase."
  "Three services are configured."
  "## 9. D6 definition of done"
)

for REQUIRED_TEXT in "${REQUIRED_DOCUMENT_TEXT[@]}"; do
  grep -Fq "$REQUIRED_TEXT" "$DOCUMENT_FILE" \
    && pass "Documentation rule found: $REQUIRED_TEXT" \
    || fail "Missing documentation rule: $REQUIRED_TEXT"
done

RUNTIME_FILES=(
  "$TYPE_FILE"
  "$CLIENT_FILE"
  "$REGISTRY_FILE"
  "$INDEX_FILE"
  "$SUMMARY_COMPONENT"
  "$PLACEHOLDER_COMPONENT"
  "$DEMO_INDEX"
)

if grep -nE \
  'from ["'\''][^"'\'']*supabase|createClient\(|supabase\.' \
  "${RUNTIME_FILES[@]}"; then
  fail "D6 runtime files must not import or call Supabase"
else
  pass "No Supabase runtime dependency found"
fi

UNEXPECTED_CHANGED_FILES=""

while IFS= read -r STATUS_LINE; do
  [[ -z "$STATUS_LINE" ]] && continue

  FILE_PATH="${STATUS_LINE:3}"

  case "$FILE_PATH" in
    "$TYPE_FILE"|\
    "$CLIENT_FILE"|\
    "$REGISTRY_FILE"|\
    "$INDEX_FILE"|\
    "$SUMMARY_COMPONENT"|\
    "$PLACEHOLDER_COMPONENT"|\
    "$DEMO_INDEX"|\
    "$DOCUMENT_FILE"|\
    "$SCRIPT_FILE")
      ;;
    *)
      UNEXPECTED_CHANGED_FILES+="${FILE_PATH}"$'\n'
      ;;
  esac
done < <(git status --porcelain=v1 --untracked-files=all)

if [[ -z "$UNEXPECTED_CHANGED_FILES" ]]; then
  pass "Only D6-owned files are changed"
else
  printf "\nUnexpected changed files:\n%s\n" "$UNEXPECTED_CHANGED_FILES" >&2
  fail "D6 contains files outside its approved boundary"
fi

bash -n "$SCRIPT_FILE"
pass "Verification script syntax is valid"

printf "\n===========================================\n"
printf "D6 VERIFICATION PASSED\n"
printf "The client configuration system is ready for technical checks.\n\n"
