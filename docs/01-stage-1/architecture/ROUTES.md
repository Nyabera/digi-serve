# FAIDIA Stage 1 — Routes

**Status:** READY_FOR_PRODUCT_OWNER_REVIEW  
**Version:** 0.1  
**Last updated:** 2026-07-14  
**Product:** FAIDIA — Service Operations Platform  
**Authority:** `docs/00-stage-0/PAGE-INVENTORY.md`, `ROLE-PERMISSIONS-MATRIX.md`, `ARCHITECTURE.md`, and approved acceptance criteria

## 1. Purpose

This document translates the approved page inventory into exact Next.js App Router locations, access gates and acceptance coverage.

It does not create additional product pages.

## 2. Approved route count

Stage 0 version 1.5 confirms:

- 32 distinct product routes;
- 7 embedded sections/actions;
- 39 total `STAGE_1_REQUIRED` inventory items.

DEC-051 and S1-DEC-006 record this clerical correction. No page, route, embedded section, or classification was added, removed, renamed, or reclassified.

## 3. Route groups and access gates

| Route group | URL prefix | Entry gate | Shell |
|---|---|---|---|
| `(public)` | `/o/...` | Published organization/service lookup | Public institution shell |
| `(auth)` | `/login`, `/register`, `/auth/callback` | Auth flow and safe redirect validation | Auth shell |
| `(applicant)` | `/applicant/...` | Authenticated applicant/self scope | Applicant shell |
| `(staff)` Officer | `/officer/...` | Active staff membership plus route/action scope | Shared staff shell |
| `(staff)` Supervisor | `/supervisor/...` | Active Supervisor membership/profile and exact permission | Shared staff shell |
| `(admin)` | `/admin/...` | Active Organization Admin configuration scope | Admin shell |

A layout gate improves navigation and early rejection. Every page query and mutation must still authorize server-side.

## 4. Public and authentication routes

| Inventory | URL | App Router file | Access | Acceptance |
|---|---|---|---|---|
| PUB-001 | `/o/[organizationSlug]` | `src/app/(public)/o/[organizationSlug]/page.tsx` | Public; active organization | AC-DIS-01–02 |
| PUB-002 | `/o/[organizationSlug]/services` | `src/app/(public)/o/[organizationSlug]/services/page.tsx` | Public; published services only | AC-DIS-02 |
| PUB-003 | `/o/[organizationSlug]/services/[serviceSlug]` | `src/app/(public)/o/[organizationSlug]/services/[serviceSlug]/page.tsx` | Public; active published service | AC-DIS-03–06 |
| AUTH-001 | `/register` | `src/app/(auth)/register/page.tsx` | Anonymous or safe authenticated redirect | AC-AUT-01–03 |
| AUTH-002 | `/login` | `src/app/(auth)/login/page.tsx` | Anonymous or safe authenticated redirect | AC-AUT-01, AC-AUT-03 |

## 5. Applicant routes

| Inventory | URL | App Router file | Access | Acceptance |
|---|---|---|---|---|
| APP-001 | `/applicant/dashboard` | `src/app/(applicant)/applicant/dashboard/page.tsx` | Applicant self scope | AC-AUT-05–06, AC-SCP-01 |
| APP-003 | `/applicant/services/[serviceSlug]/start` | `src/app/(applicant)/applicant/services/[serviceSlug]/start/page.tsx` | Applicant; active published service | AC-AUT-03–07, AC-PRE-08–10 |
| APP-004 | `/applicant/requests/[id]/form` | `src/app/(applicant)/applicant/requests/[id]/form/page.tsx` | Draft owner; editable pinned version | AC-SUB-01–02, AC-SUB-07–08 |
| APP-005 | `/applicant/requests/[id]/documents` | `src/app/(applicant)/applicant/requests/[id]/documents/page.tsx` | Draft/correction owner; document scope | AC-SUB-03–04, AC-COR-05–06 |
| APP-006 | `/applicant/requests/[id]/review` | `src/app/(applicant)/applicant/requests/[id]/review/page.tsx` | Draft owner; submit eligibility | AC-SUB-05–13 |
| APP-007 | `/applicant/requests/[id]/submitted` | `src/app/(applicant)/applicant/requests/[id]/submitted/page.tsx` | Submitted-request owner | AC-SUB-14–15 |
| APP-008 | `/applicant/requests` | `src/app/(applicant)/applicant/requests/page.tsx` | Applicant self scope | AC-SEC-02, AC-SCP-01 |
| APP-009 | `/applicant/requests/[id]` | `src/app/(applicant)/applicant/requests/[id]/page.tsx` | Request owner; applicant-safe projection | AC-COR-04, AC-AUD-06, AC-SEC-02, AC-SEC-07 |
| APP-011 | `/applicant/requests/[id]/correction` | `src/app/(applicant)/applicant/requests/[id]/correction/page.tsx` | Request owner; active correction | AC-COR-02–08 |
| APP-013 | `/applicant/notifications` | `src/app/(applicant)/applicant/notifications/page.tsx` | Applicant self scope | AC-NOT-01–03 |
| APP-014 | `/applicant/requests/[id]/outcome` | `src/app/(applicant)/applicant/requests/[id]/outcome/page.tsx` | Request owner; issued outcome | AC-OUT-04, AC-CMP-01–02, AC-SEC-08 |

