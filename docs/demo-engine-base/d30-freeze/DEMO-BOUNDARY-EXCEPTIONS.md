# Demo Engine Boundary Exceptions

## Purpose

This register identifies organization-specific values that temporarily remain
inside reusable or semi-reusable Demo files.

D30-1 records these exceptions. Later D30 stages will move the values into the
TVET Demo Pack without unnecessarily rewriting stable Demo Engine behaviour.

## Status values

- `Open` — confirmed exception awaiting extraction.
- `Review` — likely exception requiring classification.
- `Resolved` — moved into a Demo Pack or neutral configuration.
- `Accepted` — intentionally remains engine-owned with a documented reason.

## Priority values

- `Critical` — prevents another Demo Pack from loading correctly.
- `High` — visibly ties a reusable workspace to the TVET vertical.
- `Medium` — seeded content or would move into configuration.
- `Low` — cosmetic or rarely displayed organization-specific wording.

## Confirmed current exceptions

| File or area | Current hard-coded content | Intended destination | Priority | Status |
|---|---|---|---|---|
| `app/demo/page.tsx` | Active TVET homepage composition | `demo-packs/tvet/homepage.ts` or pack manifest | High | Open |
| `components/demo/homepage/` | Savannah branding, homepage content and TVET service wording | `demo-packs/tvet/branding.ts`, `homepage.ts`, `services.ts` | High | Open |
| `components/demo/internal-shell/role-workspace-shell.tsx` | Savannah institution name and seeded staff identities | `demo-packs/tvet/organization.ts` and `users.ts` | High | Open |
| `features/demo-admin-workflows/fixtures/workflow-demo-data.ts` | Student Admission, Transcript Request, Certificate Issuance and other TVET templates | `demo-packs/tvet/workflows.ts` | Critical | Open |
| `features/demo-operations/fixtures/` | TVET departments, requests, officers, audit events anSLA figures | `demo-packs/tvet/departments.ts`, `requests.ts`, `users.ts`, `sla.ts` | Critical | Open |
| `features/officer-dashboard/fixtures/` | Officer queues, TVET services and workload figures | `demo-packs/tvet/requests.ts` and `reports.ts` | High | Open |
| Applicant service pages | TVET service names, instructions and expected outcomes | `demo-packs/tvet/services.ts` | Critical | Review |
| Officer request workspace | Student and Registrar terminology | TVET service, department and workflow configuration | High | Review |
| Supervisor reports | TVET metric titles and seeded report figures | `demo-packs/tvet/reports.ts` | High | Review |
| Officer SLA workspace | Seeded TVET SLA and workload data | `demo-packs/tvet/sla.ts` | Medium | Review |

## Candidate-reference inventory

The complete generated candidate list is stored at:

`docs/demo-engine-base/d30-freeze/CURRENT-TVET-REFERENCES.txt`

A text match is not automatically a boundary violation.

Examples:

- a generic Applicant role may remain engine-owned;
- an approval component remains engine-owned;
- `Transcript Request` is TVET-pack content;
- `Registrar Approval` is TVET workflow content;
- a generic `departmentId` field remains engine-owned.

## Review procedure

For each candidate:

1. Determine whether it represents reusable behaviour.
2. Determine whether it represents organization-specific content.
3. Record confirmed exceptions in the table.
4. Assign an intended Demo Pack destination.
5. Assign a priority.
6. Do not refactor the source file during D30-1.

## Governance rules

- Do not add new undocumented vertical-specific values.
- Do not move working code merely to eliminate a low-risk exception.
- Update this register whenever an exception is resolved.
- Shared components must eventually consume neutral configuration.
- A reusable component must not import directly from `demo-packs/tvet`.


## D30-4 extraction status

Savannah-specific organization identity, branding, homepage content,
departments, users, services, workflow definitions, seeded requests, reports
and SLA values now have typed destinations under `demo-packs/tvet`.

The original hard-coded and fixture-based sources remain active until the
runtime provider and active-pack cutover are completed.

The corresponding exceptions therefore remain open, but their extraction
destination is now implemented.


## D30-8 workflow separation status

The Admin workflow overview and visual builder now receive workflow names,
steps, departments, request instances and presentation metadata from the active
Demo Pack.

Generic palette definitions, node conversion, node creation and reordering
remain inside the reusable Demo Engine.

The former hard-coded
`features/demo-admin-workflows/fixtures/workflow-demo-data.ts` content fixture
has been removed.

This resolves the Admin workflow-catalogue and builder-content boundary
exception. Other Savannah fixture migrations remain tracked separately.
