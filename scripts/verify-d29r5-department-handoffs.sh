#!/usr/bin/env bash
set -euo pipefail

EXPECTED_ROOT="/Users/blaq/Downloads/faidia"
EXPECTED_BRANCH="feat/demo-engine-base"

pass(){ printf "PASS: %s\n" "$1"; }
fail(){ printf "FAIL: %s\n" "$1" >&2; exit 1; }

printf "\nFAIDIA D29R-5 Department inbox and processing\n"
printf "============================================\n\n"

[[ "$(pwd)" == "$EXPECTED_ROOT" ]] && pass "Current directory is correct" || fail "Run this script from $EXPECTED_ROOT"
[[ "$(git rev-parse --show-toplevel 2>/dev/null)" == "$EXPECTED_ROOT" ]] && pass "Git repository root is correct" || fail "Git repository root is incorrect"
[[ "$(git branch --show-current)" == "$EXPECTED_BRANCH" ]] && pass "Current branch is $EXPECTED_BRANCH" || fail "Expected branch $EXPECTED_BRANCH"

REQUIRED_FILES=(
  "app/demo/department/page.tsx"
  "app/demo/department/handoffs/[handoffId]/page.tsx"
  "components/demo/department/department-inbox-workspace.tsx"
  "components/demo/department/department-handoff-processing-workspace.tsx"
  "components/demo/department/department-handoff-state.ts"
  "features/department-handoffs/components/department-inbox-body.tsx"
  "features/department-handoffs/components/department-processing-body.tsx"
  "features/department-handoffs/components/department-handoff-workspace.module.css"
  "features/department-handoffs/model/department-handoff-model.ts"
  "features/demo-engine/fixtures/department-handoffs.reference.ts"
  "features/demo-engine/adapters/get-demo-department-handoffs-reference.ts"
  "docs/demo-engine-base/DEMO-ENGINE-DEPARTMENT-INBOX-PROCESSING-REDESIGN.md"
  "scripts/verify-d29r5-department-handoffs.sh"
  "scripts/verify-d22-department-processing.sh"
)

for FILE in "${REQUIRED_FILES[@]}"; do
  [[ -f "$FILE" ]] && pass "File exists: $FILE" || fail "Missing file: $FILE"
done

for TEXT in \
  "Handoff Inbox" \
  "Incoming handoffs" \
  "Handoff Details" \
  "Pending Acceptance" \
  "Returned for Clarification" \
  "Finance verification" \
  "Record Finance result" \
  "CLEAR" \
  "HOLD" \
  "CANNOT_VERIFY" \
  "Complete and return" \
  'data-d29r5-department-inbox="true"' \
  'data-d29r5-department-processing="true"'; do
  grep -R -Fq -- "$TEXT" features/department-handoffs features/demo-engine/fixtures/department-handoffs.reference.ts \
    && pass "Department capability found: $TEXT" \
    || fail "Missing Department capability: $TEXT"
done

for TEXT in \
  '"SET_FORM_VALUE"' \
  '"ADD_ACTIVITY_EVENT"' \
  '"handoff_accepted"' \
  '"handoff_returned_for_clarification"' \
  '"handoff_declined"' \
  '"handoff_completed"' \
  '"PENDING_ACCEPTANCE"' \
  '"IN_PROGRESS"' \
  '"RETURNED_FOR_CLARIFICATION"' \
  '"DECLINED"' \
  '"COMPLETED"'; do
  grep -R -Fq -- "$TEXT" components/demo/department \
    && pass "Workflow capability found: $TEXT" \
    || fail "Missing workflow capability: $TEXT"
done

STYLE="features/department-handoffs/components/department-handoff-workspace.module.css"
for TEXT in \
  "padding:12px 20px 32px 38px" \
  "height:116px" \
  "repeat(4,minmax(0,1fr))" \
  "minmax(0,1.9fr)" \
  "minmax(340px,.9fr)" \
  "height:55px" \
  "min-height:50px" \
  "minmax(0,3fr)" \
  "minmax(330px,2fr)" \
  "min-height:136px"; do
  grep -Fq -- "$TEXT" "$STYLE" && pass "Measured style found: $TEXT" || fail "Missing measured style: $TEXT"
