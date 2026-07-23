#!/usr/bin/env bash

set -euo pipefail

EXPECTED_ROOT="/Users/blaq/Downloads/faidia"
EXPECTED_BRANCH="feat/demo-engine-base"

LAYOUT_FILE="app/demo/layout.tsx"
FRAME_FILE="components/demo/presentation/demo-presentation-frame.tsx"
INDEX_FILE="components/demo/presentation/index.ts"
STYLE_FILE="app/demo/demo-presentation.css"
DOCUMENT_FILE="docs/demo-engine-base/DEMO-ENGINE-PRESENTATION-RESET.md"
SCRIPT_FILE="scripts/verify-d27-presentation-reset.sh"

pass() { printf "PASS: %s\n" "$1"; }
fail() { printf "FAIL: %s\n" "$1" >&2; exit 1; }

printf "\nFAIDIA D27 presentation-and-reset verification\n"
printf "=============================================\n\n"

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
  "$INDEX_FILE"
  "$STYLE_FILE"
  "$DOCUMENT_FILE"
  "$SCRIPT_FILE"
)

for FILE in "${REQUIRED_FILES[@]}"; do
  [[ -f "$FILE" ]] \
    && pass "File exists: $FILE" \
    || fail "Missing file: $FILE"
done

REQUIRED_LAYOUT_TEXT=(
  "DemoStateProvider"
  "DemoControlBar"
  "DemoPresentationFrame"
  'import "./demo-calibration.css";'
  'import "./demo-presentation.css";'
  "controls={<DemoControlBar />}"
)

for TEXT in "${REQUIRED_LAYOUT_TEXT[@]}"; do
  grep -Fq "$TEXT" "$LAYOUT_FILE" \
    && pass "Demo layout capability found: $TEXT" \
    || fail "Missing demo layout capability: $TEXT"
done

REQUIRED_FRAME_TEXT=(
  '"use client"'
  "faidia.demo-engine."
  "faidia.demo-engine.state.v1"
  "faidia.demo-engine.presentation.v1"
  "sessionStorage"
  "requestFullscreen"
  "fullscreenchange"
  'event.key.toLowerCase() === "p"'
  'event.key.toLowerCase() === "r"'
  'event.key === "Escape"'
  "data-demo-control-zone"
  "data-demo-content"
  "data-demo-reset-dialog"
  "Reset the complete demo journey?"
  "Production data and Supabase are not touched."
  'window.location.assign("/demo")'
  "role=\"dialog\""
  'aria-modal="true"'
  "presentationStep"
  "Public service portal"
  "Officer review and referral"
  "Controlled outcome"
)

for TEXT in "${REQUIRED_FRAME_TEXT[@]}"; do
  grep -Fq "$TEXT" "$FRAME_FILE" \
    && pass "Presentation capability found: $TEXT" \
    || fail "Missing presentation capability: $TEXT"
done

REQUIRED_STYLE_TEXT=(
  'html[data-demo-presentation="true"]'
  '[data-demo-control-zone="true"]'
  '[data-demo-content="true"]'
  ".demo-presenter-exit"
  ".demo-reset-backdrop"
  ".demo-reset-dialog"
  "@media (max-width: 767px)"
  "@media (prefers-reduced-motion: reduce)"
  "@media print"
)

for TEXT in "${REQUIRED_STYLE_TEXT[@]}"; do
  grep -Fq "$TEXT" "$STYLE_FILE" \
    && pass "Presentation styling found: $TEXT" \
    || fail "Missing presentation styling: $TEXT"
done

REQUIRED_DOCUMENT_TEXT=(
  "D27 finalizes buyer-facing presentation mode and safe demonstration reset behavior."
  "D27 wraps the existing D8 control bar."
  "Reset requires an explicit confirmation dialog."
  "Reset affects only keys beginning with:"
  "## 9. D27 definition of done"
)

for TEXT in "${REQUIRED_DOCUMENT_TEXT[@]}"; do
  grep -Fq "$TEXT" "$DOCUMENT_FILE" \
    && pass "Documentation rule found: $TEXT" \
    || fail "Missing documentation rule: $TEXT"
done

python3 - <<'PY'
from pathlib import Path

for filename in (
    "app/demo/demo-presentation.css",
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

if grep -nE \
  "from[[:space:]]+[\"'][^\"']*supabase|createClient\\(|supabase\\." \
  "$LAYOUT_FILE" "$FRAME_FILE"; then
  fail "D27 runtime files must not call Supabase"
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
  "$INDEX_FILE"
  "$STYLE_FILE"
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

pass "Only D27-owned files are changed"

if git diff -- \
  features/demo/state \
  config/demo \
  types/demo \
  "app/demo/**/page.tsx" \
  | grep -q .; then
  fail "D27 must not modify state, configuration, types or route-page logic"
else
  pass "State, configuration, types and route-page logic are unchanged"
fi

bash -n "$SCRIPT_FILE"
pass "Verification script syntax is valid"

printf "\n=============================================\n"
printf "D27 VERIFICATION PASSED\n"
printf "Presentation mode and safe reset are ready.\n\n"
