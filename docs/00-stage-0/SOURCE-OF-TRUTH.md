# FAIDIA Source of Truth

**Status:** APPROVED_FOR_V1  
**Version:** 1.2
**Last updated:** 2026-07-13  
**Applies to:** FAIDIA V1 / Stage 0  
**Primary use:** Product definition, prompt building, implementation control, and change tracking

## 1. Purpose

This file is the master index for the FAIDIA V1 documentation system. It tells developers, designers, AI coding agents, and product contributors which files control each part of the product and how conflicts are resolved.

The canonical file is `docs/SOURCE-OF-TRUTH.md`. This synchronized Stage 0 copy is retained for the downloadable Stage 0 pack.

## 2. Core Authority Rule

When there is a conflict between chat, prompts, screenshots, old prototypes, implementation choices, and Markdown source files, use this priority order:

1. Approved source-of-truth Markdown files.
2. Latest approved product decision.
3. Current implementation constraints.
4. Design references.
5. Chat history and exploratory ideas.

If a conflict cannot be resolved safely, update `docs/00-stage-0/UNRESOLVED-DECISIONS.md` before implementation.

## 3. Mandatory Reading Before Any Build Task

Before implementing a feature, route, workflow, role, page, permission, status, or database change, read:

- `docs/SOURCE-OF-TRUTH.md`
- `docs/00-stage-0/STAGE-0-V1-SPECIFICATION.md`
- `docs/00-stage-0/V1-VERTICAL-SLICE.md`
- `docs/00-stage-0/ROLE-PERMISSIONS-MATRIX.md`
- `docs/00-stage-0/STATUS-MAPPINGS.md`
- `docs/00-stage-0/PAGE-INVENTORY.md`

Also read these when relevant:

- `docs/00-stage-0/CURRENT-PROCESS.md`
- `docs/00-stage-0/V1-NON-GOALS.md`
- `docs/00-stage-0/POST-V1-BACKLOG.md`
- `docs/00-stage-0/UNRESOLVED-DECISIONS.md`
- `docs/00-stage-0/DESIGN-REFERENCE-REGISTER.md`
- `docs/00-stage-0/STAGE-0-APPROVED-DECISION-REGISTER.md`

## 4. Approved V1 Decisions

DEC-001: B - Postpone transfer, keep referral only.
DEC-002: A - Approve current demo defaults.
DEC-003: A - Finance checks whether a hold blocks issuance.
DEC-004: B - Finance HOLD returns request to applicant action.
DEC-005: B - Final outcome is a controlled notice plus demo transcript.
DEC-006: B - Institution/current process creates official transcript; FAIDIA stores exact issued copy.
DEC-007: D - Complete at recorded download/collection or approved closure rule.
DEC-008: C - ID/passport required; student ID conditional.
DEC-009: A - Delivery methods are controlled download or physical collection.
DEC-010: A - One copy only for Stage 1.
DEC-011: A - Warn and block active duplicate unless Supervisor or Organization Admin with `requests.override_duplicate_active` records an override with reason.
DEC-012: A - Drafts expire after 30 days.
DEC-013: B - Conditional manual payment reference controlled by service configuration; required for the Savannah demo.
DEC-014: C - Payment stays inside request form/review flow only.
DEC-015: A - Open email registration for demo; controlled applicant group for pilot.
DEC-016: B - Supervisor assignment plus department self-claim.
DEC-017: A - Registrar approves every Transcript Request as a Supervisor membership profile labelled Registrar with explicit approval permissions.
DEC-018: A - Organization Admin does not automatically read sensitive request content.
DEC-019: B - Parent request has no ASSIGNED status; assignment lives on work items.
DEC-020: A - Applicant documents use ACCEPTED, not APPROVED.
DEC-021: A - Handoffs complete at COMPLETED; originator receipt is history/notification.
DEC-022: A - Correction resubmission returns request to IN_REVIEW and uses history.
DEC-023: B - Preparing Outcome is public only when there is a real delay.
DEC-024: B - Organization selection is required only for staff with multiple memberships.
DEC-025: A - Standalone admin audit page remains demo-only; request audit appears in request details.
DEC-026: A - Proceed with documented current-process assumptions for demo; validate before real pilot.
DEC-027: A - In-app required; email optional for demo and required before external pilot.
DEC-028: A - Synthetic demo first; limited real pilot later with founder plus service-owner support and weekly feedback.
DEC-029: A - Current visual direction is approved; missing screens can be designed during build.
DEC-030: A - Canonical `docs/SOURCE-OF-TRUTH.md` has been created.
DEC-031: A - Stage 0 is approved after the source docs are updated and synchronized.

