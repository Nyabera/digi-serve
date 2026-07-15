# FAIDIA Stage 1 — Form and Requirement Schema Contract

**Status:** READY_FOR_PRODUCT_OWNER_REVIEW  
**Version:** 0.1  
**Last updated:** 2026-07-14  
**Product:** FAIDIA — Service Operations Platform  
**Authority:** `docs/00-stage-0/STAGE-0-V1-SPECIFICATION.md` Sections 7–8, `docs/00-stage-0/V1-VERTICAL-SLICE.md` Phases 2–5, and AC-SUB-01–15/AC-COR-01–08

## 1. Purpose

This document defines the seeded Transcript Request form/requirement representation, validation boundary, response snapshots and correction unlock rules.

## 2. Schema thesis

Stage 1 renders one reviewed seeded schema. The server interprets only known field and requirement keys. Organization Admin may edit labels/help text in a draft version but cannot add, remove, reorder, branch, script or change field types/validation.

## 3. Approved field types

```ts
type FieldType =
  | "SHORT_TEXT"
  | "EMAIL"
  | "PHONE"
  | "SELECT"
  | "YEAR"
  | "TEXTAREA"
  | "CHECKBOX"
  | "DECLARATION"
```

Unknown types fail publication/rendering safely. Do not implement executable schema expressions.

## 4. Seeded field registry

Stable keys are proposed below for implementation. Labels/help text are versioned display values.

| Key | Type | Submission rule |
|---|---|---|
| `full_legal_name` | `SHORT_TEXT` | required |
| `email` | `EMAIL` | required |
| `phone_number` | `PHONE` | required |
| `student_number` | `SHORT_TEXT` | required |
| `identity_number` | `SHORT_TEXT` | required; national ID or passport value |
| `former_name` | `SHORT_TEXT` | optional; activates name-change evidence when supplied |
| `programme` | `SELECT` | required; options come from synthetic seed |
| `department_or_school` | `SELECT` | required; options come from synthetic seed |
| `campus` | `SELECT` | optional where relevant |
| `year_of_admission` | `YEAR` | required |
| `year_of_completion` | `YEAR` | optional for current students; validated when supplied |
| `study_mode` | `SELECT` | optional where relevant |
| `transcript_purpose` | `TEXTAREA` | required |
| `copy_count_acknowledgement` | `CHECKBOX` | required true; Stage 1 permits one copy only |
| `delivery_method` | `SELECT` | required; `CONTROLLED_DOWNLOAD` or `PHYSICAL_COLLECTION` only |
| `recipient_details` | `TEXTAREA` | optional only where seeded policy requires; no third-party request flow |
| `manual_payment_reference` | `SHORT_TEXT` | required when published flags enable+require it |
| `additional_notes` | `TEXTAREA` | optional |
| `accuracy_declaration` | `DECLARATION` | required accepted/true at submission |

Exact programme/department/campus/study-mode options are seeded synthetic data and finalized in `SEED-DATA.md`. They are values, not a new builder.

## 5. Schema representation

Use a versioned declarative data structure with a strict discriminated union:

```ts
type SeededField = {
  key: SeededFieldKey
  type: FieldType
  label: string
  helpText?: string
  required: boolean
  position: number
  options?: readonly { value: string; label: string }[]
  validationKey: SeededValidationKey
}
```

The implementation validates that key/type/position/validation combinations match the compiled Stage 1 registry. Editable JSON cannot change structural values.

## 6. Validation

- Client validation improves feedback; server validation is authoritative.
- Normalize whitespace, email case and phone/year representation before validation where safe.
- Reject unknown response keys rather than silently storing them.
- Validate requiredness from the pinned form/service version and approved deterministic conditions.
- Do not render or execute arbitrary regex/script/condition values from tenant input.
- Preserve applicant-entered text as data; escape on rendering.
- Field length/format limits are explicit constants in the seeded registry and finalized with Part 6/API contracts.

## 7. Document requirement registry

| Requirement key | Rule |
|---|---|
| `national_id_or_passport` | required for submission |
| `student_or_institutional_id` | required only when the seeded policy marks it applicable/available |
| `payment_reference_evidence` | required only when seeded policy requires evidence |
| `name_change_evidence` | required when `former_name` is supplied |

Conditions are named code rules with tests, not admin-authored expressions.

## 8. Draft answers and snapshots

- Draft answers may be updated only by the owning applicant while request is `DRAFT` or by explicit correction unlock.
- Autosave/manual save must use the pinned schema and expected record version.
- Submission creates an immutable normalized response snapshot.
- Corrections create a new snapshot/delta relationship; previous submitted values remain inspectable.
- Staff notes/review annotations are not stored inside applicant response JSON.
- Sensitive values remain protected by tenant/ownership authorization.

## 9. Correction unlock contract

A correction names an allowlist of:

- field keys that may change;
- document requirement/document IDs that may be replaced;
- applicant-visible instructions/reasons;
- optional action deadline.

Server updates reject any field/file outside that allowlist. Resubmission revalidates the complete pinned schema and applicable requirements, not only changed values.

## 10. Review and submission

The review projection shows the exact normalized answers, applicable requirements/files, payment reference and declaration before submit.

`SubmitRequest` revalidates ownership, organization, published/pinned-version availability, required answers/documents/payment/declaration and duplicate-active rule in the transaction. Repeated successful submit cannot create duplicate side effects.

## 11. Accessibility and privacy

- Visible labels and error associations are required.
- Validation summary links to fields.
- Declaration text and acceptance time/version are preserved.
- Identity/payment values are masked where full value is unnecessary.
- Never place answer values in URLs, analytics events or ordinary logs.

## 12. Tests

- every approved type renders and validates;
- unknown key/type/structural admin edit is rejected;
- required/conditional requirements are deterministic;
- missing field/document/payment/declaration blocks submission;
- applicant ownership/version pin enforced;
- correction can edit only unlocked fields/files;
- old snapshot/document history survives resubmission;
- retired pinned draft becomes read-only;
- duplicate submission is idempotent.

## 13. Explicit non-goals

- Visual form builder.
- Arbitrary branching, scripts, regular expressions or computed fields.
- Field reordering/addition/removal by Organization Admin.
- Third-party request flow.
- Multiple transcript copies.

## 14. Open questions

- `P5-OQ-FRM-001` — Finalize synthetic programme/department/campus/study-mode options, field length limits, identity formatting and conditional evidence values in `SEED-DATA.md` before implementation approval; validate them with the institution again before external pilot.

## 15. Change rule

Adding/removing/retyping/reordering a field or requirement changes approved product structure and requires Stage 0 and acceptance updates first.

## 16. Coding-agent instruction

Compile the seeded registry into shared Zod/server rules. Treat versioned labels/help text as data and every structural property as allowlisted code-backed configuration.
