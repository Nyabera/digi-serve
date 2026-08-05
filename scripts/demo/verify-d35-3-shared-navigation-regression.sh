#!/usr/bin/env bash
set -euo pipefail

BRANCH="demo/d35-shared-navigation-visual-refinement"
INTERNAL_CSS="components/demo/internal-shell/internal-shell.module.css"
APPLICANT_CSS="features/demo-applicant/components/applicant-workspace-shell.module.css"
APPLICANT_TSX="features/demo-applicant/components/applicant-workspace-shell.tsx"
GLOBALS="app/globals.css"

ALLOWED=(
  "$APPLICANT_CSS"
  "docs/demo/D35-3-APPLICANT-PARITY-RESPONSIVE-REGRESSION.md"
  "scripts/demo/verify-d35-3-shared-navigation-regression.sh"
  "tests/demo/unit/d35-shared-navigation-regression.test.ts"
  "tests/acceptance/d35/shared-navigation-responsive.pw.ts"
  "playwright.d35.config.ts"
)

fail() {
  printf 'FAIL: %s\n' "$1" >&2
  exit 1
}

require_literal() {
  grep -Fq -- "$2" "$1" || fail "$3"
}

[[ "$(git branch --show-current)" == "$BRANCH" ]] || \
  fail "Expected branch '$BRANCH'."

for file in "$INTERNAL_CSS" "$APPLICANT_CSS" "$APPLICANT_TSX" "$GLOBALS"; do
  [[ -f "$file" ]] || fail "Missing required file: $file"
done

# Shared-shell final values.
for literal in \
  "min-height: 2.025rem;" \
  "font-size: 0.7125rem;" \
  '"Source Code Pro"' \
  "letter-spacing: 0.05px;" \
  "color: #666666;" \
  "border-radius: 0;" \
  "width: 1.35rem;" \
  "height: 1.35rem;" \
  "stroke-width: 1;" \
  "14.025rem"
do
  require_literal "$INTERNAL_CSS" "$literal" \
    "Missing shared-shell D35 value: $literal"
done

# Applicant parity final values.
for literal in \
  "/* D35-3 — Applicant navigation parity */" \
  "min-height: 35.64px;" \
  '"Source Code Pro Variable"' \
  '"Source Code Pro"' \
  "font-size: 0.7125rem;" \
  "font-weight: 400;" \
  "letter-spacing: 0.05px;" \
  "color: #666666;" \
  "border-radius: 0;" \
  "width: 17.1px;" \
  "height: 17.1px;" \
  "stroke-width: 1;" \
  "@media (min-width: 921px)" \
  "214.2px" \
  "/* End D35-3 Applicant navigation parity */"
do
  require_literal "$APPLICANT_CSS" "$literal" \
    "Missing Applicant D35 value: $literal"
done

# Preserve mobile and global widths/tokens.
require_literal "$APPLICANT_CSS" \
  "width: min(286px, 86vw);" \
  "Applicant mobile drawer width changed."

require_literal "$GLOBALS" \
  "--sidebar-width-collapsed: 4.5rem;" \
  "Internal collapsed width token changed."

require_literal "$GLOBALS" \
  "--sidebar-width-mobile: min(20rem, 86vw);" \
  "Internal mobile width token changed."

# Component icon attributes remain untouched; CSS provides the visual override.
require_literal "$APPLICANT_TSX" \
  "size={19}" \
  "Applicant icon component declarations changed unexpectedly."

while IFS= read -r changed; do
  [[ -z "$changed" ]] && continue
  permitted=0
  for path in "${ALLOWED[@]}"; do
    if [[ "$changed" == "$path" ]]; then
      permitted=1
      break
    fi
  done
  [[ "$permitted" -eq 1 ]] || fail "Unexpected D35-3 file: $changed"
done < <(git status --porcelain --untracked-files=all | sed 's/^.. //')

git diff --check

echo "PASS: D35-3 source regression verification passed."
