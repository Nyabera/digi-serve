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
  formatCompactNumber,
  percentage,
  selectUser,
  serviceNameForRequest,
  stableSlice,
  stageLabel,
  statusTone,
} from "./dashboard-adapter.utilities";
import type {
  DashboardAdapterContext,
  DashboardDistributionItem,
  DashboardMetricData,
} from "./dashboard-data.shared";
import type {
  AdminDashboardData,
  AdminDepartmentPerformance,
} from "./admin-dashboard.types";

export function adaptAdminDashboard(
  pack: DemoPack,
  context: DashboardAdapterContext = {},
): AdminDashboardData {
  const snapshot =
    createDashboardPackSnapshot(pack);
  const admin = selectUser(
    snapshot,
    "admin",
    context.adminId,
  );
  const requests =
    snapshot.requests;
  const completed =
    requests.filter(
      (request) =>
        statusTone(
          request.status,
        ) === "success",
    );
  const overdue =
    requests.filter(
      (request) =>
        statusTone(
          request.status,
        ) === "danger",
    );
  const open = Math.max(
    0,
    requests.length -
      completed.length,
  );
  const completionRate =
    percentage(
      completed.length,
      Math.max(
        1,
        requests.length,
      ),
    ) || 87;
  const slaCompliance =
    Math.max(
      68,
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
      ) || 91,
    );

  const institutionHealth:
    readonly DashboardMetricData[] = [
      healthMetric(
        "submitted",
        "Submitted",
        formatCompactNumber(
          Math.max(
            requests.length,
            1248,
          ),
        ),
        "primary",
        "▲ 12% vs Apr",
      ),
      healthMetric(
        "completed",
        "Completed",
        formatCompactNumber(
          Math.max(
            completed.length,
            1086,
          ),
        ),
        "success",
        "▲ 15% vs Apr",
      ),
      healthMetric(
        "open",
        "Open",
        Math.max(
          open,
          162,
        ),
        "warning",
        "▼ 5% vs Apr",
      ),
      healthMetric(
        "completion-rate",
        "Completion rate",
        `${completionRate}%`,
        "teal",
        "▲ 6pp vs Apr",
      ),
      healthMetric(
        "turnaround",
        "Avg turnaround",
        "2.8 days",
        "primary",
        "▼ 0.4 vs Apr",
      ),
      healthMetric(
        "overdue",
        "Overdue",
        Math.max(
          overdue.length,
          14,
        ),
        "danger",
        "▼ 4 vs Apr",
      ),
    ];

  const departmentPerformance =
    buildDepartmentPerformance(
      snapshot,
    );

  const requestsByStatus =
    buildStatusDistribution(
      requests,
    );
  const requestsByService =
    buildServiceDistribution(
      snapshot,
    );
  const documentGroups =
    groupDocuments(snapshot);

  return {
    identity: {
      id:
        admin?.id ??
        "demo-admin",
      displayName:
        admin?.name ??
        "Demo Admin",
      role: "admin",
      roleLabel:
        "Institution Admin",
      institutionName:
        snapshot.institutionName,
    },
    dateRange: {
      label: "May 1 – May 31, 2026",
      start:
        "2026-05-01T00:00:00.000Z",
      end:
        "2026-05-31T23:59:59.999Z",
    },
    executiveBrief: {
      title: "Executive brief",
      summary:
        `Overall service performance is strong. Completion is ${completionRate}% with average turnaround below three days. Monitor overdue requests and document exceptions.`,
    },
    institutionHealth,
    serviceDeliveryTrend:
      buildServiceTrend(),
    alerts: [
      {
        id: "sla-breach",
        title:
          "SLA breach: service request",
        description:
          "Student Affairs • 2 hours ago",
        priority: "high",
        tone: "danger",
        action: action(
          "open-sla-breach",
          "Review",
          "/demo/admin",
        ),
      },
      {
        id: "high-overdue",
        title:
          `High overdue: ${Math.max(
            overdue.length,
            9,
          )} requests`,
        description:
          "Finance • 4 hours ago",
        priority: "high",
        tone: "warning",
        action: action(
          "open-overdue",
          "Review",
          "/demo/admin",
        ),
      },
      {
        id: "payment-exception",
        title:
          "Payment exception detected",
        description:
          "Bursary • 6 hours ago",
        priority: "medium",
        tone: "warning",
        action: action(
          "open-payment",
          "Resolve",
          "/demo/admin",
        ),
      },
      {
        id: "maintenance",
        title:
          "System maintenance scheduled",
        description:
          "ICT Services • May 10, 2026",
        priority: "low",
        tone: "primary",
        action: action(
          "open-maintenance",
          "View",
          "/demo/admin",
        ),
      },
    ],
    departmentPerformance,
    slaCompliance,
    requestsByStatus,
    requestsByService,
    capacityHeatmap:
      departmentPerformance.map(
        (department, index) => ({
          departmentId:
            department.id,
          departmentName:
            department.departmentName,
          low:
            8 + index * 2,
          moderate:
            32 +
            (index % 3) * 6,
          high:
            38 -
            (index % 2) * 8,
          veryHigh:
            22 -
            index,
        }),
      ),
    workflowBottlenecks:
      stableSlice(
        snapshot.workflows.flatMap(
          (workflow) =>
            workflow.steps.map(
              (
                step,
                stepIndex,
              ) => ({
                id:
                  `${workflow.id}-step-${stepIndex + 1}`,
                stageLabel:
                  readStepLabel(
                    step,
                    `Workflow stage ${
                      stepIndex + 1
                    }`,
                  ),
                averageDurationDays:
                  Number(
                    (
                      2.1 -
                      Math.min(
                        1.7,
                        stepIndex * 0.35,
                      )
                    ).toFixed(1),
                  ),
                requestCount:
                  Math.max(
                    2,
                    Math.round(
                      requests.length /
                        (stepIndex + 2),
                    ),
                  ),
                tone:
                  stepIndex < 2
                    ? "warning"
                    : "success",
                action: action(
                  `open-bottleneck-${workflow.id}-${stepIndex}`,
                  "View",
                  "/demo/admin/workflows",
                ),
              }),
            ),
        ),
        5,
      ),
    handoffNodes:
      buildHandoffNodes(
        snapshot,
      ),
    handoffEdges:
      buildHandoffEdges(
        snapshot,
      ),
    approvalsEscalations:
      stableSlice(
        requests,
        5,
      ).map((request, index) => ({
        id:
          `approval-${request.id}`,
        typeLabel:
          index % 2 === 0
            ? "Approval"
            : "Escalation",
        itemLabel:
          serviceNameForRequest(
            snapshot,
            request,
          ),
        sourceLabel:
          snapshot.departments[
            index %
              Math.max(
                1,
                snapshot.departments.length,
              )
          ]?.name ??
          "Department",
        raisedLabel:
          index === 0
            ? "1 hour ago"
            : `${index * 4} hours ago`,
        priority:
          index < 2
            ? "high"
            : index < 4
              ? "medium"
              : "low",
        action: action(
          `review-${request.id}`,
          index % 2 === 0
            ? "Review"
            : "Resolve",
          "/demo/admin",
        ),
      })),
    payments: {
      expected: 4_800_000,
      confirmed: 4_300_000,
      exceptions: 300_000,
      currency: "KES",
      revenueByService:
        buildRevenueByService(
          requestsByService,
        ),
    },
    documents: {
      uploaded:
        Math.max(
          snapshot.documents.length,
          1642,
        ),
      inReview:
        Math.max(
          documentGroups.inReview,
          312,
        ),
      rejected:
        Math.max(
          documentGroups.rejected,
          146,
        ),
      issued:
        Math.max(
          documentGroups.issued,
          1284,
        ),
      topDocumentTypes:
        documentGroups.types,
    },
    verification: {
      total:
        Math.max(
          snapshot.documents.filter(
            (document) =>
              document.status.includes(
                "verif",
              ),
          ).length,
          845,
        ),
      successRate: 98,
      trend:
        buildVerificationTrend(),
      action: action(
        "open-verifications",
        "View all",
        "/demo/verify-certificate",
      ),
    },
    renewals: [
      renewal(
        "lab-equipment",
        "Lab Equipment Calibration",
        "Jun 10, 2026",
        10,
        "warning",
      ),
      renewal(
        "maintenance-contract",
        "System Maintenance Contract",
        "Jun 28, 2026",
        36,
        "warning",
      ),
      renewal(
        "iso",
        "ISO Certification Renewal",
        "Jul 15, 2026",
        53,
        "warning",
      ),
      renewal(
        "insurance",
        "Insurance Policy Expiry",
        "Aug 2, 2026",
        71,
        "success",
      ),
      renewal(
        "ssl",
        "Domain & SSL Renewal",
        "Aug 20, 2026",
        89,
        "success",
      ),
    ],
    complianceRisks: [
      risk(
        "retention",
        "Data retention policy review due",
        "high",
        "May 30",
      ),
      risk(
        "audit-trail",
        "Incomplete audit trail: Finance",
        "medium",
        "May 31",
      ),
      risk(
        "missing-approvals",
        "Missing approvals: 5 requests",
        "medium",
        "May 31",
      ),
      risk(
        "acknowledgement",
        "Policy acknowledgement overdue",
        "low",
        "Jun 2",
      ),
    ],
    applicantFunnel: {
      stages: [
        distribution(
          "applications",
          "Applications",
          3265,
          100,
          "primary",
        ),
        distribution(
          "in-review",
          "In review",
          1676,
          51,
          "primary",
        ),
        distribution(
          "approved",
          "Approved",
          1256,
          38,
          "teal",
        ),
        distribution(
          "completed",
          "Completed",
          1126,
          35,
          "success",
        ),
      ],
      completionRate: 35,
    },
    platformAdoption: {
      activeUsers:
        Math.max(
          snapshot.users.length,
          612,
        ),
      sessions: 2845,
      featureUsage: 78,
      trend:
        Array.from(
          { length: 12 },
          (_, index) => ({
            label:
              `May ${1 + index * 2}`,
            primary:
              420 +
              [
                40,
                -20,
                15,
                -10,
                30,
                25,
                -5,
                40,
                20,
                55,
                18,
                62,
              ][index],
          }),
        ),
    },
    externalCoordination: [
      distribution(
        "email",
        "Email",
        32,
        32,
        "danger",
      ),
      distribution(
        "walk-in",
        "Walk-in",
        28,
        28,
        "warning",
      ),
      distribution(
        "phone",
        "Phone",
        20,
        20,
        "warning",
      ),
      distribution(
        "whatsapp",
        "WhatsApp",
        12,
        12,
        "teal",
      ),
      distribution(
        "other",
        "Other",
        8,
        8,
        "neutral",
      ),
    ],
    institutionalOutcomes: [
      outcome(
        "turnaround",
        "Avg turnaround time",
        3.6,
        2.8,
        "days",
        "success",
      ),
      outcome(
        "sla",
        "SLA compliance",
        81,
        91,
        "%",
        "success",
      ),
      outcome(
        "backlog",
        "Request backlog",
        214,
        162,
        "requests",
        "success",
      ),
      outcome(
        "overdue",
        "Overdue requests",
        28,
        14,
        "requests",
        "success",
      ),
    ],
    systemHealth: [
      systemHealth(
        "application",
        "Application",
      ),
      systemHealth(
        "database",
        "Database",
      ),
      systemHealth(
        "integrations",
        "Integrations",
      ),
      systemHealth(
        "storage",
        "File Storage",
      ),
      systemHealth(
        "security",
        "Security",
      ),
    ],
    recentAdministrativeActivity:
      stableSlice(
        requests,
        4,
      ).map((request, index) => ({
        id: `admin-activity-${request.id}`,
        title:
          adminActivityTitle(index),
        description:
          `${serviceNameForRequest(
            snapshot,
            request,
          )} • ${stageLabel(request)}`,
        timestampLabel:
          index === 0
            ? "25 min ago"
            : `${index} hours ago`,
        tone:
          statusTone(
            request.status,
          ),
        action: action(
          `open-admin-activity-${request.id}`,
          "View",
          "/demo/admin",
        ),
      })),
    scheduledReports: [
      scheduledReport(
        "weekly-performance",
        "Weekly Performance Report",
        "Every Monday • 8:00 AM",
      ),
      scheduledReport(
        "sla-compliance",
        "SLA Compliance Report",
        "Every Monday • 9:00 AM",
      ),
      scheduledReport(
        "financial",
        "Financial Summary Report",
        "Every Friday • 5:00 PM",
      ),
      scheduledReport(
        "audit",
        "Audit Trail Report",
        "1st of Month • 7:00 AM",
      ),
      scheduledReport(
        "executive",
        "Executive Brief",
        "Daily • 7:30 AM",
      ),
    ],
  };
}

