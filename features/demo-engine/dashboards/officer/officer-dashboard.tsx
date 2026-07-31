import Link from "next/link";
import type {
  ReactNode,
} from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  BellRing,
  CheckCircle2,
  CircleAlert,
  CircleCheckBig,
  ClipboardList,
  Clock3,
  FileText,
  Inbox,
  ListChecks,
  Mail,
} from "lucide-react";

import type {
  DashboardSemanticTone,
  OfficerActionRequiredItem,
  OfficerDashboardData,
  OfficerHandoffItem,
} from "../data";
import {
  DashboardCard,
  DashboardMetric,
  DashboardMetricStrip,
  DashboardSectionHeading,
  DashboardStatusBadge,
} from "../shared";
import tokenStyles from "../shared/dashboard-tokens.module.css";
import {
  OfficerCaseSignalTabs,
} from "./officer-case-signal-tabs";
import styles from "./officer-dashboard.module.css";
import {
  OfficerRhythmPanel,
} from "./officer-rhythm-panel";
import {
  OfficerWorkPlanTabs,
} from "./officer-work-plan-tabs";

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

function MetricIcon({
  id,
}: {
  readonly id: string;
}) {
  const iconProps = {
    "aria-hidden": true,
    size: 18,
    strokeWidth: 2,
  } as const;

  if (id === "due-today") {
    return <Clock3 {...iconProps} />;
  }

  if (id === "overdue") {
    return <CircleAlert {...iconProps} />;
  }

  if (id === "sla-on-time") {
    return <CircleCheckBig {...iconProps} />;
  }

  return <ListChecks {...iconProps} />;
}

function PanelHeader({
  title,
  description,
  action,
}: {
  readonly title: string;
  readonly description?: string;
  readonly action?: ReactNode;
}) {
  return (
    <div className={styles.panelHeader}>
      <DashboardSectionHeading
        action={action}
        description={description}
        headingLevel={2}
        title={title}
      />
    </div>
  );
}

function InlineAction({
  href,
  label,
  ariaLabel,
}: {
  readonly href: string;
  readonly label: string;
  readonly ariaLabel?: string;
}) {
  return (
    <Link
      aria-label={ariaLabel}
      className={styles.inlineAction}
      href={href}
    >
      <span>{label}</span>
      <ArrowRight
        aria-hidden="true"
        size={12}
        strokeWidth={2}
      />
    </Link>
  );
}

function WorkloadPulse({
  metrics,
}: {
  readonly metrics:
    OfficerDashboardData["workloadPulse"];
}) {
  return (
    <DashboardCard
      className={styles.workloadCard}
      padding="none"
    >
      <PanelHeader title="Workload pulse" />

      <DashboardMetricStrip columns={4}>
        {metrics.map((metric) => (
          <DashboardMetric
            delta={metric.deltaLabel}
            icon={
              <MetricIcon id={metric.id} />
            }
            key={metric.id}
            label={metric.label}
            progress={metric.progress}
            tone={metricTone(
              metric.tone,
            )}
            value={metric.value}
          />
        ))}
      </DashboardMetricStrip>
    </DashboardCard>
  );
}

function RecentHandoffs({
  handoffs,
}: {
  readonly handoffs:
    readonly OfficerHandoffItem[];
}) {
  return (
    <DashboardCard
      className={styles.handoffsCard}
      padding="none"
    >
      <PanelHeader
        action={
          <InlineAction
            href="/demo/officer/department-inbox"
            label="View all"
          />
        }
        title="Recent handoffs"
      />

      <ul className={styles.handoffList}>
        {handoffs.map((handoff) => (
          <li
            className={styles.handoffRow}
            key={handoff.id}
          >
            <span
              aria-hidden="true"
              className={styles.directionIcon}
              data-direction={handoff.direction}
            >
              {handoff.direction ===
              "incoming" ? (
                <ArrowDown
                  size={15}
                  strokeWidth={2}
                />
              ) : handoff.direction ===
                "outgoing" ? (
                <ArrowUp
                  size={15}
                  strokeWidth={2}
                />
              ) : (
                <CheckCircle2
                  size={15}
                  strokeWidth={2}
                />
              )}
            </span>

            <div className={styles.handoffCopy}>
              <strong>{handoff.title}</strong>
              <span>
                {handoff.serviceName}
                {" • "}
                {handoff.requestId}
              </span>
            </div>

            <div className={styles.handoffMeta}>
              <time>
                {handoff.timestampLabel}
              </time>
              <InlineAction
                ariaLabel={`${handoff.action.label}: ${handoff.requestId}`}
                href={handoff.action.href}
                label={handoff.action.label}
              />
            </div>
          </li>
        ))}
      </ul>
    </DashboardCard>
  );
}

function ActivityIcon({
  tone,
}: {
  readonly tone:
    DashboardSemanticTone;
}) {
  const props = {
    "aria-hidden": true,
    size: 14,
    strokeWidth: 2,
  } as const;

  if (tone === "success") {
    return <CheckCircle2 {...props} />;
  }

  if (
    tone === "warning" ||
    tone === "danger"
  ) {
    return <Clock3 {...props} />;
  }

  return <ArrowUp {...props} />;
}

