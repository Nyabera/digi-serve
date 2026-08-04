# FAIDIA Demo Engine Internal Shell Reference

## Document status

- Stage: D29R-0
- Status: Controlling reference
- Scope: Internal officer, department, supervisor, reporting and future administration workspaces
- Public applicant journey: Unchanged
- Workflow behavior: Unchanged
- Route inventory: Unchanged at 14 pages
- Production Supabase access: Prohibited
- Next implementation stage: D29R-1 shared internal shell

## 1. Purpose

D29R-0 freezes the visual and information-architecture reference for the FAIDIA internal application shell before implementation begins.

The current internal pages use a full-width Demo Engine control bar, dark page-level headers, oversized standalone cards and page-specific layouts. The approved direction is a consistent service-operations application shell with:

- a persistent role-aware sidebar;
- a compact white topbar;
- dense operational content;
- reusable KPI cards;
- queue-first tables;
- right-side context and action panels;
- restrained borders and elevation;
- one shared visual language across officer, department, supervisor, outcome and reporting pages.

This stage records the reference. It does not redesign runtime components.

## 2. Source-of-truth order

When sources differ, use this order:

1. **Existing FAIDIA workflow and state rules** control behavior.
2. **`app/globals.css`** controls visual tokens, typography, spacing, radii, controls, tables, badges, navigation states, focus states and chart styling.
3. **The seven approved screenshots** control composition, page geometry, density, hierarchy and interaction placement.
4. **`Nav items.docx`** controls navigation labels and role grouping.
5. Existing D26–D28 calibration layers may supplement accessibility and responsive behavior, but they must not override this shell architecture.

### Important source note

The uploaded `design.md` is a Supabase Auth and SSR cookie-design document. It is not a visual design-system specification. It remains relevant to future authentication architecture, but it does not control D29R shell styling.

For D29R visual implementation, `app/globals.css` is the binding FAIDIA design-system source.

## 3. Approved reference asset register

All approved assets live in:

`public/demo/references/internal-shell/`

| Asset | Controlling use |
|---|---|
| `01-officer-dashboard.png` | Shared desktop shell, sidebar, topbar, six-metric strip, dashboard composition, queue preview, messages and SLA panels |
| `02-officer-queue.png` | Full queue page, search/filter/sort toolbar, dense request table, pagination and right-side comments/deadlines rail |
| `03-handoff-collaboration.png` | Cross-department overview, collaboration funnel, active-case table, timeline, conversation and assistance panel |
| `04-referral-composer.png` | Two-column request review and referral form, applicant summary, audit trail, form controls and action hierarchy |
| `05-workflow-invites.png` | Invitation queue, detail drawer, table actions, status hierarchy and workflow timeline |
| `06-returned-cases.png` | Returned-work list, KPI strip, filters, compact status table and bottom assistance action bar |
| `07-department-handoff-inbox.png` | Department inbox, handoff metrics, master-detail layout, right-side action panel and recently completed handoffs |

The screenshots control structure and density, not their exact brand color values, names, people, counts or institutional data.

## 4. Non-negotiable shell architecture

All internal workspaces must use one shared shell:

```text
InternalAppShell
├── InternalSidebar
│   ├── InstitutionBrand
│   ├── RoleNavigation
│   ├── OptionalHelpCard
│   └── AccountNavigation
├── InternalTopbar
│   ├── MobileSidebarTrigger
│   ├── GlobalSearch
│   ├── RequestSelector
│   ├── PresentationAction
│   ├── ResetAction
│   ├── Notifications
│   └── StaffProfile
└── InternalMain
    ├── Breadcrumbs or page context
    ├── PageHeader
    ├── MetricStrip
    └── Page-specific operational content
```

The following are prohibited on redesigned internal routes:

