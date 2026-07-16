# FAIDIA Stage 1 — Decision Log

**Status:** PARTS_1_2_5_APPROVED; PARTS_3_4_6_7_8_9_10_11_AND_CONTROLLING_DECISIONS_PENDING  
**Version:** 1.5  
**Last updated:** 2026-07-14  
**Product:** FAIDIA — Service Operations Platform  
**Authority:** Subordinate to approved Stage 0 decisions

## 1. Purpose

This file records decisions made while translating the approved Stage 0 product into Stage 1 implementation contracts. It must not silently override a Stage 0 decision.

## 2. Decision states

- `PROPOSED` — awaiting product-owner approval.
- `APPROVED` — approved and controlling within Stage 1, subject to higher-authority documents.
- `SUPERSEDED` — replaced by a later recorded decision.
- `REJECTED` — considered and not adopted.

## 3. Approved decisions

| ID | Topic | Decision | Reason | State |
|---|---|---|---|---|
| S1-DEC-001 | Stage terminology | Stage 1 remains the complete Transcript Request vertical slice. The Markdown preparation is named the Stage 1 Documentation Gate, not a different product stage. | Preserves approved DEC-033 while accommodating the older build-order label. | APPROVED |
| S1-DEC-002 | Duplicate documents | Do not create new competing copies of Stage 0 product, non-goal, page, role, permission, status or roadmap authorities. Stage 1 technical documents reference and implement them. | Prevents contradictory sources of truth and documentation drift. | APPROVED |
| S1-DEC-003 | Acceptance identifiers | Use permanent `AC-[AREA]-[NUMBER]` identifiers. Approved IDs are never silently reused for different behavior. | Enables requirement-to-code and requirement-to-test traceability. | APPROVED |
| S1-DEC-004 | Documentation approval | New controlling documents remain `READY_FOR_PRODUCT_OWNER_REVIEW` until reviewed and contradiction-checked. | A generated document must not declare itself product-owner approved. | APPROVED |
| S1-DEC-005 | Charting library | Recharts is the only approved Stage 1 charting library; Chart.js must not be introduced. | Matches the approved design register and recommended stack. | APPROVED |

## 4. Part 3 decisions awaiting review

| ID | Topic | Proposed decision | Reason | State |
|---|---|---|---|---|
| S1-DEC-006 | Route count | Correct the Stage 0 scope count from 33 to 32 distinct product routes while retaining all 39 required inventory items: 32 routes plus 7 embedded items. | Direct recount of the authoritative page tables; no scope item changes. | PROPOSED |
| S1-DEC-007 | Application architecture | Use one modular full-stack Next.js App Router application and one PostgreSQL database; do not split frontend/backend or introduce microservices in Stage 1. | Preserves transactional consistency and minimizes V1 delivery complexity. | PROPOSED |
| S1-DEC-008 | Server boundaries | Use Server Components for secure reads, Server Actions for first-party mutations, and Route Handlers only for true HTTP integration boundaries. Keep business rules in application/domain modules. | Avoids a duplicate internal API and keeps authorization/transition logic reusable. | PROPOSED |
| S1-DEC-009 | Migrations | Define typed schema with Drizzle and store reviewed SQL migrations under `supabase/migrations/`, including RLS/policy changes. | Aligns Drizzle with the current Supabase migration workflow and keeps database changes versioned. | PROPOSED |
| S1-DEC-010 | Dependency policy | Use pnpm, stable mutually compatible packages, an active supported Node.js LTS, exact runtime/package-manager pins, and a committed lockfile. Do not use prereleases without a decision. | Reproducibility without freezing guessed versions before scaffolding. | PROPOSED |
| S1-DEC-011 | Technical routes | Permit `/auth/callback`, `/api/inngest`, `/api/health`, and the required `/api/outcomes/[outcomeId]/download` controlled-download boundary as non-product technical routes. They do not alter the 32-route product inventory. | Supports authentication, durable jobs, readiness and evidence-backed private download completion without creating a speculative internal API. Part 5 demonstrated the download boundary requirement. | PROPOSED |

## 5. Part 4 decisions awaiting review

