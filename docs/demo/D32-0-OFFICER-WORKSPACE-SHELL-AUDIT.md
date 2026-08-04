# D32-0 — Officer Workspace Shell Audit

**Stage:** D32-0  
**Mode:** Audit only  
**Branch audited:** `demo/d32-officer-navigation-consolidation`  
**Branch baseline:** `73f0df06e0a04189fa256a1c215e6d85adf544eb`  
**Canonical officer navigation for D32-1 onward:** supplied in the D32 brief; not implemented in this stage.

## Executive summary

Officer navigation is inconsistent because route ownership, shell ownership, navigation ownership, and role ownership are not aligned.

All routes below `/demo/officer/**` inherit `app/demo/officer/layout.tsx`, which mounts `OperationalWorkspaceShell` → `RoleWorkspaceShell` → `InternalAppShell` with role `OFFICER`. That is the intended officer workspace boundary. However, several officer page components predate that layout and still mount a complete `InternalAppShell` themselves. `InternalShellBoundaryProvider` currently prevents the nested shell from rendering a second sidebar/top bar, but it does not remove the duplicate ownership or guarantee safety if a component is reused outside the officer layout.

The current officer sidebar also sends users outside the officer route tree:

- `Workflow inbox` and `Shared workflows` go to `/demo/department`, whose page mounts a complete `DEPARTMENT` shell.
- `Issued documents` goes to `/demo/outcomes/REQ-DEMO-001`, whose page mounts a complete `SUPERVISOR` shell.
- `Help centre` and `Log out` go to public `/demo` content.
- the later canonical `QR Verification` destination exists only as public `/demo/verify-certificate`, with a public header rather than the officer shell.
- multiple items are hash links back to `/demo/officer`; hash items are explicitly never active.
- `/demo/officer/queue` exists, but the sidebar's `Application queue` item does not use it.

There are also two independent role systems with different types, storage keys, home routes, and path rules:

1. `features/demo/roles/demo-workspace-role.tsx` uses uppercase roles and `faidia.demo-engine.role.v1`.
2. `features/demo-engine/navigation/demo-route-registry.ts` plus `DemoRoleNavigationBridge` use lowercase roles and `faidia-demo-role`.

Their route coverage disagrees, especially for `/demo/department`, `/demo/outcomes/**`, `/demo/verify-certificate`, and `/demo/reports`. This makes role-switcher state dependent on session history for some routes and creates observable differences between direct refresh and client-side navigation.

The implementation direction for D32-1 onward should be: keep one officer layout-owned shell, keep the existing visual shell primitives unchanged, move every canonical officer destination under `/demo/officer/**`, render feature bodies beneath that layout, centralize officer navigation/route metadata, and make both role-resolution consumers use one registry.

## Route inventory

### Officer-prefixed routes

| Route | Page file | Rendered body or behavior | Inherited shell | Page mounts another shell? | Finding |
|---|---|---|---|---|---|
| `/demo/officer` | `app/demo/officer/page.tsx` | `OfficerDashboardHighFidelity` with `embedded` | Officer shell from `app/demo/officer/layout.tsx` | No | Correct layout ownership; dashboard is explicitly configured as an embedded body. |
| `/demo/officer/tasks` | `app/demo/officer/tasks/page.tsx` | `OfficerTasksWorkspace` | Officer shell | No | Appropriate body-only route. Reads `filter`, `status`, or `due` query values. |
| `/demo/officer/queue` | `app/demo/officer/queue/page.tsx` | `OfficerTasksWorkspace` | Officer shell | No | Duplicate route/body alias for tasks. Not used by the current `Application queue` sidebar item. |
| `/demo/officer/documents` | `app/demo/officer/documents/page.tsx` | `OfficerDocumentHub` | Officer shell | No | Body-only route. `tab=issued|review|verifications` chooses the initial tab. |
| `/demo/officer/sla-monitor` | `app/demo/officer/sla-monitor/page.tsx` | `OfficerSlaWorkspaceFixed` | Officer shell | No | Current canonical SLA body route. |
| `/demo/officer/sla` | `app/demo/officer/sla/page.tsx` | Server redirect to `/demo/officer/sla-monitor` | Officer shell before redirect resolution | No | Legacy alias. Keep only as a compatibility redirect if still required. |
| `/demo/officer/reports/sla` | `app/demo/officer/reports/sla/page.tsx` | Server redirect to `/demo/officer/sla-monitor` | Officer shell before redirect resolution | No | Second legacy alias with an unnecessary `reports` segment. |
| `/demo/officer/requests/[requestId]` | `app/demo/officer/requests/[requestId]/page.tsx` | `OfficerIndividualCaseShell` | Officer shell | **Yes:** `OfficerIndividualCaseShell` mounts `InternalAppShell` | Nested shell is suppressed by `InternalShellBoundaryProvider`; ownership remains duplicated. |
| `/demo/officer/requests/[requestId]?view=refer` | Same page; delegates to `share-workflow-referral-page.tsx` | `ExternalRecipientSharePanel` plus `OfficerRequestReview` | Officer shell | **Yes:** `OfficerRequestReview` mounts `InternalAppShell` | Query-driven alternate page rather than a distinct route; nested shell suppression is required. |

