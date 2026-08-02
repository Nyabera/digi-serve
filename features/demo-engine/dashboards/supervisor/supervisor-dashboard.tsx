import Link from "next/link";
import type {
  ReactNode,
} from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  ClipboardCheck,
  Clock3,
  FileText,
  Send,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

import type {
  DashboardAction,
  DashboardActivityItem,
  DashboardMetricData,
  DashboardSemanticTone,
  SupervisorAttentionItem,
  SupervisorDashboardData,
  SupervisorExceptionItem,
  SupervisorPerformanceRank,
} from "../data";
import {
  DashboardCard,
  DashboardMetric,
  DashboardMetricStrip,
  DashboardProgress,
  DashboardStatusBadge,
  DashboardZone,
} from "../shared";
import tokenStyles from "../shared/dashboard-tokens.module.css";
import {
  SupervisorSlaTrendChart,
  SupervisorThroughputChart,
} from "./supervisor-dashboard-charts";
import styles from "./supervisor-dashboard.module.css";

type MetricTone = Exclude<
  DashboardSemanticTone,
  "neutral"
>;

function metricTone(
  tone: DashboardSemanticTone,
): MetricTone {
  return tone === "neutral"
    ? "primary"
    : tone;
}

function ActionLink({
  action,
  label,
  href,
  compact = false,
}: {
  readonly action?: DashboardAction;
  readonly label?: string;
  readonly href?: string;
  readonly compact?: boolean;
}) {
  const resolvedHref =
    action?.href ?? href ?? "#";
  const resolvedLabel =
    action?.label ?? label ?? "View";

  return (
    <Link
      className={
        compact
          ? styles.compactAction
          : styles.inlineAction
      }
      href={resolvedHref}
    >
      <span>{resolvedLabel}</span>
      <ArrowRight
        aria-hidden="true"
        size={compact ? 10 : 12}
        strokeWidth={2}
      />
    </Link>
  );
}

function Panel({
  title,
  action,
  children,
  className = "",
  compact = false,
}: {
  readonly title: string;
  readonly action?: ReactNode;
  readonly children: ReactNode;
  readonly className?: string;
  readonly compact?: boolean;
}) {
  return (
    <DashboardCard
      className={`${styles.panel} ${className}`}
      padding="none"
    >
      <header
        className={`${styles.panelHeader} ${
          compact
            ? styles.panelHeaderCompact
            : ""
        }`}
      >
        <h2>{title}</h2>
        {action}
      </header>
      <div className={styles.panelBody}>
        {children}
      </div>
    </DashboardCard>
  );
}

function MetricIcon({
  metric,
}: {
  readonly metric: DashboardMetricData;
}) {
  const props = {
    "aria-hidden": true,
    size: 16,
    strokeWidth: 2,
  } as const;

  switch (metric.id) {
    case "unassigned":
      return <Users {...props} />;
    case "due-today":
      return <Clock3 {...props} />;
    case "overdue":
      return <CircleAlert {...props} />;
    case "pending-approvals":
      return <ClipboardCheck {...props} />;
    case "sla-on-time":
      return <CheckCircle2 {...props} />;
    default:
      return <FileText {...props} />;
  }
}

function DepartmentHealth({
  metrics,
}: {
  readonly metrics:
    SupervisorDashboardData["departmentHealth"];
}) {
  return (
    <DashboardCard
      className={styles.healthStrip}
      padding="none"
    >
      <DashboardMetricStrip
        columns={Math.min(
          6,
          Math.max(1, metrics.length),
        )}
      >
        {metrics.map((metric) => (
          <DashboardMetric
            delta={metric.deltaLabel}
            icon={
              <MetricIcon metric={metric} />
            }
            key={metric.id}
            label={metric.label}
            progress={metric.progress}
            tone={metricTone(metric.tone)}
            value={metric.value}
          />
        ))}
      </DashboardMetricStrip>
    </DashboardCard>
  );
}

