# D34-0 — Admin Workspace Shell Audit

## Audit status

**COMPLETE — CRITICAL CONSOLIDATION FINDINGS RECORDED**

This document is an evidence-first audit of the existing admin workspace. It does not activate the proposed D34 navigation, create missing admin pages, or alter the visible shell.

## Baseline

| Field | Value |
|---|---|
| Repository root | `/Users/blaq/Downloads/faidia` |
| Remote | `https://github.com/Nyabera/digi-serve.git` |
| Branch | `demo/d34-admin-navigation-consolidation` |
| Baseline commit | `73f0df06e0a04189fa256a1c215e6d85adf544eb` |
| Short commit | `73f0df0` |
| Generated locally | `2026-08-05 13:42:32 EAT` |
| Generated UTC | `2026-08-05T10:42:32Z` |
| Pre-existing changes allowed | `0` |

## D34 problem statement

The admin area currently needs one canonical workspace contract. Every admin destination must eventually retain:

- one persistent admin sidebar;
- one persistent admin top bar;
- one organization-admin role identity;
- one desktop and mobile navigation source;
- admin-owned URLs beneath `/demo/admin`;
- one active-navigation matching policy;
- no officer, supervisor, department, applicant, or public shell bleed.

D34-0 records the present route and shell structure before implementation begins.

## Audit scope

The audit covers:

1. all pages beneath `app/demo/admin/**`;
2. inherited App Router layouts;
3. shell, sidebar, header, and top-bar candidates;
4. admin navigation definitions;
5. desktop and mobile navigation candidates;
6. role and workspace-resolution evidence;
7. route-registry evidence;
8. active-navigation matching;
9. redirects and client-side navigation;
10. cross-workspace links and page re-exports;
11. admin-named routes outside the canonical admin tree;
12. likely page-level nested shell usage.

## Constraints

D34-0 must not:

- change visible navigation;
- create canonical D34 routes;
- modify the admin shell;
- change the role switcher;
- modify officer, supervisor, applicant, department, or public workspaces;
- change global CSS or design tokens;
- commit or push automatically.

## Mechanical summary

| Measure | Count |
|---|---:|
| Canonical admin pages | 3 |
| Layouts beneath `app/demo/admin` | 1 |
| Navigation candidate files | 4 |
| Shell/layout/sidebar candidate files | 18 |
| Top-bar/header candidate files | 3 |
| Mobile/drawer candidate files | 0 |
| Cross-workspace link references | 199 |
| Cross-workspace redirect references | 13 |
| Possible cross-workspace page re-exports | 0 |
| Shell/sidebar/top-bar references beneath admin pages | 2 |
| Admin-named pages outside canonical tree | 0 |

## Preliminary findings

- **INFO:** Detected 3 canonical admin page file(s).
- **INFO:** Detected one layout beneath `app/demo/admin`.
- **CRITICAL:** Detected 199 reference(s) from the audited admin surface to officer, supervisor, department, applicant, or public demo routes.
- **CRITICAL:** Detected 13 redirect/navigation statement(s) that appear to leave the admin workspace.
- **WARNING:** Detected 2 shell/sidebar/top-bar references beneath `app/demo/admin`. Review them to distinguish legitimate layout ownership from page-level nested shells.
- **WARNING:** Detected 4 navigation-related source files. D34-1 must identify one canonical admin navigation definition and prevent desktop/mobile drift.
- **INFO:** Detected 18 shell/layout/sidebar candidate files across app, components, and features.
- **INFO:** Detected 3 top-bar/header candidate files.
- **WARNING:** No filename-based mobile navigation candidate was detected. Mobile navigation may be embedded in another component and requires manual review.
- **WARNING:** Repeated literal admin hrefs were detected. Repetition is not automatically wrong, but D34-1 should centralize them in a typed route contract.

These findings are mechanical indicators. D34-1 must convert the confirmed findings into the canonical navigation and route contract.

## Canonical admin route inventory currently present

| Route | Page file | Inherited layout chain |
|---|---|---|
| `/demo/admin` | `app/demo/admin/page.tsx` | app/layout.tsx<br>app/demo/layout.tsx<br>app/demo/admin/layout.tsx |
| `/demo/admin/workflows/builder` | `app/demo/admin/workflows/builder/page.tsx` | app/layout.tsx<br>app/demo/layout.tsx<br>app/demo/admin/layout.tsx |
| `/demo/admin/workflows` | `app/demo/admin/workflows/page.tsx` | app/layout.tsx<br>app/demo/layout.tsx<br>app/demo/admin/layout.tsx |

## Admin layout inventory

```text
app/demo/admin/layout.tsx
```

### Admin layout ownership evidence

```text
app/demo/admin/layout.tsx:1:import type { ReactNode } from "react";
app/demo/admin/layout.tsx:3:import { AdminWorkspaceShell } from "@/components/demo/workspace-shells";
app/demo/admin/layout.tsx:5:export default function AdminWorkspaceLayout({ children }: { children: ReactNode }) {
app/demo/admin/layout.tsx:6:  return <AdminWorkspaceShell>{children}</AdminWorkspaceShell>;
```

### Navigation source candidates

```text
components/demo/internal-shell/internal-navigation.ts
components/demo/internal-shell/internal-sidebar.tsx
components/demo/role-switch/demo-role-navigation-bridge.tsx
features/demo-engine/navigation/demo-navigation-state.ts
```

### Shell, layout, and sidebar candidates

```text
app/demo/admin/layout.tsx
app/demo/applicant/layout.tsx
app/demo/layout.tsx
app/demo/officer/layout.tsx
app/demo/supervisor/layout.tsx
app/layout.tsx
components/demo/internal-shell/internal-app-shell.tsx
components/demo/internal-shell/internal-shell-boundary.tsx
components/demo/internal-shell/internal-sidebar.tsx
components/demo/internal-shell/role-workspace-shell.tsx
components/demo/officer/individual-case/officer-individual-case-shell.tsx
components/demo/outcomes/controlled-outcome-shell.tsx
components/demo/reports/operational-reports-shell.tsx
components/demo/shell/demo-public-shell.tsx
components/demo/workspace-shells/admin-workspace-shell.tsx
components/demo/workspace-shells/operational-workspace-shell.tsx
features/demo-applicant/components/applicant-workspace-shell.tsx
features/demo-engine/dashboards/config/dashboard-shell-contracts.ts
```

### Top-bar and header candidates

```text
components/demo/internal-shell/internal-page-header.tsx
components/demo/internal-shell/internal-topbar.tsx
components/demo/shell/demo-public-header.tsx
```

### Mobile navigation candidates

_No filename-based mobile navigation candidates were detected._

### Admin-owned route references

