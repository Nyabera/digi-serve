import type {
  DemoPack,
} from "../../config/demo-pack.types";
import {
  DEFAULT_DASHBOARD_REFERENCE_DATE,
} from "./dashboard-data.shared";
import {
  createDashboardPackSnapshot,
} from "./demo-pack-dashboard.snapshot";
import {
  dueState,
  formatDateLabel,
  formatTimestampLabel,
  percentage,
  requestApplicantName,
  selectUser,
  serviceNameForRequest,
  stableSlice,
  stageLabel,
  statusTone,
} from "./dashboard-adapter.utilities";
import type {
  DashboardAdapterContext,
  DashboardMetricData,
  DashboardTrendPoint,
} from "./dashboard-data.shared";
import type {
  OfficerActionRequiredItem,
  OfficerCaseSignal,
  OfficerDashboardData,
  OfficerHandoffItem,
  OfficerQueueItem,
  OfficerWorkPlanItem,
} from "./officer-dashboard.types";
import {
  getOfficerRequestHref,
  OFFICER_ROUTE_HREFS,
} from "@/features/demo-engine/navigation/officer-navigation-contract";

export function adaptOfficerDashboard(
  pack: DemoPack,
  context: DashboardAdapterContext = {},
): OfficerDashboardData {
  const snapshot =
    createDashboardPackSnapshot(pack);
  const now =
    context.now ??
    DEFAULT_DASHBOARD_REFERENCE_DATE;
  const officer = selectUser(
    snapshot,
    "officer",
    context.officerId,
  );
  const departmentId =
    context.departmentId ??
    officer?.departmentId;

  const assignedRequests =
    snapshot.requests.filter(
      (request) =>
        request.assignedOfficerId ===
          officer?.id ||
        (
          !request.assignedOfficerId &&
          request.assignedDepartmentId ===
            departmentId
        ),
    );

  const workingRequests =
    assignedRequests.length > 0
      ? assignedRequests
      : snapshot.requests;

  const completedCount =
    workingRequests.filter(
      (request) =>
        statusTone(request.status) ===
        "success",
    ).length;
  const overdueCount =
    workingRequests.filter(
      (request) =>
        dueState(
          request.dueAt,
          now,
        ).tone === "danger",
    ).length;
  const dueTodayCount =
    workingRequests.filter(
      (request) =>
        dueState(
          request.dueAt,
          now,
        ).label === "Due today",
    ).length;
  const activeCount = Math.max(
    0,
    workingRequests.length -
      completedCount,
  );
  const slaOnTime = clampSla(
    percentage(
      Math.max(
        0,
        workingRequests.length -
          overdueCount,
      ),
      Math.max(
        1,
        workingRequests.length,
      ),
    ),
  );

  const workloadPulse:
    readonly DashboardMetricData[] = [
      {
        id: "assigned",
        label: "Assigned",
        value: activeCount,
        tone: "primary",
        progress: percentage(
          activeCount,
          Math.max(
            1,
            workingRequests.length,
          ),
        ),
      },
      {
        id: "due-today",
        label: "Due today",
        value: dueTodayCount,
        tone: "warning",
        progress: percentage(
          dueTodayCount,
          Math.max(
            1,
            activeCount,
          ),
        ),
      },
      {
        id: "overdue",
        label: "Overdue",
        value: overdueCount,
        tone: "danger",
        progress: percentage(
          overdueCount,
          Math.max(
            1,
            activeCount,
          ),
        ),
      },
      {
        id: "sla-on-time",
        label: "SLA on time",
        value: `${slaOnTime}%`,
        tone: "success",
        progress: slaOnTime,
      },
    ];

  const workItems =
    workingRequests.map(
      (
        request,
        index,
      ): OfficerWorkPlanItem => {
        const due = dueState(
          request.dueAt,
          now,
        );
        const serviceName =
          serviceNameForRequest(
            snapshot,
            request,
          );
        const tone =
          statusTone(request.status);

        return {
          id: request.id,
          serviceName,
          applicantName:
            requestApplicantName(
              snapshot,
              request,
            ),
          requestId:
            request.requestId,
          nextAction:
            nextActionLabel(
              request.status,
              serviceName,
            ),
          stageLabel:
            stageLabel(request),
          slaLabel: due.label,
          slaProgress:
            due.progress,
          slaTone: due.tone,
          statusLabel:
            statusLabel(
              request.status,
            ),
          statusTone: tone,
          action: {
            id: `open-${request.id}`,
            label:
              index % 2 === 0
                ? "Review"
                : "Open",
            href: getOfficerRequestHref(
              request.requestId,
            ),
            intent: "review",
          },
        };
      },
    );

  const needsAction =
    workItems.filter(
      (item) =>
        item.statusTone === "danger" ||
        item.statusTone === "warning",
    );
  const waiting =
    workItems.filter(
      (item) =>
        item.statusTone === "purple" ||
        item.statusTone === "primary",
    );
  const ready =
    workItems.filter(
      (item) =>
        item.statusTone === "success",
    );

  const signals =
    buildSignals(
      snapshot,
      workingRequests,
    );

  const handoffs =
    buildHandoffs(
      workingRequests,
    );

  const recentActivity =
    stableSlice(
      workingRequests,
      4,
    ).map(
      (request, index) => ({
        id: `activity-${request.id}`,
        title:
          activityTitle(
            request.status,
          ),
        description:
          `${serviceNameForRequest(
            snapshot,
            request,
          )} • ${request.requestId}`,
        timestampLabel:
          formatTimestampLabel(
            request.submittedAt,
            `${9 - index}:15 AM`,
          ),
        tone:
          statusTone(request.status),
        action: {
          id: `activity-open-${request.id}`,
          label: "Open",
          href: getOfficerRequestHref(
            request.requestId,
          ),
          intent: "view" as const,
        },
      }),
    );

  const upNext:
    readonly OfficerQueueItem[] =
    stableSlice(
      workItems,
      4,
    ).map((item) => ({
      id: `up-next-${item.id}`,
      title: item.serviceName,
      requestId: item.requestId,
      dueLabel: item.slaLabel,
      tone: item.slaTone,
      action: item.action,
    }));

  const actionRequired:
    readonly OfficerActionRequiredItem[] = [
      {
        id: "documents-awaiting-review",
        label:
          "Documents awaiting review",
        count: Math.max(
          1,
          dueTodayCount,
        ),
        tone: "purple",
        action: {
          id: "open-documents",
          label: "View",
          href: OFFICER_ROUTE_HREFS.documentReview,
          intent: "review",
        },
      },
      {
        id: "referral-acceptance",
        label: "Referral acceptance",
        count: Math.max(
          0,
          handoffs.filter(
            (item) =>
              item.direction ===
              "incoming",
          ).length,
        ),
        tone: "success",
        action: {
          id: "open-handoffs",
          label: "View",
          href: OFFICER_ROUTE_HREFS.sharedWork,
          intent: "review",
        },
      },
      {
        id: "clarification-received",
        label: "Clarification received",
        count: Math.max(
          0,
          signals.filter(
            (signal) =>
              signal.group ===
              "messages",
          ).length,
        ),
        tone: "primary",
        action: {
          id: "open-messages",
          label: "View",
          href: OFFICER_ROUTE_HREFS.applicantMessages,
          intent: "view",
        },
      },
      {
        id: "decision-pending",
        label: "Decision pending",
        count: Math.max(
          0,
          ready.length,
        ),
        tone: "warning",
        action: {
          id: "open-decisions",
          label: "View",
          href: OFFICER_ROUTE_HREFS.approvalQueue,
          intent: "review",
        },
      },
      {
        id: "unread-messages",
        label: "Unread messages",
        count:
          signals.filter(
            (signal) =>
              signal.unread,
          ).length,
        tone: "purple",
        action: {
          id: "open-unread",
          label: "View",
          href: OFFICER_ROUTE_HREFS.applicantMessages,
          intent: "view",
        },
      },
    ];

  const rhythmPoints =
    buildRhythmPoints(
      workingRequests.length,
      completedCount,
    );

  return {
    identity: {
      id:
        officer?.id ??
        "demo-officer",
      displayName:
        officer?.name ??
        "Demo Officer",
      role: "officer",
      roleLabel: "Officer",
      institutionName:
        snapshot.institutionName,
      departmentName:
        snapshot.departments.find(
          (department) =>
            department.id ===
            departmentId,
        )?.name,
    },
    greeting:
      `Good afternoon, ${
        firstName(
          officer?.name ??
          "Officer",
        )
      }`,
    dateLabel:
      `Officer dashboard • ${
        formatDateLabel(now)
      }`,
    workloadPulse,
    workPlan: {
      "needs-action":
        stableSlice(
          needsAction.length > 0
            ? needsAction
            : workItems,
          6,
        ),
      "waiting-on-others":
        stableSlice(waiting, 6),
      "ready-to-complete":
        stableSlice(ready, 6),
    },
    caseSignals: {
      messages:
        signals.filter(
          (signal) =>
            signal.group ===
            "messages",
        ),
      assignments:
        signals.filter(
          (signal) =>
            signal.group ===
            "assignments",
        ),
      notices:
        signals.filter(
          (signal) =>
            signal.group ===
            "notices",
        ),
      "case-updates":
        signals.filter(
          (signal) =>
            signal.group ===
            "case-updates",
        ),
    },
    recentHandoffs:
      stableSlice(
        handoffs,
        3,
      ),
    recentActivity,
    upNext,
    actionRequired,
    rhythm: {
      periodLabel: "Last 7 days",
      points: rhythmPoints,
      primaryLabel: "Workload",
      secondaryLabel: "Completions",
      slaOnTime,
      action: {
        id: "open-sla-details",
        label: "View details",
        href: OFFICER_ROUTE_HREFS.sla,
        intent: "view",
      },
    },
  };
}

