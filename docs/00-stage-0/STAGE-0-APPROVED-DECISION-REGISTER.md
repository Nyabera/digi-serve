# FAIDIA Stage 0 — Approved Decision Register

Status: **APPROVED_FOR_STAGE_1**  
Version: **1.3**  
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
| DEC-045 | Version 1.3 passes the final completeness audit. |

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

## 4. Approval state

All blocking decisions are resolved. Stage 0 is approved for Stage 1.
