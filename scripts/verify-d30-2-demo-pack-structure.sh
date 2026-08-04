#!/usr/bin/env bash
set -euo pipefail

ROOT="${FAIDIA_ROOT:-/Users/blaq/Downloads/faidia}"
cd "$ROOT"

fail() {
  echo "FAIL: $1" >&2
  exit 1
}

pass() {
  echo "PASS: $1"
}

required=(
  "demo-packs/README.md"
  "demo-packs/tvet/README.md"
  "demo-packs/tvet/manifest.ts"
  "demo-packs/tvet/organization.ts"
  "demo-packs/tvet/branding.ts"
  "demo-packs/tvet/homepage.ts"
  "demo-packs/tvet/departments.ts"
  "demo-packs/tvet/users.ts"
  "demo-packs/tvet/services.ts"
  "demo-packs/tvet/workflows.ts"
  "demo-packs/tvet/requests.ts"
  "demo-packs/tvet/reports.ts"
  "demo-packs/tvet/sla.ts"
  "demo-packs/tvet/assets/README.md"
  "demo-packs/tvet/assets/homepage/.gitkeep"
  "demo-packs/shared/README.md"
  "docs/demo-engine-base/d30-freeze/DEMO-PACK-STRUCTURE.md"
  "docs/demo-engine-base/d30-freeze/D30-2-CHECKLIST.md"
)

for file in "${required[@]}"; do
  [[ -e "$file" ]] || fail "Missing required file: $file"
done

pass "Required Demo Pack files exist"

for pack in supermarket county hospital sacco university insurance construction manufacturing logistics telecom; do
  [[ -f "demo-packs/$pack/README.md" ]] || fail "Missing placeholder pack: $pack"
done

pass "Future vertical placeholders exist"

if find demo-packs -type f \( -name "page.tsx" -o -name "layout.tsx" -o -name "internal-app-shell.tsx" -o -name "role-workspace-shell.tsx" \) | grep -q .; then
  fail "A Demo Pack contains copied Demo Engine files"
fi

pass "No routes or role shells were copied into Demo Packs"

grep -q "tvetDemoPackDraft" demo-packs/tvet/manifest.ts || fail "TVET draft manifest is missing"

pass "TVET draft manifest exists"

git diff --check

pass "Git whitespace validation passed"

echo
echo "D30-2 Demo Pack structure verification passed."
