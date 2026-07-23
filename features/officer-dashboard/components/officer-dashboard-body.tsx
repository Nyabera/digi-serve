import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUp,
  Building2,
  CalendarCheck2,
  CheckCircle2,
  ChevronDown,
  CircleCheckBig,
  ClipboardList,
  Clock3,
  FileText,
  ShieldCheck,
  UserRound,
  type LucideIcon,
} from "lucide-react";

import type {
  DashboardIcon,
  DashboardMetric,
  DashboardTone,
  HandoffPreviewRow,
  MessagePreviewRow,
  OfficerDashboardModel,
  QueuePreviewRow,
} from "../model/officer-dashboard-model";
import { SlaDonut } from "./sla-donut";
import styles from "./officer-dashboard-body.module.css";

const ICONS: Record<DashboardIcon, LucideIcon> = {
  clipboard: ClipboardList,
  calendar: CalendarCheck2,
  clock: Clock3,
  applicant: UserRound,
  department: Building2,
  completed: CircleCheckBig,
  document: FileText,
  shield: ShieldCheck,
};

function ActionLink({
  href,
  children,
  ariaLabel,
  centred = false,
}: {
  href: string;
  children: ReactNode;
  ariaLabel?: string;
  centred?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={`${styles.actionLink} ${centred ? styles.actionLinkCentred : ""}`}
    >
      <span>{children}</span>
      <ArrowRight aria-hidden="true" size={14} strokeWidth={2.1} />
    </Link>
  );
}

function Panel({
  title,
  titleSuffix,
  action,
  children,
  footer,
  className = "",
  compactHeader = false,
}: {
  title: string;
  titleSuffix?: string;
  action?: { label: string; href: string };
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  compactHeader?: boolean;
}) {
  return (
    <section className={`${styles.panel} ${className}`}>
      <header
        className={`${styles.panelHeader} ${
          compactHeader ? styles.panelHeaderCompact : ""
        }`}
      >
        <h2>
          {title}
          {titleSuffix ? (
            <span className={styles.panelTitleSuffix}> {titleSuffix}</span>
          ) : null}
        </h2>

        {action ? (
          <ActionLink href={action.href}>{action.label}</ActionLink>
        ) : null}
      </header>

      {children}

      {footer ? <footer className={styles.panelFooter}>{footer}</footer> : null}
    </section>
  );
}

function ToneIcon({
  icon,
  tone,
  small = false,
}: {
  icon: DashboardIcon;
  tone: DashboardTone;
  small?: boolean;
}) {
  const Icon = ICONS[icon];

  return (
    <span
      className={`${styles.toneIcon} ${styles[`tone_${tone}`]} ${
        small ? styles.toneIconSmall : ""
      }`}
    >
      <Icon aria-hidden="true" size={small ? 17 : 23} strokeWidth={2} />
    </span>
  );
}

function MetricCard({ metric }: { metric: DashboardMetric }) {
  return (
    <article className={styles.metricCard}>
      <ToneIcon icon={metric.icon} tone={metric.tone} />

      <div className={styles.metricCopy}>
        <p>{metric.label}</p>
        <strong>{metric.value}</strong>
      </div>

      <div className={styles.metricAction}>
        <ActionLink
          href={metric.action.href}
          ariaLabel={metric.action.ariaLabel}
        >
          {metric.action.label}
        </ActionLink>
      </div>
    </article>
  );
}

function PriorityBadge({
  priority,
}: {
  priority: QueuePreviewRow["priority"];
}) {
  const className = {
    High: styles.priorityHigh,
    Medium: styles.priorityMedium,
    Low: styles.priorityLow,
  }[priority];

  return (
    <span className={`${styles.priorityBadge} ${className}`}>{priority}</span>
  );
}

