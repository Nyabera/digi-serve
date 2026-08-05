# D35-0 — Shared Navigation Styling Audit

## Audit status

**COMPLETE — SHARED OWNERSHIP, CURRENT VALUES, SCOPE RISKS, AND CHANGE SURFACE RECORDED**

This document is an evidence-first audit of the existing officer, supervisor, and organization-admin sidebar navigation styling. It does not change typography, spacing, icon dimensions, icon stroke weight, routes, labels, shell behaviour, or responsive behaviour.

## Baseline

| Field | Value |
|---|---|
| Repository root | `/Users/blaq/Downloads/faidia` |
| Remote | `https://github.com/Nyabera/digi-serve.git` |
| Source branch | `demo/d34-admin-navigation-consolidation` |
| D35 branch | `demo/d35-shared-navigation-visual-refinement` |
| Baseline commit | `7265d4f7ea6a696be5208cd157533da584835d43` |
| Short commit | `7265d4f` |
| Generated locally | `2026-08-05 16:38:32 EAT` |
| Generated UTC | `2026-08-05T13:38:32Z` |
| Pre-existing changes allowed | `0` |

## D35 problem statement

Officer, supervisor, and organization-admin navigation items need a lighter and denser visual treatment while retaining the navigation labels, order, icons, routes, shell identity, active states, and responsive behaviour established by D32, D33, and D34.

Requested values:

- navigation item font size: `0.8125rem`;
- navigation item letter spacing: `0.1px`;
- navigation item font family: `Plus Jakarta Sans`;
- navigation item font weight: `400`;
- approximately 10% less item-level vertical space;
- navigation icons approximately 5% smaller;
- navigation icon stroke width reduced from `2` to `1` where the current icon uses `2`.

D35-0 records the current implementation before D35-1 freezes the exact styling contract.

## Audit scope

The audit covers:

1. the officer route layout and shell chain;
2. the supervisor route layout and shell chain;
3. the organization-admin route layout and shell chain;
4. the shared navigation data source;
5. the shared sidebar renderer;
6. the shared navigation CSS rules;
7. the global font-loading and font-inheritance path;
8. current navigation item size, line height, weight, spacing, and gap behaviour;
9. current Lucide icon size and stroke behaviour;
10. expanded, collapsed, tablet, and mobile navigation selectors;
11. role-scoping capability;
12. likely D35 implementation files and files that should remain unchanged.

## Constraints

D35-0 must not:

- modify `app/globals.css`;
- modify any shell or sidebar component;
- change route layouts;
- change navigation definitions, labels, order, hrefs, badges, or active matching;
- change the applicant or department navigation;
- change global control tokens;
- create D35-1 implementation code;
- commit or push automatically.

## Executive findings

1. **One shared rendering surface exists.** Officer, supervisor, and admin route layouts all converge on `RoleWorkspaceShell`, `InternalAppShell`, and `InternalSidebar`.
2. **The requested font size is already present.** `.nav-item` currently uses `0.8125rem`.
3. **The requested font weight is not present.** `.nav-item` currently uses the semibold token, which resolves to `600`; the requested value is `400`.
4. **Plus Jakarta Sans is already the application root font.** It is imported in `app/layout.tsx` and placed first in the root font stack in `app/globals.css`.
5. **The navigation item does not currently declare vertical padding.** Its vertical box is primarily controlled by `min-height: var(--control-height-compact)`, currently `2.5rem` or 40px.
6. **The item-to-item list gap is separate.** `.nav-list` uses `gap: var(--space-1)`, currently `0.25rem` or 4px.
7. **Icons use Lucide defaults.** `InternalSidebar` does not pass `size` or `strokeWidth`; the rendered Lucide icons therefore use the library defaults of 24px and stroke width 2.
8. **The `.nav-item` utility is not limited to the requested roles.** Applicant and department sidebars use the same shared class.
9. **A safe role-scoping hook already exists.** `InternalAppShell` sets `data-internal-shell-role` on the shell root, allowing D35 to affect only `OFFICER`, `SUPERVISOR`, and `ADMIN`.
10. **The global compact-control token must not be reduced.** It is shared by controls outside navigation. D35 needs a navigation-specific value or role-scoped override.

## Workspace ownership chain

### Officer

```text
app/demo/officer/layout.tsx
  -> OperationalWorkspaceShell role="officer"
  -> RoleWorkspaceShell role="officer"
  -> InternalAppShell role="OFFICER"
  -> InternalSidebar
  -> getInternalNavigation("OFFICER")
```

### Supervisor

