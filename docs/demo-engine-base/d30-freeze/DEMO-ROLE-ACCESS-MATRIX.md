# Demo Role Access Matrix

| Capability | Applicant | Officer | Supervisor | Admin |
|---|---:|---:|---:|---:|
| Submit requests | Yes | No | No | No |
| Track own request | Yes | Support view | Support view | Admin view |
| Process assigned cases | No | Yes | Yes | Yes |
| Internal referral | No | Yes | Yes | Yes |
| Email or phone sharing | No | Yes | Yes | Yes |
| Personal SLA | No | Yes | Yes | Yes |
| Department approvals | No | No | Yes | Yes |
| Department reports | No | No | Yes | Yes |
| Institution reports | No | No | No | Yes |
| Configure workflows | No | No | No | Yes |
| Publish a real workflow | No | No | No | No |

## Landing routes

| Role | Route |
|---|---|
| Applicant | `/demo/track` |
| Officer | `/demo/officer` |
| Supervisor | `/demo/supervisor` |
| Admin | `/demo/admin` |
