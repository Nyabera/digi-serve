# D31-9 Supervisor Visual Review

## Recorded comparison

| Comparison target | Normalized parity score | Diagnostic verdict |
|---|---:|---|
| Supplied 864 × 1821 design | 95.80% | High normalized similarity |
| Supplied 1536 × 2842 implementation preview | 96.35% | High normalized similarity |

## Data-aware semantic contract

The active Demo Pack currently supplies fewer than five Approval lane records.
The production dashboard deliberately renders `data.slice(0, 5)`, so D31-9
verifies that each reference table renders configured records. Individual
sections may use different visible limits; the screenshot baseline freezes
the exact current visual state.

## Required inspection artifacts

```text
docs/demo-engine-base/d31-dashboard-redesign/
└── supervisor-visual-comparison/
    ├── supervisor-design-overlay-50.png
    └── supervisor-bundle-preview-overlay-50.png
```

The score compares normalized sampled RGB values. It is sensitive to the
existing demo shell, font rasterization, configured records and screenshot
height. The 50% overlays are the authoritative visual-review artifacts.

## Freeze decision

The D31-8 production implementation is frozen as the D31-9 regression baseline.
Future visual calibration must update the screenshot baselines and Supervisor
hash baseline deliberately.
