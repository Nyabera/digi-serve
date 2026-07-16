# FAIDIA Stage 1 — Database Contract

**Status:** READY_FOR_PRODUCT_OWNER_REVIEW  
**Version:** 0.1  
**Last updated:** 2026-07-14  
**Product:** FAIDIA — Service Operations Platform  
**Authority:** approved Stage 0 documents, `docs/01-stage-1/architecture/ARCHITECTURE.md`, `TECH-STACK.md`, approved Part 5 documents, and `docs/01-stage-1/ACCEPTANCE-CRITERIA.md`

## 1. Purpose

This document defines the physical PostgreSQL design rules, table families, database roles, constraints, indexing, transactions, immutability and RLS strategy for the Stage 1 Transcript Request slice. `DATA-DICTIONARY.md` defines the exact columns.

For a beginner: this file describes how the database must protect the product rules even when two users act at once or application code makes a scoping mistake.

## 2. Approval boundary

Part 5 documents are approved for documentation sequencing, but `S1-DEC-018` through `S1-DEC-028` remain proposed. This Part 6 design depends on those pending choices and is therefore provisional until they are approved or corrected.

No table or migration may be implemented from this review version.

## 3. Database thesis

Use one Supabase PostgreSQL database with a shared `public` application schema. Model organization-owned operational data relationally and carry `organization_id` on every tenant-owned table. Use JSONB only for immutable form snapshots, safe structured event/notification payloads and limited non-critical metadata. Enforce important identity, tenant, state, immutability and retry rules with database constraints in addition to application authorization.

## 4. Technology and migration ownership

- PostgreSQL on Supabase is the system of record.
- Drizzle defines TypeScript schema and typed queries.
- Reviewed SQL migrations live under `supabase/migrations/` and are the deployment authority, including enums, functions, triggers, indexes, grants, RLS and Storage policies.
- Drizzle-generated SQL may be used as a starting point but must be reviewed and amended before commit.
- No manual production schema changes.
- Migration filenames use UTC timestamp plus description, for example `20260714153000_create_request_core.sql`.
- Migrations are forward-only in deployed environments; a corrective migration reverses a bad change.

## 5. Naming and type conventions

| Concern | Rule |
|---|---|
| Names | `snake_case`; plural table names; singular enum/type names |
| Primary IDs | UUID with `gen_random_uuid()` unless identity comes from `auth.users` |
| Auth link | `user_profiles.id` equals `auth.users.id` UUID |
| Time | `timestamptz` stored in UTC; render in organization time zone |
| Business date | `date` only when time of day has no meaning |
| Optimistic concurrency | `record_version bigint NOT NULL DEFAULT 1`, incremented on mutable aggregate updates |
| Money | no payment amount/provider model in Stage 1 |
| Free text | `text` plus application/DB length check where approved |
| Case-insensitive search | normalized companion value/index, never `lower()` scans over unrestricted PII |
| JSON | `jsonb`, schema-validated by application, never used for statuses, joins, ownership or primary queue filters |
| Soft lifecycle | explicit `status`, `is_active`, `retired_at` or `archived_at`; no generic `deleted_at` on evidence |

Enable only required extensions: `pgcrypto` for UUID/digest support if not already supplied. Do not add an extension without a migration justification.

## 6. PostgreSQL enum/check strategy

Use PostgreSQL enums for frozen, shared operational values:

- fixed role/profile keys;
- request, work-item, handoff, document, decision, SLA and notification statuses;
- Finance result code;
- version status;
- delivery/completion method;
- workflow step key;
- correction/decision/document-review types where fixed.

Use constrained text for identifiers intended to evolve independently, such as audit event type and notification template key, with application registry validation and tests. Never accept tenant-authored enum values.

Enum migrations may add approved values but may not rename/reinterpret an existing value silently.

## 7. Table families

### 7.1 Organization and identity

- `organizations`
- `organization_branding`
- `departments`
- `user_profiles`
- `applicant_profiles`
- `organization_memberships`
- `membership_departments`
- `membership_profiles`

No role-permission editor tables are created. The approved grant registry remains code-backed.

### 7.2 Versioned configuration

- `services`
- `service_versions`
- `form_definitions`
- `form_versions`
- `form_fields`
- `requirement_sets`
- `requirement_versions`
- `document_requirements`
- `workflow_definitions`
- `workflow_versions`
- `workflow_steps`
- `service_publications`

