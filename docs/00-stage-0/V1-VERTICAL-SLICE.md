# FAIDIA Stage 0 — V1 Vertical Slice

Status: **APPROVED_FOR_V1**  
Version: **1.0**  
Last updated: **2026-07-13**  
Product: **FAIDIA — Service Operations Platform**

## 1. Purpose

This document defines the first complete FAIDIA journey that must work across authentication, database records, applicant pages, officer pages, departmental referral, permissions, notifications, timestamps, audit events, outcome access, and reporting.

The Stage 1 vertical slice is end-to-end. It is not a visual-only demo.

## 2. Approved Acceptance Scenario

An applicant visits Savannah Technical College's service catalogue, selects Transcript Request, signs in or registers, completes the form, uploads required documents, enters the required Savannah demo manual payment reference, and submits.

Student Records reviews the request, rejects one document, and requests a correction. The applicant replaces the rejected document and resubmits.

Student Records creates a Finance referral. Finance accepts the referral, checks whether a Finance hold blocks transcript issuance, records `CLEAR`, `HOLD`, or `CANNOT_VERIFY`, and completes the referral.

If Finance returns `HOLD`, the applicant receives clear applicant-visible action. If the result allows continuation, Student Records completes its review and sends the request to Registrar approval.

The Registrar approves or rejects the request. If approved, FAIDIA records or stores a controlled outcome: Completion / Collection / Dispatch Notice plus controlled demo transcript where applicable. The applicant is notified and can download the outcome or see collection instructions. The request completes when download, collection, delivery, or approved closure is recorded.

The supervisor can see stage durations, and the audit history contains the complete sequence.

## 3. Actors

| Actor | Role in the scenario |
|---|---|
| Applicant | Current or former student requesting a transcript |
| Originating officer | Student Records officer coordinating the parent request |
| Receiving officer | Finance officer completing hold/payment-reference verification |
| Registrar / authorized supervisor | Final decision maker |
| Organization admin | Configures departments, memberships, service, forms, documents, workflow, and branding |
| FAIDIA | Records state, files, notifications, audit events, and metrics |

## 4. Preconditions

Before the scenario starts:

- Savannah Technical College exists;
- Student Records, Finance, and Registrar exist;
- applicant, Records officer, Finance officer, Registrar/supervisor, and admin accounts exist;
- memberships are active;
- Transcript Request is active and published;
- form schema is published;
- document requirements are published;
- workflow version is published;
- private storage is configured;
- shared statuses are defined;
- feature flags required for the slice are enabled;
- seed data is synthetic or non-sensitive.

## 5. Required Service Data

Form data:

- full legal name;
- email;
- phone;
- admission or student number;
- national ID or passport number;
- programme;
- department/school where relevant;
- year of admission;
- year of completion/graduation;
- transcript purpose;
- one copy;
- delivery method: controlled download or physical collection;
- recipient details where relevant;
- manual payment reference, required for the Savannah demo and conditional in the generic V1 service model;
- declaration.

Documents:

- ID or passport: required;
- student ID or institutional identifier: conditional where available;
- optional proof of manual payment reference where policy requires it;
- one intentionally invalid sample document for correction-path testing.

## 6. Main Journey

### Phase 1 — Service Discovery

Applicant opens the organization service homepage or service catalogue.

Display:

- institution branding;
- service name;
- description;
- eligibility;
- requirements;
- required and conditional documents;
- manual payment-reference requirement;
- processing target;
- start action.

Record `service_viewed`.

Acceptance:

- only active published services appear;
- service version is identifiable;
- applicant can understand requirements before signing in.

### Phase 2 — Authentication And Draft

If unauthenticated, the applicant is redirected to sign in or registration and returned to the service after authentication.

Registration model:

- open email registration for demo;
- controlled applicant group for pilot.

Draft creation records:

- parent request;
- organization ID;
- applicant ID;
- service ID;
- published service-version link;
- status `DRAFT`;
- audit event `REQUEST_CREATED`;
- product event `request_started`.

Draft expiry: **30 days**.

### Phase 3 — Form, Files, Review, Submission

Applicant completes the configured form, uploads documents, reviews the summary, and submits.

Server validation checks:

- applicant ownership;
- organization context;
- active service version;
- required fields;
- required documents;
- manual payment reference when required by the published service version;
- duplicate active request rule.

Duplicate active request rule:

