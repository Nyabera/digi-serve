#!/usr/bin/env bash

set -euo pipefail

EXPECTED_ROOT="/Users/blaq/Downloads/faidia"
EXPECTED_BRANCH="feat/demo-engine-base"

PAGE_FILE="app/demo/apply/[serviceSlug]/page.tsx"
FIELD_FILE="components/demo/forms/configured-form-field.tsx"
FORM_FILE="components/demo/forms/configured-service-form.tsx"
PUBLIC_PAGE_FILE="components/demo/public/service-application-page.tsx"
DOCUMENT_FILE="docs/demo-engine-base/DEMO-ENGINE-APPLICATION-FORM.md"
SCRIPT_FILE="scripts/verify-d17-application-form.sh"

pass() { printf "PASS: %s\n" "$1"; }
fail() { printf "FAIL: %s\n" "$1" >&2; exit 1; }

printf "\nFAIDIA D17 application-form verification\n"
printf "========================================\n\n"

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
  "$PAGE_FILE"
  "$FIELD_FILE"
  "$FORM_FILE"
  "$PUBLIC_PAGE_FILE"
  "$DOCUMENT_FILE"
  "$SCRIPT_FILE"
)

for REQUIRED_FILE in "${REQUIRED_FILES[@]}"; do
  [[ -f "$REQUIRED_FILE" ]] \
    && pass "File exists: $REQUIRED_FILE" \
    || fail "Missing file: $REQUIRED_FILE"
done

REQUIRED_PAGE_TEXT=(
  "params: Promise"
  "candidate.active"
  "notFound()"
  "ServiceApplicationPage"
)

for REQUIRED_TEXT in "${REQUIRED_PAGE_TEXT[@]}"; do
  grep -Fq "$REQUIRED_TEXT" "$PAGE_FILE" \
    && pass "Application route capability found: $REQUIRED_TEXT" \
    || fail "Missing application route capability: $REQUIRED_TEXT"
done

REQUIRED_FIELD_TEXT=(
  'field.type === "CHECKBOX"'
  'field.type === "DECLARATION"'
  'field.type === "SELECT"'
  'field.type === "TEXTAREA"'
  'field.type === "EMAIL"'
  'field.type === "PHONE"'
  'field.type === "YEAR"'
  "field.options?.map"
)

for REQUIRED_TEXT in "${REQUIRED_FIELD_TEXT[@]}"; do
  grep -Fq "$REQUIRED_TEXT" "$FIELD_FILE" \
    && pass "Configured field support found: $REQUIRED_TEXT" \
    || fail "Missing configured field support: $REQUIRED_TEXT"
done

REQUIRED_FORM_TEXT=(
  '"use client"'
  "useDemoState"
  'type: "SET_FORM_VALUE"'
  "service.form.sections.map"
  "requiredFields.filter"
  "completionPercentage"
  "Continue to review"
  'name: "request_started"'
  "router.push("
)

for REQUIRED_TEXT in "${REQUIRED_FORM_TEXT[@]}"; do
  grep -Fq "$REQUIRED_TEXT" "$FORM_FILE" \
    && pass "Configured form capability found: $REQUIRED_TEXT" \
    || fail "Missing configured form capability: $REQUIRED_TEXT"
done

REQUIRED_PUBLIC_TEXT=(
  "DemoPublicShell"
  "ConfiguredServiceForm"
  "Step 2 of 3"
  "Form summary"
  "Synthetic draft only"
)

for REQUIRED_TEXT in "${REQUIRED_PUBLIC_TEXT[@]}"; do
  grep -Fq "$REQUIRED_TEXT" "$PUBLIC_PAGE_FILE" \
    && pass "Application page content found: $REQUIRED_TEXT" \
    || fail "Missing application page content: $REQUIRED_TEXT"
done

REQUIRED_DOCUMENT_TEXT=(
  "D17 replaces the application-form placeholder with one configurable form renderer."
  'Every field change dispatches the typed `SET_FORM_VALUE` action.'
  "D17 validates all configured required fields before continuation."
  "D17 does not write a production draft request."
  "## 8. D17 definition of done"
)

for REQUIRED_TEXT in "${REQUIRED_DOCUMENT_TEXT[@]}"; do
  grep -Fq "$REQUIRED_TEXT" "$DOCUMENT_FILE" \
    && pass "Documentation rule found: $REQUIRED_TEXT" \
    || fail "Missing documentation rule: $REQUIRED_TEXT"
done

RUNTIME_FILES=(
  "$PAGE_FILE"
  "$FIELD_FILE"
  "$FORM_FILE"
  "$PUBLIC_PAGE_FILE"
)

if grep -nE \
  "from[[:space:]]+[\"'][^\"']*supabase|createClient\\(|supabase\\." \
  "${RUNTIME_FILES[@]}"; then
  fail "D17 runtime files must not import or call Supabase"
else
  pass "No Supabase runtime dependency found"
fi

PAGE_COUNT="$(
  find app/demo -type f -name "page.tsx" | wc -l | tr -d " "
)"

[[ "$PAGE_COUNT" -eq 14 ]] \
  && pass "The 14-route inventory remains intact" \
  || fail "Expected 14 route pages but found $PAGE_COUNT"

UNEXPECTED_CHANGED_FILES=""

while IFS= read -r STATUS_LINE; do
  [[ -z "$STATUS_LINE" ]] && continue

  FILE_PATH="${STATUS_LINE:3}"

  case "$FILE_PATH" in
    "$PAGE_FILE"|\
    "$FIELD_FILE"|\
    "$FORM_FILE"|\
    "$PUBLIC_PAGE_FILE"|\
    "$DOCUMENT_FILE"|\
    "$SCRIPT_FILE")
      ;;
    *)
      UNEXPECTED_CHANGED_FILES+="${FILE_PATH}"$'\n'
      ;;
  esac
done < <(git status --porcelain=v1 --untracked-files=all)

if [[ -z "$UNEXPECTED_CHANGED_FILES" ]]; then
  pass "Only D17-owned files are changed"
else
  printf "\nUnexpected changed files:\n%s\n" \
    "$UNEXPECTED_CHANGED_FILES" >&2
  fail "D17 contains files outside its approved boundary"
fi

bash -n "$SCRIPT_FILE"
pass "Verification script syntax is valid"

printf "\n========================================\n"
printf "D17 VERIFICATION PASSED\n"
printf "The configurable service application form is ready.\n\n"
