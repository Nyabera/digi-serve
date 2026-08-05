# D34-1 — Admin Navigation Contract

## Status

**COMPLETE — CONTRACT ONLY**

D34-1 defines the canonical admin navigation, route ownership, matching behavior, shell boundaries, and implementation constraints.

It does not activate the navigation or alter any visible page.

## Baseline

| Field | Value |
|---|---|
| Repository | `https://github.com/Nyabera/digi-serve.git` |
| Branch | `demo/d34-admin-navigation-consolidation` |
| D34-1 baseline commit | `1d1a884415491de5d1a1dc47ccec9d8d0f441099` |
| Short baseline | `1d1a884` |
| D34-0 prerequisite | `docs/demo/D34-0-ADMIN-WORKSPACE-SHELL-AUDIT.md` |
| Generated locally | `2026-08-05 14:07:56 EAT` |
| Generated UTC | `2026-08-05T11:07:56Z` |

## Source of truth

The typed source of truth is:

`features/demo-engine/navigation/admin-navigation-contract.ts`

D34-2 through D34-7 must consume or validate against this contract rather than recreating labels or hrefs independently.

## D34 objective

Every canonical admin destination must eventually render beneath one persistent admin workspace shell using:

- one admin sidebar;
- one admin top bar;
- one organization-admin role identity;
- one navigation definition for desktop and mobile;
- admin-owned URLs beneath `/demo/admin`;
- one active-route matching policy;
- no cross-workspace shell bleed.

## Canonical navigation

### OVERVIEW

| Item | Canonical href | Match |
|---|---|---|
| Admin Dashboard | `/demo/admin` | Exact |

### SERVICES

| Item | Canonical href | Match |
|---|---|---|
| Service Catalogue | `/demo/admin/services` | Prefix |
| Service Builder | `/demo/admin/services/builder` | Prefix |
| Forms & Requirements | `/demo/admin/forms-requirements` | Prefix |

### WORKFLOWS

| Item | Canonical href | Match |
|---|---|---|
| Workflow Builder | `/demo/admin/workflows` | Prefix |
| Assignment Rules | `/demo/admin/assignment-rules` | Prefix |
| Approval Rules | `/demo/admin/approval-rules` | Prefix |
| SLA Rules | `/demo/admin/sla-rules` | Prefix |

### PEOPLE & ACCESS

| Item | Canonical href | Match |
|---|---|---|
| Users | `/demo/admin/users` | Prefix |
| Departments | `/demo/admin/departments` | Prefix |
| Roles & Permissions | `/demo/admin/roles-permissions` | Prefix |

### OPERATIONS

| Item | Canonical href | Match |
|---|---|---|
| All Applications | `/demo/admin/applications` | Prefix |
| Unassigned Work | `/demo/admin/unassigned-work` | Prefix |
| Audit Trail | `/demo/admin/audit-trail` | Prefix |

### DOCUMENTS

| Item | Canonical href | Match |
|---|---|---|
| Document Templates | `/demo/admin/document-templates` | Prefix |
| Issued Documents | `/demo/admin/issued-documents` | Prefix |
| QR Verification | `/demo/admin/qr-verification` | Prefix |

### REPORTS

| Item | Canonical href | Match |
|---|---|---|
| Reports Dashboard | `/demo/admin/reports` | Prefix |

### ORGANIZATION

| Item | Canonical href | Match |
|---|---|---|
| Institution Profile | `/demo/admin/institution-profile` | Prefix |
| Branding | `/demo/admin/branding` | Prefix |
| Portal Settings | `/demo/admin/portal-settings` | Prefix |

### ACCOUNT

| Item | Contract type |
|---|---|
| Log Out | Action, not a page route |

## Route-count contract

The canonical visible admin navigation contains:

- **21 page destinations**
- **1 logout action**
- **9 navigation sections**

The phrase “approximately 18 pages” in the visual reference is descriptive rather than the route count. The visible item inventory is authoritative.

## Route ownership

All canonical page destinations must remain beneath:

`/demo/admin`

Admin navigation must not point to:

- `/demo/officer`
- `/demo/supervisor`
- `/demo/department`
- `/demo/applicant`
- `/demo/public`

A shared feature component may be reused, but the browser route and workspace shell must remain admin-owned.

## Shell ownership contract

D34-3 must establish `app/demo/admin/layout.*` as the sole admin workspace boundary.

The canonical admin layout must own:

- the desktop sidebar;
- the mobile navigation wrapper;
- the top bar;
- organization identity;
- organization-admin identity;
- the main content container.

