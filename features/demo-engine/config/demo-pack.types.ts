/**
 * Stable configuration contract between the reusable Demo Engine and an
 * organization-specific Demo Pack.
 *
 * This file must remain vertical-neutral. It must not import from a named
 * pack such as tvet, supermarket, hospital or county.
 */

export type DemoPackStatus = "draft" | "frozen" | "deprecated";

export type DemoRole =
  | "applicant"
  | "officer"
  | "supervisor"
  | "admin";

export type DemoWorkflowStatus =
  | "draft"
  | "published"
  | "archived";

export type DemoWorkflowPresentationTone =
  | "blue"
  | "green"
  | "purple"
  | "orange";

export type DemoWorkflowStepType =
  | "start"
  | "submission"
  | "review"
  | "verification"
  | "task"
  | "handoff"
  | "approval"
  | "decision"
  | "automation"
  | "notification"
  | "output"
  | "end";

export type DemoRequestStatus =
  | "draft"
  | "submitted"
  | "in-review"
  | "awaiting-information"
  | "pending-approval"
  | "approved"
  | "completed"
  | "rejected"
  | "overdue";

export type DemoSlaState =
  | "on-track"
  | "at-risk"
  | "overdue"
  | "completed";

export type DemoChartType =
  | "line"
  | "area"
  | "bar"
  | "stacked-bar"
  | "pie"
  | "donut"
  | "composed"
  | "funnel";

export type DemoTrendDirection =
  | "up"
  | "down"
  | "flat";

export type DemoPrimitive = string | number | boolean | null;

export type DemoRecord = Readonly<
  Record<
    string,
    DemoPrimitive | readonly DemoPrimitive[] | undefined
  >
>;

export interface DemoOrganizationConfig {
  readonly id: string;
  readonly name: string;
  readonly shortName: string;
  readonly initials: string;
  readonly organizationType: string;
  readonly address?: string;
  readonly email?: string;
  readonly telephone?: string;
  readonly website?: string;
}

export interface DemoBrandingConfig {
  readonly logoPath: string;
  readonly primaryAccent: string;
  readonly secondaryAccent: string;
  readonly homepageFont?: string;
  readonly homepageHeadingLetterSpacing?: string;
}

export interface DemoHomepageConfig {
  readonly eyebrow?: string;
  readonly title: string;
  readonly description?: string;
  readonly primaryActionLabel: string;
  readonly secondaryActionLabel: string;
}

export interface DemoDepartmentConfig {
  readonly id: string;
  readonly name: string;
  readonly shortName?: string;
  readonly description?: string;
  readonly active?: boolean;
}

export interface DemoUserConfig {
  readonly id: string;
  readonly name: string;
  readonly role: DemoRole;
  readonly departmentId: string | null;
  readonly title?: string;
  readonly email?: string;
  readonly telephone?: string;
  readonly avatarPath?: string;
  readonly active?: boolean;
}

export interface DemoServiceConfig {
  readonly id: string;
  readonly name: string;
  readonly summary?: string;
  readonly description?: string;
  readonly audienceLabel?: string;
  readonly workflowId: string;
  readonly slaId?: string;
  readonly active?: boolean;
}

export interface DemoWorkflowStepConfig {
  readonly id: string;
  readonly type: DemoWorkflowStepType;
  readonly label: string;
  readonly description?: string;
  readonly departmentId?: string;
  readonly role?: DemoRole;
  readonly slaId?: string;
  readonly nextStepIds?: readonly string[];
  readonly conditionLabel?: string;
  readonly outputLabel?: string;
}

export interface DemoWorkflowConfig {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly category?: string;
  readonly status: DemoWorkflowStatus;
  readonly usageCount?: number;
  readonly presentationTone?: DemoWorkflowPresentationTone;
  readonly steps: readonly DemoWorkflowStepConfig[];
}

export interface DemoRequestConfig {
  readonly id: string;
  readonly serviceId: string;
  readonly requesterId: string;
  readonly assignedOfficerId?: string;
  readonly assignedDepartmentId?: string;
  readonly status: DemoRequestStatus;
  readonly currentStepId?: string;
  readonly submittedAt?: string;
  readonly dueAt?: string;
  readonly data?: DemoRecord;
}

export interface DemoReportMetricConfig {
  readonly id: string;
  readonly label: string;
  readonly value: string | number;
  readonly change?: string | number;
  readonly trend?: DemoTrendDirection;
}

export interface DemoReportChartConfig {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly type: DemoChartType;
  readonly dataset: readonly Readonly<
    Record<string, string | number>
  >[];
  readonly takeaways?: readonly string[];
}

export interface DemoReportConfig {
  readonly metrics: readonly DemoReportMetricConfig[];
  readonly charts: readonly DemoReportChartConfig[];
  readonly insights: readonly string[];
}

export interface DemoServiceSlaTargetConfig {
  readonly id: string;
  readonly serviceId: string;
  readonly targetHours: number;
  readonly warningHours?: number;
}

export interface DemoDepartmentSlaTargetConfig {
  readonly id: string;
  readonly departmentId: string;
  readonly targetHours: number;
  readonly warningHours?: number;
}

export interface DemoSeededSlaPerformanceConfig {
  readonly id: string;
  readonly subjectId: string;
  readonly subjectType: "service" | "department" | "officer";
  readonly complianceRate: number;
  readonly averageResolutionHours: number;
  readonly state: DemoSlaState;
}

export interface DemoSlaConfig {
  readonly serviceTargets: readonly DemoServiceSlaTargetConfig[];
  readonly departmentTargets: readonly DemoDepartmentSlaTargetConfig[];
  readonly seededPerformance:
    readonly DemoSeededSlaPerformanceConfig[];
}

export interface DemoPack {
  readonly id: string;
  readonly name: string;
  readonly version: string;
  readonly status: DemoPackStatus;
  readonly engineCompatibility: string;
  readonly defaultRoute: string;
  readonly defaultRole: DemoRole;
  readonly defaultRequestId?: string;
  readonly organization: DemoOrganizationConfig;
  readonly branding: DemoBrandingConfig;
  readonly homepage: DemoHomepageConfig;
  readonly departments: readonly DemoDepartmentConfig[];
  readonly users: readonly DemoUserConfig[];
  readonly services: readonly DemoServiceConfig[];
  readonly workflows: readonly DemoWorkflowConfig[];
  readonly requests: readonly DemoRequestConfig[];
  readonly reports: DemoReportConfig;
  readonly sla: DemoSlaConfig;
}
