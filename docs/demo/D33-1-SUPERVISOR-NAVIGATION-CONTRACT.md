# D33-1 — Supervisor Navigation Contract

**Stage:** D33-1

**Mode:** Contract only

**Baseline:** D33-0 at `6dfd90338b529ec1b9ef46f83efd5742333cea91`

**Implementation baseline:** `6dfd90338b529ec1b9ef46f83efd5742333cea91`

**Branch:** `demo/d33-supervisor-navigation-consolidation`

## Purpose

D33-1 establishes one authoritative, typed supervisor navigation and route
contract before missing supervisor pages are created or the visible sidebar
consumes the new structure.

The contract locks:

- five groups in the approved order;
- fourteen visible items;
- thirteen supervisor-owned route destinations;
- one Log Out action;
- labels and stable IDs;
- canonical route keys and hrefs;
- Lucide icon assignments;
- active-state metadata;
- the existing approvals route as a legacy alias;
- route-registry consumption of the same canonical constants.

The source of truth is:

`features/demo-engine/navigation/supervisor-navigation-contract.ts`

D33-1 does not activate the new navigation and does not change the supervisor
sidebar, top bar, role switcher, page tree, layouts, page bodies, typography,
spacing, colours, or shell visuals.

## Canonical navigation

| Order | Group       | Group ID      | Item                 | Stable item ID         | Kind   |
| ----: | ----------- | ------------- | -------------------- | ---------------------- | ------ |
|     1 | Operations  | `operations`  | Department Dashboard | `department-dashboard` | Route  |
|     2 | Operations  | `operations`  | Department Queue     | `department-queue`     | Route  |
|     3 | Operations  | `operations`  | Unassigned Work      | `unassigned-work`      | Route  |
|     4 | Operations  | `operations`  | Team Workload        | `team-workload`        | Route  |
|     5 | Workflow    | `workflow`    | Approval Queue       | `approval-queue`       | Route  |
|     6 | Workflow    | `workflow`    | Escalations          | `escalations`          | Route  |
|     7 | Workflow    | `workflow`    | Department Handoffs  | `department-handoffs`  | Route  |
|     8 | Workflow    | `workflow`    | Shared Work          | `shared-work`          | Route  |
|     9 | Performance | `performance` | SLA Monitor          | `sla-monitor`          | Route  |
|    10 | Performance | `performance` | Overdue Work         | `overdue-work`         | Route  |
|    11 | Performance | `performance` | Officer Performance  | `officer-performance`  | Route  |
|    12 | Performance | `performance` | Department Reports   | `department-reports`   | Route  |
|    13 | Oversight   | `oversight`   | Audit Trail          | `audit-trail`          | Route  |
|    14 | Account     | `account`     | Log Out              | `log-out`              | Action |

## Canonical route table

| Route key            | Item                 | Canonical href                         |
| -------------------- | -------------------- | -------------------------------------- |
| `home`               | Department Dashboard | `/demo/supervisor`                     |
| `departmentQueue`    | Department Queue     | `/demo/supervisor/department-queue`    |
| `unassignedWork`     | Unassigned Work      | `/demo/supervisor/unassigned-work`     |
| `teamWorkload`       | Team Workload        | `/demo/supervisor/team-workload`       |
| `approvalQueue`      | Approval Queue       | `/demo/supervisor/approval-queue`      |
| `escalations`        | Escalations          | `/demo/supervisor/escalations`         |
| `departmentHandoffs` | Department Handoffs  | `/demo/supervisor/department-handoffs` |
| `sharedWork`         | Shared Work          | `/demo/supervisor/shared-work`         |
| `slaMonitor`         | SLA Monitor          | `/demo/supervisor/sla-monitor`         |
| `overdueWork`        | Overdue Work         | `/demo/supervisor/overdue-work`        |
| `officerPerformance` | Officer Performance  | `/demo/supervisor/officer-performance` |
| `departmentReports`  | Department Reports   | `/demo/supervisor/department-reports`  |
| `auditTrail`         | Audit Trail          | `/demo/supervisor/audit-trail`         |

Every canonical href:

- remains under `/demo/supervisor`;
- contains no hash;
- contains no query string;
- contains no hard-coded request ID;
- does not point to officer, department, reports, outcomes, public, applicant,
  or admin workspaces.

## Existing approvals compatibility

The existing route `/demo/supervisor/approvals` is recorded as a legacy alias
for `/demo/supervisor/approval-queue`.

D33-1 records compatibility metadata only. It does not create, delete, redirect,
or visually activate either route. Existing descendants beneath
`/demo/supervisor/approvals/**` are assigned to Approval Queue for future
active-state handling.

## Route versus action

Thirteen items have:

