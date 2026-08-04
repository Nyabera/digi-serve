# FAIDIA Demo Engine Design Calibration

## Document status

- Stage: D26
- Status: Active
- Scope: Visual calibration only
- Route inventory: Unchanged
- Workflow behavior: Unchanged
- Production Supabase access: Unchanged and prohibited

## 1. Purpose

D26 completes the first visual calibration pass across the reusable Demo Engine.

The stage aligns public, applicant, officer, department, supervisor, outcome and reporting interfaces with the implemented FAIDIA design system.

D26 changes presentation, not workflow behavior.

## 2. Design thesis

The calibrated Demo Engine must feel:

- calm;
- institutional;
- controlled;
- readable;
- operational;
- credible during a buyer demonstration;
- comfortable for applicants;
- efficient for staff.

Hierarchy comes from typography, spacing, surfaces and borders before decoration.

## 3. Central calibration layer

D26 adds one route-scoped stylesheet:

`app/demo/demo-calibration.css`

The stylesheet is imported once by:

`app/demo/layout.tsx`

This avoids repeating visual corrections inside every workflow component.

The calibration layer uses the central design-system variables when they exist and provides stable fallbacks for the isolated Demo Engine.

## 4. Calibrated areas

D26 calibrates:

- page background and content rhythm;
- public and staff headings;
- card borders, radii and shadows;
- dark operational headers;
- primary and secondary actions;
- focus-visible states;
- form controls;
- queue and table density;
- status badges;
- alerts and confirmations;
- Recharts axes, grids, legends and tooltips;
- controlled-outcome previews;
- mobile spacing;
- tablet sticky-panel behavior;
- reduced-motion behavior;
- print behavior.

## 5. Workspace-specific intent

### Public and applicant interfaces

Public and applicant pages retain comfortable spacing, clear guidance and one prominent next action.

### Officer and department interfaces

Officer and department workspaces retain denser queue-first layouts, clear ownership, visible statuses and compact action panels.

### Supervisor interface

The Registrar workspace emphasizes the approval gate, prerequisite checks and decision authority.

### Outcome interface

The outcome workspace emphasizes approval provenance, exact-copy integrity, delivery state and controlled completion.

### Reports interface

The reporting workspace prioritizes chart legibility, compact labels, restrained gridlines and readable tooltips.

## 6. Restrictions

D26 does not:

- add a route;
- remove a route;
- change the D6 client configuration;
- change D7 state;
- change reducer actions;
- change public status mappings;
- change business rules;
- change approval prerequisites;
- change handoff behavior;
- change outcome behavior;
- add production data;
- call Supabase;
- create new product capabilities.

## 7. Manual calibration checklist

Review these routes at desktop, tablet and mobile widths:

- `/demo`;
- `/demo/services/transcript-request`;
- `/demo/sign-up?service=transcript-request`;
- `/demo/apply/transcript-request`;
- `/demo/officer`;
- `/demo/officer/requests/REQ-DEMO-001`;
- `/demo/department`;
- `/demo/supervisor`;
- `/demo/outcomes/REQ-DEMO-001`;
- `/demo/reports`;
- `/demo/track/REQ-DEMO-001`.

Confirm:

- no horizontal overflow;
- no clipped labels;
- no hidden primary action;
- visible keyboard focus;
- readable semantic statuses;
- consistent card treatment;
- consistent form-control height;
- charts remain legible;
- sticky panels become static on smaller screens;
- identifiers wrap safely;
- dark headers remain readable.

## 8. D26 definition of done

D26 is complete when:

- the route-scoped calibration stylesheet exists;
- the demo layout imports the stylesheet;
- public and applicant surfaces are calibrated;
- staff cards and queues are calibrated;
- form controls are calibrated;
- status surfaces remain semantic;
- all Recharts surfaces are calibrated;
- focus-visible behavior is present;
- reduced-motion behavior is present;
- responsive calibration is present;
- print behavior is present;
- no workflow logic changes;
- no route changes;
- no Supabase dependency is introduced;
- the 14-route inventory remains intact;
- type checking passes;
- linting passes;
- the production build passes;
- D26 verification passes;
- D26 is committed separately.
