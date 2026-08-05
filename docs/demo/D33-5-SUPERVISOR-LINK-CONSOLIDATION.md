# D33-5 — Supervisor Link Consolidation

**Stage:** D33-5

**Mode:** Supervisor-originating link consolidation

**D33-4 commit:** `28e8f97da0f30fb01dec4493378b6a314f78c601`

**Implementation baseline:** `28e8f97da0f30fb01dec4493378b6a314f78c601`

**Branch:** `demo/d33-supervisor-navigation-consolidation`

## Purpose

D33-5 removes ordinary supervisor workflow links that leave the supervisor
workspace after the D33-4 sidebar has already been consolidated.

The supervisor sidebar was no longer the only source of route leakage. The
active dashboard adapter, legacy supervisor fixture, sidebar brand link, and
role-switch route ownership still contained hard-coded or cross-workspace
destinations.

D33-5 makes those sources consume the canonical supervisor route contract.

## Dashboard link corrections

The active supervisor dashboard adapter now uses canonical supervisor routes
for:

- Department Queue;
- Unassigned Work;
- Department Handoffs;
- Escalations;
- SLA Monitor;
- Department Reports;
- Audit Trail;
- Department Dashboard.

Links that previously opened officer request pages, officer document pages, or
the separate reports workspace now remain beneath `/demo/supervisor/**`.

Legacy supervisor approval-detail links remain beneath:

`/demo/supervisor/approvals/[requestId]`

Those links are intentionally retained because they are supervisor-owned
detail routes and Approval Queue already owns their active state.

## Fixture link corrections

The supervisor approvals reference fixture now uses canonical supervisor routes
instead of:

- hash-only dashboard fragments;
- `/demo/department`;
- `/demo/officer`;
- `/demo/reports`.

The fixture remains available for legacy supervisor components and demo
references without reintroducing shell changes.

## Sidebar brand destination

The supervisor sidebar brand now returns to:

`/demo/supervisor`

through `SUPERVISOR_ROUTE_HREFS.home`.

Officer brand behaviour remains unchanged. Other workspace brand behaviour
remains unchanged.

## Role-switch destination

`ROLE_HOME.SUPERVISOR` now consumes `SUPERVISOR_ROUTE_HREFS.home`.

Supervisor pathname recognition now consumes `isSupervisorRoutePath()` rather
than duplicating the `/demo/supervisor` prefix logic.

Explicit role switching remains allowed to cross workspaces. D33-5 only
consolidates the supervisor destination and ordinary supervisor workflow links.

## Files changed

- `features/demo-engine/dashboards/data/supervisor-dashboard.adapter.ts`
- `features/demo-engine/fixtures/supervisor-approvals.reference.ts`
- `components/demo/internal-shell/internal-sidebar.tsx`
- `features/demo/roles/demo-workspace-role.tsx`
- `tests/demo/unit/supervisor-link-consolidation.test.ts`
- `docs/demo/D33-5-SUPERVISOR-LINK-CONSOLIDATION.md`

## Files deliberately unchanged

- `features/demo-engine/navigation/supervisor-navigation-contract.ts`
- `components/demo/internal-shell/internal-navigation.ts`
- `components/demo/internal-shell/internal-topbar.tsx`
- `components/demo/internal-shell/internal-app-shell.tsx`
- `components/demo/internal-shell/internal-shell.module.css`
- `app/demo/supervisor/layout.tsx`
- all canonical supervisor page bodies
- officer navigation and route ownership
- department navigation and route ownership
- applicant and admin navigation
- business logic
- global styling and design tokens
- package files
- backend and production integrations

## Acceptance checks

- [x] Active supervisor dashboard links remain in the supervisor namespace.
- [x] Supervisor fixture links remain in the supervisor namespace.
- [x] No active supervisor dashboard link points to Officer.
- [x] No active supervisor dashboard link points to Department.
- [x] No active supervisor dashboard link points to Reports.
- [x] No active supervisor dashboard link points to Outcomes.
- [x] No supervisor fixture item uses a hash-only page substitute.
- [x] Approval detail links remain supervisor-owned.
- [x] The supervisor sidebar brand opens Department Dashboard.
- [x] Role switching opens canonical supervisor home.
- [x] Supervisor route detection uses the shared route helper.
- [x] The D33-4 sidebar contract remains active.
- [x] Shell visuals and CSS remain unchanged.
- [x] Focused link-consolidation tests pass.
- [x] D33-1 through D33-4 tests remain passing.
- [x] Type checking passes.
- [x] Focused linting passes.
- [x] The production build passes.
- [x] No pull request is created.

## D33-6 handoff

D33-6 may now perform final supervisor navigation and shell verification.

D33-6 must verify:

1. all thirteen canonical routes load;
2. direct refresh retains the supervisor shell;
3. desktop and mobile use the same five groups and fourteen items;
4. exactly one sidebar and one top bar render;
5. every canonical route activates the correct item;
6. legacy approval-detail routes activate Approval Queue;
7. dashboard, fixture, brand, and role-switch links preserve intended ownership;
8. no ordinary supervisor click enters Officer, Department, Reports, Outcomes,
   Applicant, Admin, or public shells;
9. Log Out remains an action;
10. typecheck, lint, production build, and browser acceptance pass;
11. the working tree is clean;
12. verification evidence is recorded for D33-7 freeze.

D33-5 stops after consolidating and validating supervisor-originating links.
