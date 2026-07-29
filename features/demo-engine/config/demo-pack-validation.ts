import { validateDemoVerificationConfig } from "./demo-verification-validation";
import type {
  DemoPack,
  DemoWorkflowConfig,
} from "./demo-pack.types";

export type DemoPackValidationLevel =
  | "error"
  | "warning";

export type DemoPackValidationIssue = {
  readonly level: DemoPackValidationLevel;
  readonly code: string;
  readonly path: string;
  readonly message: string;
};

export type DemoPackValidationOptions = {
  readonly assetExists?: (
    configuredPath: string,
  ) => boolean;
};

export type DemoPackValidationResult = {
  readonly valid: boolean;
  readonly errors: readonly DemoPackValidationIssue[];
  readonly warnings: readonly DemoPackValidationIssue[];
  readonly issues: readonly DemoPackValidationIssue[];
};

const supportedRoles = new Set([
  "applicant",
  "officer",
  "supervisor",
  "admin",
]);

function isNonEmptyString(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0
  );
}

function isSupportedColor(value: string): boolean {
  const color = value.trim();

  return (
    /^#(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i.test(
      color,
    ) ||
    /^(?:rgb|rgba|hsl|hsla|oklch|oklab|lab|lch)\(/i.test(
      color,
    ) ||
    /^var\(--[-\w]+\)$/.test(color)
  );
}

function duplicateIds(
  values: readonly { readonly id: string }[],
): readonly string[] {
  const counts = new Map<string, number>();

  for (const value of values) {
    counts.set(
      value.id,
      (counts.get(value.id) ?? 0) + 1,
    );
  }

  return [...counts.entries()]
    .filter(([, count]) => count > 1)
    .map(([id]) => id);
}

function reachableStepIds(
  workflow: DemoWorkflowConfig,
): ReadonlySet<string> {
  const stepsById = new Map(
    workflow.steps.map((step) => [step.id, step]),
  );
  const entry =
    workflow.steps.find(
      (step) => step.type === "start",
    ) ?? workflow.steps[0];

  if (!entry) {
    return new Set();
  }

  const visited = new Set<string>();
  const pending = [entry.id];

  while (pending.length > 0) {
    const currentId = pending.pop();

    if (!currentId || visited.has(currentId)) {
      continue;
    }

    visited.add(currentId);

    const current = stepsById.get(currentId);

    for (const nextId of current?.nextStepIds ?? []) {
      if (!visited.has(nextId)) {
        pending.push(nextId);
      }
    }
  }

  return visited;
}

