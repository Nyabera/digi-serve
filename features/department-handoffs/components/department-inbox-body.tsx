"use client";

import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Clock3,
  FileText,
  Inbox,
  MessageSquareText,
  RefreshCcw,
  Search,
  Send,
  UserRound,
  XCircle,
} from "lucide-react";
import type { FormEventHandler } from "react";

import type {
  DepartmentHandoffRowModel,
  DepartmentInboxModel,
} from "@/features/department-handoffs/model/department-handoff-model";

import styles from "./department-handoff-workspace.module.css";

type ActionMode = "RETURN" | "DECLINE" | null;

type Props = {
  readonly model: DepartmentInboxModel;
  readonly visibleRows: readonly DepartmentHandoffRowModel[];
  readonly selectedHandoff: DepartmentHandoffRowModel;
  readonly query: string;
  readonly statusFilter: string;
  readonly sortBy: string;
  readonly actionMode: ActionMode;
  readonly actionReason: string;
  readonly feedbackMessage: string | null;
  readonly errorMessage: string | null;
  readonly onQueryChange: (value: string) => void;
  readonly onStatusFilterChange: (value: string) => void;
  readonly onSortByChange: (value: string) => void;
  readonly onSelectHandoff: (handoffId: string) => void;
  readonly onAccept: () => void;
  readonly onActionModeChange: (mode: ActionMode) => void;
  readonly onActionReasonChange: (value: string) => void;
  readonly onSubmitSecondaryAction: FormEventHandler<HTMLFormElement>;
};

const metricIcons = {
  inbox: Inbox,
  progress: Clock3,
  clarification: MessageSquareText,
  calendar: CalendarDays,
} as const;

function StatusBadge({ handoff }: { readonly handoff: DepartmentHandoffRowModel }) {
  return (
    <span className={styles.statusBadge} data-tone={handoff.statusTone}>
      {handoff.statusLabel}
    </span>
  );
}

