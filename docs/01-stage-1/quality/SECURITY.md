# FAIDIA Stage 1 — Security Contract

**Status:** READY_FOR_PRODUCT_OWNER_REVIEW  
**Version:** 0.1  
**Last updated:** 2026-07-14  
**Authority:** AC-SEC-01–11, Stage 0 role/permission matrix and Part 5/6 contracts

## 1. Security thesis

FAIDIA uses deny-by-default server authorization plus PostgreSQL and Storage RLS as defence in depth. Authentication, possession of an ID/URL, client navigation or a feature flag never grants access.

## 2. Protected assets and principal boundaries

Protected assets include personal/contact data, request responses, documents/outcomes, messages, internal notes, Finance results, workflow/assignment/handoff facts, configuration drafts and audit evidence. Principals are applicant, active organization membership/profile/department staff and explicit system worker. Organization Admin is configuration/aggregate-only and is not a sensitive-request reader.

## 3. Mandatory controls

- derive identity from verified Supabase server session;
- resolve active FAIDIA actor context server-side; never authorize from client/auth metadata claims;
- require exact grant plus organization/resource/department/ownership/handoff scope;
- use tenant-safe composite foreign keys and transaction-local RLS context with non-bypass roles;
- reauthorize every Server Action, Route Handler, job and private-object request;
- use private document/outcome buckets, opaque keys and short-lived access;
- validate all inputs with closed Zod schemas and allowlisted enums/keys;
- enforce optimistic concurrency/idempotency/transactions for consequential commands;
- make published configuration and audit/history evidence immutable;
- apply identical policy to direct reads, search, queues, counts and reports.

## 4. Web security baseline

Set secure, HttpOnly, SameSite session cookies as supported by Supabase SSR; HTTPS in hosted environments; strict allowlisted redirects; CSRF-safe same-origin Server Actions; CSP compatible with Next.js/Supabase/Vercel; `frame-ancestors 'none'` unless approved; `nosniff`; strict referrer policy; restrictive permissions policy; no secrets in `NEXT_PUBLIC_*`.

Rate limiting is required before external pilot and should protect auth, upload preparation/finalization, messaging and download-token creation. It cannot replace authorization. The synthetic internal demo must at minimum use provider protections and deterministic duplicate/idempotency controls without claiming full abuse hardening.

## 5. File controls

Allowlist PDF/JPEG/PNG and approved maximum size from configuration; verify actual object metadata during finalize; sanitize displayed filenames; never execute uploaded content; set safe download headers. Malware scanning is explicitly post-V1 and must be disclosed. Orphan cleanup may remove only unfinalized expired objects; retained evidence cannot be purged through application actions.

## 6. Secrets, logs and dependencies

Secrets live only in environment secret stores and are rotated after exposure. Logs/Sentry redact tokens, cookies, PII, messages, notes, file names/contents and raw query values. Lock dependencies, review advisories before release and do not auto-merge major upgrades.

## 7. Required negative tests

Each AC-SEC requirement has unauthenticated, wrong-owner, wrong-organization, wrong-department/profile, stale-action and direct-object/storage variants as applicable. Explicitly test applicant/internal-note isolation, Finance projection limits, Admin aggregate-only access, revoked/expired download tokens, worker RLS and immutable-row mutation denial.

## 8. External-pilot gate

Before real data: approve retention/deletion policy, DPIA/privacy notices and support access; enable email verification/recovery/abuse controls; complete threat review and dependency scan; configure rate limits, monitoring, backup/restore test and incident ownership; validate institutional file/content policy.

## 9. Decision required

`S1-DEC-043` must approve this security baseline and the explicit synthetic-demo versus external-pilot boundary.

## Row Level Security Requirement

Every tenant-owned table in the `public` schema must have PostgreSQL Row
Level Security enabled before it is exposed through the Supabase Data API.

RLS is a defence-in-depth control and does not replace application-level
authorization.

Every tenant-owned operation must also validate:

- the authenticated user;
- the active organization;
- organization membership;
- the required role or permission;
- department scope where applicable; and
- ownership of the requested record where applicable.

Tables created through Drizzle migrations must explicitly enable RLS in the
corresponding versioned migration.

No tenant-owned table may rely on RLS as its only authorization mechanism.

No unrestricted policy using `using (true)` or `with check (true)` may be
introduced for tenant-owned institutional data unless the public access is
explicitly documented and approved.