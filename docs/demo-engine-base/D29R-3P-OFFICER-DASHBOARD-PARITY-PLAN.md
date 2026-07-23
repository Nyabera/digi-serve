# D29R-3P — Officer Dashboard Body Parity Plan

**Place in sequence:** After D29R-3, before D29R-4  
**Outcome:** Replace the current officer-dashboard body with the canonical compact operations layout while leaving the shell unchanged  
**Authority:** `D29R-INTERNAL-BODY-VISUAL-REFERENCE.md` and `D29R-INTERNAL-COMPONENT-ARCHITECTURE.md`

## 1. Why this patch stage is required

D29R-3 produced a functional officer dashboard, but the body does not match the frozen visual reference. Starting D29R-4 now would cause the request-detail page to inherit the wrong density, panel, table, badge, and spacing language.

D29R-3P fixes the shared body primitives first. D29R-4 can then reuse the corrected components instead of creating another visual dialect.

## 2. Protected and allowed files

### Protected

Do not edit:

- internal shell component;
- sidebar component;
- top-bar component;
- shell navigation definitions;
- shell persistence/localStorage logic;
- app layout files unless an import is strictly required and produces no visual shell change;
- demo role switcher and reset controls.

### Allowed

Edit or create:

- `app/globals.css` for body-scoped operational tokens only;
- `components/internal/**`;
- `features/officer-dashboard/**`;
- `features/demo-engine/fixtures/officer-dashboard.reference.ts`;
- `features/demo-engine/adapters/get-demo-officer-dashboard-model.ts`;
- `app/demo/officer/page.tsx` only to replace body assembly;
- tests and reference-screenshot configuration.

If the current repository uses slightly different folder names, preserve the same boundaries rather than forcing a rename during this patch.

## 3. Implementation sequence

### Step 1 — Freeze the baseline

1. Run the existing app and open `/demo/officer`.
2. Capture the current full page at `1672 × 941`.
3. Record the current shell dimensions.
4. Run existing lint, type-check, test, and demo verification commands.
5. Do not continue if the shell is already failing independently of this body patch.

### Step 2 — Remove body-only structural mismatches

From the officer body only:

1. Remove the `Officer workspace` eyebrow.
2. Remove body-level `View reports` and `Public portal` actions.
3. Replace the greeting and subtitle with the exact reference copy.
4. Remove descriptions from KPI cards.
5. Remove the search/filter/sort toolbar from the dashboard queue preview.
6. Remove current handoff status-card markup.
7. Keep existing route targets and click behaviours available for rewiring.

Do not delete reusable logic until the replacement body renders.

### Step 3 — Add scoped operational tokens

1. Add `.internal-dashboard-body` variables from the visual-reference document.
2. Do not modify existing shell-consumed variables.
3. Add an explicit wrapper class to the officer body.
4. Verify the sidebar and top bar are visually unchanged before continuing.

### Step 4 — Build or correct shared primitives

Implement in this order:

1. `ActionLink`
2. `PageIntro`
3. `SectionPanel` and `PanelHeader`
4. `MetricIcon`
5. `MetricCard`
6. `MetricGrid`
7. `StatusBadge` and `PriorityBadge`
8. `StackedCell` and `RowIcon`
9. `CompactActionButton`
10. `OperationsTable`
11. `TableFooter`
12. `ActivityRow` and `ActivityList`
13. `MessagePreviewRow` and `MessagePreviewList`
14. `WorkloadSnapshot`
15. `SlaDonut`

Each primitive must have a narrow API and an accessibility check before it is used in the assembled page.

### Step 5 — Create the view-model boundary

1. Add `OfficerDashboardModel`.
2. Create the icon-key registry.
3. Create the operational-tone registry.
4. Add `buildOfficerDashboardModel`.
5. Ensure the body does not import demo-store, database, or raw domain record types.

### Step 6 — Create the immutable reference fixture

Add the exact reference data:

- metric values `18, 7, 3, 24, 11, 12`;
- five queue rows;
- five handoff rows;
- three message rows;
- SLA `92 / 6 / 2`;
- workload `82 / 39 / 7 / 3`.

Keep the fixture deterministic. Do not generate random names, times, counts, or dates in the visual-parity mode.

### Step 7 — Build feature panels

Implement:

1. `QueuePreviewPanel`
2. `RecentHandoffsPanel`
3. `RecentMessagesPanel`
4. `SlaWorkloadPanel`

Use `SectionPanel` for each. Do not duplicate panel borders, headers, actions, or footers.

### Step 8 — Assemble `OfficerDashboardBody`

1. Add the compact `PageIntro`.
2. Render the six-column `MetricGrid`.
3. Render the `3fr 2fr` content grid.
4. Put queue and messages in the left stack.
5. Put handoffs and SLA/workload in the right stack.
6. Keep only the feature-level grid rules in the dashboard CSS module.

### Step 9 — Rewire interactions

At minimum:

- Assigned to Me → full queue.
- Due Today → queue with due-today state.
- Overdue → queue with overdue state.
- Waiting on Applicant → relevant queue.
- Waiting on Department → relevant queue/handoff view.
- Completed Today → report or completed view already present in the demo.
- Queue `Review`/`Verify` and chevron → existing request-detail route.
- Recent Handoffs → handoff inbox/view.
- Applicant messages → existing message view.
- Detailed report → existing report route or existing demo placeholder.

