#!/usr/bin/env bash
set -euo pipefail

ROOT="${FAIDIA_ROOT:-/Users/blaq/Downloads/faidia}"
EXPECTED_BRANCH="feat/demo-engine-base"
D30_DIR="docs/demo-engine-base/d30-freeze"
REPORT="$D30_DIR/D30-10F-VERIFICATION-REPORT.txt"
LOG_DIR="${TMPDIR:-/tmp}/faidia-d30-10f-logs"
RUN_DEV_SMOKE="${D30_10F_RUN_DEV_SMOKE:-0}"
REQUIRE_CLEAN="${D30_10F_REQUIRE_CLEAN:-0}"

cd "$ROOT"
mkdir -p "$LOG_DIR" "$D30_DIR"

fail() {
  printf 'FAIL: %s\n' "$1" >&2
  exit 1
}

pass() {
  printf 'PASS: %s\n' "$1"
}

run_logged() {
  local name="$1"
  shift

  local log="$LOG_DIR/$name.log"

  printf '\nRunning %s...\n' "$name"

  if "$@" >"$log" 2>&1; then
    pass "$name"
  else
    cat "$log"
    fail "$name"
  fi
}

[[ "$(git branch --show-current)" == "$EXPECTED_BRANCH" ]] \
  || fail "Expected branch $EXPECTED_BRANCH"

if [[ "$REQUIRE_CLEAN" == "1" ]] && \
  [[ -n "$(git status --porcelain)" ]]; then
  git status --short
  fail "Working tree is not clean"
fi

./scripts/verify-d30-10f-freeze-alignment.sh

validation_log="$LOG_DIR/demo-pack-validation.log"

printf '\nRunning Demo Pack configuration validation...\n'

if npm run demo:validate -- tvet >"$validation_log" 2>&1; then
  :
else
  cat "$validation_log"
  fail "Demo Pack configuration validation command failed"
fi

grep -Fq "Errors: 0" "$validation_log" \
  || {
    cat "$validation_log"
    fail "Demo Pack configuration contains errors"
  }

grep -Fq "PASS: Demo Pack configuration is valid." "$validation_log" \
  || {
    cat "$validation_log"
    fail "Demo Pack validation did not report PASS"
  }

synthetic_start="$(
  grep -c 'WARNING \[SYNTHETIC_START\]' \
    "$validation_log" || true
)"
synthetic_end="$(
  grep -c 'WARNING \[SYNTHETIC_END\]' \
    "$validation_log" || true
)"

if [[ "$synthetic_start" != "$synthetic_end" ]]; then
  cat "$validation_log"
  fail "Synthetic Start and End boundary notices are unbalanced"
fi

unexpected_warnings="$(
  grep '^WARNING ' "$validation_log" \
    | grep -vE \
      'WARNING \[(SYNTHETIC_START|SYNTHETIC_END)\]' \
    || true
)"

if [[ -n "$unexpected_warnings" ]]; then
  printf '%s\n' "$unexpected_warnings"
  fail "Unexpected Demo Pack validation warnings remain"
fi

pass \
  "Demo Pack valid; $synthetic_start expected workflow-boundary pairs recorded"

prior_verifiers=(
  "scripts/verify-d30-10a-public-verification.sh"
  "scripts/verify-d30-10b-officer-document-hub.sh"
  "scripts/verify-d30-10c-applicant-profile.sh"
  "scripts/verify-d30-10d-applicant-document-vault.sh"
  "scripts/verify-d30-10e-route-navigation-state.sh"
)

for verifier in "${prior_verifiers[@]}"; do
  [[ -x "$verifier" ]] \
    || fail "Missing executable verifier: $verifier"

  run_logged \
    "$(basename "$verifier" .sh)" \
    "$verifier"
done

rm -rf .next
pass "Removed stale generated Next.js output"

run_logged \
  "typescript" \
  npx tsc --noEmit

run_logged \
  "lint" \
  npm run lint

run_logged \
  "tests" \
  npm test -- --run --passWithNoTests

run_logged \
  "production-build" \
  env NEXT_TELEMETRY_DISABLED=1 npm run build

build_log="$LOG_DIR/production-build.log"

for route in \
  "/demo/verify-certificate" \
  "/demo/applicant/profile" \
  "/demo/applicant/documents" \
  "/demo/officer/documents" \
  "/demo/admin/workflows" \
  "/demo/admin/workflows/builder"; do
  grep -Fq "$route" "$build_log" \
    || {
      cat "$build_log"
      fail "Production route output is missing $route"
    }
done

pass "Production build contains every D30-10 feature route"

