"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileClock,
  Inbox,
  Maximize2,
  RefreshCw,
  Send,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";
import { useMemo, useState } from "react";

import {
  InternalAppShell,
  InternalPageHeader,
} from "@/components/demo/internal-shell";
import {
  DeadlineList,
  InternalDataTable,
  MessageList,
  MetricCard,
  PriorityPill,
  QueuePagination,
  StatusPill,
  TableToolbar,
  type InternalDataTableColumn,
} from "@/components/demo/internal-ui";
import { useDemoState } from "@/features/demo/state";
import {
  buildOfficerDashboardViewModel,
  type OfficerQueueRow,
} from "@/features/demo/view-models/officer-dashboard-view-model";

import styles from "./officer-dashboard.module.css";

type ServiceOption = {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
};

type DepartmentOption = {
  readonly id: string;
  readonly name: string;
};

type OfficerDashboardProps = {
  readonly organizationName: string;
  readonly services: readonly ServiceOption[];
  readonly departments: readonly DepartmentOption[];
};

const STATUS_FILTERS = [
  "All statuses",
  "Submitted",
  "Under review",
  "Waiting",
  "Completed",
] as const;

const SORT_OPTIONS = [
  "Priority",
  "Newest",
  "Due date",
  "Applicant",
] as const;

function triggerDemoShortcut(key: "p" | "r") {
  window.dispatchEvent(
    new KeyboardEvent("keydown", {
      key,
      shiftKey: true,
      bubbles: true,
    }),
  );
}

function queueMatchesStatus(
  row: OfficerQueueRow,
  statusFilter: string,
): boolean {
  if (statusFilter === "All statuses") return true;
  if (statusFilter === "Waiting") {
    return row.status.toLowerCase().includes("waiting");
  }
  return row.status
    .toLowerCase()
    .includes(statusFilter.toLowerCase());
}

function sortQueue(
  rows: readonly OfficerQueueRow[],
  sortBy: string,
): readonly OfficerQueueRow[] {
  const weight = {
    CRITICAL: 4,
    HIGH: 3,
    MEDIUM: 2,
    LOW: 1,
  } as const;

  return [...rows].sort((left, right) => {
    if (sortBy === "Applicant") {
      return left.applicantName.localeCompare(
        right.applicantName,
      );
    }
    if (sortBy === "Newest") {
      return right.id.localeCompare(left.id);
    }
    if (sortBy === "Due date") {
      return left.dueLabel.localeCompare(
        right.dueLabel,
      );
    }
    return weight[right.priority] - weight[left.priority];
  });
}

