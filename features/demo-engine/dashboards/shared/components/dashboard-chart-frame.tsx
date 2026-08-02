"use client";

import type {
  CSSProperties,
  ReactNode,
} from "react";
import {
  useCallback,
  useRef,
  useState,
} from "react";

import styles from "./dashboard-primitives.module.css";

type DashboardChartFrameStyle = CSSProperties & {
  readonly "--d31-chart-min-height": string;
  readonly "--d31-chart-aspect-ratio": string;
};

export type DashboardChartSize = {
  readonly width: number;
  readonly height: number;
};

export type DashboardChartFrameProps = {
  readonly title: string;
  readonly description?: string;
  readonly action?: ReactNode;
  readonly legend?: ReactNode;
  readonly minHeight?: number;
  readonly aspectRatio?: string;
  readonly children:
    | ReactNode
    | ((
        size: DashboardChartSize,
      ) => ReactNode);
  readonly className?: string;
};

function mergeClassNames(
  ...values: readonly (string | undefined)[]
): string {
  return values.filter(Boolean).join(" ");
}

function useMeasuredElement() {
  const [measuredSize, setMeasuredSize] =
    useState<DashboardChartSize>({
      width: 0,
      height: 0,
    });
  const observerRef =
    useRef<ResizeObserver | null>(null);

  const measureElement = useCallback(
    (element: HTMLDivElement | null) => {
      observerRef.current?.disconnect();
      observerRef.current = null;

      if (!element) {
        return;
      }

      const publishMeasurement = (
        width: number,
        height: number,
      ) => {
        const nextWidth = Math.max(
          0,
          Math.round(width),
        );
        const nextHeight = Math.max(
          0,
          Math.round(height),
        );

        setMeasuredSize((current) => {
          if (
            current.width === nextWidth &&
            current.height === nextHeight
          ) {
            return current;
          }

          return {
            width: nextWidth,
            height: nextHeight,
          };
        });
      };

      const initialRect =
        element.getBoundingClientRect();

      publishMeasurement(
        initialRect.width,
        initialRect.height,
      );

      if (
        typeof ResizeObserver === "undefined"
      ) {
        return;
      }

      const observer = new ResizeObserver(
        (entries) => {
          const entry = entries[0];

          if (!entry) {
            return;
          }

          publishMeasurement(
            entry.contentRect.width,
            entry.contentRect.height,
          );
        },
      );

      observer.observe(element);
      observerRef.current = observer;
    },
    [],
  );

  return {
    measureElement,
    measuredWidth: measuredSize.width,
    measuredHeight: measuredSize.height,
  };
}

export function DashboardChartFrame({
  title,
  description,
  action,
  legend,
  minHeight = 220,
  aspectRatio = "auto",
  children,
  className,
}: DashboardChartFrameProps) {
  const {
    measureElement,
    measuredWidth,
    measuredHeight,
  } = useMeasuredElement();

  const style: DashboardChartFrameStyle = {
    "--d31-chart-min-height":
      `${Math.max(120, minHeight)}px`,
    "--d31-chart-aspect-ratio":
      aspectRatio,
  };

  const hasMeasuredSize =
    measuredWidth > 0 &&
    measuredHeight > 0;

  return (
    <section
      className={mergeClassNames(
        styles.chartFrame,
        className,
      )}
      aria-label={title}
    >
      <header className={styles.chartHeader}>
        <div className={styles.chartCopy}>
          <h3 className={styles.chartTitle}>
            {title}
          </h3>

          {description ? (
            <p className={styles.chartDescription}>
              {description}
            </p>
          ) : null}
        </div>

        {action ? (
          <div className={styles.chartAction}>
            {action}
          </div>
        ) : null}
      </header>

      {legend ? (
        <div className={styles.chartLegend}>
          {legend}
        </div>
      ) : null}

      <div
        className={styles.chartPlot}
        ref={measureElement}
        style={style}
      >
        {typeof children === "function" ? (
          hasMeasuredSize ? (
            children({
              width: measuredWidth,
              height: measuredHeight,
            })
          ) : (
            <div className={styles.chartPlaceholder}>
              Measuring chart…
            </div>
          )
        ) : (
          children
        )}
      </div>
    </section>
  );
}
