#!/usr/bin/env bash
set -euo pipefail

ROOT="${FAIDIA_ROOT:-/Users/blaq/Downloads/faidia}"
D30_DIR="docs/demo-engine-base/d30-freeze"

cd "$ROOT"

fail() {
  printf 'FAIL: %s\n' "$1" >&2
  exit 1
}

pass() {
  printf 'PASS: %s\n' "$1"
}

require_file() {
  [[ -s "$1" ]] || fail "Missing or empty file: $1"
}

require_text() {
  local needle="$1"
  local file="$2"

  grep -Fq "$needle" "$file" \
    || fail "Expected '$needle' in $file"
}

required_files=(
  "app/demo/page.tsx"
  "app/demo/verify-certificate/page.tsx"
  "app/demo/applicant/profile/page.tsx"
  "app/demo/applicant/documents/page.tsx"
  "app/demo/officer/page.tsx"
  "app/demo/officer/documents/page.tsx"
  "app/demo/supervisor/page.tsx"
  "app/demo/admin/page.tsx"
  "app/demo/admin/workflows/page.tsx"
  "app/demo/admin/workflows/builder/page.tsx"
  "features/demo-engine/navigation/demo-route-registry.ts"
  "features/demo-engine/navigation/demo-navigation-state.ts"
  "features/demo-engine/navigation/index.ts"
  "features/demo-engine/config/demo-pack-validation.ts"
  "demo-packs/tvet/manifest.ts"
  "components/demo/role-switch/demo-role-navigation-bridge.tsx"
  "components/demo/homepage/savannah-homepage.tsx"
  "features/demo-applicant/components/applicant-workspace-shell.tsx"
  "components/demo/internal-shell/internal-navigation.ts"
  "$D30_DIR/DEMO-ENVIRONMENT.txt"
  "$D30_DIR/DEMO-ACCEPTANCE-CHECKLIST.md"
  "$D30_DIR/DEMO-ENGINE-INVENTORY.md"
  "$D30_DIR/DEMO-BOUNDARY-EXCEPTIONS.md"
)

for file in "${required_files[@]}"; do
  require_file "$file"
done

pass "Freeze baseline and required routes exist"

registry="features/demo-engine/navigation/demo-route-registry.ts"

for route in \
  "/demo/verify-certificate" \
  "/demo/applicant/profile" \
  "/demo/applicant/documents" \
  "/demo/officer/documents" \
  "/demo/admin/workflows" \
  "/demo/admin/workflows/builder"; do
  require_text "$route" "$registry"
done

require_text \
  "DEMO_ROLE_HOME_ROUTES" \
  "components/demo/role-switch/demo-role-navigation-bridge.tsx"

require_text \
  "resolveDemoRoleFromPath" \
  "components/demo/role-switch/demo-role-navigation-bridge.tsx"

pass "New routes and role destinations are centrally registered"

require_text \
  'href: "/demo/track"' \
  "features/demo-applicant/components/applicant-workspace-shell.tsx"

require_text \
  'href: "/demo/applicant/documents"' \
  "features/demo-applicant/components/applicant-workspace-shell.tsx"

require_text \
  'href: "/demo/applicant/profile"' \
  "features/demo-applicant/components/applicant-workspace-shell.tsx"

require_text \
  "/demo/officer/documents" \
  "components/demo/internal-shell/internal-navigation.ts"

pass "Applicant and Officer navigation routes are connected"

python3 - <<'PY'
from pathlib import Path
import re

path = Path(
    "components/demo/homepage/savannah-homepage.tsx"
)
source = path.read_text(encoding="utf-8")
needle = 'href="/demo/verify-certificate"'

if source.count(needle) != 1:
    raise SystemExit(
        "FAIL: Homepage must contain exactly one "
        "Verify Certificate link."
    )

footer = re.search(
    r"<footer\b[\s\S]*?</footer>",
    source,
)

if footer is None or needle not in footer.group(0):
    raise SystemExit(
        "FAIL: Verify Certificate must be in the footer."
    )

if needle in source[: footer.start()]:
    raise SystemExit(
        "FAIL: Verify Certificate still appears before the footer."
    )

print("PASS: Verify Certificate is present in the footer only")
PY

for field in \
  "validateDemoVerificationConfig" \
  "validateDemoApplicantProfileConfig" \
  "validateDemoApplicantDocumentVaultConfig"; do
  require_text \
    "$field" \
    "features/demo-engine/config/demo-pack-validation.ts"
done

python3 - <<'PY_CHECK_DOCUMENT_VALIDATION'
from pathlib import Path
import re

path = Path(
    "features/demo-engine/config/"
    "demo-pack-validation.ts"
)

if not path.exists():
    raise SystemExit(
        f"FAIL: Missing Demo Pack validator: {path}"
    )

source = path.read_text(encoding="utf-8")

if not re.search(
    r"\bpack\s*\.\s*documents\b",
    source,
):
    raise SystemExit(
        "FAIL: pack.documents is not referenced by "
        "Demo Pack validation."
    )

