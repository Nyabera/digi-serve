#!/usr/bin/env bash

set -euo pipefail

EXPECTED_ROOT="/Users/blaq/Downloads/faidia"
EXPECTED_BRANCH="feat/demo-engine-base"

REFERENCE_FILE="public/demo/references/homepage/primary-homepage-reference.png"
TYPE_FILE="types/demo/homepage-reference.ts"
CONFIG_FILE="config/demo/homepage-reference.ts"
PREVIEW_FILE="components/demo/homepages/homepage-reference-preview.tsx"
DEMO_PAGE="app/demo/page.tsx"
CLIENT_FILE="config/demo/clients/savannah-technical-college.ts"
DOCUMENT_FILE="docs/demo-engine-base/DEMO-ENGINE-HOMEPAGE-REFERENCE.md"
SCRIPT_FILE="scripts/verify-d10-homepage-reference.sh"

pass() {
  printf "PASS: %s\n" "$1"
}

fail() {
  printf "FAIL: %s\n" "$1" >&2
  exit 1
}

printf "\nFAIDIA D10 homepage-reference verification\n"
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
  "$REFERENCE_FILE"
  "$TYPE_FILE"
  "$CONFIG_FILE"
  "$PREVIEW_FILE"
  "$DEMO_PAGE"
  "$CLIENT_FILE"
  "$DOCUMENT_FILE"
  "$SCRIPT_FILE"
)

for REQUIRED_FILE in "${REQUIRED_FILES[@]}"; do
  [[ -f "$REQUIRED_FILE" ]] \
    && pass "File exists: $REQUIRED_FILE" \
    || fail "Missing file: $REQUIRED_FILE"
done

[[ -s "$REFERENCE_FILE" ]] \
  && pass "Homepage reference image is not empty" \
  || fail "Homepage reference image is empty"

if file "$REFERENCE_FILE" | grep -Fq "PNG image data"; then
  pass "Homepage reference is a valid PNG file"
else
  file "$REFERENCE_FILE" >&2
  fail "Homepage reference must be a real PNG image"
fi

REFERENCE_COUNT="$(
  find public/demo/references/homepage \
    -maxdepth 1 \
    -type f \
    -name "*.png" \
    | wc -l \
    | tr -d " "
)"

[[ "$REFERENCE_COUNT" -eq 1 ]] \
  && pass "Exactly one homepage reference PNG exists" \
  || fail "Expected exactly one homepage reference PNG but found $REFERENCE_COUNT"

REQUIRED_TYPE_TEXT=(
  "export interface DemoHomepageReference"
  'readonly approvalStatus: "APPROVED"'
  "readonly implementationPrinciples:"
  "readonly preserve:"
  "readonly avoid:"
)

for REQUIRED_TEXT in "${REQUIRED_TYPE_TEXT[@]}"; do
  grep -Fq "$REQUIRED_TEXT" "$TYPE_FILE" \
    && pass "Reference type found: $REQUIRED_TEXT" \
    || fail "Missing reference type: $REQUIRED_TEXT"
done

REQUIRED_CONFIG_TEXT=(
  'id: "primary-homepage-reference"'
  'approvalStatus: "APPROVED"'
  'primary-homepage-reference.png'
  "implementationPrinciples:"
  "preserve:"
  "avoid:"
)

for REQUIRED_TEXT in "${REQUIRED_CONFIG_TEXT[@]}"; do
  grep -Fq "$REQUIRED_TEXT" "$CONFIG_FILE" \
    && pass "Reference configuration found: $REQUIRED_TEXT" \
    || fail "Missing reference configuration: $REQUIRED_TEXT"
done

REQUIRED_PREVIEW_TEXT=(
  "PRIMARY_HOMEPAGE_REFERENCE"
  "HomepageReferencePreview"
  "Approved homepage reference"
  "object-contain"
)

for REQUIRED_TEXT in "${REQUIRED_PREVIEW_TEXT[@]}"; do
  grep -Fq "$REQUIRED_TEXT" "$PREVIEW_FILE" \
    && pass "Reference preview found: $REQUIRED_TEXT" \
    || fail "Missing reference preview: $REQUIRED_TEXT"
done

PAGE_REFERENCE_COUNT="$(
  grep -c "HomepageReferencePreview" "$DEMO_PAGE" || true
)"

[[ "$PAGE_REFERENCE_COUNT" -eq 2 ]] \
  && pass "Demo page has one preview import and one preview component" \
  || fail "Expected two HomepageReferencePreview references but found $PAGE_REFERENCE_COUNT"

grep -Fq '<HomepageReferencePreview />' "$DEMO_PAGE" \
  && pass "Demo homepage displays the approved reference" \
  || fail "Demo homepage does not display the approved reference"

grep -Fq 'availableVariants: ["A"]' "$CLIENT_FILE" \
  && pass "Only one homepage is configured" \
  || fail "Client configuration must contain one homepage"

grep -Fq "showVariantSwitcher: false" "$CLIENT_FILE" \
  && pass "Homepage switcher remains disabled" \
  || fail "Homepage switcher must remain disabled"

REQUIRED_DOCUMENT_TEXT=(
  "D10 attaches one approved homepage reference to the Demo Engine."
  "The reference is not the final homepage implementation."
  "D11 converts the approved reference into the working homepage."
  "The only approved screenshot is stored at:"
  "No additional homepage references are required."
  "The client-facing interface must not display Homepage A, B or C."
  "## 9. D10 definition of done"
)

for REQUIRED_TEXT in "${REQUIRED_DOCUMENT_TEXT[@]}"; do
  grep -Fq "$REQUIRED_TEXT" "$DOCUMENT_FILE" \
    && pass "Documentation rule found: $REQUIRED_TEXT" \
    || fail "Missing documentation rule: $REQUIRED_TEXT"
done

RUNTIME_FILES=(
  "$TYPE_FILE"
  "$CONFIG_FILE"
  "$PREVIEW_FILE"
  "$DEMO_PAGE"
)

if grep -nE \
  "from[[:space:]]+[\"'][^\"']*supabase|createClient\\(|supabase\\." \
  "${RUNTIME_FILES[@]}"; then
  fail "D10 runtime files must not import or call Supabase"
else
  pass "No Supabase runtime dependency found"
fi

UNEXPECTED_CHANGED_FILES=""

while IFS= read -r STATUS_LINE; do
  [[ -z "$STATUS_LINE" ]] && continue

  FILE_PATH="${STATUS_LINE:3}"

  case "$FILE_PATH" in
    "$REFERENCE_FILE"|\
    "$TYPE_FILE"|\
    "$CONFIG_FILE"|\
    "$PREVIEW_FILE"|\
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
  pass "Only D10-owned files are changed"
else
  printf "\nUnexpected changed files:\n%s\n" \
    "$UNEXPECTED_CHANGED_FILES" >&2
  fail "D10 contains files outside its approved boundary"
fi

bash -n "$SCRIPT_FILE"
pass "Verification script syntax is valid"

printf "\n==========================================\n"
printf "D10 VERIFICATION PASSED\n"
printf "The approved homepage reference is attached and ready for D11.\n\n"
