# D33-0 — Supervisor Workspace Shell Audit

**Repository:** `Nyabera/digi-serve`

**Source branch:** `demo/d32-officer-navigation-consolidation`

**D33 branch:** `demo/d33-supervisor-navigation-consolidation`

**Baseline commit:** `3eebe62f57d82b652a5c15784cdd5f359fdbaa59`

**Audit date:** `2026-08-05 11:52:02 +0300`

**Audit mode:** Static repository inspection. No browser confirmation is claimed.

## 1. Audit metadata

The audit inspected the existing supervisor App Router surface, layout ownership,
shared internal navigation, route registry, supervisor role references, and
links that can move a supervisor into another workspace.

**Working tree before audit:** Clean, enforced by the installer.

**Files inspected:**

- `app/demo/supervisor/approvals/[requestId]/page.tsx`
- `app/demo/supervisor/audit-trail/page.tsx`
- `app/demo/supervisor/audit/page.tsx`
- `app/demo/supervisor/layout.tsx`
- `app/demo/supervisor/page.tsx`
- `app/demo/supervisor/sla-monitor/page.tsx`
- `app/demo/supervisor/sla/page.tsx`
- `components/demo/controls/role-switcher.tsx`
- `components/demo/internal-shell/internal-navigation.ts`
- `components/demo/internal-shell/role-workspace-shell.tsx`
- `components/demo/outcomes/controlled-outcome-shell.tsx`
- `components/demo/reports/operational-reports-shell.tsx`
- `components/demo/reports/reports-dashboard.tsx`
- `components/demo/role-switch/demo-role-navigation-bridge.tsx`
- `components/demo/role-switcher/demo-workspace-switcher.tsx`
- `components/demo/supervisor/supervisor-approval-workspace.tsx`
- `components/demo/supervisor/supervisor-dashboard-workspace.tsx`
- `components/demo/workspace-shells/operational-workspace-shell.tsx`
- `features/demo-engine/config/demo-pack-validation.ts`
- `features/demo-engine/config/demo-pack.types.ts`
- `features/demo-engine/dashboards/config/dashboard-shell-contracts.ts`
- `features/demo-engine/dashboards/data/dashboard-data.shared.ts`
- `features/demo-engine/dashboards/data/dashboard-data.validation.ts`
- `features/demo-engine/dashboards/data/supervisor-dashboard.adapter.ts`
- `features/demo-engine/dashboards/shared/dashboard-theme.ts`
- `features/demo-engine/dashboards/shared/dashboard-token-contract.ts`
- `features/demo-engine/dashboards/supervisor/supervisor-dashboard.tsx`
- `features/demo-engine/dashboards/supervisor/supervisor-dashboard.visual-contract.ts`
- `features/demo-engine/navigation/demo-route-registry.ts`
- `features/demo-operations/components/operational-workspaces.tsx`
- `features/demo-operations/fixtures/operational-data.ts`
- `features/demo/roles/demo-workspace-role.tsx`
- `features/demo/state/demo-seed.ts`

**Commands and methods used:**

- Python recursive file enumeration
- static import inspection
- literal route and href extraction
- App Router page-to-URL mapping
- shell-marker inspection
- role-reference inspection
- cross-workspace destination classification
- `git diff --check`
- changed-file allow-list verification

## 2. Executive summary

`app/demo/supervisor/layout.tsx` is the nearest shared layout owner for the
supervisor route tree. It does render
`OperationalWorkspaceShell`, and it does
pass the `supervisor` role.

This reuse is structurally appropriate. The defect is not that the supervisor
shares visual shell components with the officer workspace. The defect is that
the current supervisor navigation sends users to routes owned by department,
officer, reports, outcomes, public, and hash-only destinations. Once a click
leaves `/demo/supervisor/**`, Next.js can apply another route tree and therefore
another sidebar, top bar, role context, or page composition.

The current supervisor experience is therefore not structurally consistent.
Shared visual components should remain reusable, while supervisor route
ownership, navigation ownership, active-state ownership, and role-switch
destinations must become supervisor-specific.

## 3. Current supervisor route inventory

