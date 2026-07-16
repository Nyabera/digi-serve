---
title: FAIDIA Stage 2 Source of Truth
stage: 2
status: READY_FOR_OWNER_APPROVAL
version: 1.1.0
last_updated: 2026-07-16
service: Transcript Request
organization: Savannah Technical College
---

# Stage 2 — First Vertical Slice Source of Truth

## 1. Authority

This directory is the authoritative specification for FAIDIA Stage 2.

Stage 2 defines the first complete vertical slice:

```text
Applicant starts request
→ Applicant submits form and documents
→ Student Records reviews
→ Applicant corrects where required
→ Student Records creates Finance referral
→ Finance verifies payment and finance status
→ Registrar approves or rejects
→ Transcript is issued
→ Applicant downloads the outcome
→ Supervisor sees stage durations and bottlenecks
→ Full sequence remains available in audit history
```

Stage 1 remains authoritative for shared platform architecture, design-system rules, security boundaries, repository structure, multi-tenancy and platform-wide engineering conventions.

Where a generic Stage 1 rule conflicts with a service-specific rule in this directory, the Stage 2 rule governs the Transcript Request vertical slice.

## 2. Vertical-slice thesis

FAIDIA must prove that one institution can process one formal service from draft to issued outcome without depending on undocumented WhatsApp messages, email chains, spreadsheets, calls or physical follow-ups.

The applicant sees one continuous request and one request reference.

Internally, FAIDIA records:

- work items;
- department ownership;
- officer assignments;
- status history;
- departmental handoffs;
- applicant corrections;
- notifications;
- SLA timestamps;
- issued documents; and
- audit events.

## 3. Locked demonstration context

| Item | Locked decision |
|---|---|
| Demonstration organization | Savannah Technical College |
| Institution type | TVET |
| Fully functional service | Transcript Request |
| Originating department | Student Records |
| Referral department | Finance |
| Final approval department | Registrar |
| Service fee | KES 500 |
| Payment method | Manual payment reference and Finance verification |
| Number of copies | One digital copy |
| Delivery method | Secure applicant download |
| Identity requirement | National ID or passport is mandatory |
| Finance balance rule | Does not block submission; blocks approval and issuance |
| Initial assignment | Student Records supervisor assigns the request |
| Officer self-claim | Disabled for the demonstration organization |
| Applicant correction deadline | Seven calendar days |
| Correction escalation | Supervisor notified after two correction cycles |
| Issuance strategy | Hybrid |
| Preferred issuance mode | Registrar-uploaded official transcript PDF |
| Fallback issuance mode | FAIDIA-generated transcript using seeded demonstration data |
| Fallback marking | `DEMONSTRATION DATA` must be visible on every page |
| Completion rule | Request completes only after one issuance mode succeeds |
| Public QR verification | Postponed |
| SLA calculation | Elapsed hours and calendar days |

## 4. Hybrid issuance strategy

FAIDIA supports two issuance modes.

### 4.1 `OFFICIAL_UPLOAD` — preferred

After Registrar approval:

1. Registrar uploads the institution's official transcript PDF.
2. FAIDIA validates the file.
3. FAIDIA stores the file in private storage.
4. FAIDIA calculates and stores a checksum.
5. FAIDIA creates the issued-document record.
6. FAIDIA records issuance audit events.
7. FAIDIA notifies the applicant.
8. The request becomes `COMPLETED`.

The institution remains the authoritative source of academic content.

### 4.2 `DEMO_GENERATED` — fallback

Where an official transcript PDF is unavailable in the demonstration environment:

1. FAIDIA generates a transcript from seeded synthetic academic data.
2. Every page is visibly marked `DEMONSTRATION DATA`.
3. The generated PDF follows the same storage, checksum, access-control, notification and audit process as an official upload.
4. The request becomes `COMPLETED` only after successful storage and issued-document creation.

The fallback is for demonstrations only. It must not be mistaken for a real institutional academic record.

## 5. Completion rule

Registrar approval does not complete the request.

Approval transitions the request to:

```text
APPROVED_PENDING_ISSUANCE
```

The request transitions to:

```text
COMPLETED
```

only when either:

- an official Registrar PDF is uploaded and stored successfully; or
- a demonstration transcript is generated and stored successfully.

If issuance fails, the request remains `APPROVED_PENDING_ISSUANCE`.

## 6. Roles in the slice

### Applicant

A current student, former student or graduate requesting a transcript.

### Student Records officer

Verifies identity, academic record matching, eligibility and documents.

### Finance officer

Accepts and completes the Finance referral, verifies the payment reference and reports Finance clearance.

### Registrar approver

Makes the final institutional decision.

### Supervisor

Assigns and reassigns work, monitors departmental queues, manages overdue items and reviews handoff bottlenecks.

### Organization administrator

Publishes the service and workflow versions, configures participating departments, manages fixed V1 roles and enables required features.

## 7. Canonical source-of-truth files

1. `TRANSCRIPT-REQUEST-SERVICE.md`
2. `TRANSCRIPT-REQUEST-WORKFLOW.md`
3. `TRANSCRIPT-REQUEST-EVENTS-AND-SLA.md`
4. `TRANSCRIPT-REQUEST-OUTCOME-AND-METRICS.md`
5. `TRANSCRIPT-REQUEST-ACCEPTANCE.md`
6. `STAGE-2-APPROVAL.md`
7. `STAGE-2-TRACEABILITY.md`

## 8. Document precedence

Within Stage 2:

1. `STAGE-2-SOURCE-OF-TRUTH.md`
2. The specific domain file governing the issue
3. `STAGE-2-APPROVAL.md`
4. `STAGE-2-TRACEABILITY.md`

## 9. Change control

Before approval, changes may be made through reviewed edits.

After approval:

- published rules must not be silently overwritten;
- material changes require a new decision record;
- the Stage 2 version must be incremented;
- existing requests remain attached to the service, form and workflow versions under which they were submitted;
- coding agents must treat these files as constraints, not suggestions.
