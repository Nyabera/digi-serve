# D31 Dashboard Shell Contracts

## Decision

D31 uses two explicit route-layout boundaries:

```text
OperationalWorkspaceShell
├── Officer
└── Supervisor

AdminWorkspaceShell
└── Admin
```

The dashboard reference document requires one shared operational shell for
Officer and Supervisor and a separate organization-admin shell. Generated
reference images must not be copied independently because their shell details
are inconsistent.

## Operational shell

Owner:

```text
components/demo/workspace-shells/operational-workspace-shell.tsx
```

Route layouts:

```text
app/demo/officer/layout.tsx
app/demo/supervisor/layout.tsx
```

Current implementation:

```text
components/demo/internal-shell/role-workspace-shell.tsx
```

### Frozen rules

- Officer and Supervisor use the same shell implementation.
- Navigation may differ by role configuration.
- Sidebar and top-bar proportions are shared.
- Responsive shell behaviour is shared.
- Dashboard bodies may not mount a shell.
- Dashboard bodies may not mount a sidebar.
- Dashboard bodies may not mount a top bar.
- Dashboard bodies may not mount the Demo role selector.
- D31-3 through D31-7 must leave the operational shell unchanged.

The operational source baseline is recorded in:

```text
shell-baselines/OPERATIONAL-SHELL-BASELINE.json
```

## Admin shell

Owner:

```text
components/demo/workspace-shells/admin-workspace-shell.tsx
```

Route layout:

```text
app/demo/admin/layout.tsx
```

D31-2 establishes the separate boundary without changing current visuals. The
boundary temporarily delegates to the existing role shell.

D31-8 may replace only the internals of `AdminWorkspaceShell` with the selected
dark organization-admin shell. The Admin layout and dashboard body must remain
unchanged when this occurs.

### Admin target direction

- dark navy institutional sidebar;
- light dashboard content area;
- Admin-specific navigation;
- one top bar;
- one sidebar;
- one role selector;
- responsive drawer behaviour;
- no operational Officer/Supervisor shell styles leaking into Admin pages.

## Dashboard body contract

The following routes inherit their shell:

```text
/demo/officer
/demo/supervisor
/demo/admin
```

Their dashboard page components must remain thin and body-only.

Disallowed imports inside dashboard bodies:

```text
InternalAppShell
RoleWorkspaceShell
OperationalWorkspaceShell
AdminWorkspaceShell
InternalShellBoundaryProvider
```

## Why the Admin boundary is transitional

Changing the visual Admin shell during D31-2 would mix shell architecture with
dashboard body reconstruction.

The stable boundary lets the project:

1. freeze route ownership now;
2. build Officer and Supervisor bodies safely;
3. implement the separate dark Admin shell during D31-8;
4. avoid changing Admin routes or dashboard JSX twice.