| URL | Page file | Nearest supervisor layout | Render/import evidence | Shell markers | Cross-workspace hrefs in page | Confirmation |
| --- | --- | --- | --- | --- | --- | --- |
| `/demo/supervisor/approvals/[requestId]` | `app/demo/supervisor/approvals/[requestId]/page.tsx` | `app/demo/supervisor/layout.tsx` | `{ notFound }` from `next/navigation`<br>`{ SupervisorApprovalWorkspace }` from `@/components/demo/supervisor/supervisor-approval-workspace`<br>`{ getDefaultDemoClient }` from `@/config/demo` | Department, Supervisor | None detected | Static only |
| `/demo/supervisor/audit` | `app/demo/supervisor/audit/page.tsx` | `app/demo/supervisor/layout.tsx` | `{ SupervisorAuditWorkspace }` from `@/features/demo-operations` | Supervisor | None detected | Static only |
| `/demo/supervisor/audit-trail` | `app/demo/supervisor/audit-trail/page.tsx` | `app/demo/supervisor/layout.tsx` | `{ SupervisorAuditWorkspace }` from `@/features/demo-operations` | Supervisor | None detected | Static only |
| `/demo/supervisor` | `app/demo/supervisor/page.tsx` | `app/demo/supervisor/layout.tsx` | `{ getActiveDemoPack, }` from `@/features/demo-engine/config`<br>`{ adaptSupervisorDashboard, assertDashboardDataValid, validateSupervisorDashboardData, }` from `@/features/demo-engine/dashboards/data`<br>`{ SupervisorDashboard, }` from `@/features/demo-engine/dashboards/supervisor` | Supervisor | None detected | Static only |
| `/demo/supervisor/sla` | `app/demo/supervisor/sla/page.tsx` | `app/demo/supervisor/layout.tsx` | `{ SupervisorSlaWorkspace }` from `@/features/demo-operations` | Supervisor | None detected | Static only |
| `/demo/supervisor/sla-monitor` | `app/demo/supervisor/sla-monitor/page.tsx` | `app/demo/supervisor/layout.tsx` | `{ SupervisorSlaWorkspace }` from `@/features/demo-operations` | Supervisor | None detected | Static only |

## 4. Current supervisor layout inheritance

The canonical supervisor route tree inherits the shared demo hierarchy and
`app/demo/supervisor/layout.tsx` before rendering each page body.

Current supervisor layout source:

```tsx
import type { ReactNode } from "react";

import { OperationalWorkspaceShell } from "@/components/demo/workspace-shells";

export default function SupervisorWorkspaceLayout({ children }: { children: ReactNode }) {
  return <OperationalWorkspaceShell role="supervisor">{children}</OperationalWorkspaceShell>;
}
```

`app/demo/supervisor/layout.tsx` is the intended shared shell owner for pages
that remain beneath `/demo/supervisor/**`. Static inspection cannot prove
runtime preservation for links that leave that namespace.

No page should mount another full sidebar or top bar in later D33 stages.
Page files should remain body-only beneath the supervisor layout.

## 5. Current supervisor navigation definition

The current live navigation is embedded in
`components/demo/internal-shell/internal-navigation.ts` rather than a dedicated
supervisor contract.

| Order | Label | Icon | Href | Exact | Badge | Destination workspace |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Audit trail | `LayoutDashboard` | `/demo/supervisor/audit-trail` | Yes | 1 | SUPERVISOR |
| 2 | SLA monitor | `LayoutDashboard` | `/demo/supervisor/sla-monitor` | Yes | 1 | SUPERVISOR |
| 3 | Dashboard | `LayoutDashboard` | `/demo/supervisor` | Yes | 1 | SUPERVISOR |
| 4 | My tasks | `ListChecks` | `/demo/supervisor#my-tasks` | No | 1 | HASH-ONLY |
| 5 | Approval queue | `ShieldCheck` | `/demo/supervisor#approval-queue` | No | 1 | HASH-ONLY |
| 6 | Workflow inbox | `Inbox` | `/demo/department` | No | — | DEPARTMENT |
| 7 | Returned for clarification | `Clock3` | `/demo/supervisor#returned` | No | — | HASH-ONLY |
| 8 | Shared workflows | `UsersRound` | `/demo/department` | No | — | DEPARTMENT |
| 9 | Document review | `FileText` | `/demo/officer/requests/REQ-DEMO-001` | No | — | OFFICER |
| 10 | Issued documents | `FileCheck2` | `/demo/outcomes/REQ-DEMO-001` | No | — | OUTCOMES |
| 11 | Department reports | `BarChart3` | `/demo/reports?scope=department` | No | — | REPORTS |

**Supervisor-owned current destinations:** 3

**Hash-based current destinations:** 3

**Cross-workspace current destinations:** 5

## 6. Proposed navigation gap analysis

