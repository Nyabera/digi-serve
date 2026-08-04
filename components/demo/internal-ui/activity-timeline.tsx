import {
  CheckCircle2,
  Circle,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

import styles from "./internal-ui.module.css";

export type ActivityTimelineTone =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "danger";

export type ActivityTimelineItem = {
  readonly id: string;
  readonly title: string;
  readonly description?: ReactNode;
  readonly meta?: ReactNode;
  readonly icon?: LucideIcon;
  readonly tone?: ActivityTimelineTone;
  readonly current?: boolean;
  readonly complete?: boolean;
};

type ActivityTimelineProps = {
  readonly items: readonly ActivityTimelineItem[];
  readonly title?: string;
  readonly className?: string;
};

export function ActivityTimeline({
  items,
  title,
  className = "",
}: ActivityTimelineProps) {
  return (
    <section
      className={[
        styles.timelineSection,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label={title ?? "Activity timeline"}
    >
      {title ? (
        <h2 className="text-card-title">
          {title}
        </h2>
      ) : null}

      <ol className={styles.timeline}>
        {items.map((item, index) => {
          const Icon =
            item.icon ??
            (item.complete
              ? CheckCircle2
              : Circle);

          return (
            <li
              key={item.id}
              className={styles.timelineItem}
              data-tone={item.tone ?? "neutral"}
              data-current={
                item.current ? "true" : undefined
              }
            >
              <span
                className={styles.timelineRail}
                aria-hidden="true"
              >
                <span className={styles.timelineIcon}>
                  <Icon />
                </span>

                {index < items.length - 1 ? (
                  <span
                    className={styles.timelineLine}
                  />
                ) : null}
              </span>

              <div className={styles.timelineContent}>
                <div className={styles.timelineHeader}>
                  <strong>{item.title}</strong>
                  {item.meta ? (
                    <span>{item.meta}</span>
                  ) : null}
                </div>

                {item.description ? (
                  <div
                    className={
                      styles.timelineDescription
                    }
                  >
                    {item.description}
                  </div>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
