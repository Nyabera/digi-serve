# FAIDIA Stage 0 — Post-V1 Backlog

Status: **DRAFT — requires product-owner approval**  
Version: **0.1**  
Last updated: **2026-07-12**  
Product: **FAIDIA — Service Operations Platform**  

> This Stage 0 document is based on the uploaded FAIDIA product description, V1 structure, full development structure, recommended stack and strict build-order documents. Recommended defaults are filled in, while unresolved items are explicitly marked.


## 1. Purpose

This backlog preserves useful ideas without allowing them to interrupt V1. Items are not promises and have no fixed release date. Promote an item only after pilot evidence shows a real problem, buyer demand or operational need.

Priority bands:

- **P1** — likely next after validation;
- **P2** — valuable expansion;
- **P3** — strategic/enterprise;
- **P4** — speculative.

## 2. Workflow and routing

### WF-001 — Visual workflow builder

- **Priority:** P2
- **Problem:** Admins depend on developers for workflow changes.
- **Capability:** Controlled drag-and-drop editor over versioned definitions.
- **Evidence required:** At least three customers need frequent changes.
- **Dependencies:** Stable workflow model, transition validation, version publishing, permissions.

### WF-002 — Conditional workflow rules

- **Priority:** P1
- **Problem:** Different request conditions need different paths.
- **Capability:** Safe condition builder using predefined fields/operators.
- **Evidence required:** Repeated manual branching in pilots.
- **Dependencies:** Indexed fields and versioned conditions.

### WF-003 — Parallel work items

- **Priority:** P1
- **Problem:** Multiple departments can work at once.
- **Capability:** `ALL_COMPLETE`, `ANY_COMPLETE`, optional and dependency groups.
- **Evidence required:** A validated service suffers delay from forced sequence.

### WF-004 — Reusable subprocesses

- **Priority:** P3
- **Problem:** Same verification pattern repeats.
- **Evidence required:** Repetition across live services.
- **Dependencies:** Stable workflow versioning.

### WF-005 — Rules-based routing recommendation

- **Priority:** P3
- **Problem:** Staff choose routes inconsistently.
- **Evidence required:** Historical data and measurable routing errors.
- **Dependencies:** Route definitions, audit history, override tracking.

### WF-006 — AI routing

- **Priority:** P4
- **Evidence required:** Strong historical data, accepted error threshold, human override and monitoring.
- **Dependencies:** WF-005.

### WF-007 — Capacity-based assignment

- **Priority:** P3
- **Problem:** Workloads are uneven.
- **Evidence required:** Persistent imbalance and reliable workload data.

### WF-008 — Multi-level escalation

- **Priority:** P2
- **Problem:** Overdue visibility alone is insufficient.
- **Evidence required:** Pilot evidence of unresolved overdue work.
- **Dependencies:** Reliable SLA and notification delivery.

### WF-009 — Cross-organization handoffs

- **Priority:** P4
- **Evidence required:** Multiple customers, legal model and data-sharing agreements.

## 3. Forms and public pages

### FORM-001 — Visual form builder

- **Priority:** P2
- **Evidence required:** Several live services and frequent form changes.
- **Dependencies:** Stable field types, validation, versioning and preview.

### FORM-002 — Advanced conditional sections

- **Priority:** P1
- **Evidence required:** Abandonment or corrections caused by irrelevant fields.

### FORM-003 — Repeating groups

- **Priority:** P2
- **Evidence required:** Priority services require repeatable data.

### FORM-004 — Advanced eligibility engine

- **Priority:** P2
- **Evidence required:** Manual eligibility checks create high rejection/support volume.

### WEB-001 — Homepage block builder

- **Priority:** P3
- **Evidence required:** Branding/customization blocks multiple deals.
- **Dependencies:** Safe block schema and publishing.

### WEB-002 — Template marketplace

- **Priority:** P4
- **Evidence required:** Active customer base and governance model.

## 4. Documents and verification

### DOC-001 — Public QR verification

- **Priority:** P1 where issued-document trust matters.
- **Dependencies:** Issued documents, opaque tokens, revocation, rate limiting.

### DOC-002 — OCR

- **Priority:** P3
- **Evidence required:** High document volume and clear extraction fields.

### DOC-003 — AI classification

- **Priority:** P3
- **Evidence required:** High upload misclassification and labelled examples.

### DOC-004 — Document comparison

- **Priority:** P3
- **Evidence required:** Measurable manual comparison burden.

### DOC-005 — Electronic signatures

- **Priority:** P2
- **Evidence required:** Legal approval and selected provider/policy.

