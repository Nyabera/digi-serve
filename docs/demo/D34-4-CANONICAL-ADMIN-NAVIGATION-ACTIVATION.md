# D34-4 — Canonical Admin Navigation Activation

## Status

**COMPLETE — IMPLEMENTED WITH D34-3**

D34-4 activates the exact D34-1 navigation contract in the existing admin sidebar.

## Source of truth

Navigation labels, section order, and normal route hrefs come from:

`features/demo-engine/navigation/admin-navigation-contract.ts`

The visible admin sidebar no longer maintains a separate hand-written route inventory.

## Activated sections

1. OVERVIEW
2. SERVICES
3. WORKFLOWS
4. PEOPLE & ACCESS
5. OPERATIONS
6. DOCUMENTS
7. REPORTS
8. ORGANIZATION
9. ACCOUNT

## Activated destinations

All 21 normal destinations remain beneath:

`/demo/admin/**`

Log Out remains the existing demo exit action and routes to `/demo`.

## Existing icon preservation

D34-4 maps the new semantic icon slots to the Lucide components already imported and used by the internal shell.

No icon library, icon sizing, icon CSS, or navigation markup was replaced.

## Active-route behavior

Admin active state now uses:

`findActiveAdminNavigationItem(pathname)`

from the D34-1 contract.

This provides:

- exact matching for `/demo/admin`;
- prefix matching for nested routes;
- longest-href precedence;
- exactly one active canonical admin item.

Example:

`/demo/admin/services/builder`

activates **Service Builder**, not **Service Catalogue**.

## Files changed

- `components/demo/internal-shell/internal-navigation.ts`
- `components/demo/internal-shell/internal-sidebar.tsx`
- `docs/demo/D34-3-ADMIN-WORKSPACE-SHELL-CONSOLIDATION.md`
- `docs/demo/D34-4-CANONICAL-ADMIN-NAVIGATION-ACTIVATION.md`
- `scripts/demo/verify-d34-3-4-admin-shell-navigation.sh`

## Files not changed

- admin layout;
- admin dashboard body;
- admin route pages;
- top-bar component;
- shell CSS;
- global CSS;
- Tailwind configuration;
- role switcher;
- officer navigation;
- supervisor navigation;
- applicant navigation;
- department navigation;
- public navigation.

## Browser acceptance test

Start the local server and verify:

1. Open `/demo/admin`.
2. Click every visible normal admin item.
3. Confirm every resulting URL begins with `/demo/admin`.
4. Confirm the admin sidebar remains unchanged.
5. Confirm the admin top bar remains unchanged.
6. Confirm the role remains Organization Admin.
7. Confirm exactly one item is active.
8. Refresh every destination.
9. Use Back and Forward.
10. Test collapsed desktop navigation.
11. Test mobile drawer navigation.
12. Confirm Log Out is the only item that deliberately leaves the admin workspace.

Do not commit until this browser test passes.

## Browser acceptance record

<!-- D34_BROWSER_ACCEPTANCE_PASS -->

| Field | Result |
|---|---|
| Stage | D34-4 |
| Status | **PASS** |
| Recorded | `2026-08-05 14:50:06 EAT` |
| Direct canonical routes | Loaded successfully |
| Sidebar persistence | Passed |
| Top-bar persistence | Passed |
| Admin role persistence | Passed |
| Refresh, Back, and Forward | Passed |
| Workspace switching on normal items | Not detected |
| Deliberate workspace exit | Log Out only |