### Officer navigation destinations outside the officer route tree

| Destination | Entered from officer UI | Actual owner | Resulting shell/header |
|---|---|---|---|
| `/demo/department` | `Workflow inbox`, `Shared workflows`, officer dashboard fixtures/view models, task quick links, and legacy role selectors | `app/demo/department/page.tsx` → `DepartmentInboxWorkspace` | Complete `InternalAppShell` with role `DEPARTMENT`, department sidebar, department identity, and shared internal top bar. |
| `/demo/department/handoffs/[handoffId]` | Department handoff rows after entering the department tree | `app/demo/department/handoffs/[handoffId]/page.tsx` → `DepartmentHandoffProcessingWorkspace` | Complete `DEPARTMENT` shell mounted by the page component. |
| `/demo/outcomes/[requestId]` | Officer `Issued documents` navigation item | `app/demo/outcomes/[requestId]/page.tsx` → `ControlledOutcomeShell` | Complete `InternalAppShell` with role `SUPERVISOR`; the officer sidebar is replaced. |
| `/demo/verify-certificate` | Required later for canonical `QR Verification`; public homepage already links here | `app/demo/verify-certificate/page.tsx` → `PublicVerificationPage` | Standalone public page with `PublicVerificationPage`'s own public header/nav/footer; no officer shell. |
| `/demo` | Officer `Log out`, brand link, Help Centre/FAQ fragments | `app/demo/page.tsx` | Public demo homepage under only the global demo presentation frame. |
| `/demo/reports` | Officer reference fixture contains a report action | `app/demo/reports/page.tsx` → `OperationalReportsShell` | Role-dependent supervisor/admin shell; officer is redirected away by `OperationalReportsShell`. |
| `/demo/supervisor` | Legacy page-specific role selectors in `OfficerDashboard` and `OfficerRequestReview` | Supervisor route tree | Supervisor layout-owned shell. These selectors are not the live top-bar selector because `InternalAppShell` replaces the supplied `roleSelector`. |

### Referenced officer paths with no matching App Router page

| Path | Reference | Finding |
|---|---|---|
| `/demo/officer/department-inbox` | `features/demo-engine/dashboards/officer/officer-dashboard.tsx` | No page exists. This component is not the current high-fidelity dashboard page, but reuse would produce a 404. |
| `/demo/officer/reports` | Implied parent of legacy `/demo/officer/reports/sla` | No parent page exists. Only the nested SLA redirect exists. |

## Layout inheritance map

All demo routes inherit these common layers:

1. `app/layout.tsx` — global fonts, metadata, `globals.css`, and `<html>/<body>`.
2. `app/demo/layout.tsx` — `ActiveDemoPackProvider`, `DemoStateProvider`, `DemoWorkspaceRoleProvider`, skip link, `DemoPresentationFrame`, `DemoControlBar`, and `DemoRoleNavigationBridge`.

Officer-prefixed routes add:

3. `app/demo/officer/layout.tsx` (`OfficerWorkspaceLayout`) — `OperationalWorkspaceShell role="officer"`.
4. `components/demo/workspace-shells/operational-workspace-shell.tsx` (`OperationalWorkspaceShell`) — delegates to `RoleWorkspaceShell`.
5. `components/demo/internal-shell/role-workspace-shell.tsx` (`RoleWorkspaceShell`) — maps `officer` to shell role `OFFICER`, Grace Wanjiku, and Student Records Officer.
6. `components/demo/internal-shell/internal-app-shell.tsx` (`InternalAppShell`) — owns the actual sidebar, top bar, mobile drawer state, collapse state, and content frame.

The resulting officer layout chain is:

`RootLayout` → `DemoLayout` → `OfficerWorkspaceLayout` → `OperationalWorkspaceShell` → `RoleWorkspaceShell` → outer `InternalAppShell` → officer page body.

Routes that leave `/demo/officer/**` lose layers 3–6. They then rely on their own route layout or a page-mounted shell:

- `/demo/department/**` has no `department/layout.tsx`; each department workspace component mounts its own `InternalAppShell`.
- `/demo/outcomes/**` has no outcome layout; `ControlledOutcomeShell` mounts a supervisor `InternalAppShell`.
- `/demo/verify-certificate` mounts a standalone public page.
- `/demo/supervisor/**` inherits `app/demo/supervisor/layout.tsx` and a supervisor `OperationalWorkspaceShell`.
- `/demo/admin/**` inherits `app/demo/admin/layout.tsx` and `AdminWorkspaceShell`.
- `/demo/applicant/**` inherits a separate, bespoke `ApplicantWorkspaceShell`.

## Shell ownership map

| Owner | Symbols | Intended scope | Current officer impact |
|---|---|---|---|
| Route layout | `OfficerWorkspaceLayout`, `OperationalWorkspaceShell`, `RoleWorkspaceShell` | All `/demo/officer/**` pages | Correct canonical owner. |
| Shared internal shell | `InternalAppShell` | One complete internal workspace frame | Outer officer shell is correct, but legacy pages also call it. |
| Nested-shell guard | `InternalShellBoundaryProvider`, `useInternalShellBoundary` in `components/demo/internal-shell/internal-shell-boundary.tsx` | Prevent a nested `InternalAppShell` from rendering another frame | Masks duplicate shell mounting in individual-case and referral pages. |
| Page-level officer shell | `OfficerIndividualCaseShell` | Individual case feature | Calls `InternalAppShell role="OFFICER"`; suppressed only when nested beneath an active boundary. |
| Page-level officer shell | `OfficerRequestReview` | Review/referral feature | Calls `InternalAppShell role="OFFICER"`; suppressed beneath officer layout. |
| Unused/legacy officer shell | `OfficerDashboard` in `components/demo/officer/officer-dashboard.tsx` | Older dashboard composition | Calls `InternalAppShell role="OFFICER"`; not used by `app/demo/officer/page.tsx`, but unsafe if reintroduced as a complete page. |
| Department page shell | `DepartmentInboxWorkspace`, `DepartmentHandoffProcessingWorkspace` | Finance/department workspace | Officer links entering `/demo/department` intentionally replace the officer shell with `DEPARTMENT`. |
| Outcome page shell | `ControlledOutcomeShell` | Registrar-controlled issuance | Officer `Issued documents` link replaces officer shell with `SUPERVISOR`. |
| Reports page shell | `OperationalReportsShell` | Supervisor/admin reports | Rejects officer role and routes it to the officer home. |
| Applicant shell | `ApplicantWorkspaceShell` | `/demo/applicant/**` | Separate implementation; protected from D32 changes. |

`InternalAppShell` ignores its caller-supplied `roleSelector` prop. Although `InternalAppShellProps` declares `roleSelector`, the implementation does not destructure it and always passes `<DemoWorkspaceSwitcher />` to `InternalTopbar`. Consequently, legacy selectors built inside `OfficerDashboard`, `OfficerRequestReview`, department workspaces, and `ControlledOutcomeShell` are dead top-bar inputs. This is a separate ownership smell, even though the visible shared role switcher is currently preserved.

## Sidebar inventory

### Shared internal sidebar

- **File:** `components/demo/internal-shell/internal-sidebar.tsx`
- **Component:** `InternalSidebar`
- **Navigation source:** `getInternalNavigation(role)` from `components/demo/internal-shell/internal-navigation.ts`
- **Active source:** `usePathname()` plus `isInternalNavigationItemActive`
- **Desktop behavior:** same `<aside>`; supports collapse through `sidebarCollapsed` owned by `InternalAppShell`.
- **Mobile behavior:** same `<aside>` and same navigation array; drawer visibility is controlled by `mobileSidebarOpen`, `drawerBackdrop`, and the mobile close button.
- **Brand destination:** `/demo`, which exits the officer tree.

The shared sidebar has five role-specific arrays in one file: `applicantNavigation`, `officerNavigation`, `departmentNavigation`, `supervisorNavigation`, and `adminNavigation`. Officer pages receive `officerNavigation` only while the rendered `InternalAppShell` role is `OFFICER`.

### Officer sidebar definition currently rendered

- **File:** `components/demo/internal-shell/internal-navigation.ts`
- **Constant:** `officerNavigation`
- **Selector:** `getInternalNavigation("OFFICER")`
- **Groups:** Operations, Workflow, Documents, SLA, Communication, Account.
- **Current count:** 26 items, including items excluded from the later 15-item canonical specification.

Notable current destinations:

- `Application queue` → `/demo/officer#application-queue`, despite `/demo/officer/queue` existing.
- `Workflow inbox` and `Shared workflows` → `/demo/department`.
- `Issued documents` → `/demo/outcomes/REQ-DEMO-001`.
- `Document review` and `Internal notes` → one hard-coded request, `/demo/officer/requests/REQ-DEMO-001`.
- `My profile` and `Settings` → hash fragments on `/demo/officer`.
- `Help centre` and `Log out` → public `/demo` destinations.

### Other sidebar implementations encountered by officer links

- `DEPARTMENT` uses `departmentNavigation` through the same `InternalSidebar`, but with a different route tree and identity.
- `SUPERVISOR` outcomes use `supervisorNavigation` through the same `InternalSidebar`.
- `PublicVerificationPage` uses its own horizontal public nav, not `InternalSidebar`.
- `ApplicantWorkspaceShell` has a completely separate local `navigation` array and bespoke responsive sidebar. It is protected and must not be consolidated as part of D32.

## Top-bar inventory

### Canonical internal top bar

- **File:** `components/demo/internal-shell/internal-topbar.tsx`
- **Component:** `InternalTopbar`
- **Owner:** `InternalAppShell`
- **Contents:** mobile menu button, `InternalGlobalSearch`, optional request selector, `DemoWorkspaceSwitcher`, optional presentation/reset actions, notifications, and `InternalUserMenu`.
- **Officer identity source:** `ROLE_SHELL_CONFIG.officer` in `role-workspace-shell.tsx`.

### Top bars/headers reached from officer navigation

| Route tree | Header owner | Difference from officer top bar |
|---|---|---|
| `/demo/officer/**` | Outer layout `InternalAppShell` → `InternalTopbar` | Canonical officer appearance and identity. |
| `/demo/department/**` | Page-level department `InternalAppShell` → `InternalTopbar` | Department identity, department sidebar, optional request selector/action controls. |
| `/demo/outcomes/**` | `ControlledOutcomeShell` → supervisor `InternalAppShell` → `InternalTopbar` | Supervisor identity/sidebar and outcome request selector. |
| `/demo/verify-certificate` | `PublicVerificationPage` local `<header>` | Public brand/header/navigation; no role switcher or internal user menu. |
| `/demo/applicant/**` | `ApplicantWorkspaceShell` local `<header>` | Entirely separate applicant header and navigation implementation. |

## Navigation-definition inventory

| File/symbol | Responsibility | Conflict or duplication |
|---|---|---|
| `components/demo/internal-shell/internal-navigation.ts` / `officerNavigation` | Visible officer sidebar labels, icons, links, badges, active prefixes | Primary visible source, but contains cross-workspace, hash-only, and hard-coded request links. |
| Same file / `getInternalNavigation` | Selects the role-specific sidebar definition | Defaults to officer for any role not matched explicitly. |
| Same file / `isInternalNavigationItemActive` | Active item calculation | Hash links can never be active; no general descendant matching. |
| `features/demo-engine/navigation/demo-route-registry.ts` / `DEMO_ROUTES` | Central-looking public/applicant/officer/supervisor/admin route map | Does not drive `officerNavigation`; omits officer request routes, legacy aliases, department, outcomes, and several standalone routes. |
| Same file / `DEMO_ROLE_HOME_ROUTES` | Lowercase role homes used by `DemoRoleNavigationBridge` | Applicant home is `/demo/track`; admin home is `/demo/admin`. |
| `features/demo/roles/demo-workspace-role.tsx` / local `ROLE_HOME` | Uppercase role homes used by live `DemoWorkspaceSwitcher` | Applicant home is `/demo/track/REQ-DEMO-001`; admin home is `/demo/reports?scope=institution`, conflicting with the registry. |
| `components/demo/role-switcher/demo-workspace-switcher.tsx` / `ROLES` | Live select rendered by `InternalAppShell` | Uses uppercase provider roles. |
| `components/demo/controls/role-switcher.tsx` / `roles` | Legacy demo-state role selector in `DemoControlBar` | Changes `DemoStateProvider` state only; navigation is supplied indirectly by bridge DOM interception. Admin value is `ORGANIZATION_ADMIN`, unlike both other systems. |
| `components/demo/role-switch/demo-role-navigation-bridge.tsx` / `ROLE_NAMES`, `isViewAsSelect`, `navigate` | Observes path and globally intercepts native/custom role selectors | Relies on text/DOM heuristics and lowercase registry homes; duplicates the provider's direct role-switch logic. |
| `features/demo-engine/fixtures/officer-dashboard.reference.ts` | Older officer dashboard action links | Contains `/demo/department` and `/demo/reports` cross-workspace links and hash queue links. |
| `features/demo/view-models/officer-dashboard-view-model.ts` | Older officer body links | Contains department handoff links and request links. |
| `features/demo-engine/dashboards/data/officer-dashboard.adapter.ts` | Adapter-generated links | Uses officer request/documents/queue paths, but the current high-fidelity dashboard page does not consume this adapter. |
| Page-specific `<select>` options in `OfficerDashboard`, `OfficerRequestReview`, department workspaces, and `ControlledOutcomeShell` | Legacy workspace navigation | Passed as `roleSelector`, but ignored by `InternalAppShell`; still duplicate definitions in source. |

