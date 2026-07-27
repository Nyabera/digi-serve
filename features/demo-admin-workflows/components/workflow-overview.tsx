"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Copy,
  FileText,
  GitBranch,
  ListChecks,
  MoreHorizontal,
  Play,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  Timer,
  Users,
  Workflow,
} from "lucide-react";

import {
  activeWorkflowRows,
  recentWorkflowActivity,
  workflowTemplates,
} from "../fixtures/workflow-demo-data";
import styles from "./workflow-overview.module.css";

type OverviewTab = "templates" | "active";

type WorkflowOverviewProps = {
  initialTab?: OverviewTab;
};

const metricCards = [
  {
    label: "Total Templates",
    value: "24",
    change: "12% from last month",
    direction: "up",
    tone: "blue",
    icon: FileText,
  },
  {
    label: "Active Workflows",
    value: "156",
    change: "18% from last month",
    direction: "up",
    tone: "green",
    icon: Play,
  },
  {
    label: "Pending Approvals",
    value: "32",
    change: "8% from last month",
    direction: "down",
    tone: "purple",
    icon: Timer,
  },
  {
    label: "Completed This Month",
    value: "289",
    change: "24% from last month",
    direction: "up",
    tone: "orange",
    icon: CheckCircle2,
  },
] as const;

const quickActions = [
  {
    title: "Create Workflow Template",
    detail: "Design a new workflow template",
    href: "/demo/admin/workflows/builder",
    icon: Plus,
  },
  {
    title: "Workflow Builder",
    detail: "Build custom workflows visually",
    href: "/demo/admin/workflows/builder?template=transcript-request",
    icon: Workflow,
  },
  {
    title: "Manage Approval Chains",
    detail: "Create and manage approval chains",
    href: "/demo/admin/workflows/builder?template=certificate-issuance",
    icon: GitBranch,
  },
  {
    title: "Escalation Rules",
    detail: "Configure escalation conditions",
    href: "/demo/admin/workflows/builder?template=student-clearance",
    icon: ShieldCheck,
  },
];

function statusClass(status: string) {
  if (status === "Approved") {
    return styles.statusApproved;
  }

  if (status === "Pending") {
    return styles.statusPending;
  }

  return styles.statusProgress;
}

