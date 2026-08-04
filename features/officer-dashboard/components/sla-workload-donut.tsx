"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import type { SlaBreakdown } from "../model/officer-dashboard-model";
import styles from "./officer-dashboard-body.module.css";

const OUTER_COLOURS = ["#4CAF50", "#FFB300", "#F44336"] as const;
const INNER_COLOURS = ["#2E7D32", "#F57C00", "#C62828"] as const;

export function SlaWorkloadDonut({
  data,
}: {
  data: SlaBreakdown;
}) {
  const outerSegments = [
    { name: "On time", value: data.onTime.percent },
    { name: "Due soon", value: data.dueSoon.percent },
    { name: "Overdue", value: data.overdue.percent },
  ];

  const innerSegments = [
    { name: "Completed within target", value: data.onTime.count },
    { name: "Completed late", value: data.dueSoon.count },
    { name: "Still overdue", value: data.overdue.count },
  ];

  return (
    <figure
      className={styles.slaDonutFigure}
      data-d29r23d-two-level-donut="true"
    >
      <div
        className={styles.slaDonutCanvas}
        role="img"
        aria-label={`${data.onTime.percent}% on time, ${data.dueSoon.percent}% due soon and ${data.overdue.percent}% overdue`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              formatter={(value, name) => [String(value), String(name)]}
            />
            <Pie
              data={innerSegments}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={28}
              outerRadius={44}
              startAngle={90}
              endAngle={-270}
              stroke="#ffffff"
              strokeWidth={1}
              isAnimationActive={false}
            >
              {innerSegments.map((segment, index) => (
                <Cell
                  key={segment.name}
                  fill={INNER_COLOURS[index]}
                />
              ))}
            </Pie>
            <Pie
              data={outerSegments}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={49}
              outerRadius={66}
              startAngle={90}
              endAngle={-270}
              stroke="#ffffff"
              strokeWidth={1}
              isAnimationActive={false}
            >
              {outerSegments.map((segment, index) => (
                <Cell
                  key={segment.name}
                  fill={OUTER_COLOURS[index]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className={styles.slaNestedDonutLabel} aria-hidden="true">
          <strong>{data.onTime.percent}%</strong>
          <span>On time</span>
        </div>
      </div>

      <figcaption className={styles.slaDonutCaption}>
        Outer ring: current SLA status. Inner ring: resolved and overdue
        request counts.
      </figcaption>
    </figure>
  );
}