## Mobile versus desktop comparison

The canonical officer desktop and mobile navigation use the same source: `officerNavigation` rendered once by `InternalSidebar`. There is no separate mobile route map. This is good and should be preserved.

Differences are presentation/state only:

- desktop uses `sidebarCollapsed` and the collapse button;
- mobile uses `mobileSidebarOpen`, a backdrop, the top-bar `Menu` button, and `onMobileClose` on every link;
- both modes use the same `usePathname()` active calculation;
- navigating within `/demo/officer/**` preserves the layout instance and usually preserves collapse/drawer state during client navigation;
- a direct refresh remounts the layout and resets both states to `false`;
- leaving the officer route tree replaces the sidebar rather than merely closing/reopening it.

The applicant workspace's mobile/desktop implementation is separate and out of scope.

## Active-navigation analysis

`isInternalNavigationItemActive` behaves as follows:

1. Any `item.href` containing `#` returns `false` immediately.
2. Query strings and hashes are removed from non-hash links by `hrefPath`.
3. `exact` requires pathname equality.
4. Otherwise pathname equality is active.
5. Descendant matching occurs only through explicit `activePrefixes`.

Consequences for officer navigation:

- `/demo/officer` activates `Dashboard` because it is exact.
- Clicking `Application queue`, `Approval queue`, `Returned to applicant`, `Review invitations`, `Ask for feedback`, `Uploaded documents`, `Generated PDFs`, `Due soon tasks`, `Overdue tasks`, `Applicant messages`, `Notification log`, `My profile`, or `Settings` never makes that item active because each link contains a hash.
- At `/demo/officer/requests/[requestId]`, `Application queue` becomes active via `activePrefixes: ["/demo/officer/requests/"]`, even though its own href is hash-based. `Document review` and `Internal notes` point at the same request but have no active prefix, so equality activates both when the request is exactly `REQ-DEMO-001`; multiple items can therefore be active on that route.
- `/demo/officer/queue` has no matching sidebar href or active prefix, so no operational queue item becomes active.
- `/demo/officer/tasks`, `/demo/officer/documents`, and `/demo/officer/sla-monitor` activate by exact pathname equality.
- Query parameters are invisible to `usePathname`, so document tabs and task filters cannot select different sidebar states (which is acceptable if they remain one page).
- Hash-only navigation on the already-open dashboard may not trigger any pathname-based effect, so the active indicator remains `Dashboard`.

D32 should use stable officer routes for canonical page-level items and reserve hashes/tabs for subdivisions that do not need their own navigation identity.

## Role-resolution analysis

### Uppercase provider system

`features/demo/roles/demo-workspace-role.tsx` exports `DemoWorkspaceRoleProvider`, `useDemoWorkspaceRole`, and `getDemoRoleHome`.

- Roles: `APPLICANT`, `OFFICER`, `SUPERVISOR`, `ADMIN`.
- Storage key: `faidia.demo-engine.role.v1`.
- Role change event: `faidia:demo-workspace-role-change`.
- `switchRole` writes storage, emits the event, and calls `router.push(ROLE_HOME[nextRole])`.
- `roleFromLocation` recognizes officer, supervisor, reports, public `/demo`, and track routes, but not department, outcomes, verification, applicant profile/documents, services, sign-up, or admin paths.
- `fallbackRole` recognizes department as officer, reports as supervisor, and otherwise defaults to applicant.

### Lowercase registry/bridge system

`features/demo-engine/navigation/demo-route-registry.ts` plus `DemoRoleNavigationBridge` use lowercase roles.

- Roles: `applicant`, `officer`, `supervisor`, `admin`.
- Storage key: `faidia-demo-role`.
- Path key: `faidia-demo-path`.
- Per-role path keys: `faidia-demo-last-route:<role>`.
- `resolveDemoRoleFromPath` recognizes admin, supervisor, officer, and listed applicant journey prefixes.
- It does **not** recognize `/demo/department`, `/demo/reports`, `/demo/verify-certificate`, or public `/demo` as a workspace role.
- The bridge also uses global DOM heuristics to recognize any selector containing at least three role labels or nearby `View as` text.

