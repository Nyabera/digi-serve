# D29R-18 — Role-aware Demo workspaces

The Demo Engine changes navigation, landing page and reporting scope when the
presenter selects Applicant, Officer, Supervisor or Admin.

- Applicant opens request progress and receives no Reports access.
- Officer opens the operational queue and receives no Reports navigation.
- Supervisor receives Department reports locked to Student Records.
- Admin receives institution-wide reports and all configured departments.

The role is stored in browser session storage. Reports redirect Applicant and
Officer users to their own role landing page. No Supabase, network request or
production authorization system is introduced.