- a full-width Demo Engine bar above the product shell;
- a large dark hero-style workspace header;
- separate shell geometry for each role;
- oversized marketing-style cards;
- large empty gaps between operational sections;
- decorative gradients;
- arbitrary blues that bypass FAIDIA tokens;
- page-specific navigation lists;
- duplicated topbar or profile controls.

## 5. Binding design tokens from `app/globals.css`

Implementation must use tokens and utilities already defined in `app/globals.css`. Hard-coded fallback values may appear only inside the shared shell stylesheet when required for progressive rendering.

### 5.1 Color system

| Use | Required token | Current value |
|---|---|---|
| Main app background | `var(--background)` | `#f8fafc` |
| Primary surface | `var(--surface)` | `#ffffff` |
| Subtle surface | `var(--surface-subtle)` | `#f1f5f9` |
| Strong heading | `var(--foreground)` | `#0b1b4d` |
| Body text | `var(--text)` | `#172554` |
| Muted text | `var(--muted-foreground)` | `#64748b` |
| Primary action | `var(--primary)` | `#2337b8` |
| Primary hover | `var(--primary-hover)` | `#1b2c97` |
| Selected/active background | `var(--primary-soft)` | `#eef0fb` |
| Standard border | `var(--border)` | `#dce4ef` |
| Strong/control border | `var(--border-strong)` | `#c5d1e2` |
| Destructive action | `var(--destructive)` | `#b42318` |

The screenshot references use a brighter blue. FAIDIA must retain `var(--primary)` and `var(--primary-hover)` rather than copying the screenshot blue.

### 5.2 Typography

Use the existing font stack:

```css
var(--font-plus-jakarta-sans),
var(--font-inter),
ui-sans-serif,
system-ui,
sans-serif
```

Use Source Code Pro only for identifiers and technical references.

Required utility hierarchy:

| Content | Utility |
|---|---|
| Main internal page title | `.text-page-title` |
| Major section title | `.text-section-title` |
| Card/panel title | `.text-card-title` |
| Staff body copy | `.text-body-compact` |
| Labels | `.text-label` or `.field-label` |
| Captions, timestamps, metadata | `.text-caption` |
| Request and handoff IDs | `.text-reference` |

Internal pages must not use marketing-scale display typography.

### 5.3 Layout geometry

| Element | Binding token |
|---|---|
| Expanded staff sidebar | `var(--sidebar-width-staff)` = `16.5rem` |
| Collapsed staff sidebar | `var(--sidebar-width-collapsed)` = `4.5rem` |
| Mobile drawer | `var(--sidebar-width-mobile)` |
| Desktop topbar | `var(--topbar-height-desktop)` = `4rem` |
| Mobile topbar | `var(--topbar-height-mobile)` = `3.5rem` |
| Desktop content gutter | `var(--content-gutter-desktop)` = `2rem` |
| Tablet content gutter | `var(--content-gutter-tablet)` = `1.5rem` |
| Mobile content gutter | `var(--content-gutter-mobile)` = `1rem` |
| Wide content maximum | `var(--container-content-wide)` = `90rem` |

Desktop shell grid:

```css
grid-template-columns:
  var(--sidebar-width-staff)
  minmax(0, 1fr);
```

The sidebar is fixed or sticky for the viewport height. The topbar is sticky within the main column. The content area uses `var(--background)`.

### 5.4 Radius, borders and elevation

| Element | Rule |
|---|---|
| Large panels and KPI cards | `var(--radius-card)` |
| Inputs, buttons and compact panels | `var(--radius-control)` |
| Badges | `var(--radius-compact)` or pill |
| Standard panel border | `1px solid var(--border)` |
| Selected control border | `var(--border-selected)` |
| Default card shadow | none or `var(--elevation-control)` |
| Floating panel/popover | `var(--elevation-popover)` |
| Dialog/drawer | `var(--elevation-dialog)` |

The screenshots are visually flat. Use elevation sparingly. Borders and spacing provide the primary hierarchy.

### 5.5 Controls and tables