| Section | Proposed item | Current destination/equivalent | Proposed canonical destination | Existing page file | Current icon | Missing route | Risk | Resolution stage |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Operations | Department Dashboard | None | `/demo/supervisor` | `app/demo/supervisor/page.tsx` | Not assigned | No | MEDIUM | D33-4 |
| Operations | Department Queue | None | `/demo/supervisor/department-queue` | None | Not assigned | Yes | HIGH | D33-2 |
| Operations | Unassigned Work | None | `/demo/supervisor/unassigned-work` | None | Not assigned | Yes | HIGH | D33-2 |
| Operations | Team Workload | None | `/demo/supervisor/team-workload` | None | Not assigned | Yes | HIGH | D33-2 |
| Workflow | Approval Queue | `/demo/supervisor#approval-queue` | `/demo/supervisor/approval-queue` | None | `ShieldCheck` | Yes | HIGH | D33-2 |
| Workflow | Escalations | None | `/demo/supervisor/escalations` | None | Not assigned | Yes | HIGH | D33-2 |
| Workflow | Department Handoffs | None | `/demo/supervisor/department-handoffs` | None | Not assigned | Yes | HIGH | D33-2 |
| Workflow | Shared Work | None | `/demo/supervisor/shared-work` | None | Not assigned | Yes | HIGH | D33-2 |
| Performance | SLA Monitor | `/demo/supervisor/sla-monitor` | `/demo/supervisor/sla-monitor` | `app/demo/supervisor/sla-monitor/page.tsx` | `LayoutDashboard` | No | MEDIUM | D33-4 |
| Performance | Overdue Work | None | `/demo/supervisor/overdue-work` | None | Not assigned | Yes | HIGH | D33-2 |
| Performance | Officer Performance | None | `/demo/supervisor/officer-performance` | None | Not assigned | Yes | HIGH | D33-2 |
| Performance | Department Reports | `/demo/reports?scope=department` | `/demo/supervisor/department-reports` | None | `BarChart3` | Yes | HIGH | D33-2 |
| Oversight | Audit Trail | `/demo/supervisor/audit-trail` | `/demo/supervisor/audit-trail` | `app/demo/supervisor/audit-trail/page.tsx` | `LayoutDashboard` | No | MEDIUM | D33-4 |
| Account | Log Out | None | `Action` | Not applicable | Not assigned | No | MEDIUM | D33-4 |

D33-0 records the approved destination shape for gap analysis. D33-1 must lock
the typed contract and route constants before page creation or visible
activation.

## 7. Sidebar ownership

The navigation resolver is `getInternalNavigation()` in
`components/demo/internal-shell/internal-navigation.ts`.

The supervisor layout passes the lowercase role `supervisor` into the shared
operational shell. The shell stack is expected to normalize that role for the
internal navigation resolver. Desktop and mobile navigation should consume the
same resolved groups; any separate mobile source must be removed or aligned in
a later bounded stage.

The sidebar visual component, icons, typography, spacing, collapsed behaviour,
and navigation-item presentation should be reused. D33 should replace the
supervisor configuration source, not duplicate the shell.

## 8. Top-bar ownership

The shared operational shell is responsible for the persistent top-bar layer
when the route remains in the supervisor tree. Different top bars appear when:

- navigation leaves `/demo/supervisor/**`;
- a destination route inherits another layout;
- a legacy page mounts its own shell-like composition;
- route-derived role resolution changes;
- reports, outcomes, department, officer, or public pages own different chrome.

D33-0 found no justification for redesigning the top bar. The correction is
route and shell ownership consolidation.

## 9. Role resolution and role switching

Files containing supervisor-role evidence:

- `app/demo/supervisor/layout.tsx`
- `app/demo/supervisor/page.tsx`
- `components/demo/controls/role-switcher.tsx`
- `components/demo/internal-shell/internal-navigation.ts`
- `components/demo/internal-shell/role-workspace-shell.tsx`
- `components/demo/outcomes/controlled-outcome-shell.tsx`
- `components/demo/reports/operational-reports-shell.tsx`
- `components/demo/reports/reports-dashboard.tsx`
- `components/demo/role-switch/demo-role-navigation-bridge.tsx`
- `components/demo/role-switcher/demo-workspace-switcher.tsx`
- `components/demo/supervisor/supervisor-approval-workspace.tsx`
- `components/demo/supervisor/supervisor-dashboard-workspace.tsx`
- `components/demo/workspace-shells/operational-workspace-shell.tsx`
- `features/demo/roles/demo-workspace-role.tsx`
- `features/demo/state/demo-seed.ts`
- `features/demo-engine/config/demo-pack-validation.ts`
- `features/demo-engine/config/demo-pack.types.ts`
- `features/demo-engine/dashboards/config/dashboard-shell-contracts.ts`
- `features/demo-engine/dashboards/data/dashboard-data.shared.ts`
- `features/demo-engine/dashboards/data/dashboard-data.validation.ts`
- `features/demo-engine/dashboards/data/supervisor-dashboard.adapter.ts`
- `features/demo-engine/dashboards/shared/dashboard-theme.ts`
- `features/demo-engine/dashboards/shared/dashboard-token-contract.ts`
- `features/demo-engine/dashboards/supervisor/supervisor-dashboard.tsx`
- `features/demo-engine/dashboards/supervisor/supervisor-dashboard.visual-contract.ts`
- `features/demo-engine/navigation/demo-route-registry.ts`
- `features/demo-operations/components/operational-workspaces.tsx`
- `features/demo-operations/fixtures/operational-data.ts`

