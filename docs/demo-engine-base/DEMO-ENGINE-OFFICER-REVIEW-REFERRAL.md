# FAIDIA Demo Engine Officer Review and Referral

## Document status

- Stage: D21
- Status: Active
- Route: `/demo/officer/requests/[requestId]`
- Workspace: Originating officer
- Production Supabase access: Prohibited

## 1. Purpose

D21 replaces the officer request-details placeholder with a functional review workspace.

The stage allows an originating officer to inspect one continuous request record, assess completeness, add internal notes, request an applicant correction and create a structured departmental referral.

D21 does not implement receiving-department acceptance or completion. Those capabilities belong to D22.

## 2. Request-detail content

The workspace displays:

- request reference;
- configured service;
- institution;
- applicant name, email and phone;
- submitted form responses;
- selected document metadata;
- processing-time context;
- internal activity timeline;
- current internal review state;
- parent-request owner.

## 3. Officer-review actions

The officer can:

- start review;
- confirm that application responses were reviewed;
- confirm that required documents were reviewed;
- confirm that applicant identity details were reviewed;
- add an internal note;
- request an applicant correction;
- create a departmental referral.

Starting review appends request_opened_by_officer and first_action_taken activity events.

## 4. Internal notes and applicant communication

Internal notes are staff-only demonstration data.

They must not be presented as applicant-visible instructions.

A correction request has two distinct fields:

- internal correction reason;
- applicant-visible correction instructions.

Creating a correction records the public status ACTION_REQUIRED and appends a document_returned activity event.

## 5. Referral model

D21 implements a referral, not a transfer.

Student Records keeps parent-request ownership while the receiving department performs one defined piece of work.

The referral requires:

- originating department;
- receiving department;
- requested action;
- reason;
- expected output;
- due date;
- originating officer;
- created timestamp;
- status.

The initial referral status is PENDING_ACCEPTANCE.

Creating the referral records the internal state WAITING_ON_FINANCE, the applicant-safe status ADDITIONAL_CHECKS_IN_PROGRESS and one handoff_created activity event.

## 6. State boundary

D21 stores review, note, correction and referral demonstration values in the D7 shared browser state.

The stage does not:

- create a production handoff record;
- create a production work item;
- upload or download real documents;
- expose internal notes to applicants;
- transfer parent-request ownership;
- approve or reject the request;
- complete Finance verification;
- call Supabase.

## 7. Configuration boundary

D21 reads:

- Savannah Technical College;
- active service configuration;
- service form sections and fields;
- document requirements;
- Student Records, Finance and Registrar departments.

No alternative institution identity is hard-coded into the route.

## 8. D21 definition of done

D21 is complete when:

- the officer request placeholder is replaced;
- the request page displays applicant information;
- configured responses are displayed;
- document metadata is displayed;
- the officer can start review;
- the three completeness checks persist;
- internal notes persist and remain staff-only;
- correction reason and applicant instructions persist separately;
- the officer can create a structured referral;
- Student Records remains parent owner;
- the referral starts in PENDING_ACCEPTANCE;
- activity events are appended;
- no Supabase dependency is introduced;
- the 14-route inventory remains intact;
- type checking passes;
- linting passes;
- the production build passes;
- D21 verification passes;
- D21 is committed separately.
