# FAIDIA Stage 0 — V1 Vertical Slice

Status: **APPROVED_FOR_STAGE_1**  
Version: **1.4**  
Last updated: **2026-07-13**  
Product: **FAIDIA — Service Operations Platform**

## 1. Purpose

This document defines the first complete FAIDIA journey across authentication, versioned service configuration, database records, applicant pages, officer work, Finance referral, Registrar decision, notifications, outcome access, completion, reopening, audit events, and reporting.

Stage 1 is this vertical slice, not the full V1 page inventory.

## 2. Acceptance scenario

An applicant uses Savannah Technical College's service catalogue, selects Transcript Request, signs in or registers, completes the seeded form, uploads required documents, enters the required manual payment reference, and submits.

Student Records reviews the request, rejects one document, and requests correction. The applicant replaces the document and resubmits.

Student Records creates a Finance referral. Finance accepts and records `CLEAR`, `HOLD`, or `CANNOT_VERIFY`.

- `CLEAR` permits Student Records to continue.
- `HOLD` returns the request to applicant action.
- `CANNOT_VERIFY` returns the referral for clarification.

After all prerequisites are complete, Registrar approves, rejects, or returns for clarification.

If approved, FAIDIA stores or records the controlled outcome. The applicant is notified. The request becomes `COMPLETED` only after controlled download, recorded physical collection, or exceptional Supervisor manual closure.

The supervisor can see stage duration and backlog. Audit history contains the complete sequence.

## 3. Actors

| Actor | Role |
|---|---|
| Applicant | Owns the request and applicant-visible actions |
| Student Records Officer | Coordinates review, correction, referral, and outcome processing |
| Finance Officer | Accepts Finance referral and records the result |
| Supervisor | Assigns/reassigns, monitors, reopens, and may manually close |
| Registrar profile | Supervisor membership profile with approval grants |
| Organization Admin | Limited organization/service configuration; no sensitive request content |
| FAIDIA | Enforces state, permissions, versions, audit, notifications, and metrics |

## 4. Preconditions

- Savannah Technical College exists.
- Student Records, Finance, and Registrar departments exist.
- Synthetic applicant and staff accounts exist.
- Memberships and department scopes are active.
- A seeded Transcript Request service/form/document/workflow version is published.
- Private storage is configured.
- Shared statuses and permission helpers exist.
- Required Stage 1 feature flags are enabled.
- No full form or workflow builder is required.

## 5. Version binding

At draft creation, record:

- service ID and service version ID;
- form version ID;
- document-requirement version ID;
- workflow version ID.

The request remains pinned to these versions.

New publications affect only new requests. Submitted requests never migrate. A draft whose pinned version is retired becomes read-only and must be restarted.

## 6. Main journey

### Phase 1 — Discovery

Display institution branding, service description, eligibility, requirements, document checklist, manual payment-reference requirement, processing target, and start action.

Acceptance:

- only active published services appear;
- the published version is identifiable;
- requirements are understandable before sign-in.

### Phase 2 — Authentication and draft

Unauthenticated applicants are returned to the service after registration or sign-in.

Draft creation records:

- organization ID;
- applicant ID;
- exact version IDs;
- status `DRAFT`;
- `REQUEST_CREATED`;
- `request_started`.

Draft expiry is 30 days.

### Phase 3 — Form, files, review, and submission

Server validation checks:

- applicant ownership;
- organization context;
- pinned version availability;
- required fields;
- required documents;
- required payment reference;
- duplicate active request rule.

Duplicate active request:

- applicant is warned and blocked;
- applicant cannot override;
- Supervisor or Organization Admin may override only with `requests.override_duplicate_active`;
- mandatory reason is required;
- `DUPLICATE_REQUEST_OVERRIDE_GRANTED` is recorded;
- Organization Admin sees only minimum metadata needed for the intervention.

Submission transaction records:

- final request reference;
- status `SUBMITTED`;
- response snapshot;
- workflow instance;
- Student Records work item;
- queue/assignment state;
- status history;
- `REQUEST_SUBMITTED`;
- applicant notification;
- `request_submitted`.

### Phase 4 — Student Records review

Officer access requires active organization and department membership plus assigned, claimed, or permitted department work.

Starting review:

- request `IN_REVIEW`;
- work item `IN_PROGRESS`;
- public status In Review;
- `first_action_at`;
- `review_started_at`;
- `REVIEW_STARTED`.

### Phase 5 — Correction

Officer may reject a document with an applicant-visible reason.

Correction records:

- reason;
- documents to replace;
- fields unlocked;
- deadline where used.

Transitions:

- request `WAITING_ON_APPLICANT`;
- work item `WAITING_ON_APPLICANT`;
- public status Action Required;
- `CORRECTION_REQUESTED`.

