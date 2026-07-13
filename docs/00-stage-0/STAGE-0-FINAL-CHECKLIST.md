# FAIDIA Source of Truth

**Status:** APPROVED_FOR_STAGE_1  
**Version:** 1.4  
**Last updated:** 2026-07-13  
**Canonical path:** `docs/SOURCE-OF-TRUTH.md`  
**Applies to:** FAIDIA V1, beginning with the Stage 1 Transcript Request vertical slice  
**Primary use:** Product definition, implementation control, prompt building, and change governance

## 1. Canonical-file rule

This is the only canonical FAIDIA Source of Truth.

The following files must not exist as competing copies:

- `/SOURCE-OF-TRUTH.md`
- `docs/00-stage-0/SOURCE-OF-TRUTH.md`
- `docs/00-stage-0/SOURCE-OF-TRUTH-v0.2.md`

A coding agent must stop if more than one active Source of Truth is found.

## 2. Authority order

When documents, prompts, screenshots, prototypes, chat history, or code disagree, use this order:

1. `docs/SOURCE-OF-TRUTH.md`
2. `docs/00-stage-0/STAGE-0-APPROVED-DECISION-REGISTER.md`
3. the controlling Stage 0 domain document listed in Section 7
4. later approved architecture and implementation documents
5. approved design references
6. current implementation
7. exploratory prompts, screenshots, old prototypes, and chat history

A conflict that changes scope, database structure, routes, permissions, workflow, statuses, or navigation must be resolved in Markdown before code changes.

## 3. Stage boundary

**Stage 1 means the first complete Transcript Request vertical slice. It does not mean the entire V1 platform.**

Page classifications are:

- `STAGE_1_REQUIRED` — must work with real data, server-side authorization, and the approved behavior before Stage 1 is complete.
- `LATER_V1` — required before the complete V1 release or external pilot, but not required to finish Stage 1.
- `DEMO_ONLY` — may use seeded or simplified behavior and must not become a dependency of the vertical slice.
- `POSTPONED` — outside V1.

The exact route and page boundary is controlled by `docs/00-stage-0/PAGE-INVENTORY.md`.

## 4. Frozen Stage 1 product decisions

- Product category: Service Operations Platform.
- Target institution: Kenyan TVET, technical college, or small private college.
- Demo organization: Savannah Technical College.
- Fully functional service: Transcript Request.
- Demonstration services: Student Clearance Request and Certificate Replacement Request.
- Departments: Student Records, Finance, Registrar.
- Main cross-department mechanism: referral only; transfer is postponed.
- Finance checks whether a hold blocks transcript issuance.
- Finance result codes: `CLEAR`, `HOLD`, `CANNOT_VERIFY`.
- Finance `HOLD` returns the request to applicant action; it does not automatically reject.
- Registrar approval is required for every Transcript Request.
- Registrar is a `SUPERVISOR` membership profile labelled Registrar, not a separate top-level role.
- Ordinary Officers cannot approve, reject, return an approval for clarification, reopen a final request, or manually close a request.
- Supervisors use the shared Officer processing shell with supervisor-only navigation and controls.
- The Registrar approval queue is `/supervisor/approvals`.
- Selecting a Registrar approval item opens `/officer/requests/[id]`.
- Registrar approval, rejection, and return-for-clarification actions are embedded in `/officer/requests/[id]`.
- These actions are shown only to a Registrar-profile Supervisor and must always be authorized server-side.
- `/officer/requests/[id]/approval` is not a valid Stage 1 route.
- Organization Admin does not receive sensitive request, document, message, or internal-note access in V1.
- Applicant documents use `ACCEPTED`, not `APPROVED`.
- Assignment lives on work items; there is no parent request `ASSIGNED` status.
- Outcome delivery methods are controlled download or physical collection.
- Completion occurs only through a recorded controlled download, recorded physical collection, or exceptional Supervisor manual closure.
- `Expired` is an approved applicant-visible status.
- Reopening is controlled by Supervisor permission, requires a reason, preserves all previous decisions/outcomes/history, and returns the request to `IN_REVIEW`.
- In-app notifications are required for Stage 1; email is required before an external pilot.
- Synthetic demo data is used first.

### Shared staff shell and Registrar route

Officers and Supervisors use one shared staff processing shell.

Supervisors receive additional navigation items and controls according to their active membership profile and exact permissions.

The Registrar approval flow is:

```text
/supervisor/approvals
→ /officer/requests/[id]
→ embedded Registrar decision panel

## 5. Stage 1 configuration model

Stage 1 uses a **seeded Transcript Request template with limited safe editing**.

Seeded and fixed for Stage 1:

- form field structure and supported field types;
- document requirement structure;
- workflow step order;
- Finance result schema;
- approval requirement;
- outcome method options;
- status transitions;
- role bundles and permission grants.

Organization Admin may edit only:

- organization name, logo, and primary brand color;
- service display name and public description;
- eligibility and requirements explanatory text;
- processing target;
- service active/inactive state;
- whether the manual payment reference is enabled and required;
- labels/help text for existing seeded form fields and document requirements.

Organization Admin may not add, remove, reorder, branch, script, or arbitrarily reconfigure form fields, document rules, workflow steps, statuses, permissions, or approval rules during Stage 1.

## 6. Versioning and request pinning

- Published service, form, document-requirement, and workflow versions are immutable.
- Editing a published configuration creates a new draft version.
- Only an Organization Admin with the relevant publish permission may publish.
- New requests use the latest published version.
- A request stores its version IDs at draft creation and retains them after submission.
- Existing submitted requests never migrate automatically.
- Existing drafts remain pinned to their original version.
- If the pinned version is retired before submission, the draft becomes read-only and the applicant must start a new draft.
- Stage 1 has no automatic draft or active-request migration.

## 7. Controlling documents

| Product area | Authoritative file |
|---|---|
| Master authority and frozen decisions | `docs/SOURCE-OF-TRUTH.md` |
| V1 product, Stage 1 boundary, configuration | `docs/00-stage-0/STAGE-0-V1-SPECIFICATION.md` |
| Current manual process and pilot assumptions | `docs/00-stage-0/CURRENT-PROCESS.md` |
| End-to-end Transcript Request workflow | `docs/00-stage-0/V1-VERTICAL-SLICE.md` |
| Roles, grants, scopes, and access boundaries | `docs/00-stage-0/ROLE-PERMISSIONS-MATRIX.md` |
| Internal and applicant-visible statuses | `docs/00-stage-0/STATUS-MAPPINGS.md` |
| Routes, pages, classifications, navigation | `docs/00-stage-0/PAGE-INVENTORY.md` |
| Stage 1 and V1 exclusions | `docs/00-stage-0/V1-NON-GOALS.md` |
| Post-V1 features | `docs/00-stage-0/POST-V1-BACKLOG.md` |
| Approved decision history | `docs/00-stage-0/DECISION-LOG.md` |
| Concise controlling decision register | `docs/00-stage-0/STAGE-0-APPROVED-DECISION-REGISTER.md` |
| Visual direction and exact asset paths | `docs/00-stage-0/DESIGN-REFERENCE-REGISTER.md` |
| Final completeness result | `docs/00-stage-0/STAGE-0-COMPLETENESS-AUDIT.md` |

## 8. Mandatory reading before implementation

Before any Stage 1 build task, read:

- `docs/SOURCE-OF-TRUTH.md`
- `docs/00-stage-0/STAGE-0-V1-SPECIFICATION.md`
- `docs/00-stage-0/V1-VERTICAL-SLICE.md`
- `docs/00-stage-0/ROLE-PERMISSIONS-MATRIX.md`
- `docs/00-stage-0/STATUS-MAPPINGS.md`
- `docs/00-stage-0/PAGE-INVENTORY.md`
- `docs/00-stage-0/V1-NON-GOALS.md`

Read the remaining Stage 0 documents when relevant.

## 9. Implementation guardrails

Coding agents must not:

- treat all V1 pages as Stage 1 work;
- build `LATER_V1`, `DEMO_ONLY`, or `POSTPONED` routes without explicit authorization;
- create a full visual form or workflow builder in Stage 1;
- allow ordinary Officers to approve, reject, reopen, or manually close;
- expose request content to Organization Admin;
- expose internal notes, private Finance detail, or raw handoff data to applicants;
- mutate published versions;
- migrate active requests to new versions automatically;
- use applicant-visible labels as internal business logic;
- implement transfer, standalone payment pages, public verification, AI routing, OCR, or custom report builders.

Coding agents must:

- enforce authorization server-side;
- preserve organization and department isolation;
- validate workflow transitions on the server;
- use transactions for critical state changes;
- preserve immutable status, decision, handoff, outcome, and audit history;
- derive reporting from real timestamps and events;
- fail safely on stale or repeated actions.

## 9A. Staff shell and approval-route rule

FAIDIA Stage 1 uses one shared staff processing shell for Officers and Supervisors.

Supervisors receive additional navigation items and controls according to their exact permissions and membership profile. They do not receive a duplicated request-processing shell.

The Registrar workflow is:

```text
/supervisor/approvals
→ /officer/requests/[id]
→ embedded Registrar decision panel

## 10. Stage 0 approval

Stage 0 is approved for Stage 1.

Approval is limited to the Stage 1 vertical slice and the decisions recorded in version 1.4, including DEC-046 through DEC-050. Any later change to scope, data model, route classification, permission grants, workflow, status transitions, versioning, navigation, completion, or reopening must update the relevant Markdown documents before implementation.