### Confirmed disagreements

| Route | Uppercase provider | Lowercase registry/bridge |
|---|---|---|
| `/demo/department` | Fallback/stored role; fresh fallback is `OFFICER` | `null` (`public` dataset) |
| `/demo/outcomes/[id]` | Stored role on client navigation; fresh fallback is `APPLICANT` | `applicant` |
| `/demo/verify-certificate` | Stored role or fresh fallback `APPLICANT` | `null` |
| `/demo/reports?scope=institution` | Client query inspection resolves `ADMIN` | `null` because `/demo/reports` is absent from registry prefixes |
| `/demo/admin` | Fresh fallback is `APPLICANT` because `roleFromLocation` omits admin | `admin` |
| `/demo/applicant/profile` | Fresh fallback `APPLICANT`; client navigation may preserve stored role | `applicant` |

These systems can disagree without an immediate visual failure because shell role is often hard-coded by a route layout/page component. The disagreement still affects the role switcher value, session state, redirects, and future authorization-like gating.

## Route-registry analysis

`DEMO_ROUTES.officer` currently defines only:

- `home`: `/demo/officer`
- `queue`: `/demo/officer/queue`
- `tasks`: `/demo/officer/tasks`
- `documents`: `/demo/officer/documents`
- `sla`: `/demo/officer/sla-monitor`

The registry does not currently serve as the source for the sidebar and does not describe:

- `/demo/officer/requests/[requestId]`;
- `/demo/officer/requests/[requestId]?view=refer`;
- legacy `/demo/officer/sla` and `/demo/officer/reports/sla`;
- canonical future Workflow Inbox, Approval Queue, Returned to Applicant, Document Review, Generated PDFs, Issued Documents, QR Verification, Applicant Messages, Internal Notes, Overdue Tasks, or Log Out destinations;
- department and outcome route ownership.

The registry's applicant/admin home routes also disagree with the live uppercase provider's `ROLE_HOME`. D32-1 should not add a third officer route map. It should either make the registry authoritative and derive visible navigation from it, or colocate canonical officer route metadata in one module consumed by both the sidebar and registry/role-resolution layer.

## Confirmed cross-workspace links

1. `officerNavigation.Workflow inbox` → `/demo/department` → department shell.
2. `officerNavigation.Shared workflows` → `/demo/department` → department shell.
3. `officerNavigation.Issued documents` → `/demo/outcomes/REQ-DEMO-001` → supervisor shell.
4. `officerNavigation.Help centre` → `/demo#faq` → public page.
5. `officerNavigation.Log out` → `/demo` → public page.
6. `InternalSidebar` brand link → `/demo` → public page.
7. `officer-dashboard.reference.ts` handoff actions → `/demo/department`.
8. `officer-dashboard.reference.ts` report action → `/demo/reports` → supervisor/admin reports gate.
9. `officer-dashboard-view-model.ts` handoffs/messages/deadlines → `/demo/department`.
10. `OfficerTasksWorkspace` quick link → `/demo/department`.
11. Legacy role selector options in `OfficerDashboard` and `OfficerRequestReview` include `/demo/department` and `/demo/supervisor`.
12. Future canonical QR Verification currently has only `/demo/verify-certificate`, a public standalone route.

No confirmed officer sidebar link enters `/demo/admin` or `/demo/applicant/**` directly. Role switching can enter those trees, and outcomes are classified as applicant by the lowercase registry despite rendering a supervisor shell.

## Legacy-route findings

- `/demo/officer/sla` and `/demo/officer/reports/sla` are compatibility redirects to `/demo/officer/sla-monitor`.
- `/demo/officer/queue` is a real alias of the tasks workspace, but visible `Application queue` still uses `/demo/officer#application-queue`.
- The review/referral view is a query branch (`?view=refer`) inside the individual-request page rather than a nested route.
- `components/demo/officer/officer-dashboard.tsx` is a legacy shell-owning dashboard composition; the live page imports `OfficerDashboardHighFidelity` instead.
- `features/demo-engine/dashboards/officer/officer-dashboard.tsx` contains `/demo/officer/department-inbox`, which has no route.
- Multiple dashboard fixtures/adapters/view models carry route links that are not all consumed by the current high-fidelity dashboard, but can reintroduce legacy navigation if components are switched.
- `components/demo/controls/role-switcher.tsx` is a legacy state-only role selector whose navigation depends on `DemoRoleNavigationBridge` intercepting DOM events.

## Duplicate-shell findings