The pathname prefix `/demo/supervisor` is the stable basis for preserving the
supervisor workspace. Any role-switch destination for Supervisor must resolve
to the canonical supervisor home route. Links to other workspace namespaces
must be treated as explicit role/workspace changes, not ordinary supervisor
navigation.

Browser refresh behaviour was not executed during this static audit.

## 10. Route registry and link ownership

Current supervisor registry block:

```ts
home: "/demo/supervisor",
    approvals: "/demo/supervisor/approvals",
    audit: "/demo/supervisor/audit-trail",
    sla: "/demo/supervisor/sla-monitor",
```

Detected route literals in supervisor-relevant files:

| Source | Href | Classified destination |
| --- | --- | --- |
| `components/demo/department/department-handoff-processing-workspace.tsx` | `/demo/department` | DEPARTMENT |
| `components/demo/department/department-handoff-processing-workspace.tsx` | `/demo/officer` | OFFICER |
| `components/demo/department/department-handoff-processing-workspace.tsx` | `/demo/supervisor` | SUPERVISOR |
| `components/demo/department/department-inbox-workspace.tsx` | `/demo/department` | DEPARTMENT |
| `components/demo/department/department-inbox-workspace.tsx` | `/demo/officer` | OFFICER |
| `components/demo/department/department-inbox-workspace.tsx` | `/demo/supervisor` | SUPERVISOR |
| `components/demo/homepages/primary-homepage.tsx` | `/demo/officer` | OFFICER |
| `components/demo/internal-shell/internal-navigation.ts` | `/demo/department` | DEPARTMENT |
| `components/demo/internal-shell/internal-navigation.ts` | `/demo/department#completed` | DEPARTMENT |
| `components/demo/internal-shell/internal-navigation.ts` | `/demo/department#department-queue` | DEPARTMENT |
| `components/demo/internal-shell/internal-navigation.ts` | `/demo/department#in-progress` | DEPARTMENT |
| `components/demo/internal-shell/internal-navigation.ts` | `/demo/department#my-tasks` | DEPARTMENT |
| `components/demo/internal-shell/internal-navigation.ts` | `/demo/officer/requests/REQ-DEMO-001` | OFFICER |
| `components/demo/internal-shell/internal-navigation.ts` | `/demo/outcomes/REQ-DEMO-001` | OUTCOMES |
| `components/demo/internal-shell/internal-navigation.ts` | `/demo/reports?scope=department` | REPORTS |
| `components/demo/internal-shell/internal-navigation.ts` | `/demo/reports?scope=institution` | REPORTS |
| `components/demo/internal-shell/internal-navigation.ts` | `/demo/reports?scope=institution#access` | REPORTS |
| `components/demo/internal-shell/internal-navigation.ts` | `/demo/reports?scope=institution#activity` | REPORTS |
| `components/demo/internal-shell/internal-navigation.ts` | `/demo/reports?scope=institution#audit` | REPORTS |
| `components/demo/internal-shell/internal-navigation.ts` | `/demo/reports?scope=institution#branding` | REPORTS |
| `components/demo/internal-shell/internal-navigation.ts` | `/demo/reports?scope=institution#campuses` | REPORTS |
| `components/demo/internal-shell/internal-navigation.ts` | `/demo/reports?scope=institution#departments` | REPORTS |
| `components/demo/internal-shell/internal-navigation.ts` | `/demo/reports?scope=institution#escalation` | REPORTS |
| `components/demo/internal-shell/internal-navigation.ts` | `/demo/reports?scope=institution#export` | REPORTS |
| `components/demo/internal-shell/internal-navigation.ts` | `/demo/reports?scope=institution#institution` | REPORTS |
| `components/demo/internal-shell/internal-navigation.ts` | `/demo/reports?scope=institution#officer-reports` | REPORTS |
| `components/demo/internal-shell/internal-navigation.ts` | `/demo/reports?scope=institution#records` | REPORTS |
| `components/demo/internal-shell/internal-navigation.ts` | `/demo/reports?scope=institution#requirements` | REPORTS |
| `components/demo/internal-shell/internal-navigation.ts` | `/demo/reports?scope=institution#service-builder` | REPORTS |
| `components/demo/internal-shell/internal-navigation.ts` | `/demo/reports?scope=institution#service-reports` | REPORTS |
| `components/demo/internal-shell/internal-navigation.ts` | `/demo/reports?scope=institution#sla-reports` | REPORTS |
| `components/demo/internal-shell/internal-navigation.ts` | `/demo/reports?scope=institution#sla-rules` | REPORTS |
| `components/demo/internal-shell/internal-navigation.ts` | `/demo/reports?scope=institution#users` | REPORTS |
| `components/demo/internal-shell/internal-navigation.ts` | `/demo/supervisor` | SUPERVISOR |
| `components/demo/internal-shell/internal-navigation.ts` | `/demo/supervisor#approval-queue` | HASH-ONLY |
| `components/demo/internal-shell/internal-navigation.ts` | `/demo/supervisor#my-tasks` | HASH-ONLY |
| `components/demo/internal-shell/internal-navigation.ts` | `/demo/supervisor#returned` | HASH-ONLY |
| `components/demo/internal-shell/internal-navigation.ts` | `/demo/supervisor/approvals/` | SUPERVISOR |
| `components/demo/internal-shell/internal-navigation.ts` | `/demo/supervisor/audit-trail` | SUPERVISOR |
| `components/demo/internal-shell/internal-navigation.ts` | `/demo/supervisor/sla-monitor` | SUPERVISOR |
| `components/demo/officer/officer-dashboard.tsx` | `/demo/department` | DEPARTMENT |
| `components/demo/officer/officer-dashboard.tsx` | `/demo/officer` | OFFICER |
| `components/demo/officer/officer-dashboard.tsx` | `/demo/supervisor` | SUPERVISOR |
| `components/demo/outcomes/controlled-outcome-shell.tsx` | `/demo/department` | DEPARTMENT |
| `components/demo/outcomes/controlled-outcome-shell.tsx` | `/demo/officer` | OFFICER |
| `components/demo/outcomes/controlled-outcome-shell.tsx` | `/demo/supervisor` | SUPERVISOR |
| `components/demo/outcomes/controlled-outcome-workspace.tsx` | `/demo/supervisor` | SUPERVISOR |
| `components/demo/presentation/demo-presentation-frame.tsx` | `/demo/department` | DEPARTMENT |
| `components/demo/presentation/demo-presentation-frame.tsx` | `/demo/officer` | OFFICER |
| `components/demo/presentation/demo-presentation-frame.tsx` | `/demo/officer/requests/` | OFFICER |
| `components/demo/presentation/demo-presentation-frame.tsx` | `/demo/outcomes/` | OUTCOMES |
| `components/demo/presentation/demo-presentation-frame.tsx` | `/demo/reports` | REPORTS |
| `components/demo/presentation/demo-presentation-frame.tsx` | `/demo/supervisor` | SUPERVISOR |
| `components/demo/reports/operational-reports-dashboard.tsx` | `/demo/department` | DEPARTMENT |
| `components/demo/reports/operational-reports-dashboard.tsx` | `/demo/officer` | OFFICER |
| `components/demo/reports/operational-reports-shell.tsx` | `/demo/department` | DEPARTMENT |
| `components/demo/reports/operational-reports-shell.tsx` | `/demo/officer` | OFFICER |
| `components/demo/reports/operational-reports-shell.tsx` | `/demo/reports` | REPORTS |
| `components/demo/reports/operational-reports-shell.tsx` | `/demo/supervisor` | SUPERVISOR |
| `components/demo/supervisor/supervisor-approval-workspace.tsx` | `/demo/department` | DEPARTMENT |
| `components/demo/supervisor/supervisor-approval-workspace.tsx` | `/demo/officer` | OFFICER |
| `components/demo/supervisor/supervisor-approval-workspace.tsx` | `/demo/supervisor` | SUPERVISOR |
| `components/demo/supervisor/supervisor-dashboard-workspace.tsx` | `/demo/department` | DEPARTMENT |
| `components/demo/supervisor/supervisor-dashboard-workspace.tsx` | `/demo/officer` | OFFICER |
| `components/demo/supervisor/supervisor-dashboard-workspace.tsx` | `/demo/supervisor` | SUPERVISOR |
| `features/demo/roles/demo-workspace-role.tsx` | `/demo/department` | DEPARTMENT |
| `features/demo/roles/demo-workspace-role.tsx` | `/demo/officer` | OFFICER |
| `features/demo/roles/demo-workspace-role.tsx` | `/demo/reports` | REPORTS |
| `features/demo/roles/demo-workspace-role.tsx` | `/demo/reports?scope=institution` | REPORTS |
| `features/demo/roles/demo-workspace-role.tsx` | `/demo/supervisor` | SUPERVISOR |
| `features/demo/state/demo-seed.ts` | `/demo/department/handoffs/HND-DEMO-001` | DEPARTMENT |
| `features/demo/state/demo-seed.ts` | `/demo/supervisor/approvals/REQ-DEMO-003` | SUPERVISOR |
| `features/demo-engine/dashboards/data/supervisor-dashboard.adapter.ts` | `/demo/officer/documents` | OFFICER |
| `features/demo-engine/dashboards/data/supervisor-dashboard.adapter.ts` | `/demo/reports` | REPORTS |
| `features/demo-engine/dashboards/data/supervisor-dashboard.adapter.ts` | `/demo/supervisor` | SUPERVISOR |
| `features/demo-engine/dashboards/data/supervisor-dashboard.adapter.ts` | `/demo/supervisor/audit-trail` | SUPERVISOR |
| `features/demo-engine/dashboards/data/supervisor-dashboard.adapter.ts` | `/demo/supervisor/sla-monitor` | SUPERVISOR |
| `features/demo-engine/dashboards/supervisor/supervisor-dashboard.tsx` | `/demo/supervisor/approvals` | SUPERVISOR |
| `features/demo-engine/dashboards/supervisor/supervisor-dashboard.tsx` | `/demo/supervisor/assignments` | SUPERVISOR |
| `features/demo-engine/dashboards/supervisor/supervisor-dashboard.tsx` | `/demo/supervisor/audit` | SUPERVISOR |
| `features/demo-engine/dashboards/supervisor/supervisor-dashboard.tsx` | `/demo/supervisor/audit-trail` | SUPERVISOR |
| `features/demo-engine/dashboards/supervisor/supervisor-dashboard.tsx` | `/demo/supervisor/department-queue` | SUPERVISOR |
| `features/demo-engine/dashboards/supervisor/supervisor-dashboard.tsx` | `/demo/supervisor/handoffs` | SUPERVISOR |
| `features/demo-engine/dashboards/supervisor/supervisor-dashboard.tsx` | `/demo/supervisor/reports` | SUPERVISOR |
| `features/demo-engine/dashboards/supervisor/supervisor-dashboard.tsx` | `/demo/supervisor/team` | SUPERVISOR |
| `features/demo-engine/dashboards/supervisor/supervisor-dashboard.visual-contract.ts` | `/demo/supervisor` | SUPERVISOR |
| `features/demo-engine/fixtures/supervisor-approvals.reference.ts` | `/demo/department` | DEPARTMENT |
| `features/demo-engine/fixtures/supervisor-approvals.reference.ts` | `/demo/officer` | OFFICER |
| `features/demo-engine/fixtures/supervisor-approvals.reference.ts` | `/demo/reports` | REPORTS |
| `features/demo-engine/fixtures/supervisor-approvals.reference.ts` | `/demo/supervisor#approvals` | HASH-ONLY |
| `features/demo-engine/fixtures/supervisor-approvals.reference.ts` | `/demo/supervisor#attention` | HASH-ONLY |
| `features/demo-engine/fixtures/supervisor-approvals.reference.ts` | `/demo/supervisor#officers` | HASH-ONLY |
| `features/demo-engine/fixtures/supervisor-approvals.reference.ts` | `/demo/supervisor/approvals/REQ-DEMO-001` | SUPERVISOR |
| `features/demo-engine/fixtures/supervisor-approvals.reference.ts` | `/demo/supervisor/approvals/REQ-DEMO-002` | SUPERVISOR |
| `features/demo-engine/fixtures/supervisor-approvals.reference.ts` | `/demo/supervisor/approvals/REQ-DEMO-003` | SUPERVISOR |
| `features/demo-engine/fixtures/supervisor-approvals.reference.ts` | `/demo/supervisor/approvals/REQ-DEMO-004` | SUPERVISOR |
| `features/demo-engine/fixtures/supervisor-approvals.reference.ts` | `/demo/supervisor/approvals/REQ-DEMO-005` | SUPERVISOR |
| `features/demo-engine/navigation/demo-route-registry.ts` | `/demo/admin` | ADMIN |
| `features/demo-engine/navigation/demo-route-registry.ts` | `/demo/admin/workflows` | ADMIN |
| `features/demo-engine/navigation/demo-route-registry.ts` | `/demo/admin/workflows/builder` | ADMIN |
| `features/demo-engine/navigation/demo-route-registry.ts` | `/demo/applicant` | APPLICANT |
| `features/demo-engine/navigation/demo-route-registry.ts` | `/demo/applicant/documents` | APPLICANT |
| `features/demo-engine/navigation/demo-route-registry.ts` | `/demo/applicant/profile` | APPLICANT |
| `features/demo-engine/navigation/demo-route-registry.ts` | `/demo/outcomes` | OUTCOMES |
| `features/demo-engine/navigation/demo-route-registry.ts` | `/demo/supervisor` | SUPERVISOR |
| `features/demo-engine/navigation/demo-route-registry.ts` | `/demo/supervisor/approvals` | SUPERVISOR |
| `features/demo-engine/navigation/demo-route-registry.ts` | `/demo/supervisor/audit-trail` | SUPERVISOR |
| `features/demo-engine/navigation/demo-route-registry.ts` | `/demo/supervisor/sla-monitor` | SUPERVISOR |
| `features/demo-operations/components/operational-workspaces.tsx` | `/demo/officer/requests/REQ-2026-0715` | OFFICER |
| `features/demo-operations/components/operational-workspaces.tsx` | `/demo/supervisor` | SUPERVISOR |
| `features/demo-operations/components/operational-workspaces.tsx` | `/demo/supervisor/audit-trail` | SUPERVISOR |

