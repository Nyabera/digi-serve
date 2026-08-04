"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  CircleAlert,
  Clock3,
  FileCheck2,
  Inbox,
  RefreshCw,
  Send,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useDemoState } from "@/features/demo/state";
import type { DemoFormValue } from "@/types/demo/demo-state";

type ServiceOption = {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
};

type DepartmentOption = {
  readonly id: string;
  readonly name: string;
};

type OperationalReportsDashboardProps = {
  readonly organizationName: string;
  readonly services: readonly ServiceOption[];
  readonly departments: readonly DepartmentOption[];
};

type UnknownRecord = Record<string, unknown>;

type TimelineEvent = {
  readonly name: string;
  readonly requestId: string | null;
  readonly occurredAt: string | null;
};

type ReferralRecord = {
  readonly status:
    | "PENDING_ACCEPTANCE"
    | "ACCEPTED"
    | "COMPLETED"
    | "DECLINED"
    | "RETURNED_FOR_CLARIFICATION";
  readonly originatingDepartmentName: string;
  readonly receivingDepartmentName: string;
};

type OutcomeRecord = {
  readonly status: "ISSUED" | "DELIVERED" | "COLLECTED";
  readonly deliveryMethod:
    | "CONTROLLED_DOWNLOAD"
    | "PHYSICAL_COLLECTION";
};

type DecisionRecord = {
  readonly decision:
    | "APPROVED"
    | "REJECTED"
    | "RETURNED_FOR_CLARIFICATION";
};

type ChartInsightProps = {
  readonly label: string;
  readonly value: string;
  readonly detail: string;
};

const REFERRAL_FIELD = "__officerReview:referral";
const DECISION_FIELD = "__supervisorDecision:record";
const OUTCOME_FIELD = "__outcome:record";

const chartTooltipStyle = {
  border: "1px solid var(--chart-tooltip-border)",
  borderRadius: "12px",
  background: "var(--chart-tooltip-background)",
  boxShadow: "0 12px 32px rgb(15 23 42 / 12%)",
  fontSize: "12px",
};

const chartTick = {
  fill: "var(--chart-axis)",
  fontSize: 11,
  fontWeight: 600,
};

const chartPalette = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const;

const baseTrend = [
  { period: "Mon", submitted: 7, completed: 4, reopened: 1 },
  { period: "Tue", submitted: 10, completed: 6, reopened: 1 },
  { period: "Wed", submitted: 8, completed: 7, reopened: 0 },
  { period: "Thu", submitted: 12, completed: 8, reopened: 2 },
  { period: "Fri", submitted: 11, completed: 9, reopened: 1 },
  { period: "Sat", submitted: 5, completed: 5, reopened: 0 },
  { period: "Sun", submitted: 6, completed: 4, reopened: 1 },
] as const;

const baseWorkflow = [
  { stage: "Submitted", requests: 14, conversion: 100 },
  { stage: "Officer review", requests: 12, conversion: 86 },
  { stage: "Finance check", requests: 9, conversion: 64 },
  { stage: "Registrar", requests: 7, conversion: 50 },
  { stage: "Issued", requests: 6, conversion: 43 },
  { stage: "Completed", requests: 5, conversion: 36 },
] as const;

const baseDepartmentWorkload = [
  {
    department: "Student Records",
    open: 9,
    completed: 18,
    overdue: 2,
  },
  {
    department: "Finance",
    open: 4,
    completed: 13,
    overdue: 1,
  },
  {
    department: "Registrar",
    open: 2,
    completed: 9,
    overdue: 0,
  },
] as const;

const baseProcessingTime = [
  { stage: "Submission", averageHours: 0.4, targetHours: 1 },
  { stage: "Officer review", averageHours: 6.8, targetHours: 8 },
  { stage: "Finance check", averageHours: 12.5, targetHours: 16 },
  { stage: "Registrar", averageHours: 5.4, targetHours: 8 },
  { stage: "Issuance", averageHours: 2.1, targetHours: 4 },
] as const;