## 5. Source-Of-Truth Map

| Product area | Authoritative file |
|---|---|
| V1 scope, pilot boundary, service definition | `STAGE-0-V1-SPECIFICATION.md` |
| Current manual process and validation assumptions | `CURRENT-PROCESS.md` |
| End-to-end Transcript Request workflow | `V1-VERTICAL-SLICE.md` |
| Roles, scopes, permissions, access boundaries | `ROLE-PERMISSIONS-MATRIX.md` |
| Internal statuses and applicant-facing mappings | `STATUS-MAPPINGS.md` |
| Pages, routes, page classification, navigation | `PAGE-INVENTORY.md` |
| Excluded V1 features | `V1-NON-GOALS.md` |
| Future roadmap and postponed work | `POST-V1-BACKLOG.md` |
| Decision history and resolved items | `UNRESOLVED-DECISIONS.md` |
| Visual direction and reference status | `DESIGN-REFERENCE-REGISTER.md` |

## 6. Frozen For V1

The following are frozen for Stage 1 implementation unless the product owner updates the source docs first:

- product category: Service Operations Platform;
- target institution: Kenyan TVET / technical college / small private college;
- demo organization: Savannah Technical College;
- primary service: Transcript Request;
- demonstration services: Student Clearance Request and Certificate Replacement Request;
- departments: Student Records, Finance, Registrar;
- handoff type in the main path: referral only;
- payment model: conditional manual payment reference inside request flow, required for Savannah demo;
- Finance check: hold blocking issuance;
- Registrar approval: required for every Transcript Request through Supervisor membership profile labelled Registrar;
- parent request statuses: no parent `ASSIGNED` status;
- document review status: `ACCEPTED`;
- completion rule: recorded download, collection, or approved closure;
- applicant registration: open email registration for demo, controlled applicant group for pilot.
- V1 page boundary: all 63 pages classified `V1_REQUIRED` in `PAGE-INVENTORY.md` are Stage 1 scope; `DEMO_ONLY` and `POSTPONED` pages are not required V1 scope;
- approval route: `/officer/requests/[id]/approval`.

## 7. Implementation Guardrails

AI coding agents must not:

- invent roles, statuses, routes, workflow steps, or permissions;
- activate transfer routes in Stage 1;
- create standalone V1 payment pages unless product scope changes;
- expose internal notes, raw handoff details, or confidential Finance details to applicants;
- let Organization Admin automatically read sensitive request content;
- use page-specific status strings;
- implement postponed features because they appear in backlog or old mockups.

AI coding agents should:

- use server-side authorization and shared permission helpers;
- keep transactions around critical state changes;
- record audit events and status history;
- derive reports from real timestamps/events;
- keep applicant-facing status separate from internal state.
- use the exact role grants in `ROLE-PERMISSIONS-MATRIX.md`;
- use the canonical approval route in `PAGE-INVENTORY.md`.

## 8. Stage 0 Approval State

Stage 0 is approved for Stage 1 implementation using these documents as controlling references. If a future product decision changes workflow, database structure, routes, permissions, statuses, or navigation, update the relevant Markdown files before code changes.
