# D29R-19 — Control alignment correction

## Request selector

The shared topbar used a generic slot for the request selector. Long request
labels did not reserve enough right-side room for the browser-native chevron.
The correction adds a request-specific slot, aligns the label and select, adds
3rem of arrow space and applies safe ellipsis behavior.

## Tracking stage marker

The tracker stylesheet contained a broad `.stage span` selector. It had higher
specificity than `.stageMarker`, changing the numbered marker from grid to
block layout. The correction scopes that rule to the text column and restores
explicit centering for both numbers and checkmark icons.