const baseSlaTrend = [
  { week: "W1", onTime: 82, overdue: 18, target: 85 },
  { week: "W2", onTime: 86, overdue: 14, target: 85 },
  { week: "W3", onTime: 88, overdue: 12, target: 85 },
  { week: "W4", onTime: 91, overdue: 9, target: 85 },
  { week: "W5", onTime: 89, overdue: 11, target: 85 },
  { week: "W6", onTime: 93, overdue: 7, target: 85 },
] as const;

const baseServiceDemand = [
  { service: "Transcript Request", requests: 34 },
  { service: "Student Clearance", requests: 18 },
  { service: "Certificate Replacement", requests: 8 },
] as const;

const baseBacklogAge = [
  { age: "0–2 days", open: 8, waiting: 2 },
  { age: "3–5 days", open: 5, waiting: 2 },
  { age: "6–10 days", open: 3, waiting: 2 },
  { age: "11+ days", open: 1, waiting: 1 },
] as const;

function asRecord(value: unknown): UnknownRecord {
  if (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  ) {
    return value as UnknownRecord;
  }

  return {};
}

function firstText(
  record: UnknownRecord,
  keys: readonly string[],
): string | null {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return null;
}

function parseTimelineEvent(
  value: unknown,
): TimelineEvent | null {
  const record = asRecord(value);
  const name = firstText(record, [
    "name",
    "eventName",
    "action",
    "title",
  ]);

  if (!name) {
    return null;
  }

  return {
    name,
    requestId: firstText(record, [
      "requestId",
      "entityId",
    ]),
    occurredAt: firstText(record, [
      "occurredAt",
      "createdAt",
      "timestamp",
      "at",
    ]),
  };
}

function parseJsonRecord(
  value: DemoFormValue | undefined,
): UnknownRecord | null {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  try {
    return asRecord(JSON.parse(value));
  } catch {
    return null;
  }
}

function parseReferral(
  value: DemoFormValue | undefined,
): ReferralRecord | null {
  const record = parseJsonRecord(value);

  if (!record) {
    return null;
  }

  const status = firstText(record, ["status"]);
  const originatingDepartmentName = firstText(record, [
    "originatingDepartmentName",
  ]);
  const receivingDepartmentName = firstText(record, [
    "receivingDepartmentName",
  ]);

  if (
    !status ||
    ![
      "PENDING_ACCEPTANCE",
      "ACCEPTED",
      "COMPLETED",
      "DECLINED",
      "RETURNED_FOR_CLARIFICATION",
    ].includes(status) ||
    !originatingDepartmentName ||
    !receivingDepartmentName
  ) {
    return null;
  }

  return {
    status: status as ReferralRecord["status"],
    originatingDepartmentName,
    receivingDepartmentName,
  };
}

function parseDecision(
  value: DemoFormValue | undefined,
): DecisionRecord | null {
  const record = parseJsonRecord(value);

  if (!record) {
    return null;
  }

  const decision = firstText(record, ["decision"]);

  if (
    !decision ||
    ![
      "APPROVED",
      "REJECTED",
      "RETURNED_FOR_CLARIFICATION",
    ].includes(decision)
  ) {
    return null;
  }

  return {
    decision: decision as DecisionRecord["decision"],
  };
}

function parseOutcome(
  value: DemoFormValue | undefined,
): OutcomeRecord | null {
  const record = parseJsonRecord(value);

  if (!record) {
    return null;
  }

  const status = firstText(record, ["status"]);
  const deliveryMethod = firstText(record, [
    "deliveryMethod",
  ]);

  if (
    !status ||
    !["ISSUED", "DELIVERED", "COLLECTED"].includes(
      status,
    ) ||
    !deliveryMethod ||
    ![
      "CONTROLLED_DOWNLOAD",
      "PHYSICAL_COLLECTION",
    ].includes(deliveryMethod)
  ) {
    return null;
  }

  return {
    status: status as OutcomeRecord["status"],
    deliveryMethod:
      deliveryMethod as OutcomeRecord["deliveryMethod"],
  };
}

