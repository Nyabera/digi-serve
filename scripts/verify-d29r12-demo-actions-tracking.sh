#!/usr/bin/env bash
set -euo pipefail

EXPECTED_ROOT="${FAIDIA_ROOT:-/Users/blaq/Downloads/faidia}"
EXPECTED_BRANCH="${FAIDIA_BRANCH:-feat/demo-engine-base}"

pass() { printf "PASS: %s\n" "$1"; }
fail() { printf "FAIL: %s\n" "$1" >&2; exit 1; }

[[ "$(pwd)" == "$EXPECTED_ROOT" ]] \
  && pass "Current directory is correct" \
  || fail "Run this verifier from $EXPECTED_ROOT"

CURRENT_BRANCH="$(git branch --show-current 2>/dev/null || true)"
[[ -z "$CURRENT_BRANCH" || "$CURRENT_BRANCH" == "$EXPECTED_BRANCH" ]] \
  && pass "Current branch is acceptable" \
  || fail "Expected branch $EXPECTED_BRANCH"

REQUIRED_FILES=(
  "app/demo/demo-accessibility.css"
  "app/demo/track/route.ts"
  "app/demo/track/[requestId]/page.tsx"
  "components/demo/homepage/savannah-homepage.module.css"
  "components/demo/homepage/savannah-homepage.tsx"
  "components/demo/requests/request-review-submission.tsx"
  "docs/demo-engine-base/D29R-12-DEMO-ACTION-CONTROLS-TRACKING.md"
  "scripts/verify-d29r12-demo-actions-tracking.sh"
)

for FILE in "${REQUIRED_FILES[@]}"; do
  [[ -f "$FILE" ]] \
    && pass "File exists: $FILE" \
    || fail "Missing file: $FILE"
done

grep -Fq "D29R-12: single-line text action controls" \
  app/demo/demo-accessibility.css \
  && pass "Shared action-control contract exists" \
  || fail "Shared action-control contract is missing"

grep -Fq "white-space: nowrap" app/demo/demo-accessibility.css \
  && pass "Single-line button behavior exists" \
  || fail "Single-line button behavior is missing"

grep -Fq ".lucide-arrow-right" app/demo/demo-accessibility.css \
  && grep -Fq "display: none" app/demo/demo-accessibility.css \
  && pass "Decorative directional icons are suppressed" \
  || fail "Directional-icon suppression is missing"

grep -Fq "D29R-12 homepage action contract" \
  components/demo/homepage/savannah-homepage.module.css \
  && pass "Homepage action contract exists" \
  || fail "Homepage action contract is missing"

grep -Fq 'href="/demo/track"' \
  components/demo/homepage/savannah-homepage.tsx \
  && pass "Homepage exposes canonical tracking entry" \
  || fail "Homepage tracking entry is missing"

grep -Fq 'href={`/demo/track/${submissionReference}`}' \
  components/demo/requests/request-review-submission.tsx \
  && pass "Submitted requests link to their matching tracking page" \
  || fail "Dynamic post-submission tracking link is missing"

if grep -Fq "<ArrowRight" \
  components/demo/requests/request-review-submission.tsx; then
  fail "Submission action controls still contain ArrowRight"
else
  pass "Submission action controls contain no decorative arrows"
fi

grep -Fq 'DEFAULT_DEMO_REQUEST_ID = "REQ-DEMO-001"' \
  app/demo/track/route.ts \
  && grep -Fq "NextResponse.redirect" app/demo/track/route.ts \
  && pass "/demo/track resolves to the seeded demonstration request" \
  || fail "Canonical tracking redirect is incomplete"

grep -Fq 'searchParams.get("requestId")' \
  app/demo/track/route.ts \
  && pass "Tracking entry accepts a safe synthetic request ID" \
  || fail "Tracking query entry is missing"

PAGE_COUNT="$(
  find app/demo -type f -name "page.tsx" | wc -l | tr -d " "
)"

[[ "$PAGE_COUNT" -eq 14 ]] \
  && pass "The 14-page route inventory remains intact" \
  || fail "Expected 14 page.tsx routes but found $PAGE_COUNT"

if grep -R -nE \
  "from[[:space:]]+[\"'][^\"']*supabase|createClient\\(|supabase\\." \
  app/demo/track/route.ts \
  scripts/verify-d29r12-demo-actions-tracking.sh; then
  fail "D29R-12 must not call Supabase"
else
  pass "D29R-12 adds no Supabase dependency"
fi

bash -n scripts/verify-d29r12-demo-actions-tracking.sh
pass "Verifier syntax is valid"

printf "\nD29R-12 DEMO ACTION CONTROLS AND TRACKING VERIFICATION PASSED\n"