| ID | Topic | Proposed decision | Reason | State |
|---|---|---|---|---|
| S1-DEC-012 | Visual foundation | Use Plus Jakarta Sans as the interface font and Source Code Pro as the monospace font; use the near-white, navy and Ultramarine token system, including primary #2337B8, defined in 'DESIGN-SYSTEM.md'. Use its semantic colours, spacing, border, radius, focus, button, input, table and shell tokens as the Stage 1 visual foundation. | APPROVED |
| S1-DEC-013 | Shell family | Use one shared visual language across public, auth, applicant, staff and admin shells; Officer and Supervisor share the staff shell while navigation is supplied from server-authorized grants. | Preserves the approved role/shell model and prevents client-side role inference. | APPROVED |
| S1-DEC-014 | Interface density | Use comfortable density for applicant journeys and compact density for staff/admin operations, with touch targets restored to at least 44×44 CSS px on coarse pointers. | Matches the reference hierarchy while retaining mobile and accessibility usability. | APPROVED |
| S1-DEC-015 | Component ownership | Use shadcn/Radix primitives in `components/ui`, shared visual composition in `components/*`, and domain components beside features. Do not introduce a second UI, table or chart library. | Keeps reusable behavior accessible without hiding domain rules in generic visual components. | APPROVED |
| S1-DEC-016 | Accessibility and states | Target WCAG 2.2 AA and require loading, empty, error, permission-denied and applicable stale-action behavior for every required page. | Implements AC-SCP-05–07 and prevents happy-path-only UI. | APPROVED |
| S1-DEC-017 | Reference scope filter | Treat the registered screenshots as visual hierarchy references only. Omit any visible route/control classified `LATER_V1`, `DEMO_ONLY` or `POSTPONED`, including broad workflow sharing/builders and enabled global search. | Prevents mockups from silently expanding the approved Stage 1 product. | APPROVED |

## 6. Part 5 decisions awaiting review

| ID | Topic | Proposed decision | Reason | State |
|---|---|---|---|---|
| S1-DEC-018 | Domain boundaries | Model Request as the coordinating aggregate; keep versioned configuration, Finance handoff, documents/outcomes and evidence as linked aggregates/contexts with named application commands. | Preserves ownership/history while avoiding page-owned rules or microservices. | PROPOSED |
| S1-DEC-019 | Tenant context | Use organization as the primary tenant boundary and narrow access by applicant ownership, department, assignment/claim or active handoff; require application authorization plus PostgreSQL/Storage RLS. | Implements the approved organization/department/file isolation model. | PROPOSED |
| S1-DEC-020 | Authentication boundary | Use Supabase Auth for identity/session only; resolve FAIDIA applicant identity, active memberships, profiles and grants server-side. Do not build general organization/role switching in Stage 1. | Prevents auth metadata or client claims from becoming authorization. | PROPOSED |
| S1-DEC-021 | Fixed roles and grants | Implement fixed roles/profile constants and one reviewed code registry derived exactly from the Stage 0 grant matrix; deny unknown/custom values. | Avoids a competing permission model and custom role scope. | PROPOSED |
| S1-DEC-022 | Status transitions | Use shared enums, named command transition policies and a separate server-side applicant-status mapper; prohibit generic status mutation. | Keeps internal workflow truth distinct from public presentation. | PROPOSED |
| S1-DEC-023 | Versioned service bundle | Publish a compatible immutable service/form/requirement/workflow bundle atomically; drafts/requests pin exact IDs and never auto-migrate. | Implements the approved configuration/versioning rules without a builder or migration engine. | PROPOSED |
| S1-DEC-024 | Seeded form registry | Implement the approved Transcript Request fields/requirements as a strict code-backed registry with versioned labels/help text and deterministic named conditions. | Allows limited safe admin editing without executable tenant-authored schema logic. | PROPOSED |
| S1-DEC-025 | Fixed workflow | Implement the eight approved logical steps through named commands/work items; do not introduce a generic workflow engine, transfer, parallelism or arbitrary branches. | Matches the vertical slice and Stage 1 exclusions. | PROPOSED |
| S1-DEC-026 | Finance handoff | Treat Finance referral as a limited child collaboration projection; Student Records remains parent owner. Reuse the same handoff only for `CANNOT_VERIFY` clarification and create a new one after decline or required HOLD recheck. | Preserves the approved result/history and access boundaries. | PROPOSED |
| S1-DEC-027 | Private files | Store applicant documents and outcomes in private Supabase Storage under opaque tenant/request/document keys; finalize uploads server-side and preserve replacement/revocation history. Malware scanning remains post-V1. | Implements file isolation without claiming postponed scanning. | PROPOSED |
| S1-DEC-028 | Controlled download | Issue a short-lived applicant/outcome-bound FAIDIA download token and stream the private outcome through `/api/outcomes/[outcomeId]/download`; record download only after successful private-object retrieval/response initiation, and record completion only for the first successful download from `OUTCOME_READY`. | A direct storage URL cannot prove the controlled-download completion trigger required by AC-CMP-01–02. | PROPOSED |

