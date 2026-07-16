# FAIDIA Stage 1 — Tenancy Contract

**Status:** READY_FOR_PRODUCT_OWNER_REVIEW  
**Version:** 0.1  
**Last updated:** 2026-07-14  
**Product:** FAIDIA — Service Operations Platform  
**Authority:** `docs/00-stage-0/ROLE-PERMISSIONS-MATRIX.md`, `docs/01-stage-1/architecture/ARCHITECTURE.md`, and AC-SEC-01–06

## 1. Purpose

This document defines organization, department, membership and resource isolation for Stage 1.

For a beginner: tenancy prevents one institution, department or person from seeing another's data simply by changing a URL or identifier.

## 2. Tenant thesis

The organization is the primary tenant boundary. Department, applicant ownership, assignment and active handoff narrow access inside that tenant. Supabase Auth establishes identity; server authorization and PostgreSQL/Storage RLS independently enforce the resource boundary.

## 3. Tenant identities

| Context | Trusted source |
|---|---|
| Public organization | validated organization slug resolved server-side to one active organization |
| Applicant | authenticated identity plus owned applicant profile/request organization |
| Staff | authenticated identity plus one active organization membership and department/profile scope |
| Organization Admin | authenticated identity plus active admin membership; metadata/configuration scope only |
| Background job | persisted organization/resource identifiers from an authenticated committed event, revalidated by job handler |

A client-supplied `organization_id`, department, role, profile, owner or assignee is never trusted by itself.

## 4. Organization context resolution

1. Public routes resolve `{organizationSlug}` to an active organization and expose only published public configuration.
2. Applicant routes resolve the authenticated applicant and then scope resources by both applicant ID and organization ID.
3. Staff/admin routes resolve active memberships server-side.
4. Stage 1 seeds one relevant staff organization context. `/select-organization` remains `LATER_V1`; do not build an organization switcher.
5. A missing/inactive context denies access and clears any stale context cookie/session hint.

If a future multi-membership context is introduced, it requires the approved selection route and must be selected only from server-resolved active memberships.

## 5. Ownership propagation

Every organization-owned business record must either:

- store `organization_id`; or
- inherit it through a mandatory foreign-key path whose tenant cannot differ.

Part 6 must use composite/constraint strategies where necessary so a child cannot reference a parent from another organization.

Tenant-owned objects include departments, memberships, service/configuration versions, requests, work items, corrections, handoffs, documents, outcomes, messages, notes, notifications, audit events and reporting facts.

## 6. Department boundary

- Officer work requires an active membership for the applicable organization and department.
- Department queue access is limited to permitted own-department work.
- Claim/assignment targets must be active members of that department.
- Supervisor scope is own department unless an explicit approved grant states otherwise.
- Explicit multi-department membership is the only non-handoff cross-department path.
- Search and aggregate queries apply the same filters as direct resource access.

## 7. Finance handoff exception

An active Finance handoff grants only the context required to perform the requested Finance action:

- handoff summary and expected result;
- explicitly relevant references/documents;
- permitted applicant/request facts;
- handoff messages/history required for the work.

It does not transfer parent ownership, grant the full Student Records request workspace, expose unrelated documents/notes, or grant organization-wide search. Access ends when the handoff no longer authorizes receiving work, except for permission-scoped immutable history.

## 8. Applicant boundary

- Applicant access always filters by authenticated applicant and organization.
- A valid-looking request/document/outcome ID belonging to someone else is denied without revealing sensitive existence.
- Applicant messages and timelines use applicant-safe projections.
- Internal notes, operational handoffs, staff assignments and confidential Finance details are excluded at query level, not merely hidden in UI.

## 9. Organization Admin boundary

Organization Admin may query configuration and approved organization-level aggregate metadata only.

For duplicate override, the minimum view contains request reference, applicant identifier needed for matching, service, status, creation date and reason input. It excludes responses, documents, messages, notes, handoff detail and outcome files.

Organization Admin status must never be used to bypass a sensitive-resource authorization helper.

## 10. Server query pattern

Every protected query/command receives an actor context created server-side:

```ts
type ActorContext = {
  userId: string
  organizationId: string
  membershipId?: string
  role: FixedRole
  profileKeys: readonly FixedProfileKey[]
  departmentIds: readonly string[]
  permissionKeys: ReadonlySet<PermissionKey>
}
```

The context is an input to authorization; it is not sufficient by itself. Resource organization, current state, ownership/assignment/handoff and requested action are loaded and compared inside the transaction.

## 11. RLS and storage defence in depth

Part 6 migrations must create RLS policies for organization-owned tables and private storage objects.

- No public applicant-document or outcome bucket.
- Storage object keys include server-derived organization and request/document identities.
- Signed URLs are created only after current server authorization and expire quickly.
- Service-role/database bypass credentials remain server-only and do not justify skipping application authorization.
- Tests exercise direct database/storage policy denial separately from application denial.

## 12. Safe denial behavior

- Unauthenticated: redirect only to approved authentication flow or return `401` at a technical boundary.
- Authenticated but unauthorized: safe `403`/permission state.
- Cross-tenant identifier: safe not-found/denial behavior without confirming ownership or existence.
- No protected data may render before denial.
- Logs may retain a safe support reference; the response must not expose policy or query details.

## 13. Required isolation tests

- applicant A cannot access applicant B's request/document/outcome;
- organization A cannot access organization B through direct ID, list, search or signed URL;
- Student Records cannot access unrelated Finance-only work;
- Finance access is limited to an active relevant handoff;
- ordinary Officer cannot claim another department's work;
- Organization Admin cannot access sensitive content;
- inactive membership/profile is denied immediately;
- search, counts and exports do not leak unauthorized existence;
- RLS blocks a query that application code incorrectly scopes.

## 14. Explicit non-goals

- Cross-organization handoffs.
- Platform Admin support access.
- Organization switching UI.
- Dedicated tenant deployments or regional residency.
- Custom tenant permission policies.

## 15. Open questions

None. Part 6 will express these rules as constraints and RLS policies.

## 16. Change rule

Any cross-tenant path, support impersonation, context switching or expansion of Organization Admin access requires an approved security/architecture decision and higher-authority updates.

## 17. Coding-agent instruction

Start every query from the trusted actor/tenant context and narrow further. Never fetch an unrestricted record and decide in the browser whether it should be visible.
