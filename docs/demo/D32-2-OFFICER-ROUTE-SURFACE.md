# D32-2 - Officer Route Surface

## Purpose

Create the complete canonical officer App Router surface beneath `/demo/officer/**` while preserving the D32-1 navigation contract for later activation.

## Baseline

- Branch: `demo/d32-officer-navigation-consolidation`
- D32-1 baseline: `3de503ec0f044d17ff0c8550e613dd7ab3eb5c40`

## Canonical Routes

Existing canonical routes verified:

| Route | Body |
| --- | --- |
| `/demo/officer` | `OfficerDashboardHighFidelity` |
| `/demo/officer/tasks` | `OfficerTasksWorkspace` |
| `/demo/officer/queue` | `OfficerTasksWorkspace` |
| `/demo/officer/sla-monitor` | `OfficerSlaWorkspaceFixed` |

New canonical routes:

| Route | Body |
| --- | --- |
| `/demo/officer/tasks/overdue` | `OfficerTasksWorkspace` with route-enforced overdue state |
| `/demo/officer/workflow` | `OfficerWorkflowWorkspace` inbox view |
| `/demo/officer/workflow/approvals` | `OfficerWorkflowWorkspace` approval view |
| `/demo/officer/workflow/returned` | `OfficerWorkflowWorkspace` returned-to-applicant view |
| `/demo/officer/documents/review` | `OfficerDocumentHub` review tab |
| `/demo/officer/documents/generated` | `OfficerDocumentHub` issued/generated document records |
| `/demo/officer/documents/issued` | `OfficerDocumentHub` issued-document records |
| `/demo/officer/documents/verification` | `VerificationWorkspaceBody` |
| `/demo/officer/communications/applicant` | `OfficerCommunicationsWorkspace` applicant view |
| `/demo/officer/communications/internal` | `OfficerCommunicationsWorkspace` internal-notes view |

## Reuse And Extraction

- `OfficerDocumentHub` supplies the document review, generated-PDF, and issued-document bodies using existing document fixtures and filters.
- `VerificationWorkspaceBody` was extracted from `PublicVerificationPage`. The public page keeps its existing header, footer, and navigation; the officer page mounts only the verification body.
- `OfficerWorkflowWorkspace` and `OfficerCommunicationsWorkspace` extend the existing officer operations module and use the current multi-request operational and audit fixtures. Neither mounts another role workspace.

## Layout And Shell Proof

Every canonical page is located under `app/demo/officer/**`, so Next.js inherits `app/demo/officer/layout.tsx`. That layout remains the sole owner of `OperationalWorkspaceShell role="officer"`, which provides the persistent officer sidebar and top bar.

The new page files render only feature bodies. They do not import or render `InternalAppShell`, `RoleWorkspaceShell`, `OperationalWorkspaceShell`, `InternalSidebar`, `InternalTopbar`, or another role's complete workspace shell.

## Compatibility Retained

- `/demo/officer/documents` remains the non-navigation document-hub compatibility route.
- `/demo/officer/sla` and `/demo/officer/reports/sla` continue redirecting to `/demo/officer/sla-monitor`.
- No `/demo/officer/logout` route exists. Log Out remains an action only.

## Protected Files

The D32-2 implementation does not modify the protected navigation, shell, role-switch, layout, global-style, or package files.

## Files Changed

- Ten new `page.tsx` files under `app/demo/officer/**`
- `features/demo-operations/components/operational-workspaces.tsx`
- `features/demo-operations/index.ts`
- `features/demo-verification/components/public-verification-page.tsx`
- `tests/demo/unit/officer-route-surface.test.ts`
- This document

## Validation Results

- Focused D32-1 contract and D32-2 route-surface tests: passed (14 assertions).
- `npm run typecheck`: passed.
- `npm run lint`: completed with four existing unused-import warnings outside the D32-2 files; no errors.
- `npm test`: passed (4 files, 30 assertions).
- `git diff --check`: passed.
- Direct local smoke checks: all 14 canonical officer routes returned `200 OK` from the development server.
- `npm run build`: started Next.js production compilation but did not produce `.next/BUILD_ID`, so `next start` could not be used for a production-server smoke test in this environment.

## Known Limitations

- D32-2 deliberately does not activate the D32-1 contract in the live `InternalSidebar`.
- The generated-PDF route uses the existing issued-document records, whose operational document states include generated and issued output, rather than creating a separate document registry.
- Log Out remains intentionally unimplemented.

## Acceptance Checklist

- [x] 14 canonical route destinations are defined by the D32-1 contract.
- [x] Ten missing canonical officer pages are implemented beneath `app/demo/officer/**`.
- [x] New pages render body content only and inherit the officer layout.
- [x] No new canonical route requires a query string, hash, or cross-role redirect.
- [x] Compatibility documents and SLA routes remain available.
- [x] No logout route is created.
- [x] Focused contract and route-surface tests pass.
- [x] Typecheck, lint, full test suite, diff check, and direct route smoke checks completed.
- [x] Production build limitation is recorded.

## D32-3 Handoff

D32-3 can switch the visible officer sidebar to the already-locked D32-1 contract. This stage intentionally leaves live navigation, shell components, role switching, and Log Out behavior unchanged.
