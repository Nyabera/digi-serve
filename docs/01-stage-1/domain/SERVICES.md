# FAIDIA Stage 1 — Service Configuration Contract

**Status:** READY_FOR_PRODUCT_OWNER_REVIEW  
**Version:** 0.1  
**Last updated:** 2026-07-14  
**Product:** FAIDIA — Service Operations Platform  
**Authority:** `docs/00-stage-0/STAGE-0-V1-SPECIFICATION.md` Sections 4, 6 and 11–12 and AC-PRE-04–12/AC-DIS-01–06

## 1. Purpose

This document defines the versioned Stage 1 service configuration model and the Organization Admin editing boundary.

## 2. Service thesis

A stable `ServiceDefinition` identifies Transcript Request. Immutable `ServiceVersion`, `FormVersion`, `RequirementVersion` and `WorkflowVersion` records describe what applicants see and what requests execute. Publication atomically selects a compatible version bundle. Requests pin exact IDs and never follow a moving “latest” value.

## 3. Seeded services

| Service | Stage 1 behavior |
|---|---|
| Transcript Request | fully functional vertical slice |
| Student Clearance Request | controlled demo/read-only or simplified; no dependency |
| Certificate Replacement Request | controlled demo/read-only or simplified; no dependency |

Only active services with a complete published bundle appear publicly.

## 4. Logical model

| Object | Mutable? | Purpose |
|---|---|---|
| `ServiceDefinition` | stable identity; controlled active flag | organization-owned service identity/slug |
| `ServiceVersion` | immutable after publish | display name, description, eligibility/requirement copy, processing target and payment flags |
| `ServicePublication` | append/replace pointer atomically | current published compatible bundle and publication evidence |
| `ServiceDraftBundle` | editable until publish | coordinated draft service/form/requirements/workflow versions |

Part 6 assigns tables/constraints. A publication must never point to draft or cross-organization versions.

## 5. Transcript Request public contract

Published details provide:

- organization branding;
- service display name and public description;
- eligibility explanation;
- requirement/document checklist;
- manual payment-reference requirement;
- processing target;
- active/published state;
- start action and identifiable version metadata safe for inspection.

Inactive/unpublished services may be viewed only in permitted admin configuration and cannot start a draft.

## 6. Organization Admin editing boundary

May edit in a draft:

- organization name, logo and primary brand color through branding/organization contracts;
- service display name and public description;
- eligibility and requirement explanatory text;
- processing target;
- active/inactive state;
- manual payment-reference enabled/required flags;
- labels/help text for seeded fields and requirements.

May not edit:

- field keys/types/order/validation/branching;
- workflow order or Finance result schema;
- approval/status/permission/completion/reopen rules;
- arbitrary conditions or scripts.

The application validates the allowlist server-side; hiding fields in the admin UI is insufficient.

## 7. Draft and publication lifecycle

```text
published bundle
  -> create new editable draft copies
  -> validate compatibility and safe fields
  -> authorized atomic publish
  -> new immutable version numbers + publication timestamp/actor
  -> new requests use new bundle
```

Rules:

- Published versions cannot be edited or deleted in place.
- Publish requires the exact approved permission(s) and organization context.
- The service/form/requirement/workflow versions must be compatible and belong to the same service/organization.
- One atomic transaction publishes the complete bundle.
- Existing drafts/submissions remain pinned.
- A pinned draft whose version is retired becomes read-only and must be restarted.
- No automatic request migration engine.

## 8. Draft creation

`CreateDraft` must:

1. resolve organization/service from trusted route context;
2. load current active publication;
3. revalidate service is startable;
4. create an applicant-owned `DRAFT` with all four version pins;
5. record request-start evidence/audit atomically.

Do not accept version IDs chosen by the browser.

## 9. Public/admin queries

- Public queries return only active published projections.
- Admin queries return service identity, draft/published metadata and allowed configuration—not applicant/request content.
- Publication history is visible to authorized configuration users and is immutable.
- Cache public projections by organization/service publication identity; invalidate only after committed publication/state change.

## 10. Validation

Before publication validate:

- allowed editable keys only;
- required public copy and valid processing target;
- payment `required` cannot be true when payment reference is disabled;
- compatible seeded form, requirements and workflow;
- organization/service identity equality;
- valid accessible brand values through branding contract;
- no draft/unknown field, requirement, step or permission value.

## 11. Tests

- only active published services are public;
- inactive/unpublished start is denied server-side;
- authorized limited edit succeeds; forbidden structural edit fails;
- published versions are immutable;
- publication is atomic and pins a compatible bundle;
- new requests use new versions; existing drafts/requests keep pins;
- retired pinned draft becomes read-only;
- demo services do not become Transcript Request dependencies;
- cross-organization version publication is impossible.

## 12. Explicit non-goals

- Generic service/form/workflow builder.
- Marketplace/templates.
- Version migration or rollback of active requests.
- Arbitrary fee/payment provider configuration.
- Unlimited service creation in Stage 1.

## 13. Open questions

- `P5-OQ-SVC-001` — Validate the real processing target and approved public copy before external pilot. This does not block the explicit synthetic seed.

## 14. Change rule

Expanding admin-editable structure or adding a functional service requires product, form, workflow, permission and page approval first.

## 15. Coding-agent instruction

Read public configuration only through an immutable publication. Read request behavior only through the request's pinned versions.
