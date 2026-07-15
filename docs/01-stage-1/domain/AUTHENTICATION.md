# FAIDIA Stage 1 — Authentication Contract

**Status:** READY_FOR_PRODUCT_OWNER_REVIEW  
**Version:** 0.1  
**Last updated:** 2026-07-14  
**Product:** FAIDIA — Service Operations Platform  
**Authority:** `docs/00-stage-0/PAGE-INVENTORY.md`, `docs/00-stage-0/ROLE-PERMISSIONS-MATRIX.md`, `docs/01-stage-1/architecture/TECH-STACK.md`, and AC-AUT-01–07

## 1. Purpose

This document defines Stage 1 sign-up, sign-in, session, callback and sign-out behavior using Supabase Auth.

Authentication proves identity. It does not grant FAIDIA access; active memberships, profiles, permissions and resource scope are resolved separately.

## 2. Approved flows

| Flow | Stage 1 contract |
|---|---|
| Applicant registration | open email registration for the synthetic demo |
| Sign in | email credential flow supported by Supabase Auth |
| Callback | `/auth/callback` validates provider state/code and establishes the server-readable session |
| Intended return | only a validated same-origin approved path is accepted |
| Sign out | revoke/end session, clear auth/context cookies and return to safe public/auth page |
| Password reset | `LATER_V1`; do not make Stage 1 acceptance depend on it |
| Email verification page | `LATER_V1`; follow configured Supabase behavior without inventing a required route |

## 3. Start-service return flow

1. Visitor selects an active published Transcript Request.
2. Server creates a safe intended path containing organization slug and service identity, not sensitive draft data.
3. Unauthenticated visitor is sent to `/login` or `/register`.
4. After successful auth/callback, the server validates the intended path as same-origin and in the approved route set.
5. The server re-resolves the active organization/service publication.
6. The application creates or resumes only an owned valid draft.

Never accept an arbitrary external `returnTo` URL or trust service/organization claims captured before authentication without revalidation.

## 4. Identity and application records

- Supabase `auth.users.id` is the stable authentication subject.
- FAIDIA stores its own user/applicant/staff profile references linked to that subject.
- Roles and permissions are not stored in client-editable auth metadata.
- Applicant ownership derives from the authenticated subject's FAIDIA applicant identity.
- Staff/admin access derives from active FAIDIA memberships and profiles.
- A user may exist in Auth without an active staff membership; that does not grant a staff shell.

## 5. Server session handling

- Use the official Supabase SSR client/cookie pattern approved by the installed stack.
- Refresh session cookies in the request boundary/proxy as required by current official guidance.
- Server Components and Actions obtain the current user from the server client; they do not trust browser-provided user IDs.
- Never use `getSession()` alone as proof where verified user retrieval is required.
- Auth secrets and service-role keys remain server-only.
- Protected responses are not publicly cached.

## 6. Landing resolution

After ordinary sign-in:

- intended approved applicant flow wins when present and valid;
- applicant-only identity lands at `/applicant/dashboard`;
- active Officer/Supervisor membership lands in the shared staff experience according to approved route/navigation policy;
- Organization Admin lands at `/admin/dashboard`;
- no valid application identity/membership shows a safe access/setup message rather than guessing a role;
- Stage 1 does not implement `/select-organization`.

Where one identity has multiple role relationships in seeded data, server policy chooses the intended tested context; a general role switcher is outside Stage 1.

## 7. Authorization separation

Every protected operation still validates:

1. verified authenticated subject;
2. active application profile/membership;
3. active organization context;
4. exact permission;
5. resource scope and current state.

An authenticated user can receive `403`/safe denial. Successful authentication never implies access to a supplied ID.

## 8. Errors and privacy

- Use generic sign-in failure wording; do not reveal whether an email belongs to staff/applicant unless the provider flow already safely requires it.
- Rate-limit/abuse protection follows Supabase/project configuration and is finalized in `SECURITY.md`.
- Do not place tokens, authorization codes, emails or sensitive return data in application logs.
- Callback failure returns a safe retry path and support reference.
- Expired sessions preserve safe unsent form state only when designed; never submit under a stale identity.

## 9. Client behavior

- Auth forms use progressive enhancement and server validation.
- Pending state prevents duplicate submission.
- Password fields are never persisted in application state/storage.
- Client UI may optimistically show a signed-in shell only after server confirmation; no protected-data flash.
- Sign-out is explicit and available from every authenticated shell.

## 10. Test contract

- open applicant registration and sign-in succeed;
- intended Transcript Request path is restored after auth;
- external/invalid return URL is rejected;
- callback state/code failure is safe;
- unauthenticated protected routes deny/redirect;
- authenticated user without membership cannot enter staff/admin routes;
- inactive membership is denied;
- client-supplied user/role/organization values cannot change actor context;
- sign-out clears access;
- session expiry during a mutation returns a safe error without partial state.

## 11. Explicit non-goals

- Enterprise SSO, MFA policy, SCIM or directory sync.
- General organization/role switching.
- Platform Admin authentication flow.
- Custom token service.
- Password reset/email-verification pages as Stage 1 blockers.

## 12. Open questions

- `P5-OQ-AUT-001` — Before an external pilot, confirm email verification, password recovery, abuse controls and staff account-provisioning policy. This does not block the synthetic Stage 1 demo.

## 13. Change rule

Changing auth provider, sign-in identifiers, public registration posture, organization selection or session architecture requires an approved architecture/security decision.

## 14. Coding-agent instruction

Use Supabase Auth only for identity/session. Resolve roles, permissions and tenant scope from FAIDIA records on the server for every protected operation.
