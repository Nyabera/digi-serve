#!/usr/bin/env bash
set -euo pipefail

EXPECTED_ROOT="/Users/blaq/Downloads/faidia"
EXPECTED_BRANCH="feat/demo-engine-base"
PAGE_FILE="app/demo/sign-up/page.tsx"
FORM_FILE="components/demo/forms/applicant-sign-up-form.tsx"
PUBLIC_PAGE_FILE="components/demo/public/applicant-sign-up-page.tsx"
DOCUMENT_FILE="docs/demo-engine-base/DEMO-ENGINE-APPLICANT-SIGN-UP.md"
SCRIPT_FILE="scripts/verify-d16-applicant-sign-up.sh"

pass() { printf "PASS: %s\n" "$1"; }
fail() { printf "FAIL: %s\n" "$1" >&2; exit 1; }

printf "\nFAIDIA D16 applicant sign-up verification\n"
printf "=========================================\n\n"

[[ "$(pwd)" == "$EXPECTED_ROOT" ]] && pass "Current directory is correct" || fail "Run this script from $EXPECTED_ROOT"
[[ "$(git rev-parse --show-toplevel 2>/dev/null)" == "$EXPECTED_ROOT" ]] && pass "Git repository root is correct" || fail "Git repository root is incorrect"
[[ "$(git branch --show-current)" == "$EXPECTED_BRANCH" ]] && pass "Current branch is $EXPECTED_BRANCH" || fail "Expected branch $EXPECTED_BRANCH"

REQUIRED_FILES=("$PAGE_FILE" "$FORM_FILE" "$PUBLIC_PAGE_FILE" "$DOCUMENT_FILE" "$SCRIPT_FILE")
for REQUIRED_FILE in "${REQUIRED_FILES[@]}"; do
  [[ -f "$REQUIRED_FILE" ]] && pass "File exists: $REQUIRED_FILE" || fail "Missing file: $REQUIRED_FILE"
done

REQUIRED_PAGE_TEXT=("searchParams: Promise" 'requestedService ?? "transcript-request"' "candidate.active" "notFound()" "ApplicantSignUpPage")
for REQUIRED_TEXT in "${REQUIRED_PAGE_TEXT[@]}"; do
  grep -Fq "$REQUIRED_TEXT" "$PAGE_FILE" && pass "Sign-up route capability found: $REQUIRED_TEXT" || fail "Missing sign-up route capability: $REQUIRED_TEXT"
done

REQUIRED_FORM_TEXT=('"use client"' "useDemoState" '"UPDATE_APPLICANT"' '"SET_ACTIVE_ROLE"' 'role: "APPLICANT"' 'router.push(`/demo/apply/${service.slug}`)' 'name="fullName"' 'name="email"' 'name="phone"' 'name="accuracyDeclaration"' "No real authentication account is created.")
for REQUIRED_TEXT in "${REQUIRED_FORM_TEXT[@]}"; do
  grep -Fq "$REQUIRED_TEXT" "$FORM_FILE" && pass "Applicant form capability found: $REQUIRED_TEXT" || fail "Missing applicant form capability: $REQUIRED_TEXT"
done

REQUIRED_PUBLIC_PAGE_TEXT=("DemoPublicShell" "ApplicantSignUpForm" "Step 1 of 3" "One continuous request journey" "controlled demonstration")
for REQUIRED_TEXT in "${REQUIRED_PUBLIC_PAGE_TEXT[@]}"; do
  grep -Fq "$REQUIRED_TEXT" "$PUBLIC_PAGE_FILE" && pass "Applicant page content found: $REQUIRED_TEXT" || fail "Missing applicant page content: $REQUIRED_TEXT"
done

REQUIRED_DOCUMENT_TEXT=("D16 builds the simulated applicant sign-up step for the Demo Engine." "D16 does not create a production authentication account." 'The sign-up route reads the `service` query parameter.' 'The page updates the D7 applicant record through the typed `UPDATE_APPLICANT` action.' "## 8. D16 definition of done")
for REQUIRED_TEXT in "${REQUIRED_DOCUMENT_TEXT[@]}"; do
  grep -Fq "$REQUIRED_TEXT" "$DOCUMENT_FILE" && pass "Documentation rule found: $REQUIRED_TEXT" || fail "Missing documentation rule: $REQUIRED_TEXT"
done

RUNTIME_FILES=("$PAGE_FILE" "$FORM_FILE" "$PUBLIC_PAGE_FILE")
if grep -nE "from[[:space:]]+[\"'][^\"']*supabase|createClient\\(|supabase\\." "${RUNTIME_FILES[@]}"; then
  fail "D16 runtime files must not import or call Supabase"
else
  pass "No Supabase runtime dependency found"
fi

PAGE_COUNT="$(find app/demo -type f -name "page.tsx" | wc -l | tr -d " ")"
[[ "$PAGE_COUNT" -eq 14 ]] && pass "The 14-route inventory remains intact" || fail "Expected 14 route pages but found $PAGE_COUNT"

UNEXPECTED_CHANGED_FILES=""
while IFS= read -r STATUS_LINE; do
  [[ -z "$STATUS_LINE" ]] && continue
  FILE_PATH="${STATUS_LINE:3}"
  case "$FILE_PATH" in
    "$PAGE_FILE"|"$FORM_FILE"|"$PUBLIC_PAGE_FILE"|"$DOCUMENT_FILE"|"$SCRIPT_FILE") ;;
    *) UNEXPECTED_CHANGED_FILES+="${FILE_PATH}"$'\n' ;;
  esac
done < <(git status --porcelain=v1 --untracked-files=all)

if [[ -z "$UNEXPECTED_CHANGED_FILES" ]]; then
  pass "Only D16-owned files are changed"
else
  printf "\nUnexpected changed files:\n%s\n" "$UNEXPECTED_CHANGED_FILES" >&2
  fail "D16 contains files outside its approved boundary"
fi

bash -n "$SCRIPT_FILE"
pass "Verification script syntax is valid"

printf "\n=========================================\n"
printf "D16 VERIFICATION PASSED\n"
printf "The simulated applicant sign-up is ready for technical checks.\n\n"
