# FAIDIA Stage 1 — Workflow Contract

**Status:** READY_FOR_PRODUCT_OWNER_REVIEW  
**Version:** 0.1  
**Last updated:** 2026-07-14  
**Product:** FAIDIA — Service Operations Platform  
**Authority:** `docs/00-stage-0/STAGE-0-V1-SPECIFICATION.md` Section 10, `docs/00-stage-0/V1-VERTICAL-SLICE.md`, `docs/00-stage-0/STATUS-MAPPINGS.md`, and AC-REV/AC-COR/AC-FIN/AC-REG/AC-OUT/AC-CMP

## 1. Purpose

This document translates the fixed Transcript Request journey into executable workflow, work-item and command contracts.

## 2. Workflow thesis

Stage 1 is a code-backed fixed workflow whose published version supplies immutable step metadata. It is not a general workflow engine. Named commands enforce transitions; work items record responsibility; audit/history records evidence.

## 3. Fixed workflow steps

| Order | Step key | Primary actor/department | Completion/result |
|---:|---|---|---|
| 1 | `APPLICANT_SUBMISSION` | Applicant | valid request submitted |
| 2 | `STUDENT_RECORDS_REVIEW` | Student Records | correction, Finance referral or ready to complete review |
| 3 | `APPLICANT_CORRECTION` | Applicant when invoked | correction resubmitted or expired/cancelled |
| 4 | `FINANCE_REFERRAL` | Finance when invoked | `CLEAR`, `HOLD`, `CANNOT_VERIFY` or decline path |
| 5 | `STUDENT_RECORDS_COMPLETION` | Student Records | all prerequisites satisfied; work completed |
| 6 | `REGISTRAR_DECISION` | Registrar-profile Supervisor | approve, reject or return for clarification |
| 7 | `OUTCOME_PREPARATION` | authorized outcome processor/system | issued or failed/retry |
| 8 | `COMPLETION` | applicant, Student Records or Supervisor | approved completion method recorded |

Correction and Finance are conditional invocations within this fixed order, not arbitrary branches editable by Organization Admin.

## 4. Workflow version

A published workflow version contains:

- workflow/version identity and version number;
- fixed ordered step definitions;
- department/actor profile requirements;
- named allowed command/result keys;
- timing/SLA target references;
- publication actor/time and immutable status.

The application validates the version against a compiled Stage 1 workflow signature. Admin may publish a seeded compatible version but cannot edit order, command keys, Finance schema, approval or completion rules.

## 5. Workflow instance

Submission creates one workflow instance pinned to the draft's workflow version and linked to the request. It records current logical step and lifecycle timing but does not replace the request status or work items.

Rules:

- no automatic migration to later workflow versions;
- one active Stage 1 workflow instance per request;
- reopening reactivates/creates Records work in the same preserved request history; it does not erase the completed instance evidence;
- a background job cannot advance the instance without the same named application command/invariants.

## 6. Work-item model

A work item records request, workflow step, organization, department, required permission/profile, status, assignee/claim, due/started/completed timestamps and creation/completion reason.

Work-item operations:

- create/ready;
- claim within own department;
- assign/reassign by authorized Supervisor with reason;
- start;
- wait on applicant/department;
- return;
- complete when command prerequisites pass;
- cancel when the owning workflow path is cancelled/declined as approved.

Work-item status never substitutes for parent request status.

## 7. Submission transaction

`SubmitRequest` atomically:

1. revalidates applicant/organization/version pins/form/documents/payment/declaration/duplicate rule;
2. creates final request reference and immutable response snapshot;
3. moves request to `SUBMITTED`;
4. creates workflow instance and Student Records work item/queue state;
5. appends status/audit/history and required timestamps;
6. creates applicant notification and outbox records.

The submission idempotency key/unique constraints ensure a retry returns the same success rather than creating a second request.

## 8. Student Records review/correction

