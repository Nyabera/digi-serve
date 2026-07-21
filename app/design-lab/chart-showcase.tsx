"use client";

import { Inbox } from "lucide-react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const chartData = [
  { day: "Mon", submitted: 34, completed: 22 },
  { day: "Tue", submitted: 42, completed: 27 },
  { day: "Wed", submitted: 38, completed: 31 },
  { day: "Thu", submitted: 51, completed: 36 },
  { day: "Fri", submitted: 47, completed: 40 },
  { day: "Sat", submitted: 29, completed: 25 },
  { day: "Sun", submitted: 36, completed: 30 },
];

const chartPalette = [
  { label: "Primary series", variable: "--chart-1" },
  { label: "Secondary series", variable: "--chart-2" },
  { label: "Supporting series", variable: "--chart-3" },
  { label: "Warning series", variable: "--chart-4" },
  { label: "Neutral series", variable: "--chart-5" },
];

type TooltipEntry = {
  color?: string;
  dataKey?: string | number;
  name?: string;
  value?: number | string;
};

type ChartTooltipProps = {
  active?: boolean;
  label?: string | number;
  payload?: ReadonlyArray<TooltipEntry>;
};

type LegendEntry = {
  color?: string;
  dataKey?: string | number;
  value?: string;
};

type ChartLegendProps = {
  payload?: ReadonlyArray<LegendEntry>;
};

function ChartTooltip({ active, label, payload }: ChartTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{label}</p>

      <div className="chart-tooltip-list">
        {payload.map((entry, index) => (
          <div
            key={String(entry.dataKey ?? entry.name ?? index)}
            className="chart-tooltip-row"
          >
            <span
              aria-hidden="true"
              className="chart-tooltip-marker"
              style={{ backgroundColor: entry.color }}
            />
            <span className="chart-tooltip-name">{entry.name}</span>
            <span className="chart-tooltip-value">
              {typeof entry.value === "number"
                ? entry.value.toLocaleString()
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChartLegend({ payload }: ChartLegendProps) {
  if (!payload?.length) {
    return null;
  }

  return (
    <ul className="chart-legend" aria-label="Chart legend">
      {payload.map((entry, index) => (
        <li
          key={String(entry.dataKey ?? entry.value ?? index)}
          className="chart-legend-item"
        >
          <span
            aria-hidden="true"
            className="chart-legend-marker"
            style={{ backgroundColor: entry.color }}
          />
          <span>{entry.value}</span>
        </li>
      ))}
    </ul>
  );
}

function ChartEmptyState() {
  return (
    <div className="chart-state">
      <span className="state-icon">
        <Inbox
          className="icon-32"
          strokeWidth={1.4}
          absoluteStrokeWidth
          aria-hidden="true"
        />
      </span>

      <h3 className="state-title">No chart data</h3>
      <p className="state-description">
        No requests were recorded for the selected period. Try a wider date
        range or remove the current filters.
      </p>

      <div className="state-actions">
        <button
          type="button"
          className="button-base button-compact button-secondary"
        >
          Clear filters
        </button>
      </div>
    </div>
  );
}

function ChartLoadingState() {
  return (
    <div
      className="chart-loading"
      role="status"
      aria-label="Loading chart data"
      aria-busy="true"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="skeleton skeleton-title" />
        <div className="skeleton h-5 w-20" />
      </div>

      <div className="skeleton chart-loading-plot" />

      <div className="mt-4 flex flex-wrap gap-4">
        <div className="skeleton h-3 w-24" />
        <div className="skeleton h-3 w-28" />
      </div>

      <span className="sr-only">Loading chart data.</span>
    </div>
  );
}

export function ChartShowcase() {
  return (
    <div className="space-y-6">
      <article className="chart-panel">
        <div className="chart-header">
          <div>
            <h3 className="chart-title">Requests submitted and completed</h3>
            <p className="chart-subtitle">
              Previous seven days · operational throughput
            </p>
          </div>

          <span className="badge-base badge-default badge-info">7 days</span>
        </div>

        <div
          className="chart-canvas"
          role="img"
          aria-label="Line chart comparing submitted and completed requests over seven days"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 8, right: 12, bottom: 4, left: -16 }}
            >
              <CartesianGrid
                vertical={false}
                stroke="var(--chart-grid)"
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "var(--chart-axis)",
                  fontFamily: "var(--font-plus-jakarta-sans)",
                  fontSize: 12,
                  fontWeight: 500,
                }}
                tickMargin={10}
              />

              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                width={44}
                tick={{
                  fill: "var(--chart-axis)",
                  fontFamily: "var(--font-plus-jakarta-sans)",
                  fontSize: 12,
                  fontWeight: 500,
                }}
              />

              <Tooltip
                cursor={{
                  stroke: "var(--chart-cursor)",
                  strokeDasharray: "4 4",
                  strokeWidth: 1,
                }}
                content={<ChartTooltip />}
              />

              <Legend
                align="right"
                verticalAlign="top"
                height={36}
                content={<ChartLegend />}
              />

              <Line
                type="monotone"
                dataKey="submitted"
                name="Submitted"
                stroke="var(--chart-1)"
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 4,
                  fill: "var(--surface)",
                  stroke: "var(--chart-1)",
                  strokeWidth: 2,
                }}
                isAnimationActive={false}
              />

              <Line
                type="monotone"
                dataKey="completed"
                name="Completed"
                stroke="var(--chart-2)"
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 4,
                  fill: "var(--surface)",
                  stroke: "var(--chart-2)",
                  strokeWidth: 2,
                }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </article>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <p className="text-label text-foreground">Chart empty state</p>
          <p className="text-body-compact mt-1 text-muted-foreground">
            Keep the chart title and context visible, then explain why no data
            is available.
          </p>
          <div className="mt-4">
            <ChartEmptyState />
          </div>
        </div>

        <div>
          <p className="text-label text-foreground">Chart loading state</p>
          <p className="text-body-compact mt-1 text-muted-foreground">
            Preserve the final chart footprint so surrounding content does not
            jump while data loads.
          </p>
          <div className="mt-4">
            <ChartLoadingState />
          </div>
        </div>
      </div>

      <div>
        <p className="text-label text-foreground">Approved chart palette</p>
        <p className="text-body-compact mt-1 text-muted-foreground">
          Use the first two colours for primary comparisons and reserve warning
          colours for meaningful exceptions.
        </p>

        <div className="chart-palette mt-4">
          {chartPalette.map((colour) => (
            <div key={colour.variable} className="chart-palette-item">
              <span
                aria-hidden="true"
                className="chart-palette-swatch"
                style={{ backgroundColor: `var(${colour.variable})` }}
              />
              <span>{colour.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}