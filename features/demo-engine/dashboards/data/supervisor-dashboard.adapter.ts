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
  userById,
} from "./dashboard-adapter.utilities";
import type {
  DashboardAdapterContext,
  DashboardMetricData,
} from "./dashboard-data.shared";
import type {
  SupervisorDashboardData,
  SupervisorExceptionItem,
  SupervisorPerformanceRank,
} from "./supervisor-dashboard.types";

export function adaptSupervisorDashboard(
  pack: DemoPack,
  context: DashboardAdapterContext = {},
): SupervisorDashboardData {
  const snapshot =
    createDashboardPackSnapshot(pack);
  const now =
    context.now ??
    DEFAULT_DASHBOARD_REFERENCE_DATE;
  const supervisor = selectUser(
    snapshot,
    "supervisor",
    context.supervisorId,
  );
  const departmentId =
    context.departmentId ??
    supervisor?.departmentId ??
    snapshot.departments[0]?.id;

  const departmentRequests =
    snapshot.requests.filter(
      (request) =>
        !departmentId ||
        request.assignedDepartmentId ===
          departmentId,
    );
  const requests =
    departmentRequests.length > 0
      ? departmentRequests
      : snapshot.requests;

  const overdue = requests.filter(
    (request) =>
      dueState(
        request.dueAt,
        now,
      ).tone === "danger",
  );
  const dueToday = requests.filter(
    (request) =>
      dueState(
        request.dueAt,
        now,
      ).label === "Due today",
  );
  const completed = requests.filter(
    (request) =>
      statusTone(request.status) ===
      "success",
  );
  const unassigned = requests.filter(
    (request) =>
      !request.assignedOfficerId,
  );
  const pendingApprovals =
    requests.filter(
      (request) =>
        request.status.includes(
          "approval",
        ) ||
        request.currentStepId
          ?.toLowerCase()
          .includes("approval"),
    );

  const slaOnTime = Math.max(
    65,
    percentage(
      Math.max(
        0,
        requests.length -
          overdue.length,
      ),
      Math.max(
        1,
        requests.length,
      ),
    ) || 92,
  );

  const departmentHealth:
    readonly DashboardMetricData[] = [
      metric(
        "open",
        "Open requests",
        Math.max(
          0,
          requests.length -
            completed.length,
        ),
        "primary",
      ),
      metric(
        "unassigned",
        "Unassigned",
        unassigned.length,
        "purple",
      ),
      metric(
        "due-today",
        "Due today",
        dueToday.length,
        "warning",
      ),
      metric(
        "overdue",
        "Overdue",
        overdue.length,
        "danger",
      ),
      metric(
        "pending-approvals",
        "Pending approvals",
        pendingApprovals.length,
        "warning",
      ),
      {
        id: "sla-on-time",
        label: "SLA on time",
        value: `${slaOnTime}%`,
        tone: "success",
        progress: slaOnTime,
      },
    ];

  const approvalLane =
    stableSlice(
      pendingApprovals.length > 0
        ? pendingApprovals
        : requests,
      5,
    ).map((request) => ({
      id: request.id,
      requestId:
        request.requestId,
      applicantName:
        requestApplicantName(
          snapshot,
          request,
        ),
      serviceName:
        serviceNameForRequest(
          snapshot,
          request,
        ),
      dueLabel:
        dueState(
          request.dueAt,
          now,
        ).label,
      stageLabel:
        stageLabel(request),
      ownerName:
        userById(
          snapshot,
          request.assignedOfficerId,
        )?.name ??
        "Unassigned",
      action: {
        id: `approve-${request.id}`,
        label: "Approve",
        href:
          `/demo/supervisor/approvals/${request.requestId}`,
        intent: "approve" as const,
      },
    }));

  const criticalAttention = [
    attention(
      "overdue",
      `${overdue.length} requests are overdue`,
      overdue[0]
        ? `Oldest: ${overdue[0].requestId}`
        : "No overdue requests",
      overdue.length,
      "danger",
      "/demo/supervisor/sla-monitor",
    ),
    attention(
      "breach-risk",
      `${dueToday.length} requests breach risk`,
      "Due within 24 hours",
      dueToday.length,
      "warning",
      "/demo/supervisor/sla-monitor",
    ),
    attention(
      "handoffs",
      `${Math.min(3, requests.length)} handoffs pending`,
      "Awaiting your review",
      Math.min(
        3,
        requests.length,
      ),
      "warning",
      "/demo/supervisor",
    ),
  ];

  const unassignedWork = [
    attention(
      "requests-unassigned",
      `${unassigned.length} requests need assignment`,
      "New in the last 24 hours",
      unassigned.length,
      "purple",
      "/demo/supervisor",
    ),
    attention(
      "documents-unassigned",
      `${Math.max(
        0,
        snapshot.documents.filter(
          (document) =>
            document.status.includes(
              "review",
            ),
        ).length,
      )} documents for verification`,
      "Awaiting owner",
      snapshot.documents.filter(
        (document) =>
          document.status.includes(
            "review",
          ),
      ).length,
      "purple",
      "/demo/officer/documents",
    ),
  ];

  const departmentOfficers =
    snapshot.users.filter(
      (user) =>
        user.role.includes("officer") &&
        (
          !departmentId ||
          user.departmentId ===
            departmentId
        ),
    );
  const officers =
    departmentOfficers.length > 0
      ? departmentOfficers
      : snapshot.users.filter(
          (user) =>
            user.role.includes(
              "officer",
            ),
        );

  const officerCapacity =
    stableSlice(officers, 5).map(
      (officer, index) => {
        const openCount =
          requests.filter(
            (request) =>
              request.assignedOfficerId ===
              officer.id,
          ).length;
        const utilization =
          Math.min(
            98,
            Math.max(
              32,
              openCount * 12 +
                38 +
                index * 4,
            ),
          );

        return {
          id: officer.id,
          officerName: officer.name,
          roleLabel: "Officer",
          utilization,
          tone:
            utilization >= 85
              ? "danger"
              : utilization >= 65
                ? "warning"
                : "success",
          openCount,
        } as const;
      },
    );

  const assignmentCentre =
    stableSlice(
      snapshot.services,
      3,
    ).map((service, index) => ({
      id: `assignment-${service.id}`,
      serviceName: service.name,
      estimatedDurationLabel:
        index === 0
          ? "Est. 3h 10m"
          : index === 1
            ? "Est. 1h 20m"
            : "Est. 4h 40m",
      skillMatch:
        Math.max(
          72,
          92 - index * 8,
        ),
      recommendedOfficerName:
        officerCapacity[
          index %
            Math.max(
              1,
              officerCapacity.length,
            )
        ]?.officerName ??
        "Available Officer",
      action: {
        id: `assign-${service.id}`,
        label: "Assign",
        href: "/demo/supervisor",
        intent: "assign" as const,
      },
    }));

  const departmentQueue =
    serviceQueue(snapshot, requests);

  const handoffControl =
    stableSlice(
      requests,
      3,
    ).map((request, index) => ({
      id: `handoff-${request.id}`,
      stageLabel:
        stageLabel(request),
      fromLabel:
        index % 2 === 0
          ? "Admissions Office"
          : "Records Office",
      toLabel:
        index % 2 === 0
          ? "Finance Office"
          : "Registrar Office",
      contextLabel:
        `${serviceNameForRequest(
          snapshot,
          request,
        )} • ${request.requestId}`,
      timestampLabel:
        formatTimestampLabel(
          request.submittedAt,
          `Sent ${9 - index}:${
            index === 0
              ? "21"
              : "44"
          } AM`,
        ),
      action: {
        id: `review-handoff-${request.id}`,
        label: "Review",
        href:
          `/demo/officer/requests/${request.requestId}`,
        intent: "review" as const,
      },
    }));

  const escalations:
    readonly SupervisorExceptionItem[] = [
      exception(
        "sla-risk",
        "SLA breach risk",
        "Next breach in 3h 32m",
        overdue.length,
        "danger",
        "/demo/supervisor/sla-monitor",
      ),
      exception(
        "waiting-applicant",
        "Waiting on applicant",
        "Documents outstanding",
        Math.max(
          1,
          dueToday.length,
        ),
        "warning",
        "/demo/supervisor",
      ),
      exception(
        "payment-issue",
        "Payment issue",
        "Verification pending",
        Math.max(
          1,
          Math.floor(
            requests.length / 8,
          ),
        ),
        "purple",
        "/demo/supervisor",
      ),
      exception(
        "verification-hold",
        "Verification hold",
        "Data mismatch",
        Math.max(
          1,
          snapshot.documents.filter(
            (document) =>
              document.status.includes(
                "review",
              ),
          ).length,
        ),
        "success",
        "/demo/officer/documents",
      ),
    ];

  const documentPaymentExceptions:
    readonly SupervisorExceptionItem[] = [
      exception(
        "missing-documents",
        "Missing documents",
        "Requires applicant action",
        Math.max(
          1,
          Math.floor(
            requests.length / 6,
          ),
        ),
        "warning",
        "/demo/officer/documents",
      ),
      exception(
        "invalid-payments",
        "Invalid payments",
        "Payments validation failed",
        Math.max(
          1,
          Math.floor(
            requests.length / 10,
          ),
        ),
        "danger",
        "/demo/supervisor",
      ),
      exception(
        "duplicates",
        "Duplicate submissions",
        "Potential duplicates",
        Math.max(
          1,
          Math.floor(
            requests.length / 14,
          ),
        ),
        "purple",
        "/demo/supervisor",
      ),
    ];

  const serviceFlow =
    [
      "Records review",
      "Finance verification",
      "Registrar approval",
      "Outcome issuance",
    ].map(
      (label, index) => ({
        id:
          label
            .toLowerCase()
            .replace(/\s+/g, "-"),
        label,
        averageDurationHours:
          [6.2, 9.1, 3.4, 5.8][index],
        targetHours:
          [6, 8, 4, 4][index],
        inProgress:
          Math.max(
            4,
            Math.round(
              requests.length /
                (index + 1),
            ),
          ),
        tone:
          [
            "success",
            "danger",
            "warning",
            "success",
          ][index] as
            | "success"
            | "danger"
            | "warning",
      }),
    );

  const slaTrend =
    Array.from(
      { length: 14 },
      (_, index) => ({
        label:
          index < 3
            ? `Apr ${29 + index}`
            : `May ${index - 2}`,
        primary:
          Math.min(
            98,
            68 +
              [0, 6, 9, 14, 8, 11, 16][
                index % 7
              ] +
              Math.floor(index / 4),
          ),
      }),
    );

  const officerPerformance =
    capacityToPerformance(
      officerCapacity,
    );

  const servicePerformance =
    stableSlice(
      departmentQueue,
      5,
    ).map(
      (
        row,
        index,
      ): SupervisorPerformanceRank => ({
        id: row.id,
        label: row.serviceName,
        secondaryLabel:
          "SLA on time",
        score: Math.max(
          72,
          93 - index * 3,
        ),
        tone:
          index < 3
            ? "success"
            : "warning",
      }),
    );

  const recentDecisions =
    stableSlice(
      completed.length > 0
        ? completed
        : requests,
      5,
    ).map((request, index) => ({
      id: `decision-${request.id}`,
      title:
        request.requestId,
      description:
        `${serviceNameForRequest(
          snapshot,
          request,
        )} • Approved by you`,
      timestampLabel:
        `May 12, 2026 ${
          8 + index
        }:${index % 2 === 0 ? "24" : "09"} AM`,
      tone: "success" as const,
      action: {
        id: `view-decision-${request.id}`,
        label: "View",
        href:
          `/demo/supervisor/approvals/${request.requestId}`,
        intent: "view" as const,
      },
    }));

  const departmentActivity =
    stableSlice(
      requests,
      5,
    ).map((request, index) => ({
      id: `department-activity-${request.id}`,
      title:
        userById(
          snapshot,
          request.assignedOfficerId,
        )?.name ??
        "System",
      description:
        `${stageLabel(
          request,
        )} • ${request.requestId}`,
      timestampLabel:
        `${9 - index}:${
          index % 2 === 0
            ? "21"
            : "44"
        } AM`,
      tone:
        statusTone(
          request.status,
        ),
      action: {
        id: `view-activity-${request.id}`,
        label: "View",
        href:
          `/demo/officer/requests/${request.requestId}`,
        intent: "view" as const,
      },
    }));

  return {
    identity: {
      id:
        supervisor?.id ??
        "demo-supervisor",
      displayName:
        supervisor?.name ??
        "Demo Supervisor",
      role: "supervisor",
      roleLabel: "Supervisor",
      institutionName:
        snapshot.institutionName,
      departmentName:
        snapshot.departments.find(
          (department) =>
            department.id ===
            departmentId,
        )?.name ??
        "Department",
    },
    greeting:
      `Good afternoon, ${
        supervisor?.name
          ?.split(/\s+/)[0] ??
        "Supervisor"
      }`,
    dateLabel:
      formatDateLabel(now),
    departmentHealth,
    approvalLane,
    criticalAttention,
    unassignedWork,
    officerCapacity,
    assignmentCentre,
    departmentQueue,
    handoffControl,
    escalations,
    documentPaymentExceptions,
    serviceFlow,
    slaTrend,
    officerPerformance,
    servicePerformance,
    throughput: {
      total:
        completed.length,
      deltaPercentage: 12,
      points: Array.from(
        { length: 7 },
        (_, index) => ({
          label: `May ${6 + index}`,
          primary:
            Math.max(
              4,
              completed.length +
                [0, 4, -2, 3, 1, 5, 2][
                  index
                ],
            ),
        }),
      ),
    },
    applicantExperience: {
      score: 4.6,
      responseCount:
        Math.max(
          34,
          requests.length,
        ),
      distribution: [
        {
          id: "5-star",
          label: "5 stars",
          value: 62,
          percentage: 62,
          tone: "success",
        },
        {
          id: "4-star",
          label: "4 stars",
          value: 26,
          percentage: 26,
          tone: "success",
        },
        {
          id: "3-star",
          label: "3 stars",
          value: 9,
          percentage: 9,
          tone: "warning",
        },
        {
          id: "2-star",
          label: "2 stars",
          value: 3,
          percentage: 3,
          tone: "danger",
        },
      ],
    },
    performanceInsights: [
      {
        id: "bottleneck",
        title:
          "Finance verification remains the bottleneck",
        description:
          "Average duration is above the target.",
        tone: "purple",
      },
      {
        id: "sla-risk",
        title:
          `SLA at risk for ${overdue.length} requests`,
        description:
          "Targeted follow-up is recommended.",
        tone: "danger",
      },
      {
        id: "outcomes",
        title:
          "Good performance in outcome issuance",
        description:
          `${slaOnTime}% remains within target.`,
        tone: "success",
      },
    ],
    recentDecisions,
    departmentActivity,
    auditHighlights: {
      decisionsMade:
        completed.length,
      handoffsCreated:
        handoffControl.length,
      escalations:
        overdue.length,
      auditEvents:
        Math.max(
          requests.length,
          completed.length * 3,
        ),
      signals: [
        "No policy violations detected",
        "All escalations resolved within SLA",
        "Strong documentation compliance",
      ],
      action: {
        id: "open-audit-log",
        label: "View audit log",
        href:
          "/demo/supervisor/audit-trail",
        intent: "view",
      },
    },
    teamNotifications: [
      {
        id: "policy-update",
        title: "Policy update",
        description:
          "Document verification guidance was updated.",
        timestampLabel: "Updated today",
        tone: "primary",
      },
      {
        id: "maintenance",
        title:
          "System maintenance window",
        description:
          "Planned for May 14, 10:00 PM.",
        timestampLabel: "Upcoming",
        tone: "purple",
      },
      {
        id: "training",
        title: "Training",
        description:
          "New records workflow session scheduled.",
        timestampLabel: "May 16, 2:00 PM",
        tone: "success",
      },
    ],
    reports: [
      report(
        "department-summary",
        "Department summary",
        "SLA, throughput, workload",
      ),
      report(
        "performance",
        "Performance report",
        "Service and officer metrics",
      ),
      report(
        "audit",
        "Audit summary",
        "Decisions, handoffs, events",
      ),
      report(
        "applicant-feedback",
        "Applicant feedback",
        "CSAT and feedback trends",
      ),
    ],
  };
}

