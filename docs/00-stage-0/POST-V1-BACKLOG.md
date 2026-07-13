# FAIDIA Stage 0 — Post-V1 Backlog

Status: **APPROVED_FOR_STAGE_1**  
Version: **1.4**  
Last updated: **2026-07-13**  
Product: **FAIDIA — Service Operations Platform**

## 1. Purpose

This file records features intentionally outside the complete V1 release.

`LATER_V1` items are not post-V1 backlog items. They remain controlled by `PAGE-INVENTORY.md`.

## 2. Promotion rule

A backlog item may enter an active release only after:

1. validated customer need;
2. written scope and acceptance criteria;
3. data-model impact review;
4. permission/status/workflow review;
5. page classification update;
6. source-of-truth update;
7. explicit product-owner approval.

## 3. Priority candidates after V1 validation

### WF-001 — Conditional workflow rules

- limited condition types;
- explicit validation;
- no arbitrary code.

### WF-002 — Parallel work items

- dependency model;
- join behavior;
- timeout and cancellation rules.

### DOC-001 — Public QR/token verification

- controlled token;
- revocation;
- rate limiting;
- privacy-safe output.

### DOC-002 — Malware scanning and quarantine

- upload quarantine;
- scan result;
- controlled release;
- incident handling.

### PAY-001 — M-PESA STK Push

- provider integration;
- idempotent callbacks;
- reconciliation;
- tenant configuration.

### PAY-002 — PayBill reconciliation

- payment matching;
- exception queue;
- audit trail.

### ENT-001 — Bulk imports

- schema validation;
- dry run;
- tenant-safe import;
- rollback/error report.

## 4. Expansion items

- advanced SLA calendars;
- escalation ladders;
- capacity-based assignment;
- automatic routing;
- reusable workflow subprocesses;
- cross-organization handoffs;
- advanced executive dashboards;
- data warehouse;
- custom reports;
- WhatsApp/SMS;
- OCR;
- AI routing;
- AI document analysis;
- public API platform;
- native mobile applications.

## 5. Enterprise items

- enterprise SSO;
- SCIM/directory sync;
- dedicated tenant deployment;
- advanced retention/legal hold;
- fine-grained custom permissions;
- support access controls;
- regional data residency.

## 6. Explicitly postponed from V1

- transfer routes;
- visual form/workflow/homepage builders;
- permission editor;
- template marketplace;
- integration marketplace;
- public document verification;
- custom report builder;
- cross-organization workflows;
- native apps;
- full API platform.

## 7. Coding-agent instruction

Backlog presence is not implementation authorization. Do not create schema, routes, flags, or placeholders for these items during Stage 1.
