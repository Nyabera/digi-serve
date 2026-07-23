# FAIDIA Demo Engine Supervisor Dashboard and Approval Redesign

## Document status

- Stage: D29R-6
- Routes:
  - `/demo/supervisor`
  - `/demo/supervisor/approvals/[requestId]`
- Scope: Supervisor oversight and Registrar approval
- Internal shell: Shared D29R shell
- Route inventory: Unchanged at 14 pages
- Production Supabase access: Prohibited

## Purpose

D29R-6 replaces the legacy dark Registrar workspace with the compact internal operations language established by D29R-3P, D29R-4 and D29R-5.

The stage separates the Supervisor dashboard from the individual Registrar decision route.

## Supervisor dashboard

The dashboard includes:

- six 116px operational metrics;
- open requests;
- pending approvals;
- overdue work;
- unassigned work;
- pending handoffs;
- average completion time;
- five-row approval queue;
- officer workload and capacity;
- stage timing;
- backlog and escalation attention items.

## Registrar approval route

The approval route includes:

- compact breadcrumbs;
- request summary;
- parent owner;
- decision authority;
- six prerequisite checks;
- Finance result;
- required application responses;
- required documents;
- Registrar declaration;
- approve;
- reject with applicant-visible reason;
- return for clarification;
- immutable decision summary;
- controlled-outcome continuation only after approval.

## Preserved D23 and D24 behavior

D29R-6 preserves:

- `__supervisorDecision:record`;
- `__supervisorDecision:status`;
- `__supervisorDecision:publicStatus`;
- `APPROVED`;
- `REJECTED`;
- `RETURNED_FOR_CLARIFICATION`;
- `SUPERVISOR_CLARIFICATION_REQUIRED`;
- `ADDITIONAL_CHECKS_IN_PROGRESS`;
- `request_approved`;
- `request_rejected`;
- `request_returned_for_clarification`;
- Registrar-profile decision authority;
- Student Records parent ownership;
- applicant-visible rejection reason;
- D24 controlled outcome route;
- D7 session-state persistence.

The approval reader supports both the legacy D22 Finance result record and the D29R-5 handoff result fields.

## Approval prerequisites

Approval requires:

- all required configured application fields;
- all required document metadata;
- all three originating-officer checks;
- a completed Finance result;
- Finance result `CLEAR`;
- no unresolved correction or clarification state;
- Registrar declaration confirmation.

`HOLD` and `CANNOT_VERIFY` cannot be approved.

## Architecture boundary

The client containers own D7 state reads, model derivation and mutations.

The feature components own body layout and interaction presentation.

The Demo Engine fixture supplies deterministic supervisor dashboard data.

A production adapter may later replace the fixture without changing the body components.

## Protected files

D29R-6 does not modify:

- `app/demo/layout.tsx`;
- `components/demo/internal-shell/*`;
- `features/demo/state/*`;
- `config/demo/*`;
- `types/demo/*`;
- Officer, Department, Outcome or Reports feature bodies.

## Definition of done

D29R-6 is complete when:

- both Supervisor routes use the shared internal shell;
- `/demo/supervisor` is a compact oversight dashboard;
- `/demo/supervisor/approvals/[requestId]` is the Registrar decision route;
- six supervisor metrics render;
- five approval rows render;
- officer workload renders;
- stage timing renders;
- approval prerequisites render;
- Finance CLEAR enables approval when all other checks pass;
- HOLD and CANNOT_VERIFY block approval;
- rejection requires an applicant-visible reason;
- clarification return persists;
- decisions remain immutable;
- approval links to `/demo/outcomes/[requestId]`;
- no route is added;
- no Supabase or network dependency is introduced;
- type checking, linting, tests and build pass;
- D29R-6 verification passes;
- visual approval occurs before D29R-7.