The route registry and visible navigation are not currently one authoritative
definition. D33-1 must create that source of truth.

## 11. Cross-workspace leakage register

| Source | Item | Current href | Destination shell | Visible consequence | Severity |
| --- | --- | --- | --- | --- | --- |
| `components/demo/internal-shell/internal-navigation.ts` | Workflow inbox | `/demo/department` | DEPARTMENT | Click leaves the supervisor namespace and can replace the inherited shell. | BLOCKER |
| `components/demo/internal-shell/internal-navigation.ts` | Shared workflows | `/demo/department` | DEPARTMENT | Click leaves the supervisor namespace and can replace the inherited shell. | BLOCKER |
| `components/demo/internal-shell/internal-navigation.ts` | Document review | `/demo/officer/requests/REQ-DEMO-001` | OFFICER | Click leaves the supervisor namespace and can replace the inherited shell. | BLOCKER |
| `components/demo/internal-shell/internal-navigation.ts` | Issued documents | `/demo/outcomes/REQ-DEMO-001` | OUTCOMES | Click leaves the supervisor namespace and can replace the inherited shell. | BLOCKER |
| `components/demo/internal-shell/internal-navigation.ts` | Department reports | `/demo/reports?scope=department` | REPORTS | Click leaves the supervisor namespace and can replace the inherited shell. | BLOCKER |

