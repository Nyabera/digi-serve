---
title: Transcript Request Workflow Specification
stage: 2
status: READY_FOR_OWNER_APPROVAL
version: 1.1.0
last_updated: 2026-07-16
---

# Transcript Request Workflow Specification

## 1. Workflow overview

```text
DRAFT
  ↓
SUBMITTED
  ↓
RECORDS_REVIEW
  ├── AWAITING_APPLICANT_CORRECTION
  │       ↓
  │   RECORDS_REVIEW
  │
  ├── REJECTED
  │
  └── RECORDS_CLEARED
          ↓
FINANCE_REFERRAL_PENDING_ACCEPTANCE
          ↓
FINANCE_REVIEW
  ├── AWAITING_APPLICANT_CORRECTION
  │       ↓
  │   FINANCE_REVIEW
  │
  └── FINANCE_CLEARED
          ↓
REGISTRAR_APPROVAL
  ├── RECORDS_REVIEW
  ├── REJECTED
  └── APPROVED_PENDING_ISSUANCE
          ├── OFFICIAL_UPLOAD
          └── DEMO_GENERATED
                    ↓
                COMPLETED
```

The applicant sees one request.

Records Review, Finance Referral, Registrar Approval and Issuance are separate internal work items or controlled actions.

## 2. Records Review

| Property | Value |
|---|---|
| Step key | `records-review` |
| Department | Student Records |
| Type | `OFFICER_REVIEW` |
| Initial work-item state | `READY` |
| Completion work-item state | `COMPLETED` |

The Records officer must:

1. start the review;
2. confirm identity;
3. match the admission number;
4. review academic details;
5. accept or reject required documents;
6. confirm eligibility;
7. request corrections where necessary;
8. reject only where the applicant cannot be identified, is ineligible or a blocking policy applies;
9. create the Finance referral after Records clearance.

Required completion output:

```text
RECORD_MATCHED
IDENTITY_CONFIRMED
DOCUMENTS_ACCEPTED
RECORDS_CLEAR
```

## 3. Finance Referral

| Property | Value |
|---|---|
| Handoff type | `REFERRAL` |
| Originating department | Student Records |
| Receiving department | Finance |
| Parent request owner | Student Records |
| Finance work-item type | `PAYMENT_CHECK` |

Required requested action:

> Confirm that Transcript Request fee reference `[paymentReference]` was received and confirm whether any Finance hold prevents transcript issuance.

Finance results:

```text
FINANCE_CLEAR
PAYMENT_NOT_FOUND
AMOUNT_MISMATCH
OUTSTANDING_BALANCE
CLARIFICATION_REQUIRED
```

Rules:

1. Finance must accept the referral before work starts.
2. Finance cannot edit academic fields.
3. Finance sees only data and documents required for the check.
4. Any result other than `FINANCE_CLEAR` requires a reason.
5. Completion returns a structured result to Student Records.
6. Student Records remains the parent-request owner.
7. Registrar Approval cannot start until Finance returns `FINANCE_CLEAR`.
8. Where applicant action can resolve the issue, Student Records opens a targeted correction and later reactivates the Finance check.

## 4. Registrar Approval

| Property | Value |
|---|---|
| Step key | `registrar-approval` |
| Department | Registrar |
| Type | `APPROVAL` |
| Required permission | `requests.approve` |

Preconditions:

- Records Review is complete.
- Every required document is accepted.
- Finance returned `FINANCE_CLEAR`.
- No required work item remains open.
- The request data required for the final decision is available.

Allowed actions:

- Approve.
- Reject with reason.
- Return to Student Records with reason.
- Add an internal approval note.

Approval transitions the request to:

```text
APPROVED_PENDING_ISSUANCE
```

Approval does not complete the request.

## 5. Issuance step

| Property | Value |
|---|---|
| Step key | `transcript-issuance` |
| Type | `DOCUMENT_ISSUANCE` |
| Preferred mode | `OFFICIAL_UPLOAD` |
| Fallback mode | `DEMO_GENERATED` |

### 5.1 Official upload path

1. Registrar uploads the official transcript PDF.
2. FAIDIA validates the file.
3. FAIDIA stores it privately.
4. FAIDIA calculates a checksum.
5. FAIDIA creates the issued-document record.
6. FAIDIA records `issuance_mode = OFFICIAL_UPLOAD`.
7. FAIDIA notifies the applicant.
8. The request becomes `COMPLETED`.

### 5.2 Demonstration generation path

1. An authorized user or system action selects the fallback path.
2. FAIDIA reads seeded synthetic academic data.
3. FAIDIA generates a PDF marked `DEMONSTRATION DATA` on every page.
4. FAIDIA stores it privately.
5. FAIDIA calculates a checksum.
6. FAIDIA creates the issued-document record.
7. FAIDIA records `issuance_mode = DEMO_GENERATED`.
8. FAIDIA notifies the applicant.
9. The request becomes `COMPLETED`.

### 5.3 Failure rule

If generation, validation, upload, storage or issued-document creation fails, the request remains:

```text
APPROVED_PENDING_ISSUANCE
```

No applicant completion notification is sent.

## 6. Allowed actions by stage