### DOC-006 — Advanced retention/legal hold

- **Priority:** P3
- **Evidence required:** Enterprise compliance requirement.

### DOC-007 — Malware scanning and quarantine

- **Priority:** P1 before sensitive production use.
- **Dependencies:** Scanner, quarantine state, retry and admin process.

## 5. Payments

### PAY-001 — M-PESA STK Push

- **Priority:** P1 when payment is central.
- **Evidence required:** Manual reference materially fails.
- **Dependencies:** Provider interface, idempotent webhook and reconciliation.

### PAY-002 — PayBill reconciliation

- **Priority:** P1/P2
- **Evidence required:** Customer uses PayBill and allocation is painful.

### PAY-003 — Stripe

- **Priority:** P3
- **Evidence required:** Real international/card demand.

### PAY-004 — Refunds and waivers

- **Priority:** P2
- **Evidence required:** Live payment policy.

### PAY-005 — SaaS subscription billing

- **Priority:** P3
- **Evidence required:** Stable packages and paying customer base.

## 6. Communication

### COM-001 — SMS

- **Priority:** P2
- **Evidence required:** Email/in-app is insufficient.

### COM-002 — WhatsApp

- **Priority:** P2/P3
- **Evidence required:** Multi-institution demand, consent and template rules.

### COM-003 — Editable notification templates

- **Priority:** P2
- **Evidence required:** Repeated institution wording changes.

### COM-004 — Formal correspondence

- **Priority:** P2
- **Evidence required:** Live services need letters distinct from messages.

### COM-005 — Omnichannel inbox

- **Priority:** P4
- **Evidence required:** Several active channels and enough volume.

## 7. Reporting

### REP-001 — Configurable report builder

- **Priority:** P2
- **Evidence required:** Repeated needs not covered by predefined reports.
- **Dependencies:** Governed datasets and metric definitions.

### REP-002 — Scheduled reports

- **Priority:** P2
- **Evidence required:** Weekly/monthly reporting becomes operational.

### REP-003 — Executive dashboards

- **Priority:** P3
- **Evidence required:** Reliable data over several months.

### REP-004 — Data warehouse

- **Priority:** P4
- **Evidence required:** PostgreSQL reporting is demonstrably inadequate.

### REP-005 — Applicant-experience analytics

- **Priority:** P2
- **Evidence required:** Enough applicant volume and reliable events.

### REP-006 — Compliance/access reports

- **Priority:** P2/P3
- **Evidence required:** Customer audit demand.

## 8. Enterprise and integrations

### ENT-001 — Enterprise SSO

- **Priority:** P3
- **Evidence required:** Qualified deal requires SAML/OIDC.

### ENT-002 — Institution-system integration

- **Priority:** P2/P3
- **Evidence required:** Usable API/export and integration agreement.

### ENT-003 — Bulk imports

- **Priority:** P1/P2
- **Evidence required:** Pilot setup cannot be handled efficiently by individual entry.

### ENT-004 — Full public API

- **Priority:** P4
- **Evidence required:** Multiple external clients depend on stable contracts.

### ENT-005 — Dedicated deployment

- **Priority:** P4
- **Evidence required:** Contractual isolation, scale or regulation.

### ENT-006 — Advanced permission editor

- **Priority:** P3
- **Evidence required:** Fixed roles block several real workflows.

## 9. Mobile

### MOB-001 — Native applicant app

- **Priority:** P4
- **Evidence required:** Responsive web is inadequate.

### MOB-002 — Native officer app

- **Priority:** P4
- **Evidence required:** Device features/offline/push are essential.

### MOB-003 — Offline workflows

- **Priority:** P4
- **Evidence required:** Connectivity problems and defined sync rules.

## 10. Ecosystem

### ECO-001 — Developer marketplace

- **Priority:** P4
- **Evidence required:** Mature API, governance, billing and demand.

### ECO-002 — Service-template library

- **Priority:** P2
- **Evidence required:** Several validated repeatable service patterns.

### ECO-003 — Partner implementation tools

- **Priority:** P3
- **Evidence required:** External implementers are active.

## 11. Promotion process

To promote an item:

1. link real evidence;
2. define problem and user;
3. identify source-of-truth documents affected;
4. write acceptance criteria;
5. assess security/data impact;
6. identify dependencies;
7. decide what work it displaces;
8. update scope and roadmap;
9. obtain product-owner approval.

## 12. Coding-agent instruction

> A backlog item is not approved scope. Do not implement it merely because it appears here.
