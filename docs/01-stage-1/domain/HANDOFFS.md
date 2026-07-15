# FAIDIA Stage 1 — Finance Handoff Contract

**Status:** READY_FOR_PRODUCT_OWNER_REVIEW  
**Version:** 0.1  
**Last updated:** 2026-07-14  
**Product:** FAIDIA — Service Operations Platform  
**Authority:** `docs/00-stage-0/V1-VERTICAL-SLICE.md` Phase 6, `docs/00-stage-0/ROLE-PERMISSIONS-MATRIX.md`, `docs/00-stage-0/STATUS-MAPPINGS.md` Section 8, and AC-FIN-01–15

## 1. Purpose

This document defines the only Stage 1 cross-department collaboration: Student Records refers a Transcript Request check to Finance.

## 2. Handoff thesis

A handoff is a limited child collaboration record. It grants Finance only the context and documents needed to return a structured result. It never transfers parent request ownership or creates broad department sharing.

## 3. Required handoff fields

- organization and parent request;
- originating department: Student Records;
- receiving department: Finance;
- requested action;
- reason;
- expected result schema fixed to `CLEAR | HOLD | CANNOT_VERIFY`;
- due date and priority;
- explicit relevant reference/document links;
- applicant-visibility setting;
- current status and history;
- originator/receiving assignment where applicable;
- timestamps required for acceptance/completion metrics.

The server derives department identities from the published workflow/authorized context; the browser cannot turn this into “share with any department.”

## 4. Lifecycle

```text
CREATED
-> PENDING_ACCEPTANCE
-> ACCEPTED / DECLINED
-> ASSIGNED / IN_PROGRESS
-> COMPLETED
   or RETURNED_FOR_CLARIFICATION -> PENDING_ACCEPTANCE -> ...
-> CANCELLED only through approved Supervisor action
```

`RETURNED_TO_ORIGINATOR` is not an approved status.

## 5. Creation transaction

`CreateFinanceHandoff` requires Student Records scope and `handoffs.create_referral`, a request in valid `IN_REVIEW` state and no conflicting unresolved referral.

Atomically:

- create handoff and immutable history;
- create Finance work item and notification;
- move request to `WAITING_ON_DEPARTMENT`;
- put Records work in department-waiting state;
- record `HANDOFF_CREATED` and `handoff_created` timestamp;
- create required notification/outbox evidence.

Parent coordinating owner remains Student Records.

## 6. Finance access projection

Finance may receive only:

- request/service/reference and minimum applicant facts required for verification;
- requested action/reason/result schema;
- explicit relevant documents/references;
- handoff conversation/history;
- due/priority/assignment context.

Finance cannot use the handoff to browse unrelated request answers, notes, documents, outcomes, applicants, departments or organization data.

## 7. Acceptance and assignment

`AcceptHandoff` revalidates active Finance membership, exact permission, organization/department, current status and stale token; it records `HANDOFF_ACCEPTED` and acceptance timestamp.

Authorized Supervisor may assign a receiving Officer. Claim/assignment remains inside Finance and does not assign the parent request.

## 8. Result record

Each Finance result records:

- code: `CLEAR`, `HOLD` or `CANNOT_VERIFY`;
- explanatory note;
- verification date/time;
- acting Officer/membership;
- optional reference;
- handoff/result sequence identity.

Result records are immutable evidence. Corrections create a new result attempt/history entry rather than overwriting the old result.

## 9. Result behavior

| Result/action | Handoff/work | Parent request/Records work |
|---|---|---|
| `CLEAR` | Finance work/handoff `COMPLETED`; `HANDOFF_COMPLETED` | request `IN_REVIEW`; Records `READY`/`IN_PROGRESS` |
| `HOLD` | Finance work/handoff `COMPLETED` | request/Records wait on applicant; exact safe action required |
| applicant resolves HOLD | old handoff remains complete | request `IN_REVIEW`; new referral if recheck required |
| `CANNOT_VERIFY` | Finance work `RETURNED`; handoff `RETURNED_FOR_CLARIFICATION` | request `IN_REVIEW`; Records `IN_PROGRESS`; approval blocked |
| resubmit clarification | same handoff → `PENDING_ACCEPTANCE`; new history | request returns to department-waiting when sent |
| Finance decline | handoff `DECLINED`; Finance work `CANCELLED` | request `IN_REVIEW`; revised work requires new handoff |

None of these actions rejects the request.

## 10. Applicant visibility

- Active Finance work maps publicly to Additional Checks in Progress.
- `HOLD` maps to Action Required and includes only the exact applicant-safe action.
- `CANNOT_VERIFY`, notes, assignments and internal verification detail are not exposed.
- Applicant-visibility setting cannot override the Stage 0 safe-status/message rules.

## 11. Concurrency/idempotency

- Result/accept/decline/clarification commands include expected status/version.
- Only one successful terminal result attempt per active handoff cycle.
- Repeated accepted command returns existing result where idempotency permits or a safe conflict.
- No double audit/notification/timestamp.
- Declined handoff cannot be silently reused; `CANNOT_VERIFY` clarification must reuse the same handoff.

## 12. Cancellation

Only an authorized Supervisor with `handoffs.cancel` may cancel within department/resource/state scope. Cancellation requires reason and history, resolves/cancels active Finance work as defined, and must return the request to a valid non-department-waiting state. Part 7 API contracts finalize the exact eligible pre-terminal states.

## 13. Tests

- required creation fields and atomic effects;
- Student Records remains owner;
- Finance projection/data isolation;
- acceptance permission/state checks;
- all three results and decline;
- same-handoff clarification versus new handoff after decline/HOLD recheck;
- applicant-safe mapping;
- approval blocked without latest valid `CLEAR`;
- acceptance/completion timestamps;
- stale/retry behavior and immutable history.

## 14. Explicit non-goals

- Transfer or parent ownership change.
- Arbitrary department/officer sharing.
- Parallel/multiple receiving departments.
- Workflow invitations.
- Finance payment collection or M-PESA integration.

## 15. Open questions

- `P5-OQ-HOF-001` — Finalize the seeded Finance priority and due duration in `SLA.md`/`SEED-DATA.md`.

## 16. Change rule

Adding a receiving department, result code, ownership change or branch requires Stage 0 workflow/permission/status approval.

## 17. Coding-agent instruction

Authorize handoff context separately from parent-request context. Never grant Finance the unrestricted request aggregate or reuse a declined handoff.
