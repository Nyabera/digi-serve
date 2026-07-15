# FAIDIA Stage 1 — Role and Profile Contract

**Status:** READY_FOR_PRODUCT_OWNER_REVIEW  
**Version:** 0.1  
**Last updated:** 2026-07-14  
**Product:** FAIDIA — Service Operations Platform  
**Authority:** `docs/00-stage-0/ROLE-PERMISSIONS-MATRIX.md` Section 3 and `docs/00-stage-0/STAGE-0-V1-SPECIFICATION.md` Section 15

## 1. Purpose

This document translates the approved fixed roles and profiles into an implementation contract. It does not create a second role authority; when wording conflicts, the Stage 0 matrix wins.

## 2. Fixed role type

```ts
type FixedRole =
  | "APPLICANT"
  | "OFFICER"
  | "SUPERVISOR"
  | "ORGANIZATION_ADMIN"
  | "PLATFORM_ADMIN"
```

`PLATFORM_ADMIN` is reserved for internal support and receives no Stage 1 organization grant or ordinary navigation.

Roles are fixed application values. Organization Admin cannot create, rename or edit them.

## 3. Profiles

Profiles are fixed additions attached to an active membership; they are not new top-level roles.

```ts
type FixedProfileKey = "REGISTRAR"
```

The Stage 1 Registrar is:

- a `SUPERVISOR` membership;
- labelled Registrar for the seeded institution;
- granted only the approved Registrar permission additions;
- processed in the shared staff shell.

There is no `REGISTRAR` role and no separate Registrar application shell.

## 4. Role capabilities

| Role/profile | Scope summary | Stage 1 shell |
|---|---|---|
| Applicant | owned requests, messages, documents, notifications and outcomes | applicant |
| Officer | assigned/claimed and permitted department work | shared staff |
| Supervisor | Officer experience plus exact monitoring/assignment/reopen/manual-close/report grants | shared staff |
| Registrar profile | Supervisor plus decision grants | shared staff; approval queue links to request workspace |
| Organization Admin | organization/configuration and approved aggregate metadata | admin |
| Platform Admin | no Stage 1 organization navigation/grants | none |

## 5. Membership contract

A staff/admin role is meaningful only through an active organization membership. A membership records:

- organization;
- user identity;
- fixed role;
- active/inactive state;
- department scope where applicable;
- fixed profile keys where applicable;
- lifecycle timestamps and audit evidence.

Applicant self-access is tied to the authenticated applicant identity and organization-owned resources. It must not be implemented as a broad staff-like membership grant.

## 6. Inheritance rules

- `SUPERVISOR` receives the exact Officer grants plus the exact Supervisor additions in Stage 0.
- Registrar receives only the three approved profile additions; the profile does not broaden organization/department scope.
- Organization Admin does not inherit Officer/Supervisor access.
- A job title or department name never creates grants.
- Profile/role labels shown in UI are presentation, not authorization.

## 7. Navigation rules

Navigation is built server-side from the active membership/profile and exact permissions.

- Supervisor uses Officer routes for request processing.
- Registrar queue: `/supervisor/approvals`.
- Registrar processing: `/officer/requests/[id]` with embedded decision panel.
- `/officer/requests/[id]/approval` must not exist.
- Missing permission removes the control/navigation and the server action remains denied.

## 8. Role assignment

Stage 1 supports assignment of approved fixed roles/profiles only where the product surface permits it. It does not provide a permission editor or custom role builder.

Changes to membership role, profile, department or active state must be audited and take effect on the next server authorization check; do not cache them for the session lifetime.

## 9. Denial examples

- Officer who can view a request cannot approve it.
- Standard Supervisor without Registrar profile cannot approve it.
- Registrar profile in the wrong organization/department/context cannot act.
- Organization Admin cannot open sensitive request data.
- Platform Admin receives no implicit support bypass.

## 10. Verification

- [ ] Fixed roles/profile compile from shared domain constants.
- [ ] No custom role/profile values can be persisted.
- [ ] Supervisor and Registrar use the shared staff shell.
- [ ] Role/profile change invalidates future authorization immediately.
- [ ] UI and server denial tests cover each forbidden example.

## 11. Explicit non-goals

- Custom roles or permissions.
- Registrar as a top-level role.
- Full membership administration.
- Role switcher or impersonation.
- Platform support access.

## 12. Open questions

None.

## 13. Change rule

Adding a role/profile or changing inheritance requires Stage 0 role/permission approval first.

## 14. Coding-agent instruction

Import fixed values from one shared domain module. Never infer authorization from labels, route names, navigation or job titles.
