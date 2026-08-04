"use client";

import {
  cloneElement,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { CSSProperties, ReactElement, ReactNode } from "react";
import {
  ArrowDown,
  ArrowUp,
  Clock3,
  FileText,
  Info,
  TimerReset,
  TriangleAlert,
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
  Line,
  LineChart,
  Pie,
  PieChart,
  ReferenceLine,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";

import {
  BACKLOG_DATA,
  DEMAND_WEEKS,
  DEPARTMENT_SLA,
  HANDOFF_DELAY_DATA,
  KPI_ITEMS,
  OFFICER_DATA,
  OUTCOME_DATA,
  REQUESTS_BY_SERVICE,
  SLA_DATA,
  TURNAROUND_DATA,
  WEEKDAY_LABELS,
  WORKFLOW_DATA,
  WORKLOAD_DATA,
  type KpiItem,
  type KpiTone,
} from "./report-data";
import styles from "./reports-dashboard.module.css";

const MATERIAL = {
  indigo: "#5C6BC0",
  blue: "#42A5F5",
  teal: "#26A69A",
  green: "#66BB6A",
  amber: "#FFB300",
  red: "#EF5350",
  blueGrey: "#78909C",
  grey: "#B0BEC5",
  grid: "#E6EAF0",
  ink: "#1F2A44",
};

const KPI_ICONS: Record<KpiItem["id"], LucideIcon> = {
  open: FileText,
  due: Clock3,
  overdue: TriangleAlert,
  turnaround: TimerReset,
};

const TONE_CLASS: Record<KpiTone, string> = {
  indigo: styles.toneIndigo,
  amber: styles.toneAmber,
  red: styles.toneRed,
  teal: styles.toneTeal,
};

type SizedChartProps = {
  height?: number;
  width?: number;
};

type SizedChartElement = ReactElement<SizedChartProps>;

type ReportsDashboardProps = {
  organizationName?: string;
  services?: readonly unknown[];
  departments?: readonly unknown[];
  viewerRole?: "SUPERVISOR" | "ADMIN";
  scopeLabel?: string;
  lockedDepartment?: string | null;
};

type ChartCardProps = {
  id: string;
  title: string;
  description: string;
  takeaways: string[];
  children: ReactNode;
  openInfoId: string | null;
  onToggleInfo: (id: string) => void;
};

function MeasuredChart({ children }: { children: SizedChartElement }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ height: 0, width: 0 });

  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let animationFrame = 0;

    const measure = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(() => {
        const rect = host.getBoundingClientRect();
        const width = Math.max(0, Math.floor(rect.width));
        const height = Math.max(0, Math.floor(rect.height));

        if (width === 0 || height === 0) return;

        setSize((current) =>
          current.width === width && current.height === height
            ? current
            : { height, width },
        );
      });
    };

    const observer = new ResizeObserver(measure);
    observer.observe(host);
    window.addEventListener("resize", measure);
    measure();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div className={styles.measuredChart} ref={hostRef}>
      {size.width > 0 && size.height > 0
        ? cloneElement(children, {
            height: size.height,
            width: size.width,
          })
        : null}
    </div>
  );
}

function normalizeOption(option: unknown, index: number) {
  if (typeof option === "string") {
    return { label: option, value: option };
  }

  if (option && typeof option === "object") {
    const value = option as Record<string, unknown>;
    const label = String(
      value.name ?? value.label ?? value.title ?? value.slug ?? value.id ?? `Option ${index + 1}`,
    );
    const optionValue = String(value.slug ?? value.id ?? label);
    return { label, value: optionValue };
  }

  return { label: `Option ${index + 1}`, value: String(index) };
}

function KpiCard({ item }: { item: KpiItem }) {
  const Icon = KPI_ICONS[item.id];
  const TrendIcon = item.id === "due" ? null : item.id === "open" ? ArrowUp : ArrowDown;

  return (
    <article className={styles.kpiCard}>
      <div className={`${styles.kpiIcon} ${TONE_CLASS[item.tone]}`}>
        <Icon aria-hidden="true" size={22} strokeWidth={1.9} />
      </div>
      <div className={styles.kpiCopy}>
        <p>{item.label}</p>
        <div className={styles.kpiValue}>
          <strong>{item.value}</strong>
          {item.suffix ? <span>{item.suffix}</span> : null}
        </div>
        <div className={styles.kpiChange}>
          {TrendIcon ? <TrendIcon aria-hidden="true" size={12} /> : null}
          <b>{item.change}</b>
          <span>{item.context}</span>
        </div>
      </div>
      <div className={`${styles.sparkline} ${TONE_CLASS[item.tone]}`}>
        <MeasuredChart>
          <LineChart data={item.sparkline.map((value, index) => ({ index, value }))}>
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
        </MeasuredChart>
      </div>
    </article>
  );
}

