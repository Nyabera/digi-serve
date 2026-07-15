# FAIDIA Stage 1 — Documentation and Implementation Contract Plan

**Status:** APPROVED  
**Version:** 1.0  
**Last updated:** 2026-07-14  
**Product:** FAIDIA — Service Operations Platform  
**Authority:** Subordinate to `docs/SOURCE-OF-TRUTH.md` and approved Stage 0 controlling documents

## 1. Purpose

This document controls the preparation of implementation-ready Markdown for the first Transcript Request vertical slice.

Stage 1 remains the complete Transcript Request vertical slice defined in Stage 0. The documentation work is the **Stage 1 Documentation Gate**: it must be completed before implementation begins, but it does not redefine Stage 1 as documentation alone.

## 2. Stage terminology decision

The older build-order document labels project Markdown creation as Stage 1, while the approved Source of Truth defines Stage 1 as the Transcript Request vertical slice.

The approved Stage 0 meaning is preserved:

- **Stage 1:** the complete Transcript Request vertical slice.
- **Stage 1 Documentation Gate:** the implementation contracts required before coding that slice.
- **`STAGE_1_REQUIRED`:** the page and capability classification for the slice.

This is a naming clarification. It does not change scope, routes, roles, permissions, workflow, or acceptance behavior.

## 3. Documentation thesis

Stage 0 decides what the product must do. Stage 1 documentation translates those approved decisions into contracts a coding agent can implement without guessing.

Every important fact must have one authoritative home. New Stage 1 files must reference existing Stage 0 authorities instead of creating competing copies.

## 4. Authority and conflict order

Use the authority order in `docs/SOURCE-OF-TRUTH.md`:

1. `docs/SOURCE-OF-TRUTH.md`.
2. `docs/00-stage-0/STAGE-0-APPROVED-DECISION-REGISTER.md`.
3. The controlling Stage 0 domain document named by the Source of Truth.
4. Later approved architecture and implementation documents.
5. Approved design references.
6. Current implementation.
7. Exploratory sources, screenshots, older build orders, prototypes, and chat history.

If a lower authority conflicts with a higher one, do not average them or silently choose. Stop, record the conflict, and correct the appropriate Markdown before implementation.

## 5. Files that remain authoritative in Stage 0

Do not create competing Stage 1 copies of the following:

| Subject | Authoritative file |
|---|---|
| Product, scope, service, form, configuration and outcome | `docs/00-stage-0/STAGE-0-V1-SPECIFICATION.md` |
| Non-goals | `docs/00-stage-0/V1-NON-GOALS.md` |
| Routes, pages and classifications | `docs/00-stage-0/PAGE-INVENTORY.md` |
| Roles, profiles, grants and access boundaries | `docs/00-stage-0/ROLE-PERMISSIONS-MATRIX.md` |
| Internal and applicant-visible statuses | `docs/00-stage-0/STATUS-MAPPINGS.md` |
| End-to-end behavior | `docs/00-stage-0/V1-VERTICAL-SLICE.md` |
| Post-V1 roadmap | `docs/00-stage-0/POST-V1-BACKLOG.md` |
| Design direction and reference paths | `docs/00-stage-0/DESIGN-REFERENCE-REGISTER.md` |

Stage 1 implementation documents may translate these decisions into technical contracts, but may not redefine them.

## 6. Standard metadata for new documents

Every controlling Stage 1 document must begin with:

```md
# Document title

**Status:** DRAFT | READY_FOR_PRODUCT_OWNER_REVIEW | APPROVED | APPROVED_FOR_IMPLEMENTATION | SUPERSEDED
**Version:** 0.x before approval; 1.x after approval
**Last updated:** YYYY-MM-DD
**Product:** FAIDIA — Service Operations Platform
**Authority:** The controlling documents this file implements
```

Each document must also contain:

- purpose;
- scope;
- controlling references;
- exact decisions or contracts;
- explicit non-goals;
- acceptance or verification rules;
- known open questions, using stable IDs;
- change rule;
- coding-agent instruction.

Use `APPROVED` when the product owner approves a documentation part. Do not use `APPROVED_FOR_IMPLEMENTATION` until all required technical mappings are complete and the final contradiction audit passes.

## 7. Requirement identifiers

Acceptance requirements use stable identifiers:

```text
AC-[AREA]-[NUMBER]
```

Examples:

- `AC-DIS-01` — discovery;
- `AC-SUB-04` — submission;
- `AC-FIN-06` — Finance;
- `AC-SEC-03` — security.

The text of an approved requirement may change only through a recorded decision. Its ID must not be silently reused for a different requirement.

## 8. Documentation work order

