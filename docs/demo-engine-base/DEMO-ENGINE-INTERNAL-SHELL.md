# FAIDIA Demo Engine Shared Internal Shell

## Document status

- Stage: D29R-1
- Status: Implemented foundation
- Scope: Shared sidebar, topbar, mobile drawer and page header
- Route integration: Deferred to D29R-3 through D29R-7
- Route inventory: Unchanged at 14 pages
- Workflow behavior: Unchanged
- Production Supabase access: Prohibited

## 1. Purpose

D29R-1 builds the reusable internal application shell required by the approved internal-dashboard references.

The stage creates the shared shell foundation before any route-specific dashboard is redesigned.

D29R-1 does not yet replace the current Officer, Department or Supervisor pages.

## 2. Visual authority

The implementation follows:

1. `app/globals.css` for design tokens and reusable utility classes;
2. `DEMO-ENGINE-INTERNAL-SHELL-REFERENCE.md` for geometry, density and composition;
3. the seven internal-shell screenshot references for visual direction;
4. the supplied navigation document for information architecture.

The shell does not copy arbitrary colors from the screenshots.

## 3. Created component boundary

D29R-1 creates:

- `InternalAppShell`;
- `InternalSidebar`;
- `InternalTopbar`;
- `InternalGlobalSearch`;
- `InternalUserMenu`;
- `InternalPageHeader`;
- role-aware navigation configuration;
- responsive CSS Module styling;
- one export barrel.

## 4. Shared geometry

The desktop shell uses:

- `var(--sidebar-width-staff)`;
- `var(--sidebar-width-collapsed)`;
- `var(--topbar-height-desktop)`;
- `var(--content-gutter-desktop)`;
- `var(--container-content-wide)`.

The shell switches to the collapsed rail before tablet width and to a focusable off-canvas drawer below 64rem.

## 5. Sidebar behavior

The sidebar includes:

- configured institution identity;
- Officer navigation;
- Department navigation;
- Supervisor navigation;
- active-state detection;
- `aria-current="page"`;
- count badges;
- desktop collapse;
- mobile drawer close behavior;
- a compact help card.

Only destinations supported by the current 14-route Demo Engine are linked.

No Admin route is introduced.

## 6. Topbar behavior

The topbar includes:

- mobile navigation trigger;
- global search field;
- Command/Ctrl + K focus shortcut;
- slots for request selection;
- slots for role selection;
- slots for presentation and reset actions;
- notification count;
- staff avatar, name and role.

The action slots allow D8 and D27 controls to move into the product-native topbar during later route integration without rewriting their behavior.

## 7. Page header behavior

`InternalPageHeader` supports:

- breadcrumbs;
- optional eyebrow;
- compact page title;
- description;
- action slot.

It uses the existing `.text-page-title`, `.text-body-compact` and `.text-caption` utilities.

## 8. Responsive behavior

At wide desktop:

- the full 16.5rem sidebar is visible;
- the white 4rem topbar remains sticky;
- content uses the desktop gutter.

At smaller desktop:

- the sidebar becomes the 4.5rem icon rail.

Below 64rem:

- the sidebar becomes an off-canvas drawer;
- the topbar uses the mobile menu button;
- role, request, presentation and reset slots may collapse;
- content uses tablet or mobile gutters.

## 9. Accessibility

The shell provides:

- labelled navigation regions;
- active-page semantics;
- labelled search;
- labelled notification and profile controls;
- keyboard search shortcut;
- visible global focus from `globals.css`;
- mobile drawer backdrop;
- reduced-motion behavior;
- readable navigation labels and count badges.

The D28 skip link and focusable main target remain owned by the outer Demo Engine layout.

## 10. Integration boundary

D29R-1 intentionally does not:

- modify `app/demo/layout.tsx`;
- modify route pages;
- replace the existing Demo Control Bar;
- change D7 state;
- change D8 controls;
- change D21–D25 workflow behavior;
- add an Admin route;
- add Supabase access.

D29R-3 begins route integration after D29R-2 creates the shared internal UI primitives.

## 11. D29R-1 definition of done

D29R-1 is complete when:

- all shared shell files exist;
- role-aware navigation exists;
- the desktop sidebar geometry uses central tokens;
- the collapsed rail exists;
- the mobile drawer exists;
- the white sticky topbar exists;
- global search exists;
- request, role, presentation and reset action slots exist;
- notification and staff-profile controls exist;
- `aria-current="page"` is used;
- no hard-coded screenshot palette is introduced;
- no route is added;
- no route page is changed;
- no workflow file is changed;
- no Supabase dependency is introduced;
- type checking passes;
- linting passes;
- the production build passes;
- D29R-1 verification passes;
- D29R-1 is committed separately.
