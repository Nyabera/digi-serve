import type {
  CSSProperties,
} from "react";

import styles from "./dashboard-primitives.module.css";
import type {
  DashboardTone,
} from "./dashboard-primitives.types";

type DashboardProgressStyle = CSSProperties & {
  "--d31-progress-value": string;
  "--d31-progress-height"?: string;
};

export type DashboardProgressProps = {
  readonly value: number;
  readonly max?: number;
  readonly label?: string;
  readonly showValue?: boolean;
  readonly tone?: Exclude<
    DashboardTone,
    "neutral"
  >;
  readonly height?: string;
  readonly className?: string;
};

const toneClassNames = {
  primary: styles.progressPrimary,
  success: styles.progressSuccess,
  warning: styles.progressWarning,
  danger: styles.progressDanger,
  purple: styles.progressPurple,
  teal: styles.progressTeal,
} as const;

function mergeClassNames(
  ...values: readonly (string | undefined)[]
): string {
  return values.filter(Boolean).join(" ");
}

export function DashboardProgress({
  value,
  max = 100,
  label,
  showValue = false,
  tone = "primary",
  height,
  className,
}: DashboardProgressProps) {
  const safeMax = max > 0 ? max : 100;
  const normalized = Math.max(
    0,
    Math.min(100, (value / safeMax) * 100),
  );
  const rounded = Math.round(normalized);

  const style: DashboardProgressStyle = {
    "--d31-progress-value": `${normalized}%`,
  };

  if (height) {
    style["--d31-progress-height"] = height;
  }

  const ariaLabel =
    label ??
    `Progress: ${rounded} percent`;

  return (
    <div
      className={mergeClassNames(
        styles.progressRoot,
        toneClassNames[tone],
        className,
      )}
    >
      {label || showValue ? (
        <div className={styles.progressMeta}>
          <span>{label}</span>
          {showValue ? <span>{rounded}%</span> : null}
        </div>
      ) : null}

      <div
        aria-label={ariaLabel}
        aria-valuemax={safeMax}
        aria-valuemin={0}
        aria-valuenow={Math.max(
          0,
          Math.min(safeMax, value),
        )}
        className={styles.progressTrack}
        role="progressbar"
      >
        <div
          className={styles.progressIndicator}
          style={style}
        />
      </div>
    </div>
  );
}
