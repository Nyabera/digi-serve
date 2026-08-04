#!/usr/bin/env bash
set -euo pipefail

EXPECTED_ROOT="/Users/blaq/Downloads/faidia"
EXPECTED_BRANCH="feat/demo-engine-base"

pass() { printf "PASS: %s\n" "$1"; }
fail() { printf "FAIL: %s\n" "$1" >&2; exit 1; }

printf "\nFAIDIA D29R-10 Savannah homepage verification\n"
printf "============================================================\n\n"

[[ "$(pwd)" == "$EXPECTED_ROOT" ]] \
  && pass "Current directory is correct" \
  || fail "Run this script from $EXPECTED_ROOT"

[[ "$(git branch --show-current)" == "$EXPECTED_BRANCH" ]] \
  && pass "Current branch is $EXPECTED_BRANCH" \
  || fail "Expected branch $EXPECTED_BRANCH"

REQUIRED_FILES=(
  "app/demo/page.tsx"
  "app/demo/demo-journey/route.ts"
  "components/demo/homepage/index.ts"
  "components/demo/homepage/savannah-homepage.tsx"
  "components/demo/homepage/savannah-homepage.module.css"
  "public/demo/homepage/savannah-campus-placeholder.jpeg"
  "public/demo/homepage/savannah-students-placeholder.jpg"
  "docs/demo-engine-base/D29R-10-SAVANNAH-HOMEPAGE-CORRECTION.md"
  "scripts/verify-d29r10-savannah-homepage.sh"
)

for FILE in "${REQUIRED_FILES[@]}"; do
  [[ -f "$FILE" ]] \
    && pass "File exists: $FILE" \
    || fail "Missing file: $FILE"
done

grep -Fq 'SavannahHomepage' app/demo/page.tsx \
  && pass "Root demo route renders the Savannah homepage" \
  || fail "Root demo route does not render SavannahHomepage"

if grep -Fq 'D9 installs the shared public-facing shell' app/demo/page.tsx \
  || grep -Fq 'D9 installs the shared public-facing shell' components/demo/homepage/savannah-homepage.tsx; then
  fail "Temporary D9 route-index copy still appears on the homepage"
else
  pass "Temporary route-index hero has been removed from /demo"
fi

HOMEPAGE="components/demo/homepage/savannah-homepage.tsx"

REQUIRED_COPY=(
  "Savannah Technical College"
  "College services."
  "One clear place."
  "Search transcripts, clearance, attachment letters, fees"
  "Request an academic transcript"
  "Complete student clearance"
  "Replace a lost certificate"
  "Get an industrial attachment letter"
  "How your request moves"
  "From request to ready"
  "Student services, made visible"
  "Before you submit"
  "Get your college request moving."
  "SAV-TR-2026-00421"
  "Finance verification"
  "Registrar approval"
)

for TEXT in "${REQUIRED_COPY[@]}"; do
  grep -Fq -- "$TEXT" "$HOMEPAGE" \
    && pass "Homepage copy found: $TEXT" \
    || fail "Missing homepage copy: $TEXT"
done

SERVICE_COUNT="$(
  grep -F 'number: "0' "$HOMEPAGE" | head -4 | wc -l | tr -d " "
)"

[[ "$SERVICE_COUNT" -eq 4 ]] \
  && pass "Exactly four popular service definitions are present" \
  || fail "Expected four popular service definitions"

grep -Fq 'aria-label="Savannah Technical College home"' "$HOMEPAGE" \
  && grep -Fq 'htmlFor="savannah-service-search"' "$HOMEPAGE" \
  && grep -Fq 'aria-expanded={isOpen}' "$HOMEPAGE" \
  && pass "Core accessible labels and accordion semantics found" \
  || fail "Homepage accessibility semantics are incomplete"

CSS="components/demo/homepage/savannah-homepage.module.css"

grep -Fq '"Plus Jakarta Sans"' "$CSS" \
  && grep -Fq '"Inter"' "$CSS" \
  && pass "Two-font system is present" \
  || fail "Plus Jakarta Sans and Inter must both be present"

