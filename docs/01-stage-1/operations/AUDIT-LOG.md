# FAIDIA Stage 1 — Audit Log Contract

**Status:** READY_FOR_PRODUCT_OWNER_REVIEW  
**Version:** 0.1  
**Last updated:** 2026-07-14  
**Authority:** AC-AUD-01–06 and Stage 0 `V1-VERTICAL-SLICE.md` Section 10

## 1. Thesis

Audit events are append-only evidence of successful or explicitly denied/high-risk operations. They are not an editable activity feed and do not replace status, decision or handoff history.

## 2. Required event registry

The exact Stage 1 registry is: `REQUEST_CREATED`, `REQUEST_SUBMITTED`, `DUPLICATE_REQUEST_OVERRIDE_GRANTED`, `REQUEST_VIEWED`, `REVIEW_STARTED`, `DOCUMENT_UPLOADED`, `DOCUMENT_REJECTED`, `DOCUMENT_ACCEPTED`, `CORRECTION_REQUESTED`, `CORRECTION_RESUBMITTED`, `HANDOFF_CREATED`, `HANDOFF_ACCEPTED`, `HANDOFF_DECLINED`, `HANDOFF_RETURNED_FOR_CLARIFICATION`, `HANDOFF_COMPLETED`, `WORK_ITEM_COMPLETED`, `REQUEST_APPROVED`, `REQUEST_RETURNED_FOR_CLARIFICATION`, `REQUEST_REJECTED`, `OUTCOME_GENERATED`, `OUTCOME_GENERATION_FAILED`, `DOCUMENT_ISSUED`, `DOCUMENT_DOWNLOADED`, `OUTCOME_COLLECTED`, `REQUEST_MANUALLY_CLOSED`, `REQUEST_COMPLETED`, `REQUEST_REOPENED`, `DOCUMENT_REVOKED`, `REQUEST_EXPIRED`.

## 3. Event envelope

Each event records immutable event ID/type/time, organization, request and optional related entity IDs, actor user or explicit system actor, actor context/profile, correlation ID, causation/idempotency key and schema-versioned safe metadata. Metadata must not contain secrets, file contents, raw identity documents, access tokens or unrestricted free-form internal notes.

## 4. Creation rules

- success events are written in the same transaction as the successful state change;
- a failed transaction emits no success event;
- authorization denial may be written to a separate security log, never mislabeled as domain success;
- retries reuse idempotency and cannot duplicate a logical success event;
- background jobs identify both system actor and causating event/job.

## 5. Immutability and visibility

Database grants/triggers deny update/delete to web and worker roles. Applicant timelines use a separate allowlisted projection with applicant-safe labels. Officers/Supervisors require exact audit permissions and department/resource scope. Organization Admin receives aggregate/system configuration audit permitted by Stage 0, never sensitive request contents through a standalone audit page. The standalone admin audit route remains `DEMO_ONLY`.

## 6. Correlation and support

Every request mutation and background attempt carries a non-secret correlation ID into logs and audit metadata. User-visible error/support codes may expose that correlation ID, not stack traces or internal SQL details.

## 7. Decision required

`S1-DEC-038` must approve the audit envelope and safe metadata registries before final database JSON constraints are implemented.

