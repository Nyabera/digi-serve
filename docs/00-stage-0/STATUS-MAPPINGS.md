# FAIDIA Stage 0 — Status Definitions and Mappings

Status: **DRAFT — requires product-owner approval**  
Version: **0.1**  
Last updated: **2026-07-12**  
Product: **FAIDIA — Service Operations Platform**  

> This Stage 0 document is based on the uploaded FAIDIA product description, V1 structure, full development structure, recommended stack and strict build-order documents. Recommended defaults are filled in, while unresolved items are explicitly marked.


## 1. Purpose

This document defines the controlled V1 statuses for requests, work items, handoffs, documents, decisions, notifications and SLA state. It also maps internal workflow detail to applicant-safe statuses.

Status values must be defined once in shared domain code. Pages must not invent status strings.

## 2. Rules

- Keep each entity's status set separate.
- Do not use parent-request status to represent a handoff or document state.
- Do not expose unnecessary internal bureaucracy to applicants.
- Every transition must have a permitted actor and action.
- Important transitions create status history and audit events.
- Status labels must not be silently redefined.
- Use timestamps to distinguish active work from waiting.
- Prefer an operational status plus a separate SLA state over losing meaning.

## 3. Internal request statuses

| Status | Meaning | Typical entry | Typical exit |
|---|---|---|---|
| `DRAFT` | Applicant has started but not submitted | Draft creation | Submit, cancel or expire |
| `SUBMITTED` | Submission accepted and awaiting staff action | Submit request | Start review or assign |
| `ASSIGNED` | Coordinating work has an officer | Assign | Start review or reassign |
| `IN_REVIEW` | Active internal review | Start review or correction resubmission | Correction, department wait, approval, rejection |
| `WAITING_ON_APPLICANT` | Applicant action required | Request correction | Resubmit, cancel or expire |
| `WAITING_ON_DEPARTMENT` | Waiting for required handoff result | Create referral | Handoff completes/declines/returns |
| `PENDING_APPROVAL` | Operational checks complete; decision pending | Complete preceding work | Approve, reject or return |
| `APPROVED` | Positive decision recorded | Approve | Prepare outcome or mark ready |
| `OUTCOME_PREPARATION` | Final outcome is being prepared | Start outcome work | Ready or failed |
| `OUTCOME_READY` | Outcome available for access/collection | Issue document | Complete |
| `REJECTED` | Final negative decision | Reject | Exceptional controlled reopen only |
| `COMPLETED` | Service journey closed | Complete request | Terminal |
| `CANCELLED` | Ended without final service outcome | Cancel | Terminal |

### Recommended simplification

Before schema implementation, decide whether `ASSIGNED` belongs on the parent request or only on work items. The simpler parent flow is:

```text
DRAFT
-> SUBMITTED
-> IN_REVIEW
-> WAITING_ON_APPLICANT / WAITING_ON_DEPARTMENT
-> PENDING_APPROVAL
-> APPROVED / REJECTED
-> OUTCOME_READY
-> COMPLETED
```

## 4. Applicant-visible statuses

| Public status | Meaning to applicant | Display guidance |
|---|---|---|
| Draft | Not submitted | Continue/edit action |
| Submitted | Institution received it | Show reference and date |
| In Review | Staff are reviewing | Do not expose reassignment |
| Action Required | Applicant must correct/provide something | Show exact action and deadline |
| Additional Checks in Progress | Internal check is underway | Avoid confidential detail |
| Awaiting Decision | Review complete, authorization pending | Do not imply approval |
| Approved | Positive decision made | Explain whether outcome is still being prepared |
| Preparing Outcome | Final document/notice is being prepared | Use only if there is a real delay |
| Ready | Outcome can be accessed/collected/dispatched | Show instructions |
| Completed | Service journey finished | Show result and completion date |
| Rejected | Not approved | Show clear applicant-visible reason |
| Cancelled | Ended before completion | Show reason where appropriate |

