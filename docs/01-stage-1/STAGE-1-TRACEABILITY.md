# FAIDIA Stage 1 — Traceability Register

**Status:** PARTS_1_2_5_APPROVED; PARTS_3_4_6_7_8_9_10_11_READY_FOR_REVIEW; FINAL_GATE_BLOCKED  
**Version:** 1.5  
**Last updated:** 2026-07-14  
**Product:** FAIDIA — Service Operations Platform  
**Authority:** `docs/SOURCE-OF-TRUTH.md`, approved Stage 0 documents and `docs/01-stage-1/ACCEPTANCE-CRITERIA.md`

## 1. Purpose

This register prevents requirements from becoming disconnected from their approved source or later implementation.

Parts 1 and 2 establish source-to-acceptance traceability. Later documentation parts must add exact routes, domain rules, tables, actions, events, components and tests. Empty future columns mean “not designed yet,” not permission for a coding agent to guess.

## 2. Authority map

| Subject | Controlling source |
|---|---|
| Canonical rules and stage boundary | `docs/SOURCE-OF-TRUTH.md` |
| Frozen implementation decisions | `docs/00-stage-0/STAGE-0-APPROVED-DECISION-REGISTER.md` |
| Product, service, configuration, form, documents, outcome and completion | `docs/00-stage-0/STAGE-0-V1-SPECIFICATION.md` |
| End-to-end workflow and required events | `docs/00-stage-0/V1-VERTICAL-SLICE.md` |
| Routes, pages, embedded sections and classifications | `docs/00-stage-0/PAGE-INVENTORY.md` |
| Roles, profiles, permission grants and access boundaries | `docs/00-stage-0/ROLE-PERMISSIONS-MATRIX.md` |
| Status values, mappings and transitions | `docs/00-stage-0/STATUS-MAPPINGS.md` |
| Exclusions | `docs/00-stage-0/V1-NON-GOALS.md` |
| Visual direction and reference assets | `docs/00-stage-0/DESIGN-REFERENCE-REGISTER.md` |
| Historical approved decisions | `docs/00-stage-0/DECISION-LOG.md` |
| Proposed Stage 1 architecture | `docs/01-stage-1/architecture/ARCHITECTURE.md` |
| Proposed Stage 1 stack | `docs/01-stage-1/architecture/TECH-STACK.md` |
| Proposed Stage 1 folder boundaries | `docs/01-stage-1/architecture/PROJECT-STRUCTURE.md` |
| Proposed Stage 1 product/technical routes | `docs/01-stage-1/architecture/ROUTES.md` |
| Proposed Stage 1 design rules | `docs/01-stage-1/interface/DESIGN-SYSTEM.md` |
| Proposed Stage 1 component contracts | `docs/01-stage-1/interface/COMPONENTS.md` |
| Proposed domain/aggregate boundaries | `docs/01-stage-1/domain/DOMAIN-MODEL.md` |
| Proposed tenancy and authentication | `docs/01-stage-1/domain/TENANCY.md`; `AUTHENTICATION.md` |
| Proposed fixed roles, grants and states | `docs/01-stage-1/domain/ROLES.md`; `PERMISSIONS.md`; `STATUSES.md` |
| Proposed service/form/workflow contracts | `docs/01-stage-1/domain/SERVICES.md`; `FORM-SCHEMAS.md`; `WORKFLOWS.md` |
| Proposed handoff/document contracts | `docs/01-stage-1/domain/HANDOFFS.md`; `DOCUMENTS.md` |
| Proposed physical database contract | `docs/01-stage-1/data/DATABASE.md` |
| Proposed table/column dictionary | `docs/01-stage-1/data/DATA-DICTIONARY.md` |
| Proposed notifications, SLA, audit, reporting, analytics, flags, APIs and errors | `docs/01-stage-1/operations/` |
| Proposed security and testing contracts | `docs/01-stage-1/quality/` |
| Proposed seed, environment, deployment and done gates | `docs/01-stage-1/delivery/` |
| Proposed coding-agent governance/change records | `docs/01-stage-1/governance/` |
| Proposed pilot/validation/feedback/limitations records | `docs/01-stage-1/validation/` |

