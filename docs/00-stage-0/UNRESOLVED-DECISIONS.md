# FAIDIA Stage 0 — Unresolved Decisions

Status: **DRAFT — requires product-owner approval**  
Version: **0.1**  
Last updated: **2026-07-12**  
Product: **FAIDIA — Service Operations Platform**  

> This Stage 0 document is based on the uploaded FAIDIA product description, V1 structure, full development structure, recommended stack and strict build-order documents. Recommended defaults are filled in, while unresolved items are explicitly marked.


## 1. Purpose

This file records decisions that remain open. Coding agents must not guess answers that affect the database, workflow, permissions, routes or user experience.

Statuses:

- `OPEN`
- `RECOMMENDED_DEFAULT`
- `RESOLVED`
- `DEFERRED`
- `SUPERSEDED`

## 2. Resolved or recommended defaults

| ID | Decision | Current answer | Status |
|---|---|---|---|
| DEC-001 | Product category | Service Operations Platform | RESOLVED |
| DEC-002 | First market scenario | Kenyan TVET / technical college / small private college | RECOMMENDED_DEFAULT |
| DEC-003 | Fully functional service | Transcript Request | RESOLVED |
| DEC-004 | Demonstration services | Student Clearance and Certificate Replacement | RECOMMENDED_DEFAULT |
| DEC-005 | Demo organization | Savannah Technical College | RECOMMENDED_DEFAULT |
| DEC-006 | Demo departments | Student Records, Finance, Registrar | RECOMMENDED_DEFAULT |
| DEC-007 | V1 roles | Applicant, Officer, Supervisor, Organization Admin | RESOLVED |
| DEC-008 | Primary handoff | Referral; originator retains ownership | RESOLVED |
| DEC-009 | Transfer rule | Ownership changes only after acceptance | RESOLVED |
| DEC-010 | Supervisor shell | Reuse officer shell with extra permissions/navigation | RESOLVED |

## 3. Blocking product decisions

### DEC-011 — Transcript Request fee

- **Status:** OPEN
- **Options:** no fee; manual payment reference; cashier confirmation; live M-PESA.
- **Recommended:** manual payment reference if Finance needs a meaningful check; otherwise no fee.
- **Impact:** form, Finance workflow, payment records, pages, notifications and tests.
- **Resolve before:** form schema and Finance implementation.

### DEC-012 — Exact Finance verification

- **Status:** OPEN
- **Options:** outstanding balance/hold; payment reference; transcript fee; general clearance.
- **Recommended:** confirm whether any Finance hold prevents issuance; verify payment reference only if fee is enabled.
- **Impact:** referral request, result codes and continuation rules.
- **Resolve before:** workflow and seed data.

### DEC-013 — Finance HOLD result

- **Status:** OPEN
- **Options:** reject; return to applicant; pause; supervisor exception.
- **Recommended:** return to applicant with clear action where the issue is resolvable; reject only where policy requires.
- **Impact:** statuses, notification, SLA and correction logic.

### DEC-014 — Final outcome type

- **Status:** OPEN
- **Options:** official transcript PDF; collection notice; dispatch confirmation; decision letter plus manually issued transcript.
- **Recommended:** completion/collection/dispatch notice plus controlled sample transcript in demo mode.
- **Impact:** PDF template, document type and demo narrative.

### DEC-015 — Who creates the official transcript?

- **Status:** OPEN
- **Options:** FAIDIA; institution's current system; staff manual upload.
- **Recommended:** current institution process or staff upload; FAIDIA stores the exact issued copy.
- **Impact:** integrations, legal authority and PDF generation.

### DEC-016 — Completion rule

- **Status:** OPEN
- **Options:** approval; outcome generation; notification; download/collection.
- **Recommended:** Approved at decision, Ready at issuance, Completed at recorded delivery/collection or approved institutional closure rule.
- **Impact:** statuses, reporting and SLA endpoint.

### DEC-017 — Applicant registration model

- **Status:** OPEN
- **Options:** open registration; invitation; admission-number lookup; imported applicants.
- **Recommended:** open email registration for demo; controlled applicant group for pilot.
- **Impact:** auth, eligibility and abuse controls.

### DEC-018 — Officer self-assignment

- **Status:** OPEN
- **Options:** supervisor only; self-claim; automatic round-robin.
- **Recommended:** supervisor assignment plus optional self-claim within own department.
- **Impact:** queue actions, permissions and history.

### DEC-019 — Registrar approval requirement