Do not invent new routes if an existing destination is already defined.

### Step 10 — Match desktop geometry

At `1672 × 941`, verify:

1. Body padding is approximately 40px left and 24px right.
2. Greeting is 24px, not display-sized.
3. Six metrics remain on one row.
4. Metric cards are approximately 116px tall.
5. Main grid is approximately `3fr 2fr`.
6. Queue has five visible compact rows.
7. Handoffs has five visible compact rows.
8. Messages has three visible rows.
9. SLA and workload appear side by side.
10. No body-level horizontal scrollbar exists.

### Step 11 — Add responsive rules

1. Change metrics to three columns before labels collide.
2. Collapse the main grid to one column at tablet width.
3. Use controlled table overflow on narrow screens.
4. Keep components and information hierarchy unchanged.
5. Do not redesign the mobile shell in this task.

### Step 12 — Accessibility verification

Verify:

- one `h1`;
- panel headings use `h2`;
- table has an accessible name;
- icon buttons have `aria-label`;
- all search areas elsewhere still use `role="search"`;
- focus styles remain visible;
- chart values are represented as text;
- no nested interactive elements;
- no click-only `div`s.

### Step 13 — Functional verification

Run:

1. formatting;
2. lint;
3. type-check;
4. component tests;
5. existing demo verification;
6. production build;
7. route-click smoke test.

Confirm no protected shell file changed.

### Step 14 — Visual verification

1. Capture a new full-shell screenshot at `1672 × 941`.
2. Overlay it at 50% opacity with `01-officer-dashboard.png`.
3. Compare:
   - page intro;
   - KPI bounds;
   - main-column split;
   - panel bounds;
   - row heights;
   - title/action alignment;
   - chart and workload bounds.
4. Fix structural drift before colour micro-adjustments.
5. Fix typography and colour after the geometry is stable.
6. Repeat until the remaining difference is normal font/image rendering, not layout.

## 4. Acceptance matrix

| ID | Requirement | Pass condition |
| --- | --- | --- |
| D29R-3P-01 | Body-only scope | No shell visual or behavioural change |
| D29R-3P-02 | Exact introduction | Reference title and subtitle; no eyebrow/actions |
| D29R-3P-03 | Metric parity | Six compact semantic cards in correct order |
| D29R-3P-04 | Queue parity | Five rows, correct columns, no dashboard filter bar |
| D29R-3P-05 | Handoff parity | Five directional activity rows |
| D29R-3P-06 | Message parity | Three compact message rows and read states |
| D29R-3P-07 | SLA parity | 92% donut, three legend values, workload snapshot |
| D29R-3P-08 | Token safety | Body-scoped tokens; no shell token changes |
| D29R-3P-09 | Reuse | Demo and future production use one component implementation |
| D29R-3P-10 | Routes | Existing click behaviour preserved |
| D29R-3P-11 | Accessibility | Headings, table name, focus, labels, and chart text pass |
| D29R-3P-12 | Verification | Lint, type-check, tests, verification, and build pass |
| D29R-3P-13 | Screenshot | Canonical overlay shows no structural drift |

## 5. Definition of done

D29R-3P is complete only when:

- the officer dashboard body is recognizably the same screen as the canonical reference;
- the shell is unchanged;
- the dashboard body is assembled from reusable components;
- demo data arrives through a view-model adapter;
- exact reference data is preserved in a deterministic fixture;
- the shared primitives are suitable for D29R-4 and later handoff/supervisor pages;
- the verification suite and production build pass;
- the changed-file check contains no unrelated documentation or shell changes.

## 6. Paste-ready implementation brief for Cursor

```text
Implement D29R-3P: Officer Dashboard Body Visual Parity.

Read these documents first and treat them as the source of truth:
1. D29R-INTERNAL-BODY-VISUAL-REFERENCE.md
2. D29R-INTERNAL-COMPONENT-ARCHITECTURE.md
3. D29R-3P-OFFICER-DASHBOARD-PARITY-PLAN.md

Scope:
- Change only the officer dashboard body and body-level shared components.
- Leave InternalAppShell, sidebar, top bar, shell navigation, localStorage shell state, demo reset, role switcher, and routes unchanged.
- Do not start D29R-4.

Required result:
- Mirror 01-officer-dashboard.png and the body crop Screenshot 2026-07-23 at 14.28.07(1).png.
- Use the exact greeting, six metric values, five queue rows, five handoff rows, three message rows, and SLA/workload values from the reference fixture.
- Remove the current eyebrow, body actions, KPI descriptions, dashboard queue filters, and old handoff cards.
- Use body-scoped operational tokens so no global shell colour changes.
- Build reusable internal primitives and an OfficerDashboardModel adapter boundary.
- Keep the body primarily server-rendered; isolate Recharts in the SlaDonut client leaf.
- Preserve every existing working interaction by rewiring it to the new components.

Verification:
- Format, lint, type-check, test, run the existing demo verification, and build.
- Capture the full page at 1672x941 and compare it with 01-officer-dashboard.png.
- Confirm no protected shell file changed.
- Stop and report exact failures; do not weaken tests or verification checks.
```

