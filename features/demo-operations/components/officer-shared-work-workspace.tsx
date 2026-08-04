"use client";

import Link from "next/link";
import { ArrowRight, UsersRound } from "lucide-react";
import { useMemo, useState } from "react";

import { OFFICER_TASKS } from "../fixtures/operational-data";
import { getOfficerRequestHref } from "@/features/demo-engine/navigation/officer-navigation-contract";

import styles from "./operational-workspaces.module.css";

type SharedWorkStatus = "Awaiting contribution" | "In progress" | "Response recorded";

type SharedWorkItem = {
  readonly id: string;
  readonly requestId: string;
  readonly applicant: string;
  readonly service: string;
  readonly direction: "Shared with you" | "Shared by you";
  readonly collaborator: string;
  readonly reason: string;
  readonly status: SharedWorkStatus;
  readonly sharedOn: string;
  readonly due: string;
};

const sharedWorkItems: readonly SharedWorkItem[] = [
  {
    id: "SHARE-0715",
    requestId: OFFICER_TASKS[0].id,
    applicant: OFFICER_TASKS[0].applicant,
    service: OFFICER_TASKS[0].service,
    direction: "Shared with you",
    collaborator: "Mercy Wanjiku",
    reason: "Confirm the payment receipt and advise whether records review can proceed.",
    status: "Awaiting contribution",
    sharedOn: "Today, 09:10 AM",
    due: "Today, 3:00 PM",
  },
  {
    id: "SHARE-0718",
    requestId: OFFICER_TASKS[1].id,
    applicant: OFFICER_TASKS[1].applicant,
    service: OFFICER_TASKS[1].service,
    direction: "Shared by you",
    collaborator: "Peter Mwangi",
    reason: "Verify the manual fee reference before the request moves to approval.",
    status: "In progress",
    sharedOn: "Yesterday, 02:35 PM",
    due: "Tomorrow, 10:30 AM",
  },
  {
    id: "SHARE-0698",
    requestId: OFFICER_TASKS[5].id,
    applicant: OFFICER_TASKS[5].applicant,
    service: OFFICER_TASKS[5].service,
    direction: "Shared with you",
    collaborator: "Kevin Mwangi",
    reason: "Review the applicant correction and confirm that the updated information is sufficient.",
    status: "Response recorded",
    sharedOn: "Yesterday, 11:45 AM",
    due: "Today, 4:30 PM",
  },
];

function statusTone(status: SharedWorkStatus) {
  if (status === "Awaiting contribution") return "Due soon";
  if (status === "In progress") return "Overdue";
  return undefined;
}

export function OfficerSharedWorkWorkspace() {
  const [filter, setFilter] = useState<"all" | "with-you" | "by-you">("all");
  const [message, setMessage] = useState("");
  const visibleItems = useMemo(
    () =>
      sharedWorkItems.filter((item) =>
        filter === "all"
          ? true
          : filter === "with-you"
            ? item.direction === "Shared with you"
            : item.direction === "Shared by you",
      ),
    [filter],
  );

  return (
    <main className={styles.workspace} data-officer-shared-work="true">
      <header className={styles.pageHeader}>
        <div>
          <h1>Shared Work</h1>
          <p>Coordinate contributions and follow up on requests shared across the officer workspace.</p>
        </div>
      </header>

      <section className={styles.metricGrid} aria-label="Shared work summary">
        <article className={styles.metricCard} data-tone="warning"><span>Shared with you</span><strong>{sharedWorkItems.filter((item) => item.direction === "Shared with you").length}</strong><small>Contribution requested</small></article>
        <article className={styles.metricCard} data-tone="good"><span>Shared by you</span><strong>{sharedWorkItems.filter((item) => item.direction === "Shared by you").length}</strong><small>Follow-up in progress</small></article>
        <article className={styles.metricCard} data-tone="warning"><span>Due today</span><strong>{sharedWorkItems.filter((item) => item.due.startsWith("Today")).length}</strong><small>Review before close</small></article>
        <article className={styles.metricCard} data-tone="good"><span>Responses recorded</span><strong>{sharedWorkItems.filter((item) => item.status === "Response recorded").length}</strong><small>Ready for next action</small></article>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <div className={styles.inlineActions}>
            <UsersRound aria-hidden="true" />
            <h2>Officer collaboration</h2>
          </div>
          <div className={styles.tabs} aria-label="Shared work filters">
            {[
              ["all", "All shared work"],
              ["with-you", "Shared with you"],
              ["by-you", "Shared by you"],
            ].map(([value, label]) => (
              <button
                className={styles.tabButton}
                data-active={filter === value ? "true" : undefined}
                key={value}
                onClick={() => setFilter(value as typeof filter)}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <caption className={styles.srOnly}>Officer shared work records</caption>
            <thead>
              <tr>
                <th scope="col">Request</th>
                <th scope="col">Shared work</th>
                <th scope="col">Reason</th>
                <th scope="col">Status</th>
                <th scope="col">Shared / due</th>
                <th scope="col"><span className={styles.srOnly}>Open request</span></th>
              </tr>
            </thead>
            <tbody>
              {visibleItems.map((item) => (
                <tr key={item.id}>
                  <td><strong>{item.requestId}</strong><br />{item.applicant}<br />{item.service}</td>
                  <td><strong>{item.direction}</strong><br />{item.collaborator}</td>
                  <td>{item.reason}</td>
                  <td><span className={styles.statusBadge} data-status={statusTone(item.status)}>{item.status}</span></td>
                  <td>{item.sharedOn}<br />Due: {item.due}</td>
                  <td><Link href={getOfficerRequestHref(item.requestId)} onClick={() => setMessage(`Opening ${item.requestId} in the officer workspace.`)}>Open request <ArrowRight aria-hidden="true" /></Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={styles.activityMessage} role="status">{message}</p>
      </section>
    </main>
  );
}
