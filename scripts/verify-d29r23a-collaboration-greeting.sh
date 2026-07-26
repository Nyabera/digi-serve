#!/usr/bin/env bash
set -euo pipefail

EXPECTED_ROOT="${FAIDIA_ROOT:-/Users/blaq/Downloads/faidia}"
MARKER="docs/demo-engine-base/.d29r23a-referral-target"

pass() { printf "PASS: %s\n" "$1"; }
fail() { printf "FAIL: %s\n" "$1" >&2; exit 1; }

[[ "$(pwd)" == "$EXPECTED_ROOT" ]] \
  && pass "Current directory is correct" \
  || fail "Run this verifier from $EXPECTED_ROOT"

COMPONENT="components/demo/officer/referral/external-recipient-share-panel.tsx"

[[ -f "$COMPONENT" ]] \
  && pass "External share component exists" \
  || fail "External share component is missing"

grep -Fq "Email or phone number" "$COMPONENT" \
  && grep -Fq "Send secure link" "$COMPONENT" \
  && pass "External recipient controls exist" \
  || fail "External recipient controls are incomplete"

[[ -f "$MARKER" ]] \
  || fail "Referral target marker is missing"

TARGET="$(tr -d '\n' < "$MARKER")"

grep -Fq "ExternalRecipientSharePanel" "$TARGET" \
  && pass "External share panel is mounted" \
  || fail "External share panel is not mounted"

if grep -R -n -F "👋" app/demo components/demo features/demo \
  --include='*.tsx'; then
  fail "Dashboard wave emoji still exists"
else
  pass "Dashboard wave emoji was removed"
fi

printf "\nD29R-23A COLLABORATION AND GREETING VERIFICATION PASSED\n"
