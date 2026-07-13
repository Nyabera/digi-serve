# FAIDIA Stage 0 — Status Definitions And Mappings

Status: **APPROVED_FOR_STAGE_1**  
Version: **1.3**  
Last updated: **2026-07-13**  
Product: **FAIDIA — Service Operations Platform**

## 1. Purpose

This document defines approved request, work-item, handoff, document, decision, notification, and SLA statuses.

Pages must import shared domain values. Applicant labels must never be used as internal business logic.

## 2. Frozen status decisions

- No parent request `ASSIGNED` status.
- Applicant documents use `ACCEPTED`.
- Handoffs finish at `COMPLETED`; receipt is history/notification.
- Correction resubmission returns to `IN_REVIEW`.
- `Preparing Outcome` appears only for a meaningful delay.
- `Expired` is an official applicant-visible status.
- Completion triggers are controlled download, physical collection, or Supervisor manual closure.
- Reopening uses an audit event and returns to `IN_REVIEW`; there is no `REOPENED` parent status.

## 3. Internal request statuses

| Status | Meaning | Typical entry | Allowed exit |
|---|---|---|---|
| `DRAFT` | Started, not submitted | Draft creation | `SUBMITTED`, `CANCELLED`, `EXPIRED` |
| `SUBMITTED` | Accepted, awaiting staff action | Submission | `IN_REVIEW`, `CANCELLED` |
| `IN_REVIEW` | Coordinating department work | Review start, correction resubmission, clarification, reopen | `WAITING_ON_APPLICANT`, `WAITING_ON_DEPARTMENT`, `PENDING_APPROVAL`, `REJECTED`, `CANCELLED` |
| `WAITING_ON_APPLICANT` | Applicant action required | Correction or Finance HOLD | `IN_REVIEW`, `CANCELLED`, `EXPIRED` |
| `WAITING_ON_DEPARTMENT` | Required referral result pending | Finance referral | `IN_REVIEW`, `WAITING_ON_APPLICANT`, `CANCELLED` |
| `PENDING_APPROVAL` | Checks complete; Registrar decision pending | Records completion | `APPROVED`, `REJECTED`, `IN_REVIEW` |
| `APPROVED` | Positive decision recorded | Registrar approval | `OUTCOME_PREPARATION`, `OUTCOME_READY`, `OUTCOME_FAILED` |
| `OUTCOME_PREPARATION` | Outcome being prepared | Outcome work/retry | `OUTCOME_READY`, `OUTCOME_FAILED` |
| `OUTCOME_FAILED` | Outcome preparation failed | Failure | `OUTCOME_PREPARATION`, `CANCELLED` |
| `OUTCOME_READY` | Outcome available | Issue outcome | `COMPLETED` |
| `REJECTED` | Final negative decision | Registrar rejection | `IN_REVIEW` through controlled reopen |
| `COMPLETED` | Journey closed | Download, collection, or manual closure | `IN_REVIEW` through controlled reopen |
| `CANCELLED` | Ended without final outcome | Authorized cancellation | Terminal |
| `EXPIRED` | Draft/action deadline passed | Expiry job | Terminal |

Primary flow:

```text
DRAFT
-> SUBMITTED
-> IN_REVIEW
-> WAITING_ON_APPLICANT / WAITING_ON_DEPARTMENT
-> PENDING_APPROVAL
-> APPROVED / REJECTED
-> OUTCOME_PREPARATION (when needed)
-> OUTCOME_READY
-> COMPLETED
```

## 4. Exact completion transitions

| Trigger | Preconditions | Transition | Required events |
|---|---|---|---|
| Controlled download | Authorized applicant, issued outcome, `OUTCOME_READY` | `OUTCOME_READY` -> `COMPLETED` | `DOCUMENT_DOWNLOADED`, `REQUEST_COMPLETED` |
| Physical collection | Authorized Student Records Officer, collection evidence, `OUTCOME_READY` | `OUTCOME_READY` -> `COMPLETED` | `OUTCOME_COLLECTED`, `REQUEST_COMPLETED` |
| Manual closure | Supervisor, `requests.manual_close`, reason/note/evidence, `OUTCOME_READY` | `OUTCOME_READY` -> `COMPLETED` | `REQUEST_MANUALLY_CLOSED`, `REQUEST_COMPLETED` |

No generic delivery trigger exists in Stage 1.

## 5. Reopening transitions

| From | Actor/permission | To | Required behavior |
|---|---|---|---|
| `REJECTED` | Supervisor + `requests.reopen` | `IN_REVIEW` | Reason, new/reactivated Records work item, `REQUEST_REOPENED`, notification |
| `COMPLETED` | Supervisor + `requests.reopen` | `IN_REVIEW` | Reason, preserve outcome/completion history, `REQUEST_REOPENED`, notification |

Reopening does not revoke an outcome. Revocation is a separate `documents.revoke` action and records `DOCUMENT_REVOKED`.