function healthMetric(
  id: string,
  label: string,
  value: string | number,
  tone:
    | "primary"
    | "success"
    | "warning"
    | "danger"
    | "teal",
  deltaLabel: string,
): DashboardMetricData {
  return {
    id,
    label,
    value,
    tone,
    deltaLabel,
  };
}

function action(
  id: string,
  label: string,
  href: string,
) {
  return {
    id,
    label,
    href,
    intent: "view" as const,
  };
}

function buildDepartmentPerformance(
  snapshot:
    ReturnType<
      typeof createDashboardPackSnapshot
    >,
): readonly AdminDepartmentPerformance[] {
  const departments =
    snapshot.departments.length > 0
      ? snapshot.departments
      : [
          {
            id: "student-affairs",
            name: "Student Affairs",
          },
          {
            id: "finance",
            name: "Finance",
          },
          {
            id: "academic-affairs",
            name: "Academic Affairs",
          },
          {
            id: "registry",
            name: "Registry",
          },
          {
            id: "ict",
            name: "ICT Services",
          },
          {
            id: "transport",
            name: "Transport",
          },
        ];

  return stableSlice(
    departments,
    6,
  ).map((department, index) => {
    const submitted =
      Math.max(
        110,
        312 - index * 28,
      );
    const completionRate =
      [88, 83, 87, 88, 90, 85][
        index
      ] ?? 85;
    const completed =
      Math.round(
        submitted *
          (completionRate / 100),
      );

    return {
      id: department.id,
      departmentName:
        department.name,
      submitted,
      completed,
      completionRate,
      averageTurnaroundDays:
        [2.5, 3.6, 2.7, 2.3, 2.1, 3.1][
          index
        ] ?? 2.8,
      slaCompliance:
        [92, 81, 90, 94, 95, 83][
          index
        ] ?? 88,
    };
  });
}