## 6. Officer and shared staff routes

| Inventory | URL | App Router file | Access | Acceptance |
|---|---|---|---|---|
| OFF-001 | `/officer/dashboard` | `src/app/(staff)/officer/dashboard/page.tsx` | Active Officer/Supervisor membership | AC-REV-01–03 |
| OFF-002 | `/officer/queue` | `src/app/(staff)/officer/queue/page.tsx` | Assigned/claimed permitted work | AC-REV-01–03, AC-SEC-04 |
| OFF-003 | `/officer/department-queue` | `src/app/(staff)/officer/department-queue/page.tsx` | Permitted department work | AC-REV-01–03, AC-SEC-04 |
| OFF-004 | `/officer/requests/[id]` | `src/app/(staff)/officer/requests/[id]/page.tsx` | Assignment/department/handoff scope; action-specific grants | AC-REV-02–07, AC-REG-04–12 |
| OFF-009 | `/officer/requests/[id]/referrals/new` | `src/app/(staff)/officer/requests/[id]/referrals/new/page.tsx` | Student Records plus handoff-create grant and valid state | AC-FIN-01–04 |
| OFF-011 | `/officer/handoffs/incoming` | `src/app/(staff)/officer/handoffs/incoming/page.tsx` | Receiving department/membership | AC-FIN-05–07 |
| OFF-012 | `/officer/handoffs/outgoing` | `src/app/(staff)/officer/handoffs/outgoing/page.tsx` | Originating department/membership | AC-FIN-01–04, AC-FIN-11–13 |
| OFF-013 | `/officer/handoffs/[id]` | `src/app/(staff)/officer/handoffs/[id]/page.tsx` | Originator/receiver according to current handoff state | AC-FIN-05–14 |
| OFF-016 | `/officer/notifications` | `src/app/(staff)/officer/notifications/page.tsx` | Staff self scope | AC-NOT-01–04 |

## 7. Supervisor routes

| Inventory | URL | App Router file | Access | Acceptance |
|---|---|---|---|---|
| SUP-001 | `/supervisor/dashboard` | `src/app/(staff)/supervisor/dashboard/page.tsx` | Supervisor department/report scope | AC-REP-01–04 |
| SUP-006 | `/supervisor/approvals` | `src/app/(staff)/supervisor/approvals/page.tsx` | Registrar-profile Supervisor with decision queue access | AC-REG-02–04, AC-REG-06–09 |

Selecting an approval must navigate to `/officer/requests/[id]`. The decision panel is embedded there.

The following route is prohibited:

```text
/officer/requests/[id]/approval
```

## 8. Organization Admin routes

| Inventory | URL | App Router file | Access | Acceptance |
|---|---|---|---|---|
| ADM-001 | `/admin/dashboard` | `src/app/(admin)/admin/dashboard/page.tsx` | Organization Admin metadata/setup scope | AC-SEC-06, AC-SCP-01 |
| ADM-002 | `/admin/organization` | `src/app/(admin)/admin/organization/page.tsx` | Organization metadata edit grant | AC-PRE-01–03, AC-SEC-06 |
| ADM-007 | `/admin/services` | `src/app/(admin)/admin/services/page.tsx` | Seeded service metadata scope | AC-PRE-04–06, AC-PRE-11–12 |
| ADM-008 | `/admin/services/[id]` | `src/app/(admin)/admin/services/[id]/page.tsx` | Limited safe service metadata editing | AC-PRE-05–11 |
| ADM-013 | `/admin/settings/branding` | `src/app/(admin)/admin/settings/branding/page.tsx` | Branding edit grant | AC-DIS-01, AC-DIS-04 |

These routes must never use Organization Admin status as permission to load sensitive request content.

## 9. Embedded Stage 1 sections and actions

These are required inventory items but not separate routes:

| Inventory | Host route | Embedded capability | Acceptance |
|---|---|---|---|
| APP-010 | `/applicant/requests/[id]` | Applicant-safe timeline | AC-AUD-06 |
| APP-012 | `/applicant/requests/[id]` | Applicant-visible message thread | AC-NOT-03, AC-SEC-07 |
| OFF-005 | `/officer/requests/[id]` | Document review | AC-COR-01, AC-SUB-03–04 |
| OFF-006 | `/officer/requests/[id]` | Internal notes | AC-REV-07, AC-SEC-07 |
| OFF-007 | `/officer/requests/[id]` | Applicant messages | AC-COR-04, AC-NOT-03 |
| OFF-008 | `/officer/requests/[id]` | Correction action | AC-COR-01–03 |
| OFF-015 | `/officer/requests/[id]` | Registrar decision panel | AC-REG-04–12 |

## 10. Technical routes

Technical routes support the application but are not product pages and are not counted in the 32 product routes.

| URL | File | Purpose | Exposure rule |
|---|---|---|---|
| `/auth/callback` | `src/app/(auth)/auth/callback/route.ts` | Complete supported Supabase Auth redirect exchange and safe destination redirect | Validate code and destination; no arbitrary redirect |
| `/api/inngest` | `src/app/api/inngest/route.ts` | Serve registered Inngest functions | Provider verification/configuration; no business UI |
| `/api/health` | `src/app/api/health/route.ts` | Minimal readiness/liveness signal | No secrets, versions, tenant data or deep diagnostics |

Do not add technical endpoints speculatively. Storage and domain mutations use approved server operations unless a later contract demonstrates that a Route Handler is required.

## 11. Redirect rules

- Unauthenticated protected access redirects to `/login` with a validated internal return path.
- After authentication, return only to an allow-listed internal path.
- Authenticated applicants cannot be redirected into staff/admin routes.
- Staff landing is selected from active membership/profile, not from a client-supplied role.
- A denied authenticated request shows a safe permission-denied state or returns the appropriate HTTP result; it must not masquerade as successful empty data.
- `/supervisor/approvals` selections open `/officer/requests/[id]`.
- No Stage 1 rule requires a public `/` marketing page or redirect.

## 12. Dynamic parameter rules

- `organizationSlug` is public lookup input and resolves only active visible organization data.
- `serviceSlug` must resolve inside the organization/service context where applicable.
- `[id]` values are untrusted input and never prove access.
- Use opaque stable IDs for internal records; do not expose sequential IDs where avoidable.
- A valid-looking ID from another tenant returns no sensitive distinction.

## 13. Page-state contract

Every product route must define:

- loading behavior;
- empty behavior;
- safe error behavior;
- permission-denied behavior;
- not-found behavior;
- stale-action behavior where mutations exist;
- responsive behavior;
- keyboard/focus behavior;
- title/context/breadcrumb behavior;
- data-freshness expectation.

Route-specific UI states will be detailed in Part 4 and feature contracts.

## 14. Explicitly absent routes

Do not create active Stage 1 route files for:

- `/track` (`DEMO_ONLY`);
- `/verify/[token]` (`POSTPONED`);
- `/applicant/services` (`LATER_V1`);
- `/applicant/account` (`LATER_V1`);
- `/applicant/drafts` (`LATER_V1`);
- `/applicant/payments` (`DEMO_ONLY`);
- `/officer/requests/[id]/transfers/new` (`POSTPONED`);
- `/officer/work-items/[id]` (`LATER_V1`);
- `/officer/requests/[id]/approval` (prohibited);
- advanced Supervisor assignment/reporting routes;
- full Admin department/user/form/document/workflow/version/report routes;
- Platform Admin routes;
- visual builders, marketplaces or public verification.

Later files may exist only after their classification is promoted through approved Markdown.

## 15. Route acceptance

- [x] The clerical count correction from 33 to 32 distinct product routes is approved.
- [x] All 39 `STAGE_1_REQUIRED` inventory items are represented.
- [x] All 32 distinct product routes are represented once.
- [x] All 7 embedded items remain embedded.
- [x] Route groups and shared layouts are correct.
- [x] Technical routes do not expand product-page scope.
- [x] Registrar queue and embedded decision route are correct.
- [x] Prohibited and later routes remain absent.
- [x] Access gates agree with the role-permission matrix.
- [x] Acceptance requirements have initial route/UI mappings.

## 16. Change rule

Adding, removing, renaming or reclassifying a product route or embedded section requires prior updates to the Stage 0 page inventory, affected workflow/permission documents, this file and traceability.

## 17. Coding-agent instruction

Do not scaffold routes from this review version. After approval, create only the routes listed as Stage 1 product or required technical routes. A route file, hidden link or mockup is not permission to expose data or execute an action.
