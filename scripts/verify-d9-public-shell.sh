#!/usr/bin/env bash

set -euo pipefail

EXPECTED_ROOT="/Users/blaq/Downloads/faidia"
EXPECTED_BRANCH="feat/demo-engine-base"

HEADER_FILE="components/demo/shell/demo-public-header.tsx"
FOOTER_FILE="components/demo/shell/demo-public-footer.tsx"
SHELL_FILE="components/demo/shell/demo-public-shell.tsx"
PLACEHOLDER_FILE="components/demo/shell/demo-public-route-placeholder.tsx"
INDEX_FILE="components/demo/shell/index.ts"

DEMO_HOME="app/demo/page.tsx"
SERVICE_PAGE="app/demo/services/[serviceSlug]/page.tsx"
SIGN_UP_PAGE="app/demo/sign-up/page.tsx"
APPLY_PAGE="app/demo/apply/[serviceSlug]/page.tsx"
CONFIRMATION_PAGE="app/demo/requests/[requestId]/confirmation/page.tsx"
TRACK_PAGE="app/demo/track/[requestId]/page.tsx"

DOCUMENT_FILE="docs/demo-engine-base/DEMO-ENGINE-PUBLIC-SHELL.md"
SCRIPT_FILE="scripts/verify-d9-public-shell.sh"

pass() {
  printf "PASS: %s\n" "$1"
}

fail() {
  printf "FAIL: %s\n" "$1" >&2
  exit 1
}

printf "\nFAIDIA D9 public shell verification\n"
printf "===================================\n\n"

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
  "$HEADER_FILE"
  "$FOOTER_FILE"
  "$SHELL_FILE"
  "$PLACEHOLDER_FILE"
  "$INDEX_FILE"
  "$DEMO_HOME"
  "$SERVICE_PAGE"
  "$SIGN_UP_PAGE"
  "$APPLY_PAGE"
  "$CONFIRMATION_PAGE"
  "$TRACK_PAGE"
  "$DOCUMENT_FILE"
  "$SCRIPT_FILE"
)

for REQUIRED_FILE in "${REQUIRED_FILES[@]}"; do
  [[ -f "$REQUIRED_FILE" ]] \
    && pass "File exists: $REQUIRED_FILE" \
    || fail "Missing file: $REQUIRED_FILE"
done

REQUIRED_HEADER_TEXT=(
  "usePathname"
  "Public service navigation"
  "Mobile public service navigation"
  'href="/demo/officer"'
  "getDefaultDemoClient"
  "aria-current"
)

for REQUIRED_TEXT in "${REQUIRED_HEADER_TEXT[@]}"; do
  grep -Fq "$REQUIRED_TEXT" "$HEADER_FILE" \
    && pass "Header capability found: $REQUIRED_TEXT" \
    || fail "Missing header capability: $REQUIRED_TEXT"
done

REQUIRED_SHELL_TEXT=(
  "DemoPublicHeader"
  "DemoPublicFooter"
  'id="demo-public-content"'
  "Skip to main content"
)

for REQUIRED_TEXT in "${REQUIRED_SHELL_TEXT[@]}"; do
  grep -Fq "$REQUIRED_TEXT" "$SHELL_FILE" \
    && pass "Shell capability found: $REQUIRED_TEXT" \
    || fail "Missing shell capability: $REQUIRED_TEXT"
done

grep -Fq "Synthetic FAIDIA demonstration" "$FOOTER_FILE" \
  && pass "Synthetic environment notice exists" \
  || fail "Synthetic environment notice is missing"

grep -Fq "DemoPublicShell" "$DEMO_HOME" \
  && pass "Demo homepage uses the public shell" \
  || fail "Demo homepage does not use the public shell"

PUBLIC_PLACEHOLDER_PAGES=(
  "$SERVICE_PAGE"
  "$SIGN_UP_PAGE"
  "$APPLY_PAGE"
  "$CONFIRMATION_PAGE"
  "$TRACK_PAGE"
)

for PAGE_FILE in "${PUBLIC_PLACEHOLDER_PAGES[@]}"; do
  grep -Fq "DemoPublicRoutePlaceholder" "$PAGE_FILE" \
    && pass "Public shell placeholder used by: $PAGE_FILE" \
    || fail "Public route does not use shared shell: $PAGE_FILE"
