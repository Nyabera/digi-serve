#!/usr/bin/env bash

set -euo pipefail

EXPECTED_ROOT="/Users/blaq/Downloads/faidia"
EXPECTED_BRANCH="feat/demo-engine-base"

TYPE_FILE="types/demo/demo-state.ts"
SEED_FILE="features/demo/state/demo-seed.ts"
REDUCER_FILE="features/demo/state/demo-reducer.ts"
SELECTOR_FILE="features/demo/state/demo-selectors.ts"
CONTEXT_FILE="features/demo/state/demo-state-context.tsx"
INDEX_FILE="features/demo/state/index.ts"
LAYOUT_FILE="app/demo/layout.tsx"
SUMMARY_FILE="components/demo/shared/demo-state-summary.tsx"
DEMO_PAGE="app/demo/page.tsx"
DOCUMENT_FILE="docs/demo-engine-base/DEMO-ENGINE-STATE.md"
SCRIPT_FILE="scripts/verify-d7-demo-state.sh"

pass() {
  printf "PASS: %s\n" "$1"
}

fail() {
  printf "FAIL: %s\n" "$1" >&2
  exit 1
}

printf "\nFAIDIA D7 state verification\n"
printf "============================\n\n"

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
  "$SEED_FILE"
  "$REDUCER_FILE"
  "$SELECTOR_FILE"
  "$CONTEXT_FILE"
  "$INDEX_FILE"
  "$LAYOUT_FILE"
  "$SUMMARY_FILE"
  "$DEMO_PAGE"
  "$DOCUMENT_FILE"
  "$SCRIPT_FILE"
)

for REQUIRED_FILE in "${REQUIRED_FILES[@]}"; do
  [[ -f "$REQUIRED_FILE" ]] \
    && pass "File exists: $REQUIRED_FILE" \
    || fail "Missing file: $REQUIRED_FILE"
done

REQUIRED_TYPE_TEXT=(
  "export interface DemoEngineState"
  "export interface DemoRequestRecord"
  "export interface DemoWorkItemRecord"
  "export interface DemoHandoffRecord"
  "export interface DemoApprovalRecord"
  "export interface DemoOutcomeRecord"
  "export type DemoStateAction"
  "readonly schemaVersion: 1"
)

for REQUIRED_TEXT in "${REQUIRED_TYPE_TEXT[@]}"; do
  grep -Fq "$REQUIRED_TEXT" "$TYPE_FILE" \
    && pass "State type found: $REQUIRED_TEXT" \
    || fail "Missing state type: $REQUIRED_TEXT"
done

REQUIRED_SEED_TEXT=(
  'activeRequestId: "REQ-DEMO-001"'
  'activeHandoffId: "HND-DEMO-001"'
  'id: "REQ-DEMO-004"'
  'id: "HND-DEMO-001"'
  'status: "PENDING_ACCEPTANCE"'
  'status: "COMPLETED"'
  'status: "ISSUED"'
)

for REQUIRED_TEXT in "${REQUIRED_SEED_TEXT[@]}"; do
  grep -Fq "$REQUIRED_TEXT" "$SEED_FILE" \
    && pass "Seed value found: $REQUIRED_TEXT" \
    || fail "Missing seed value: $REQUIRED_TEXT"
done

REQUIRED_REDUCER_TEXT=(
  'case "SET_HOMEPAGE_VARIANT"'
  'case "SET_ACTIVE_ROLE"'
  'case "UPDATE_REQUEST_STATUS"'
  'case "ADD_HANDOFF"'
  'case "UPDATE_HANDOFF_STATUS"'
  'case "RECORD_APPROVAL"'
  'case "ISSUE_OUTCOME"'
  'case "RESET_DEMO"'
)

for REQUIRED_TEXT in "${REQUIRED_REDUCER_TEXT[@]}"; do
  grep -Fq "$REQUIRED_TEXT" "$REDUCER_FILE" \
    && pass "Reducer action found: $REQUIRED_TEXT" \
    || fail "Missing reducer action: $REQUIRED_TEXT"