function metric(
  id: string,
  label: string,
  value: number,
  tone:
    | "primary"
    | "success"
    | "warning"
    | "danger"
    | "purple",
): DashboardMetricData {
  return {
    id,
    label,
    value,
    tone,
  };
}

function attention(
  id: string,
  title: string,
  description: string,
  count: number,
  tone:
    | "primary"
    | "success"
    | "warning"
    | "danger"
    | "purple",
  href: string,
) {
  return {
    id,
    title,
    description,
    count,
    tone,
    action: {
      id: `open-${id}`,
      label: "View",
      href,
      intent: "review" as const,
    },
  };
}

function exception(
  id: string,
  title: string,
  description: string,
  count: number,
  tone:
    | "primary"
    | "success"
    | "warning"
    | "danger"
    | "purple",
  href: string,
): SupervisorExceptionItem {
  return {
    id,
    title,
    description,
    count,
    tone,
    action: {
      id: `resolve-${id}`,
      label: "Review",
      href,
      intent: "resolve",
    },
  };
}

function serviceQueue(
  snapshot:
    ReturnType<
      typeof createDashboardPackSnapshot
    >,
  requests:
    ReturnType<
      typeof createDashboardPackSnapshot
    >["requests"],
) {
  const services =
    snapshot.services.length > 0
      ? snapshot.services
      : [
          {
            id: "service",
            name: "Service Request",
            category: "General",
          },
        ];

  return stableSlice(
    services,
    6,
  ).map((service) => {
    const serviceRequests =
      requests.filter(
        (request) =>
          request.serviceId ===
          service.id,
      );

    return {
      id: service.id,
      serviceName: service.name,
      count:
        serviceRequests.length,
      dueToday:
        serviceRequests.filter(
          (request) =>
            dueState(
              request.dueAt,
              DEFAULT_DASHBOARD_REFERENCE_DATE,
            ).label === "Due today",
        ).length,
      overdue:
        serviceRequests.filter(
          (request) =>
            dueState(
              request.dueAt,
              DEFAULT_DASHBOARD_REFERENCE_DATE,
            ).tone === "danger",
        ).length,
    };
  });
}

function capacityToPerformance(
  capacity:
    SupervisorDashboardData["officerCapacity"],
): readonly SupervisorPerformanceRank[] {
  return capacity.map(
    (officer, index) => ({
      id: officer.id,
      label:
        officer.officerName,
      secondaryLabel:
        officer.roleLabel,
      score:
        Math.max(
          70,
          96 - index * 4,
        ),
      tone:
        index < 3
          ? "success"
          : "warning",
    }),
  );
}

function report(
  id: string,
  title: string,
  description: string,
) {
  return {
    id,
    title,
    description,
    runAction: {
      id: `run-${id}`,
      label: "Run report",
      href: "/demo/reports",
      intent: "export" as const,
    },
    scheduleAction: {
      id: `schedule-${id}`,
      label: "Schedule",
      href: "/demo/reports",
      intent: "export" as const,
    },
  };
}