```text
app/demo/supervisor/layout.tsx
  -> OperationalWorkspaceShell role="supervisor"
  -> RoleWorkspaceShell role="supervisor"
  -> InternalAppShell role="SUPERVISOR"
  -> InternalSidebar
  -> getInternalNavigation("SUPERVISOR")
```

### Organization admin

```text
app/demo/admin/layout.tsx
  -> AdminWorkspaceShell
  -> RoleWorkspaceShell role="admin"
  -> InternalAppShell role="ADMIN"
  -> InternalSidebar
  -> getInternalNavigation("ADMIN")
```

### Ownership conclusion

The route layouts select the role but do not own item typography, spacing, or icon rendering. Separate edits to officer, supervisor, and admin layouts would duplicate behaviour and violate the established shared-shell boundary.

## Shared navigation renderer

`components/demo/internal-shell/internal-sidebar.tsx`:

- obtains the role-specific navigation array through `getInternalNavigation(role)`;
- maps every group through one `<nav>` implementation;
- renders every clickable entry as `className="nav-item"`;
- renders every Lucide icon as `className="nav-item-icon"`;
- renders labels as `className="nav-item-label"`;
- renders optional counts as `className="nav-item-count"`;
- does not pass an explicit icon `size`;
- does not pass an explicit icon `strokeWidth`.

This is the correct component-level point for icon properties if D35-1 chooses component props rather than CSS SVG overrides.

## Shared navigation definition

`components/demo/internal-shell/internal-navigation.ts` owns:

- role-specific group labels;
- item labels;
- hrefs;
- Lucide icon component selection;
- badges;
- exact and prefix active-matching metadata.

It does **not** own typography, item geometry, icon dimensions, or icon stroke width. D35 should not alter this file merely to achieve visual styling.

## Current font-loading and inheritance

### Font loading

`app/layout.tsx` imports:

```text
@fontsource-variable/plus-jakarta-sans
```

The root `<html>` element receives the Plus Jakarta Sans compatibility class and variable.

### Root CSS stack

`app/globals.css` places the Plus Jakarta Sans variable first:

```css
html {
  font-family:
    var(--font-plus-jakarta-sans),
    var(--font-inter),
    ui-sans-serif,
    system-ui,
    sans-serif;
}
```

`body` uses `font-family: inherit`.

### Font conclusion

Navigation items currently inherit Plus Jakarta Sans through the application root. D35-1 must decide whether the contract requires an explicit navigation declaration for defensive clarity or whether verified inheritance is sufficient. It must not introduce a different font source or duplicate font loading.

## Current navigation typography

The shared `.nav-item` rule currently declares:

| Property | Current value | Resolved value |
|---|---|---|
| `font-size` | `0.8125rem` | 13px at a 16px root |
| `line-height` | `1.25rem` | 20px |
| `font-weight` | `var(--font-weight-semibold)` | 600 |
| `letter-spacing` | not declared on `.nav-item` | inherited/default |
| `font-family` | not declared on `.nav-item` | inherited Plus Jakarta Sans |
| `text-align` | `left` | left |
| label overflow | ellipsis + no wrap | one line |

### Typography delta required after D35-1

| Property | Current | Requested |
|---|---:|---:|
| Font size | `0.8125rem` | `0.8125rem` |
| Letter spacing | default/inherited | `0.1px` |
| Font family | inherited Plus Jakarta Sans | Plus Jakarta Sans |
| Font weight | `600` | `400` |

The font-size change is therefore a contract confirmation, not a numerical change.

## Current item density and spacing

### Item box

The shared `.nav-item` rule uses:

```css
min-height: var(--control-height-compact);
```

The root token currently resolves to:

```css
--control-height-compact: 2.5rem;
```

This gives a 40px minimum item height.

### Vertical padding

There is no `padding-top`, `padding-bottom`, or `padding-block` declaration on `.nav-item`. Horizontal padding is declared through:

```css
padding-inline: var(--space-3);
```

Therefore the user's requested item-level vertical reduction cannot be implemented by multiplying an existing vertical-padding declaration. The closest deterministic current geometry is the 40px minimum item box.

### Inter-item gap

`.nav-list` declares:

```css
gap: var(--space-1);
```

The token resolves to 4px. This gap is distinct from item height and should not be silently changed unless D35-1 explicitly includes it.

### 10% mapping

A direct 10% reduction of the current 40px item minimum height is:

```text
40px × 0.90 = 36px
2.5rem × 0.90 = 2.25rem
```

Keeping the 4px list gap would change adjacent item start-to-start spacing from approximately 44px to 40px. D35-1 must freeze this interpretation before implementation.

