# D32-5 - Officer Link Consolidation

## Purpose

Consolidate ordinary officer-owned links, dashboard actions, breadcrumbs, fixtures, adapters, and dynamic request destinations under the canonical officer route system. This stage keeps officer work inside `/demo/officer/**` without changing the navigation inventory, shell, visual design, or other role workspaces.

## Baseline

- Branch: `demo/d32-officer-navigation-consolidation`
- D32-4 baseline: `124e04f8a3b6bf18055341aa3115e1f35f1b1fe2`

## Link Inventory

The inventory covered 58 officer-owned route destinations across current officer bodies, dashboard references, dashboard adapters, view models, request/referral bodies, task/queue workflow workspaces, Shared Work, and SLA workspaces.

| Classification | Inventory result | D32-5 handling |
| --- | --- | --- |
| A. Ordinary officer work | Dashboard metrics, rows, quick links, SLA rows, Shared Work rows, task/queue collaboration, workflow rows, case breadcrumbs, referral actions | Migrated to contract constants or request helpers. |
| B. Explicit role switcher | Legacy `View as` choices and supervisor workspace links | Retained as explicit workspace-switching behavior. |
| C. Log Out action | `InternalSidebar` demo handler | Retained as a button action that exits to `/demo`; no canonical href. |
| D. External/public action | `mailto:`, `tel:`, external-recipient sharing, public verification page | Retained where explicitly external or public. |
| E. Tests and historical documentation | D32 history and compatibility assertions | Retained; current expectations updated only where D32-5 legitimately changes a previous protected source list. |
| F. Legacy reusable officer components | Former dashboard references, view model, adapter, and non-rendered dashboard body | Migrated so they cannot reintroduce cross-workspace or nonexistent officer destinations. |

## Legacy Destinations Removed

- Officer dashboard hashes such as `/demo/officer#queue` and `/demo/officer#messages`.
- Officer dashboard and fixture links to `/demo/department` and `/demo/reports`.
- The nonexistent `/demo/officer/department-inbox` action.
- Literal request-detail and referral URLs in officer fixtures and body components.
- The public `/demo` brand target for the Officer sidebar.

## Canonical Replacements

- Queue, task, SLA, workflow, Shared Work, document, communication, and output links now use `OFFICER_ROUTE_HREFS`.
- Collaboration and handoff actions use Workflow Inbox or Shared Work according to their officer intent.
- Documents awaiting review uses Document Review; decisions use Approval Queue; applicant corrections use Returned to Applicant; messages use Applicant Messages.
- Compatibility-only `/demo/officer/documents`, `/demo/officer/sla`, and `/demo/officer/reports/sla` remain available but are not newly linked.

## Dynamic Request Routes

The canonical contract now exports:

- `getOfficerRequestHref(requestId)`
- `getOfficerRequestReferralHref(requestId)`
- `isOfficerRoutePath(pathname)`

Request IDs are encoded with `encodeURIComponent`. Referral URLs retain `?view=refer` only as a view of a specific request, never as sidebar page identity.

## Surface Migration

- **Dashboard:** Current dashboard actions navigate to officer request, workflow, document, communication, Shared Work, approval, return, and SLA destinations. Reusable references/adapters/view models receive the same migration.
- **Tasks and queue:** Case and referral actions use request helpers; quick links use the canonical queue, SLA, Workflow Inbox, and dashboard hrefs.
- **Workflow and Shared Work:** Officer workflow and Shared Work rows open officer request details. Handoff/collaboration actions remain officer-owned.
- **Documents:** Officer document navigation is represented by the canonical document route constants in dashboard actions; no normal officer action enters outcomes or public verification.
- **Communication:** Communication actions use Applicant Messages or case-specific officer request hrefs. External contact behavior remains external.

## Brand And Role Resolution

`getInternalSidebarBrandHref` directs the Officer brand to `OFFICER_ROUTE_HREFS.home`; other role brand behavior remains `/demo`.

Both role-resolution consumers share `isOfficerRoutePath`: the route registry uses it for lowercase bridge resolution, and `DemoWorkspaceRoleProvider` uses it for its uppercase role system. Canonical routes, request details, referral query views, the documents hub, and both SLA aliases resolve to Officer.

## Files Changed

- Canonical officer navigation contract and route registry
- Officer role resolution and sidebar brand resolver
- Officer dashboard reference, view model, adapter, current dashboard, and high-fidelity dashboard
- Officer tasks, workflow, Shared Work, SLA, request, and referral bodies
- D32-4 expectation adjustment, D32-5 unit coverage, and D32-5 Playwright link audit
- This document

## Protected Files

The officer layout, shell primitives, top bar, role workspace shell, navigation group/item inventory, Shared Work route definition, other role workspaces, public verification behavior, global CSS, and package files remain unchanged.

## Validation Results

- Focused D32-1 through D32-5 unit suite: passed (6 files, 40 tests).
- Full unit suite: passed (8 files, 56 tests).
- `npm run typecheck`: passed.
- `npm run lint`: passed with four pre-existing unused-import warnings and no errors.
- `git diff --check`: passed.
- Focused Playwright crawler: could not start because the existing Next dev server (PID 99751, port 3000) owns the shared `.next` development lock. It was left running and untouched.
- `npm run build`: reached `Creating an optimized production build ...`, made no further progress during the bounded 30-second window, and was stopped cleanly. It exited 130 and did not create `.next/BUILD_ID`; it is not a passing build result.

## Runtime Route Audit

The existing local server returned HTTP 200 for all fifteen canonical officer routes, the request-detail route, the referral query view, the documents compatibility hub, and both SLA compatibility routes. The SLA route modules retain their server-side redirects to `/demo/officer/sla-monitor`.

## Link Crawler

`tests/visual/d31/officer-link-consolidation.pw.ts` performs a non-destructive officer link audit. It starts at the dashboard, follows an ordinary work-plan action, visits discovered body links and every canonical route, verifies one Officer shell, one active item, the Officer role/switcher, hard refresh, and the brand home link.

## Known Limitations

The existing locally running Next server prevents the repository Playwright configuration from starting its own port-3107 server because both use `.next`. The focused crawler remains ready to run once that server is not holding the development lock. Production build behavior is validated separately with a bounded run.

## Acceptance Checklist

- [x] Canonical navigation remains four groups, sixteen items, fifteen routes, and one action.
- [x] Shared Work remains unchanged.
- [x] Dynamic request and referral builders are contract-owned and URL-encoded.
- [x] Ordinary dashboard, task, workflow, Shared Work, SLA, and referral links are officer-owned.
- [x] Officer brand returns to `/demo/officer`.
- [x] Both role-resolution systems use the shared officer predicate.
- [x] Compatibility aliases remain available and are not reintroduced as normal links.
- [x] Direct HTTP route audit and full unit/type/lint validation complete.
- [ ] Browser crawler is blocked by the pre-existing shared `.next` dev-server lock.
- [ ] Production build did not complete within the bounded window.

## D32-6 Handoff

D32-6 may rely on one canonical source for officer navigation and normal officer route ownership. It should preserve the explicit role-switcher, logout, external communication, and clearly labelled public-action exceptions documented here.
