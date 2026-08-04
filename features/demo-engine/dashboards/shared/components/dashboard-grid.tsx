import type {
  CSSProperties,
  ReactNode,
} from "react";

import styles from "./dashboard-primitives.module.css";

type DashboardGridStyle = CSSProperties & {
  "--d31-grid-columns"?: number;
  "--d31-grid-column-gap"?: string;
  "--d31-grid-row-gap"?: string;
  "--d31-grid-align"?:
    | "start"
    | "center"
    | "end"
    | "stretch";
};

type DashboardGridItemStyle = CSSProperties & {
  "--d31-grid-span"?: number;
  "--d31-grid-start"?: number | "auto";
};

export type DashboardGridProps = {
  readonly children: ReactNode;
  readonly columns?: number;
  readonly columnGap?: string;
  readonly rowGap?: string;
  readonly align?:
    | "start"
    | "center"
    | "end"
    | "stretch";
  readonly className?: string;
};

export type DashboardGridItemProps = {
  readonly children: ReactNode;
  readonly span?: number;
  readonly start?: number;
  readonly className?: string;
};

function mergeClassNames(
  ...values: readonly (string | undefined)[]
): string {
  return values.filter(Boolean).join(" ");
}

export function DashboardGrid({
  children,
  columns = 12,
  columnGap,
  rowGap,
  align = "stretch",
  className,
}: DashboardGridProps) {
  const normalizedColumns = Math.max(
    1,
    Math.min(12, Math.round(columns)),
  );

  const style: DashboardGridStyle = {
    "--d31-grid-columns": normalizedColumns,
    "--d31-grid-align": align,
  };

  if (columnGap) {
    style["--d31-grid-column-gap"] = columnGap;
  }

  if (rowGap) {
    style["--d31-grid-row-gap"] = rowGap;
  }

  return (
    <div
      className={mergeClassNames(
        styles.grid,
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}

export function DashboardGridItem({
  children,
  span = 12,
  start,
  className,
}: DashboardGridItemProps) {
  const normalizedSpan = Math.max(
    1,
    Math.min(12, Math.round(span)),
  );

  const style: DashboardGridItemStyle = {
    "--d31-grid-span": normalizedSpan,
  };

  if (start !== undefined) {
    style["--d31-grid-start"] = Math.max(
      1,
      Math.min(12, Math.round(start)),
    );
  }

  return (
    <div
      className={mergeClassNames(
        styles.gridItem,
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}
