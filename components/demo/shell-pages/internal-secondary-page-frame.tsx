import type { ReactNode } from "react";

import styles from "./internal-secondary-page-shell.module.css";

type InternalSecondaryPageFrameProps = {
  readonly title: string;
  readonly subtitle: string;
  readonly eyebrow: string;
  readonly actions?: ReactNode;
  readonly children: ReactNode;
};

export function InternalSecondaryPageFrame({
  title,
  subtitle,
  eyebrow,
  actions,
  children,
}: InternalSecondaryPageFrameProps) {
  return (
    <main
      className={styles.frame}
      data-d29r7-secondary-page-frame="true"
    >
      <header className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>

        {actions ? (
          <div className={styles.pageActions}>
            {actions}
          </div>
        ) : null}
      </header>

      <div className={styles.embeddedPage}>
        {children}
      </div>
    </main>
  );
}
