# D30-8 Workflow Mechanics and Content Separation

## Purpose

D30-8 separates reusable workflow-builder mechanics from organization-specific
workflow content.

## Engine-owned mechanics

The reusable engine now owns:

- workflow node types used by the visual builder;
- generic step palette;
- conversion from configured workflow steps to builder nodes;
- automatic Start and End nodes;
- deterministic node creation;
- drag-and-drop node reordering;
- generic empty-workflow fallback;
- pack-neutral workflow view-model generation.

## Demo Pack-owned content

The TVET Demo Pack owns:

- workflow IDs and names;
- workflow descriptions and categories;
- step labels;
- department assignments;
- approval labels;
- output labels;
- template usage counts;
- template presentation tones;
- seeded requests shown as active workflows;
- request statuses and current steps.

## Runtime changes

The Admin workflow overview reads the active Demo Pack through
`useDemoPack()`.

The visual builder reads:

- `useDemoWorkflows()`;
- `useDemoDepartments()`.

No Admin workflow component imports the TVET pack directly.

## Removed legacy fixture

The following vertical-specific fixture is removed:

```text
features/demo-admin-workflows/fixtures/workflow-demo-data.ts
```

Its mechanics were moved into reusable workflow modules.

Its content now comes from:

```text
demo-packs/tvet/workflows.ts
demo-packs/tvet/requests.ts
demo-packs/tvet/users.ts
demo-packs/tvet/services.ts
```

## Boundary rule

The builder may know what an Approval, Verification, Decision or Automated Task
is.

It must not know what a Transcript, Registrar, Student Admission or Leave of
Absence is unless that content arrives through the active Demo Pack.
