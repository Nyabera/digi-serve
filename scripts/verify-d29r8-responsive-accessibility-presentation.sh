#!/usr/bin/env bash

set -euo pipefail

EXPECTED_ROOT="/Users/blaq/Downloads/faidia"
EXPECTED_BRANCH="feat/demo-engine-base"

DOCUMENT_FILE="docs/demo-engine-base/DEMO-ENGINE-INTERNAL-RESPONSIVE-ACCESSIBILITY-PRESENTATION.md"
AUDIT_FILE="scripts/audit-d29r8-internal-accessibility.mjs"
SCRIPT_FILE="scripts/verify-d29r8-responsive-accessibility-presentation.sh"

pass() { printf "PASS: %s\n" "$1"; }
fail() { printf "FAIL: %s\n" "$1" >&2; exit 1; }

printf "\nFAIDIA D29R-8 Responsive, accessibility and presentation checks\n"
printf "==============================================================\n\n"

[[ "$(pwd)" == "$EXPECTED_ROOT" ]] \
  && pass "Current directory is correct" \
  || fail "Run this script from $EXPECTED_ROOT"

[[ "$(git rev-parse --show-toplevel 2>/dev/null)" == "$EXPECTED_ROOT" ]] \
  && pass "Git repository root is correct" \
  || fail "Git repository root is incorrect"

[[ "$(git branch --show-current)" == "$EXPECTED_BRANCH" ]] \
  && pass "Current branch is $EXPECTED_BRANCH" \
  || fail "Expected branch $EXPECTED_BRANCH"

REQUIRED_FILES=(
  "$DOCUMENT_FILE"
  "$AUDIT_FILE"
  "$SCRIPT_FILE"
  "app/demo/layout.tsx"
  "app/demo/demo-accessibility.css"
  "app/demo/demo-presentation.css"
  "components/demo/presentation/demo-presentation-frame.tsx"
  "components/demo/internal-shell/internal-app-shell.tsx"
  "components/demo/officer/officer-dashboard.tsx"
  "components/demo/officer/officer-request-review.tsx"
  "components/demo/department/department-inbox-workspace.tsx"
  "components/demo/department/department-handoff-processing-workspace.tsx"
  "components/demo/supervisor/supervisor-dashboard-workspace.tsx"
  "components/demo/supervisor/supervisor-approval-workspace.tsx"
  "components/demo/reports/operational-reports-shell.tsx"
  "components/demo/outcomes/controlled-outcome-shell.tsx"
  "features/officer-dashboard/components/officer-dashboard-body.tsx"
  "features/officer-review/components/officer-review-referral-body.tsx"
  "features/department-handoffs/components/department-inbox-body.tsx"
  "features/department-handoffs/components/department-processing-body.tsx"
  "features/supervisor-approvals/components/supervisor-dashboard-body.tsx"
  "features/supervisor-approvals/components/supervisor-approval-body.tsx"
)

for FILE in "${REQUIRED_FILES[@]}"; do
  [[ -f "$FILE" ]] \
    && pass "File exists: $FILE" \
    || fail "Missing file: $FILE"
done

grep -Fq 'className="demo-skip-link"' app/demo/layout.tsx \
  && grep -Fq 'href="#demo-main-content"' app/demo/layout.tsx \
  && pass "Global skip link remains available" \
  || fail "Global skip link is missing"

grep -Fq 'id="demo-main-content"' components/demo/presentation/demo-presentation-frame.tsx \
  && grep -Fq 'tabIndex={-1}' components/demo/presentation/demo-presentation-frame.tsx \
  && pass "Main-content focus target remains available" \
  || fail "Main-content focus target is missing"

PRESENTATION_FILE="components/demo/presentation/demo-presentation-frame.tsx"

REQUIRED_PRESENTATION_TEXT=(
  "requestFullscreen"
  "exitFullscreen"
  "sessionStorage"
  "faidia.demo-engine."
  "Production data and Supabase are not touched."
  "event.shiftKey"
  '"p"'
  '"r"'
  "Escape"
)