function hasEvent(
  events: readonly TimelineEvent[],
  eventName: string,
): boolean {
  return events.some(
    (event) => event.name === eventName,
  );
}

function formatPercentage(
  numerator: number,
  denominator: number,
): string {
  if (denominator <= 0) {
    return "0%";
  }

  return `${Math.round(
    (numerator / denominator) * 100,
  )}%`;
}

function ChartInsight({
  label,
  value,
  detail,
}: ChartInsightProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold text-slate-950">
        {value}
      </p>
      <p className="mt-1 text-xs leading-5 text-slate-500">
        {detail}
      </p>
    </div>
  );
}

function ChartPanel({
  title,
  subtitle,
  children,
  insights,
}: {
  readonly title: string;
  readonly subtitle: string;
  readonly children: React.ReactNode;
  readonly insights: readonly ChartInsightProps[];
}) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-2 border-b border-slate-200 pb-5">
        <h2 className="text-lg font-bold tracking-tight text-slate-950">
          {title}
        </h2>
        <p className="text-sm leading-6 text-slate-600">
          {subtitle}
        </p>
      </div>

      <div className="mt-5 h-[320px]">
        {children}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {insights.map((insight) => (
          <ChartInsight
            key={insight.label}
            {...insight}
          />
        ))}
      </div>
    </article>
  );
}