No generic conditions, transition scripts, dependencies, parallel groups, payment rules or marketplace tables.

### 7.3 Request processing

- `requests`
- `request_draft_answers`
- `duplicate_request_overrides`
- `request_response_snapshots`
- `request_status_history`
- `workflow_instances`
- `work_items`
- `work_item_assignments`
- `corrections`
- `correction_fields`
- `correction_documents`
- `request_decisions`
- `request_reopenings`
- `request_completions`

### 7.4 Finance handoff

- `handoffs`
- `handoff_documents`
- `handoff_status_history`
- `finance_results`

No transfer/consultation/escalation route tables.

### 7.5 Documents and outcomes

- `documents`
- `document_versions`
- `document_status_history`
- `document_reviews`
- `issued_outcomes`
- `outcome_generation_attempts`
- `outcome_download_tokens`
- `outcome_downloads`
- `physical_collections`
- `manual_closures`
- `outcome_revocations`

### 7.6 Communication and evidence

- `applicant_messages`
- `internal_notes`
- `notifications`
- `audit_events`
- `outbox_events`
- `sla_instances`

Part 7 finalizes notification templates/delivery, event payloads, SLA computation and reporting projections without changing tenant ownership.

## 8. Organization isolation

Every tenant-owned table has `organization_id NOT NULL`, even when the organization can be reached through a parent. This supports RLS, indexes and audit inspection.

Where a child also references a parent, use composite tenant-safe foreign keys:

```sql
UNIQUE (organization_id, id)
FOREIGN KEY (organization_id, request_id)
  REFERENCES requests (organization_id, id)
```

Apply the same pattern to request/document/handoff/work/outcome relationships. A child cannot link to a parent from another organization.

Global `user_profiles` is the only ordinary application table without `organization_id`; organization access always goes through applicant ownership or membership.

## 9. Database roles and connection safety

Use separate responsibilities:

| Role | Purpose | Rules |
|---|---|---|
| migration owner | migrations only | owns objects; not used for web requests |
| `faidia_app` | authenticated/public application queries | `NO BYPASSRLS`; least grants; transaction-local actor context |
| `faidia_worker` | approved background jobs | `NO BYPASSRLS`; explicit system/resource context; least grants |
| Supabase service/migration credentials | narrowly controlled admin operations | never exposed to browser; never used to skip user-command authorization |

Production application code must not connect as object owner or a role with `BYPASSRLS`.

## 10. Transaction-local actor context

Drizzle direct PostgreSQL work must run through a transaction wrapper that sets verified server-derived context using `set_config(..., true)`:

```text
app.user_id
app.organization_id
app.membership_id
app.actor_kind
app.correlation_id
```

Rules:

- values come from verified Supabase identity and FAIDIA records, never raw browser claims;
- settings are transaction-local and cleared automatically;
- every protected query executes inside the wrapper;
- public catalogue queries use a restricted public context/policy;
- worker context identifies the persisted job/event and organization;
- application authorization still runs before mutations; RLS is defence in depth.

## 11. RLS policy model

Enable and force RLS on tenant-owned application tables where compatible with migration ownership.

Policy families:

1. **Public published configuration** — read only active organization/current publication and public-safe published version rows.
2. **Applicant self** — `auth/user context` matches applicant profile plus organization/request ownership.
3. **Staff membership** — active organization membership and department scope.
4. **Assigned/department work** — membership plus work assignment/claim/department.
5. **Active Finance handoff** — receiving Finance membership plus explicit handoff/document relation.
6. **Organization metadata** — Organization Admin gets configuration/aggregate rows only, not sensitive request tables.
7. **Worker** — exact organization/resource/event scope for approved job handlers.

Prefer policy helper functions that are `STABLE`, schema-qualified and do not recursively query the protected table. Search/list/count policies match direct-record policies.

## 12. Storage policy model

Private buckets:

- `request-documents`;
- `issued-outcomes`.

Object keys use opaque organization/request/document/outcome IDs defined in `DOCUMENTS.md`. Storage policies validate tenant/resource ownership. Upload intents and download tokens are authorized server-side; no public bucket or durable public URL exists.

Organization logos use a separate `branding-assets` bucket containing public-safe branding files only. Reads may be public; writes require exact branding permission, server validation and organization-key scoping. Applicant evidence/outcomes must never enter this bucket.

## 13. Versioned configuration constraints

