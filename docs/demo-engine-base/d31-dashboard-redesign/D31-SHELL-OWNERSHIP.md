# D31 Shell Ownership Matrix

| Surface | Route layout owner | Stable boundary | Visual implementation during D31-2 | May dashboard body mount shell? |
| --- | --- | --- | --- | --- |
| Officer | `app/demo/officer/layout.tsx` | `OperationalWorkspaceShell` | Existing operational shell | No |
| Supervisor | `app/demo/supervisor/layout.tsx` | `OperationalWorkspaceShell` | Existing operational shell | No |
| Admin | `app/demo/admin/layout.tsx` | `AdminWorkspaceShell` | Transitional existing shell | No |

## Protected during Officer and Supervisor reconstruction

```text
components/demo/internal-shell/**
components/demo/workspace-shells/operational-workspace-shell.tsx
app/demo/officer/layout.tsx
app/demo/supervisor/layout.tsx
app/demo/admin/layout.tsx
```

## Mutable at D31-8 only

```text
components/demo/workspace-shells/admin-workspace-shell.tsx
components/demo/admin-shell/**
```

D31-8 may create `components/demo/admin-shell/**`, but the route layout must
continue to render `AdminWorkspaceShell`.

## Body-only implementation locations

```text
features/demo-engine/dashboards/officer/**
features/demo-engine/dashboards/supervisor/**
features/demo-engine/dashboards/admin/**
```

The body folders must not contain copies of shell navigation or layout chrome.
