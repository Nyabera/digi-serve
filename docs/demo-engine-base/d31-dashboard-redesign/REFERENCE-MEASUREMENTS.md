# D31 Dashboard Reference Measurements

## Canonical files

| Role | File | Canvas | Shell included | Interpretation |
| --- | --- | ---: | --- | --- |
| Officer | `public/demo/references/dashboards/officer-dashboard.png` | 1568 × 1003 | No | Dashboard body |
| Supervisor | `public/demo/references/dashboards/supervisor-dashboard.png` | 864 × 1821 | Yes | Long scrolling department dashboard |
| Admin | `public/demo/references/dashboards/admin-dashboard.png` | 864 × 1821 | Yes | Long scrolling institution dashboard |

The file hashes are stored in:

```text
public/demo/references/dashboards/REFERENCE-SHA256.txt
```

## Shared visual grammar

- pale neutral application background;
- white cards with thin cool-grey borders;
- restrained shadows;
- approximately 10–14px card radii;
- compact, information-dense typography;
- strong navy headings;
- blue as the primary interactive colour;
- semantic green, orange, red and purple status accents;
- small action links rather than oversized buttons;
- deliberate table column widths;
- square chart containers for rings and donuts;
- continuous vertical flow rather than detached floating sections.

## Officer geometry

Reference canvas:

```text
1568 × 1003
```

Approximate body frame:

- outer reference margin: 6–8px;
- content inset: 28–38px;
- title top: approximately 27px;
- first panel row begins: approximately 99px;
- lower four-card row begins: approximately 701px;
- bottom reference edge: approximately 966px.

Twelve-column interpretation:

```text
Row 1
Workload pulse: 8 columns
Case signals: 4 columns

Row 2
Today's work plan: 8 columns
Recent handoffs: 4 columns

Row 3
Recent activity: 3 columns
Up next: 3 columns
Action required: 3 columns
My rhythm: 3 columns
```

The officer reference does not define the application shell. Existing Officer
shell dimensions remain authoritative.

## Supervisor geometry

Reference canvas:

```text
864 × 1821
```

Approximate shell and content frame:

- sidebar width: approximately 116–120px;
- content left edge: approximately 136px;
- content right edge: approximately 816px;
- usable content width: approximately 680px;
- main content top: approximately 17px.

Approximate zone ranges:

| Zone | Label | Vertical range |
| --- | --- | ---: |
| 1 | Department health | 69–448px |
| 2 | Work distribution and control | 467–917px |
| 3 | Department performance | 936–1350px |
| 4 | Oversight and governance | 1370–1795px |

The Supervisor reference includes a shell concept, but D31 must preserve the
existing shared Officer/Supervisor operational shell.

## Admin geometry

Reference canvas:

```text
864 × 1821
```

Approximate shell and content frame:

- dark sidebar width: approximately 116–120px;
- content left edge: approximately 134px;
- content right edge: approximately 817px;
- usable content width: approximately 683px;
- first zone begins: approximately 20px.

Approximate zone ranges:

| Zone | Label | Vertical range |
| --- | --- | ---: |
| 1 | Institution-wide health | 20–613px |
| 2 | Operational visibility | 622–1110px |
| 3 | Financial and document control | 1118–1436px |
| 5 | Governance and institutional insight | 1444–1797px |

The missing Zone 4 is intentional in the selected Admin design. Preserve the
visible numbering unless the design authority is explicitly changed.

## Responsive verification viewports

Later visual verification must include:

- canonical reference dimensions;
- 1440px desktop;
- 1024px tablet;
- 390px mobile;
- 80% browser zoom.

Near-pixel fidelity is required at the canonical desktop reference. Other
viewports must remain coherent and usable rather than artificially scaled.
