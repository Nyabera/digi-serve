# FAIDIA Stage 1 — Design System

**Status:** READY_FOR_PRODUCT_OWNER_REVIEW  
**Version:** 0.2  
**Last updated:** 2026-07-15  
**Product:** FAIDIA — Service Operations Platform  
**Authority:** `docs/00-stage-0/DESIGN-REFERENCE-REGISTER.md`, `docs/00-stage-0/PAGE-INVENTORY.md`, `docs/00-stage-0/ROLE-PERMISSIONS-MATRIX.md`, `docs/00-stage-0/STATUS-MAPPINGS.md`, and `docs/01-stage-1/ACCEPTANCE-CRITERIA.md`

## 1. Purpose

This document converts the approved visual direction and reference images into rules a designer or coding agent can apply consistently.

For a beginner: a design system is the small set of reusable visual rules behind every screen—colors, spacing, text, controls, layouts, states and accessibility. It prevents each page from being designed from scratch.

## 2. Design thesis

FAIDIA should feel like a calm, trustworthy institutional operations product: clear navy hierarchy, restrained Ultramarine actions, near-white surfaces, thin borders, compact information, and semantic color used only to explain state.

The three authenticated shells share one visual language but use different density:

- applicants receive a comfortable, guided interface focused on the next safe action;
- Officers and Supervisors receive a denser, queue-first workspace focused on ownership, SLA and action;
- Organization Admin receives an operational overview limited to setup and non-sensitive metadata.

Reference images control visual direction and hierarchy. Stage 0 controls functionality, scope, navigation, roles, permissions and status wording.

## 3. Controlling references

Use the exact registered repository assets:

- `docs/assets/applicant-shell/applicant-shell-reference-01.png` through `05.png`;
- `docs/assets/officer-shell/officer-shell-reference-01.png` through `07.png`;
- `docs/assets/admin-shell/admin-shell-reference-01.png` through `05.png`;
- the three workflow references registered in Stage 0.

Do not pixel-copy a single image. The references vary in density and include later-version concepts. Extract the common system described here.

## 4. Reference interpretation

| Reference family | Keep for Stage 1 | Do not infer from the image |
|---|---|---|
| Applicant | compact sidebar, clear page title, prominent next action, request reference/status, progress, documents, messages and applicant-safe history | authenticated service catalogue, saved drafts, payment, document vault, renewals, standalone to-do product or any route not classified `STAGE_1_REQUIRED` |
| Officer/Supervisor | queue-first layout, compact tables, owner/SLA/status visibility, request workspace, handoff panel, messages, notes and history | broad case sharing, workflow invites, transfer, every department queue shown, or a new route for an embedded action |
| Admin | summary cards, limited metadata forms, service list, branding and restrained operational summaries | full form/workflow builder, permission editor, organization-wide applicant data, marketplace, broad audit suite or complete analytics product |

Hidden, disabled or empty navigation is still product UI. A `LATER_V1`, `DEMO_ONLY` or `POSTPONED` item must not appear as an active Stage 1 destination by default.

## 5. Foundations

### 5.1 Color tokens

Define colors once as CSS custom properties in `src/app/globals.css`; consume them through Tailwind semantic names. Components must not introduce arbitrary hex values.

The values below are the Stage 1 tokens. They may be tuned for contrast during implementation without changing their semantic role.

| Token | Value | Use |
|---|---:|---|
| `--background` | `#F8FAFC` | application canvas |
| `--surface` | `#FFFFFF` | cards, tables, panels and dialogs |
| `--surface-subtle` | `#F1F5F9` | quiet grouped areas and hover backgrounds |
| `--foreground` | `#0B1B4D` | primary headings and high-emphasis text |
| `--text` | `#172554` | body and control text |
| `--muted-foreground` | `#64748B` | supporting copy and metadata |
| `--border` | `#DCE4EF` | normal separators and card borders |
| `--border-strong` | `#C5D1E2` | emphasized boundaries and selected rows |
| `--primary` | `#2337B8` | primary actions, selected navigation and links |
| `--primary-hover` | `#1B2C97` | primary hover |
| `--primary-soft` | `#EEF0FB` | selected navigation and informational emphasis |
| `--success` | `#15803D` | successful/verified/complete state |
| `--success-soft` | `#ECFDF3` | success surface |
| `--warning` | `#C76A00` | due soon, waiting and caution |
| `--warning-soft` | `#FFF7E8` | warning surface |
| `--danger` | `#DC2626` | destructive, overdue and failed state |
| `--danger-soft` | `#FEF2F2` | danger surface |
| `--info` | `#6D28D9` | secondary informational state |
| `--info-soft` | `#F5F0FF` | informational surface |
| `--focus` | `#3D51D1` | keyboard focus ring |

