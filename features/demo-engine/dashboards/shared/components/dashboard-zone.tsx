import type {
  ReactNode,
} from "react";

import styles from "./dashboard-primitives.module.css";

export type DashboardZoneProps = {
  readonly id: string;
  readonly number?: string | number;
  readonly title: string;
  readonly description?: string;
  readonly action?: ReactNode;
  readonly children: ReactNode;
  readonly className?: string;
};

function mergeClassNames(
  ...values: readonly (string | undefined)[]
): string {
  return values.filter(Boolean).join(" ");
}

export function DashboardZone({
  id,
  number,
  title,
  description,
  action,
  children,
  className,
}: DashboardZoneProps) {
  const headingId = `${id}-heading`;

  return (
    <section
      aria-labelledby={headingId}
      className={mergeClassNames(
        styles.zone,
        className,
      )}
      id={id}
    >
      <header className={styles.zoneHeader}>
        <div className={styles.zoneIdentity}>
          {number !== undefined ? (
            <span className={styles.zoneNumber}>
              Zone {number}
            </span>
          ) : null}

          <div className={styles.zoneCopy}>
            <h2
              className={styles.zoneTitle}
              id={headingId}
            >
              {title}
            </h2>

            {description ? (
              <p className={styles.zoneDescription}>
                {description}
              </p>
            ) : null}
          </div>
        </div>

        {action ? (
          <div className={styles.zoneAction}>
            {action}
          </div>
        ) : null}
      </header>

      {children}
    </section>
  );
}