- Each definition/version belongs to one organization/service chain.
- Version numbers are unique within the definition.
- Only `DRAFT` versions may be edited.
- Publication moves a compatible complete bundle to `PUBLISHED` and records one current publication pointer transactionally.
- Database triggers prevent UPDATE/DELETE of published/retired versions and their child fields/requirements/steps, except the one permitted `DRAFT -> PUBLISHED` or approved retirement transition.
- Requests store non-null exact service/form/requirement/workflow version IDs.
- Composite foreign keys prove all pins belong to the request organization/service bundle.

## 14. Request and duplicate constraints

- Request reference is unique within organization when non-null.
- Draft may have no reference; successful submit assigns it once.
- Applicant/request/service/version pins are non-null from draft creation.
- `current_status`, coordinating department and record version are relational columns.
- Important queue/search fields are relational/indexed; the complete response remains immutable JSONB snapshot.
- Duplicate-active checking is serialized in the submission transaction using a deterministic PostgreSQL transaction advisory lock for `(organization, applicant, service)`, then an active-request query.
- An authorized override requires a committed `duplicate_request_overrides` row linked to the new request/submission attempt.

A partial unique index cannot enforce the rule because an approved override intentionally permits a duplicate.

## 15. Workflow and state constraints

- One active workflow instance per request.
- Work items belong to the request's pinned workflow version/step and organization.
- Assignment history is append-only; current assignee is denormalized on `work_items` for queue performance and reconciled in the same transaction.
- Request status is changed only by named application commands; each successful change appends `request_status_history` in the same transaction.
- The database rejects impossible enum/tenant/reference shapes; application/domain rules enforce the full transition prerequisites.
- No generic database procedure accepts arbitrary “next status.”

## 16. Handoff constraints

- Stage 1 handoff type/route is fixed Student Records → Finance referral.
- Parent request coordinating department is not changed by handoff.
- Handoff relevant documents require explicit junction rows.
- Finance result rows are immutable and use the exact result enum.
- Only one current non-terminal result cycle is active per handoff.
- `CANNOT_VERIFY` clarification preserves/resubmits the handoff; decline/recheck rules create new records as defined in Part 5.

## 17. Document/outcome constraints

- Database stores only private object bucket/key, never public URL.
- File version belongs to one document; replacement uses an explicit predecessor relation.
- Document/status/review history is append-only.
- One request may have multiple outcome attempts/versions, but only an exact current issued outcome is downloadable.
- Download tokens store a cryptographic hash, never the bearer token; include applicant/outcome/purpose/expiry.
- Unique token identity makes retry idempotent.
- First successful download from `OUTCOME_READY` writes `outcome_downloads`, `request_completions` and status history atomically; later downloads do not duplicate completion.
- Physical collection/manual closure each link to exactly one completion record and store their required evidence.
- Reopen does not delete completion/outcome; revocation is a separate immutable record/status transition.

## 18. Immutability and append-only evidence

Database grants/triggers deny UPDATE/DELETE for:

- audit events;
- request response snapshots;
- status histories;
- assignment history, except setting its `ended_at` once when superseded;
- correction/resubmission history once recorded;
- handoff history and Finance results;
- Registrar decisions;
- completed issue/download/collection/closure/reopen/revocation records;
- published configuration.

Where an evidence record needs correction, append a superseding/correction record with reason; never rewrite history.

## 19. Audit and outbox transaction rule

Every critical application transaction writes:

- business state;
- status/work history;
- required audit event;
- metric timestamp/fact;
- notification row when applicable;
- outbox event when asynchronous work follows.

Outbox delivery state is mutable; its immutable business event identity/payload is not rewritten. Failed/denied/rolled-back actions write no success event.

## 20. Index strategy

Every tenant-owned operational index begins with `organization_id` unless a global uniqueness/maintenance use is explicitly justified.

Required index families:

- organizations by unique slug;
- memberships by user/status and organization/role/status;
- departments by organization/name/active;
- service current publication and version uniqueness;
- requests by applicant/status, coordinating department/status, assigned membership/status, reference and created/submitted time;
- work items by department/status/due and assignee/status/due;
- handoffs by receiving department/status/due and parent request/time;
- documents by request/requirement/status and outcome/request/status;
- messages/notes/timeline by request/time;
- notifications by recipient/read/time;
- audit events by request/time, actor/time and event/time;
- outbox by delivery state/available time;
- SLA by department/state/due.

