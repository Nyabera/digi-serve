# D29R-23D — Officer dashboard visual correction

This stage changes only the Officer dashboard body presentation.

## Modern operational strip

The six detached metric cards are replaced with one connected strip:

- Assigned to Me — 18
- Due Today — 7
- Overdue — 3
- Waiting on Applicant — 24
- Waiting on Department — 11
- Completed Today — 12

The first segment is the dominant blue action. The remaining five use
neutral white surfaces, subtle dividers and compact Material status accents.

Every segment remains a functional link to the corresponding task filter.

## Department SLA / Workload

The old independently aligned donut, legend and workload card are replaced
by one explicit three-column grid:

1. Two-level Recharts donut
2. SLA status breakdown
3. Workload snapshot

Material status colours:

- Green 500: `#4CAF50`
- Amber 600: `#FFB300`
- Red 500: `#F44336`

The shell, queue, handoffs, messages, typography and routing are preserved.