function ApprovalLane({
  data,
}: {
  readonly data:
    SupervisorDashboardData["approvalLane"];
}) {
  return (
    <Panel
      action={
        <ActionLink
          href="/demo/supervisor/approvals"
          label="View all"
        />
      }
      className={styles.approvalPanel}
      title="Approval lane"
    >
      <p className={styles.panelEyebrow}>
        Ready for decision
      </p>

      <div className={styles.tableScroller}>
        <table
          aria-label="Requests ready for supervisor approval"
          className={styles.approvalTable}
        >
          <colgroup>
            <col className={styles.approvalRequest} />
            <col className={styles.approvalApplicant} />
            <col className={styles.approvalService} />
            <col className={styles.approvalDue} />
            <col className={styles.approvalStage} />
            <col className={styles.approvalOwner} />
            <col className={styles.approvalDecision} />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">Request</th>
              <th scope="col">Applicant</th>
              <th scope="col">Service</th>
              <th scope="col">Due date</th>
              <th scope="col">Stage</th>
              <th scope="col">Owner</th>
              <th scope="col">
                <span className={styles.srOnly}>
                  Decision
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 5).map((item) => (
              <tr key={item.id}>
                <td>
                  <span className={styles.mono}>
                    {item.requestId}
                  </span>
                </td>
                <td>{item.applicantName}</td>
                <td>{item.serviceName}</td>
                <td>
                  <span className={styles.dueLabel}>
                    {item.dueLabel}
                  </span>
                </td>
                <td>
                  <DashboardStatusBadge
                    size="small"
                    tone="primary"
                  >
                    {item.stageLabel}
                  </DashboardStatusBadge>
                </td>
                <td>{item.ownerName}</td>
                <td>
                  <ActionLink
                    action={item.action}
                    compact
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.panelFooter}>
        <ActionLink
          href="/demo/supervisor/approvals"
          label={`View all approvals (${data.length})`}
        />
      </div>
    </Panel>
  );
}

