#!/usr/bin/env bash

set -euo pipefail

EXPECTED_ROOT="/Users/blaq/Downloads/faidia"
EXPECTED_BRANCH="feat/demo-engine-base"

ROUTE_FILE="app/demo/services/[serviceSlug]/page.tsx"
PAGE_FILE="components/demo/public/service-information-page.tsx"
START_PANEL_FILE="components/demo/public/service-start-panel.tsx"
HOMEPAGE_FILE="components/demo/homepages/primary-homepage.tsx"
DOCUMENT_FILE="docs/demo-engine-base/DEMO-ENGINE-SERVICE-INFORMATION.md"
SCRIPT_FILE="scripts/verify-d15-service-information.sh"

pass() {
  printf "PASS: %s\n" "$1"
}

fail() {
  printf "FAIL: %s\n" "$1" >&2
  exit 1
}

printf "\nFAIDIA D15 service-information verification\n"
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
  "$ROUTE_FILE"
  "$PAGE_FILE"
  "$START_PANEL_FILE"
  "$HOMEPAGE_FILE"
  "$DOCUMENT_FILE"
  "$SCRIPT_FILE"
)

for REQUIRED_FILE in "${REQUIRED_FILES[@]}"; do
  [[ -f "$REQUIRED_FILE" ]] \
    && pass "File exists: $REQUIRED_FILE" \
    || fail "Missing file: $REQUIRED_FILE"
done

REQUIRED_ROUTE_TEXT=(
  "generateStaticParams"
  "await params"
  "getDefaultDemoClient"
  "candidate.slug === serviceSlug"
  "notFound()"
  "ServiceInformationPage"
)

for REQUIRED_TEXT in "${REQUIRED_ROUTE_TEXT[@]}"; do
  grep -Fq "$REQUIRED_TEXT" "$ROUTE_FILE" \
    && pass "Route capability found: $REQUIRED_TEXT" \
    || fail "Missing route capability: $REQUIRED_TEXT"
done

REQUIRED_PAGE_TEXT=(
  "service.description"
  "service.shortDescription"
  "service.eligibility.map"
  "service.requirements.map"
  "service.requiredDocuments"
  "service.expectedProcessingTime"
  "service.fee"
  "service.outcomeLabel"
  "ServiceStartPanel"
  "Other services"
)

for REQUIRED_TEXT in "${REQUIRED_PAGE_TEXT[@]}"; do
  grep -Fq "$REQUIRED_TEXT" "$PAGE_FILE" \
    && pass "Service-information capability found: $REQUIRED_TEXT" \
    || fail "Missing service-information capability: $REQUIRED_TEXT"
done

REQUIRED_START_TEXT=(
  'href={`/demo/sign-up?service=${service.slug}`}'
  "Start request"
  'href="/demo/track/REQ-DEMO-001"'
  "Track an existing request"
)

for REQUIRED_TEXT in "${REQUIRED_START_TEXT[@]}"; do
  grep -Fq "$REQUIRED_TEXT" "$START_PANEL_FILE" \
    && pass "Start-panel capability found: $REQUIRED_TEXT" \
    || fail "Missing start-panel capability: $REQUIRED_TEXT"
done

REQUIRED_HOMEPAGE_ROUTES=(
  "/demo/services/transcript-request"
  "/demo/services/student-clearance"
  "/demo/services/certificate-replacement"
)

for REQUIRED_ROUTE in "${REQUIRED_HOMEPAGE_ROUTES[@]}"; do
  grep -Fq "$REQUIRED_ROUTE" "$HOMEPAGE_FILE" \
    && pass "Homepage service route found: $REQUIRED_ROUTE" \
    || fail "Homepage is missing service route: $REQUIRED_ROUTE"
done

if grep -Eq 'href(:|=)[[:space:]]*["'\'']/demo/services["'\'']' "$HOMEPAGE_FILE"; then
  fail "Homepage must not link to the non-existent bare /demo/services route"
else
  pass "Homepage contains no bare /demo/services link"
fi

PAGE_COUNT="$(
  find app/demo -type f -name "page.tsx" | wc -l | tr -d " "
)"

[[ "$PAGE_COUNT" -eq 14 ]] \
  && pass "The 14-route inventory remains intact" \
  || fail "Expected 14 route pages but found $PAGE_COUNT"

REQUIRED_DOCUMENT_TEXT=(
  "D15 replaces the temporary public-route placeholder with a complete, configuration-driven service-information page."
  "The page must help an applicant understand the service before signing up or starting a request."
  "Transcript Request, Student Clearance Request and Certificate Replacement Request use the same page component."
  "The homepage must not link to the non-existent bare route \`/demo/services\`."
  "## 8. D15 definition of done"
)

for REQUIRED_TEXT in "${REQUIRED_DOCUMENT_TEXT[@]}"; do
  grep -Fq "$REQUIRED_TEXT" "$DOCUMENT_FILE" \
    && pass "Documentation rule found: $REQUIRED_TEXT" \
    || fail "Missing documentation rule: $REQUIRED_TEXT"
done

RUNTIME_FILES=(
  "$ROUTE_FILE"
  "$PAGE_FILE"
  "$START_PANEL_FILE"
  "$HOMEPAGE_FILE"
)

if grep -nE \
  "from[[:space:]]+[\"'][^\"']*supabase|createClient\\(|supabase\\." \
  "${RUNTIME_FILES[@]}"; then
  fail "D15 runtime files must not import or call Supabase"
else
  pass "No Supabase runtime dependency found"
fi

UNEXPECTED_CHANGED_FILES=""

while IFS= read -r STATUS_LINE; do
  [[ -z "$STATUS_LINE" ]] && continue

  FILE_PATH="${STATUS_LINE:3}"

  case "$FILE_PATH" in
    "$ROUTE_FILE"|\
    "$PAGE_FILE"|\
    "$START_PANEL_FILE"|\
    "$HOMEPAGE_FILE"|\
    "$DOCUMENT_FILE"|\
    "$SCRIPT_FILE")
      ;;
    *)
      UNEXPECTED_CHANGED_FILES+="${FILE_PATH}"$'\n'
      ;;
  esac
done < <(git status --porcelain=v1 --untracked-files=all)

if [[ -z "$UNEXPECTED_CHANGED_FILES" ]]; then
  pass "Only D15-owned files are changed"
else
  printf "\nUnexpected changed files:\n%s\n" \
    "$UNEXPECTED_CHANGED_FILES" >&2
  fail "D15 contains files outside its approved boundary"
fi

bash -n "$SCRIPT_FILE"
pass "Verification script syntax is valid"

printf "\n===========================================\n"
printf "D15 VERIFICATION PASSED\n"
printf "The service-information page is ready for technical checks.\n\n"
