# FAIDIA Stage 1 — Environment Contract

**Status:** READY_FOR_PRODUCT_OWNER_REVIEW  
**Version:** 0.1  
**Last updated:** 2026-07-14  
**Authority:** Part 3 technology stack and Part 8 security/testing contracts

## 1. Environment model

| Environment | Purpose | Data | External delivery |
|---|---|---|---|
| local | development and local integration | disposable synthetic | disabled/captured |
| test | automated isolated tests | generated synthetic | fake/in-memory |
| preview | pull-request review | synthetic per preview or shared non-sensitive staging with isolation | disabled/captured |
| staging | release candidate and E2E | resettable synthetic; no real applicant data | sandbox only |
| production | reserved until pilot approval | real data only after all pilot gates | approved providers only |

Never connect a local/preview build to production databases, Storage, auth or job keys. Production is not a test environment.

## 2. Configuration classes

Public build configuration may include application URL and Supabase public URL/anon key. Server-only configuration includes database URLs, service credentials, Inngest signing/event keys, Sentry secrets and future email credentials. Validate all configuration at process start with a closed schema; fail fast on missing, malformed or forbidden cross-environment values.

## 3. Required variables

Document names—not values—in `.env.example`: environment name; public app/Supabase values; pooled and direct database URLs; server Supabase service credential only where approved; Inngest keys/URLs; Sentry DSN/auth token; seed reference time/demo identity controls; email provider variables marked pre-pilot/optional for synthetic demo.

## 4. Isolation and lifecycle

Use separate Supabase projects for development/staging/production and separate Vercel environment values. Preview must not run destructive migrations automatically. Database migration identity is distinct from runtime web/worker roles. All secrets are least-privileged, environment-specific and rotated independently.

## 5. Observability

Every event/log includes environment and release, never secrets/PII. Health checks verify process and safe dependency readiness without exposing versions/credentials. Alert routing and retention must be configured before external pilot.

## 6. Decision required

`S1-DEC-046` must approve the four non-production/production boundaries and preview database strategy.

