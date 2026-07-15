# FAIDIA Stage 1 — Domain Model

**Status:** READY_FOR_PRODUCT_OWNER_REVIEW  
**Version:** 0.1  
**Last updated:** 2026-07-14  
**Product:** FAIDIA — Service Operations Platform  
**Authority:** `docs/00-stage-0/STAGE-0-V1-SPECIFICATION.md`, `docs/00-stage-0/V1-VERTICAL-SLICE.md`, `docs/00-stage-0/STATUS-MAPPINGS.md`, and `docs/01-stage-1/ACCEPTANCE-CRITERIA.md`

## 1. Purpose

This document defines the logical business model for the Stage 1 Transcript Request slice. It names aggregates, entities, value objects, invariants and command boundaries without prematurely fixing physical database columns; Part 6 owns the physical schema.

For a beginner: the domain model describes the real things FAIDIA manages and the rules that must remain true, regardless of which page or database library is used.

## 2. Model thesis

`Request` is the coordinating aggregate for one applicant journey. Published configuration is immutable and separately versioned. Work items, corrections, handoffs, decisions, documents, outcomes, notifications and audit events preserve their own history and are linked to the request. No page may update these records directly; approved application commands enforce transitions atomically.

## 3. Context boundaries

| Context | Owns | Does not own |
|---|---|---|
| Organization | organization identity, departments, memberships and fixed profiles | applicant request content |
| Service configuration | service/form/requirement/workflow versions and publication | live request transitions |
| Request processing | request, response snapshots, work items, corrections, decisions and status history | authentication identity |
| Department collaboration | Finance handoff, receiving work and result | parent-request ownership |
| Documents/outcomes | document metadata, versions, storage objects, issued outcomes, collection/download evidence | arbitrary public storage |
| Communication | applicant messages and internal notes as separate visibility classes | workflow truth |
| Evidence | audit events, notification records, timestamps and reporting facts | mutable business records |

## 4. Aggregate roots

| Aggregate | Identity | Principal children | Key invariant |
|---|---|---|---|
| `Organization` | organization ID | departments, memberships, branding | all children belong to the same organization |
| `ServiceDefinition` | service ID | immutable service versions and publication pointer | only one current published version per service at a time |
| `FormDefinition` | form ID | immutable form versions and fields | Stage 1 supports only seeded field keys/types |
| `RequirementSet` | requirement-set ID | immutable requirement versions/rules | conditions are seeded, not arbitrary expressions |
| `WorkflowDefinition` | workflow ID | immutable workflow versions/steps | Stage 1 step order is fixed |
| `Request` | request ID | version pins, response snapshot, status history, work items, corrections, decisions | state changes follow the approved transition model |
| `Handoff` | handoff ID | history, Finance work item and result | Student Records remains coordinating request owner |
| `Document` | document ID | immutable file versions/replacement links/review history | replacement or revocation never deletes evidence |
| `IssuedOutcome` | outcome ID | exact file link, issue metadata, checksum and access/collection evidence | completion occurs only through an approved trigger |

## 5. Logical entities

| Entity/value | Required meaning |
|---|---|
| `UserIdentity` | authenticated Supabase user reference; not a role |
| `ApplicantProfile` | applicant-owned identity/contact profile within safe scope |
| `Membership` | a user's active organization relationship, top-level role and department scope |
| `MembershipProfile` | fixed profile additions such as Registrar; never a free-form role |
| `VersionPins` | exact service, form, requirement and workflow version IDs captured at draft creation |
| `RequestReference` | final human-facing reference assigned at successful submission |
| `ResponseSnapshot` | immutable submitted answers for one submission/resubmission history point |
| `WorkItem` | one actionable unit with department, assignee, status and timing |
| `Correction` | reason, applicant instructions, unlocked fields/files and optional deadline |
| `Decision` | immutable Registrar approve/reject/clarification record |
| `FinanceResult` | immutable result code, note, date, actor and optional reference for a handoff cycle |
| `StatusHistoryEntry` | append-only request-status transition evidence |
| `ApplicantMessage` | request-scoped applicant/staff communication |
| `InternalNote` | staff-only operational note with department/supervisor visibility |
| `Notification` | durable in-app notification and delivery state |
| `AuditEvent` | append-only evidence of a successful important action |
| `OutboxEvent` | retryable background-side-effect instruction written with the transaction |

## 6. Value objects

Validate these through shared constructors/parsers rather than passing unchecked strings:

- `OrganizationId`, `DepartmentId`, `MembershipId`, `RequestId`, `HandoffId`, `DocumentId`, `OutcomeId`;
- `RequestReference` and `OutcomeReference`;
- `EmailAddress`, `PhoneNumber`, `StudentNumber`, `IdentityNumber`;
- `DocumentChecksum` with algorithm and digest;
- `StorageObjectKey` without a public URL;
- `OrganizationLocalDateTime`/UTC instant pair;
- `ExpectedRecordVersion` or equivalent stale-state token;
- approved enums imported from `STATUSES.md`.

