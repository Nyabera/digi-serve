#!/usr/bin/env bash
#
# Verify D34-7 admin navigation acceptance and checksum freeze.
#

set -u
set -o pipefail

fail() {
  printf '\nFAIL: %s\n' "$1" >&2
  exit 1
}

for command_name in git node grep awk sed sort find shasum; do
  command -v "$command_name" >/dev/null 2>&1 \
    || fail "$command_name is unavailable."
done

ROOT="$(git rev-parse --show-toplevel 2>/dev/null)" \
  || fail "Run this inside the repository."
cd "$ROOT" || fail "Could not enter repository root."

CONTRACT="features/demo-engine/navigation/admin-navigation-contract.ts"
REGISTRY="features/demo-engine/navigation/demo-route-registry.ts"
NAVIGATION="components/demo/internal-shell/internal-navigation.ts"
SIDEBAR="components/demo/internal-shell/internal-sidebar.tsx"
LAYOUT="app/demo/admin/layout.tsx"
LEGACY_PAGE="app/demo/admin/workflows/builder/page.tsx"
MANIFEST="docs/demo/d34-freeze/D34-ADMIN-NAVIGATION-FREEZE.json"
PLAYWRIGHT_TEST="tests/acceptance/d34/admin-navigation-freeze.pw.ts"

for file in \
  "$CONTRACT" \
  "$REGISTRY" \
  "$NAVIGATION" \
  "$SIDEBAR" \
  "$LAYOUT" \
  "$LEGACY_PAGE" \
  "$MANIFEST" \
  "$PLAYWRIGHT_TEST"
do
  [ -f "$file" ] || fail "Missing required file: $file"
done

TMP_DIR="$(mktemp -d "${TMPDIR:-/tmp}/verify-d34-7.XXXXXX")" \
  || fail "Could not create temporary directory."
trap 'rm -rf "$TMP_DIR"' EXIT INT TERM

ROUTES="$TMP_DIR/routes.txt"
MISSING="$TMP_DIR/missing.txt"
CROSS="$TMP_DIR/cross.txt"

grep -E '^[[:space:]]+[A-Za-z][A-Za-z0-9]*: "/demo/admin' \
  "$CONTRACT" \
  | sed -E 's/^[^"]*"([^"]+)".*$/\1/' \
  | LC_ALL=C sort -u > "$ROUTES"

[ "$(wc -l < "$ROUTES" | tr -d ' ')" -eq 21 ] \
  || fail "Canonical route count is not 21."

route_to_page() {
  route="$1"
  relative="${route#/demo/admin}"

  if [ -z "$relative" ]; then
    printf '%s' "app/demo/admin/page.tsx"
  else
    printf 'app/demo/admin%s/page.tsx' "$relative"
  fi
}

: > "$MISSING"
while IFS= read -r route; do
  page="$(route_to_page "$route")"
  [ -f "$page" ] || printf '%s -> %s\n' "$route" "$page" >> "$MISSING"
done < "$ROUTES"

[ ! -s "$MISSING" ] || {
  cat "$MISSING" >&2
  fail "One or more canonical page files are missing."
}

grep -q 'ADMIN_NAVIGATION_SECTIONS.map' "$NAVIGATION" \
  || fail "Visible admin navigation is not contract-derived."
grep -q 'findActiveAdminNavigationItem' "$SIDEBAR" \
  || fail "Sidebar does not use canonical active matching."
grep -q 'AdminWorkspaceShell' "$LAYOUT" \
  || fail "Admin layout no longer owns the admin shell."
grep -q 'redirect(' "$LEGACY_PAGE" \
  || fail "Legacy builder route no longer redirects."

find app/demo/admin -type f \
  \( -name 'page.tsx' -o -name 'page.ts' -o -name 'page.jsx' -o -name 'page.js' \) \
  -exec grep -nHE \
    '/demo/(officer|supervisor|department|applicant|public|reports)([/?#"]|$)' \
    {} + > "$CROSS" 2>/dev/null || true

[ ! -s "$CROSS" ] || {
  cat "$CROSS" >&2
  fail "An admin page contains a cross-workspace destination."
}

node <<'NODE'
const crypto = require("node:crypto");
const fs = require("node:fs");

const manifestPath =
  "docs/demo/d34-freeze/D34-ADMIN-NAVIGATION-FREEZE.json";
const manifest = JSON.parse(
  fs.readFileSync(manifestPath, "utf8"),
);

if (manifest.stage !== "D34-7") {
  throw new Error("Freeze manifest stage is not D34-7.");
}

if (manifest.status !== "frozen") {
  throw new Error("Freeze manifest is not marked frozen.");
}

if (manifest.routeCount !== 21) {
  throw new Error("Freeze manifest route count is not 21.");
}

if (manifest.sectionCount !== 9) {
  throw new Error("Freeze manifest section count is not 9.");
}

if (!Array.isArray(manifest.files) || manifest.files.length < 20) {
  throw new Error("Freeze manifest file inventory is incomplete.");
}

for (const entry of manifest.files) {
  if (!fs.existsSync(entry.path)) {
    throw new Error(`Frozen file is missing: ${entry.path}`);
  }

  const hash = crypto
    .createHash("sha256")
    .update(fs.readFileSync(entry.path))
    .digest("hex");

  if (hash !== entry.sha256) {
    throw new Error(
      `Frozen file changed: ${entry.path}`,
    );
  }
}
NODE

[ "$?" -eq 0 ] || fail "Checksum freeze verification failed."

printf 'PASS: D34 contract still contains 21 canonical routes.\n'
printf 'PASS: Every canonical route has an admin-owned page.\n'
printf 'PASS: Visible navigation remains contract-derived.\n'
printf 'PASS: Admin layout remains the sole shell owner.\n'
printf 'PASS: Canonical pages contain no cross-workspace destinations.\n'
printf 'PASS: Legacy workflow-builder route remains a redirect.\n'
printf 'PASS: D34-7 Playwright acceptance coverage exists.\n'
printf 'PASS: Every checksum in the D34 freeze manifest matches.\n'