| Part | Output | State |
|---|---|---|
| 1 | Control, authority, plan, traceability foundation, README and first decision record | APPROVED |
| 2 | Numbered acceptance contract | APPROVED |
| 3 | Architecture, stack, project structure and routes | READY_FOR_PRODUCT_OWNER_REVIEW |
| 4 | Design system and components | READY_FOR_PRODUCT_OWNER_REVIEW |
| 5 | Domain, tenancy, authentication, roles, permissions, statuses, services, forms, workflows, handoffs and documents | APPROVED; S1-DEC-018–028 PENDING |
| 6 | Database and data dictionary | READY_FOR_PRODUCT_OWNER_REVIEW |
| 7 | Notifications, SLA, audit, reporting, flags, APIs and errors | READY_FOR_PRODUCT_OWNER_REVIEW |
| 8 | Security, testing, seed data, environments, deployment and definition of done | READY_FOR_PRODUCT_OWNER_REVIEW |
| 9 | Coding-agent governance | READY_FOR_PRODUCT_OWNER_REVIEW |
| 10 | Pilot, validation, feedback, limitations and change records | READY_FOR_PRODUCT_OWNER_REVIEW |
| 11 | Full contradiction and traceability audit | CONSISTENCY_CHECK_COMPLETE; FINAL_GATE_BLOCKED |

## 9. Part 1 completion check

- [x] Stage terminology reconciled without changing approved scope.
- [x] Authority order recorded.
- [x] Duplicate-document rule recorded.
- [x] Standard metadata format defined.
- [x] Stable acceptance-ID format defined.
- [x] Root README created.
- [x] Traceability foundation created.
- [x] Initial Stage 1 decision record created.
- [x] Product owner approved Part 1 on 2026-07-14.

## 10. Part 2 completion check

- [x] Preconditions defined.
- [x] Main successful journey defined.
- [x] Correction and resubmission defined.
- [x] Finance `CLEAR`, `HOLD`, `CANNOT_VERIFY` and decline paths defined.
- [x] Registrar approval, rejection and clarification paths defined.
- [x] Outcome failure and retry defined.
- [x] All approved completion paths defined.
- [x] Reopening, revocation and expiry defined.
- [x] Notification, audit, reporting and security acceptance defined.
- [x] Stable requirement IDs assigned.
- [x] Product owner approved Part 2 on 2026-07-14.

## 11. Gate to Part 3

Part 3 may begin because the product owner approved Parts 1 and 2 on 2026-07-14.

Before approval, Part 3 was blocked until the product owner either:

1. approves Parts 1 and 2; or
2. identifies exact acceptance IDs that require correction.

No application code should be created during Parts 1 or 2.

Approval of Parts 1 and 2 authorizes the remaining documentation work in sequence. It does not authorize application coding before the complete Documentation Gate passes.

## 12. Part 3 completion check

- [x] Single-application architecture defined.
- [x] Rendering, action, route-handler and background-job boundaries defined.
- [x] Authentication, authorization, tenancy, transaction and RLS boundaries defined.
- [x] Technology stack and version policy defined.
- [x] Recharts confirmed and Chart.js excluded.
- [x] Project folder and dependency boundaries defined.
- [x] All Stage 1 product routes and embedded items mapped.
- [x] Technical routes separated from product routes.
- [x] Stage 0 route-count clerical defect identified.
- [x] Initial route/UI acceptance traceability added.
- [x] Proposed decisions S1-DEC-006 through S1-DEC-011 recorded.
- [ ] Product owner has reviewed and approved Part 3.

## 13. Gate to Part 4

The product owner directed Part 4 drafting on 2026-07-14 without explicitly approving Part 3. This authorizes a review draft only. It does not approve Part 3, approve Part 4, or authorize application coding.

Part 3 remains `READY_FOR_PRODUCT_OWNER_REVIEW`; its proposed decisions must still be approved or corrected before the complete Documentation Gate can pass.

## 14. Part 4 completion check

- [x] Visual thesis and reference interpretation defined.
- [x] Applicant, staff, admin, public and authentication shell rules defined.
- [x] Color, type, spacing, radius, icon, motion and density tokens defined.
- [x] Responsive and WCAG 2.2 AA contracts defined.
- [x] Loading, empty, error, permission-denied and stale-action states defined.
- [x] Primitive, shell, shared and domain component inventories defined.
- [x] Applicant, Officer, Supervisor, Finance handoff and Admin component boundaries defined.
- [x] Table, chart, form and consequential-action contracts defined.
- [x] Later/demo/postponed controls visible in references explicitly excluded.
- [x] Initial design/component acceptance traceability added.
- [x] Proposed decisions S1-DEC-012 through S1-DEC-017 recorded.
- [ ] Product owner has reviewed and approved Part 3.
- [ ] Product owner has reviewed and approved Part 4.

## 15. Gate to Part 5

The product owner directed Part 5 drafting on 2026-07-14 while making changes to Part 4. This authorizes a review draft only. It does not approve Parts 3, 4 or 5 and does not authorize application coding.

Part 5 must not overwrite the product owner's in-progress Part 4 files. Cross-document changes are limited to the required controlled-download technical route and cumulative control/traceability records.