function clampSla(
  value: number,
): number {
  if (value === 0) {
    return 92;
  }

  return Math.max(
    65,
    Math.min(99, value),
  );
}

function firstName(
  name: string,
): string {
  return (
    name.trim().split(/\s+/)[0] ??
    name
  );
}

function statusLabel(
  status: string,
): string {
  const normalized =
    status.replace(/[-_]+/g, " ");

  return normalized.replace(
    /\b\w/g,
    (value) =>
      value.toUpperCase(),
  );
}

function nextActionLabel(
  status: string,
  serviceName: string,
): string {
  const tone = statusTone(status);

  if (tone === "danger") {
    return (
      "Review overdue documents and confirm eligibility."
    );
  }

  if (tone === "warning") {
    return (
      "Verify the pending evidence and make a decision."
    );
  }

  if (tone === "success") {
    return (
      "Confirm the outcome and complete the case."
    );
  }

  if (tone === "purple") {
    return (
      "Monitor the dependency and follow up when ready."
    );
  }

  return `Continue processing ${serviceName}.`;
}

function activityTitle(
  status: string,
): string {
  const tone = statusTone(status);

  if (tone === "success") {
    return "Decision recorded";
  }

  if (tone === "danger") {
    return "SLA attention required";
  }

  if (tone === "warning") {
    return "Status changed";
  }

  return "Request assigned";
}

