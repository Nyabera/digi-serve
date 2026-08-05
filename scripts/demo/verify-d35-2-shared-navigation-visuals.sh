#!/usr/bin/env bash
set -euo pipefail

BRANCH="demo/d35-shared-navigation-visual-refinement"
CONTRACT="docs/demo/D35-1-SHARED-NAVIGATION-VISUAL-CONTRACT.md"
AMENDMENT_B="docs/demo/D35-1B-SHARED-NAVIGATION-VISUAL-CONTRACT-AMENDMENT.md"
CSS_FILE="components/demo/internal-shell/internal-shell.module.css"
GLOBALS_FILE="app/globals.css"
SIDEBAR_FILE="components/demo/internal-shell/internal-sidebar.tsx"
VERIFY_FILE="scripts/demo/verify-d35-2-shared-navigation-visuals.sh"
TEST_FILE="tests/demo/unit/d35-shared-navigation-visuals.test.ts"
DOC_FILE="docs/demo/D35-2-SHARED-NAVIGATION-VISUAL-IMPLEMENTATION.md"

START_MARKER='/* D35-2 — Applicant, Officer, Supervisor, and Admin navigation refinement */'
END_MARKER='/* End D35-2 shared navigation refinement */'

fail() {
  printf 'FAIL: %s\n' "$1" >&2
  exit 1
}

require_literal() {
  local file="$1"
  local literal="$2"
  local message="$3"
  grep -Fq -- "$literal" "$file" || fail "$message"
}

[[ "$(git branch --show-current)" == "$BRANCH" ]] || \
  fail "Expected branch '$BRANCH'."

for file in \
  "$CONTRACT" \
  "$AMENDMENT_B" \
  "$CSS_FILE" \
  "$GLOBALS_FILE" \
  "$SIDEBAR_FILE" \
  "$VERIFY_FILE" \
  "$TEST_FILE" \
  "$DOC_FILE"
do
  [[ -f "$file" ]] || fail "Missing required file: $file"
done

git ls-files --error-unmatch "$CONTRACT" >/dev/null 2>&1 || \
  fail "D35-1 contract is not committed."

require_literal \
  "$AMENDMENT_B" \
  "SUPERSEDES D35-1A WHERE VALUES CONFLICT" \
  "D35-1B amendment marker is missing."

START_COUNT="$(grep -Fc -- "$START_MARKER" "$CSS_FILE")"
END_COUNT="$(grep -Fc -- "$END_MARKER" "$CSS_FILE")"

[[ "$START_COUNT" -eq 1 ]] || fail "Expected one D35-2 start marker."
[[ "$END_COUNT" -eq 1 ]] || fail "Expected one D35-2 end marker."

BLOCK="$(
  awk \
    -v start="$START_MARKER" \
    -v end="$END_MARKER" '
      index($0, start) { capture = 1 }
      capture { print }
      index($0, end) { exit }
    ' \
    "$CSS_FILE"
)"

for role in APPLICANT OFFICER SUPERVISOR ADMIN; do
  printf '%s\n' "$BLOCK" | grep -Fq \
    ".shell[data-internal-shell-role=\"$role\"] .sidebar :global(.nav-item)" || \
    fail "Missing nav-item selector for $role."

  printf '%s\n' "$BLOCK" | grep -Fq \
    ".shell[data-internal-shell-role=\"$role\"] .sidebar :global(.nav-item:not([aria-current=\"page\"]) .nav-item-label)" || \
    fail "Missing inactive-label selector for $role."

  printf '%s\n' "$BLOCK" | grep -Fq \
    ".shell[data-internal-shell-role=\"$role\"] .sidebar :global(.nav-item[aria-current=\"page\"])" || \
    fail "Missing active-radius selector for $role."

  printf '%s\n' "$BLOCK" | grep -Fq \
    ".shell[data-internal-shell-role=\"$role\"] .sidebar :global(.nav-item-icon)" || \
    fail "Missing icon selector for $role."
done

if printf '%s\n' "$BLOCK" | grep -Fq \
  'data-internal-shell-role="DEPARTMENT"'
then
  fail "Department must remain excluded."
fi

for literal in \
  "min-height: 2.025rem;" \
  '"Source Code Pro Variable"' \
  '"Source Code Pro"' \
  "font-size: 0.7125rem;" \
  "font-weight: var(--font-weight-regular);" \
  "letter-spacing: 0.05px;" \
  "color: #666666;" \
  "border-radius: 0;" \
  "width: 1.35rem;" \
  "height: 1.35rem;" \
  "stroke-width: 1;" \
  "14.025rem"
do
  printf '%s\n' "$BLOCK" | grep -Fq -- "$literal" || \
    fail "Missing D35-2 V3 value: $literal"
done

# Ensure colour is not applied to the whole nav item.
if printf '%s\n' "$BLOCK" | awk '
  /:global\(\.nav-item\),?$/ { in_base = 1 }
  in_base && /\{/ { opened = 1 }
  in_base && opened && /color: #666666;/ { found = 1 }
  in_base && opened && /\}/ { in_base = 0; opened = 0 }
  END { exit(found ? 0 : 1) }
'; then
  fail "#666666 was applied to the nav item parent and would recolour icons."
fi

require_literal \
  "$GLOBALS_FILE" \
  "--sidebar-width-staff: 16.5rem;" \
  "Global sidebar-width token changed."

require_literal \
  "$GLOBALS_FILE" \
  "--control-height-compact: 2.5rem;" \
  "Global compact-control token changed."

if ! git diff --quiet -- "$SIDEBAR_FILE"; then
  fail "internal-sidebar.tsx changed unexpectedly."
fi

ALLOWED=(
  "docs/demo/D35-1A-SHARED-NAVIGATION-VISUAL-CONTRACT-AMENDMENT.md"
  "$AMENDMENT_B"
  "$CSS_FILE"
  "$VERIFY_FILE"
  "$TEST_FILE"
  "$DOC_FILE"
)

while IFS= read -r changed; do
  [[ -z "$changed" ]] && continue
  allowed=0
  for path in "${ALLOWED[@]}"; do
    if [[ "$changed" == "$path" ]]; then
      allowed=1
      break
    fi
  done
  [[ "$allowed" -eq 1 ]] || fail "Unexpected changed file: $changed"
done < <(git status --porcelain --untracked-files=all | sed 's/^.. //')

git diff --check

echo "PASS: D35-2 V3 shared navigation verification passed."
