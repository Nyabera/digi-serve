"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

import type { SlaBreakdown } from "../model/officer-dashboard-model";
import styles from "./officer-dashboard-body.module.css";

const SEGMENT_COLOURS = ["#52c878", "#ff9100", "#f4263e"] as const;

export function SlaDonut({ data }: { data: SlaBreakdown }) {
  const segments = [
    { name: "On-time", value: data.onTime.percent },
    { name: "Due soon", value: data.dueSoon.percent },
    { name: "Overdue", value: data.overdue.percent },
  ];

  return (
    <div
      className={styles.donut}
      role="img"
      aria-label={`${data.onTime.percent}% of requests were completed on time`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={segments}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={48}
            outerRadius={60}
            startAngle={90}
            endAngle={-270}
            stroke="#ffffff"
            strokeWidth={1}
            isAnimationActive={false}
          >
            {segments.map((segment, index) => (
              <Cell key={segment.name} fill={SEGMENT_COLOURS[index]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div className={styles.donutLabel} aria-hidden="true">
        <strong>{data.onTime.percent}%</strong>
        <span>On-time</span>
      </div>
    </div>
  );
}
