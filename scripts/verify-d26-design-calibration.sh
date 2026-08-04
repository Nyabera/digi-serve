#!/usr/bin/env bash

set -euo pipefail

EXPECTED_ROOT="/Users/blaq/Downloads/faidia"
EXPECTED_BRANCH="feat/demo-engine-base"

LAYOUT_FILE="app/demo/layout.tsx"
CALIBRATION_FILE="app/demo/demo-calibration.css"
DOCUMENT_FILE="docs/demo-engine-base/DEMO-ENGINE-DESIGN-CALIBRATION.md"
SCRIPT_FILE="scripts/verify-d26-design-calibration.sh"

pass() { printf "PASS: %s\n" "$1"; }
fail() { printf "FAIL: %s\n" "$1" >&2; exit 1; }

printf "\nFAIDIA D26 design-calibration verification\n"
printf "=========================================\n\n"

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
  "$CALIBRATION_FILE"
  "$DOCUMENT_FILE"
  "$SCRIPT_FILE"
)

for FILE in "${REQUIRED_FILES[@]}"; do
  [[ -f "$FILE" ]] \
    && pass "File exists: $FILE" \
    || fail "Missing file: $FILE"
done

grep -Fq 'import "./demo-calibration.css";' "$LAYOUT_FILE" \
  && pass "Demo layout imports the calibration stylesheet" \
  || fail "Demo layout must import ./demo-calibration.css"

REQUIRED_CSS_TEXT=(
  "--demo-background"
  "--demo-surface"
  "--demo-primary"
  "--demo-shadow-card"
  "focus-visible"
  "input[type=\"checkbox\"]"
  ".recharts-responsive-container"
  ".recharts-default-tooltip"
  "@media (max-width: 767px)"
  "@media (prefers-reduced-motion: reduce)"
  "@media print"
  "iframe[title*=\"issued demonstration\"]"
)

for TEXT in "${REQUIRED_CSS_TEXT[@]}"; do
  grep -Fq -- "$TEXT" "$CALIBRATION_FILE" \
    && pass "Calibration capability found: $TEXT" \
    || fail "Missing calibration capability: $TEXT"
done

REQUIRED_DOCUMENT_TEXT=(
  "D26 completes the first visual calibration pass across the reusable Demo Engine."
  "D26 changes presentation, not workflow behavior."
  "D26 adds one route-scoped stylesheet:"
  "D26 does not:"
  "## 8. D26 definition of done"
)

for TEXT in "${REQUIRED_DOCUMENT_TEXT[@]}"; do
  grep -Fq "$TEXT" "$DOCUMENT_FILE" \
    && pass "Documentation rule found: $TEXT" \
    || fail "Missing documentation rule: $TEXT"
done

python3 - <<'PY'
from pathlib import Path

path = Path("app/demo/demo-calibration.css")
text = path.read_text(encoding="utf-8")

open_braces = text.count("{")
close_braces = text.count("}")

if open_braces != close_braces:
    raise SystemExit(
        f"FAIL: CSS braces are unbalanced: {open_braces} open, {close_braces} closed"
    )

print(
    f"PASS: CSS braces are balanced: {open_braces} blocks"
)
PY

if grep -nE \
  "from[[:space:]]+[\"'][^\"']*supabase|createClient\\(|supabase\\." \
  "$LAYOUT_FILE"; then
  fail "D26 must not add a Supabase dependency"
else
  pass "No Supabase runtime dependency added"
fi

PAGE_COUNT="$(
  find app/demo -type f -name "page.tsx" | wc -l | tr -d " "
)"

[[ "$PAGE_COUNT" -eq 14 ]] \
  && pass "The 14-route inventory remains intact" \
  || fail "Expected 14 route pages but found $PAGE_COUNT"

ALLOWED_FILES=(
  "$LAYOUT_FILE"
  "$CALIBRATION_FILE"
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

pass "Only D26-owned files are changed"

if git diff -- \
  features/demo/state \
  config/demo \
  types/demo \
  components/demo \
  app/demo/**/page.tsx \
  | grep -q .; then
  fail "D26 must not modify workflow, state, configuration or route-page logic"
else
  pass "Workflow, state, configuration and route-page logic are unchanged"
fi

bash -n "$SCRIPT_FILE"
pass "Verification script syntax is valid"

printf "\n=========================================\n"
printf "D26 VERIFICATION PASSED\n"
printf "The Demo Engine visual calibration layer is ready.\n\n"
