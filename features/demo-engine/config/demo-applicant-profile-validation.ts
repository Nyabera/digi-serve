import type {
  DemoApplicantProfileConfig,
} from "./demo-pack.types";

export type DemoApplicantProfileValidationIssue = {
  readonly level: "error" | "warning";
  readonly code: string;
  readonly path: string;
  readonly message: string;
};

function isNonEmptyString(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0
  );
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidDate(value: string): boolean {
  return !Number.isNaN(Date.parse(value));
}

export function validateDemoApplicantProfileConfig(
  profile: DemoApplicantProfileConfig,
): readonly DemoApplicantProfileValidationIssue[] {
  const issues: DemoApplicantProfileValidationIssue[] = [];

  const add = (
    level: "error" | "warning",
    code: string,
    path: string,
    message: string,
  ) => {
    issues.push({ level, code, path, message });
  };

  for (const [field, value] of [
    ["id", profile.id],
    ["fullName", profile.fullName],
    ["preferredName", profile.preferredName],
    ["roleLabel", profile.roleLabel],
    ["studentNumber", profile.studentNumber],
    ["email", profile.email],
    ["phone", profile.phone],
    ["dateOfBirth", profile.dateOfBirth],
    ["gender", profile.gender],
    ["nationality", profile.nationality],
    ["maritalStatus", profile.maritalStatus],
    ["homeAddress", profile.homeAddress],
    ["programme", profile.programme],
    ["department", profile.department],
    ["campus", profile.campus],
    ["intake", profile.intake],
    ["yearOfStudy", profile.yearOfStudy],
    ["expectedCompletion", profile.expectedCompletion],
  ] as const) {
    if (!isNonEmptyString(value)) {
      add(
        "error",
        "MISSING_APPLICANT_PROFILE_FIELD",
        `applicantProfile.${field}`,
        `${field} must be a non-empty string.`,
      );
    }
  }

  if (
    isNonEmptyString(profile.email) &&
    !isValidEmail(profile.email)
  ) {
    add(
      "error",
      "INVALID_APPLICANT_EMAIL",
      "applicantProfile.email",
      `Invalid applicant email: ${profile.email}.`,
    );
  }

  for (const [path, value] of [
    ["applicantProfile.dateOfBirth", profile.dateOfBirth],
    [
      "applicantProfile.expectedCompletion",
      profile.expectedCompletion,
    ],
    [
      "applicantProfile.verification.emailVerifiedAt",
      profile.verification.emailVerifiedAt,
    ],
    [
      "applicantProfile.verification.phoneVerifiedAt",
      profile.verification.phoneVerifiedAt,
    ],
    [
      "applicantProfile.verification.studentRecordMatchedAt",
      profile.verification.studentRecordMatchedAt,
    ],
  ] as const) {
    if (!isValidDate(value)) {
      add(
        "error",
        "INVALID_APPLICANT_PROFILE_DATE",
        path,
        `Invalid date: ${value}.`,
      );
    }
  }

  if (
    profile.profileCompletion < 0 ||
    profile.profileCompletion > 100
  ) {
    add(
      "error",
      "INVALID_PROFILE_COMPLETION",
      "applicantProfile.profileCompletion",
      "Profile completion must be between 0 and 100.",
    );
  }

  if (profile.security.activeSessions < 0) {
    add(
      "error",
      "INVALID_ACTIVE_SESSION_COUNT",
      "applicantProfile.security.activeSessions",
      "Active sessions cannot be negative.",
    );
  }

  if (
    profile.alternatePhone &&
    profile.alternatePhone === profile.phone
  ) {
    add(
      "warning",
      "DUPLICATE_APPLICANT_PHONE",
      "applicantProfile.alternatePhone",
      "The alternate phone matches the primary phone.",
    );
  }

  return issues;
}
