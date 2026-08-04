import type {
  DemoApplicantDocumentVaultConfig,
} from "./demo-pack.types";

export type DemoApplicantDocumentVaultValidationIssue = {
  readonly level: "error" | "warning";
  readonly code: string;
  readonly path: string;
  readonly message: string;
};

function nonEmpty(value: string): boolean {
  return value.trim().length > 0;
}

export function validateDemoApplicantDocumentVaultConfig(
  vault: DemoApplicantDocumentVaultConfig,
): readonly DemoApplicantDocumentVaultValidationIssue[] {
  const issues: DemoApplicantDocumentVaultValidationIssue[] = [];
  const ids = new Set<string>();

  const add = (
    level: "error" | "warning",
    code: string,
    path: string,
    message: string,
  ) => issues.push({ level, code, path, message });

  if (vault.storageUsedBytes < 0) {
    add(
      "error",
      "INVALID_VAULT_STORAGE",
      "applicantDocumentVault.storageUsedBytes",
      "Used storage cannot be negative.",
    );
  }

  if (vault.storageLimitBytes <= 0) {
    add(
      "error",
      "INVALID_VAULT_LIMIT",
      "applicantDocumentVault.storageLimitBytes",
      "Storage limit must be greater than zero.",
    );
  }

  if (vault.storageUsedBytes > vault.storageLimitBytes) {
    add(
      "warning",
      "VAULT_OVER_LIMIT",
      "applicantDocumentVault",
      "Seeded storage usage exceeds the configured limit.",
    );
  }

  vault.documents.forEach((document, index) => {
    const path =
      `applicantDocumentVault.documents[${index}]`;

    if (ids.has(document.id)) {
      add(
        "error",
        "DUPLICATE_VAULT_DOCUMENT_ID",
        `${path}.id`,
        `Duplicate document ID: ${document.id}.`,
      );
    }
    ids.add(document.id);

    for (const [field, value] of [
      ["id", document.id],
      ["fileName", document.fileName],
      ["displayName", document.displayName],
      ["category", document.category],
      ["mimeType", document.mimeType],
      ["createdAt", document.createdAt],
      ["updatedAt", document.updatedAt],
    ] as const) {
      if (!nonEmpty(value)) {
        add(
          "error",
          "MISSING_VAULT_DOCUMENT_FIELD",
          `${path}.${field}`,
          `${field} must be a non-empty string.`,
        );
      }
    }

    if (document.sizeBytes <= 0) {
      add(
        "error",
        "INVALID_VAULT_DOCUMENT_SIZE",
        `${path}.sizeBytes`,
        "Document size must be greater than zero.",
      );
    }

    for (const [field, value] of [
      ["createdAt", document.createdAt],
      ["updatedAt", document.updatedAt],
      ["expiresAt", document.expiresAt],
    ] as const) {
      if (value && Number.isNaN(Date.parse(value))) {
        add(
          "error",
          "INVALID_VAULT_DOCUMENT_DATE",
          `${path}.${field}`,
          `Invalid date: ${value}.`,
        );
      }
    }

    if (
      document.kind === "certificate" &&
      !document.verificationCode
    ) {
      add(
        "warning",
        "CERTIFICATE_WITHOUT_VERIFICATION_CODE",
        path,
        "Certificate records should include a verification code.",
      );
    }
  });

  return issues;
}
