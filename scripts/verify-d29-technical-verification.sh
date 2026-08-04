#!/usr/bin/env bash

set -euo pipefail

EXPECTED_ROOT="/Users/blaq/Downloads/faidia"
EXPECTED_BRANCH="feat/demo-engine-base"

ROUTE_AUDIT="scripts/audit-d29-demo-routes.mjs"
BOUNDARY_AUDIT="scripts/audit-d29-demo-boundaries.mjs"
ACCESSIBILITY_AUDIT="scripts/audit-d28-demo-accessibility.mjs"
DOCUMENT_FILE="docs/demo-engine-base/DEMO-ENGINE-TECHNICAL-VERIFICATION.md"
SCRIPT_FILE="scripts/verify-d29-technical-verification.sh"

pass() { printf "PASS: %s\n" "$1"; }
fail() { printf "FAIL: %s\n" "$1" >&2; exit 1; }
section() {
  printf "\n%s\n" "$1"
  printf '%*s\n' "${#1}" '' | tr ' ' '='
}

section "FAIDIA D29 technical verification"

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
  "$ROUTE_AUDIT"
  "$BOUNDARY_AUDIT"
  "$ACCESSIBILITY_AUDIT"
  "$DOCUMENT_FILE"
  "$SCRIPT_FILE"
  "package.json"
  "tsconfig.json"
  "next.config.ts"
)

for FILE in "${REQUIRED_FILES[@]}"; do
  [[ -f "$FILE" ]] \
    && pass "File exists: $FILE" \
    || fail "Missing file: $FILE"
done

REQUIRED_DOCUMENT_TEXT=(
  "D29 runs the complete technical verification gate for the reusable Demo Engine."
  "D29 does not add product functionality."
  "The controlled outcome route remains:"
  "The freeze occurs in D30 after D29 passes."
  "## 10. D29 definition of done"
)

for TEXT in "${REQUIRED_DOCUMENT_TEXT[@]}"; do
  grep -Fq "$TEXT" "$DOCUMENT_FILE" \
    && pass "Documentation rule found: $TEXT" \
    || fail "Missing documentation rule: $TEXT"
done

ALLOWED_FILES=(
  "$ROUTE_AUDIT"
  "$BOUNDARY_AUDIT"
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

pass "Only D29-owned files are changed"

section "Route inventory audit"
node "$ROUTE_AUDIT"

section "Demo boundary audit"
node "$BOUNDARY_AUDIT"

section "Accessibility source audit"
node "$ACCESSIBILITY_AUDIT"

section "Verifier syntax audit"
VERIFIER_COUNT=0

for VERIFIER in scripts/verify-d*.sh; do
  [[ -f "$VERIFIER" ]] || continue
  bash -n "$VERIFIER"
  VERIFIER_COUNT=$((VERIFIER_COUNT + 1))
  pass "Shell syntax valid: $VERIFIER"
done

[[ "$VERIFIER_COUNT" -gt 0 ]] \
  && pass "$VERIFIER_COUNT verifier scripts passed shell syntax checks" \
  || fail "No stage verifier scripts were found"

section "Package dependency audit"
node - <<'NODE'
const packageJson = require("./package.json");
const all = {
  ...(packageJson.dependencies ?? {}),
  ...(packageJson.devDependencies ?? {}),
};

const required = [
  "next",
  "react",
  "react-dom",
  "recharts",
  "lucide-react",
  "typescript",
  "eslint",
];

const missing = required.filter(
  (dependency) => !all[dependency],
);

if (missing.length > 0) {
  console.error(
    `FAIL: Missing required packages: ${missing.join(", ")}`,
  );
  process.exit(1);
}

console.log(
  `PASS: Required packages resolve: ${required.join(", ")}`,
);
NODE

npm ls --depth=0 >/dev/null
pass "Installed package tree is valid"

section "Git whitespace audit"
git diff --check
pass "Git whitespace validation passed"

section "TypeScript validation"
npx tsc --noEmit
pass "TypeScript validation passed"

section "ESLint validation"
npm run lint
pass "ESLint validation passed"

section "Automated tests"
TEST_SCRIPT="$(
  node -e '
    const packageJson = require("./package.json");
    process.stdout.write(packageJson.scripts?.test ?? "");
  '
)"

if [[ -z "$TEST_SCRIPT" ]] || \
   [[ "$TEST_SCRIPT" == *"no test specified"* ]]; then
  fail "A configured automated test script is required"
fi

case "$TEST_SCRIPT" in
  *vitest*)
    npm test -- --run
    ;;
  *jest*)
    npm test -- --runInBand
    ;;
  *)
    npm test -- --run
    ;;
esac

pass "Automated tests passed"

section "Production build"
npm run build
pass "Next.js production build passed"

section "Post-build route and boundary confirmation"
node "$ROUTE_AUDIT"
node "$BOUNDARY_AUDIT"
pass "Post-build route and boundary confirmation passed"

section "D29 result"
printf "D29 TECHNICAL VERIFICATION PASSED\n"
printf "The Demo Engine is technically ready for D30 freeze.\n\n"
