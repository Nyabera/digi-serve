# D34-2 — Canonical Admin Route Surface

## Status

**COMPLETE — ROUTE SURFACE ONLY**

D34-2 ensures that every canonical admin destination defined by D34-1 has a functional App Router page beneath `app/demo/admin/**`.

This stage does not activate the new visible navigation.

## Baseline

| Field | Value |
|---|---|
| Branch | `demo/d34-admin-navigation-consolidation` |
| D34-2 baseline commit | `f0f9703ae18eebbdd86ef2e1fd62f7f46d75033f` |
| Short baseline | `f0f9703` |
| Generated locally | `2026-08-05 14:22:41 EAT` |
| Generated UTC | `2026-08-05T11:22:41Z` |
| D34-0 prerequisite | `docs/demo/D34-0-ADMIN-WORKSPACE-SHELL-AUDIT.md` |
| D34-1 route contract | `features/demo-engine/navigation/admin-navigation-contract.ts` |

## Outcome

The canonical admin surface now contains:

- **21 canonical route destinations**
- **21 corresponding App Router page files**
- **19 new bounded page surfaces**
- **2 preserved canonical pages**
- one shared page-content component;
- one verification script.

The preserved canonical pages are:

- `/demo/admin`
- `/demo/admin/workflows`

The existing legacy route `/demo/admin/workflows/builder` remains unchanged. D34-6 will decide whether it becomes a redirect or compatibility alias.

## Route inventory

| Canonical route | Page file | Status |
|---|---|---|
| `/demo/admin` | `app/demo/admin/page.tsx` | Present |
| `/demo/admin/applications` | `app/demo/admin/applications/page.tsx` | Present |
| `/demo/admin/approval-rules` | `app/demo/admin/approval-rules/page.tsx` | Present |
| `/demo/admin/assignment-rules` | `app/demo/admin/assignment-rules/page.tsx` | Present |
| `/demo/admin/audit-trail` | `app/demo/admin/audit-trail/page.tsx` | Present |
| `/demo/admin/branding` | `app/demo/admin/branding/page.tsx` | Present |
| `/demo/admin/departments` | `app/demo/admin/departments/page.tsx` | Present |
| `/demo/admin/document-templates` | `app/demo/admin/document-templates/page.tsx` | Present |
| `/demo/admin/forms-requirements` | `app/demo/admin/forms-requirements/page.tsx` | Present |
| `/demo/admin/institution-profile` | `app/demo/admin/institution-profile/page.tsx` | Present |
| `/demo/admin/issued-documents` | `app/demo/admin/issued-documents/page.tsx` | Present |
| `/demo/admin/portal-settings` | `app/demo/admin/portal-settings/page.tsx` | Present |
| `/demo/admin/qr-verification` | `app/demo/admin/qr-verification/page.tsx` | Present |
| `/demo/admin/reports` | `app/demo/admin/reports/page.tsx` | Present |
| `/demo/admin/roles-permissions` | `app/demo/admin/roles-permissions/page.tsx` | Present |
| `/demo/admin/services` | `app/demo/admin/services/page.tsx` | Present |
| `/demo/admin/services/builder` | `app/demo/admin/services/builder/page.tsx` | Present |
| `/demo/admin/sla-rules` | `app/demo/admin/sla-rules/page.tsx` | Present |
| `/demo/admin/unassigned-work` | `app/demo/admin/unassigned-work/page.tsx` | Present |
| `/demo/admin/users` | `app/demo/admin/users/page.tsx` | Present |
| `/demo/admin/workflows` | `app/demo/admin/workflows/page.tsx` | Present |

## Shared content component

D34-2 adds:

`components/demo/admin/admin-route-surface.tsx`

This component renders page content only. It does not own:

- the sidebar;
- the top bar;
- workspace identity;
- role selection;
- organization identity;
- mobile navigation;
- active-navigation state.

Those remain inherited through:

`app/demo/admin/layout.tsx`

## Functional scope

Each new page provides:

- a clear page title;
- an admin section label;
- a route-specific description;
- three route-specific operational capabilities;
- the canonical route reference;
- an explicit route-surface status.

These surfaces are intentionally bounded. Full service configuration, access management, reporting, document management, and organization-setting behavior belong to later implementation stages.

## Files intentionally not changed

D34-2 does not change:

- `app/demo/admin/layout.tsx`;
- `app/demo/admin/page.tsx`;
- `app/demo/admin/workflows/page.tsx`;
- `app/demo/admin/workflows/builder/page.tsx`;
- visible admin navigation definitions;
- sidebar components;
- top-bar components;
- mobile navigation;
- role-switch components;
- route-registry behavior;
- global CSS;
- Tailwind configuration;
- officer routes;
- supervisor routes;
- applicant routes;
- department routes;
- public routes.

## Verification

Run:

```bash
bash scripts/demo/verify-d34-2-admin-route-surface.sh
```

The verifier requires:

1. exactly 21 canonical hrefs in D34-1;
2. a page file for every href;
3. every canonical page beneath `app/demo/admin/**`;
4. no cross-workspace hrefs in canonical admin pages;
5. no canonical redirect away from the admin workspace;
6. no nested shell imports in D34-2 pages;
7. the existing admin layout to remain the shell owner.

## D34-2 acceptance criteria

D34-2 passes when:

1. all 21 canonical destinations have App Router pages;
2. all pages inherit `app/demo/admin/layout.tsx`;
3. direct route entry does not return a 404;
4. no new page renders a sidebar or top bar;
5. no new page redirects to another workspace;
6. the existing admin dashboard remains unchanged;
7. the existing workflow overview remains unchanged;
8. the visible sidebar remains unchanged;
9. type checking passes;
10. lint completes without errors;
11. the D34-2 verifier passes.

## D34-3 handoff

D34-3 must consolidate and confirm one persistent admin shell.

Do not begin D34-3 until all 21 canonical routes load directly in the browser without a 404 or workspace-role change.

## Browser acceptance record

<!-- D34_BROWSER_ACCEPTANCE_PASS -->

| Field | Result |
|---|---|
| Stage | D34-2 |
| Status | **PASS** |
| Recorded | `2026-08-05 14:50:06 EAT` |
| Direct canonical routes | Loaded successfully |
| Sidebar persistence | Passed |
| Top-bar persistence | Passed |
| Admin role persistence | Passed |
| Refresh, Back, and Forward | Passed |
| Workspace switching on normal items | Not detected |
| Deliberate workspace exit | Log Out only |
