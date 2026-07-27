# FAIDIA Demo Engine Boundary

## Status

- Stage: D30-1
- Branch: `feat/demo-engine-base`
- Current active vertical: TVET
- Current active organization: Savannah Technical College
- Boundary status: Defined
- Refactoring status: Not started

## Purpose

This document defines the architectural boundary between the reusable FAIDIA
Demo Engine and organization-specific Demo Packs.

The Demo Engine supplies reusable platform behaviour.

Demo Packs supply organization identity, branding, terminology, services,
departments, users, workflow definitions, seeded requests, reports and SLA data.

The intended architecture is:

```text
FAIDIA Demo Engine
├── TVET Demo Pack
├── Supermarket Demo Pack
├── County Government Demo Pack
├── Hospital Demo Pack
└── Future Demo Packs
```

The application must remain one repository and one reusable engine.

A new industry demonstration shoulPack, not a
copied application or rebuilt role workspace.

---

# 1. Core boundary rule

Reusable behaviour belongs to the Demo Engine.

Organization-specific identity, wording, configuration and seeded data belong
to a Demo Pack.

The engine may consume generic configuration interfaces.

The engine must not directly depend on the TVET pack or any other named
vertical pack.

---

# 2. Demo Engine responsibilities

## 2.1 Routing and application structure

The Demo Engine owns:

- public Demo routes;
- Applicant or requester routes;
- Officer or processor routes;
- Supervisor routes;
- Admin routes;
- role switching;
- role landing-page mechanics;
- shared layouts;
- shared sidebars;
- shared top bars;
- active navigation states;
- responsive navigation;
- presentation mode;
- reset controls;
- loading behaviour;
- error behaviour;
- not-found behaviour.

The routing system must not assume the organization is a college.

---

## 2.2 Role mechanics

The Demo Engine owns the reusable role categories:

- Applicant or requester;
- Officer or processor;
- Supervisor;
- Admin.

The engine owns:

- role selection;
- role access rules;
- role-specific navigation;
- role-specific landing routes;
- role-specific report visibility;
- shell selection;
- role-state reset.

A Demo Pack may supply visible role labels.

Examples:

| Engine role | TVET label | Supermarket label |
|---|---|---|
| Applicant | Applicant | Customer or Supplier |
| Officer | Records Officer | Procurement Officer |
| Supervisor | Registrar Supervisor | Store Manager |
| Admin | Institution Admin | System Admin |

The mechanics remain engine-owned even when labels change.

---

## 2.3 Request lifecycle

The Demo Engine owns:

- request creation;
- request IDs as a generic concept;
- request status;
- request progression;
- request assignment;
- task queues;
- case workspaces;
- comments;
- Demo attachments;
- status tracking;
- completion;
- outcomes;
- browser-state persistence;
- reset behaviour.

The engine must not assume:

- every requester is a student;
- every request concerns a transcript;
- every approver is a registrar;
- every outcome is an academic document;
- every organization has a Finance Office.

Those values belong to the active Demo Pack.

---

## 2.4 Workflow mechanics

The Demo Engine owns:

- workflow execution;
- workflow-step rendering;
- start nodes;
- submission nodes;
- review nodes;
- verification nodes;
- task nodes;
- handoff nodes;
- approval nodes;
- decision nodes;
- automated-task nodes;
- notification nodes;
- output nodes;
- end nodes;
- drag-and-drop behaviour;
- step reordering;
- step selection;
- workflow preview;
- Demo save-draft behaviour;
- Demo publish behaviour;
- version-history presentation;
- escalation handling;
- transition handling;
- validation mechanics.

The engine understands step types, transitions, assignments and rules.

It must not understand business-specific concepts such as:

- transcript;
- supplier registration;
- medical report;
- permit;
- refund;
- student clearance.

Those concepts are workflow content supplied by a Demo Pack.

---

## 2.5 Handoffs and referrals

The Demo Engine owns:

- internal department selection;
- internal officer selection;
- case referral;
- case reassignment;
- sharing to an email address;
- sharing to a phone number;
- referral messages;
- referral status;
- referral audit events;
- secure-link demonstration behaviour.

The Demo Pack supplies:

- department names;
- officer names;
- contact examples;
- referral examples;
- seeded referral history.

---

## 2.6 SLA mechanics

The Demo Engine owns:

- SLA state calculation;
- on-track status;
- at-risk status;
- overdue status;
- countdown presentation;
- Officer personal SLA views;
- Supervisor department SLA views;
- Admin institution SLA views;
- SLA charts;
- SLA tables;
- workload visualisation;
- escalation visualisation.

The Demo Pack supplies:

- target durations;
- service-specific SLA rules;
- department targets;
- compliance figures;
- overdue examples;
- workload datasets;
- SLA chart datasets.

---

## 2.7 Audit mechanics

The Demo Engine owns:

- audit-event structure;
- event order;
- timestamp presentation;
- actor presentation;
- action presentation;
- workflow history;
- referral history;
- approval history;
- completion history;
- audit filtering.

The Demo Pack supplies:

- actor names;
- department names;
- service names;
- seeded audit events;
- organization-specific event descriptions.

---

## 2.8 Reports

The Demo Engine owns:

- report page layouts;
- chart components;
- filters;
- date selectors;
- department selectors;
- metric cards;
- chart tooltips;
- insight presentation;
- chart takeaways;
- responsive report behaviour;
- role-based report visibility.

The Demo Pack supplies:

- metric names;
- report titles;
- chart datasets;
- target values;
- seeded insight text;
- department comparisons;
- trends;
- organization totals.

---

## 2.9 Notifications

The Demo Engine owns:

- notification presentation;
- unread states;
- notification preferences UI;
- simulated email actions;
- simulated SMS actions;
- in-app notification actions;
- notification audit events.

The Demo Pack supplies:

- notification templates;
- organization sender identity;
- recipient examples;
- seeded notification history.

The frozen Demo must not contact real recipients.

---

## 2.10 Shared visual system

The Demo Engine owns:

- shared spacing;
- common typography rules;
- buttons;
- inputs;
- cards;
- tables;
- badges;
- charts;
- shells;
- accessibility rules;
- focus states;
- contrast requirements;
- responsive breakpoints.

A Demo Pack may supply:

- organization logo;
- primary accent;
- secondary accent;
- homepage imagery;
- homepage copy;
- institution name;
- organization-specific visual assets;
- a supported homepage font selection.

A Demo Pack must not replace shared workspace mechanics.

---

# 3. Demo Pack responsibilities

## 3.1 Pack manifest

Every Demo Pack must identify:

- pack ID;
- pack name;
- pack version;
- organization type;
- compatible Demo Engine version;
- default route;
- default role;
- default request;
- configuration imports;
- asset locations.

---

## 3.2 Organization identity

A Demo Pack owns:

- organization name;
- short name;
- initials;
- organization type;
- address;
- telephone number;
- email address;
- website;
- campus or branch information;
- public contact information.

Current TVET examples include:

- Savannah Technical College;
- Savannah;
- STC;
- Technical college.

---

## 3.3 Branding

A Demo Pack owns:

- logo;
- homepage artwork;
- homepage copy;
- organization tagline;
- supported accent colours;
- organization contact information;
- supported organization font settings.

The current TVET homepage uses Plus Jakarta Sans.

The current TVET homepage `h2` headings use:

```css
letter-spacing: -0.025em;
```

These remain TVET-pack decisions unless formally adopted as universal Demo
Engine design rules.

---

## 3.4 Departments

A Demo Pack owns its departments.

TVET examples include:

- Admissions;
- Student Records;
- Finance;
- Registrar;
- Academic Affairs;
- Career Services;
- Library;
- Department Office.

Supermarket examples may include:

- Procurement;
- Inventory;
- Receiving;
- Finance;
- Store Management;
- Customer Service.

The Demo Engine receives department configuration but does not hard-code the
department catalogue.

---

## 3.5 Users and staff

A Demo Pack owns:

- requester accounts;
- Officer names;
- Supervisor names;
- Admin names;
- avatars;
- department assignments;
- visible role labels;
- Demo email addresses;
- Demo telephone numbers;
- seeded workload values.

The Demo Engine owns user and role mechanics.

---

## 3.6 Services

A Demo Pack owns:

- service IDs;
- service names;
- descriptions;
- eligibility information;
- required form fields;
- required documents;
- expected outputs;
- Demo fees;
- service instructions;
- workflow references;
- SLA references.

Current TVET services include:

- Transcript Request;
- Student Clearance;
- Certificate Replacement;
- Industrial Attachment Letter;
- Course Application;
- Class Registration.

---

## 3.7 Workflow definitions

A Demo Pack owns:

- workflow names;
- workflow-step labels;
- workflow sequence;
- assigned department IDs;
- assigned role IDs;
- transition rules;
- approval rules;
- decision labels;
- SLA references;
- completion-output labels;
- template categories;
- template usage counts.

Example TVET workflow:

```text
Transcript Request
Submission
→ Document Check
→ Payment Check
→ Records Review
→ Registrar Approval
→ Transcript Issued
```

The Demo Engine renders and processes the supplied definition.

---

## 3.8 Seeded requests

A Demo Pack owns:

- request IDs;
- requester names;
- selected services;
- request statuses;
- assigned staff;
- submitted values;
- attachments;
- payment statuses;
- comments;
- audit events;
- approvals;
- referrals;
- outcomes;
- completed examples;
- overdue examples;
- at-risk examples.

All Demo data must be fictional, sanitized or explicitly approved.

---

## 3.9 Reports and SLA data

A Demo Pack owns:

