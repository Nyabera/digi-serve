"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";

import styles from "./internal-ui.module.css";

type DetailPanelProps = {
  readonly title: string;
  readonly description?: string;
  readonly eyebrow?: string;
  readonly status?: ReactNode;
  readonly actions?: ReactNode;
  readonly footer?: ReactNode;
  readonly children: ReactNode;
  readonly onClose?: () => void;
  readonly sticky?: boolean;
  readonly className?: string;
};

export function DetailPanel({
  title,
  description,
  eyebrow,
  status,
  actions,
  footer,
  children,
  onClose,
  sticky = false,
  className = "",
}: DetailPanelProps) {
  return (
    <aside
      className={[
        styles.detailPanel,
        sticky ? styles.detailPanelSticky : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label={title}
    >
      <header className={styles.detailPanelHeader}>
        <div className={styles.detailPanelHeading}>
          {eyebrow ? (
            <p className="text-caption">
              {eyebrow}
            </p>
          ) : null}

          <div className={styles.detailTitleRow}>
            <h2 className="text-card-title">
              {title}
            </h2>
            {status}
          </div>

          {description ? (
            <p className="text-body-compact">
              {description}
            </p>
          ) : null}
        </div>

        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="button-base button-icon button-ghost"
            aria-label={`Close ${title}`}
          >
            <X aria-hidden="true" />
          </button>
        ) : null}
      </header>

      {actions ? (
        <div className={styles.detailPanelActions}>
          {actions}
        </div>
      ) : null}

      <div className={styles.detailPanelBody}>
        {children}
      </div>

      {footer ? (
        <footer className={styles.detailPanelFooter}>
          {footer}
        </footer>
      ) : null}
    </aside>
  );
}
