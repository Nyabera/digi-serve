# FAIDIA Stage 0 — V1 Vertical Slice

Status: **DRAFT — requires product-owner approval**  
Version: **0.1**  
Last updated: **2026-07-12**  
Product: **FAIDIA — Service Operations Platform**  

> This Stage 0 document is based on the uploaded FAIDIA product description, V1 structure, full development structure, recommended stack and strict build-order documents. Recommended defaults are filled in, while unresolved items are explicitly marked.


## 1. Purpose

This document defines the first complete FAIDIA journey that must work across authentication, database records, applicant pages, officer pages, departmental handoffs, permissions, notifications, timestamps, audit events and basic reporting.

The first vertical slice is not a visual-only demo. It is the end-to-end acceptance scenario for the working V1.

## 2. Acceptance scenario

> An applicant visits Savannah Technical College's service catalogue, selects Transcript Request, signs in, completes the form, uploads the required documents and submits. Student Records reviews the request and asks for one correction. The applicant replaces the rejected document and resubmits. Student Records creates a Finance referral. Finance accepts, completes the check and returns the result. Student Records completes its review and sends the request to the Registrar. The Registrar approves the request. FAIDIA records or generates the controlled outcome, notifies the applicant and completes the request. The applicant can access the outcome, the supervisor can see stage durations and the audit history contains the complete sequence.

## 3. Actors

| Actor | Role in the scenario |
|---|---|
| Applicant | Current or former student requesting a transcript |
| Originating officer | Student Records officer coordinating the parent request |
| Receiving officer | Finance officer completing a defined verification |
| Supervisor / approver | Registrar or authorized supervisor making the final decision |
| Organization admin | Configures departments, memberships and published service |
| FAIDIA | Records state, files, notifications, audit events and metrics |

## 4. Preconditions

Before the scenario starts:

- Savannah Technical College exists;
- Student Records, Finance and Registrar exist;
- applicant, Records officer, Finance officer, supervisor and admin accounts exist;
- memberships are active;
- Transcript Request is active and published;
- a published form schema exists;
- document requirements exist;
- a published workflow version exists;
- shared status definitions exist;
- private storage is configured;
- required feature flags are enabled;
- seed data is synthetic or non-sensitive.

## 5. Required service data

### Form data

- admission number;
- full name;
- email;
- phone;
- programme;
- year of admission;
- year of completion;
- transcript purpose;
- delivery method;
- recipient details;
- declaration.

### Documents

- ID or passport;
- student ID or institutional identifier;
- one intentionally invalid sample document for the correction path;
- optional payment reference or receipt if the fee path is enabled.

## 6. Main journey

### Phase 1 — Service discovery

#### Step 1: Open organization service portal

**Actor:** Applicant  
**Page:** Public organization homepage or service catalogue

Display:

- service name;
- description;
- eligibility;
- requirements;
- required documents;
- fee or no-fee state;
- processing target;
- start action.

Record:

- `service_viewed`.

Acceptance:

- only active published services appear;
- institution branding appears;
- the service version is identifiable;
- the applicant can understand requirements before signing in.

#### Step 2: Open service details

Display a complete service description and a clear Start Request action.

### Phase 2 — Authentication and draft

#### Step 3: Select Start Request

If unauthenticated, redirect to sign in or registration and return to the service afterward.

#### Step 4: Authenticate

Validate identity and session. Applicants must not reach staff workspaces.

#### Step 5: Create draft request

Create or record:

- parent request;
- organization ID;
- applicant ID;
- service ID;
- published service-version link;
- status `DRAFT`;
- initial audit event `REQUEST_CREATED`;
- product event `request_started`.

The request must belong to the applicant and current organization context.

### Phase 3 — Form, files and submission

#### Step 6: Complete application form

Requirements:

- fields load from the published schema;
- client validation improves usability;
- server validation remains authoritative;
- draft can be saved and restored;
- another applicant cannot access the draft.

#### Step 7: Upload documents

Requirements:

- private storage;
- allowed MIME types and extensions;
- file-size limits;
- sanitized names;
- metadata stored in PostgreSQL;
- request-level association;
- replacement before submission;
- no permanent public URL.

Audit:

- `DOCUMENT_UPLOADED`.

#### Step 8: Review submission

Show a read-only summary of:

- field responses;
- document checklist;
- fee or payment reference;
- declaration;
- processing target.

#### Step 9: Confirm submission

Server validates:

- applicant ownership;
- active service version;
- required fields;
- required documents;
- duplicate-request rule;
- organization context.

One transaction should create or update:

- final request reference;
- status `SUBMITTED`;
- response snapshot;
- workflow instance;
- Records Review work item;
- assignment or unassigned queue entry;
- status history;
- audit event `REQUEST_SUBMITTED`;
- applicant notification;
- product event `request_submitted`;
- domain/outbox event when implemented.

