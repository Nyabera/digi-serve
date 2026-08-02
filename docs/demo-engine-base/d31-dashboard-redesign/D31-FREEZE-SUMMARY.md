# D31 Dashboard Redesign — Freeze Summary

## Frozen role dashboards

| Role | Reconstruction | Visual freeze |
|---|---|---|
| Officer | D31-6 and revisions | D31-7 |
| Supervisor | D31-8 | D31-9 |
| Admin | D31-10 | D31-11 |

## Shared foundations

The completed freeze retains the earlier D31 contracts for:

- operational and Admin shell ownership;
- dashboard measurements and tokens;
- shared card, grid, zone, metric, status, progress, table, chart and tab
  primitives;
- typed Officer, Supervisor and Admin data contracts;
- Demo Pack adapters and validation.

## Change policy after D31

A later dashboard change must be deliberate.

At minimum, the affected role must:

1. update its implementation;
2. rerun its visual suite;
3. inspect its comparison overlays;
4. regenerate its role baseline;
5. update the D31 master freeze;
6. rerun the complete D31-12 regression gate.

Unrelated routes and shell files must remain unchanged.