Rules:

- `primary` means action or selection, not generic decoration.
- Semantic colors always include text or an icon; color alone is never the only signal.
- Body text on normal surfaces and interactive text must meet WCAG 2.2 AA contrast.
- Do not use semantic red or green for neutral categories.
- Organization branding may replace logo and approved brand accents, but it may not reduce contrast or remap success/warning/danger meanings.

### 5.2 Typography

Use `Plus Jakarta Sans` as the Stage 1 interface font, loaded through `next/font` with `ui-sans-serif`, `system-ui`, `sans-serif` fallbacks. Use `Source Code Pro` as the monospace font with `ui-monospace`, `SFMono-Regular`, `monospace` fallbacks.

| Style | Desktop | Mobile | Weight | Typical use |
|---|---:|---:|---:|---|
| Display | 36/44 px | 30/38 px | 700 | rare public hero only |
| Page title | 30/38 px | 26/34 px | 700 | page heading |
| Section title | 20/28 px | 18/26 px | 650–700 | major card/section |
| Card title | 16/24 px | 16/24 px | 600 | card and panel title |
| Body | 14/22 px | 16/24 px for long applicant text | 400 | normal content |
| Compact body | 13/20 px | 14/22 px | 400–500 | staff tables and metadata |
| Label | 13/18 px | 14/20 px | 600 | form and table labels |
| Caption | 11/18 px | 11/18 px | 400–500 | timestamps and supporting metadata |

Rules:

- Use sentence case, not title case for every label.
- Use tabular numbers for metrics, references, dates and durations.
- Never shrink operational content below 11 px.
- One page has one visible `h1`; heading levels remain sequential.

### 5.3 Spacing and sizing

Use a 4 px base scale: `1, 2, 3, 4, 5, 6, 8, 10, 12, 16` map to `4, 8, 12, 16, 20, 24, 32, 40, 48, 64` px.

| Element | Comfortable applicant | Compact staff/admin |
|---|---:|---:|
| Page gutter | 24–32 px desktop; 16 px mobile | 24–32 px desktop; 16 px mobile |
| Section gap | 24 px | 16–24 px |
| Card padding | 20 px | 16–20 px |
| Input/button height | 44 px | 40 px; 36 px only in dense table tools |
| Table row minimum | 60 px | 48–52 px |
| Icon button target | 44×44 px mobile | 40×40 px desktop, 44×44 px touch |

Touch targets remain at least 44×44 CSS px when a coarse pointer is detected.

### 5.4 Radius, border and elevation

| Token | Value | Use |
|---|---:|---|
| `--radius-sm` | 5 px | badges and compact controls |
| `--radius-md` | 10 px | inputs and buttons |
| `--radius-lg` | 18 px | cards and panels |
| `--radius-xl` | 26 px | large hero or modal surface only |

- Default surfaces use a 0.5 px border and no shadow.
- Use `0 1px 2px rgb(15 23 42 / 0.06)` only when a border is not enough to separate stacked content.
- Dialogs, sheets and menus may use `0 16px 40px rgb(15 23 42 / 0.14)`.
- Do not use glassmorphism, heavy gradients or decorative floating cards.

### 5.5 Button tokens

