# D32-3 - Officer Navigation Activation

## Purpose

Activate the D32-1 canonical officer navigation contract in the visible shared internal sidebar without changing the officer route surface, layout, bodies, or visual design.

## Baseline

- Branch: `demo/d32-officer-navigation-consolidation`
- D32-2 baseline: `0febec471becb59f5949b679c1fc5cabbee9988c`

## Navigation Source

Before D32-3, `components/demo/internal-shell/internal-navigation.ts` held a separate `officerNavigation` array with hash links, hard-coded request IDs, cross-role destinations, and legacy items.

The live officer result now maps `OFFICER_NAVIGATION_CONTRACT` directly into the existing `InternalNavigationGroup` and `InternalNavigationItem` sidebar shape. The adapter maps route `exactMatch`, `activePrefixes`, and legacy SLA aliases without recreating officer labels, icons, IDs, or href strings.

## Final Inventory

| Group | Items |
| --- | --- |
| Operations | Dashboard; My Tasks; Application Queue; SLA Monitor; Overdue Tasks |
| Workflow | Workflow Inbox; Shared Work; Approval Queue; Returned to Applicant |
| Documents | Document Review; Generated PDFs; Issued Documents; QR Verification |
| Communication & Account | Applicant Messages; Internal Notes; Log Out |

> **D32-3A amendment:** The current D32-1 contract is authoritative with four groups, fifteen route items, and one action. Shared Work is rendered immediately after Workflow Inbox.

## Route And Action Handling

- The fifteen contract route items render as Next.js `Link` elements with contract hrefs under `/demo/officer/**`.
- Log Out renders with the same `nav-item` styling as a native button, has no href, closes the mobile drawer, and uses the explicit demo handler to navigate to `/demo`.
- No logout route or authentication/session behavior was added.

## Active-State Rules

`isInternalNavigationItemActive` now treats actions as never active, honors route exact-match metadata, honors `activePrefixes` for request-detail ownership, and recognizes the two SLA compatibility aliases.

This gives Dashboard exclusive ownership of `/demo/officer`, My Tasks exclusive ownership of `/demo/officer/tasks`, Overdue Tasks exclusive ownership of `/demo/officer/tasks/overdue`, and Application Queue ownership of `/demo/officer/requests/[requestId]`.

## Removed Visible Legacy Items

The visible officer sidebar no longer includes the previous Documents Hub, Shared Workflows, Review Invitations, Ask for Feedback, Uploaded Documents, Due Soon Tasks, Correspondence, Notification Log, Workflow Invites, Feedback Requests, Knowledge Base, Bulk Actions, Service Rules, My Profile, Settings, Help Centre, or other non-contract officer entries. Shared Work is the one canonical replacement for Shared Workflows.

## Desktop And Mobile Proof

`InternalSidebar` obtains navigation once with `getInternalNavigation(role)` and renders that same collection in the shared desktop sidebar and mobile drawer. No mobile-specific officer array was introduced. Route-link and Log Out clicks both retain the existing mobile close behavior.

## Files Changed

- `components/demo/internal-shell/internal-navigation.ts`
- `components/demo/internal-shell/internal-sidebar.tsx`
- `tests/demo/unit/officer-navigation-activation.test.ts`
- This document

## Protected Files

The D32-1 contract, route registry, officer layout, canonical officer pages, officer bodies, top bar, role workspace shell, role switchers, non-officer navigation definitions, global CSS, and package files remain unchanged.

## Validation Results

- D32-1 contract, D32-2 route-surface, and D32-3 activation unit suites: passed (23 assertions).
- D32-3 Playwright runtime audit: passed (2 checks).
- `npm run typecheck`: passed.
- `npm run lint`: completed with four existing unused-import warnings outside D32-3; no errors.
- `npm test`: passed (5 files, 39 assertions).
- `git diff --check`: passed.
- `npm run build`: twice reached Next.js production compilation and then hung without writing `.next/BUILD_ID`. The verified stale build processes were stopped to release their locks; production-server checks could not run in this environment.

## Runtime Audit

| Check | Result |
| --- | --- |
| Every visible canonical route link stays in `/demo/officer/**` | Passed |
| Sidebar, top bar, Officer role switcher, and one active item survive route navigation and hard refresh | Passed for all 14 contract routes |
| Browser back and forward preserve My Tasks and Overdue Tasks active ownership | Passed |
| Mobile route navigation closes the drawer | Passed |
| Mobile Log Out closes the drawer and performs the explicit demo action | Passed |

## Known Limitations

- D32-3 intentionally does not change the brand link, which remains the existing `/demo` shell behavior.
- Log Out remains a demo action only; it does not terminate an authenticated session.

## Acceptance Checklist

- [x] Live officer navigation is sourced from the D32-1 contract.
- [x] The current contract inventory is four groups, fifteen routes, and one action.
- [x] Route items remain officer-owned and Log Out remains an action.
- [x] Active ownership uses contract metadata.
- [x] Desktop and mobile use the same sidebar data.
- [x] Focused unit and runtime audits pass.
- [x] Typecheck, lint, full unit suite, runtime audit, and diff check complete.
- [x] Production build limitation is recorded.

## D32-4 Handoff

D32-4 may build on the activated canonical navigation. This stage does not alter route bodies, shells, layout ownership, global styles, or non-officer navigation.