### Shared-token risk

`--control-height-compact` is also used by buttons, icon buttons, inputs, skeleton controls, and other shared components. Reducing that root token would create unrelated UI changes. D35 should use a navigation-specific token or a role-scoped `.nav-item` override.

## Current icon rendering

### Component behaviour

Each item icon is rendered as:

```tsx
<Icon
  aria-hidden="true"
  className="nav-item-icon"
/>
```

No `size` or `strokeWidth` prop is supplied.

### CSS behaviour

`.nav-item-icon` currently controls display and flex alignment only. It does not declare width, height, stroke, or stroke width.

### Resolved Lucide defaults

| Property | Current resolved value |
|---|---:|
| Width | 24px |
| Height | 24px |
| Stroke width | 2 |

### 5% mapping

A literal 5% reduction from 24px is:

```text
24px × 0.95 = 22.8px
```

The exact CSS equivalent is:

```text
1.425rem
```

D35-1 must explicitly decide whether to preserve the literal fractional result `22.8px` or adopt a rounded 23px implementation. The audit does not silently round the user's requested percentage.

### Stroke mapping

The requested stroke change is unambiguous for current Lucide navigation icons:

```text
2 -> 1
```

Component props are the clearest implementation surface because they express Lucide intent directly. A CSS `stroke-width` override is technically possible but broader and easier to apply accidentally to non-navigation SVGs.

## Responsive and collapsed behaviour

The same rendered `.nav-item` and `.nav-item-icon` elements are reused in all sidebar modes.

### Expanded desktop

- labels, counts, and group headings are visible;
- item inline padding is `var(--space-3)`;
- the shared typography and icon rules apply directly.

### Collapsed desktop

- labels and counts are hidden;
- items are centered;
- inline padding is reset to `0`;
- the same icon element remains;
- any D35 icon size or stroke change will remain visible.

### Intermediate desktop/tablet collapse

At the existing `79.99rem` breakpoint:

- sidebar width collapses;
- labels and counts hide;
- items center;
- the same icon element remains.

### Mobile drawer

At the existing `63.99rem` breakpoint:

- the sidebar becomes a drawer;
- labels and counts return;
- item inline padding returns to `var(--space-3)`;
- the same `.nav-item` and `.nav-item-icon` rules remain active.

### Responsive conclusion

No separate mobile typography or icon implementation exists. Correct shared role-scoped rules should propagate consistently without editing breakpoint logic.

## Role impact matrix

| Internal role | Uses `InternalSidebar` | Uses `.nav-item` | Requested D35 target |
|---|---:|---:|---:|
| `APPLICANT` | Yes | Yes | No |
| `OFFICER` | Yes | Yes | Yes |
| `DEPARTMENT` | Yes | Yes | No |
| `SUPERVISOR` | Yes | Yes | Yes |
| `ADMIN` | Yes | Yes | Yes |

A bare global edit to `.nav-item` or `.nav-item-icon` would also alter applicant and department navigation. That would exceed the D35 request.

## Existing role-scoping hook

`InternalAppShell` renders the root shell with:

```tsx
data-internal-shell-role={role}
```

This supports selectors such as:

```css
[data-internal-shell-role="OFFICER"] .nav-item
[data-internal-shell-role="SUPERVISOR"] .nav-item
[data-internal-shell-role="ADMIN"] .nav-item
```

D35-1 should formalize a concise combined selector or a dedicated role class. It should not add role checks separately to each route layout.

## Active, hover, count, and focus dependencies

The navigation styling also includes:

- hover background and foreground changes;
- pressed background and foreground changes;
- active border, background, and foreground;
- a left active indicator with fixed top and bottom offsets;
- count-badge alignment and active colors;
- focus-visible outline;
- collapsed active-indicator offsets.

Reducing the item box to 36px may visually change the proportion of the active indicator and badge centering. D35 implementation verification must check these states rather than treating typography alone as sufficient.

## Canonical D35 change surface

### Likely implementation file 1

`app/globals.css`

Potential ownership:

- role-scoped navigation typography;
- role-scoped navigation item minimum height or navigation-specific token;
- role-scoped icon width and height if CSS sizing is selected;
- preservation of applicant and department values;
- preservation of global compact controls.

### Likely implementation file 2

`components/demo/internal-shell/internal-sidebar.tsx`

Potential ownership:

- explicit navigation icon `size`;
- explicit navigation icon `strokeWidth`;
- optional role-aware props if D35-1 determines component-level scoping is cleaner.

### Optional contract or verification files

