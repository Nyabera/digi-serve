# Demo Reset Behaviour

## Default state

- Active pack: `tvet`
- Organization: Savannah Technical College
- Default role: `applicant`
- Default route: `/demo`
- Default request: `STC-CL-2026-0027`

## Reset clears

- selected role and request overrides;
- request-progress changes;
- workflow-builder edits;
- simulated referrals and sharing;
- comments added during the session;
- filters, search and date selections;
- temporary report and SLA selections.

## Reset restores

- active TVET pack;
- seeded services, workflows, requests, reports and SLA data;
- default role;
- default request;
- default presentation route.

Reset must not delete production data, write to production Supabase, send a
real message or process a payment.