- dashboard figures;
- service volumes;
- complet
- response times;
- workload values;
- SLA compliance;
- overdue counts;
- department comparisons;
- chart series;
- chart categories;
- seeded insights.

The components that render those values remain engine-owned.

---

# 4. Allowed dependency direction

Allowed:

```text
app/demo
→ Demo Engine components
→ Demo Pack provider
→ Active Demo Pack
```

Allowed:

```text
Reusable Demo component
→ Generic Demo Pack type
```

Allowed:

```text
Reusable Demo component
← Configuration supplied by props or context
```

Not allowed:

```text
Reusable Demo Engine component
→ demo-packs/tvet
```

Not allowed:

```text
Officer shell
→ Savannah-specific fixture
```

Not allowed:

```text
Workflow-builder mechanics
→ Transcript Request fixture
```

Not allowed:

```text
Shared reports component
→ Student Records dataset
```

The active pack may be imported by one configuration entry point.

Shared components must receive its values through a provider, generic selector,
props or another neutral configur---

# 5. Boundary decision test

Use the following questions whenever ownership is unclear.

## Question 1

Would this code or behaviour still be required in a supermarket Demo?

- Yes: probably Demo Engine.
- No: probably Demo Pack.

## Question 2

Would only the visible wording, name, number or image change?

- Yes: Demo Pack.
- No: continue evaluating.

## Question 3

Does it implement reusable behaviour?

Examples:

- routing;
- dragging;
- approval;
- referral;
- chart rendering;
- request progression;
- form validation.

If yes, it belongs to the Demo Engine.

## Question 4

Does it describe an organization?

Examples:

- Savannah Technical College;
- Registrar Office;
- Transcript Request;
- Student Records;
- course information;
- seeded request numbers.

If yes, it belongs to the Demo Pack.

## Question 5

Could another vertical supply the value through configuration?

If yes, it should not remain hard-coded in the Demo Engine.

## Question 6

Is it a shared design rule or organization branding?

Shared component accessibility, layout mechanics and interaction behaviour
belong to the Demo Engine.

Logos, homepage content and organization colours belong to a Demo Pack.

---

# 6. Current classification examples

| Current concept | Owner | Reason |
|---|---|---|
| Role-selector mechanics | Demo Engine | Every Demo requires role switching |
| Role landing routes | Demo Engine configuration | Shared workspace structure |
| Savannah Technical College | TVET Demo Pack | Organization identity |
| Transcript Request | TVET Demo Pack | Vertical-specific service |
| Request-tracking component | Demo Engine | Reusable behaviour |
| Officer case workspace | Demo Engine | Reusable processor workspace |
| Registrar Approval | TVET Demo Pack | TVET-specific workflow label |
| Approval node type | Demo Engine | Universal workflow mechanic |
| Workflow drag and drop | Demo Engine | Universal Admin interaction |
| Student Records | TVET Demo Pack | Organization department |
| Department handoff mechanic | Demo Engine | Universal behaviour |
| SLA chart component | Demo Engine | Reusable presentation |
| Seeded SLA percentages | TVET Demo Pack | Organization-specific data |
| Reports grid | Demo Engine | Reusable reporting structure |
| Report datasets | TVET Demo Pack | Organization-specific data |
| TVET homepage content | TVET Demo Pack | Organization presentation |
| Shared focus states | Demo Engine | Universal accessibility requirement |

---

# 7. Temporary boundary exceptions

Some TVET-specific values currently remain inside reusable or semi-reusable
files.

During D30-1 these values are documented but not moved.

Every exception must record:

- file path;
- hard-coded content;
- intended destination;
- priority;
- current status.

The register is stored at:

```text
docs/demo-engine-base/d30-freeze/DEMO-BOUNDARY-EXCEPTIONS.md
```

No new undocumented exception should be introduced after D30-1.

---

# 8. Post-boundary governance rules

After D30-1:

1. New vertical-specific content must enter through a Demo Pack.
2. A new vertical must not copy shared pages.
3. A Demo Pack must not replace shared role shells.
4. A Demo Pack must not replace workflow execution mechanics.
5. A Demo Pack may define workflow content.
6. A Demo Pack may provide branding through supported tokens and assets.
7. Shared components must not import a named vertical pack.
8. Changes benefiting every vertical are Demo Engine changes.
9. Changes affecting one organization are Demo Pack changes.
10. Pack loading and validation must occur before a presentation.

---

# 9. D30-1 completion criteria

D30-1 is complete when:

- this boundary document exists;
- the current Demo route inventory exists;
- the current Demo component inventory exists;
- likely TVET references have been inventoried;
- Demo Engine responsibilities are defined;
- Demo Pack responsibilities are defined;
- dependency-direction rules are defined;
- the boundary decision test is defined;
- current known exceptions are recorded;
- no major source refactor has started;
- the D30-1 verifier passes;
- the documentation is committed separately.