if [[ "$RUN_DEV_SMOKE" == "1" ]]; then
  DEV_PORT="${D30_10F_DEV_PORT:-3010}"
  DEV_LOG="$LOG_DIR/dev-smoke.log"

  printf '\nStarting optional live route smoke test on port %s...\n' \
    "$DEV_PORT"

  npm run dev -- \
    --hostname 127.0.0.1 \
    --port "$DEV_PORT" \
    >"$DEV_LOG" 2>&1 &

  dev_pid=$!

  cleanup_dev() {
    kill "$dev_pid" >/dev/null 2>&1 || true
    wait "$dev_pid" >/dev/null 2>&1 || true
  }

  trap cleanup_dev EXIT

  ready=0

  for _ in $(seq 1 60); do
    if curl -fsS \
      "http://127.0.0.1:$DEV_PORT/demo" \
      >/dev/null 2>&1; then
      ready=1
      break
    fi

    sleep 1
  done

  if [[ "$ready" != "1" ]]; then
    cat "$DEV_LOG"
    fail "Development server did not become ready"
  fi

  smoke_routes=(
    "/demo"
    "/demo/verify-certificate"
    "/demo/applicant/profile"
    "/demo/applicant/documents"
    "/demo/officer"
    "/demo/officer/documents"
    "/demo/supervisor"
    "/demo/admin"
    "/demo/admin/workflows"
    "/demo/admin/workflows/builder"
  )

  for route in "${smoke_routes[@]}"; do
    code="$(
      curl -sS \
        -o /dev/null \
        -w '%{http_code}' \
        "http://127.0.0.1:$DEV_PORT$route"
    )"

    case "$code" in
      200|301|302|303|307|308)
        pass "Live route $route returned HTTP $code"
        ;;
      *)
        cat "$DEV_LOG"
        fail "Live route $route returned HTTP $code"
        ;;
    esac
  done

  cleanup_dev
  trap - EXIT
fi

git diff --check
pass "Final Git whitespace validation passed"

node_version="$(node --version)"
npm_version="$(npm --version)"
next_version="$(
  node -p \
    "require('./node_modules/next/package.json').version"
)"
commit="$(git rev-parse --short HEAD)"
branch="$(git branch --show-current)"
generated_at="$(date '+%Y-%m-%d %H:%M:%S %Z')"

{
  printf '%s\n' "D30-10F DEMO FREEZE VERIFICATION REPORT"
  printf '%s\n' "========================================"
  printf 'Generated: %s\n' "$generated_at"
  printf 'Branch: %s\n' "$branch"
  printf 'Base commit: %s\n' "$commit"
  printf 'Node: %s\n' "$node_version"
  printf 'npm: %s\n' "$npm_version"
  printf 'Next.js: %s\n' "$next_version"
  printf '\n'
  printf '%s\n' "RESULTS"
  printf '%s\n' "-------"
  printf '%s\n' "PASS: freeze alignment"
  printf '%s\n' "PASS: Demo Pack configuration"
  printf \
    'PASS: %s expected synthetic workflow-boundary pairs\n' \
    "$synthetic_start"
  printf '%s\n' "PASS: D30-10A verification"
  printf '%s\n' "PASS: D30-10B verification"
  printf '%s\n' "PASS: D30-10C verification"
  printf '%s\n' "PASS: D30-10D verification"
  printf '%s\n' "PASS: D30-10E verification"
  printf '%s\n' "PASS: TypeScript"
  printf '%s\n' "PASS: lint"
  printf '%s\n' "PASS: tests"
  printf '%s\n' "PASS: production build"
  printf '%s\n' "PASS: route build alignment"
  printf '%s\n' "PASS: Git whitespace validation"

  if [[ "$RUN_DEV_SMOKE" == "1" ]]; then
    printf '%s\n' "PASS: live route smoke test"
  else
    printf '%s\n' \
      "NOT RUN: optional live route smoke test"
  fi

  printf '\n'
  printf '%s\n' "EXPECTED NOTICES"
  printf '%s\n' "----------------"
  printf '%s\n' \
    "Synthetic Start/End notices are expected because the universal workflow model supplies missing boundary nodes."
  printf '%s\n' \
    "They are retained in the raw validation log and are not configuration failures."

  printf '\n'
  printf '%s\n' "RAW LOG DIRECTORY"
  printf '%s\n' "-----------------"
  printf '%s\n' "$LOG_DIR"
} >"$REPORT"

pass "Wrote $REPORT"

printf '\nD30-10F freeze gate passed.\n'
printf 'Report: %s\n' "$REPORT"
