# FAIDIA Demo Engine Shared Internal UI

## Document status

- Stage: D29R-2
- Status: Implemented foundation
- Scope: Shared KPI, table, toolbar and side-panel primitives
- Route integration: Deferred to D29R-3 through D29R-7
- Route inventory: Unchanged at 14 pages
- Workflow behavior: Unchanged
- Production Supabase access: Prohibited

## 1. Purpose

D29R-2 builds the reusable operational components required inside the shared internal application shell.

The stage converts the approved dashboard references into a consistent component language before route-specific dashboards are redesigned.

D29R-2 does not yet replace any existing route page.

## 2. Visual authority

The implementation follows:

1. `app/globals.css` for tokens and global utilities;
2. `DEMO-ENGINE-INTERNAL-SHELL-REFERENCE.md` for geometry and density;
3. the seven approved internal-dashboard screenshots for component composition;
4. D29R-1 for shell integration boundaries.

No screenshot color palette is copied into component CSS.

## 3. Created component boundary

D29R-2 creates:

- `MetricCard`;
- `StatusPill`;
- `PriorityPill`;
- `StaffAvatar`;
- `InternalDataTable`;
- `TableToolbar`;
- `DetailPanel`;
- `ActivityTimeline`;
- `DeadlineList`;
- `MessageList`;
- `QueuePagination`;
- `EmptyState`;
- shared CSS Module styling;
- one export barrel.

## 4. Metric cards

`MetricCard` supports:

- semantic icon containers;
- compact labels;
- tabular values;
- supporting detail;
- trend indicator;
- optional action link;
- neutral, information, success, warning and danger tones.

Metric cards use borders and spacing rather than decorative shadow.

## 5. Status and priority pills

`StatusPill` uses the existing global badge utilities:

- `.badge-base`;
- `.badge-compact`;
- `.badge-neutral`;
- `.badge-info`;
- `.badge-success`;
- `.badge-warning`;
- `.badge-danger`;
- `.badge-outline`;
- `.badge-dot`.

`PriorityPill` maps:

- Low to success;
- Medium to warning;
- High to danger;
- Critical to danger.

Status meaning remains visible as text and does not rely on color alone.

## 6. Data table

`InternalDataTable` provides:

- semantic table markup;
- accessible caption;
- scoped column headers;
- dense, compact and comfortable modes;
- column alignment;
- selected-row treatment;
- horizontal panel scrolling;
- reusable empty-state content.

The table does not make rows clickable by default. Route integrations must place real links and buttons inside action cells.

## 7. Toolbar

`TableToolbar` provides:

- accessible search;
- controlled or internal search state;
- filter slot;
- action slot;
- result-summary slot;
- compact mobile stacking.

## 8. Side panels and supporting lists

`DetailPanel` provides:

- eyebrow;
- title;
- description;
- status;
- optional close control;
- action strip;
- content region;
- action footer;
- optional desktop sticky behavior.

`DeadlineList` and `MessageList` provide the compact right-rail patterns shown in the approved references.

`ActivityTimeline` provides workflow and audit-history display.

## 9. Pagination and empty states

`QueuePagination` provides:

- previous and next controls;
- visible page buttons;
- current-page semantics;
- result range;
- optional rows-per-page control.

`EmptyState` provides a consistent non-error empty view with optional action.

## 10. Responsive behavior

At desktop:

- tables remain compact;
- detail panels may remain sticky;
- right-rail lists remain dense;
- pagination stays horizontal.

At tablet and mobile:

- sticky detail panels become static;
- toolbars stack;
- long tables scroll inside their panel;
- deadline and message rows reflow;
- pagination stacks;
- controls retain D28 touch-target sizing.

## 11. Accessibility

D29R-2 provides:

- semantic tables;
- accessible captions;
- scoped headers;
- labelled searches;
- labelled pagination;
- text-based status labels;
- current-page semantics;
- decorative icon hiding;
- non-interactive rows by default;
- reduced-motion behavior.

D28 remains responsible for the route-level skip link and main-content target.

## 12. Integration boundary

D29R-2 intentionally does not:

- modify D29R-1 shell files;
- modify route pages;
- modify workflow components;
- modify state or reducers;
- modify client configuration;
- add an Admin route;
- add Supabase access.

D29R-3 will combine D29R-1 and D29R-2 to redesign `/demo/officer`.

## 13. D29R-2 definition of done

D29R-2 is complete when:

- all shared internal UI components exist;
- metric cards exist;
- status and priority pills exist;
- the semantic data table exists;
- the table toolbar exists;
- the detail panel exists;
- the activity timeline exists;
- staff avatars exist;
- deadline and message lists exist;
- queue pagination exists;
- an empty state exists;
- central tokens and global utility classes are used;
- no screenshot palette is hard-coded;
- no route is added;
- no route page is changed;
- no workflow file is changed;
- no Supabase dependency is introduced;
- type checking passes;
- linting passes;
- the production build passes;
- D29R-2 verification passes;
- D29R-2 is committed separately.
