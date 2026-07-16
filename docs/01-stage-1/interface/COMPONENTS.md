# FAIDIA Stage 1 — Component Contracts

**Status:** READY_FOR_PRODUCT_OWNER_REVIEW  
**Version:** 0.1  
**Last updated:** 2026-07-14  
**Product:** FAIDIA — Service Operations Platform  
**Authority:** `DESIGN-SYSTEM.md`, `docs/01-stage-1/architecture/PROJECT-STRUCTURE.md`, `docs/01-stage-1/architecture/ROUTES.md`, and approved Stage 0 product, page, permission and status rules

## 1. Purpose

This document defines the reusable interface components required to implement the Stage 1 Transcript Request slice.

For a beginner: components are reusable building blocks. A button is a small component; a request timeline or queue table is a larger domain component. The goal is reuse without hiding permissions or business rules inside visual code.

## 2. Component thesis

Use shadcn/ui and Radix behavior as accessible starting primitives, then compose FAIDIA-owned components around approved domain concepts. Pages coordinate components; components display already-authorized data and invoke explicit server actions.

A component must not decide whether a user has permission, translate an internal status into an applicant status, or invent the next workflow step. Those decisions belong to server authorization, domain mappings and application commands.

## 3. Ownership and folder rules

| Folder | Owns | Must not own |
|---|---|---|
| `src/components/ui/` | minimally adapted shadcn primitives and visual variants | FAIDIA workflow logic or feature-specific queries |
| `src/components/shared/` | cross-feature states, status presentation, references, pagination and feedback | direct database access |
| `src/components/shells/` | public/auth/applicant/staff/admin layout and navigation presentation | permission derivation from client claims |
| `src/components/forms/` | generic form field, step navigation, upload presentation | final server validation or transitions |
| `src/components/tables/` | table shell, toolbar, responsive row/card behavior | feature-specific authorization |
| `src/components/charts/` | accessible Recharts wrappers and summaries | aggregate queries or fabricated metrics |
| `src/features/*/components/` | domain-specific components used by that feature | unrelated feature behavior |

Prefer a feature-local component until two approved features need the same stable contract. Do not create a generic abstraction based only on visual similarity.

## 4. Shared component conventions

Every interactive component must define:

- accessible name and keyboard behavior;
- default, hover, focus-visible, disabled and pending states;
- error behavior where applicable;
- comfortable and compact density where needed;
- responsive behavior;
- safe empty/loading presentation;
- a testable API with explicit props.

Rules:

- Use server-rendered components by default.
- Add `"use client"` only for actual interaction or browser APIs.
- Pass serializable view models to client components.
- Never pass raw database rows, unrestricted user objects or storage paths to presentation code.
- Server Actions return a typed success/error result and revalidate current authority.
- Disabled controls never substitute for server authorization.

## 5. Primitive inventory

These are the only foundational primitives expected in Stage 1. Add another primitive only when an approved page requires it.

| Component | Required variants/states | Notes |
|---|---|---|
| `Button` | primary, secondary, outline, ghost, destructive, link; sm/default/lg; pending | pending keeps width, announces progress and prevents duplicate action |
| `IconButton` | neutral, primary, destructive | accessible name required; tooltip for unfamiliar icon |
| `Link` | inline, navigation, action | external links identify new context |
| `Badge` | neutral, primary, success, warning, danger, info | not a domain status mapper |
| `Input` | default, invalid, disabled, read-only | visible label supplied by `FormField` |
| `Textarea` | default, invalid, disabled, read-only | visible count only when a real limit exists |
| `Select` | native on simple mobile flows; Radix select where needed | searchable combobox is a separate justified component |
| `Checkbox` | unchecked, checked, mixed, invalid | label is part of hit target |
| `RadioGroup` | default, invalid, disabled | use for one choice among a small set |
| `DateInput` | date or date-time contract | store/submit ISO value; render organization time zone label |
| `FormField` | label, description, required/optional marker, error | generates stable IDs and `aria-describedby` |
| `Card` | default, selected, action-required | restrained border; no decorative hover unless clickable |
| `Alert` | info, success, warning, danger | includes title, message and optional action |
| `Dialog` | normal form/confirmation | focus-managed; mobile may become full-screen sheet |
| `AlertDialog` | destructive or consequential confirmation | names object and consequence |
| `Sheet` | mobile navigation or secondary detail | never hides the only primary action on desktop |
| `Tabs` | manual activation unless panel load is trivial | responsive and deep-linkable only when route contract requires it |
| `DropdownMenu` | secondary actions | no critical action available only by an unlabeled menu |
| `Tooltip` | supplemental explanation | never contains essential interactive content |
| `Avatar` | image, initials fallback | alt/name rules; do not depend on remote avatar |
| `Separator` | visual/semantic grouping | use real headings for major groups |
| `Skeleton` | layout-matched loading | no fake numbers or status colors |
| `Spinner` | short inline pending state | pair with text for longer waits |
| `Toast` | success, info, warning, error | not the sole evidence of important completion |
| `Progress` | determinate/indeterminate | text value or accessible label required |