### Confirmed shell-owning officer page components

- `OfficerIndividualCaseShell` mounts `InternalAppShell`.
- `OfficerRequestReview` mounts `InternalAppShell`.
- Legacy `OfficerDashboard` mounts `InternalAppShell`.

### Why two shells are not normally visible today

The outer layout `InternalAppShell` reads `useInternalShellBoundary()` as `false`, renders its frame, and wraps it in `InternalShellBoundaryProvider`. A nested `InternalAppShell` reads the context as `true` and returns only its `children`. This suppresses the nested sidebar/top bar.

### Remaining risks

- Page components remain coupled to shell APIs and identities instead of being reusable feature bodies.
- Rendering one outside the officer layout produces a complete shell with potentially different request selectors/actions.
- A future refactor that moves or removes the provider can immediately expose duplicate sidebars/top bars.
- Shell props supplied by the nested components are silently discarded when the boundary short-circuits.
- `InternalAppShell` source contains stray JSX parentheses around its shell `<div>` inside `InternalShellBoundaryProvider`; they are outside D32-0's allowed change and should be runtime-checked before any shell edit.

## Root causes

1. **Route layout consolidation happened after page-level shells were built.** Older components still own complete shells, while newer pages are body-only.
2. **Visible navigation and route registry are separate sources.** `officerNavigation` does not consume `DEMO_ROUTES.officer`.
3. **Officer navigation uses other workspaces as feature destinations.** Department handoffs and controlled outcomes are exposed by linking to their complete role pages rather than shared feature-body pages under the officer route tree.
4. **Hash fragments stand in for missing pages.** Many canonical concepts are links to sections that do not exist or cannot produce an active state.
5. **Two role-resolution systems coexist.** They use different casing, storage keys, route coverage, and home destinations.
6. **Shell role is hard-coded independently of resolved role.** Layout/page shell choices can conflict with provider/registry role state.
7. **Legacy adapters, fixtures, and components preserve old hrefs.** The live high-fidelity dashboard and older data-driven dashboard do not share one route contract.
8. **Active matching is intentionally narrow.** It rejects hash links and requires manual descendant prefixes.
9. **Standalone public verification is being asked to serve an internal officer tool.** Without an officer-owned wrapper/body route, it necessarily changes the header/shell.

## Findings requiring runtime verification

The following should be verified in D32-1 before and after implementation; source inspection identifies the risk but cannot prove browser behavior in every navigation mode:

- Direct refresh versus client navigation for `/demo/department`, `/demo/outcomes/REQ-DEMO-001`, `/demo/reports?scope=institution`, `/demo/admin`, and `/demo/verify-certificate`, including the displayed role-switcher value and `document.documentElement.dataset.demoRole`.
- Whether hash destinations on `/demo/officer` exist in the high-fidelity dashboard DOM; absent IDs would make the links visually do nothing.
- Whether navigating among nested officer routes always activates `InternalShellBoundaryProvider` before a page-mounted shell renders, including streaming/hydration transitions.
- Whether the stray parentheses in `InternalAppShell` appear as visible text in any deployed build.
- Browser back/forward behavior after switching roles through `DemoWorkspaceSwitcher` versus the legacy `DemoControlBar` role selector.
- Mobile drawer closing and focus behavior when a link exits the officer tree.
- Layout state persistence (collapsed sidebar/mobile state) across client navigation versus reset on hard refresh.
- 404 behavior for latent `/demo/officer/department-inbox` links if the older dashboard component is rendered.
- Active-state collisions at `/demo/officer/requests/REQ-DEMO-001` among Application queue, Document review, and Internal notes.

## Files expected to change during D32-1 onward

This is a forecast, not authorization to edit the files in D32-0.

### Primary consolidation files

- `components/demo/internal-shell/internal-navigation.ts` — replace the officer definition with the supplied canonical groups while preserving existing icons and visual primitives.
- `features/demo-engine/navigation/demo-route-registry.ts` — register every canonical officer route and descendant ownership.
- `features/demo/roles/demo-workspace-role.tsx` — align role resolution and home routes with the registry.
- `components/demo/role-switch/demo-role-navigation-bridge.tsx` — remove duplicated routing rules/DOM heuristics where the shared provider can own navigation.
- `components/demo/internal-shell/internal-app-shell.tsx` — retain appearance while clarifying role-selector ownership and shell boundary behavior.
- `components/demo/internal-shell/internal-sidebar.tsx` — likely limited to active-state/route metadata consumption; visual structure should remain unchanged.

### Route/layout files likely required

