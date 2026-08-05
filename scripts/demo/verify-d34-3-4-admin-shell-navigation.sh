#!/usr/bin/env bash
#
# Verify D34-3 + D34-4 admin shell and navigation activation.
#

set -u
set -o pipefail

fail() {
  printf '\nFAIL: %s\n' "$1" >&2
  exit 1
}

command -v git >/dev/null 2>&1 || fail "git is unavailable."
command -v grep >/dev/null 2>&1 || fail "grep is unavailable."
command -v sed >/dev/null 2>&1 || fail "sed is unavailable."
command -v sort >/dev/null 2>&1 || fail "sort is unavailable."
command -v awk >/dev/null 2>&1 || fail "awk is unavailable."
command -v find >/dev/null 2>&1 || fail "find is unavailable."

ROOT="$(git rev-parse --show-toplevel 2>/dev/null)" \
  || fail "Run this inside the repository."
cd "$ROOT" || fail "Could not enter repository root."

CONTRACT="features/demo-engine/navigation/admin-navigation-contract.ts"
NAVIGATION="components/demo/internal-shell/internal-navigation.ts"
SIDEBAR="components/demo/internal-shell/internal-sidebar.tsx"
LAYOUT="app/demo/admin/layout.tsx"
ADMIN_SHELL="components/demo/workspace-shells/admin-workspace-shell.tsx"
ROLE_SHELL="components/demo/internal-shell/role-workspace-shell.tsx"

for file in \
  "$CONTRACT" \
  "$NAVIGATION" \
  "$SIDEBAR" \
  "$LAYOUT" \
  "$ADMIN_SHELL" \
  "$ROLE_SHELL"
do
  [ -f "$file" ] || fail "Missing required file: $file"
done

TMP_DIR="$(mktemp -d "${TMPDIR:-/tmp}/verify-d34-3-4.XXXXXX")" \
  || fail "Could not create temporary directory."
trap 'rm -rf "$TMP_DIR"' EXIT INT TERM

CONTRACT_ROUTES="$TMP_DIR/contract-routes.txt"
NAV_HREFS="$TMP_DIR/navigation-hrefs.txt"
MISSING_PAGES="$TMP_DIR/missing-pages.txt"
PAGE_SHELLS="$TMP_DIR/page-shells.txt"

grep -E '^[[:space:]]+[A-Za-z][A-Za-z0-9]*: "/demo/admin' "$CONTRACT" \
  | sed -E 's/^[^"]*"([^"]+)".*$/\1/' \
  | LC_ALL=C sort -u > "$CONTRACT_ROUTES"

ROUTE_COUNT="$(wc -l < "$CONTRACT_ROUTES" | tr -d ' ')"
[ "$ROUTE_COUNT" -eq 21 ] \
  || fail "Expected 21 canonical admin routes; found $ROUTE_COUNT."

grep -q 'ADMIN_NAVIGATION_SECTIONS.map' "$NAVIGATION" \
  || fail "Admin navigation is not derived from D34-1."
grep -q 'ADMIN_ICON_BY_SLOT' "$NAVIGATION" \
  || fail "Existing icon mapping is missing."
grep -q 'findActiveAdminNavigationItem' "$SIDEBAR" \
  || fail "Canonical longest-match active navigation is not connected."
grep -q 'role === "ADMIN"' "$SIDEBAR" \
  || fail "Admin-specific active-route handling is missing."
grep -q '? "/demo/admin"' "$SIDEBAR" \
  || fail "Admin brand link does not remain in the admin workspace."

grep -q 'AdminWorkspaceShell' "$LAYOUT" \
  || fail "Admin layout no longer owns AdminWorkspaceShell."
grep -q 'RoleWorkspaceShell role="admin"' "$ADMIN_SHELL" \
  || fail "AdminWorkspaceShell no longer resolves the admin role."
grep -q 'shellRole: "ADMIN"' "$ROLE_SHELL" \
  || fail "RoleWorkspaceShell no longer maps admin to ADMIN."

# Normal admin routes come exclusively from the D34-1 contract. The only
# deliberate non-admin destination is Log Out -> /demo.
grep -nE '/demo/(officer|supervisor|department|applicant|reports)([/?#"]|$)' \
  "$NAVIGATION" > "$TMP_DIR/cross-workspace.txt" || true

# The file also contains other role navigation blocks, so only inspect the
# canonical admin mapping region.
awk '
  /const ADMIN_ICON_BY_SLOT/ { inside = 1 }
  /export function getInternalNavigation/ { inside = 0 }
  inside { print }
' "$NAVIGATION" |
  grep -nE '/demo/(officer|supervisor|department|applicant|reports)([/?#"]|$)' \
  > "$TMP_DIR/admin-cross-workspace.txt" || true

if [ -s "$TMP_DIR/admin-cross-workspace.txt" ]; then
  cat "$TMP_DIR/admin-cross-workspace.txt" >&2
  fail "Canonical admin navigation still contains another workspace destination."
fi

route_to_page() {
  route="$1"
  relative="${route#/demo/admin}"

  if [ -z "$relative" ]; then
    printf '%s' "app/demo/admin/page.tsx"
  else
    printf 'app/demo/admin%s/page.tsx' "$relative"
  fi
}

: > "$MISSING_PAGES"
while IFS= read -r route; do
  page="$(route_to_page "$route")"
  [ -f "$page" ] || printf '%s -> %s\n' "$route" "$page" >> "$MISSING_PAGES"
done < "$CONTRACT_ROUTES"

if [ -s "$MISSING_PAGES" ]; then
  cat "$MISSING_PAGES" >&2
  fail "One or more canonical admin pages are missing."
fi

find app/demo/admin -type f \
  \( -name 'page.tsx' -o -name 'page.ts' -o -name 'page.jsx' -o -name 'page.js' \) \
  -exec grep -nHE '(WorkspaceShell|InternalAppShell|RoleWorkspaceShell|InternalSidebar|InternalTopbar)' {} + \
  > "$PAGE_SHELLS" 2>/dev/null || true

if [ -s "$PAGE_SHELLS" ]; then
  cat "$PAGE_SHELLS" >&2
  fail "An admin page appears to render a page-level workspace shell."
fi

printf 'PASS: Admin layout remains the sole workspace-shell owner.\n'
printf 'PASS: Admin navigation is derived from D34-1.\n'
printf 'PASS: All 21 normal destinations remain beneath /demo/admin.\n'
printf 'PASS: Admin brand navigation remains beneath /demo/admin.\n'
printf 'PASS: Active state uses longest canonical route matching.\n'
printf 'PASS: Existing icon components remain mapped to the new items.\n'
printf 'PASS: No admin page renders a nested sidebar or top bar.\n'
