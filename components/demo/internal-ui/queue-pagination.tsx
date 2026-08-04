"use client";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import styles from "./internal-ui.module.css";

type QueuePaginationProps = {
  readonly page: number;
  readonly pageCount: number;
  readonly pageSize?: number;
  readonly totalItems?: number;
  readonly onPageChange: (page: number) => void;
  readonly onPageSizeChange?: (
    pageSize: number,
  ) => void;
  readonly pageSizeOptions?: readonly number[];
};

function visiblePages(
  page: number,
  pageCount: number,
): readonly number[] {
  if (pageCount <= 5) {
    return Array.from(
      { length: pageCount },
      (_, index) => index + 1,
    );
  }

  const start = Math.max(
    1,
    Math.min(page - 2, pageCount - 4),
  );

  return Array.from(
    { length: 5 },
    (_, index) => start + index,
  );
}

export function QueuePagination({
  page,
  pageCount,
  pageSize = 10,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
}: QueuePaginationProps) {
  const pages = visiblePages(page, pageCount);

  const startItem =
    totalItems && totalItems > 0
      ? (page - 1) * pageSize + 1
      : 0;
  const endItem =
    totalItems && totalItems > 0
      ? Math.min(
          page * pageSize,
          totalItems,
        )
      : 0;

  return (
    <nav
      className={styles.pagination}
      aria-label="Queue pagination"
    >
      {totalItems !== undefined ? (
        <p className={styles.paginationSummary}>
          Showing {startItem}–{endItem} of{" "}
          {totalItems}
        </p>
      ) : (
        <span />
      )}

      <div className={styles.paginationControls}>
        <button
          type="button"
          className="button-base button-icon button-secondary"
          onClick={() =>
            onPageChange(Math.max(1, page - 1))
          }
          disabled={page <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft aria-hidden="true" />
        </button>

        {pages.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            onClick={() =>
              onPageChange(pageNumber)
            }
            className={[
              "button-base",
              "button-compact",
              pageNumber === page
                ? "button-primary"
                : "button-secondary",
            ].join(" ")}
            aria-current={
              pageNumber === page
                ? "page"
                : undefined
            }
            aria-label={`Page ${pageNumber}`}
          >
            {pageNumber}
          </button>
        ))}

        <button
          type="button"
          className="button-base button-icon button-secondary"
          onClick={() =>
            onPageChange(
              Math.min(pageCount, page + 1),
            )
          }
          disabled={page >= pageCount}
          aria-label="Next page"
        >
          <ChevronRight aria-hidden="true" />
        </button>

        {onPageSizeChange ? (
          <label className={styles.pageSizeControl}>
            <span className="sr-only">
              Rows per page
            </span>
            <select
              value={pageSize}
              className="input-base input-compact"
              onChange={(event) =>
                onPageSizeChange(
                  Number(event.target.value),
                )
              }
            >
              {pageSizeOptions.map((option) => (
                <option
                  key={option}
                  value={option}
                >
                  {option} per page
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>
    </nav>
  );
}
