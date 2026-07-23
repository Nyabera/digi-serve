export type ReviewStatusTone =
  | "neutral"
  | "blue"
  | "orange"
  | "red"
  | "green";

export type ReviewResponseItem = {
  readonly id: string;
  readonly label: string;
  readonly value: string;
};

export type ReviewDocumentItem = {
  readonly id: string;
  readonly name: string;
  readonly requirementLabel: string;
  readonly fileSummary: string;
  readonly available: boolean;
};

export type ReviewTimelineItem = {
  readonly id: string;
  readonly title: string;
  readonly detail: string;
  readonly occurredAt: string;
  readonly timestampLabel: string;
};

export type ReviewNoteItem = {
  readonly id: string;
  readonly body: string;
  readonly author: string;
  readonly createdAt: string;
  readonly timestampLabel: string;
};

export type ReviewOfficerOption = {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly departmentName: string;
};

export type ReviewReasonOption = {
  readonly value: string;
  readonly label: string;
};

export type ReviewRequestOption = {
  readonly label: string;
  readonly href: string;
};

export type OfficerReviewReference = {
  readonly officers: readonly ReviewOfficerOption[];
  readonly reasons: readonly ReviewReasonOption[];
  readonly requestOptions: readonly ReviewRequestOption[];
  readonly defaultRequestedAction: string;
  readonly defaultReason: string;
  readonly defaultExpectedOutput: string;
  readonly defaultDueDate: string;
};

export type OfficerReviewReferralModel = {
  readonly requestId: string;
  readonly organizationName: string;
  readonly serviceName: string;
  readonly applicant: {
    readonly name: string;
    readonly initials: string;
    readonly email: string;
    readonly phone: string;
  };
  readonly submittedLabel: string;
  readonly categoryLabel: string;
  readonly currentStepLabel: string;
  readonly statusLabel: string;
  readonly statusTone: ReviewStatusTone;
  readonly slaLabel: string;
  readonly parentOwnerLabel: string;
  readonly responseItems: readonly ReviewResponseItem[];
  readonly documentItems: readonly ReviewDocumentItem[];
  readonly timelineItems: readonly ReviewTimelineItem[];
  readonly noteItems: readonly ReviewNoteItem[];
  readonly availableDocumentCount: number;
  readonly totalDocumentCount: number;
};