## 3. Acceptance-group traceability

| Acceptance range | Subject | Primary Stage 0 source | Important decisions | Future implementation documents |
|---|---|---|---|---|
| AC-PRE-01–12 | Seed organization, service, versions and configuration | V1 Product Specification §§3–12; Vertical Slice §§3–5 | DEC-002, 008, 010, 013, 034, 035 | ARCHITECTURE, DOMAIN-MODEL, SERVICES, FORM-SCHEMAS, DATABASE, SEED-DATA |
| AC-DIS-01–06 | Public discovery | Page Inventory §4; Vertical Slice §6 Phase 1 | DEC-034, 042 | ROUTES, SERVICES, API-CONTRACTS, TESTING |
| AC-AUT-01–07 | Registration, sign-in and draft | Vertical Slice §6 Phase 2; Role Permissions Matrix | DEC-012, 015, 035 | AUTHENTICATION, TENANCY, DATABASE, API-CONTRACTS, TESTING |
| AC-SUB-01–15 | Form, uploads, duplicate check and submission | V1 Product Specification §§7–9; Vertical Slice §6 Phase 3 | DEC-008, 010, 011, 013, 014, 020, 035, 037 | FORM-SCHEMAS, DOCUMENTS, WORKFLOWS, DATABASE, API-CONTRACTS, SECURITY, TESTING |
| AC-REV-01–07 | Student Records review | Vertical Slice §6 Phase 4; Role Permissions Matrix | DEC-016, 019, 036, 047 | ROUTES, AUTHENTICATION, WORKFLOWS, API-CONTRACTS, SECURITY, TESTING |
| AC-COR-01–08 | Correction and resubmission | Vertical Slice §6 Phase 5; Status Mappings | DEC-020, 022, 027 | FORM-SCHEMAS, DOCUMENTS, WORKFLOWS, NOTIFICATIONS, AUDIT-LOG, TESTING |
| AC-FIN-01–15 | Finance referral | Vertical Slice §6 Phase 6; Role Permissions Matrix §8; Status Mappings §8 | DEC-001, 003, 004, 019, 021 | HANDOFFS, WORKFLOWS, TENANCY, DATABASE, API-CONTRACTS, SECURITY, TESTING |
| AC-REG-01–13 | Records completion and Registrar decision | Vertical Slice §§6–8; Role Permissions Matrix §§3, 7, 9 | DEC-017, 036, 046, 047 | ROUTES, WORKFLOWS, AUTHENTICATION, API-CONTRACTS, AUDIT-LOG, SECURITY, TESTING |
| AC-OUT-01–08 | Outcome preparation and issue | V1 Product Specification §13; Vertical Slice §6 Phase 9 | DEC-005, 006, 023 | DOCUMENTS, WORKFLOWS, DATABASE, ERROR-HANDLING, NOTIFICATIONS, TESTING |
| AC-CMP-01–15 | Completion, reopening, revocation and expiry | V1 Product Specification §§13–14; Vertical Slice §§6–8; Status Mappings §§4–5 | DEC-007, 009, 012, 038, 039, 040 | WORKFLOWS, DOCUMENTS, API-CONTRACTS, AUDIT-LOG, SECURITY, TESTING |
| AC-NOT-01–05 | Notifications | Vertical Slice §9; Decision Log DEC-027 | DEC-027 | NOTIFICATIONS, API-CONTRACTS, ERROR-HANDLING, TESTING |
| AC-AUD-01–06 | Audit and immutable history | Vertical Slice §10; Role Permissions Matrix §7 | DEC-021, 022, 035, 038, 039 | AUDIT-LOG, DATABASE, API-CONTRACTS, SECURITY, TESTING |
| AC-REP-01–05 | Management visibility | Vertical Slice §11; Design Reference Register | DEC-023, 029 | REPORTING-ANALYTICS, DATABASE, DESIGN-SYSTEM, COMPONENTS, TESTING |
| AC-SEC-01–11 | Security and isolation | Vertical Slice §12; Role Permissions Matrix §§2–11 | DEC-018, 036, 037, 046, 047 | TENANCY, AUTHENTICATION, DATABASE, DOCUMENTS, SECURITY, TESTING |
| AC-SCP-01–07 | Scope, states, responsiveness and accessibility | Page Inventory §§1–14; V1 Non-Goals | DEC-029, 033, 041, 042 | ROUTES, DESIGN-SYSTEM, COMPONENTS, DEFINITION-OF-DONE, TESTING |

