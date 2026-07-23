"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  ChevronRight,
  ClipboardList,
  Clock3,
  Inbox,
  TimerReset,
  UserRoundCog,
} from "lucide-react";

import type { SupervisorDashboardModel } from "@/features/supervisor-approvals/model/supervisor-approval-model";

import styles from "./supervisor-workspace.module.css";

type SupervisorDashboardBodyProps = {
  readonly model: SupervisorDashboardModel;
};

const metricIcons = {
  requests: ClipboardList,
  approval: BadgeCheck,
  overdue: Clock3,
  unassigned: UserRoundCog,
  handoff: Inbox,
  duration: TimerReset,
} as const;

function StatusBadge({
  label,
  tone,
}: {
  readonly label: string;
  readonly tone: string;
}) {
  return (
    <span
      className={styles.statusBadge}
      data-tone={tone}
    >
      {label}
    </span>
  );
}

export function SupervisorDashboardBody({
  model,
}: SupervisorDashboardBodyProps) {
  return (
    <main
      className={styles.workspace}
      data-d29r6-supervisor-dashboard="true"
    >
      <header className={styles.pageIntro}>
        <div>
          <h1>{model.title}</h1>
          <p>{model.subtitle}</p>
        </div>

        <div className={styles.pageActions}>
          <Link
            href="/demo/reports"
            className="button-base button-compact button-secondary"
          >
            Department report
          </Link>
        </div>
      </header>

      <section
        className={styles.metricGrid}
        aria-label="Supervisor operational metrics"
      >
        {model.metrics.map((metric) => {
          const Icon =
            metricIcons[metric.icon];

          return (
            <article
              key={metric.id}
              className={styles.metricCard}
              data-tone={metric.tone}
            >
              <span
                className={styles.metricIcon}
                aria-hidden="true"
              >
                <Icon />
              </span>

              <div className={styles.metricCopy}>
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
              </div>

              <Link
                href={metric.href}
                className={[
                  styles.actionLink,
                  styles.metricAction,
                ].join(" ")}
              >
                {metric.actionLabel}
                <ArrowRight aria-hidden="true" />
              </Link>
            </article>
          );
        })}
      </section>

      <div className={styles.dashboardGrid}>
        <div className={styles.stack}>
          <section
            id="approvals"
            className={styles.panel}
          >
            <header className={styles.panelHeader}>
              <div>
                <h2>Approval Queue</h2>
                <p>
                  Registrar decisions ready for review.
                </p>
              </div>
              <Link
                href="/demo/supervisor/approvals/REQ-DEMO-001"
                className={styles.actionLink}
              >
                Open next approval
                <ArrowRight aria-hidden="true" />
              </Link>
            </header>

            <div className={styles.tableViewport}>
              <table
                className={styles.approvalTable}
                aria-label="Registrar approval queue"
              >
                <thead>
                  <tr>
                    <th style={{ width: "25%" }}>
                      Request
                    </th>
                    <th style={{ width: "19%" }}>
                      Applicant
                    </th>
                    <th style={{ width: "14%" }}>
                      Owner
                    </th>
                    <th style={{ width: "11%" }}>
                      Finance
                    </th>
                    <th style={{ width: "13%" }}>
                      Due Date
                    </th>
                    <th style={{ width: "10%" }}>
                      Status
                    </th>
                    <th style={{ width: "5%" }}>
                      Priority
                    </th>
                    <th style={{ width: "3%" }}>
                      <span className="sr-only">
                        Open
                      </span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {model.approvals.map(
                    (approval) => (
                      <tr key={approval.requestId}>
                        <td>
                          <span
                            className={
                              styles.stackCell
                            }
                          >
                            <strong>
                              {
                                approval.requestTitle
                              }
                            </strong>
                            <span className="text-reference">
                              {approval.requestId}
                            </span>
                          </span>
                        </td>
                        <td>
                          <span
                            className={
                              styles.stackCell
                            }
                          >
                            <strong>
                              {
                                approval.applicantName
                              }
                            </strong>
                            <span className="text-reference">
                              {
                                approval.applicantReference
                              }
                            </span>
                          </span>
                        </td>
                        <td>
                          {
                            approval.ownerDepartment
                          }
                        </td>
                        <td>
                          <span
                            className={
                              styles.resultBadge
                            }
                            data-result={
                              approval.financeResult
                            }
                          >
                            {
                              approval.financeResult
                            }
                          </span>
                        </td>
                        <td>
                          <span
                            className={
                              styles.stackCell
                            }
                          >
                            <strong>
                              {approval.dueLabel}
                            </strong>
                            <span>
                              {
                                approval.dueStateLabel
                              }
                            </span>
                          </span>
                        </td>
                        <td>
                          <StatusBadge
                            label={
                              approval.statusLabel
                            }
                            tone={
                              approval.statusTone
                            }
                          />
                        </td>
                        <td>
                          <span
                            className={
                              styles.priorityBadge
                            }
                            data-tone={
                              approval.priorityTone
                            }
                          >
                            {
                              approval.priorityLabel
                            }
                          </span>
                        </td>
                        <td>
                          <Link
                            href={approval.href}
                            className={
                              styles.rowAction
                            }
                            aria-label={`Open ${approval.requestTitle} ${approval.requestId}`}
                          >
                            <ChevronRight
                              aria-hidden="true"
                            />
                          </Link>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>

            <footer className={styles.tableFooter}>
              <span>
                Showing {model.approvals.length} approval
                requests
              </span>
              <Link
                href="/demo/supervisor/approvals/REQ-DEMO-001"
                className={styles.actionLink}
              >
                Review approvals
                <ArrowRight aria-hidden="true" />
              </Link>
            </footer>
          </section>

          <section
            id="officers"
            className={styles.panel}
          >
            <header className={styles.panelHeader}>
              <div>
                <h2>Officer Workload</h2>
                <p>
                  Current assignment and capacity snapshot.
                </p>
              </div>
            </header>

            <div className={styles.tableViewport}>
              <table
                className={styles.officerTable}
                aria-label="Officer workload"
              >
                <thead>
                  <tr>
                    <th style={{ width: "34%" }}>
                      Officer
                    </th>
                    <th style={{ width: "13%" }}>
                      Assigned
                    </th>
                    <th style={{ width: "13%" }}>
                      In Progress
                    </th>
                    <th style={{ width: "12%" }}>
                      Overdue
                    </th>
                    <th style={{ width: "28%" }}>
                      Utilization
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {model.officers.map((officer) => (
                    <tr key={officer.id}>
                      <td>
                        <span
                          className={
                            styles.officerIdentity
                          }
                        >
                          <span
                            className={styles.avatar}
                            aria-hidden="true"
                          >
                            {officer.initials}
                          </span>
                          <span
                            className={
                              styles.stackCell
                            }
                          >
                            <strong>
                              {officer.name}
                            </strong>
                            <span>{officer.role}</span>
                          </span>
                        </span>
                      </td>
                      <td>{officer.assigned}</td>
                      <td>{officer.inProgress}</td>
                      <td>{officer.overdue}</td>
                      <td>
                        <span
                          className={
                            styles.utilization
                          }
                        >
                          <span>
                            {
                              officer.utilizationPercent
                            }
                            %
                          </span>
                          <span
                            className={
                              styles.utilizationTrack
                            }
                            aria-hidden="true"
                          >
                            <span
                              className={
                                styles.utilizationFill
                              }
                              style={{
                                width: `${officer.utilizationPercent}%`,
                              }}
                            />
                          </span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <aside className={styles.stack}>
          <section className={styles.panel}>
            <header className={styles.panelHeader}>
              <div>
                <h2>Stage Timing</h2>
                <p>
                  Average time against the operational target.
                </p>
              </div>
              <Link
                href="/demo/reports"
                className={styles.actionLink}
              >
                Detailed report
                <ArrowRight aria-hidden="true" />
              </Link>
            </header>

            <ul className={styles.stageList}>
              {model.stageTimings.map((stage) => (
                <li
                  key={stage.id}
                  className={styles.stageRow}
                >
                  <div
                    className={
                      styles.stageHeading
                    }
                  >
                    <strong>{stage.label}</strong>
                    <span>
                      {stage.averageLabel}
                    </span>
                  </div>

                  <span
                    className={
                      styles.stageTrack
                    }
                    aria-hidden="true"
                  >
                    <span
                      className={
                        styles.stageFill
                      }
                      data-tone={stage.tone}
                      style={{
                        width: `${stage.widthPercent}%`,
                      }}
                    />
                  </span>

                  <div className={styles.stageMeta}>
                    <span>{stage.targetLabel}</span>
                    <span>
                      {stage.varianceLabel}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section
            id="attention"
            className={styles.panel}
          >
            <header className={styles.panelHeader}>
              <div>
                <h2>Requires Attention</h2>
                <p>
                  Backlog, bottleneck and escalation signals.
                </p>
              </div>
            </header>

            <ul className={styles.attentionList}>
              {model.attentionItems.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className={
                      styles.attentionRow
                    }
                  >
                    <div
                      className={
                        styles.attentionHeading
                      }
                    >
                      <strong>{item.title}</strong>
                      <StatusBadge
                        label={item.statusLabel}
                        tone={item.statusTone}
                      />
                    </div>
                    <p>{item.detail}</p>
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
