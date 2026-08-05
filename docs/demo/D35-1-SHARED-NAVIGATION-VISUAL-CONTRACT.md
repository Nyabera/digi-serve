# D35-1 — Shared Navigation Visual Contract

## Contract status

**FROZEN FOR D35-2 IMPLEMENTATION — REVISED APPLICANT-INCLUSIVE SCOPE**

This contract supersedes the narrower role scope recorded during D35-0. The user has explicitly expanded D35 to include the Applicant sidebar alongside Officer, Supervisor, and Admin.

## Baseline

| Field | Value |
|---|---|
| Repository | `Nyabera/digi-serve` |
| Branch | `demo/d35-shared-navigation-visual-refinement` |
| D35-1 baseline commit | `f55d73df24d44cabbbd69b36850ee21e21130e45` |
| D35-1 short baseline | `f55d73d` |
| D35-0 audit commit | `f55d73df24d44cabbbd69b36850ee21e21130e45` |
| D35-0 short commit | `f55d73d` |
| Generated locally | `2026-08-05 16:50:15 EAT` |
| Generated UTC | `2026-08-05T13:50:15Z` |

## Objective

Refine the clickable navigation items in the Applicant, Officer, Supervisor, and Admin sidebars so they use lighter typography, slightly denser rows, and smaller/thinner Lucide icons while preserving navigation behaviour and shell ownership.

D35 remains a visual refinement only. It must not alter routes, navigation labels, item order, active-route matching, workspace ownership, role resolution, sidebar width, top-bar geometry, or page content.

## Revised role scope

### Included roles

The D35 visual treatment applies when `data-internal-shell-role` is:

- `APPLICANT`
- `OFFICER`
- `SUPERVISOR`
- `ADMIN`

### Excluded role

The following workspace remains outside D35:

- `DEPARTMENT`

The D35-0 audit originally treated Applicant as excluded because the initial request named Officer, Supervisor, and Admin. This D35-1 contract supersedes that narrower scope following the user's explicit instruction to include Applicant.

## Canonical shell ownership

The included workspaces ultimately render through the same shared components:

```text
Applicant
  -> RoleWorkspaceShell or applicant shell entry
  -> InternalAppShell
  -> InternalSidebar

Officer
  -> OperationalWorkspaceShell
  -> RoleWorkspaceShell
  -> InternalAppShell
  -> InternalSidebar

Supervisor
  -> OperationalWorkspaceShell
  -> RoleWorkspaceShell
  -> InternalAppShell
  -> InternalSidebar

Admin
  -> AdminWorkspaceShell
  -> RoleWorkspaceShell
  -> InternalAppShell
  -> InternalSidebar
```

The shared shell root exposes:

```tsx
data-internal-shell-role={role}
```

D35-2 must use that attribute to apply the visual refinement to the four included roles while preserving Department.

## Frozen visual values

### Clickable navigation item text

| Property | D35-0 baseline | D35 required value |
|---|---:|---:|
| Font size | `0.8125rem` | `0.8125rem` |
| Pixel equivalent | `13px` | `13px` |
| Font family | inherited | `"Plus Jakarta Sans Variable", "Plus Jakarta Sans", sans-serif` |
| Font weight | `600` | `400` |
| Letter spacing | default/inherited | `0.1px` |
| Line height | `1.25rem` | preserve `1.25rem` |
| Text transform | none | preserve none |
| Overflow | ellipsis | preserve ellipsis |
| White-space | nowrap | preserve nowrap |

### Navigation item vertical density

| Property | Baseline | D35 required value |
|---|---:|---:|
| Minimum item height | `2.5rem` | `2.25rem` |
| Pixel equivalent | `40px` | `36px` |
| Reduction | — | exactly `10%` |
| Inline padding | `0.75rem` | preserve |
| Icon/label gap | `0.75rem` | preserve |
| Gap between items | `0.25rem` | preserve |

The existing item does not use explicit block-axis padding. Its vertical density comes from `min-height`. D35-2 must therefore use a 36px role-scoped minimum height.

This global token must remain unchanged:

```css
--control-height-compact: 2.5rem;
```

Changing it would affect buttons, inputs, shell controls, and unrelated surfaces.

### Navigation icons

| Property | Baseline | D35 required value |
|---|---:|---:|
| Width | `24px` Lucide default | `22.8px` |
| Height | `24px` Lucide default | `22.8px` |
| Rem equivalent | `1.5rem` | `1.425rem` |
| Reduction | — | exactly `5%` |
| Stroke width | `2` Lucide default | `1` |
| Fill | none | preserve |
| Icon identity | existing icon component | preserve |

D35 must not replace or reorder any icon.

## Section labels

Group labels such as `MAIN`, `MY ACTIVITY`, `OPERATIONS`, `WORKFLOW`, `DOCUMENTS`, `REPORTING`, and `ACCOUNT` are not clickable item labels.