export function validateDemoPack(
  pack: DemoPack,
  options: DemoPackValidationOptions = {},
): DemoPackValidationResult {
  const issues: DemoPackValidationIssue[] = [];

  const add = (
    level: DemoPackValidationLevel,
    code: string,
    path: string,
    message: string,
  ) => {
    issues.push({ level, code, path, message });
  };

  const requireText = (
    value: unknown,
    path: string,
    label: string,
  ) => {
    if (!isNonEmptyString(value)) {
      add(
        "error",
        "REQUIRED_TEXT",
        path,
        `${label} must be a non-empty string.`,
      );
    }
  };

  requireText(pack.id, "id", "Pack ID");
  requireText(pack.name, "name", "Pack name");
  requireText(pack.version, "version", "Pack version");
  requireText(
    pack.engineCompatibility,
    "engineCompatibility",
    "Engine compatibility",
  );
  requireText(
    pack.defaultRoute,
    "defaultRoute",
    "Default route",
  );

  if (!pack.defaultRoute.startsWith("/demo")) {
    add(
      "error",
      "INVALID_DEFAULT_ROUTE",
      "defaultRoute",
      "The default route must remain inside /demo.",
    );
  }

  if (!supportedRoles.has(pack.defaultRole)) {
    add(
      "error",
      "INVALID_DEFAULT_ROLE",
      "defaultRole",
      `Unsupported default role: ${pack.defaultRole}.`,
    );
  }

  requireText(
    pack.organization.id,
    "organization.id",
    "Organization ID",
  );
  requireText(
    pack.organization.name,
    "organization.name",
    "Organization name",
  );
  requireText(
    pack.organization.shortName,
    "organization.shortName",
    "Organization short name",
  );
  requireText(
    pack.organization.initials,
    "organization.initials",
    "Organization initials",
  );
  requireText(
    pack.organization.organizationType,
    "organization.organizationType",
    "Organization type",
  );

  requireText(
    pack.branding.logoPath,
    "branding.logoPath",
    "Logo path",
  );

  if (
    isNonEmptyString(pack.branding.logoPath) &&
    options.assetExists &&
    !options.assetExists(pack.branding.logoPath)
  ) {
    add(
      "error",
      "MISSING_ASSET",
      "branding.logoPath",
      `The configured logo does not exist: ` +
        `${pack.branding.logoPath}.`,
    );
  }

  for (const [key, color] of [
    ["primaryAccent", pack.branding.primaryAccent],
    [
      "secondaryAccent",
      pack.branding.secondaryAccent,
    ],
  ] as const) {
    if (!isSupportedColor(color)) {
      add(
        "error",
        "INVALID_COLOR",
        `branding.${key}`,
        `Unsupported CSS color value: ${color}.`,
      );
    }
  }

  requireText(
    pack.homepage.title,
    "homepage.title",
    "Homepage title",
  );
  requireText(
    pack.homepage.primaryActionLabel,
    "homepage.primaryActionLabel",
    "Homepage primary action label",
  );
  requireText(
    pack.homepage.secondaryActionLabel,
    "homepage.secondaryActionLabel",
    "Homepage secondary action label",
  );

  const collections = [
    ["departments", pack.departments],
    ["users", pack.users],
    ["services", pack.services],
    ["workflows", pack.workflows],
    ["requests", pack.requests],
    ["sla.serviceTargets", pack.sla.serviceTargets],
    [
      "sla.departmentTargets",
      pack.sla.departmentTargets,
    ],
    [
      "sla.seededPerformance",
      pack.sla.seededPerformance,
    ],
    ["reports.metrics", pack.reports.metrics],
    ["reports.charts", pack.reports.charts],
  ] as const;

  for (const [path, values] of collections) {
    for (const id of duplicateIds(values)) {
      add(
        "error",
        "DUPLICATE_ID",
        path,
        `Duplicate ID "${id}" was found.`,
      );
    }
  }

  if (pack.departments.length === 0) {
    add(
      "error",
      "NO_DEPARTMENTS",
      "departments",
      "At least one department is required.",
    );
  }

  if (pack.users.length === 0) {
    add(
      "error",
      "NO_USERS",
      "users",
      "At least one Demo user is required.",
    );
  }

  if (pack.services.length === 0) {
    add(
      "error",
      "NO_SERVICES",
      "services",
      "At least one service is required.",
    );
  }

  if (pack.workflows.length === 0) {
    add(
      "error",
      "NO_WORKFLOWS",
      "workflows",
      "At least one workflow is required.",
    );
  }

  const departmentsById = new Map(
    pack.departments.map(
      (department) => [department.id, department],
    ),
  );
  const usersById = new Map(
    pack.users.map((user) => [user.id, user]),
  );
  const servicesById = new Map(
    pack.services.map((service) => [
      service.id,
      service,
    ]),
  );
  const workflowsById = new Map(
    pack.workflows.map((workflow) => [
      workflow.id,
      workflow,
    ]),
  );
  const serviceSlaById = new Map(
    pack.sla.serviceTargets.map((target) => [
      target.id,
      target,
    ]),
  );

  for (const [index, user] of pack.users.entries()) {
    const path = `users[${index}]`;

    requireText(user.id, `${path}.id`, "User ID");
    requireText(user.name, `${path}.name`, "User name");

    if (!supportedRoles.has(user.role)) {
      add(
        "error",
        "INVALID_USER_ROLE",
        `${path}.role`,
        `Unsupported role: ${user.role}.`,
      );
    }

    if (
      user.departmentId &&
      !departmentsById.has(user.departmentId)
    ) {
      add(
        "error",
        "MISSING_DEPARTMENT_REFERENCE",
        `${path}.departmentId`,
        `Unknown department: ${user.departmentId}.`,
      );
    }
  }

  for (const [index, service] of pack.services.entries()) {
    const path = `services[${index}]`;

    requireText(
      service.id,
      `${path}.id`,
      "Service ID",
    );
    requireText(
      service.name,
      `${path}.name`,
      "Service name",
    );

    if (!workflowsById.has(service.workflowId)) {
      add(
        "error",
        "MISSING_WORKFLOW_REFERENCE",
        `${path}.workflowId`,
        `Unknown workflow: ${service.workflowId}.`,
      );
    }

    if (
      service.slaId &&
      !serviceSlaById.has(service.slaId)
    ) {
      add(
        "error",
        "MISSING_SLA_REFERENCE",
        `${path}.slaId`,
        `Unknown SLA target: ${service.slaId}.`,
      );
    }
  }

  for (
    const [workflowIndex, workflow]
    of pack.workflows.entries()
  ) {
    const path = `workflows[${workflowIndex}]`;

    requireText(
      workflow.id,
      `${path}.id`,
      "Workflow ID",
    );
    requireText(
      workflow.name,
      `${path}.name`,
      "Workflow name",
    );

    if (workflow.steps.length === 0) {
      add(
        "error",
        "NO_WORKFLOW_STEPS",
        `${path}.steps`,
        "A workflow must contain at least one step.",
      );
      continue;
    }

    for (const duplicateId of duplicateIds(
      workflow.steps,
    )) {
      add(
        "error",
        "DUPLICATE_WORKFLOW_STEP_ID",
        `${path}.steps`,
        `Duplicate step ID "${duplicateId}" was found.`,
      );
    }

    const stepsById = new Map(
      workflow.steps.map((step) => [
        step.id,
        step,
      ]),
    );

    const starts = workflow.steps.filter(
      (step) => step.type === "start",
    );
    const explicitEnds = workflow.steps.filter(
      (step) => step.type === "end",
    );
    const terminalSteps = workflow.steps.filter(
      (step) =>
        step.type === "end" ||
        step.type === "output" ||
        !step.nextStepIds ||
        step.nextStepIds.length === 0,
    );

    if (starts.length > 1) {
      add(
        "error",
        "MULTIPLE_START_STEPS",
        `${path}.steps`,
        "A workflow may contain at most one Start step.",
      );
    }

    if (starts.length === 0) {
      add(
        "warning",
        "SYNTHETIC_START",
        `${path}.steps`,
        "No explicit Start step exists; the universal model will create one.",
      );
    }

    if (explicitEnds.length === 0) {
      add(
        "warning",
        "SYNTHETIC_END",
        `${path}.steps`,
        "No explicit End step exists; the universal model will create one.",
      );
    }

    if (terminalSteps.length === 0) {
      add(
        "error",
        "NO_TERMINAL_STEP",
        `${path}.steps`,
        "The workflow has no terminal or output step.",
      );
    }

    for (
      const [stepIndex, step]
      of workflow.steps.entries()
    ) {
      const stepPath =
        `${path}.steps[${stepIndex}]`;

      requireText(
        step.id,
        `${stepPath}.id`,
        "Workflow step ID",
      );
      requireText(
        step.label,
        `${stepPath}.label`,
        "Workflow step label",
      );

      if (
        step.departmentId &&
        !departmentsById.has(step.departmentId)
      ) {
        add(
          "error",
          "MISSING_DEPARTMENT_REFERENCE",
          `${stepPath}.departmentId`,
          `Unknown department: ${step.departmentId}.`,
        );
      }

      if (
        step.role &&
        !supportedRoles.has(step.role)
      ) {
        add(
          "error",
          "INVALID_STEP_ROLE",
          `${stepPath}.role`,
          `Unsupported role: ${step.role}.`,
        );
      }

      if (
        step.slaId &&
        !serviceSlaById.has(step.slaId)
      ) {
        add(
          "error",
          "MISSING_SLA_REFERENCE",
          `${stepPath}.slaId`,
          `Unknown SLA target: ${step.slaId}.`,
        );
      }

      for (const nextId of step.nextStepIds ?? []) {
        if (!stepsById.has(nextId)) {
          add(
            "error",
            "MISSING_STEP_REFERENCE",
            `${stepPath}.nextStepIds`,
            `Unknown next step: ${nextId}.`,
          );
        }
      }
    }

    const reachable = reachableStepIds(workflow);

    for (const step of workflow.steps) {
      if (!reachable.has(step.id)) {
        add(
          "warning",
          "UNREACHABLE_STEP",
          `${path}.steps`,
          `Step "${step.id}" is not reachable from the workflow entry.`,
        );
      }
    }
  }

  for (
    const [requestIndex, request]
    of pack.requests.entries()
  ) {
    const path = `requests[${requestIndex}]`;
    const service = servicesById.get(
      request.serviceId,
    );

    if (!service) {
      add(
        "error",
        "MISSING_SERVICE_REFERENCE",
        `${path}.serviceId`,
        `Unknown service: ${request.serviceId}.`,
      );
    }

    if (!usersById.has(request.requesterId)) {
      add(
        "error",
        "MISSING_USER_REFERENCE",
        `${path}.requesterId`,
        `Unknown requester: ${request.requesterId}.`,
      );
    }

    if (
      request.assignedOfficerId &&
      !usersById.has(request.assignedOfficerId)
    ) {
      add(
        "error",
        "MISSING_USER_REFERENCE",
        `${path}.assignedOfficerId`,
        `Unknown assigned Officer: ${request.assignedOfficerId}.`,
      );
    }

    if (
      request.assignedDepartmentId &&
      !departmentsById.has(
        request.assignedDepartmentId,
      )
    ) {
      add(
        "error",
        "MISSING_DEPARTMENT_REFERENCE",
        `${path}.assignedDepartmentId`,
        `Unknown department: ${request.assignedDepartmentId}.`,
      );
    }

    const workflow = service
      ? workflowsById.get(service.workflowId)
      : undefined;

    if (
      request.currentStepId &&
      workflow &&
      !workflow.steps.some(
        (step) => step.id === request.currentStepId,
      )
    ) {
      add(
        "error",
        "MISSING_CURRENT_STEP",
        `${path}.currentStepId`,
        `Step "${request.currentStepId}" does not exist in workflow "${workflow.id}".`,
      );
    }

    const submittedAt = request.submittedAt
      ? Date.parse(request.submittedAt)
      : undefined;
    const dueAt = request.dueAt
      ? Date.parse(request.dueAt)
      : undefined;

    if (
      request.submittedAt &&
      Number.isNaN(submittedAt)
    ) {
      add(
        "error",
        "INVALID_DATE",
        `${path}.submittedAt`,
        `Invalid submitted date: ${request.submittedAt}.`,
      );
    }

    if (request.dueAt && Number.isNaN(dueAt)) {
      add(
        "error",
        "INVALID_DATE",
        `${path}.dueAt`,
        `Invalid due date: ${request.dueAt}.`,
      );
    }

    if (
      submittedAt !== undefined &&
      dueAt !== undefined &&
      !Number.isNaN(submittedAt) &&
      !Number.isNaN(dueAt) &&
      dueAt < submittedAt
    ) {
      add(
        "error",
        "DUE_BEFORE_SUBMISSION",
        path,
        "The due date cannot precede submission.",
      );
    }
  }

  if (
    pack.defaultRequestId &&
    !pack.requests.some(
      (request) =>
        request.id === pack.defaultRequestId,
    )
  ) {
    add(
      "error",
      "MISSING_DEFAULT_REQUEST",
      "defaultRequestId",
      `Unknown default request: ${pack.defaultRequestId}.`,
    );
  }

  if (
    !pack.users.some(
      (user) => user.role === pack.defaultRole,
    )
  ) {
    add(
      "warning",
      "NO_DEFAULT_ROLE_USER",
      "defaultRole",
      `No seeded user exists for role "${pack.defaultRole}".`,
    );
  }

  if (pack.reports.metrics.length === 0) {
    add(
      "error",
      "NO_REPORT_METRICS",
      "reports.metrics",
      "At least one report metric is required.",
    );
  }

  if (pack.reports.charts.length === 0) {
    add(
      "error",
      "NO_REPORT_CHARTS",
      "reports.charts",
      "At least one report chart is required.",
    );
  }

  for (
    const [chartIndex, chart]
    of pack.reports.charts.entries()
  ) {
    if (chart.dataset.length === 0) {
      add(
        "error",
        "EMPTY_REPORT_DATASET",
        `reports.charts[${chartIndex}].dataset`,
        `Chart "${chart.id}" has no data.`,
      );
    }
  }

  for (
    const [targetIndex, target]
    of pack.sla.serviceTargets.entries()
  ) {
    const path =
      `sla.serviceTargets[${targetIndex}]`;

    if (!servicesById.has(target.serviceId)) {
      add(
        "error",
        "MISSING_SERVICE_REFERENCE",
        `${path}.serviceId`,
        `Unknown service: ${target.serviceId}.`,
      );
    }

    if (target.targetHours <= 0) {
      add(
        "error",
        "INVALID_SLA_TARGET",
        `${path}.targetHours`,
        "SLA target hours must be greater than zero.",
      );
    }

    if (
      target.warningHours !== undefined &&
      (
        target.warningHours <= 0 ||
        target.warningHours > target.targetHours
      )
    ) {
      add(
        "error",
        "INVALID_SLA_WARNING",
        `${path}.warningHours`,
        "SLA warning hours must be positive and not exceed the target.",
      );
    }
  }

  for (
    const [targetIndex, target]
    of pack.sla.departmentTargets.entries()
  ) {
    const path =
      `sla.departmentTargets[${targetIndex}]`;

    if (!departmentsById.has(target.departmentId)) {
      add(
        "error",
        "MISSING_DEPARTMENT_REFERENCE",
        `${path}.departmentId`,
        `Unknown department: ${target.departmentId}.`,
      );
    }

    if (target.targetHours <= 0) {
      add(
        "error",
        "INVALID_SLA_TARGET",
        `${path}.targetHours`,
        "SLA target hours must be greater than zero.",
      );
    }
  }

  for (
    const [performanceIndex, performance]
    of pack.sla.seededPerformance.entries()
  ) {
    const path =
      `sla.seededPerformance[${performanceIndex}]`;

    const subjectExists =
      performance.subjectType === "service"
        ? servicesById.has(performance.subjectId)
        : performance.subjectType === "department"
          ? departmentsById.has(
              performance.subjectId,
            )
          : usersById.has(performance.subjectId);

    if (!subjectExists) {
      add(
        "error",
        "MISSING_SLA_SUBJECT",
        `${path}.subjectId`,
        `Unknown ${performance.subjectType} subject: ${performance.subjectId}.`,
      );
    }

    if (
      performance.complianceRate < 0 ||
      performance.complianceRate > 100
    ) {
      add(
        "error",
        "INVALID_COMPLIANCE_RATE",
        `${path}.complianceRate`,
        "Compliance rate must be between 0 and 100.",
      );
    }

    if (performance.averageResolutionHours < 0) {
      add(
        "error",
        "INVALID_RESOLUTION_TIME",
        `${path}.averageResolutionHours`,
        "Average resolution time cannot be negative.",
      );
    }
  }

  for (const issue of validateDemoVerificationConfig(pack.verification)) {
    add(issue.level, issue.code, issue.path, issue.message);
  }

  const errors = issues.filter(
    (issue) => issue.level === "error",
  );
  const warnings = issues.filter(
    (issue) => issue.level === "warning",
  );

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    issues,
  };
}