## 3A. Part 3 route and architecture mapping

| Acceptance range | Route/UI mapping | Architecture boundary | Part 3 state |
|---|---|---|---|
| AC-PRE-01–12 | Admin service/organization routes and applicant start route in `ROUTES.md` §§5, 8 | Versioned configuration, database transactions and seeds | READY_FOR_REVIEW |
| AC-DIS-01–06 | Public routes in `ROUTES.md` §4 | Public Server Components and published-version queries | READY_FOR_REVIEW |
| AC-AUT-01–07 | Auth and applicant start routes in `ROUTES.md` §§4–5 | Supabase Auth identity, SSR session and FAIDIA authorization | READY_FOR_REVIEW |
| AC-SUB-01–15 | Applicant form/document/review/submitted routes in `ROUTES.md` §5 | Server Actions, application commands, transaction/audit/outbox | READY_FOR_REVIEW |
| AC-REV-01–07 | Officer dashboard/queues/request route in `ROUTES.md` §6 | Shared staff shell and scoped application queries | READY_FOR_REVIEW |
| AC-COR-01–08 | Applicant correction and embedded staff actions in `ROUTES.md` §§5, 9 | Transactional correction command and private storage | READY_FOR_REVIEW |
| AC-FIN-01–15 | Referral and handoff routes in `ROUTES.md` §6 | Coordinating ownership plus limited handoff authorization | READY_FOR_REVIEW |
| AC-REG-01–13 | Supervisor approval queue and shared request route in `ROUTES.md` §§6–7, 9 | Exact server authorization; embedded decision commands | READY_FOR_REVIEW |
| AC-OUT-01–08 | Applicant outcome and staff request routes in `ROUTES.md` §§5–6 | Private Storage and selective Inngest execution | READY_FOR_REVIEW |
| AC-CMP-01–15 | Applicant outcome and shared request routes in `ROUTES.md` §§5–6 | Transactional commands, signed access and concurrency checks | READY_FOR_REVIEW |
| AC-NOT-01–05 | Applicant/staff notification routes in `ROUTES.md` §§5–6 | PostgreSQL notification records plus optional background delivery | READY_FOR_REVIEW |
| AC-AUD-01–06 | Applicant timeline and staff request route in `ROUTES.md` §9 | Append-only transactional audit boundary | READY_FOR_REVIEW |
| AC-REP-01–05 | Supervisor dashboard in `ROUTES.md` §7 | Server aggregate queries and Recharts presentation | READY_FOR_REVIEW |
| AC-SEC-01–11 | All route-group gates in `ROUTES.md` §3 | App authorization plus PostgreSQL/Storage RLS defence in depth | READY_FOR_REVIEW |
| AC-SCP-01–07 | Full product/embedded inventory in `ROUTES.md` §§4–14 | Modular monolith, route groups and page-state contracts | READY_FOR_REVIEW |

## 3B. Part 4 design and component mapping

