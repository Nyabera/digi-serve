# D33-2 — Canonical Supervisor Route Surface

**Stage:** D33-2

**Mode:** Route surface only

**D33-1 baseline:** `a9614486c6b8d533bacf7fa9645bf6a1701cd8a9`

**Implementation baseline:** `a9614486c6b8d533bacf7fa9645bf6a1701cd8a9`

**Branch:** `demo/d33-supervisor-navigation-consolidation`

## Purpose

D33-2 ensures that every canonical route declared by
`SUPERVISOR_ROUTE_HREFS` has a functional App Router page beneath
`app/demo/supervisor/**`.

This stage creates the route surface before the visible supervisor sidebar is
activated. All canonical pages inherit the existing supervisor layout and
therefore remain beneath one shared operational sidebar and top bar.

D33-2 does not change:

- the live supervisor navigation;
- the supervisor layout;
- the top bar;
- the role switcher;
- active-navigation behaviour;
- the legacy approval-detail route;
- officer, department, applicant, admin, reports, outcomes, or public shells;
- global styling or design tokens.

## Canonical route inventory

| Route key            | Canonical href                         | Page status            | Page body                       |
| -------------------- | -------------------------------------- | ---------------------- | ------------------------------- |
| `home`               | `/demo/supervisor`                     | Existing and preserved | Supervisor dashboard            |
| `departmentQueue`    | `/demo/supervisor/department-queue`    | Created                | Shared supervisor route surface |
| `unassignedWork`     | `/demo/supervisor/unassigned-work`     | Created                | Shared supervisor route surface |
| `teamWorkload`       | `/demo/supervisor/team-workload`       | Created                | Shared supervisor route surface |
| `approvalQueue`      | `/demo/supervisor/approval-queue`      | Created                | Shared supervisor route surface |
| `escalations`        | `/demo/supervisor/escalations`         | Created                | Shared supervisor route surface |
| `departmentHandoffs` | `/demo/supervisor/department-handoffs` | Created                | Shared supervisor route surface |
| `sharedWork`         | `/demo/supervisor/shared-work`         | Created                | Shared supervisor route surface |
| `slaMonitor`         | `/demo/supervisor/sla-monitor`         | Existing and preserved | Supervisor SLA workspace        |
| `overdueWork`        | `/demo/supervisor/overdue-work`        | Created                | Shared supervisor route surface |
| `officerPerformance` | `/demo/supervisor/officer-performance` | Created                | Shared supervisor route surface |
| `departmentReports`  | `/demo/supervisor/department-reports`  | Created                | Shared supervisor route surface |
| `auditTrail`         | `/demo/supervisor/audit-trail`         | Existing and preserved | Supervisor audit workspace      |

## Existing routes preserved

D33-2 does not rewrite:

- `app/demo/supervisor/page.tsx`
- `app/demo/supervisor/sla-monitor/page.tsx`
- `app/demo/supervisor/audit-trail/page.tsx`
- `app/demo/supervisor/approvals/[requestId]/page.tsx`
- `app/demo/supervisor/layout.tsx`

The existing `/demo/supervisor/approvals/[requestId]` route remains available
for compatibility. It is not treated as an additional canonical sidebar
destination.

## Shared body-only component

The ten new routes consume:

`features/demo-operations/components/supervisor-route-surface.tsx`

The component provides realistic seeded supervisor content for route-surface
verification:

- operational metrics;
- route-specific work records;
- statuses and ownership;
- a supervisor interpretation;
- an explicit route-ownership marker.

It imports the existing operational CSS module to preserve the current visual
language. It does not mount a sidebar, top bar, role switcher, workspace shell,
or nested layout.

## Shell ownership

All thirteen canonical destinations remain beneath:

`app/demo/supervisor/layout.tsx`

The layout continues to render the shared `OperationalWorkspaceShell` with the
`supervisor` role. Every page created in D33-2 is body-only.

D33-3 will perform the dedicated shell-ownership consolidation and verification.
D33-2 does not pre-empt that work.

## Files changed

- `features/demo-operations/components/supervisor-route-surface.tsx`
- ten new canonical supervisor `page.tsx` files
- `tests/demo/unit/supervisor-route-surface.test.ts`
- `docs/demo/D33-2-SUPERVISOR-ROUTE-SURFACE.md`

## Acceptance checks

- [x] All thirteen canonical route keys are represented.
- [x] All thirteen canonical hrefs map to App Router pages.
- [x] All canonical pages remain beneath `app/demo/supervisor/**`.
- [x] The existing dashboard page is preserved.
- [x] The existing SLA Monitor page is preserved.
- [x] The existing Audit Trail page is preserved.
- [x] Ten missing route pages are created.
- [x] Every new page consumes the canonical route constants.
- [x] Every new page is body-only.
- [x] No new page mounts a sidebar or top bar.
- [x] The supervisor layout remains unchanged.
- [x] The visible navigation remains unchanged.
- [x] The role switcher remains unchanged.
- [x] The legacy approval-detail route remains available.
- [x] No cross-workspace canonical route is introduced.
- [x] Focused route-surface tests pass.
- [x] Type checking passes.
- [x] Focused linting passes.
- [x] The production build passes.
- [x] No pull request is created.

## D33-3 handoff

D33-3 may now consolidate and verify exclusive supervisor shell ownership.

Before D33-4 activates the new sidebar, D33-3 must confirm that:

1. `app/demo/supervisor/layout.tsx` is the only full supervisor shell owner;
2. all thirteen canonical pages render body content only;
3. no canonical page mounts a second sidebar or top bar;
4. direct refresh preserves the supervisor layout;
5. legacy approval-detail routes do not create nested shell ownership;
6. desktop and mobile shell components derive from the same supervisor role;
7. officer, department, applicant, admin, reports, outcomes, and public shells
   remain protected.

D33-2 stops after creating and validating the canonical route surface.
