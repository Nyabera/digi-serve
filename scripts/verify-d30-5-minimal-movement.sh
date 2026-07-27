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
  "features/demo-engine/config/active-demo-pack.ts"
  "features/demo-engine/config/active-demo-pack-provider.tsx"
  "features/demo-engine/config/demo-pack-provider.tsx"
  "features/demo-engine/config/demo-pack-selectors.ts"
  "features/demo-engine/config/demo-pack.server.ts"
  "app/demo/layout.tsx"
  "$D30_DIR/D30-5-MINIMAL-CODE-MOVEMENT.md"
  "$D30_DIR/D30-5-CHECKLIST.md"
)

for file in "${required[@]}"; do
  [[ -s "$file" ]] || fail "Missing or empty file: $file"
done

pass "Required D30-5 files exist"

grep -Fq 'tvetDemoPackDraft' \
  features/demo-engine/config/active-demo-pack.ts \
  || fail "Active pack does not select the TVET pack"

grep -Fq 'export const activeDemoPack' \
  features/demo-engine/config/active-demo-pack.ts \
  || fail "Active pack export is missing"

pass "Single active-pack entry point exists"

provider_count="$(
  grep -o '<ActiveDemoPackProvider' app/demo/layout.tsx |
  wc -l |
  tr -d ' '
)"

[[ "$provider_count" -eq 1 ]] \
  || fail "Expected one provider mount; found $provider_count"

grep -Fq \
  'from "@/features/demo-engine/config"' \
  app/demo/layout.tsx \
  || fail "Demo layout does not import the neutral config boundary"

pass "Provider is mounted exactly once"

unexpected_imports="$(
  grep -RniE \
    'from ["'\''].*demo-packs/(tvet|supermarket|county|hospital|sacco|university|insurance|construction|manufacturing|logistics|telecom)' \
    app components features \
    --include='*.ts' \
    --include='*.tsx' \
    2>/dev/null |
  grep -v '^features/demo-engine/config/active-demo-pack.ts:' \
  || true
)"

if [[ -n "$unexpected_imports" ]]; then
  printf "Unexpected named-pack imports:\n%s\n" \
    "$unexpected_imports"
  fail "Named pack imports exist outside the controlled entry point"
fi

pass "Named-pack import is isolated to the active entry point"

allowed_source_changes='^(app/demo/layout\.tsx|features/demo-engine/config/(index\.ts|active-demo-pack\.ts|active-demo-pack-provider\.tsx|demo-pack-provider\.tsx|demo-pack-selectors\.ts|demo-pack\.server\.ts))$'

unexpected_source_changes="$(
  git diff --name-only |
  grep -E '^(app|components|features)/' |
  grep -Ev "$allowed_source_changes" \
  || true
)"

if [[ -n "$unexpected_source_changes" ]]; then
  printf "Unexpected source movement or edits:\n%s\n" \
    "$unexpected_source_changes"
  fail "D30-5 changed application files outside the minimal boundary"
fi

pass "Application edits remain inside the minimal boundary"

git diff --check

pass "Git whitespace validation passed"

printf "\nD30-5 minimal-movement verification passed.\n"
