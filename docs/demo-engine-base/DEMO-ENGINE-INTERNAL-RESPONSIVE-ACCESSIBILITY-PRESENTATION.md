# FAIDIA Demo Engine Internal Responsive, Accessibility and Presentation Checks

## Document status

- Stage: D29R-8
- Scope: Redesigned internal Demo Engine routes
- Change type: Verification and manual quality gate
- Runtime UI changes: None
- Route inventory: Unchanged at 14 pages
- Production Supabase access: Prohibited

## Purpose

D29R-8 verifies that the redesigned Officer, Finance, Supervisor, Reports and Controlled Outcome workspaces remain usable across desktop, tablet, mobile, keyboard-only, screen-reader and presentation-mode conditions.

This stage does not redesign the pages again. Any defect discovered during D29R-8 should be fixed in the feature that owns it, then the full D29R-8 gate should be rerun.

## Covered routes

1. `/demo/officer`
2. `/demo/officer/requests/REQ-DEMO-001`
3. `/demo/department`
4. `/demo/department/handoffs/HND-DEMO-001`
5. `/demo/supervisor`
6. `/demo/supervisor/approvals/REQ-DEMO-001`
7. `/demo/reports`
8. `/demo/outcomes/REQ-DEMO-001`

The public applicant routes remain covered by the earlier D28 accessibility stage.

## Automated source checks

D29R-8 verifies:

- the shared internal shell is mounted by every redesigned internal workspace;
- the global skip link and `#demo-main-content` target remain available;
- presentation and reset controls remain available;
- keyboard presentation and reset shortcuts remain implemented;
- presentation mode retains fullscreen and CSS fallback behavior;
- reset remains demonstration-only and does not touch production data;
- internal tables have accessible names;
- search regions use `role="search"`;
- status and error feedback use live-region roles;
- screen-reader-only text remains available for icon-only controls;
- responsive CSS exists for every redesigned feature;
- reduced-motion, forced-colors and coarse-pointer support remain available;
- reports retain all required Recharts types and responsive containers;
- controlled outcome issuance remains available;
- page-route count remains 14;
- no singular `/demo/outcome` route exists;
- no Supabase or network dependency is introduced by D29R-8.

## Manual viewport matrix

Test each covered route at:

| Viewport | Purpose |
|---|---|
| 1672 × 941 | Primary visual reference |
| 1440 × 900 | Standard laptop |
| 1200 × 800 | Compressed desktop |
| 1024 × 768 | Small laptop / landscape tablet |
| 768 × 1024 | Portrait tablet |
| 390 × 844 | Modern mobile |
| 320 × 568 | Minimum supported mobile |
| 200% browser zoom | Reflow and low-vision check |

## Responsive acceptance criteria

At every viewport:

- the shared sidebar and topbar remain usable;
- no body content renders beneath the sidebar;
- no page-level horizontal scrollbar appears;
- dense tables scroll inside their own panel when necessary;
- sticky side panels become non-sticky before they can overlap content;
- KPI cards reduce columns progressively;
- form grids collapse to one column on mobile;
- action groups remain reachable and do not clip;
- long request, handoff and outcome identifiers wrap safely;
- Recharts remain inside their panels;
- chart labels and legends do not overlap controls;
- the controlled outcome document preview remains readable;
- touch targets remain at least 44px where coarse pointer rules apply.

## Keyboard acceptance criteria

Using only the keyboard:

1. Reload the page.
2. Press `Tab`.
3. Confirm `Skip to main content` becomes visible.
4. Activate it and confirm focus moves to `#demo-main-content`.
5. Continue tabbing through the shell and body.
6. Confirm focus remains visible.
7. Confirm all selects, filters, table actions and workflow buttons are reachable.
8. Confirm icon-only buttons have an accessible label.
9. Confirm no focus is trapped outside an open confirmation surface.
10. Confirm `Escape` closes presentation/reset overlays when appropriate.

## Presentation-mode acceptance criteria

