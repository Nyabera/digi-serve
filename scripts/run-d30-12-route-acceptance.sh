#!/usr/bin/env bash
set -euo pipefail

ROOT="${FAIDIA_ROOT:-/Users/blaq/Downloads/faidia}"
CONFIG="playwright.d30.config.ts"
SPEC="tests/acceptance/d30/demo-route-acceptance.pw.ts"
ARTIFACTS="artifacts/d30-acceptance"

cd "$ROOT"

rm -rf "$ARTIFACTS"
mkdir -p "$ARTIFACTS"

node scripts/generate-d30-12-route-manifest.mjs

npx playwright test \
  --config="$CONFIG" \
  "$SPEC"
