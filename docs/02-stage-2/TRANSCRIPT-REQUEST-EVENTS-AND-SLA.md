---
title: Transcript Request Events and SLA Specification
stage: 2
status: READY_FOR_OWNER_APPROVAL
version: 1.1.0
last_updated: 2026-07-16
---

# Transcript Request Events and SLA Specification

## 1. Notification principles

1. Store notification records before external delivery.
2. In-app notification records are mandatory for defined triggers.
3. Email may be delivered asynchronously.
4. Applicant notifications are sent only when:
   - applicant action is required;
   - public status changes; or
   - the final document becomes available.
5. Internal handoff mechanics are not exposed unnecessarily.
6. Duplicate notifications are prohibited.

## 2. Notification matrix

| Action | Recipient | Purpose |
|---|---|---|
| Request submitted | Applicant | Confirm receipt and provide reference |
| Request submitted | Student Records supervisor or queue | New request requires assignment |
| Request assigned | Assigned Records officer | New work assigned |
| Correction requested | Applicant | Action required and deadline |
| Correction resubmitted | Assigned Records officer | Corrected request is ready |
| Finance referral created | Finance department and requested officer | Incoming referral |
| Finance referral accepted | Originating Records officer | Referral accepted |
| Finance clarification requested | Originating Records officer | Clarification required |
| Finance referral declined | Originating officer and Records supervisor | Referral declined |
| Finance referral completed | Originating Records officer | Finance result available |
| Registrar approval ready | Assigned Registrar approver | Final decision required |
| Registrar returned request | Assigned Records officer | Clarification required |
| Request approved | Applicant | Approved; document preparation started |
| Official PDF upload required | Authorized Registrar user | Issuance action required |
| Official PDF uploaded successfully | Applicant | Secure transcript available |
| Demo generation started | Authorized internal users | Fallback issuance started |
| Demo generation succeeded | Applicant | Demonstration transcript available |
| Issuance failed | Issuing user and supervisor | Retry required |
| Work item due soon | Assigned officer | Deadline approaching |
| Work item overdue | Assigned officer and supervisor | SLA breached |
| Request rejected | Applicant | Final decision |
| Request completed | Applicant and coordinating officer | Request completed |

## 3. Audit principles

1. Audit events are append-only.
2. Ordinary users cannot edit or delete them.
3. Important events are written in the same transaction as the state change.
4. Each event records:
   - organization;
   - actor;
   - entity;
   - request;
   - work item or handoff where relevant;
   - old and new values;
   - structured metadata;
   - timestamp;
   - IP address and user agent where appropriate.
5. Secrets and full document contents are excluded.

## 4. Required audit events

```text
REQUEST_DRAFT_CREATED
REQUEST_DRAFT_UPDATED
REQUEST_DRAFT_DELETED
DOCUMENT_UPLOADED
DOCUMENT_REPLACED
DOCUMENT_VIEWED
DOCUMENT_DOWNLOADED
REQUEST_SUBMITTED
REQUEST_ASSIGNED
REQUEST_REASSIGNED
REVIEW_STARTED
DOCUMENT_ACCEPTED
DOCUMENT_REJECTED
CORRECTION_REQUESTED
CORRECTION_RESUBMITTED
REFERRAL_CREATED
REFERRAL_SENT
REFERRAL_ACCEPTED
REFERRAL_DECLINED
REFERRAL_RETURNED_FOR_CLARIFICATION
REFERRAL_STARTED
REFERRAL_COMPLETED
REFERRAL_CANCELLED
REGISTRAR_APPROVAL_REQUESTED
REQUEST_RETURNED_TO_RECORDS
REQUEST_APPROVED
ISSUANCE_MODE_SELECTED
OFFICIAL_TRANSCRIPT_UPLOAD_STARTED
OFFICIAL_TRANSCRIPT_UPLOADED
DEMO_TRANSCRIPT_GENERATION_STARTED
DEMO_TRANSCRIPT_GENERATED
PDF_VALIDATION_FAILED
PDF_STORAGE_FAILED
DOCUMENT_ISSUED
REQUEST_COMPLETED
REQUEST_REJECTED
REQUEST_CANCELLED
OWNERSHIP_TRANSFERRED
WORK_ITEM_REOPENED
SLA_DUE_SOON
SLA_BREACHED
FEE_WAIVER_APPLIED
```

## 5. Issuance audit metadata

Every issuance event must include:

- `issuance_mode`;
- issuing actor;
- source filename where applicable;
- checksum where available;
- storage path;
- issued-document ID;
- failure reason where applicable;
- retry count;
- whether the file is marked `DEMONSTRATION DATA`.

## 6. Action-to-audit mapping

