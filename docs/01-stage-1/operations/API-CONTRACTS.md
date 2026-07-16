# FAIDIA Stage 1 — API and Command Contracts

**Status:** READY_FOR_PRODUCT_OWNER_REVIEW  
**Version:** 0.1  
**Last updated:** 2026-07-14  
**Authority:** Part 3 routes, Part 5 domain contracts and AC-SEC-09

## 1. Thesis

FAIDIA has no generic public business REST API in Stage 1. First-party reads use server query modules, mutations use named Server Actions, and only approved HTTP boundaries use Route Handlers.

## 2. Common command envelope

Every consequential command accepts a Zod-validated input containing the subject ID, expected `record_version`/state, idempotency key where retryable and command-specific fields. Actor, organization, membership/profile and permissions are derived server-side. Responses are a discriminated result: `ok`, `validation_error`, `forbidden`, `not_found`, `conflict`, `rate_limited` or `temporary_failure`; no stack/SQL details are returned.

## 3. Named command registry

| Area | Commands |
|---|---|
| auth/draft | `CreateDraft`, `SaveDraft`, `StartRequest`, `SubmitRequest` |
| documents | `PrepareUpload`, `FinalizeUpload`, `ReplaceDocument`, `AcceptDocument`, `RejectDocument` |
| Records | `StartReview`, `RequestCorrection`, `CompleteRecordsReview`, `AssignWork`, `ReassignWork` |
| applicant correction | `ResubmitCorrection`, `SendApplicantMessage` |
| Finance | `CreateFinanceHandoff`, `AcceptHandoff`, `DeclineHandoff`, `ReturnHandoffForClarification`, `AssignFinanceWork`, `StartFinanceWork`, `CompleteFinanceHandoff` |
| Registrar | `ApproveRequest`, `RejectRequest`, `ReturnRequestForClarification` |
| outcome/completion | `RetryOutcomeGeneration`, `RecordPhysicalCollection`, `ManuallyCloseRequest`, `ReopenRequest`, `RevokeOutcome`, `ExpireRequest` |
| notifications | `MarkNotificationRead`, `MarkAllNotificationsRead` |
| configuration | limited metadata/branding drafts and compatible publication commands only |

No `setStatus`, generic transition, arbitrary workflow step, transfer or unrestricted share command exists.

## 4. Cancellation rule

`CancelFinanceHandoff` is allowed only to a Supervisor with `handoffs.cancel`, while the parent request is non-terminal and the handoff is `CREATED`, `PENDING_ACCEPTANCE`, `ACCEPTED`, `ASSIGNED`, `IN_PROGRESS` or `RETURNED_FOR_CLARIFICATION`. It requires a reason, closes/cancels active Finance work, appends handoff history/audit, preserves parent ownership and returns the parent to the valid pre-referral Records state. It is denied once the handoff is `DECLINED`, `COMPLETED` or already `CANCELLED`.

Request cancellation is not exposed because Stage 0 does not define an actor/command contract for it; `CANCELLED` remains a terminal status reserved until separately approved.

## 5. HTTP route handlers

| Route | Method | Contract |
|---|---|---|
| `/auth/callback` | GET | validate auth callback, establish safe session, allowlisted redirect |
| `/api/inngest` | GET/POST/PUT as library requires | signed Inngest protocol only; no browser business API |
| `/api/health` | GET | dependency-safe readiness; no secrets/build internals |
| `/api/outcomes/[outcomeId]/download` | GET | validate short-lived hashed token + applicant ownership, fetch private object, atomically record evidence/completion |

## 6. Concurrency and transactions

Authorization and preconditions are rechecked inside the mutation transaction. Expected versions prevent stale action. Duplicate submissions use the proposed advisory lock. Outbox/audit/history/state facts are committed atomically; external dispatch occurs after commit. Idempotency returns the existing logical result or a typed conflict without duplicate evidence.

## 7. Decision required

`S1-DEC-042` must approve the closed named-command registry, cancellation boundary and typed error envelope.