function buildStatusDistribution(
  requests:
    ReturnType<
      typeof createDashboardPackSnapshot
    >["requests"],
): readonly DashboardDistributionItem[] {
  const groups = new Map<
    string,
    number
  >();

  for (const request of requests) {
    const tone =
      statusTone(
        request.status,
      );
    const label =
      tone === "success"
        ? "Completed"
        : tone === "danger"
          ? "Overdue"
          : tone === "purple"
            ? "On hold"
            : "Open";

    groups.set(
      label,
      (groups.get(label) ?? 0) + 1,
    );
  }

  const total = Math.max(
    1,
    requests.length,
  );
  const ordered = [
    "Completed",
    "Open",
    "Overdue",
    "On hold",
  ];

  return ordered.map(
    (label) => {
      const value =
        groups.get(label) ?? 0;

      return {
        id:
          label
            .toLowerCase()
            .replace(/\s+/g, "-"),
        label,
        value:
          value ||
          {
            Completed: 1086,
            Open: 162,
            Overdue: 14,
            "On hold": 4,
          }[label] ||
          0,
        percentage:
          value
            ? percentage(
                value,
                total,
              )
            : {
                Completed: 87,
                Open: 13,
                Overdue: 1,
                "On hold": 0,
              }[label],
        tone:
          label === "Completed"
            ? "success"
            : label === "Overdue"
              ? "danger"
              : label === "On hold"
                ? "purple"
                : "primary",
      };
    },
  );
}

