#!/usr/bin/env bash

set -euo pipefail

EXPECTED_ROOT="/Users/blaq/Downloads/faidia"
EXPECTED_BRANCH="feat/demo-engine-base"

ROUTE_FILE="app/demo/apply/[serviceSlug]/page.tsx"
FORM_FILE="components/demo/forms/configured-service-form.tsx"
UPLOADER_FILE="components/demo/documents/simulated-document-uploader.tsx"
PUBLIC_PAGE_FILE="components/demo/public/service-documents-page.tsx"
DOCUMENT_FILE="docs/demo-engine-base/DEMO-ENGINE-DOCUMENT-SELECTION.md"
SCRIPT_FILE="scripts/verify-d18-document-selection.sh"

pass() {
  printf "PASS: %s\n" "$1"
}

fail() {
  printf "FAIL: %s\n" "$1" >&2
  exit 1
}

printf "\nFAIDIA D18 document-selection verification\n"
printf "==========================================\n\n"

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
  "$ROUTE_FILE"
  "$FORM_FILE"
  "$UPLOADER_FILE"
  "$PUBLIC_PAGE_FILE"
  "$DOCUMENT_FILE"
  "$SCRIPT_FILE"
)

for REQUIRED_FILE in "${REQUIRED_FILES[@]}"; do
  [[ -f "$REQUIRED_FILE" ]] \
    && pass "File exists: $REQUIRED_FILE" \
    || fail "Missing file: $REQUIRED_FILE"
done

REQUIRED_ROUTE_TEXT=(
  "searchParams: Promise"
  'requestedStep === "documents"'
  "ServiceDocumentsPage"
  "ServiceApplicationPage"
  "notFound()"
)

for REQUIRED_TEXT in "${REQUIRED_ROUTE_TEXT[@]}"; do
  grep -Fq "$REQUIRED_TEXT" "$ROUTE_FILE" \
    && pass "Application route capability found: $REQUIRED_TEXT" \
    || fail "Missing application route capability: $REQUIRED_TEXT"
done

grep -Fq \
  'router.push(`/demo/apply/${service.slug}?step=documents`)' \
  "$FORM_FILE" \
  && pass "D17 form continues to the D18 document step" \
  || fail "D17 form must continue to the D18 document step"

REQUIRED_UPLOADER_TEXT=(
  '"use client"'
  "useDemoState"
  'const DOCUMENT_FIELD_PREFIX = "__document:"'
  'type: "SET_FORM_VALUE"'
  "requirement.acceptedFileTypes.includes(file.type)"
  "requirement.maximumSizeMb * 1024 * 1024"
  "requirement.replacementAllowed"
  'requirement.level === "REQUIRED"'
  "JSON.stringify(metadata)"
  "Continue to review"
  'router.push('
  'confirmation?service=${service.slug}'
  "File contents are not persisted."
)

for REQUIRED_TEXT in "${REQUIRED_UPLOADER_TEXT[@]}"; do
  grep -Fq "$REQUIRED_TEXT" "$UPLOADER_FILE" \
    && pass "Document capability found: $REQUIRED_TEXT" \
    || fail "Missing document capability: $REQUIRED_TEXT"
done

REQUIRED_PUBLIC_PAGE_TEXT=(
  "DemoPublicShell"
  "SimulatedDocumentUploader"
  "Step 3 of 3"
  "Document summary"
  "No file bytes are uploaded to Supabase Storage"
  "Use sample files only"
)

for REQUIRED_TEXT in "${REQUIRED_PUBLIC_PAGE_TEXT[@]}"; do
  grep -Fq "$REQUIRED_TEXT" "$PUBLIC_PAGE_FILE" \
    && pass "Document page content found: $REQUIRED_TEXT" \
    || fail "Missing document page content: $REQUIRED_TEXT"
done

REQUIRED_DOCUMENT_TEXT=(
  "D18 adds simulated document selection and replacement to the applicant request journey."
  'The stage validates the configured document requirements without uploading real file contents.'
  '`__document:[documentRequirementId]`'
  "The selected file bytes are not placed in shared state or session storage."
  "## 9. D18 definition of done"
)

for REQUIRED_TEXT in "${REQUIRED_DOCUMENT_TEXT[@]}"; do
  grep -Fq "$REQUIRED_TEXT" "$DOCUMENT_FILE" \
    && pass "Documentation rule found: $REQUIRED_TEXT" \
    || fail "Missing documentation rule: $REQUIRED_TEXT"
done

RUNTIME_FILES=(
  "$ROUTE_FILE"
  "$FORM_FILE"
  "$UPLOADER_FILE"
  "$PUBLIC_PAGE_FILE"
)

if grep -nE \
  "from[[:space:]]+[\"'][^\"']*supabase|createClient\\(|supabase\\." \
  "${RUNTIME_FILES[@]}"; then
  fail "D18 runtime files must not import or call Supabase"
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
    "$ROUTE_FILE"|\
    "$FORM_FILE"|\
    "$UPLOADER_FILE"|\
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
  pass "Only D18-owned files are changed"
else
  printf "\nUnexpected changed files:\n%s\n" \
    "$UNEXPECTED_CHANGED_FILES" >&2
  fail "D18 contains files outside its approved boundary"
fi

bash -n "$SCRIPT_FILE"
pass "Verification script syntax is valid"

printf "\n==========================================\n"
printf "D18 VERIFICATION PASSED\n"
printf "The simulated document-selection step is ready.\n\n"
