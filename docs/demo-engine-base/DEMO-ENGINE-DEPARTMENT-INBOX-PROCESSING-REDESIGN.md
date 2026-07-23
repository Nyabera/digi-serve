# FAIDIA Demo Engine Department Inbox and Handoff Processing Redesign

## Document status

- Stage: D29R-5
- Routes: `/demo/department` and `/demo/department/handoffs/[handoffId]`
- Scope: Finance handoff inbox and processing
- Internal shell: Shared D29R shell
- Route inventory: Unchanged at 14 pages
- Production Supabase access: Prohibited

## Purpose

D29R-5 replaces the legacy dark Finance workspace and card layout with the compact internal operations language established by D29R-3P and D29R-4.

The stage covers both the master-detail department inbox and the individual handoff-processing workspace.

## Department inbox

The inbox includes:

- compact title and subtitle;
- four 116px handoff metrics;
- compact search, status and sort controls;
- dense eight-row handoff table;
- selected-row treatment;
- persistent handoff detail panel;
- source department;
- request;
- requested action;
- reason;
- expected output;
- shared documents;
- Accept;
- Return for Clarification;
- Decline;
- recent completed handoffs.

## Handoff processing workspace

The processing route includes:

- breadcrumbs;
- compact Finance verification heading;
- four handoff-status metrics;
- parent request summary;
- parent ownership statement;
- requested action;
- reason;
- expected output;
- shared documents;
- handoff timeline;
- CLEAR, HOLD and CANNOT_VERIFY result options;
- Finance result note;
- accept;
- complete and return;
- return for clarification;
- decline.

## Preserved workflow behavior

D29R-5 preserves:

- `PENDING_ACCEPTANCE`;
- `IN_PROGRESS`;
- `RETURNED_FOR_CLARIFICATION`;
- `DECLINED`;
- `COMPLETED`;
- `CLEAR`;
- `HOLD`;
- `CANNOT_VERIFY`;
- Student Records parent ownership;
- D7 browser-session persistence;
- `handoff_accepted`;
- `handoff_returned_for_clarification`;
- `handoff_declined`;
- `handoff_completed`;
- applicant-safe status separation.

## Demo and production boundary

The feature components receive display-ready models. The Demo Engine adapter supplies immutable handoff fixtures and the client containers overlay D7 session state. A future production adapter can replace those inputs without changing the bodies.

## Protected files

D29R-5 does not modify:

- `app/demo/layout.tsx`;
- `components/demo/internal-shell/*`;
- `features/demo/state/*`;
- `config/demo/*`;
- `types/demo/*`;
- Officer, Supervisor, Outcomes or Reports feature bodies.

## Definition of done

D29R-5 is complete when both Department routes use the shared shell, the dark Finance header is removed, the master-detail inbox matches the reference, all five handoff actions persist, the 14-route inventory remains intact, technical checks pass and the visual result is approved before D29R-6.
