# D30-4 TVET Extraction Source Map

## Purpose

D30-4 extracts Savannah Technical College identity, terminology and seeded
content into the typed TVET Demo Pack.

The running Demo is not switched to the pack during this stage.

## Extracted categories

| Category | TVET Pack destination | Existing source areas |
|---|---|---|
| Organization identity | `demo-packs/tvet/organization.ts` | Shared shell and homepage |
| Branding | `demo-packs/tvet/branding.ts` | Homepage CSS and brand assets |
| Homepage content | `demo-packs/tvet/homepage.ts` | Savannah homepage components |
| Departments | `demo-packs/tvet/departments.ts` | Operational fixtures and workflow data |
| Users | `demo-packs/tvet/users.ts` | Role shell, dashboards and operational fixtures |
| Services | `demo-packs/tvet/services.ts` | Public service pages and fixtures |
| Workflows | `demo-packs/tvet/workflows.ts` | Admin workflow fixtures and service flows |
| Requests | `demo-packs/tvet/requests.ts` | Demo request and operational fixtures |
| Reports | `demo-packs/tvet/reports.ts` | Reports fixtures and dashboard datasets |
| SLA | `demo-packs/tvet/sla.ts` | Officer and Supervisor SLA fixtures |

## Runtime status

The TVET pack is now a typed extraction target containing the first structured
copy of Savannah-specific information.

The running Demo still reads from its existing fixtures.

This is intentional. Runtime cutover belongs to the later provider and active
pack stages.

## Source inventory

The generated source-location inventory is stored at:

```text
docs/demo-engine-base/d30-freeze/CURRENT-SAVANNAH-SOURCE-LOCATIONS.txt
```

## Boundary status

The data has been extracted, but the old hard-coded values remain active until
runtime cutover.

Therefore the matching boundary exceptions are not yet fully resolved.

They become resolved only when shared components consume the active Demo Pack
instead of the old fixtures.