```text
features/demo-admin-workflows/components/workflow-builder.tsx:208:          <Link href="/demo/admin/workflows">
features/demo-admin-workflows/components/workflow-overview.tsx:166:          href="/demo/admin/workflows/builder"
features/demo-admin-workflows/components/workflow-overview.tsx:188:        <Link href="/demo/admin/workflows/builder">
features/demo-admin-workflows/components/workflow-overview.tsx:285:                    href={`/demo/admin/workflows/builder?template=${template.id}`}
features/demo-admin-workflows/components/workflow-overview.tsx:313:            <Link href="/demo/admin/workflows/builder">
features/demo-admin-workflows/components/workflow-overview.tsx:341:                      <Link href="/demo/admin/workflows/builder">
features/demo-admin-workflows/components/workflow-overview.tsx:388:                href={`/demo/admin/workflows/builder?template=${template.id}`}
features/demo-admin-workflows/components/workflow-overview.tsx:77:    href: "/demo/admin/workflows/builder",
features/demo-admin-workflows/components/workflow-overview.tsx:83:    href: "/demo/admin/workflows/builder",
features/demo-admin-workflows/components/workflow-overview.tsx:89:    href: "/demo/admin/workflows/builder",
features/demo-admin-workflows/components/workflow-overview.tsx:95:    href: "/demo/admin/workflows/builder",
features/demo-engine/dashboards/admin/admin-dashboard.reference-contract.ts:3:  route: "/demo/admin",
features/demo-engine/dashboards/admin/admin-dashboard.visual-contract.ts:5:  route: "/demo/admin",
features/demo-engine/dashboards/config/dashboard-shell-contracts.ts:48:    "app/demo/admin/layout.tsx",
features/demo-engine/dashboards/data/admin-dashboard.adapter.ts:1304:      "/demo/admin",
features/demo-engine/dashboards/data/admin-dashboard.adapter.ts:204:          "/demo/admin",
features/demo-engine/dashboards/data/admin-dashboard.adapter.ts:221:          "/demo/admin",
features/demo-engine/dashboards/data/admin-dashboard.adapter.ts:235:          "/demo/admin",
features/demo-engine/dashboards/data/admin-dashboard.adapter.ts:249:          "/demo/admin",
features/demo-engine/dashboards/data/admin-dashboard.adapter.ts:320:                  "/demo/admin/workflows",
features/demo-engine/dashboards/data/admin-dashboard.adapter.ts:375:          "/demo/admin",
features/demo-engine/dashboards/data/admin-dashboard.adapter.ts:678:          "/demo/admin",
features/demo-engine/navigation/demo-route-registry.ts:33:    home: "/demo/admin",
features/demo-engine/navigation/demo-route-registry.ts:34:    workflows: "/demo/admin/workflows",
features/demo-engine/navigation/demo-route-registry.ts:35:    workflowBuilder: "/demo/admin/workflows/builder",
features/demo-engine/navigation/demo-route-registry.ts:79:  if (matchesPrefix(normalized, "/demo/admin")) {
```

### Cross-workspace route references

