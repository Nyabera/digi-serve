# D30-10A Public Certificate Verification

## Route

`/demo/verify-certificate`

## Public states

- VALID
- REVOKED
- EXPIRED
- REPLACED
- NOT FOUND

## Public fields

The page may show the institution, issuing office, qualification type, masked
holder name, certificate reference, issuance date, current status, replacement
reference and latest verification timestamp.

## Privacy boundary

The public verification model excludes identity numbers, contact details,
grades, uploaded documents, internal notes and complete certificate files.

## QR behaviour

The frozen Demo simulates a QR scan by loading the configured default TVET
verification code. It does not require a device camera or external QR service.