function RecentActivity({
  data,
}: {
  readonly data:
    OfficerDashboardData["recentActivity"];
}) {
  return (
    <DashboardCard
      className={styles.bottomCard}
      padding="compact"
    >
      <DashboardSectionHeading
        action={
          <InlineAction
            href="/demo/officer"
            label="View all activity"
          />
        }
        headingLevel={2}
        title="Recent Activity"
      />

      <ul className={styles.compactList}>
        {data.map((item) => (
          <li key={item.id}>
            <time>{item.timestampLabel}</time>

            <span
              aria-hidden="true"
              className={styles.compactIcon}
              data-tone={item.tone}
            >
              <ActivityIcon
                tone={item.tone}
              />
            </span>

            <div className={styles.compactCopy}>
              <strong>{item.title}</strong>
              <span>{item.description}</span>
            </div>
          </li>
        ))}
      </ul>
    </DashboardCard>
  );
}

function UpNext({
  data,
}: {
  readonly data:
    OfficerDashboardData["upNext"];
}) {
  return (
    <DashboardCard
      className={styles.bottomCard}
      padding="compact"
    >
      <DashboardSectionHeading
        headingLevel={2}
        title="Up Next"
      />

      <ul className={styles.upNextList}>
        {data.map((item) => (
          <li key={item.id}>
            <span
              aria-hidden="true"
              className={styles.compactIcon}
              data-tone={item.tone}
            >
              <FileText
                size={14}
                strokeWidth={2}
              />
            </span>

            <div className={styles.compactCopy}>
              <strong>{item.title}</strong>
              <span>{item.requestId}</span>
            </div>

            <span
              className={styles.dueText}
              data-tone={item.tone}
            >
              {item.dueLabel}
            </span>

            <InlineAction
              ariaLabel={`${item.action.label}: ${item.requestId}`}
              href={item.action.href}
              label={item.action.label}
            />
          </li>
        ))}
      </ul>
    </DashboardCard>
  );
}

function ActionIcon({
  item,
}: {
  readonly item:
    OfficerActionRequiredItem;
}) {
  const props = {
    "aria-hidden": true,
    size: 15,
    strokeWidth: 2,
  } as const;

  if (
    item.id.includes("document")
  ) {
    return <FileText {...props} />;
  }

  if (
    item.id.includes("message")
  ) {
    return <Mail {...props} />;
  }

  if (
    item.id.includes("referral")
  ) {
    return <Inbox {...props} />;
  }

  if (
    item.id.includes("decision")
  ) {
    return <Clock3 {...props} />;
  }

  return <BellRing {...props} />;
}

function ActionRequired({
  data,
}: {
  readonly data:
    OfficerDashboardData["actionRequired"];
}) {
  return (
    <DashboardCard
      className={styles.bottomCard}
      padding="compact"
    >
      <DashboardSectionHeading
        headingLevel={2}
        title="Action Required"
      />

      <ul className={styles.actionList}>
        {data.map((item) => (
          <li key={item.id}>
            <Link
              aria-label={`${item.label}: ${item.count}`}
              href={item.action.href}
            >
              <span
                aria-hidden="true"
                className={styles.actionIcon}
                data-tone={item.tone}
              >
                <ActionIcon item={item} />
              </span>

              <span>{item.label}</span>

              <DashboardStatusBadge
                tone={item.tone}
              >
                {item.count}
              </DashboardStatusBadge>

              <ArrowRight
                aria-hidden="true"
                size={13}
                strokeWidth={2}
              />
            </Link>
          </li>
        ))}
      </ul>
    </DashboardCard>
  );
}

export function OfficerDashboard({
  data,
}: {
  readonly data: OfficerDashboardData;
}) {
  return (
    <main
      className={`${tokenStyles.theme} ${styles.dashboard}`}
      data-dashboard-role="officer"
      data-testid="d31-officer-dashboard"
    >
      <header className={styles.intro}>
        <h1>{data.greeting}</h1>
        <p>{data.dateLabel}</p>
      </header>

      <div className={styles.primaryGrid}>
        <div className={styles.primaryStack}>
          <WorkloadPulse
            metrics={data.workloadPulse}
          />

          <DashboardCard
            className={styles.workPlanCard}
            padding="none"
          >
            <PanelHeader title="Today's work plan" />

            <OfficerWorkPlanTabs
              workPlan={data.workPlan}
            />
          </DashboardCard>
        </div>

        <div className={styles.secondaryStack}>
          <DashboardCard
            className={styles.caseSignalsCard}
            padding="none"
          >
            <PanelHeader title="Case signals" />

            <OfficerCaseSignalTabs
              caseSignals={
                data.caseSignals
              }
            />
          </DashboardCard>

          <RecentHandoffs
            handoffs={
              data.recentHandoffs
            }
          />
        </div>
      </div>

      <div className={styles.bottomGrid}>
        <RecentActivity
          data={data.recentActivity}
        />
        <UpNext data={data.upNext} />
        <ActionRequired
          data={data.actionRequired}
        />
        <OfficerRhythmPanel
          data={data.rhythm}
        />
      </div>
    </main>
  );
}