## 5. Internal-to-public mapping

| Internal condition | Applicant status |
|---|---|
| Request `DRAFT` | Draft |
| Request `SUBMITTED` | Submitted |
| Request `ASSIGNED` | In Review |
| Request `IN_REVIEW` | In Review |
| Request `WAITING_ON_APPLICANT` | Action Required |
| Handoff `CREATED` | Additional Checks in Progress |
| Handoff `PENDING_ACCEPTANCE` | Additional Checks in Progress |
| Handoff `ACCEPTED` | Additional Checks in Progress |
| Handoff `IN_PROGRESS` | Additional Checks in Progress |
| Request `WAITING_ON_DEPARTMENT` | Additional Checks in Progress |
| Request `PENDING_APPROVAL` | Awaiting Decision |
| Request `APPROVED`, no outcome yet | Approved or Preparing Outcome |
| Request `OUTCOME_PREPARATION` | Preparing Outcome |
| Request `OUTCOME_READY` | Ready |
| Request `COMPLETED` | Completed |
| Request `REJECTED` | Rejected |
| Request `CANCELLED` | Cancelled |

## 6. Work-item statuses

| Status | Meaning |
|---|---|
| `NOT_STARTED` | Exists but not ready or not begun |
| `READY` | Preconditions met; may be assigned/started |
| `PENDING_ACCEPTANCE` | Receiving department must accept |
| `ASSIGNED` | Officer assigned, not started |
| `IN_PROGRESS` | Active work |
| `WAITING_ON_APPLICANT` | Blocked on applicant |
| `WAITING_ON_DEPARTMENT` | Blocked on another department |
| `BLOCKED` | Another recorded issue prevents progress |
| `RETURNED` | Sent back for clarification or rework |
| `COMPLETED` | Required result recorded |
| `CANCELLED` | No longer required |

Do not make `OVERDUE` replace the operational state. Display, for example, `IN_PROGRESS · OVERDUE`.

## 7. Handoff statuses

| Status | Meaning | Allowed next states |
|---|---|---|
| `CREATED` | Draft handoff exists | `PENDING_ACCEPTANCE`, `CANCELLED` |
| `PENDING_ACCEPTANCE` | Sent to receiver | `ACCEPTED`, `DECLINED`, `RETURNED_FOR_CLARIFICATION`, `CANCELLED` |
| `ACCEPTED` | Receiver accepted the defined work | `ASSIGNED`, `IN_PROGRESS`, `CANCELLED` |
| `ASSIGNED` | Receiving officer assigned | `IN_PROGRESS`, `RETURNED_FOR_CLARIFICATION`, `CANCELLED` |
| `IN_PROGRESS` | Receiving department working | `COMPLETED`, `RETURNED_FOR_CLARIFICATION`, `CANCELLED` |
| `RETURNED_FOR_CLARIFICATION` | Originator must clarify | `PENDING_ACCEPTANCE`, `CANCELLED` |
| `DECLINED` | Receiver declined with reason | Terminal or revised new handoff |
| `COMPLETED` | Required result recorded | Terminal or acknowledge return |
| `RETURNED_TO_ORIGINATOR` | Result available to originator | Terminal |
| `CANCELLED` | Ended without completion | Terminal |

Track handoff overdue separately using `due_at` and SLA state.

## 8. Document statuses

| Status | Meaning |
|---|---|
| `UPLOADED` | File and metadata stored |
| `PROCESSING` | Optional technical processing |
| `AVAILABLE` | Ready for authorized review |
| `UNDER_REVIEW` | Officer reviewing |
| `ACCEPTED` | Satisfies requirement |
| `REJECTED` | Does not satisfy requirement |
| `REPLACED` | Newer linked version submitted |
| `ISSUED` | Final institution document issued |
| `REVOKED` | Issued document no longer valid |
| `DELETED` | Logically deleted under policy |

Postpone advanced quarantine, expiry and retention states until the security/pilot stage requires them.

