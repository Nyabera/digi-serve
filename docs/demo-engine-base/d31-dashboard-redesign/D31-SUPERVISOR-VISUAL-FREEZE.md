# D31-9 — Supervisor Visual Comparison and Freeze

## Basis

D31-9 uses the supplied runnable Supervisor bundle as a calibration source.

The supplied design reference and the design image uploaded with this stage are
byte-identical:

```text
SHA-256
10d6c51289bb10f8bbf9ad804ff5bc7fb42cc537d8f4cd5accf61b662fb38ab0
```

The runnable bundle also supplies a 1536 × 2842 implementation preview and the
exact React, CSS, TypeScript data, README and parity specification used to
produce it.

## Production boundary

The reference bundle is not imported into the production route.

The production route remains:

```text
/demo/supervisor
```

and continues to consume the active Demo Pack through the D31-5 Supervisor
adapter. The supplied bundle is stored as non-compiling reference material for
measurement and auditability.

## Visual captures

D31-9 captures the Supervisor dashboard body at:

```text
1536px desktop
1440px desktop
864px source-reference width
1024px tablet
390px mobile
```

The production route is captured separately from the supplied reference so the
existing shared operational shell remains the source of truth.

## Comparison artifacts

D31-9 writes:

```text
docs/demo-engine-base/d31-dashboard-redesign/
└── supervisor-visual-comparison/
    ├── supervisor-current-full-page.png
    ├── supervisor-current-normalized-to-design.png
    ├── supervisor-design-overlay-50.png
    ├── supervisor-current-normalized-to-bundle-preview.png
    ├── supervisor-bundle-preview-overlay-50.png
    └── SUPERVISOR-VISUAL-METRICS.json
```

The overlays use 50% opacity. The numeric parity score is a sampled normalized
RGB similarity diagnostic. It is not a replacement for inspecting the overlay.

## Freeze

D31-9 hashes:

- the D31-8 Supervisor route and production dashboard files;
- the supplied reference and implementation preview;
- the D31-9 visual contract and Playwright test;
- five responsive screenshot baselines;
- the comparison images and metrics.

Any later Supervisor visual change must deliberately update the D31-9 freeze.
