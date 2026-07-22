# FAIDIA Demo Engine State

## Document status

- Stage: D7
- Status: Active
- State schema version: 1
- Persistence: Browser session storage
- Production database writes: Prohibited

## 1. Purpose

D7 creates one shared state engine for every route beneath `/demo`.

The engine uses React Context and `useReducer`.

It does not use production Supabase tables, Auth or Storage.

## 2. Provider boundary

`app/demo/layout.tsx` wraps every Demo Engine route with `DemoStateProvider`.

Production routes remain outside this provider.

## 3. State records

The state keeps separate records for:

- applicant;
- form drafts;
- document metadata;
- parent requests;
- work items;
- departmental handoffs;
- approvals;
- outcomes;
- notifications;
- timeline events;
- reporting activity events.

One applicant-facing request remains the parent record.

Work items and handoffs remain separate internal records beneath the request.

## 4. Seed data

The initial state contains:

- four synthetic requests;
- open and completed requests;
- Student Records work;
- a pending Finance referral;
- a completed Finance referral;
- a pending Registrar approval;
- one issued controlled outcome;
- applicant and staff notifications;
- applicant-visible and internal timeline events.

The dashboards must not begin empty.

## 5. State actions

The reducer supports:

- homepage variant changes;
- role changes;
- active request selection;
- active handoff selection;
- applicant updates;
- draft form updates;
- document creation and review;
- request creation and status changes;
- work-item creation and completion;
- handoff creation and processing;
- approval decisions;
- outcome issuance;
- notification creation and reading;
- timeline events;
- reporting activity events;
- complete demo reset.

Later stages will connect interface controls to these actions.

## 6. Persistence

State is stored in:

`sessionStorage`

Storage key:

`faidia.demo-engine.state.v1`

Session storage is used only for the synthetic Demo Engine.

It is not the production source of truth.

Reset removes the stored session and recreates deterministic seed state.

## 7. Restrictions

D7 does not implement:

- finished role controls;
- homepage switcher controls;
- final workflow buttons;
- real applicant submission;
- real file upload;
- production authentication;
- production database writes;
- Recharts dashboards;
- final page designs.

## 8. D7 definition of done

D7 is complete when:

- typed state models exist;
- deterministic seed state exists;
- requests, work items and handoffs remain separate;
- a reducer with typed actions exists;
- a shared React Context provider exists;
- `/demo` routes are wrapped by the provider;
- session storage persistence exists;
- complete reset behaviour exists;
- selectors exist;
- `/demo` visibly consumes shared state;
- no production Supabase dependency was added;
- type checking passes;
- linting passes;
- the production build passes;
- D7 verification passes;
- D7 is committed separately.