## 9. Decision statuses

| Status | Meaning |
|---|---|
| `PENDING` | Decision requested |
| `APPROVED` | Positive decision |
| `REJECTED` | Negative decision |
| `RETURNED_FOR_CLARIFICATION` | More information required |
| `CANCELLED` | Decision no longer required |

Store decisions as records, not only as a mutable request field.

## 10. SLA states

| Status | Meaning |
|---|---|
| `NOT_STARTED` | Timer has not begun |
| `ON_TRACK` | Not near deadline |
| `DUE_SOON` | Warning threshold reached |
| `OVERDUE` | Due date passed |
| `COMPLETED_ON_TIME` | Completed by due time |
| `COMPLETED_LATE` | Completed after due time |
| `CANCELLED` | Timer no longer applies |

Suggested V1 threshold:

- `ON_TRACK`: less than 75% of elapsed allowance consumed;
- `DUE_SOON`: 75% or more consumed and not overdue;
- `OVERDUE`: now is after `due_at` and work is incomplete.

Business hours, holidays, pause rules and escalation ladders are postponed.

## 11. Notification delivery statuses

| Status | Meaning |
|---|---|
| `PENDING` | Stored, not sent |
| `SENDING` | Provider request underway |
| `SENT` | Provider accepted |
| `DELIVERED` | Provider confirmed, where supported |
| `FAILED` | Delivery failed |
| `CANCELLED` | Intentionally suppressed |

## 12. Request transition map

```text
DRAFT
  -> SUBMITTED
  -> CANCELLED

SUBMITTED
  -> ASSIGNED
  -> IN_REVIEW
  -> CANCELLED

ASSIGNED
  -> IN_REVIEW
  -> CANCELLED

IN_REVIEW
  -> WAITING_ON_APPLICANT
  -> WAITING_ON_DEPARTMENT
  -> PENDING_APPROVAL
  -> REJECTED
  -> CANCELLED

WAITING_ON_APPLICANT
  -> IN_REVIEW
  -> CANCELLED

WAITING_ON_DEPARTMENT
  -> IN_REVIEW
  -> REJECTED
  -> CANCELLED

PENDING_APPROVAL
  -> APPROVED
  -> REJECTED
  -> IN_REVIEW

APPROVED
  -> OUTCOME_PREPARATION
  -> OUTCOME_READY

OUTCOME_PREPARATION
  -> OUTCOME_READY

OUTCOME_READY
  -> COMPLETED
```

## 13. Applicant timeline rules

May show:

- submitted;
- review started;
- action required;
- correction received;
- additional checks started;
- awaiting decision;
- approved/rejected;
- outcome ready;
- completed.

Must not show:

- internal notes;
- private document comments;
- receiving officer assignment;
- handoff disputes;
- confidential Finance result;
- permission changes;
- raw audit metadata.

## 14. UI rules

- display human labels, not enum names;
- use consistent wording everywhere;
- never rely on colour alone;
- status badges must be readable;
- overdue should be a separate indicator;
- historic stored statuses should not change when UI labels are redesigned.

## 15. Audit requirement

Every important transition records:

- organization;
- actor;
- action;
- entity type and ID;
- request ID;
- previous status;
- new status;
- timestamp;
- reason where required;
- relevant metadata.

## 16. Decisions required

- [ ] Is `ASSIGNED` a parent-request status or only a work-item state?
- [ ] Use `ACCEPTED` rather than `APPROVED` for applicant documents?
- [ ] Keep both `COMPLETED` and `RETURNED_TO_ORIGINATOR` for handoffs?
- [ ] Complete on outcome issuance or applicant collection/download?
- [ ] Is Preparing Outcome needed publicly?
- [ ] Does correction resubmission need a dedicated internal status?

## 17. Coding-agent instruction

> Import statuses from shared domain definitions. Never compare public labels in business logic. Validate transitions on the server and keep public mappings separate from internal state.
