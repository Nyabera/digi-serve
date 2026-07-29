#!/usr/bin/env bash
set -euo pipefail

ROOT="${FAIDIA_ROOT:-/Users/blaq/Downloads/faidia}"
cd "$ROOT"

fail() { printf 'FAIL: %s\n' "$1" >&2; exit 1; }
pass() { printf 'PASS: %s\n' "$1"; }

required=(
  "app/demo/verify-certificate/page.tsx"
  "features/demo-verification/components/public-verification-page.tsx"
  "features/demo-verification/components/public-verification-page.module.css"
  "features/demo-verification/lib/public-verification.ts"
  "features/demo-engine/config/demo-verification-validation.ts"
  "demo-packs/tvet/verification.ts"
  "docs/demo-engine-base/d30-freeze/D30-10A-PUBLIC-VERIFICATION.md"
  "docs/demo-engine-base/d30-freeze/D30-10A-CHECKLIST.md"
)

for file in "${required[@]}"; do
  [[ -s "$file" ]] || fail "Missing or empty file: $file"
done
pass "Required D30-10A files exist"

grep -Fq "verification: tvetVerificationDraft" demo-packs/tvet/manifest.ts \
  || fail "TVET manifest does not include verification"

grep -Fq "readonly verification: DemoVerificationConfig" features/demo-engine/config/demo-pack.types.ts \
  || fail "DemoPack verification contract is missing"
pass "Verification configuration is part of DemoPack"

for status in valid revoked expired replaced; do
  grep -Fq "status: \"$status\"" demo-packs/tvet/verification.ts \
    || fail "Missing TVET verification status: $status"
done
pass "Configured verification states exist"

for label in VALID REVOKED EXPIRED REPLACED "NOT FOUND"; do
  grep -Fq "$label" features/demo-verification/components/public-verification-page.tsx \
    || fail "Missing public result state: $label"
done
pass "Public result states exist"

if grep -Eqi 'nationalId|identityNumber|emailAddress|phoneNumber|grade|pdfUrl|documentUrl|uploadedDocument|completeCertificate' \
  demo-packs/tvet/verification.ts \
  features/demo-engine/config/demo-pack.types.ts; then
  fail "Sensitive fields appear in the public verification model"
fi
pass "Public verification model excludes sensitive fields"

grep -Fq "/demo/verify-certificate" components/demo/homepage/savannah-homepage.tsx \
  || fail "Homepage navigation link is missing"
pass "Homepage navigation exposes the route"

npm run demo:validate -- tvet
git diff --check
pass "Validation and whitespace checks passed"

printf '\nD30-10A public-verification verification passed.\n'