- `docs/demo/D35-1-SHARED-NAVIGATION-VISUAL-CONTRACT.md`;
- a D35 verification script beneath `scripts/demo/`;
- narrowly scoped tests if existing test structure supports class or property assertions.

## Files that should normally remain unchanged

D35 visual refinement should not require changes to:

```text
app/demo/officer/layout.tsx
app/demo/supervisor/layout.tsx
app/demo/admin/layout.tsx
components/demo/workspace-shells/operational-workspace-shell.tsx
components/demo/workspace-shells/admin-workspace-shell.tsx
components/demo/internal-shell/role-workspace-shell.tsx
components/demo/internal-shell/internal-navigation.ts
features/demo-engine/navigation/*-navigation-contract.ts
features/demo-engine/navigation/demo-route-registry.ts
```

Changes to those files would require a specific explanation because they own route or role structure rather than item styling.

## D35 implementation risks

### Risk 1 — unintended applicant and department changes

Global `.nav-item` changes affect five internal roles, while the request names three. Use role scoping.

### Risk 2 — global compact-control regression

Changing `--control-height-compact` would affect controls outside the sidebar. Do not use the global token as the D35 reduction mechanism.

### Risk 3 — duplicated role-specific CSS

Three unrelated copies of the same declarations can drift. Use one combined shared selector or one shared navigation token scoped to the three roles.

### Risk 4 — inaccurate interpretation of vertical padding

No vertical-padding declaration currently exists. D35-1 must explicitly define the 36px item-box interpretation rather than pretending an existing padding value was reduced.

### Risk 5 — fractional icon dimensions

A literal 5% reduction yields 22.8px. Browser rendering supports fractional CSS pixels, but the contract must freeze whether that exact value is required.

### Risk 6 — active indicator proportion

The fixed active-marker offsets were designed around the current 40px item. Visual verification is required after density changes.

### Risk 7 — icon stroke applied too broadly

A generic sidebar SVG selector may affect collapse, close, help, or other icons. Limit stroke changes to `.nav-item-icon` or explicit item icon props.

### Risk 8 — icon-label optical alignment

A lighter 13px regular label beside a 22.8px stroke-1 icon may feel vertically or visually imbalanced even when mathematically centered. Check representative short and long labels.

### Risk 9 — long labels and badge collisions

Regular weight should create slightly more horizontal room, but mobile and expanded layouts still need checks for ellipsis and count alignment.

## Representative visual acceptance routes

D35 verification should include at least:

| Role | Representative route | Representative adjacent items |
|---|---|---|
| Officer | `/demo/officer` | `Dashboard` / `My tasks` |
| Officer | `/demo/officer/shared-work` where available | workflow items and active state |
| Supervisor | `/demo/supervisor` | `Dashboard` / `My tasks` |
| Supervisor | `/demo/supervisor/sla-monitor` | active SLA item and adjacent entries |
| Admin | `/demo/admin/services` | `Service catalogue` / `Service builder` |
| Admin | `/demo/admin/workflows/builder` | active builder entry and adjacent entries |

Each route should be checked in expanded desktop, collapsed desktop, and mobile drawer states.

## D35-1 decisions required

D35-1 must freeze:

1. whether the 10% density reduction means a 36px item minimum height while retaining the 4px list gap;
2. whether navigation `line-height` remains `1.25rem`;
3. whether Plus Jakarta Sans remains inherited or is declared explicitly on the role-scoped navigation selector;
4. whether icon size is exactly `22.8px` or a documented rounded value;
5. whether icon size and stroke are applied through Lucide props or narrowly scoped CSS;
6. the exact selector that limits changes to `OFFICER`, `SUPERVISOR`, and `ADMIN`;
7. whether active-indicator offsets remain unchanged;
8. the regression routes and responsive states required before D35 is frozen.

## D35-0 conclusion

The requested visual change is structurally small but must be scoped carefully. Officer, supervisor, and organization-admin navigation already share one renderer and one utility class, so D35 should not fork role-specific components. However, applicant and department workspaces share that same utility class, which means an unscoped global CSS edit would be incorrect.

The safest direction for D35-1 is:

- preserve the shared `InternalSidebar` renderer;
- preserve navigation definitions and route contracts;
- use the existing shell-role data attribute to target only the three requested roles;
- avoid changing the global compact-control token;
- set or confirm the exact typography values in one role-scoped rule;
- set icon size and stroke only on navigation-item icons;
- verify active, hover, focus, badge, collapsed, and mobile behaviour before freezing D35.

**D35-0 is complete when this document is reviewed and committed. No visual implementation should begin until D35-1 freezes the contract.**
