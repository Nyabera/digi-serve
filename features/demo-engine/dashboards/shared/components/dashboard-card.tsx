import type {
  HTMLAttributes,
  ReactNode,
} from "react";

import styles from "./dashboard-primitives.module.css";

export type DashboardCardProps = {
  readonly children: ReactNode;
  readonly as?: "div" | "section" | "article";
  readonly padding?: "none" | "compact" | "default";
  readonly variant?:
    | "default"
    | "muted"
    | "emphasis"
    | "inverse";
  readonly className?: string;
} & Pick<
  HTMLAttributes<HTMLElement>,
  | "aria-label"
  | "aria-labelledby"
  | "id"
>;

function mergeClassNames(
  ...values: readonly (string | undefined)[]
): string {
  return values.filter(Boolean).join(" ");
}

export function DashboardCard({
  children,
  as: Component = "section",
  padding = "default",
  variant = "default",
  className,
  ...attributes
}: DashboardCardProps) {
  return (
    <Component
      {...attributes}
      className={mergeClassNames(
        styles.card,
        className,
      )}
      data-padding={padding}
      data-variant={variant}
    >
      {children}
    </Component>
  );
}