- `app/demo/officer/layout.tsx` — remain the single officer shell owner; changes should be minimal or unnecessary.
- Existing body routes: `app/demo/officer/tasks/page.tsx`, `queue/page.tsx`, `documents/page.tsx`, `sla-monitor/page.tsx`, and `requests/[requestId]/page.tsx`.
- New officer-owned route pages will likely be needed for Workflow Inbox, Approval Queue, Returned to Applicant, Document Review, Generated PDFs, Issued Documents, QR Verification, Applicant Messages, Internal Notes, and Overdue Tasks where no stable route currently exists.

### Feature-body extraction candidates

- `components/demo/officer/individual-case/officer-individual-case-shell.tsx`
- `components/demo/officer/officer-request-review.tsx`
- `components/demo/department/department-inbox-workspace.tsx`
- `components/demo/outcomes/controlled-outcome-shell.tsx`
- `features/demo-verification/components/public-verification-page.tsx`

These should be split or wrapped so officer routes reuse feature bodies without reusing another role's complete page/shell. Applicant, supervisor, department, admin, and public routes should retain their own behavior.

### Link/data sources requiring alignment

- `features/demo-engine/fixtures/officer-dashboard.reference.ts`
- `features/demo/view-models/officer-dashboard-view-model.ts`
- `features/demo-engine/dashboards/data/officer-dashboard.adapter.ts`
- `features/demo-engine/dashboards/officer/officer-dashboard.tsx`
- `features/demo-operations/components/operational-workspaces.tsx`
- `features/officer-review/components/officer-review-referral-body.tsx`

## Protected files

D32-0 changes only this audit document. The following remain protected in this stage:

- all `app/**` application files;
- all `components/**` files;
- all `features/**` files;
- all `config/**` files;
- all `lib/**` files;
- all `tests/**` files;
- all `styles/**` files;
- all `public/**` files;
- `package.json` and `package-lock.json`;
- workflow fixtures and service fixtures;
- global design tokens;
- applicant workspace;
- supervisor workspace;
- admin workspace.

The later D32 implementation must preserve existing icons, typography, fonts, colours, sidebar appearance, top-bar appearance, role switcher, organization branding, and interaction styling.

## Recommended implementation sequence

1. Define one canonical officer route contract for all 15 supplied navigation items, including descendant matching metadata and compatibility redirects.
2. Make `DEMO_ROUTES.officer`, `officerNavigation`, role resolution, and active matching consume that contract rather than duplicate strings.
3. Keep `app/demo/officer/layout.tsx` as the only complete officer shell owner.
4. Convert `OfficerIndividualCaseShell` and `OfficerRequestReview` to body-level composition beneath the layout, preserving all existing UI and actions.
5. Add officer-owned pages/wrappers for department inbox, approvals/returns, documents/outcomes, QR verification, messages, notes, and overdue tasks; reuse feature bodies, not other roles' full page components.
6. Replace officer links to `/demo/department`, `/demo/outcomes/**`, `/demo/reports`, public verification, and hash-only placeholders with officer-prefixed destinations.
7. Retain legacy URLs only as explicit redirects to canonical officer routes.
8. Unify `DemoWorkspaceRoleProvider` and `DemoRoleNavigationBridge` route resolution/storage behavior; preserve the visible `DemoWorkspaceSwitcher` and styling.
9. Add route/active-state tests covering direct load, client navigation, refresh, nested routes, query strings, and mobile drawer use.
10. Run desktop/mobile visual regression checks to confirm the shell, icons, typography, colours, branding, and interactions are unchanged.

## D32-0 acceptance checklist

- [x] Every current officer-prefixed route inventoried.
- [x] Officer layout inheritance traced from `app/layout.tsx` through `InternalAppShell`.
- [x] Every shell used directly or indirectly by officer pages identified.
- [x] Shared and role-specific sidebar implementations identified.
- [x] Shared and standalone top bars/headers identified.
- [x] Officer navigation definitions, route maps, fixtures, adapters, and legacy selector sources identified.
- [x] Desktop and mobile navigation sources compared.
- [x] Active-navigation matching logic analyzed route by route.
- [x] Both role-resolution systems and their storage keys analyzed.
- [x] Route-registry coverage and omissions documented.
- [x] Cross-workspace officer links confirmed with exact destinations.
- [x] Legacy and nonexistent route findings documented.
- [x] Page-mounted and boundary-suppressed duplicate shells documented.
- [x] Direct-refresh/client-navigation risks isolated for runtime verification.
- [x] Expected D32-1+ files and protected D32-0 files recorded.
- [x] No application code, fixtures, design tokens, package files, or other workspace roles modified.
- [x] D32-1 not started.