For each internal route:

1. Press `Shift + P`.
2. Confirm browser fullscreen is requested when permitted.
3. Confirm the CSS presentation fallback activates when fullscreen is blocked.
4. Confirm the shell remains stable.
5. Confirm the body uses the available presentation width.
6. Confirm tables, charts and decision panels remain contained.
7. Press `Escape`.
8. Confirm the page returns to normal mode.
9. Confirm focus returns to the initiating control.

The presentation shortcut hint must not obscure a required action at any tested viewport.

## Reset acceptance criteria

1. Press `Shift + R`.
2. Confirm a reset confirmation appears.
3. Confirm keyboard focus is constrained to the confirmation surface.
4. Cancel and confirm state is unchanged.
5. Open the confirmation again.
6. Confirm reset.
7. Confirm only Demo Engine session state is cleared.
8. Confirm the route returns to `/demo`.
9. Confirm the interface states that production data and Supabase are not touched.

## Screen-reader acceptance criteria

Using macOS VoiceOver:

1. Start VoiceOver with `Command + F5`.
2. Navigate by landmarks.
3. Confirm the page exposes one main landmark.
4. Confirm the shared navigation and topbar controls have usable names.
5. Confirm each table announces its purpose.
6. Confirm form inputs announce their labels.
7. Confirm status messages are announced.
8. Confirm errors are announced immediately.
9. Confirm approval and outcome status is not communicated by color alone.
10. Confirm chart sections retain text headings and numeric summaries.

## Route-specific checks

### Officer dashboard

- six KPI cards;
- five-row queue;
- compact handoff feed;
- three-row applicant-message feed;
- SLA and workload summary;
- search region has an accessible name;
- table has an accessible name.

### Officer review and referral

- breadcrumbs;
- application details;
- internal notes;
- audit trail;
- referral form;
- correction workflow;
- visible required labels;
- no internal note leaks into applicant-visible copy.

### Finance inbox

- four handoff metrics;
- contained dense table;
- selected detail panel;
- Accept, Return and Decline;
- status feedback is announced.

### Finance processing

- parent ownership remains visible;
- CLEAR, HOLD and CANNOT VERIFY are keyboard operable;
- Finance note is labelled;
- completion and clarification feedback is announced.

### Supervisor dashboard

- six metrics;
- approval queue;
- officer workload;
- stage timing;
- attention items;
- internal table overflow remains contained.

### Registrar approval

- prerequisite state is text-labelled;
- Finance result is explicit;
- declaration checkbox is labelled;
- approval blocking is explained in text;
- rejection and clarification reasons are labelled;
- outcome route appears only after approval.

### Reports

- shared shell appears only once;
- all required chart types remain;
- charts use responsive containers;
- legends and tooltips remain readable;
- filter controls are labelled;
- no chart creates page-level overflow;
- print view removes nonessential controls.

### Controlled outcome

- decision state is explicit;
- delivery method is keyboard operable;
- issuance action is labelled;
- download or collection action is labelled;
- completion feedback is announced;
- exact document and audit data remain available.

## Defect handling

When a check fails:

1. Record the route, viewport and exact interaction.
2. Capture a screenshot.
3. Identify the owning feature.
4. Fix only that feature or shared infrastructure when genuinely required.
5. Do not weaken the D29R-8 verifier to permit a real defect.
6. Rerun:
   - D29R-8 verifier;
   - D29R-8 source audit;
   - TypeScript;
   - lint;
   - tests;
   - production build.

## Definition of done

D29R-8 is complete when:

- the automated verifier passes;
- the source accessibility audit passes;
- TypeScript passes;
- lint passes;
- tests pass;
- production build passes;
- `git diff --check` passes;
- all eight internal routes pass the viewport matrix;
- keyboard-only checks pass;
- VoiceOver checks pass;
- presentation checks pass;
- reset checks pass;
- no page-level horizontal overflow remains;
- visual approval is recorded before D30.
