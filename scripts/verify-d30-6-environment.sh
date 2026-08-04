#!/usr/bin/env bash
set -euo pipefail

ROOT="${FAIDIA_ROOT:-/Users/blaq/Downloads/faidia}"
EXPECTED_BRANCH="feat/demo-engine-base"
ENV_FILE="docs/demo-engine-base/d30-freeze/DEMO-ENVIRONMENT.txt"

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
  "$ENV_FILE"
  "scripts/capture-demo-environment.sh"
  "scripts/verify-d30-6-environment.sh"
  "docs/demo-engine-base/d30-freeze/DEMO-ENVIRONMENT-NOTES.md"
  "docs/demo-engine-base/d30-freeze/D30-6-CHECKLIST.md"
  "package.json"
  "package-lock.json"
)

for file in "${required[@]}"; do
  [[ -s "$file" ]] || fail "Missing or empty file: $file"
done

pass "Required D30-6 files exist"

for marker in \
  "SNAPSHOT METADATA" \
  "GIT STATE" \
  "ACTIVE DEMO PACK" \
  "OPERATING SYSTEM" \
  "RUNTIME AND PACKAGE MANAGER" \
  "FRAMEWORK AND KEY LIBRARIES" \
  "LOCKFILES AND INTEGRITY" \
  "NPM SCRIPTS" \
  "TOP-LEVEL DEPENDENCY TREE" \
  "ENVIRONMENT-FILE HYGIENE" \
  "FREEZE RULES"; do
  grep -Fq "$marker" "$ENV_FILE" \
    || fail "Environment snapshot is missing: $marker"
done

pass "Environment snapshot contains all required sections"

grep -Fq "Pack ID: tvet" "$ENV_FILE" \
  || fail "Active TVET pack was not recorded"

grep -Fq "Controlled entry point:" "$ENV_FILE" \
  || fail "Controlled active-pack entry point is missing"

pass "Active Demo Pack is recorded"

grep -Fq "package-lock tracked: yes" "$ENV_FILE" \
  || fail "package-lock.json is not recorded as tracked"

pass "Dependency lock integrity is recorded"

if grep -Eqi \
  '(password|secret|service[_-]?role|private[_-]?key)[[:space:]]*[:=][[:space:]]*[^[:space:]]+' \
  "$ENV_FILE"; then
  fail "Environment snapshot may contain a secret value"
fi

pass "No obvious secret values were captured"

git diff --check

pass "Git whitespace validation passed"

printf "\nD30-6 technical-environment verification passed.\n"
