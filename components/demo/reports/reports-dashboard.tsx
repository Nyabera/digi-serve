"use client";

import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CalendarDays,
  Clock3,
  Download,
  FileCheck2,
  FileText,
  Info,
  RefreshCw,
  TimerReset,
  TriangleAlert,
  UserRoundCog,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Funnel,
  FunnelChart,
  LabelList,
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

import {
  ATTENTION_ITEMS,
  BACKLOG_DATA,
  DEPARTMENT_SLA,
  KPI_ITEMS,
  SLA_DATA,
  WORKFLOW_DATA,
  WORKLOAD_DATA,
  type KpiItem,
  type KpiTone,
} from "./report-data";
import styles from "./reports-dashboard.module.css";

const KPI_ICONS: Record<KpiItem["id"], LucideIcon> = {
  open: FileText,
  due: Clock3,
  overdue: TriangleAlert,
  turnaround: TimerReset,
};

const ATTENTION_ICONS: Record<(typeof ATTENTION_ITEMS)[number]["id"], LucideIcon> = {
  approval: UserRoundCog,
  handoff: RefreshCw,
  service: FileCheck2,
};

const TONE_CLASS: Record<KpiTone, string> = {
  blue: styles.toneBlue,
  amber: styles.toneAmber,
  coral: styles.toneCoral,
  teal: styles.toneTeal,
};

const CHART_COLORS = {
  navy: "#10234a",
  blue: "#1769ff",
  teal: "#08a99c",
  green: "#079b73",
  amber: "#ffae1a",
  coral: "#ff525c",
  grid: "#e6ecf4",
  muted: "#667694",
};

type ServiceOption = {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
};

type DepartmentOption = {
  readonly id: string;
  readonly name: string;
};

type ReportsDashboardProps = {
  readonly organizationName: string;
  readonly services: readonly ServiceOption[];
  readonly departments: readonly DepartmentOption[];
};

type TooltipEntry = {
  color?: string;
  dataKey?: string | number;
  name?: string | number;
  value?: number | string;
};

type WorkloadTooltipProps = {
  active?: boolean;
  label?: string;
  payload?: TooltipEntry[];
};

type AxisTickProps = {
  x?: number;
  y?: number;
  payload?: { value?: string };
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.sectionTitle}>
      <h2>{children}</h2>
      <Info aria-hidden="true" size={14} strokeWidth={1.8} />
    </div>
  );
}

function WeekTick({ x = 0, y = 0, payload }: AxisTickProps) {
  const [week = "", date = ""] = String(payload?.value ?? "").split("|");

  return (
    <g transform={`translate(${x},${y})`}>
      <text className={styles.axisTick} textAnchor="middle" x={0} y={11}>
        <tspan x={0}>{week}</tspan>
        <tspan className={styles.axisTickSecondary} x={0} dy={14}>
          {date}
        </tspan>
      </text>
    </g>
  );
}

function WorkloadTooltip({ active, label, payload }: WorkloadTooltipProps) {
  if (!active || !payload?.length) return null;

  const [week, date] = String(label ?? "").split("|");
  const valueFor = (key: string) =>
    Number(payload.find((item) => item.dataKey === key)?.value ?? 0);
  const submitted = valueFor("submitted");
  const completed = valueFor("completed");

  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipHeading}>
        <strong>{week}</strong>
        <span>{date}</span>
      </div>
      <div className={styles.tooltipRow}>
        <i style={{ background: CHART_COLORS.blue }} />
        <span>Submitted</span>
        <b>{submitted}</b>
      </div>
      <div className={styles.tooltipRow}>
        <i style={{ background: CHART_COLORS.teal }} />
        <span>Completed</span>
        <b>{completed}</b>
      </div>
      <div className={styles.tooltipRow}>
        <i className={styles.tooltipDashed} />
        <span>Capacity</span>
        <b>{valueFor("capacity")}</b>
      </div>
      <div className={styles.tooltipGap}>
        <span>Gap (Submitted − Completed)</span>
        <b>{submitted - completed}</b>
      </div>
    </div>
  );
}

function InsightBanner({
  tone,
  children,
}: {
  tone: "info" | "warning" | "danger";
  children: React.ReactNode;
}) {
  return (
    <div className={`${styles.insightBanner} ${styles[`insight${tone}`]}`}>
      {tone === "danger" ? (
        <TriangleAlert aria-hidden="true" size={16} />
      ) : tone === "warning" ? (
        <Clock3 aria-hidden="true" size={16} />
      ) : (
        <Info aria-hidden="true" size={16} />
      )}
      <span>{children}</span>
    </div>
  );
}

