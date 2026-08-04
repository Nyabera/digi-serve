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
  "app/demo/applicant/layout.tsx"
  "app/demo/applicant/page.tsx"
  "app/demo/applicant/profile/page.tsx"
  "features/demo-applicant/components/applicant-workspace-shell.tsx"
  "features/demo-applicant/components/applicant-workspace-shell.module.css"
  "features/demo-applicant/components/applicant-profile-page.tsx"
  "features/demo-applicant/components/applicant-profile-page.module.css"
  "features/demo-applicant/lib/applicant-profile-view-models.ts"
  "features/demo-engine/config/demo-applicant-profile-validation.ts"
  "demo-packs/tvet/applicant-profile.ts"
  "$D30_DIR/D30-10C-APPLICANT-PROFILE.md"
  "$D30_DIR/D30-10C-CHECKLIST.md"
)

for file in "${required[@]}"; do
  [[ -s "$file" ]] || fail "Missing or empty file: $file"
done

pass "Required D30-10C files exist"

grep -Fq "applicantProfile: tvetApplicantProfileDraft" \
  demo-packs/tvet/manifest.ts \
  || fail "TVET manifest does not include applicant profile"

grep -Fq "readonly applicantProfile: DemoApplicantProfileConfig" \
  features/demo-engine/config/demo-pack.types.ts \
  || fail "DemoPack applicant-profile contract is missing"

grep -Fq "useDemoApplicantProfile" \
  features/demo-engine/config/demo-pack-provider.tsx \
  || fail "Neutral Applicant profile hook is missing"

pass "Applicant profile configuration is part of DemoPack"

for label in \
  "Personal Information" \
  "Contact Information" \
  "Institution Details" \
  "Communication Preferences" \
  "Security"; do
  grep -Fq "$label" \
    features/demo-applicant/components/applicant-profile-page.tsx \
    || fail "Missing Applicant profile section: $label"
done

pass "Required Applicant profile sections exist"

grep -Fq "ApplicantWorkspaceShell" \
  app/demo/applicant/layout.tsx \
  || fail "Applicant layout does not own the shared shell"

grep -Fq 'redirect("/demo/applicant/profile")' \
  app/demo/applicant/page.tsx \
  || fail "Applicant index redirect is missing"

pass "Applicant routing and shell ownership are correct"

if grep -RniE \
  'demo-packs/tvet' \
  features/demo-applicant \
  --include='*.ts' \
  --include='*.tsx' \
  2>/dev/null | grep -q .; then
  fail "Applicant UI directly imports the TVET pack"
fi

pass "Applicant UI remains pack-neutral"

grep -Fq "validateDemoApplicantProfileConfig" \
  features/demo-engine/config/demo-pack-validation.ts \
  || fail "Applicant-profile validation is not integrated"

pass "Applicant-profile validation is integrated"

npm run demo:validate -- tvet
pass "TVET Demo Pack passes configuration validation"

git diff --check
pass "Git whitespace validation passed"

printf '\nD30-10C Applicant profile verification passed.\n'
