#!/usr/bin/env bash
set -euo pipefail

EXPECTED_ROOT="${FAIDIA_ROOT:-/Users/blaq/Downloads/faidia}"

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

ROUTE="app/demo/officer/requests/[requestId]/page.tsx"
REFERRAL="app/demo/officer/requests/[requestId]/share-workflow-referral-page.tsx"
COMPONENT="components/demo/officer/individual-case/officer-individual-case-shell.tsx"
STYLES="components/demo/officer/individual-case/officer-individual-case.module.css"

for FILE in "$ROUTE" "$REFERRAL" "$COMPONENT" "$STYLES"; do
  [[ -f "$FILE" ]] \
    && pass "File exists: $FILE" \
    || fail "Missing file: $FILE"
done

grep -Fq "OfficerIndividualCaseShell" "$ROUTE" \
  && pass "Default request route renders the individual case" \
  || fail "Individual case route wiring is missing"

grep -Fq 'view === "refer"' "$ROUTE" \
  && pass "Referral query mode is preserved" \
  || fail "Referral route mode is missing"

grep -Fq "data-share-workflow-referral-link" "$COMPONENT" \
  && grep -Fq "?view=refer" "$COMPONENT" \
  && pass "Share Workflow / Refer Case link exists" \
  || fail "Referral action is missing"

MARKERS=(
  "Request details"
  "Submitted documents"
  "Academic record verification"
  "Next action"
  "Applicant"
  "Case activity"
  "Complete review"
  "Request information"
  "Add note"
)

for MARKER in "${MARKERS[@]}"; do
  grep -Fq "$MARKER" "$COMPONENT" \
    && pass "Case capability found: $MARKER" \
    || fail "Missing case capability: $MARKER"
done

grep -Fq "grid-template-columns: minmax(0, 1.55fr)" "$STYLES" \
  && pass "Desktop case split exists" \
  || fail "Desktop case layout is missing"

grep -Fq "@media (max-width: 47.99rem)" "$STYLES" \
  && pass "Mobile case layout exists" \
  || fail "Mobile case layout is missing"

if git diff --name-only -- app/demo/officer/page.tsx \
  | grep -q .; then
  fail "Officer dashboard page was modified"
else
  pass "Officer dashboard route remains unchanged"
fi

PAGE_COUNT="$(
  find app/demo -type f -name "page.tsx" \
  | wc -l \
  | tr -d " "
)"

[[ "$PAGE_COUNT" -eq 14 ]] \
  && pass "The 14-page route inventory remains intact" \
  || fail "Expected 14 page routes but found $PAGE_COUNT"

if grep -R -nE \
  "createClient\(|supabase\.|\bfetch[[:space:]]*\(|axios\." \
  "$ROUTE" \
  "$COMPONENT"; then
  fail "Individual case must not use Supabase or network access"
else
  pass "Individual case adds no Supabase or network access"
fi

bash -n scripts/verify-d29r20-officer-individual-case.sh
pass "Verifier syntax is valid"

printf "\nD29R-20 OFFICER INDIVIDUAL CASE VERIFICATION PASSED\n"
