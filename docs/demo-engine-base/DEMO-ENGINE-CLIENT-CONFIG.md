# FAIDIA Demo Engine Client Configuration

## Document status

- Stage: D6
- Status: Active
- Repository: `/Users/blaq/Downloads/faidia`
- Branch: `feat/demo-engine-base`
- Default client: Savannah Technical College
- Configuration schema version: 1

## 1. Purpose

D6 creates the typed client configuration system for the reusable FAIDIA Demo Engine.

A client-specific demo should primarily change configuration rather than duplicate pages, components or workflow code.

D6 uses static TypeScript configuration and does not write to Supabase.

## 2. Configuration coverage

The client configuration controls:

- Organization identity.
- Organization type and description.
- Contact information.
- Branding values.
- Default homepage variant.
- Available homepage variants.
- Presentation controls.
- Departments.
- Synthetic people and roles.
- Services.
- Form sections and fields.
- Document requirements.
- Fees and manual references.
- Workflows.
- Internal statuses.
- Applicant-visible statuses.
- Controlled outcome labels.
- Report definitions.
- Synthetic chart seed data.

## 3. Default client

The default demonstration organization is Savannah Technical College.

Configured departments:

1. Student Records.
2. Finance.
3. Registrar.

Configured services:

1. Transcript Request.
2. Student Clearance Request.
3. Certificate Replacement Request.

Transcript Request is the primary complete demonstration service.

The additional services prove that the Demo Engine is configuration-driven rather than transcript-specific.

## 4. Configuration files

- `types/demo/client-config.ts`
- `config/demo/clients/savannah-technical-college.ts`
- `config/demo/client-registry.ts`
- `config/demo/index.ts`

The registry provides:

- `getDemoClient`
- `getDefaultDemoClient`
- `listDemoClients`
- `DEFAULT_DEMO_CLIENT_SLUG`
- `DEMO_CLIENTS`

## 5. Runtime consumption

The `/demo` route reads the default client through `getDefaultDemoClient`.

The shared route placeholder also reads the same client configuration.

This proves that all Demo Engine routes can consume one shared client source rather than hard-coded institution names.

## 6. Configuration rules

Client-specific differences must be configuration-driven.

Production routes must not import Demo Engine configuration.

Demo Engine configuration must not:

- Import Supabase clients.
- Write to Supabase.
- Read production environment secrets.
- Run database migrations.
- Create authentication users.
- Upload production files.
- Contain real applicant information.
- Contain real institutional records.

## 7. Schema rules

The configuration schema is versioned with `schemaVersion: 1`.

Every service must define:

- Stable ID.
- URL slug.
- Display name.
- Description.
- Eligibility.
- Requirements.
- Processing time.
- Fee mode.
- Form sections.
- Document requirements.
- Workflow ID.
- Outcome label.

Every workflow must define:

- Stable ID.
- Service ID.
- Version.
- Ordered steps.
- Responsible role.
- Responsible department where applicable.
- Internal status.
- Applicant-visible status.

## 8. D6 restrictions

D6 does not implement:

- Shared demo state.
- React Context.
- `useReducer`.
- Workflow actions.
- Real applicant submission.
- Real document upload.
- Homepage A, B or C.
- Homepage switching.
- Recharts rendering.
- Production Supabase integration.
- Production authentication.
- Production PDF issuance.

Those capabilities belong to later Demo Engine stages.

## 9. D6 definition of done

D6 is complete when:

- The client configuration types exist.
- Savannah Technical College is configured.
- Three departments are configured.
- Four primary roles are represented.
- Three services are configured.
- Transcript Request contains a complete seeded form.
- Document requirements are configured.
- Service workflows are configured.
- Internal and applicant-visible statuses are configured.
- Homepage variants A, B and C are configured.
- Report definitions and chart seed data are configured.
- A client registry exists.
- `/demo` visibly consumes the default client.
- Shared route placeholders consume the same client.
- Type checking passes.
- Linting passes.
- The production build passes.
- The D6 verification script passes.
- No protected production file was modified.
- D6 is committed separately.