Applicant sees:

- confirmation;
- reference;
- Submitted status;
- expected next step.

### Phase 4 — Records review

#### Step 10: Enter correct queue

Request appears in My Queue if assigned, otherwise Department Queue.

Authorization must prevent cross-organization and unauthorized cross-department access.

#### Step 11: Officer opens request

Display:

- applicant information;
- form responses;
- documents;
- public and internal status;
- work item;
- current owner;
- available actions;
- applicant messages;
- internal notes;
- timeline;
- permitted audit history.

Record:

- `request_opened_by_officer`;
- `REQUEST_VIEWED` where sensitive-access logging is enabled.

#### Step 12: Start review

Transitions:

- request to `IN_REVIEW`;
- Records work item to `IN_PROGRESS`;
- public status to In Review;
- capture `first_action_at`;
- record `first_action_taken` and `REVIEW_STARTED`.

### Phase 5 — Correction and resubmission

#### Step 13: Reject one document

Officer must choose the document and provide a clear rejection reason.

Document becomes `REJECTED` or the approved equivalent.

Audit:

- `DOCUMENT_REJECTED`.

#### Step 14: Request correction

Officer defines:

- applicant-visible reason;
- fields unlocked, if any;
- documents to replace;
- optional deadline.

Transitions:

- request to `WAITING_ON_APPLICANT`;
- work item to `WAITING_ON_APPLICANT`;
- public status to Action Required.

Create:

- structured correction record;
- status history;
- `CORRECTION_REQUESTED`;
- in-app notification;
- email when enabled.

#### Step 15: Applicant opens correction

Show:

- exact reason;
- exact fields/files requiring action;
- deadline;
- resubmit action.

Do not expose internal notes.

#### Step 16: Replace rejected document

Only permitted fields and documents are editable.

Previous document remains linked for audit; replacement does not silently overwrite it.

#### Step 17: Resubmit correction

Transaction:

- correction marked complete;
- request returns to `IN_REVIEW`;
- work item returns to `READY` or `IN_PROGRESS`;
- status history;
- `CORRECTION_RESUBMITTED`;
- originating officer notification;
- applicant response time.

### Phase 6 — Finance referral

#### Step 18: Create referral

Originating officer enters:

- receiving department: Finance;
- type: Referral;
- requested action;
- reason;
- expected output;
- due date;
- priority;
- relevant documents/references;
- applicant visibility.

Example action:

> Confirm whether the applicant has a Finance hold that prevents transcript issuance.

Example output:

> Return CLEAR, HOLD or CANNOT_VERIFY, with a reason and verification date.

Transaction creates:

- handoff;
- handoff history;
- Finance work item;
- `HANDOFF_CREATED`;
- Finance notification;
- `handoff_created`.

Parent ownership remains with Student Records.

Request becomes `WAITING_ON_DEPARTMENT`.

Public status becomes Additional Checks in Progress.

#### Step 19: Finance views Pending Acceptance

Only permitted Finance staff may open it.

#### Step 20: Finance accepts

Validate:

- current organization;
- receiving department;
- acceptance permission;
- current handoff state;
- idempotency.

Transaction:

- handoff `ACCEPTED`;
- Finance work item ready or assigned;
- acceptance timestamp;
- status history;
- `HANDOFF_ACCEPTED`;
- originator notification;
- `handoff_accepted`.

#### Step 21: Start Finance work

Handoff/work item move to `IN_PROGRESS`.

Finance may add internal or department-only notes.

#### Step 22: Record result

Required structured result:

- result code;
- explanatory note;
- verification date;
- officer;
- optional reference.

#### Step 23: Complete referral

Transaction:

- Finance work item `COMPLETED`;
- handoff `COMPLETED` or approved terminal state;
- completion timestamp;
- history;
- `HANDOFF_COMPLETED`;
- originator notification;
- `handoff_completed`.

Parent request remains open.

### Phase 7 — Records completion and approval

#### Step 24: Review Finance result

If Finance returns HOLD, follow the approved policy.

**Decision required:** reject, return to applicant, pause or allow a supervisor exception.

#### Step 25: Complete Records work

Prerequisites:

- required documents accepted;
- correction complete;
- Finance result exists;
- Records checks complete.

Records work item becomes `COMPLETED`.

Request moves to `PENDING_APPROVAL`.

Public status becomes Awaiting Decision.

#### Step 26: Open approval queue

Registrar sees:

- request summary;
- accepted documents;
- Records result;
- Finance result;
- timing;
- recommendation;
- approve/reject/return actions.

#### Step 27: Approve

Validate:

