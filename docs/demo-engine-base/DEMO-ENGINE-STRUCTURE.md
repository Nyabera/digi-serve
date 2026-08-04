# FAIDIA Demo Engine Structure

## Document status

- Stage: D4
- Status: Active
- Repository: `/Users/blaq/Downloads/faidia`
- Branch: `feat/demo-engine-base`
- Route namespace: `/demo`

## 1. Purpose

D4 creates the isolated folder structure for the reusable FAIDIA Demo Engine.

Routes are not created during D4.

No production file is modified during D4.

No runtime implementation is added during D4.

## 2. Folder structure

The Demo Engine structure is:

- `app/demo/`
- `components/demo/shell/`
- `components/demo/controls/`
- `components/demo/homepages/`
- `components/demo/public/`
- `components/demo/forms/`
- `components/demo/applicant/`
- `components/demo/officer/`
- `components/demo/department/`
- `components/demo/supervisor/`
- `components/demo/outcomes/`
- `components/demo/reports/`
- `components/demo/charts/`
- `components/demo/shared/`
- `features/demo/state/`
- `features/demo/workflow/`
- `features/demo/documents/`
- `features/demo/reporting/`
- `config/demo/`
- `types/demo/`
- `tests/demo/unit/`
- `tests/demo/integration/`
- `tests/demo/e2e/`
- `public/demo/branding/`
- `public/demo/documents/`
- `docs/demo-engine-base/`

## 3. Folder responsibilities

### `app/demo/`

Owns the Demo Engine route tree.

D5 will create and verify routes inside this folder.

No route files are created during D4.

### `components/demo/shell/`

Will contain Demo Engine page shells, structural layouts, headers, and navigation wrappers.

### `components/demo/controls/`

Will contain the homepage switcher, role switcher, presentation controls, and reset controls.

### `components/demo/homepages/`

Will contain Homepage A, Homepage B, and Homepage C.

All homepage variants will use the same client configuration and request journey.

### `components/demo/public/`

Will contain public-facing service discovery and service-information components.

### `components/demo/forms/`

Will contain configurable applicant form and simulated document-upload components.

### `components/demo/applicant/`

Will contain applicant sign-up, confirmation, tracking, and applicant-facing outcome components.

### `components/demo/officer/`

Will contain the officer dashboard, queues, request review, and referral components.

### `components/demo/department/`

Will contain the receiving-department queue and handoff-processing components.

### `components/demo/supervisor/`

Will contain the supervisor dashboard and approval components.

### `components/demo/outcomes/`

Will contain controlled outcome displays and synthetic document components.

### `components/demo/reports/`

Will contain report layouts, metrics, and report-specific presentation components.

### `components/demo/charts/`

Will contain reusable Recharts components used by Demo Engine reports.

### `components/demo/shared/`

Will contain Demo Engine-specific reusable components that do not belong to one role.

### `features/demo/state/`

Will contain React Context, reducer, actions, selectors, persistence, and reset logic.

### `features/demo/workflow/`

Will contain synthetic workflow transitions and applicant-safe status mapping.

### `features/demo/documents/`

Will contain simulated document metadata and document-review behaviour.

### `features/demo/reporting/`

Will derive internally consistent synthetic reporting values from Demo Engine state.

### `config/demo/`

Will contain typed client, service, form, workflow, staff, and report configuration.

### `types/demo/`

Will contain shared Demo Engine TypeScript types.

### `tests/demo/`

Will contain unit, integration, and end-to-end Demo Engine tests.

### `public/demo/branding/`

Will contain client demonstration logos and branding assets.

### `public/demo/documents/`

Will contain non-sensitive synthetic demonstration document assets.

## 4. Dependency direction

The intended dependency direction is:

1. `app/demo`
2. `features/demo`
3. `components/demo`
4. `config/demo` and `types/demo`
5. Approved shared application components

Production application code must not import Demo Engine code.

Each Demo Engine feature has a clear module boundary.

## 5. D4 restrictions

D4 must not create:

- `page.tsx`
- `layout.tsx`
- `loading.tsx`
- `error.tsx`
- `not-found.tsx`
- React components
- TypeScript implementation
- Demo state
- Client configuration
- Synthetic data
- Route handlers
- Server Actions
- Supabase code
- Database migrations
- Styling changes
- Package changes

D4 must not modify:

- Production route groups.
- `app/globals.css`.
- `app/layout.tsx`.
- `app/page.tsx`.
- `components/ui/**`.
- `app/design-lab/**`.
- `db/**`.
- `supabase/**`.
- `package.json`.
- `package-lock.json`.

## 6. D4 definition of done

D4 is complete when:

- Every approved Demo Engine directory exists.
- Every empty leaf directory contains `.gitkeep`.
- The structure is documented.
- No route file exists under `app/demo`.
- No runtime implementation exists in the new folders.
- No production application file was modified.
- The D4 verification script passes.
- The D4 changes are committed separately.