## 7. Part 6 decisions awaiting review

| ID | Topic | Proposed decision | Reason | State |
|---|---|---|---|---|
| S1-DEC-029 | Database tenant enforcement | Use shared-schema PostgreSQL with `organization_id` and tenant-safe composite foreign keys on tenant data. Run web/worker queries with `NO BYPASSRLS` roles and verified transaction-local actor context; application authorization remains primary. | Makes RLS meaningful with Drizzle direct connections and provides defence in depth against scoping errors. | PROPOSED |
| S1-DEC-030 | Relational/JSON boundary | Store ownership, versions, statuses, workflow, queues, handoffs, documents and reporting facts relationally. Limit JSONB to immutable response snapshots and schema-validated safe event/notification metadata. | Preserves queryability and constraints without turning the product into opaque JSON documents. | PROPOSED |
| S1-DEC-031 | Database conventions | Use UUID primary keys, UTC `timestamptz`, PostgreSQL enums for frozen operational values, `record_version` for optimistic concurrency, and organization-prefixed operational indexes. | Produces consistent migrations, stale-action protection and tenant-efficient queries. | PROPOSED |
| S1-DEC-032 | Database immutability | Enforce published configuration and immutable evidence with grants/constraints/triggers; corrections append superseding/history records rather than rewriting or deleting evidence. | Backs the approved versioning/audit/history rules with database enforcement. | PROPOSED |
| S1-DEC-033 | Duplicate serialization | Serialize duplicate-active submission checks with a deterministic PostgreSQL transaction advisory lock on organization/applicant/service, then record any authorized override explicitly. | A partial unique index cannot permit an approved override, while an unlocked check races under concurrent submissions. | PROPOSED |
| S1-DEC-034 | Download evidence data | Store only a hash of each short-lived outcome token and use a unique token-linked download record; first successful retrieval from `OUTCOME_READY` creates completion atomically, later downloads do not repeat completion. | Supports AC-CMP-01–02, token secrecy, retry idempotency and preserved download history. | PROPOSED |
| S1-DEC-035 | Retention/deletion posture | Use restrictive foreign keys and no ordinary hard-delete path for requests, files or immutable evidence. Defer purge/anonymization schedules until Security/retention approval; allow only explicit environment reset and safe orphan-upload cleanup. | Prevents accidental history loss before policy is defined. | PROPOSED |

## 8. Part 7 decisions awaiting review

| ID | Topic | Proposed decision | Reason | State |
|---|---|---|---|---|
| S1-DEC-036 | Notifications | Use a closed, schema-validated in-app notification registry written through transactional outbox intent; recipient links reauthorize target access and email remains disabled for the synthetic demo. | Covers every approved trigger without making delivery a workflow dependency or leaking internal data. | PROPOSED |
| S1-DEC-037 | SLA | Use pinned elapsed-clock SLA instances with deterministic synthetic targets and separate operational/SLA state; no business calendars, pauses or escalation ladders in Stage 1. | Produces testable real metrics without presenting synthetic values as institutional commitments. | PROPOSED |
| S1-DEC-038 | Audit envelope | Use the exact required event registry with immutable, versioned safe metadata, actor/system/correlation/causation context and separate applicant-safe projections. | Completes audit evidence while preventing raw private content from becoming event metadata. | PROPOSED |
| S1-DEC-039 | Reporting definitions | Calculate required metrics server-side from durable timestamps with declared period, denominator, timezone and incomplete counts; Organization Admin receives aggregates only. | Prevents fabricated/ambiguous totals and permission leakage. | PROPOSED |
| S1-DEC-040 | Validation analytics | Use a minimal privacy-safe event registry for funnel validation while keeping domain/audit facts authoritative; off-platform reduction claims require explicit pilot evidence. | Separates product validation from immutable operational truth. | PROPOSED |
| S1-DEC-041 | Feature flags | Use a closed organization-scoped server registry, unknown-default-off; flags cannot grant permissions or promote unapproved routes/features. | Prevents flags from becoming hidden product policy or authorization. | PROPOSED |
| S1-DEC-042 | Commands/errors | Expose only named Server Actions plus the four approved technical handlers, with typed safe results, version/idempotency checks and the documented Finance-cancellation boundary; expose no request-cancel command. | Makes the API implementable without generic status mutation or invented cancellation policy. | PROPOSED |

