# FAIDIA Stage 0 — Approved Decision Register

Status: **APPROVED_FOR_V1**  
Version: **1.2**
Generated: **2026-07-13**  
Applies to: **FAIDIA V1 / Stage 0**

## Purpose

This register is the concise implementation-control version of the product-owner answers. These decisions are final for Stage 1 unless the product owner updates the source-of-truth Markdown files.

## Approved Answer Set

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

## Blocking Decisions Applied

1. Transfer is postponed from the Stage 1 main build.
2. Demo defaults are approved.
3. Finance verifies whether a hold blocks issuance.
4. Finance HOLD returns the request to applicant action.
5. Final outcome is a controlled notice plus demo transcript.
6. Institution/current process creates official transcript; FAIDIA stores exact issued copy.
7. Completion occurs at recorded download, collection, delivery, or closure.
8. ID/passport is required; student ID is conditional.
9. Delivery methods are controlled download or physical collection.
10. Duplicate active requests are blocked unless Supervisor or Organization Admin with `requests.override_duplicate_active` records an override with reason.
11. Transcript Request uses conditional manual payment reference controlled by service configuration; Savannah demo requires it.
12. Payment stays inside the request flow.
13. Applicant registration uses open email registration for demo and controlled applicant group for pilot.
14. Officers may self-claim department work.
15. Registrar approval is required for every Transcript Request and uses a Supervisor membership profile labelled Registrar.
16. Organization Admin does not automatically read sensitive request content.
17. Assignment lives on work items, not parent request status.
18. Applicant documents use `ACCEPTED`.
19. Handoffs complete at `COMPLETED`.
20. Correction resubmission returns to `IN_REVIEW`.
21. Public `Preparing Outcome` is conditional.
22. Canonical root source of truth exists at `docs/SOURCE-OF-TRUTH.md`.
23. Stage 0 source docs are updated and synchronized; Stage 0 is approved for Stage 1.

## Non-Blocking Decisions Applied

- One copy only for Stage 1.
- Drafts expire after 30 days.
- Organization selection is required only for staff with multiple memberships.
- Standalone admin audit page remains demo-only.
- Current-process assumptions are accepted for demo and must be validated before real pilot.
- In-app notifications are required; email is optional for demo and required before external pilot.
- Synthetic demo first, limited real pilot later.
- Current visual direction is approved; missing screens can be designed during build.

## Implementation Rule

Build from the source docs, not from memory. If implementation discovers a conflict, update the controlling Markdown file first.
