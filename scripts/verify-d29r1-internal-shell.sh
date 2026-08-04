#!/usr/bin/env bash

set -euo pipefail

EXPECTED_ROOT="/Users/blaq/Downloads/faidia"
EXPECTED_BRANCH="feat/demo-engine-base"

SHELL_DIR="components/demo/internal-shell"
DOCUMENT_FILE="docs/demo-engine-base/DEMO-ENGINE-INTERNAL-SHELL.md"
SCRIPT_FILE="scripts/verify-d29r1-internal-shell.sh"

pass() { printf "PASS: %s\n" "$1"; }
fail() { printf "FAIL: %s\n" "$1" >&2; exit 1; }

printf "\nFAIDIA D29R-1 shared internal-shell verification\n"
printf "===============================================\n\n"

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
  "$SHELL_DIR/internal-app-shell.tsx"
  "$SHELL_DIR/internal-sidebar.tsx"
  "$SHELL_DIR/internal-topbar.tsx"
  "$SHELL_DIR/internal-page-header.tsx"
  "$SHELL_DIR/internal-global-search.tsx"
  "$SHELL_DIR/internal-user-menu.tsx"
  "$SHELL_DIR/internal-navigation.ts"
  "$SHELL_DIR/internal-shell.module.css"
  "$SHELL_DIR/index.ts"
  "$DOCUMENT_FILE"
  "$SCRIPT_FILE"
)

for FILE in "${REQUIRED_FILES[@]}"; do
  [[ -f "$FILE" ]] \
    && pass "File exists: $FILE" \
    || fail "Missing file: $FILE"
done

REQUIRED_NAVIGATION_TEXT=(
  "OFFICER"
  "DEPARTMENT"
  "SUPERVISOR"
  "Operations"
  "Workflow"
  "Documents"
  "Communication"
  "Operational reports"
  "aria-current"
)

for TEXT in "${REQUIRED_NAVIGATION_TEXT[@]}"; do
  grep -R -Fq -- "$TEXT" "$SHELL_DIR" \
    && pass "Navigation capability found: $TEXT" \
    || fail "Missing navigation capability: $TEXT"
done

REQUIRED_SHELL_TEXT=(
  "InternalAppShell"
  "InternalSidebar"
  "InternalTopbar"
  "requestSelector"
  "roleSelector"
  "presentationAction"
  "resetAction"
  "mobileSidebarOpen"
  "sidebarCollapsed"
)

for TEXT in "${REQUIRED_SHELL_TEXT[@]}"; do
  grep -R -Fq -- "$TEXT" "$SHELL_DIR" \
    && pass "Shell capability found: $TEXT" \
    || fail "Missing shell capability: $TEXT"
done

REQUIRED_STYLE_TEXT=(
  "var(--sidebar-width-staff)"
  "var(--sidebar-width-collapsed)"
  "var(--topbar-height-desktop)"
  "var(--content-gutter-desktop)"
  "var(--container-content-wide)"
  "@media (max-width: 63.99rem)"
  "@media (max-width: 47.99rem)"
  "@media (prefers-reduced-motion: reduce)"
)

for TEXT in "${REQUIRED_STYLE_TEXT[@]}"; do
  grep -Fq -- "$TEXT" \
    "$SHELL_DIR/internal-shell.module.css" \
    && pass "Shell styling found: $TEXT" \
    || fail "Missing shell styling: $TEXT"
done

if grep -R -nE \
  '#[0-9A-Fa-f]{3,8}\b|rgb\(|oklch\(' \
  "$SHELL_DIR"; then
  fail "D29R-1 shell must use central design tokens instead of hard-coded colors"
else
  pass "No hard-coded color palette found"
fi

if grep -R -nE \
  "from[[:space:]]+[\"'][^\"']*supabase|createClient\\(|supabase\\." \
  "$SHELL_DIR"; then
  fail "D29R-1 must not add a Supabase dependency"
else
  pass "No Supabase runtime dependency found"
fi

PAGE_COUNT="$(
  find app/demo -type f -name "page.tsx" | wc -l | tr -d " "
)"

[[ "$PAGE_COUNT" -eq 14 ]] \
  && pass "The 14-route inventory remains intact" \
  || fail "Expected 14 route pages but found $PAGE_COUNT"

ALLOWED_FILES=(
  "$DOCUMENT_FILE"
  "$SCRIPT_FILE"
)

for FILE in "$SHELL_DIR"/*; do
  [[ -f "$FILE" ]] && ALLOWED_FILES+=("$FILE")
done

while IFS= read -r LINE; do
  [[ -z "$LINE" ]] && continue

  FILE_PATH="${LINE:3}"
  ALLOWED=false

  for ALLOWED_FILE in "${ALLOWED_FILES[@]}"; do
    if [[ "$FILE_PATH" == "$ALLOWED_FILE" ]]; then
      ALLOWED=true
      break
    fi
  done

  [[ "$ALLOWED" == true ]] \
    || fail "Unexpected changed file: $FILE_PATH"
done < <(git status --porcelain=v1 --untracked-files=all)

pass "Only D29R-1-owned files are changed"

if git diff -- \
  app/demo \
  features/demo \
  config/demo \
  types/demo \
  | grep -q .; then
  fail "D29R-1 must not modify routes, state, configuration or types"
else
  pass "Routes, state, configuration and types are unchanged"
fi

bash -n "$SCRIPT_FILE"
pass "Verification script syntax is valid"

printf "\n===============================================\n"
printf "D29R-1 VERIFICATION PASSED\n"
printf "The shared sidebar and topbar shell foundation is ready.\n\n"