for TEXT in "${REQUIRED_PRESENTATION_TEXT[@]}"; do
  grep -Fq -- "$TEXT" "$PRESENTATION_FILE" \
    && pass "Presentation/reset capability found: $TEXT" \
    || fail "Missing presentation/reset capability: $TEXT"
done

REQUIRED_ACCESSIBILITY_CSS=(
  ".demo-skip-link"
  ":focus-visible"
  "@media (pointer: coarse)"
  "@media (prefers-reduced-motion: reduce)"
  "@media (forced-colors: active)"
  "overflow-wrap: anywhere"
)

for TEXT in "${REQUIRED_ACCESSIBILITY_CSS[@]}"; do
  grep -Fq -- "$TEXT" app/demo/demo-accessibility.css \
    && pass "Accessibility CSS capability found: $TEXT" \
    || fail "Missing accessibility CSS capability: $TEXT"
done

if grep -Eq 'min-(height|block-size):[[:space:]]*(44px|4[5-9]px|[5-9][0-9]px|2\.75rem|3rem)' app/demo/demo-accessibility.css; then
  pass "Accessibility CSS capability found: minimum 44px control target"
else
  fail "Missing accessibility CSS capability: minimum 44px control target"
fi

SHELL_CONTAINERS=(
  "components/demo/officer/officer-dashboard.tsx"
  "components/demo/officer/officer-request-review.tsx"
  "components/demo/department/department-inbox-workspace.tsx"
  "components/demo/department/department-handoff-processing-workspace.tsx"
  "components/demo/supervisor/supervisor-dashboard-workspace.tsx"
  "components/demo/supervisor/supervisor-approval-workspace.tsx"
  "components/demo/reports/operational-reports-shell.tsx"
  "components/demo/outcomes/controlled-outcome-shell.tsx"
)

for FILE in "${SHELL_CONTAINERS[@]}"; do
  grep -Fq "InternalAppShell" "$FILE" \
    && pass "Shared shell mounted: $FILE" \
    || fail "Shared shell missing from: $FILE"
done

FEATURE_STYLE_FILES=(
  "features/officer-dashboard/components/officer-dashboard-body.module.css"
  "features/officer-review/components/officer-review-referral-body.module.css"
  "features/department-handoffs/components/department-handoff-workspace.module.css"
  "features/supervisor-approvals/components/supervisor-workspace.module.css"
  "components/demo/reports/reports-dashboard.module.css"
  "components/demo/shell-pages/internal-secondary-page-shell.module.css"
)

for FILE in "${FEATURE_STYLE_FILES[@]}"; do
  [[ -f "$FILE" ]] \
    || fail "Missing responsive stylesheet: $FILE"

  BREAKPOINT_COUNT="$(
    grep -c "@media" "$FILE" || true
  )"

  [[ "$BREAKPOINT_COUNT" -ge 1 ]] \
    && pass "Responsive breakpoint found in: $FILE" \
    || fail "Expected at least one responsive breakpoint in: $FILE"
done

grep -R -Fq 'role="search"' \
  features/officer-dashboard \
  features/department-handoffs \
  components/demo/reports \
  && pass "Search landmark capability found" \
  || fail 'Missing accessibility capability: role="search"'

grep -R -Fq 'aria-label=' \
  features/officer-dashboard \
  features/department-handoffs \
  features/supervisor-approvals \
  components/demo/reports \
  && pass "Accessible naming capability found" \
  || fail "Accessible names are missing"

grep -R -Fq 'role="status"' \
  components/demo/officer \
  components/demo/department \
  components/demo/supervisor \
  features/officer-review \
  features/department-handoffs \
  features/supervisor-approvals \
  components/demo/outcomes \
  && pass "Status live regions found" \
  || fail "Status live regions are missing"

grep -R -Fq 'role="alert"' \
  components/demo/officer \
  components/demo/department \
  components/demo/supervisor \
  features/officer-review \
  features/department-handoffs \
  features/supervisor-approvals \
  components/demo/outcomes \
  && pass "Alert live regions found" \
  || fail "Alert live regions are missing"

