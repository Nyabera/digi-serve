# D32-4 - Officer Shell Ownership

## Purpose

Consolidate complete officer shell ownership at `app/demo/officer/layout.tsx` for the request-detail and referral experiences. This removes the remaining feature-level `InternalAppShell` wrappers while retaining the existing officer sidebar, top bar, role switcher, body layouts, and interactions.

## Baseline

- Branch: `demo/d32-officer-navigation-consolidation`
- D32-3A baseline: `691b541770de90de165354d5682bfb9aac28f760`

## Shell Ownership

Previously, `OfficerIndividualCaseShell` and `OfficerRequestReview` each mounted `InternalAppShell` even when their routes already inherited the officer `OperationalWorkspaceShell` from the route layout. `InternalShellBoundaryProvider` prevented duplicate chrome at runtime, but the feature components still claimed shell ownership.

The officer layout remains unchanged and is now the sole complete shell owner. `OfficerIndividualCaseWorkspace` renders the individual-case body, while `OfficerRequestReview` renders the referral/review body directly. The former `OfficerIndividualCaseShell` export remains a deprecated body-only compatibility alias.

## Removed Shell Concerns

- Removed `InternalAppShell` imports and wrappers from both feature bodies.
- Removed the inner request selector, role selector, presentation action, reset action, and their `useRouter`, shortcut, and Lucide dependencies from the referral review component.
- Removed the suppressed request selector and presentation/reset controls from the individual-case component.

## Breadcrumb Correction

The individual-case `My Queue` and `Transcript Requests` breadcrumbs now import `OFFICER_ROUTE_HREFS.queue`, producing the canonical `/demo/officer/queue` destination instead of legacy hash links.

## Route Behavior Preserved

- `/demo/officer/requests/[requestId]` still renders the full individual case body, including workflow, tabs, documents, academic verification, notes, activity, review actions, and the referral link.
- `/demo/officer/requests/[requestId]?view=refer` still renders `ExternalRecipientSharePanel` and `OfficerReviewReferralBody` with its review, correction, referral, sharing, validation, and feedback interactions.
- Both routes remain owned by Application Queue through the unchanged canonical active prefix.

## Navigation Preservation

The D32-3A contract is unchanged: four groups, sixteen visible items, fifteen route items, one Log Out action, and unchanged Shared Work metadata.

## Files Changed

- `app/demo/officer/requests/[requestId]/page.tsx`
- `app/demo/officer/requests/[requestId]/share-workflow-referral-page.tsx`
- `components/demo/officer/individual-case/officer-individual-case-shell.tsx`
- `components/demo/officer/individual-case/index.ts`
- `components/demo/officer/officer-request-review.tsx`
- `tests/demo/unit/officer-shell-ownership.test.ts`
- `tests/visual/d31/officer-shell-ownership.pw.ts`
- This document

## Protected Files

The officer layout, canonical navigation contract and route registry, navigation/sidebar/app-shell/top-bar/boundary components, operational and role workspace shells, role switcher, shared-work route, other officer route pages, non-officer routes, global CSS, and package files remain unchanged.

## Validation Results

- Focused D32-1, D32-2, D32-3, D32-3A, and D32-4 unit suites: passed (33 assertions).
- `npm run typecheck`: passed.
- `npm run lint`: completed with four pre-existing unused-import warnings outside D32-4; no errors.
- `npm test`: passed (7 files, 49 tests).
- `git diff --check`: passed.
- `npm run build`: reached Next.js production optimization and stalled without writing `.next/BUILD_ID`; the D32-4 build process was stopped and its lock was released.

## Runtime Verification

- `/demo/officer` and `/demo/officer/shared-work` returned `200` during preflight.
- Focused Playwright audit passed (2 checks): request detail and referral view both returned `200`, rendered exactly one Officer shell, retained Application Queue as the only active item, and remained correct after hard refresh.
- The individual-case breadcrumbs target `/demo/officer/queue`.
- The referral audit confirmed `ExternalRecipientSharePanel`, the referral/review body, Start Review feedback, and mobile drawer open/close behavior.

## Known Limitations

The existing shared `InternalShellBoundaryProvider` remains intentionally in place for unrelated legacy component protection. D32-4 only removes known officer feature-level shell ownership.

## Acceptance Checklist

- [x] The officer layout remains the complete shell owner.
- [x] The individual-case body no longer mounts a shell.
- [x] The referral/review body no longer mounts a shell.
- [x] Individual-case queue breadcrumbs use the canonical route contract.
- [x] Navigation and Shared Work metadata remain unchanged.
- [x] Focused tests and runtime audit complete.
- [x] Full validation and protected-file audit complete, except the environment-limited production build.

## D32-5 Handoff

D32-5 may build on a single layout-owned officer shell. It should not reintroduce complete shell wrappers inside officer route bodies.
