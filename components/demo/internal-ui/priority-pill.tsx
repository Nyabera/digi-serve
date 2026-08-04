import { StatusPill } from "./status-pill";

export type PriorityLevel =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL";

type PriorityPillProps = {
  readonly priority: PriorityLevel;
  readonly compact?: boolean;
};

const priorityConfig = {
  LOW: {
    label: "Low",
    tone: "success",
  },
  MEDIUM: {
    label: "Medium",
    tone: "warning",
  },
  HIGH: {
    label: "High",
    tone: "danger",
  },
  CRITICAL: {
    label: "Critical",
    tone: "danger",
  },
} as const;

export function PriorityPill({
  priority,
  compact = true,
}: PriorityPillProps) {
  const config = priorityConfig[priority];

  return (
    <StatusPill
      tone={config.tone}
      compact={compact}
      showDot
    >
      {config.label}
    </StatusPill>
  );
}