REPORT_BODY="components/demo/reports/reports-dashboard.tsx"

REQUIRED_RECHARTS_TEXT=(
  "ResponsiveContainer"
  "LineChart"
  "ComposedChart"
  "PieChart"
  "BarChart"
  "FunnelChart"
)

for TEXT in "${REQUIRED_RECHARTS_TEXT[@]}"; do
  grep -Fq -- "$TEXT" "$REPORT_BODY" \
    && pass "Responsive report chart found: $TEXT" \
    || fail "Missing report chart capability: $TEXT"
done

OUTCOME_BODY="components/demo/outcomes/controlled-outcome-workspace.tsx"

REQUIRED_OUTCOME_TEXT=(
  "Issue exact demo transcript"
  "outcome_downloaded"
  "outcome_collected"
  "request_completed"
)

for TEXT in "${REQUIRED_OUTCOME_TEXT[@]}"; do
  grep -Fq -- "$TEXT" "$OUTCOME_BODY" \
    && pass "Outcome workflow capability preserved: $TEXT" \
    || fail "Missing outcome capability: $TEXT"
done

PAGE_COUNT="$(
  find app/demo -type f -name "page.tsx" | wc -l | tr -d " "
)"

[[ "$PAGE_COUNT" -eq 14 ]] \
  && pass "The 14-route inventory remains intact" \
  || fail "Expected 14 route pages but found $PAGE_COUNT"

if find app/demo -path "*/outcome/*" -name "page.tsx" -print -quit | grep -q .; then
  fail "Singular /demo/outcome route must not exist"
else
  pass "Plural /demo/outcomes route remains canonical"
fi

PROTECTED_RUNTIME_PREFIXES=(
  "app/demo/"
  "components/demo/"
  "features/"
  "config/"
  "types/"
)

while IFS= read -r LINE; do
  [[ -z "$LINE" ]] && continue
  FILE_PATH="${LINE:3}"

  case "$FILE_PATH" in
    "$DOCUMENT_FILE"|"$AUDIT_FILE"|"$SCRIPT_FILE")
      ;;
    *)
      for PREFIX in "${PROTECTED_RUNTIME_PREFIXES[@]}"; do
        if [[ "$FILE_PATH" == "$PREFIX"* ]]; then
          fail "D29R-8 is a verification-only stage; unexpected runtime change: $FILE_PATH"
        fi
      done
      fail "Unexpected changed file: $FILE_PATH"
      ;;
  esac
done < <(git status --porcelain=v1 --untracked-files=all)

pass "Only D29R-8 verification files are changed"

if grep -R -nE \
  "from[[:space:]]+[\"'][^\"']*supabase|createClient\\(|supabase\\." \
  "$AUDIT_FILE" "$SCRIPT_FILE"; then
  fail "D29R-8 verification files must not call Supabase"
else
  pass "D29R-8 adds no Supabase dependency"
fi

if grep -nE \
  '\bfetch[[:space:]]*\(|\baxios(\.|[[:space:]]*\()|XMLHttpRequest|new[[:space:]]+WebSocket' \
  "$AUDIT_FILE"; then
  fail "D29R-8 JavaScript verification files must not add network access"
else
  pass "D29R-8 JavaScript verification files add no network access"
fi

if grep -nE \
  '^[[:space:]]*(curl|wget|nc|ncat|telnet)[[:space:]]' \
  "$SCRIPT_FILE"; then
  fail "D29R-8 shell verification files must not add network access"
else
  pass "D29R-8 shell verification files add no network access"
fi

bash -n "$SCRIPT_FILE"
pass "Verification script syntax is valid"

node "$AUDIT_FILE"
pass "Internal source accessibility audit passed"

printf "\n==============================================================\n"
printf "D29R-8 AUTOMATED VERIFICATION PASSED\n"
printf "Complete the documented viewport, keyboard, VoiceOver, presentation and reset checks before D30.\n\n"