## 7. Request invariants

1. Every request belongs to one organization and one applicant.
2. Draft creation pins exact published service, form, requirement and workflow versions.
3. Pins never change; a retired pinned draft becomes read-only and must be restarted.
4. Submitted response snapshots are immutable.
5. A request has no final reference until the successful submission transaction.
6. Duplicate active Transcript Requests are blocked unless an authorized override with reason is recorded.
7. Student Records remains coordinating owner during Finance work.
8. Applicant correction edits only explicitly unlocked fields/documents.
9. Student Records cannot complete until required documents are `ACCEPTED`, correction is resolved, Finance is `CLEAR` and no mandatory work remains.
10. Registrar action requires the approved profile, exact permission and valid request prerequisites.
11. Outcome issue cannot imply completion.
12. Completion is controlled download, recorded physical collection or authorized manual closure only.
13. Reopening preserves all earlier history and does not automatically revoke an outcome.
14. `CANCELLED` and `EXPIRED` are terminal in Stage 1.

## 8. Command boundaries

The application layer exposes one command handler for each consequential action:

- `CreateDraft`, `UpdateDraftAnswers`, `AttachApplicantDocument`, `SubmitRequest`;
- `ClaimWorkItem`, `StartReview`, `RequestCorrection`, `ResubmitCorrection`;
- `CreateFinanceHandoff`, `AcceptHandoff`, `DeclineHandoff`, `ReturnHandoffForClarification`, `ResubmitHandoff`, `RecordFinanceResult`, `CompleteHandoff`;
- `CompleteRecordsWork`, `ApproveRequest`, `RejectRequest`, `ReturnRequestForClarification`;
- `PrepareOutcome`, `RecordOutcomeFailure`, `RetryOutcome`, `IssueOutcome`;
- `AuthorizeOutcomeDownload`, `RecordPhysicalCollection`, `ManuallyCloseRequest`;
- `ReopenRequest`, `RevokeOutcome`, `ExpireRequest`.

Each handler validates authorization, organization/resource scope, input, expected current state and stale token, then atomically writes business state, history, audit, timestamps, notifications and outbox records as applicable.

## 9. Query boundaries

Queries return purpose-built, permission-safe view models:

- public published service details;
- applicant-owned request list/detail/timeline/correction/outcome;
- assigned/department queues;
- staff request workspace;
- Finance handoff inbox/detail;
- Registrar approval queue;
- Supervisor aggregate metrics;
- Organization Admin configuration/aggregate metadata.

Never expose a raw aggregate to the browser. Applicant queries do not return internal statuses, notes, handoff detail, assignment or confidential Finance data.

## 10. Event and timestamp facts

Business events are named in `V1-VERTICAL-SLICE.md` and finalized technically in `AUDIT-LOG.md`. Stage-duration reporting derives from persisted facts such as request started/submitted, first action, review started, correction requested/resubmitted, handoff created/accepted/completed, approval ready/decided, outcome ready and completion.

Do not reconstruct an important timestamp from mutable `updated_at` values.

## 11. Consistency and retry rules

- Critical commands execute in one PostgreSQL transaction.
- State-changing commands carry an expected status/version.
- A stale command fails safely and returns the current state for review.
- Submission, background work and external/retryable operations use idempotency controls.
- A rolled-back or denied command writes no success audit event.
- Background jobs call the same domain/application rules; they do not create a second state machine.

## 12. Explicit non-goals

- Microservice or event-sourced architecture.
- A generic workflow/rules engine.
- Transfer, parallel branches or arbitrary department sharing.
- Automatic migration of existing requests to new configuration.
- Payment-provider domain objects.
- Public document-verification tokens.
- Physical database table/column definitions; Part 6 owns them.

## 13. Verification

- [ ] Every aggregate has one application command boundary.
- [ ] Request invariants are tested at domain and integration level.
- [ ] Applicant view models contain no operational-only data.
- [ ] Critical commands write state/history/audit atomically.
- [ ] Retried commands cannot duplicate requests, decisions, outcomes or events.
- [ ] Previous document, decision, handoff, outcome and completion history is preserved.

## 14. Open questions

None. Part 6 will assign physical tables, constraints and indexes without changing these aggregate boundaries.

## 15. Change rule

Changing an invariant, actor, workflow branch, completion trigger or ownership rule requires the controlling Stage 0 document and acceptance criteria to change first.

## 16. Coding-agent instruction

Put business transitions in domain/application modules, not pages, React components, SQL triggers or background-job branches. Stop when an implementation requires a state or relationship absent from this contract.