done

FIXTURE="features/demo-engine/fixtures/department-handoffs.reference.ts"
for TEXT in "value: 8" "value: 5" "value: 3" "value: 4" "HND-DEMO-001" "HND-DEMO-008" "Student Records" "Finance"; do
  grep -Fq -- "$TEXT" "$FIXTURE" && pass "Fixture value found: $TEXT" || fail "Missing fixture value: $TEXT"
done

if grep -R -nE "from[[:space:]]+[\"'][^\"']*supabase|createClient\(|supabase\." \
  components/demo/department features/department-handoffs "$FIXTURE" features/demo-engine/adapters/get-demo-department-handoffs-reference.ts; then
  fail "D29R-5 runtime files must not call Supabase"
else
  pass "No Supabase dependency found"
fi

if grep -R -nE '\bfetch\s*\(|\baxios(?:\.|\s*\()|XMLHttpRequest|new[[:space:]]+WebSocket' \
  components/demo/department features/department-handoffs "$FIXTURE" features/demo-engine/adapters/get-demo-department-handoffs-reference.ts; then
  fail "D29R-5 runtime files must not add network access"
else
  pass "No network dependency found"
fi

grep -Fq "D29R-5 supersession bridge" scripts/verify-d22-department-processing.sh \
  && pass "D22 verifier delegates to D29R-5" \
  || fail "D22 verifier must delegate to D29R-5"

for FILE in \
  app/demo/layout.tsx \
  components/demo/internal-shell/internal-app-shell.tsx \
  components/demo/internal-shell/internal-sidebar.tsx \
  components/demo/internal-shell/internal-topbar.tsx \
  components/demo/internal-shell/internal-navigation.ts \
  components/demo/internal-shell/internal-shell.module.css \
  features/demo/state \
  config/demo \
  types/demo; do
  git diff --quiet -- "$FILE" && git diff --cached --quiet -- "$FILE" || fail "Protected file changed: $FILE"
done
pass "Protected shell, state, configuration and type files are unchanged"

PAGE_COUNT="$(find app/demo -type f -name 'page.tsx' | wc -l | tr -d ' ')"
[[ "$PAGE_COUNT" -eq 14 ]] && pass "The 14-route inventory remains intact" || fail "Expected 14 route pages but found $PAGE_COUNT"

ALLOWED_PREFIXES=(
  "app/demo/department/page.tsx"
  "app/demo/department/handoffs/[handoffId]/page.tsx"
  "components/demo/department/"
  "features/department-handoffs/"
  "features/demo-engine/fixtures/department-handoffs.reference.ts"
  "features/demo-engine/adapters/get-demo-department-handoffs-reference.ts"
  "docs/demo-engine-base/DEMO-ENGINE-DEPARTMENT-INBOX-PROCESSING-REDESIGN.md"
  "scripts/verify-d29r5-department-handoffs.sh"
  "scripts/verify-d22-department-processing.sh"
)

while IFS= read -r LINE; do
  [[ -z "$LINE" ]] && continue
  FILE_PATH="${LINE:3}"
  ALLOWED=false
  for PREFIX in "${ALLOWED_PREFIXES[@]}"; do
    if [[ "$FILE_PATH" == "$PREFIX" ]] || [[ "$FILE_PATH" == "$PREFIX"* ]]; then ALLOWED=true; break; fi
  done
  [[ "$ALLOWED" == true ]] || fail "Unexpected changed file: $FILE_PATH"
done < <(git status --porcelain=v1 --untracked-files=all)
pass "Only D29R-5-owned files are changed"

bash -n scripts/verify-d29r5-department-handoffs.sh
pass "Verification script syntax is valid"

printf "\n============================================\n"
printf "D29R-5 VERIFICATION PASSED\n"
printf "The Department inbox and handoff processing redesign is ready.\n\n"
