# FAIDIA Demo Engine Homepage Reference

## Document status

- Stage: D10
- Status: Active
- Homepage count: 1
- Reference count: 1
- Reference status: Approved
- Final homepage implementation: Not started
- Production Supabase access: Prohibited

## 1. Purpose

D10 attaches one approved homepage reference to the Demo Engine.

The reference is not the final homepage implementation.

D11 converts the approved reference into the working homepage.

## 2. Approved reference

The only approved screenshot is stored at:

`public/demo/references/homepage/primary-homepage-reference.png`

This screenshot is the primary visual source for the single FAIDIA Demo Engine homepage.

No additional homepage references are required.

## 3. Homepage count

The Demo Engine uses one homepage.

The client-facing interface must not display Homepage A, B or C.

The homepage switcher must remain disabled.

The active client configuration must remain:

    homepage: {
      defaultVariant: "A",
      availableVariants: ["A"],
      showVariantSwitcher: false,
    }

Variant `A` remains an internal compatibility value only. It must not appear as a visible homepage label.

## 4. Design interpretation

D11 must translate the approved screenshot into reusable and responsive React components.

The implementation should preserve:

- overall visual hierarchy;
- hero composition;
- primary and secondary action placement;
- section order;
- card structure;
- typography hierarchy;
- spacing rhythm;
- visual balance.

Reference-specific placeholder text must be replaced with configured FAIDIA demonstration content.

The screenshot must not be displayed as the final homepage itself.

## 5. Existing platform boundaries

The homepage must continue using:

- D6 client configuration;
- D7 shared Demo Engine state;
- D8 role, request, presentation and reset controls;
- D9 public-facing shell;
- the existing `/demo` route namespace.

The homepage must not duplicate the applicant journey.

## 6. Required journey access

The homepage must provide clear access to:

1. Service information.
2. Applicant sign-up.
3. Application form.
4. Request tracking.
5. Staff workspace.

The public applicant journey remains the homepage priority.

## 7. Responsive requirement

The D11 implementation must support:

- desktop;
- laptop;
- tablet;
- mobile.

The screenshot defines the visual direction but does not remove the responsive-design requirement.

## 8. Restrictions

D10 does not implement:

- the final homepage;
- homepage switching;
- additional homepage references;
- a second homepage;
- a third homepage;
- real authentication;
- real document uploads;
- production Supabase reads;
- production Supabase writes.

## 9. D10 definition of done

D10 is complete when:

- one primary homepage screenshot exists;
- the screenshot is stored at `public/demo/references/homepage/primary-homepage-reference.png`;
- the screenshot is a valid PNG;
- the screenshot is registered through typed configuration;
- the screenshot appears on `/demo`;
- the reference is marked approved;
- implementation principles are documented;
- homepage switching remains disabled;
- only one homepage is configured;
- the existing public journey remains intact;
- no final homepage is implemented;
- no production Supabase dependency is added;
- type checking passes;
- linting passes;
- the production build passes;
- D10 verification passes;
- D10 is committed separately.
