export type DemoHomepageVariant = "A" | "B" | "C";

export type DemoRole =
  | "APPLICANT"
  | "OFFICER"
  | "SUPERVISOR"
  | "ORGANIZATION_ADMIN";

export type DemoFormFieldType =
  | "SHORT_TEXT"
  | "EMAIL"
  | "PHONE"
  | "SELECT"
  | "YEAR"
  | "TEXTAREA"
  | "CHECKBOX"
  | "DECLARATION";

export type DemoRequirementLevel =
  | "REQUIRED"
  | "CONDITIONAL"
  | "OPTIONAL";

export type DemoWorkflowStepType =
  | "APPLICANT_ACTION"
  | "OFFICER_REVIEW"
  | "CORRECTION"
  | "REFERRAL"
  | "OFFICER_COMPLETION"
  | "APPROVAL"
  | "OUTCOME"
  | "COMPLETION";

export type DemoChartType = "BAR" | "LINE" | "DONUT";

export interface DemoBrandingConfig {
  readonly logoMark: string;
  readonly logoText: string;
  readonly logoPath: string;
  readonly primaryColor: string;
  readonly secondaryColor: string;
  readonly accentColor: string;
  readonly surfaceColor: string;
}

export interface DemoOrganizationConfig {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly shortName: string;
  readonly type: string;
  readonly tagline: string;
  readonly description: string;
  readonly location: string;
  readonly contact: {
    readonly email: string;
    readonly phone: string;
  };
}

export interface DemoDepartmentConfig {
  readonly id: string;
  readonly name: string;
  readonly shortName: string;
  readonly description: string;
}

export interface DemoPersonConfig {
  readonly id: string;
  readonly name: string;
  readonly role: DemoRole;
  readonly jobTitle: string;
  readonly departmentId?: string;
  readonly email: string;
  readonly initials: string;
}

export interface DemoFieldOption {
  readonly label: string;
  readonly value: string;
}

export interface DemoFormFieldConfig {
  readonly key: string;
  readonly label: string;
  readonly type: DemoFormFieldType;
  readonly required: boolean;
  readonly placeholder?: string;
  readonly helpText?: string;
  readonly defaultValue?: string | boolean;
  readonly options?: readonly DemoFieldOption[];
}

export interface DemoFormSectionConfig {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly fields: readonly DemoFormFieldConfig[];
}

export interface DemoDocumentRequirementConfig {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly level: DemoRequirementLevel;
  readonly acceptedFileTypes: readonly string[];
  readonly maximumSizeMb: number;
  readonly replacementAllowed: boolean;
}

export interface DemoServiceConfig {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly shortDescription: string;
  readonly description: string;
  readonly category: string;
  readonly active: boolean;
  readonly featured: boolean;
  readonly expectedProcessingTime: string;
  readonly eligibility: readonly string[];
  readonly requirements: readonly string[];
  readonly fee: {
    readonly type: "FREE" | "MANUAL_REFERENCE";
    readonly label: string;
    readonly amount?: number;
    readonly currency?: "KES";
  };
  readonly form: {
    readonly sections: readonly DemoFormSectionConfig[];
  };
  readonly requiredDocuments: readonly DemoDocumentRequirementConfig[];
  readonly workflowId: string;
  readonly outcomeLabel: string;
}

export interface DemoWorkflowStepConfig {
  readonly id: string;
  readonly order: number;
  readonly label: string;
  readonly description: string;
  readonly type: DemoWorkflowStepType;
  readonly role: DemoRole;
  readonly departmentId?: string;
  readonly internalStatus: string;
  readonly publicStatus: string;
  readonly targetHours?: number;
}

export interface DemoWorkflowConfig {
  readonly id: string;
  readonly serviceId: string;
  readonly name: string;
  readonly version: number;
  readonly steps: readonly DemoWorkflowStepConfig[];
}

export interface DemoChartDatum {
  readonly label: string;
  readonly value: number;
  readonly secondaryValue?: number;
}

export interface DemoReportConfig {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly chartType: DemoChartType;
  readonly data: readonly DemoChartDatum[];
}

export interface DemoHomepageConfig {
  readonly defaultVariant: DemoHomepageVariant;
  readonly availableVariants: readonly DemoHomepageVariant[];
  readonly showVariantSwitcher: boolean;
}

export interface DemoPresentationConfig {
  readonly defaultRole: DemoRole;
  readonly showRoleSwitcher: boolean;
  readonly showPresentationControls: boolean;
  readonly allowReset: boolean;
}

export interface DemoClientConfig {
  readonly schemaVersion: 1;
  readonly organization: DemoOrganizationConfig;
  readonly branding: DemoBrandingConfig;
  readonly homepage: DemoHomepageConfig;
  readonly presentation: DemoPresentationConfig;
  readonly departments: readonly DemoDepartmentConfig[];
  readonly people: readonly DemoPersonConfig[];
  readonly services: readonly DemoServiceConfig[];
  readonly workflows: readonly DemoWorkflowConfig[];
  readonly reports: readonly DemoReportConfig[];
}
