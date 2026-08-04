import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Minus,
  type LucideIcon,
} from "lucide-react";

import styles from "./internal-ui.module.css";

export type MetricTone =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "danger";

type MetricTrend = {
  readonly direction: "up" | "down" | "neutral";
  readonly label: string;
};

type MetricCardProps = {
  readonly label: string;
  readonly value: string | number;
  readonly detail?: string;
  readonly icon: LucideIcon;
  readonly tone?: MetricTone;
  readonly actionLabel?: string;
  readonly href?: string;
  readonly trend?: MetricTrend;
};

const trendIcons = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  neutral: Minus,
} as const;

export function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = "info",
  actionLabel,
  href,
  trend,
}: MetricCardProps) {
  const TrendIcon = trend
    ? trendIcons[trend.direction]
    : null;

  return (
    <article
      className={styles.metricCard}
      data-tone={tone}
    >
      <div className={styles.metricHeader}>
        <span
          className={styles.metricIcon}
          aria-hidden="true"
        >
          <Icon />
        </span>

        <div className={styles.metricCopy}>
          <p className={styles.metricLabel}>
            {label}
          </p>
          <p className={styles.metricValue}>
            {value}
          </p>
        </div>
      </div>

      {detail || trend ? (
        <div className={styles.metricMeta}>
          {trend && TrendIcon ? (
            <span
              className={styles.metricTrend}
              data-direction={trend.direction}
            >
              <TrendIcon aria-hidden="true" />
              {trend.label}
            </span>
          ) : null}

          {detail ? (
            <span className={styles.metricDetail}>
              {detail}
            </span>
          ) : null}
        </div>
      ) : null}

      {actionLabel && href ? (
        <Link
          href={href}
          className={styles.metricAction}
        >
          {actionLabel}
          <ArrowRight aria-hidden="true" />
        </Link>
      ) : null}
    </article>
  );
}
