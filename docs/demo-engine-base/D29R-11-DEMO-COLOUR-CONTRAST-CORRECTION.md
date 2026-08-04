# D29R-11 — Demo surface and foreground contrast correction

## Confirmed root cause

The failures were caused by two interacting CSS rules, not by the Savannah palette itself.

1. `app/demo/demo-calibration.css` used the HTML element selector `main` as a route-wide design-system scope. It assigned a light background and dark foreground to every nested `<main>`, then forced `h1`, `h2`, `h3`, label text and table text back to the global light-surface tokens. Because `app/demo/layout.tsx` imports this stylesheet for every `/demo` route, the rule affected the homepage, public service pages, application pages, tracking pages and internal workspaces.
2. `components/demo/homepage/savannah-homepage.module.css` used `.page a { color: inherit; }`. That selector is more specific than `.primaryButton { color: #ffffff; }`, so anchor-based primary buttons inherited navy text even though their local button rule requested white.

The semantic tokens in `app/globals.css` were not the defect. `--primary-foreground` is white and the shared `.button-primary` utility already consumes it. The route-scoped D26 calibration layer and the homepage anchor reset overrode otherwise-correct local surface behavior.

## System correction

- Scope D26 calibration to `:where(.demo-presentation-content)` instead of every `main` element.
- Stop the calibration root from painting page backgrounds or assigning a universal text colour.
- Make headings and first-child label text inherit from their local surface.
- Keep generic form and table calibration at zero specificity so explicit component classes win.
- Add demo surface contracts for light, dark, dark-card and primary-action contexts.
- Lower the homepage anchor-reset specificity with `.page :where(a)`.
- Give dark homepage cards an explicit readable foreground.
- Mark the Savannah homepage and service-information hero as dark surfaces.
- Replace the obsolete `font-serif` utility in the service page with the approved sans stack.

## Preserved behavior

The correction does not change layout, dimensions, spacing, copy, routing, application state, responsive rules, workflow behavior, Savannah branding, Supabase behavior or dependencies.

## Required validation

Run:

```bash
node scripts/audit-demo-colour-contrast.mjs
./scripts/verify-d29r11-demo-colour-contrast.sh
npx tsc --noEmit
npm run lint
npm test -- --run
npm run build
git diff --check
```

Manually inspect all 14 `/demo` pages at desktop and mobile widths, including hover, focus, selected, disabled, error, success and empty states.
