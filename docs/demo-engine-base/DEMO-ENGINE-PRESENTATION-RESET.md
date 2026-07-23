# FAIDIA Demo Engine Presentation and Reset

## Document status

- Stage: D27
- Status: Active
- Scope: Presentation behavior and browser-session reset
- Route inventory: Unchanged
- Production Supabase access: Prohibited

## 1. Purpose

D27 finalizes buyer-facing presentation mode and safe demonstration reset behavior.

The stage upgrades the D8 presentation and reset controls without changing the underlying request workflow.

D27 allows one continuous end-to-end demonstration to be presented cleanly and restarted reliably.

## 2. Presentation behavior

Presentation mode:

- hides the shared Demo Engine control zone;
- keeps the current route and workflow state;
- requests browser fullscreen when available;
- still works as a clean route-scoped presentation when fullscreen is blocked;
- shows a compact story-step label;
- shows one visible exit action;
- exits with Escape;
- persists across route navigation within the current browser session.

The keyboard shortcut is Shift + P.

## 3. Story labels

D27 maps the current route to a presentation label for:

- public service portal;
- service information;
- applicant sign-up;
- application and documents;
- review and submission;
- officer queue;
- officer review and referral;
- Finance processing;
- Registrar approval;
- controlled outcome;
- operational reporting;
- applicant tracking.

The labels are presentation aids only. They do not create workflow state.

## 4. Existing D8 control compatibility

D27 wraps the existing D8 control bar.

When the existing controls contain presentation or reset actions, D27 intercepts those controls and applies the finalized behavior.

When one of those controls is unavailable, D27 renders a compact fallback action.

Role switching and request selection remain owned by the existing shared control bar.

## 5. Reset behavior

Reset requires an explicit confirmation dialog.

The reset dialog explains that the following browser-session demonstration data will be cleared:

- applicant details;
- application responses;
- selected document metadata;
- request submission;
- officer review;
- internal notes;
- correction state;
- departmental referral;
- Finance result;
- Registrar decision;
- controlled outcome;
- presentation state.

Reset removes FAIDIA Demo Engine session-storage keys and returns to `/demo`.

The keyboard shortcut is Shift + R.

## 6. Reset safety boundary

Reset affects only keys beginning with:

`faidia.demo-engine.`

D27 does not:

- call Supabase;
- delete production records;
- delete files;
- modify environment variables;
- clear unrelated browser storage;
- change seeded configuration;
- change reducer behavior;
- change request business rules;
- change route structure.

## 7. Accessibility

D27 provides:

- keyboard shortcuts;
- Escape behavior;
- visible focus;
- an accessible modal dialog;
- focus entry into the confirmation dialog;
- focus trapping inside the open dialog;
- focus restoration after cancellation;
- an aria-live status message;
- mobile presentation controls;
- reduced-motion support.

## 8. Presentation checklist

Test:

1. enter presentation using the existing control;
2. enter presentation using Shift + P;
3. navigate between demo routes;
4. confirm presentation state persists;
5. exit using the visible exit action;
6. exit using Escape;
7. open reset using the existing reset control;
8. open reset using Shift + R;
9. cancel reset;
10. confirm focus returns correctly;
11. confirm reset clears the journey;
12. confirm reset returns to `/demo`;
13. confirm production data is untouched.

## 9. D27 definition of done

D27 is complete when:

- the presentation frame exists;
- the demo layout uses the presentation frame;
- the D8 control bar remains available outside presentation mode;
- existing presentation and reset controls are intercepted;
- fallback actions exist;
- fullscreen is requested when available;
- CSS presentation mode works without fullscreen;
- Escape exits presentation mode;
- Shift + P toggles presentation;
- Shift + R opens reset;
- route story labels render;
- reset requires confirmation;
- reset clears only Demo Engine session-storage keys;
- reset returns to `/demo`;
- focus management is implemented;
- no workflow logic changes;
- no route changes;
- no Supabase dependency is introduced;
- the 14-route inventory remains intact;
- type checking passes;
- linting passes;
- the production build passes;
- D27 verification passes;
- D27 is committed separately.