Applicant replaces only unlocked fields/files.

Resubmission:

- request `IN_REVIEW`;
- work item `READY` or `IN_PROGRESS`;
- `CORRECTION_RESUBMITTED`;
- originator notification;
- correction response time.

### Phase 6 — Finance referral

Required referral fields:

- receiving department Finance;
- requested action;
- reason;
- expected result schema;
- due date;
- priority;
- relevant references/documents;
- applicant-visibility setting.

Creation transaction records handoff, history, Finance work item, notification, `HANDOFF_CREATED`, and `handoff_created`.

Parent ownership remains Student Records.

Request becomes `WAITING_ON_DEPARTMENT`. Public status is Additional Checks in Progress.

Finance acceptance validates organization, department, permission, current state, and records `HANDOFF_ACCEPTED`.

Finance result:

- code;
- explanatory note;
- verification date;
- officer;
- optional reference.

`CLEAR`:

- Finance work item `COMPLETED`;
- handoff `COMPLETED`;
- request returns `IN_REVIEW`;
- Records work item `READY` or `IN_PROGRESS`;
- `HANDOFF_COMPLETED`.

`HOLD`:

- Finance work item and handoff `COMPLETED`;
- request `WAITING_ON_APPLICANT`;
- Records work item `WAITING_ON_APPLICANT`;
- applicant receives exact next action;
- applicant response returns request to `IN_REVIEW`;
- re-verification uses a new Finance referral if required.

`CANNOT_VERIFY`:

- Finance work item `RETURNED`;
- handoff `RETURNED_FOR_CLARIFICATION`;
- request `IN_REVIEW`;
- Records work item `IN_PROGRESS`;
- Records clarifies and resubmits the same handoff to `PENDING_ACCEPTANCE`, or requests applicant action first;
- approval remains blocked.

Finance decline:

- handoff `DECLINED`;
- Finance work item `CANCELLED`;
- request `IN_REVIEW`;
- revised request uses a new handoff record;
- history remains immutable.

### Phase 7 — Student Records completion

Records work completes only when:

- required documents are `ACCEPTED`;
- correction is resolved;
- required Finance result is `CLEAR`;
- Records checks are complete;
- no mandatory unresolved work item remains.

Then:

- Records work item `COMPLETED`;
- request `PENDING_APPROVAL`;
- public status Awaiting Decision;
- approval work item ready.

### Phase 8 — Registrar decision

After Student Records completes its required work and Finance has recorded `CLEAR`, the request transitions to `PENDING_APPROVAL` and becomes available in:

```text
/supervisor/approvals
```

The Registrar-profile Supervisor selects the request and is taken to:

```text
/officer/requests/[id]
```

The request-details page remains inside the shared Officer processing shell.

Supervisors use the same processing shell as Officers, with additional supervisor-only navigation and controls determined by their active membership profile and exact permissions.

For a Registrar-profile Supervisor, the request-details page displays an embedded decision panel containing:

- approve;
- reject;
- return for clarification.

Ordinary Officers and standard Supervisors must not see or execute these actions.

The route flow is:

```text
Finance result CLEAR
        ↓
Student Records completes required work
        ↓
Request becomes PENDING_APPROVAL
        ↓
/supervisor/approvals
        ↓
Registrar-profile Supervisor selects request
        ↓
/officer/requests/[id]
        ↓
Embedded Registrar decision panel
        ↓
Approve | Reject | Return for clarification
```

The Stage 1 application must not implement:

```text
/officer/requests/[id]/approval
```

Every Registrar decision action must be authorized server-side using:

- the active organization membership;
- the active membership profile;
- the exact permission grant;
- the request organization;
- the request department;
- the current request status;
- the Finance clearance result;
- the active workflow version.

Client-side rendering, hidden buttons, route naming, and navigation visibility are not authorization.

#### Approve

Approval requires:

- Finance result `CLEAR`;
- all required review work completed;
- no unresolved mandatory work item;
- request status `PENDING_APPROVAL`;
- `requests.approve`;
- the Registrar Supervisor profile.

Approval must:

- create an immutable decision record;
- transition the request to `APPROVED`;
- record `REQUEST_APPROVED`;
- begin outcome processing.

#### Reject

Rejection requires:

- a rejectable request state;
- `requests.reject`;
- the Registrar Supervisor profile;
- an applicant-visible rejection reason.

Rejection must:

- create an immutable decision record;
- transition the request to `REJECTED`;
- notify the applicant;
- record `REQUEST_REJECTED`.

#### Return for clarification

Return for clarification requires:

- `requests.return_for_clarification`;
- the Registrar Supervisor profile;
- an internal reason;
- an applicant-visible instruction where applicable.

The action must:

- record decision `RETURNED_FOR_CLARIFICATION`;
- transition the request to `IN_REVIEW`;
- make the Student Records work item `READY`;
- record `REQUEST_RETURNED_FOR_CLARIFICATION`;
- block outcome processing;
- preserve all previous workflow and decision history.

### Phase 9 — Outcome

Outcome:

- Completion / Collection / Dispatch Notice;
- optional controlled demo transcript;
- exact institution-issued copy when available.

Process:

1. create pending issued-outcome record;
2. generate notice or record external outcome;
3. calculate checksum where available;
4. upload to private storage;
5. link exact file;
6. mark issued;
7. record `OUTCOME_GENERATED` and `DOCUMENT_ISSUED`;
8. request `OUTCOME_READY`;
9. notify applicant.

Outcome failure:

- request `OUTCOME_FAILED`;
- public status Outcome Issue;
- `OUTCOME_GENERATION_FAILED`;
- authorized outcome processor may retry to `OUTCOME_PREPARATION`;
- completion is blocked.

### Phase 10 — Completion

Controlled download:

- applicant authorization is validated;
- short-lived signed URL is issued;
- `DOCUMENT_DOWNLOADED` is recorded;
- request transitions `OUTCOME_READY` to `COMPLETED`;
- `REQUEST_COMPLETED` is recorded.

Physical collection:

- authorized Student Records officer records collector name, identifier/relationship, collection date/time, outcome reference, and optional note;
- request transitions `OUTCOME_READY` to `COMPLETED`;
- `OUTCOME_COLLECTED` and `REQUEST_COMPLETED` are recorded.

Exceptional manual closure:

- Supervisor only;
- requires `requests.manual_close`;
- only from `OUTCOME_READY`;
- mandatory reason code, note, and evidence reference;
- `REQUEST_MANUALLY_CLOSED`;
- request `COMPLETED`;
- `REQUEST_COMPLETED`.

No generic delivery completion event exists in Stage 1.

## 7. Reopening

A Supervisor with `requests.reopen` may reopen `REJECTED` or `COMPLETED`.

Required:

- mandatory reason;
- current-state validation;
- new or reactivated Student Records work item;
- request returns to `IN_REVIEW`;
- public status In Review;
- `REQUEST_REOPENED`;
- applicant and department notification.

Previous decisions, outcomes, completion events, and audit history remain immutable.

An issued outcome remains available unless separately revoked by a user with `documents.revoke`. Revocation records `DOCUMENT_REVOKED`.

`CANCELLED` and `EXPIRED` cannot be reopened in Stage 1.

## 8. Expiry

- `DRAFT` expires after 30 days.
- `WAITING_ON_APPLICANT` expires only when a recorded deadline passes.
- request becomes `EXPIRED`;
- applicant status becomes Expired;
- reason and expiry date are shown;
- `REQUEST_EXPIRED` is recorded;
- expiry is terminal in Stage 1.

## 9. Required notifications

- submission confirmation;
- correction request;
- correction resubmission;
- Finance referral created;
- Finance referral accepted;
- Finance clarification/decline;
- Finance result completed;
- Finance HOLD applicant action;
- approval;
- rejection;
- return for clarification;
- outcome ready;
- expiry;
- completion;
- reopening;
- overdue warning.

## 10. Required audit events

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
- `REQUEST_RETURNED_FOR_CLARIFICATION`
- `REQUEST_REJECTED`
- `OUTCOME_GENERATED`
- `OUTCOME_GENERATION_FAILED`
- `DOCUMENT_ISSUED`
- `DOCUMENT_DOWNLOADED`
- `OUTCOME_COLLECTED`
- `REQUEST_MANUALLY_CLOSED`
- `REQUEST_COMPLETED`
- `REQUEST_REOPENED`
- `DOCUMENT_REVOKED`
- `REQUEST_EXPIRED`

## 11. Reporting acceptance

Produce real values for:

- time to first action;
- correction response time;
- referral acceptance time;
- referral completion time;
- approval waiting time;
- outcome-ready time;
- end-to-end time;
- number of handoffs;
- number of corrections;
- current owner;
- overdue state;
- completion method;
- reopened count;
- manual closure count.

## 12. Security acceptance

- applicant ownership isolation;
- organization isolation;
- department isolation;
- Finance access limited to referral work;
- ordinary Officer approval denied;
- Organization Admin sensitive request access denied;
- internal notes hidden from applicant;
- signed file access is time-limited and authorized;
- published versions are immutable;
- critical actions are transactional and idempotent;
- audit events are append-only.

## 13. Coding-agent instruction

Build only the `STAGE_1_REQUIRED` path. Preserve parent ownership during referral. Do not implement transfer, full builders, automatic migrations, additional completion triggers, or broader access.
