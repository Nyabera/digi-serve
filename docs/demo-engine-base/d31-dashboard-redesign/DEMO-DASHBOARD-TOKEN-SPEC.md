# D31 Dashboard Design Token Specification

## Purpose

D31-3 converts the three frozen reference measurements into one reusable,
scoped dashboard token system.

The token system supports Officer, Supervisor, and Admin dashboards without
changing global application styles.

## Scoping rule

Tokens are scoped to the CSS Module class `theme`.

Supported role values:

```text
officer
supervisor
admin
```

No dashboard tokens are added to global `:root`.

## Reference geometry

| Role | Canvas | Shell included | Content width | Grid gap |
| --- | ---: | --- | ---: | ---: |
| Officer | 1568 × 1003 | No | 1512px | 14px |
| Supervisor | 864 × 1821 | Yes | 680px | 12px |
| Admin | 864 × 1821 | Yes | 683px | 12px |

## Typography

- Plus Jakarta Sans for display and dashboard headings.
- Inter for dense interface text.
- Source Code Pro for monospaced identifiers.

## Responsive rule

The implementation must reflow rather than scale screenshots.

Prohibited:

```text
zoom
transform: scale(...)
screenshot backgrounds
fixed canvas scaling
```
