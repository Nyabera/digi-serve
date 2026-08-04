#!/usr/bin/env bash
set -euo pipefail

ROOT="${FAIDIA_ROOT:-/Users/blaq/Downloads/faidia}"
cd "$ROOT"

rm -rf \
  artifacts/d30-responsive \
  .next

npx playwright test \
  --config=playwright.d30-responsive.config.ts \
  tests/acceptance/d30/demo-responsive-acceptance.pw.ts
