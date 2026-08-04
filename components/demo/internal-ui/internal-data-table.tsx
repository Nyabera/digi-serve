import type { ReactNode } from "react";

import styles from "./internal-ui.module.css";

export type InternalTableDensity =
  | "dense"
  | "compact"
  | "comfortable";

export type InternalDataTableColumn<Row> = {
  readonly id: string;
  readonly header: ReactNode;
  readonly render: (row: Row) => ReactNode;
  readonly align?: "left" | "center" | "right";
  readonly className?: string;
  readonly headerClassName?: string;
};

type InternalDataTableProps<Row> = {
  readonly caption: string;
  readonly columns: readonly InternalDataTableColumn<Row>[];
  readonly rows: readonly Row[];
  readonly rowKey: (row: Row) => string;
  readonly density?: InternalTableDensity;
  readonly selectedRowKey?: string;
  readonly emptyState?: ReactNode;
  readonly className?: string;
};

export function InternalDataTable<Row>({
  caption,
  columns,
  rows,
  rowKey,
  density = "compact",
  selectedRowKey,
  emptyState,
  className = "",
}: InternalDataTableProps<Row>) {
  if (rows.length === 0) {
    return (
      <div
        className={[
          styles.tableEmpty,
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {emptyState ?? (
          <p>No records are available.</p>
        )}
      </div>
    );
  }

  return (
    <div
      className={[
        styles.tableViewport,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <table
        className={[
          styles.table,
          `table-density-${density}`,
        ].join(" ")}
      >
        <caption className="sr-only">
          {caption}
        </caption>

        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.id}
                scope="col"
                data-align={column.align ?? "left"}
                className={column.headerClassName}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => {
            const key = rowKey(row);
            const selected =
              selectedRowKey === key;

            return (
              <tr
                key={key}
                aria-selected={
                  selected ? "true" : undefined
                }
                data-selected={
                  selected ? "true" : undefined
                }
              >
                {columns.map((column) => (
                  <td
                    key={`${key}-${column.id}`}
                    data-align={
                      column.align ?? "left"
                    }
                    className={column.className}
                  >
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