function buildServiceDistribution(
  snapshot:
    ReturnType<
      typeof createDashboardPackSnapshot
    >,
): readonly DashboardDistributionItem[] {
  const services =
    snapshot.services.length > 0
      ? snapshot.services
      : [
          {
            id: "transcript",
            name: "Transcript Request",
            category: "Records",
          },
          {
            id: "certificate",
            name: "Certificate Request",
            category: "Records",
          },
          {
            id: "payment",
            name: "Payment Plan",
            category: "Finance",
          },
          {
            id: "id",
            name: "ID Replacement",
            category: "Student Affairs",
          },
          {
            id: "hostel",
            name: "Hostel Allocation",
            category: "Student Affairs",
          },
        ];

  return stableSlice(
    services,
    5,
  ).map((service, index) => {
    const actual =
      snapshot.requests.filter(
        (request) =>
          request.serviceId ===
          service.id,
      ).length;
    const fallback =
      [312, 248, 198, 156, 110][
        index
      ] ?? 90;
    const value =
      actual || fallback;

    return distribution(
      service.id,
      service.name,
      value,
      undefined,
      index < 2
        ? "primary"
        : "teal",
    );
  });
}

function buildServiceTrend() {
  return [
    "May 1",
    "May 8",
    "May 15",
    "May 22",
    "May 29",
  ].map((label, index) => ({
    label,
    primary:
      [640, 612, 598, 605, 610][
        index
      ],
    secondary:
      [535, 552, 510, 548, 690][
        index
      ],
  }));
}

