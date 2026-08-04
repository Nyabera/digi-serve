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
  "features/demo-engine/config/demo-pack.types.ts"
  "features/demo-engine/config/index.ts"
  "demo-packs/tvet/manifest.ts"
  "$D30_DIR/DEMO-PACK-SCHEMA.md"
  "$D30_DIR/D30-3-CHECKLIST.md"
)

for file in "${required[@]}"; do
  [[ -s "$file" ]] || fail "Missing or empty file: $file"
done

pass "Required D30-3 files exist"

grep -Fq "export interface DemoPack" \
  features/demo-engine/config/demo-pack.types.ts \
  || fail "DemoPack interface is missing"

grep -Fq "export interface DemoWorkflowConfig" \
  features/demo-engine/config/demo-pack.types.ts \
  || fail "Workflow contract is missing"

grep -Fq "export interface DemoSlaConfig" \
  features/demo-engine/config/demo-pack.types.ts \
  || fail "SLA contract is missing"

pass "Core contract categories exist"

if grep -Eqi \
  'demo-packs/(tvet|supermarket|county|hospital|sacco|university|insurance|construction|manufacturing|logistics|telecom)' \
  features/demo-engine/config/demo-pack.types.ts; then
  fail "The neutral contract imports or names a vertical pack path"
fi

pass "Contract remains vertical-neutral"

grep -Fq "satisfies DemoPack" \
  demo-packs/tvet/manifest.ts \
  || fail "TVET manifest does not satisfy DemoPack"

pass "TVET manifest is compile-time checked"

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
  fail "Running Demo is connected directly to the TVET pack"
fi

pass "Running Demo remains disconnected from the draft TVET pack"

git diff --check

pass "Git whitespace validation passed"

printf "\nD30-3 Demo Pack contract verification passed.\n"
