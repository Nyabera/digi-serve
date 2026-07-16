# FAIDIA Stage 1 — Status and Transition Contract

**Status:** READY_FOR_PRODUCT_OWNER_REVIEW  
**Version:** 0.1  
**Last updated:** 2026-07-14  
**Product:** FAIDIA — Service Operations Platform  
**Authority:** `docs/00-stage-0/STATUS-MAPPINGS.md` and `docs/00-stage-0/V1-VERTICAL-SLICE.md`

## 1. Purpose

This document defines the technical representation of approved statuses and transitions. Stage 0 remains the status authority; this file specifies shared enum, transition and presentation boundaries.

## 2. Status families

```ts
type RequestStatus =
  | "DRAFT" | "SUBMITTED" | "IN_REVIEW"
  | "WAITING_ON_APPLICANT" | "WAITING_ON_DEPARTMENT"
  | "PENDING_APPROVAL" | "APPROVED"
  | "OUTCOME_PREPARATION" | "OUTCOME_FAILED" | "OUTCOME_READY"
  | "REJECTED" | "COMPLETED" | "CANCELLED" | "EXPIRED"

type WorkItemStatus =
  | "NOT_STARTED" | "READY" | "PENDING_ACCEPTANCE" | "ASSIGNED"
  | "IN_PROGRESS" | "WAITING_ON_APPLICANT" | "WAITING_ON_DEPARTMENT"
  | "BLOCKED" | "RETURNED" | "COMPLETED" | "CANCELLED"

type HandoffStatus =
  | "CREATED" | "PENDING_ACCEPTANCE" | "ACCEPTED" | "ASSIGNED"
  | "IN_PROGRESS" | "RETURNED_FOR_CLARIFICATION" | "DECLINED"
  | "COMPLETED" | "CANCELLED"

type DocumentStatus =
  | "UPLOADED" | "PROCESSING" | "AVAILABLE" | "UNDER_REVIEW"
  | "ACCEPTED" | "REJECTED" | "REPLACED" | "ISSUED"
  | "REVOKED" | "DELETED"

type DecisionStatus =
  | "PENDING" | "APPROVED" | "REJECTED"
  | "RETURNED_FOR_CLARIFICATION" | "CANCELLED"

type SlaState =
  | "NOT_STARTED" | "ON_TRACK" | "DUE_SOON" | "OVERDUE"
  | "COMPLETED_ON_TIME" | "COMPLETED_LATE" | "CANCELLED"

type NotificationDeliveryStatus =
  | "PENDING" | "SENDING" | "SENT" | "DELIVERED" | "FAILED" | "CANCELLED"

type FinanceResultCode = "CLEAR" | "HOLD" | "CANNOT_VERIFY"
```

No additional enum member may be added from a mockup, database convenience or UI label.

## 3. Request transition authority

Use an explicit command-to-transition table; do not expose a generic `setStatus` operation.

| Command/result | From | To |
|---|---|---|
| submit | `DRAFT` | `SUBMITTED` |
| start review | `SUBMITTED` | `IN_REVIEW` |
| request correction | `IN_REVIEW` | `WAITING_ON_APPLICANT` |
| correction resubmit | `WAITING_ON_APPLICANT` | `IN_REVIEW` |
| create Finance referral | `IN_REVIEW` | `WAITING_ON_DEPARTMENT` |
| Finance `CLEAR` | `WAITING_ON_DEPARTMENT` | `IN_REVIEW` |
| Finance `HOLD` | `WAITING_ON_DEPARTMENT` | `WAITING_ON_APPLICANT` |
| resolve HOLD | `WAITING_ON_APPLICANT` | `IN_REVIEW` |
| Finance `CANNOT_VERIFY`/decline | `WAITING_ON_DEPARTMENT` | `IN_REVIEW` |
| complete Records work | `IN_REVIEW` | `PENDING_APPROVAL` |
| approve | `PENDING_APPROVAL` | `APPROVED` |
| Registrar clarification | `PENDING_APPROVAL` | `IN_REVIEW` |
| Registrar reject | `PENDING_APPROVAL` | `REJECTED` |
| start delayed outcome | `APPROVED`/`OUTCOME_FAILED` | `OUTCOME_PREPARATION` |
| outcome failure | `APPROVED`/`OUTCOME_PREPARATION` | `OUTCOME_FAILED` |
| issue outcome | `APPROVED`/`OUTCOME_PREPARATION` | `OUTCOME_READY` |
| approved completion trigger | `OUTCOME_READY` | `COMPLETED` |
| reopen | `REJECTED`/`COMPLETED` | `IN_REVIEW` |
| expire | `DRAFT` or deadline-passed `WAITING_ON_APPLICANT` | `EXPIRED` |

Cancellation is permitted only through an approved authorized command and from states allowed by Stage 0/domain policy. Part 7 API contracts must name those exact command preconditions; no generic status endpoint is allowed.

## 4. Frozen transition rules

- There is no parent `ASSIGNED` or `REOPENED` status.
- Correction resubmission returns to `IN_REVIEW`.
- Handoffs end at `COMPLETED`; receipt is history/notification.
- `Preparing Outcome` appears only for a real asynchronous delay.
- Reopen does not revoke an outcome.
- `CANCELLED` and `EXPIRED` are terminal.
- SLA state is calculated separately and never drives request business state by itself.

## 5. Applicant presentation boundary

Create one server-side mapper from approved internal condition to a safe presentation object. It follows `STATUS-MAPPINGS.md` Section 7 exactly.

```ts
type ApplicantStatusPresentation = {
  key: ApplicantStatusKey
  label: string
  guidance?: string
  actionRequired: boolean
}
```

The browser must not receive internal state or Finance result solely to calculate a public label. `HOLD` maps to Action Required; `CANNOT_VERIFY` under clarification remains Additional Checks in Progress without confidential details.

## 6. Transition function contract

Each command calls a named pure rule such as:

```ts
canStartReview(request, workItem)
canRequestCorrection(request, actor)
canCompleteRecordsWork(request, prerequisites)
canRegistrarApprove(request, financeResult, workItems, actor)
canCompleteByDownload(request, outcome, applicant)
```

Rules return a typed decision/reason. The transaction rechecks current persisted state before writing status/history/audit.

## 7. History

Every successful parent transition appends status history containing from/to, time, actor/system actor, command/reason reference and correlation/request context. Reopen, replacement or retry never overwrites previous entries.

## 8. Tests

- table-driven allowed/denied test for every transition;
- no direct arbitrary status update path;
- internal-to-public mapping tests for every internal condition;
- applicant response contains no internal-only values;
- Finance result/work/handoff transitions remain coordinated;
- exact completion and reopen rules;
- concurrent stale transition produces conflict and no success event.

## 9. Explicit non-goals

- Generic configurable state machine.
- UI-owned transition logic.
- New statuses shown in references.
- Automatic escalation transition.
- Database trigger as sole transition authority.

## 10. Open questions

None.

## 11. Change rule

Any enum, mapping or allowed exit change requires `STATUS-MAPPINGS.md`, affected workflow/acceptance documents and decision records to change first.

## 12. Coding-agent instruction

Import statuses and named transition rules from one server-safe domain module. Never compare applicant labels in business logic or provide a generic status mutation.
