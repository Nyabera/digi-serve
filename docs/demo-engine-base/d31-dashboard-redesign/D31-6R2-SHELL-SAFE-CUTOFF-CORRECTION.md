# D31-6R2 — Officer Dashboard Shell-Safe Cutoff Correction

## Purpose

D31-6R2 replaces the first high-fidelity integration with the corrected v2
bundle supplied for the Officer dashboard.

The original high-fidelity page matched the standalone reference, but its
viewport assumptions and fixed card heights did not survive inside FAIDIA's
narrower sidebar and topbar shell.

## Corrected failures

1. The work-plan Action column was clipped by a forced 900px table minimum.
2. The work-plan tabs did not leave enough width for “Ready to complete.”
3. The Case Signals footer and “Mark all read” control were cut off.
4. The final Action Required row was clipped.
5. The dashboard consumed `100vh` even though the role shell already owned the
   viewport.
6. Browser-width media queries reacted to the full browser instead of the
   dashboard content column.

## Source of truth

The canonical replacement comes from the uploaded bundle:

```text
officer-dashboard-react-typescript (2).zip
```

The following files are used together:

```text
components/OfficerDashboard.tsx
styles/officer-dashboard.css
CUTOFF-DIAGNOSIS.md
```

## Integration changes

The supplied component is preserved, with only integration-safe changes:

- the root receives `d31-officer-reference`;
- the exported component is named `OfficerDashboardHighFidelity`;
- `/demo/officer` renders it with `embedded` enabled;
- every CSS selector is scoped below `.d31-officer-reference`;
- the Officer layout, sidebar, topbar, role switching, and shell persistence
  remain unchanged.

## Shell-safe behavior

The corrected stylesheet uses an inline-size container on the dashboard root.
Responsive decisions are based on the dashboard's actual width beside the
sidebar, not the full browser viewport.

Reference heights are minimums rather than clipping heights:

```text
Workload pulse: 145px minimum
Work plan: 443px minimum
Case signals: 422px minimum
Recent handoffs: 168px minimum
Lower cards: 267px minimum
```

The desktop table no longer uses a 900px minimum. At compact widths, controlled
horizontal scrolling starts only below the 760px dashboard-container
breakpoint.

## Data boundary

The reference fixture remains in place during visual sign-off. D31-5 typed
adapters remain available and are not deleted or modified by this correction.

## Route

```text
http://localhost:3000/demo/officer
```
