# D32-1 — Officer Navigation Contract

**Stage:** D32-1

**Mode:** Contract only

**Baseline:** D32-0 at `2499e0195a28ab3789686ae4d56df18a598946a6`

**Branch:** `demo/d32-officer-navigation-consolidation`

## Purpose

D32-1 establishes one authoritative, typed officer navigation and route contract before any missing officer pages are created or the visible sidebar consumes the new structure. It locks group and item ordering, labels, stable IDs, route keys, canonical officer-owned destinations, icon components, active-state ownership, legacy SLA aliases, and the distinction between navigation and actions.

The source of truth is `features/demo-engine/navigation/officer-navigation-contract.ts`. `DEMO_ROUTES.officer` derives its canonical values from constants exported by that module; it does not duplicate the route strings.

## D32-0 problems addressed

D32-0 found that the current visible officer sidebar mixes officer, department, supervisor, public, hash-only, legacy, and hard-coded-request destinations. The route registry and sidebar are also independent definitions. These conflicts allow navigation clicks to leave the officer route tree and replace the officer shell.

D32-1 addresses the contract layer only:

- every canonical route is officer-owned under `/demo/officer`;
- hash fragments, query strings, public routes, cross-workspace routes, and hard-coded request IDs are excluded;
- the route registry consumes the same officer route constants;
- exact matching and descendant ownership are explicit;
- both existing SLA aliases are recorded without adding redirects;
- Log Out is modelled as an action with no canonical href.

It deliberately does not change the live sidebar, page tree, layouts, shell ownership, top bar, role resolution, role-switcher behavior, or visual design.

## Canonical navigation table

| Order | Group                   | Group ID                | Item                  | Stable item ID          | Kind   |
| ----: | ----------------------- | ----------------------- | --------------------- | ----------------------- | ------ |
|     1 | Operations              | `operations`            | Dashboard             | `dashboard`             | Route  |
|     2 | Operations              | `operations`            | My Tasks              | `my-tasks`              | Route  |
|     3 | Operations              | `operations`            | Application Queue     | `application-queue`     | Route  |
|     4 | Operations              | `operations`            | SLA Monitor           | `sla-monitor`           | Route  |
|     5 | Operations              | `operations`            | Overdue Tasks         | `overdue-tasks`         | Route  |
|     6 | Workflow                | `workflow`              | Workflow Inbox        | `workflow-inbox`        | Route  |
|     7 | Workflow                | `workflow`              | Approval Queue        | `approval-queue`        | Route  |
|     8 | Workflow                | `workflow`              | Returned to Applicant | `returned-to-applicant` | Route  |
|     9 | Documents               | `documents`             | Document Review       | `document-review`       | Route  |
|    10 | Documents               | `documents`             | Generated PDFs        | `generated-pdfs`        | Route  |
|    11 | Documents               | `documents`             | Issued Documents      | `issued-documents`      | Route  |
|    12 | Documents               | `documents`             | QR Verification       | `qr-verification`       | Route  |
|    13 | Communication & Account | `communication-account` | Applicant Messages    | `applicant-messages`    | Route  |
|    14 | Communication & Account | `communication-account` | Internal Notes        | `internal-notes`        | Route  |
|    15 | Communication & Account | `communication-account` | Log Out               | `log-out`               | Action |

## Canonical route table

| Route key             | Item                  | Canonical href                           | Exact match |
| --------------------- | --------------------- | ---------------------------------------- | ----------- |
| `home`                | Dashboard             | `/demo/officer`                          | Yes         |
| `tasks`               | My Tasks              | `/demo/officer/tasks`                    | Yes         |
| `queue`               | Application Queue     | `/demo/officer/queue`                    | No          |
| `sla`                 | SLA Monitor           | `/demo/officer/sla-monitor`              | No          |
| `overdueTasks`        | Overdue Tasks         | `/demo/officer/tasks/overdue`            | No          |
| `workflowInbox`       | Workflow Inbox        | `/demo/officer/workflow`                 | No          |
| `approvalQueue`       | Approval Queue        | `/demo/officer/workflow/approvals`       | No          |
| `returnedToApplicant` | Returned to Applicant | `/demo/officer/workflow/returned`        | No          |
| `documentReview`      | Document Review       | `/demo/officer/documents/review`         | No          |
| `generatedPdfs`       | Generated PDFs        | `/demo/officer/documents/generated`      | No          |
| `issuedDocuments`     | Issued Documents      | `/demo/officer/documents/issued`         | No          |
| `qrVerification`      | QR Verification       | `/demo/officer/documents/verification`   | No          |
| `applicantMessages`   | Applicant Messages    | `/demo/officer/communications/applicant` | No          |
| `internalNotes`       | Internal Notes        | `/demo/officer/communications/internal`  | No          |

`/demo/officer/documents` remains exposed as the non-navigation compatibility constant `OFFICER_NON_NAVIGATION_ROUTES.documentsHub` because the existing `D30_10E_ROUTE_IDS.officerDocuments` contract still consumes it. It is not a canonical D32 navigation item.

## Icon assignment table

All icons use `lucide-react`. Existing assignments are preserved for every matching live officer item. `QR Verification` did not exist in the live officer navigation and receives the Lucide `QrCode` symbol.

