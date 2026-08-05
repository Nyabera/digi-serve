# D33-7 — Supervisor Navigation Freeze

**Stage:** D33-7

**Status:** FROZEN

**Repository:** `Nyabera/digi-serve`

**Branch:** `demo/d33-supervisor-navigation-consolidation`

**Frozen implementation commit:** `29ed777de3e1386a85a0032756167b7c4b32cfae`

**D33-6 verified commit:** `29ed777de3e1386a85a0032756167b7c4b32cfae`

**Freeze recorded at:** `2026-08-05 13:28:41 +0300`

**Verification command:**

```bash
bash scripts/verify-d33-supervisor-navigation.sh
```

**Verification result:** PASS

## 1. Freeze purpose

D33-7 freezes the completed Supervisor Demo/V1 navigation consolidation.

The frozen workspace has:

- one supervisor route namespace;
- one supervisor layout owner;
- one shared sidebar and top bar;
- five navigation groups;
- fourteen visible navigation items;
- thirteen canonical route destinations;
- one Log Out action;
- identical desktop and mobile navigation inventory;
- supervisor-owned dashboard, fixture, brand, and role-switch destinations;
- passing unit, type, lint, build, desktop, mobile, refresh, active-state, and
  shell-preservation verification.

No application behaviour is introduced during D33-7.

## 2. D33 commit sequence

| Stage | Commit                                     | Commit subject                                             | Primary output                                          |
| ----- | ------------------------------------------ | ---------------------------------------------------------- | ------------------------------------------------------- |
| D33-0 | `6dfd90338b529ec1b9ef46f83efd5742333cea91` | docs(demo): audit D33 supervisor workspace shell           | `docs/demo/D33-0-SUPERVISOR-WORKSPACE-SHELL-AUDIT.md`   |
| D33-1 | `a9614486c6b8d533bacf7fa9645bf6a1701cd8a9` | docs(demo): define D33 supervisor navigation contract      | `docs/demo/D33-1-SUPERVISOR-NAVIGATION-CONTRACT.md`     |
| D33-2 | `e78d18cb58b6256b74d74ec4391d1904ab3d9d50` | feat(demo): build D33-2 supervisor route surface           | `docs/demo/D33-2-SUPERVISOR-ROUTE-SURFACE.md`           |
| D33-3 | `2b71a13fa2caabd1a625c66e0715e929cdac84f3` | refactor(demo): consolidate D33 supervisor shell ownership | `docs/demo/D33-3-SUPERVISOR-SHELL-OWNERSHIP.md`         |
| D33-4 | `28e8f97da0f30fb01dec4493378b6a314f78c601` | feat(demo): activate D33 supervisor navigation             | `docs/demo/D33-4-SUPERVISOR-NAVIGATION-ACTIVATION.md`   |
| D33-5 | `f611466f04c8481666577a4d67f9df84ca672851` | refactor(demo): consolidate D33 supervisor links           | `docs/demo/D33-5-SUPERVISOR-LINK-CONSOLIDATION.md`      |
| D33-6 | `29ed777de3e1386a85a0032756167b7c4b32cfae` | test(demo): verify D33 supervisor navigation               | `docs/demo/D33-6-SUPERVISOR-NAVIGATION-VERIFICATION.md` |

The D33-7 freeze commit is the commit containing this document. Its exact SHA is
printed by the D33-7 installer after commit creation because a Git commit cannot
contain its own final SHA.

## 3. Frozen canonical navigation

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

## 4. Frozen canonical route surface

| Route key            | Navigation item      | Canonical route                        |
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

Log Out is an action, not a route destination.

## 5. Legacy compatibility ownership

The supervisor-owned legacy route:

`/demo/supervisor/approvals/[requestId]`

is retained.

Approval Queue owns the active state for:

- `/demo/supervisor/approvals`;
- `/demo/supervisor/approvals/**`.

The legacy approval workspace renders a body beneath the supervisor layout and
does not mount a second sidebar or top bar.

## 6. Frozen ownership contracts

### Route namespace owner

`app/demo/supervisor/**`

All ordinary supervisor navigation remains beneath this namespace.

### Sole shell owner

`app/demo/supervisor/layout.tsx`

The layout passes `role="supervisor"` into the shared operational shell.

### Shared shell chain

1. `app/demo/supervisor/layout.tsx`
2. `OperationalWorkspaceShell`
3. `RoleWorkspaceShell`
4. `InternalAppShell`
5. one `InternalSidebar`
6. one `InternalTopbar`
7. body-only supervisor page

### Canonical navigation owner

`features/demo-engine/navigation/supervisor-navigation-contract.ts`

### Live navigation consumer

