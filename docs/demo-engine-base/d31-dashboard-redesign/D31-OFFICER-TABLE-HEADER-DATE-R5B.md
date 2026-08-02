# D31-6R5B — Officer table and dynamic header correction

## Corrected table defect

The previous integrated version displayed every body cell one column to the
right of its header. The cause was the `tr::before` accent strip becoming an
anonymous table box after the application shell altered table behavior.

D31-6R5B removes that pseudo-element and renders the coloured accent as an
inset edge on the first real table cell.

## Final table contract

- Service: 16.5%
- Applicant: 10.5%
- Request ID: 11.5%
- Next action: 20%
- Stage: 12%
- SLA: 11%
- Status: 9.5%
- Action: 9%

The Action column also restores the compact three-dot overflow control shown in
the approved reference.

## Header correction

- “Good afternoon, Grace” is eight pixels smaller.
- “Officer dashboard” is replaced by:
  `This is what your day looks like today`
- The date is generated at request time in the `Africa/Nairobi` timezone.
- The route uses `dynamic = "force-dynamic"` so the date is not frozen during
  the production build.
