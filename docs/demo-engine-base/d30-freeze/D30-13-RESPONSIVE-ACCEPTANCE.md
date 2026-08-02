# D30-13 — Responsive and Visual Acceptance

## Purpose

D30-13 completes the responsive section of the Demo freeze checklist after
D30-12 has proved that the routes and primary journeys work.

The verifier is generated before the responsive freeze manifest is hashed.
This prevents a missing-verifier failure during freeze creation.

The stage uses the same six canonical surfaces at four required viewports:

| Surface | Route source |
|---|---|
| Homepage | `/demo` |
| Certificate verification | `/demo/verify-certificate` |
| Track Request | seeded route from the D30-12 manifest |
| Officer dashboard | `/demo/officer` |
| Supervisor dashboard | `/demo/supervisor` |
| Admin dashboard | `/demo/admin` |

## Viewports

- `1440 × 900`
- `1024 × 768`
- `768 × 1024`
- `390 × 844`

## Runtime contracts

Every responsive case must:

- return a successful document response;
- render meaningful page content;
- avoid visible, uncontained page-level horizontal overflow;
- permit intentional table/chart scrollers only when a local overflow boundary contains them;
- keep visible navigation within the viewport or within an intentional local scroll boundary;
- ignore closed shell drawers that are fully translated outside the viewport;
- preserve the expected role workspace;
- retain substantial charts or data graphics on role dashboards;
- avoid gross text/background contrast failures below `1.8:1`;
- emit no uncaught browser errors;
- produce a viewport screenshot.

The contrast threshold is a regression smoke check for obvious dark-on-dark or
light-on-light failures. It evaluates direct visible text only, deduplicates
nested labels and excludes image, gradient, canvas, SVG and placeholder-media
surfaces whose pixel background cannot be inferred from computed CSS colors.
Viewport geometry checks also require a real horizontal and vertical viewport
intersection, so closed role-shell drawers translated fully off-canvas are not
misclassified as visible overflow. It does not replace a full WCAG audit.

## Protected scope

D30-13 is an acceptance and freeze stage. It does not redesign the homepage,
Track Request page, shells or dashboards. D31 visual baselines remain the
authority for Officer, Supervisor and Admin dashboard geometry.

## Evidence

```text
docs/demo-engine-base/d30-freeze/
├── D30-13-RESPONSIVE-MANIFEST.json
├── D30-13-RESPONSIVE-RESULTS.json
├── D30-13-RESPONSIVE-EVIDENCE.md
├── D30-13-RESPONSIVE-ACCEPTANCE.md
├── D30-13-CHECKLIST.md
├── responsive-baseline/
│   └── D30-13-RESPONSIVE-FREEZE.json
└── screenshots/responsive/
    ├── desktop-1440x900/
    ├── tablet-landscape-1024x768/
    ├── tablet-portrait-768x1024/
    └── mobile-390x844/
```
