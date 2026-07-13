# FAIDIA Stage 0 — Post-V1 Backlog

Status: **APPROVED_FOR_V1**  
Version: **1.0**  
Last updated: **2026-07-13**  
Product: **FAIDIA — Service Operations Platform**

## 1. Purpose

This backlog preserves useful ideas without allowing them to interrupt V1. Items are not promises and have no fixed release date. Promote an item only after pilot evidence shows a real problem, buyer demand, or operational need.

## 2. Promotion Rule

A backlog item becomes V1 scope only after:

1. real evidence is linked;
2. the user and problem are clear;
3. affected source-of-truth docs are identified;
4. acceptance criteria are written;
5. security/data impact is assessed;
6. dependencies are identified;
7. displaced work is named;
8. product-owner approval is recorded.

## 3. P1 Candidates After V1 Validation

### WF-001 — Conditional Workflow Rules

Problem: different request conditions need different paths.

Evidence required: repeated manual branching in pilots.

Dependencies: stable workflow model, indexed fields, versioned conditions.

### WF-002 — Parallel Work Items

Problem: multiple departments may be able to work at once.

Evidence required: a validated service suffers delay from forced sequence.

Dependencies: dependency groups and completion rules.

### DOC-001 — Public QR / Token Verification

Problem: issued-document trust may require public verification.

Evidence required: pilot or buyer demand for external document validation.

Dependencies: issued documents, opaque tokens, revocation, rate limiting.

### DOC-002 — Malware Scanning And Quarantine

Problem: sensitive production file uploads require scanning.

Evidence required: production hardening requirement.

Dependencies: scanner, quarantine state, retry, and admin review process.

### PAY-001 — M-PESA STK Push

Problem: manual payment reference may fail in live pilot.

Evidence required: payment is central and manual reference materially fails.

Dependencies: provider interface, idempotent webhook, reconciliation, support process.

### PAY-002 — PayBill Reconciliation

Problem: institution uses PayBill and allocation is painful.

Evidence required: real PayBill workflow in pilot.

Dependencies: payment provider records and reconciliation logic.

### ENT-001 — Bulk Imports

Problem: pilot setup cannot be handled efficiently through individual entry.

Evidence required: setup burden blocks pilot.

Dependencies: import validation, rollback, error reporting.

## 4. P2 Expansion Items

- visual workflow builder;
- visual form builder;
- advanced conditional form sections;
- repeating groups;
- advanced eligibility engine;
- multi-level escalation;
- electronic signatures;
- editable notification templates;
- formal correspondence;
- configurable report builder;
- scheduled reports;
- applicant-experience analytics;
- compliance/access reports;
- institution-system integration;
- service-template library.

## 5. P3 Enterprise Items

- rules-based routing recommendations;
- capacity-based assignment;
- advanced permission editor;
- enterprise SSO;
- Stripe;
- executive dashboards;
- compliance reporting suite;
- partner implementation tools.

## 6. P4 Strategic Or Speculative Items

- AI routing;
- cross-organization handoffs;
- public developer marketplace;
- omnichannel inbox;
- data warehouse;
- native applicant app;
- native officer app;
- offline workflows;
- dedicated deployment;
- full public API.

## 7. Items Explicitly Postponed From Stage 1

- transfer as required Transcript Request path;
- standalone applicant payments page;
- standalone admin payment configuration;
- public document verification;
- admin permission editor;
- visual builders;
- advanced workload;
- escalation ladders;
- custom report builder.

## 8. Coding-Agent Instruction

A backlog item is not approved scope. Do not implement it merely because it appears here.
