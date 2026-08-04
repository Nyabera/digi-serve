import type {
  ReactNode,
} from "react";

import styles from "./dashboard-primitives.module.css";

export type DashboardSectionHeadingProps = {
  readonly title: string;
  readonly description?: string;
  readonly action?: ReactNode;
  readonly headingLevel?: 2 | 3 | 4;
  readonly id?: string;
  readonly className?: string;
};

function mergeClassNames(
  ...values: readonly (string | undefined)[]
): string {
  return values.filter(Boolean).join(" ");
}

export function DashboardSectionHeading({
  title,
  description,
  action,
  headingLevel = 3,
  id,
  className,
}: DashboardSectionHeadingProps) {
  const Heading = `h${headingLevel}` as const;

  return (
    <header
      className={mergeClassNames(
        styles.sectionHeading,
        className,
      )}
    >
      <div className={styles.sectionHeadingCopy}>
        <Heading
          className={styles.sectionTitle}
          id={id}
        >
          {title}
        </Heading>

        {description ? (
          <p className={styles.sectionDescription}>
            {description}
          </p>
        ) : null}
      </div>

      {action ? (
        <div className={styles.sectionAction}>
          {action}
        </div>
      ) : null}
    </header>
  );
}
