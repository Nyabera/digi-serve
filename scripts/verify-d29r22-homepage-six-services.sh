#!/usr/bin/env bash
set -euo pipefail

EXPECTED_ROOT="${FAIDIA_ROOT:-/Users/blaq/Downloads/faidia}"
MARKER="docs/demo-engine-base/.d29r22-homepage-service-component"

pass() { printf "PASS: %s\n" "$1"; }
fail() { printf "FAIL: %s\n" "$1" >&2; exit 1; }

[[ "$(pwd)" == "$EXPECTED_ROOT" ]] \
  && pass "Current directory is correct" \
  || fail "Run this verifier from $EXPECTED_ROOT"

[[ -f "$MARKER" ]] || fail "Missing homepage component marker"
TARGET="$(tr -d '\n' < "$MARKER")"
[[ -f "$TARGET" ]] || fail "Missing homepage service component: $TARGET"

REQUIRED_TEXT=(
  "Request an academic transcript"
  "Complete student clearance"
  "Replace a lost certificate"
  "Get an industrial attachment letter"
  "Apply for a new course"
  "Register for classes"
  "Choose a course, submit your qualifications"
  "Select your units for the upcoming term"
  "/demo/services/course-application"
  "/demo/services/class-registration"
  "GraduationCap"
  "BookOpenCheck"
)

for TEXT in "${REQUIRED_TEXT[@]}"; do
  grep -Fq "$TEXT" "$TARGET" \
    && pass "Homepage service content found: $TEXT" \
    || fail "Missing homepage service content: $TEXT"
done

PAGE_COUNT="$(find app/demo -type f -name 'page.tsx' | wc -l | tr -d ' ')"
[[ "$PAGE_COUNT" -eq 14 ]] \
  && pass "The 14-page route inventory remains intact" \
  || fail "Expected 14 page routes but found $PAGE_COUNT"

bash -n scripts/verify-d29r22-homepage-six-services.sh
pass "Verifier syntax is valid"

printf "\nD29R-22 HOMEPAGE SIX-SERVICE VERIFICATION PASSED\n"