| Acceptance range | Design/component coverage | Part 4 state |
|---|---|---|
| AC-DIS-01–06 | Public shell, published `ServiceCard`/`ServiceDetails`, universal states | READY_FOR_REVIEW |
| AC-AUT-01–07 | Auth shell/forms, applicant shell and dashboard summary | READY_FOR_REVIEW |
| AC-SUB-01–15 | `RequestStepper`, form sections, uploads, review snapshot, duplicate notice and submit feedback | READY_FOR_REVIEW |
| AC-REV-01–07 | Staff shell, queue components and request-processing workspace | READY_FOR_REVIEW |
| AC-COR-01–08 | Correction dialog/panel, document history and stale-action handling | READY_FOR_REVIEW |
| AC-FIN-01–15 | Finance-limited handoff inbox/details/actions and decision panel | READY_FOR_REVIEW |
| AC-REG-01–13 | Work completion and embedded `RegistrarDecisionPanel` | READY_FOR_REVIEW |
| AC-OUT-01–08 | Outcome generation failure/retry and applicant `OutcomeCard` | READY_FOR_REVIEW |
| AC-CMP-01–15 | Controlled download, completion, reopen and revoke components | READY_FOR_REVIEW |
| AC-NOT-01–05 | Notification control, alerts, toasts and durable page feedback | READY_FOR_REVIEW |
| AC-AUD-01–06 | Separate applicant-safe and operational timeline components | READY_FOR_REVIEW |
| AC-REP-01–05 | Real metric cards, Recharts wrappers, accessible summaries and freshness labels | READY_FOR_REVIEW |
| AC-SEC-01–11 | Server-supplied safe view models/actions and denied/not-found states | READY_FOR_REVIEW |
| AC-SCP-01–07 | Shell scope filtering, all page states, responsive alternatives and WCAG 2.2 AA contract | READY_FOR_REVIEW |

## 3C. Part 5 domain mapping

| Acceptance range | Principal Part 5 contracts | Part 5 state |
|---|---|---|
| AC-PRE-01–12 | `SERVICES`, `FORM-SCHEMAS`, `WORKFLOWS`, fixed roles/memberships and immutable version pins | APPROVED; DECISIONS_PENDING |
| AC-DIS-01–06 | `SERVICES` published public projection and trusted organization slug | APPROVED; DECISIONS_PENDING |
| AC-AUT-01–07 | `AUTHENTICATION`, `TENANCY`, applicant ownership and `CreateDraft` | APPROVED; DECISIONS_PENDING |
| AC-SUB-01–15 | seeded form/requirements, private documents, snapshots, duplicate/idempotent submission and workflow creation | APPROVED; DECISIONS_PENDING |
| AC-REV-01–07 | permission pipeline, department/assignment scope, work items and internal-note boundary | APPROVED; DECISIONS_PENDING |
| AC-COR-01–08 | correction unlock allowlist, document replacement, snapshots and named transitions | APPROVED; DECISIONS_PENDING |
| AC-FIN-01–15 | limited Finance projection, exact handoff lifecycle/results and parent ownership | APPROVED; DECISIONS_PENDING |
| AC-REG-01–13 | Records prerequisites, Registrar profile/grants, immutable decisions and workflow transitions | APPROVED; DECISIONS_PENDING |
| AC-OUT-01–08 | private issued-outcome lifecycle, failure/retry/checksum and issue transition | APPROVED; DECISIONS_PENDING |
| AC-CMP-01–15 | controlled-download route/token, collection/manual closure, reopen/revoke and expiry | APPROVED; DECISIONS_PENDING |
| AC-NOT-01–05 | durable notification/outbox obligations embedded in successful commands; content boundary | APPROVED; DECISIONS_PENDING |
| AC-AUD-01–06 | append-only history/evidence obligations and applicant-safe projections | APPROVED; DECISIONS_PENDING |
| AC-REP-01–05 | persisted stage facts and aggregate-safe organization/department scope | APPROVED; DECISIONS_PENDING |
| AC-SEC-01–11 | actor context, application authorization, tenant/resource scope, private storage and RLS defence | APPROVED; DECISIONS_PENDING |
| AC-SCP-01–07 | fixed scope/no builders, safe query models and named command boundaries | APPROVED; DECISIONS_PENDING |

