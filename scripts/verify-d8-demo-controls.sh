#!/usr/bin/env bash

set -euo pipefail

EXPECTED_ROOT="/Users/blaq/Downloads/faidia"
EXPECTED_BRANCH="feat/demo-engine-base"

HOMEPAGE_CONTROL="components/demo/controls/homepage-variant-switcher.tsx"
ROLE_CONTROL="components/demo/controls/role-switcher.tsx"
REQUEST_CONTROL="components/demo/controls/request-switcher.tsx"
PRESENTATION_CONTROL="components/demo/controls/presentation-controls.tsx"
CONTROL_BAR="components/demo/controls/demo-control-bar.tsx"
CONTROL_INDEX="components/demo/controls/index.ts"
LAYOUT_FILE="app/demo/layout.tsx"
DOCUMENT_FILE="docs/demo-engine-base/DEMO-ENGINE-CONTROLS.md"
SCRIPT_FILE="scripts/verify-d8-demo-controls.sh"

pass() {
  printf "PASS: %s\n" "$1"
}

fail() {
  printf "FAIL: %s\n" "$1" >&2
  exit 1
}

printf "\nFAIDIA D8 control verification\n"
printf "==============================\n\n"

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
  "$HOMEPAGE_CONTROL"
  "$ROLE_CONTROL"
  "$REQUEST_CONTROL"
  "$PRESENTATION_CONTROL"
  "$CONTROL_BAR"
  "$CONTROL_INDEX"
  "$LAYOUT_FILE"
  "$DOCUMENT_FILE"
  "$SCRIPT_FILE"
)

for REQUIRED_FILE in "${REQUIRED_FILES[@]}"; do
  [[ -f "$REQUIRED_FILE" ]] \
    && pass "File exists: $REQUIRED_FILE" \
    || fail "Missing file: $REQUIRED_FILE"
done

REQUIRED_HOMEPAGE_TEXT=(
  '"A"'
  '"B"'
  '"C"'
  '"SET_HOMEPAGE_VARIANT"'
  'aria-pressed'
)

for REQUIRED_TEXT in "${REQUIRED_HOMEPAGE_TEXT[@]}"; do
  grep -Fq "$REQUIRED_TEXT" "$HOMEPAGE_CONTROL" \
    && pass "Homepage control found: $REQUIRED_TEXT" \
    || fail "Missing homepage control: $REQUIRED_TEXT"
done

REQUIRED_ROLE_TEXT=(
  '"APPLICANT"'
  '"OFFICER"'
  '"SUPERVISOR"'
  '"ORGANIZATION_ADMIN"'
  '"SET_ACTIVE_ROLE"'
)

for REQUIRED_TEXT in "${REQUIRED_ROLE_TEXT[@]}"; do
  grep -Fq "$REQUIRED_TEXT" "$ROLE_CONTROL" \
    && pass "Role control found: $REQUIRED_TEXT" \
    || fail "Missing role control: $REQUIRED_TEXT"
done

grep -Fq '"SET_ACTIVE_REQUEST"' "$REQUEST_CONTROL" \
  && pass "Request selection uses typed state action" \
  || fail "Request selection action is missing"

grep -Fq "state.requests.map" "$REQUEST_CONTROL" \
  && pass "Request selector reads seeded requests" \
  || fail "Request selector does not read requests"

grep -Fq "requestFullscreen" "$PRESENTATION_CONTROL" \
  && pass "Fullscreen entry exists" \
  || fail "Fullscreen entry is missing"

grep -Fq "exitFullscreen" "$PRESENTATION_CONTROL" \
  && pass "Fullscreen exit exists" \
  || fail "Fullscreen exit is missing"

grep -Fq "resetDemo" "$PRESENTATION_CONTROL" \
  && pass "Reset action exists" \
  || fail "Reset action is missing"

grep -Fq 'router.push("/demo")' "$PRESENTATION_CONTROL" \
  && pass "Reset returns to /demo" \
  || fail "Reset does not return to /demo"

grep -Fq "window.confirm" "$PRESENTATION_CONTROL" \
  && pass "Reset confirmation exists" \
  || fail "Reset confirmation is missing"

grep -Fq "DemoControlBar" "$LAYOUT_FILE" \
  && pass "Control bar is installed in Demo layout" \
  || fail "Control bar is not installed in Demo layout"

REQUIRED_CONTROL_BAR_TEXT=(
  "HomepageVariantSwitcher"
  "RoleSwitcher"
  "RequestSwitcher"
  "PresentationControls"
  "showVariantSwitcher"
  "showRoleSwitcher"
  "showPresentationControls"
)

for REQUIRED_TEXT in "${REQUIRED_CONTROL_BAR_TEXT[@]}"; do
  grep -Fq "$REQUIRED_TEXT" "$CONTROL_BAR" \
    && pass "Control bar capability found: $REQUIRED_TEXT" \
    || fail "Missing control bar capability: $REQUIRED_TEXT"
done

REQUIRED_DOCUMENT_TEXT=(
  "The controls update synthetic browser state only."
  "Changing the homepage does not reset requests"
  "Presentation mode uses the browser Fullscreen API."
  "Reset does not modify production Supabase data."
  "## 10. D8 definition of done"
)

for REQUIRED_TEXT in "${REQUIRED_DOCUMENT_TEXT[@]}"; do
  grep -Fq "$REQUIRED_TEXT" "$DOCUMENT_FILE" \
    && pass "Documentation rule found: $REQUIRED_TEXT" \
    || fail "Missing documentation rule: $REQUIRED_TEXT"
done

RUNTIME_FILES=(
  "$HOMEPAGE_CONTROL"
  "$ROLE_CONTROL"
  "$REQUEST_CONTROL"
  "$PRESENTATION_CONTROL"
  "$CONTROL_BAR"
  "$CONTROL_INDEX"
  "$LAYOUT_FILE"
)

if grep -nE \
  'from ["'\''][^"'\'']*supabase|createClient\(|supabase\.' \
  "${RUNTIME_FILES[@]}"; then
  fail "D8 runtime files must not import or call Supabase"
else
  pass "No Supabase runtime dependency found"
fi

UNEXPECTED_CHANGED_FILES=""

while IFS= read -r STATUS_LINE; do
  [[ -z "$STATUS_LINE" ]] && continue

  FILE_PATH="${STATUS_LINE:3}"

  case "$FILE_PATH" in
    "$HOMEPAGE_CONTROL"|\
    "$ROLE_CONTROL"|\
    "$REQUEST_CONTROL"|\
    "$PRESENTATION_CONTROL"|\
    "$CONTROL_BAR"|\
    "$CONTROL_INDEX"|\
    "$LAYOUT_FILE"|\
    "$DOCUMENT_FILE"|\
    "$SCRIPT_FILE")
      ;;
    *)
      UNEXPECTED_CHANGED_FILES+="${FILE_PATH}"$'\n'
      ;;
  esac
done < <(git status --porcelain=v1 --untracked-files=all)

if [[ -z "$UNEXPECTED_CHANGED_FILES" ]]; then
  pass "Only D8-owned files are changed"
else
  printf "\nUnexpected changed files:\n%s\n" "$UNEXPECTED_CHANGED_FILES" >&2
  fail "D8 contains files outside its approved boundary"
fi

bash -n "$SCRIPT_FILE"
pass "Verification script syntax is valid"

printf "\n==============================\n"
printf "D8 VERIFICATION PASSED\n"
printf "The shared demonstration controls are ready for technical checks.\n\n"
