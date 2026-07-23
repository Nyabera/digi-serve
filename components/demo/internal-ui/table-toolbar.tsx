"use client";

import { Search } from "lucide-react";
import {
  useState,
  type ReactNode,
} from "react";

import styles from "./internal-ui.module.css";

type TableToolbarProps = {
  readonly searchLabel?: string;
  readonly searchPlaceholder?: string;
  readonly searchValue?: string;
  readonly onSearchChange?: (value: string) => void;
  readonly filters?: ReactNode;
  readonly actions?: ReactNode;
  readonly resultSummary?: ReactNode;
  readonly className?: string;
};

export function TableToolbar({
  searchLabel = "Search records",
  searchPlaceholder = "Search…",
  searchValue,
  onSearchChange,
  filters,
  actions,
  resultSummary,
  className = "",
}: TableToolbarProps) {
  const [localSearchValue, setLocalSearchValue] =
    useState("");

  const resolvedSearchValue =
    searchValue ?? localSearchValue;

  return (
    <div
      role="search"
      aria-label={searchLabel}
      className={[
        styles.tableToolbar,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <label className={styles.toolbarSearch}>
        <span className="sr-only">
          {searchLabel}
        </span>
        <Search aria-hidden="true" />
        <input
          type="search"
          value={resolvedSearchValue}
          placeholder={searchPlaceholder}
          className="input-base input-compact"
          onChange={(event) => {
            const nextValue =
              event.target.value;

            if (searchValue === undefined) {
              setLocalSearchValue(nextValue);
            }

            onSearchChange?.(nextValue);
          }}
        />
      </label>

      {filters ? (
        <div className={styles.toolbarFilters}>
          {filters}
        </div>
      ) : null}

      {resultSummary ? (
        <div className={styles.toolbarSummary}>
          {resultSummary}
        </div>
      ) : null}

      {actions ? (
        <div className={styles.toolbarActions}>
          {actions}
        </div>
      ) : null}
    </div>
  );
}
