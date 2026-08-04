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
  "features/demo-engine/config/demo-pack-validation.ts"
  "scripts/validate-demo-pack.mjs"
  "scripts/test-demo-pack-validator.mjs"
  "demo-packs/tvet/assets/logo.svg"
  "$D30_DIR/D30-10-CONFIGURATION-VALIDATION.md"
  "$D30_DIR/D30-10-CHECKLIST.md"
)

for file in "${required[@]}"; do
  [[ -s "$file" ]] || fail "Missing or empty file: $file"
done

pass "Required D30-10 files exist"

grep -Fq '"demo:validate"' package.json \
  || fail "demo:validate npm script is missing"

grep -Fq '"demo:validate:test"' package.json \
  || fail "demo:validate:test npm script is missing"

pass "Validation npm scripts exist"

npm run demo:validate -- tvet
pass "TVET Demo Pack passes validation"

npm run demo:validate:test
pass "Malformed Demo Pack is rejected"

json_output="$(
  npm run --silent demo:validate -- tvet --json
)"

printf '%s\n' "$json_output" |
  grep -Fq '"valid": true' \
  || fail "JSON validation output is invalid"

pass "JSON validation output is supported"

for code in \
  DUPLICATE_ID \
  MISSING_WORKFLOW_REFERENCE \
  MISSING_SERVICE_REFERENCE \
  MISSING_STEP_REFERENCE \
  MISSING_ASSET \
  INVALID_COLOR; do
  grep -Fq "\"$code\"" \
    features/demo-engine/config/demo-pack-validation.ts \
    || fail "Validator is missing error code: $code"
done

pass "Critical validation rules exist"

git diff --check
pass "Git whitespace validation passed"

printf '\nD30-10 configuration-validation verification passed.\n'
