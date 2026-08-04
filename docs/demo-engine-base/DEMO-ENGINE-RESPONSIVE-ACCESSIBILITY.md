# FAIDIA Demo Engine Responsive and Accessibility Checks

## Document status

- Stage: D28
- Status: Active
- Scope: Responsive and accessibility hardening
- Route inventory: Unchanged
- Workflow behavior: Unchanged
- Production Supabase access: Prohibited

## 1. Purpose

D28 completes the dedicated responsive and accessibility pass across the reusable Demo Engine.

The stage adds a skip link, a focusable main-content target, touch-target protections, contrast-mode support, overflow protection and a repeatable source audit.

D28 does not change the service workflow.

## 2. Route-scoped accessibility layer

D28 adds:

`app/demo/demo-accessibility.css`

The stylesheet is imported once by:

`app/demo/layout.tsx`

It applies only to the Demo Engine.

## 3. Keyboard access

The Demo Engine provides:

- a skip-to-content link;
- visible focus indicators;
- keyboard-operable buttons and links;
- a focusable main-content destination;
- keyboard-operable presentation and reset controls;
- Escape behavior for presentation and reset;
- focus trapping inside the reset dialog;
- focus restoration after reset cancellation.

## 4. Responsive behavior

D28 hardens:

- long identifiers and references;
- button-label wrapping;
- narrow form controls;
- touch-target sizes;
- chart containment;
- table overflow;
- sticky-panel collapse;
- bottom-sheet reset behavior on small phones;
- coarse-pointer controls.

Manual responsive checks must cover:

- 320 × 568;
- 390 × 844;
- 768 × 1024;
- 1024 × 768;
- 1440 × 900.

## 5. Contrast and motion

D28 includes:

- prefers-contrast support;
- forced-colors support;
- reduced-motion support;
- semantic borders so statuses do not rely on color alone;
- visible focus at normal and increased contrast.

## 6. Text scaling and zoom

Test the major routes at:

- browser zoom 100%;
- browser zoom 200%;
- operating-system text enlargement where available.

At 200% zoom:

- content must remain available;
- primary actions must remain reachable;
- no text may be clipped;
- horizontal scrolling must be limited to genuine data tables;
- charts may stack but must remain understandable.

## 7. Source audit

D28 adds:

`scripts/audit-d28-demo-accessibility.mjs`

The audit checks:

- the 14-route inventory;
- the skip link;
- the focusable main-content target;
- image-like elements that may lack alt text;
- new-tab links that may lack rel protection;
- non-control elements with click handlers.

Heuristic findings are warnings requiring manual review. Missing route, skip-link or main-target requirements are failures.

## 8. Manual route matrix

Review these routes:

- `/demo`;
- `/demo/services/transcript-request`;
- `/demo/sign-up?service=transcript-request`;
- `/demo/apply/transcript-request`;
- `/demo/requests/REQ-DEMO-001/confirmation`;
- `/demo/track/REQ-DEMO-001`;
- `/demo/officer`;
- `/demo/officer/requests/REQ-DEMO-001`;
- `/demo/department`;
- `/demo/supervisor`;
- `/demo/outcomes/REQ-DEMO-001`;
- `/demo/reports`.

For each route confirm:

- Tab order follows the visual order;
- focus is visible;
- no keyboard trap exists;
- headings remain hierarchical;
- labels remain associated with controls;
- error and status messages are readable;
- identifiers wrap safely;
- mobile actions remain reachable;
- charts and tables do not break the page;
- presentation mode remains escapable;
- reset remains confirmable and cancellable.

## 9. Screen-reader smoke test

Using VoiceOver on macOS:

1. start VoiceOver with Command + F5;
2. open `/demo`;
3. activate the skip link;
4. navigate headings;
5. navigate links and buttons;
6. open the reset dialog;
7. confirm the dialog title and description are announced;
8. cancel reset;
9. review one applicant form;
10. review one staff workspace.

This is a smoke test, not a formal WCAG conformance audit.

## 10. D28 definition of done

D28 is complete when:

- the accessibility stylesheet exists;
- the demo layout imports it;
- the skip link exists;
- the main-content target is focusable;
- touch targets are hardened;
- long content is protected from overflow;
- mobile reset behavior is hardened;
- charts are contained;
- forced-colors support exists;
- prefers-contrast support exists;
- reduced-motion support remains;
- the source audit passes;
- manual route checks are completed;
- keyboard checks are completed;
- 200% zoom checks are completed;
- a VoiceOver smoke test is completed;
- no workflow logic changes;
- no route changes;
- no Supabase dependency is introduced;
- the 14-route inventory remains intact;
- type checking passes;
- linting passes;
- the production build passes;
- D28 verification passes;
- D28 is committed separately.
