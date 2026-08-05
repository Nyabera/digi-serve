# D34-3 — Admin Workspace Shell Consolidation

## Status

**COMPLETE — IMPLEMENTED WITH D34-4**

D34-3 confirms and enforces one persistent admin workspace boundary for every canonical admin route.

## Baseline

| Field | Value |
|---|---|
| Branch | `demo/d34-admin-navigation-consolidation` |
| Baseline commit | `f0f9703ae18eebbdd86ef2e1fd62f7f46d75033f` |
| Short baseline | `f0f9703` |
| Generated locally | `2026-08-05 14:45:53 EAT` |
| Generated UTC | `2026-08-05T11:45:53Z` |

## Canonical shell ownership

The shell chain remains:

```text
app/demo/admin/layout.tsx
  -> AdminWorkspaceShell
  -> RoleWorkspaceShell role="admin"
  -> InternalAppShell role="ADMIN"
  -> one InternalSidebar
  -> one InternalTopbar
  -> admin page content
```

Individual admin pages do not render a workspace shell, sidebar, or top bar.

## D34-3 implementation

D34-3 preserves the existing shell implementation and prevents ordinary admin navigation from leaving it.

The admin brand link now resolves to:

`/demo/admin`

when the active shell role is `ADMIN`.

Other role brand behavior is unchanged.

## Preserved visual system

No changes were made to:

- shell CSS;
- sidebar width;
- top-bar dimensions;
- typography;
- icon sizing;
- navigation spacing;
- active-state styling;
- hover styling;
- collapse behavior;
- mobile drawer behavior;
- role switcher;
- institution identity;
- staff identity.

## Prohibited shell behavior

Normal admin navigation must not load:

- officer shell;
- supervisor shell;
- department shell;
- applicant shell;
- public shell;
- reports shell outside the admin route tree.

Log Out remains the deliberate exit action.

## Verification

Run:

```bash
bash scripts/demo/verify-d34-3-4-admin-shell-navigation.sh
```

## D34-3 acceptance criteria

1. `app/demo/admin/layout.tsx` remains the shell owner.
2. AdminWorkspaceShell still resolves `role="admin"`.
3. RoleWorkspaceShell still resolves `shellRole: "ADMIN"`.
4. Admin pages contain page content only.
5. Admin brand navigation remains under `/demo/admin`.
6. Normal admin sidebar clicks retain the same sidebar and top bar.
7. Browser refresh retains the admin workspace.
8. Back and Forward retain the admin workspace.

## Browser acceptance record

<!-- D34_BROWSER_ACCEPTANCE_PASS -->

| Field | Result |
|---|---|
| Stage | D34-3 |
| Status | **PASS** |
| Recorded | `2026-08-05 14:50:06 EAT` |
| Direct canonical routes | Loaded successfully |
| Sidebar persistence | Passed |
| Top-bar persistence | Passed |
| Admin role persistence | Passed |
| Refresh, Back, and Forward | Passed |
| Workspace switching on normal items | Not detected |
| Deliberate workspace exit | Log Out only |
