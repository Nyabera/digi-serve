import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";

import { PriorityPill, type PriorityLevel } from "./priority-pill";
import styles from "./internal-ui.module.css";

export type DeadlineListItem = {
  readonly id: string;
  readonly day: string;
  readonly month: string;
  readonly title: string;
  readonly reference: string;
  readonly dueLabel: string;
  readonly priority: PriorityLevel;
  readonly href: string;
};

type DeadlineListProps = {
  readonly title: string;
  readonly items: readonly DeadlineListItem[];
  readonly viewAllHref?: string;
  readonly viewAllLabel?: string;
};

export function DeadlineList({
  title,
  items,
  viewAllHref,
  viewAllLabel = "View all",
}: DeadlineListProps) {
  return (
    <section className={styles.sideList}>
      <header className={styles.sideListHeader}>
        <h2 className="text-card-title">
          {title}
        </h2>

        {viewAllHref ? (
          <Link
            href={viewAllHref}
            className={styles.sideListAction}
          >
            {viewAllLabel}
            <ArrowRight aria-hidden="true" />
          </Link>
        ) : null}
      </header>

      {items.length > 0 ? (
        <ul className={styles.deadlineItems}>
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className={styles.deadlineItem}
              >
                <span className={styles.deadlineDate}>
                  <span>{item.month}</span>
                  <strong>{item.day}</strong>
                </span>

                <span className={styles.deadlineCopy}>
                  <strong>{item.title}</strong>
                  <span className="text-reference">
                    {item.reference}
                  </span>
                </span>

                <span className={styles.deadlineMeta}>
                  <span>{item.dueLabel}</span>
                  <PriorityPill
                    priority={item.priority}
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.sideListEmpty}>
          <CalendarDays aria-hidden="true" />
          <p>No upcoming deadlines.</p>
        </div>
      )}
    </section>
  );
}