validator_names = sorted(
    set(
        re.findall(
            r"\b("
            r"validate[A-Za-z0-9_]*"
            r"Document[A-Za-z0-9_]*"
            r")\b",
            source,
        )
    )
)

if not validator_names:
    raise SystemExit(
        "FAIL: No document validator identifier was "
        "found in demo-pack-validation.ts."
    )

def call_contains_documents(name: str) -> bool:
    call_pattern = re.compile(
        rf"\b{re.escape(name)}\s*\("
    )

    for match in call_pattern.finditer(source):
        prefix = source[
            max(0, match.start() - 80):
            match.start()
        ]

        if re.search(
            r"(?:function|declare)\s+$",
            prefix,
        ):
            continue

        opening = source.find(
            "(",
            match.start(),
        )

        if opening == -1:
            continue

        depth = 0

        for position in range(opening, len(source)):
            character = source[position]

            if character == "(":
                depth += 1

            elif character == ")":
                depth -= 1

                if depth == 0:
                    arguments = source[
                        opening + 1:
                        position
                    ]

                    if re.search(
                        r"\bpack\s*\.\s*documents\b",
                        arguments,
                    ):
                        return True

                    break

    return False

wired_validators = [
    name
    for name in validator_names
    if call_contains_documents(name)
]

if not wired_validators:
    raise SystemExit(
        "FAIL: Document validator identifiers were found, "
        "but none is called with pack.documents.\n"
        "Detected: "
        + ", ".join(validator_names)
    )

print(
    "PASS: Officer document-hub validation is "
    "integrated through "
    + ", ".join(wired_validators)
)
PY_CHECK_DOCUMENT_VALIDATION

pass "All D30-10A through D30-10D configuration validators are integrated"

for property in \
  "verification:" \
  "documents:" \
  "applicantProfile:" \
  "applicantDocumentVault:"; do
  require_text "$property" "demo-packs/tvet/manifest.ts"
done

pass "TVET Demo Pack contains every new content section"

if grep -RniE \
  'demo-packs/tvet' \
  features/demo-verification \
  features/demo-documents \
  features/demo-applicant \
  features/demo-applicant-documents \
  features/demo-engine/navigation \
  --include='*.ts' \
  --include='*.tsx' \
  2>/dev/null | grep -q .; then
  fail "Reusable Demo mechanics directly import the TVET content pack"
fi

pass "Reusable feature mechanics remain pack-neutral"

if grep -RniE \
  'nationalId|identityNumber|emailAddress|phoneNumber|grade|pdfUrl|documentUrl|completeCertificate|uploadedDocument' \
  demo-packs/tvet/verification.ts \
  features/demo-engine/config/demo-pack.types.ts \
  2>/dev/null | grep -q .; then
  fail "Sensitive fields appear in the public verification model"
fi

pass "Public verification model excludes prohibited personal fields"

if grep -RniE \
  'https?://|publicUrl|permanentUrl' \
  demo-packs/tvet/applicant-document-vault.ts \
  2>/dev/null | grep -q .; then
  fail "Applicant vault contains a permanent public file URL"
fi

pass "Applicant vault uses controlled metadata without public document URLs"

if grep -Rni \
  'next/font/google' \
  app components features \
  --include='*.ts' \
  --include='*.tsx' \
  2>/dev/null | grep -q .; then
  fail "Google-hosted Next.js fonts remain in application source"
fi

pass "Build no longer depends on Google-hosted fonts"

python3 - <<'PY'
import json
from pathlib import Path

package = json.loads(
    Path("package.json").read_text(encoding="utf-8")
)
dependencies = {
    **package.get("dependencies", {}),
    **package.get("devDependencies", {}),
}

required = {
    "@fontsource-variable/plus-jakarta-sans",
    "@fontsource-variable/inter",
    "@fontsource-variable/source-code-pro",
}

missing = sorted(required - dependencies.keys())

if missing:
    raise SystemExit(
        "FAIL: Missing local font packages: "
        + ", ".join(missing)
    )

print("PASS: Required local variable-font packages are recorded")
PY

for page in \
  app/demo/verify-certificate/page.tsx \
  app/demo/applicant/profile/page.tsx \
  app/demo/applicant/documents/page.tsx \
  app/demo/officer/documents/page.tsx \
  app/demo/admin/workflows/page.tsx \
  app/demo/admin/workflows/builder/page.tsx; do
  if grep -Eqi \
    'InternalAppShell|ApplicantWorkspaceShell|RoleWorkspaceShell' \
    "$page"; then
    fail "Nested shell ownership detected in $page"
  fi
done

pass "New route pages inherit their shared shells without nesting"

for doc in \
  D30-10A-CHECKLIST.md \
  D30-10B-CHECKLIST.md \
  D30-10C-CHECKLIST.md \
  D30-10D-CHECKLIST.md \
  D30-10E-CHECKLIST.md; do
  require_file "$D30_DIR/$doc"
done

pass "All D30-10 feature checklists exist"

git diff --check
pass "Git whitespace validation passed"

printf '\nD30-10F freeze-alignment verification passed.\n'