- warn and block another active Transcript Request unless a Supervisor or Organization Admin with `requests.override_duplicate_active` records an override with reason;
- applicants cannot override the block themselves;
- the applicant sees a staff-contact message when blocked;
- override is performed only by Supervisor or Organization Admin users with `requests.override_duplicate_active`;
- override requires a mandatory reason and records `DUPLICATE_REQUEST_OVERRIDE_GRANTED`.

Submission transaction creates or updates:

- final request reference;
- request status `SUBMITTED`;
- response snapshot;
- workflow instance;
- Records Review work item;
- assignment or unassigned department queue entry;
- status history;
- audit event `REQUEST_SUBMITTED`;
- applicant notification;
- product event `request_submitted`.

### Phase 4 — Records Review

Request appears in My Queue if assigned or Department Queue if unassigned.

Officer self-claim is allowed only for authorized officers within their own department.

Officer opens request and sees:

- applicant information;
- form responses;
- documents;
- internal status;
- applicant-safe public status;
- work item;
- current owner;
- available actions;
- applicant messages;
- internal notes;
- permitted audit history.

Start review transition:

- request `IN_REVIEW`;
- Records work item `IN_PROGRESS`;
- public status In Review;
- `first_action_at` and `review_started_at` captured;
- audit event `REVIEW_STARTED`.

### Phase 5 — Correction And Resubmission

Officer rejects one document with a clear reason.

Document status becomes `REJECTED`.

Correction request captures:

- applicant-visible reason;
- documents to replace;
- fields unlocked, if any;
- optional deadline.

Transitions:

- request `WAITING_ON_APPLICANT`;
- work item `WAITING_ON_APPLICANT`;
- public status Action Required.

Applicant replaces only permitted documents or fields.

Resubmission:

- correction marked complete;
- request returns to `IN_REVIEW`;
- work item returns to `READY` or `IN_PROGRESS`;
- audit event `CORRECTION_RESUBMITTED`;
- originating officer notified;
- correction response time recorded.

There is no dedicated parent request status for correction resubmission.

### Phase 6 — Finance Referral

Student Records creates a Finance referral.

Required referral fields:

- receiving department: Finance;
- type: Referral;
- requested action: confirm whether a Finance hold blocks transcript issuance;
- reason;
- expected output: `CLEAR`, `HOLD`, or `CANNOT_VERIFY`, with reason and verification date;
- due date;
- priority;
- relevant references/documents;
- applicant visibility setting.

Transaction creates:

- handoff;
- handoff history;
- Finance work item;
- audit event `HANDOFF_CREATED`;
- Finance notification;
- product event `handoff_created`.

Parent ownership remains with Student Records.

Request status becomes `WAITING_ON_DEPARTMENT`.

Public status becomes Additional Checks in Progress.

Finance accepts:

- validate organization;
- validate receiving department;
- validate `handoffs.accept` permission;
- validate handoff `PENDING_ACCEPTANCE`;
- record acceptance timestamp;
- audit event `HANDOFF_ACCEPTED`.

Finance completes:

- result code: `CLEAR`, `HOLD`, or `CANNOT_VERIFY`;
- explanatory note;
- verification date;
- officer;
- optional reference.

Completion transition:

- Finance work item `COMPLETED`;
- handoff `COMPLETED`;
- completion timestamp;
- audit event `HANDOFF_COMPLETED`;
- originator notification.

No `RETURNED_TO_ORIGINATOR` state is required.

### Phase 7 — Finance Result Handling

If Finance returns `CLEAR`, Records continues review.

If Finance returns `HOLD`, the request returns to applicant action with a clear applicant-visible reason or next step. This normally uses `WAITING_ON_APPLICANT` and Action Required.

If Finance returns `CANNOT_VERIFY`, the referral returns to Student Records for clarification. Student Records keeps parent ownership and decides the next action: resend a clarified Finance referral or request applicant action if the missing information belongs to the applicant. The request must not proceed to approval while mandatory Finance verification remains unresolved.

### Phase 8 — Records Completion And Registrar Approval

Records work can complete only when:

- required documents are `ACCEPTED`;
- correction is complete;
- required Finance result exists;
- Records checks are complete;
- no mandatory unresolved work item remains.

Records work item becomes `COMPLETED`.

Request becomes `PENDING_APPROVAL`.

Public status becomes Awaiting Decision.