Use existing utilities:

- `.button-base`;
- `.button-dense`;
- `.button-compact`;
- `.button-primary`;
- `.button-secondary`;
- `.button-ghost`;
- `.button-destructive`;
- `.button-icon`;
- `.input-base`;
- `.input-dense`;
- `.input-compact`;
- `.table-density-dense`;
- `.table-density-compact`;
- `.table-density-comfortable`.

Preferred internal defaults:

| Interface | Density |
|---|---|
| Topbar controls | compact |
| Sidebar navigation | compact |
| Toolbars | compact |
| Large queue tables | compact |
| Small supporting tables | dense |
| Detail panels | comfortable |
| Applicant-facing forms | applicant/comfortable |

A queue table should normally use:

- `2.75rem` header height;
- `3rem` compact row height;
- `0.8125rem` row text;
- tabular numbers for counts;
- Source Code Pro for request IDs;
- row hover without heavy shadow.

### 5.6 Navigation states

Use the existing navigation utilities:

- `.nav-list`;
- `.nav-item`;
- `.nav-item-icon`;
- `.nav-item-label`;
- `.nav-item-count`.

Active navigation must use:

```html
aria-current="page"
```

The current item receives:

- `var(--primary-soft)` background;
- `var(--primary)` text;
- the existing 3px left active rail;
- an optional count badge.

Do not recreate navigation colors locally.

### 5.7 Status and priority badges

Use:

- `.badge-base`;
- `.badge-compact`;
- `.badge-neutral`;
- `.badge-info`;
- `.badge-success`;
- `.badge-warning`;
- `.badge-danger`;
- `.badge-outline`;
- `.badge-dot`.

Required semantic mapping:

| Meaning | Style |
|---|---|
| New, in review, in progress | info |
| Ready, approved, completed, clear | success |
| Pending, due soon, waiting | warning |
| Returned, rejected, overdue, blocked | danger |
| Closed, archived, neutral metadata | neutral |

Status meaning must not rely on color alone. Always show a readable text label.

## 6. Desktop shell geometry

At `80rem` and wider:

```text
┌─────────────────────┬────────────────────────────────────────────┐
│                     │ Topbar: search, controls, alerts, profile  │
│  16.5rem sidebar    ├────────────────────────────────────────────┤
│                     │                                            │
│  Brand              │ Page title + description                   │
│  Navigation groups  │ Metric strip                               │
│  Help/account       │ Main operational grid                      │
│                     │                                            │
└─────────────────────┴────────────────────────────────────────────┘
```

Required measurements:

- sidebar: `16.5rem`;
- topbar: `4rem`;
- page gutter: `2rem`;
- main content max width: `90rem`;
- major vertical section gap: `1.25rem` to `1.5rem`;
- card grid gap: `1rem`;
- master-detail right rail: `20rem` to `24rem`;
- card padding: compact or default;
- table toolbar height: compact controls;
- no page-level hero.

## 7. Sidebar specification

### 7.1 Institution brand

The brand area contains:

- FAIDIA or configured institution mark;
- institution name;
- division or portal label;
- optional collapse control.

It must use the configured client name rather than screenshot names.

### 7.2 Navigation group headings

Group headings are:

- uppercase;
- caption-sized;
- muted;
- separated by `var(--space-5)` or `var(--space-6)`;
- not interactive.

### 7.3 Officer navigation

The complete Officer information architecture is:

```text
OPERATIONS
- Dashboard
- My Tasks
- Application Queue

WORKFLOW
- Workflow Inbox
- Approval Queue
- Returned to Applicant
- Shared Workflows
- Review Invitations
- Ask for Feedback

DOCUMENTS
- Document Review
- Uploaded Documents
- Generated PDFs
- Issued Documents

SLA
- SLA Monitor
- Due Soon Tasks
- Overdue Tasks

COMMUNICATION
- Correspondence
- Notification Log
- Workflow Invites
- Feedback Requests
- Applicant Messages
- Internal Notes

TOOLS
- QR Verification
- Knowledge Base
- Bulk Actions
- Service Rules

ACCOUNT
- My Profile
- Settings
- Help Centre
- Log Out
```

