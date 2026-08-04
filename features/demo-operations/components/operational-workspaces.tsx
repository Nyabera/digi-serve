"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  AUDIT_EVENTS,
  DEPARTMENT_SLA_ROWS,
  OFFICER_SLA_SERIES,
  OFFICER_TASKS,
  SUPERVISOR_SLA_SERIES,
  type DepartmentSlaRow,
  type OfficerTask,
  type OfficerTaskStatus } from "../fixtures/operational-data";
import {
  getOfficerRequestHref,
  getOfficerRequestReferralHref,
  OFFICER_ROUTE_HREFS,
} from "@/features/demo-engine/navigation/officer-navigation-contract";

import styles from "./operational-workspaces.module.css";

type Metric = {
  label: string;
  value: string;
  context: string;
  tone?: "good" | "warning" | "danger";
};

type TaskFilter =
  | "All"
  | "Due today"
  | "Overdue"
  | "Waiting"
  | "Feedback"
  | "Completed";

type RangeKey = keyof typeof OFFICER_SLA_SERIES;

const CHART_COLORS = {
  green: "#12aa4e",
  orange: "#f58b00",
  red: "#ef2d42",
  blue: "#0767f6",
  purple: "#7135f5",
  grid: "#e1e5ed",
  text: "#626b98",
};

function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className={styles.pageHeader}>
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {actions ? <div className={styles.headerActions}>{actions}</div> : null}
    </header>
  );
}

function MetricGrid({
  metrics,
  five = false,
}: {
  metrics: Metric[];
  five?: boolean;
}) {
  return (
    <section
      className={`${styles.metricGrid} ${
        five ? styles.metricGridFive : ""
      }`}
      aria-label="Summary metrics"
    >
      {metrics.map((metric) => (
        <article
          className={styles.metricCard}
          data-tone={metric.tone}
          key={metric.label}
        >
          <span>{metric.label}</span>
          <strong>{metric.value}</strong>
          <small>{metric.context}</small>
        </article>
      ))}
    </section>
  );
}

function StatusBadge({
  status,
  completed = false,
}: {
  status: OfficerTaskStatus;
  completed?: boolean;
}) {
  const label = completed ? "Completed" : status;
  return (
    <span className={styles.statusBadge} data-status={label}>
      {label}
    </span>
  );
}

function Workflow({
  currentStep,
  completed,
}: {
  currentStep: string;
  completed: boolean;
}) {
  const steps = [
    "Submission",
    "Verification",
    currentStep,
    "Approval",
    "Issued",
  ];

  return (
    <ol className={styles.workflow} aria-label="Workflow progress">
      {steps.map((label, index) => {
        const state = completed
          ? "complete"
          : index < 2
            ? "complete"
            : index === 2
              ? "current"
              : "pending";

        return (
          <li data-state={state} key={`${label}-${index}`}>
            <span>{index + 1}</span>
            <small>{label}</small>
          </li>
        );
      })}
    </ol>
  );
}

function downloadCsv(
  filename: string,
  rows: Array<Array<string | number>>,
) {
  const csv = rows
    .map((row) =>
      row
        .map((value) => {
          const text = String(value).replaceAll('"', '""');
          return `"${text}"`;
        })
        .join(","),
    )
    .join("\n");

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8",
  });
  const href = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(href);
}

function normalizeTaskFilter(value?: string): TaskFilter {
  const normalized = value?.toLowerCase();

  if (normalized === "due" || normalized === "due-today") {
    return "Due today";
  }
  if (normalized === "overdue") {
    return "Overdue";
  }
  if (
    normalized === "waiting" ||
    normalized === "applicant" ||
    normalized === "department"
  ) {
    return "Waiting";
  }
  if (normalized === "feedback") {
    return "Feedback";
  }
  if (normalized === "completed") {
    return "Completed";
  }

  return "All";
}

function matchesTaskFilter(
  task: OfficerTask,
  filter: TaskFilter,
  completedIds: string[],
) {
  if (filter === "All") {
    return true;
  }
  if (filter === "Due today") {
    return task.group === "Today";
  }
  if (filter === "Overdue") {
    return task.status === "Overdue";
  }
  if (filter === "Waiting") {
    return task.status === "Waiting";
  }
  if (filter === "Feedback") {
    return task.id === "REQ-2026-0731";
  }
  return completedIds.includes(task.id);
}

