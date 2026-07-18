# FAIDIA Stage 1 — Deployment Contract

**Status:** READY_FOR_PRODUCT_OWNER_REVIEW  
**Version:** 0.1  
**Last updated:** 2026-07-14  
**Authority:** Part 3 architecture/stack, `ENVIRONMENTS.md`, `TESTING.md` and `SECURITY.md`

## 1. Thesis

Application releases and database migrations are separately controlled. A deploy never silently applies destructive schema changes or seeds production.

## 2. Pipeline

1. Install from committed lockfile using pinned Node/pnpm.
2. Validate environment schema and generated/typed database drift.
3. Run format check, lint, strict typecheck, test suites, secret/dependency checks and production build.
4. Create preview deployment for review with synthetic data boundary.
5. Apply reviewed forward-compatible migrations to staging using migration identity.
6. Run staging smoke/E2E/authorization/migration checks.
7. Obtain documented release approval.
8. Apply production migration manually/controlled, verify, then promote application.
9. Run post-deploy health, auth, authorized read and critical synthetic/safe smoke checks; observe errors/jobs.

## 3. Migration safety

Use expand/migrate/contract for incompatible change. Backward-compatible code must tolerate the migration window. No automatic schema push, production reset/seed or unreviewed RLS change. Before a high-risk migration, verify backup/PITR and an environment-tested restore/rollback plan.

## 4. Rollback

Application rollback redeploys the last known-good release only when compatible with the current schema. Database changes are normally forward-fixed; destructive rollback requires a reviewed recovery plan and verified backup. Failed jobs remain idempotently retryable and must not be duplicated by rollback.

## 5. Release evidence

Record release ID/commit, approver, migration versions/checksums, environment, test results, deployment times, smoke results, known limitations and rollback decision. Do not declare success from Vercel build alone.

## 6. External-pilot readiness

Requires production domain/TLS, approved auth/email flows, rate limiting, backup restore test, monitoring/on-call/support, retention/privacy approval, incident procedure and validated institutional process/output.

## 7. Decision required

Deployment governance is included in `S1-DEC-046`; production authorization remains a later explicit gate.

## V1 deployment flow

FAIDIA uses GitHub as the source of deployment truth and Vercel as the deployment platform.

```text
Local feature branch
        ↓
Push feature branch
        ↓
Vercel Preview deployment
        ↓
Lint, type checking, tests and build
        ↓
Pull request into staging
        ↓
Staging deployment and smoke test
        ↓
Pull request from staging into main
        ↓
Vercel Production deployment
        ↓
Production smoke test