function ChartCard({
  id,
  title,
  description,
  takeaways,
  children,
  openInfoId,
  onToggleInfo,
}: ChartCardProps) {
  const infoId = `${id}-info`;
  const isInfoOpen = openInfoId === id;

  return (
    <article className={styles.chartCard}>
      <header className={styles.chartHeader}>
        <h2>{title}</h2>
        <button
          type="button"
          className={styles.infoButton}
          aria-controls={infoId}
          aria-expanded={isInfoOpen}
          aria-label={`Explain ${title}`}
          onClick={() => onToggleInfo(id)}
        >
          <Info aria-hidden="true" size={15} />
        </button>
      </header>

      {isInfoOpen ? (
        <p className={styles.infoPanel} id={infoId} role="status">
          {description}
        </p>
      ) : null}

      <div className={styles.chartBody}>{children}</div>

      <div className={styles.takeawayBlock}>
        <p>Key takeaways</p>
        <ul>
          {takeaways.map((takeaway) => (
            <li key={takeaway}>{takeaway}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function ChartLegend({ items }: { items: Array<{ label: string; color: string; dashed?: boolean }> }) {
  return (
    <div className={styles.legend} aria-label="Chart legend">
      {items.map((item) => (
        <span key={item.label}>
          <i
            className={item.dashed ? styles.legendDashed : undefined}
            style={item.dashed ? undefined : { background: item.color }}
          />
          {item.label}
        </span>
      ))}
    </div>
  );
}

function SlaChart() {
  return (
    <div className={styles.slaLayout}>
      <div className={styles.slaDonut}>
        <MeasuredChart>
          <PieChart>
            <Pie
              data={SLA_DATA}
              dataKey="value"
              innerRadius="58%"
              outerRadius="84%"
              paddingAngle={2}
              isAnimationActive={false}
            >
              {SLA_DATA.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={[MATERIAL.teal, MATERIAL.amber, MATERIAL.red][index]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} requests`, "Volume"]} />
          </PieChart>
        </MeasuredChart>
        <div className={styles.donutLabel} aria-hidden="true">
          <strong>74%</strong>
          <span>on track</span>
        </div>
      </div>

      <div className={styles.departmentSla}>
        <strong>By department</strong>
        {DEPARTMENT_SLA.map((item) => (
          <div className={styles.departmentRow} key={item.department}>
            <div>
              <span>{item.department}</span>
              <b>{item.percentage}%</b>
            </div>
            <div className={styles.departmentTrack}>
              <span style={{ width: `${item.percentage}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HandoffHeatmap() {
  const departments = ["Student Records", "Finance", "Registrar"];
  const maxHours = Math.max(...HANDOFF_DELAY_DATA.map((item) => item.hours));

  return (
    <div className={styles.heatmapWrap}>
      <div className={styles.heatmapGrid} role="table" aria-label="Average handoff delay in hours">
        <span aria-hidden="true" />
        {departments.map((department) => (
          <span className={styles.heatmapColumnLabel} key={department} role="columnheader">
            {department}
          </span>
        ))}

        {departments.map((from) => (
          <div className={styles.heatmapRow} key={from} role="row">
            <span className={styles.heatmapRowLabel} role="rowheader">{from}</span>
            {departments.map((to) => {
              const item = HANDOFF_DELAY_DATA.find(
                (entry) => entry.from === from && entry.to === to,
              );
              const hours = item?.hours ?? 0;
              const intensity = maxHours === 0 ? 0 : hours / maxHours;
              return (
                <span
                  className={styles.heatCell}
                  key={`${from}-${to}`}
                  role="cell"
                  style={{ "--heat": intensity } as CSSProperties}
                  title={`${from} to ${to}: ${hours.toFixed(1)} hours`}
                >
                  {from === to ? "—" : `${hours.toFixed(1)}h`}
                </span>
              );
            })}
          </div>
        ))}
      </div>
      <div className={styles.heatScale} aria-hidden="true">
        <span>Short wait</span>
        <i />
        <span>Long wait</span>
      </div>
    </div>
  );
}

function DemandHeatmap() {
  const maxValue = Math.max(...DEMAND_WEEKS.flatMap((week) => week.values));

  return (
    <div className={styles.calendarWrap}>
      <div className={styles.calendarHeader} aria-hidden="true">
        {DEMAND_WEEKS.map((week) => (
          <span key={week.week}>{week.week}</span>
        ))}
      </div>
      <div className={styles.calendarBody}>
        <div className={styles.weekdayLabels} aria-hidden="true">
          {WEEKDAY_LABELS.map((day) => <span key={day}>{day}</span>)}
        </div>
        <div className={styles.calendarGrid} role="img" aria-label="Daily request volume over twelve weeks">
          {DEMAND_WEEKS.flatMap((week) =>
            week.values.map((value, dayIndex) => (
              <span
                key={`${week.week}-${WEEKDAY_LABELS[dayIndex]}`}
                className={styles.calendarCell}
                style={{ "--demand": value / maxValue } as CSSProperties}
                title={`${week.week}, ${WEEKDAY_LABELS[dayIndex]}: ${value} requests`}
              />
            )),
          )}
        </div>
      </div>
      <div className={styles.heatScale} aria-hidden="true">
        <span>Lower demand</span>
        <i />
        <span>Higher demand</span>
      </div>
    </div>
  );
}

export function ReportsDashboard({
  organizationName = "Savannah Technical College",
  services = [],
  departments = [],
  viewerRole = "SUPERVISOR",
  scopeLabel = "Student Records",
  lockedDepartment = null,
}: ReportsDashboardProps) {
  const [layout, setLayout] = useState<"mosaic" | "three">("mosaic");
  const [openInfoId, setOpenInfoId] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState("90");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  const serviceOptions = useMemo(
    () => services.map(normalizeOption),
    [services],
  );
  const departmentOptions = useMemo(
    () => departments.map(normalizeOption),
    [departments],
  );
  const isDepartmentScoped =
    viewerRole === "SUPERVISOR";
  const activeDepartmentValue =
    lockedDepartment ??
    departmentOptions[0]?.value ??
    "student-records";

  const visibleKpis = useMemo(
    () =>
      isDepartmentScoped
        ? KPI_ITEMS.map((item) => {
            if (item.id === "open") {
              return {
                ...item,
                value: "31",
                change: "3",
                context: "vs prior period",
              };
            }
            if (item.id === "due") {
              return {
                ...item,
                value: "6",
                change: "2",
                context: "need assignment",
              };
            }
            if (item.id === "overdue") {
              return {
                ...item,
                value: "2",
                change: "1",
                context: "fewer than prior period",
              };
            }
            return {
              ...item,
              value: "3.1",
              change: "0.4",
              context: "days faster",
            };
          })
        : KPI_ITEMS,
    [isDepartmentScoped],
  );

  const visibleBacklog = isDepartmentScoped
    ? BACKLOG_DATA.filter((item) =>
        item.department
          .toLowerCase()
          .includes("student record"),
      )
    : BACKLOG_DATA;


  function toggleInfo(id: string) {
    setOpenInfoId((current) => (current === id ? null : id));
  }

  return (
    <div className={styles.reportsRoot} data-d29r16-reports-dashboard="true">
      <header className={styles.pageHeader}>
        <div>
          <h1>Reports &amp; insights</h1>
          <p>{isDepartmentScoped ? `Department performance for ${scopeLabel}` : `Institution-wide operational performance across ${organizationName}`}</p>
        </div>

        <div className={styles.headerControls}>
          <label>
            <span className={styles.srOnly}>Date range</span>
            <select value={dateRange} onChange={(event) => setDateRange(event.target.value)}>
              <option value="30">Last 30 days</option>
              <option value="60">Last 60 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </label>
          <label>
            <span className={styles.srOnly}>Service</span>
            <select value={serviceFilter} onChange={(event) => setServiceFilter(event.target.value)}>
              <option value="all">All services</option>
              {serviceOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
          <label>
            <span className={styles.srOnly}>
              Department
            </span>
            <select
              disabled={isDepartmentScoped}
              value={
                isDepartmentScoped
                  ? activeDepartmentValue
                  : departmentFilter
              }
              onChange={(event) =>
                setDepartmentFilter(event.target.value)
              }
            >
              {isDepartmentScoped ? (
                <option value={activeDepartmentValue}>
                  {scopeLabel}
                </option>
              ) : (
                <>
                  <option value="all">
                    All departments
                  </option>
                  {departmentOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </>
              )}
            </select>
          </label>
          <button type="button" className={styles.exportButton} onClick={() => window.print()}>
            Export report
          </button>
        </div>
      </header>

      <div className={styles.kpiGrid}>
        {visibleKpis.map((item) => <KpiCard item={item} key={item.id} />)}
      </div>

      <div className={styles.reportToolbar}>
        <div>
          <strong>{isDepartmentScoped ? "10 department reports" : "10 institution-wide reports"}</strong>
          <span>Seeded demo data · {dateRange} day view</span>
        </div>
        <div className={styles.layoutSelector} aria-label="Chart grid layout">
          <span>Chart layout</span>
          <button
            type="button"
            aria-label="Use a modular mosaic chart grid"
            aria-pressed={layout === "mosaic"}
            onClick={() => setLayout("mosaic")}
          >
            Mosaic
          </button>
          <button
            type="button"
            aria-label="Use a three-column chart grid"
            aria-pressed={layout === "three"}
            onClick={() => setLayout("three")}
          >
            3 × 1
          </button>
        </div>
      </div>

      <div className={styles.chartGrid} data-layout={layout}>
        <ChartCard
          id="workload"
          title="Workload vs throughput"
          description="Compares weekly submitted, completed and returned requests against the team’s weekly capacity reference."
          takeaways={[
            "The latest week received 16 more requests than it completed.",
            "Submitted volume stayed below the 80-request capacity line.",
            "Returns rose to 7 requests and should be reviewed for avoidable corrections.",
          ]}
          openInfoId={openInfoId}
          onToggleInfo={toggleInfo}
        >
          <ChartLegend items={[
            { label: "Submitted", color: MATERIAL.indigo },
            { label: "Completed", color: MATERIAL.teal },
            { label: "Returned", color: MATERIAL.amber },
            { label: "Capacity", color: MATERIAL.blueGrey, dashed: true },
          ]} />
          <div className={styles.plot}>
            <MeasuredChart>
              <ComposedChart data={WORKLOAD_DATA} margin={{ top: 8, right: 10, left: -18, bottom: 18 }}>
                <CartesianGrid stroke={MATERIAL.grid} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="period" tick={{ fontSize: 9 }} tickFormatter={(value) => String(value).split("|")[0]} />
                <YAxis tick={{ fontSize: 9 }} />
                <Tooltip />
                <Bar dataKey="submitted" fill={MATERIAL.indigo} radius={[4, 4, 0, 0]} />
                <Line dataKey="completed" stroke={MATERIAL.teal} strokeWidth={2} dot={{ r: 3 }} />
                <Line dataKey="returned" stroke={MATERIAL.amber} strokeWidth={2} dot={{ r: 2 }} />
                <ReferenceLine y={80} stroke={MATERIAL.blueGrey} strokeDasharray="5 4" />
              </ComposedChart>
            </MeasuredChart>
          </div>
        </ChartCard>

        <ChartCard
          id="sla"
          title="SLA health"
          description="Shows the number and percentage of open requests that are on track, due soon or overdue, with departmental on-track rates."
          takeaways={[
            "64 of 86 open requests are currently on track.",
            "Finance has the lowest on-track rate at 68%.",
            "Nine overdue requests require immediate ownership.",
          ]}
          openInfoId={openInfoId}
          onToggleInfo={toggleInfo}
        >
          <ChartLegend items={[
            { label: "On track", color: MATERIAL.teal },
            { label: "Due soon", color: MATERIAL.amber },
            { label: "Overdue", color: MATERIAL.red },
          ]} />
          <SlaChart />
        </ChartCard>

        <ChartCard
          id="backlog"
          title="Backlog age by department"
          description="Divides each department’s open requests into 0–2 days, 3–5 days and 6+ days to reveal where older work is accumulating."
          takeaways={[
            "Finance owns the largest backlog with 34 open requests.",
            "Finance also has the most 6+ day requests at 9.",
            "Student Records has 84% of its backlog under six days old.",
          ]}
          openInfoId={openInfoId}
          onToggleInfo={toggleInfo}
        >
          <ChartLegend items={[
            { label: "0–2 days", color: MATERIAL.teal },
            { label: "3–5 days", color: MATERIAL.amber },
            { label: "6+ days", color: MATERIAL.red },
          ]} />
          <div className={styles.plot}>
            <MeasuredChart>
              <BarChart data={visibleBacklog} layout="vertical" margin={{ top: 8, right: 18, left: 30, bottom: 8 }}>
                <CartesianGrid stroke={MATERIAL.grid} strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 9 }} />
                <YAxis dataKey="department" type="category" width={86} tick={{ fontSize: 9 }} />
                <Tooltip />
                <Bar dataKey="fresh" stackId="age" fill={MATERIAL.teal} />
                <Bar dataKey="ageing" stackId="age" fill={MATERIAL.amber} />
                <Bar dataKey="old" stackId="age" fill={MATERIAL.red} radius={[0, 4, 4, 0]} />
              </BarChart>
            </MeasuredChart>
          </div>
        </ChartCard>

        <ChartCard
          id="workflow"
          title="Workflow completion"
          description="Tracks requests remaining at each stage from submission through Records, Finance, Registrar approval and completion."
          takeaways={[
            "154 of 240 submitted requests reached completion.",
            "The largest stage loss is 36 requests at Finance check.",
            "Registrar converts 96% of approved requests into completed outcomes.",
          ]}
          openInfoId={openInfoId}
          onToggleInfo={toggleInfo}
        >
          <div className={styles.plotTall}>
            <MeasuredChart>
              <FunnelChart>
                <Tooltip />
                <Funnel data={WORKFLOW_DATA} dataKey="value" isAnimationActive={false}>
                  <LabelList dataKey="stage" fill="#ffffff" fontSize={9} position="insideLeft" />
                  <LabelList dataKey="value" fill="#ffffff" fontSize={10} position="insideRight" />
                </Funnel>
              </FunnelChart>
            </MeasuredChart>
          </div>
        </ChartCard>

        <ChartCard
          id="turnaround"
          title="Turnaround-time trend"
          description="Plots median completion time for major services against the five-day SLA target to show whether delivery is improving."
          takeaways={[
            "Transcript turnaround improved from 4.8 to 3.2 days.",
            "Student clearance moved below the five-day target in week six.",
            "Certificate replacement remains above target at 6.9 days.",
          ]}
          openInfoId={openInfoId}
          onToggleInfo={toggleInfo}
        >
          <ChartLegend items={[
            { label: "Transcript", color: MATERIAL.indigo },
            { label: "Clearance", color: MATERIAL.teal },
            { label: "Certificate", color: MATERIAL.blueGrey },
            { label: "SLA target", color: MATERIAL.red, dashed: true },
          ]} />
          <div className={styles.plot}>
            <MeasuredChart>
              <LineChart data={TURNAROUND_DATA} margin={{ top: 8, right: 12, left: -18, bottom: 8 }}>
                <CartesianGrid stroke={MATERIAL.grid} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="period" tick={{ fontSize: 9 }} />
                <YAxis tick={{ fontSize: 9 }} unit="d" />
                <Tooltip />
                <Line dataKey="transcript" stroke={MATERIAL.indigo} strokeWidth={2} dot={false} />
                <Line dataKey="clearance" stroke={MATERIAL.teal} strokeWidth={2} dot={false} />
                <Line dataKey="certificate" stroke={MATERIAL.blueGrey} strokeWidth={2} dot={false} />
                <ReferenceLine y={5} stroke={MATERIAL.red} strokeDasharray="5 4" />
              </LineChart>
            </MeasuredChart>
          </div>
        </ChartCard>

        <ChartCard
          id="services"
          title="Requests by service"
          description="Ranks services by total request volume to show which services generate the greatest operational workload."
          takeaways={[
            "Academic transcripts are the highest-volume service with 82 requests.",
            "Transcripts and missing marks account for 54% of listed demand.",
            "Attachment letters remain the lowest-volume service at 19 requests.",
          ]}
          openInfoId={openInfoId}
          onToggleInfo={toggleInfo}
        >
          <div className={styles.plotTall}>
            <MeasuredChart>
              <BarChart data={REQUESTS_BY_SERVICE} layout="vertical" margin={{ top: 8, right: 18, left: 52, bottom: 8 }}>
                <CartesianGrid stroke={MATERIAL.grid} strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 9 }} />
                <YAxis dataKey="service" type="category" width={112} tick={{ fontSize: 9 }} />
                <Tooltip />
                <Bar dataKey="requests" fill={MATERIAL.indigo} radius={[0, 4, 4, 0]}>
                  <LabelList dataKey="requests" position="right" fontSize={9} fill={MATERIAL.ink} />
                </Bar>
              </BarChart>
            </MeasuredChart>
          </div>
        </ChartCard>

        <ChartCard
          id="handoffs"
          title="Department handoff delays"
          description="Shows average waiting time between departments; darker cells identify handoffs where requests regularly stall."
          takeaways={[
            "Finance to Registrar is the slowest handoff at 2.6 hours.",
            "Student Records to Finance averages 1.8 hours.",
            "Registrar handoffs remain below one hour in both directions.",
          ]}
          openInfoId={openInfoId}
          onToggleInfo={toggleInfo}
        >
          <HandoffHeatmap />
        </ChartCard>

        <ChartCard
          id="officers"
          title="Officer workload and productivity"
          description="Positions each officer by assigned workload and completion rate, while bubble size represents overdue requests."
          takeaways={[
            "P. Njeri has the highest workload and the lowest completion rate.",
            "M. Wekesa combines the strongest completion rate with the lowest overdue load.",
            "A. Kamau needs workload balancing before more assignments are added.",
          ]}
          openInfoId={openInfoId}
          onToggleInfo={toggleInfo}
        >
          <div className={styles.plotTall}>
            <MeasuredChart>
              <ScatterChart margin={{ top: 12, right: 18, left: -4, bottom: 18 }}>
                <CartesianGrid stroke={MATERIAL.grid} strokeDasharray="3 3" />
                <XAxis dataKey="workload" name="Assigned workload" tick={{ fontSize: 9 }} unit=" req" />
                <YAxis dataKey="completionRate" name="Completion rate" tick={{ fontSize: 9 }} unit="%" domain={[65, 100]} />
                <ZAxis dataKey="overdue" range={[70, 520]} name="Overdue requests" />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Scatter data={OFFICER_DATA} fill={MATERIAL.indigo} />
              </ScatterChart>
            </MeasuredChart>
          </div>
        </ChartCard>

        <ChartCard
          id="outcomes"
          title="Request outcomes"
          description="Compares the percentage completed, rejected, returned, cancelled and still open for each service."
          takeaways={[
            "Attachment letters have the highest completion share at 72%.",
            "Missing marks has the largest returned-for-clarification share at 24%.",
            "Certificate replacement has the highest rejected or cancelled share at 15%.",
          ]}
          openInfoId={openInfoId}
          onToggleInfo={toggleInfo}
        >
          <ChartLegend items={[
            { label: "Completed", color: MATERIAL.teal },
            { label: "Rejected", color: MATERIAL.red },
            { label: "Returned", color: MATERIAL.amber },
            { label: "Cancelled", color: MATERIAL.grey },
            { label: "Open", color: MATERIAL.indigo },
          ]} />
          <div className={styles.plotTall}>
            <MeasuredChart>
              <BarChart data={OUTCOME_DATA} layout="vertical" margin={{ top: 8, right: 18, left: 36, bottom: 8 }}>
                <CartesianGrid stroke={MATERIAL.grid} strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 9 }} unit="%" />
                <YAxis dataKey="service" type="category" width={84} tick={{ fontSize: 9 }} />
                <Tooltip />
                <Bar dataKey="completed" stackId="outcome" fill={MATERIAL.teal} />
                <Bar dataKey="rejected" stackId="outcome" fill={MATERIAL.red} />
                <Bar dataKey="returned" stackId="outcome" fill={MATERIAL.amber} />
                <Bar dataKey="cancelled" stackId="outcome" fill={MATERIAL.grey} />
                <Bar dataKey="open" stackId="outcome" fill={MATERIAL.indigo} radius={[0, 4, 4, 0]} />
              </BarChart>
            </MeasuredChart>
          </div>
        </ChartCard>

        <ChartCard
          id="demand"
          title="Demand pattern"
          description="Maps daily request volumes across twelve weeks to expose recurring busy days and seasonal demand spikes."
          takeaways={[
            "Wednesday and Thursday consistently carry the highest demand.",
            "The week of 23 June contains the strongest registration-period spike.",
            "Weekend demand remains low enough for reduced staffing coverage.",
          ]}
          openInfoId={openInfoId}
          onToggleInfo={toggleInfo}
        >
          <DemandHeatmap />
        </ChartCard>
      </div>
    </div>
  );
}
