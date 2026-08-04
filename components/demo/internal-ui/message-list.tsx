import Link from "next/link";
import { ArrowRight, MessageSquareText } from "lucide-react";

import { StaffAvatar } from "./staff-avatar";
import { StatusPill } from "./status-pill";
import styles from "./internal-ui.module.css";

export type MessageListItem = {
  readonly id: string;
  readonly senderName: string;
  readonly senderRole?: string;
  readonly senderImageUrl?: string;
  readonly subject?: string;
  readonly message: string;
  readonly timestamp: string;
  readonly href: string;
  readonly unread?: boolean;
};

type MessageListProps = {
  readonly title: string;
  readonly items: readonly MessageListItem[];
  readonly viewAllHref?: string;
  readonly viewAllLabel?: string;
};

export function MessageList({
  title,
  items,
  viewAllHref,
  viewAllLabel = "View all",
}: MessageListProps) {
  return (
    <section className={styles.sideList}>
      <header className={styles.sideListHeader}>
        <h2 className="text-card-title">
          {title}
        </h2>

        {viewAllHref ? (
          <Link
            href={viewAllHref}
            className={styles.sideListAction}
          >
            {viewAllLabel}
            <ArrowRight aria-hidden="true" />
          </Link>
        ) : null}
      </header>

      {items.length > 0 ? (
        <ul className={styles.messageItems}>
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className={styles.messageItem}
              >
                <StaffAvatar
                  name={item.senderName}
                  role={item.senderRole}
                  imageUrl={item.senderImageUrl}
                  size="sm"
                />

                <span className={styles.messageCopy}>
                  <span className={styles.messageHeading}>
                    <strong>
                      {item.senderName}
                    </strong>
                    <span>{item.timestamp}</span>
                  </span>

                  {item.subject ? (
                    <span className={styles.messageSubject}>
                      {item.subject}
                    </span>
                  ) : null}

                  <span className={styles.messagePreview}>
                    {item.message}
                  </span>
                </span>

                {item.unread ? (
                  <StatusPill tone="info">
                    Unread
                  </StatusPill>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.sideListEmpty}>
          <MessageSquareText aria-hidden="true" />
          <p>No recent messages.</p>
        </div>
      )}
    </section>
  );
}