- **Status:** OPEN
- **Options:** every request; exceptional cases only; Records approval for standard cases.
- **Recommended:** every request in the first demo to validate role separation.
- **Impact:** workflow length and approval queue.

### DEC-020 — Transfer in first pilot

- **Status:** OPEN
- **Options:** build/test but keep outside transcript main path; postpone until referral validation.
- **Recommended:** build after referrals, not in the main success path.
- **Impact:** build order and tests.

## 4. Status and domain decisions

### DEC-021 — `ASSIGNED` on parent request

- **Status:** OPEN
- **Recommended:** keep assignment on work items/assignments unless a distinct parent status is operationally useful.
- **Impact:** schema and reports.

### DEC-022 — Document status wording

- **Status:** OPEN
- **Options:** `ACCEPTED` or `APPROVED`.
- **Recommended:** `ACCEPTED` for applicant-supplied documents; reserve `APPROVED` for decisions.

### DEC-023 — Final handoff state

- **Status:** OPEN
- **Options:** `COMPLETED` only; `COMPLETED` then `RETURNED_TO_ORIGINATOR`.
- **Recommended:** `COMPLETED` with originator receipt represented by history/notification unless acknowledgement is required.

### DEC-024 — Correction-resubmission status

- **Status:** OPEN
- **Recommended:** no dedicated request status; use history and return to `IN_REVIEW`.

### DEC-025 — Preparing Outcome public status

- **Status:** OPEN
- **Recommended:** use only when outcome preparation has a meaningful delay.

## 5. Service details

### DEC-026 — Identity documents

- **Status:** OPEN
- **Options:** ID/passport; student ID; both; conditional.
- **Recommended:** ID/passport required, student ID conditional.
- **Confirm with:** pilot institution.

### DEC-027 — Delivery methods

- **Status:** OPEN
- **Options:** controlled download; physical collection; email to institution; dispatch/courier.
- **Recommended:** collection or controlled download for demo.

### DEC-028 — Number of copies

- **Status:** OPEN
- **Recommended:** one copy unless fee and fulfillment explicitly support more.

### DEC-029 — Duplicate active request

- **Status:** OPEN
- **Options:** block; warn; allow.
- **Recommended:** warn and block another active request unless staff override.

### DEC-030 — Draft expiry

- **Status:** OPEN
- **Recommended:** 30 days for demo/pilot, later configurable.

## 6. Pilot and operations

### DEC-031 — First real pilot institution

- **Status:** OPEN
- **Need:** named institution, service owner and weekly feedback agreement.

### DEC-032 — Pilot data sensitivity

- **Status:** OPEN
- **Options:** synthetic only; limited real data; full production.
- **Recommended:** synthetic demo, carefully limited real pilot data only after hardening and agreement.

### DEC-033 — Pilot volume

- **Status:** RECOMMENDED_DEFAULT
- **Recommended:** 20–50 controlled requests.
- **Confirm:** institution can generate enough requests in the pilot period.

### DEC-034 — External email

- **Status:** OPEN
- **Recommended:** optional for internal demo; required for external pilot.

### DEC-035 — Applicant support

- **Status:** OPEN
- **Options:** founder; institution helpdesk; service owner; shared.
- **Recommended:** founder plus service owner during pilot.

### DEC-036 — Feedback method

- **Status:** OPEN
- **Recommended:** weekly staff session, short applicant feedback and structured issue log.

## 7. Design decisions intentionally deferred

Not Stage 0 blockers:

- exact sidebar width;
- exact top-bar height;
- exact typography scale;
- final spacing values;
- exact breakpoints;
- final chart palette;
- final shadow/radius values;
- final mobile navigation pattern.

Stage 0 still decides the visual direction, workspace boundaries and intended navigation.

## 8. Decision template

```md
### DEC-XXX — Title

- **Status:** OPEN
- **Question:**
- **Options:**
- **Recommended default:**
- **Decision:**
- **Reason:**
- **Affected documents:**
- **Affected implementation:**
- **Owner:**
- **Resolve before:**
- **Resolved date:**
```

## 9. Resolution procedure

1. Discuss options.
2. Record chosen answer here.
3. Update the controlling specification/workflow/status/page file.
4. Mark this entry `RESOLVED`.
5. Increase affected versions.
6. Commit documentation.
7. Then prompt the coding agent.

## 10. Coding-agent instruction

> If an open decision affects the current task, surface the decision ID and stop. Do not choose the easiest coding option.
