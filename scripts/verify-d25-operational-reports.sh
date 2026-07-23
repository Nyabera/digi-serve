#!/usr/bin/env bash

set -euo pipefail

EXPECTED_ROOT="/Users/blaq/Downloads/faidia"
EXPECTED_BRANCH="feat/demo-engine-base"

ROUTE_FILE="app/demo/reports/page.tsx"
DASHBOARD_FILE="components/demo/reports/operational-reports-dashboard.tsx"
OFFICER_FILE="components/demo/officer/officer-dashboard.tsx"
DOCUMENT_FILE="docs/demo-engine-base/DEMO-ENGINE-OPERATIONAL-REPORTS.md"
SCRIPT_FILE="scripts/verify-d25-operational-reports.sh"

pass() { printf "PASS: %s\n" "$1"; }
fail() { printf "FAIL: %s\n" "$1" >&2; exit 1; }

printf "\nFAIDIA D25 operational-reports verification\n"
printf "==========================================\n\n"

[[ "$(pwd)" == "$EXPECTED_ROOT" ]] \
  && pass "Current directory is correct" \
  || fail "Run this script from $EXPECTED_ROOT"

[[ "$(git branch --show-current)" == "$EXPECTED_BRANCH" ]] \
  && pass "Current branch is $EXPECTED_BRANCH" \
  || fail "Expected branch $EXPECTED_BRANCH"

REQUIRED_FILES=(
  "$ROUTE_FILE"
  "$DASHBOARD_FILE"
  "$OFFICER_FILE"
  "$DOCUMENT_FILE"
  "$SCRIPT_FILE"
)

for FILE in "${REQUIRED_FILES[@]}"; do
  [[ -f "$FILE" ]] \
    && pass "File exists: $FILE" \
    || fail "Missing file: $FILE"
done

grep -Fq '"recharts"' package.json \
  && pass "Recharts dependency is installed" \
  || fail "package.json must include recharts"

REQUIRED_ROUTE_TEXT=(
  "getDefaultDemoClient"
  ".filter((service) => service.active)"
  "client.departments.map"
  "OperationalReportsDashboard"
  "organizationName={client.organization.name}"
)

for TEXT in "${REQUIRED_ROUTE_TEXT[@]}"; do
  grep -Fq "$TEXT" "$ROUTE_FILE" \
    && pass "Reports route capability found: $TEXT" \
    || fail "Missing reports route capability: $TEXT"
done

REQUIRED_DASHBOARD_TEXT=(
  '"use client"'
  'from "recharts"'
  "ResponsiveContainer"
  "ComposedChart"
  "Area"
  "Line"
  "BarChart"
  "PieChart"
  "useDemoState"
  "Requests submitted"
  "Requests completed"
  "Open backlog"
  "Pending handoffs"
  "Request volume trend"
  "Workflow-stage conversion"
  "Handoff position"
  "Department workload"
  "Average processing time"
  "SLA attainment trend"
  "Service demand mix"
  "Backlog age profile"
  "Controlled report filters"
  'href="/demo/officer"'
  'href="/demo/department"'
  "Demonstration analytics only"
)

for TEXT in "${REQUIRED_DASHBOARD_TEXT[@]}"; do
  grep -Fq "$TEXT" "$DASHBOARD_FILE" \
    && pass "Reports capability found: $TEXT" \
    || fail "Missing reports capability: $TEXT"
done

REQUIRED_DOCUMENT_TEXT=(
  "D25 replaces the reports placeholder with a focused operational dashboard."
  "D25 does not implement the full reporting platform."
  "The dashboard starts from a controlled synthetic reporting snapshot."
  "No metric is presented as a production aggregate."
  "## 9. D25 definition of done"
)

for TEXT in "${REQUIRED_DOCUMENT_TEXT[@]}"; do
  grep -Fq "$TEXT" "$DOCUMENT_FILE" \
    && pass "Documentation rule found: $TEXT" \
    || fail "Missing documentation rule: $TEXT"
done

grep -Fq 'href="/demo/reports"' "$OFFICER_FILE" \
  && pass "Officer dashboard links to reports" \
  || fail "Officer dashboard must link to /demo/reports"

if grep -nE \
  "from[[:space:]]+[\"'][^\"']*supabase|createClient\\(|supabase\\." \
  "$ROUTE_FILE" "$DASHBOARD_FILE"; then
  fail "D25 runtime files must not call Supabase"
else
  pass "No Supabase runtime dependency found"
fi

PAGE_COUNT="$(
  find app/demo -type f -name "page.tsx" | wc -l | tr -d " "
)"

[[ "$PAGE_COUNT" -eq 14 ]] \
  && pass "The 14-route inventory remains intact" \
  || fail "Expected 14 route pages but found $PAGE_COUNT"

ALLOWED_FILES=(
  "$ROUTE_FILE"
  "$DASHBOARD_FILE"
  "$OFFICER_FILE"
  "$DOCUMENT_FILE"
  "$SCRIPT_FILE"
)

while IFS= read -r LINE; do
  [[ -z "$LINE" ]] && continue
  FILE_PATH="${LINE:3}"
  ALLOWED=false

  for ALLOWED_FILE in "${ALLOWED_FILES[@]}"; do
    if [[ "$FILE_PATH" == "$ALLOWED_FILE" ]]; then
      ALLOWED=true
      break
    fi
  done

  [[ "$ALLOWED" == true ]] \
    || fail "Unexpected changed file: $FILE_PATH"
done < <(git status --porcelain=v1 --untracked-files=all)

pass "Only D25-owned files are changed"

bash -n "$SCRIPT_FILE"
pass "Verification script syntax is valid"

printf "\n==========================================\n"
printf "D25 VERIFICATION PASSED\n"
printf "The Recharts operational dashboard is ready.\n\n"
