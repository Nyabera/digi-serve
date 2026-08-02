import type {
  AdminDashboardData,
} from "./admin-dashboard.types";
import type {
  OfficerDashboardData,
} from "./officer-dashboard.types";
import type {
  SupervisorDashboardData,
} from "./supervisor-dashboard.types";

export type DashboardValidationIssue = {
  readonly path: string;
  readonly message: string;
};

function requireText(
  value: string,
  path: string,
  issues: DashboardValidationIssue[],
): void {
  if (!value.trim()) {
    issues.push({
      path,
      message:
        "Expected non-empty text.",
    });
  }
}

function requireUniqueIds(
  values:
    readonly {
      readonly id: string;
    }[],
  path: string,
  issues: DashboardValidationIssue[],
): void {
  const ids = new Set<string>();

  for (const value of values) {
    if (!value.id.trim()) {
      issues.push({
        path,
        message:
          "Every item requires an ID.",
      });
      continue;
    }

    if (ids.has(value.id)) {
      issues.push({
        path,
        message:
          `Duplicate ID: ${value.id}`,
      });
    }

    ids.add(value.id);
  }
}

export function validateOfficerDashboardData(
  data: OfficerDashboardData,
): readonly DashboardValidationIssue[] {
  const issues:
    DashboardValidationIssue[] = [];

  requireText(
    data.identity.displayName,
    "identity.displayName",
    issues,
  );
  requireText(
    data.identity.institutionName,
    "identity.institutionName",
    issues,
  );
  requireUniqueIds(
    data.workloadPulse,
    "workloadPulse",
    issues,
  );
  requireUniqueIds(
    data.workPlan["needs-action"],
    "workPlan.needs-action",
    issues,
  );
  requireUniqueIds(
    data.recentHandoffs,
    "recentHandoffs",
    issues,
  );
  requireUniqueIds(
    data.actionRequired,
    "actionRequired",
    issues,
  );

  return issues;
}

export function validateSupervisorDashboardData(
  data: SupervisorDashboardData,
): readonly DashboardValidationIssue[] {
  const issues:
    DashboardValidationIssue[] = [];

  requireText(
    data.identity.displayName,
    "identity.displayName",
    issues,
  );
  requireUniqueIds(
    data.departmentHealth,
    "departmentHealth",
    issues,
  );
  requireUniqueIds(
    data.approvalLane,
    "approvalLane",
    issues,
  );
  requireUniqueIds(
    data.officerCapacity,
    "officerCapacity",
    issues,
  );
  requireUniqueIds(
    data.reports,
    "reports",
    issues,
  );

  return issues;
}

export function validateAdminDashboardData(
  data: AdminDashboardData,
): readonly DashboardValidationIssue[] {
  const issues:
    DashboardValidationIssue[] = [];

  requireText(
    data.identity.institutionName,
    "identity.institutionName",
    issues,
  );
  requireUniqueIds(
    data.institutionHealth,
    "institutionHealth",
    issues,
  );
  requireUniqueIds(
    data.departmentPerformance,
    "departmentPerformance",
    issues,
  );
  requireUniqueIds(
    data.workflowBottlenecks,
    "workflowBottlenecks",
    issues,
  );
  requireUniqueIds(
    data.systemHealth,
    "systemHealth",
    issues,
  );
  requireUniqueIds(
    data.scheduledReports,
    "scheduledReports",
    issues,
  );

  return issues;
}

export function assertDashboardDataValid(
  role:
    | "officer"
    | "supervisor"
    | "admin",
  issues:
    readonly DashboardValidationIssue[],
): void {
  if (issues.length === 0) {
    return;
  }

  throw new Error(
    [
      `${role} dashboard adapter produced invalid data:`,
      ...issues.map(
        (issue) =>
          `- ${issue.path}: ${issue.message}`,
      ),
    ].join("\n"),
  );
}
