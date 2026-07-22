#!/usr/bin/env bash

set -euo pipefail

EXPECTED_ROOT="/Users/blaq/Downloads/faidia"
EXPECTED_BRANCH="feat/demo-engine-base"

ROUTE_FILE="app/demo/requests/[requestId]/confirmation/page.tsx"
REVIEW_FILE="components/demo/requests/request-review-submission.tsx"
PUBLIC_PAGE_FILE="components/demo/public/request-confirmation-page.tsx"
DOCUMENT_FILE="docs/demo-engine-base/DEMO-ENGINE-REVIEW-SUBMISSION.md"
SCRIPT_FILE="scripts/verify-d19-review-submission.sh"

pass() {
  printf "PASS: %s\n" "$1"
}

fail() {
  printf "FAIL: %s\n" "$1" >&2
  exit 1
}

printf "\nFAIDIA D19 review-and-submission verification\n"
printf "============================================\n\n"

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
  "$ROUTE_FILE"
  "$REVIEW_FILE"
  "$PUBLIC_PAGE_FILE"
  "$DOCUMENT_FILE"
  "$SCRIPT_FILE"
)

for REQUIRED_FILE in "${REQUIRED_FILES[@]}"; do
  [[ -f "$REQUIRED_FILE" ]] \
    && pass "File exists: $REQUIRED_FILE" \
    || fail "Missing file: $REQUIRED_FILE"
done

REQUIRED_ROUTE_TEXT=(
  "params: Promise"
  "searchParams: Promise"
  'requestedService ?? "transcript-request"'
  "candidate.active"
  "notFound()"
  "RequestConfirmationPage"
)

for REQUIRED_TEXT in "${REQUIRED_ROUTE_TEXT[@]}"; do
  grep -Fq "$REQUIRED_TEXT" "$ROUTE_FILE" \
    && pass "Confirmation route capability found: $REQUIRED_TEXT" \
    || fail "Missing confirmation route capability: $REQUIRED_TEXT"
done

REQUIRED_REVIEW_TEXT=(
  '"use client"'
  "useDemoState"
  'const SUBMISSION_FIELD_PREFIX = "__submission:"'
  'const DOCUMENT_FIELD_PREFIX = "__document:"'
  '"SET_FORM_VALUE"'
  '"ADD_ACTIVITY_EVENT"'
  'name: "request_submitted"'
  "Review before submission"
  "Submit request"
  "Submission confirmed"
  "Your request has been submitted"
  "Confirm the submission declaration before submitting."
  'href={`/demo/track/${submissionReference}`}'
  "It does not create a production database record."
)

for REQUIRED_TEXT in "${REQUIRED_REVIEW_TEXT[@]}"; do
  grep -Fq "$REQUIRED_TEXT" "$REVIEW_FILE" \
    && pass "Review/submission capability found: $REQUIRED_TEXT" \
    || fail "Missing review/submission capability: $REQUIRED_TEXT"
done

REQUIRED_PUBLIC_PAGE_TEXT=(
  "DemoPublicShell"
  "RequestReviewSubmission"
  "Final step · Review and submit"
  "Draft reference"
  "Controlled demo submission"
)

for REQUIRED_TEXT in "${REQUIRED_PUBLIC_PAGE_TEXT[@]}"; do
  grep -Fq "$REQUIRED_TEXT" "$PUBLIC_PAGE_FILE" \
    && pass "Confirmation page content found: $REQUIRED_TEXT" \
    || fail "Missing confirmation page content: $REQUIRED_TEXT"
done

REQUIRED_DOCUMENT_TEXT=(
  "D19 replaces the confirmation placeholder with a review-before-submission page"
  "The stage also appends one `request_submitted` activity event."
  "The existing seeded active request identifier becomes the controlled demonstration reference."
  "D19 does not generate a production database reference or workflow record."
  "## 11. D19 definition of done"
)

for REQUIRED_TEXT in "${REQUIRED_DOCUMENT_TEXT[@]}"; do
  grep -Fq "$REQUIRED_TEXT" "$DOCUMENT_FILE" \
    && pass "Documentation rule found: $REQUIRED_TEXT" \
    || fail "Missing documentation rule: $REQUIRED_TEXT"
done

RUNTIME_FILES=(
  "$ROUTE_FILE"
  "$REVIEW_FILE"
  "$PUBLIC_PAGE_FILE"
)

if grep -nE \
  "from[[:space:]]+[\"'][^\"']*supabase|createClient\\(|supabase\\." \
  "${RUNTIME_FILES[@]}"; then
  fail "D19 runtime files must not import or call Supabase"
else
  pass "No Supabase runtime dependency found"
fi

grep -Fq \
  'confirmation?service=${service.slug}' \
  components/demo/documents/simulated-document-uploader.tsx \
  && pass "D18 continues to the D19 confirmation route" \
  || fail "D18 must continue to the D19 confirmation route"

PAGE_COUNT="$(
  find app/demo -type f -name "page.tsx" | wc -l | tr -d " "
)"

[[ "$PAGE_COUNT" -eq 14 ]] \
  && pass "The 14-route inventory remains intact" \
  || fail "Expected 14 route pages but found $PAGE_COUNT"

UNEXPECTED_CHANGED_FILES=""

while IFS= read -r STATUS_LINE; do
  [[ -z "$STATUS_LINE" ]] && continue

  FILE_PATH="${STATUS_LINE:3}"

  case "$FILE_PATH" in
    "$ROUTE_FILE"|\
    "$REVIEW_FILE"|\
    "$PUBLIC_PAGE_FILE"|\
    "$DOCUMENT_FILE"|\
    "$SCRIPT_FILE")
      ;;
    *)
      UNEXPECTED_CHANGED_FILES+="${FILE_PATH}"$'\n'
      ;;
  esac
done < <(git status --porcelain=v1 --untracked-files=all)

if [[ -z "$UNEXPECTED_CHANGED_FILES" ]]; then
  pass "Only D19-owned files are changed"
else
  printf "\nUnexpected changed files:\n%s\n" \
    "$UNEXPECTED_CHANGED_FILES" >&2
  fail "D19 contains files outside its approved boundary"
fi

bash -n "$SCRIPT_FILE"
pass "Verification script syntax is valid"

printf "\n============================================\n"
printf "D19 VERIFICATION PASSED\n"
printf "The review, explicit submission and confirmation flow is ready.\n\n"