- permission;
- organization;
- valid request state;
- required steps complete;
- no unresolved mandatory work items;
- idempotency.

Transaction:

- decision record;
- request `APPROVED`;
- approval timestamp;
- status history;
- `REQUEST_APPROVED`;
- `request_approved`;
- outcome-generation event.

Public status becomes Approved or Preparing Outcome.

### Phase 8 — Outcome and completion

#### Step 28: Prepare controlled outcome

V1 outcome:

- Completion / Collection / Dispatch Notice;
- optional controlled sample transcript PDF.

Process:

1. create pending issued-document record;
2. generate on server or record externally produced outcome;
3. calculate checksum where generated;
4. upload to private storage;
5. link exact issued file;
6. mark issued;
7. create `OUTCOME_GENERATED` and `DOCUMENT_ISSUED`.

Repeated processing must not create duplicates.

#### Step 29: Notify applicant

Create:

- in-app notification;
- essential email when enabled;
- delivery record.

Public status becomes Ready.

#### Step 30: Applicant accesses outcome

Require:

- authorization;
- short-lived signed URL;
- exact issued copy;
- download/access event;
- no permanent public file link.

#### Step 31: Complete request

**Decision required:** complete on issuance or on recorded download/collection.

Transaction:

- request `COMPLETED`;
- remaining work closed;
- completion timestamp;
- final history;
- `REQUEST_COMPLETED`;
- `request_completed`.

Public status becomes Completed.

## 7. Alternate paths

### Finance declines

- mandatory reason;
- originator notification;
- parent ownership stays with Records;
- originator may clarify, resend or choose another action.

### Finance returns for clarification

- handoff enters clarification state;
- originator adds missing information;
- all changes create history;
- original instructions are not silently overwritten.

### Registrar rejects

- applicant-visible reason required;
- optional internal reason;
- active work closes appropriately;
- request becomes `REJECTED`;
- applicant is notified;
- decision/audit record remains.

### Transfer

- used only when ownership genuinely changes;
- ownership changes only after acceptance;
- originator remains visible in history.

### Draft abandonment

- draft remains until expiry/deletion policy;
- `request_abandoned` is recorded using a defined inactivity threshold.

### Duplicate submission

- warn or block when an active request exists, according to the final service rule.

### Concurrent staff actions

- server validates current state;
- critical changes use transactions;
- stale second action fails safely.

## 8. Notifications

Minimum:

- submission confirmation;
- assignment;
- correction request;
- correction resubmission;
- new Finance referral;
- referral accepted;
- referral declined/clarification;
- referral completed;
- approval;
- rejection;
- outcome ready;
- overdue warning.

Applicants are notified on meaningful public changes, not every internal event.

## 9. Audit events

- `REQUEST_CREATED`
- `REQUEST_SUBMITTED`
- `REQUEST_VIEWED`
- `REVIEW_STARTED`
- `DOCUMENT_UPLOADED`
- `DOCUMENT_REJECTED`
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

## 10. Required timestamps

### Request

- `created_at`
- `submitted_at`
- `first_opened_at`
- `first_action_at`
- `review_started_at`
- `correction_requested_at`
- `correction_resubmitted_at`
- `approved_at`
- `rejected_at`
- `outcome_ready_at`
- `completed_at`
- `cancelled_at`

### Work item

- `created_at`
- `assigned_at`
- `started_at`
- `due_at`
- `completed_at`
- `returned_at`

### Handoff

- `created_at`
- `sent_at`
- `accepted_at`
- `declined_at`
- `started_at`
- `due_at`
- `completed_at`
- `returned_at`

### Document

- `uploaded_at`
- `reviewed_at`
- `accepted_at`
- `rejected_at`
- `replaced_at`
- `issued_at`
- `downloaded_at`

## 11. Reporting acceptance

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

## 12. Security acceptance

- applicant cannot access another applicant's request or files;
- officer cannot access another organization;
- officer cannot access an unauthorized department;
- internal notes never appear to applicants;
- file access is permission-checked and time-limited;
- critical actions validate membership on the server;
- audit events are append-only to ordinary users;
- repeated actions do not create duplicate outcomes.

## 13. Definition of complete

The vertical slice is complete only when:

- it uses real database records;
- no operational page uses hard-coded values;
- every actor can complete their portion;
- correction, referral and approval paths work;
- statuses remain consistent;
- notifications and audit events are created;
- exact outcome is linked;
- reports derive from timestamps/events;
- tenant and department permissions are tested;
- applicant flow works on mobile;
- automated and manual end-to-end tests pass.

## 14. Coding-agent instruction

> Implement only the approved step in the current task. Do not redesign the workflow, invent statuses or mix internal notes with applicant communication. Preserve parent ownership during a referral and use server-side authorization, transactions and audit events for critical changes.
