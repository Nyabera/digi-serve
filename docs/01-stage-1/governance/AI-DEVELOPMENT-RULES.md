# FAIDIA Stage 1 — Coding-Agent Governance

**Status:** READY_FOR_PRODUCT_OWNER_REVIEW  
**Version:** 0.1  
**Last updated:** 2026-07-14  
**Authority:** Approved Stage 0, approved Stage 1 decisions and the Documentation Gate

## 1. Core rule

A coding agent implements approved contracts; it does not invent product policy. When two controlling documents conflict, stop, cite both exact passages and request a recorded decision. Do not “choose the sensible one” silently.

## 2. Read order

1. `docs/SOURCE-OF-TRUTH.md` and approved Stage 0 authorities.
2. `docs/01-stage-1/ACCEPTANCE-CRITERIA.md`.
3. Approved Stage 1 decision log and traceability register.
4. Approved architecture/data/domain/operations/security/testing/delivery contracts relevant to the task.
5. Visual references only after scope and interface contracts.

A `PROPOSED` decision or review draft is context, not implementation authority.

## 3. Before changing code

- identify acceptance IDs and exact approved command/route/resource;
- confirm every controlling document is approved and no open decision controls the change;
- inspect the existing implementation/tests/migrations; preserve unrelated user changes;
- state assumptions and stop if an assumption changes scope, role, permission, status, workflow, completion, data retention or public exposure;
- define positive, denied, stale/concurrent and failure tests before implementation.

## 4. Non-negotiable boundaries

- one modular full-stack app; no invented microservice/internal REST layer;
- pages/components contain no transaction or authorization policy;
- derive actor/tenant/grants server-side; client state is never authority;
- named commands only; no generic status/workflow mutation;
- critical changes are transactional, version-checked and idempotent;
- organization/department/ownership/handoff filtering applies to reads, writes, files, search and aggregates;
- published configuration and evidence are immutable;
- use private Storage and approved controlled-download path;
- use only approved dependencies and Recharts; no second UI/table/chart/workflow library;
- do not build `LATER_V1`, `DEMO_ONLY` dependencies or `POSTPONED` scope.

## 5. Database and migrations

Use typed Drizzle schema plus reviewed SQL migrations under the approved location. Never use automatic production schema push. Every migration declares purpose, data impact, RLS/grants impact, compatibility, rollback/forward-fix and tests. Never edit an already-applied migration; add a new migration. Do not bypass RLS in application/worker code.

## 6. Security and privacy

Validate closed input schemas, conceal unauthorized existence, redact logs/errors, never expose service credentials or raw private URLs, and add negative authorization tests for every resource. Synthetic data only until external-pilot authorization.

## 7. Change discipline

Make the smallest coherent change. Update code, tests, traceability, affected contracts and changelog together. Do not mass-format unrelated files, delete user work, weaken tests or mark an item approved. Only the product owner approves product/document decisions; only the release authority approves deployment/pilot gates.

## 8. Verification before handoff

Report changed files, acceptance IDs, commands run/results, migrations, security/tenancy impact, screenshots/evidence where relevant, limitations and pending decisions. “Build passed” is insufficient if authorization/E2E/migration/acceptance evidence is missing.

## 9. Forbidden shortcuts

No fake dashboard totals, hard-coded permission success, client-only validation, direct multi-table page writes, public document bucket, permanent signed URL, mutable audit/history, broad admin request access, swallowed errors, arbitrary JSON workflow logic, skipped denied tests or scope inferred from mockups.

## 10. Decision required

`S1-DEC-048` must approve this coding-agent governance contract before implementation begins.

