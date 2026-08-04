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

import { OFFICER_TASKS } from "../fixtures/operational-data";
import {
  getOfficerRequestHref,
  OFFICER_ROUTE_HREFS,
} from "@/features/demo-engine/navigation/officer-navigation-contract";
import styles from "./officer-sla-workspace-fixed.module.css";

const RANGE_DATA = {
  "7 Days": [88, 90, 89, 93, 91, 94, 92],
  "1 Month": [76, 88, 82, 90, 94, 86, 89, 95, 96, 88, 91, 95, 92],
  "3 Months": [78, 82, 84, 87, 89, 91, 90, 93, 92, 94, 93, 92],
  "6 Months": [74, 78, 81, 85, 84, 88, 90, 91, 93, 92, 94, 92],
} as const;

type RangeKey = keyof typeof RANGE_DATA;

type MeasuredChartProps = {
  height: number;
  children: (size: { width: number; height: number }) => React.ReactNode;
};

function MeasuredChart({ height, children }: MeasuredChartProps) {
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
      className={styles.chartCanvas}
      data-chart-width={width}
      ref={hostRef}
      style={{ height, minHeight: height }}
    >
      {width >= 180 ? (
        children({ width, height })
      ) : (
        <div className={styles.chartLoading} role="status">
          Preparing chart…
        </div>
      )}
    </div>
  );
}

function exportCsv() {
  const rows = [
    ["Request ID", "Service", "Step", "Overdue by", "Due date"],
    ["REQ-2026-0703", "Certificate Replacement", "Registrar approval", "2h 15m", "26 Jul 2026, 10:00 AM"],
    ["REQ-2026-0689", "Transcript Request", "Document review", "56m", "26 Jul 2026, 9:00 AM"],
    ["REQ-2026-0671", "Student Clearance", "Finance clearance", "35m", "27 Jul 2026, 11:00 AM"],
  ];

  const csv = rows
    .map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const href = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.download = "officer-sla-performance.csv";
  anchor.click();
  URL.revokeObjectURL(href);
}

