# D31-11 Admin Visual Review

## Recorded body-to-body comparisons

| Comparison target | Normalized parity score | Diagnostic verdict |
|---|---:|---|
| 1536px supplied implementation body | 94.03% | High normalized similarity |
| 864px supplied design body | 89.37% | Moderate normalized similarity |
| 390px supplied mobile body | 93.99% | High normalized similarity |

## Shell-aware method

The supplied reference can mount its own navy Admin sidebar or mobile reference
header. The production route inherits the separately frozen FAIDIA Admin shell.

D31-11 removes only the reference-owned chrome before comparison:

```text
1536px: crop 216px from the left
864px:  crop 184px from the left
390px:  crop 64px from the top
```

Complete production-page captures remain available beside each body overlay.

## Manual-review artifacts

```text
docs/demo-engine-base/d31-dashboard-redesign/
└── admin-visual-comparison/
    ├── admin-implementation-overlay-50.png
    ├── admin-design-overlay-50.png
    └── admin-mobile-overlay-50.png
```

The score is a sampled normalized RGB diagnostic. Font rasterization, configured
Demo Pack records and shell width can affect the score. The overlays remain the
authoritative review artifacts.

## Freeze decision

The D31-10 Admin implementation is frozen as the D31-11 regression baseline.
Future Admin visual changes must deliberately update the Playwright screenshots,
comparison artifacts and hash baseline.
