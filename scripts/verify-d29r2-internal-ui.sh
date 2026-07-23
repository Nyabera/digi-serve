#!/usr/bin/env bash

set -euo pipefail

EXPECTED_ROOT="/Users/blaq/Downloads/faidia"
EXPECTED_BRANCH="feat/demo-engine-base"

UI_DIR="components/demo/internal-ui"
DOCUMENT_FILE="docs/demo-engine-base/DEMO-ENGINE-INTERNAL-UI.md"
SCRIPT_FILE="scripts/verify-d29r2-internal-ui.sh"

pass() { printf "PASS: %s\n" "$1"; }
fail() { printf "FAIL: %s\n" "$1" >&2; exit 1; }

printf "\nFAIDIA D29R-2 shared internal-UI verification\n"
printf "============================================\n\n"

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
  "$UI_DIR/metric-card.tsx"
  "$UI_DIR/status-pill.tsx"
  "$UI_DIR/priority-pill.tsx"
  "$UI_DIR/staff-avatar.tsx"
  "$UI_DIR/internal-data-table.tsx"
  "$UI_DIR/table-toolbar.tsx"
  "$UI_DIR/detail-panel.tsx"
  "$UI_DIR/activity-timeline.tsx"
  "$UI_DIR/deadline-list.tsx"
  "$UI_DIR/message-list.tsx"
  "$UI_DIR/queue-pagination.tsx"
  "$UI_DIR/empty-state.tsx"
  "$UI_DIR/internal-ui.module.css"
  "$UI_DIR/index.ts"
  "$DOCUMENT_FILE"
  "$SCRIPT_FILE"
)

for FILE in "${REQUIRED_FILES[@]}"; do
  [[ -f "$FILE" ]] \
    && pass "File exists: $FILE" \
    || fail "Missing file: $FILE"
done

REQUIRED_COMPONENT_TEXT=(
  "MetricCard"
  "StatusPill"
  "PriorityPill"
  "StaffAvatar"
  "InternalDataTable"
  "TableToolbar"
  "DetailPanel"
  "ActivityTimeline"
  "DeadlineList"
  "MessageList"
  "QueuePagination"
  "EmptyState"
)

for TEXT in "${REQUIRED_COMPONENT_TEXT[@]}"; do
  grep -R -Fq -- "$TEXT" "$UI_DIR" \
    && pass "Internal UI component found: $TEXT" \
    || fail "Missing internal UI component: $TEXT"
done

REQUIRED_ACCESSIBILITY_TEXT=(
  "<caption"
  'scope="col"'
  'role="search"'
  'aria-label="Queue pagination"'
  "aria-current"
  "sr-only"
)

for TEXT in "${REQUIRED_ACCESSIBILITY_TEXT[@]}"; do
  grep -R -Fq -- "$TEXT" "$UI_DIR" \
    && pass "Accessibility capability found: $TEXT" \
    || fail "Missing accessibility capability: $TEXT"
done

REQUIRED_STYLE_TEXT=(
  "var(--border)"
  "var(--surface)"
  "var(--foreground)"
  "var(--primary)"
  "var(--primary-soft)"
  "var(--radius-card)"
  "var(--topbar-height-desktop)"
  "@media (max-width: 63.99rem)"
  "@media (max-width: 47.99rem)"
  "@media (prefers-reduced-motion: reduce)"
)

for TEXT in "${REQUIRED_STYLE_TEXT[@]}"; do
  grep -Fq -- "$TEXT" \
    "$UI_DIR/internal-ui.module.css" \
    && pass "Internal UI styling found: $TEXT" \
    || fail "Missing internal UI styling: $TEXT"
done

if grep -R -nE \
  '#[0-9A-Fa-f]{3,8}\b|rgb\(|oklch\(' \
  "$UI_DIR"; then
  fail "D29R-2 must use central design tokens instead of hard-coded colors"
else
  pass "No hard-coded color palette found"
fi

if grep -R -nE \
  "from[[:space:]]+[\"'][^\"']*supabase|createClient\\(|supabase\\." \
  "$UI_DIR"; then
  fail "D29R-2 must not add a Supabase dependency"
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

for FILE in "$UI_DIR"/*; do
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

pass "Only D29R-2-owned files are changed"

if git diff -- \
  app/demo \
  components/demo/internal-shell \
  features/demo \
  config/demo \
  types/demo \
  | grep -q .; then
  fail "D29R-2 must not modify routes, shell, state, configuration or types"
else
  pass "Routes, shell, state, configuration and types are unchanged"
fi

bash -n "$SCRIPT_FILE"
pass "Verification script syntax is valid"

printf "\n============================================\n"
printf "D29R-2 VERIFICATION PASSED\n"
printf "Shared KPI, table and side-panel components are ready.\n\n"
