# Admin dashboard implementation specification

## Visual contract

- Separate navy administrator navigation in standalone preview mode.
- 1320px desktop dashboard canvas with dense white cards, subtle blue-gray borders, compact Inter body text, and Plus Jakarta Sans headings.
- Exact visible zones from the reference: Zone 1, Zone 2, Zone 3, and Zone 5.
- Real SVG/Recharts graphs rather than screenshots or background-image approximations.
- Seeded Savannah Technical College demo values matching the reference concept.

## Integration contract

- `embedded` defaults to `true`, rendering only the dashboard body.
- `embedded={false}` renders the complete reference shell.
- No global dashboard height, CSS zoom, scale transform, or viewport-specific fixed canvas.
- Tables scroll horizontally on narrow screens; cards stack without clipping.

## Primary files

| File | Purpose |
|---|---|
| `components/AdminDashboard.tsx` | Full interactive dashboard component |
| `data/admin-dashboard-data.ts` | Typed demo data and dashboard values |
| `styles/admin-dashboard.css` | Scoped visual and responsive system |
| `example/page.tsx` | Body-only integration example |
| `example/reference-preview.tsx` | Full standalone composition example |