export function OperationalReportsDashboard({
  organizationName,
  services,
  departments,
}: OperationalReportsDashboardProps) {
  const { state, isHydrated } = useDemoState();
  const [range, setRange] = useState("30-days");
  const [serviceFilter, setServiceFilter] =
    useState("all");

  const analytics = useMemo(() => {
    const timelineEvents = (
      state.timelineEvents as readonly unknown[]
    )
      .map(parseTimelineEvent)
      .filter(
        (event): event is TimelineEvent =>
          event !== null,
      );

    const serviceDrafts = Object.entries(
      state.formDrafts,
    );

    const referrals = serviceDrafts
      .map(([, draft]) =>
        parseReferral(draft[REFERRAL_FIELD]),
      )
      .filter(
        (referral): referral is ReferralRecord =>
          referral !== null,
      );

    const decisions = serviceDrafts
      .map(([, draft]) =>
        parseDecision(draft[DECISION_FIELD]),
      )
      .filter(
        (decision): decision is DecisionRecord =>
          decision !== null,
      );

    const outcomes = serviceDrafts
      .map(([, draft]) =>
        parseOutcome(draft[OUTCOME_FIELD]),
      )
      .filter(
        (outcome): outcome is OutcomeRecord =>
          outcome !== null,
      );

    const stateRecord =
      state as unknown as UnknownRecord;
    const requests = Array.isArray(
      stateRecord.requests,
    )
      ? stateRecord.requests
      : [];

    const liveSubmitted =
      hasEvent(
        timelineEvents,
        "request_submitted",
      ) || requests.length > 0;

    const liveCompleted =
      hasEvent(
        timelineEvents,
        "request_completed",
      ) ||
      outcomes.some(
        (outcome) =>
          outcome.status === "DELIVERED" ||
          outcome.status === "COLLECTED",
      );

    const liveApproved =
      hasEvent(
        timelineEvents,
        "request_approved",
      ) ||
      decisions.some(
        (decision) =>
          decision.decision === "APPROVED",
      );

    const liveIssued =
      hasEvent(
        timelineEvents,
        "document_issued",
      ) || outcomes.length > 0;

    const submitted = 59 + (liveSubmitted ? 1 : 0);
    const completed = 43 + (liveCompleted ? 1 : 0);
    const approved = 35 + (liveApproved ? 1 : 0);
    const issued = 31 + (liveIssued ? 1 : 0);
    const backlog = submitted - completed;

    const pendingHandoffs =
      referrals.filter(
        (referral) =>
          referral.status ===
            "PENDING_ACCEPTANCE" ||
          referral.status === "ACCEPTED",
      ).length || 2;

    const completedHandoffs =
      referrals.filter(
        (referral) =>
          referral.status === "COMPLETED",
      ).length + 8;

    const returnedHandoffs =
      referrals.filter(
        (referral) =>
          referral.status ===
            "RETURNED_FOR_CLARIFICATION" ||
          referral.status === "DECLINED",
      ).length + 1;

    const trend = baseTrend.map((item, index) => ({
      ...item,
      submitted:
        item.submitted +
        (liveSubmitted &&
        index === baseTrend.length - 1
          ? 1
          : 0),
      completed:
        item.completed +
        (liveCompleted &&
        index === baseTrend.length - 1
          ? 1
          : 0),
    }));

    const workflow = baseWorkflow.map((item) => {
      if (
        item.stage === "Submitted" &&
        liveSubmitted
      ) {
        return {
          ...item,
          requests: item.requests + 1,
        };
      }

      if (
        item.stage === "Registrar" &&
        liveApproved
      ) {
        return {
          ...item,
          requests: item.requests + 1,
        };
      }

      if (
        item.stage === "Issued" &&
        liveIssued
      ) {
        return {
          ...item,
          requests: item.requests + 1,
        };
      }

      if (
        item.stage === "Completed" &&
        liveCompleted
      ) {
        return {
          ...item,
          requests: item.requests + 1,
        };
      }

      return item;
    });

    const handoffDistribution = [
      {
        name: "Pending acceptance",
        value: pendingHandoffs,
      },
      {
        name: "Completed",
        value: completedHandoffs,
      },
      {
        name: "Returned or declined",
        value: returnedHandoffs,
      },
    ];

    const departmentWorkload =
      baseDepartmentWorkload.map((item) => {
        const configuredDepartment =
          departments.find(
            (department) =>
              department.name === item.department,
          );

        return {
          ...item,
          department:
            configuredDepartment?.name ??
            item.department,
          open:
            item.open +
            referrals.filter(
              (referral) =>
                referral.receivingDepartmentName ===
                  item.department &&
                referral.status !== "COMPLETED",
            ).length,
          completed:
            item.completed +
            referrals.filter(
              (referral) =>
                referral.receivingDepartmentName ===
                  item.department &&
                referral.status === "COMPLETED",
            ).length,
        };
      });

    const slaTrend = baseSlaTrend.map(
      (item, index) => ({
        ...item,
        onTime:
          item.onTime +
          (liveCompleted &&
          index === baseSlaTrend.length - 1
            ? 1
            : 0),
        overdue:
          item.overdue -
          (liveCompleted &&
          index === baseSlaTrend.length - 1
            ? 1
            : 0),
      }),
    );

    const serviceDemand = baseServiceDemand.map(
      (item) => {
        const service = services.find(
          (candidate) =>
            candidate.name === item.service,
        );

        return {
          service:
            service?.name ?? item.service,
          requests:
            item.requests +
            (liveSubmitted &&
            item.service ===
              "Transcript Request"
              ? 1
              : 0),
        };
      },
    );

    const backlogAge = baseBacklogAge.map(
      (item, index) => ({
        ...item,
        open:
          item.open +
          (!liveCompleted && index === 0 ? 1 : 0),
      }),
    );

    return {
      submitted,
      completed,
      approved,
      issued,
      backlog,
      pendingHandoffs,
      completionRate: formatPercentage(
        completed,
        submitted,
      ),
      approvalRate: formatPercentage(
        approved,
        submitted,
      ),
      issueRate: formatPercentage(
        issued,
        approved,
      ),
      trend,
      workflow,
      handoffDistribution,
      departmentWorkload,
      processingTime: baseProcessingTime,
      slaTrend,
      serviceDemand,
      backlogAge,
      eventCount: timelineEvents.length,
      outcomeCount: outcomes.length,
    };
  }, [
    departments,
    services,
    state,
  ]);

  const serviceName =
    serviceFilter === "all"
      ? "All active services"
      : services.find(
          (service) =>
            service.slug === serviceFilter,
        )?.name ?? "Selected service";

  const rangeLabel =
    range === "7-days"
      ? "Last 7 days"
      : range === "90-days"
        ? "Last 90 days"
        : "Last 30 days";

  const metricCards = [
    {
      label: "Requests submitted",
      value: analytics.submitted,
      detail: `${rangeLabel} · ${serviceName}`,
      icon: Inbox,
    },
    {
      label: "Requests completed",
      value: analytics.completed,
      detail: `${analytics.completionRate} completion rate`,
      icon: CheckCircle2,
    },
    {
      label: "Open backlog",
      value: analytics.backlog,
      detail: "Submitted minus completed",
      icon: Clock3,
    },
    {
      label: "Pending handoffs",
      value: analytics.pendingHandoffs,
      detail: "Pending acceptance or in progress",
      icon: Send,
    },
  ] as const;

  return (
    <main className="min-h-screen bg-[#f4f5f7] text-slate-950">
      <header className="border-b border-white/10 bg-[#07101a] text-white">
        <div className="mx-auto max-w-[1440px] px-5 py-7 sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2557ff]">
                <BarChart3
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              </span>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/45">
                  FAIDIA operational reporting
                </p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight">
                  Workflow performance
                </h1>
                <p className="mt-1 text-sm text-white/60">
                  {organizationName}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/demo/officer"
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/15 px-5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                <ArrowLeft
                  className="mr-2 h-4 w-4"
                  aria-hidden="true"
                />
                Officer workspace
              </Link>

              <Link
                href="/demo/department"
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-white px-5 text-sm font-bold text-slate-950 transition hover:bg-slate-100"
              >
                Department workspace
                <ArrowRight
                  className="ml-2 h-4 w-4"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:py-10">
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                Controlled report filters
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight">
                Operational snapshot
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Eight Recharts visualizations combine a
                stable synthetic baseline with current
                browser-session workflow evidence.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="grid gap-2">
                <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Date range
                </span>
                <select
                  value={range}
                  onChange={(event) =>
                    setRange(event.target.value)
                  }
                  className="min-h-11 rounded-xl border border-slate-300 bg-white px-4 text-sm font-bold outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                >
                  <option value="7-days">
                    Last 7 days
                  </option>
                  <option value="30-days">
                    Last 30 days
                  </option>
                  <option value="90-days">
                    Last 90 days
                  </option>
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Service
                </span>
                <select
                  value={serviceFilter}
                  onChange={(event) =>
                    setServiceFilter(
                      event.target.value,
                    )
                  }
                  className="min-h-11 rounded-xl border border-slate-300 bg-white px-4 text-sm font-bold outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                >
                  <option value="all">
                    All active services
                  </option>
                  {services.map((service) => (
                    <option
                      key={service.id}
                      value={service.slug}
                    >
                      {service.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metricCards.map((metric) => {
            const Icon = metric.icon;

            return (
              <article
                key={metric.label}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-slate-600">
                      {metric.label}
                    </p>
                    <p className="mt-4 text-4xl font-bold tracking-tight">
                      {isHydrated
                        ? metric.value
                        : "—"}
                    </p>
                  </div>

                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                    <Icon
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                  </span>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-500">
                  {metric.detail}
                </p>
              </article>
            );
          })}
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-2">
          <ChartPanel
            title="Request volume trend"
            subtitle="Submitted, completed and reopened work across the current reporting week."
            insights={[
              {
                label: "Peak intake",
                value: "Thursday · 12",
                detail:
                  "Highest new-request volume in the selected period.",
              },
              {
                label: "Completion rate",
                value: analytics.completionRate,
                detail:
                  "Completed requests divided by total submissions.",
              },
              {
                label: "Reopened work",
                value: "6 requests",
                detail:
                  "Requests returned to active processing after review.",
              },
            ]}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={analytics.trend}
                margin={{
                  top: 10,
                  right: 12,
                  left: -16,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  vertical={false}
                  stroke="var(--chart-grid)"
                  strokeDasharray="3 3"
                />
                <XAxis
                  dataKey="period"
                  axisLine={false}
                  tickLine={false}
                  tick={chartTick}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                  tick={chartTick}
                />
                <Tooltip
                  contentStyle={chartTooltipStyle}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="submitted"
                  name="Submitted"
                  stroke="var(--chart-1)"
                  fill="var(--chart-1)"
                  fillOpacity={0.12}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="completed"
                  name="Completed"
                  stroke="var(--chart-2)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="reopened"
                  name="Reopened"
                  stroke="var(--chart-4)"
                  strokeWidth={2}
                  strokeDasharray="5 4"
                  dot={{ r: 3 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartPanel>

          <ChartPanel
            title="Workflow-stage conversion"
            subtitle="Volume and conversion retained as requests move through controlled operational stages."
            insights={[
              {
                label: "Strongest transition",
                value: "Submitted → Review",
                detail:
                  "86% of submitted work reaches officer review.",
              },
              {
                label: "Largest drop",
                value: "Review → Finance",
                detail:
                  "Three requests remain blocked before departmental verification.",
              },
              {
                label: "End-to-end",
                value: "36%",
                detail:
                  "Share reaching recorded completion in the baseline snapshot.",
              },
            ]}
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={analytics.workflow}
                layout="vertical"
                margin={{
                  top: 8,
                  right: 20,
                  left: 20,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  horizontal={false}
                  stroke="var(--chart-grid)"
                  strokeDasharray="3 3"
                />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={chartTick}
                />
                <YAxis
                  type="category"
                  dataKey="stage"
                  width={106}
                  axisLine={false}
                  tickLine={false}
                  tick={chartTick}
                />
                <Tooltip
                  contentStyle={chartTooltipStyle}
                />
                <Legend />
                <Bar
                  dataKey="requests"
                  name="Requests"
                  fill="var(--chart-1)"
                  radius={[0, 6, 6, 0]}
                />
                <Line
                  dataKey="conversion"
                  name="Conversion %"
                  stroke="var(--chart-2)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartPanel>

          <ChartPanel
            title="Handoff position"
            subtitle="Current distribution of departmental referrals across pending, completed and returned work."
            insights={[
              {
                label: "Pending",
                value: String(
                  analytics.pendingHandoffs,
                ),
                detail:
                  "Awaiting acceptance or still in departmental processing.",
              },
              {
                label: "Completed",
                value: "8+",
                detail:
                  "Structured departmental results returned to the parent owner.",
              },
              {
                label: "Exceptions",
                value: "1+",
                detail:
                  "Returned for clarification or declined with a reason.",
              },
            ]}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={
                    analytics.handoffDistribution
                  }
                  dataKey="value"
                  nameKey="name"
                  innerRadius={70}
                  outerRadius={108}
                  paddingAngle={3}
                >
                  {analytics.handoffDistribution.map(
                    (entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={
                          chartPalette[
                            index %
                              chartPalette.length
                          ]
                        }
                      />
                    ),
                  )}
                </Pie>
                <Tooltip
                  contentStyle={chartTooltipStyle}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartPanel>

          <ChartPanel
            title="Department workload"
            subtitle="Open, completed and overdue work by the configured operating departments."
            insights={[
              {
                label: "Highest load",
                value: "Student Records",
                detail:
                  "Carries the largest share of parent-request ownership.",
              },
              {
                label: "Finance throughput",
                value: "13+ completed",
                detail:
                  "Structured verification work returned to originating officers.",
              },
              {
                label: "Overdue total",
                value: "3",
                detail:
                  "Open work currently beyond the synthetic target window.",
              },
            ]}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={
                  analytics.departmentWorkload
                }
                margin={{
                  top: 10,
                  right: 10,
                  left: -14,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  vertical={false}
                  stroke="var(--chart-grid)"
                  strokeDasharray="3 3"
                />
                <XAxis
                  dataKey="department"
                  axisLine={false}
                  tickLine={false}
                  tick={chartTick}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                  tick={chartTick}
                />
                <Tooltip
                  contentStyle={chartTooltipStyle}
                />
                <Legend />
                <Bar
                  dataKey="open"
                  name="Open"
                  stackId="work"
                  fill="var(--chart-4)"
                  radius={[5, 5, 0, 0]}
                />
                <Bar
                  dataKey="overdue"
                  name="Overdue"
                  stackId="work"
                  fill="var(--chart-5)"
                />
                <Bar
                  dataKey="completed"
                  name="Completed"
                  fill="var(--chart-2)"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartPanel>

          <ChartPanel
            title="Average processing time"
            subtitle="Average elapsed hours at each stage compared with the synthetic operating target."
            insights={[
              {
                label: "Slowest stage",
                value: "Finance · 12.5h",
                detail:
                  "Departmental verification remains the longest processing step.",
              },
              {
                label: "Fastest stage",
                value: "Submission · 0.4h",
                detail:
                  "Applicant submission enters the queue almost immediately.",
              },
              {
                label: "All stages",
                value: "Within target",
                detail:
                  "Average time remains below the synthetic target for every stage.",
              },
            ]}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analytics.processingTime}
                layout="vertical"
                margin={{
                  top: 8,
                  right: 20,
                  left: 28,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  horizontal={false}
                  stroke="var(--chart-grid)"
                  strokeDasharray="3 3"
                />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={chartTick}
                  unit="h"
                />
                <YAxis
                  type="category"
                  dataKey="stage"
                  width={102}
                  axisLine={false}
                  tickLine={false}
                  tick={chartTick}
                />
                <Tooltip
                  contentStyle={chartTooltipStyle}
                />
                <Legend />
                <Bar
                  dataKey="averageHours"
                  name="Average hours"
                  fill="var(--chart-1)"
                  radius={[0, 6, 6, 0]}
                />
                <Bar
                  dataKey="targetHours"
                  name="Target hours"
                  fill="var(--chart-3)"
                  radius={[0, 6, 6, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartPanel>

          <ChartPanel
            title="SLA attainment trend"
            subtitle="Weekly share of requests completed on time versus requests breaching the synthetic target."
            insights={[
              {
                label: "Current on-time",
                value: "93%",
                detail:
                  "Latest week is eight points above the synthetic 85% target.",
              },
              {
                label: "Best week",
                value: "Week 6",
                detail:
                  "Highest on-time completion rate in the displayed period.",
              },
              {
                label: "Overdue trend",
                value: "18% → 7%",
                detail:
                  "Synthetic overdue share declined over six weeks.",
              },
            ]}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={analytics.slaTrend}
                margin={{
                  top: 10,
                  right: 12,
                  left: -16,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  vertical={false}
                  stroke="var(--chart-grid)"
                  strokeDasharray="3 3"
                />
                <XAxis
                  dataKey="week"
                  axisLine={false}
                  tickLine={false}
                  tick={chartTick}
                />
                <YAxis
                  domain={[0, 100]}
                  axisLine={false}
                  tickLine={false}
                  tick={chartTick}
                  unit="%"
                />
                <Tooltip
                  contentStyle={chartTooltipStyle}
                />
                <Legend />
                <ReferenceLine
                  y={85}
                  stroke="var(--chart-3)"
                  strokeDasharray="5 5"
                  label="Target 85%"
                />
                <Line
                  type="monotone"
                  dataKey="onTime"
                  name="On time"
                  stroke="var(--chart-2)"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="overdue"
                  name="Overdue"
                  stroke="var(--chart-5)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartPanel>

          <ChartPanel
            title="Service demand mix"
            subtitle="Share of total request demand across the configured public services."
            insights={[
              {
                label: "Primary demand",
                value: "Transcript Request",
                detail:
                  "Represents more than half of the synthetic request mix.",
              },
              {
                label: "Secondary demand",
                value: "Student Clearance",
                detail:
                  "Second-largest service by request volume.",
              },
              {
                label: "Long tail",
                value: "Certificate Replacement",
                detail:
                  "Lower volume but still operationally significant.",
              },
            ]}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.serviceDemand}
                  dataKey="requests"
                  nameKey="service"
                  innerRadius={48}
                  outerRadius={108}
                  paddingAngle={2}
                >
                  {analytics.serviceDemand.map(
                    (entry, index) => (
                      <Cell
                        key={entry.service}
                        fill={
                          chartPalette[
                            index %
                              chartPalette.length
                          ]
                        }
                      />
                    ),
                  )}
                </Pie>
                <Tooltip
                  contentStyle={chartTooltipStyle}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartPanel>

          <ChartPanel
            title="Backlog age profile"
            subtitle="Open work grouped by age, with a separate view of items waiting on another party."
            insights={[
              {
                label: "Young backlog",
                value: "10 items",
                detail:
                  "Most open work is less than three days old.",
              },
              {
                label: "Aged backlog",
                value: "2 items",
                detail:
                  "Requests older than ten days require focused attention.",
              },
              {
                label: "Waiting externally",
                value: "7 items",
                detail:
                  "Applicant or department dependencies are delaying progress.",
              },
            ]}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analytics.backlogAge}
                margin={{
                  top: 10,
                  right: 10,
                  left: -14,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  vertical={false}
                  stroke="var(--chart-grid)"
                  strokeDasharray="3 3"
                />
                <XAxis
                  dataKey="age"
                  axisLine={false}
                  tickLine={false}
                  tick={chartTick}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                  tick={chartTick}
                />
                <Tooltip
                  contentStyle={chartTooltipStyle}
                />
                <Legend />
                <Bar
                  dataKey="open"
                  name="Active work"
                  stackId="age"
                  fill="var(--chart-1)"
                  radius={[5, 5, 0, 0]}
                />
                <Bar
                  dataKey="waiting"
                  name="Waiting externally"
                  stackId="age"
                  fill="var(--chart-4)"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartPanel>
        </section>

        <section className="mt-6 grid gap-5 lg:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-6">
            <RefreshCw
              className="h-5 w-5 text-slate-500"
              aria-hidden="true"
            />
            <p className="mt-4 text-xs font-bold uppercase tracking-wide text-slate-500">
              Refresh model
            </p>
            <h2 className="mt-2 text-lg font-bold">
              Browser-session snapshot
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              The dashboard recomputes from D7 state whenever
              workflow events change.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6">
            <FileCheck2
              className="h-5 w-5 text-slate-500"
              aria-hidden="true"
            />
            <p className="mt-4 text-xs font-bold uppercase tracking-wide text-slate-500">
              Session evidence
            </p>
            <h2 className="mt-2 text-lg font-bold">
              {analytics.eventCount} recorded events
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {analytics.outcomeCount} controlled outcome
              record is represented in the current snapshot.
            </p>
          </article>

          <article className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <CircleAlert
              className="h-5 w-5 text-amber-700"
              aria-hidden="true"
            />
            <p className="mt-4 text-xs font-bold uppercase tracking-wide text-amber-700">
              D25 boundary
            </p>
            <h2 className="mt-2 text-lg font-bold text-amber-950">
              Demonstration analytics only
            </h2>
            <p className="mt-2 text-sm leading-6 text-amber-800">
              These are not production aggregates, officer
              rankings, SLA commitments or executive BI
              reports.
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}