## 6. Shared structural components

### 6.1 Shells

| Component | Required input | Contract |
|---|---|---|
| `PublicShell` | safe organization brand, public navigation | no authenticated data or controls |
| `AuthShell` | safe brand, form content, return link | focused layout with one main task |
| `ApplicantShell` | applicant-safe identity, authorized nav items, notification count | never receives internal status, staff notes, SLA or assignment data |
| `StaffShell` | safe staff identity, authorized nav groups, role label | shared by Officer and Supervisor; navigation is supplied from server grants |
| `AdminShell` | safe admin identity, authorized Stage 1 admin nav | no sensitive request navigation or applicant data |
| `SidebarNav` | groups containing visible authorized items | current route indicated by text, icon and visual selection; empty groups omitted |
| `MobileNavSheet` | same authorized items as sidebar | closes after route change and restores focus |
| `TopBar` | notification control and user menu | no enabled global search in Stage 1 unless scope is promoted |
| `UserMenu` | display name, role label, allowed account actions | sign-out is always explicit |

### 6.2 Page structure

| Component | Required input | Contract |
|---|---|---|
| `PageHeader` | title, optional description, breadcrumbs, permitted actions | one `h1`; actions wrap below title on small screens |
| `Breadcrumbs` | route-safe items | current page is text, not a redundant link |
| `SectionHeader` | heading, optional supporting text/action | maintains heading hierarchy |
| `ContentGrid` | responsive areas | CSS grid; preserves critical content order on mobile |
| `SplitPane` | primary content and contextual panel | collapses to one column; primary action remains visible |
| `MetricCard` | label, value, optional trend/context, semantic icon | value comes from server; trend includes direction text, not arrow/color alone |
| `FreshnessLabel` | generated-at timestamp and organization time zone | required on reporting surfaces |

### 6.3 Universal page states

| Component | Contract |
|---|---|
| `PageSkeleton` | matches the page's real regions and preserves known title/context |
| `EmptyState` | reason, optional illustration/icon and one permitted next action |
| `ErrorState` | safe message, retry/return action and support reference; no sensitive details |
| `PermissionDeniedState` | no protected preview; safe return destination |
| `NotFoundState` | avoids confirming existence of another tenant's object |
| `StaleActionBanner` | explains concurrent change, refreshes view model and requires reconfirmation |
| `InlineErrorSummary` | focusable list linking to invalid fields |

## 7. Navigation and status components

### 7.1 `RequestReference`

Displays an applicant-safe or staff-safe reference exactly as supplied.

Props:

```ts
type RequestReferenceProps = {
  value: string
  label?: string
  copyable?: boolean
}
```

The component may copy the displayed value. It does not resolve internal IDs.

### 7.2 `StatusBadge`

```ts
type StatusPresentation = {
  label: string
  tone: "neutral" | "primary" | "success" | "warning" | "danger" | "info"
  icon?: LucideIconName
  accessibleDescription?: string
}
```

The server supplies a presentation derived from the authoritative mapping. Applicant code never receives internal status values merely so the client can hide or translate them.

### 7.3 `SlaIndicator`

Staff-only component showing due state and an absolute due time/date.

Required states: on track, due soon, overdue, paused/not applicable. Relative text such as “2 hours left” must be accompanied by the absolute organization-local deadline.

### 7.4 `PriorityBadge`

Renders an approved priority value with text and semantic presentation. Priority is not inferred from SLA.

## 8. Applicant components