function KpiCard({ item }: { item: KpiItem }) {
  const Icon = KPI_ICONS[item.id];
  const isPositiveDown = item.id === "overdue" || item.id === "turnaround";
  const TrendIcon = item.changeDirection === "up" ? ArrowUp : ArrowDown;

  return (
    <article className={styles.kpiCard}>
      <div className={`${styles.kpiIcon} ${TONE_CLASS[item.tone]}`}>
        <Icon aria-hidden="true" size={24} strokeWidth={1.8} />
      </div>

      <div className={styles.kpiCopy}>
        <p>{item.label}</p>
        <div className={styles.kpiValue}>
          <strong>{item.value}</strong>
          {item.suffix ? <span>{item.suffix}</span> : null}
        </div>
        <div
          className={`${styles.kpiChange} ${
            item.changeDirection === "neutral"
              ? styles.changeWarning
              : isPositiveDown || item.id === "open"
                ? styles.changeGood
                : styles.changeNeutral
          }`}
        >
          {item.changeDirection !== "neutral" ? (
            <TrendIcon aria-hidden="true" size={13} strokeWidth={2.2} />
          ) : null}
          <b>{item.change}</b>
          {item.context ? <span>{item.context}</span> : null}
        </div>
      </div>

      <div className={styles.sparkline} aria-label={`${item.label} trend`}>
        <ResponsiveContainer height="100%" width="100%">
          <LineChart data={item.sparkline.map((value, index) => ({ index, value }))}>
            <defs>
              <linearGradient id={`spark-${item.id}`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity={0.18} />
                <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Line
              dataKey="value"
              dot={false}
              isAnimationActive={false}
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              type="monotone"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}

function WorkloadChart() {
  return (
    <section className={`${styles.panel} ${styles.primaryPanel}`}>
      <div className={styles.panelHeader}>
        <SectionTitle>Workload vs throughput</SectionTitle>
        <div className={styles.inlineLegend} aria-label="Chart legend">
          <span>
            <i className={styles.legendBlue} />
            Submitted
          </span>
          <span>
            <i className={styles.legendTeal} />
            Completed
          </span>
          <span>
            <i className={styles.legendDashed} />
            Capacity
          </span>
        </div>
      </div>

      <div className={styles.axisCaption}>
        <span>Requests</span>
        <span>Capacity</span>
      </div>

      <div
        className={styles.workloadChart}
        role="img"
        aria-label="Eight-week chart comparing submitted and completed requests against capacity"
      >
        <ResponsiveContainer height="100%" width="100%">
          <ComposedChart data={WORKLOAD_DATA} margin={{ bottom: 24, left: -12, right: 0, top: 8 }}>
            <defs>
              <linearGradient id="submitted-bars" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#1769ff" />
                <stop offset="100%" stopColor="#2f86ff" />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={CHART_COLORS.grid} strokeDasharray="2 3" vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="week"
              interval={0}
              tick={<WeekTick />}
              tickLine={false}
            />
            <YAxis
              axisLine={false}
              domain={[0, 100]}
              tick={{ fill: CHART_COLORS.muted, fontSize: 11 }}
              tickLine={false}
              width={42}
            />
            <Tooltip content={<WorkloadTooltip />} cursor={{ fill: "#eff5ff", opacity: 0.6 }} />
            <ReferenceLine
              ifOverflow="extendDomain"
              stroke={CHART_COLORS.navy}
              strokeDasharray="7 5"
              strokeOpacity={0.78}
              y={80}
            />
            <Bar
              barSize={31}
              dataKey="submitted"
              fill="url(#submitted-bars)"
              isAnimationActive={false}
              name="Submitted"
              radius={[4, 4, 0, 0]}
            />
            <Line
              activeDot={{ fill: CHART_COLORS.teal, r: 5, stroke: "#ffffff", strokeWidth: 2 }}
              dataKey="completed"
              dot={{ fill: CHART_COLORS.teal, r: 4, stroke: "#ffffff", strokeWidth: 2 }}
              isAnimationActive={false}
              name="Completed"
              stroke={CHART_COLORS.teal}
              strokeWidth={2.2}
              type="monotone"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <InsightBanner tone="info">
        <strong>Backlog risk</strong>
        <span aria-hidden="true"> · </span>
        Intake exceeded completions by 14 this week.
      </InsightBanner>
    </section>
  );
}

function SlaHealthChart() {
  return (
    <section className={`${styles.panel} ${styles.primaryPanel}`}>
      <SectionTitle>SLA health</SectionTitle>

      <div className={styles.slaLayout}>
        <div className={styles.donutColumn}>
          <div
            className={styles.donutChart}
            role="img"
            aria-label="SLA status: 74 percent on track, 17 percent due soon, 9 percent overdue"
          >
            <ResponsiveContainer height="100%" width="100%">
              <PieChart>
                <Pie
                  data={SLA_DATA}
                  dataKey="value"
                  innerRadius={57}
                  isAnimationActive={false}
                  outerRadius={92}
                  paddingAngle={1}
                  startAngle={90}
                  endAngle={-270}
                  stroke="#ffffff"
                  strokeWidth={2}
                >
                  {SLA_DATA.map((item) => (
                    <Cell fill={item.color} key={item.name} />
                  ))}
                  <LabelList
                    dataKey="value"
                    fill="#ffffff"
                    fontSize={12}
                    fontWeight={700}
                    formatter={(value) => `${value}%`}
                    position="inside"
                  />
                </Pie>
                <Tooltip
                  contentStyle={{
                    border: "1px solid #dce4ef",
                    borderRadius: 10,
                    boxShadow: "0 10px 24px rgba(16,35,74,.10)",
                    fontSize: 12,
                  }}
                  formatter={(value) => [`${value}%`, "Share"]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className={styles.donutCenter}>
              <strong>74%</strong>
              <span>On track</span>
            </div>
          </div>

          <div className={styles.slaLegend}>
            {SLA_DATA.map((item) => (
              <span key={item.name}>
                <i style={{ background: item.color }} />
                {item.name} ({item.value}%)
              </span>
            ))}
          </div>
        </div>

        <div className={styles.departmentSla}>
          <h3>By department <span>(On track)</span></h3>
          {DEPARTMENT_SLA.map((item) => (
            <div className={styles.progressItem} key={item.department}>
              <div>
                <span>{item.department}</span>
                <strong>{item.value}%</strong>
              </div>
              <div
                aria-label={`${item.department}: ${item.value}% on track`}
                aria-valuemax={100}
                aria-valuemin={0}
                aria-valuenow={item.value}
                className={styles.progressTrack}
                role="progressbar"
              >
                <i style={{ width: `${item.value}%` }} />
              </div>
            </div>
          ))}
          <div className={styles.progressScale} aria-hidden="true">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      <InsightBanner tone="danger">Finance has 5 of 9 overdue requests.</InsightBanner>
    </section>
  );
}

function BacklogAgeChart() {
  return (
    <section className={`${styles.panel} ${styles.secondaryPanel}`}>
      <div className={styles.panelHeader}>
        <SectionTitle>Backlog age by department</SectionTitle>
      </div>
      <div
        className={styles.backlogChart}
        role="img"
        aria-label="Stacked horizontal bar chart showing request age by department"
      >
        <ResponsiveContainer height="100%" width="100%">
          <BarChart
            data={BACKLOG_DATA}
            layout="vertical"
            margin={{ bottom: 8, left: 4, right: 36, top: 8 }}
          >
            <CartesianGrid stroke={CHART_COLORS.grid} strokeDasharray="2 3" horizontal={false} />
            <XAxis
              axisLine={false}
              domain={[0, 40]}
              tick={{ fill: CHART_COLORS.muted, fontSize: 11 }}
              tickLine={false}
              type="number"
            />
            <YAxis
              axisLine={false}
              dataKey="department"
              tick={{ fill: CHART_COLORS.navy, fontSize: 11 }}
              tickLine={false}
              type="category"
              width={108}
            />
            <Tooltip
              contentStyle={{
                border: "1px solid #dce4ef",
                borderRadius: 10,
                boxShadow: "0 10px 24px rgba(16,35,74,.10)",
                fontSize: 12,
              }}
            />
            <Legend
              align="center"
              iconType="square"
              verticalAlign="top"
              wrapperStyle={{ color: CHART_COLORS.muted, fontSize: 11, paddingBottom: 12 }}
            />
            <Bar
              dataKey="zeroTwo"
              fill={CHART_COLORS.green}
              isAnimationActive={false}
              name="0–2 days"
              stackId="age"
            >
              <LabelList
                dataKey="zeroTwoLabel"
                fill="#ffffff"
                fontSize={10}
                fontWeight={700}
                position="center"
              />
            </Bar>
            <Bar
              dataKey="threeFive"
              fill={CHART_COLORS.amber}
              isAnimationActive={false}
              name="3–5 days"
              stackId="age"
            >
              <LabelList
                dataKey="threeFiveLabel"
                fill="#ffffff"
                fontSize={10}
                fontWeight={700}
                position="center"
              />
            </Bar>
            <Bar
              dataKey="sixPlus"
              fill={CHART_COLORS.coral}
              isAnimationActive={false}
              name="6+ days"
              radius={[0, 4, 4, 0]}
              stackId="age"
            >
              <LabelList
                dataKey="sixPlusLabel"
                fill="#ffffff"
                fontSize={10}
                fontWeight={700}
                position="center"
              />
              <LabelList
                dataKey="total"
                fill={CHART_COLORS.navy}
                fontSize={11}
                fontWeight={700}
                offset={10}
                position="right"
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <InsightBanner tone="danger">17 requests have waited more than 6 days.</InsightBanner>
    </section>
  );
}

function WorkflowFunnelChart() {
  return (
    <section className={`${styles.panel} ${styles.secondaryPanel}`}>
      <SectionTitle>Workflow completion</SectionTitle>
      <div className={styles.workflowLayout}>
        <div
          className={styles.funnelChart}
          role="img"
          aria-label="Workflow funnel from 240 submitted requests to 154 completed"
        >
          <ResponsiveContainer height="100%" width="100%">
            <FunnelChart>
              <Tooltip
                contentStyle={{
                  border: "1px solid #dce4ef",
                  borderRadius: 10,
                  boxShadow: "0 10px 24px rgba(16,35,74,.10)",
                  fontSize: 12,
                }}
              />
              <Funnel
                data={WORKFLOW_DATA}
                dataKey="value"
                isAnimationActive={false}
                nameKey="stage"
              >
                {WORKFLOW_DATA.map((item) => (
                  <Cell
                    fill={item.color}
                    key={item.stage}
                    stroke={item.highlight ? CHART_COLORS.amber : "#ffffff"}
                    strokeWidth={item.highlight ? 2.5 : 1.5}
                  />
                ))}
                <LabelList
                  dataKey="value"
                  fill="#ffffff"
                  fontSize={12}
                  fontWeight={700}
                  position="center"
                />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.workflowTableWrap}>
          <table className={styles.workflowTable}>
            <thead>
              <tr>
                <th>Stage</th>
                <th>Requests</th>
                <th>% of previous</th>
              </tr>
            </thead>
            <tbody>
              {WORKFLOW_DATA.map((item) => (
                <tr key={item.stage}>
                  <td>{item.stage}</td>
                  <td>{item.value}</td>
                  <td className={item.highlight ? styles.tableWarning : undefined}>
                    {item.retained}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <InsightBanner tone="warning">
        Largest drop at Finance check <span aria-hidden="true"> · </span> 36 requests (17%).
      </InsightBanner>
    </section>
  );
}

function AttentionPanel() {
  return (
    <section className={`${styles.panel} ${styles.attentionPanel}`}>
      <h2>Needs attention</h2>
      <div className={styles.attentionGrid}>
        {ATTENTION_ITEMS.map((item) => {
          const Icon = ATTENTION_ICONS[item.id];
          return (
            <article className={styles.attentionCard} key={item.id}>
              <div className={`${styles.attentionIcon} ${TONE_CLASS[item.tone]}`}>
                <Icon aria-hidden="true" size={27} strokeWidth={1.7} />
              </div>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <Link href={item.href}>
                  {item.action}
                  <ArrowRight aria-hidden="true" size={14} />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function ReportsDashboard({
  organizationName,
  services,
  departments,
}: ReportsDashboardProps) {
  return (
    <main
      className={styles.reportsRoot}
      data-d29r7-recharts-dashboard="true"
    >
      <header className={styles.pageHeader}>
        <div>
          <h1>Reports &amp; insights</h1>
          <p>
            Operational performance across {organizationName} service operations
          </p>
        </div>

        <div className={styles.filters} aria-label="Report filters">
          <label className={styles.selectControl}>
            <CalendarDays aria-hidden="true" size={16} />
            <span className={styles.srOnly}>Reporting period</span>
            <select defaultValue="30-days">
              <option value="7-days">Last 7 days</option>
              <option value="30-days">Last 30 days</option>
              <option value="term">Current term</option>
            </select>
          </label>
          <label className={styles.selectControl}>
            <span className={styles.srOnly}>Service</span>
            <select defaultValue="all">
              <option value="all">All services</option>
              {services.map((service) => (
                <option key={service.id} value={service.slug}>
                  {service.name}
                </option>
              ))}
            </select>
          </label>
          <label className={styles.selectControl}>
            <span className={styles.srOnly}>Department</span>
            <select defaultValue="all">
              <option value="all">All departments</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
          </label>
          <button className={styles.exportButton} onClick={() => window.print()} type="button">
            <Download aria-hidden="true" size={17} />
            Export report
          </button>
        </div>
      </header>

      <section aria-label="Key performance indicators" className={styles.kpiGrid}>
        {KPI_ITEMS.map((item) => (
          <KpiCard item={item} key={item.id} />
        ))}
      </section>

      <div className={styles.twoColumnGrid}>
        <WorkloadChart />
        <SlaHealthChart />
      </div>

      <div className={styles.twoColumnGrid}>
        <BacklogAgeChart />
        <WorkflowFunnelChart />
      </div>

      <AttentionPanel />
    </main>
  );
}
