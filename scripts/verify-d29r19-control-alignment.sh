#!/usr/bin/env bash
set -euo pipefail

EXPECTED_ROOT="${FAIDIA_ROOT:-/Users/blaq/Downloads/faidia}"

TOPBAR_TSX="components/demo/internal-shell/internal-topbar.tsx"
SHELL_CSS="components/demo/internal-shell/internal-shell.module.css"
TRACKER_CSS="components/demo/tracking/demo-request-tracking-page.module.css"

pass() {
  printf "PASS: %s\n" "$1"
}

fail() {
  printf "FAIL: %s\n" "$1" >&2
  exit 1
}

[[ "$(pwd)" == "$EXPECTED_ROOT" ]] \
  && pass "Current directory is correct" \
  || fail "Run this verifier from $EXPECTED_ROOT"

grep -Fq "styles.requestSelectorSlot" "$TOPBAR_TSX" \
  && pass "Request selector has a dedicated slot class" \
  || fail "Request selector slot class is missing"

grep -Fq "D29R-19: request selector alignment" "$SHELL_CSS" \
  && pass "Request selector alignment contract exists" \
  || fail "Request selector alignment contract is missing"

grep -A35 -F ".requestSelectorSlot :global(select)" "$SHELL_CSS" \
  | grep -Fq "padding-right: 3rem" \
  && pass "Request text reserves space for the select arrow" \
  || fail "Request select right padding is missing"

grep -A35 -F ".requestSelectorSlot :global(select)" "$SHELL_CSS" \
  | grep -Fq "text-overflow: ellipsis" \
  && pass "Long request values truncate safely" \
  || fail "Request select truncation is missing"

if grep -Fq ".stage strong," "$TRACKER_CSS" \
  || grep -Fq ".stage span {" "$TRACKER_CSS"; then
  fail "Broad stage descendant selector still exists"
else
  pass "Stage text selector no longer overrides the marker"
fi

grep -Fq ".stage > div > strong" "$TRACKER_CSS" \
  && grep -Fq ".stage > div > span" "$TRACKER_CSS" \
  && pass "Stage text selector is scoped to the text container" \
  || fail "Scoped stage text selector is missing"

grep -A30 -F ".stageMarker {" "$TRACKER_CSS" \
  | grep -Fq "place-items: center" \
  && grep -A30 -F ".stageMarker {" "$TRACKER_CSS" \
  | grep -Fq "line-height: 1" \
  && grep -A30 -F ".stageMarker {" "$TRACKER_CSS" \
  | grep -Fq "text-indent: 0" \
  && pass "Stage marker has explicit centered geometry" \
  || fail "Stage marker centering contract is incomplete"

grep -Fq ".stageMarker > svg" "$TRACKER_CSS" \
  && pass "Stage icon alignment is explicit" \
  || fail "Stage icon alignment is missing"

bash -n scripts/verify-d29r19-control-alignment.sh
pass "Verifier syntax is valid"

printf "\nD29R-19 CONTROL ALIGNMENT VERIFICATION PASSED\n"