| Token | Value | Use |
|---|---:|---|
| `--btn-height-comfortable` | 44 px | applicant-facing buttons |
| `--btn-height-compact` | 40 px | staff/admin buttons |
| `--btn-padding-x-comfortable` | 20 px | horizontal padding, comfortable |
| `--btn-padding-x-compact` | 20 px | horizontal padding, compact |
| `--btn-font-size` | 13 px | comfortable button text |
| `--btn-font-size-compact` | 12 px | compact button text |
| `--btn-font-weight` | 600 | all buttons |
| `--btn-icon-gap` | 9 px | gap between icon and label |
| `--btn-border-radius` | 5 px | button corner radius (independent of `--radius-md`) |

### 5.6 Input tokens

| Token | Value | Use |
|---|---:|---|
| `--input-height` | 50 px | text input, select and textarea row height |
| `--input-padding-x` | 15 px | horizontal padding inside inputs |
| `--input-font-size` | 14 px | input text size |

### 5.7 Badge tokens

| Token | Value | Use |
|---|---:|---|
| `--badge-padding-y` | 4 px | vertical padding |
| `--badge-padding-x` | 10 px | horizontal padding |
| `--badge-font-size` | 12 px | badge text size |
| `--badge-font-weight` | 600 | badge text weight |
| `--badge-border-radius` | 5 px | badge corner radius (independent of `--radius-sm`) |

### 5.8 Table tokens

| Token | Value | Use |
|---|---:|---|
| `--table-cell-padding-x` | 16 px | horizontal cell padding |
| `--table-header-font-size` | 11 px | column header size |
| `--table-header-tracking` | 0.06 em | header letter spacing |

### 5.9 Focus ring

| Token | Value | Use |
|---|---:|---|
| `--focus-ring-width` | 2 px | outline width on focused controls |
| `--focus-ring-offset` | 2 px | gap between control edge and ring |

### 5.10 Letter spacing

| Token | Value | Use |
|---|---:|---|
| `--heading-letter-spacing` | −0.01 em | page, section and card titles |
| `--body-letter-spacing` | 0 em | body and compact text |
| `--label-letter-spacing` | 0 em | form labels and table headers |

### 5.11 Card shadow

| Token | Value | Use |
|---|---:|---|
| `--card-shadow-blur` | 0 px | blur radius for card elevation |
| `--card-shadow-opacity` | 0 | shadow opacity (0–0.30 range) |

Card shadow is off by default; surfaces rely on border only.

### 5.12 Icons

Use Lucide React only for interface icons.

- Standard inline icon: 16 px.
- Navigation and normal actions: 18–20 px.
- Metric-card icon: 22–24 px in a soft semantic container.
- Every unfamiliar icon-only action has an accessible name and tooltip on hover/focus.
- Do not mix emoji with functional icons. A greeting emoji may be decorative and `aria-hidden`.

### 5.13 Motion

Use motion only to explain state change:

- 120–180 ms for hover, focus, menu and accordion transitions;
- 180–240 ms for dialog/sheet entry;
- no looping decorative motion;
- respect `prefers-reduced-motion` by removing nonessential transitions and smooth scrolling.

## 6. Shell system

### 6.1 Shared desktop anatomy

- persistent left navigation at 190 px;
- top bar at 68–72 px;
- content canvas with 24–32 px gutters;
- 0.5 px shell borders;
- logo/organization identity at the top of navigation;
- notification and user menu at the top right;
- page-specific heading inside the main content area.

Global search is `DEMO_ONLY` in Stage 1. Do not render an enabled search box merely to match the references. Its space may be omitted; shell alignment must still work.

### 6.2 Sidebar tokens

| Token | Value | Use |
|---|---:|---|
| `--sidebar-width` | 190 px | left navigation width |
| `--sidebar-bg` | `#FFFFFF` | sidebar background |
| `--sidebar-right-border-width` | 1 px | right edge border |
| `--sidebar-right-border-color` | `#DCE4EF` | right edge color |
| `--brand-divider-width` | 0 px | divider below brand section (0 = none) |
| `--avatar-size` | 40 px | user avatar in top bar |

### 6.3 Sidebar typography

