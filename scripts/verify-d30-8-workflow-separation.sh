#!/usr/bin/env bash
set -euo pipefail

ROOT="${FAIDIA_ROOT:-/Users/blaq/Downloads/faidia}"
EXPECTED_BRANCH="feat/demo-engine-base"
D30_DIR="docs/demo-engine-base/d30-freeze"

cd "$ROOT"

fail() {
  printf 'FAIL: %s\n' "$1" >&2
  exit 1
}

pass() {
  printf 'PASS: %s\n' "$1"
}

[[ "$(git branch --show-current)" == "$EXPECTED_BRANCH" ]] \
  || fail "Expected branch $EXPECTED_BRANCH"

required=(
  "features/demo-engine/workflows/workflow-builder-mechanics.ts"
  "features/demo-engine/workflows/index.ts"
  "features/demo-admin-workflows/lib/workflow-view-models.ts"
  "features/demo-admin-workflows/components/workflow-overview.tsx"
  "features/demo-admin-workflows/components/workflow-builder.tsx"
  "demo-packs/tvet/workflows.ts"
  "$D30_DIR/D30-8-WORKFLOW-SEPARATION.md"
  "$D30_DIR/D30-8-CHECKLIST.md"
)

for file in "${required[@]}"; do
  [[ -s "$file" ]] || fail "Missing or empty file: $file"
done

pass "Required D30-8 files exist"

[[ ! -e \
  features/demo-admin-workflows/fixtures/workflow-demo-data.ts ]] \
  || fail "Legacy workflow content fixture still exists"

pass "Legacy workflow content fixture is removed"

grep -Fq "useDemoPack" \
  features/demo-admin-workflows/components/workflow-overview.tsx \
  || fail "Workflow overview does not consume the active pack"

grep -Fq "useDemoWorkflows" \
  features/demo-admin-workflows/components/workflow-builder.tsx \
  || fail "Workflow builder does not consume pack workflows"

grep -Fq "useDemoDepartments" \
  features/demo-admin-workflows/components/workflow-builder.tsx \
  || fail "Workflow builder does not consume pack departments"

pass "Workflow UI consumes neutral Demo Pack hooks"

if grep -RniE \
  'demo-packs/(tvet|supermarket|county|hospital|sacco|university|insurance|construction|manufacturing|logistics|telecom)' \
  features/demo-admin-workflows \
  features/demo-engine/workflows \
  --include='*.ts' \
  --include='*.tsx' \
  2>/dev/null | grep -q .; then
  fail "Workflow mechanics or UI directly imports a named pack"
fi

pass "Workflow mechanics and UI remain pack-neutral"

if grep -RniE \
  'Transcript Request|Student Admission|Certificate Issuance|Leave of Absence|Registrar Approval|Document Verification Officer' \
  features/demo-engine/workflows \
  features/demo-admin-workflows/components \
  features/demo-admin-workflows/lib \
  --include='*.ts' \
  --include='*.tsx' \
  2>/dev/null | grep -q .; then
  fail "TVET workflow content remains inside workflow mechanics or UI"
fi

pass "TVET workflow names are absent from engine mechanics and UI"

for content in \
  "Transcript Request" \
  "Student Admission" \
  "Leave of Absence" \
  "Registrar Approval"; do
  grep -Fq "$content" demo-packs/tvet/workflows.ts \
    || fail "TVET pack is missing workflow content: $content"
done

pass "TVET workflow content remains in the TVET pack"

grep -Fq "usageCount" demo-packs/tvet/workflows.ts \
  || fail "Template usage content was not moved to the TVET pack"

grep -Fq "presentationTone" demo-packs/tvet/workflows.ts \
  || fail "Template tone content was not moved to the TVET pack"

pass "Workflow presentation metadata belongs to the TVET pack"

git diff --check
pass "Git whitespace validation passed"

printf '\nD30-8 workflow-separation verification passed.\n'