| Action | Required event |
|---|---|
| Draft created | `REQUEST_DRAFT_CREATED` |
| Draft saved | `REQUEST_DRAFT_UPDATED` |
| Draft deleted | `REQUEST_DRAFT_DELETED` |
| Document uploaded | `DOCUMENT_UPLOADED` |
| Document replaced | `DOCUMENT_REPLACED` |
| Request submitted | `REQUEST_SUBMITTED` |
| Assignment | `REQUEST_ASSIGNED` |
| Reassignment | `REQUEST_REASSIGNED` |
| Review started | `REVIEW_STARTED` |
| Document accepted | `DOCUMENT_ACCEPTED` |
| Document rejected | `DOCUMENT_REJECTED` |
| Correction requested | `CORRECTION_REQUESTED` |
| Correction resubmitted | `CORRECTION_RESUBMITTED` |
| Referral created | `REFERRAL_CREATED`, `REFERRAL_SENT` |
| Referral accepted | `REFERRAL_ACCEPTED` |
| Referral declined | `REFERRAL_DECLINED` |
| Clarification requested | `REFERRAL_RETURNED_FOR_CLARIFICATION` |
| Referral started | `REFERRAL_STARTED` |
| Referral completed | `REFERRAL_COMPLETED` |
| Registrar work created | `REGISTRAR_APPROVAL_REQUESTED` |
| Registrar returns request | `REQUEST_RETURNED_TO_RECORDS` |
| Approval | `REQUEST_APPROVED` |
| Official upload selected | `ISSUANCE_MODE_SELECTED` |
| Official upload started | `OFFICIAL_TRANSCRIPT_UPLOAD_STARTED` |
| Official upload stored | `OFFICIAL_TRANSCRIPT_UPLOADED` |
| Demo generation selected | `ISSUANCE_MODE_SELECTED` |
| Demo generation started | `DEMO_TRANSCRIPT_GENERATION_STARTED` |
| Demo PDF stored | `DEMO_TRANSCRIPT_GENERATED` |
| Validation failure | `PDF_VALIDATION_FAILED` |
| Storage failure | `PDF_STORAGE_FAILED` |
| Issued document created | `DOCUMENT_ISSUED` |
| Request completed | `REQUEST_COMPLETED` |
| Rejection | `REQUEST_REJECTED` |
| Cancellation | `REQUEST_CANCELLED` |
| Due soon | `SLA_DUE_SOON` |
| Overdue | `SLA_BREACHED` |

## 7. V1 SLA model

Stage 2 uses elapsed hours and calendar days.

It does not exclude:

- weekends;
- public holidays;
- institution closure periods.

Advanced calendars and pause policies are postponed.

## 8. SLA timestamps and targets

| Stage | Timestamp | Target |
|---|---|---|
| Submission | `submitted_at` | Start overall SLA |
| Overall completion | `overall_due_at` | Five calendar days after submission |
| Records ready | `records_ready_at` | Immediate |
| First Records action | `first_action_at` | Within one calendar day |
| Records review start | `records_started_at` | Captured on Start Review |
| Correction requested | `correction_requested_at` | Per cycle |
| Correction due | `correction_due_at` | Seven calendar days |
| Correction resubmitted | `correction_resubmitted_at` | Per cycle |
| Finance referral sent | `referral_sent_at` | On send |
| Finance acceptance due | `referral_acceptance_due_at` | Four elapsed hours |
| Finance accepted | `referral_accepted_at` | On acceptance |
| Finance started | `referral_started_at` | On Start Work |
| Finance completion due | `referral_completion_due_at` | One calendar day |
| Finance completed | `referral_completed_at` | On completion |
| Registrar ready | `registrar_ready_at` | After Finance clears |
| Registrar decision due | `registrar_due_at` | One calendar day |
| Registrar approved | `approved_at` | On approval |
| Issuance mode selected | `issuance_mode_selected_at` | After approval |
| Official upload started | `official_upload_started_at` | When upload begins |
| Demo generation started | `demo_generation_started_at` | When generation begins |
| Issuance due | `issuance_due_at` | Four elapsed hours after approval |
| PDF issued | `issued_at` | After storage and record creation |
| Request completed | `completed_at` | After issuance |

## 9. SLA statuses

```text
ON_TRACK
DUE_SOON
OVERDUE
COMPLETED_ON_TIME
COMPLETED_LATE
```

`DUE_SOON` begins at 80% SLA consumption.

## 10. Issuance SLA rule

The four-hour issuance SLA applies regardless of mode.

The dashboard may separately report:

- official-upload preparation time;
- demo-generation time;
- file-validation failures;
- storage failures;
- retries;
- time from approval to issued document.

## 11. SLA event rules

1. Timed work records `started_at` and `due_at`.
2. Completion records `completed_at`.
3. Due-soon creates an audit event and officer notification.
4. Overdue creates an audit event and officer and supervisor notifications.
5. Applicant correction does not erase parent-request time.
6. Issuance failure does not complete or reset the request.
7. Final SLA result is:
   - `COMPLETED_ON_TIME` where `completed_at <= overall_due_at`;
   - `COMPLETED_LATE` otherwise.