export function DepartmentInboxBody(props: Props) {
  const {
    model,
    visibleRows,
    selectedHandoff,
    query,
    statusFilter,
    sortBy,
    actionMode,
    actionReason,
    feedbackMessage,
    errorMessage,
  } = props;

  const canAccept = selectedHandoff.status === "PENDING_ACCEPTANCE";
  const canReturnOrDecline =
    selectedHandoff.status === "PENDING_ACCEPTANCE" ||
    selectedHandoff.status === "IN_PROGRESS";

  return (
    <main className={styles.workspace} data-d29r5-department-inbox="true">
      <header className={styles.pageIntro}>
        <div>
          <h1>Handoff Inbox</h1>
          <p>Review and act on handoffs from other departments.</p>
        </div>
        <div className={styles.pageActions}>
          <Link href="/demo/reports" className="button-base button-compact button-secondary">
            Route insights
          </Link>
        </div>
      </header>

      {feedbackMessage ? (
        <div role="status" className={styles.feedbackBanner}>
          <CheckCircle2 aria-hidden="true" />
          <span>{feedbackMessage}</span>
        </div>
      ) : null}

      {errorMessage ? (
        <div role="alert" className={styles.errorBanner}>
          <CircleAlert aria-hidden="true" />
          <span>{errorMessage}</span>
        </div>
      ) : null}

      <section className={styles.metricGrid} aria-label="Finance handoff metrics">
        {model.metrics.map((metric) => {
          const Icon = metricIcons[metric.icon];
          const filter =
            metric.id === "pending"
              ? "PENDING_ACCEPTANCE"
              : metric.id === "progress"
                ? "IN_PROGRESS"
                : metric.id === "returned"
                  ? "RETURNED_FOR_CLARIFICATION"
                  : "DUE_TODAY";

          return (
            <article key={metric.id} className={styles.metricCard} data-tone={metric.tone}>
              <span className={styles.metricIcon} aria-hidden="true">
                <Icon />
              </span>
              <div className={styles.metricCopy}>
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
              </div>
              <button
                type="button"
                className={`${styles.actionLink} ${styles.metricAction}`}
                onClick={() => props.onStatusFilterChange(filter)}
              >
                {metric.actionLabel}
                <ArrowRight aria-hidden="true" />
              </button>
            </article>
          );
        })}
      </section>

      <div className={styles.inboxGrid}>
        <section className={styles.panel}>
          <header className={styles.panelHeader}>
            <div>
              <h2>Incoming handoffs</h2>
              <p>Work assigned to the Finance department.</p>
            </div>
          </header>

          <div className={styles.filterBar} role="search" aria-label="Filter handoff inbox">
            <label className={styles.searchField}>
              <span className="sr-only">Search handoffs</span>
              <Search aria-hidden="true" />
              <input
                type="search"
                value={query}
                placeholder="Search handoffs"
                onChange={(event) => props.onQueryChange(event.target.value)}
              />
            </label>
            <label>
              <span className="sr-only">Filter by status</span>
              <select value={statusFilter} onChange={(event) => props.onStatusFilterChange(event.target.value)}>
                <option value="ALL">All statuses</option>
                <option value="PENDING_ACCEPTANCE">Pending acceptance</option>
                <option value="IN_PROGRESS">In progress</option>
                <option value="RETURNED_FOR_CLARIFICATION">Returned</option>
                <option value="DUE_TODAY">Due today</option>
              </select>
            </label>
            <label>
              <span className="sr-only">Sort handoffs</span>
              <select value={sortBy} onChange={(event) => props.onSortByChange(event.target.value)}>
                <option value="DUE">Sort: Due date</option>
                <option value="STATUS">Sort: Status</option>
                <option value="DEPARTMENT">Sort: From department</option>
              </select>
            </label>
          </div>

          <div className={styles.tableViewport}>
            <table className={styles.handoffTable} aria-label="Finance handoff inbox">
              <thead>
                <tr>
                  <th style={{ width: "19%" }}>From Department</th>
                  <th style={{ width: "19%" }}>Request</th>
                  <th style={{ width: "23%" }}>Requested Action</th>
                  <th style={{ width: "15%" }}>Status</th>
                  <th style={{ width: "12%" }}>Due Date</th>
                  <th style={{ width: "9%" }}>Assigned</th>
                  <th style={{ width: "3%" }}><span className="sr-only">Select</span></th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((handoff) => (
                  <tr key={handoff.id} data-selected={selectedHandoff.id === handoff.id ? "true" : undefined}>
                    <td><span className={styles.stackCell}><strong>{handoff.fromDepartment}</strong><span>{handoff.fromOfficer}</span></span></td>
                    <td><span className={styles.stackCell}><strong>{handoff.requestTitle}</strong><span className="text-reference">{handoff.requestId}</span></span></td>
                    <td><span className={styles.stackCell}><strong>{handoff.requestedAction}</strong><span>{handoff.applicantName}</span></span></td>
                    <td><StatusBadge handoff={handoff} /></td>
                    <td><span className={styles.stackCell}><strong>{handoff.dueDateLabel}</strong><span className={styles.dueBadge}>{handoff.dueStateLabel}</span></span></td>
                    <td><span className={styles.assignee}><span className={styles.assigneeAvatar} aria-hidden="true">{handoff.assignedOfficerInitials}</span><span className="sr-only">{handoff.assignedOfficer}</span></span></td>
                    <td>
                      <button type="button" className={styles.rowAction} aria-label={`Select ${handoff.requestTitle}`} onClick={() => props.onSelectHandoff(handoff.id)}>
                        <ChevronRight aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <footer className={styles.tableFooter}>
            <span>Showing {visibleRows.length} of {model.rows.length} handoffs</span>
            <span>Page 1 of 1</span>
          </footer>
        </section>

        <aside className={styles.rightStack}>
          <section className={`${styles.panel} ${styles.detailPanel}`}>
            <header className={styles.panelHeader}>
              <div>
                <h2>Handoff Details</h2>
                <p className="text-reference">{selectedHandoff.id} · {selectedHandoff.requestId}</p>
              </div>
              <StatusBadge handoff={selectedHandoff} />
            </header>

            <div className={styles.detailBody}>
              <dl className={styles.detailMeta}>
                <div><dt><Building2 aria-hidden="true" />From Department</dt><dd><strong>{selectedHandoff.fromDepartment}</strong><br />{selectedHandoff.fromOfficer}</dd></div>
                <div><dt><FileText aria-hidden="true" />Request</dt><dd><strong>{selectedHandoff.requestTitle}</strong><br /><span className="text-reference">{selectedHandoff.requestId}</span></dd></div>
                <div><dt><Send aria-hidden="true" />Requested Action</dt><dd>{selectedHandoff.requestedAction}</dd></div>
                <div><dt><MessageSquareText aria-hidden="true" />Reason</dt><dd>{selectedHandoff.reason}</dd></div>
                <div><dt><CheckCircle2 aria-hidden="true" />Expected Output</dt><dd>{selectedHandoff.expectedOutput}</dd></div>
                <div><dt><UserRound aria-hidden="true" />Assigned Officer</dt><dd>{selectedHandoff.assignedOfficer}</dd></div>
              </dl>

              {selectedHandoff.documents.length ? (
                <ul className={styles.documentList}>
                  {selectedHandoff.documents.map((document) => (
                    <li key={document.id}>
                      <div className={styles.documentLink}>
                        <span><FileText aria-hidden="true" /><span><strong>{document.name}</strong><small>{document.summary}</small></span></span>
                        <span className={styles.actionLink}>View</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : null}

              <Link href={selectedHandoff.href} className={styles.actionLink}>
                Open processing workspace <ArrowRight aria-hidden="true" />
              </Link>
            </div>

            {actionMode ? (
              <form onSubmit={props.onSubmitSecondaryAction} className={styles.actionForm}>
                <label>
                  {actionMode === "RETURN" ? "Clarification required" : "Decline reason"}
                  <textarea required value={actionReason} onChange={(event) => props.onActionReasonChange(event.target.value)} />
                </label>
                <div className={styles.pageActions}>
                  <button type="button" onClick={() => props.onActionModeChange(null)} className={styles.compactButton}>Cancel</button>
                  <button type="submit" className={actionMode === "RETURN" ? styles.warningButton : styles.dangerButton}>Confirm {actionMode === "RETURN" ? "return" : "decline"}</button>
                </div>
              </form>
            ) : null}

            <footer className={styles.detailActions}>
              <button type="button" onClick={props.onAccept} disabled={!canAccept} className={styles.primaryButton}><CheckCircle2 aria-hidden="true" />Accept</button>
              <button type="button" onClick={() => props.onActionModeChange("RETURN")} disabled={!canReturnOrDecline} className={styles.secondaryButton}><RefreshCcw aria-hidden="true" />Return for Clarification</button>
              <button type="button" onClick={() => props.onActionModeChange("DECLINE")} disabled={!canReturnOrDecline} className={styles.dangerButton}><XCircle aria-hidden="true" />Decline</button>
            </footer>
          </section>

          <section className={styles.panel}>
            <header className={styles.panelHeader}>
              <h3>Recent Completed Handoffs</h3>
              <Link href="/demo/reports" className={styles.actionLink}>View all <ArrowRight aria-hidden="true" /></Link>
            </header>
            <ul className={styles.completedList}>
              {model.completed.map((item) => (
                <li key={item.id}>
                  <Link href={item.href} className={styles.completedRow}>
                    <CheckCircle2 aria-hidden="true" />
                    <span><strong>{item.departmentName}</strong><span>{item.requestTitle}</span></span>
                    <time>{item.completedLabel}</time>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </main>
  );
}
