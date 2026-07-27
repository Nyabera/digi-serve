# D30-2 Demo Pack Structure

## Purpose

D30-2 establishes the repository structure for one reusable Demo Engine and multiple organization-specific Demo Packs.

No existing Savannah fixture is migrated during this stage.

## Structure

```text
demo-packs/
├── README.md
├── tvet/
│   ├── manifest.ts
│   ├── organization.ts
│   ├── branding.ts
│   ├── homepage.ts
│   ├── departments.ts
│   ├── users.ts
│   ├── services.ts
│   ├── workflows.ts
│   ├── requests.ts
│   ├── reports.ts
│   ├── sla.ts
│   └── assets/
├── supermarket/
├── county/
├── hospital/
├── sacco/
├── university/
├── insurance/
├── construction/
├── manufacturing/
├── logistics/
├── telThese draft modules are not yet the source of truth for the running Demo.

The formal Demo Pack type is introduced in D30-3.

Existing Savannah fixtures are extracted during later D30 stages.

## Rules

1. Maintain one repository and one Demo Engine.
2. Demo Packs contain configuration and seeded data only.
3. Demo Packs must not contain copied routes or role shells.
4. Demo Packs must not implement workflow execution.
5. Demo Packs may define workflow content.
6. Shared components must not directly import a named vertical pack.
7. Pack assets must not contain secrets, private data or font files.