## 3D. Part 6 data mapping

| Acceptance range | Principal Part 6 records/constraints | Part 6 state |
|---|---|---|
| AC-PRE-01–12 | organization/departments/memberships; immutable configuration versions/publication; request version pins | READY_FOR_REVIEW |
| AC-DIS-01–06 | active organization/service/current publication and public-safe published projections | READY_FOR_REVIEW |
| AC-AUT-01–07 | auth-linked user/applicant profiles, tenant ownership, draft answers/request timestamps | READY_FOR_REVIEW |
| AC-SUB-01–15 | request/draft/snapshot/document/version records, duplicate override and serialized submission transaction | READY_FOR_REVIEW |
| AC-REV-01–07 | membership departments, work items/assignments, internal-note isolation and review timestamps | READY_FOR_REVIEW |
| AC-COR-01–08 | corrections/unlocked field/document rows, snapshots, document replacement/status history | READY_FOR_REVIEW |
| AC-FIN-01–15 | handoffs, explicit documents, history, Finance results and timing timestamps | READY_FOR_REVIEW |
| AC-REG-01–13 | work prerequisites, immutable decisions, approval status history and timestamps | READY_FOR_REVIEW |
| AC-OUT-01–08 | issued outcomes, generation attempts, private file versions, checksums and failure history | READY_FOR_REVIEW |
| AC-CMP-01–15 | token hashes/downloads, completions, collection/closure, reopening/revocation and expiry facts | READY_FOR_REVIEW |
| AC-NOT-01–05 | notifications and transactional outbox with idempotency/delivery state | READY_FOR_REVIEW |
| AC-AUD-01–06 | append-only audit/status/assignment/handoff/document/decision evidence | READY_FOR_REVIEW |
| AC-REP-01–05 | explicit lifecycle timestamps, SLA instances, relational queue/report indexes and completion counters | READY_FOR_REVIEW |
| AC-SEC-01–11 | organization columns/composite FKs, non-bypass roles, RLS, private storage and restrictive deletion | READY_FOR_REVIEW |
| AC-SCP-01–07 | no lower-scope table families; safe projections support required pages/states | READY_FOR_REVIEW |

## 4. Required audit-event coverage

`operations/AUDIT-LOG.md`, `API-CONTRACTS.md` and `quality/TESTING.md` map every event below to a successful named action, immutable evidence and required test family:

`REQUEST_CREATED`, `REQUEST_SUBMITTED`, `DUPLICATE_REQUEST_OVERRIDE_GRANTED`, `REQUEST_VIEWED`, `REVIEW_STARTED`, `DOCUMENT_UPLOADED`, `DOCUMENT_REJECTED`, `DOCUMENT_ACCEPTED`, `CORRECTION_REQUESTED`, `CORRECTION_RESUBMITTED`, `HANDOFF_CREATED`, `HANDOFF_ACCEPTED`, `HANDOFF_DECLINED`, `HANDOFF_RETURNED_FOR_CLARIFICATION`, `HANDOFF_COMPLETED`, `WORK_ITEM_COMPLETED`, `REQUEST_APPROVED`, `REQUEST_RETURNED_FOR_CLARIFICATION`, `REQUEST_REJECTED`, `OUTCOME_GENERATED`, `OUTCOME_GENERATION_FAILED`, `DOCUMENT_ISSUED`, `DOCUMENT_DOWNLOADED`, `OUTCOME_COLLECTED`, `REQUEST_MANUALLY_CLOSED`, `REQUEST_COMPLETED`, `REQUEST_REOPENED`, `DOCUMENT_REVOKED`, `REQUEST_EXPIRED`.