| Item                  | Lucide symbol       | Assignment status  |
| --------------------- | ------------------- | ------------------ |
| Dashboard             | `LayoutDashboard`   | Preserved          |
| My Tasks              | `ListChecks`        | Preserved          |
| Application Queue     | `ClipboardCheck`    | Preserved          |
| SLA Monitor           | `Clock3`            | Preserved          |
| Overdue Tasks         | `Clock3`            | Preserved          |
| Workflow Inbox        | `Inbox`             | Preserved          |
| Approval Queue        | `ShieldCheck`       | Preserved          |
| Returned to Applicant | `Clock3`            | Preserved          |
| Document Review       | `FileText`          | Preserved          |
| Generated PDFs        | `FileCheck2`        | Preserved          |
| Issued Documents      | `FileCheck2`        | Preserved          |
| QR Verification       | `QrCode`            | New canonical item |
| Applicant Messages    | `MessageSquareText` | Preserved          |
| Internal Notes        | `StickyNote`        | Preserved          |
| Log Out               | `LogOut`            | Preserved          |

## Active-state ownership table

| Item                  | Canonical self-match  |          Exact | Owned descendant prefixes                                        |
| --------------------- | --------------------- | -------------: | ---------------------------------------------------------------- |
| Dashboard             | `/demo/officer`       |            Yes | None                                                             |
| My Tasks              | `/demo/officer/tasks` |            Yes | None                                                             |
| Application Queue     | `/demo/officer/queue` |             No | `/demo/officer/requests/**` via prefix `/demo/officer/requests/` |
| All other route items | Their canonical href  |             No | None in D32-1                                                    |
| Log Out               | Not applicable        | Not applicable | None                                                             |

D32-1 records active ownership but does not modify `isInternalNavigationItemActive` or the live sidebar.

## Legacy alias table

| Legacy path                 | Canonical path              | D32-1 behavior                                          |
| --------------------------- | --------------------------- | ------------------------------------------------------- |
| `/demo/officer/sla`         | `/demo/officer/sla-monitor` | Metadata and resolver only; existing redirect untouched |
| `/demo/officer/reports/sla` | `/demo/officer/sla-monitor` | Metadata and resolver only; existing redirect untouched |

The aliases are not canonical navigation hrefs. No new redirect is created in D32-1.

## Route-versus-action distinction

Fourteen items have `kind: "route"`, a unique `routeKey`, and a unique canonical `href`. Log Out has `kind: "action"` and `action: "logout"`. Its type intentionally has no `href` or `routeKey`.

This prevents public `/demo` from being mistaken for a canonical officer logout destination. D32-1 does not implement authentication or logout behavior.

## Files changed

- `features/demo-engine/navigation/officer-navigation-contract.ts` — authoritative typed contract, canonical route constants, compatibility route constant, icons, active metadata, SLA alias metadata, and alias resolver.
- `features/demo-engine/navigation/demo-route-registry.ts` — derives `DEMO_ROUTES.officer` values from the contract module.
- `tests/demo/unit/officer-navigation-contract.test.ts` — focused contract tests.
- `docs/demo/D32-1-OFFICER-NAVIGATION-CONTRACT.md` — this specification and D32-2 handoff.

## Files deliberately not changed

- `components/demo/internal-shell/internal-navigation.ts` — the visible `officerNavigation` array remains untouched.
- `components/demo/internal-shell/internal-sidebar.tsx`
- `components/demo/internal-shell/internal-app-shell.tsx`
- `components/demo/internal-shell/internal-topbar.tsx`
- `features/demo/roles/demo-workspace-role.tsx`
- `components/demo/role-switch/**`
- `app/demo/officer/**`
- every applicant, department, supervisor, admin, and public workspace file
- all CSS and visual-design files
- `package.json` and `package-lock.json`

## D32-1 acceptance checklist

- [x] Exactly four groups are defined in the required order.
- [x] Exactly fifteen items are defined in the required order.
- [x] Fourteen items are routes and one item is an action.
- [x] Labels, group IDs, item IDs, and route keys are locked.
- [x] IDs, route keys, and canonical hrefs are unique.
- [x] All canonical hrefs are clean `/demo/officer` routes.
- [x] No canonical href contains a hash, query, hard-coded request ID, public route, report route, outcome route, or another workspace route.
- [x] Existing matching Lucide assignments are preserved and documented.
- [x] Application Queue owns `/demo/officer/requests/**`.
- [x] Dashboard and My Tasks carry exact-match metadata.
- [x] Both SLA aliases resolve to the canonical SLA route in contract metadata.
- [x] `DEMO_ROUTES.officer` consumes the shared route constants.
- [x] Log Out has no canonical officer href.
- [x] The live sidebar and all protected files remain unchanged.
- [x] No missing route page, redirect, shell, role-switcher behavior, CSS, or visual change is implemented.

## D32-2 handoff notes

D32-2 may create the missing officer-owned route pages required by the canonical hrefs. It should import route metadata from this contract rather than defining new route strings or another officer navigation object.

Before the visible sidebar is migrated, D32-2 should:

1. inventory which canonical hrefs already have pages and which require body-only route pages;
2. keep all new destinations beneath `app/demo/officer/**` so they inherit the existing officer layout;
3. reuse feature-body components rather than mounting additional complete shells;
4. preserve the existing live sidebar, top bar, role switcher, branding, typography, colours, and interaction styling until the designated sidebar-consumption stage;
5. retain the two SLA aliases without adding unrelated aliases;
6. avoid treating `/demo/officer/documents` compatibility support as a sixteenth navigation item;
7. leave Log Out as an unimplemented action until authentication/logout work is explicitly scoped.

D32-1 itself stops at the contract and does not begin this work.
