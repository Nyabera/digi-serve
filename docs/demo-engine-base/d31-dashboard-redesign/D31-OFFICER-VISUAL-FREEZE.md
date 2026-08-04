# D31-7 — Officer Visual Verification and Freeze

## Purpose

D31-7 converts the approved D31-6R5B Officer dashboard into a protected visual
baseline before Supervisor reconstruction begins.

The dashboard redesign specification requires visual comparison at the
reference desktop width, 80% zoom, 1440px desktop, 1024px tablet, and 390px
mobile. The implementation must be overlaid with the frozen reference at
approximately 50% opacity before the baseline is accepted.

## Approved implementation

```text
D31-6R5B
spacious-v3.1
```

## Protected implementation files

```text
features/demo-engine/dashboards/officer/high-fidelity/
app/demo/officer/page.tsx
```

The generated hash baseline records the exact contents of these files.

## Visual tests

```text
tests/visual/d31/officer-dashboard.pw.ts
playwright.d31.config.ts
```

Captured baselines:

```text
officer-reference-desktop.png
officer-browser-zoom-80.png
officer-desktop-1440.png
officer-tablet-1024.png
officer-mobile-390.png
```

## Overlay

D31-7 writes:

```text
docs/demo-engine-base/d31-dashboard-redesign/
└── visual-overlays/
    ├── officer-implementation-reference.png
    └── officer-reference-overlay.png
```

The overlay uses the frozen D31-1 reference at 50% opacity over the current
Officer implementation. This is an inspection artifact, not a production
background.

## Interaction coverage

The Playwright test verifies:

- Work-plan tab switching;
- Case Signals tab switching;
- chart-period switching;
- Mark all read status feedback;
- one page heading;
- eight table headers;
- six visible work-plan rows;
- both My Rhythm charts.

## Freeze rule

After D31-7, Supervisor work may reuse the shared dashboard language. Officer
dashboard geometry may not change silently. Any later change must deliberately
update the screenshot baseline and the Officer hash baseline.
