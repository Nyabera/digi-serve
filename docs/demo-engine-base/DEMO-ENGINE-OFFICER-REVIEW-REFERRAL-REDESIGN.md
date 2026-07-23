# FAIDIA Demo Engine Officer Review and Referral Redesign

## Document status

- Stage: D29R-4
- Route: `/demo/officer/requests/[requestId]`
- Scope: Officer review and departmental referral
- Internal shell: Shared D29R shell
- Route inventory: Unchanged at 14 pages
- Production Supabase access: Prohibited

## Purpose

D29R-4 replaces the legacy dark-header request-review page with the compact internal operations design established by D29R-3P.

The redesigned workspace follows the approved Share Workflow / Refer Case reference while preserving D21 state and referral behavior.

## Visual structure

The page contains:

- compact breadcrumbs;
- compact page title and subtitle;
- body-level back action;
- a two-column review workspace;
- application details;
- internal notes;
- audit trail;
- share and referral form;
- departmental and officer selection;
- referral reason;
- urgency selection;
- requested action message;
- expected output;
- due date;
- six sharing controls;
- correction request;
- preview action;
- send-for-review action.

## Density contract

At wide desktop:

- body offset matches D29R-3P;
- panel radius is 10px;
- panel headers are 50px;
- body grid is approximately 36% / 64%;
- controls are 42px;
- body text uses 9.5px to 12px operational sizes;
- the referral message field is 142px minimum;
- gaps are 12px to 16px;
- borders and spacing provide hierarchy rather than large shadows.

## Preserved workflow behavior

D29R-4 preserves:

- start review;
- application completeness check;
- document completeness check;
- identity completeness check;
- internal notes;
- applicant correction reason;
- applicant-visible correction instructions;
- structured departmental referral;
- parent ownership remaining with Student Records;
- `PENDING_ACCEPTANCE`;
- `WAITING_ON_FINANCE`;
- `ADDITIONAL_CHECKS_IN_PROGRESS`;
- D7 browser-session persistence;
- activity events.

## Architecture boundary

The route-specific client container owns:

- D7 state reads;
- D7 dispatches;
- form state;
- model derivation;
- workflow handlers;
- shell integration.

The feature body owns:

- body layout;
- application details;
- notes;
- audit trail;
- referral form;
- correction panel;
- accessibility semantics.

Demo-specific officers, reasons and request-selector records live in a fixture and adapter.

## Protected files

D29R-4 does not modify:

- `app/demo/layout.tsx`;
- `app/demo/officer/requests/[requestId]/page.tsx`;
- `components/demo/internal-shell/*`;
- `features/demo/state/*`;
- `config/demo/*`;
- `types/demo/*`;
- Department or Supervisor workspaces.

## Definition of done

D29R-4 is complete when:

- the route uses `InternalAppShell`;
- the old dark hero header is removed;
- the legacy full-width Demo Control Bar remains hidden;
- the body matches the D29R-3P density language;
- application responses render;
- document metadata renders;
- internal notes persist;
- the audit trail renders;
- start review persists;
- all three review checks persist;
- correction reason and instructions persist separately;
- referral fields persist;
- referral creates `PENDING_ACCEPTANCE`;
- parent ownership remains with Student Records;
- no route is added;
- no Supabase or network access is introduced;
- TypeScript, lint, tests and build pass;
- D29R-4 verification passes;
- visual approval occurs before D29R-5.