Use partial indexes for active queues and pending outbox/notifications. Do not index raw response JSONB or high-risk identity fields without a demonstrated query and privacy review.

## 21. Search and reporting

Stage 1 operational search uses indexed request reference, permitted normalized applicant name/student number and service/status fields only within authorized scope.

Reporting derives from explicit timestamps/status/history/work/handoff/completion facts. Do not calculate approved metrics from audit text, notification payloads or mutable `updated_at`.

Part 7 may define views/materialized projections, but they must preserve RLS and Organization Admin's aggregate-only boundary.

## 22. Time and organization locale

- Persist instants in UTC `timestamptz`.
- `organizations.time_zone` stores an IANA name; Savannah seed uses `Africa/Nairobi`.
- Deadlines are computed from an explicit policy and stored as instants.
- Display/report in organization time zone and label it.
- Never store local wall-clock text as the authoritative time.

## 23. Deletion and retention

- No cascade from organization/request to immutable operational evidence in ordinary application use.
- Stage 1 application exposes no hard-delete request/document/audit action.
- Uploaded replacement bytes/history remain protected.
- Abandoned upload intents/orphan objects may be safely cleaned only after metadata cross-check and a documented retention period.
- Retention/legal-hold/anonymization policy must be finalized in `SECURITY.md`; do not invent destructive scheduled deletion before then.
- Synthetic demo reset is an explicit environment-only script, never a production route.

## 24. Backup and recovery expectations

Deployment documentation must enable managed backups appropriate to environment and test restoration before external pilot. Migrations and seeds are version-controlled; storage/object recovery and database point-in-time capabilities are documented separately in `DEPLOYMENT.md`.

## 25. Migration sequence

Recommended dependency order:

1. extensions, enums and helper functions;
2. organization, identity, membership and departments;
3. service/form/requirement/workflow configuration;
4. requests, snapshots, history and workflow runtime;
5. handoffs and Finance results;
6. documents/outcomes/completion evidence;
7. messages, notes, notifications, audit, outbox and SLA;
8. indexes, immutability triggers, RLS/grants and Storage policies;
9. synthetic seed data and verification assertions.

Each migration is tested from empty database and from the previous committed schema.

## 26. Verification checklist

- [ ] Every tenant table has organization ownership and tenant-safe foreign keys.
- [ ] Application/worker roles are non-owner and `NO BYPASSRLS`.
- [ ] All protected Drizzle work uses verified transaction-local actor context.
- [ ] Applicant, department, handoff and admin RLS denial tests pass.
- [ ] Published versions and evidence records are immutable in the database.
- [ ] Requests pin a compatible exact version bundle.
- [ ] Duplicate submit/check is concurrency-safe and override-audited.
- [ ] Queue/search/report indexes use relational fields and tenant prefixes.
- [ ] Private Storage policies and opaque object keys pass isolation tests.
- [ ] First download/collection/manual closure creates exactly one completion.
- [ ] Migrations run cleanly and no production manual DDL is required.

## 27. Explicit non-goals

- Separate database per tenant.
- Microservice databases or event sourcing.
- Generic form/workflow/permission builder tables.
- Payment, M-PESA, integration, marketplace or public-verification tables.
- Parallel workflow/dependency/transfer models.
- Data warehouse/custom reporting schema.
- Malware-scanning/quarantine schema.
- Destructive retention behavior before policy approval.

## 28. Open questions

- `P6-OQ-DB-001` — Confirm the exact Supabase production connection role/grant mechanism for `faidia_app`/`faidia_worker` during environment setup; it must remain `NO BYPASSRLS`.
- `P6-OQ-DB-002` — Finalize file retention, orphan-upload cleanup and backup/restore targets in Parts 8/10 before external pilot.
- `P6-OQ-DB-003` — Finalize normalized search fields and their privacy-safe indexes during seed/security review; global search remains out of Stage 1.

## 29. Change rule

Adding a table/column that represents a new role, permission, route, status, workflow branch, handoff type, document class, completion method or tenant access path requires the relevant higher-authority approval first. Physical refinements that preserve contracts require a migration and data-dictionary update.

## 30. Coding-agent instruction

Do not generate migrations from this review version. After approval, implement tables in dependency order, apply tenant-safe foreign keys/RLS in the same reviewed migration series, and fail closed when actor context is absent.
