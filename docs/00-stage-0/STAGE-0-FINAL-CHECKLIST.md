# FAIDIA Stage 0 — Final Checklist

Status: **COMPLETE**  
Version: **1.4**  
Last updated: **2026-07-13**

## Canonical documentation

- [x] `docs/SOURCE-OF-TRUTH.md` is the only canonical Source of Truth.
- [x] `docs/00-stage-0/SOURCE-OF-TRUTH.md` has been removed.
- [x] No obsolete Source-of-Truth copy remains.
- [x] All controlling documents use version 1.4.

## Stage 1 scope

- [x] Stage 1 is limited to the Transcript Request vertical slice.
- [x] Full V1 scope is separated from Stage 1.
- [x] Pages are classified as `STAGE_1_REQUIRED`, `LATER_V1`, `DEMO_ONLY`, or `POSTPONED`.
- [x] Post-V1 scope is excluded.

## Roles and permissions

- [x] Applicant access is self-scoped.
- [x] Officer permissions are explicit.
- [x] Supervisors use the shared Officer processing shell.
- [x] Supervisor-only navigation and controls are permission-driven.
- [x] Ordinary Officers cannot approve or reject.
- [x] Approval requires a Registrar-profile Supervisor.
- [x] Organization Admin cannot read sensitive request content by default.
- [x] Protected actions are checked server-side.

## Registrar approval flow

- [x] `/supervisor/approvals` is the Registrar approval queue.
- [x] Selecting a request opens `/officer/requests/[id]`.
- [x] Registrar decision controls are embedded in request details.
- [x] `/officer/requests/[id]/approval` is prohibited.
- [x] Approve, reject, and return-for-clarification require exact permissions.
- [x] Finance `CLEAR` is required before approval.

## Workflow and statuses

- [x] Internal statuses are defined.
- [x] Applicant-visible statuses are mapped.
- [x] `Expired` is included.
- [x] Completion triggers are exact.
- [x] Manual closure is permission-controlled and audited.
- [x] Reopening preserves history.
- [x] Published versions are immutable.
- [x] Requests remain pinned to exact versions.

## Final result

**Stage 0 complete: YES**

**Ready to begin Stage 1: YES**