D29R implementation may show only the items supported by the current demo route inventory. Unsupported items must be disabled, hidden behind an explicit “Demo scope” treatment, or represented as non-navigating labels. They must not link to invented routes.

### 7.4 Supervisor navigation

No separate Supervisor list was supplied. Until one is approved, Supervisor uses an approval-focused subset of the Officer information architecture:

```text
OPERATIONS
- Dashboard
- My Tasks
- Approval Queue

WORKFLOW
- Workflow Inbox
- Returned for Clarification
- Shared Workflows
- Review Invitations

DOCUMENTS
- Document Review
- Generated PDFs
- Issued Documents

SLA
- SLA Monitor
- Due Soon Tasks
- Overdue Tasks

COMMUNICATION
- Correspondence
- Applicant Messages
- Internal Notes

ACCOUNT
- My Profile
- Settings
- Help Centre
- Log Out
```

This is a controlled adaptation, not a new product route set.

### 7.5 Department navigation

The department workspace uses the same shell and a narrowed operating subset:

```text
OPERATIONS
- Dashboard
- My Tasks
- Department Queue

WORKFLOW
- Incoming
- In Progress
- Returned for Clarification
- Completed
- Outgoing

COMMUNICATION
- Applicant Messages
- Internal Notes

SLA
- Due Soon Tasks
- Overdue Tasks

ACCOUNT
- My Profile
- Settings
- Help Centre
- Log Out
```

### 7.6 Admin navigation

The supplied Admin information architecture is:

```text
MAIN
- Dashboard

INSTITUTION SETUP
- Institution Profile
- Branding
- Campus / Branches
- Email / Domains

SERVICES
- Service Builder
- Service Catalogue
- Service Categories
- Requirements
- Fees
- Financial Services
- Forms
- Service Rules
- SLA Rules

USERS & ROLES
- Users
- Officers
- Roles
- Departments
- Access Control
- Delegates
- Permissions
- Approval Roles
- Signatories

WORKFLOWS
- Workflow Templates
- Workflow Builder
- Active Workflows
- Approval Chains
- Routing Notations
- Escalation Rules
- Reassignment Rules
- Status Settings

DOCUMENTS
- Document Templates
- PDF Templates
- Certificate Templates
- Letter Templates
- Edition Rules
- QR Verification Settings
- Document Numbers
- Revocation Rules

COMMUNICATIONS
- Notification Templates
- Email Templates
- Announcements
- Applicant Message Rules
- In-App Notifications

REPORTS
- Reports Dashboard
- SLA Reports
- Revenue Reports
- Service Reports
- Officer Reports
- Verification Reports
- Export Centre

DATA
- CSV Import
- CSV Export
- Data Mapping
- Records
- Backups
- Root Logs
- Audit Logs
- Activity Logs

SETTINGS
- General Settings
- Security
- API Settings
- Support
- Billing
- Help Centre
```

The current 14-route Demo Engine has no `/demo/admin` route. D29R-0 documents the Admin shell language but does not add an Admin route. Any Admin implementation requires an explicit route-inventory decision before coding.

## 8. Topbar specification

The internal topbar must be white and compact.

Left-to-right desktop structure:

1. optional sidebar collapse trigger;
2. global search;
3. compact request selector when useful;
4. presentation action;
5. reset action;
6. notifications;
7. staff avatar, name, role and menu.

Rules:

- topbar height uses `var(--topbar-height-desktop)`;
- border-bottom uses `var(--border)`;
- search uses `.input-base.input-compact`;
- presentation uses `.button-base.button-compact.button-secondary`;
- reset uses a destructive outline treatment;
- demo controls must look native to the product shell;
- the separate full-width D8 control bar is removed from internal page flow during D29R implementation;
- D8/D27 behavior remains intact.

