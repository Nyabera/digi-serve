import type {
  CSSProperties,
  ReactNode,
} from "react";

import styles from "./dashboard-primitives.module.css";
import type {
  DashboardTone,
} from "./dashboard-primitives.types";
import {
  DashboardProgress,
} from "./dashboard-progress";

type DashboardMetricStripStyle = CSSProperties & {
  readonly "--d31-metric-columns": number;
};

export type DashboardMetricStripProps = {
  readonly children: ReactNode;
  readonly columns?: number;
  readonly className?: string;
};

export type DashboardMetricProps = {
  readonly label: string;
  readonly value: ReactNode;
  readonly icon?: ReactNode;
  readonly delta?: ReactNode;
  readonly tone?: Exclude<
    DashboardTone,
    "neutral"
  >;
  readonly progress?: number;
  readonly progressLabel?: string;
  readonly className?: string;
};

const toneClassNames = {
  primary: styles.tonePrimary,
  success: styles.toneSuccess,
  warning: styles.toneWarning,
  danger: styles.toneDanger,
  purple: styles.tonePurple,
  teal: styles.toneTeal,
} as const;

function mergeClassNames(
  ...values: readonly (string | undefined)[]
): string {
  return values.filter(Boolean).join(" ");
}

export function DashboardMetricStrip({
  children,
  columns = 4,
  className,
}: DashboardMetricStripProps) {
  const style: DashboardMetricStripStyle = {
    "--d31-metric-columns": Math.max(
      1,
      Math.min(6, Math.round(columns)),
    ),
  };

  return (
    <div
      className={mergeClassNames(
        styles.metricStrip,
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}

export function DashboardMetric({
  label,
  value,
  icon,
  delta,
  tone = "primary",
  progress,
  progressLabel,
  className,
}: DashboardMetricProps) {
  return (
    <div
      className={mergeClassNames(
        styles.metric,
        toneClassNames[tone],
        className,
      )}
    >
      {icon ? (
        <span
          aria-hidden="true"
          className={styles.metricIcon}
        >
          {icon}
        </span>
      ) : null}

      <div className={styles.metricCopy}>
        <strong className={styles.metricValue}>
          {value}
        </strong>
        <span className={styles.metricLabel}>
          {label}
        </span>
        {delta ? (
          <span className={styles.metricDelta}>
            {delta}
          </span>
        ) : null}
      </div>

      {progress !== undefined ? (
        <div className={styles.metricProgress}>
          <DashboardProgress
            label={progressLabel}
            tone={tone}
            value={progress}
          />
        </div>
      ) : null}
    </div>
  );
}
