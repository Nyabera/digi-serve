# FAIDIA Stage 0 — Status Definitions And Mappings

Status: **APPROVED_FOR_V1**  
Version: **1.0**  
Last updated: **2026-07-13**  
Product: **FAIDIA — Service Operations Platform**

## 1. Purpose

This document defines approved V1 statuses for requests, work items, handoffs, documents, decisions, notifications, and SLA state. Pages must import status values from shared domain definitions and must not invent status strings.

## 2. Approved Status Decisions

- Parent request has no `ASSIGNED` status. Assignment lives on work items and assignment records.
- Applicant documents use `ACCEPTED`, not `APPROVED`.
- Handoffs complete at `COMPLETED`; originator receipt is represented by history and notification.
- Correction resubmission returns the request to `IN_REVIEW`; no dedicated parent status is used.
- Public `Preparing Outcome` is shown only when there is a meaningful delay.
- Completion occurs at recorded download, collection, delivery, or approved institutional closure rule.

## 3. Internal Request Statuses

| Status | Meaning | Typical entry | Typical exit |
|---|---|---|---|
| `DRAFT` | Applicant has started but not submitted | Draft creation | Submit, cancel, or expire |
| `SUBMITTED` | Submission accepted and awaiting staff action | Submit request | Start review or cancel |
| `IN_REVIEW` | Active internal review | Start review or correction resubmission | Correction, department wait, approval, rejection, cancel |
| `WAITING_ON_APPLICANT` | Applicant action required | Correction request or Finance HOLD action | Resubmit, cancel, or expire |
| `WAITING_ON_DEPARTMENT` | Waiting for required handoff result | Create Finance referral | Handoff completes, declines, or returns |
| `PENDING_APPROVAL` | Operational checks complete; Registrar decision pending | Records work complete | Approve, reject, or return |
| `APPROVED` | Positive decision recorded | Registrar approval | Outcome preparation or ready |
| `OUTCOME_PREPARATION` | Final outcome is being prepared | Start outcome work where there is delay | Ready or failed |
| `OUTCOME_READY` | Outcome available for download/collection | Issue document/outcome | Complete |
| `REJECTED` | Final negative decision | Registrar rejection | Controlled reopen only |
| `COMPLETED` | Service journey closed | Recorded download, collection, delivery, or closure | Terminal |
| `CANCELLED` | Ended without final outcome | Applicant/staff cancellation | Terminal |

Approved primary flow:

```text
DRAFT
-> SUBMITTED
-> IN_REVIEW
-> WAITING_ON_APPLICANT / WAITING_ON_DEPARTMENT
-> PENDING_APPROVAL
-> APPROVED / REJECTED
-> OUTCOME_PREPARATION (only when needed)
-> OUTCOME_READY
-> COMPLETED
```

## 4. Applicant-Visible Statuses

| Public status | Meaning to applicant | Display guidance |
|---|---|---|
| Draft | Not submitted | Continue/edit action |
| Submitted | Institution received it | Show reference and date |
| In Review | Staff are reviewing | Do not expose reassignment |
| Action Required | Applicant must correct/provide something | Show exact action and deadline |
| Additional Checks in Progress | Internal check is underway | Avoid confidential Finance details |
| Awaiting Decision | Review complete, authorization pending | Do not imply approval |
| Approved | Positive decision made | Explain outcome timing |
| Preparing Outcome | Outcome is being prepared | Use only for meaningful delay |
| Ready | Outcome can be downloaded or collected | Show instructions |
| Completed | Service journey finished | Show result and completion date |
| Rejected | Not approved | Show applicant-visible reason |
| Cancelled | Ended before completion | Show reason where appropriate |

## 5. Internal-To-Public Mapping

| Internal condition | Applicant status |
|---|---|
| Request `DRAFT` | Draft |
| Request `SUBMITTED` | Submitted |
| Request `IN_REVIEW` | In Review |
| Request `WAITING_ON_APPLICANT` | Action Required |
| Handoff `CREATED` or `PENDING_ACCEPTANCE` | Additional Checks in Progress |
| Handoff `ACCEPTED` or `IN_PROGRESS` | Additional Checks in Progress |
| Request `WAITING_ON_DEPARTMENT` | Additional Checks in Progress |
| Finance result `HOLD` requiring applicant action | Action Required |
| Finance result `CANNOT_VERIFY` needing Records clarification | Additional Checks in Progress |
| Request `PENDING_APPROVAL` | Awaiting Decision |
| Request `APPROVED`, no meaningful outcome delay | Approved |
| Request `OUTCOME_PREPARATION` | Preparing Outcome |
| Request `OUTCOME_READY` | Ready |
| Request `COMPLETED` | Completed |
| Request `REJECTED` | Rejected |
| Request `CANCELLED` | Cancelled |

