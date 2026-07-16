# FAIDIA Stage 1 — Testing Contract

**Status:** READY_FOR_PRODUCT_OWNER_REVIEW  
**Version:** 0.1  
**Last updated:** 2026-07-14  
**Authority:** `ACCEPTANCE-CRITERIA.md` and all controlling Stage 1 contracts

## 1. Thesis

Tests prove business invariants, denied access and recoverability—not only page rendering. Every acceptance ID must map to at least one named test before implementation approval.

## 2. Test layers

| Layer | Tool | Required scope |
|---|---|---|
| unit | Vitest | pure transitions, status mapper, conditions, metric/SLA functions, schemas |
| component | Vitest + Testing Library | forms, actions, tables, accessible states and keyboard behavior |
| database | isolated PostgreSQL/Supabase | constraints, triggers, RLS, migrations, queries, immutability |
| integration | Vitest against test services | transactions, idempotency, outbox, Storage metadata and jobs |
| authorization matrix | integration/database | every role/profile/ownership/department/tenant allow and deny |
| E2E | Playwright | complete happy, correction, Finance, decision, failure, completion/reopen journeys |

## 3. Mandatory scenario suites

1. Discovery → auth → draft → upload → submit → Student Records review → Finance referral/result → Records completion → Registrar approval → outcome → each approved completion method.
2. Correction and replacement, including rejected-document access and safe applicant status.
3. Finance `CLEAR`, `HOLD`, `CANNOT_VERIFY`, decline, clarification and cancellation boundaries.
4. Registrar approve, reject and clarification; ordinary Officer denial.
5. Outcome generation failure/retry; controlled download retrieval failure; token retry/idempotency; physical collection; manual closure.
6. Reopen rejected/completed, outcome revocation and expiry while preserving history.
7. Notification failure, job retry, stale commands, duplicate submissions and concurrent transitions.
8. Responsive applicant paths, keyboard operation, focus order, semantic status and empty/error/denied/stale states.

## 4. Isolation matrix

Fixtures require two organizations, two applicants, Records/Finance departments, ordinary Officers, Supervisor/Registrar and Organization Admin. For every resource class test self/authorized, wrong applicant, wrong organization, wrong department, inactive membership, missing permission and Admin-sensitive-denial. Test both application query/action and direct RLS/Storage paths.

## 5. Determinism

Inject clock, UUID/idempotency and job dispatcher. Tests must not depend on wall-clock sleep, network email, production services or test order. Each database suite creates/reset its isolated schema/project and seeds versioned fixtures repeatably.

## 6. CI gates

Required on pull requests: formatting check, lint, strict typecheck, unit/component/database/integration tests, migration-from-zero, dependency/secret scan and production build. Required before staging approval: Playwright critical journeys and accessibility checks. Flaky tests are failures; quarantine requires an owner, reason, issue and expiry and cannot cover a critical acceptance path.

## 7. Coverage rule

No numeric coverage percentage substitutes for traceability. All AC IDs, named commands, transition edges, permissions, RLS policy families and required events need positive and negative tests. Generated coverage may identify gaps but is not the release decision alone.

## 8. Acceptance-to-test mapping

Use stable test IDs `T-[acceptance-id]-[variant]`, for example `T-AC-SEC-03-CROSS-ORG-DENY`. The following establishes the required owner layer; implementation adds exact file paths/results without renaming the acceptance relationship.

| Acceptance range | Primary test layers | Mandatory variants |
|---|---|---|
| AC-PRE-01–12 | seed inspection, database, integration | publication/fixture integrity; wrong version denied |
| AC-DIS-01–06 | integration, E2E | published/disabled organization/service; responsive empty/error |
| AC-AUT-01–07 | integration, authorization, E2E | unauthenticated, safe redirect, ownership |
| AC-SUB-01–15 | unit, database, integration, E2E | validation, file, duplicate race/override, atomic rollback |
| AC-REV-01–07 | authorization, integration, E2E | department/assignment/claim, internal-note concealment |
| AC-COR-01–08 | unit, integration, E2E | unlock allowlist, replacement, stale/double resubmit |
| AC-FIN-01–15 | authorization, integration, E2E | each result/decline/clarification/cancel, ownership retained |
| AC-REG-01–13 | authorization, integration, E2E | Registrar allow, ordinary Officer deny, prerequisites/stale |
| AC-OUT-01–08 | integration, job, Storage, E2E | generation fail/retry/checksum/private access |
| AC-CMP-01–15 | integration, authorization, E2E | three completion methods, token retry, reopen/revoke/expiry |
| AC-NOT-01–05 | integration, authorization, E2E | all keys, recipient isolation, dispatch failure/dedup |
| AC-AUD-01–06 | database, integration, authorization | all events, no misleading success, immutable/safe projection |
| AC-REP-01–05 | unit/query, authorization, E2E | exact denominators, incomplete/empty, Admin privacy |
| AC-SEC-01–11 | authorization, database/Storage | every principal/resource cross-boundary and immutable denial |
| AC-SCP-01–07 | inspection, component, accessibility, E2E | inventory exclusions, all page states, keyboard/responsive |

## 9. Decision required

`S1-DEC-044` must approve this test pyramid, isolation matrix and CI gate.