## 5. Required notification coverage

`operations/NOTIFICATIONS.md`, API contracts and tests cover:

- submission confirmation;
- correction request and resubmission;
- Finance referral creation and acceptance;
- Finance clarification, decline, completion and HOLD applicant action;
- approval, rejection and return for clarification;
- outcome ready;
- expiry;
- completion;
- reopening;
- overdue warning.

## 5A. Parts 7–8 action, event and test mapping

| Acceptance range | Part 7 action/event authority | Part 8 test/security authority | State |
|---|---|---|---|
| AC-PRE/DIS/AUT | named draft/auth query boundaries; feature publication guards | seed integrity, auth/route and environment-isolation suites | READY_FOR_REVIEW |
| AC-SUB/REV/COR | draft/upload/submission/review/correction commands; required audit/notification keys | transaction, duplicate-race, Storage, department/ownership and correction E2E suites | READY_FOR_REVIEW |
| AC-FIN | closed Finance handoff commands including eligible cancellation; handoff events/notifications/SLA clocks | full result/lifecycle, parent-ownership, projection, stale and cross-department suites | READY_FOR_REVIEW |
| AC-REG/OUT/CMP | named decision/outcome/completion/reopen/revoke/expire commands and events | profile denial, job failure/retry, controlled download and all completion method suites | READY_FOR_REVIEW |
| AC-NOT/AUD | keyed notification registry and exact 29-event registry | recipient isolation, dedup/failure, immutability and safe-projection suites | READY_FOR_REVIEW |
| AC-REP | server metric formulas, privacy-safe analytics and SLA definitions | query denominator, empty/incomplete, scope and accessible-chart suites | READY_FOR_REVIEW |
| AC-SEC/SCP | typed errors, server authorization and closed feature/command scope | full authorization matrix, RLS/Storage, route exclusion, page-state/accessibility suites | READY_FOR_REVIEW |

## 6. Future row-level traceability format

Beginning with Part 3, important requirements must be expanded using:

| Acceptance ID | Route/UI | Domain rule | Data records | Action/API | Events | Test IDs | State |
|---|---|---|---|---|---|---|---|
| AC-XXX-00 | Not designed | Not designed | Not designed | Not designed | Not designed | Not designed | PENDING |

Do not mark a requirement `IMPLEMENTATION_READY` until every applicable cell is populated and contradiction-checked.

## 7. Current traceability status

- [x] Every acceptance group has an approved Stage 0 source.
- [x] Important Stage 0 decisions are linked to acceptance groups.
- [x] Required audit-event inventory is recorded.
- [x] Required notification inventory is recorded.
- [x] Future traceability format is defined.
- [x] Product owner approved the Parts 1 and 2 foundation on 2026-07-14.
- [x] Initial applicable route/UI and architecture mappings added for every acceptance range — Part 3 review version.
- [x] Initial applicable design-system and component mappings added for every acceptance range — Part 4 review version.
- [x] Initial applicable domain, tenant, auth, role, permission, status, service, form, workflow, handoff and document mappings added — Part 5 approved for sequencing; decisions pending.
- [x] Initial physical records, constraints, indexes, RLS and evidence mappings added — Part 6 review version.
- [x] Domain rules and data records mapped — Parts 5 and 6; implementation readiness awaits pending decisions and Part 6 approval.
- [x] Actions and events mapped — Part 7 review version.
- [x] Tests/security/delivery gates mapped — Part 8 review version.
- [x] Coding-agent and pilot/change records mapped — Parts 9–10 review versions.
- [x] Part 11 consistency audit completed.
- [ ] Full Documentation Gate passed — blocked by the pending approvals/decisions listed in `STAGE-1-CONTRADICTION-AUDIT.md`.

## 8. Coding-agent instruction

The foundation status does not authorize implementation. A missing future mapping is a documentation task, not an invitation to infer a technical design.