| Component | Purpose | Required behavior |
|---|---|---|
| `ApplicantDashboardSummary` | current request and next action | emphasizes Action Required; omits internal work/department detail |
| `ServiceCard` | public published service summary | name, purpose, eligibility cue, expected time and safe view/start action |
| `ServiceDetails` | public service requirements | renders published version only; does not expose draft configuration |
| `RequestStepper` | application form/document/review progress | current/completed/upcoming text states; keyboard readable; not workflow internals |
| `FormSection` | grouped schema fields | stable heading and error linkage |
| `FormNavigation` | save, back and continue | pending protection; sticky mobile option; server result handling |
| `UploadDropzone` | accessible file selection | keyboard-operable input, drag/drop enhancement, constraints and progress |
| `DocumentUploadRow` | one required/supporting file | name, requirement, file status, safe remove/retry/replace actions |
| `ReviewSnapshot` | immutable pre-submit review | field groups, documents, edit links and consent/submit context |
| `DuplicateRequestNotice` | possible duplicate warning | explains safe next step; override appears only when server permits it |
| `RequestList` | applicant's own requests | card-first responsive view; no required horizontal table |
| `ApplicantRequestHeader` | reference, applicant-safe status and service | no owner, SLA, internal step or department notes |
| `NextActionCard` | exact action applicant can take | one primary action; explanation and applicable due date |
| `ApplicantTimeline` | safe chronological history | only applicant-visible event view models; no actor/internal notes |
| `CorrectionPanel` | requested corrections | clear instructions, affected fields/files and resubmit action |
| `ApplicantMessageThread` | permitted request communication | chronological, accessible, pending/error states; no internal notes |
| `OutcomeCard` | outcome ready/issued state | safe metadata and controlled download/collection information |
| `OutcomeDownloadButton` | controlled download | obtains a fresh signed URL server-side and records required action/event |

Applicant components must use plain-language public status. They may not reveal Finance decisions such as `CLEAR`/`CANNOT_VERIFY`, internal assignments, work-item state or operational SLA unless Stage 0 explicitly makes the fact applicant-visible.

## 9. Officer and Supervisor components

### 9.1 Queue components

| Component | Purpose | Required behavior |
|---|---|---|
| `QueueSummaryCards` | assigned, due and overdue totals | real scoped aggregates; selected filter communicated to table |
| `QueueToolbar` | search/filter/sort permitted rows | filter state in URL where useful; reset; accessible labels |
| `QueueTable` | operational request list | TanStack Table; compact rows; visible status, current step, due state and action |
| `QueueCardList` | small-screen queue alternative | labeled fields; same actions and ordering as table |
| `QueueRowAction` | open/review permitted request | descriptive label; no client-only permission decision |
| `Pagination` | page/range navigation | announces current page, total and disabled boundaries |

### 9.2 Request-processing workspace

| Component | Purpose | Required behavior |
|---|---|---|
| `StaffRequestHeader` | request context | reference, service, internal status, owner, current step and SLA |
| `ApplicantSummaryPanel` | minimum identity/contact context | only data permitted for the current role/task |
| `RequestTabs` | overview, documents, messages, notes and history | panels remain embedded in `/officer/requests/[id]`; no invented routes |
| `SubmittedResponsePanel` | immutable response snapshot | differentiates original/corrected values without rewriting history |
| `DocumentReviewList` | document inspection | accepted/rejected/current history and permitted review actions |
| `DocumentReviewAction` | accept or reject document | requires reason where specified; stale-state handling |
| `InternalNoteComposer` | append internal note | explicitly labeled “Internal”; applicant cannot receive this view model |
| `OperationalTimeline` | permission-scoped history | includes actors/actions allowed to viewer; append-only presentation |
| `ActionPanel` | current permitted commands | server-supplied actions; pending, conflict and consequence treatment |
| `CorrectionRequestDialog` | request applicant correction | affected items, reason and applicant-facing instructions required |
| `WorkItemCompletionDialog` | complete current work | summarizes downstream transition before confirmation |
| `RegistrarDecisionPanel` | approve/reject/return | embedded; exact permission; Finance clearance displayed; reasons required by contract |
| `OutcomeGenerationPanel` | outcome preparation/retry | failure does not pretend success; authorized retry only |
| `CompletionDialog` | download/collection/manual closure completion | exact method, actor and consequences; permission-gated |
| `ReopenDialog` | exceptional reopen | reason required; displays resulting state/work item |
| `RevokeOutcomeDialog` | revoke issued document | separate permission and explicit irreversible consequence |

The server supplies `permittedActions`; the client may use them for presentation but every action revalidates membership, organization, department, assignment/handoff, permission, state and version.

### 9.3 Finance handoff components

