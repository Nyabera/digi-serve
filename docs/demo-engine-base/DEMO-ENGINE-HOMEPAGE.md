# FAIDIA Demo Engine Homepage

## Document status

- Stage: D11
- Status: Active
- Homepage count: 1
- Source reference: Approved D10 homepage image
- Production Supabase access: Prohibited

## 1. Purpose

D11 converts the approved D10 homepage reference into a working React homepage.

The homepage must preserve the reference structure, density and hierarchy.

The reference image must not be displayed as the final homepage itself.

## 2. Structural composition

The homepage contains:

1. A dark FAIDIA navigation bar.
2. A hero introduction with heading, supporting copy and dual actions.
3. A right-aligned search field.
4. A three-column operational mosaic:
   - quick actions and response-time cards;
   - a large centre media panel;
   - request tracking and live-status panels.
5. A two-column popular-services section.
6. A two-column request-process section.
7. A split impact-story section.
8. An institutional metrics strip.
9. A two-column FAQ section.
10. A blue closing call-to-action strip.

## 3. Exact direction

The homepage must closely match the approved reference in:

- section order;
- dark/light contrast;
- spacing rhythm;
- card density;
- headline scale;
- operational dashboard composition;
- list-based service layout;
- horizontal process layout;
- editorial FAQ layout;
- closing CTA emphasis.

## 4. Allowed demo adaptation

D11 may adapt the exact content to the current FAIDIA demo.

The homepage uses the current demonstration journey and service set rather than unrelated production claims.

The active public service set is:

- Request a transcript;
- Student clearance request;
- Certificate replacement;
- Track an existing request.

## 5. Required route access

The homepage must provide access to:

- `/demo/services`
- `/demo/sign-up`
- `/demo/apply`
- `/demo/track`
- `/demo/requests`
- `/demo/officer`

## 6. Boundaries

D11 must not:

- reintroduce the D10 homepage preview as visible homepage content;
- display Homepage A, B or C;
- add a homepage switcher;
- add production Supabase reads;
- add production Supabase writes;
- remove D8 demo controls;
- remove the single-homepage configuration.

## 7. Definition of done

D11 is complete when:

- the reference preview is replaced by a real homepage implementation;
- the homepage matches the approved structure;
- the homepage is built as reusable components;
- the homepage is responsive;
- the homepage links into the demo journey;
- no Supabase dependency is introduced;
- type checking passes;
- linting passes;
- the production build passes;
- D11 verification passes;
- D11 is committed separately.
