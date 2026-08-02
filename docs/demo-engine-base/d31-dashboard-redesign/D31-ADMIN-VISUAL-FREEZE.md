# D31-11 — Admin Visual Comparison and Freeze

## Basis

D31-11 freezes the D31-10 Admin dashboard using the exact runnable bundle
archived during reconstruction.

The supplied bundle remains the source for:

- the 864 × 1821 design reference;
- the 1536 × 3327 desktop implementation preview;
- the 390 × 7624 mobile implementation preview;
- the original React, CSS, TypeScript data and implementation specification.

## Shell-aware comparison

The runnable bundle can render its own navy administrator sidebar. The
production FAIDIA route deliberately does not import that sidebar because the
Admin shell was frozen separately in D31-2.

D31-11 therefore compares dashboard body against dashboard body:

```text
1536 preview: crop 216px standalone sidebar
864 design:   crop 184px standalone sidebar
390 preview:  crop 64px mobile reference header
```

The complete production page is also captured as a context artifact so the
existing Admin shell can be inspected separately.

## Responsive visual baselines

```text
1536px desktop
1440px desktop
864px supplied-reference width
1024px tablet
390px mobile
```

## Comparison output

```text
docs/demo-engine-base/d31-dashboard-redesign/
└── admin-visual-comparison/
    ├── admin-implementation-current-body.png
    ├── admin-implementation-current-page.png
    ├── admin-implementation-target-body-crop.png
    ├── admin-implementation-current-normalized.png
    ├── admin-implementation-overlay-50.png
    ├── admin-design-current-body.png
    ├── admin-design-current-page.png
    ├── admin-design-target-body-crop.png
    ├── admin-design-current-normalized.png
    ├── admin-design-overlay-50.png
    ├── admin-mobile-current-body.png
    ├── admin-mobile-current-page.png
    ├── admin-mobile-target-body-crop.png
    ├── admin-mobile-current-normalized.png
    ├── admin-mobile-overlay-50.png
    └── ADMIN-VISUAL-METRICS.json
```

The numeric parity score is diagnostic. The 50% opacity overlays are the
authoritative manual-review artifacts.

## Test boundaries

Playwright remains isolated under:

```text
tests/visual/d31/*.pw.ts
```

Vitest does not import D31 visual tests.

The semantic test validates configured record presence rather than imposing a
hard-coded row count. Exact visible content is frozen by the screenshots.