BREAKPOINT_COUNT="$(grep -c '@media (max-width:' "$CSS" || true)"

[[ "$BREAKPOINT_COUNT" -ge 4 ]] \
  && pass "Desktop, tablet and mobile responsive rules are present" \
  || fail "Expected at least four responsive max-width breakpoints"

grep -Fq '@media (pointer: coarse)' "$CSS" \
  && grep -Fq 'min-height: 44px' "$CSS" \
  && grep -Fq '@media (prefers-reduced-motion: reduce)' "$CSS" \
  && pass "Touch target and reduced-motion rules are present" \
  || fail "Responsive accessibility CSS is incomplete"

grep -Fq '/demo/homepage/savannah-campus-placeholder.jpeg' "$HOMEPAGE" \
  && grep -Fq '/demo/homepage/savannah-students-placeholder.jpg' "$HOMEPAGE" \
  && pass "Both supplied placeholder photographs are used" \
  || fail "One or both supplied photographs are not referenced"

grep -Fq 'Complete demonstration journey' app/demo/demo-journey/route.ts \
  && grep -Fq 'Return to college homepage' app/demo/demo-journey/route.ts \
  && pass "Presentation journey moved to /demo/demo-journey" \
  || fail "Demonstration journey route is incomplete"

[[ ! -f "app/demo/demo-journey/page.tsx" ]] \
  && pass "Journey route does not add another page.tsx" \
  || fail "Journey must remain a route handler to preserve route inventory"

PAGE_COUNT="$(
  find app/demo -type f -name "page.tsx" | wc -l | tr -d " "
)"

[[ "$PAGE_COUNT" -eq 14 ]] \
  && pass "The 14-page Demo Engine inventory remains unchanged" \
  || fail "Expected 14 page.tsx files but found $PAGE_COUNT"

if find app/demo -path "*/outcome/*" -name "page.tsx" -print -quit | grep -q .; then
  fail "Singular /demo/outcome route must not exist"
else
  pass "Plural /demo/outcomes route remains canonical"
fi

RUNTIME_FILES=(
  "app/demo/page.tsx"
  "app/demo/demo-journey/route.ts"
  "components/demo/homepage/index.ts"
  "components/demo/homepage/savannah-homepage.tsx"
)

if grep -nE \
  '\bfetch[[:space:]]*\(|\baxios(\.|[[:space:]]*\()|XMLHttpRequest|new[[:space:]]+WebSocket|createClient\(|supabase\.' \
  "${RUNTIME_FILES[@]}"; then
  fail "D29R-10 must not add network or Supabase access"
else
  pass "D29R-10 adds no network or Supabase dependency"
fi

ALLOWED_PREFIXES=(
  "app/demo/page.tsx"
  "app/demo/demo-journey/route.ts"
  "components/demo/homepage/"
  "public/demo/homepage/"
  "docs/demo-engine-base/D29R-10-SAVANNAH-HOMEPAGE-CORRECTION.md"
  "scripts/verify-d29r10-savannah-homepage.sh"
)

while IFS= read -r LINE; do
  [[ -z "$LINE" ]] && continue

  FILE_PATH="${LINE:3}"
  ALLOWED=false

  for PREFIX in "${ALLOWED_PREFIXES[@]}"; do
    if [[ "$FILE_PATH" == "$PREFIX" ]] || [[ "$FILE_PATH" == "$PREFIX"* ]]; then
      ALLOWED=true
      break
    fi
  done

  [[ "$ALLOWED" == true ]] \
    || fail "Unexpected changed file: $FILE_PATH"
done < <(git status --porcelain=v1 --untracked-files=all)

pass "Only the D29R-10 homepage boundary is changed"

bash -n scripts/verify-d29r10-savannah-homepage.sh
pass "Verifier shell syntax is valid"

printf "\n============================================================\n"
printf "D29R-10 SAVANNAH HOMEPAGE VERIFICATION PASSED\n\n"
