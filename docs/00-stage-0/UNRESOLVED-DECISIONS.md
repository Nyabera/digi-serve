# FAIDIA Stage 0 — Resolved Decisions Register

Status: **APPROVED_FOR_V1**  
Version: **1.2**
Last updated: **2026-07-13**  
Product: **FAIDIA — Service Operations Platform**

## 1. Purpose

This file formerly tracked unresolved Stage 0 decisions. Product-owner answers have now been applied. The items below are the approved Stage 0 decisions for V1.

No blocking Stage 0 decisions remain open for Stage 1.

## 2. Approved Answer Set

```text
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
DEC-030: A - Canonical docs/SOURCE-OF-TRUTH.md has been created.
DEC-031: A - Stage 0 is approved after the source docs are updated and synchronized.
```

## 3. Resolved Decisions

| ID | Decision | Approved answer | Status |
|---|---|---|---|
| DEC-001 | Transfer scope | Postpone transfer; keep referral only | RESOLVED |
| DEC-002 | Demo defaults | Approve current defaults | RESOLVED |
| DEC-003 | Finance verification | Check whether Finance hold blocks issuance | RESOLVED |
| DEC-004 | Finance HOLD result | Return to applicant with clear action | RESOLVED |
| DEC-005 | Final outcome type | Controlled notice plus demo transcript | RESOLVED |
| DEC-006 | Official transcript creator | Institution/current process creates it; FAIDIA stores exact copy | RESOLVED |
| DEC-007 | Completion rule | Complete at recorded download/collection/delivery/closure | RESOLVED |
| DEC-008 | Identity documents | ID/passport required; student ID conditional | RESOLVED |
| DEC-009 | Delivery methods | Controlled download or physical collection | RESOLVED |
| DEC-010 | Number of copies | One copy only for Stage 1 | RESOLVED |
| DEC-011 | Duplicate active request | Warn and block unless Supervisor or Organization Admin with `requests.override_duplicate_active` records an override with reason | RESOLVED |
| DEC-012 | Draft expiry | 30 days | RESOLVED |
| DEC-013 | Transcript Request fee | Conditional manual payment reference controlled by service configuration; required for Savannah demo | RESOLVED |
| DEC-014 | Payment page classification | Payment stays inside request form/review flow | RESOLVED |
| DEC-015 | Applicant registration model | Open email registration for demo; controlled group for pilot | RESOLVED |
| DEC-016 | Officer self-assignment | Supervisor assignment plus department self-claim | RESOLVED |
| DEC-017 | Registrar approval requirement | Every Transcript Request requires Registrar approval by Supervisor membership profile labelled Registrar | RESOLVED |
| DEC-018 | Organization Admin request access | No automatic sensitive request-content access | RESOLVED |
| DEC-019 | Parent request `ASSIGNED` | No parent `ASSIGNED`; assignment lives on work items | RESOLVED |
| DEC-020 | Document status wording | Use `ACCEPTED` | RESOLVED |
| DEC-021 | Final handoff state | `COMPLETED` only; originator receipt by history/notification | RESOLVED |
| DEC-022 | Correction-resubmission status | No dedicated parent status; return to `IN_REVIEW` | RESOLVED |
| DEC-023 | Preparing Outcome public status | Use only for meaningful delay | RESOLVED |
| DEC-024 | Organization selection route | Required only for staff with multiple memberships | RESOLVED |
| DEC-025 | Audit activity page | Standalone admin audit remains demo-only | RESOLVED |
| DEC-026 | Current process validation | Proceed for demo; validate before real pilot | RESOLVED |
| DEC-027 | External email | In-app required; email optional for demo, required before external pilot | RESOLVED |
| DEC-028 | Pilot operations | Synthetic demo first; limited pilot later with support/feedback | RESOLVED |
| DEC-029 | Missing design references | Current visual direction approved; design missing screens during build | RESOLVED |
| DEC-030 | Canonical source of truth | `docs/SOURCE-OF-TRUTH.md` created and canonical | RESOLVED |
| DEC-031 | Stage 0 approval state | Stage 0 approved after source docs were updated and synchronized | RESOLVED |

## 4. Remaining Non-Blocking Follow-Up Before Real Pilot

The following do not block Stage 1 implementation but should be validated before external real-data pilot:

- real institution name and owner;
- real fee schedule;
- real Finance hold/payment-reference process;
- real approval authority/SOP;
- real output sample;
- real closure condition;
- email provider setup;
- pilot support owner;
- weekly feedback mechanism.

## 5. Coding-Agent Instruction

If a future task conflicts with this resolved decision register, stop and ask for a documentation update before implementing.