export function OfficerSlaWorkspaceFixed() {
  const [range, setRange] = useState<RangeKey>("1 Month");
  const [taskFilter, setTaskFilter] = useState("All tasks");

  const trendData = useMemo(
    () =>
      RANGE_DATA[range].map((compliance, index) => ({
        period: index + 1,
        compliance,
      })),
    [range],
  );

  const breakdown = [
    { name: "On track", value: 22, color: "#34A853" },
    { name: "Due soon", value: 2, color: "#F9AB00" },
    { name: "Overdue", value: 3, color: "#EA4335" },
  ];

  const overdueTasks = [
    {
      id: "REQ-2026-0703",
      service: "Certificate Replacement",
      step: "Registrar approval",
      overdue: "2h 15m",
      due: "26 Jul 2026, 10:00 AM",
    },
    {
      id: "REQ-2026-0689",
      service: "Transcript Request",
      step: "Document review",
      overdue: "56m",
      due: "26 Jul 2026, 9:00 AM",
    },
    {
      id: "REQ-2026-0671",
      service: "Student Clearance",
      step: "Finance clearance",
      overdue: "35m",
      due: "27 Jul 2026, 11:00 AM",
    },
  ].filter((task) => {
    if (taskFilter === "All tasks") {
      return true;
    }
    return task.service === taskFilter;
  });

  return (
    <main className={styles.page} data-d29r23d-fixed-officer-sla="true">
      <header className={styles.header}>
        <div>
          <h1>My SLA Performance</h1>
          <p>Track your personal SLA performance and assigned tasks over time.</p>
        </div>
        <div className={styles.headerActions}>
          <Link href={OFFICER_ROUTE_HREFS.tasks}>Open my tasks</Link>
          <button onClick={exportCsv} type="button">Export CSV</button>
        </div>
      </header>

      <div className={styles.controls}>
        <div className={styles.rangeGroup} aria-label="SLA date range" role="group">
          {(Object.keys(RANGE_DATA) as RangeKey[]).map((option) => (
            <button
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
          aria-label="Filter overdue tasks"
          onChange={(event) => setTaskFilter(event.target.value)}
          value={taskFilter}
        >
          <option>All tasks</option>
          <option>Certificate Replacement</option>
          <option>Transcript Request</option>
          <option>Student Clearance</option>
        </select>
      </div>

      <section className={styles.metricGrid} aria-label="SLA summary">
        <article><span>My active tasks</span><strong>{OFFICER_TASKS.length + 15}</strong><small>3 more than last month</small></article>
        <article><span>SLA compliance</span><strong>92%</strong><small>6% better than last month</small></article>
        <article><span>On track</span><strong>22</strong><small>92% of evaluated tasks</small></article>
        <article data-tone="warning"><span>Due soon</span><strong>2</strong><small>One more than last month</small></article>
        <article data-tone="danger"><span>Overdue</span><strong>3</strong><small>Includes carried-over work</small></article>
      </section>

      <section className={styles.chartGrid}>
        <article className={styles.chartCard}>
          <h2>SLA compliance trend</h2>
          <MeasuredChart height={280}>
            {({ width, height }) => (
              <LineChart
                data={trendData}
                height={height}
                margin={{ bottom: 10, left: 0, right: 18, top: 12 }}
                width={width}
              >
                <CartesianGrid stroke="#E2E8F0" strokeDasharray="4 4" vertical={false} />
                <XAxis axisLine={false} dataKey="period" tickLine={false} />
                <YAxis axisLine={false} domain={[0, 100]} tickFormatter={(value) => `${value}%`} tickLine={false} width={38} />
                <Tooltip formatter={(value) => [`${value}%`, "Compliance"]} />
                <Line dataKey="compliance" dot={{ r: 3 }} isAnimationActive={false} stroke="#34A853" strokeWidth={3} type="monotone" />
              </LineChart>
            )}
          </MeasuredChart>
        </article>

        <article className={styles.chartCard}>
          <h2>SLA breakdown</h2>
          <div className={styles.donutLayout}>
            <MeasuredChart height={250}>
              {({ width, height }) => (
                <PieChart height={height} width={width}>
                  <Tooltip />
                  <Pie
                    cx="50%"
                    cy="50%"
                    data={breakdown}
                    dataKey="value"
                    innerRadius={58}
                    isAnimationActive={false}
                    nameKey="name"
                    outerRadius={86}
                    paddingAngle={1}
                  >
                    {breakdown.map((entry) => <Cell fill={entry.color} key={entry.name} />)}
                  </Pie>
                  <text dominantBaseline="middle" fill="#0F1B4C" fontSize="28" fontWeight="700" textAnchor="middle" x="50%" y="46%">24</text>
                  <text dominantBaseline="middle" fill="#68748E" fontSize="10" textAnchor="middle" x="50%" y="57%">Total tasks</text>
                </PieChart>
              )}
            </MeasuredChart>

            <dl className={styles.legend}>
              {breakdown.map((entry) => (
                <div key={entry.name}>
                  <dt><span style={{ background: entry.color }} />{entry.name}</dt>
                  <dd>{entry.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <p className={styles.chartNote}>Active tasks and evaluated SLA items differ because three overdue cases were carried into this period.</p>
        </article>
      </section>

      <section className={styles.tableCard}>
        <header><h2>My overdue tasks ({overdueTasks.length})</h2><span>{taskFilter}</span></header>
        <div className={styles.tableScroll}>
          <table>
            <thead><tr><th>Request ID</th><th>Service</th><th>Step</th><th>Overdue by</th><th>Due date</th><th>Action</th></tr></thead>
            <tbody>
              {overdueTasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.id}</td><td>{task.service}</td><td>{task.step}</td><td>{task.overdue}</td><td>{task.due}</td>
                  <td><Link href={getOfficerRequestHref(task.id)}>View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