Registrar approval is required for every Transcript Request. Registrar is represented as a `SUPERVISOR` membership profile with membership label **Registrar** and explicit `requests.approve` / `requests.reject` permissions.

Registrar sees:

- request summary;
- accepted documents;
- Records result;
- Finance result;
- timing;
- recommendation;
- approve/reject/return actions.

Approval transaction:

- validates permission;
- validates organization;
- validates request state;
- validates required steps complete;
- creates decision record;
- request `APPROVED`;
- approval timestamp;
- status history;
- audit event `REQUEST_APPROVED`;
- product event `request_approved`;
- outcome-generation/storage event.

Public status becomes Approved or Preparing Outcome. Preparing Outcome is shown only when there is a meaningful delay.

### Phase 9 — Outcome And Completion

V1 outcome:

- Completion / Collection / Dispatch Notice;
- optional controlled sample transcript PDF in demo mode;
- exact issued copy stored when institution provides it.

Process:

1. create pending issued-document record;
2. generate controlled notice or record externally produced outcome;
3. calculate checksum where available;
4. upload to private storage;
5. link exact issued file;
6. mark issued;
7. create `OUTCOME_GENERATED` and `DOCUMENT_ISSUED`.

Applicant notification:

- in-app required;
- email optional for demo and required before external pilot.

Applicant access requires:

- authorization;
- short-lived signed URL for downloads;
- exact issued copy;
- download/access event;
- no permanent public file link.

Completion rule:

- request becomes `COMPLETED` only after recorded download, collection, delivery, or approved institutional closure rule.

Audit:

- `DOCUMENT_DOWNLOADED` where download happens;
- `REQUEST_COMPLETED` when closure is recorded.

## 7. Alternate Paths

Finance declines: reason required; originator notified; parent remains with Records.

Finance requests clarification: handoff moves to clarification state; originator provides missing information; history is preserved.

Registrar rejects: applicant-visible reason required; request becomes `REJECTED`; applicant notified; decision/audit retained.

Transfer: postponed from Stage 1 main path.

Draft abandonment: draft expires after 30 days unless policy changes.

Concurrent staff actions: server validates current state and stale actions fail safely.

## 8. Required Notifications

Minimum V1 notifications:

- submission confirmation;
- assignment or claim;
- correction request;
- correction resubmission;
- new Finance referral;
- referral accepted;
- referral declined/clarification;
- referral completed;
- Finance HOLD applicant action;
- approval;
- rejection;
- outcome ready;
- overdue warning.

## 9. Required Audit Events

- `REQUEST_CREATED`
- `REQUEST_SUBMITTED`
- `DUPLICATE_REQUEST_OVERRIDE_GRANTED`
- `REQUEST_VIEWED`
- `REVIEW_STARTED`
- `DOCUMENT_UPLOADED`
- `DOCUMENT_REJECTED`
- `DOCUMENT_ACCEPTED`
- `CORRECTION_REQUESTED`
- `CORRECTION_RESUBMITTED`
- `HANDOFF_CREATED`
- `HANDOFF_ACCEPTED`
- `HANDOFF_DECLINED`
- `HANDOFF_RETURNED_FOR_CLARIFICATION`
- `HANDOFF_COMPLETED`
- `WORK_ITEM_COMPLETED`
- `REQUEST_APPROVED`
- `REQUEST_REJECTED`
- `OUTCOME_GENERATED`
- `DOCUMENT_ISSUED`
- `DOCUMENT_DOWNLOADED`
- `REQUEST_COMPLETED`

## 10. Reporting Acceptance

The completed scenario must produce real values for:

- time to first action;
- correction response time;
- referral acceptance time;
- referral completion time;
- end-to-end time;
- number of handoffs;
- number of corrections;
- current owner;
- overdue state;
- external coordination used.

## 11. Security Acceptance

- applicant cannot access another applicant's request or files;
- officer cannot access another organization;
- officer cannot access unauthorized department work;
- Finance sees referral work but not unrelated work;
- Organization Admin does not automatically read sensitive request content;
- internal notes never appear to applicants;
- file access is permission-checked and time-limited;
- critical actions validate membership server-side;
- audit events are append-only to ordinary users;
- repeated actions do not create duplicate outcomes.

## 12. Coding-Agent Instruction

Build only the approved Stage 1 path. Preserve parent ownership during referral. Do not implement transfer as active V1 scope. Do not invent statuses or routes.
