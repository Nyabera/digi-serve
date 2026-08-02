"use client";

import Link from "next/link";
import {
  ArrowRight,
} from "lucide-react";
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

import type {
  OfficerRhythmData,
} from "../data";
import {
  DashboardCard,
  DashboardChartFrame,
  DashboardSectionHeading,
} from "../shared";
import styles from "./officer-dashboard.module.css";

export function OfficerRhythmPanel({
  data,
}: {
  readonly data: OfficerRhythmData;
}) {
  const chartData = data.points.map(
    (point) => ({
      label: point.label,
      workload: point.primary,
      completions:
        point.secondary ?? 0,
    }),
  );

  const donutData = [
    {
      name: "On time",
      value: data.slaOnTime,
    },
    {
      name: "Remaining",
      value:
        Math.max(
          0,
          100 - data.slaOnTime,
        ),
    },
  ];

  return (
    <DashboardCard
      className={styles.rhythmCard}
      padding="compact"
    >
      <DashboardSectionHeading
        action={
          <select
            aria-label="Rhythm period"
            className={styles.periodSelect}
            defaultValue="7-days"
          >
            <option value="7-days">
              {data.periodLabel}
            </option>
            <option value="30-days">
              Last 30 days
            </option>
          </select>
        }
        headingLevel={2}
        title="My rhythm"
      />

      <div className={styles.rhythmGrid}>
        <DashboardChartFrame
          legend={
            <>
              <span className={styles.legendItem}>
                <i
                  aria-hidden="true"
                  data-series="primary"
                />
                {data.primaryLabel}
              </span>
              <span className={styles.legendItem}>
                <i
                  aria-hidden="true"
                  data-series="secondary"
                />
                {data.secondaryLabel}
              </span>
            </>
          }
          minHeight={150}
          title="Workload and completions"
        >
          {({ width, height }) => (
            <LineChart
              data={chartData}
              height={height}
              margin={{
                top: 8,
                right: 8,
                bottom: 4,
                left: -12,
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
                fontSize={9}
                tick={{
                  fill:
                    "var(--d31-dashboard-text-muted)",
                }}
                tickLine={false}
              />
              <YAxis
                axisLine={false}
                fontSize={9}
                tick={{
                  fill:
                    "var(--d31-dashboard-text-muted)",
                }}
                tickLine={false}
                width={28}
              />
              <Tooltip
                contentStyle={{
                  border:
                    "1px solid var(--d31-dashboard-border)",
                  borderRadius:
                    "var(--d31-dashboard-radius-sm)",
                  boxShadow:
                    "var(--d31-dashboard-shadow-raised)",
                  fontSize: 10,
                }}
              />
              <Line
                activeDot={{ r: 3 }}
                dataKey="workload"
                dot={{ r: 2 }}
                isAnimationActive={false}
                stroke="var(--d31-dashboard-primary)"
                strokeWidth={2}
                type="monotone"
              />
              <Line
                activeDot={{ r: 3 }}
                dataKey="completions"
                dot={{ r: 2 }}
                isAnimationActive={false}
                stroke="var(--d31-dashboard-success)"
                strokeWidth={2}
                type="monotone"
              />
            </LineChart>
          )}
        </DashboardChartFrame>

        <DashboardChartFrame
          aspectRatio="1 / 1"
          minHeight={150}
          title="SLA on time"
        >
          {({ width, height }) => {
            const diameter =
              Math.min(width, height);
            const outerRadius =
              diameter * 0.34;
            const innerRadius =
              diameter * 0.25;

            return (
              <div
                className={styles.donutCanvas}
                style={{
                  width,
                  height,
                }}
              >
                <PieChart
                  height={height}
                  width={width}
                >
                  <Pie
                    cx="50%"
                    cy="50%"
                    data={donutData}
                    dataKey="value"
                    endAngle={-270}
                    innerRadius={innerRadius}
                    isAnimationActive={false}
                    outerRadius={outerRadius}
                    startAngle={90}
                    stroke="none"
                  >
                    <Cell
                      fill="var(--d31-dashboard-success)"
                    />
                    <Cell
                      fill="var(--d31-dashboard-divider)"
                    />
                  </Pie>
                </PieChart>

                <div className={styles.donutLabel}>
                  <strong>
                    {data.slaOnTime}%
                  </strong>
                  <span>SLA on time</span>
                </div>
              </div>
            );
          }}
        </DashboardChartFrame>
      </div>

      <Link
        className={styles.cardFooterAction}
        href={data.action.href}
      >
        <span>{data.action.label}</span>
        <ArrowRight
          aria-hidden="true"
          size={13}
          strokeWidth={2}
        />
      </Link>
    </DashboardCard>
  );
}