`components/demo/internal-shell/internal-navigation.ts`

The live supervisor navigation must continue to consume
`SUPERVISOR_NAVIGATION_CONTRACT`.

### Active-state owner

`isInternalNavigationItemActive()` consumes canonical exact matching, active
prefixes, and legacy aliases supplied by the contract.

### Desktop and mobile owner

`InternalSidebar` is the single navigation renderer for both desktop and mobile.

### Supervisor link owners

- supervisor dashboard adapter;
- supervisor approvals reference fixture;
- sidebar brand helper;
- workspace role helper.

These sources must continue to consume canonical supervisor route constants.

## 7. Frozen verification evidence

D33-6 verified:

| Gate                                         | Result |
| -------------------------------------------- | ------ |
| Thirteen canonical page files                | PASS   |
| Five navigation groups                       | PASS   |
| Fourteen visible items                       | PASS   |
| Thirteen canonical route links               | PASS   |
| One Log Out action                           | PASS   |
| Correct active item on every canonical route | PASS   |
| Direct refresh shell preservation            | PASS   |
| Exactly one sidebar                          | PASS   |
| Exactly one top bar                          | PASS   |
| Legacy Approval Queue ownership              | PASS   |
| Dashboard link ownership                     | PASS   |
| Fixture link ownership                       | PASS   |
| Sidebar brand ownership                      | PASS   |
| Supervisor role-switch ownership             | PASS   |
| Desktop navigation acceptance                | PASS   |
| Mobile navigation acceptance                 | PASS   |
| Focused Vitest suites                        | PASS   |
| TypeScript                                   | PASS   |
| Focused ESLint                               | PASS   |
| Production build                             | PASS   |
| Working tree before freeze                   | CLEAN  |

## 8. Protected frozen files and areas

The following must not be changed casually after D33-7:

- `features/demo-engine/navigation/supervisor-navigation-contract.ts`
- `features/demo-engine/navigation/demo-route-registry.ts`
- `components/demo/internal-shell/internal-navigation.ts`
- `components/demo/internal-shell/internal-sidebar.tsx`
- `components/demo/internal-shell/internal-topbar.tsx`
- `components/demo/internal-shell/internal-app-shell.tsx`
- `components/demo/internal-shell/role-workspace-shell.tsx`
- `components/demo/workspace-shells/operational-workspace-shell.tsx`
- `app/demo/supervisor/layout.tsx`
- canonical pages beneath `app/demo/supervisor/**`
- `components/demo/supervisor/supervisor-approval-workspace.tsx`
- `features/demo-engine/dashboards/data/supervisor-dashboard.adapter.ts`
- `features/demo-engine/fixtures/supervisor-approvals.reference.ts`
- `features/demo/roles/demo-workspace-role.tsx`
- `scripts/verify-d33-supervisor-navigation.sh`
- `playwright.d33.config.ts`
- `tests/acceptance/d33/supervisor-navigation-shell.pw.ts`
- D33 focused unit tests;
- supervisor sidebar labels, order, routes, icons, active-state rules, shell
  ownership, desktop/mobile parity, and link ownership;
- officer, department, applicant, admin, reports, outcomes, and public workspace
  boundaries.

## 9. Allowed future change boundaries

Future stages may change supervisor functionality or page bodies when they:

1. preserve the thirteen canonical route destinations;
2. preserve the fourteen-item navigation inventory unless a new approved
   navigation-contract stage supersedes D33;
3. keep `app/demo/supervisor/layout.tsx` as the sole route-tree shell owner;
4. keep pages body-only;
5. preserve one sidebar and one top bar;
6. preserve desktop/mobile navigation parity;
7. preserve Approval Queue ownership of legacy approval-detail routes;
8. preserve canonical route constants in dashboard, fixture, brand, and
   role-switch sources;
9. avoid ordinary links into other workspace shells;
10. rerun `bash scripts/verify-d33-supervisor-navigation.sh`.

A future change that modifies labels, order, groups, route destinations, active
matching, shell ownership, or cross-workspace boundaries invalidates this
freeze and requires a new bounded navigation stage.

## 10. Regression protocol

Before accepting any future supervisor workspace change:

```bash
bash scripts/verify-d33-supervisor-navigation.sh
```

The change must not be merged when this command fails.

Manual review must additionally confirm:

- direct route entry;
- browser refresh;
- Back and Forward navigation;
- desktop sidebar;
- mobile drawer;
- correct active item;
- unchanged supervisor top bar;
- no officer, department, applicant, admin, reports, outcomes, or public shell
  leakage.

## 11. D33 completion verdict

PASS — D33 Supervisor Navigation Consolidation is complete, verified, and
frozen.
