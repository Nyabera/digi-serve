# D33-3 — Supervisor Shell Ownership

**Stage:** D33-3

**Mode:** Shell consolidation

**D33-2 commit:** `e78d18cb58b6256b74d74ec4391d1904ab3d9d50`

**Implementation baseline:** `e78d18cb58b6256b74d74ec4391d1904ab3d9d50`

**Branch:** `demo/d33-supervisor-navigation-consolidation`

## Purpose

D33-3 establishes one exclusive supervisor shell owner for the canonical
supervisor route tree.

The sole route-layout owner remains:

`app/demo/supervisor/layout.tsx`

That layout renders the shared `OperationalWorkspaceShell` with the
`supervisor` role. The shared shell then resolves the supervisor identity and
renders one internal sidebar and one internal top bar.

This stage removes the remaining full-shell composition from the legacy
approval-detail workspace.

## Shell ownership chain

The supervisor shell chain is:

1. `app/demo/supervisor/layout.tsx`
2. `OperationalWorkspaceShell`
3. `RoleWorkspaceShell`
4. `InternalAppShell`
5. one `InternalSidebar`
6. one `InternalTopbar`
7. supervisor page body

The shared shell components remain reusable by Officer and Supervisor. The
role, pathname namespace, staff identity, and navigation configuration remain
role-specific.

## Legacy approval-detail correction

Before D33-3,
`components/demo/supervisor/supervisor-approval-workspace.tsx` imported and
rendered its own `InternalAppShell`.

The outer supervisor layout already supplied a full shell. A boundary provider
could suppress the visible duplicate at runtime, but the page body still owned
a second shell composition, duplicate role controls, request-selector controls,
and shell-specific presentation actions.

D33-3 removes that nested composition.

The approval workspace now returns only `SupervisorApprovalBody`. Its approval
state, validation, Finance checks, decision logic, audit updates, and demo-state
behaviour remain intact.

The legacy route remains:

`/demo/supervisor/approvals/[requestId]`

It continues to inherit `app/demo/supervisor/layout.tsx`.

## Canonical route ownership

All thirteen canonical supervisor routes remain beneath
`app/demo/supervisor/**`.

No canonical page imports or renders:

- `OperationalWorkspaceShell`
- `RoleWorkspaceShell`
- `InternalAppShell`
- `InternalSidebar`
- `InternalTopbar`

Every canonical page is therefore a body beneath the shared supervisor layout.

## Desktop and mobile ownership

`InternalAppShell` owns both desktop and mobile shell state.

The same supervisor role is passed into `InternalSidebar`. The mobile drawer
uses the same sidebar component and navigation resolver through
`mobileOpen={mobileSidebarOpen}`.

The top bar is rendered once by `InternalAppShell`, and its role switcher
continues to use the shared `DemoWorkspaceSwitcher`.

D33-3 does not activate the new D33 supervisor navigation. That remains D33-4.

## Files changed

- `components/demo/supervisor/supervisor-approval-workspace.tsx`
- `app/demo/supervisor/approvals/[requestId]/page.tsx`
- `tests/demo/unit/supervisor-shell-ownership.test.ts`
- `docs/demo/D33-3-SUPERVISOR-SHELL-OWNERSHIP.md`

## Files deliberately unchanged

- `app/demo/supervisor/layout.tsx`
- `components/demo/workspace-shells/operational-workspace-shell.tsx`
- `components/demo/internal-shell/role-workspace-shell.tsx`
- `components/demo/internal-shell/internal-app-shell.tsx`
- `components/demo/internal-shell/internal-sidebar.tsx`
- `components/demo/internal-shell/internal-topbar.tsx`
- `components/demo/internal-shell/internal-navigation.ts`
- `features/demo-engine/navigation/supervisor-navigation-contract.ts`
- all canonical D33-2 route pages
- officer, department, applicant, admin, reports, outcomes, and public routes
- CSS and global design tokens
- dashboard visual design
- package files
- backend and production integrations

## Acceptance checks

- [x] `app/demo/supervisor/layout.tsx` remains the sole supervisor route-layout
      shell owner.
- [x] The layout passes the `supervisor` role into the shared operational shell.
- [x] All thirteen canonical pages remain body-only.
- [x] No nested canonical layout was introduced.
- [x] The legacy approval workspace no longer imports `InternalAppShell`.
- [x] The legacy approval workspace no longer renders duplicate sidebar or
      top-bar controls.
- [x] The approval-detail route remains functional beneath the supervisor
      layout.
- [x] Approval business behaviour remains in the existing body component.
- [x] Desktop and mobile shell state come from one `InternalAppShell`.
- [x] Desktop and mobile navigation use the same supervisor role.
- [x] The visible D33 navigation remains inactive.
- [x] Focused shell-ownership tests pass.
- [x] Type checking passes.
- [x] Focused linting passes.
- [x] The production build passes.
- [x] No pull request is created.

## D33-4 handoff

D33-4 may now activate the exact supervisor navigation contract.

D33-4 must:

1. make the live supervisor navigation consume
   `SUPERVISOR_NAVIGATION_CONTRACT`;
2. preserve all approved icons, typography, spacing, sidebar dimensions,
   colours, hover states, and collapsed behaviour;
3. expose exactly fourteen visible items: thirteen routes and one Log Out
   action;
4. keep every route destination beneath `/demo/supervisor/**`;
5. apply canonical exact, prefix, and legacy-alias active-state metadata;
6. keep desktop and mobile navigation on the same source;
7. avoid changing page bodies, shell ownership, top-bar composition, role
   switching, business logic, or visual design;
8. leave cross-page dashboard and fixture link consolidation for D33-5.

D33-3 stops after exclusive shell ownership is established and verified.
