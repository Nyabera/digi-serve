"use client";

import type {
  KeyboardEvent as ReactKeyboardEvent,
  ReactNode,
} from "react";
import {
  useId,
  useState,
} from "react";

import styles from "./dashboard-primitives.module.css";

export type DashboardTabItem = {
  readonly value: string;
  readonly label: string;
  readonly count?: number;
  readonly disabled?: boolean;
  readonly content: ReactNode;
};

export type DashboardTabsProps = {
  readonly ariaLabel: string;
  readonly items: readonly DashboardTabItem[];
  readonly value?: string;
  readonly defaultValue?: string;
  readonly onValueChange?: (
    value: string,
  ) => void;
  readonly className?: string;
};

function mergeClassNames(
  ...values: readonly (string | undefined)[]
): string {
  return values.filter(Boolean).join(" ");
}

export function DashboardTabs({
  ariaLabel,
  items,
  value,
  defaultValue,
  onValueChange,
  className,
}: DashboardTabsProps) {
  const id = useId();
  const fallbackValue =
    items.find((item) => !item.disabled)?.value ??
    "";
  const [internalValue, setInternalValue] =
    useState(
      defaultValue &&
        items.some(
          (item) =>
            item.value === defaultValue &&
            !item.disabled,
        )
        ? defaultValue
        : fallbackValue,
    );

  const requestedValue =
    value ?? internalValue;

  const activeItem =
    items.find(
      (item) =>
        item.value === requestedValue &&
        !item.disabled,
    ) ??
    items.find((item) => !item.disabled);

  const activeValue =
    activeItem?.value ?? "";

  const activate = (nextValue: string) => {
    if (value === undefined) {
      setInternalValue(nextValue);
    }

    onValueChange?.(nextValue);
  };

  const handleKeyDown = (
    event: ReactKeyboardEvent<HTMLDivElement>,
  ) => {
    if (
      ![
        "ArrowLeft",
        "ArrowRight",
        "Home",
        "End",
      ].includes(event.key)
    ) {
      return;
    }

    const tabs = Array.from(
      event.currentTarget.querySelectorAll<
        HTMLButtonElement
      >('[role="tab"]:not(:disabled)'),
    );

    if (tabs.length === 0) {
      return;
    }

    const currentIndex = tabs.findIndex(
      (tab) => tab === document.activeElement,
    );

    let nextIndex = currentIndex;

    if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = tabs.length - 1;
    } else if (event.key === "ArrowRight") {
      nextIndex =
        currentIndex >= tabs.length - 1
          ? 0
          : currentIndex + 1;
    } else if (event.key === "ArrowLeft") {
      nextIndex =
        currentIndex <= 0
          ? tabs.length - 1
          : currentIndex - 1;
    }

    const nextTab = tabs[nextIndex];

    if (!nextTab) {
      return;
    }

    event.preventDefault();
    nextTab.focus();
    nextTab.click();
  };

  return (
    <div
      className={mergeClassNames(
        styles.tabs,
        className,
      )}
    >
      <div
        aria-label={ariaLabel}
        className={styles.tabList}
        onKeyDown={handleKeyDown}
        role="tablist"
      >
        {items.map((item) => {
          const selected =
            item.value === activeValue;
          const tabId =
            `${id}-${item.value}-tab`;
          const panelId =
            `${id}-${item.value}-panel`;

          return (
            <button
              aria-controls={panelId}
              aria-selected={selected}
              className={styles.tab}
              disabled={item.disabled}
              id={tabId}
              key={item.value}
              onClick={() => activate(item.value)}
              role="tab"
              tabIndex={selected ? 0 : -1}
              type="button"
            >
              <span>{item.label}</span>

              {item.count !== undefined ? (
                <span className={styles.tabCount}>
                  {item.count}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {activeItem ? (
        <div
          aria-labelledby={
            `${id}-${activeItem.value}-tab`
          }
          className={styles.tabPanel}
          id={`${id}-${activeItem.value}-panel`}
          role="tabpanel"
          tabIndex={0}
        >
          {activeItem.content}
        </div>
      ) : null}
    </div>
  );
}
