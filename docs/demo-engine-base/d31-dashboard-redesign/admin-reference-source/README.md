# Savannah Technical College — Administrator Dashboard

A responsive React + TypeScript implementation of the supplied administrator dashboard concept. It includes the exact demo labels and figures shown in the design, real Recharts visualizations, interactive navigation/actions, report toggles, and both embedded and standalone modes.

## Run the complete reference preview

```bash
npm install
npm run dev
```

The preview uses `<AdminDashboard embedded={false} />` and includes the dark administrator navigation shown in the source image.

## Add it to the existing demo shell

Copy these three files into the app:

- `components/AdminDashboard.tsx`
- `data/admin-dashboard-data.ts`
- `styles/admin-dashboard.css`

Install the packages from `package-additions.json`, import the stylesheet once, and render:

```tsx
<AdminDashboard />
```

Embedded mode is the default and deliberately omits the standalone sidebar so it does not duplicate your current application shell. Use `embedded={false}` only when you want the complete reference composition.

## Notes

- The main stylesheet is scoped beneath `.admin-dashboard` and does not alter `body`, generic buttons, or your global shell.
- The desktop layout follows the supplied dense 1536px composition. Panels progressively reflow at 1200px, 840px, and 560px.
- `AdminDashboardData` is inferred from the seeded object and may be supplied through the `data` prop when you connect real aggregate reporting endpoints.
- This view contains only organization-level aggregates. It does not expose request documents, messages, or sensitive applicant notes.