| Stage | Actor | Allowed actions |
|---|---|---|
| Draft | Applicant | Save, upload, replace, delete draft, submit |
| Submitted / unassigned | Supervisor | Assign |
| Records Review | Records officer | Start review, review documents, add internal note, send applicant message, request correction, reject, create Finance referral |
| Awaiting correction | Applicant | Edit flagged fields, replace rejected documents, respond, resubmit |
| Finance referral pending | Finance officer | Accept, decline with reason, return for clarification |
| Finance Review | Finance officer | Start work, add note, record result, complete referral |
| Finance result returned | Records officer | Review result, open targeted correction, reactivate Finance check, advance to Registrar |
| Registrar Approval | Registrar approver | Approve, reject, return to Records, add note |
| Approved pending issuance | Authorized Registrar user | Upload official PDF |
| Approved pending issuance | Authorized system or admin path | Generate demonstration transcript |
| Approved pending issuance | Authorized user | Retry failed issuance |
| Completed | Authorized users | View, download, audit |
| Rejected | Applicant and authorized staff | View reason |
| Cancelled | Applicant and authorized staff | View reason |
| Any active stage | Authorized supervisor or admin | Cancel with reason |

## 7. Internal request statuses

```text
DRAFT
SUBMITTED
RECORDS_REVIEW
AWAITING_APPLICANT_CORRECTION
RECORDS_CLEARED
FINANCE_REFERRAL_PENDING_ACCEPTANCE
FINANCE_REVIEW
FINANCE_CLEARED
REGISTRAR_APPROVAL
APPROVED_PENDING_ISSUANCE
COMPLETED
REJECTED
CANCELLED
```

## 8. Applicant-safe statuses

| Internal status | Applicant-facing status |
|---|---|
| `DRAFT` | Draft |
| `SUBMITTED` | Submitted |
| `RECORDS_REVIEW` | In review |
| `AWAITING_APPLICANT_CORRECTION` | Action required |
| `RECORDS_CLEARED` | Additional checks in progress |
| `FINANCE_REFERRAL_PENDING_ACCEPTANCE` | Additional checks in progress |
| `FINANCE_REVIEW` | Additional checks in progress |
| `FINANCE_CLEARED` | Final review |
| `REGISTRAR_APPROVAL` | Final approval |
| `APPROVED_PENDING_ISSUANCE` | Approved — preparing document |
| `COMPLETED` | Completed |
| `REJECTED` | Rejected |
| `CANCELLED` | Cancelled |

## 9. Allowed transitions

| From | To | Trigger |
|---|---|---|
| `DRAFT` | `SUBMITTED` | Applicant submits |
| `SUBMITTED` | `RECORDS_REVIEW` | Records work is assigned or started |
| `RECORDS_REVIEW` | `AWAITING_APPLICANT_CORRECTION` | Records requests correction |
| `AWAITING_APPLICANT_CORRECTION` | `RECORDS_REVIEW` | Applicant resubmits Records correction |
| `RECORDS_REVIEW` | `RECORDS_CLEARED` | Records completes review |
| `RECORDS_REVIEW` | `REJECTED` | Authorized rejection |
| `RECORDS_CLEARED` | `FINANCE_REFERRAL_PENDING_ACCEPTANCE` | Referral sent |
| `FINANCE_REFERRAL_PENDING_ACCEPTANCE` | `FINANCE_REVIEW` | Finance accepts and starts |
| `FINANCE_REVIEW` | `AWAITING_APPLICANT_CORRECTION` | Finance issue requires applicant action |
| `AWAITING_APPLICANT_CORRECTION` | `FINANCE_REVIEW` | Applicant resolves Finance correction |
| `FINANCE_REVIEW` | `FINANCE_CLEARED` | Finance completes with `FINANCE_CLEAR` |
| `FINANCE_CLEARED` | `REGISTRAR_APPROVAL` | Registrar work becomes ready |
| `REGISTRAR_APPROVAL` | `RECORDS_REVIEW` | Registrar returns with reason |
| `REGISTRAR_APPROVAL` | `REJECTED` | Registrar rejects |
| `REGISTRAR_APPROVAL` | `APPROVED_PENDING_ISSUANCE` | Registrar approves |
| `APPROVED_PENDING_ISSUANCE` | `COMPLETED` | Official upload or demo generation succeeds |
| Any active status | `CANCELLED` | Authorized cancellation |

No client component may set request status directly.

## 10. Referral lifecycle

```text
CREATED
→ PENDING_ACCEPTANCE
→ ACCEPTED
→ IN_PROGRESS
→ COMPLETED
→ RETURNED_TO_ORIGINATOR
```

Exception states:

```text
RETURNED_FOR_CLARIFICATION
DECLINED
CANCELLED
OVERDUE
```

Rules:

1. Student Records retains ownership.
2. Finance receives a child work item.
3. The originating officer coordinates the overall request.
4. Requested action, reason, expected output and deadline are mandatory.
5. Completion returns a structured result.

## 11. Transfer lifecycle

```text
CREATED
→ PENDING_ACCEPTANCE
→ ACCEPTED
→ OWNERSHIP_TRANSFERRED
→ ASSIGNED
→ IN_PROGRESS
→ COMPLETED
```

Exception states:

```text
RETURNED_FOR_CLARIFICATION
DECLINED
CANCELLED
```

Rules:

1. Ownership changes only after acceptance.
2. The coordinating department may remain unchanged.
3. A receiving work item is created.
4. Forced transfer requires Supervisor permission.
5. Transcript Request uses a referral in the happy path.

## 12. Work-item lifecycle

```text
NOT_STARTED
→ READY
→ ASSIGNED
→ IN_PROGRESS
→ COMPLETED
```

Supporting states:

```text
PENDING_ACCEPTANCE
WAITING_ON_APPLICANT
WAITING_ON_DEPARTMENT
RETURNED
BLOCKED
OVERDUE
CANCELLED
```

Rules:

1. Every operational step has a work item or controlled system action.
2. Ownership, assignment and status are separate.
3. Referral creates a child work item.
4. Parent request status is derived from workflow progress.
5. Completed work is immutable except through controlled Supervisor reopening.
6. Reopening requires a reason and audit event.
