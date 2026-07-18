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

## Deployment environments

FAIDIA uses five controlled execution contexts.

| Environment | Git source | Hosting/runtime | Purpose | Data policy |
|---|---|---|---|---|
| Local | Any local branch | Developer machine | Active development and debugging | Synthetic or development-only data |
| Test | Test runner | Local or CI | Automated unit, component and integration tests | Isolated test data; external side effects mocked |
| Preview | Any non-production feature branch | Vercel Preview | Review one proposed change before integration | Preview-only services and non-sensitive data |
| Staging | `staging` | Vercel branch Preview or custom Staging environment | Persistent pre-production verification | Staging-only database, auth, storage and provider credentials |
| Production | `main` | Vercel Production | Live approved application | Production-only services and authorized data |

### Environment isolation rule

Local, Test, Preview, Staging and Production must not share mutable operational resources.

As each provider is configured, every environment must receive separate:

- PostgreSQL database or schema target;
- Supabase authentication configuration;
- Supabase Storage buckets;
- Inngest environment;
- email configuration;
- Sentry environment;
- payment credentials;
- service secrets and environment variables.

Production credentials must never be placed in Local, Test, Preview or Staging.

### Initial environment label

The server-only `APP_ENV` variable uses:

- `development`
- `test`
- `preview`
- `staging`
- `production`

`NODE_ENV` is controlled by Next.js and the runtime and must not be manually redefined.

### Secret handling

- `.env.local` and other real environment files are not committed.
- `.env.example` contains variable names and safe examples only.
- Secrets must not use the `NEXT_PUBLIC_` prefix.
- Vercel environment changes require a new deployment.
- Fake credentials must not be created merely to pass validation.