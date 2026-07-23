import type { ReactNode } from "react";

export type StatusTone =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "outline";

type StatusPillProps = {
  readonly children: ReactNode;
  readonly tone?: StatusTone;
  readonly compact?: boolean;
  readonly showDot?: boolean;
  readonly className?: string;
};

const toneClasses: Record<StatusTone, string> = {
  neutral: "badge-neutral",
  info: "badge-info",
  success: "badge-success",
  warning: "badge-warning",
  danger: "badge-danger",
  outline: "badge-outline",
};

export function StatusPill({
  children,
  tone = "neutral",
  compact = true,
  showDot = false,
  className = "",
}: StatusPillProps) {
  return (
    <span
      className={[
        "badge-base",
        compact ? "badge-compact" : "",
        toneClasses[tone],
        showDot ? "badge-dot" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}