done

INTERNAL_ROUTE_FILES=(
  "app/demo/officer/page.tsx"
  "app/demo/officer/requests/[requestId]/page.tsx"
  "app/demo/department/page.tsx"
  "app/demo/department/handoffs/[handoffId]/page.tsx"
  "app/demo/supervisor/page.tsx"
  "app/demo/supervisor/approvals/[requestId]/page.tsx"
  "app/demo/outcomes/[requestId]/page.tsx"
  "app/demo/reports/page.tsx"
)

for INTERNAL_FILE in "${INTERNAL_ROUTE_FILES[@]}"; do
  if grep -Eq \
    "DemoPublicShell|DemoPublicRoutePlaceholder" \
    "$INTERNAL_FILE"; then
    fail "Internal route incorrectly uses public shell: $INTERNAL_FILE"
  else
    pass "Internal route remains outside public shell: $INTERNAL_FILE"
  fi
done

PAGE_COUNT="$(
  find app/demo -type f -name "page.tsx" | wc -l | tr -d " "
)"

[[ "$PAGE_COUNT" -eq 14 ]] \
  && pass "The 14-route inventory remains intact" \
  || fail "Expected 14 route pages but found $PAGE_COUNT"

REQUIRED_DOCUMENT_TEXT=(
  "D9 creates the shared public-facing shell"
  "The D8 demonstration control bar remains above the public shell."
  "Internal officer, department, supervisor, outcome and reporting routes do not use the public shell during D9."
  "## 8. D9 definition of done"
)

for REQUIRED_TEXT in "${REQUIRED_DOCUMENT_TEXT[@]}"; do
  grep -Fq "$REQUIRED_TEXT" "$DOCUMENT_FILE" \
    && pass "Documentation rule found: $REQUIRED_TEXT" \
    || fail "Missing documentation rule: $REQUIRED_TEXT"
done

RUNTIME_FILES=(
  "$HEADER_FILE"
  "$FOOTER_FILE"
  "$SHELL_FILE"
  "$PLACEHOLDER_FILE"
  "$INDEX_FILE"
  "$DEMO_HOME"
  "$SERVICE_PAGE"
  "$SIGN_UP_PAGE"
  "$APPLY_PAGE"
  "$CONFIRMATION_PAGE"
  "$TRACK_PAGE"
)

if grep -nE \
  'from ["'\''][^"'\'']*supabase|createClient\(|supabase\.' \
  "${RUNTIME_FILES[@]}"; then
  fail "D9 runtime files must not import or call Supabase"
else
  pass "No Supabase runtime dependency found"
fi

UNEXPECTED_CHANGED_FILES=""

while IFS= read -r STATUS_LINE; do
  [[ -z "$STATUS_LINE" ]] && continue

  FILE_PATH="${STATUS_LINE:3}"

  case "$FILE_PATH" in
    "$HEADER_FILE"|\
    "$FOOTER_FILE"|\
    "$SHELL_FILE"|\
    "$PLACEHOLDER_FILE"|\
    "$INDEX_FILE"|\
    "$DEMO_HOME"|\
    "$SERVICE_PAGE"|\
    "$SIGN_UP_PAGE"|\
    "$APPLY_PAGE"|\
    "$CONFIRMATION_PAGE"|\
    "$TRACK_PAGE"|\
    "$DOCUMENT_FILE"|\
    "$SCRIPT_FILE")
      ;;
    *)
      UNEXPECTED_CHANGED_FILES+="${FILE_PATH}"$'\n'
      ;;
  esac
done < <(git status --porcelain=v1 --untracked-files=all)

if [[ -z "$UNEXPECTED_CHANGED_FILES" ]]; then
  pass "Only D9-owned files are changed"
else
  printf "\nUnexpected changed files:\n%s\n" "$UNEXPECTED_CHANGED_FILES" >&2
  fail "D9 contains files outside its approved boundary"
fi

bash -n "$SCRIPT_FILE"
pass "Verification script syntax is valid"

printf "\n===================================\n"
printf "D9 VERIFICATION PASSED\n"
printf "The shared public-facing shell is ready for technical checks.\n\n"