Their typography, spacing, uppercase treatment, colour, and group separation must remain unchanged.

## Included-role acceptance matrix

| Requirement | Applicant | Officer | Supervisor | Admin |
|---|:---:|:---:|:---:|:---:|
| Font size is 13px | Required | Required | Required | Required |
| Plus Jakarta Sans is explicit | Required | Required | Required | Required |
| Font weight is 400 | Required | Required | Required | Required |
| Letter spacing is 0.1px | Required | Required | Required | Required |
| Row minimum height is 36px | Required | Required | Required | Required |
| Icon box is 22.8px | Required | Required | Required | Required |
| Icon stroke width is 1 | Required | Required | Required | Required |
| Labels and order unchanged | Required | Required | Required | Required |
| Active state preserved | Required | Required | Required | Required |
| Collapsed/mobile behaviour works | Required | Required | Required | Required |

## Department exclusion matrix

| Requirement | Department |
|---|:---:|
| D35 text treatment not applied | Required |
| D35 row-height reduction not applied | Required |
| D35 icon-size reduction not applied | Required |
| D35 stroke reduction not applied | Required |

## State preservation

D35-2 must preserve:

- active-route detection;
- `aria-current="page"`;
- active border and background;
- active left indicator;
- hover and pressed states;
- focus-visible outline;
- badges and counts;
- disabled handling;
- full-row click behaviour;
- icon `aria-hidden="true"`.

The 36px row must not clip icons, labels, counts, active indicators, or focus outlines.

## Responsive contract

The included-role refinement must work in:

- expanded desktop;
- collapsed desktop;
- automatically collapsed desktop/tablet state;
- mobile drawer.

D35-2 must not change:

- sidebar widths;
- breakpoints;
- drawer dimensions;
- drawer transition;
- sidebar scrolling;
- top-bar dimensions;
- mobile menu controls.

## Accessibility note

The requested 36px item height is denser than a typical 44px touch target. This is an explicit design decision. D35-3 must manually verify mobile usability, focus visibility, clipping, and row separation.

## Preferred D35-2 implementation

Preferred styling ownership:

```text
components/demo/internal-shell/internal-shell.module.css
```

Use role-scoped selectors for:

```text
APPLICANT
OFFICER
SUPERVISOR
ADMIN
```

Conceptually:

```css
.shell[data-internal-shell-role="APPLICANT"] ...
.shell[data-internal-shell-role="OFFICER"] ...
.shell[data-internal-shell-role="SUPERVISOR"] ...
.shell[data-internal-shell-role="ADMIN"] ...
```

The Department selector must not receive the D35 treatment.

The sidebar component may be changed only where needed to establish Lucide `strokeWidth={1}` safely:

```text
components/demo/internal-shell/internal-sidebar.tsx
```

Any component-level conditional must include Applicant, Officer, Supervisor, and Admin while excluding Department.

## D35-2 allowed files

D35-2 may modify only what is necessary from:

```text
components/demo/internal-shell/internal-shell.module.css
components/demo/internal-shell/internal-sidebar.tsx
scripts/demo/verify-d35-2-shared-navigation-visuals.sh
tests/demo/unit/d35-shared-navigation-visuals.test.ts
docs/demo/D35-2-SHARED-NAVIGATION-VISUAL-IMPLEMENTATION.md
```

## D35-2 forbidden changes

D35-2 must not modify:

```text
components/demo/internal-shell/internal-navigation.ts
components/demo/internal-shell/internal-app-shell.tsx
components/demo/internal-shell/role-workspace-shell.tsx
components/demo/workspace-shells/**
app/demo/officer/**
app/demo/supervisor/**
app/demo/admin/**
features/demo-engine/navigation/**
```

It must not change:

- labels;
- navigation groups;
- ordering;
- icon selections;
- hrefs;
- route contracts;
- active-prefix rules;
- role switching;
- shell ownership;
- page bodies;
- global compact-control height;
- Department navigation styling.

## Browser acceptance routes

D35-3 must inspect at least:

```text
/demo
/demo/track/REQ-DEMO-001
/demo/officer
/demo/officer/tasks
/demo/supervisor
/demo/supervisor/audit-trail
/demo/admin
/demo/admin/services
/demo/admin/services/builder
/demo/department
```

Primary density comparisons:

```text
Applicant:
Service catalogue
Notifications

Admin:
Service catalogue
Service builder
```

The Department route is the mandatory exclusion regression check.

## Stage boundary

D35-1 is complete when:

1. this contract is the only changed file;
2. Applicant, Officer, Supervisor, and Admin are included;
3. Department is explicitly excluded;
4. all numerical visual values are frozen;
5. global compact-control tokens are protected;
6. D35-2 implementation ownership is defined;
7. no visual implementation has occurred.
