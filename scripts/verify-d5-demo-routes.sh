#!/usr/bin/env bash

set -euo pipefail

EXPECTED_ROOT="/Users/blaq/Downloads/faidia"
EXPECTED_BRANCH="feat/demo-engine-base"
ROUTE_DOCUMENT="docs/demo-engine-base/DEMO-ENGINE-ROUTES.md"
PLACEHOLDER_COMPONENT="components/demo/shared/demo-route-placeholder.tsx"
SCRIPT_FILE="scripts/verify-d5-demo-routes.sh"

pass() {
  printf "PASS: %s\n" "$1"
}

fail() {
  printf "FAIL: %s\n" "$1" >&2
  exit 1
}

printf "\nFAIDIA D5 route verification\n"
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

REQUIRED_ROUTE_FILES=(
  "app/demo/page.tsx"
  "app/demo/services/[serviceSlug]/page.tsx"
  "app/demo/sign-up/page.tsx"
  "app/demo/apply/[serviceSlug]/page.tsx"
  "app/demo/requests/[requestId]/confirmation/page.tsx"
  "app/demo/track/[requestId]/page.tsx"
  "app/demo/officer/page.tsx"
  "app/demo/officer/requests/[requestId]/page.tsx"
  "app/demo/department/page.tsx"
  "app/demo/department/handoffs/[handoffId]/page.tsx"
  "app/demo/supervisor/page.tsx"
  "app/demo/supervisor/approvals/[requestId]/page.tsx"
  "app/demo/outcomes/[requestId]/page.tsx"
  "app/demo/reports/page.tsx"
)

for ROUTE_FILE in "${REQUIRED_ROUTE_FILES[@]}"; do
  [[ -f "$ROUTE_FILE" ]] \
    && pass "Route exists: $ROUTE_FILE" \
    || fail "Missing route file: $ROUTE_FILE"
done

PAGE_COUNT="$(
  find app/demo -type f -name "page.tsx" | wc -l | tr -d ' '
)"

[[ "$PAGE_COUNT" -eq 14 ]] \
  && pass "Exactly 14 Demo Engine route pages exist" \
  || fail "Expected 14 route pages but found $PAGE_COUNT"

[[ -f "$PLACEHOLDER_COMPONENT" ]] \
  && pass "Shared route placeholder exists" \
  || fail "Missing shared route placeholder"

[[ -f "$ROUTE_DOCUMENT" ]] \
  && pass "Route documentation exists" \
  || fail "Missing route documentation"

for ROUTE_FILE in "${REQUIRED_ROUTE_FILES[@]:1}"; do
  grep -Fq "DemoRoutePlaceholder" "$ROUTE_FILE" \
    && pass "Placeholder used by: $ROUTE_FILE" \
    || fail "Route does not use DemoRoutePlaceholder: $ROUTE_FILE"
done

REQUIRED_INDEX_LINKS=(
  'href: "/demo/services/transcript-request"'
  'href: "/demo/sign-up"'
  'href: "/demo/apply/transcript-request"'
  'href: "/demo/requests/REQ-DEMO-001/confirmation"'
  'href: "/demo/track/REQ-DEMO-001"'
  'href: "/demo/officer"'
  'href: "/demo/officer/requests/REQ-DEMO-001"'
  'href: "/demo/department"'
  'href: "/demo/department/handoffs/HND-DEMO-001"'
  'href: "/demo/supervisor"'
  'href: "/demo/supervisor/approvals/REQ-DEMO-001"'
  'href: "/demo/outcomes/REQ-DEMO-001"'
  'href: "/demo/reports"'
)

for REQUIRED_LINK in "${REQUIRED_INDEX_LINKS[@]}"; do
  grep -Fq "$REQUIRED_LINK" "app/demo/page.tsx" \
    && pass "Route-index link found: $REQUIRED_LINK" \
    || fail "Missing route-index link: $REQUIRED_LINK"
done

REQUIRED_DOCUMENT_TEXT=(
  "Every route remains beneath \`/demo\`."
  "D5 uses temporary placeholder interfaces only."
  "All 14 planned routes exist."
  "## 6. D5 definition of done"
)

for REQUIRED_TEXT in "${REQUIRED_DOCUMENT_TEXT[@]}"; do
  grep -Fq "$REQUIRED_TEXT" "$ROUTE_DOCUMENT" \
    && pass "Route rule found: $REQUIRED_TEXT" \
    || fail "Missing route rule: $REQUIRED_TEXT"
done

UNEXPECTED_CHANGED_FILES=""

while IFS= read -r STATUS_LINE; do
  [[ -z "$STATUS_LINE" ]] && continue

  FILE_PATH="${STATUS_LINE:3}"

  case "$FILE_PATH" in
    app/demo/*)
      ;;
    "$PLACEHOLDER_COMPONENT")
      ;;
    "$ROUTE_DOCUMENT")
      ;;
    "$SCRIPT_FILE")
      ;;
    *)
      UNEXPECTED_CHANGED_FILES+="${FILE_PATH}"$'\n'
      ;;
  esac
done < <(git status --porcelain=v1 --untracked-files=all)

if [[ -z "$UNEXPECTED_CHANGED_FILES" ]]; then
  pass "Only D5-owned files are changed"
else
  printf "\nUnexpected changed files:\n%s\n" "$UNEXPECTED_CHANGED_FILES" >&2
  fail "D5 contains files outside its approved boundary"
fi

bash -n "$SCRIPT_FILE"
pass "Verification script syntax is valid"

printf "\n============================\n"
printf "D5 VERIFICATION PASSED\n"
printf "The Demo Engine routes are ready for technical checks.\n\n"