## 16. Part 5 completion check

- [x] Aggregate, entity, invariant, command and query boundaries defined.
- [x] Organization, department, applicant, assignment and handoff isolation defined.
- [x] Supabase authentication separated from FAIDIA authorization.
- [x] Fixed roles, Registrar profile and exact-grant implementation defined without creating custom roles.
- [x] Approved status families, named transition policies and applicant mapper boundary defined.
- [x] Immutable compatible service/configuration publication and request pinning defined.
- [x] Seeded form fields, requirement rules, snapshots and correction unlocks defined.
- [x] Fixed workflow/work-item command model defined.
- [x] Finance handoff lifecycle, projection and result behavior defined.
- [x] Private upload, review, replacement, outcome, download, collection, closure and revocation contracts defined.
- [x] Controlled-download technical route added to Part 3 route/project-structure review documents.
- [x] Initial Part 5 acceptance traceability added.
- [x] Proposed decisions S1-DEC-018 through S1-DEC-028 recorded.
- [ ] Product owner has finalized and approved Part 4 changes.
- [x] Product owner approved Part 5 on 2026-07-14 while leaving S1-DEC-018 through S1-DEC-028 pending.
- [ ] Product owner has reviewed and approved Part 3.

## 17. Gate to Part 6

The product owner explicitly authorized Part 6 drafting after approving the Part 5 document set while leaving Part 4 and S1-DEC-018 through S1-DEC-028 pending. Part 6 may therefore proceed as a review draft but may not be approved for implementation by implication.

## 18. Part 6 completion check

- [x] PostgreSQL, Drizzle and reviewed SQL migration authority defined.
- [x] Naming, ID, time, enum, JSON and optimistic-concurrency conventions defined.
- [x] Organization/identity, configuration, request, handoff, document, communication and evidence table families defined.
- [x] Exact proposed enums, columns, keys and important constraints documented.
- [x] Tenant-safe composite foreign keys and non-bypass application/worker role strategy defined.
- [x] RLS and transaction-local actor-context strategy defined.
- [x] Published-version and append-only evidence enforcement defined.
- [x] Duplicate submission concurrency control defined.
- [x] Private Storage metadata and outcome-download evidence defined.
- [x] Queue/search/report indexes and explicit metric timestamps defined.
- [x] Restrictive deletion/retention posture and migration order defined.
- [x] Initial Part 6 acceptance/data traceability added.
- [x] Proposed decisions S1-DEC-029 through S1-DEC-035 recorded.
- [ ] Product owner has reviewed and approved Part 6.
- [ ] Pending Part 5 decisions that control schema choices are approved or corrected.

## 19. Gate to Part 7

Part 7 should not be approved until Part 6 and its controlling pending decisions are approved or corrected. The product owner may authorize a review draft, but application code/migrations remain blocked.

The product owner authorized Parts 7 through 11 drafting together on 2026-07-14. This authorizes review drafts only and does not waive earlier gates.

## 20. Parts 7–11 completion check

- [x] Every required Stage 0 notification mapped to a keyed in-app contract.
- [x] Exact audit registry and safe immutable event envelope mapped.
- [x] Required metrics, SLA clocks/semantics and aggregate privacy mapped.
- [x] Minimal validation analytics and closed feature-flag registry mapped.
- [x] Named commands, technical handlers, cancellation and typed errors mapped.
- [x] Security controls and complete authorization/Storage/RLS negative-test matrix defined.
- [x] Deterministic test layers, acceptance families and CI gates defined.
- [x] Synthetic seed, environment, migration-safe deployment and three done gates defined.
- [x] Coding-agent authority/change/verification rules defined.
- [x] Change record, delivery roadmap reference, pilot/validation plans, empty feedback register and limitations defined.
- [x] Proposed decisions S1-DEC-036 through S1-DEC-048 recorded.
- [x] Cross-document consistency audit completed.
- [ ] Product owner has approved/corrected Parts 3, 4 and 6 and all controlling pending decisions.
- [ ] Product owner has reviewed and approved Parts 7 through 11.
- [ ] Final Documentation Gate passed and source-of-truth implementation authority declared.

## 21. Final Documentation Gate

The consistency check found no intentional Stage 0 scope expansion in Parts 7–10. The final gate remains blocked by pending Parts 3, 4 and 6, final Part 4 edits, and proposed S1-DEC-006 through S1-DEC-048. See `STAGE-1-CONTRADICTION-AUDIT.md` for the exact blocker register.

Do not change any document to `APPROVED_FOR_IMPLEMENTATION`, create application code or create/apply database migrations until the blocker register is resolved and the audit is rerun.

## 22. Coding-agent instruction

Read the Source of Truth first. Treat this plan as process control, not permission to expand Stage 1. Implement nothing from a lower-authority source when it conflicts with approved Stage 0 documentation.
