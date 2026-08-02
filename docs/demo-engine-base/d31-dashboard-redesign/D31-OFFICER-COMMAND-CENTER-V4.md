# D31-6R4 — Officer command-center visual parity

## Decision

D31-6R4 replaces the previous Officer dashboard body with the supplied v4
command-center implementation.

The existing application shell remains the owner of:

- the Savannah Technical College sidebar;
- the top search bar;
- the role selector;
- the active request selector;
- presentation and reset controls;
- navigation and demo persistence.

## Body composition

The body begins with the active-work surface rather than repeating the greeting
or workload summary already represented elsewhere in the shell.

```text
Top row
├── Work-plan tabs and eight-column request table
└── Case signals
    └── Recent handoffs

Bottom row
├── Recent Activity
├── Up Next
├── Action Required
└── My rhythm
```

## High-fidelity corrections

- Native table layout with a real eight-column `colgroup`.
- Table-cell flex behavior is confined to wrappers inside cells.
- Seventy-four-pixel work rows create a stable vertical rhythm.
- Three equal 58px work-plan controls sit inside the segmented tab card.
- Case signals uses three intrinsic rows with no stretched footer.
- Recent handoffs uses a dedicated timeline marker track.
- Recent Activity uses a repeated `61px / 32px / 1fr` row grid.
- Lower cards use `1.13fr / 1fr / 0.9fr / 1.48fr`.
- The period selector is explicitly `102px × 36px`.
- Plus Jakarta Sans is used for headings and Inter for dense interface text.
- Every control selector remains beneath `.officer-dashboard`.
- Container queries react to dashboard-body width rather than browser width.

## Route

```text
/demo/officer
```

## Integration

```tsx
<OfficerDashboardHighFidelity embedded />
```

## Data boundary

The v4 fixture remains the visual sign-off dataset. The typed D31-5 adapters are
preserved and can be reconnected after Officer visual parity is approved.
