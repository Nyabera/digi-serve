# FAIDIA Stage 0 — Approved Decision Register

Status: **APPROVED_FOR_STAGE_1**  
Version: **1.4**  
Last updated: **2026-07-13**  
Applies to: **FAIDIA V1 and Stage 1**

## 1. Purpose

This is the concise implementation-control register. `DECISION-LOG.md` contains the full history.

## 2. Stage 1 corrective decisions

| ID | Decision |
|---|---|
| DEC-032 | Remove competing Source-of-Truth copies; keep only `docs/SOURCE-OF-TRUTH.md`. |
| DEC-033 | Stage 1 is the first Transcript Request vertical slice, not complete V1. |
| DEC-034 | Stage 1 configuration is seeded with limited safe editing. |
| DEC-035 | Published versions are immutable; requests/drafts are pinned; no automatic migration. |
| DEC-036 | Ordinary Officers cannot approve, reject, or return approval for clarification. |
| DEC-037 | Organization Admin has no sensitive request/document/message/note access in V1. |
| DEC-038 | Completion is controlled download, physical collection, or Supervisor manual closure only. |
| DEC-039 | Reopening is Supervisor-only, requires a reason, returns to `IN_REVIEW`, and preserves history. |
| DEC-040 | `Expired` is an official applicant-visible status. |
| DEC-041 | Design paths use the actual `*-shell` and `workflows` folders. |
| DEC-042 | Page classes are `STAGE_1_REQUIRED`, `LATER_V1`, `DEMO_ONLY`, `POSTPONED`. |
| DEC-043 | `DECISION-LOG.md` replaces `UNRESOLVED-DECISIONS.md`. |
| DEC-044 | `.DS_Store` files are removed and ignored. |
| DEC-045 | Earlier v1.3 completeness result superseded by DEC-050. |
| DEC-046 | Registrar decisions are embedded in `/officer/requests/[id]`; `/officer/requests/[id]/approval` must not exist. |
| DEC-047 | Supervisors use the shared Officer processing shell with supervisor-only navigation and controls. |
| DEC-048 | Delete `docs/00-stage-0/SOURCE-OF-TRUTH.md`; retain only `docs/SOURCE-OF-TRUTH.md`. |
| DEC-049 | Store completed replacement instructions at `docs/migrations/REPLACEMENT-INSTRUCTIONS.md`. |
| DEC-050 | Final Stage 0 approval requires all controlling documents to reflect DEC-046 through DEC-049 consistently. |
| DEC-051 | Correct the Stage 1 count to 39 required inventory items consisting of 32 distinct product routes and 7 embedded sections/actions; no scope item changes. |

## 3. Frozen implementation controls

- Read `docs/SOURCE-OF-TRUTH.md` first.
- Build only `STAGE_1_REQUIRED` scope.
- Use seeded service/form/document/workflow configuration.
- Treat published versions as immutable.
- Pin drafts and submitted requests to exact versions.
- Preserve Student Records ownership during Finance referral.
- Require Finance `CLEAR` before approval.
- Restrict decision actions to the Registrar profile.
- Deny Organization Admin request-content access.
- Use only approved completion and reopening rules.
- Preserve append-only history.
- Keep `Expired` in public mapping.
- Treat the Stage 1 product surface as 32 distinct routes plus 7 embedded sections/actions.

- Supervisors use the shared Officer processing shell.
- Supervisor-only navigation and controls are permission-driven.
- `/supervisor/approvals` is the Registrar queue.
- Queue selections open `/officer/requests/[id]`.
- Registrar decisions are embedded in the shared request-details page.
- Registrar decision actions require server-side authorization.
- Do not implement `/officer/requests/[id]/approval`.

## 4. Approval state

All blocking decisions are resolved. Stage 0 is approved for Stage 1.
