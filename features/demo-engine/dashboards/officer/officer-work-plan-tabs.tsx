"use client";

import Link from "next/link";
import {
  FileCheck2,
  FileText,
} from "lucide-react";

import type {
  DashboardSemanticTone,
  OfficerDashboardData,
  OfficerWorkPlanItem,
} from "../data";
import {
  DashboardProgress,
  DashboardStatusBadge,
  DashboardTable,
  DashboardTabs,
} from "../shared";
import type {
  DashboardTableColumn,
} from "../shared";
import styles from "./officer-dashboard.module.css";

type OfficerWorkPlanTabsProps = {
  readonly workPlan:
    OfficerDashboardData["workPlan"];
};

type ProgressTone = Exclude<
  DashboardSemanticTone,
  "neutral"
>;

function progressTone(
  tone: DashboardSemanticTone,
): ProgressTone {
  return tone === "neutral"
    ? "primary"
    : tone;
}

function WorkPlanTable({
  rows,
  label,
}: {
  readonly rows:
    readonly OfficerWorkPlanItem[];
  readonly label: string;
}) {
  const columns:
    readonly DashboardTableColumn<OfficerWorkPlanItem>[] = [
      {
        id: "service",
        header: "Service",
        width: "145px",
        render: (row) => (
          <div className={styles.serviceCell}>
            <span
              aria-hidden="true"
              className={styles.serviceIcon}
            >
              <FileText
                size={15}
                strokeWidth={2}
              />
            </span>

            <span className={styles.cellPrimary}>
              {row.serviceName}
            </span>
          </div>
        ),
      },
      {
        id: "applicant",
        header: "Applicant",
        width: "116px",
        render: (row) => (
          <span className={styles.cellPrimary}>
            {row.applicantName}
          </span>
        ),
      },
      {
        id: "request",
        header: "Request ID",
        width: "108px",
        render: (row) => (
          <span className={styles.requestReference}>
            {row.requestId}
          </span>
        ),
      },
      {
        id: "next-action",
        header: "Next action",
        width: "220px",
        render: (row) => (
          <span className={styles.cellSecondary}>
            {row.nextAction}
          </span>
        ),
      },
      {
        id: "stage",
        header: "Stage",
        width: "118px",
        render: (row) => (
          <span className={styles.cellSecondary}>
            {row.stageLabel}
          </span>
        ),
      },
      {
        id: "sla",
        header: "SLA",
        width: "104px",
        render: (row) => (
          <div className={styles.slaCell}>
            <DashboardProgress
              tone={progressTone(
                row.slaTone,
              )}
              value={row.slaProgress}
            />
            <span
              data-tone={row.slaTone}
              className={styles.slaLabel}
            >
              {row.slaLabel}
            </span>
          </div>
        ),
      },
      {
        id: "status",
        header: "Status",
        width: "96px",
        render: (row) => (
          <DashboardStatusBadge
            tone={row.statusTone}
          >
            {row.statusLabel}
          </DashboardStatusBadge>
        ),
      },
      {
        id: "action",
        header: "Action",
        align: "right",
        width: "74px",
        render: (row) => (
          <Link
            className={styles.tableAction}
            href={row.action.href}
          >
            <FileCheck2
              aria-hidden="true"
              size={13}
              strokeWidth={2}
            />
            <span>{row.action.label}</span>
          </Link>
        ),
      },
    ];

  return (
    <DashboardTable
      ariaLabel={label}
      columns={columns}
      emptyMessage="No work items are currently in this group."
      getRowKey={(row) => row.id}
      minWidth="980px"
      rows={rows}
    />
  );
}

export function OfficerWorkPlanTabs({
  workPlan,
}: OfficerWorkPlanTabsProps) {
  const items = [
    {
      value: "needs-action",
      label: "Needs action",
      count:
        workPlan["needs-action"].length,
      content: (
        <WorkPlanTable
          label="Officer work requiring action"
          rows={
            workPlan["needs-action"]
          }
        />
      ),
    },
    {
      value: "waiting-on-others",
      label: "Waiting on others",
      count:
        workPlan[
          "waiting-on-others"
        ].length,
      content: (
        <WorkPlanTable
          label="Officer work waiting on other people"
          rows={
            workPlan[
              "waiting-on-others"
            ]
          }
        />
      ),
    },
    {
      value: "ready-to-complete",
      label: "Ready to complete",
      count:
        workPlan[
          "ready-to-complete"
        ].length,
      content: (
        <WorkPlanTable
          label="Officer work ready to complete"
          rows={
            workPlan[
              "ready-to-complete"
            ]
          }
        />
      ),
    },
  ] as const;

  return (
    <DashboardTabs
      ariaLabel="Today's work plan"
      className={styles.workPlanTabs}
      defaultValue="needs-action"
      items={items}
    />
  );
}
