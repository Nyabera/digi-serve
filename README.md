# FAIDIA

**Product:** Service Operations Platform  
**Current build target:** Stage 1 Transcript Request vertical slice  
**Current documentation gate:** Parts 1–6 and S1-DEC-001–048 approved; Parts 7–10 require final review; final audit pending  
**Canonical authority:** `docs/SOURCE-OF-TRUTH.md`

FAIDIA helps institutions run service requests, reviews, corrections, departmental referrals, approvals, issued outcomes, tracking, notifications, audit history, and operational reporting in one system.

## What is being built first

The first working slice is a Transcript Request for the synthetic demo organization Savannah Technical College.

It must prove that an applicant can discover the service, register, submit a request and documents, respond to a correction, pass a Finance referral, receive a Registrar decision, obtain an outcome, and complete the request while FAIDIA preserves permissions, status history, audit events, notifications, and reporting timestamps.

Stage 1 is not the complete FAIDIA V1 platform. Build only items classified `STAGE_1_REQUIRED` in `docs/00-stage-0/PAGE-INVENTORY.md`.

## Beginner reading order

Read these files in this order before changing code or documentation:

1. `docs/SOURCE-OF-TRUTH.md` — tells you which documents win when information conflicts.
2. `docs/01-stage-1/STAGE-1-PLAN.md` — explains the documentation work and its order.
3. `docs/01-stage-1/ACCEPTANCE-CRITERIA.md` — states exactly what the first build must prove.
4. `docs/01-stage-1/STAGE-1-TRACEABILITY.md` — connects acceptance requirements to approved Stage 0 sources and future implementation documents.
5. `docs/01-stage-1/architecture/ARCHITECTURE.md` — explains the major technical boundaries.
6. `docs/01-stage-1/architecture/TECH-STACK.md` — records the selected tools and exclusions.
7. `docs/01-stage-1/architecture/PROJECT-STRUCTURE.md` — assigns code to folders.
8. `docs/01-stage-1/architecture/ROUTES.md` — maps every Stage 1 product route.
9. `docs/01-stage-1/interface/DESIGN-SYSTEM.md` — defines the approved visual language proposed for Stage 1.
10. `docs/01-stage-1/interface/COMPONENTS.md` — defines the reusable UI building blocks and their security boundaries.
11. `docs/01-stage-1/domain/DOMAIN-MODEL.md` — introduces the business aggregates and invariants.
12. `docs/01-stage-1/domain/` remaining files — define tenancy, auth, roles, permissions, statuses, services, forms, workflows, Finance handoffs and private documents.
13. `docs/01-stage-1/data/DATABASE.md` — defines database, RLS, constraints, migrations and evidence rules.
14. `docs/01-stage-1/data/DATA-DICTIONARY.md` — defines proposed enums, tables and columns.
15. `docs/01-stage-1/operations/` — defines notifications, SLA, audit, reporting, analytics, flags, commands and errors.
16. `docs/01-stage-1/quality/` and `delivery/` — define security, tests, seed, environments, deployment and done gates.
17. `docs/01-stage-1/governance/AI-DEVELOPMENT-RULES.md` — constrains coding-agent behavior.
18. `docs/01-stage-1/STAGE-1-CONTRADICTION-AUDIT.md` — records the current final-gate blockers.
19. The controlling Stage 0 document named by the traceability file.

## Non-negotiable rules

- Do not invent roles, permissions, statuses, routes, workflow branches, or completion methods.
- Do not implement `LATER_V1`, `DEMO_ONLY`, or `POSTPONED` work unless it is explicitly promoted in approved Markdown first.
- Supervisors use the shared Officer processing shell.
- Registrar decisions are embedded in `/officer/requests/[id]`.
- Do not create `/officer/requests/[id]/approval`.
- Student Records remains the coordinating owner during a Finance referral.
- Finance must record `CLEAR` before approval.
- Organization Admin cannot access sensitive request content.
- Published configuration versions are immutable; requests remain pinned to exact versions.
- Completion occurs only through controlled download, recorded physical collection, or authorized Supervisor manual closure.
- Recharts is the approved charting library. Do not introduce Chart.js.
- When a planned change conflicts with approved Markdown, update and approve the controlling documentation before writing code.

## Current project status

| Area | Status |
|---|---|
| Stage 0 product specification | Approved |
| Stage 1 Part 1 — documentation control | Approved |
| Stage 1 Part 2 — acceptance contract | Approved |
| Stage 1 Part 3 — architecture, stack, structure and routes | Approved |
| Stage 1 Part 4 — design system and components | Approved |
| Stage 1 Part 5 — domain and workflow implementation contracts | Approved |
| Stage 1 Part 6 — database and data dictionary | Approved |
| Stage 1 Part 7 — operations, APIs and errors | Ready for product-owner review |
| Stage 1 Part 8 — assurance and delivery | Ready for product-owner review |
| Stage 1 Part 9 — coding-agent governance | Ready for product-owner review |
| Stage 1 Part 10 — pilot, validation and change records | Ready for product-owner review |
| Stage 1 Part 11 — contradiction/traceability audit | Consistency complete; final gate pending Parts 7–10 approval |
| Application code | Not started |

## What the product owner does next

Parts 1–6 and S1-DEC-001 through S1-DEC-048 are approved. Parts 7–10 remain review drafts. Approve or correct those documents, then rerun `STAGE-1-CONTRADICTION-AUDIT.md` before the Documentation Gate can pass. Application code and migrations remain blocked until that final gate passes.
