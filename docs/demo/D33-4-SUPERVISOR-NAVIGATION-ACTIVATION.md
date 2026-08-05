# D33-4 — Supervisor Navigation Activation

**Stage:** D33-4

**Mode:** Live navigation activation

**D33-3 commit:** `2b71a13fa2caabd1a625c66e0715e929cdac84f3`

**Implementation baseline:** `2b71a13fa2caabd1a625c66e0715e929cdac84f3`

**Branch:** `demo/d33-supervisor-navigation-consolidation`

## Purpose

D33-4 activates the approved Supervisor Demo/V1 navigation in the live shared
sidebar.

The live supervisor navigation now consumes:

`SUPERVISOR_NAVIGATION_CONTRACT`

from:

`features/demo-engine/navigation/supervisor-navigation-contract.ts`

The previous hard-coded supervisor navigation has been removed from
`components/demo/internal-shell/internal-navigation.ts`.

## Activated navigation

### Operations

1. Department Dashboard
2. Department Queue
3. Unassigned Work
4. Team Workload

### Workflow

5. Approval Queue
6. Escalations
7. Department Handoffs
8. Shared Work

### Performance

9. SLA Monitor
10. Overdue Work
11. Officer Performance
12. Department Reports

### Oversight

13. Audit Trail

### Account

14. Log Out

This is exactly thirteen supervisor-owned routes and one action.

## Route ownership

Every route item points beneath `/demo/supervisor/**`.

The activated navigation contains no:

- officer destinations;
- department destinations;
- reports-workspace destinations;
- outcomes destinations;
- applicant or public page destinations;
- hash-only page substitutes;
- query-string page substitutes;
- hard-coded request IDs.

Log Out remains an action and carries no route href in the contract.

## Active-state behaviour

The live navigation receives active-state metadata directly from the contract.

- Department Dashboard uses exact matching at `/demo/supervisor`.
- Each canonical route activates on its own href.
- `/demo/supervisor/approvals` activates Approval Queue as a legacy alias.
- `/demo/supervisor/approvals/**` activates Approval Queue as a legacy
  descendant prefix.
- Log Out is never treated as an active route.
- Cross-workspace paths cannot activate a supervisor item.

## Desktop and mobile parity

Desktop and mobile continue to use the same `InternalSidebar` instance and the
same call to:

`getInternalNavigation(role)`

The mobile drawer does not maintain a separate navigation definition.

Therefore both modes receive the same:

- groups;
- order;
- labels;
- icons;
- route hrefs;
- active-state rules;
- Log Out action.

## Visual preservation

D33-4 does not modify:

- `internal-shell.module.css`;
- sidebar width;
- collapsed width;
- navigation item height;
- icons or icon sizing;
- typography;
- colours;
- borders;
- spacing;
- hover states;
- active-state styling;
- badges;
- mobile drawer behaviour;
- brand presentation;
- help card;
- top bar;
- role switcher.

The existing visual shell renders the new contract without redesign.

## Files changed

- `components/demo/internal-shell/internal-navigation.ts`
- `tests/demo/unit/supervisor-navigation-activation.test.ts`
- `docs/demo/D33-4-SUPERVISOR-NAVIGATION-ACTIVATION.md`

## Files deliberately unchanged

- `components/demo/internal-shell/internal-sidebar.tsx`
- `components/demo/internal-shell/internal-topbar.tsx`
- `components/demo/internal-shell/internal-app-shell.tsx`
- `components/demo/internal-shell/internal-shell.module.css`
- `app/demo/supervisor/layout.tsx`
- all supervisor page bodies
- supervisor route contract
- officer navigation contract
- role switcher
- dashboard links and fixtures
- officer, department, applicant, admin, reports, outcomes, and public shells
- business logic
- global styling and design tokens
- package files
- backend and production integrations

## Acceptance checks

- [x] The live supervisor sidebar consumes the canonical contract.
- [x] Five groups appear in the approved order.
- [x] Fourteen visible items appear in the approved order.
- [x] Thirteen items are routes.
- [x] One item is the Log Out action.
- [x] Every route remains beneath `/demo/supervisor/**`.
- [x] No activated item uses a hash or query string.
- [x] No activated item points to another workspace.
- [x] Existing icon assignments are preserved.
- [x] Exact matching is preserved.
- [x] Legacy approval alias matching is preserved.
- [x] Legacy approval descendant matching is preserved.
- [x] Desktop and mobile use the same navigation source.
- [x] Sidebar and top-bar visuals remain unchanged.
- [x] Focused activation tests pass.
- [x] D33 contract tests pass.
- [x] Type checking passes.
- [x] Focused linting passes.
- [x] The production build passes.
- [x] No pull request is created.

## D33-5 handoff

D33-5 may now consolidate supervisor-originating links outside the sidebar.

D33-5 must inspect and correct:

1. supervisor dashboard cards and shortcuts;
2. queue and table row actions;
3. approval links;
4. SLA links;
5. audit links;
6. department handoff links;
7. report links;
8. breadcrumbs;
9. notifications;
10. adapter-provided and fixture-provided hrefs;
11. role-switch destinations;
12. the supervisor sidebar brand destination.

Every ordinary supervisor workflow link should remain within the canonical
supervisor namespace unless it is an explicit role switch, public outcome, or
logout action.

D33-5 must preserve the D33-4 navigation contract and visual shell.

D33-4 stops after activating and validating the live supervisor navigation.
