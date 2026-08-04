# FAIDIA Demo Engine Reports and Outcomes Shell Integration

## Document status

- Stage: D29R-7
- Routes:
  - `/demo/reports`
  - `/demo/outcomes/[requestId]`
- Scope: Shared internal-shell placement
- Route inventory: Unchanged at 14 pages
- Production Supabase access: Prohibited

## Purpose

D29R-7 places the operational reports and controlled outcome routes inside the shared D29R internal shell.

The stage does not rebuild D24 outcome logic or D25 analytics logic. It removes their legacy full-page chrome and gives both pages the same sidebar, topbar, role controls, presentation controls and reset controls as the redesigned Officer, Finance and Supervisor workspaces.

## Reports shell

The reports route uses the Supervisor shell because the page contains cross-department operational analytics.

The shell identifies:

- staff: Dr. Miriam Wekesa;
- role: Registrar Supervisor;
- workspace: Supervisor;
- current page: Operational reports.

The D25 body remains responsible for:

- D7 session-state analytics;
- date filtering;
- service filtering;
- eight Recharts visualizations;
- operational metrics;
- demonstration-boundary messaging.

## Controlled outcome shell

The outcome route uses the Supervisor shell because controlled issuance follows the Registrar decision.

The shell identifies:

- staff: Dr. Miriam Wekesa;
- role: Registrar Supervisor;
- current request;
- approval route;
- applicant-tracking route.

The D24 body remains responsible for:

- approval-gate reading;
- exact synthetic document creation;
- delivery-method selection;
- controlled download;
- physical collection;
- outcome status;
- audit events;
- applicant-safe completion state.

## Body embedding

The shared secondary-page frame:

- applies the D29R body offset;
- renders one compact body heading;
- hides the old D24/D25 dark full-page headers;
- removes old maximum-width wrappers;
- preserves all existing feature logic;
- retains chart containment;
- retains responsive behavior.

## Protected files

D29R-7 does not modify:

- `components/demo/internal-shell/*`;
- `components/demo/reports/operational-reports-dashboard.tsx`;
- `components/demo/outcomes/controlled-outcome-workspace.tsx`;
- `features/demo/state/*`;
- `config/demo/*`;
- `types/demo/*`;
- Officer, Department or Supervisor feature bodies.

## Definition of done

D29R-7 is complete when:

- `/demo/reports` renders inside `InternalAppShell`;
- `/demo/outcomes/[requestId]` renders inside `InternalAppShell`;
- each route shows one shared sidebar and one shared topbar;
- legacy dark route headers are hidden;
- the report body remains interactive;
- all eight report charts remain visible;
- outcome issuance remains functional;
- download and collection remain functional;
- the plural outcome route remains canonical;
- presentation and reset controls remain functional;
- no route is added;
- no Supabase or network dependency is introduced;
- TypeScript, lint, tests and build pass;
- D24 and D25 verifiers delegate to D29R-7;
- visual approval occurs before D29R-8.
