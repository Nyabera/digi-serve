# FAIDIA Demo Engine Document Selection

## Document status

- Stage: D18
- Status: Active
- Route: `/demo/apply/[serviceSlug]?step=documents`
- Storage mode: Browser-session metadata only
- Production Supabase access: Prohibited

## 1. Purpose

D18 adds simulated document selection and replacement to the applicant request journey.

The stage validates the configured document requirements without uploading real file contents.

D18 is a controlled Demo Engine implementation, not production document storage.

## 2. Journey continuity

After D17 validates the configured application form, the journey continues to:

`/demo/apply/[serviceSlug]?step=documents`

After the configured required documents are satisfied, D18 continues to the existing request confirmation route for the later review-and-submission stage.

The route inventory remains unchanged because the document step uses the existing application route with a query parameter.

## 3. Configuration-driven requirements

D18 renders `service.requiredDocuments`.

Each requirement controls:

- requirement name;
- description;
- required, conditional or optional level;
- accepted MIME types;
- maximum file size;
- whether replacement is allowed.

No service-specific document rules are scattered through the route.

## 4. Validation

The browser validates:

- that the chosen MIME type is listed in `acceptedFileTypes`;
- that the file does not exceed `maximumSizeMb`;
- that every `REQUIRED` document has been selected before review;
- that replacement is permitted before an existing selection is changed.

This is applicant-side demonstration validation only.

## 5. Shared-state representation

D18 stores document metadata using the D7 typed `SET_FORM_VALUE` action.

Document values use reserved draft keys:

`__document:[documentRequirementId]`

The stored JSON contains:

- requirement ID;
- filename;
- MIME type;
- file size;
- browser last-modified timestamp;
- selection timestamp.

The selected file bytes are not placed in shared state or session storage.

## 6. Replacement and removal

When `replacementAllowed` is true, the applicant may:

- select a document;
- replace the selection;
- remove the selection before review.

When `replacementAllowed` is false, a selected document is locked for the remainder of the current demo-state session.

Resetting the Demo Engine clears the synthetic document metadata.

## 7. Security boundary

D18 does not:

- upload to Supabase Storage;
- create production document metadata;
- create signed URLs;
- persist file bytes;
- inspect file contents;
- scan files;
- perform OCR;
- expose public file URLs;
- associate a production document with a production request.

Only non-sensitive sample files should be selected.

## 8. Existing system boundaries

D18 continues to use:

- D6 service and document configuration;
- D7 shared browser state and typed actions;
- D8 demonstration controls and reset;
- D9 public-facing shell;
- D16 selected-service continuity;
- D17 configured form and draft values.

## 9. D18 definition of done

D18 is complete when:

- D17 continues to the document step;
- the application route can render the document step;
- all configured document requirements render;
- accepted MIME types are validated;
- maximum file sizes are validated;
- required documents block incomplete continuation;
- allowed documents can be replaced and removed;
- disallowed replacement is locked;
- metadata survives navigation and refresh within the browser session;
- no file content is persisted;
- no Supabase dependency is added;
- the 14-route inventory remains intact;
- type checking passes;
- linting passes;
- the production build passes;
- D18 verification passes;
- D18 is committed separately.