function buildSignals(
  snapshot:
    ReturnType<
      typeof createDashboardPackSnapshot
    >,
  requests:
    ReturnType<
      typeof createDashboardPackSnapshot
    >["requests"],
): readonly OfficerCaseSignal[] {
  return stableSlice(
    requests,
    5,
  ).map(
    (request, index) => {
      const applicant =
        requestApplicantName(
          snapshot,
          request,
        );
      const service =
        serviceNameForRequest(
          snapshot,
          request,
        );
      const groups = [
        "messages",
        "assignments",
        "case-updates",
        "notices",
      ] as const;
      const group =
        groups[
          index % groups.length
        ];

      return {
        id: `signal-${request.id}`,
        group,
        senderName:
          group === "assignments"
            ? "Department Office"
            : applicant,
        senderInitials:
          initials(
            group === "assignments"
              ? "Department Office"
              : applicant,
          ),
        title:
          group === "messages"
            ? "Unread"
            : signalTitle(group),
        message:
          signalMessage(
            group,
          ),
        contextLabel:
          `${service} • ${request.requestId}`,
        timestampLabel:
          formatTimestampLabel(
            request.submittedAt,
            `${9 - index}:${
              index % 2 === 0
                ? "15"
                : "45"
            } AM`,
          ),
        unread:
          group === "messages",
        tone:
          group === "messages"
            ? "purple"
            : group === "assignments"
              ? "primary"
              : statusTone(
                  request.status,
                ),
        action: {
          id: `signal-open-${request.id}`,
          label:
            group === "messages"
              ? "Reply"
              : "View case",
          href: getOfficerRequestHref(
            request.requestId,
          ),
          intent: "view",
        },
      };
    },
  );
}

function buildHandoffs(
  requests:
    ReturnType<
      typeof createDashboardPackSnapshot
    >["requests"],
): readonly OfficerHandoffItem[] {
  const directions = [
    "incoming",
    "outgoing",
    "completed",
  ] as const;

  return stableSlice(
    requests,
    3,
  ).map(
    (request, index) => ({
      id: `handoff-${request.id}`,
      direction:
        directions[index],
      title:
        index === 0
          ? "From Department Office"
          : index === 1
            ? "To Finance Office"
            : "Completed to Applicant",
      serviceName:
        request.serviceId
          ?.replace(/[-_]+/g, " ")
          .replace(/\b\w/g, (value) =>
            value.toUpperCase(),
          ) ??
        "Service Request",
      requestId:
        request.requestId,
      timestampLabel:
        index === 2
          ? "Yesterday"
          : `${9 - index}:${
              index === 0
                ? "12"
                : "45"
            } AM`,
      action: {
        id: `handoff-open-${request.id}`,
        label: "View",
        href:
          getOfficerRequestHref(
            request.requestId,
          ),
        intent: "view",
      },
    }),
  );
}

function buildRhythmPoints(
  workload: number,
  completions: number,
): readonly DashboardTrendPoint[] {
  const base = Math.max(
    8,
    workload,
  );
  const completedBase = Math.max(
    4,
    completions,
  );

  return [
    "May 2",
    "May 3",
    "May 4",
    "May 5",
    "May 6",
    "May 7",
    "May 8",
  ].map(
    (label, index) => ({
      label,
      primary:
        base +
        [0, 4, 8, 6, 7, 5, 1][index],
      secondary:
        completedBase +
        [0, 2, 5, 3, 4, 4, 1][index],
    }),
  );
}

function initials(
  name: string,
): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function signalTitle(
  group: OfficerCaseSignal["group"],
): string {
  if (group === "assignments") {
    return "Assignment";
  }

  if (group === "notices") {
    return "Notice";
  }

  if (group === "case-updates") {
    return "Case update";
  }

  return "Unread";
}

function signalMessage(
  group: OfficerCaseSignal["group"],
): string {
  if (group === "assignments") {
    return "A request has been assigned for review.";
  }

  if (group === "notices") {
    return "A service deadline requires attention.";
  }

  if (group === "case-updates") {
    return "The request status has changed.";
  }

  return "New evidence has been uploaded for review.";
}