Individual admin pages must render page content only.

They must not render:

- a second workspace shell;
- a second sidebar;
- a second top bar;
- an officer shell;
- a supervisor shell;
- a department shell;
- an applicant shell;
- a public-page wrapper.

## Visual preservation contract

D34 is a navigation and shell-consolidation stage, not a visual redesign.

The implementation must preserve the existing approved:

- icon components;
- icon sizes;
- font family;
- font weights;
- section-label typography;
- item typography;
- sidebar width;
- item spacing;
- hover treatment;
- active treatment;
- collapsed behavior;
- mobile treatment;
- top-bar appearance.

The typed contract uses semantic `iconSlot` values only. It deliberately does not import or replace icon components.

During D34-4, each slot must resolve to the icon component already used by the current admin navigation. Do not select a new icon merely because its semantic name appears suitable.

## Active-route contract

### Dashboard

`/demo/admin` is exact-match only.

It must not remain active on every nested admin page.

### Nested routes

Other items may match:

- their exact href;
- descendants beneath their href.

### Longest-match precedence

Routes must be evaluated from longest href to shortest href.

Example:

`/demo/admin/services/builder`

must activate **Service Builder**, not **Service Catalogue**.

Exactly one route item may be active for a pathname.

Desktop and mobile navigation must use the same matching function.

## Log Out contract

Log Out is an action and must not be represented as a fake page route.

D34-4 may connect it to the existing demo logout behavior, but D34-1 does not alter authentication, session state, or role-switch behavior.

## Desktop and mobile parity

Desktop and mobile navigation must consume the same:

- section order;
- labels;
- hrefs;
- icons;
- permissions;
- active matching;
- visibility rules.

Maintaining separate manually duplicated navigation arrays is prohibited.

## Role-resolution contract

Opening or refreshing a canonical admin route must retain the organization-admin workspace.

Navigation must not cause role resolution to switch to:

- officer;
- supervisor;
- department;
- applicant;
- public.

D34 must not redesign the role switcher. It may only ensure that canonical admin routes resolve and retain the admin workspace.

## Shared page-content rule

A canonical admin page may reuse a shared feature view.

Allowed pattern:

```tsx
import { SharedAuditTrailView } from "@/features/demo/audit/SharedAuditTrailView";

export default function AdminAuditTrailPage() {
  return <SharedAuditTrailView scope="organization" />;
}
```

Prohibited pattern:

```tsx
export { default } from "@/app/demo/supervisor/audit-trail/page";
```

Admin pages must not re-export pages owned by another workspace.

## Legacy route rule

D34-6 may preserve an old admin URL only when it:

1. redirects to a canonical `/demo/admin/**` destination; or
2. renders through the same canonical admin layout.

A legacy route must not retain a conflicting sidebar, top bar, role identity, or navigation source.

## Stage boundaries

### D34-1 may change only

- `features/demo-engine/navigation/admin-navigation-contract.ts`
- `docs/demo/D34-1-ADMIN-NAVIGATION-CONTRACT.md`

### D34-1 must not change

- `app/demo/admin/**`
- `app/demo/officer/**`
- `app/demo/supervisor/**`
- `app/demo/applicant/**`
- department workspace routes;
- public routes;
- shell components;
- top-bar components;
- mobile navigation;
- role-switch components;
- global CSS;
- Tailwind configuration;
- design tokens;
- D32 or D33 documents.

## D34-2 handoff

D34-2 must create or confirm a functional App Router page for every href in `ADMIN_ROUTE_HREFS`.

D34-2 must not activate the new visible sidebar.

Do not begin D34-3 until all 21 canonical admin page destinations load directly without a 404.

## D34-1 acceptance criteria

D34-1 passes when:

1. D34-0 exists and is committed.
2. The typed contract file exists.
3. This contract document exists.
4. Exactly 21 unique page hrefs are defined.
5. Every page href begins with `/demo/admin`.
6. The dashboard href is exactly `/demo/admin`.
7. Log Out is an action, not a route.
8. All nine section labels match the approved inventory.
9. Longest-match active-route precedence is recorded.
10. Prohibited workspace prefixes are recorded.
11. Icon preservation is mandatory.
12. No visible admin UI file changes.
13. No officer, supervisor, applicant, department, or public file changes.
14. No CSS or design-token changes.

## Completion record

D34-1 is complete at the commit that adds:

- `features/demo-engine/navigation/admin-navigation-contract.ts`
- `docs/demo/D34-1-ADMIN-NAVIGATION-CONTRACT.md`

Record that commit before starting D34-2.
