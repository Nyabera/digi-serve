# FAIDIA Stage 1 — Seed Data Contract

**Status:** READY_FOR_PRODUCT_OWNER_REVIEW  
**Version:** 0.1  
**Last updated:** 2026-07-14  
**Authority:** Stage 0 specification, Part 5 registries, Part 6 dictionary and `SLA.md`

## 1. Thesis

Seed data creates a deterministic synthetic demonstration and automated-test baseline. It contains no real personal or institutional records and does not silently define external-pilot policy.

## 2. Required configuration seed

- Savannah Technical College synthetic organization, Nairobi timezone and clearly synthetic branding assets;
- Student Records, Finance and Registrar departments/profiles exactly as Stage 0 defines;
- one Organization Admin, Supervisor/Registrar, Records Officers, Finance Officers and synthetic applicants with fixed non-production identities;
- published Transcript Request service, service/form/requirement/workflow versions and one atomic publication bundle;
- approved fields, document requirements, eight logical workflow steps and fixed command signature;
- simplified Clearance Request and Certificate Replacement demo services, never dependencies of Transcript acceptance;
- the closed Stage 1 feature-flag values and synthetic SLA targets.

## 3. Scenario fixtures

Provide clearly named fixtures for: draft; submitted/unassigned; in Records review; correction requested; correction resubmitted; Finance pending acceptance; Finance active; Finance HOLD; pending Registrar approval; rejected; outcome generation failed; outcome ready; completed by download; completed by collection; manually closed; reopened; expired; overdue. Include a second organization exclusively for isolation tests.

Every fixture must be internally coherent: pinned published versions, status history, work items, assignments, handoff history, documents, notifications, audit events, timestamps and SLA instances agree. Do not create transfer, public verification, payment amount/provider or broad builder records.

## 4. Repeatability and credentials

Seed is idempotent by stable natural keys in development/test and runs only under an explicit seed command. Reset/seed is forbidden in production. Demo passwords are supplied through local/test environment configuration, never committed or reused externally. Generated documents carry a conspicuous synthetic watermark.

## 5. Time model

Scenario timestamps are relative to an injected seed reference instant so due/overdue states remain deterministic. Store UTC; organization display is Africa/Nairobi. Tests may freeze time to the same instant.

## 6. Verification

After seeding, assert row counts/keys, publication compatibility, no real-looking domains/IDs, full referential integrity, expected route access per role, RLS cross-tenant denial and fixture status/event coherence.

## 7. Decision required

`S1-DEC-045` must approve the synthetic identities/fixtures and SLA values before seed implementation.

