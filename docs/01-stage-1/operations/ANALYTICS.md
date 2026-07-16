# FAIDIA Stage 1 — Validation Analytics Contract

**Status:** READY_FOR_PRODUCT_OWNER_REVIEW  
**Version:** 0.1  
**Last updated:** 2026-07-14  
**Authority:** Stage 0 success criteria, `CURRENT-PROCESS.md`, and `VALIDATION-PLAN.md`

## 1. Thesis

Analytics measures whether the vertical slice reduces lost work and status uncertainty. Domain timestamps/audit events remain the source for operational truth; client analytics are limited to discovery/funnel observations and never decide workflow state.

## 2. Event registry

| Event | Source | Deduplication |
|---|---|---|
| `service_viewed` | server-rendered service detail observation | anonymous/session + service + bounded window |
| `request_started` | draft creation transaction | request ID |
| `request_submitted` | submission transaction | request ID |
| `request_abandoned` | derived from expired/stale draft rule | request ID + rule version |
| `request_opened_by_officer` | first authorized officer open | request + actor |
| `first_action_taken` | first successful review action | request ID |
| `document_returned` | document rejection/correction transaction | document review ID |
| `handoff_created` | handoff transaction | handoff ID |
| `handoff_accepted` | handoff acceptance | handoff ID |
| `handoff_completed` | handoff completion | handoff ID |
| `request_approved` | Registrar decision | decision ID |
| `request_rejected` | Registrar decision | decision ID |
| `request_completed` | completion transaction | completion ID |

## 3. Privacy

Use opaque internal subject IDs and organization/request references; do not copy names, email, phone, student number, document names/content, messages or notes into analytics properties. Analytics access follows reporting scope. No third-party analytics is required for the synthetic demo.

## 4. Derived validation measures

Form-start rate, submission rate, abandonment rate, correction rate, applicant response time, time to first action, processing time, handoff usage and end-to-end time use declared denominators and `as_of` dates. “Work completed inside/outside FAIDIA” and reductions in calls/email/WhatsApp/lost requests require pilot feedback/instrumentation; they must not be inferred from app events alone.

## 5. Decision required

`S1-DEC-040` must approve the minimal privacy-safe event registry and its separation from audit evidence.