done

grep -Fq '"use client"' "$CONTEXT_FILE" \
  && pass "State provider is a client component" \
  || fail "State provider must be a client component"

grep -Fq "useReducer" "$CONTEXT_FILE" \
  && pass "State provider uses useReducer" \
  || fail "State provider does not use useReducer"

grep -Fq "createContext" "$CONTEXT_FILE" \
  && pass "State provider uses React Context" \
  || fail "State provider does not use React Context"

grep -Fq "sessionStorage" "$CONTEXT_FILE" \
  && pass "Session storage persistence exists" \
  || fail "Session storage persistence is missing"

grep -Fq "faidia.demo-engine.state.v1" "$CONTEXT_FILE" \
  && pass "Versioned storage key exists" \
  || fail "Versioned storage key is missing"

grep -Fq "DemoStateProvider" "$LAYOUT_FILE" \
  && pass "Demo layout installs the provider" \
  || fail "Demo layout does not install the provider"

grep -Fq "DemoStateSummary" "$DEMO_PAGE" \
  && pass "Demo index consumes shared state" \
  || fail "Demo index does not consume shared state"

grep -Fq "useDemoState" "$SUMMARY_FILE" \
  && pass "State summary reads the shared context" \
  || fail "State summary does not read shared context"

REQUIRED_DOCUMENT_TEXT=(
  "The engine uses React Context and \`useReducer\`."
  "One applicant-facing request remains the parent record."
  "The dashboards must not begin empty."
  "It is not the production source of truth."
  "## 8. D7 definition of done"
)

for REQUIRED_TEXT in "${REQUIRED_DOCUMENT_TEXT[@]}"; do
  grep -Fq "$REQUIRED_TEXT" "$DOCUMENT_FILE" \
    && pass "Documentation rule found: $REQUIRED_TEXT" \
    || fail "Missing documentation rule: $REQUIRED_TEXT"
done

RUNTIME_FILES=(
  "$TYPE_FILE"
  "$SEED_FILE"
  "$REDUCER_FILE"
  "$SELECTOR_FILE"
  "$CONTEXT_FILE"
  "$INDEX_FILE"
  "$LAYOUT_FILE"
  "$SUMMARY_FILE"
  "$DEMO_PAGE"
)

if grep -nE \
  'from ["'\''][^"'\'']*supabase|createClient\(|supabase\.' \
  "${RUNTIME_FILES[@]}"; then
  fail "D7 runtime files must not import or call Supabase"
else
  pass "No Supabase runtime dependency found"
fi

UNEXPECTED_CHANGED_FILES=""

while IFS= read -r STATUS_LINE; do
  [[ -z "$STATUS_LINE" ]] && continue

  FILE_PATH="${STATUS_LINE:3}"

  case "$FILE_PATH" in
    "$TYPE_FILE"|\
    "$SEED_FILE"|\
    "$REDUCER_FILE"|\
    "$SELECTOR_FILE"|\
    "$CONTEXT_FILE"|\
    "$INDEX_FILE"|\
    "$LAYOUT_FILE"|\
    "$SUMMARY_FILE"|\
    "$DEMO_PAGE"|\
    "$DOCUMENT_FILE"|\
    "$SCRIPT_FILE")
      ;;
    *)
      UNEXPECTED_CHANGED_FILES+="${FILE_PATH}"$'\n'
      ;;
  esac
done < <(git status --porcelain=v1 --untracked-files=all)

if [[ -z "$UNEXPECTED_CHANGED_FILES" ]]; then
  pass "Only D7-owned files are changed"
else
  printf "\nUnexpected changed files:\n%s\n" "$UNEXPECTED_CHANGED_FILES" >&2
  fail "D7 contains files outside its approved boundary"
fi

bash -n "$SCRIPT_FILE"
pass "Verification script syntax is valid"

printf "\n============================\n"
printf "D7 VERIFICATION PASSED\n"
printf "The shared Demo Engine state is ready for technical checks.\n\n"
