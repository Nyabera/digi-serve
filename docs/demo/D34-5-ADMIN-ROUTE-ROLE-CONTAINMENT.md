# D34-5 — Admin Route Registry and Role Containment

## Status

**COMPLETE — ROUTE REGISTRY AND ROLE CONTAINMENT**

D34-5 connects the canonical D34-1 admin route contract to the shared demo route registry and adds focused acceptance coverage for admin role retention.

## Baseline

| Field | Value |
|---|---|
| Branch | `demo/d34-admin-navigation-consolidation` |
| Baseline commit | `b1c76432f6d6201f037d75b9f677ef50c9680454` |
| Short baseline | `b1c7643` |
| Generated locally | `2026-08-05 14:58:52 EAT` |
| Generated UTC | `2026-08-05T11:58:52Z` |

## Problem resolved

Before D34-5, the visible admin navigation used the D34-1 contract, but the shared demo route registry still maintained a separate three-entry admin route object.

That allowed route-definition drift between:

- canonical admin navigation;
- role-switch destinations;
- route IDs used by older demo checks;
- shared role resolution.

D34-5 removes that duplication for normal admin destinations.

## Registry integration

The shared registry now imports:

`ADMIN_ROUTE_HREFS`

from:

`features/demo-engine/navigation/admin-navigation-contract.ts`

The admin registry exposes:

- all 21 canonical D34 routes;
- `home` as a compatibility alias for the canonical dashboard;
- `workflows` as a compatibility alias for the canonical Workflow Builder destination;
- one explicit legacy workflow-builder URL reserved for D34-6.

## Role-retention contract

Every canonical D34 route must resolve to:

`admin`

This includes:

- exact routes;
- trailing-slash variants;
- routes with query strings;
- routes with fragments;
- descendant routes used by nested admin screens.

Routes beneath officer, supervisor, department, applicant, public, and external reports workspaces must not resolve to admin.

## Active-route coverage

Focused tests confirm:

- the dashboard is exact-match only;
- nested routes use prefix matching;
- the longest canonical href wins;
- Service Builder wins over Service Catalogue at `/demo/admin/services/builder`.

## Cross-workspace containment

The D34-5 verifier rejects:

- canonical admin page links to another workspace;
- canonical admin page re-exports from another workspace;
- direct cross-workspace navigation in admin-specific feature code.

Log Out remains the only deliberate visible exit from the admin workspace.

## Legacy route boundary

The old route:

`/demo/admin/workflows/builder`

remains admin-owned but is not canonical.

D34-6 must decide whether it becomes:

1. a redirect to a canonical admin destination; or
2. a compatibility page rendered through the same admin layout.

D34-5 does not make that decision.

## Files changed

- `features/demo-engine/navigation/demo-route-registry.ts`
- `tests/demo/unit/d34-admin-route-containment.test.ts`
- `scripts/demo/verify-d34-5-admin-route-containment.sh`
- `docs/demo/D34-5-ADMIN-ROUTE-ROLE-CONTAINMENT.md`

## Files intentionally not changed

- admin layout;
- admin shell;
- sidebar markup;
- top-bar markup;
- navigation styling;
- role switcher UI;
- canonical admin pages;
- officer navigation;
- supervisor navigation;
- department navigation;
- applicant navigation;
- public navigation;
- global CSS;
- Tailwind configuration.

## Verification

Run:

```bash
bash scripts/demo/verify-d34-5-admin-route-containment.sh
npx vitest run tests/demo/unit/d34-admin-route-containment.test.ts
npm run typecheck
npm run lint
```

## D34-5 acceptance criteria

1. D34-2, D34-3, and D34-4 are committed.
2. The route registry imports the D34-1 contract.
3. All 21 canonical admin routes are exposed by the shared registry.
4. The admin home route equals `/demo/admin`.
5. Every canonical admin route resolves to the admin role.
6. Prohibited workspace routes do not resolve to admin.
7. Active-route matching retains exact-dashboard and longest-match behavior.
8. Canonical admin pages contain no cross-workspace navigation.
9. Canonical admin pages do not re-export another workspace page.
10. Admin-specific feature navigation remains admin-owned.
11. Type checking passes.
12. Lint completes without errors.
13. The focused D34-5 test passes.

## D34-6 handoff

D34-6 must remediate the legacy admin route:

`/demo/admin/workflows/builder`

Do not begin D34-6 until the D34-5 verifier and focused test pass.
