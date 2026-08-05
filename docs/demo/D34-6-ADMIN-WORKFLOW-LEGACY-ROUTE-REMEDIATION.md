# D34-6 — Canonical Workflow Route and Legacy Builder Remediation

## Status

**COMPLETE — LEGACY ROUTE REMEDIATED**

D34-6 makes the D34-1 Workflow Builder destination semantically canonical and removes the old builder URL from live admin navigation and feature links.

## Baseline

| Field | Value |
|---|---|
| Branch | `demo/d34-admin-navigation-consolidation` |
| Baseline commit | `f3748e5f61e4e2bb44234e44cf75576d39ba0864` |
| Short baseline | `f3748e5` |
| Generated locally | `2026-08-05 15:55:07 EAT` |
| Generated UTC | `2026-08-05T12:55:07Z` |

## Canonical behavior

| URL | Result |
|---|---|
| `/demo/admin/workflows` | Workflow Builder |
| `/demo/admin/workflows?template=<id>` | Workflow Builder with selected template |
| `/demo/admin/workflows?view=overview` | Existing Workflow Overview |
| `/demo/admin/workflows?view=overview&tab=active` | Existing overview, Active Workflows tab |

The visible D34 navigation item named **Workflow Builder** now lands on the actual Workflow Builder surface.

## Legacy compatibility

The old route:

`/demo/admin/workflows/builder`

now redirects to:

`/demo/admin/workflows`

A legacy `template` query is preserved.

Example:

```text
/demo/admin/workflows/builder?template=course-application
  -> /demo/admin/workflows?template=course-application
```

The legacy route remains inside the admin route tree during redirect resolution and cannot switch the workspace role.

## Overview preservation

The previous `/demo/admin/workflows` overview has not been deleted.

It remains available at:

`/demo/admin/workflows?view=overview`

Older bookmarks that use only:

- `?tab=templates`
- `?tab=active`

continue to resolve to the overview.

## Shared compatibility helper

D34-6 adds:

`features/demo-engine/navigation/admin-workflow-route-compatibility.ts`

It owns:

- canonical builder href creation;
- canonical overview href creation;
- template query preservation;
- builder-versus-overview route resolution.

Components no longer hand-write the legacy builder URL.

## Internal link remediation

All live links in:

- `features/demo-admin-workflows/components/workflow-overview.tsx`
- `features/demo-admin-workflows/components/workflow-builder.tsx`

now use canonical route helpers.

The Workflow Builder back link explicitly opens the overview compatibility view rather than looping back to the builder.

## Files changed

- `features/demo-engine/navigation/admin-workflow-route-compatibility.ts`
- `app/demo/admin/workflows/page.tsx`
- `app/demo/admin/workflows/builder/page.tsx`
- `features/demo-admin-workflows/components/workflow-overview.tsx`
- `features/demo-admin-workflows/components/workflow-builder.tsx`
- `tests/demo/unit/d34-admin-workflow-route-compatibility.test.ts`
- `scripts/demo/verify-d34-6-admin-workflow-route-remediation.sh`
- `docs/demo/D34-6-ADMIN-WORKFLOW-LEGACY-ROUTE-REMEDIATION.md`

## Files intentionally not changed

- admin layout;
- admin shell;
- sidebar source;
- top-bar source;
- navigation contract;
- navigation styling;
- role switcher;
- global CSS;
- Tailwind configuration;
- non-admin routes;
- workflow builder mechanics;
- workflow fixture data.

## Verification

Run:

```bash
bash scripts/demo/verify-d34-6-admin-workflow-route-remediation.sh
npx vitest run tests/demo/unit/d34-admin-workflow-route-compatibility.test.ts
npm run typecheck
npm run lint
```

## Browser acceptance test

After restarting the local server:

1. Open `/demo/admin/workflows`.
2. Confirm the Workflow Builder renders.
3. Open `/demo/admin/workflows?view=overview`.
4. Confirm the previous Workflow Overview renders.
5. Click **Create Workflow Template** or **Visual Workflow Builder**.
6. Confirm the URL remains under `/demo/admin/workflows`.
7. Open a template customization link.
8. Confirm the `template` query loads the selected template.
9. Open `/demo/admin/workflows/builder`.
10. Confirm it redirects to `/demo/admin/workflows`.
11. Open the legacy route with a template query.
12. Confirm the query survives the redirect.
13. Confirm the admin sidebar, top bar, and role remain unchanged.

Do not commit until this browser test passes.

## D34-7 handoff

D34-7 must run the final admin navigation acceptance and freeze.

Do not begin D34-7 until the D34-6 verifier, focused test, typecheck, lint, and browser acceptance all pass.