function groupDocuments(
  snapshot:
    ReturnType<
      typeof createDashboardPackSnapshot
    >,
) {
  const inReview =
    snapshot.documents.filter(
      (document) =>
        document.status.includes(
          "review",
        ),
    ).length;
  const rejected =
    snapshot.documents.filter(
      (document) =>
        document.status.includes(
          "reject",
        ),
    ).length;
  const issued =
    snapshot.documents.filter(
      (document) =>
        document.status.includes(
          "issued",
        ) ||
        document.status.includes(
          "verified",
        ),
    ).length;

  const groups = new Map<
    string,
    number
  >();

  for (const document of snapshot.documents) {
    groups.set(
      document.type,
      (groups.get(document.type) ?? 0) + 1,
    );
  }

  const fallback = [
    ["Transcripts", 521],
    ["Certificates", 309],
    ["ID Cards", 214],
    ["Clearance Letters", 102],
    ["Others", 58],
  ] as const;

  const types =
    groups.size > 0
      ? Array.from(
          groups.entries(),
        ).map(
          ([label, value]) =>
            distribution(
              label
                .toLowerCase()
                .replace(/\s+/g, "-"),
              label,
              value,
              undefined,
              "primary",
            ),
        )
      : fallback.map(
          ([label, value]) =>
            distribution(
              label
                .toLowerCase()
                .replace(/\s+/g, "-"),
              label,
              value,
              undefined,
              "primary",
            ),
        );

  return {
    inReview,
    rejected,
    issued,
    types: stableSlice(
      types,
      5,
    ),
  };
}

function buildRevenueByService(
  services:
    readonly DashboardDistributionItem[],
) {
  const amounts = [
    2_400_000,
    1_100_000,
    500_000,
    300_000,
    100_000,
  ];

  return services.map(
    (service, index) => ({
      ...service,
      value:
        amounts[index] ??
        80_000,
    }),
  );
}

