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

REQUIRED_FILES=(
  "features/demo-service-workflows/fixtures/service-workflows.ts"
  "features/demo-service-workflows/components/service-workflow-pages.tsx"
  "features/demo-service-workflows/components/service-workflow-pages.module.css"
  "app/demo/services/student-clearance/page.tsx"
  "app/demo/services/certificate-replacement/page.tsx"
  "app/demo/services/industrial-attachment-letter/page.tsx"
  "app/demo/services/course-application/page.tsx"
  "app/demo/services/class-registration/page.tsx"
  "app/demo/apply/student-clearance/page.tsx"
  "app/demo/apply/certificate-replacement/page.tsx"
  "app/demo/apply/industrial-attachment-letter/page.tsx"
  "app/demo/apply/course-application/page.tsx"
  "app/demo/apply/class-registration/page.tsx"
  "app/demo/track/CLEAR-2026-0042/page.tsx"
  "app/demo/track/CERT-2026-0061/page.tsx"
  "app/demo/track/ATTACH-2026-0088/page.tsx"
  "app/demo/track/COURSE-2026-01482/page.tsx"
  "app/demo/track/CLASS-2026-0109/page.tsx"
)

for FILE in "${REQUIRED_FILES[@]}"; do
  [[ -f "$FILE" ]] \
    && pass "File exists: $FILE" \
    || fail "Missing file: $FILE"
done

for MARKER in \
  'data-d29r23c-service-information' \
  'data-d29r23c-application' \
  'data-d29r23c-tracking'; do
  grep -Fq "$MARKER" \
    features/demo-service-workflows/components/service-workflow-pages.tsx \
    && pass "Workspace marker exists: $MARKER" \
    || fail "Missing workspace marker: $MARKER"
done

grep -Fq 'min-height: 44px' \
  features/demo-service-workflows/components/service-workflow-pages.module.css \
  && pass "44px interactive-control capability exists" \
  || fail "Missing 44px interactive-control capability"

BREAKPOINT_COUNT="$(
  grep -Ec '@media[[:space:]]*[(]max-width:' \
    features/demo-service-workflows/components/service-workflow-pages.module.css \
    || true
)"

[[ "$BREAKPOINT_COUNT" -ge 2 ]] \
  && pass "At least two responsive breakpoints exist" \
  || fail "Expected at least two responsive breakpoints"

grep -Fq 'Transcript Request is not replaced or modified.' \
  docs/demo-engine-base/D29R-23C-FIVE-SERVICE-WORKFLOWS.md \
  && pass "Transcript preservation is documented" \
  || fail "Transcript preservation is not documented"

if grep -R -nE \
  'createClient[(]|supabase[.]|axios[.]|fetch[[:space:]]*[(]|XMLHttpRequest|new[[:space:]]+WebSocket' \
  features/demo-service-workflows \
  app/demo/services/student-clearance \
  app/demo/services/certificate-replacement \
  app/demo/services/industrial-attachment-letter \
  app/demo/services/course-application \
  app/demo/services/class-registration \
  app/demo/apply/student-clearance \
  app/demo/apply/certificate-replacement \
  app/demo/apply/industrial-attachment-letter \
  app/demo/apply/course-application \
  app/demo/apply/class-registration \
  app/demo/track/CLEAR-2026-0042 \
  app/demo/track/CERT-2026-0061 \
  app/demo/track/ATTACH-2026-0088 \
  app/demo/track/COURSE-2026-01482 \
  app/demo/track/CLASS-2026-0109; then
  fail "D29R-23C must not add network access"
else
  pass "D29R-23C adds no network access"
fi

git diff --check
pass "Git diff contains no whitespace errors"

printf "\nD29R-23C focused verification passed.\n"
