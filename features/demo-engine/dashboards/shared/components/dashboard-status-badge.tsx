import type {
  ReactNode,
} from "react";

import styles from "./dashboard-primitives.module.css";
import type {
  DashboardTone,
} from "./dashboard-primitives.types";

export type DashboardStatusBadgeProps = {
  readonly children: ReactNode;
  readonly tone?: DashboardTone;
  readonly size?: "small" | "default";
  readonly className?: string;
};

const toneClassNames = {
  neutral: styles.statusNeutral,
  primary: styles.statusPrimary,
  success: styles.statusSuccess,
  warning: styles.statusWarning,
  danger: styles.statusDanger,
  purple: styles.statusPurple,
  teal: styles.statusTeal,
} as const;

function mergeClassNames(
  ...values: readonly (string | undefined)[]
): string {
  return values.filter(Boolean).join(" ");
}

export function DashboardStatusBadge({
  children,
  tone = "neutral",
  size = "small",
  className,
}: DashboardStatusBadgeProps) {
  return (
    <span
      className={mergeClassNames(
        styles.statusBadge,
        toneClassNames[tone],
        className,
      )}
      data-size={size}
    >
      {children}
    </span>
  );
}
