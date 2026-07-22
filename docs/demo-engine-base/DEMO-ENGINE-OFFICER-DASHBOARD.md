# FAIDIA Demo Engine Officer Dashboard

## Document status

- Stage: D20
- Status: Active
- Route: `/demo/officer`
- Workspace type: Internal operational interface
- Production Supabase access: Prohibited

## 1. Purpose

D20 replaces the officer placeholder with the first functional internal workspace.

The dashboard gives a front-office user a clear queue of submitted and active requests.

D20 is the queue and navigation stage. It does not yet implement review decisions or departmental referral.

## 2. Dashboard responsibilities

The officer dashboard shows:

- open-request count;
- awaiting-review count;
- referred-request count;
- completed-request count;
- request reference;
- applicant name;
- selected service;
- current status;
- responsible department;
- submission or activity time;
- priority;
- a direct review action.

## 3. Shared-state behavior

The dashboard reads request data from the D7 shared browser state when compatible request records are present.

A controlled synthetic fallback queue keeps the demonstration usable before later processing stages enrich every request record.

The dashboard does not create, update, approve, reject or refer a request.

## 4. Configuration behavior

D20 reads:

- institution identity;
- active services;
- configured departments.

These values come from the D6 client configuration system.

The dashboard must not hard-code a different client identity.

## 5. Queue controls

The dashboard provides:

- free-text request search;
- status filtering;
- responsive queue rows;
- links to `/demo/officer/requests/[requestId]`.

Search covers the request reference, applicant, service, department and status.

## 6. Boundaries

D20 does not implement:

- completeness review;
- clarification requests;
- officer notes;
- departmental referral;
- approval;
- rejection;
- controlled outcome generation;
- production database reads;
- production database writes.

Those actions belong to D21 and later stages.

## 7. D20 definition of done

D20 is complete when:

- the officer placeholder is replaced;
- the dashboard reads the client configuration;
- the dashboard reads the shared demo state;
- queue KPI cards are visible;
- search and status filters work;
- request rows link to the officer-review route;
- the dashboard is responsive;
- no Supabase dependency is introduced;
- the existing route inventory remains intact;
- type checking passes;
- linting passes;
- the production build passes;
- D20 verification passes;
- D20 is committed separately.
