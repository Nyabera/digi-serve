# FAIDIA Stage 1 — SLA Contract

**Status:** READY_FOR_PRODUCT_OWNER_REVIEW  
**Version:** 0.1  
**Last updated:** 2026-07-14  
**Authority:** Stage 0 `STATUS-MAPPINGS.md`, `V1-VERTICAL-SLICE.md` Sections 10–11 and AC-REP-01–05

## 1. Thesis

Stage 1 SLA is elapsed-clock operational evidence, separate from request/workflow status. It does not implement business calendars, holidays, pauses or escalation ladders.

## 2. Clock model

Store all instants in UTC and render in the organization timezone (`Africa/Nairobi` for the synthetic organization). Each `sla_instance` pins its target seconds and threshold at creation; later configuration changes do not rewrite existing clocks.

| Clock | Starts | Stops | Owner/scope |
|---|---|---|---|
| first action | request submission | first successful Records review action | Student Records |
| correction response | correction request | correction resubmission | applicant response evidence |
| referral acceptance | handoff creation | handoff acceptance | Finance |
| referral completion | handoff acceptance | Finance completion | Finance |
| approval waiting | approval work creation | Registrar decision | Registrar profile |
| outcome ready | approval | issued outcome available | system/Records |
| end-to-end | submission | first approved completion | request |

Cancellation/expiry closes an active clock as `CANCELLED`; reopening creates new operational clocks where work resumes and never rewrites closed clocks.

## 3. State calculation

Approved states are `NOT_STARTED`, `ON_TRACK`, `DUE_SOON`, `OVERDUE`, `COMPLETED_ON_TIME`, `COMPLETED_LATE`, `CANCELLED`.

- before start: `NOT_STARTED`;
- active before `due_at - due_soon_seconds`: `ON_TRACK`;
- active from that threshold through `due_at`: `DUE_SOON`;
- active after `due_at`: `OVERDUE`;
- completed at/before due: `COMPLETED_ON_TIME`; otherwise `COMPLETED_LATE`.

The state is derived from stored timestamps/target facts. A scheduled job may persist crossings and enqueue a one-time warning but cannot advance workflow state.

## 4. Synthetic targets proposed for deterministic tests

| Clock | Target | Due-soon threshold |
|---|---:|---:|
| first action | 24 elapsed hours | 4 hours |
| referral acceptance | 8 elapsed hours | 2 hours |
| referral completion | 24 elapsed hours | 4 hours |
| approval waiting | 24 elapsed hours | 4 hours |
| outcome ready | 24 elapsed hours | 4 hours |
| end-to-end | 120 elapsed hours | 24 hours |

Correction response is measured, not staff-SLA scored. These are synthetic validation values, not institutional commitments; the real pilot values must be confirmed before external use.

## 5. Idempotency and warnings

Crossing detection is safe to rerun. A unique warning key per instance and crossing prevents duplicate overdue notifications. Clock creation/completion occurs in the same transaction as its triggering domain action.

## 6. Access and reporting

Applicant pages may show a safe expected-time message, not internal department performance. Officers see only permitted work clocks; Supervisors see department aggregates; Organization Admin sees organization aggregates without request content.

## 7. Decision required

`S1-DEC-037` must approve elapsed-clock semantics and synthetic targets. External-pilot SLA values remain an explicit validation item.