export function WorkflowOverview({
  initialTab = "templates",
}: WorkflowOverviewProps) {
  const [tab, setTab] = useState<OverviewTab>(initialTab);
  const [query, setQuery] = useState("");

  const filteredTemplates = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return workflowTemplates;
    }

    return workflowTemplates.filter((template) =>
      [
        template.name,
        template.description,
        template.category,
        template.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [query]);

  return (
    <main className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Institution administration</p>
          <h1>Workflows</h1>
          <div className={styles.breadcrumbs}>
            <span>Workflows</span>
            <ArrowRight aria-hidden="true" size={13} />
            <strong>Overview</strong>
          </div>
        </div>

        <Link
          className={styles.primaryButton}
          href="/demo/admin/workflows/builder"
        >
          <Plus aria-hidden="true" size={16} />
          Create Workflow Template
        </Link>
      </header>

      <nav aria-label="Workflow section" className={styles.sectionNav}>
        <button
          aria-current={tab === "templates" ? "page" : undefined}
          onClick={() => setTab("templates")}
          type="button"
        >
          Workflow Templates
        </button>
        <button
          aria-current={tab === "active" ? "page" : undefined}
          onClick={() => setTab("active")}
          type="button"
        >
          Active Workflows
        </button>
        <Link href="/demo/admin/workflows/builder">
          Visual Workflow Builder
        </Link>
      </nav>

      <section aria-label="Workflow metrics" className={styles.metricGrid}>
        {metricCards.map((metric) => {
          const Icon = metric.icon;

          return (
            <article
              className={styles.metricCard}
              data-tone={metric.tone}
              key={metric.label}
            >
              <span className={styles.metricIcon}>
                <Icon aria-hidden="true" size={22} />
              </span>
              <div>
                <p>{metric.label}</p>
                <strong>{metric.value}</strong>
                <small data-direction={metric.direction}>
                  {metric.direction === "up" ? "↑" : "↓"} {metric.change}
                </small>
              </div>
            </article>
          );
        })}
      </section>

      {tab === "templates" ? (
        <>
          <section className={styles.templateToolbar}>
            <div>
              <h2>Workflow templates</h2>
              <p>
                Start from a seeded institutional service and customize its
                routing, approvals, SLAs and output.
              </p>
            </div>

            <label className={styles.searchField}>
              <Search aria-hidden="true" size={16} />
              <span className={styles.srOnly}>Search workflow templates</span>
              <input
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search templates"
                type="search"
                value={query}
              />
            </label>
          </section>

          <section
            aria-label="Workflow templates"
            className={styles.templateGrid}
          >
            {filteredTemplates.map((template) => (
              <article className={styles.templateCard} key={template.id}>
                <div className={styles.templateCardHeader}>
                  <span
                    className={styles.templateIcon}
                    data-tone={template.tone}
                  >
                    <Workflow aria-hidden="true" size={21} />
                  </span>

                  <span
                    className={
                      template.status === "Draft"
                        ? styles.draftBadge
                        : styles.publishedBadge
                    }
                  >
                    {template.status}
                  </span>
                </div>

                <div className={styles.templateCopy}>
                  <p>{template.category}</p>
                  <h3>{template.name}</h3>
                  <span>{template.description}</span>
                </div>

                <div className={styles.templateMeta}>
                  <span>
                    <ListChecks aria-hidden="true" size={14} />
                    {template.steps} steps
                  </span>
                  <span>
                    <Users aria-hidden="true" size={14} />
                    Used {template.usedCount} times
                  </span>
                </div>

                <div className={styles.templateActions}>
                  <Link
                    href={`/demo/admin/workflows/builder?template=${template.id}`}
                  >
                    Customize
                  </Link>
                  <button
                    aria-label={`Duplicate ${template.name}`}
                    type="button"
                  >
                    <Copy aria-hidden="true" size={15} />
                  </button>
                  <button
                    aria-label={`More actions for ${template.name}`}
                    type="button"
                  >
                    <MoreHorizontal aria-hidden="true" size={16} />
                  </button>
                </div>
              </article>
            ))}
          </section>
        </>
      ) : (
        <section className={styles.activePanel}>
          <div className={styles.panelHeader}>
            <div>
              <h2>Active workflows</h2>
              <p>Seeded operational instances currently moving through teams.</p>
            </div>
            <Link href="/demo/admin/workflows/builder">
              Open workflow builder
            </Link>
          </div>

          <div className={styles.tableScroller}>
            <table className={styles.workflowTable}>
              <caption className={styles.srOnly}>
                Current active demo workflows
              </caption>
              <thead>
                <tr>
                  <th>Workflow ID</th>
                  <th>Workflow Name</th>
                  <th>Template</th>
                  <th>Initiated By</th>
                  <th>Date Initiated</th>
                  <th>Current Step</th>
                  <th>Status</th>
                  <th>
                    <span className={styles.srOnly}>Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {activeWorkflowRows.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <Link href="/demo/admin/workflows/builder">
                        {row.id}
                      </Link>
                    </td>
                    <td>{row.name}</td>
                    <td>{row.template}</td>
                    <td>{row.initiatedBy}</td>
                    <td>{row.initiatedAt}</td>
                    <td>{row.currentStep}</td>
                    <td>
                      <span
                        className={`${styles.statusBadge} ${statusClass(
                          row.status,
                        )}`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td>
                      <button aria-label={`Open ${row.id}`} type="button">
                        <MoreHorizontal aria-hidden="true" size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className={styles.overviewGrid}>
        <article className={styles.popularPanel}>
          <div className={styles.panelHeader}>
            <div>
              <h2>Popular Workflow Templates</h2>
              <p>Frequently used workflows at Savannah Technical College.</p>
            </div>
            <button onClick={() => setTab("templates")} type="button">
              View all templates
            </button>
          </div>

          <div className={styles.popularGrid}>
            {workflowTemplates.slice(0, 4).map((template) => (
              <Link
                className={styles.popularCard}
                href={`/demo/admin/workflows/builder?template=${template.id}`}
                key={template.id}
              >
                <span
                  className={styles.templateIcon}
                  data-tone={template.tone}
                >
                  <FileText aria-hidden="true" size={20} />
                </span>
                <span>
                  <strong>{template.name}</strong>
                  <small>{template.description}</small>
                  <em>Used {template.usedCount} times</em>
                </span>
              </Link>
            ))}
          </div>
        </article>

        <aside className={styles.quickPanel}>
          <div className={styles.panelHeader}>
            <div>
              <h2>Quick Actions</h2>
              <p>Configure how work moves through the institution.</p>
            </div>
          </div>

          <div className={styles.quickList}>
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link href={action.href} key={action.title}>
                  <span>
                    <Icon aria-hidden="true" size={17} />
                  </span>
                  <div>
                    <strong>{action.title}</strong>
                    <small>{action.detail}</small>
                  </div>
                  <ArrowRight aria-hidden="true" size={15} />
                </Link>
              );
            })}
          </div>
        </aside>
      </section>

      <section className={styles.bottomGrid}>
        <article className={styles.activePanel}>
          <div className={styles.panelHeader}>
            <div>
              <h2>Active Workflows</h2>
              <p>Latest workflow instances requiring operational attention.</p>
            </div>
            <button onClick={() => setTab("active")} type="button">
              View all active workflows
            </button>
          </div>

          <div className={styles.compactWorkflowList}>
            {activeWorkflowRows.slice(0, 5).map((row) => (
              <div key={row.id}>
                <span className={styles.workflowDot}>
                  <GitBranch aria-hidden="true" size={15} />
                </span>
                <div>
                  <strong>{row.name}</strong>
                  <small>
                    {row.id} · {row.currentStep}
                  </small>
                </div>
                <span
                  className={`${styles.statusBadge} ${statusClass(row.status)}`}
                >
                  {row.status}
                </span>
              </div>
            ))}
          </div>
        </article>

        <aside className={styles.activityPanel}>
          <div className={styles.panelHeader}>
            <div>
              <h2>Recent Workflow Activity</h2>
              <p>Seeded events from the last three hours.</p>
            </div>
          </div>

          <div className={styles.activityList}>
            {recentWorkflowActivity.map((activity) => (
              <div className={styles.activityItem} key={activity.title}>
                <span data-tone={activity.tone}>
                  {activity.tone === "orange" ? (
                    <Clock3 aria-hidden="true" size={15} />
                  ) : activity.tone === "purple" ? (
                    <FileText aria-hidden="true" size={15} />
                  ) : activity.tone === "blue" ? (
                    <Users aria-hidden="true" size={15} />
                  ) : (
                    <CheckCircle2 aria-hidden="true" size={15} />
                  )}
                </span>
                <div>
                  <strong>{activity.title}</strong>
                  <small>{activity.detail}</small>
                  <em>{activity.time}</em>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <footer className={styles.demoNotice}>
        <Settings2 aria-hidden="true" size={16} />
        <span>
          Demo-only configuration. Buttons update browser state or open the
          visual builder; no production workflow is published.
        </span>
      </footer>
    </main>
  );
}
