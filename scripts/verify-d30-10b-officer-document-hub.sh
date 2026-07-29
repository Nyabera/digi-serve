#!/usr/bin/env bash
set -euo pipefail

ROOT="${FAIDIA_ROOT:-/Users/blaq/Downloads/faidia}"
cd "$ROOT"

fail() {
  printf 'FAIL: %s\n' "$1" >&2
  exit 1
}

pass() {
  printf 'PASS: %s\n' "$1"
}

required=(
  "app/demo/officer/documents/page.tsx"
  "features/demo-documents/components/officer-document-hub.tsx"
  "features/demo-documents/components/officer-document-hub.module.css"
  "features/demo-documents/lib/document-hub-view-models.ts"
  "demo-packs/tvet/documents.ts"
  "docs/demo-engine-base/d30-freeze/D30-10B-OFFICER-DOCUMENT-HUB.md"
  "docs/demo-engine-base/d30-freeze/D30-10B-CHECKLIST.md"
)

for file in "${required[@]}"; do
  [[ -s "$file" ]] ||
    fail "Missing or empty file: $file"
done

pass "Required D30-10B files exist"

grep -Fq "documents: tvetDocumentsDraft" \
  demo-packs/tvet/manifest.ts ||
  fail "TVET manifest does not include documents"

grep -Fq "useDemoDocuments" \
  features/demo-engine/config/demo-pack-provider.tsx ||
  fail "Neutral document hook is missing"

pass "Document configuration is integrated"

for label in \
  "Issued Documents" \
  "Document Review" \
  "Verifications"; do
  grep -Fq "$label" \
    features/demo-documents/components/officer-document-hub.tsx ||
    fail "Missing tab: $label"
done

pass "All document-hub tabs exist"

grep -Fq "/demo/officer/documents" \
  components/demo/internal-shell/internal-navigation.ts ||
  fail "Officer navigation link is missing"

pass "Officer navigation exposes Documents Hub"

if grep -Rni "demo-packs/tvet" \
  features/demo-documents \
  --include='*.ts' \
  --include='*.tsx' \
  2>/dev/null | grep -q .; then
  fail "Document UI directly imports the TVET pack"
fi

pass "Document UI remains pack-neutral"

npm run demo:validate -- tvet

pass "TVET Demo Pack passes configuration validation"

git diff --check

pass "Git whitespace validation passed"

printf '\nD30-10B Officer document-hub verification passed.\n'