## 9. Shared page templates

### 9.1 Dashboard template

Controlled by `01-officer-dashboard.png`.

```text
PageHeader
MetricStrip: 4–6 cards
MainGrid
├── Primary queue or operational table
├── Supporting activity/message panel
└── Right rail: handoffs, deadlines or SLA
```

Dashboard KPI cards contain:

- a soft semantic icon container;
- compact label;
- large tabular value;
- optional small action link;
- no heavy shadow.

### 9.2 Queue template

Controlled by `02-officer-queue.png` and `06-returned-cases.png`.

```text
PageHeader
MetricStrip
QueuePanel
├── Search
├── Filters
├── Sort
├── Dense table
└── Pagination
RightRail
├── Comments or details
└── Deadlines or supporting activity
```

The queue is the visual center. Filters and actions remain compact.

### 9.3 Handoff master-detail template

Controlled by `03-handoff-collaboration.png` and `07-department-handoff-inbox.png`.

```text
PageHeader
MetricStrip
MasterDetailGrid
├── Handoff table or case list
└── Selected handoff detail
    ├── Source
    ├── Request
    ├── Requested action
    ├── Reason
    ├── Expected output
    ├── Attachments
    └── Accept / Return / Decline
SupportingPanel
└── Recent completed handoffs or timeline
```

### 9.4 Review/referral template

Controlled by `04-referral-composer.png`.

```text
Breadcrumbs
PageHeader
TwoColumnGrid
├── RequestSummary
│   ├── Applicant
│   ├── Request metadata
│   ├── Internal notes
│   └── Audit trail
└── ReferralForm
    ├── Department
    ├── Officer
    ├── Reason
    ├── Urgency
    ├── Message
    ├── Shared-information checklist
    └── Action footer
```

### 9.5 Invitation/detail-drawer template

Controlled by `05-workflow-invites.png`.

```text
PageHeader
MetricStrip
TableWithTabs
└── Invitation rows
PersistentDetailDrawer
├── Invite metadata
├── Inviter note
├── Case summary
├── Workflow timeline
├── SLA warning
└── Accept / Decline / Clarify
```

## 10. Role and route mapping for the current demo

D29R must preserve the approved 14 route pages.

| Current route | Redesign template |
|---|---|
| `/demo/officer` | Officer dashboard with dashboard/queue views |
| `/demo/officer/requests/[requestId]` | Review/referral template |
| `/demo/department` | Department handoff inbox |
| `/demo/department/handoffs/[handoffId]` | Handoff collaboration/detail |
| `/demo/supervisor` | Supervisor dashboard and approval queue |
| `/demo/supervisor/approvals/[requestId]` | Supervisor approval detail |
| `/demo/outcomes/[requestId]` | Controlled outcome inside internal shell |
| `/demo/reports` | Eight-chart reporting page inside internal shell |

No new route may be created during D29R unless the route inventory is formally revised first.

## 11. Data and interaction rules

The redesign must preserve:

- D6 client configuration;
- D7 shared browser-session state;
- D8 role/request controls;
- D21 officer review and Finance referral;
- D22 Finance acceptance, processing and return;
- D23 Registrar approval, rejection and clarification;
- D24 controlled outcome issuance and completion;
- D25 eight-chart operational reports;
- D27 presentation and reset;
- D28 accessibility behavior.

Use view-model selectors to convert existing state into dense UI models. Do not rewrite reducer behavior to satisfy layout needs.

## 12. Responsive behavior

### 12.1 Wide desktop: `80rem` and above

- full `16.5rem` sidebar;
- `4rem` topbar;
- main content gutter `2rem`;
- right rail remains beside main content;
- six KPI cards may appear in one row;
- tables use compact density.

