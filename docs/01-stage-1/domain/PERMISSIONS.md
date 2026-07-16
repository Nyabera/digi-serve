# FAIDIA Stage 1 — Permission Contract

**Status:** READY_FOR_PRODUCT_OWNER_REVIEW  
**Version:** 0.1  
**Last updated:** 2026-07-14  
**Product:** FAIDIA — Service Operations Platform  
**Authority:** `docs/00-stage-0/ROLE-PERMISSIONS-MATRIX.md` Sections 4–10 and AC-SEC-01–11

## 1. Purpose

This document defines how the exact approved Stage 1 permission registry is represented and checked. The Stage 0 grant table remains authoritative.

## 2. Permission thesis

A permission key answers “may this membership attempt this kind of action?” Resource authorization then also proves organization, department, ownership/assignment/handoff and current state. Neither a role alone nor a permission alone is sufficient.

## 3. Canonical permission keys

Implement exactly the keys listed in `ROLE-PERMISSIONS-MATRIX.md` Section 5 under these namespaces:

- `requests.*`;
- `assignments.*` and `work_items.*`;
- `handoffs.*`;
- `documents.*`;
- `messages.*` and `internal_notes.*`;
- `services.*`, `forms.*`, `workflows.*`, `organizations.*`, `departments.*`, `users.*`, `memberships.*`, `roles.*`, `branding.*`, `features.*`;
- `reports.*` and `audit.*`.

Unknown keys are invalid and denied. Do not persist arbitrary permission strings supplied by an administrator.

## 4. Exact grant registry implementation

Represent the Stage 0 Section 6 table as reviewed source code, for example:

```ts
const ROLE_GRANTS: Readonly<Record<GrantGroup, ReadonlySet<PermissionKey>>> = {
  applicant: new Set(/* exact Applicant column */),
  officer: new Set(/* exact Officer column */),
  supervisorAdditions: new Set(/* exact Supervisor additions */),
  registrarAdditions: new Set([
    "requests.approve",
    "requests.reject",
    "requests.return_for_clarification",
  ]),
  organizationAdmin: new Set(/* exact Organization Admin column */),
}
```

The full set is derived from the approved matrix in a unit test/fixture; this document intentionally does not create a competing grant table. Any mismatch between code and Stage 0 fails review.

## 5. Authorization pipeline

Every protected command/query evaluates, as applicable:

1. verified authenticated subject;
2. active membership/applicant identity;
3. active organization context;
4. exact permission key;
5. target organization equality;
6. department scope;
7. applicant ownership, assignment, claim or active handoff scope;
8. current resource/workflow state;
9. resource/version prerequisites;
10. input and expected stale-state token.

Return a typed denial. Do not partially execute or write a success audit event.

## 6. Authorization API

Use shared server-only functions:

```ts
requireAuthenticatedActor()
requireActiveMembership(actor, organizationId)
requirePermission(actor, permissionKey)
authorizeRequestAccess(actor, request, intent)
authorizeWorkItemAccess(actor, workItem, intent)
authorizeHandoffAccess(actor, handoff, intent)
authorizeDocumentAccess(actor, document, intent)
authorizeAdminMetadataAccess(actor, organization, intent)
```

Functions either return a narrowed authorized context or throw/return a typed domain authorization error. They never return unrestricted records to the client.

## 7. Resource scopes

| Scope | Enforcement |
|---|---|
| `SELF` | applicant ID and organization match |
| `ASSIGNED` | active work assignment/claim matches actor and department |
| `DEPARTMENT` | active membership includes target department and permission |
| `MULTIPLE_DEPARTMENTS` | explicit active membership scope contains target department |
| `ORGANIZATION_METADATA` | approved aggregate/configuration projection only |
| `PLATFORM` | outside Stage 1 registry; deny in organization product |

## 8. Important special cases

- Finance sees only an active, relevant handoff projection and attached permitted resources.
- Student Records remains coordinating owner.
- Organization Admin duplicate override receives minimum matching metadata and requires reason.
- `requests.complete` for Officer means physical collection from `OUTCOME_READY`, not generic completion.
- Controlled download completion is a system transition after applicant authorization.
- `requests.manual_close` and `requests.reopen` are Supervisor-only exact grants.
- Registrar decision actions require profile plus exact permission; standard Supervisor is denied.
- `documents.revoke` is independent from reopen.
- No role edits/deletes audit events.

## 9. UI contract

Server queries may return `permittedActions` for presentation. These values:

- are derived after resource authorization;
- expose only safe action identifiers;
- may hide/disable controls for usability;
- expire conceptually when resource state/membership changes;
- never replace command-time authorization.

## 10. RLS relationship

Application authorization is primary. PostgreSQL and Storage RLS are defence in depth. Service-role access remains inside server modules and must still call authorization before user-initiated work.

## 11. Test matrix minimum

- every approved grant has one allowed test;
- every role/profile boundary has denial tests;
- applicant ownership and cross-organization denial;
- cross-department and Finance projection denial;
- Officer/standard Supervisor Registrar-action denial;
- Organization Admin sensitive-content denial;
- state-invalid action denial even with permission;
- direct signed-file and search/count leakage denial;
- stale/inactive membership denial.

## 12. Explicit non-goals

- Custom permission editor.
- Attribute-policy language.
- Client-generated permission sets.
- Authorization solely through middleware, navigation or RLS.
- Support impersonation.

## 13. Open questions

None.

## 14. Change rule

A permission key or grant change requires the Stage 0 role/permission matrix and decision register to change before code.

## 15. Coding-agent instruction

Generate or hand-maintain one reviewed registry from the exact Stage 0 matrix, then call shared server authorization for every protected read and write.