## 9. Parts 8–9 decisions awaiting review

| ID | Topic | Proposed decision | Reason | State |
|---|---|---|---|---|
| S1-DEC-043 | Security baseline | Apply deny-by-default server authorization plus RLS/Storage defence in depth, private files, closed validation, safe headers/logging and an explicit stronger external-pilot hardening gate. | Implements AC-SEC-01–11 without overstating synthetic-demo production readiness. | PROPOSED |
| S1-DEC-044 | Test gate | Require unit/component/database/integration/authorization/E2E layers, deterministic fixtures, complete acceptance/transition/permission coverage and non-flaky CI gates. | Makes denied access and recovery first-class acceptance evidence. | PROPOSED |
| S1-DEC-045 | Seed contract | Use repeatable synthetic-only configuration and coherent lifecycle fixtures, including a second isolation organization and injected reference time. | Enables accurate demonstrations/tests without real data or drifting overdue states. | PROPOSED |
| S1-DEC-046 | Environments/deployment | Separate local/test/preview/staging/production configuration/data/credentials and control application releases independently from reviewed forward-compatible migrations. | Prevents production leakage, automatic destructive migration and unverifiable releases. | PROPOSED |
| S1-DEC-047 | Definition of done | Keep Documentation, Implementation and External-Pilot gates distinct; unresolved decisions, contradictions or critical acceptance/security failures block completion. | Prevents a finished Markdown batch or successful build from being mistaken for validated product readiness. | PROPOSED |
| S1-DEC-048 | Coding-agent governance | Require authority-first reading, approved-decision checks, minimal scoped changes, negative tests and evidence-based handoff; agents may not approve decisions or infer scope from mockups. | Makes the documentation executable without transferring product authority to an AI/coding agent. | PROPOSED |

## 10. No open product decisions introduced

Parts 1 and 2 translate approved Stage 0 behavior. They do not intentionally introduce a new role, route, permission, status, workflow branch, completion method or product feature.

If product-owner review changes one of those areas, update the relevant Stage 0 controlling document and decision register before approving the affected acceptance requirement.

## 11. Approval record

The product owner approved Parts 1 and 2 together on 2026-07-14. This approval includes S1-DEC-001 through S1-DEC-005 and version 1.0 of the acceptance contract.

Part 3 remains unapproved until the product owner approves or corrects S1-DEC-006 through S1-DEC-011 and the four Part 3 documents.

The product owner directed Part 4 drafting on 2026-07-14. This did not explicitly approve Part 3. Part 4 remains unapproved until the product owner approves or corrects S1-DEC-012 through S1-DEC-017 and the two Part 4 documents.

The product owner directed Part 5 drafting while revising Part 4 on 2026-07-14. At that time this authorized a review draft only.

The product owner approved the Part 5 document set on 2026-07-14 but explicitly left S1-DEC-018 through S1-DEC-028 pending. The files are approved for continued documentation sequencing, not approved for application implementation where a pending decision controls the design. The decisions remain `PROPOSED` until separately approved or corrected.

The product owner then directed Part 6 drafting. S1-DEC-029 through S1-DEC-035 and both Part 6 documents remain unapproved review material.

The product owner directed Parts 7 through 11 drafting together on 2026-07-14 and requested accuracy. This authorizes review drafts only. S1-DEC-036 through S1-DEC-048 remain proposed. The final contradiction audit cannot pass the implementation gate while earlier parts and controlling decisions remain pending.

## 12. Coding-agent instruction

Do not treat a `PROPOSED` decision as authority to contradict approved Stage 0 documentation. Stop on conflicts and request a documentation decision.
