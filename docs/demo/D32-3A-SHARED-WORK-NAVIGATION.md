# D32-3A - Shared Work Navigation Amendment

## Reason

D32-3 activated the then-current D32-1 contract with fifteen visible items. This amendment adds the requested Shared Work destination as a canonical officer route without changing the officer shell, visual design, or non-officer navigation.

## Final Workflow Order

1. Workflow Inbox
2. Shared Work
3. Approval Queue
4. Returned to Applicant

## Canonical Metadata

| Field | Value |
| --- | --- |
| Item ID | `shared-work` |
| Route key | `sharedWork` |
| Kind | `route` |
| Href | `/demo/officer/shared-work` |
| Exact matching | `true` |
| Icon | `UsersRound` |

`UsersRound` is preserved from the prior officer `Shared workflows` item recorded in the D32-2 baseline.

## Route And Body

`app/demo/officer/shared-work/page.tsx` inherits the existing officer layout and renders only `OfficerSharedWorkWorkspace`. The focused body reuses current `OFFICER_TASKS` fixtures to present shared-with/shared-by direction, applicant, service, collaborator, reason, state, shared time, due time, filters, and officer-owned request actions.

## Active State

Shared Work is active only at `/demo/officer/shared-work`. It has no active prefixes, so it does not own the workflow inbox, request-detail paths, department paths, or any other officer route.

## Counts

- 4 groups
- 16 visible items
- 15 route items
- 1 Log Out action

## Files Changed

- `features/demo-engine/navigation/officer-navigation-contract.ts`
- `app/demo/officer/shared-work/page.tsx`
- `features/demo-operations/components/officer-shared-work-workspace.tsx`
- D32 navigation, route-surface, activation, shared-work, and runtime tests
- Minimal current-state amendments to D32-1 and D32-3 documentation
- This document

`DEMO_ROUTES.officer.sharedWork` derives automatically from the existing `...OFFICER_ROUTE_HREFS` contract spread; a focused test locks that relationship.

## Protected Files

The officer layout, internal app shell, top bar, role workspace shell, role switcher, global CSS, non-officer navigation arrays and routes, public verification behavior, and package files remain unchanged.

## Validation Results

- D32-1 contract, D32-2 route surface, D32-3 activation, and D32-3A Shared Work unit suites: passed (27 assertions).
- `npm run typecheck`: passed.
- `npm run lint`: completed with four existing unused-import warnings outside this amendment; no errors.
- `npm test`: passed (6 files, 43 assertions).
- `git diff --check`: passed.
- D32-3 Playwright runtime audit: passed (2 checks), including Shared Work desktop navigation, direct reload, history, and mobile drawer behavior.
- `npm run build`: reached Next.js production compilation and then hung without writing `.next/BUILD_ID`. The verified stale process was stopped to release its lock, so production-server checks could not run in this environment.

## Acceptance Checklist

- [x] Shared Work is canonical and appears once after Workflow Inbox.
- [x] The route remains inside the officer route tree and renders meaningful body-only content.
- [x] `UsersRound` is preserved from the historical officer item.
- [x] The visible sidebar continues to derive from one contract source for desktop and mobile.
- [x] Unit suites, typecheck, lint, full test suite, diff check, and runtime audit complete.
- [x] Production build limitation recorded.