- Claim is limited to eligible unassigned own-department work.
- Start review sets request `IN_REVIEW`, work `IN_PROGRESS`, and first-action/review timestamps once.
- Request correction requires applicant-visible reason, unlocked fields/files and optional deadline; request/work become `WAITING_ON_APPLICANT`.
- Resubmission validates only allowed edits plus the complete schema, returns request to `IN_REVIEW`, and readies/resumes Records work.

## 9. Finance collaboration

Finance behavior is controlled by `HANDOFFS.md`. Workflow invariants:

- creation moves request to `WAITING_ON_DEPARTMENT` while Records remains owner;
- `CLEAR` returns request to `IN_REVIEW` and permits prerequisite evaluation;
- `HOLD` moves to `WAITING_ON_APPLICANT`; resolution returns to `IN_REVIEW` and a recheck uses a new handoff when required;
- `CANNOT_VERIFY`/decline returns request to `IN_REVIEW`; approval remains blocked;
- no Finance result automatically rejects the request.

## 10. Records completion

`CompleteRecordsWork` is allowed only when:

- request is `IN_REVIEW`;
- required documents are `ACCEPTED`;
- no correction is unresolved;
- required latest Finance verification is `CLEAR`;
- Records checks are explicitly complete;
- no mandatory work item/handoff remains unresolved.

It completes Records work, creates/readies approval work, moves request to `PENDING_APPROVAL`, appends history/event/timestamps and exposes the request in the approval queue.

## 11. Registrar decision

All decisions execute inside `/officer/requests/[id]` through the embedded panel.

- Approve: valid `PENDING_APPROVAL` prerequisites → immutable approved decision → `APPROVED` → begin outcome processing.
- Reject: exact permission/profile and applicant-visible reason → immutable rejected decision → `REJECTED`.
- Return: exact permission/profile, internal reason and applicant instruction where applicable → immutable returned decision → `IN_REVIEW` → Records work `READY` → outcome blocked.

Previous decisions remain immutable. A returned/reopened journey may later create another decision record.

## 12. Outcome and completion

- Approved request creates a pending outcome before file is issued.
- Immediate success may move directly to `OUTCOME_READY`; meaningful delay uses `OUTCOME_PREPARATION`.
- Failure uses `OUTCOME_FAILED`; authorized retry preserves failure history.
- Issue records the exact private outcome and moves to `OUTCOME_READY`.
- Only controlled download, physical collection or manual closure moves `OUTCOME_READY` to `COMPLETED`.

## 13. Reopen and expiry

- Supervisor + `requests.reopen` + reason may move `REJECTED`/`COMPLETED` to `IN_REVIEW` and create/reactivate Records work.
- Previous outcomes/decisions/completion evidence remain.
- `DRAFT` expires 30 days after start.
- `WAITING_ON_APPLICANT` expires only after its recorded deadline.
- `CANCELLED` and `EXPIRED` cannot reopen.

## 14. State-machine implementation

Use named domain policies and command handlers, not a generic transition endpoint. Every handler accepts expected current state/version and returns a typed success, validation denial, authorization denial or stale conflict.

The database may enforce constraints but must not contain a second hidden workflow in triggers.

## 15. Tests

- happy path and every correction/Finance/decision/outcome branch;
- every invalid transition denied;
- permission and state checked together;
- retry/idempotency and simultaneous-action conflict;
- required work/status/history/audit/notification written atomically;
- stage timestamps calculate approved metrics;
- published workflow immutability and request pinning;
- no generic transition or visual builder path.

## 16. Explicit non-goals

- Parallel steps, transfer, arbitrary conditions/scripts or visual editing.
- Generic BPMN/workflow engine.
- Automatic routing/escalation/capacity assignment.
- New completion triggers.

## 17. Open questions

- `P5-OQ-WFL-001` — Finalize exact synthetic SLA durations in `SLA.md`/`SEED-DATA.md`; values must not change workflow order.

## 18. Change rule

Any step, branch, result, decision or completion change requires approved Stage 0 workflow/status/acceptance updates.

## 19. Coding-agent instruction

Implement one named command per approved action and one shared transition authority. Never advance the workflow from UI state or background-job assumptions.
