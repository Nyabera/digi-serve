import type {
  DemoVerificationConfig,
} from "./demo-pack.types";

export type DemoVerificationValidationIssue = {
  readonly level: "error" | "warning";
  readonly code: string;
  readonly path: string;
  readonly message: string;
};

function duplicates(values: readonly string[]): readonly string[] {
  const counts = new Map<string, number>();
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()]
    .filter(([, count]) => count > 1)
    .map(([value]) => value);
}

export function validateDemoVerificationConfig(
  config: DemoVerificationConfig,
): readonly DemoVerificationValidationIssue[] {
  const issues: DemoVerificationValidationIssue[] = [];
  const add = (
    level: "error" | "warning",
    code: string,
    path: string,
    message: string,
  ) => issues.push({ level, code, path, message });

  if (!config.defaultCode.trim()) {
    add("error", "MISSING_VERIFICATION_DEFAULT", "verification.defaultCode", "A default code is required.");
  }
  if (!config.privacyNotice.trim()) {
    add("error", "MISSING_PRIVACY_NOTICE", "verification.privacyNotice", "A privacy explanation is required.");
  }
  if (!config.disclaimer.trim()) {
    add("error", "MISSING_VERIFICATION_DISCLAIMER", "verification.disclaimer", "A disclaimer is required.");
  }
  if (config.records.length === 0) {
    add("error", "NO_VERIFICATION_RECORDS", "verification.records", "At least one verification record is required.");
  }

  for (const code of duplicates(config.records.map((record) => record.verificationCode.toUpperCase()))) {
    add("error", "DUPLICATE_VERIFICATION_CODE", "verification.records", `Duplicate verification code: ${code}.`);
  }
  for (const token of duplicates(config.records.map((record) => record.token.toLowerCase()))) {
    add("error", "DUPLICATE_VERIFICATION_TOKEN", "verification.records", `Duplicate verification token: ${token}.`);
  }

  if (!config.records.some((record) => record.verificationCode.toUpperCase() === config.defaultCode.toUpperCase())) {
    add("error", "MISSING_DEFAULT_VERIFICATION_RECORD", "verification.defaultCode", "The default code does not match a configured record.");
  }

  for (const [index, record] of config.records.entries()) {
    const path = `verification.records[${index}]`;
    const required = {
      token: record.token,
      verificationCode: record.verificationCode,
      institution: record.institution,
      issuingOffice: record.issuingOffice,
      documentType: record.documentType,
      maskedHolderName: record.maskedHolderName,
      certificateReference: record.certificateReference,
      issuedAt: record.issuedAt,
      verifiedAt: record.verifiedAt,
    };

    for (const [field, value] of Object.entries(required)) {
      if (!value.trim()) {
        add("error", "MISSING_VERIFICATION_FIELD", `${path}.${field}`, `${field} must not be empty.`);
      }
    }

    if (!record.maskedHolderName.includes("•") && !record.maskedHolderName.includes("*")) {
      add("error", "UNMASKED_PUBLIC_HOLDER", `${path}.maskedHolderName`, "The public holder name must be partially masked.");
    }
    if (Number.isNaN(Date.parse(record.issuedAt))) {
      add("error", "INVALID_VERIFICATION_DATE", `${path}.issuedAt`, "The issuance date is invalid.");
    }
    if (Number.isNaN(Date.parse(record.verifiedAt))) {
      add("error", "INVALID_VERIFICATION_DATE", `${path}.verifiedAt`, "The verification timestamp is invalid.");
    }
    if (record.status === "replaced" && !record.replacementReference?.trim()) {
      add("error", "MISSING_REPLACEMENT_REFERENCE", `${path}.replacementReference`, "A replaced record requires a replacement reference.");
    }
  }

  return issues;
}
