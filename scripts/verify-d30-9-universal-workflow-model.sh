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
  "features/demo-engine/workflows/universal-workflow-model.ts"
  "features/demo-engine/workflows/workflow-instance.ts"
  "features/demo-engine/workflows/workflow-builder-mechanics.ts"
  "features/demo-engine/workflows/index.ts"
  "demo-packs/tvet/workflows.ts"
  "$D30_DIR/D30-9-UNIVERSAL-WORKFLOW-MODEL.md"
  "$D30_DIR/D30-9-CHECKLIST.md"
)

for file in "${required[@]}"; do
  [[ -s "$file" ]] || fail "Missing or empty file: $file"
done

pass "Required D30-9 files exist"

for step_type in \
  start submission review verification task handoff approval decision \
  automation notification output end; do
  grep -Fq "\"$step_type\"" \
    features/demo-engine/workflows/universal-workflow-model.ts \
    || fail "Missing universal step type: $step_type"
done

pass "Universal workflow step types exist"

for transition_type in \
  sequence conditional handoff approval rejection clarification timeout escalation; do
  grep -Fq "\"$transition_type\"" \
    features/demo-engine/workflows/universal-workflow-model.ts \
    || fail "Missing transition type: $transition_type"
done

pass "Universal transition types exist"

grep -Fq "createUniversalWorkflowModel" \
  features/demo-engine/workflows/workflow-builder-mechanics.ts \
  || fail "Builder does not consume the universal model"

pass "Workflow builder consumes the universal model"

grep -Fq "createUniversalWorkflowInstance" \
  features/demo-engine/workflows/workflow-instance.ts \
  || fail "Universal workflow instance creation is missing"

grep -Fq "advanceUniversalWorkflowInstance" \
  features/demo-engine/workflows/workflow-instance.ts \
  || fail "Universal workflow advancement is missing"

pass "Universal workflow runtime exists"

if grep -RniE \
  'Transcript Request|Student Admission|Registrar Approval|Student Clearance|Certificate Replacement' \
  features/demo-engine/workflows \
  --include='*.ts' \
  --include='*.tsx' \
  2>/dev/null | grep -q .; then
  fail "TVET workflow content exists inside the universal model"
fi

pass "Universal workflow model remains vertical-neutral"

for content in \
  "Transcript Request" \
  "Student Admission" \
  "Registrar Approval" \
  "Student Clearance"; do
  grep -Fq "$content" demo-packs/tvet/workflows.ts \
    || fail "TVET pack is missing workflow content: $content"
done

pass "TVET workflow content remains inside the TVET pack"

git diff --check
pass "Git whitespace validation passed"

printf '\nD30-9 universal-workflow-model verification passed.\n'
