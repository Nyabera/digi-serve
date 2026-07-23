import type { ReactNode } from "react";

import styles from "./internal-shell.module.css";

type InternalPageHeaderProps = {
  readonly eyebrow?: string;
  readonly title: string;
  readonly description?: string;
  readonly actions?: ReactNode;
  readonly breadcrumbs?: ReactNode;
};

export function InternalPageHeader({
  eyebrow,
  title,
  description,
  actions,
  breadcrumbs,
}: InternalPageHeaderProps) {
  return (
    <header className={styles.pageHeader}>
      <div className={styles.pageHeaderCopy}>
        {breadcrumbs ? (
          <div className={styles.breadcrumbs}>
            {breadcrumbs}
          </div>
        ) : null}

        {eyebrow ? (
          <p className="text-caption">
            {eyebrow}
          </p>
        ) : null}

        <h1 className="text-page-title">
          {title}
        </h1>

        {description ? (
          <p className="text-body-compact">
            {description}
          </p>
        ) : null}
      </div>

      {actions ? (
        <div className={styles.pageHeaderActions}>
          {actions}
        </div>
      ) : null}
    </header>
  );
}
