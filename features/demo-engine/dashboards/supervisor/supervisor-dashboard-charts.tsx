"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type {
  SupervisorThroughputData,
} from "../data";
import type {
  DashboardTrendPoint,
} from "../data";
import {
  DashboardChartFrame,
} from "../shared";

import styles from "./supervisor-dashboard.module.css";

const axisStyle = {
  fill: "var(--d31-dashboard-text-muted)",
  fontSize: 9,
} as const;

const tooltipStyle = {
  border:
    "1px solid var(--d31-dashboard-border)",
  borderRadius:
    "var(--d31-dashboard-radius-sm)",
  boxShadow:
    "var(--d31-dashboard-shadow-raised)",
  fontSize: 10,
} as const;

export function SupervisorSlaTrendChart({
  points,
}: {
  readonly points:
    readonly DashboardTrendPoint[];
}) {
  return (
    <DashboardChartFrame
      minHeight={190}
      title="SLA trend (last 14 days)"
    >
      {({ width, height }) => (
        <LineChart
          data={[...points]}
          height={height}
          margin={{
            top: 12,
            right: 10,
            bottom: 4,
            left: -18,
          }}
          width={width}
        >
          <CartesianGrid
            stroke="var(--d31-dashboard-divider)"
            strokeDasharray="3 3"
            vertical={false}
          />
          <XAxis
            axisLine={false}
            dataKey="label"
            tick={axisStyle}
            tickLine={false}
          />
          <YAxis
            axisLine={false}
            domain={[40, 100]}
            tick={axisStyle}
            tickFormatter={(value) =>
              `${value}%`
            }
            tickLine={false}
            width={42}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value) => [
              `${value}%`,
              "SLA on time",
            ]}
          />
          <Line
            activeDot={{ r: 3 }}
            dataKey="primary"
            dot={{ r: 2 }}
            isAnimationActive={false}
            stroke="var(--d31-dashboard-primary)"
            strokeWidth={2}
            type="monotone"
          />
        </LineChart>
      )}
    </DashboardChartFrame>
  );
}

export function SupervisorThroughputChart({
  data,
}: {
  readonly data:
    SupervisorThroughputData;
}) {
  return (
    <div className={styles.throughputChart}>
      <div className={styles.throughputValue}>
        <strong>{data.total}</strong>
        <span>
          ▲ {data.deltaPercentage}% vs previous period
        </span>
      </div>

      <DashboardChartFrame
        minHeight={132}
        title="Department throughput"
      >
        {({ width, height }) => (
          <BarChart
            data={[...data.points]}
            height={height}
            margin={{
              top: 8,
              right: 4,
              bottom: 0,
              left: -26,
            }}
            width={width}
          >
            <CartesianGrid
              stroke="var(--d31-dashboard-divider)"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              axisLine={false}
              dataKey="label"
              tick={axisStyle}
              tickLine={false}
            />
            <YAxis
              axisLine={false}
              tick={axisStyle}
              tickLine={false}
              width={34}
            />
            <Tooltip
              contentStyle={tooltipStyle}
            />
            <Bar
              dataKey="primary"
              fill="var(--d31-dashboard-primary)"
              isAnimationActive={false}
              radius={[3, 3, 0, 0]}
            />
          </BarChart>
        )}
      </DashboardChartFrame>
    </div>
  );
}