### 12.2 Desktop/tablet landscape: `64rem` to `79.99rem`

- sidebar may collapse to `4.5rem`;
- topbar remains `4rem`;
- right rail narrows or moves below the main table where necessary;
- KPI strip becomes 2–4 columns;
- no page-level horizontal overflow.

### 12.3 Tablet: `48rem` to `63.99rem`

- sidebar becomes an off-canvas drawer;
- topbar uses a menu trigger;
- master-detail views become stacked or use a controlled detail drawer;
- KPI cards use two columns;
- tables scroll inside their panel only.

### 12.4 Mobile: below `48rem`

- topbar uses `3.5rem`;
- sidebar is an off-canvas drawer;
- content gutter is `1rem`;
- KPI cards use one or two columns depending on width;
- tables may transform into compact record cards only when necessary;
- actions remain at least the D28 minimum touch size;
- drawers become full-width sheets;
- no fixed right rail.

## 13. Accessibility requirements

The redesigned shell must retain:

- the D28 skip link;
- a focusable main-content target;
- visible focus;
- keyboard-operable sidebar and topbar;
- `aria-current="page"` for active navigation;
- text labels for all status colors;
- accessible tables with headers;
- labelled search, filters and selectors;
- focus-managed mobile drawers;
- reduced-motion support;
- forced-colors support;
- 200% zoom usability.

## 14. Accuracy rules

To remain faithful to the approved screenshots:

### Do

- use a persistent left sidebar;
- use a slim white topbar;
- keep page titles compact;
- use dense operational tables;
- place context and actions in a right rail;
- use pastel semantic icon containers;
- use small action links;
- show KPI cards in a horizontal strip;
- use clear section grouping;
- use subtle borders more than shadows;
- use compact pagination;
- align values and statuses consistently.

### Do not

- retain the current dark workspace hero;
- retain the full-width Demo Engine bar above internal pages;
- use giant cards for a single request;
- stack every field vertically on desktop;
- place primary operational actions far below the fold;
- use marketing-style gradients;
- use oversized rounded pills for every element;
- create different shell geometry for Officer, Department and Supervisor;
- copy screenshot colors instead of FAIDIA tokens;
- invent routes for unsupported navigation items.

## 15. Planned component boundary

D29R-1 and D29R-2 should introduce:

```text
components/demo/internal-shell/
├── internal-app-shell.tsx
├── internal-sidebar.tsx
├── internal-topbar.tsx
├── internal-page-header.tsx
├── internal-global-search.tsx
├── internal-user-menu.tsx
├── internal-navigation.ts
├── internal-shell.module.css
└── index.ts

components/demo/internal-ui/
├── metric-card.tsx
├── status-pill.tsx
├── priority-pill.tsx
├── internal-data-table.tsx
├── table-toolbar.tsx
├── detail-panel.tsx
├── activity-timeline.tsx
├── staff-avatar.tsx
├── deadline-list.tsx
├── message-list.tsx
├── queue-pagination.tsx
└── index.ts
```

No route-specific dashboard should be redesigned before the shared shell and primitives exist.

## 16. D29R-0 definition of done

D29R-0 is complete when:

- all seven approved screenshots exist under `public/demo/references/internal-shell/`;
- the assets use the approved semantic filenames;
- this source-of-truth document exists;
- `app/globals.css` is recorded as the binding visual token source;
- the uploaded `design.md` is correctly classified as an auth/SSR design note;
- the supplied Officer and Admin navigation groups are recorded;
- the controlled Supervisor and Department adaptations are recorded;
- the current 14-route limit is recorded;
- the absence of an Admin route is recorded;
- shell geometry is defined;
- page templates are defined;
- responsive behavior is defined;
- accessibility requirements are defined;
- prohibited patterns are defined;
- no runtime component is changed;
- no route is added;
- no workflow rule is changed;
- D29R-0 verification passes;
- D29R-0 is committed separately.
