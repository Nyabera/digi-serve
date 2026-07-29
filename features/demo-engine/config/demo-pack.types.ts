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


export type DemoIssuedDocumentStatus =
  | "valid"
  | "revoked"
  | "expired"
  | "replaced";

export type DemoDocumentReviewStatus =
  | "pending"
  | "in-review"
  | "approved"
  | "rejected";

export type DemoVerificationLogResult =
  | "successful"
  | "failed"
  | "pending";

export type DemoPublicVerificationStatus =
  | "valid"
  | "revoked"
  | "expired"
  | "replaced";

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


export interface DemoApplicantVerificationConfig {
  readonly emailVerifiedAt: string;
  readonly phoneVerifiedAt: string;
  readonly studentRecordMatchedAt: string;
}

export interface DemoApplicantCommunicationPreferencesConfig {
  readonly emailNotifications: boolean;
  readonly smsNotifications: boolean;
  readonly inAppNotifications: boolean;
  readonly requestUpdates: boolean;
  readonly paymentConfirmations: boolean;
  readonly documentIssuedAlerts: boolean;
}

export interface DemoApplicantSecurityConfig {
  readonly twoFactorEnabled: boolean;
  readonly activeSessions: number;
}

export interface DemoApplicantProfileConfig {
  readonly id: string;
  readonly fullName: string;
  readonly preferredName: string;
  readonly roleLabel: string;
  readonly studentNumber: string;
  readonly email: string;
  readonly phone: string;
  readonly alternatePhone?: string;
  readonly dateOfBirth: string;
  readonly gender: string;
  readonly nationality: string;
  readonly maritalStatus: string;
  readonly homeAddress: string;
  readonly programme: string;
  readonly department: string;
  readonly campus: string;
  readonly intake: string;
  readonly yearOfStudy: string;
  readonly expectedCompletion: string;
  readonly profileCompletion: number;
  readonly verification: DemoApplicantVerificationConfig;
  readonly communicationPreferences:
    DemoApplicantCommunicationPreferencesConfig;
  readonly security: DemoApplicantSecurityConfig;
}

export interface DemoIssuedDocumentConfig {
  readonly id: string;
  readonly requestId: string;
  readonly applicantName: string;
  readonly documentType: string;
  readonly issuedAt: string;
  readonly expiresAt?: string;
  readonly views: number;
  readonly status: DemoIssuedDocumentStatus;
}

export interface DemoDocumentReviewConfig {
  readonly id: string;
  readonly requestId: string;
  readonly applicantName: string;
  readonly documentType: string;
  readonly category: string;
  readonly submittedAt: string;
  readonly reviewerName: string;
  readonly dueAt: string;
  readonly status: DemoDocumentReviewStatus;
}

export interface DemoVerificationLogConfig {
  readonly id: string;
  readonly documentId: string;
  readonly applicantName: string;
  readonly documentType: string;
  readonly verifiedAt: string;
  readonly result: DemoVerificationLogResult;
  readonly verifiedBy: string;
}

export interface DemoDocumentHubConfig {
  readonly issuedDocuments: readonly DemoIssuedDocumentConfig[];
  readonly reviewQueue: readonly DemoDocumentReviewConfig[];
  readonly verificationLogs: readonly DemoVerificationLogConfig[];
}

export interface DemoPublicVerificationRecordConfig {
  readonly token: string;
  readonly verificationCode: string;
  readonly status: DemoPublicVerificationStatus;
  readonly institution: string;
  readonly issuingOffice: string;
  readonly documentType: string;
  readonly maskedHolderName: string;
  readonly certificateReference: string;
  readonly issuedAt: string;
  readonly verifiedAt: string;
  readonly replacementReference?: string;
  readonly publicNote?: string;
}

export interface DemoVerificationConfig {
  readonly defaultCode: string;
  readonly privacyNotice: string;
  readonly disclaimer: string;
  readonly records: readonly DemoPublicVerificationRecordConfig[];
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
  readonly documents: DemoDocumentHubConfig;
  readonly applicantProfile: DemoApplicantProfileConfig;
  readonly verification: DemoVerificationConfig;
}
