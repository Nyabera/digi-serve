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
  "app/demo/track/route.ts"
  "app/demo/track/[requestId]/page.tsx"
  "components/demo/tracking/demo-request-tracking-page.tsx"
  "components/demo/tracking/demo-request-tracking-page.module.css"
  "components/demo/tracking/index.ts"
  "docs/demo-engine-base/D29R-13-DEMO-REQUEST-PROCESSING-TRACKER.md"
  "scripts/verify-d29r13-demo-request-tracker.sh"
)

for FILE in "${REQUIRED_FILES[@]}"; do
  [[ -f "$FILE" ]] \
    && pass "File exists: $FILE" \
    || fail "Missing file: $FILE"
done

TRACKER="components/demo/tracking/demo-request-tracking-page.tsx"

REQUIRED_MARKERS=(
  "Track your request"
  "Request processing"
  "role=\"progressbar\""
  "ResponsiveContainer"
  "LineChart"
  "What the demo engine is doing"
  "Advance demo"
  "Pause simulation"
  "Restart demo"
  "Transcript ready"
)

for MARKER in "${REQUIRED_MARKERS[@]}"; do
  grep -Fq "$MARKER" "$TRACKER" \
    && pass "Tracker capability found: $MARKER" \
    || fail "Missing tracker capability: $MARKER"
done

if grep -Eq '<button[^>]*>[^<]*(Arrow|Chevron)|<ArrowRight|<ChevronRight' "$TRACKER"; then
  fail "Tracking action buttons must not contain decorative arrows"
else
  pass "Tracking action buttons use text-only labels"
fi

grep -Fq 'DEFAULT_DEMO_REQUEST_ID = "REQ-DEMO-001"' \
  app/demo/track/route.ts \
  && grep -Fq "NextResponse.redirect" app/demo/track/route.ts \
  && pass "Canonical tracking entry redirects to the seeded request" \
  || fail "Canonical tracking entry is incomplete"

grep -Fq "DemoRequestTrackingPage" \
  'app/demo/track/[requestId]/page.tsx' \
  && pass "Dynamic tracking route renders the new tracker" \
  || fail "Dynamic tracking route does not render the new tracker"

PAGE_COUNT="$(
  find app/demo -type f -name "page.tsx" | wc -l | tr -d " "
)"

[[ "$PAGE_COUNT" -eq 14 ]] \
  && pass "The 14-page route inventory remains intact" \
  || fail "Expected 14 page.tsx routes but found $PAGE_COUNT"

if grep -R -nE \
  "from[[:space:]]+[\"'][^\"']*supabase|createClient\\(|supabase\\." \
  app/demo/track \
  components/demo/tracking; then
  fail "D29R-13 must not call Supabase"
else
  pass "D29R-13 adds no Supabase dependency"
fi

bash -n scripts/verify-d29r13-demo-request-tracker.sh
pass "Verifier syntax is valid"

printf "\nD29R-13 DEMO REQUEST TRACKER VERIFICATION PASSED\n"