These entries are the primary explanation for sidebar and top-bar replacement.

## 12. Active-navigation audit

Current active-state behaviour includes a mixture of exact matching, prefix
matching, hash destinations, query-string destinations, dynamic approval
descendants, and direct links to another workspace.

Hash links cannot reliably represent independent page ownership. Cross-workspace
links cannot correctly retain a supervisor active item. The existing approvals
descendant prefix must be preserved as compatibility metadata when D33-1
defines the canonical Approval Queue route.

D33-4 should activate only one item at a time from the canonical supervisor
contract.

## 13. Desktop and mobile parity

Static inspection establishes that desktop and mobile must consume the same
supervisor contract. D33-0 does not claim runtime parity because no browser or
viewport test was executed.

D33-6 must verify identical groups, labels, order, icons, hrefs, active-state
rules, and Log Out action treatment.

## 14. Shell preservation matrix

| URL | Loads | Direct refresh | Supervisor sidebar retained | Supervisor top bar retained | Supervisor role retained | Correct active item | Nested shell absent | Destination workspace | Result |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/demo/supervisor/approvals/[requestId]` | Yes | Not browser-tested | Yes by layout inheritance | Yes by layout inheritance | Yes by pathname/layout | Static only | No | SUPERVISOR | PASS |
| `/demo/supervisor/audit` | Yes | Not browser-tested | Yes by layout inheritance | Yes by layout inheritance | Yes by pathname/layout | Static only | No | SUPERVISOR | PASS |
| `/demo/supervisor/audit-trail` | Yes | Not browser-tested | Yes by layout inheritance | Yes by layout inheritance | Yes by pathname/layout | Static only | No | SUPERVISOR | PASS |
| `/demo/supervisor` | Yes | Not browser-tested | Yes by layout inheritance | Yes by layout inheritance | Yes by pathname/layout | Static only | No | SUPERVISOR | PASS |
| `/demo/supervisor/sla` | Yes | Not browser-tested | Yes by layout inheritance | Yes by layout inheritance | Yes by pathname/layout | Static only | No | SUPERVISOR | PASS |
| `/demo/supervisor/sla-monitor` | Yes | Not browser-tested | Yes by layout inheritance | Yes by layout inheritance | Yes by pathname/layout | Static only | No | SUPERVISOR | PASS |

Results above are static findings. D33-6 must replace static assumptions with
browser-confirmed evidence.

## 15. Root-cause findings

| Severity | Source | Behaviour | Visible consequence | Fix stage |
| --- | --- | --- | --- | --- |
| BLOCKER | `components/demo/internal-shell/internal-navigation.ts` | The live supervisor navigation contains destinations outside `/demo/supervisor/**`. | Clicks can enter department, officer, reports, outcomes, or public routes and inherit different shell ownership. | D33-4 and D33-5 |
| HIGH | `components/demo/internal-shell/internal-navigation.ts` | Several supervisor entries are hash links rather than independent route pages. | The sidebar presents page-like destinations that do not have stable route ownership or reliable refresh behaviour. | D33-2 and D33-4 |
| HIGH | `features/demo-engine/navigation/demo-route-registry.ts` | The supervisor route registry exposes only a narrow historical route set. | The proposed thirteen-route supervisor surface has no single canonical source of truth. | D33-1 |
| HIGH | `components/demo/internal-shell/internal-navigation.ts` | The current item inventory and grouping do not match the approved fourteen-item Supervisor Demo/V1 navigation. | Users encounter mixed operational, document, reporting, and account concepts with inconsistent scope. | D33-1 and D33-4 |
| MEDIUM | `app/demo/supervisor/layout.tsx` | The supervisor correctly reuses the shared operational shell, but route ownership is not consistently supervisor-owned. | The shared shell is not the defect; leaving the supervisor namespace is. | D33-3 and D33-5 |

## 16. Existing assets that should be reused

Preserve and reuse the shared operational shell, internal sidebar, top bar,
role-switcher presentation, Lucide icons, typography, spacing, sidebar
dimensions, mobile drawer, supervisor dashboard body, reusable operational page
bodies, adapters, fixtures, and active-state utility.

## 17. Files likely to change in later D33 stages

### D33-1 — Navigation contract

- `features/demo-engine/navigation/supervisor-navigation-contract.ts`
- `features/demo-engine/navigation/demo-route-registry.ts`
- focused unit test
- D33-1 documentation

### D33-2 — Canonical route surface

- body-only pages beneath `app/demo/supervisor/**`
- route-surface test
- D33-2 documentation

### D33-3 — Shell consolidation

- `app/demo/supervisor/layout.tsx` only if required
- shared shell wiring only where audit evidence requires it
- shell-ownership test
- D33-3 documentation

### D33-4 — Navigation activation

- `components/demo/internal-shell/internal-navigation.ts`
- active-state integration
- desktop/mobile navigation tests
- D33-4 documentation

### D33-5 — Link consolidation

- supervisor dashboard/link sources
- adapters or fixtures only where href ownership is proven
- role-switch destination
- link-consolidation tests
- D33-5 documentation

### D33-6 — Verification

- verification shell script
- Vitest and Playwright acceptance coverage
- D33-6 evidence document

### D33-7 — Freeze

- freeze document and manifest only

## 18. Files that must remain protected

Protect unless a later bounded stage explicitly permits change:

- officer navigation contract and officer route surface;
- applicant shell;
- department shell;
- admin shell;
- public site;
- global design tokens;
- dashboard visual design;
- workflow and business logic;
- backend and production integrations;
- database code;
- package files;
- unrelated fixtures;
- unrelated visual snapshots.

## 19. Recommended D33 stage boundaries

**D33-1:** Define the typed supervisor navigation and canonical route contract
only.

**D33-2:** Create all thirteen supervisor-owned route destinations as body-only
pages.

**D33-3:** Make the supervisor layout the exclusive sidebar and top-bar owner.

**D33-4:** Activate the exact fourteen-item navigation without redesigning the
shell.

**D33-5:** Replace supervisor-originating cross-workspace links with canonical
supervisor links.

**D33-6:** Run unit, type, lint, build, desktop, mobile, refresh, active-state,
and shell-preservation verification.

**D33-7:** Record and freeze the completed supervisor workspace contract.

## 20. D33-0 completion verdict

PASS — Supervisor workspace audit is complete and D33-1 may begin.
