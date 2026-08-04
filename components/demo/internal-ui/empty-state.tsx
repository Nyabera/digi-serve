import type {
  LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

import styles from "./internal-ui.module.css";

type EmptyStateProps = {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly description: string;
  readonly action?: ReactNode;
  readonly compact?: boolean;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  compact = false,
}: EmptyStateProps) {
  return (
    <div
      className={styles.emptyState}
      data-compact={compact ? "true" : undefined}
    >
      <span
        className={styles.emptyStateIcon}
        aria-hidden="true"
      >
        <Icon />
      </span>

      <div className={styles.emptyStateCopy}>
        <h2 className="text-card-title">
          {title}
        </h2>
        <p className="text-body-compact">
          {description}
        </p>
      </div>

      {action ? (
        <div className={styles.emptyStateAction}>
          {action}
        </div>
      ) : null}
    </div>
  );
}