- `kind: "route"`;
- one unique route key;
- one unique canonical supervisor href.

Log Out has:

- `kind: "action"`;
- `action: "logout"`;
- no href;
- no route key.

D33-1 does not implement authentication or logout behaviour.

## Icon assignments

All icons remain Lucide React components. Existing matching supervisor
assignments are retained where the current navigation provides one. New
navigation items use icons already present in the shared operational shell
vocabulary.

| Item                 | Lucide symbol     |
| -------------------- | ----------------- |
| Department Dashboard | `LayoutDashboard` |
| Department Queue     | `Building2`       |
| Unassigned Work      | `Inbox`           |
| Team Workload        | `UsersRound`      |
| Approval Queue       | `ShieldCheck`     |
| Escalations          | `Clock3`          |
| Department Handoffs  | `Building2`       |
| Shared Work          | `UsersRound`      |
| SLA Monitor          | `LayoutDashboard` |
| Overdue Work         | `Clock3`          |
| Officer Performance  | `BarChart3`       |
| Department Reports   | `BarChart3`       |
| Audit Trail          | `LayoutDashboard` |
| Log Out              | `LogOut`          |

D33-1 does not change icon sizing, stroke width, colour, spacing, typography, or
navigation-item presentation.

## Active-state ownership

- Department Dashboard uses exact matching for `/demo/supervisor`.
- Every other canonical route self-matches its canonical href.
- Approval Queue records `/demo/supervisor/approvals` as an exact legacy alias.
- Approval Queue records `/demo/supervisor/approvals/**` as a descendant prefix.
- No cross-workspace path can activate a canonical supervisor item.
- Additional descendant ownership may be added only in a later bounded stage
  when the corresponding supervisor route surface exists.

## Route registry

`DEMO_ROUTES.supervisor` consumes `SUPERVISOR_ROUTE_HREFS`.

The historical compatibility keys remain available:

- `DEMO_ROUTES.supervisor.approvals`
- `DEMO_ROUTES.supervisor.audit`
- `DEMO_ROUTES.supervisor.sla`

The canonical route strings are not duplicated in the registry.

## Files changed

- `features/demo-engine/navigation/supervisor-navigation-contract.ts`
- `features/demo-engine/navigation/demo-route-registry.ts`
- `tests/demo/unit/supervisor-navigation-contract.test.ts`
- `docs/demo/D33-1-SUPERVISOR-NAVIGATION-CONTRACT.md`

## Protected files

D33-1 deliberately does not change:

- `components/demo/internal-shell/internal-navigation.ts`
- `components/demo/internal-shell/internal-sidebar.tsx`
- `components/demo/internal-shell/internal-topbar.tsx`
- `components/demo/workspace-shells/**`
- `components/demo/role-switch/**`
- `features/demo/roles/**`
- `app/demo/supervisor/**`
- `app/demo/officer/**`
- `app/demo/department/**`
- applicant, admin, reports, outcomes, and public workspaces
- the officer navigation contract
- dashboard body components
- adapters and fixtures
- CSS and global design tokens
- package files
- authentication and business logic

## Acceptance checklist

- [x] Five groups are defined in the approved order.
- [x] Fourteen visible items are defined in the approved order.
- [x] Thirteen items are canonical supervisor routes.
- [x] One item is the Log Out action.
- [x] Labels, group IDs, item IDs, and route keys are locked.
- [x] IDs, route keys, and canonical hrefs are unique.
- [x] Every canonical route remains under `/demo/supervisor`.
- [x] Canonical routes contain no hashes, queries, or hard-coded request IDs.
- [x] Canonical routes contain no cross-workspace destinations.
- [x] Icons are typed Lucide components.
- [x] Department Dashboard uses exact matching.
- [x] The existing approvals route is recorded as a legacy alias.
- [x] `DEMO_ROUTES.supervisor` consumes the canonical constants.
- [x] Existing compatibility keys remain available.
- [x] The live sidebar remains unchanged.
- [x] No supervisor page or layout is created or modified.
- [x] No visual styling is changed.
- [x] No redirect is introduced.
- [x] No pull request is created.

## D33-2 handoff

D33-2 may create the canonical supervisor route surface beneath
`app/demo/supervisor/**`.

D33-2 must:

1. inventory existing and missing canonical route pages;
2. keep all canonical destinations under the supervisor namespace;
3. ensure every route inherits `app/demo/supervisor/layout.tsx`;
4. reuse page-body components rather than mounting additional shells;
5. preserve the live sidebar and top bar until D33-4;
6. preserve the legacy approvals route without treating it as a fourteenth
   route destination;
7. leave Log Out as an action;
8. avoid changing officer, department, applicant, admin, reports, outcomes, or
   public shells.

D33-1 stops at the contract layer.