## 6. Applicant-visible statuses

| Public status | Meaning | Display guidance |
|---|---|---|
| Draft | Not submitted | Continue action and expiry date |
| Submitted | Institution received it | Reference and submission date |
| In Review | Staff are reviewing | Do not expose assignment changes |
| Action Required | Applicant must act | Exact action and deadline |
| Additional Checks in Progress | Internal check underway | Do not expose confidential Finance detail |
| Awaiting Decision | Authorization pending | Do not imply approval |
| Approved | Positive decision recorded | Explain next outcome step |
| Preparing Outcome | Outcome is being prepared | Use only for real delay |
| Outcome Issue | Staff are resolving outcome preparation | Hide technical details |
| Ready | Download or collection available | Show method/instructions |
| Completed | Journey closed | Show completion method/date |
| Rejected | Not approved | Applicant-visible reason |
| Cancelled | Ended before completion | Reason where appropriate |
| Expired | Draft or action deadline passed | Explain expiry and start-new-request action |

## 7. Internal-to-public mapping

| Internal condition | Public status |
|---|---|
| `DRAFT` | Draft |
| `SUBMITTED` | Submitted |
| `IN_REVIEW` | In Review |
| `WAITING_ON_APPLICANT` | Action Required |
| `WAITING_ON_DEPARTMENT` | Additional Checks in Progress |
| Finance `HOLD` | Action Required |
| Finance `CANNOT_VERIFY` under Records clarification | Additional Checks in Progress |
| `PENDING_APPROVAL` | Awaiting Decision |
| `APPROVED` with no delay | Approved |
| `OUTCOME_PREPARATION` | Preparing Outcome |
| `OUTCOME_FAILED` | Outcome Issue |
| `OUTCOME_READY` | Ready |
| `COMPLETED` | Completed |
| `REJECTED` | Rejected |
| `CANCELLED` | Cancelled |
| `EXPIRED` | Expired |
| `REJECTED` or `COMPLETED` after reopen to `IN_REVIEW` | In Review |

## 8. Finance result transitions

| Result/event | Request | Work item/handoff |
|---|---|---|
| `CLEAR` | `WAITING_ON_DEPARTMENT` -> `IN_REVIEW` | Finance work/handoff `COMPLETED`; Records work ready/in progress |
| `HOLD` | `WAITING_ON_DEPARTMENT` -> `WAITING_ON_APPLICANT` | Finance work/handoff `COMPLETED`; Records work waiting |
| Applicant resolves HOLD | `WAITING_ON_APPLICANT` -> `IN_REVIEW` | Records work ready/in progress; new referral if recheck needed |
| `CANNOT_VERIFY` | `WAITING_ON_DEPARTMENT` -> `IN_REVIEW` | Finance work `RETURNED`; handoff `RETURNED_FOR_CLARIFICATION` |
| Finance decline | `WAITING_ON_DEPARTMENT` -> `IN_REVIEW` | Finance work `CANCELLED`; handoff `DECLINED` |
| Registrar clarification | `PENDING_APPROVAL` -> `IN_REVIEW` | Decision `RETURNED_FOR_CLARIFICATION`; Records work ready |

## 9. Work-item statuses

`NOT_STARTED`, `READY`, `PENDING_ACCEPTANCE`, `ASSIGNED`, `IN_PROGRESS`, `WAITING_ON_APPLICANT`, `WAITING_ON_DEPARTMENT`, `BLOCKED`, `RETURNED`, `COMPLETED`, `CANCELLED`.

## 10. Handoff statuses

`CREATED`, `PENDING_ACCEPTANCE`, `ACCEPTED`, `ASSIGNED`, `IN_PROGRESS`, `RETURNED_FOR_CLARIFICATION`, `DECLINED`, `COMPLETED`, `CANCELLED`.

`RETURNED_TO_ORIGINATOR` is not approved.

## 11. Document statuses

`UPLOADED`, `PROCESSING`, `AVAILABLE`, `UNDER_REVIEW`, `ACCEPTED`, `REJECTED`, `REPLACED`, `ISSUED`, `REVOKED`, `DELETED`.

## 12. Decision statuses

`PENDING`, `APPROVED`, `REJECTED`, `RETURNED_FOR_CLARIFICATION`, `CANCELLED`.

## 13. SLA states

`NOT_STARTED`, `ON_TRACK`, `DUE_SOON`, `OVERDUE`, `COMPLETED_ON_TIME`, `COMPLETED_LATE`, `CANCELLED`.

SLA state is separate from operational state.

## 14. Notification delivery statuses

`PENDING`, `SENDING`, `SENT`, `DELIVERED`, `FAILED`, `CANCELLED`.

## 15. Coding-agent instruction

Validate all transitions server-side. Use internal enums in business logic and a separate applicant-status mapper for presentation.