## 6. Work-Item Statuses

| Status | Meaning |
|---|---|
| `NOT_STARTED` | Exists but not ready or not begun |
| `READY` | Preconditions met; may be assigned, claimed, or started |
| `PENDING_ACCEPTANCE` | Receiving department must accept |
| `ASSIGNED` | Officer assigned, not started |
| `IN_PROGRESS` | Active work |
| `WAITING_ON_APPLICANT` | Blocked on applicant |
| `WAITING_ON_DEPARTMENT` | Blocked on another department |
| `BLOCKED` | Another recorded issue prevents progress |
| `RETURNED` | Sent back for clarification or rework |
| `COMPLETED` | Required result recorded |
| `CANCELLED` | No longer required |

## 7. Handoff Statuses

| Status | Meaning | Allowed next states |
|---|---|---|
| `CREATED` | Draft or prepared handoff exists | `PENDING_ACCEPTANCE`, `CANCELLED` |
| `PENDING_ACCEPTANCE` | Sent to receiver | `ACCEPTED`, `DECLINED`, `RETURNED_FOR_CLARIFICATION`, `CANCELLED` |
| `ACCEPTED` | Receiver accepted the work | `ASSIGNED`, `IN_PROGRESS`, `CANCELLED` |
| `ASSIGNED` | Receiving officer assigned | `IN_PROGRESS`, `RETURNED_FOR_CLARIFICATION`, `CANCELLED` |
| `IN_PROGRESS` | Receiving department working | `COMPLETED`, `RETURNED_FOR_CLARIFICATION`, `CANCELLED` |
| `RETURNED_FOR_CLARIFICATION` | Originator must clarify | `PENDING_ACCEPTANCE`, `CANCELLED` |
| `DECLINED` | Receiver declined with reason | Terminal or revised new handoff |
| `COMPLETED` | Required result recorded | Terminal |
| `CANCELLED` | Ended without completion | Terminal |

`RETURNED_TO_ORIGINATOR` is not part of the approved V1 handoff status set.

## 8. Document Statuses

| Status | Meaning |
|---|---|
| `UPLOADED` | File and metadata stored |
| `PROCESSING` | Optional technical processing |
| `AVAILABLE` | Ready for authorized review |
| `UNDER_REVIEW` | Officer reviewing |
| `ACCEPTED` | Satisfies requirement |
| `REJECTED` | Does not satisfy requirement |
| `REPLACED` | Newer linked version submitted |
| `ISSUED` | Final institution document/outcome issued |
| `REVOKED` | Issued document no longer valid |
| `DELETED` | Logically deleted under policy |

## 9. Decision Statuses

| Status | Meaning |
|---|---|
| `PENDING` | Decision requested |
| `APPROVED` | Positive decision |
| `REJECTED` | Negative decision |
| `RETURNED_FOR_CLARIFICATION` | More information required |
| `CANCELLED` | Decision no longer required |

## 10. SLA States

| Status | Meaning |
|---|---|
| `NOT_STARTED` | Timer has not begun |
| `ON_TRACK` | Not near deadline |
| `DUE_SOON` | Warning threshold reached |
| `OVERDUE` | Due date passed |
| `COMPLETED_ON_TIME` | Completed by due time |
| `COMPLETED_LATE` | Completed after due time |
| `CANCELLED` | Timer no longer applies |

Overdue is separate from operational state. Display examples: `IN_PROGRESS · OVERDUE`.

## 11. Notification Delivery Statuses

| Status | Meaning |
|---|---|
| `PENDING` | Stored, not sent |
| `SENDING` | Provider request underway |
| `SENT` | Provider accepted |
| `DELIVERED` | Provider confirmed, where supported |
| `FAILED` | Delivery failed |
| `CANCELLED` | Intentionally suppressed |

## 12. Coding-Agent Instruction

Validate transitions on the server. Never compare public labels in business logic. Keep public mappings separate from internal state.
