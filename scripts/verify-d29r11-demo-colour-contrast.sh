#!/usr/bin/env bash
set -euo pipefail

EXPECTED_ROOT="/Users/blaq/Downloads/faidia"
EXPECTED_BRANCH="feat/demo-engine-base"

pass() { printf "PASS: %s\n" "$1"; }
fail() { printf "FAIL: %s\n" "$1" >&2; exit 1; }

[[ "$(pwd)" == "$EXPECTED_ROOT" ]] \
  && pass "Current directory is correct" \
  || fail "Run this script from $EXPECTED_ROOT"

[[ "$(git branch --show-current)" == "$EXPECTED_BRANCH" ]] \
  && pass "Current branch is $EXPECTED_BRANCH" \
  || fail "Expected branch $EXPECTED_BRANCH"

REQUIRED_FILES=(
  "app/globals.css"
  "app/demo/demo-calibration.css"
  "components/demo/homepage/savannah-homepage.module.css"
  "components/demo/homepage/savannah-homepage.tsx"
  "components/demo/public/service-information-page.tsx"
  "scripts/audit-demo-colour-contrast.mjs"
  "docs/demo-engine-base/D29R-11-DEMO-COLOUR-CONTRAST-CORRECTION.md"
)

for FILE in "${REQUIRED_FILES[@]}"; do
  [[ -f "$FILE" ]] && pass "File exists: $FILE" || fail "Missing file: $FILE"
done

if grep -nE '^[[:space:]]*main([[:space:]]|\{|>|:|\.)' app/demo/demo-calibration.css; then
  fail "D26 calibration still contains an unscoped main selector"
else
  pass "D26 calibration is scoped to the demo presentation content"
fi

if grep -nE '\b(fetch[[:space:]]*\(|axios\.|XMLHttpRequest|new[[:space:]]+WebSocket|createClient\(|supabase\.)' \
  scripts/audit-demo-colour-contrast.mjs; then
  fail "D29R-11 JavaScript verification must not add network or Supabase access"
else
  pass "D29R-11 JavaScript verification adds no network or Supabase access"
fi

if grep -nE '^[[:space:]]*(curl|wget|nc|ncat|telnet)[[:space:]]' \
  scripts/verify-d29r11-demo-colour-contrast.sh; then
  fail "D29R-11 shell verification must not add network access"
else
  pass "D29R-11 shell verification adds no network access"
fi

bash -n scripts/verify-d29r11-demo-colour-contrast.sh
pass "Shell verifier syntax is valid"

node scripts/audit-demo-colour-contrast.mjs
pass "Static contrast regression audit passed"

printf "\nD29R-11 DEMO COLOUR-CONTRAST VERIFICATION PASSED\n"
