# D33-6 — Supervisor Navigation Verification

**Stage:** D33-6

**Mode:** Final automated and browser verification

**D33-5 commit:** `f611466f04c8481666577a4d67f9df84ca672851`

**Implementation baseline:** `f611466f04c8481666577a4d67f9df84ca672851`

**Branch:** `demo/d33-supervisor-navigation-consolidation`

**Verified at:** `2026-08-05 13:08:14 +0300`

**Result:** `PASS`

## Purpose

D33-6 verifies the complete Supervisor Demo/V1 navigation consolidation before
the workspace is frozen in D33-7.

This stage adds verification only. It does not change supervisor routes,
navigation, shell ownership, page bodies, dashboard data, visual styling,
business logic, or role behaviour.

## Verification command

Run from the repository root:

```bash
bash scripts/verify-d33-supervisor-navigation.sh
```

The command verifies:

1. all thirteen canonical supervisor page files;
2. D33-1 through D33-5 focused unit contracts;
3. TypeScript;
4. focused ESLint coverage;
5. the production build;
6. desktop browser acceptance;
7. mobile browser acceptance;
8. direct-refresh shell preservation;
9. active-navigation ownership;
10. legacy approval-detail ownership;
11. dashboard link ownership;
12. sidebar-brand ownership;
13. role-switch ownership;
14. Log Out action behaviour.

## Canonical route matrix

| Item                 | Route                                  | Page load | Direct refresh | One sidebar | One top bar | Correct active item |
| -------------------- | -------------------------------------- | --------- | -------------- | ----------- | ----------- | ------------------- |
| Department Dashboard | `/demo/supervisor`                     | PASS      | PASS           | PASS        | PASS        | PASS                |
| Department Queue     | `/demo/supervisor/department-queue`    | PASS      | PASS           | PASS        | PASS        | PASS                |
| Unassigned Work      | `/demo/supervisor/unassigned-work`     | PASS      | PASS           | PASS        | PASS        | PASS                |
| Team Workload        | `/demo/supervisor/team-workload`       | PASS      | PASS           | PASS        | PASS        | PASS                |
| Approval Queue       | `/demo/supervisor/approval-queue`      | PASS      | PASS           | PASS        | PASS        | PASS                |
| Escalations          | `/demo/supervisor/escalations`         | PASS      | PASS           | PASS        | PASS        | PASS                |
| Department Handoffs  | `/demo/supervisor/department-handoffs` | PASS      | PASS           | PASS        | PASS        | PASS                |
| Shared Work          | `/demo/supervisor/shared-work`         | PASS      | PASS           | PASS        | PASS        | PASS                |
| SLA Monitor          | `/demo/supervisor/sla-monitor`         | PASS      | PASS           | PASS        | PASS        | PASS                |
| Overdue Work         | `/demo/supervisor/overdue-work`        | PASS      | PASS           | PASS        | PASS        | PASS                |
| Officer Performance  | `/demo/supervisor/officer-performance` | PASS      | PASS           | PASS        | PASS        | PASS                |
| Department Reports   | `/demo/supervisor/department-reports`  | PASS      | PASS           | PASS        | PASS        | PASS                |
| Audit Trail          | `/demo/supervisor/audit-trail`         | PASS      | PASS           | PASS        | PASS        | PASS                |

## Navigation inventory

Browser acceptance confirms:

- five groups;
- fourteen visible items;
- thirteen route links;
- one Log Out button;
- identical desktop and mobile inventory;
- no hash or query-based sidebar destinations;
- no supervisor sidebar route outside `/demo/supervisor/**`.

## Shell preservation

Every canonical route and the legacy approval-detail route render:

- exactly one internal workspace sidebar;
- exactly one internal top bar;
- the Supervisor workspace role;
- the shared supervisor navigation;
- the correct active navigation item.

Direct browser refresh retains the same shell.

The legacy route:

`/demo/supervisor/approvals/REQ-DEMO-001`

activates Approval Queue and does not introduce a nested shell.

## Link ownership

Browser and unit verification confirm:

- ordinary dashboard links remain supervisor-owned;
- sidebar routes remain supervisor-owned;
- the sidebar brand returns to Department Dashboard;
- switching to Supervisor resolves to canonical supervisor home;
- approval details remain supervisor-owned;
- Officer, Department, Reports, Outcomes, Applicant, Admin, and public shells
  are not entered by ordinary supervisor navigation.

Explicit role switching and Log Out remain intentional workspace boundaries.

## Desktop and mobile

Desktop and mobile both consume the same live supervisor navigation.

Mobile verification opens the drawer, confirms the same five groups and
fourteen items, navigates to Shared Work, and confirms the correct active state
beneath the persistent supervisor shell.

## Quality gates

| Gate                          | Result |
| ----------------------------- | ------ |
| Canonical page-file inventory | PASS   |
| D33 focused Vitest suites     | PASS   |
| TypeScript                    | PASS   |
| Focused ESLint                | PASS   |
| Production build              | PASS   |
| Desktop Playwright acceptance | PASS   |
| Mobile Playwright acceptance  | PASS   |
| Working-tree allow-list       | PASS   |

## Files added

- `playwright.d33.config.ts`
- `tests/acceptance/d33/supervisor-navigation-shell.pw.ts`
- `scripts/verify-d33-supervisor-navigation.sh`
- `docs/demo/D33-6-SUPERVISOR-NAVIGATION-VERIFICATION.md`

## Files deliberately unchanged

- all application routes;
- all supervisor page bodies;
- supervisor navigation contract;
- live internal navigation;
- sidebar and top-bar components;
- role-switch implementation;
- dashboard adapter and fixtures;
- shell CSS;
- global styling and design tokens;
- officer, department, applicant, admin, reports, outcomes, and public
  workspaces;
- package files;
- backend and production integrations.

## D33-7 handoff

D33-7 may freeze the supervisor navigation consolidation.

The freeze must record:

1. the D33-0 through D33-6 commit sequence;
2. the thirteen canonical routes;
3. the Log Out action;
4. the sole shell owner;
5. the canonical navigation owner;
6. the verification command;
7. the D33-6 PASS result;
8. the final commit SHA;
9. the clean working-tree result;
10. protected files and allowed future change boundaries.

D33-6 is complete only when this document records `PASS`.

## D33-6 completion verdict

PASS — Supervisor navigation and shell verification is complete and D33-7 may
begin.