| Token | Value | Use |
|---|---:|---|
| `--nav-font-size` | 12 px | parent nav item text |
| `--nav-child-font-size` | 10 px | nested/child item text |
| `--nav-heading-font-size` | 11 px | section heading text |
| `--nav-font-weight` | 500 | parent item weight |
| `--nav-heading-weight` | 700 | section heading weight |

### 6.4 Sidebar spacing

| Token | Value | Use |
|---|---:|---|
| `--nav-item-padding` | 5 px | vertical padding on each nav item |
| `--nav-group-gap` | 0 px | space between heading groups |
| `--nav-icon-size` | 15 px | nav item icon dimensions |

### 6.5 Sidebar dividers

| Token | Value | Use |
|---|---:|---|
| `--nav-item-divider-width` | 0.5 px | line between nav items (0 = none) |
| `--nav-item-divider-inset` | 8 px | inset from each side to shorten the divider |
| `--nav-item-divider-color` | `#F8FAFC` | divider line color |
| `--nav-heading-divider-width` | 0 px | line below section headings (0 = none) |
| `--nav-active-indicator-width` | 1 px | left bar on active item (0 = highlight only) |

### 6.6 Applicant shell

- comfortable density and plain language;
- page width may be constrained for forms and detail views;
- current request and next action take precedence over summary metrics;
- applicant-visible status only—never internal state, department notes, SLA details or assignment data;
- mobile navigation becomes a drawer; form pages become one column;
- the primary continue/submit action may be sticky at the bottom on small screens when it does not cover content.

### 6.7 Officer and Supervisor shell

- shared staff shell with profile/permission-based navigation;
- fluid content width for queues and request processing;
- queue, owner, current step, due state and permitted action remain visible;
- Supervisor-specific reporting and approval destinations appear only with the exact grant;
- dense desktop tables transform into cards or prioritized row summaries below 768 px;
- destructive or irreversible actions never hide only inside an unlabeled overflow menu.

### 6.8 Organization Admin shell

- same structural language as staff, but navigation is limited to Stage 1 setup summary, organization metadata, seeded services, limited service metadata and branding;
- do not expose request content, applicant documents, staff notes or applicant-level reporting;
- administrative charts or totals must not imply access to sensitive records.

### 6.9 Public and authentication shells

- public pages show organization identity, service discovery and clear sign-in/start actions;
- authentication uses a focused single-column card with no authenticated navigation;
- the organization slug determines safe public branding; unknown organizations receive the defined not-found state.

## 7. Responsive behavior

Use Tailwind's default mobile-first breakpoints unless a component has measured evidence for a different container rule.

| Range | Required behavior |
|---|---|
| `<640 px` | one column; 16 px gutters; drawer navigation; stacked actions; no horizontal applicant table dependency |
| `640–767 px` | compact two-column cards only when readable; forms remain primarily one column |
| `768–1023 px` | collapsed shell navigation; staff tables may become cards or horizontally contained only when no information-safe alternative exists |
| `≥1024 px` | desktop shell; multi-column dashboards and operational tables |
| `≥1440 px` | increase usable grid width, not type size; avoid excessively long text lines |

Critical content order on small screens is: title/context → Action Required/current step → primary action → status/progress → documents/messages/history → secondary summaries.

## 8. State language

### 8.1 Status badges

Status badges render the exact applicant-safe or internal label supplied by the domain mapping. They do not perform mappings in the component.

Each badge includes:

- visible text;
- semantic icon or dot when useful;
- soft background plus high-contrast foreground;
- optional screen-reader context when the visible label is ambiguous.

Do not expose internal statuses to applicants. Do not invent a new status because a reference image contains one.

### 8.2 Page states

Every required page defines all applicable states:

| State | Visual contract |
|---|---|
| Loading | layout-matched skeleton; preserve page title when known; never show fake values |
| Empty | explain why it is empty and provide one permitted next step; an empty result is not permission denied |
| Error | safe summary, recovery action and support/reference ID; no stack trace or sensitive identifier |
| Permission denied | clear access message, safe return action and no protected data flash |
| Stale action | preserve entered text when safe, explain the record changed, refresh current state and require the user to reconfirm |
| Offline/interrupted upload | show file-level retry/removal state without pretending upload succeeded |

