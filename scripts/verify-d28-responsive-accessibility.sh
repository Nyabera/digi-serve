#!/usr/bin/env bash

set -euo pipefail

EXPECTED_ROOT="/Users/blaq/Downloads/faidia"
EXPECTED_BRANCH="feat/demo-engine-base"

LAYOUT_FILE="app/demo/layout.tsx"
FRAME_FILE="components/demo/presentation/demo-presentation-frame.tsx"
STYLE_FILE="app/demo/demo-accessibility.css"
AUDIT_FILE="scripts/audit-d28-demo-accessibility.mjs"
DOCUMENT_FILE="docs/demo-engine-base/DEMO-ENGINE-RESPONSIVE-ACCESSIBILITY.md"
SCRIPT_FILE="scripts/verify-d28-responsive-accessibility.sh"

pass() { printf "PASS: %s\n" "$1"; }
fail() { printf "FAIL: %s\n" "$1" >&2; exit 1; }

printf "\nFAIDIA D28 responsive-accessibility verification\n"
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
  "$LAYOUT_FILE"
  "$FRAME_FILE"
  "$STYLE_FILE"
  "$AUDIT_FILE"
  "$DOCUMENT_FILE"
  "$SCRIPT_FILE"
)

for FILE in "${REQUIRED_FILES[@]}"; do
  [[ -f "$FILE" ]] \
    && pass "File exists: $FILE" \
    || fail "Missing file: $FILE"
done

REQUIRED_LAYOUT_TEXT=(
  'import "./demo-accessibility.css";'
  'href="#demo-main-content"'
  'className="demo-skip-link"'
  "Skip to main content"
  "DemoPresentationFrame"
)

for TEXT in "${REQUIRED_LAYOUT_TEXT[@]}"; do
  grep -Fq "$TEXT" "$LAYOUT_FILE" \
    && pass "Layout accessibility capability found: $TEXT" \
    || fail "Missing layout accessibility capability: $TEXT"
done

REQUIRED_FRAME_TEXT=(
  'id="demo-main-content"'
  "tabIndex={-1}"
  'data-demo-content="true"'
)

for TEXT in "${REQUIRED_FRAME_TEXT[@]}"; do
  grep -Fq "$TEXT" "$FRAME_FILE" \
    && pass "Main-content capability found: $TEXT" \
    || fail "Missing main-content capability: $TEXT"
done

REQUIRED_STYLE_TEXT=(
  ".demo-skip-link"
  "#demo-main-content"
  "@media (pointer: coarse)"
  "@media (max-width: 767px)"
  "@media (max-width: 479px)"
  "@media (prefers-contrast: more)"
  "@media (forced-colors: active)"
  "@media (prefers-reduced-motion: reduce)"
  ".recharts-default-tooltip"
  "min-block-size: 2.75rem"
)

for TEXT in "${REQUIRED_STYLE_TEXT[@]}"; do
  grep -Fq -- "$TEXT" "$STYLE_FILE" \
    && pass "Responsive-accessibility styling found: $TEXT" \
    || fail "Missing responsive-accessibility styling: $TEXT"
done

REQUIRED_DOCUMENT_TEXT=(
  "D28 completes the dedicated responsive and accessibility pass across the reusable Demo Engine."
  "D28 does not change the service workflow."
  "Manual responsive checks must cover:"
  "Using VoiceOver on macOS:"
  "## 10. D28 definition of done"
)

for TEXT in "${REQUIRED_DOCUMENT_TEXT[@]}"; do
  grep -Fq "$TEXT" "$DOCUMENT_FILE" \
    && pass "Documentation rule found: $TEXT" \
    || fail "Missing documentation rule: $TEXT"
done

python3 - <<'PY'
from pathlib import Path

for filename in (
    "app/demo/demo-accessibility.css",
    "components/demo/presentation/demo-presentation-frame.tsx",
):
    text = Path(filename).read_text(encoding="utf-8")
    opening = text.count("{")
    closing = text.count("}")

    if opening != closing:
        raise SystemExit(
            f"FAIL: Unbalanced braces in {filename}: "
            f"{opening} open, {closing} closed"
        )

    print(
        f"PASS: Braces balanced in {filename}: "
        f"{opening} blocks"
    )
PY

node "$AUDIT_FILE"

if grep -nE \
  "from[[:space:]]+[\"'][^\"']*supabase|createClient\\(|supabase\\." \
  "$LAYOUT_FILE" "$FRAME_FILE"; then
  fail "D28 runtime files must not call Supabase"
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
  "$LAYOUT_FILE"
  "$FRAME_FILE"
  "$STYLE_FILE"
  "$AUDIT_FILE"
  "$DOCUMENT_FILE"
  "$SCRIPT_FILE"
)

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

pass "Only D28-owned files are changed"

if git diff -- \
  features/demo/state \
  config/demo \
  types/demo \
  "app/demo/**/page.tsx" \
  | grep -q .; then
  fail "D28 must not modify state, configuration, types or route-page logic"
else
  pass "State, configuration, types and route-page logic are unchanged"
fi

bash -n "$SCRIPT_FILE"
pass "Verification script syntax is valid"

printf "\n===============================================\n"
printf "D28 VERIFICATION PASSED\n"
printf "Responsive and accessibility hardening is ready.\n\n"
