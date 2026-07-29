#!/usr/bin/env bash
set -euo pipefail

ROOT="${FAIDIA_ROOT:-/Users/blaq/Downloads/faidia}"
EXPECTED_BRANCH="feat/demo-engine-base"
D30_DIR="docs/demo-engine-base/d30-freeze"

cd "$ROOT"

fail() {
  printf 'FAIL: %s\n' "$1" >&2
  exit 1
}

pass() {
  printf 'PASS: %s\n' "$1"
}

[[ "$(git branch --show-current)" == "$EXPECTED_BRANCH" ]] \
  || fail "Expected branch $EXPECTED_BRANCH"

required=(
  "app/demo/applicant/documents/page.tsx"
  "features/demo-applicant-documents/components/applicant-document-vault.tsx"
  "features/demo-applicant-documents/components/applicant-document-vault.module.css"
  "features/demo-applicant-documents/lib/applicant-document-vault-view-models.ts"
  "features/demo-engine/config/demo-applicant-document-vault-validation.ts"
  "demo-packs/tvet/applicant-document-vault.ts"
  "$D30_DIR/D30-10D-APPLICANT-DOCUMENT-VAULT.md"
  "$D30_DIR/D30-10D-CHECKLIST.md"
)

for file in "${required[@]}"; do
  [[ -s "$file" ]] || fail "Missing or empty file: $file"
done

pass "Required D30-10D files exist"

grep -Fq "applicantDocumentVault: tvetApplicantDocumentVaultDraft" \
  demo-packs/tvet/manifest.ts \
  || fail "TVET manifest does not include applicant document vault"

grep -Fq "useDemoApplicantDocumentVault" \
  features/demo-engine/config/demo-pack-provider.tsx \
  || fail "Neutral Applicant document-vault hook is missing"

grep -Fq 'label: "My Documents"' \
  features/demo-applicant/components/applicant-workspace-shell.tsx \
  || fail "Applicant navigation does not contain My Documents"

pass "Applicant document-vault configuration and navigation exist"

for label in \
  "My Uploads" \
  "Generated Letters" \
  "Certificates"; do
  grep -Fq "$label" \
    features/demo-applicant-documents/components/applicant-document-vault.tsx \
    || fail "Missing vault tab: $label"
done

pass "All three Applicant vault tabs exist"

if grep -RniE \
  'demo-packs/tvet' \
  features/demo-applicant-documents \
  --include='*.ts' \
  --include='*.tsx' \
  2>/dev/null | grep -q .; then
  fail "Applicant document UI directly imports the TVET pack"
fi

pass "Applicant document UI remains pack-neutral"

grep -Fq "validateDemoApplicantDocumentVaultConfig" \
  features/demo-engine/config/demo-pack-validation.ts \
  || fail "Applicant document-vault validation is not integrated"

pass "Applicant document-vault validation is integrated"

npm run demo:validate -- tvet
pass "TVET Demo Pack passes configuration validation"

git diff --check
pass "Git whitespace validation passed"

printf '\nD30-10D Applicant document-vault verification passed.\n'
