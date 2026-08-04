# D30-5 Minimal Code Movement

## Purpose

D30-5 introduces the smallest runtime boundary required to make the Demo Pack
available throughout `/demo`.

The stage avoids broad component refactoring.

## Changes made

The stage adds:

- one active-pack entry point;
- one React context provider;
- one server accessor;
- reusable selector functions;
- one provider wrapper in `app/demo/layout.tsx`.

## Controlled active-pack import

The only named vertical import allowed outside `demo-packs/` is:

```text
features/demo-engine/config/active-demo-pack.ts
```

That file is the switch point for the active Demo Pack.

Shared components must import neutral hooks, selectors or server helpers from:

```text
features/demo-engine/config
```

They must not import `demo-packs/tvet` directly.

## Minimal movement rules

1. Stable routes remain in their current locations.
2. Stable components remain in their current locations.
3. Existing fixtures remain available during migration.
4. Components can move from fixtures to pack hooks incrementally.
5. No broad folder restructuring is allowed before the freeze.
6. No database migration is introduced.
7. No production authentication change is introduced.
8. No shared visual redesign is introduced.
9. The active-pack provider is mounted once at the Demo layout.
10. Future pack switching changes one controlled entry point.

## Available client hooks

- `useDemoPack`
- `useDemoOrganization`
- `useDemoBranding`
- `useDemoHomepage`
- `useDemoDepartments`
- `useDemoUsers`
- `useDemoServices`
- `useDemoWorkflows`
- `useDemoRequests`
- `useDemoReports`
- `useDemoSla`
- `useDemoPackSelector`

## Available server access

Server components can use:

```ts
const pack = getActiveDemoPack();
```

## Available selectors

- `getDemoDepartmentById`
- `getDemoUserById`
- `getDemoServiceById`
- `getDemoWorkflowById`
- `getDemoRequestById`
- `getDefaultDemoRequest`

## Runtime status

The provider is active across `/demo`.

Existing pages may continue to use their current fixtures until they are
migrated intentionally.

This avoids changing many working pages in one stage.