function AttentionList({
  items,
  emptyLabel,
}: {
  readonly items:
    readonly SupervisorAttentionItem[];
  readonly emptyLabel: string;
}) {
  if (items.length === 0) {
    return (
      <p className={styles.emptyState}>
        {emptyLabel}
      </p>
    );
  }

  return (
    <ul className={styles.signalList}>
      {items.slice(0, 3).map((item) => (
        <li key={item.id}>
          <span
            aria-hidden="true"
            className={styles.signalIcon}
            data-tone={item.tone}
          >
            {item.tone === "danger" ? (
              <CircleAlert size={15} />
            ) : item.tone === "warning" ? (
              <AlertTriangle size={15} />
            ) : (
              <Sparkles size={15} />
            )}
          </span>

          <div>
            <strong>{item.title}</strong>
            <span>{item.description}</span>
          </div>

          <span className={styles.signalCount}>
            {item.count}
          </span>

          <Link
            aria-label={item.action.label}
            href={item.action.href}
          >
            <ChevronRight
              aria-hidden="true"
              size={14}
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}

function ZoneOne({
  data,
}: {
  readonly data:
    SupervisorDashboardData;
}) {
  return (
    <DashboardZone
      id="supervisor-zone-one"
      number="Zone 1"
      title="Department health"
    >
      <DepartmentHealth
        metrics={data.departmentHealth}
      />

      <div className={styles.zoneOneGrid}>
        <ApprovalLane
          data={data.approvalLane}
        />

        <div className={styles.rightStack}>
          <Panel
            action={
              <DashboardStatusBadge
                size="small"
                tone="danger"
              >
                {data.criticalAttention.reduce(
                  (sum, item) =>
                    sum + item.count,
                  0,
                )}
              </DashboardStatusBadge>
            }
            compact
            title="Critical attention"
          >
            <AttentionList
              emptyLabel="No critical items."
              items={data.criticalAttention}
            />
          </Panel>

          <Panel
            action={
              <DashboardStatusBadge
                size="small"
                tone="purple"
              >
                {data.unassignedWork.reduce(
                  (sum, item) =>
                    sum + item.count,
                  0,
                )}
              </DashboardStatusBadge>
            }
            compact
            title="Unassigned work"
          >
            <AttentionList
              emptyLabel="No unassigned work."
              items={data.unassignedWork}
            />
            <ActionLink
              href="/demo/supervisor/assignments"
              label="Assign now"
            />
          </Panel>
        </div>
      </div>
    </DashboardZone>
  );
}

function OfficerCapacity({
  data,
}: {
  readonly data:
    SupervisorDashboardData["officerCapacity"];
}) {
  return (
    <Panel
      action={
        <ActionLink
          href="/demo/supervisor/team"
          label="View team"
        />
      }
      title="Officer workload and capacity"
    >
      <ul className={styles.capacityList}>
        {data.slice(0, 6).map((item) => (
          <li key={item.id}>
            <span className={styles.avatar}>
              {item.officerName
                .split(/\s+/)
                .slice(0, 2)
                .map((part) => part[0])
                .join("")}
            </span>
            <div className={styles.capacityCopy}>
              <strong>{item.officerName}</strong>
              <span>{item.roleLabel}</span>
            </div>
            <DashboardProgress
              label={`${item.utilization}%`}
              tone={metricTone(item.tone)}
              value={item.utilization}
            />
            <strong
              className={styles.capacityValue}
              data-tone={item.tone}
            >
              {item.utilization}%
            </strong>
          </li>
        ))}
      </ul>
      <div className={styles.capacityLegend}>
        <span><i data-tone="success" />0–59% Good</span>
        <span><i data-tone="warning" />60–85% Moderate</span>
        <span><i data-tone="danger" />86–100% High</span>
      </div>
    </Panel>
  );
}

function AssignmentCentre({
  data,
}: {
  readonly data:
    SupervisorDashboardData["assignmentCentre"];
}) {
  return (
    <Panel
      action={
        <span className={styles.recommendationCount}>
          Recommendations {data.length}
        </span>
      }
      title="Assignment centre"
    >
      <ul className={styles.assignmentList}>
        {data.slice(0, 4).map((item) => (
          <li key={item.id}>
            <span
              aria-hidden="true"
              className={styles.assignmentIcon}
            >
              <CheckCircle2 size={15} />
            </span>
            <div>
              <strong>{item.serviceName}</strong>
              <span>
                {item.recommendedOfficerName}
                {" · "}
                {item.estimatedDurationLabel}
              </span>
              <small>
                Skills match: {item.skillMatch}%
              </small>
            </div>
            <ActionLink
              action={item.action}
              compact
            />
          </li>
        ))}
      </ul>
      <ActionLink
        href="/demo/supervisor/assignments"
        label="View all recommendations"
      />
    </Panel>
  );
}

function DepartmentQueue({
  data,
}: {
  readonly data:
    SupervisorDashboardData["departmentQueue"];
}) {
  return (
    <Panel
      action={
        <ActionLink
          href="/demo/supervisor/department-queue"
          label="View all"
        />
      }
      title="Department work queue"
    >
      <div className={styles.queueTabs}>
        <button type="button">
          All
          <span>
            {data.reduce(
              (sum, item) =>
                sum + item.count,
              0,
            )}
          </span>
        </button>
        <button type="button">My queue</button>
        <button type="button">Team</button>
      </div>

      <div className={styles.tableScroller}>
        <table
          aria-label="Department work queue summary"
          className={styles.queueTable}
        >
          <thead>
            <tr>
              <th scope="col">Service</th>
              <th scope="col">Count</th>
              <th scope="col">Due today</th>
              <th scope="col">Overdue</th>
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 6).map((item) => (
              <tr key={item.id}>
                <td>{item.serviceName}</td>
                <td>{item.count}</td>
                <td data-tone="warning">
                  {item.dueToday}
                </td>
                <td data-tone="danger">
                  {item.overdue}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function HandoffControl({
  data,
}: {
  readonly data:
    SupervisorDashboardData["handoffControl"];
}) {
  return (
    <Panel
      action={
        <ActionLink
          href="/demo/supervisor/handoffs"
          label="View all handoffs"
        />
      }
      title="Handoff control"
    >
      <ul className={styles.handoffList}>
        {data.slice(0, 4).map((item) => (
          <li key={item.id}>
            <span
              aria-hidden="true"
              className={styles.handoffIcon}
            >
              <Send size={14} />
            </span>
            <div>
              <strong>{item.stageLabel}</strong>
              <span>
                From: {item.fromLabel}
                {" → "}
                To: {item.toLabel}
              </span>
              <small>{item.contextLabel}</small>
            </div>
            <time>{item.timestampLabel}</time>
            <ActionLink
              action={item.action}
              compact
            />
          </li>
        ))}
      </ul>
    </Panel>
  );
}

function ExceptionList({
  items,
}: {
  readonly items:
    readonly SupervisorExceptionItem[];
}) {
  return (
    <ul className={styles.exceptionList}>
      {items.slice(0, 4).map((item) => (
        <li key={item.id}>
          <span
            aria-hidden="true"
            className={styles.exceptionIcon}
            data-tone={item.tone}
          >
            {item.tone === "danger" ? (
              <CircleAlert size={14} />
            ) : item.tone === "warning" ? (
              <AlertTriangle size={14} />
            ) : (
              <CheckCircle2 size={14} />
            )}
          </span>
          <div>
            <strong>{item.title}</strong>
            <span>{item.description}</span>
          </div>
          <b>{item.count}</b>
          <ActionLink
            action={item.action}
            compact
          />
        </li>
      ))}
    </ul>
  );
}

function ZoneTwo({
  data,
}: {
  readonly data:
    SupervisorDashboardData;
}) {
  return (
    <DashboardZone
      id="supervisor-zone-two"
      number="Zone 2"
      title="Work distribution and control"
    >
      <div className={styles.zoneTwoTop}>
        <OfficerCapacity
          data={data.officerCapacity}
        />
        <AssignmentCentre
          data={data.assignmentCentre}
        />
        <DepartmentQueue
          data={data.departmentQueue}
        />
      </div>

      <div className={styles.zoneTwoBottom}>
        <HandoffControl
          data={data.handoffControl}
        />
        <Panel
          action={
            <DashboardStatusBadge
              size="small"
              tone="danger"
            >
              {data.escalations.reduce(
                (sum, item) =>
                  sum + item.count,
                0,
              )}
            </DashboardStatusBadge>
          }
          title="Escalations and exceptions"
        >
          <ExceptionList
            items={data.escalations}
          />
        </Panel>
        <Panel
          action={
            <DashboardStatusBadge
              size="small"
              tone="warning"
            >
              {data.documentPaymentExceptions.reduce(
                (sum, item) =>
                  sum + item.count,
                0,
              )}
            </DashboardStatusBadge>
          }
          title="Document & payment exceptions"
        >
          <ExceptionList
            items={
              data.documentPaymentExceptions
            }
          />
        </Panel>
      </div>
    </DashboardZone>
  );
}

function ServiceFlow({
  data,
}: {
  readonly data:
    SupervisorDashboardData["serviceFlow"];
}) {
  const slaOnTime = Math.round(
    data.reduce(
      (sum, item) =>
        sum +
        Math.min(
          100,
          (item.targetHours /
            Math.max(
              item.averageDurationHours,
              0.1,
            )) *
            100,
        ),
      0,
    ) / Math.max(1, data.length),
  );

  return (
    <Panel title="Service flow performance">
      <p className={styles.panelEyebrow}>
        Average time against target
      </p>

      <div className={styles.stageFlow}>
        {data.slice(0, 4).map(
          (stage, index) => (
            <article
              data-tone={stage.tone}
              key={stage.id}
            >
              <span>{stage.label}</span>
              <strong>
                {stage.averageDurationHours}h avg.
              </strong>
              <small>
                Target {stage.targetHours}h
              </small>
              <DashboardProgress
                tone={metricTone(stage.tone)}
                value={Math.min(
                  100,
                  (stage.targetHours /
                    Math.max(
                      stage.averageDurationHours,
                      0.1,
                    )) *
                    100,
                )}
              />
              <b>{stage.inProgress}</b>
              <em>In progress</em>
              {index < 3 ? (
                <ChevronRight
                  aria-hidden="true"
                  className={styles.flowArrow}
                  size={16}
                />
              ) : null}
            </article>
          ),
        )}
      </div>

      <div className={styles.flowSummary}>
        <div className={styles.slaMiniRing}>
          <strong>{slaOnTime}%</strong>
          <span>Overall SLA on time</span>
        </div>
        <span>
          <i data-tone="danger" />
          Overdue
          <b>
            {data.filter(
              (item) =>
                item.tone === "danger",
            ).length}
          </b>
        </span>
        <span>
          <i data-tone="warning" />
          Due today
          <b>
            {data.filter(
              (item) =>
                item.tone === "warning",
            ).length}
          </b>
        </span>
        <span>
          <i data-tone="success" />
          Completed today
          <b>
            {data.reduce(
              (sum, item) =>
                sum + item.inProgress,
              0,
            )}
          </b>
        </span>
      </div>
    </Panel>
  );
}

function RankingList({
  items,
}: {
  readonly items:
    readonly SupervisorPerformanceRank[];
}) {
  return (
    <ol className={styles.rankingList}>
      {items.slice(0, 5).map(
        (item, index) => (
          <li key={item.id}>
            <span>{index + 1}</span>
            <div>
              <strong>{item.label}</strong>
              <small>
                {item.secondaryLabel}
              </small>
            </div>
            <b data-tone={item.tone}>
              {item.score}%
            </b>
          </li>
        ),
      )}
    </ol>
  );
}

function ApplicantExperience({
  data,
}: {
  readonly data:
    SupervisorDashboardData["applicantExperience"];
}) {
  return (
    <div className={styles.csat}>
      <div className={styles.csatScore}>
        <strong>{data.score}</strong>
        <span>
          {[1, 2, 3, 4, 5].map(
            (value) => (
              <Star
                aria-hidden="true"
                fill={
                  value <=
                  Math.round(data.score)
                    ? "currentColor"
                    : "none"
                }
                key={value}
                size={12}
              />
            ),
          )}
        </span>
        <small>
          From {data.responseCount} responses
        </small>
      </div>
      <ul>
        {data.distribution.map((item) => (
          <li key={item.id}>
            <span>{item.label}</span>
            <DashboardProgress
              tone={metricTone(
                item.tone ?? "primary",
              )}
              value={
                item.percentage ??
                item.value
              }
            />
            <b>
              {item.percentage ??
                item.value}
              %
            </b>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PerformanceInsights({
  data,
}: {
  readonly data:
    SupervisorDashboardData["performanceInsights"];
}) {
  return (
    <ul className={styles.insightList}>
      {data.slice(0, 4).map((item) => (
        <li key={item.id}>
          <span data-tone={item.tone}>
            <Sparkles size={14} />
          </span>
          <div>
            <strong>{item.title}</strong>
            <small>{item.description}</small>
          </div>
        </li>
      ))}
    </ul>
  );
}

function ZoneThree({
  data,
}: {
  readonly data:
    SupervisorDashboardData;
}) {
  return (
    <DashboardZone
      id="supervisor-zone-three"
      number="Zone 3"
      title="Department performance"
    >
      <div className={styles.zoneThreeTop}>
        <ServiceFlow
          data={data.serviceFlow}
        />
        <Panel title="SLA trend">
          <SupervisorSlaTrendChart
            points={data.slaTrend}
          />
        </Panel>
      </div>

      <div className={styles.performanceGrid}>
        <Panel
          action={
            <ActionLink
              href="/demo/supervisor/reports"
              label="View all"
            />
          }
          title="Officer performance"
        >
          <RankingList
            items={data.officerPerformance}
          />
        </Panel>

        <Panel
          action={
            <ActionLink
              href="/demo/supervisor/reports"
              label="View all"
            />
          }
          title="Service performance"
        >
          <RankingList
            items={data.servicePerformance}
          />
        </Panel>

        <Panel
          action={
            <ActionLink
              href="/demo/supervisor/reports"
              label="View details"
            />
          }
          title="Department throughput"
        >
          <SupervisorThroughputChart
            data={data.throughput}
          />
        </Panel>

        <Panel
          action={
            <ActionLink
              href="/demo/supervisor/reports"
              label="View feedback"
            />
          }
          title="Applicant experience (CSAT)"
        >
          <ApplicantExperience
            data={data.applicantExperience}
          />
        </Panel>

        <Panel title="Performance insights">
          <PerformanceInsights
            data={data.performanceInsights}
          />
        </Panel>
      </div>
    </DashboardZone>
  );
}

function ActivityList({
  items,
}: {
  readonly items:
    readonly DashboardActivityItem[];
}) {
  return (
    <ul className={styles.activityList}>
      {items.slice(0, 5).map((item) => (
        <li key={item.id}>
          <span
            aria-hidden="true"
            data-tone={item.tone}
          >
            {item.tone === "success" ? (
              <CheckCircle2 size={13} />
            ) : item.tone === "danger" ? (
              <CircleAlert size={13} />
            ) : (
              <Activity size={13} />
            )}
          </span>
          <div>
            <strong>{item.title}</strong>
            <small>{item.description}</small>
          </div>
          <time>{item.timestampLabel}</time>
          {item.action ? (
            <ActionLink
              action={item.action}
              compact
            />
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function AuditHighlights({
  data,
}: {
  readonly data:
    SupervisorDashboardData["auditHighlights"];
}) {
  return (
    <div className={styles.auditHighlights}>
      <dl>
        <div>
          <dt>Decisions made</dt>
          <dd>{data.decisionsMade}</dd>
        </div>
        <div>
          <dt>Handoffs created</dt>
          <dd>{data.handoffsCreated}</dd>
        </div>
        <div>
          <dt>Escalations</dt>
          <dd>{data.escalations}</dd>
        </div>
        <div>
          <dt>Audit events</dt>
          <dd>{data.auditEvents}</dd>
        </div>
      </dl>

      <strong>Top audit signals</strong>
      <ul>
        {data.signals.slice(0, 4).map(
          (signal) => (
            <li key={signal}>
              <CheckCircle2
                aria-hidden="true"
                size={12}
              />
              {signal}
            </li>
          ),
        )}
      </ul>

      <ActionLink action={data.action} />
    </div>
  );
}

function Reports({
  data,
}: {
  readonly data:
    SupervisorDashboardData["reports"];
}) {
  return (
    <div className={styles.reportGrid}>
      {data.slice(0, 4).map((item) => (
        <article key={item.id}>
          <span
            aria-hidden="true"
            className={styles.reportIcon}
          >
            <BarChart3 size={16} />
          </span>
          <div>
            <strong>{item.title}</strong>
            <small>{item.description}</small>
          </div>
          <div>
            <ActionLink
              action={item.runAction}
              compact
            />
            <ActionLink
              action={item.scheduleAction}
              compact
            />
          </div>
        </article>
      ))}
    </div>
  );
}

function ZoneFour({
  data,
}: {
  readonly data:
    SupervisorDashboardData;
}) {
  return (
    <DashboardZone
      id="supervisor-zone-four"
      number="Zone 4"
      title="Oversight and governance"
    >
      <div className={styles.zoneFourTop}>
        <Panel
          action={
            <ActionLink
              href="/demo/supervisor/audit"
              label="View all"
            />
          }
          title="Recent decisions"
        >
          <ActivityList
            items={data.recentDecisions}
          />
        </Panel>

        <Panel
          action={
            <ActionLink
              href="/demo/supervisor/audit-trail"
              label="View all"
            />
          }
          title="Department activity"
        >
          <ActivityList
            items={data.departmentActivity}
          />
        </Panel>

        <Panel
          action={
            <ActionLink
              action={
                data.auditHighlights.action
              }
            />
          }
          title="Audit highlights"
        >
          <AuditHighlights
            data={data.auditHighlights}
          />
        </Panel>
      </div>

      <div className={styles.zoneFourBottom}>
        <Panel
          action={
            <ActionLink
              href="/demo/supervisor/audit"
              label="View all"
            />
          }
          title="Team notifications"
        >
          <ActivityList
            items={data.teamNotifications}
          />
        </Panel>

        <Panel
          action={
            <ActionLink
              href="/demo/supervisor/reports"
              label="View all reports"
            />
          }
          title="Reports and exports"
        >
          <Reports data={data.reports} />
        </Panel>
      </div>
    </DashboardZone>
  );
}

export function SupervisorDashboard({
  data,
}: {
  readonly data:
    SupervisorDashboardData;
}) {
  return (
    <main
      className={`${tokenStyles.theme} ${styles.dashboard}`}
      data-dashboard-role="supervisor"
      data-dashboard-version="d31-supervisor-zones-v1"
    >
      <header className={styles.intro}>
        <div>
          <h1>{data.greeting}</h1>
          <p>
            {data.identity.departmentName ??
              "Department"}
            <span aria-hidden="true">•</span>
            {data.identity.roleLabel}
          </p>
        </div>

        <div className={styles.introMeta}>
          <CalendarClock
            aria-hidden="true"
            size={14}
          />
          <time>{data.dateLabel}</time>
        </div>
      </header>

      <div className={styles.zones}>
        <ZoneOne data={data} />
        <ZoneTwo data={data} />
        <ZoneThree data={data} />
        <ZoneFour data={data} />
      </div>
    </main>
  );
}
