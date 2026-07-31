# Officer dashboard cutoff diagnosis

## What caused the screenshots

The original bundle was accurate as a standalone 1536px-wide page, but the dashboard now renders inside a fixed sidebar and topbar. CSS media queries still measured the whole browser viewport, not the narrower dashboard content column.

That created five concrete failures:

1. The work-plan table was forced to `min-width: 900px` at one viewport breakpoint, so the Action column disappeared behind the card edge.
2. The plan-tab strip used only 64% of the work-plan card, leaving insufficient room for “Ready to complete.”
3. Case signals had a fixed `422px` height while global shell button sizing increased its content height, cutting off “Mark all read” and the footer link.
4. Every lower card had a fixed `267px` height. The shell’s button minimum height made Action Required taller than that, cutting off “Unread messages.”
5. The embedded component still used `100vh`, adding the shell’s topbars on top of a full viewport and producing unnecessary page overflow.

## What changed in v2

- Added the `embedded` component mode and made it the default.
- Replaced viewport-only layout decisions with CSS container queries.
- Changed fixed card heights to reference-sized minimum heights.
- Removed the forced 900px desktop table width.
- Enlarged the plan tabs to a safe maximum width.
- Made the case-signal tab row a five-column grid.
- Neutralized global desktop button minimum heights only where they break compact tabs and selects.
- Kept controlled horizontal table scrolling below 760px instead of squeezing or converting the table.

## Replacement rule

Replace both files together:

- `OfficerDashboard.tsx`
- `officer-dashboard.css`

Render the component as `<OfficerDashboard embedded />` inside the existing Officer shell. Do not change the sidebar, topbar, role selector, shell persistence, or navigation files.
