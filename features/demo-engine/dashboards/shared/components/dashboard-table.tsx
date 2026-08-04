import type {
  CSSProperties,
  ReactNode,
} from "react";

import styles from "./dashboard-primitives.module.css";
import type {
  DashboardAlignment,
} from "./dashboard-primitives.types";

type DashboardTableStyle = CSSProperties & {
  readonly "--d31-table-min-width": string;
};

export type DashboardTableColumn<Row> = {
  readonly id: string;
  readonly header: ReactNode;
  readonly align?: DashboardAlignment;
  readonly width?: string;
  readonly render: (
    row: Row,
    rowIndex: number,
  ) => ReactNode;
};

export type DashboardTableProps<Row> = {
  readonly ariaLabel: string;
  readonly rows: readonly Row[];
  readonly columns:
    readonly DashboardTableColumn<Row>[];
  readonly getRowKey: (
    row: Row,
    rowIndex: number,
  ) => string;
  readonly caption?: string;
  readonly emptyMessage?: string;
  readonly minWidth?: string;
  readonly className?: string;
};

const alignmentClassNames = {
  left: undefined,
  center: styles.alignCenter,
  right: styles.alignRight,
} as const;

function mergeClassNames(
  ...values: readonly (string | undefined)[]
): string {
  return values.filter(Boolean).join(" ");
}

export function DashboardTable<Row>({
  ariaLabel,
  rows,
  columns,
  getRowKey,
  caption,
  emptyMessage = "No records to display.",
  minWidth = "680px",
  className,
}: DashboardTableProps<Row>) {
  const style: DashboardTableStyle = {
    "--d31-table-min-width": minWidth,
  };

  return (
    <div
      className={mergeClassNames(
        styles.tableScroll,
        className,
      )}
      role="region"
      aria-label={`${ariaLabel} scroll area`}
      tabIndex={0}
    >
      <table
        aria-label={ariaLabel}
        className={styles.table}
        style={style}
      >
        {caption ? (
          <caption className={styles.tableCaption}>
            {caption}
          </caption>
        ) : null}

        <thead>
          <tr>
            {columns.map((column) => (
              <th
                className={mergeClassNames(
                  styles.tableHeaderCell,
                  alignmentClassNames[
                    column.align ?? "left"
                  ],
                )}
                key={column.id}
                scope="col"
                style={
                  column.width
                    ? { width: column.width }
                    : undefined
                }
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.length > 0 ? (
            rows.map((row, rowIndex) => (
              <tr
                className={styles.tableRow}
                key={getRowKey(row, rowIndex)}
              >
                {columns.map((column) => (
                  <td
                    className={mergeClassNames(
                      styles.tableCell,
                      alignmentClassNames[
                        column.align ?? "left"
                      ],
                    )}
                    key={column.id}
                  >
                    {column.render(
                      row,
                      rowIndex,
                    )}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                className={styles.tableEmpty}
                colSpan={columns.length}
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
