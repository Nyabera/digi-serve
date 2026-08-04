# D30-3 Demo Pack Contract

## Purpose

D30-3 defines the compile-time contract between the reusable FAIDIA Demo
Engine and an organization-specific Demo Pack.

The contract is vertical-neutral and lives at:

```text
features/demo-engine/config/demo-pack.types.ts
```

## Contract categories

Every Demo Pack must provide:

- pack identity and version;
- engine compatibility;
- default route, role and optional request;
- organization identity;
- branding;
- homepage content;
- departments;
- users;
- services;
- workflows;
- seeded requests;
- reports;
- SLA configuration.

## Compile-time enforcement

Each configuration module uses TypeScript `satisfies`.

Example:

```ts
export const organization = {
  id: "example",
  name: "Example Organization",
  shortName: "Example",
  initials: "EO",
  organizationType: "example",
} satisfies DemoOrganizationConfig;
```

The manifest uses:

```ts
export const pack = {
  // configuration
} satisfies DemoPack;
```

This preserves literal values while verifying the complete shape.

## Boundary rules

1. The type contract must not import a named vertical pack.
2. A Demo Pack may import the neutral contract as a type.
3. The running Demo is not switched to the TVET pack during D30-3.
4. Runtime pack loading is introduced later.
5. Cross-reference validation is introduced later.
6. D30-3 provides shape validation, not business-rule validation.

## Validation deferred to later stages

The contract alone does not yet verify that:

- every service references an existing workflow;
- every workflow department exists;
- every request service exists;
- every SLA service exists;
- every workflow has a valid final step;
- every asset exists.

Those checks belong to the later Demo Pack validator.
