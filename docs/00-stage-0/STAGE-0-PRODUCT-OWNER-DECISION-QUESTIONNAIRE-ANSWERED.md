# FAIDIA Stage 0 — Product Owner Decision Questionnaire, Answered

Status: **APPROVED_FOR_STAGE_1**  
Version: **1.4**  
Last updated: **2026-07-13**  
Applies to: **FAIDIA V1 and Stage 1**

## 1. Purpose

This document preserves the original product-owner decision record and records the audit-remediation defaults applied in version 1.3.

## 2. Original decisions

DEC-001 through DEC-031 remain approved except where a later decision explicitly narrows or supersedes wording.

See `DECISION-LOG.md` for the complete list.

## 3. Audit-remediation answers

```text
DEC-032: A - Keep only docs/SOURCE-OF-TRUTH.md.
DEC-033: B - Stage 1 is the first Transcript Request vertical slice.
DEC-034: A - Use a seeded template with limited safe editing.
DEC-035: APPROVED RULE - Published versions are immutable; drafts/requests are pinned; no automatic migration.
DEC-036: A - Only the Registrar Supervisor profile may approve/reject/return for clarification.
DEC-037: A - Organization Admin has no sensitive operational content access in V1.
DEC-038: B - Complete by controlled download, physical collection, or Supervisor manual closure.
DEC-039: APPROVED RULE - Supervisor-only reopen with reason; return to IN_REVIEW; preserve history.
DEC-040: APPROVED - Add Expired to the applicant-visible status set.
DEC-041: B - Update the register to match existing asset folders.
DEC-042: B - V1 scope and Stage 1 scope are separate; use four page classes.
DEC-043: APPROVED - Rename the resolved-decision file to DECISION-LOG.md.
DEC-044: APPROVED - Delete and ignore .DS_Store.
DEC-045: SUPERSEDED - The earlier v1.3 audit result is replaced by the final synchronized audit under DEC-050.
DEC-046: C — Use `/officer/requests/[id]` and display Registrar decision actions only to a Registrar-profile Supervisor.
DEC-047: B — Supervisors use the shared Officer processing shell with supervisor-only navigation and controls.
DEC-048: APPROVED — Delete `docs/00-stage-0/SOURCE-OF-TRUTH.md` and retain only `docs/SOURCE-OF-TRUTH.md`.
DEC-049: B — Store replacement instructions at `docs/migrations/REPLACEMENT-INSTRUCTIONS.md`.
DEC-050: APPROVED — Stage 0 is approved only after all final decisions are synchronized across the controlling documents.
```

## 4. Consequences

- The former 63-page Stage 1 interpretation is retired.
- Stage 1 has 39 required inventory items: 32 distinct product routes and 7 embedded sections/actions.
- Full configuration pages move to `LATER_V1`.
- Permission ambiguity is removed.
- Completion and reopening are implementable without inventing rules.
- There is one canonical Source of Truth.
- No blocking Stage 0 decision remains.
- `/officer/requests/[id]/approval` is retired and must not be implemented.
- `/supervisor/approvals` opens `/officer/requests/[id]`.
- Registrar decision actions are embedded in the shared request-details page.
- Supervisors use the shared Officer processing shell.
- Supervisor-only navigation and controls are permission-driven.
- Only `docs/SOURCE-OF-TRUTH.md` remains canonical.
- Replacement instructions are archived under `docs/migrations/`.

## 5. Result

Stage 0 version 1.4 is approved for Stage 1, subject to the synchronized implementation controls recorded in DEC-046 through DEC-050.