```text
components/demo/department/department-handoff-processing-workspace.tsx:191:            <select className="input-base input-compact" value="/demo/department" onChange={(event) => router.push(event.target.value)}>
components/demo/department/department-handoff-processing-workspace.tsx:192:              <option value="/demo/officer">Officer</option>
components/demo/department/department-handoff-processing-workspace.tsx:193:              <option value="/demo/department">Finance</option>
components/demo/department/department-handoff-processing-workspace.tsx:194:              <option value="/demo/supervisor">Supervisor</option>
components/demo/department/department-handoff-state.ts:158:        href: `/demo/department/handoffs/${referral.id}`,
components/demo/department/department-handoff-state.ts:220:      href: `/demo/department/handoffs/${handoffId}`,
components/demo/department/department-inbox-workspace.tsx:171:            <select className="input-base input-compact" value="/demo/department" onChange={(event) => router.push(event.target.value)}>
components/demo/department/department-inbox-workspace.tsx:172:              <option value="/demo/officer">Officer</option>
components/demo/department/department-inbox-workspace.tsx:173:              <option value="/demo/department">Finance</option>
components/demo/department/department-inbox-workspace.tsx:174:              <option value="/demo/supervisor">Supervisor</option>
components/demo/department/department-processing-dashboard.tsx:540:              href="/demo/officer"
components/demo/department/department-processing-dashboard.tsx:550:              href={`/demo/officer/requests/${referral.requestId}`}
components/demo/department/department-processing-dashboard.tsx:892:                  href={`/demo/officer/requests/${referral.requestId}`}
components/demo/homepage/savannah-homepage.tsx:867:            <Link href="/demo/officer">Staff workspace</Link>
components/demo/homepages/primary-homepage.tsx:260:              <Link href="/demo/officer" className="text-[14px] text-white/85 transition hover:text-white">
components/demo/internal-shell/internal-navigation.ts:106:        href: "/demo/officer",
components/demo/internal-shell/internal-navigation.ts:110:      { label: "My tasks", href: "/demo/officer/tasks", icon: ListChecks },
components/demo/internal-shell/internal-navigation.ts:113:        href: "/demo/officer/documents",
components/demo/internal-shell/internal-navigation.ts:120:        activePrefixes: ["/demo/officer/requests/"],
components/demo/internal-shell/internal-navigation.ts:128:      { label: "Workflow inbox", href: "/demo/department", icon: Inbox },
components/demo/internal-shell/internal-navigation.ts:141:        href: "/demo/department",
components/demo/internal-shell/internal-navigation.ts:161:        href: "/demo/officer/requests/REQ-DEMO-001",
components/demo/internal-shell/internal-navigation.ts:184:      { label: "SLA monitor", href: "/demo/officer/sla-monitor", icon: Clock3 },
components/demo/internal-shell/internal-navigation.ts:199:        href: "/demo/officer/requests/REQ-DEMO-001",
components/demo/internal-shell/internal-navigation.ts:209:  account("/demo/officer"),
components/demo/internal-shell/internal-navigation.ts:218:        href: "/demo/department",
components/demo/internal-shell/internal-navigation.ts:234:      { label: "Incoming", href: "/demo/department", icon: Inbox, exact: true },
components/demo/internal-shell/internal-navigation.ts:247:  account("/demo/department"),
components/demo/internal-shell/internal-navigation.ts:254:      { label: "Audit trail", href: "/demo/supervisor/audit-trail", icon: LayoutDashboard },
components/demo/internal-shell/internal-navigation.ts:255:      { label: "SLA monitor", href: "/demo/supervisor/sla-monitor", icon: LayoutDashboard },
components/demo/internal-shell/internal-navigation.ts:258:        href: "/demo/supervisor",
components/demo/internal-shell/internal-navigation.ts:271:        activePrefixes: ["/demo/supervisor/approvals/"],
components/demo/internal-shell/internal-navigation.ts:279:      { label: "Workflow inbox", href: "/demo/department", icon: Inbox },
components/demo/internal-shell/internal-navigation.ts:287:        href: "/demo/department",
components/demo/internal-shell/internal-navigation.ts:297:        href: "/demo/officer/requests/REQ-DEMO-001",
components/demo/internal-shell/internal-navigation.ts:317:  account("/demo/supervisor"),
components/demo/internal-shell/internal-navigation.ts:398:        href: "/demo/department",
components/demo/internal-shell/internal-navigation.ts:403:        href: "/demo/supervisor",
components/demo/officer/individual-case/officer-individual-case-shell.tsx:171:    `/demo/officer/requests/${encodeURIComponent(
components/demo/officer/individual-case/officer-individual-case-shell.tsx:240:                `/demo/officer/requests/${encodeURIComponent(
components/demo/officer/officer-dashboard.tsx:118:              value="/demo/officer"
components/demo/officer/officer-dashboard.tsx:123:              <option value="/demo/officer">
components/demo/officer/officer-dashboard.tsx:126:              <option value="/demo/department">
components/demo/officer/officer-dashboard.tsx:129:              <option value="/demo/supervisor">
components/demo/officer/officer-request-review.tsx:1148:              value="/demo/officer"
components/demo/officer/officer-request-review.tsx:1155:              <option value="/demo/officer">
components/demo/officer/officer-request-review.tsx:1158:              <option value="/demo/department">
components/demo/officer/officer-request-review.tsx:1161:              <option value="/demo/supervisor">
components/demo/outcomes/controlled-outcome-shell.tsx:103:              <option value="/demo/officer">
components/demo/outcomes/controlled-outcome-shell.tsx:106:              <option value="/demo/department">
components/demo/outcomes/controlled-outcome-shell.tsx:109:              <option value="/demo/supervisor">
components/demo/outcomes/controlled-outcome-shell.tsx:143:                href={`/demo/supervisor/approvals/${requestId}`}
components/demo/outcomes/controlled-outcome-shell.tsx:79:                value={`/demo/supervisor/approvals/${requestId}`}
components/demo/outcomes/controlled-outcome-shell.tsx:98:              value="/demo/supervisor"
components/demo/outcomes/controlled-outcome-workspace.tsx:753:                href="/demo/supervisor"
components/demo/presentation/demo-presentation-frame.tsx:131:  if (pathname === "/demo/officer") {
components/demo/presentation/demo-presentation-frame.tsx:140:      "/demo/officer/requests/",
components/demo/presentation/demo-presentation-frame.tsx:149:  if (pathname === "/demo/department") {
components/demo/presentation/demo-presentation-frame.tsx:156:  if (pathname === "/demo/supervisor") {
components/demo/public/service-information-page.tsx:15:import { ServiceStartPanel } from "@/components/demo/public/service-start-panel";
components/demo/reports/operational-reports-dashboard.tsx:825:                href="/demo/officer"
components/demo/reports/operational-reports-dashboard.tsx:836:                href="/demo/department"
components/demo/reports/operational-reports-shell.tsx:140:              <option value="/demo/supervisor">
components/demo/reports/operational-reports-shell.tsx:143:              <option value="/demo/department">
components/demo/reports/operational-reports-shell.tsx:146:              <option value="/demo/officer">
components/demo/requests/request-review-submission.tsx:371:              href="/demo/officer"
components/demo/shell/demo-public-footer.tsx:75:              href="/demo/officer"
components/demo/shell/demo-public-header.tsx:106:            href="/demo/officer"
components/demo/shell/demo-public-header.tsx:151:                href="/demo/officer"
components/demo/supervisor/supervisor-approval-workspace.tsx:926:                `/demo/supervisor/approvals/${requestId}`
components/demo/supervisor/supervisor-approval-workspace.tsx:954:              value="/demo/supervisor"
components/demo/supervisor/supervisor-approval-workspace.tsx:961:              <option value="/demo/officer">
components/demo/supervisor/supervisor-approval-workspace.tsx:964:              <option value="/demo/department">
components/demo/supervisor/supervisor-approval-workspace.tsx:967:              <option value="/demo/supervisor">
components/demo/supervisor/supervisor-dashboard-workspace.tsx:212:              value="/demo/supervisor"
components/demo/supervisor/supervisor-dashboard-workspace.tsx:219:              <option value="/demo/officer">
components/demo/supervisor/supervisor-dashboard-workspace.tsx:222:              <option value="/demo/department">
components/demo/supervisor/supervisor-dashboard-workspace.tsx:225:              <option value="/demo/supervisor">
features/demo-engine/dashboards/config/dashboard-shell-contracts.ts:23:    "app/demo/officer/layout.tsx",
features/demo-engine/dashboards/config/dashboard-shell-contracts.ts:24:    "app/demo/supervisor/layout.tsx",
features/demo-engine/dashboards/data/officer-dashboard.adapter.ts:318:          href: "/demo/officer/documents",
features/demo-engine/dashboards/data/officer-dashboard.adapter.ts:338:            "/demo/officer/department-inbox",
features/demo-engine/dashboards/data/officer-dashboard.adapter.ts:357:          href: "/demo/officer",
features/demo-engine/dashboards/data/officer-dashboard.adapter.ts:372:          href: "/demo/officer/queue",
features/demo-engine/dashboards/data/officer-dashboard.adapter.ts:388:          href: "/demo/officer",
features/demo-engine/dashboards/data/officer-dashboard.adapter.ts:39:  return `/demo/officer/requests/${requestId}`;
features/demo-engine/dashboards/data/officer-dashboard.adapter.ts:488:          "/demo/officer/sla-monitor",
features/demo-engine/dashboards/data/supervisor-dashboard.adapter.ts:195:          `/demo/supervisor/approvals/${request.requestId}`,
features/demo-engine/dashboards/data/supervisor-dashboard.adapter.ts:209:      "/demo/supervisor/sla-monitor",
features/demo-engine/dashboards/data/supervisor-dashboard.adapter.ts:217:      "/demo/supervisor/sla-monitor",
features/demo-engine/dashboards/data/supervisor-dashboard.adapter.ts:228:      "/demo/supervisor",
features/demo-engine/dashboards/data/supervisor-dashboard.adapter.ts:239:      "/demo/supervisor",
features/demo-engine/dashboards/data/supervisor-dashboard.adapter.ts:260:      "/demo/officer/documents",
features/demo-engine/dashboards/data/supervisor-dashboard.adapter.ts:350:        href: "/demo/supervisor",
features/demo-engine/dashboards/data/supervisor-dashboard.adapter.ts:392:          `/demo/officer/requests/${request.requestId}`,
features/demo-engine/dashboards/data/supervisor-dashboard.adapter.ts:405:        "/demo/supervisor/sla-monitor",
features/demo-engine/dashboards/data/supervisor-dashboard.adapter.ts:416:        "/demo/supervisor",
features/demo-engine/dashboards/data/supervisor-dashboard.adapter.ts:429:        "/demo/supervisor",
features/demo-engine/dashboards/data/supervisor-dashboard.adapter.ts:445:        "/demo/officer/documents",
features/demo-engine/dashboards/data/supervisor-dashboard.adapter.ts:462:        "/demo/officer/documents",
features/demo-engine/dashboards/data/supervisor-dashboard.adapter.ts:475:        "/demo/supervisor",
features/demo-engine/dashboards/data/supervisor-dashboard.adapter.ts:488:        "/demo/supervisor",
features/demo-engine/dashboards/data/supervisor-dashboard.adapter.ts:603:          `/demo/supervisor/approvals/${request.requestId}`,
features/demo-engine/dashboards/data/supervisor-dashboard.adapter.ts:638:          `/demo/officer/requests/${request.requestId}`,
features/demo-engine/dashboards/data/supervisor-dashboard.adapter.ts:791:          "/demo/supervisor/audit-trail",
features/demo-engine/dashboards/officer/officer-dashboard.tsx:179:            href="/demo/officer/department-inbox"
features/demo-engine/dashboards/officer/officer-dashboard.tsx:283:            href="/demo/officer"
features/demo-engine/dashboards/officer/officer-dashboard.visual-contract.ts:5:  route: "/demo/officer",
features/demo-engine/dashboards/supervisor/supervisor-dashboard.tsx:1004:              href="/demo/supervisor/reports"
features/demo-engine/dashboards/supervisor/supervisor-dashboard.tsx:1018:              href="/demo/supervisor/reports"
features/demo-engine/dashboards/supervisor/supervisor-dashboard.tsx:1032:              href="/demo/supervisor/reports"
features/demo-engine/dashboards/supervisor/supervisor-dashboard.tsx:1191:              href="/demo/supervisor/audit"
features/demo-engine/dashboards/supervisor/supervisor-dashboard.tsx:1205:              href="/demo/supervisor/audit-trail"
features/demo-engine/dashboards/supervisor/supervisor-dashboard.tsx:1236:              href="/demo/supervisor/audit"
features/demo-engine/dashboards/supervisor/supervisor-dashboard.tsx:1250:              href="/demo/supervisor/reports"
features/demo-engine/dashboards/supervisor/supervisor-dashboard.tsx:203:          href="/demo/supervisor/approvals"
features/demo-engine/dashboards/supervisor/supervisor-dashboard.tsx:281:          href="/demo/supervisor/approvals"
features/demo-engine/dashboards/supervisor/supervisor-dashboard.tsx:412:              href="/demo/supervisor/assignments"
features/demo-engine/dashboards/supervisor/supervisor-dashboard.tsx:432:          href="/demo/supervisor/team"
features/demo-engine/dashboards/supervisor/supervisor-dashboard.tsx:518:        href="/demo/supervisor/assignments"
features/demo-engine/dashboards/supervisor/supervisor-dashboard.tsx:535:          href="/demo/supervisor/department-queue"
features/demo-engine/dashboards/supervisor/supervisor-dashboard.tsx:599:          href="/demo/supervisor/handoffs"
features/demo-engine/dashboards/supervisor/supervisor-dashboard.tsx:990:              href="/demo/supervisor/reports"
features/demo-engine/dashboards/supervisor/supervisor-dashboard.visual-contract.ts:5:  route: "/demo/supervisor",
features/demo-engine/fixtures/department-handoffs.reference.ts:55:  href: `/demo/department/handoffs/${row[0]}`,
features/demo-engine/fixtures/department-handoffs.reference.ts:64:  { id: "HND-COMPLETE-001", departmentName: "Student Accounts", requestTitle: "Refund Authorization", completedLabel: "May 12, 2026", resultLabel: "Completed", href: "/demo/department/handoffs/HND-DEMO-008" },
features/demo-engine/fixtures/department-handoffs.reference.ts:65:  { id: "HND-COMPLETE-002", departmentName: "Financial Aid Office", requestTitle: "Pell Grant Adjustment", completedLabel: "May 12, 2026", resultLabel: "Completed", href: "/demo/department/handoffs/HND-DEMO-002" },
features/demo-engine/fixtures/department-handoffs.reference.ts:66:  { id: "HND-COMPLETE-003", departmentName: "Admissions Office", requestTitle: "Enrollment Verification", completedLabel: "May 11, 2026", resultLabel: "Completed", href: "/demo/department/handoffs/HND-DEMO-004" },
features/demo-engine/fixtures/officer-dashboard.reference.ts:106:        requestHref: "/demo/officer/requests/REQ-DEMO-002",
features/demo-engine/fixtures/officer-dashboard.reference.ts:121:        requestHref: "/demo/officer/requests/REQ-DEMO-003",
features/demo-engine/fixtures/officer-dashboard.reference.ts:136:        requestHref: "/demo/officer/requests/REQ-DEMO-004",
features/demo-engine/fixtures/officer-dashboard.reference.ts:151:        requestHref: "/demo/officer/requests/REQ-DEMO-005",
features/demo-engine/fixtures/officer-dashboard.reference.ts:167:    allHref: "/demo/department",
features/demo-engine/fixtures/officer-dashboard.reference.ts:177:        href: "/demo/department",
features/demo-engine/fixtures/officer-dashboard.reference.ts:187:        href: "/demo/department",
features/demo-engine/fixtures/officer-dashboard.reference.ts:197:        href: "/demo/department",
features/demo-engine/fixtures/officer-dashboard.reference.ts:207:        href: "/demo/department",
features/demo-engine/fixtures/officer-dashboard.reference.ts:217:        href: "/demo/department",
features/demo-engine/fixtures/officer-dashboard.reference.ts:236:        href: "/demo/officer/requests/REQ-DEMO-001",
features/demo-engine/fixtures/officer-dashboard.reference.ts:249:        href: "/demo/officer/requests/REQ-DEMO-002",
features/demo-engine/fixtures/officer-dashboard.reference.ts:261:        href: "/demo/officer/requests/REQ-DEMO-003",
features/demo-engine/fixtures/officer-dashboard.reference.ts:280:  detailedReportHref: "/demo/officer/sla-monitor",
features/demo-engine/fixtures/officer-dashboard.reference.ts:68:        href: "/demo/department",
features/demo-engine/fixtures/officer-dashboard.reference.ts:91:        requestHref: "/demo/officer/requests/REQ-DEMO-001",
features/demo-engine/fixtures/officer-review.reference.ts:56:        href: "/demo/officer/requests/REQ-DEMO-001",
features/demo-engine/fixtures/officer-review.reference.ts:60:        href: "/demo/officer/requests/REQ-DEMO-002",
features/demo-engine/fixtures/officer-review.reference.ts:64:        href: "/demo/officer/requests/REQ-DEMO-003",
features/demo-engine/fixtures/officer-review.reference.ts:68:        href: "/demo/officer/requests/REQ-DEMO-004",
features/demo-engine/fixtures/officer-review.reference.ts:72:        href: "/demo/officer/requests/REQ-DEMO-005",
features/demo-engine/fixtures/supervisor-approvals.reference.ts:111:        href: "/demo/supervisor/approvals/REQ-DEMO-003",
features/demo-engine/fixtures/supervisor-approvals.reference.ts:127:        href: "/demo/supervisor/approvals/REQ-DEMO-004",
features/demo-engine/fixtures/supervisor-approvals.reference.ts:143:        href: "/demo/supervisor/approvals/REQ-DEMO-005",
features/demo-engine/fixtures/supervisor-approvals.reference.ts:234:        href: "/demo/department",
features/demo-engine/fixtures/supervisor-approvals.reference.ts:243:        href: "/demo/department",
features/demo-engine/fixtures/supervisor-approvals.reference.ts:252:        href: "/demo/officer",
features/demo-engine/fixtures/supervisor-approvals.reference.ts:52:        href: "/demo/department",
features/demo-engine/fixtures/supervisor-approvals.reference.ts:79:        href: "/demo/supervisor/approvals/REQ-DEMO-001",
features/demo-engine/fixtures/supervisor-approvals.reference.ts:95:        href: "/demo/supervisor/approvals/REQ-DEMO-002",
features/demo-engine/navigation/demo-route-registry.ts:14:    workspace: "/demo/applicant",
features/demo-engine/navigation/demo-route-registry.ts:15:    profile: "/demo/applicant/profile",
features/demo-engine/navigation/demo-route-registry.ts:16:    documents: "/demo/applicant/documents",
features/demo-engine/navigation/demo-route-registry.ts:20:    home: "/demo/officer",
features/demo-engine/navigation/demo-route-registry.ts:21:    queue: "/demo/officer/queue",
features/demo-engine/navigation/demo-route-registry.ts:22:    tasks: "/demo/officer/tasks",
features/demo-engine/navigation/demo-route-registry.ts:23:    documents: "/demo/officer/documents",
features/demo-engine/navigation/demo-route-registry.ts:24:    sla: "/demo/officer/sla-monitor",
features/demo-engine/navigation/demo-route-registry.ts:27:    home: "/demo/supervisor",
features/demo-engine/navigation/demo-route-registry.ts:28:    approvals: "/demo/supervisor/approvals",
features/demo-engine/navigation/demo-route-registry.ts:29:    audit: "/demo/supervisor/audit-trail",
features/demo-engine/navigation/demo-route-registry.ts:30:    sla: "/demo/supervisor/sla-monitor",
features/demo-engine/navigation/demo-route-registry.ts:49:  "/demo/applicant",
features/demo-engine/navigation/demo-route-registry.ts:83:  if (matchesPrefix(normalized, "/demo/supervisor")) {
features/demo-engine/navigation/demo-route-registry.ts:87:  if (matchesPrefix(normalized, "/demo/officer")) {
features/demo/roles/demo-workspace-role.tsx:28:  OFFICER: "/demo/officer",
features/demo/roles/demo-workspace-role.tsx:29:  SUPERVISOR: "/demo/supervisor",
features/demo/roles/demo-workspace-role.tsx:56:  if (pathname.startsWith("/demo/supervisor")) {
features/demo/roles/demo-workspace-role.tsx:61:    pathname.startsWith("/demo/officer") ||
features/demo/roles/demo-workspace-role.tsx:62:    pathname.startsWith("/demo/department")
features/demo/roles/demo-workspace-role.tsx:91:  if (pathname.startsWith("/demo/officer")) {
features/demo/roles/demo-workspace-role.tsx:95:  if (pathname.startsWith("/demo/supervisor")) {
features/demo/state/demo-seed.ts:357:        href: "/demo/department/handoffs/HND-DEMO-001",
features/demo/state/demo-seed.ts:368:        href: "/demo/supervisor/approvals/REQ-DEMO-003",
features/demo/view-models/officer-dashboard-view-model.ts:158:    href: `/demo/officer/requests/${id}`,
features/demo/view-models/officer-dashboard-view-model.ts:173:    href: firstText(handoff, ["href"]) ?? "/demo/department",
features/demo/view-models/officer-dashboard-view-model.ts:69:  { id: "REQ-DEMO-001", applicantName: "Grace Wanjiku", serviceName: "Transcript Request", status: "Submitted", statusTone: "info", departmentName: "Student Records", submittedLabel: "Today, 10:24", dueLabel: "Due today", priority: "HIGH", href: "/demo/officer/requests/REQ-DEMO-001" },
features/demo/view-models/officer-dashboard-view-model.ts:70:  { id: "REQ-DEMO-002", applicantName: "Brian Otieno", serviceName: "Student Clearance", status: "Under review", statusTone: "info", departmentName: "Student Records", submittedLabel: "Yesterday, 15:42", dueLabel: "Due tomorrow", priority: "MEDIUM", href: "/demo/officer/requests/REQ-DEMO-002" },
features/demo/view-models/officer-dashboard-view-model.ts:71:  { id: "REQ-DEMO-003", applicantName: "Amina Hassan", serviceName: "Certificate Replacement", status: "Waiting on department", statusTone: "warning", departmentName: "Finance", submittedLabel: "Yesterday, 09:18", dueLabel: "2 days remaining", priority: "HIGH", href: "/demo/officer/requests/REQ-DEMO-003" },
features/demo/view-models/officer-dashboard-view-model.ts:72:  { id: "REQ-DEMO-004", applicantName: "Daniel Kamau", serviceName: "Transcript Request", status: "Completed", statusTone: "success", departmentName: "Student Records", submittedLabel: "18 Jul, 14:06", dueLabel: "Completed today", priority: "LOW", href: "/demo/officer/requests/REQ-DEMO-004" },
features/demo/view-models/officer-dashboard-view-model.ts:73:  { id: "REQ-DEMO-005", applicantName: "Mercy Njeri", serviceName: "Student Clearance", status: "Waiting on applicant", statusTone: "warning", departmentName: "Student Records", submittedLabel: "17 Jul, 11:38", dueLabel: "Overdue by 1 day", priority: "CRITICAL", href: "/demo/officer/requests/REQ-DEMO-005" },
features/demo/view-models/officer-dashboard-view-model.ts:74:  { id: "REQ-DEMO-006", applicantName: "Kelvin Mutiso", serviceName: "Transcript Request", status: "Under review", statusTone: "info", departmentName: "Student Records", submittedLabel: "16 Jul, 08:52", dueLabel: "Due today", priority: "MEDIUM", href: "/demo/officer/requests/REQ-DEMO-006" },
features/demo/view-models/officer-dashboard-view-model.ts:78:  { id: "HND-DEMO-001", requestId: "REQ-DEMO-001", departmentName: "Finance", requestedAction: "Confirm fee-clearance position", status: "Pending acceptance", statusTone: "warning", href: "/demo/department" },
features/demo/view-models/officer-dashboard-view-model.ts:79:  { id: "HND-DEMO-002", requestId: "REQ-DEMO-003", departmentName: "Registrar", requestedAction: "Confirm certificate reissue authority", status: "In progress", statusTone: "info", href: "/demo/department" },
features/demo/view-models/officer-dashboard-view-model.ts:80:  { id: "HND-DEMO-003", requestId: "REQ-DEMO-004", departmentName: "Finance", requestedAction: "Return verified result", status: "Completed", statusTone: "success", href: "/demo/department" },
features/demo/view-models/officer-dashboard-view-model.ts:84:  { id: "MSG-DEMO-001", senderName: "Brian Otieno", senderRole: "Applicant", subject: "Clearance request document", message: "I have uploaded the missing library clearance confirmation.", timestamp: "12 min", href: "/demo/officer/requests/REQ-DEMO-002", unread: true },
features/demo/view-models/officer-dashboard-view-model.ts:85:  { id: "MSG-DEMO-002", senderName: "Miriam Wekesa", senderRole: "Registrar", subject: "Approval requirement", message: "Please confirm the Finance result before forwarding the request.", timestamp: "48 min", href: "/demo/officer/requests/REQ-DEMO-001", unread: false },
features/demo/view-models/officer-dashboard-view-model.ts:86:  { id: "MSG-DEMO-003", senderName: "Finance Desk", senderRole: "Department", subject: "Payment reference", message: "The reference is being checked against the daily collection report.", timestamp: "2 hr", href: "/demo/department", unread: false },
features/demo/view-models/officer-dashboard-view-model.ts:90:  { id: "DDL-DEMO-001", day: "23", month: "Jul", title: "Complete initial transcript review", reference: "REQ-DEMO-001", dueLabel: "Due today", priority: "HIGH", href: "/demo/officer/requests/REQ-DEMO-001" },
features/demo/view-models/officer-dashboard-view-model.ts:91:  { id: "DDL-DEMO-002", day: "24", month: "Jul", title: "Review applicant correction", reference: "REQ-DEMO-005", dueLabel: "Due tomorrow", priority: "CRITICAL", href: "/demo/officer/requests/REQ-DEMO-005" },
features/demo/view-models/officer-dashboard-view-model.ts:92:  { id: "DDL-DEMO-003", day: "25", month: "Jul", title: "Confirm Finance handoff result", reference: "REQ-DEMO-003", dueLabel: "2 days remaining", priority: "MEDIUM", href: "/demo/department" },
```

### Redirect and imperative-navigation evidence

```text
components/demo/controls/presentation-controls.tsx:62:    router.push("/demo");
components/demo/department/department-handoff-processing-workspace.tsx:183:            <select className="input-base input-compact" value={context.row.href} onChange={(event) => router.push(event.target.value)}>
components/demo/department/department-handoff-processing-workspace.tsx:191:            <select className="input-base input-compact" value="/demo/department" onChange={(event) => router.push(event.target.value)}>
components/demo/department/department-inbox-workspace.tsx:163:            <select className="input-base input-compact" value={selectedContext.row.href} onChange={(event) => router.push(event.target.value)}>
components/demo/department/department-inbox-workspace.tsx:171:            <select className="input-base input-compact" value="/demo/department" onChange={(event) => router.push(event.target.value)}>
components/demo/documents/simulated-document-uploader.tsx:243:    router.push(
components/demo/forms/applicant-sign-up-form.tsx:62:    router.push(`/demo/apply/${service.slug}`);
components/demo/forms/configured-service-form.tsx:117:    router.push(`/demo/apply/${service.slug}?step=documents`);
components/demo/officer/individual-case/officer-individual-case-shell.tsx:239:              router.push(
components/demo/officer/officer-dashboard.tsx:120:                router.push(event.target.value)
components/demo/officer/officer-dashboard.tsx:89:                  router.push(href);
components/demo/officer/officer-request-review.tsx:1123:                router.push(
components/demo/officer/officer-request-review.tsx:1150:                router.push(
components/demo/outcomes/controlled-outcome-shell.tsx:100:                router.push(event.target.value)
components/demo/outcomes/controlled-outcome-shell.tsx:70:                router.push(event.target.value)
components/demo/presentation/demo-presentation-frame.tsx:350:    window.location.assign("/demo");
components/demo/reports/operational-reports-shell.tsx:132:                router.push(event.target.value)
components/demo/reports/operational-reports-shell.tsx:59:    router.replace(getDemoRoleHome(role));
components/demo/requests/request-review-submission.tsx:242:      router.replace(
components/demo/requests/request-review-submission.tsx:266:    router.replace(
components/demo/role-switch/demo-role-navigation-bridge.tsx:178:      router.push(destination);
components/demo/supervisor/supervisor-approval-workspace.tsx:929:                router.push(
components/demo/supervisor/supervisor-approval-workspace.tsx:956:                router.push(
components/demo/supervisor/supervisor-dashboard-workspace.tsx:183:                  router.push(
components/demo/supervisor/supervisor-dashboard-workspace.tsx:214:                router.push(
features/demo/roles/demo-workspace-role.tsx:221:      router.push(ROLE_HOME[nextRole]);
features/demo/roles/demo-workspace-role.tsx:83:      window.location.search,
```

### Cross-workspace redirect evidence

```text
components/demo/department/department-handoff-processing-workspace.tsx:183:            <select className="input-base input-compact" value={context.row.href} onChange={(event) => router.push(event.target.value)}>
components/demo/department/department-handoff-processing-workspace.tsx:191:            <select className="input-base input-compact" value="/demo/department" onChange={(event) => router.push(event.target.value)}>
components/demo/department/department-inbox-workspace.tsx:163:            <select className="input-base input-compact" value={selectedContext.row.href} onChange={(event) => router.push(event.target.value)}>
components/demo/department/department-inbox-workspace.tsx:171:            <select className="input-base input-compact" value="/demo/department" onChange={(event) => router.push(event.target.value)}>
components/demo/officer/individual-case/officer-individual-case-shell.tsx:239:              router.push(
components/demo/officer/officer-dashboard.tsx:120:                router.push(event.target.value)
components/demo/officer/officer-dashboard.tsx:89:                  router.push(href);
components/demo/officer/officer-request-review.tsx:1123:                router.push(
components/demo/officer/officer-request-review.tsx:1150:                router.push(
components/demo/supervisor/supervisor-approval-workspace.tsx:929:                router.push(
components/demo/supervisor/supervisor-approval-workspace.tsx:956:                router.push(
components/demo/supervisor/supervisor-dashboard-workspace.tsx:183:                  router.push(
components/demo/supervisor/supervisor-dashboard-workspace.tsx:214:                router.push(
```

### Possible page-level shell ownership

```text
app/demo/admin/layout.tsx:3:import { AdminWorkspaceShell } from "@/components/demo/workspace-shells";
app/demo/admin/layout.tsx:6:  return <AdminWorkspaceShell>{children}</AdminWorkspaceShell>;
```

### Role and workspace resolution evidence

```text
app/demo/layout.tsx:23:        <DemoWorkspaceRoleProvider>
app/demo/layout.tsx:31:        </DemoWorkspaceRoleProvider>
app/demo/layout.tsx:6:import { DemoWorkspaceRoleProvider } from "@/features/demo/roles";
components/demo/controls/role-switcher.tsx:23:    value: "ORGANIZATION_ADMIN",
components/demo/reports/operational-reports-shell.tsx:14:  useDemoWorkspaceRole,
components/demo/reports/operational-reports-shell.tsx:51:    useDemoWorkspaceRole();
components/demo/role-switch/demo-role-navigation-bridge.tsx:126:    const role = resolveDemoRoleFromPath(pathname);
components/demo/role-switch/demo-role-navigation-bridge.tsx:158:    const navigate = (role: DemoWorkspaceRole) => {
components/demo/role-switch/demo-role-navigation-bridge.tsx:19:  type DemoWorkspaceRole,
components/demo/role-switch/demo-role-navigation-bridge.tsx:23:  Record<string, DemoWorkspaceRole>
components/demo/role-switch/demo-role-navigation-bridge.tsx:44:): DemoWorkspaceRole | null {
components/demo/role-switch/demo-role-navigation-bridge.tsx:54:      (role): role is DemoWorkspaceRole =>
components/demo/role-switch/demo-role-navigation-bridge.tsx:82:  role: DemoWorkspaceRole,
components/demo/role-switcher/demo-workspace-switcher.tsx:10:  readonly value: DemoWorkspaceRole;
components/demo/role-switcher/demo-workspace-switcher.tsx:23:  const { role, switchRole } = useDemoWorkspaceRole();
components/demo/role-switcher/demo-workspace-switcher.tsx:34:            event.target.value as DemoWorkspaceRole,
components/demo/role-switcher/demo-workspace-switcher.tsx:4:  useDemoWorkspaceRole,
components/demo/role-switcher/demo-workspace-switcher.tsx:5:  type DemoWorkspaceRole,
components/demo/workspace-shells/admin-workspace-shell.tsx:18: * of this component with the separate dark organization-admin shell without
components/demo/workspace-shells/index.ts:3:} from "./admin-workspace-shell";
components/demo/workspace-shells/index.ts:7:} from "./admin-workspace-shell";
features/demo-engine/dashboards/config/dashboard-shell-contracts.ts:43:  id: "organization-admin",
features/demo-engine/dashboards/config/dashboard-shell-contracts.ts:4:    | "organization-admin";
features/demo-engine/dashboards/config/dashboard-shell-contracts.ts:51:    "components/demo/workspace-shells/admin-workspace-shell.tsx",
features/demo-engine/navigation/demo-navigation-state.ts:13:  readonly role: DemoWorkspaceRole | null;
features/demo-engine/navigation/demo-navigation-state.ts:18:  role: DemoWorkspaceRole,
features/demo-engine/navigation/demo-navigation-state.ts:2:  DemoWorkspaceRole,
features/demo-engine/navigation/demo-route-registry.ts:104:  role: DemoWorkspaceRole,
features/demo-engine/navigation/demo-route-registry.ts:106:  return resolveDemoRoleFromPath(pathname) === role;
features/demo-engine/navigation/demo-route-registry.ts:1:export type DemoWorkspaceRole =
features/demo-engine/navigation/demo-route-registry.ts:40:  Record<DemoWorkspaceRole, string>
features/demo-engine/navigation/demo-route-registry.ts:76:): DemoWorkspaceRole | null {
features/demo-engine/navigation/index.ts:11:  DemoWorkspaceRole,
features/demo/roles/demo-workspace-role.tsx:110:  | DemoWorkspaceRole
features/demo/roles/demo-workspace-role.tsx:14:export type DemoWorkspaceRole =
features/demo/roles/demo-workspace-role.tsx:163:  role: DemoWorkspaceRole,
features/demo/roles/demo-workspace-role.tsx:168:export function DemoWorkspaceRoleProvider({
features/demo/roles/demo-workspace-role.tsx:211:    (nextRole: DemoWorkspaceRole) => {
features/demo/roles/demo-workspace-role.tsx:242:export function useDemoWorkspaceRole() {
features/demo/roles/demo-workspace-role.tsx:247:      "useDemoWorkspaceRole must be used inside DemoWorkspaceRoleProvider.",
features/demo/roles/demo-workspace-role.tsx:24:  "faidia:demo-workspace-role-change";
features/demo/roles/demo-workspace-role.tsx:26:const ROLE_HOME: Record<DemoWorkspaceRole, string> = {
features/demo/roles/demo-workspace-role.tsx:34:  readonly role: DemoWorkspaceRole;
features/demo/roles/demo-workspace-role.tsx:36:  readonly switchRole: (role: DemoWorkspaceRole) => void;
features/demo/roles/demo-workspace-role.tsx:44:): value is DemoWorkspaceRole {
features/demo/roles/demo-workspace-role.tsx:55:): DemoWorkspaceRole {
features/demo/roles/demo-workspace-role.tsx:76:): DemoWorkspaceRole | null {
features/demo/roles/index.ts:3:  DemoWorkspaceRoleProvider,
features/demo/roles/index.ts:5:  useDemoWorkspaceRole,
features/demo/roles/index.ts:6:  type DemoWorkspaceRole,
features/demo/roles/index.ts:7:} from "./demo-workspace-role";
```

### Active-navigation matching evidence

```text
components/demo/controls/homepage-variant-switcher.tsx:35:        const isActive =
components/demo/controls/homepage-variant-switcher.tsx:42:            aria-pressed={isActive}
components/demo/controls/homepage-variant-switcher.tsx:47:              isActive
components/demo/internal-shell/internal-navigation.ts:491:  if (item.exact) return pathname === itemPath;
components/demo/internal-shell/internal-navigation.ts:492:  if (pathname === itemPath) return true;
components/demo/internal-shell/internal-navigation.ts:496:      pathname.startsWith(prefix),
components/demo/internal-shell/internal-sidebar.tsx:46:  const pathname = usePathname();
components/demo/internal-shell/internal-sidebar.tsx:5:import { usePathname } from "next/navigation";
components/demo/presentation/demo-presentation-frame.tsx:101:  if (pathname.startsWith("/demo/services/")) {
components/demo/presentation/demo-presentation-frame.tsx:108:  if (pathname.startsWith("/demo/sign-up")) {
components/demo/presentation/demo-presentation-frame.tsx:115:  if (pathname.startsWith("/demo/apply/")) {
components/demo/presentation/demo-presentation-frame.tsx:11:import { usePathname } from "next/navigation";
components/demo/presentation/demo-presentation-frame.tsx:131:  if (pathname === "/demo/officer") {
components/demo/presentation/demo-presentation-frame.tsx:139:    pathname.startsWith(
components/demo/presentation/demo-presentation-frame.tsx:149:  if (pathname === "/demo/department") {
components/demo/presentation/demo-presentation-frame.tsx:156:  if (pathname === "/demo/supervisor") {
components/demo/presentation/demo-presentation-frame.tsx:164:    pathname.startsWith("/demo/outcomes/")
components/demo/presentation/demo-presentation-frame.tsx:172:  if (pathname === "/demo/reports") {
components/demo/presentation/demo-presentation-frame.tsx:179:  if (pathname.startsWith("/demo/track/")) {
components/demo/presentation/demo-presentation-frame.tsx:196:  const pathname = usePathname();
components/demo/presentation/demo-presentation-frame.tsx:94:  if (pathname === "/demo") {
components/demo/role-switch/demo-role-navigation-bridge.tsx:122:  const pathname = usePathname();
components/demo/role-switch/demo-role-navigation-bridge.tsx:4:  usePathname,
components/demo/shell/demo-public-header.tsx:10:    return pathname === "/demo";
components/demo/shell/demo-public-header.tsx:127:                const isActive = isActivePath(
components/demo/shell/demo-public-header.tsx:136:                    aria-current={isActive ? "page" : undefined}
components/demo/shell/demo-public-header.tsx:13:  return pathname === href || pathname.startsWith(`${href}/`);
components/demo/shell/demo-public-header.tsx:140:                      isActive
components/demo/shell/demo-public-header.tsx:17:  const pathname = usePathname();
components/demo/shell/demo-public-header.tsx:4:import { usePathname } from "next/navigation";
components/demo/shell/demo-public-header.tsx:85:            const isActive = isActivePath(pathname, item.href);
components/demo/shell/demo-public-header.tsx:8:function isActivePath(pathname: string, href: string): boolean {
components/demo/shell/demo-public-header.tsx:91:                aria-current={isActive ? "page" : undefined}
components/demo/shell/demo-public-header.tsx:95:                  isActive
features/demo-applicant/components/applicant-workspace-shell.tsx:15:import { usePathname } from "next/navigation";
features/demo-applicant/components/applicant-workspace-shell.tsx:62:  const pathname = usePathname();
features/demo-applicant/components/applicant-workspace-shell.tsx:95:                ? pathname === "/demo/track"
features/demo-applicant/components/applicant-workspace-shell.tsx:96:                : pathname.startsWith(item.href);
features/demo-engine/dashboards/shared/components/dashboard-tabs.tsx:188:      {activeItem ? (
features/demo-engine/dashboards/shared/components/dashboard-tabs.tsx:191:            `${id}-${activeItem.value}-tab`
features/demo-engine/dashboards/shared/components/dashboard-tabs.tsx:194:          id={`${id}-${activeItem.value}-panel`}
features/demo-engine/dashboards/shared/components/dashboard-tabs.tsx:198:          {activeItem.content}
features/demo-engine/dashboards/shared/components/dashboard-tabs.tsx:66:  const activeItem =
features/demo-engine/dashboards/shared/components/dashboard-tabs.tsx:75:    activeItem?.value ?? "";
features/demo-engine/navigation/demo-route-registry.ts:69:    pathname === prefix ||
features/demo-engine/navigation/demo-route-registry.ts:70:    pathname.startsWith(`${prefix}/`)
features/demo/roles/demo-workspace-role.tsx:100:    pathname === "/demo" ||
features/demo/roles/demo-workspace-role.tsx:101:    pathname.startsWith("/demo/track/")
features/demo/roles/demo-workspace-role.tsx:12:import { usePathname, useRouter } from "next/navigation";
features/demo/roles/demo-workspace-role.tsx:173:  const pathname = usePathname();
features/demo/roles/demo-workspace-role.tsx:56:  if (pathname.startsWith("/demo/supervisor")) {
features/demo/roles/demo-workspace-role.tsx:61:    pathname.startsWith("/demo/officer") ||
features/demo/roles/demo-workspace-role.tsx:62:    pathname.startsWith("/demo/department")
features/demo/roles/demo-workspace-role.tsx:67:  if (pathname === "/demo/reports") {
features/demo/roles/demo-workspace-role.tsx:81:  if (pathname === "/demo/reports") {
features/demo/roles/demo-workspace-role.tsx:91:  if (pathname.startsWith("/demo/officer")) {
features/demo/roles/demo-workspace-role.tsx:95:  if (pathname.startsWith("/demo/supervisor")) {
```

### Route registry and route-contract evidence

```text
features/demo-engine/navigation/demo-navigation-state.ts:3:} from "./demo-route-registry";
features/demo-engine/navigation/index.ts:12:} from "./demo-route-registry";
features/demo-engine/navigation/index.ts:8:} from "./demo-route-registry";
```

### Possible cross-workspace page re-exports

_No cross-workspace page re-exports were mechanically detected._

### Admin-named pages outside app/demo/admin

_No admin-named pages outside the canonical admin route tree were detected._

### Repeated literal admin hrefs

```text
/demo/admin
/demo/admin/workflows
/demo/admin/workflows/builder
/demo/admin/workflows/builder?template=${template.id
```

## Required manual confirmation before D34-1

The following questions require source review and browser verification. Mechanical search alone cannot answer them reliably.

### Shell ownership

- Which component is the sole intended owner of the admin desktop sidebar?
- Which component is the sole intended owner of the admin top bar?
- Does `app/demo/admin/layout.*` render both?
- Does any admin `page.*` render either one again?
- Do nested admin layouts add a second shell or only page-specific context?

### Navigation ownership

- Which file currently defines the visible admin navigation?
- Is the same navigation definition used by desktop and mobile?
- Are admin item icons sourced from the existing icon map?
- Are typography, spacing, hover, and active-state styles shared with the current frozen shell?
- Does any page define a local or alternate admin menu?

### Route ownership

- Does every admin click remain beneath `/demo/admin`?
- Do shared components navigate to supervisor, officer, department, applicant, or public URLs?
- Are there legacy admin aliases that load a different layout?
- Are there redirects that change the workspace role?
- Are any pages implemented by re-exporting another workspace page?

### Role resolution

- How is `ORGANIZATION_ADMIN` selected and persisted?
- Can route navigation cause the role switcher to resolve another role?
- Is workspace selection based on the canonical route, current membership, client state, or a mixture?
- Does a direct refresh of every admin route retain the organization-admin workspace?

### Active navigation

- Is the dashboard an exact match only?
- Are nested routes matched using longest-route precedence?
- Can two items become active for the same pathname?
- Do desktop and mobile active states behave identically?

### Browser route sweep

For every current admin destination:

1. open it from the sidebar;
2. record the resulting URL;
3. refresh the page;
4. use Back and Forward;
5. confirm the sidebar does not change;
6. confirm the top bar does not change;
7. confirm the role does not change;
8. confirm only one item is active;
9. confirm no nested shell appears;
10. confirm no 404 occurs.

## D34-0 conclusions to carry into D34-1

D34-1 must define, in one contract:

- the exact admin navigation section order;
- all visible labels;
- all canonical admin-owned hrefs;
- the existing icon assigned to each item;
- the sole shell owner;
- the sole top-bar owner;
- the desktop/mobile navigation source;
- exact-match and prefix-match rules;
- longest-match precedence;
- permitted legacy redirects;
- prohibited cross-workspace destinations;
- protected files and workspaces.

D34-1 must remain contract-only. It must not yet activate the new sidebar or create the missing route surface.

## Completion record

D34-0 is complete when:

- this audit document exists;
- the baseline commit and branch are recorded;
- current admin pages and layouts are inventoried;
- navigation and shell candidates are listed;
- cross-workspace evidence is recorded;
- role, active-state, redirect, and registry evidence is recorded;
- manual browser checks are documented for execution;
- no application file was modified by the audit script.

