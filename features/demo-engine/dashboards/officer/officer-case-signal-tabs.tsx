"use client";

import Link from "next/link";
import {
  ArrowRight,
} from "lucide-react";

import type {
  OfficerCaseSignal,
  OfficerDashboardData,
} from "../data";
import {
  DashboardStatusBadge,
  DashboardTabs,
} from "../shared";
import styles from "./officer-dashboard.module.css";

type OfficerCaseSignalTabsProps = {
  readonly caseSignals:
    OfficerDashboardData["caseSignals"];
};

function SignalList({
  signals,
}: {
  readonly signals:
    readonly OfficerCaseSignal[];
}) {
  if (signals.length === 0) {
    return (
      <p className={styles.emptyState}>
        No signals in this category.
      </p>
    );
  }

  return (
    <ul className={styles.signalList}>
      {signals.map((signal) => (
        <li
          className={styles.signalRow}
          key={signal.id}
        >
          <span
            aria-hidden="true"
            className={styles.signalAvatar}
            data-tone={signal.tone}
          >
            {signal.senderInitials}
          </span>

          <div className={styles.signalCopy}>
            <div className={styles.signalTitleLine}>
              <strong>{signal.senderName}</strong>

              {signal.unread ? (
                <DashboardStatusBadge
                  tone="primary"
                >
                  Unread
                </DashboardStatusBadge>
              ) : null}
            </div>

            <p>{signal.message}</p>
            <span>{signal.contextLabel}</span>
          </div>

          <div className={styles.signalMeta}>
            <time>{signal.timestampLabel}</time>

            {signal.action ? (
              <Link
                aria-label={`${signal.action.label}: ${signal.contextLabel}`}
                className={styles.inlineAction}
                href={signal.action.href}
              >
                <span>
                  {signal.action.label}
                </span>
                <ArrowRight
                  aria-hidden="true"
                  size={12}
                  strokeWidth={2}
                />
              </Link>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}

export function OfficerCaseSignalTabs({
  caseSignals,
}: OfficerCaseSignalTabsProps) {
  const items = [
    {
      value: "messages",
      label: "Messages",
      count:
        caseSignals.messages.length,
      content: (
        <SignalList
          signals={caseSignals.messages}
        />
      ),
    },
    {
      value: "assignments",
      label: "Assignments",
      count:
        caseSignals.assignments.length,
      content: (
        <SignalList
          signals={
            caseSignals.assignments
          }
        />
      ),
    },
    {
      value: "notices",
      label: "Notices",
      count:
        caseSignals.notices.length,
      content: (
        <SignalList
          signals={caseSignals.notices}
        />
      ),
    },
    {
      value: "case-updates",
      label: "Case Updates",
      count:
        caseSignals[
          "case-updates"
        ].length,
      content: (
        <SignalList
          signals={
            caseSignals[
              "case-updates"
            ]
          }
        />
      ),
    },
  ] as const;

  return (
    <DashboardTabs
      ariaLabel="Case signals"
      className={styles.caseSignalTabs}
      defaultValue="messages"
      items={items}
    />
  );
}
