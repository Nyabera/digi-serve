# FAIDIA Stage 1 — Definition of Done

**Status:** READY_FOR_PRODUCT_OWNER_REVIEW  
**Version:** 0.1  
**Last updated:** 2026-07-14  
**Authority:** Approved Stage 0, `ACCEPTANCE-CRITERIA.md`, and the Stage 1 Documentation Gate

## 1. Three distinct gates

### Documentation complete

- every required Stage 1 Markdown file exists, has authority/status/version metadata and no unresolved contradiction;
- every acceptance ID maps to design, implementation owner and test;
- every proposed implementation-controlling decision is approved or corrected;
- Part 11 audit passes and documents are explicitly marked coding source of truth.

### Implementation complete

- only `STAGE_1_REQUIRED` behavior is built, using approved contracts;
- migrations recreate the database and RLS/Storage policies pass isolation tests;
- all named commands, routes, states, events, metrics and failure paths work with real persisted data;
- formatting, lint, strict typecheck, build and all required tests pass;
- accessibility/responsive/security requirements pass;
- staging deployment and complete vertical-slice evidence are approved.

### External-pilot ready

Implementation completion plus all pre-pilot items in Security, Deployment, Pilot and Validation documents: real process/fee/SLA/output/authority validation; email verification/recovery/delivery; privacy/retention/support/security/backup/monitoring approval; trained supported users and rollback/incident ownership.

## 2. Absolute blockers

Any failed acceptance ID, unresolved contradiction, proposed controlling decision, tenant/ownership leak, missing immutable audit evidence, destructive migration uncertainty, fabricated report data, inaccessible critical path or unapproved scope expansion blocks “done.” A waived item must be outside Stage 1 acceptance and recorded as a dated limitation/decision; critical security or data-integrity requirements cannot be waived by changelog text.

## 3. Current state

The Documentation Gate is **not passed**. Parts 3, 4 and 6 remain unapproved; Part 4 is under product-owner edit; decisions S1-DEC-006 through S1-DEC-046 include proposed items. Therefore no application implementation authorization is implied by Parts 7–11 drafts.

## 4. Decision required

`S1-DEC-047` must approve these three separate gates and blocker rule.

