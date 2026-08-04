#!/usr/bin/env bash

set -euo pipefail

EXPECTED_ROOT="/Users/blaq/Downloads/faidia"
EXPECTED_BRANCH="feat/demo-engine-base"

RUNTIME_FILES=(
  "components/demo/homepages/primary-homepage.tsx"
  "components/demo/homepages/homepage-request-status.tsx"
  "components/demo/homepages/homepage-service-list.tsx"
  "components/demo/homepages/homepage-process.tsx"
  "components/demo/homepages/homepage-faq.tsx"
  "components/demo/homepages/index.ts"
  "app/demo/page.tsx"
)

REQUIRED_FILES=(
  "components/demo/homepages/primary-homepage.tsx"
  "components/demo/homepages/homepage-request-status.tsx"
  "components/demo/homepages/homepage-service-list.tsx"
  "components/demo/homepages/homepage-process.tsx"
  "components/demo/homepages/homepage-faq.tsx"
  "components/demo/homepages/index.ts"
  "app/demo/page.tsx"
  "docs/demo-engine-base/DEMO-ENGINE-HOMEPAGE.md"
  "scripts/verify-d11-homepage.sh"
)

pass() {
  printf "PASS: %s\n" "$1"
}

fail() {
  printf "FAIL: %s\n" "$1" >&2
  exit 1
}

printf "\nFAIDIA D11 homepage verification\n"
printf "================================\n\n"

[[ "$(pwd)" == "$EXPECTED_ROOT" ]] \
  && pass "Current directory is correct" \
  || fail "Run this script from $EXPECTED_ROOT"

[[ "$(git rev-parse --show-toplevel 2>/dev/null)" == "$EXPECTED_ROOT" ]] \
  && pass "Git repository root is correct" \
  || fail "Git repository root is incorrect"

[[ "$(git branch --show-current)" == "$EXPECTED_BRANCH" ]] \
  && pass "Current branch is $EXPECTED_BRANCH" \
  || fail "Expected branch $EXPECTED_BRANCH"

for REQUIRED_FILE in "${REQUIRED_FILES[@]}"; do
  [[ -f "$REQUIRED_FILE" ]] \
    && pass "File exists: $REQUIRED_FILE" \
    || fail "Missing file: $REQUIRED_FILE"
done

grep -Fq "PrimaryHomepage" app/demo/page.tsx \
  && pass "Demo page uses PrimaryHomepage" \
  || fail "Demo page must use PrimaryHomepage"

if grep -Fq "HomepageReferencePreview" app/demo/page.tsx; then
  fail "D10 preview must not remain on the D11 homepage"
else
  pass "D10 preview removed from homepage"
fi

REQUIRED_TEXT=(
  "Start it here."
  "Follow it everywhere."
  "Browse services"
  "Track a request"
  "How your"
  "What would you"
  "Ready to get started?"
)

for TEXT in "${REQUIRED_TEXT[@]}"; do
  grep -Fq "$TEXT" "${RUNTIME_FILES[@]}" \
    && pass "Homepage text found: $TEXT" \
    || fail "Missing homepage text: $TEXT"
done

DOC_TEXT=(
  "D11 converts the approved D10 homepage reference into a working React homepage."
  "The homepage must preserve the reference structure, density and hierarchy."
  "## 7. Definition of done"
)

for TEXT in "${DOC_TEXT[@]}"; do
  grep -Fq "$TEXT" docs/demo-engine-base/DEMO-ENGINE-HOMEPAGE.md \
    && pass "Documentation rule found: $TEXT" \
    || fail "Missing documentation rule: $TEXT"
done

if grep -nE "from[[:space:]]+[\"'][^\"']*supabase|createClient\\(|supabase\\." "${RUNTIME_FILES[@]}"; then
  fail "D11 runtime files must not import or call Supabase"
else
  pass "No Supabase runtime dependency found"
fi

bash -n scripts/verify-d11-homepage.sh
pass "Verification script syntax is valid"

printf "\n================================\n"
printf "D11 VERIFICATION PASSED\n"
printf "The approved homepage reference is now implemented.\n\n"
