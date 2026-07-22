# FAIDIA Demo Engine Application Form

## Document status

- Stage: D17
- Status: Active
- Route: `/demo/apply/[serviceSlug]`
- Form source: D6 service configuration
- Draft source: D7 shared browser state
- Production Supabase access: Prohibited

## 1. Purpose

D17 replaces the application-form placeholder with one configurable form renderer.

The same route renders Transcript Request, Student Clearance Request and Certificate Replacement from their configured service schemas.

## 2. Configuration-driven fields

The renderer supports:

- short text;
- email;
- phone;
- select;
- year;
- textarea;
- checkbox;
- declaration.

Sections, field labels, options, required states, placeholders and help text come from D6 client configuration.

## 3. Draft state

Every field change dispatches the typed `SET_FORM_VALUE` action.

Draft responses are stored beneath the selected service slug in D7 shared state.

Because D7 uses session storage, draft responses survive navigation and browser refresh within the same session.

D17 does not write a production draft request.

## 4. Validation

D17 validates all configured required fields before continuation.

Required declarations and checkboxes must be selected.

The page displays the number and percentage of completed required fields.

This is demo-side validation only. Production V1 will still require client-side and server-side Zod validation.

## 5. Journey continuity

D16 continues to:

`/demo/apply/[serviceSlug]`

After the configured required fields are complete, D17 continues temporarily to the existing confirmation route using the active demonstration request.

A later Demo Engine stage will add simulated documents, review and request creation before final confirmation.

## 6. Existing boundaries

D17 continues to use:

- D6 client and form configuration;
- D7 shared state and typed actions;
- D8 demonstration controls;
- D9 public-facing shell;
- D15 service information;
- D16 selected-service continuity.

## 7. Restrictions

D17 does not implement:

- production form submission;
- production draft persistence;
- document upload;
- document metadata creation;
- payment processing;
- request-reference generation;
- workflow-instance creation;
- first work-item creation;
- production audit events.

## 8. D17 definition of done

D17 is complete when:

- the application placeholder is replaced;
- all three active services render from configuration;
- all supported field types render;
- configured sections and field options render;
- field changes update D7 draft state;
- draft values survive route navigation and refresh;
- required-field validation blocks incomplete continuation;
- completion progress is visible;
- invalid service slugs return not found;
- no production Supabase dependency is added;
- type checking passes;
- linting passes;
- the production build passes;
- D17 verification passes;
- D17 is committed separately.
