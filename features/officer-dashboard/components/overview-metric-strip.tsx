import Link from "next/link";

import type { DashboardMetric } from "../model/officer-dashboard-model";
import styles from "./officer-dashboard-body.module.css";

export function OverviewMetricStrip({
  metrics,
}: {
  metrics: DashboardMetric[];
}) {
  return (
    <section
      className={styles.overviewStrip}
      aria-label="Today’s work summary"
      data-d29r23d-overview-strip="true"
    >
      {metrics.map((metric, index) => (
        <Link
          aria-label={
            metric.action.ariaLabel ??
            `${metric.label}: ${metric.value}. ${metric.action.label}`
          }
          className={`${styles.overviewMetric} ${
            index === 0 ? styles.overviewFeatured : ""
          }`}
          data-featured={index === 0 ? "true" : undefined}
          data-tone={metric.tone}
          href={metric.action.href}
          key={metric.id}
        >
          <span className={styles.overviewLabel}>{metric.label}</span>
          <strong className={styles.overviewValue}>{metric.value}</strong>
          {index === 0 ? null : (
            <span className={styles.overviewAccent} aria-hidden="true" />
          )}
        </Link>
      ))}
    </section>
  );
}
