# D30-10 Demo Pack Configuration Validation

## Purpose

D30-10 prevents malformed Demo Packs from reaching the presentation runtime.

The validator checks configuration shape and cross-references that TypeScript
alone cannot verify.

## Command

```bash
npm run demo:validate -- tvet
```

Machine-readable output:

```bash
npm run demo:validate -- tvet --json
```

## Error checks

The validator rejects:

- missing pack and organization identity;
- invalid default routes or roles;
- missing logo assets;
- unsupported color values;
- duplicate IDs;
- missing departments, users, services or workflows;
- services referencing missing workflows;
- services or steps referencing missing SLA targets;
- workflows with no steps;
- duplicate workflow step IDs;
- multiple Start nodes;
- workflows with no terminal or output step;
- missing department references;
- missing step-transition references;
- requests referencing missing services or users;
- requests referencing unknown current workflow steps;
- invalid dates;
- due dates before submission;
- missing default requests;
- missing report metrics or charts;
- empty report datasets;
- invalid SLA targets;
- missing SLA subjects;
- invalid compliance or resolution values.

## Warnings

The validator warns when:

- the universal model must create a synthetic Start node;
- the universal model must create a synthetic End node;
- a workflow step is unreachable;
- no seeded user exists for the default role.

Warnings do not block the pack.

Errors return a non-zero process status and block validation.

## Asset handling

The CLI checks assets against:

- repository-relative paths;
- `public/` paths;
- pack-owned asset paths.

The validator records file existence only. It does not inspect or expose secret
file contents.

## Negative test

```bash
npm run demo:validate:test
```

The negative test deliberately corrupts a cloned TVET pack and confirms that
the validator catches duplicate IDs, bad references, invalid colors and
missing assets.
