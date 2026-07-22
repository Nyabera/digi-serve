# FAIDIA Demo Engine Controls

## Document status

- Stage: D8
- Status: Active
- Route scope: `/demo/**`
- State source: D7 Demo Engine state
- Production database writes: Prohibited

## 1. Purpose

D8 connects visible demonstration controls to the shared D7 state engine.

The controls appear above every route beneath `/demo`.

The controls update synthetic browser state only.

## 2. Control bar

The shared control bar is installed in:

`app/demo/layout.tsx`

The component is:

`components/demo/controls/demo-control-bar.tsx`

The control bar remains available while the presenter moves between applicant, officer, department, supervisor, outcome and reporting routes.

## 3. Homepage switcher

The homepage switcher exposes:

- Homepage A.
- Homepage B.
- Homepage C.

Selecting a homepage dispatches:

`SET_HOMEPAGE_VARIANT`

Changing the homepage does not reset requests, documents, handoffs, approvals or outcomes.

The actual homepage designs will be implemented during D10 through D13.

## 4. Role switcher

The role switcher exposes:

- Applicant.
- Officer.
- Supervisor.
- Organization administrator.

Selecting a role dispatches:

`SET_ACTIVE_ROLE`

The selected role remains available across Demo Engine routes through the shared provider.

## 5. Request switcher

The request switcher lists all seeded requests.

Each option shows:

- Request reference.
- Applicant-visible status.

Selecting a request dispatches:

`SET_ACTIVE_REQUEST`

The request selector does not modify the request workflow.

## 6. Presentation mode

Presentation mode uses the browser Fullscreen API.

It does not create a separate route or application.

The presenter can enter and exit fullscreen without changing Demo Engine state.

If fullscreen is unavailable, the rest of the demonstration remains usable.

## 7. Reset control

Reset clears the Demo Engine session-storage record and recreates deterministic seed state.

Reset returns the presenter to:

`/demo`

The reset control requires confirmation before it runs.

Reset does not modify production Supabase data.

## 8. Configuration control

Visibility of controls is determined by the active client configuration:

- `showVariantSwitcher`
- `showRoleSwitcher`
- `showPresentationControls`
- `allowReset`

Client-specific control behaviour must remain configuration-driven.

## 9. Restrictions

D8 does not implement:

- Homepage A.
- Homepage B.
- Homepage C.
- Final public shell design.
- Final applicant shell.
- Final officer shell.
- Final supervisor shell.
- Workflow action buttons.
- Real authentication.
- Real document uploads.
- Production database writes.
- Recharts dashboards.

## 10. D8 definition of done

D8 is complete when:

- the shared control bar appears on every `/demo` route;
- homepage A, B and C can be selected;
- applicant, officer, supervisor and admin roles can be selected;
- seeded requests can be selected;
- presentation mode can enter and exit fullscreen;
- reset requires confirmation;
- reset recreates deterministic seed state;
- reset returns to `/demo`;
- controls use D7 typed actions;
- control visibility uses D6 client configuration;
- no production Supabase dependency is added;
- type checking passes;
- linting passes;
- the production build passes;
- D8 verification passes;
- D8 is committed separately.