function buildVerificationTrend() {
  return Array.from(
    { length: 15 },
    (_, index) => ({
      label:
        index === 0
          ? "May 1"
          : index === 4
            ? "May 8"
            : index === 8
              ? "May 15"
              : index === 12
                ? "May 22"
                : index === 14
                  ? "May 29"
                  : `Day ${index + 1}`,
      primary:
        [
          170,
          250,
          140,
          190,
          280,
          170,
          210,
          160,
          120,
          190,
          230,
          150,
          180,
          220,
          130,
        ][index],
    }),
  );
}

function buildHandoffNodes(
  snapshot:
    ReturnType<
      typeof createDashboardPackSnapshot
    >,
) {
  const departments =
    stableSlice(
      snapshot.departments,
      4,
    );

  return [
    {
      id: "student-affairs",
      label: "Student Affairs",
      category: "core" as const,
    },
    ...departments.map(
      (department) => ({
        id: department.id,
        label: department.name,
        category:
          "department" as const,
      }),
    ),
    {
      id: "external-agencies",
      label: "External Agencies",
      category: "external" as const,
    },
  ];
}

function buildHandoffEdges(
  snapshot:
    ReturnType<
      typeof createDashboardPackSnapshot
    >,
) {
  const departmentIds =
    stableSlice(
      snapshot.departments,
      4,
    ).map(
      (department) =>
        department.id,
    );

  return departmentIds.map(
    (departmentId, index) => ({
      id:
        `handoff-edge-${index + 1}`,
      sourceId:
        index === 0
          ? "student-affairs"
          : departmentIds[
              index - 1
            ] ??
            "student-affairs",
      targetId:
        departmentId,
      frequency:
        index < 2
          ? "frequent"
          : "occasional",
      count:
        Math.max(
          4,
          18 - index * 3,
        ),
    } as const),
  );
}

function readStepLabel(
  step: Readonly<
    Record<string, unknown>
  >,
  fallback: string,
): string {
  for (const key of [
    "name",
    "title",
    "label",
    "type",
  ]) {
    const value = step[key];

    if (
      typeof value === "string" &&
      value.trim()
    ) {
      return value.trim();
    }
  }

  return fallback;
}

function distribution(
  id: string,
  label: string,
  value: number,
  itemPercentage:
    | number
    | undefined,
  tone:
    | "neutral"
    | "primary"
    | "success"
    | "warning"
    | "danger"
    | "purple"
    | "teal",
): DashboardDistributionItem {
  return {
    id,
    label,
    value,
    percentage:
      itemPercentage,
    tone,
  };
}

function renewal(
  id: string,
  label: string,
  dateLabel: string,
  daysRemaining: number,
  tone:
    | "success"
    | "warning",
) {
  return {
    id,
    label,
    dateLabel,
    daysRemaining,
    tone,
  };
}

function risk(
  id: string,
  title: string,
  priority:
    | "low"
    | "medium"
    | "high",
  dueLabel: string,
) {
  return {
    id,
    title,
    priority,
    dueLabel,
    action: action(
      `open-${id}`,
      "View",
      "/demo/admin",
    ),
  };
}

function outcome(
  id: string,
  label: string,
  before: number,
  after: number,
  unit: string,
  tone:
    | "success"
    | "warning"
    | "danger",
) {
  return {
    id,
    label,
    before,
    after,
    unit,
    tone,
  };
}

function systemHealth(
  id: string,
  label: string,
) {
  return {
    id,
    label,
    status:
      "operational" as const,
    tone:
      "success" as const,
  };
}

function adminActivityTitle(
  index: number,
): string {
  return [
    "Bulk document upload completed",
    "Payment batch posted",
    "SLA breach resolved",
    "Workflow updated",
  ][index] ?? "Administrative update";
}

function scheduledReport(
  id: string,
  title: string,
  scheduleLabel: string,
) {
  return {
    id,
    title,
    scheduleLabel,
    enabled: true,
    action: action(
      `configure-${id}`,
      "Configure",
      "/demo/reports",
    ),
  };
}
