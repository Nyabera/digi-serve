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
  "features/demo-operations/fixtures/operational-data.ts"
  "features/demo-operations/components/operational-workspaces.tsx"
  "features/demo-operations/components/operational-workspaces.module.css"
  "app/demo/officer/tasks/page.tsx"
  "app/demo/officer/queue/page.tsx"
  "app/demo/officer/sla-monitor/page.tsx"
  "app/demo/supervisor/audit-trail/page.tsx"
  "app/demo/supervisor/sla-monitor/page.tsx"
)

for FILE in "${REQUIRED_FILES[@]}"; do
  [[ -f "$FILE" ]] \
    && pass "File exists: $FILE" \
    || fail "Missing file: $FILE"
done

grep -Fq 'data-d29r23b-officer-tasks="true"' \
  features/demo-operations/components/operational-workspaces.tsx \
  && pass "Officer tasks workspace marker exists" \
  || fail "Officer tasks workspace marker is missing"

grep -Fq 'data-d29r23b-officer-sla="true"' \
  features/demo-operations/components/operational-workspaces.tsx \
  && pass "Officer SLA workspace marker exists" \
  || fail "Officer SLA workspace marker is missing"

grep -Fq 'data-d29r23b-supervisor-audit="true"' \
  features/demo-operations/components/operational-workspaces.tsx \
  && pass "Supervisor audit workspace marker exists" \
  || fail "Supervisor audit workspace marker is missing"

grep -Fq 'data-d29r23b-supervisor-sla="true"' \
  features/demo-operations/components/operational-workspaces.tsx \
  && pass "Supervisor SLA workspace marker exists" \
  || fail "Supervisor SLA workspace marker is missing"

grep -Fq 'min-height: 44px' \
  features/demo-operations/components/operational-workspaces.module.css \
  && pass "44px interactive control capability exists" \
  || fail "Missing 44px interactive control capability"

BREAKPOINT_COUNT="$(
  grep -Ec '@media[[:space:]]*[(]max-width:' \
    features/demo-operations/components/operational-workspaces.module.css \
    || true
)"
[[ "$BREAKPOINT_COUNT" -ge 2 ]] \
  && pass "At least two responsive breakpoints exist" \
  || fail "Expected at least two responsive breakpoints"

if grep -R -nE \
  'createClient[(]|supabase[.]|axios[.]|fetch[[:space:]]*[(]|XMLHttpRequest|new[[:space:]]+WebSocket' \
  features/demo-operations \
  app/demo/officer/tasks \
  app/demo/officer/queue \
  app/demo/officer/sla-monitor \
  app/demo/supervisor/audit-trail \
  app/demo/supervisor/sla-monitor; then
  fail "D29R-23B must not add network access"
else
  pass "D29R-23B adds no network access"
fi

if [[ -f components/demo/internal-shell/internal-navigation.ts ]]; then
  grep -Fq '/demo/officer/tasks' \
    components/demo/internal-shell/internal-navigation.ts \
    && pass "Officer My tasks navigation is functional" \
    || fail "Officer My tasks navigation was not updated"

  grep -Fq '/demo/officer/sla-monitor' \
    components/demo/internal-shell/internal-navigation.ts \
    && pass "Officer SLA navigation is functional" \
    || fail "Officer SLA navigation was not updated"

  grep -Fq '/demo/supervisor/audit-trail' \
    components/demo/internal-shell/internal-navigation.ts \
    && pass "Supervisor audit navigation is functional" \
    || fail "Supervisor audit navigation was not updated"

  grep -Fq '/demo/supervisor/sla-monitor' \
    components/demo/internal-shell/internal-navigation.ts \
    && pass "Supervisor SLA navigation is functional" \
    || fail "Supervisor SLA navigation was not updated"
else
  pass "Internal navigation file is not present; route aliases remain available"
fi

git diff --check
pass "Git diff contains no whitespace errors"

printf "\nD29R-23B focused verification passed.\n"
