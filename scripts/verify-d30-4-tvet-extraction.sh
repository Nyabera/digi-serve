#!/usr/bin/env bash
set -euo pipefail

ROOT="${FAIDIA_ROOT:-/Users/blaq/Downloads/faidia}"
EXPECTED_BRANCH="feat/demo-engine-base"
D30_DIR="docs/demo-engine-base/d30-freeze"

cd "$ROOT"

fail() {
  printf "FAIL: %s\n" "$1" >&2
  exit 1
}

pass() {
  printf "PASS: %s\n" "$1"
}

[[ "$(git branch --show-current)" == "$EXPECTED_BRANCH" ]] \
  || fail "Expected branch $EXPECTED_BRANCH"

required=(
  "demo-packs/tvet/manifest.ts"
  "demo-packs/tvet/organization.ts"
  "demo-packs/tvet/branding.ts"
  "demo-packs/tvet/homepage.ts"
  "demo-packs/tvet/departments.ts"
  "demo-packs/tvet/users.ts"
  "demo-packs/tvet/services.ts"
  "demo-packs/tvet/workflows.ts"
  "demo-packs/tvet/requests.ts"
  "demo-packs/tvet/reports.ts"
  "demo-packs/tvet/sla.ts"
  "$D30_DIR/CURRENT-SAVANNAH-SOURCE-LOCATIONS.txt"
  "$D30_DIR/TVET-EXTRACTION-SOURCE-MAP.md"
  "$D30_DIR/D30-4-CHECKLIST.md"
)

for file in "${required[@]}"; do
  [[ -s "$file" ]] || fail "Missing or empty file: $file"
done

pass "Required D30-4 files exist"

grep -Fq 'name: "Savannah Technical College"' \
  demo-packs/tvet/organization.ts \
  || fail "Savannah organization identity is missing"

grep -Fq 'homepageFont: "Plus Jakarta Sans"' \
  demo-packs/tvet/branding.ts \
  || fail "Homepage font extraction is missing"

grep -Fq 'homepageHeadingLetterSpacing: "-0.025em"' \
  demo-packs/tvet/branding.ts \
  || fail "Homepage H2 letter-spacing extraction is missing"

pass "Organization and branding values are extracted"

service_count="$(
  grep -Ec '^[[:space:]]+id: "(transcript-request|student-clearance|certificate-replacement|industrial-attachment-letter|course-application|class-registration)",$' \
    demo-packs/tvet/services.ts \
    || true
)"

[[ "$service_count" -eq 6 ]] \
  || fail "Expected 6 core TVET services; found $service_count"

pass "Six core TVET services are extracted"

for workflow in \
  transcript-request \
  student-clearance \
  certificate-replacement \
  industrial-attachment-letter \
  course-application \
  class-registration; do
  grep -Fq "id: \"$workflow\"" demo-packs/tvet/workflows.ts \
    || fail "Missing workflow: $workflow"
done

pass "Core TVET workflows are extracted"

grep -Fq 'id: "STC-CL-2026-0027"' \
  demo-packs/tvet/requests.ts \
  || fail "Default TVET request is missing"

grep -Fq 'charts: [' demo-packs/tvet/reports.ts \
  || fail "Report chart extraction is missing"

grep -Fq 'seededPerformance: [' demo-packs/tvet/sla.ts \
  || fail "SLA performance extraction is missing"

pass "Requests, reports and SLA data are extracted"

grep -Fq 'version: "0.3.0-draft"' \
  demo-packs/tvet/manifest.ts \
  || fail "TVET manifest version was not updated"

grep -Fq "satisfies DemoPack" \
  demo-packs/tvet/manifest.ts \
  || fail "TVET manifest no longer satisfies DemoPack"

pass "TVET manifest is typed and versioned"

runtime_imports="$(
  grep -RniE \
    'from ["'\''].*demo-packs/tvet' \
    app components features \
    --include='*.ts' \
    --include='*.tsx' \
    2>/dev/null |
  grep -v '^features/demo-engine/config/active-demo-pack.ts:' || true
)"

if [[ -n "$runtime_imports" ]]; then
  printf "Unexpected named-pack imports:\n%s\n" "$runtime_imports"
  fail "Running Demo directly imports the TVET pack before runtime cutover"
fi

pass "Running Demo remains disconnected from the TVET pack"

git diff --check

pass "Git whitespace validation passed"

printf "\nD30-4 TVET extraction verification passed.\n"