### 8.3 Feedback

- Inline validation appears beside the affected field and in a focusable error summary after failed submit.
- Toasts confirm noncritical completion; they are not the only record of an important state.
- Destructive and consequential actions use a confirmation dialog with concrete consequences.
- Pending controls remain visibly pending and resist double submission.

## 9. Data display and charts

- TanStack Table supplies behavior; FAIDIA owns markup, labels, states and responsive presentation.
- Tables have visible column headers, keyboard-accessible actions and explicit empty/error states.
- Default alignment is left; numeric and duration columns may align right.
- Pagination states the visible range and total.
- Recharts is the only charting library.
- Every chart has a title, time range/freshness, readable labels, accessible text/table summary and non-color-only legend.
- Use at most five series in Stage 1; prefer bars for comparisons and lines for trends.
- A donut is acceptable only for a small part-to-whole set with values repeated in text.
- Never ship hard-coded dashboard totals as if they are live.

## 10. Forms and documents

- Labels are always visible; placeholders are examples, not labels.
- Required/optional state is announced consistently.
- Help text comes before errors in reading order.
- Server and client validation use the same Zod contract where applicable.
- Multi-step forms show current step, completed steps, remaining steps and save/continue behavior.
- Upload controls show accepted file types, size limits, progress, scan/validation state and safe retry.
- File names are treated as untrusted text and must wrap safely.
- Submitted snapshots are visually read-only; corrections clearly identify editable fields/documents.

## 11. Accessibility contract

Stage 1 targets WCAG 2.2 AA.

- All critical work is possible with keyboard alone.
- Focus is visible and restored logically after dialog/sheet closure.
- Skip-to-content is the first focusable shell control.
- Dialogs trap focus, have an accessible title and do not close destructive work without warning.
- Status, priority, validation and chart meaning are never color-only.
- Live regions announce asynchronous submit/upload results without repeating routine content.
- Tables use semantic headers; card transformations preserve field labels.
- Applicant pages support 200% zoom without loss of action or content.
- Motion respects reduced-motion settings.
- Automated checks supplement, but do not replace, keyboard and screen-reader testing.

## 12. Branding boundary

Stage 1 supports organization name, approved logo, primary accent and limited public-facing brand metadata.

Branding must not:

- change semantic colors;
- remove FAIDIA-required focus/error styling;
- inject arbitrary CSS or scripts;
- make an organization appear to have features outside its published configuration;
- bypass contrast validation.

## 13. Explicit non-goals

- A pixel-perfect freeze of the references.
- Dark mode.
- Custom animation system.
- Native mobile application patterns.
- A second component or chart library.
- Visual builders for forms, workflows or permissions.
- Navigation to later/demo/postponed pages.
- A design token editor for Organization Admin.

## 14. Verification checklist

- [ ] CSS variables and Tailwind semantic tokens match this document.
- [ ] Plus Jakarta Sans and fallbacks load without layout-breaking failure.
- [ ] Applicant, staff, admin, public and auth shells match their boundaries.
- [ ] No Stage 1 navigation exposes lower-scope items from the mockups.
- [ ] Every route demonstrates loading, empty, error, permission and applicable stale states.
- [ ] Applicant flows work without horizontal operational tables.
- [ ] Statuses and charts remain understandable without color.
- [ ] Keyboard, focus, zoom, reduced-motion and contrast checks pass.
- [ ] Recharts is the only chart library.
- [ ] Real data and freshness labels replace mock values.

## 15. Open questions

None. The exact organization logo and primary accent are seeded data; safe fallbacks use the tokens above.

## 16. Change rule

Changing scope, routes, navigation, role access, status labels or organization data exposure requires the controlling Stage 0 document to change first. Pure token tuning that preserves this semantic contract may be recorded in the implementation changelog.

## 17. Coding-agent instruction

Implement semantic tokens and shared shells before page-specific styling. Use the registered images for hierarchy, then verify every visible destination and label against Stage 0. A screenshot is never authorization to add a route, permission or feature.
