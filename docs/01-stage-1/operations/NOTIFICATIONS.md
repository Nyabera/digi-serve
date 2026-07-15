# FAIDIA Stage 1 — Notification Contract

**Status:** READY_FOR_PRODUCT_OWNER_REVIEW  
**Version:** 0.1  
**Last updated:** 2026-07-14  
**Authority:** `ACCEPTANCE-CRITERIA.md` AC-NOT-01–05 and Stage 0 `V1-VERTICAL-SLICE.md` Section 9

## 1. Thesis

Stage 1 notifications are durable, organization-scoped in-app records created from committed domain facts. They inform a permitted recipient without becoming workflow authority. Email is excluded from the synthetic demonstration and must be validated/configured before an external pilot.

## 2. Required notification keys

| Key | Recipient | Trigger | Safe destination |
|---|---|---|---|
| `REQUEST_SUBMITTED` | applicant; Records queue recipients | successful submission | owned request detail / permitted queue |
| `CORRECTION_REQUESTED` | applicant | correction transaction | owned correction page |
| `CORRECTION_RESUBMITTED` | assigned Records staff | successful resubmission | permitted request detail |
| `FINANCE_REFERRAL_CREATED` | Finance queue recipients | handoff creation | permitted incoming handoff |
| `FINANCE_REFERRAL_ACCEPTED` | originating Records staff | acceptance | permitted request handoff section |
| `FINANCE_REFERRAL_NEEDS_CLARIFICATION` | originating Records staff | clarification or decline | permitted handoff section |
| `FINANCE_RESULT_COMPLETED` | originating Records staff | result completion | permitted handoff section |
| `FINANCE_HOLD_ACTION_REQUIRED` | applicant | approved HOLD projection | owned request detail; no confidential Finance text |
| `REQUEST_APPROVED` | applicant | Registrar approval | owned request detail |
| `REQUEST_REJECTED` | applicant | Registrar rejection | owned request detail |
| `REQUEST_RETURNED_FOR_CLARIFICATION` | Records staff | Registrar clarification | permitted request detail |
| `OUTCOME_READY` | applicant | issued outcome becomes available | owned outcome page |
| `REQUEST_EXPIRED` | applicant; Records staff | expiry command | owned/permitted request detail |
| `REQUEST_COMPLETED` | applicant; relevant Records staff | approved completion | owned/permitted request detail |
| `REQUEST_REOPENED` | applicant; Records staff | reopening | owned/permitted request detail |
| `SLA_OVERDUE_WARNING` | assignee or authorized department queue | first overdue crossing | permitted work item/request |

## 3. Record and rendering rules

Each notification stores recipient user, organization, key, subject reference, safe template data, safe route key/parameters, creation time, read time and delivery state. Template data is schema-validated by key. Never persist arbitrary HTML or a caller-supplied URL.

Applicant payloads may contain public request reference, service name, applicant-safe status/reason and required next action. They must not contain internal notes, raw Finance evidence/result notes, staff-only identifiers or unrelated staff information.

## 4. Transaction and delivery

The domain transaction writes the notification intent/outbox with the business change. An asynchronous dispatcher materializes/delivers it after commit. Dispatcher failure cannot roll back the domain transaction. A unique deduplication key `(organization, recipient, notification_key, subject, triggering_event)` prevents duplicate records.

Delivery states use the approved set: `PENDING`, `SENDING`, `SENT`, `DELIVERED`, `FAILED`, `CANCELLED`. In-app creation may move directly from `PENDING` to `DELIVERED`; email delivery is not enabled in the synthetic environment.

## 5. Access and actions

- list/read/mark-read queries are recipient-owned and RLS-protected;
- mark-one and mark-all-read are idempotent and cannot alter another user’s records;
- destination resolution reauthorizes the target; possession of a notification never grants access;
- read state is not audit authority and does not change workflow state.

## 6. Failure behavior

Unknown template keys, invalid safe data or unresolved recipients are recorded as failed dispatch attempts with secret-free diagnostics. They alert operations but do not fabricate a delivered notification. Retrying reuses the same deduplication key.

## 7. Acceptance mapping

AC-NOT-01 is covered by the key registry; AC-NOT-02 by durable state and safe destinations; AC-NOT-03 by audience schemas; AC-NOT-04 by outbox-after-commit dispatch; AC-NOT-05 by the explicit email boundary.

## 8. Decision required

`S1-DEC-036` must approve the keyed, schema-validated in-app notification/outbox model before implementation.