export function OfficerTasksWorkspace({
  initialFilter,
}: {
  initialFilter?: string;
}) {
  const [filter, setFilter] = useState<TaskFilter>(() =>
    normalizeTaskFilter(initialFilter),
  );
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(OFFICER_TASKS[0].id);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [comments, setComments] = useState([
    "Mercy Wanjiku: Please verify the fee receipt and confirm eligibility.",
    "Kevin Mwangi: Identity and application form reviewed.",
  ]);
  const [message, setMessage] = useState("");

  const visibleTasks = useMemo(() => {
    const search = query.trim().toLowerCase();

    return OFFICER_TASKS.filter((task) => {
      const filterMatch = matchesTaskFilter(
        task,
        filter,
        completedIds,
      );
      const searchMatch =
        !search ||
        [
          task.id,
          task.applicant,
          task.applicantReference,
          task.service,
          task.step,
        ].some((value) => value.toLowerCase().includes(search));

      return filterMatch && searchMatch;
    });
  }, [completedIds, filter, query]);

  const selectedTask =
    OFFICER_TASKS.find((task) => task.id === selectedId) ??
    OFFICER_TASKS[0];
  const selectedIndex = OFFICER_TASKS.findIndex(
    (task) => task.id === selectedTask.id,
  );
  const completed = completedIds.includes(selectedTask.id);

  const moveSelection = (direction: -1 | 1) => {
    const nextIndex =
      (selectedIndex + direction + OFFICER_TASKS.length) %
      OFFICER_TASKS.length;
    setSelectedId(OFFICER_TASKS[nextIndex].id);
    setMessage("");
  };

  const toggleComplete = () => {
    setCompletedIds((current) =>
      current.includes(selectedTask.id)
        ? current.filter((id) => id !== selectedTask.id)
        : [...current, selectedTask.id],
    );
    setMessage(
      completed
        ? "The case was reopened in this browser session."
        : "The case was marked complete in this browser session.",
    );
  };

  const addNote = () => {
    const trimmed = note.trim();
    if (!trimmed) {
      setMessage("Enter an internal note first.");
      return;
    }

    setComments((current) => [
      ...current,
      `Kevin Mwangi: ${trimmed}`,
    ]);
    setNote("");
    setMessage("Internal note added to the demo case.");
  };

  return (
    <main
      className={styles.workspace}
      data-d29r23b-officer-tasks="true"
    >
      <PageHeader
        title="Assigned to Me"
        description="Open your assigned cases, review the workflow and collaborate without leaving the page."
        actions={
          <>
            <Link className={styles.button} href={OFFICER_ROUTE_HREFS.home}>
              Dashboard
            </Link>
            <Link
              className={styles.button}
              href={OFFICER_ROUTE_HREFS.sla}
            >
              My SLA monitor
            </Link>
          </>
        }
      />

      <MetricGrid
        metrics={[
          {
            label: "My open cases",
            value: "38",
            context: "12% more than yesterday",
            tone: "good",
          },
          {
            label: "Due today",
            value: "11",
            context: "10% more than yesterday",
            tone: "warning",
          },
          {
            label: "Overdue",
            value: "7",
            context: "25% more than yesterday",
            tone: "danger",
          },
          {
            label: "Waiting for reply",
            value: "16",
            context: "6% fewer than yesterday",
            tone: "good",
          },
          {
            label: "Shared for feedback",
            value: "8",
            context: "14% more than yesterday",
            tone: "good",
          },
          {
            label: "Completed today",
            value: "14",
            context: "17% more than yesterday",
            tone: "good",
          },
        ]}
      />

      <section className={styles.tasksLayout}>
        <article className={styles.panel}>
          <div className={styles.queueTools}>
            <input
              aria-label="Search assigned cases"
              className={styles.input}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by ID, applicant or service..."
              type="search"
              value={query}
            />
            <div className={styles.tabs} aria-label="Task filters">
              {(
                [
                  "All",
                  "Due today",
                  "Overdue",
                  "Waiting",
                  "Feedback",
                  "Completed",
                ] satisfies TaskFilter[]
              ).map((option) => (
                <button
                  className={styles.tabButton}
                  data-active={filter === option ? "true" : undefined}
                  key={option}
                  onClick={() => setFilter(option)}
                  type="button"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.taskList}>
            {(["Today", "Tomorrow", "Later"] as const).map((group) => {
              const rows = visibleTasks.filter(
                (task) => task.group === group,
              );

              if (rows.length === 0) {
                return null;
              }

              return (
                <section key={group}>
                  <div className={styles.taskGroupTitle}>
                    <span>{group}</span>
                    <span>{rows.length}</span>
                  </div>
                  {rows.map((task) => (
                    <button
                      className={styles.taskRow}
                      data-selected={
                        selectedTask.id === task.id
                          ? "true"
                          : undefined
                      }
                      key={task.id}
                      onClick={() => {
                        setSelectedId(task.id);
                        setMessage("");
                      }}
                      type="button"
                    >
                      <strong>{task.id}</strong>
                      <span>{task.applicant}</span>
                      <span>{task.service}</span>
                      <StatusBadge
                        completed={completedIds.includes(task.id)}
                        status={task.status}
                      />
                    </button>
                  ))}
                </section>
              );
            })}

            {visibleTasks.length === 0 ? (
              <p className={styles.emptyState}>
                No assigned cases match this filter.
              </p>
            ) : null}
          </div>
        </article>

        <article className={styles.panel}>
          <div className={styles.panelHeader}>
            <div className={styles.inlineActions}>
              <h2>{selectedTask.id}</h2>
              <StatusBadge
                completed={completed}
                status={selectedTask.status}
              />
            </div>
            <div className={styles.inlineActions}>
              <button
                className={styles.button}
                onClick={() => moveSelection(-1)}
                type="button"
              >
                Previous
              </button>
              <button
                className={styles.button}
                onClick={() => moveSelection(1)}
                type="button"
              >
                Next
              </button>
              <button
                className={styles.primaryButton}
                onClick={toggleComplete}
                type="button"
              >
                {completed ? "Reopen case" : "Mark complete"}
              </button>
            </div>
          </div>

          <div className={styles.caseWorkspace}>
            <section className={styles.caseSummary}>
              <div>
                <small>Applicant</small>
                <strong>{selectedTask.applicant}</strong>
              </div>
              <div>
                <small>Service</small>
                <strong>{selectedTask.service}</strong>
              </div>
              <div>
                <small>Applied on</small>
                <strong>{selectedTask.appliedOn}</strong>
              </div>
              <div>
                <small>Current step</small>
                <strong>
                  {completed ? "Completed" : selectedTask.step}
                </strong>
              </div>
            </section>

            <Workflow
              completed={completed}
              currentStep={selectedTask.step}
            />

            <section className={styles.threeColumns}>
              <article className={styles.miniCard}>
                <h3>Key documents</h3>
                <ul className={styles.listRows}>
                  <li>
                    <span>Application form</span>
                    <strong>Verified</strong>
                  </li>
                  <li>
                    <span>National ID</span>
                    <strong>Verified</strong>
                  </li>
                  <li>
                    <span>Fee receipt</span>
                    <strong>Pending</strong>
                  </li>
                </ul>
                <button
                  className={styles.button}
                  onClick={() =>
                    setMessage(
                      "The demo document folder was opened.",
                    )
                  }
                  type="button"
                >
                  Open document folder
                </button>
              </article>

              <article className={styles.miniCard}>
                <h3>Recent comments</h3>
                {comments.slice(-3).map((comment) => (
                  <p key={comment}>{comment}</p>
                ))}
                <div className={styles.commentComposer}>
                  <textarea
                    aria-label="Add internal note"
                    className={styles.textarea}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="Add an internal note..."
                    value={note}
                  />
                  <button
                    className={styles.button}
                    onClick={addNote}
                    type="button"
                  >
                    Add internal note
                  </button>
                </div>
              </article>

              <article className={styles.miniCard}>
                <h3>Collaboration</h3>
                <p>
                  Work together with another officer without changing
                  the coordinating department.
                </p>
                <div className={styles.linkStack}>
                  <Link
                    href={getOfficerRequestReferralHref(selectedTask.id)}
                  >
                    Share workflow
                  </Link>
                  <button
                    onClick={() =>
                      setMessage(
                        "A feedback request was created in demo mode.",
                      )
                    }
                    type="button"
                  >
                    Ask for feedback
                  </button>
                  <Link
                    href={getOfficerRequestHref(selectedTask.id)}
                  >
                    Open full case
                  </Link>
                </div>
              </article>
            </section>

            <p className={styles.activityMessage} role="status">
              {message}
            </p>
          </div>
        </article>
      </section>

      <section className={styles.bottomGrid}>
        <article className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Applicant messages</h2>
          </div>
          <div className={styles.compactRows}>
            <p>
              <strong>Brian Otieno</strong>
              <span>Uploaded an additional document</span>
            </p>
            <p>
              <strong>Mercy Akinyi</strong>
              <span>Asked about fee clearance</span>
            </p>
            <p>
              <strong>Amina Hassan</strong>
              <span>Confirmed placement dates</span>
            </p>
          </div>
        </article>

        <article className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Returned cases & escalations</h2>
          </div>
          <div className={styles.compactRows}>
            <p>
              <strong>Returned for fix</strong>
              <span>5 cases</span>
            </p>
            <p>
              <strong>Escalated by applicant</strong>
              <span>3 cases</span>
            </p>
            <p>
              <strong>Escalated by officer</strong>
              <span>2 cases</span>
            </p>
          </div>
        </article>

        <article className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Quick links</h2>
          </div>
          <div className={styles.quickLinks}>
            <Link href={OFFICER_ROUTE_HREFS.queue}>
              Application queue
            </Link>
            <Link href={OFFICER_ROUTE_HREFS.sla}>
              My SLA monitor
            </Link>
            <Link href={OFFICER_ROUTE_HREFS.workflowInbox}>
              Workflow inbox
            </Link>
            <Link href={OFFICER_ROUTE_HREFS.home}>
              Officer dashboard
            </Link>
          </div>
        </article>
      </section>
    </main>
  );
}

type OfficerWorkflowView = "inbox" | "approvals" | "returned";

type OfficerWorkflowItem = OfficerTask & {
  readonly workflowStatus: "In review" | "Awaiting approval" | "Returned to applicant";
  readonly statusTone: "good" | "warning" | "danger";
};

function getOfficerWorkflowItems(view: OfficerWorkflowView) {
  const items: readonly OfficerWorkflowItem[] = OFFICER_TASKS.map((task) => {
    if (task.step === "Applicant correction") {
      return {
        ...task,
        workflowStatus: "Returned to applicant",
        statusTone: "danger",
      };
    }

    if (task.step === "Registrar approval") {
      return {
        ...task,
        workflowStatus: "Awaiting approval",
        statusTone: "warning",
      };
    }

    return {
      ...task,
      workflowStatus: "In review",
      statusTone: "good",
    };
  });

  if (view === "approvals") {
    return items.filter((item) => item.workflowStatus === "Awaiting approval");
  }

  if (view === "returned") {
    return items.filter((item) => item.workflowStatus === "Returned to applicant");
  }

  return items;
}

const workflowViewCopy: Record<
  OfficerWorkflowView,
  { readonly title: string; readonly description: string; readonly action: string }
> = {
  inbox: {
    title: "Workflow Inbox",
    description: "Monitor officer-owned handoffs and move each request through its next operational step.",
    action: "Record workflow update",
  },
  approvals: {
    title: "Approval Queue",
    description: "Review requests that have completed officer checks and are ready for registrar approval.",
    action: "Confirm readiness",
  },
  returned: {
    title: "Returned to Applicant",
    description: "Track requests awaiting applicant corrections or additional supporting information.",
    action: "Send reminder",
  },
};

export function OfficerWorkflowWorkspace({
  canonicalHref,
  view,
}: {
  readonly canonicalHref: string;
  readonly view: OfficerWorkflowView;
}) {
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const items = getOfficerWorkflowItems(view);
  const visibleItems = items.filter((item) => {
    const value = query.trim().toLowerCase();

    return (
      !value ||
      [item.id, item.applicant, item.service, item.step, item.workflowStatus]
        .some((candidate) => candidate.toLowerCase().includes(value))
    );
  });
  const [selectedId, setSelectedId] = useState(items[0]?.id ?? "");
  const selectedItem =
    visibleItems.find((item) => item.id === selectedId) ??
    items.find((item) => item.id === selectedId) ??
    items[0];
  const copy = workflowViewCopy[view];

  return (
    <main className={styles.workspace} data-officer-workflow-route={canonicalHref}>
      <PageHeader title={copy.title} description={copy.description} />

      <MetricGrid
        metrics={[
          {
            label: "Inbox items",
            value: String(getOfficerWorkflowItems("inbox").length),
            context: "Officer-owned active requests",
            tone: "good",
          },
          {
            label: "Awaiting approval",
            value: String(getOfficerWorkflowItems("approvals").length),
            context: "Ready for registrar decision",
            tone: "warning",
          },
          {
            label: "Applicant corrections",
            value: String(getOfficerWorkflowItems("returned").length),
            context: "Returned with a clear next step",
            tone: "danger",
          },
          {
            label: "Due today",
            value: String(OFFICER_TASKS.filter((task) => task.group === "Today").length),
            context: "Review before close of business",
            tone: "warning",
          },
          {
            label: "Overdue",
            value: String(OFFICER_TASKS.filter((task) => task.status === "Overdue").length),
            context: "Requires active follow-up",
            tone: "danger",
          },
          {
            label: "Waiting",
            value: String(OFFICER_TASKS.filter((task) => task.status === "Waiting").length),
            context: "External response in progress",
            tone: "good",
          },
        ]}
      />

      <section className={styles.tasksLayout}>
        <article className={styles.panel}>
          <div className={styles.queueTools}>
            <input
              aria-label={`Search ${copy.title.toLowerCase()}`}
              className={styles.input}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by request, applicant or service..."
              type="search"
              value={query}
            />
          </div>
          <div className={styles.taskList}>
            {visibleItems.map((item) => (
              <button
                className={styles.taskRow}
                data-selected={selectedItem?.id === item.id ? "true" : undefined}
                key={item.id}
                onClick={() => {
                  setSelectedId(item.id);
                  setMessage("");
                }}
                type="button"
              >
                <strong>{item.id}</strong>
                <span>{item.applicant}</span>
                <span>{item.service}</span>
                <span className={styles.statusBadge} data-status={item.status === "Overdue" ? "Overdue" : item.workflowStatus === "Awaiting approval" ? "Due soon" : undefined}>
                  {item.workflowStatus}
                </span>
              </button>
            ))}
            {visibleItems.length === 0 ? (
              <p className={styles.emptyState}>No workflow records match this filter.</p>
            ) : null}
          </div>
        </article>

        {selectedItem ? (
          <article className={styles.panel}>
            <div className={styles.panelHeader}>
              <div className={styles.inlineActions}>
                <h2>{selectedItem.id}</h2>
                <span className={styles.statusBadge} data-status={selectedItem.status === "Overdue" ? "Overdue" : selectedItem.workflowStatus === "Awaiting approval" ? "Due soon" : undefined}>
                  {selectedItem.workflowStatus}
                </span>
              </div>
              <Link className={styles.button} href={getOfficerRequestHref(selectedItem.id)}>
                Open case
              </Link>
            </div>
            <div className={styles.caseWorkspace}>
              <section className={styles.caseSummary}>
                <div><small>Applicant</small><strong>{selectedItem.applicant}</strong></div>
                <div><small>Service</small><strong>{selectedItem.service}</strong></div>
                <div><small>Current step</small><strong>{selectedItem.step}</strong></div>
                <div><small>Due</small><strong>{selectedItem.due}</strong></div>
              </section>
              <Workflow currentStep={selectedItem.step} completed={false} />
              <section className={styles.threeColumns}>
                <article className={styles.miniCard}>
                  <h3>Officer ownership</h3>
                  <p>Student Records remains the coordinating workspace for this request.</p>
                </article>
                <article className={styles.miniCard}>
                  <h3>Next action</h3>
                  <p>{view === "returned" ? "Review the applicant response when new information arrives." : "Keep the workflow record current before handing the request forward."}</p>
                </article>
                <article className={styles.miniCard}>
                  <h3>Workflow note</h3>
                  <button className={styles.button} onClick={() => setMessage(`${copy.action} recorded for ${selectedItem.id} in this demo session.`)} type="button">
                    {copy.action}
                  </button>
                </article>
              </section>
              <p className={styles.activityMessage} role="status">{message}</p>
            </div>
          </article>
        ) : null}
      </section>
    </main>
  );
}

type OfficerCommunicationKind = "applicant" | "internal";

const applicantMessages = OFFICER_TASKS.slice(0, 5).map((task, index) => ({
  id: `MSG-${task.id}`,
  requestId: task.id,
  name: task.applicant,
  subject: index % 2 === 0 ? `Update requested for ${task.service}` : `Question about ${task.service}`,
  detail: index % 2 === 0 ? "Supporting information has been added to the request." : "The applicant is awaiting a clear response from Student Records.",
  received: `${index + 1}h ago`,
}));

const initialInternalNotes = AUDIT_EVENTS.filter((event) => event.category === "Comments").map((event) => ({
  id: event.id,
  requestId: event.id.includes("0004") ? "REQ-2026-0715" : "REQ-2026-0718",
  author: event.actor,
  detail: event.description,
  recordedAt: event.time,
}));

export function OfficerCommunicationsWorkspace({
  canonicalHref,
  kind,
}: {
  readonly canonicalHref: string;
  readonly kind: OfficerCommunicationKind;
}) {
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState(initialInternalNotes);
  const isApplicant = kind === "applicant";
  const records = isApplicant ? applicantMessages : notes;
  const visibleRecords = records.filter((record) => {
    const value = query.trim().toLowerCase();
    return !value || Object.values(record).some((candidate) => String(candidate).toLowerCase().includes(value));
  });

  function addNote() {
    const value = note.trim();
    if (!value) {
      setMessage("Enter an internal note before saving.");
      return;
    }

    setNotes((current) => [
      {
        id: `NOTE-${Date.now()}`,
        requestId: OFFICER_TASKS[0].id,
        author: "Kevin Mwangi",
        detail: value,
        recordedAt: "Just now",
      },
      ...current,
    ]);
    setNote("");
    setMessage("Internal note recorded in this demo session.");
  }

  return (
    <main className={styles.workspace} data-officer-communications-route={canonicalHref}>
      <PageHeader
        title={isApplicant ? "Applicant Messages" : "Internal Notes"}
        description={isApplicant ? "Review applicant updates and keep request communication in the officer workspace." : "Capture staff-only context across the active officer request set."}
      />
      <MetricGrid
        metrics={[
          { label: isApplicant ? "Open messages" : "Recorded notes", value: String(records.length), context: "Across active officer requests", tone: "good" },
          { label: "Requests represented", value: String(new Set(records.map((record) => record.requestId)).size), context: "Not limited to one request", tone: "good" },
          { label: "Awaiting applicant", value: String(OFFICER_TASKS.filter((task) => task.status === "Waiting").length), context: "Follow-up still in progress", tone: "warning" },
          { label: "Due today", value: String(OFFICER_TASKS.filter((task) => task.group === "Today").length), context: "Prioritise a response", tone: "warning" },
          { label: "Overdue", value: String(OFFICER_TASKS.filter((task) => task.status === "Overdue").length), context: "Keep the context current", tone: "danger" },
          { label: "Assigned cases", value: String(OFFICER_TASKS.length), context: "Current demonstration set", tone: "good" },
        ]}
      />
      <section className={styles.tasksLayout}>
        <article className={styles.panel}>
          <div className={styles.queueTools}>
            <input aria-label={`Search ${isApplicant ? "applicant messages" : "internal notes"}`} className={styles.input} onChange={(event) => setQuery(event.target.value)} placeholder="Search by request, person or content..." type="search" value={query} />
          </div>
          <div className={styles.compactRows}>
            {visibleRecords.map((record) => (
              <p key={record.id}>
                <strong>{isApplicant ? (record as (typeof applicantMessages)[number]).name : (record as (typeof initialInternalNotes)[number]).author}</strong>
                <span>{record.requestId}</span>
              </p>
            ))}
            {visibleRecords.length === 0 ? <p className={styles.emptyState}>No communication records match this filter.</p> : null}
          </div>
        </article>
        <article className={styles.panel}>
          <div className={styles.panelHeader}><h2>{isApplicant ? "Conversation activity" : "Staff context"}</h2></div>
          <div className={styles.caseWorkspace}>
            {visibleRecords.map((record) => (
              <article className={styles.miniCard} key={record.id}>
                <h3>{isApplicant ? (record as (typeof applicantMessages)[number]).subject : `Note for ${record.requestId}`}</h3>
                <p>{isApplicant ? (record as (typeof applicantMessages)[number]).detail : (record as (typeof initialInternalNotes)[number]).detail}</p>
                <p>{isApplicant ? (record as (typeof applicantMessages)[number]).received : (record as (typeof initialInternalNotes)[number]).recordedAt}</p>
              </article>
            ))}
            {isApplicant ? (
              <button className={styles.button} onClick={() => setMessage("Applicant reply composer opened for this demo session.")} type="button">Compose reply</button>
            ) : (
              <div className={styles.commentComposer}>
                <textarea aria-label="Add internal note" className={styles.textarea} onChange={(event) => setNote(event.target.value)} placeholder="Add staff-only context for the active request set..." value={note} />
                <button className={styles.button} onClick={addNote} type="button">Add note</button>
              </div>
            )}
            <p className={styles.activityMessage} role="status">{message}</p>
          </div>
        </article>
      </section>
    </main>
  );
}

function makeTrendData(values: number[]) {
  return values.map((value, index) => ({
    period: `P${index + 1}`,
    compliance: value,
  }));
}


function MeasuredChart({
  className,
  height,
  children,
}: {
  className?: string;
  height: number;
  children: (size: { width: number; height: number }) => React.ReactNode;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) {
      return;
    }

    const update = () => {
      const nextWidth = Math.floor(host.getBoundingClientRect().width);
      setWidth(nextWidth > 0 ? nextWidth : 0);
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(host);
    window.addEventListener("resize", update);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      className={`${styles.chartCanvas} ${className ?? ""}`}
      data-chart-width={width}
      ref={hostRef}
      style={{ height, minHeight: height }}
    >
      {width >= 160 ? (
        children({ width, height })
      ) : (
        <div className={styles.chartLoading} role="status">
          Preparing chart…
        </div>
      )}
    </div>
  );
}

function SlaDonut({
  data,
  centreValue,
  centreLabel,
  ariaLabel,
}: {
  data: Array<{ name: string; value: number; color: string }>;
  centreValue: string;
  centreLabel: string;
  ariaLabel: string;
}) {
  return (
    <figure aria-label={ariaLabel} className={styles.slaFigure}>
      <div className={styles.slaDonutLayout}>
        <MeasuredChart className={styles.chartCanvasSmall} height={220}>
          {({ width, height }) => (
            <PieChart height={height} width={width}>
              <Tooltip />
              <Pie
                cx="50%"
                cy="50%"
                data={data}
                dataKey="value"
                innerRadius={55}
                nameKey="name"
                outerRadius={82}
                paddingAngle={1}
                isAnimationActive={false}
              >
                {data.map((entry) => (
                  <Cell fill={entry.color} key={entry.name} />
                ))}
              </Pie>
              <text
                dominantBaseline="middle"
                fill={CHART_COLORS.blue}
                fontSize="24"
                fontWeight="700"
                textAnchor="middle"
                x="50%"
                y="46%"
              >
                {centreValue}
              </text>
              <text
                dominantBaseline="middle"
                fill={CHART_COLORS.text}
                fontSize="10"
                textAnchor="middle"
                x="50%"
                y="57%"
              >
                {centreLabel}
              </text>
            </PieChart>
          )}
        </MeasuredChart>

        <dl className={styles.slaHtmlLegend}>
          {data.map((entry) => (
            <div key={entry.name}>
              <dt>
                <span
                  aria-hidden="true"
                  style={{ background: entry.color }}
                />
                {entry.name}
              </dt>
              <dd>{entry.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <figcaption className={styles.srOnly}>{ariaLabel}</figcaption>
    </figure>
  );
}

function TrendChart({
  values,
  ariaLabel,
}: {
  values: number[];
  ariaLabel: string;
}) {
  const data = makeTrendData(values);

  return (
    <figure aria-label={ariaLabel}>
      <MeasuredChart height={250}>
        {({ width, height }) => (
          <LineChart
            data={data}
            height={height}
            margin={{ bottom: 8, left: 0, right: 12, top: 8 }}
            width={width}
          >
            <CartesianGrid
              stroke={CHART_COLORS.grid}
              strokeDasharray="4 4"
              vertical={false}
            />
            <XAxis
              axisLine={false}
              dataKey="period"
              fontSize={10}
              tick={{ fill: CHART_COLORS.text }}
              tickLine={false}
            />
            <YAxis
              axisLine={false}
              domain={[0, 100]}
              fontSize={10}
              tick={{ fill: CHART_COLORS.text }}
              tickFormatter={(value) => `${value}%`}
              tickLine={false}
              width={34}
            />
            <Tooltip />
            <Line
              dataKey="compliance"
              dot={{ r: 3 }}
              isAnimationActive={false}
              name="Compliance"
              stroke={CHART_COLORS.green}
              strokeWidth={3}
              type="monotone"
            />
          </LineChart>
        )}
      </MeasuredChart>
      <figcaption className={styles.srOnly}>{ariaLabel}</figcaption>
    </figure>
  );
}

export function OfficerSlaWorkspace() {
  const [range, setRange] = useState<RangeKey>("1 Month");
  const [status, setStatus] = useState("All tasks");

  const overdueRows = [
    [
      "REQ-2026-0703",
      "Certificate Replacement",
      "Registrar approval",
      "2h 15m",
      "26 Jul 2026, 10:00 AM",
    ],
    [
      "REQ-2026-0689",
      "Transcript Request",
      "Document review",
      "56m",
      "26 Jul 2026, 9:00 AM",
    ],
    [
      "REQ-2026-0671",
      "Student Clearance",
      "Finance clearance",
      "35m",
      "27 Jul 2026, 11:00 AM",
    ],
  ];

  return (
    <main
      className={styles.workspace}
      data-d29r23b-officer-sla="true"
    >
      <PageHeader
        title="My SLA Performance"
        description="Track your personal SLA performance and assigned tasks over time."
        actions={
          <>
            <Link className={styles.button} href={OFFICER_ROUTE_HREFS.tasks}>
              Open my tasks
            </Link>
            <button
              className={styles.button}
              onClick={() =>
                downloadCsv("officer-sla-demo.csv", [
                  [
                    "Request ID",
                    "Service",
                    "Step",
                    "Overdue by",
                    "Due date",
                  ],
                  ...overdueRows,
                ])
              }
              type="button"
            >
              Export CSV
            </button>
          </>
        }
      />

      <div className={styles.toolbar}>
        <div className={styles.rangeRow} aria-label="Date range">
          {(Object.keys(OFFICER_SLA_SERIES) as RangeKey[]).map(
            (option) => (
              <button
                className={styles.rangeButton}
                data-active={range === option ? "true" : undefined}
                key={option}
                onClick={() => setRange(option)}
                type="button"
              >
                {option}
              </button>
            ),
          )}
        </div>

        <select
          aria-label="Filter SLA tasks"
          className={styles.select}
          onChange={(event) => setStatus(event.target.value)}
          value={status}
        >
          <option>All tasks</option>
          <option>On track</option>
          <option>Due soon</option>
          <option>Overdue</option>
        </select>
      </div>

      <MetricGrid
        five
        metrics={[
          {
            label: "My active tasks",
            value: "24",
            context: "3 more than last month",
            tone: "good",
          },
          {
            label: "SLA compliance",
            value: "92%",
            context: "6% better than last month",
            tone: "good",
          },
          {
            label: "On track",
            value: "22",
            context: "92% of evaluated tasks",
            tone: "good",
          },
          {
            label: "Due soon",
            value: "2",
            context: "One more than last month",
            tone: "warning",
          },
          {
            label: "Overdue",
            value: "3",
            context: "Includes carried-over work",
            tone: "danger",
          },
        ]}
      />

      <section className={styles.chartGrid}>
        <article className={styles.chartCard}>
          <h2>SLA compliance trend</h2>
          <TrendChart
            ariaLabel={`Officer SLA compliance trend for ${range}`}
            values={OFFICER_SLA_SERIES[range]}
          />
        </article>

        <article className={styles.chartCard}>
          <h2>SLA breakdown</h2>
          <SlaDonut
            ariaLabel="Officer SLA breakdown: 22 on track, 2 due soon and 3 overdue evaluated tasks"
            centreLabel="evaluated tasks"
            centreValue="27"
            data={[
              {
                name: "On track",
                value: 22,
                color: CHART_COLORS.green,
              },
              {
                name: "Due soon",
                value: 2,
                color: CHART_COLORS.orange,
              },
              {
                name: "Overdue",
                value: 3,
                color: CHART_COLORS.red,
              },
            ]}
          />
          <p className={styles.chartNote}>
            Active tasks and evaluated SLA items differ because three
            overdue cases were carried into this period.
          </p>
        </article>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <h2>My overdue tasks (3)</h2>
          <span>{status}</span>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <caption className={styles.srOnly}>
              Officer overdue tasks
            </caption>
            <thead>
              <tr>
                <th scope="col">Request ID</th>
                <th scope="col">Service</th>
                <th scope="col">Step</th>
                <th scope="col">Overdue by</th>
                <th scope="col">Due date</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {overdueRows.map(
                ([id, service, step, overdue, due]) => (
                  <tr key={id}>
                    <td>{id}</td>
                    <td>{service}</td>
                    <td>{step}</td>
                    <td>{overdue}</td>
                    <td>{due}</td>
                    <td>
                      <Link href={getOfficerRequestHref(id)}>
                        View
                      </Link>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export function SupervisorAuditWorkspace() {
  const [category, setCategory] = useState("All events");
  const [department, setDepartment] = useState("All departments");
  const [selectedId, setSelectedId] = useState(AUDIT_EVENTS[0].id);
  const [message, setMessage] = useState("");

  const visibleEvents = useMemo(() => {
    return AUDIT_EVENTS.filter((event) => {
      const categoryMatch =
        category === "All events" || event.category === category;
      const departmentMatch =
        department === "All departments" ||
        event.department === department;
      return categoryMatch && departmentMatch;
    });
  }, [category, department]);

  const selectedEvent =
    AUDIT_EVENTS.find((event) => event.id === selectedId) ??
    visibleEvents[0] ??
    AUDIT_EVENTS[0];

  const copyEventId = async () => {
    try {
      await navigator.clipboard.writeText(selectedEvent.id);
      setMessage("Event ID copied.");
    } catch {
      setMessage("Copy is unavailable in this browser.");
    }
  };

  return (
    <main
      className={styles.workspace}
      data-d29r23b-supervisor-audit="true"
    >
      <PageHeader
        title="Application Audit Trail"
        description="Review comments, status changes, verification events and document actions."
        actions={
          <>
            <Link
              className={styles.button}
              href="/demo/supervisor"
            >
              Dashboard
            </Link>
            <Link
              className={styles.primaryButton}
              href="/demo/officer/requests/REQ-2026-0715"
            >
              Open application
            </Link>
          </>
        }
      />

      <section className={styles.auditHeader}>
        <div>
          <small>Request</small>
          <strong>REQ-2026-0715 · Transcript Request</strong>
        </div>
        <div>
          <small>Applicant</small>
          <strong>Brian Otieno</strong>
        </div>
        <div>
          <small>Current stage</small>
          <strong>Applicant correction</strong>
        </div>
        <div>
          <small>Assigned officer</small>
          <strong>Kevin Mwangi</strong>
        </div>
        <div>
          <small>SLA status</small>
          <strong>On track · 1d 6h remaining</strong>
        </div>
      </section>

      <div className={styles.toolbar}>
        <div className={styles.tabs} aria-label="Audit event types">
          {[
            "All events",
            "Comments",
            "Status changes",
            "Document actions",
            "Verification events",
          ].map((option) => (
            <button
              className={styles.tabButton}
              data-active={category === option ? "true" : undefined}
              key={option}
              onClick={() => setCategory(option)}
              type="button"
            >
              {option}
            </button>
          ))}
        </div>

        <select
          aria-label="Filter audit events by department"
          className={styles.select}
          onChange={(event) => setDepartment(event.target.value)}
          value={department}
        >
          <option>All departments</option>
          <option>Applicant</option>
          <option>Student Records</option>
          <option>Finance</option>
          <option>Registrar</option>
        </select>
      </div>

      <section className={styles.auditGrid}>
        <article className={styles.panel}>
          <div className={styles.auditList}>
            {visibleEvents.map((event, index) => (
              <button
                className={styles.auditRow}
                data-selected={
                  selectedEvent.id === event.id
                    ? "true"
                    : undefined
                }
                key={event.id}
                onClick={() => {
                  setSelectedId(event.id);
                  setMessage("");
                }}
                type="button"
              >
                <b className={styles.eventNumber}>{index + 1}</b>
                <strong>{event.title}</strong>
                <span>
                  {event.actor} · {event.role}
                </span>
                <time>{event.time}</time>
                <span>{event.description}</span>
              </button>
            ))}

            {visibleEvents.length === 0 ? (
              <p className={styles.emptyState}>
                No audit events match these filters.
              </p>
            ) : null}
          </div>
        </article>

        <aside className={styles.panel}>
          <div className={styles.detailPanel}>
            <h2>{selectedEvent.title}</h2>
            <p>{selectedEvent.time}</p>

            <dl className={styles.detailGrid}>
              <div>
                <dt>Actor</dt>
                <dd>{selectedEvent.actor}</dd>
              </div>
              <div>
                <dt>Department</dt>
                <dd>{selectedEvent.department}</dd>
              </div>
              <div>
                <dt>Source</dt>
                <dd>{selectedEvent.source}</dd>
              </div>
            </dl>

            <h3>Action description</h3>
            <p>{selectedEvent.description}</p>

            <h3>Before / after snapshot</h3>
            <table className={styles.snapshot}>
              <thead>
                <tr>
                  <th scope="col">Field</th>
                  <th scope="col">Before</th>
                  <th scope="col">After</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Application status</td>
                  <td>{selectedEvent.before}</td>
                  <td>{selectedEvent.after}</td>
                </tr>
                <tr>
                  <td>Current stage</td>
                  <td>{selectedEvent.before}</td>
                  <td>{selectedEvent.after}</td>
                </tr>
              </tbody>
            </table>

            <h3>Attached files</h3>
            <div className={styles.attachmentList}>
              {selectedEvent.attachments.length > 0 ? (
                selectedEvent.attachments.map((attachment) => (
                  <button
                    key={attachment}
                    onClick={() =>
                      setMessage(
                        `${attachment} opened in demo mode.`,
                      )
                    }
                    type="button"
                  >
                    <span>{attachment}</span>
                    <span>Open</span>
                  </button>
                ))
              ) : (
                <p>No files were attached to this event.</p>
              )}
            </div>

            <div className={styles.metaRows}>
              <p>
                <strong>Event ID</strong>
                <span>{selectedEvent.id}</span>
              </p>
              <p>
                <strong>IP address</strong>
                <span>{selectedEvent.ipAddress}</span>
              </p>
              <p>
                <strong>User agent</strong>
                <span>{selectedEvent.userAgent}</span>
              </p>
            </div>

            <div className={styles.inlineActions}>
              <button
                className={styles.button}
                onClick={copyEventId}
                type="button"
              >
                Copy event ID
              </button>
            </div>
            <p className={styles.activityMessage} role="status">
              {message}
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}

function departmentTotals(
  rows: DepartmentSlaRow[],
): DepartmentSlaRow {
  return rows.reduce(
    (total, row) => ({
      department: "All departments",
      assigned: total.assigned + row.assigned,
      onTrack: total.onTrack + row.onTrack,
      dueSoon: total.dueSoon + row.dueSoon,
      overdue: total.overdue + row.overdue,
      compliance: 88,
    }),
    {
      department: "All departments",
      assigned: 0,
      onTrack: 0,
      dueSoon: 0,
      overdue: 0,
      compliance: 88,
    },
  );
}

export function SupervisorSlaWorkspace() {
  const [range, setRange] = useState<
    keyof typeof SUPERVISOR_SLA_SERIES
  >("1 Month");
  const [department, setDepartment] =
    useState("All departments");

  const totals = departmentTotals(DEPARTMENT_SLA_ROWS);
  const selected =
    department === "All departments"
      ? totals
      : DEPARTMENT_SLA_ROWS.find(
          (row) => row.department === department,
        ) ?? totals;

  const visibleRows =
    department === "All departments"
      ? DEPARTMENT_SLA_ROWS
      : DEPARTMENT_SLA_ROWS.filter(
          (row) => row.department === department,
        );

  const overdueCases = [
    [
      "REQ-2026-0689",
      "Transcript Request",
      "Student Records",
      "Kevin Mwangi",
      "56m",
    ],
    [
      "REQ-2026-0678",
      "Student Clearance",
      "Finance",
      "Mercy Wanjiku",
      "1h 42m",
    ],
    [
      "REQ-2026-0661",
      "Course Application",
      "Academic Departments",
      "James Kilonzo",
      "3h 10m",
    ],
  ];

  return (
    <main
      className={styles.workspace}
      data-d29r23b-supervisor-sla="true"
    >
      <PageHeader
        title="Department SLA Monitor"
        description="Monitor service-level performance across departments and identify overdue work."
        actions={
          <>
            <Link
              className={styles.button}
              href="/demo/supervisor/audit-trail"
            >
              Audit trail
            </Link>
            <button
              className={styles.button}
              onClick={() =>
                downloadCsv("department-sla-demo.csv", [
                  [
                    "Department",
                    "Assigned",
                    "On track",
                    "Due soon",
                    "Overdue",
                    "Compliance",
                  ],
                  ...DEPARTMENT_SLA_ROWS.map((row) => [
                    row.department,
                    row.assigned,
                    row.onTrack,
                    row.dueSoon,
                    row.overdue,
                    `${row.compliance}%`,
                  ]),
                ])
              }
              type="button"
            >
              Export CSV
            </button>
          </>
        }
      />

      <div className={styles.toolbar}>
        <div className={styles.rangeRow} aria-label="Date range">
          {(
            Object.keys(
              SUPERVISOR_SLA_SERIES,
            ) as Array<keyof typeof SUPERVISOR_SLA_SERIES>
          ).map((option) => (
            <button
              className={styles.rangeButton}
              data-active={range === option ? "true" : undefined}
              key={option}
              onClick={() => setRange(option)}
              type="button"
            >
              {option}
            </button>
          ))}
        </div>

        <select
          aria-label="Filter SLA report by department"
          className={styles.select}
          onChange={(event) => setDepartment(event.target.value)}
          value={department}
        >
          <option>All departments</option>
          {DEPARTMENT_SLA_ROWS.map((row) => (
            <option key={row.department}>{row.department}</option>
          ))}
        </select>
      </div>

      <MetricGrid
        five
        metrics={[
          {
            label: "Open department cases",
            value: String(selected.assigned),
            context: `${department} scope`,
            tone: "good",
          },
          {
            label: "Overall SLA compliance",
            value: `${selected.compliance}%`,
            context: "4% better than last month",
            tone: "good",
          },
          {
            label: "On track",
            value: String(selected.onTrack),
            context: "Currently within target",
            tone: "good",
          },
          {
            label: "Due soon",
            value: String(selected.dueSoon),
            context: "Action needed within 48 hours",
            tone: "warning",
          },
          {
            label: "Overdue",
            value: String(selected.overdue),
            context: "Requires supervisor ownership",
            tone: "danger",
          },
        ]}
      />

      <section className={styles.chartGrid}>
        <article className={styles.chartCard}>
          <h2>Department SLA trend</h2>
          <TrendChart
            ariaLabel={`Department SLA compliance trend for ${range}`}
            values={SUPERVISOR_SLA_SERIES[range]}
          />
        </article>

        <article className={styles.chartCard}>
          <h2>Current SLA breakdown</h2>
          <SlaDonut
            ariaLabel={`${selected.onTrack} on track, ${selected.dueSoon} due soon and ${selected.overdue} overdue cases`}
            centreLabel="open cases"
            centreValue={String(selected.assigned)}
            data={[
              {
                name: "On track",
                value: selected.onTrack,
                color: CHART_COLORS.green,
              },
              {
                name: "Due soon",
                value: selected.dueSoon,
                color: CHART_COLORS.orange,
              },
              {
                name: "Overdue",
                value: selected.overdue,
                color: CHART_COLORS.red,
              },
            ]}
          />
        </article>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <h2>Department comparison</h2>
          <span>{department}</span>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <caption className={styles.srOnly}>
              Department SLA comparison
            </caption>
            <thead>
              <tr>
                <th scope="col">Department</th>
                <th scope="col">Assigned</th>
                <th scope="col">On track</th>
                <th scope="col">Due soon</th>
                <th scope="col">Overdue</th>
                <th scope="col">Compliance</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row) => (
                <tr key={row.department}>
                  <td>{row.department}</td>
                  <td>{row.assigned}</td>
                  <td>{row.onTrack}</td>
                  <td>{row.dueSoon}</td>
                  <td>{row.overdue}</td>
                  <td>{row.compliance}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <h2>Overdue department cases</h2>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <caption className={styles.srOnly}>
              Overdue department cases
            </caption>
            <thead>
              <tr>
                <th scope="col">Request ID</th>
                <th scope="col">Service</th>
                <th scope="col">Department</th>
                <th scope="col">Officer</th>
                <th scope="col">Overdue by</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {overdueCases.map(
                ([id, service, caseDepartment, officer, overdue]) => (
                  <tr key={id}>
                    <td>{id}</td>
                    <td>{service}</td>
                    <td>{caseDepartment}</td>
                    <td>{officer}</td>
                    <td>{overdue}</td>
                    <td>
                      <Link href={`/demo/officer/requests/${id}`}>
                        View
                      </Link>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
