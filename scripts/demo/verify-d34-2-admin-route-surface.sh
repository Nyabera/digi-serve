#!/usr/bin/env bash
#
# Verify D34-2 canonical admin route surface.
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

ROOT="$(git rev-parse --show-toplevel 2>/dev/null)" \
  || fail "Run this inside the repository."
cd "$ROOT" || fail "Could not enter repository root."

CONTRACT="features/demo-engine/navigation/admin-navigation-contract.ts"
LAYOUT="app/demo/admin/layout.tsx"
SHARED="components/demo/admin/admin-route-surface.tsx"

[ -f "$CONTRACT" ] || fail "D34-1 contract is missing."
[ -f "$LAYOUT" ] || fail "Admin layout is missing."
[ -f "$SHARED" ] || fail "D34-2 shared route component is missing."

TMP_DIR="$(mktemp -d "${TMPDIR:-/tmp}/verify-d34-2.XXXXXX")" \
  || fail "Could not create temporary directory."
trap 'rm -rf "$TMP_DIR"' EXIT INT TERM

ROUTES="$TMP_DIR/routes.txt"
MISSING="$TMP_DIR/missing.txt"
CROSS="$TMP_DIR/cross.txt"
SHELLS="$TMP_DIR/shells.txt"
REDIRECTS="$TMP_DIR/redirects.txt"

grep -E '^[[:space:]]+[A-Za-z][A-Za-z0-9]*: "/demo/admin' "$CONTRACT" \
  | sed -E 's/^[^"]*"([^"]+)".*$/\1/' \
  | LC_ALL=C sort -u > "$ROUTES"

COUNT="$(wc -l < "$ROUTES" | tr -d ' ')"
[ "$COUNT" -eq 21 ] || fail "Expected 21 routes; found $COUNT."

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
  [ -n "$route" ] || continue
  page="$(route_to_page "$route")"

  if [ ! -f "$page" ]; then
    printf '%s -> %s\n' "$route" "$page" >> "$MISSING"
  fi
done < "$ROUTES"

if [ -s "$MISSING" ]; then
  cat "$MISSING" >&2
  fail "One or more canonical admin pages are missing."
fi

find app/demo/admin -type f \
  \( -name 'page.tsx' -o -name 'page.ts' -o -name 'page.jsx' -o -name 'page.js' \) \
  -exec grep -nHE '/demo/(officer|supervisor|department|applicant|public)' {} + \
  > "$CROSS" 2>/dev/null || true

[ ! -s "$CROSS" ] || {
  cat "$CROSS" >&2
  fail "Canonical admin pages contain cross-workspace route references."
}

find app/demo/admin -type f \
  \( -name 'page.tsx' -o -name 'page.ts' -o -name 'page.jsx' -o -name 'page.js' \) \
  ! -path 'app/demo/admin/page.tsx' \
  ! -path 'app/demo/admin/workflows/page.tsx' \
  ! -path 'app/demo/admin/workflows/builder/page.tsx' \
  -exec grep -nHE '(WorkspaceShell|InternalAppShell|RoleWorkspaceShell|Sidebar|TopBar|Topbar)' {} + \
  > "$SHELLS" 2>/dev/null || true

[ ! -s "$SHELLS" ] || {
  cat "$SHELLS" >&2
  fail "A D34-2 page appears to render or import a nested shell."
}

find app/demo/admin -type f \
  \( -name 'page.tsx' -o -name 'page.ts' -o -name 'page.jsx' -o -name 'page.js' \) \
  ! -path 'app/demo/admin/workflows/builder/page.tsx' \
  -exec grep -nHE '(redirect|permanentRedirect)[[:space:]]*\(' {} + \
  > "$REDIRECTS" 2>/dev/null || true

[ ! -s "$REDIRECTS" ] || {
  cat "$REDIRECTS" >&2
  fail "A canonical admin page redirects instead of rendering inside the admin layout."
}

grep -q 'AdminWorkspaceShell' "$LAYOUT" \
  || fail "Admin layout no longer owns AdminWorkspaceShell."

grep -q 'D34-2 canonical admin route surface' "$SHARED" \
  || fail "Shared route component does not contain the D34-2 marker."

printf 'PASS: All 21 canonical admin routes have App Router pages.\n'
printf 'PASS: Pages remain beneath app/demo/admin/**.\n'
printf 'PASS: No canonical page redirects to another workspace.\n'
printf 'PASS: No D34-2 page renders a nested shell.\n'
printf 'PASS: Existing admin layout remains the shell owner.\n'
