# D29R-13 — Demo request-processing tracker

## Purpose

D29R-13 turns the public `Track a request` action into a visible simulation of
how a Savannah Technical College transcript request moves through the internal
workflow.

## User journey

1. The user selects `Track a request`.
2. `/demo/track` redirects to the seeded request.
3. `/demo/track/[requestId]` renders the tracking dashboard.
4. The dashboard automatically advances through:
   - Request submitted
   - Student Records review
   - Finance verification
   - Registrar approval
   - Transcript ready
5. The presenter may pause, resume, restart or manually advance the simulation.
6. When complete, the page exposes the controlled outcome link.

## Visible features

- applicant-safe current-stage summary;
- percentage progress bar;
- five-stage workflow;
- Recharts completion line chart;
- simulated backend activity feed;
- estimated demo duration;
- browser-session data notice;
- presentation controls;
- responsive desktop, tablet and mobile layout.

## Data boundary

The tracker uses static seeded data and React browser state. It does not query
or write Supabase, a production database or an external API.
