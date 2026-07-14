# FAIDIA Stage 0 — Decision Log

Status: **APPROVED_FOR_STAGE_1**  
Version: **1.4**  
Last updated: **2026-07-13**  
Product: **FAIDIA — Service Operations Platform**

## 1. Purpose

This file replaces `UNRESOLVED-DECISIONS.md`.

It records approved Stage 0 decisions and later corrective decisions. No blocking Stage 0 decision is open.

## 2. Approved decisions

| ID | Topic | Approved decision | State |
|---|---|---|---|
| DEC-001 | Transfer scope | Postpone transfer; use referral only. | APPROVED |
| DEC-002 | Demo defaults | Approve Savannah synthetic demo defaults. | APPROVED |
| DEC-003 | Finance verification | Finance checks whether a hold blocks issuance. | APPROVED |
| DEC-004 | Finance HOLD | Return request to applicant action; do not auto-reject. | APPROVED |
| DEC-005 | Outcome type | Controlled notice plus demo transcript. | APPROVED |
| DEC-006 | Official transcript creation | Institution/current process creates it; FAIDIA stores exact issued copy. | APPROVED |
| DEC-007 | Completion rule | Superseded by DEC-038: download, collection, or Supervisor manual closure only. | APPROVED |
| DEC-008 | Identity documents | ID/passport required; student ID conditional. | APPROVED |
| DEC-009 | Delivery methods | Controlled download or physical collection. | APPROVED |
| DEC-010 | Copies | One copy in Stage 1. | APPROVED |
| DEC-011 | Duplicate active request | Block by default; Supervisor or Organization Admin override requires permission and reason. | APPROVED |
| DEC-012 | Draft expiry | Thirty days. | APPROVED |
| DEC-013 | Fee model | Conditional manual payment reference; required for Savannah demo. | APPROVED |
| DEC-014 | Payment pages | Payment reference remains inside request flow. | APPROVED |
| DEC-015 | Registration | Open email registration for demo; controlled group for pilot. | APPROVED |
| DEC-016 | Self-claim | Supervisor assignment plus own-department self-claim. | APPROVED |
| DEC-017 | Registrar approval | Required for every Transcript Request; Registrar is Supervisor profile. | APPROVED |
| DEC-018 | Organization Admin access | No automatic sensitive request access. | APPROVED |
| DEC-019 | Assignment status | Assignment lives on work items; no parent ASSIGNED. | APPROVED |
| DEC-020 | Document wording | Use ACCEPTED. | APPROVED |
| DEC-021 | Handoff completion | Use COMPLETED; receipt is history/notification. | APPROVED |
| DEC-022 | Correction resubmission | Return parent request to IN_REVIEW. | APPROVED |
| DEC-023 | Preparing Outcome | Public only when meaningful delay exists. | APPROVED |
| DEC-024 | Organization selection | Only staff with multiple memberships. | APPROVED |
| DEC-025 | Standalone audit page | Demo-only; request history stays in request details. | APPROVED |
| DEC-026 | Current-process validation | Proceed for synthetic demo; validate before external pilot. | APPROVED |
| DEC-027 | Notifications | In-app in Stage 1; email before external pilot. | APPROVED |
| DEC-028 | Pilot posture | Synthetic demo first; limited supported pilot later. | APPROVED |
| DEC-029 | Design references | Direction approved; missing screens may be designed during build. | APPROVED |
| DEC-030 | Canonical path | Only docs/SOURCE-OF-TRUTH.md is canonical. | APPROVED |
| DEC-031 | Stage 0 approval | Approval requires synchronized controlling docs. | APPROVED |
| DEC-032 | Canonical copies | Remove root and docs/00-stage-0 Source-of-Truth copies. | APPROVED |
| DEC-033 | Stage 1 meaning | Stage 1 is the Transcript Request vertical slice, not complete V1. | APPROVED |
| DEC-034 | Configuration model | Seeded template with limited safe metadata/label editing. | APPROVED |
| DEC-035 | Versioning | Published versions immutable; requests/drafts pinned; no automatic migration. | APPROVED |
| DEC-036 | Officer approval | Ordinary Officers cannot approve, reject, or return for clarification. | APPROVED |
| DEC-037 | Organization Admin sensitive content | No V1 request/document/message/internal-note access. | APPROVED |
| DEC-038 | Completion triggers | Controlled download, physical collection, or Supervisor manual closure only. | APPROVED |
| DEC-039 | Reopening | Supervisor-only, reason required, return to IN_REVIEW, preserve history. | APPROVED |
| DEC-040 | Expired public status | Expired is official and mapped from EXPIRED. | APPROVED |
| DEC-041 | Design paths | Register updated to existing applicant-shell/officer-shell/admin-shell/workflows folders. | APPROVED |
| DEC-042 | Page classification | Use STAGE_1_REQUIRED, LATER_V1, DEMO_ONLY, POSTPONED. | APPROVED |
| DEC-043 | Decision-file name | Replace UNRESOLVED-DECISIONS.md with DECISION-LOG.md. | APPROVED |
| DEC-044 | macOS metadata | Delete .DS_Store files and ignore .DS_Store repository-wide. | APPROVED |
| DEC-045 | Prior completeness result | The earlier version 1.3 completeness result is superseded by DEC-050 and the final synchronized version 1.4 audit. | SUPERSEDED |
| DEC-046 | Registrar decision route | Registrar approval, rejection, and return-for-clarification actions are embedded in `/officer/requests/[id]`. The application must not implement `/officer/requests/[id]/approval`. | APPROVED |
| DEC-047 | Shared staff shell | Supervisors use the shared Officer processing shell with additional supervisor-only navigation and controls determined by membership profile and exact permissions. | APPROVED |
| DEC-048 | Canonical Source of Truth | `docs/SOURCE-OF-TRUTH.md` is the only canonical Source-of-Truth file. `docs/00-stage-0/SOURCE-OF-TRUTH.md` must not exist. | APPROVED |
| DEC-049 | Migration-record location | Replacement and migration instructions are stored at `docs/migrations/REPLACEMENT-INSTRUCTIONS.md` as a non-controlling historical record. | APPROVED |
| DEC-050 | Final Stage 0 synchronization | Stage 0 is approved only after DEC-046 through DEC-049 are reflected consistently across every controlling document and the final completeness audit passes. | APPROVED |

## 3. Supersession rule

Where two decisions address the same subject, the later decision controls.

- DEC-038 replaces broader completion wording and removes generic delivery as a Stage 1 completion trigger.
- DEC-045 is superseded by DEC-050.
- DEC-046 supersedes any page, route, or workflow wording that creates `/officer/requests/[id]/approval`.
- DEC-047 supersedes any interpretation requiring a separate Supervisor processing shell.
- DEC-048 establishes `docs/SOURCE-OF-TRUTH.md` as the only canonical Source-of-Truth file.
- DEC-049 establishes `docs/migrations/REPLACEMENT-INSTRUCTIONS.md` as the location of the non-controlling migration record.
- DEC-050 controls the final Stage 0 approval result.

## 4. Non-blocking external-pilot validation

Before external real-data pilot, validate:

- real institution owner;
- actual fee schedule;
- Finance hold/payment-reference process;
- approval authority and SOP;
- official outcome sample;
- collection/manual-closure evidence;
- reopening policy;
- email provider;
- support owner;
- weekly feedback mechanism.

These items do not block the synthetic Stage 1 build.

## 5. Coding-agent instruction

If a task conflicts with an approved decision, stop and update the controlling documents before implementation.