| Component | Purpose | Required behavior |
|---|---|---|
| `HandoffStatusBadge` | handoff state | exact approved state label; not request status |
| `HandoffSummary` | source/target, request, action and due state | coordinating owner remains visible as Student Records |
| `HandoffInboxTable` | Finance handoffs | only authorized department rows; pending/accepted/clarification states |
| `HandoffDetailsPanel` | full permitted context | reason, expected output, safe attachments and permitted actions |
| `HandoffCreateDialog` | Records creates Finance referral | Stage 1 target fixed/validated to Finance; reason and requested action required |
| `HandoffAcceptAction` | accept assignment | validates current handoff state and Finance permission |
| `HandoffDeclineDialog` | decline | reason required; does not reject the applicant request |
| `HandoffClarificationDialog` | return for clarification | required explanation; preserves handoff history |
| `FinanceDecisionPanel` | record `CLEAR`, `HOLD` or `CANNOT_VERIFY` | exact result and required note/evidence; no applicant-safe mapping in client |
| `HandoffCompleteAction` | finish Finance work | blocked without valid Stage 1 result; records completion event |

Do not implement the broad “share with any department/officer” or workflow-invite experiences shown in references. Stage 1 implements the approved Student Records → Finance referral only.

### 9.4 Supervisor components

| Component | Purpose | Required behavior |
|---|---|---|
| `SupervisorMetricGrid` | backlog, overdue and stage duration | real scoped values and freshness label |
| `BacklogChart` | backlog/stage timing | Recharts plus accessible table/text summary |
| `ApprovalQueue` | pending Registrar decisions | exact grant and department scope; links to shared request workspace |
| `OverdueWorkList` | action-oriented overdue items | absolute deadline and owner; no applicant-sensitive data beyond permission |
| `DepartmentPerformanceTable` | Stage 1 operational metrics | no fabricated comparison; definition/period available |

## 10. Organization Admin components

| Component | Purpose | Data boundary |
|---|---|---|
| `AdminSetupSummary` | setup completeness and safe counts | organization metadata/configuration only |
| `OrganizationMetadataForm` | approved organization fields | no arbitrary custom fields or CSS |
| `BrandingForm` | logo and primary accent | validated file, contrast and safe preview |
| `SeededServiceTable` | seeded services and publication metadata | no request/applicant content |
| `ServiceMetadataForm` | limited Stage 1 service metadata | not a form/workflow builder |
| `ConfigurationVersionBadge` | draft/published/version identity | published versions read-only |
| `AdminActivitySummary` | safe configuration activity | excludes applicant-sensitive audit content |

The full department/user/workflow builder/reporting/audit screens in the references are not Stage 1 component requirements.

## 11. Tables

Use one `DataTable` shell around TanStack Table with feature-owned column definitions.

Required capabilities only when the page contract calls for them:

- server pagination for unbounded lists;
- URL-backed sort/filter;
- visible result count;
- loading skeleton with stable columns;
- empty and no-filter-match states;
- responsive card renderer;
- row action with accessible label;
- no client-side export unless explicitly authorized.

Do not add bulk selection, saved views, column customization or export merely because references show them.

## 12. Charts

Use FAIDIA wrappers around Recharts:

| Component | Contract |
|---|---|
| `ChartCard` | title, description, period/freshness, chart and accessible summary |
| `TrendLineChart` | real time series, labeled axes, restrained grid, tooltip and text summary |
| `ComparisonBarChart` | category/value comparison with values available outside hover |
| `StatusDonutChart` | at most five categories; values repeated in adjacent list/table |
| `ChartLegend` | text, marker and value; does not rely only on hue |
| `ChartFallbackTable` | same values in semantic table or concise list |

Heatmaps, saved report views and export controls shown in references are not Stage 1 requirements unless promoted later.

## 13. Forms

### 13.1 Contract

Form components use React Hook Form for client interaction and Zod for validation. The server remains authoritative.

```ts
type ActionResult<T = undefined> =
  | { ok: true; data: T }
  | {
      ok: false
      code: string
      message: string
      fieldErrors?: Record<string, string[]>
      stale?: boolean
      supportReference?: string
    }
```

The exact cross-layer error contract is finalized in `API-CONTRACTS.md` and `ERROR-HANDLING.md`. Components must not parse database errors or expose exception text.

### 13.2 Consequential actions

Approval, rejection, correction, handoff result, issue, manual closure, reopen and revoke components require:

- a visible object/reference;
- a plain-language consequence;
- required reasons/instructions when specified;
- a pending state;
- stale/concurrency recovery;
- success reflected in the page, not toast-only;
- server-side authorization and state revalidation.

## 14. Component-to-route matrix