function QueuePreview({ queue }: { queue: OfficerDashboardModel["queue"] }) {
  return (
    <Panel
      title="My Queue"
      titleSuffix="(Next 5)"
      action={{ label: "View full queue", href: queue.fullQueueHref }}
      className={styles.queuePanel}
      footer={
        <div className={styles.queueFooter}>
          <span>Showing 5 of {queue.totalAssigned} assigned requests</span>
          <ActionLink href={queue.fullQueueHref}>View full queue</ActionLink>
        </div>
      }
    >
      <div className={styles.tableScroller}>
        <table className={styles.queueTable}>
          <caption className={styles.srOnly}>
            The next five requests assigned to Grace
          </caption>
          <colgroup>
            <col className={styles.colRequest} />
            <col className={styles.colApplicant} />
            <col className={styles.colType} />
            <col className={styles.colPriority} />
            <col className={styles.colDue} />
            <col className={styles.colStatus} />
            <col className={styles.colDetail} />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">Request</th>
              <th scope="col">Applicant</th>
              <th scope="col">Type</th>
              <th scope="col">Priority</th>
              <th scope="col">Due Date</th>
              <th scope="col">Status</th>
              <th scope="col">
                <span className={styles.srOnly}>Open request</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {queue.rows.map((row) => (
              <QueueRow key={row.requestId} row={row} />
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function QueueRow({ row }: { row: QueuePreviewRow }) {
  return (
    <tr>
      <td>
        <div className={styles.requestCell}>
          <ToneIcon icon={row.requestIcon} tone={row.requestTone} small />
          <div className={styles.stackedCell}>
            <Link href={row.requestHref} className={styles.primaryCellLink}>
              {row.requestTitle}
            </Link>
            <span>{row.requestId}</span>
          </div>
        </div>
      </td>
      <td>
        <div className={styles.stackedCell}>
          <strong>{row.applicantName}</strong>
          <span>{row.applicantReference}</span>
        </div>
      </td>
      <td className={styles.mutedCell}>{row.typeLabel}</td>
      <td>
        <PriorityBadge priority={row.priority} />
      </td>
      <td>
        <div className={styles.stackedCell}>
          <strong>{row.dueDateLabel}</strong>
          <span
            className={
              row.dueState === "overdue" ? styles.overdueText : undefined
            }
          >
            {row.dueStateLabel}
          </span>
        </div>
      </td>
      <td>
        <Link href={row.requestHref} className={styles.compactAction}>
          {row.actionLabel}
        </Link>
      </td>
      <td className={styles.detailCell}>
        <Link
          href={row.requestHref}
          className={styles.iconButton}
          aria-label={`Open ${row.requestTitle}, ${row.requestId}`}
        >
          <ChevronDown aria-hidden="true" size={15} strokeWidth={2} />
        </Link>
      </td>
    </tr>
  );
}

function HandoffIcon({
  direction,
}: {
  direction: HandoffPreviewRow["direction"];
}) {
  const Icon =
    direction === "incoming"
      ? ArrowDownToLine
      : direction === "outgoing"
        ? ArrowUp
        : CheckCircle2;
  const tone = direction === "outgoing" ? "blue" : "green";

  return (
    <span
      className={`${styles.handoffIcon} ${styles[`tone_${tone}`]}`}
      aria-hidden="true"
    >
      <Icon size={18} strokeWidth={2} />
    </span>
  );
}

function RecentHandoffs({
  handoffs,
}: {
  handoffs: OfficerDashboardModel["handoffs"];
}) {
  return (
    <Panel
      title="Recent Handoffs"
      action={{ label: "View all", href: handoffs.allHref }}
      className={styles.handoffsPanel}
    >
      <ol className={styles.handoffList}>
        {handoffs.rows.map((row) => (
          <li key={row.id}>
            <Link href={row.href} className={styles.handoffRow}>
              <HandoffIcon direction={row.direction} />

              <span className={styles.handoffCopy}>
                <strong>{row.title}</strong>
                <span>
                  {row.subject} <b aria-hidden="true">•</b>{" "}
                  {row.requestReference}
                </span>
              </span>

              <time className={styles.rowMeta}>
                <span>{row.dateLabel}</span>
                <span>{row.timeLabel}</span>
              </time>
            </Link>
          </li>
        ))}
      </ol>
    </Panel>
  );
}

function MessageRow({ row }: { row: MessagePreviewRow }) {
  return (
    <li>
      <Link href={row.href} className={styles.messageRow}>
        <span
          className={`${styles.avatar} ${styles[`avatar_${row.initialsTone}`]}`}
          aria-hidden="true"
        >
          {row.initials}
        </span>

        <span className={styles.messageIdentity}>
          <strong>{row.applicantName}</strong>
          <span>{row.subject}</span>
        </span>

        <span className={styles.messagePreview}>{row.preview}</span>

        <time className={styles.rowMeta}>
          <span>{row.dateLabel}</span>
          <span>{row.timeLabel}</span>
        </time>

        <span
          className={`${styles.readBadge} ${
            row.readState === "unread"
              ? styles.unreadBadge
              : styles.readBadgeRead
          }`}
        >
          {row.readState === "unread" ? "Unread" : "Read"}
        </span>
      </Link>
    </li>
  );
}

function RecentMessages({
  messages,
}: {
  messages: OfficerDashboardModel["messages"];
}) {
  return (
    <Panel
      title="Recent Applicant Messages"
      action={{ label: "View full messages", href: messages.allHref }}
      className={styles.messagesPanel}
      compactHeader
      footer={
        <ActionLink href={messages.allHref} centred>
          Go to all messages
        </ActionLink>
      }
    >
      <ol className={styles.messageList}>
        {messages.rows.map((row) => (
          <MessageRow key={row.id} row={row} />
        ))}
      </ol>
    </Panel>
  );
}

function LegendDot({ tone }: { tone: "green" | "orange" | "red" }) {
  return (
    <span
      aria-hidden="true"
      className={`${styles.legendDot} ${styles[`legendDot_${tone}`]}`}
    />
  );
}

function SlaWorkload({ model }: { model: OfficerDashboardModel }) {
  const { sla, workload } = model;

  return (
    <Panel
      title="Department SLA / Workload"
      action={{
        label: "View detailed report",
        href: model.detailedReportHref,
      }}
      className={styles.slaPanel}
      footer={
        <p className={styles.slaNote}>
          SLA target: {sla.targetPercent}% <b aria-hidden="true">•</b>{" "}
          Calculated from requests closed in the last 30 days
        </p>
      }
    >
      <div className={styles.slaContent}>
        <section
          className={styles.slaAnalytics}
          aria-labelledby="sla-performance-heading"
        >
          <h3 id="sla-performance-heading">SLA Performance (This Month)</h3>

          <div className={styles.slaAnalyticsBody}>
            <SlaDonut data={sla} />

            <dl className={styles.slaLegend}>
              <div>
                <dt>
                  <LegendDot tone="green" />
                  On-time
                </dt>
                <dd>
                  {sla.onTime.percent}% ({sla.onTime.count})
                </dd>
              </div>
              <div>
                <dt>
                  <LegendDot tone="orange" />
                  Due soon (≤2 days)
                </dt>
                <dd>
                  {sla.dueSoon.percent}% ({sla.dueSoon.count})
                </dd>
              </div>
              <div>
                <dt>
                  <LegendDot tone="red" />
                  Overdue
                </dt>
                <dd>
                  {sla.overdue.percent}% ({sla.overdue.count})
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <section
          className={styles.workloadCard}
          aria-labelledby="workload-heading"
        >
          <h3 id="workload-heading">Workload Snapshot</h3>
          <dl>
            <div>
              <dt>Total Assigned</dt>
              <dd>{workload.totalAssigned}</dd>
            </div>
            <div>
              <dt>In Progress</dt>
              <dd>{workload.inProgress}</dd>
            </div>
            <div>
              <dt>Due Today</dt>
              <dd>{workload.dueToday}</dd>
            </div>
            <div className={styles.workloadOverdue}>
              <dt>Overdue</dt>
              <dd>{workload.overdue}</dd>
            </div>
          </dl>
        </section>
      </div>
    </Panel>
  );
}

export function OfficerDashboardBody({
  model,
}: {
  model: OfficerDashboardModel;
}) {
  return (
    <main
      className={styles.dashboard}
      data-d29r3p-officer-body="true"
    >
      <div className={styles.intro}>
        <h1>{model.greeting}</h1>
        <p>{model.subtitle}</p>
      </div>

      <section className={styles.metricGrid} aria-label="Today’s work summary">
        {model.metrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </section>

      <div className={styles.dashboardGrid}>
        <div className={styles.dashboardStack}>
          <QueuePreview queue={model.queue} />
          <RecentMessages messages={model.messages} />
        </div>

        <div className={styles.dashboardStack}>
          <RecentHandoffs handoffs={model.handoffs} />
          <SlaWorkload model={model} />
        </div>
      </div>
    </main>
  );
}