export function OfficerDashboard({
  organizationName,
  services,
  departments,
}: OfficerDashboardProps) {
  const router = useRouter();
  const { state, isHydrated } = useDemoState();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<(typeof STATUS_FILTERS)[number]>(
      "All statuses",
    );
  const [sortBy, setSortBy] =
    useState<(typeof SORT_OPTIONS)[number]>(
      "Priority",
    );
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const viewModel = useMemo(
    () =>
      buildOfficerDashboardViewModel({
        state,
        services,
        departments,
      }),
    [departments, services, state],
  );

  const filteredQueue = useMemo(() => {
    const normalizedQuery = query
      .trim()
      .toLowerCase();
    const rows = viewModel.queue.filter((row) => {
      const matchesQuery =
        !normalizedQuery ||
        [
          row.id,
          row.applicantName,
          row.serviceName,
          row.status,
          row.departmentName,
        ].some((value) =>
          value
            .toLowerCase()
            .includes(normalizedQuery),
        );

      return (
        matchesQuery &&
        queueMatchesStatus(row, statusFilter)
      );
    });

    return sortQueue(rows, sortBy);
  }, [query, sortBy, statusFilter, viewModel.queue]);

  const pageCount = Math.max(
    1,
    Math.ceil(filteredQueue.length / pageSize),
  );
  const currentPage = Math.min(page, pageCount);
  const visibleRows = filteredQueue.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const columns = useMemo<
    readonly InternalDataTableColumn<OfficerQueueRow>[]
  >(
    () => [
      {
        id: "request",
        header: "Request",
        render: (row) => (
          <div className={styles.requestCell}>
            <Link
              href={row.href}
              className="text-reference"
            >
              {row.id}
            </Link>
            <span>{row.applicantName}</span>
          </div>
        ),
      },
      {
        id: "service",
        header: "Service",
        render: (row) => (
          <div className={styles.serviceCell}>
            <strong>{row.serviceName}</strong>
            <span>{row.departmentName}</span>
          </div>
        ),
      },
      {
        id: "status",
        header: "Status",
        render: (row) => (
          <StatusPill tone={row.statusTone} showDot>
            {row.status}
          </StatusPill>
        ),
      },
      {
        id: "priority",
        header: "Priority",
        render: (row) => (
          <PriorityPill priority={row.priority} />
        ),
      },
      {
        id: "submitted",
        header: "Submitted",
        render: (row) => row.submittedLabel,
      },
      {
        id: "due",
        header: "SLA",
        render: (row) => (
          <div className={styles.dueCell}>
            <strong>{row.dueLabel}</strong>
            <span>Institutional target</span>
          </div>
        ),
      },
      {
        id: "action",
        header: "Action",
        align: "right",
        render: (row) => (
          <Link
            href={row.href}
            className={styles.tableAction}
          >
            Open
            <ArrowRight aria-hidden="true" />
          </Link>
        ),
      },
    ],
    [],
  );

  const metrics = viewModel.metrics;

  return (
    <div data-d29r3-officer-shell="true">
      <InternalAppShell
        role="OFFICER"
        institutionName={organizationName}
        institutionSubtitle="Student Services"
        institutionInitials="STC"
        staffName="Grace Wanjiku"
        staffRoleLabel="Student Records Officer"
        requestSelector={
          <label>
            <span className="sr-only">
              Open request
            </span>
            <select
              className={[
                "input-base",
                "input-compact",
                styles.topbarSelect,
              ].join(" ")}
              value=""
              onChange={(event) => {
                if (event.target.value) {
                  router.push(
                    `/demo/officer/requests/${event.target.value}`,
                  );
                }
              }}
            >
              <option value="">Open request</option>
              {viewModel.queue.map((row) => (
                <option key={row.id} value={row.id}>
                  {row.id}
                </option>
              ))}
            </select>
          </label>
        }
        roleSelector={
          <label>
            <span className="sr-only">
              Switch workspace
            </span>
            <select
              className={[
                "input-base",
                "input-compact",
                styles.topbarSelect,
              ].join(" ")}
              value="/demo/officer"
              onChange={(event) =>
                router.push(event.target.value)
              }
            >
              <option value="/demo/officer">
                Officer
              </option>
              <option value="/demo/department">
                Finance
              </option>
              <option value="/demo/supervisor">
                Supervisor
              </option>
            </select>
          </label>
        }
        presentationAction={
          <button
            type="button"
            data-internal-demo-action="true"
            onClick={() => triggerDemoShortcut("p")}
            className={[
              "button-base",
              "button-compact",
              "button-secondary",
              styles.topbarAction,
            ].join(" ")}
          >
            <Maximize2 aria-hidden="true" />
            Present
          </button>
        }
        resetAction={
          <button
            type="button"
            data-internal-demo-action="true"
            onClick={() => triggerDemoShortcut("r")}
            className={[
              "button-base",
              "button-compact",
              "button-destructive",
              styles.topbarAction,
            ].join(" ")}
          >
            <RefreshCw aria-hidden="true" />
            Reset
          </button>
        }
      >
        <div className={styles.dashboard}>
          <InternalPageHeader
            eyebrow="Officer workspace"
            title="Good morning, Grace"
            description="Review assigned requests, manage departmental coordination and protect service deadlines."
            actions={
              <>
                <Link
                  href="/demo/reports"
                  className="button-base button-compact button-secondary"
                >
                  View reports
                </Link>
                <Link
                  href="/demo"
                  className="button-base button-compact button-primary"
                >
                  Public portal
                  <ExternalLink aria-hidden="true" />
                </Link>
              </>
            }
          />

          <section
            className={styles.metricGrid}
            aria-label="Officer workload metrics"
          >
            <MetricCard label="Assigned to me" value={isHydrated ? metrics.assignedToMe : "—"} detail="Current active workload" icon={BriefcaseBusiness} tone="info" actionLabel="View queue" href="#application-queue" />
            <MetricCard label="Due today" value={isHydrated ? metrics.dueToday : "—"} detail="Requires action before close" icon={CalendarClock} tone="warning" />
            <MetricCard label="Overdue" value={isHydrated ? metrics.overdue : "—"} detail="Outside target window" icon={Clock3} tone="danger" />
            <MetricCard label="Waiting on applicant" value={isHydrated ? metrics.waitingOnApplicant : "—"} detail="Correction or document response" icon={UserRoundCheck} tone="warning" />
            <MetricCard label="Waiting on department" value={isHydrated ? metrics.waitingOnDepartment : "—"} detail="Active referral or handoff" icon={UsersRound} tone="info" />
            <MetricCard label="Completed today" value={isHydrated ? metrics.completedToday : "—"} detail="Controlled outcomes recorded" icon={CheckCircle2} tone="success" />
          </section>

          <section className={styles.dashboardGrid}>
            <div
              id="application-queue"
              className={styles.queuePanel}
            >
              <header className={styles.panelHeader}>
                <div className={styles.panelHeaderCopy}>
                  <h2 className="text-card-title">
                    My queue
                  </h2>
                  <p className="text-body-compact">
                    Assigned requests requiring review,
                    coordination or completion.
                  </p>
                </div>
                <Link
                  href="/demo/officer#application-queue"
                  className={styles.panelAction}
                >
                  View full queue
                  <ArrowRight aria-hidden="true" />
                </Link>
              </header>

              <TableToolbar
                searchLabel="Search officer queue"
                searchPlaceholder="Search request, applicant or service"
                searchValue={query}
                onSearchChange={(value) => {
                  setQuery(value);
                  setPage(1);
                }}
                filters={
                  <>
                    <label>
                      <span className="sr-only">
                        Filter by status
                      </span>
                      <select
                        value={statusFilter}
                        className="input-base input-compact"
                        onChange={(event) => {
                          setStatusFilter(
                            event.target.value as (typeof STATUS_FILTERS)[number],
                          );
                          setPage(1);
                        }}
                      >
                        {STATUS_FILTERS.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      <span className="sr-only">
                        Sort queue
                      </span>
                      <select
                        value={sortBy}
                        className="input-base input-compact"
                        onChange={(event) => {
                          setSortBy(
                            event.target.value as (typeof SORT_OPTIONS)[number],
                          );
                          setPage(1);
                        }}
                      >
                        {SORT_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            Sort: {option}
                          </option>
                        ))}
                      </select>
                    </label>
                  </>
                }
                resultSummary={`${filteredQueue.length} request${filteredQueue.length === 1 ? "" : "s"}`}
              />

              <div className={styles.desktopQueueTable}>
                <InternalDataTable
                  caption="Officer request queue"
                  columns={columns}
                  rows={visibleRows}
                  rowKey={(row) => row.id}
                  density="compact"
                />
              </div>

              <div className={styles.mobileQueueCards}>
                {visibleRows.map((row) => (
                  <article
                    key={row.id}
                    className={styles.mobileQueueCard}
                  >
                    <div className={styles.mobileQueueTopline}>
                      <Link href={row.href} className="text-reference">
                        {row.id}
                      </Link>
                      <PriorityPill priority={row.priority} />
                    </div>
                    <div>
                      <h3 className="text-card-title">
                        {row.applicantName}
                      </h3>
                      <p className="text-body-compact">
                        {row.serviceName}
                      </p>
                    </div>
                    <div className={styles.mobileQueueMeta}>
                      <StatusPill tone={row.statusTone} showDot>
                        {row.status}
                      </StatusPill>
                      <span>{row.dueLabel}</span>
                    </div>
                    <div className={styles.mobileQueueFooter}>
                      <span className="text-caption">
                        {row.departmentName}
                      </span>
                      <Link href={row.href} className={styles.tableAction}>
                        Open request
                        <ArrowRight aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>

              <QueuePagination
                page={currentPage}
                pageCount={pageCount}
                pageSize={pageSize}
                totalItems={filteredQueue.length}
                onPageChange={setPage}
                onPageSizeChange={(nextPageSize) => {
                  setPageSize(nextPageSize);
                  setPage(1);
                }}
              />
            </div>

            <aside className={styles.rightRail}>
              <section className={styles.handoffPanel}>
                <header className={styles.panelHeader}>
                  <div className={styles.panelHeaderCopy}>
                    <h2 className="text-card-title">
                      Recent handoffs
                    </h2>
                    <p className="text-body-compact">
                      Cross-department work linked to your requests.
                    </p>
                  </div>
                  <Link href="/demo/department" className={styles.panelAction}>
                    Open inbox
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </header>
                <div className={styles.handoffItems}>
                  {viewModel.handoffs.map((handoff) => (
                    <div key={handoff.id} className={styles.handoffItem}>
                      <Link href={handoff.href} className={styles.handoffLink}>
                        <span className={styles.handoffTopline}>
                          <strong>{handoff.departmentName}</strong>
                          <StatusPill tone={handoff.statusTone}>
                            {handoff.status}
                          </StatusPill>
                        </span>
                        <span className={styles.handoffAction}>
                          {handoff.requestedAction}
                        </span>
                        <span className={styles.handoffBottomline}>
                          <span className="text-reference">
                            {handoff.requestId}
                          </span>
                          <span>{handoff.id}</span>
                        </span>
                      </Link>
                    </div>
                  ))}
                </div>
              </section>

              <MessageList
                title="Recent applicant messages"
                items={viewModel.messages}
                viewAllHref="/demo/officer#applicant-messages"
              />

              <DeadlineList
                title="Upcoming deadlines"
                items={viewModel.deadlines}
                viewAllHref="/demo/officer#my-tasks"
              />

              <section className={styles.slaPanel}>
                <div className={styles.slaHeader}>
                  <h2 className="text-card-title">
                    Department SLA
                  </h2>
                  <span>84% on track</span>
                </div>
                <div
                  className={styles.slaTrack}
                  aria-label="84 percent of requests are on track"
                >
                  <div className={styles.slaFill} />
                </div>
                <div className={styles.slaLegend}>
                  <span><Inbox aria-hidden="true" className="icon-14" /> {metrics.assignedToMe} active</span>
                  <span><FileClock aria-hidden="true" className="icon-14" /> {metrics.overdue} overdue</span>
                  <span><Send aria-hidden="true" className="icon-14" /> {metrics.waitingOnDepartment} handoffs</span>
                </div>
              </section>
            </aside>
          </section>
        </div>
      </InternalAppShell>
    </div>
  );
}