| Route family | Primary components |
|---|---|
| Public organization/services | `PublicShell`, `ServiceCard`, `ServiceDetails`, universal page states |
| Login/register | `AuthShell`, `FormField`, auth forms, `InlineErrorSummary` |
| Applicant dashboard/requests | `ApplicantShell`, `ApplicantDashboardSummary`, `RequestList`, `NextActionCard` |
| Applicant form/documents/review | `RequestStepper`, `FormSection`, `UploadDropzone`, `DocumentUploadRow`, `ReviewSnapshot`, `FormNavigation` |
| Applicant request/timeline/messages/outcome | `ApplicantRequestHeader`, `ApplicantTimeline`, `CorrectionPanel`, `ApplicantMessageThread`, `OutcomeCard` |
| Officer dashboard/queues | `StaffShell`, `QueueSummaryCards`, `QueueToolbar`, `QueueTable`, `QueueCardList` |
| Officer request workspace | `StaffRequestHeader`, `RequestTabs`, review/action/dialog components |
| Finance handoffs | `HandoffInboxTable`, `HandoffDetailsPanel`, `FinanceDecisionPanel` |
| Supervisor dashboard | `SupervisorMetricGrid`, accessible charts, `ApprovalQueue`, `OverdueWorkList` |
| Admin Stage 1 routes | `AdminShell`, `AdminSetupSummary`, metadata/branding/service components |

## 15. Acceptance traceability

| Acceptance range | Principal component coverage |
|---|---|
| AC-DIS-01–06 | public shell, service cards/details and public states |
| AC-AUT-01–07 | auth shell/forms and applicant dashboard |
| AC-SUB-01–15 | stepper, schema fields, documents, review, duplicate notice and submit feedback |
| AC-REV-01–07 | staff queue and request-processing workspace |
| AC-COR-01–08 | correction dialog, applicant correction panel and document history |
| AC-FIN-01–15 | handoff inbox/details/actions and Finance decision panel |
| AC-REG-01–13 | work completion and Registrar decision panel |
| AC-OUT-01–08 | outcome generation, failure/retry and applicant outcome card |
| AC-CMP-01–15 | controlled download, collection/manual closure, reopen and revoke dialogs |
| AC-NOT-01–05 | notification control, alerts and durable page feedback |
| AC-AUD-01–06 | applicant-safe and operational timelines |
| AC-REP-01–05 | metrics, accessible Recharts wrappers and freshness labels |
| AC-SEC-01–11 | server-supplied view models/actions and safe denied/not-found states |
| AC-SCP-01–07 | shell scope, universal states, responsive alternatives and keyboard contracts |

## 16. Component test minimum

Each critical component requires the applicable checks:

- renders required label/content;
- keyboard behavior and focus order;
- accessible name, role and description;
- default, pending, disabled, error and stale state;
- applicant versus staff data boundary;
- responsive table/card equivalence;
- semantic status meaning without color;
- server action success/failure/conflict integration;
- no protected-data flash during loading or denial.

Use Testing Library for behavior, axe for automated accessibility checks, and Playwright for shell/route/action flows. Visual regression may support testing but cannot replace the acceptance contract.

## 17. Explicit exclusions

- Components for payment, saved drafts, renewals, document vault, workflow invites or transfers.
- A generic workflow builder, form builder, permission editor or marketplace.
- Enabled global search.
- Saved report views, universal export or arbitrary bulk actions.
- Client-side permission decisions.
- Client-side status mapping from internal to applicant-visible states.
- A second UI, table or chart library.

## 18. Verification checklist

- [ ] Primitive inventory is implemented only as needed.
- [ ] Shell navigation is server-authorized and contains only Stage 1 destinations.
- [ ] Domain components consume safe view models rather than raw rows.
- [ ] Applicant components receive no internal statuses, notes, SLA or assignment details.
- [ ] Embedded actions remain embedded; no extra routes are created.
- [ ] Queue tables have equivalent small-screen card rendering.
- [ ] Handoffs are limited to the approved Finance referral.
- [ ] Charts use Recharts, real data, freshness and accessible summaries.
- [ ] Consequential actions handle pending, failure and stale state.
- [ ] Component tests cover keyboard, permission boundary and responsive behavior.

## 19. Open questions

None. Later domain and API documents will finalize view-model and action-result TypeScript types without changing these interface boundaries.

## 20. Change rule

Adding a component that implies a new route, feature, status, role, permission, workflow branch or data exposure requires the controlling Stage 0 document to change first. Internal refactoring that preserves this contract may be recorded in the changelog.

## 21. Coding-agent instruction

Build primitives, universal states and shells before feature pages. Build feature components beside their feature. Never use a disabled button, hidden menu or client check as authorization. If a reference contains a control not approved in Stage 0, omit it.
