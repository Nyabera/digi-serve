import type {
  DemoDocumentHubConfig,
} from "./demo-pack.types";

export type DemoDocumentHubValidationIssue = {
  readonly level: "error" | "warning";
  readonly code: string;
  readonly path: string;
  readonly message: string;
};

function isNonEmptyString(
  value: unknown,
): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0
  );
}

function isValidDate(value: string): boolean {
  return !Number.isNaN(Date.parse(value));
}

function findDuplicateIds(
  records: readonly {
    readonly id: string;
  }[],
): readonly string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const record of records) {
    if (seen.has(record.id)) {
      duplicates.add(record.id);
    }

    seen.add(record.id);
  }

  return [...duplicates];
}

export function validateDemoDocumentHubConfig(
  documents: DemoDocumentHubConfig,
): readonly DemoDocumentHubValidationIssue[] {
  const issues: DemoDocumentHubValidationIssue[] = [];

  const add = (
    level: "error" | "warning",
    code: string,
    path: string,
    message: string,
  ) => {
    issues.push({
      level,
      code,
      path,
      message,
    });
  };

  const collections = [
    {
      path: "documents.issuedDocuments",
      records: documents.issuedDocuments,
    },
    {
      path: "documents.reviewQueue",
      records: documents.reviewQueue,
    },
    {
      path: "documents.verificationLogs",
      records: documents.verificationLogs,
    },
  ] as const;

  for (const collection of collections) {
    if (collection.records.length === 0) {
      add(
        "warning",
        "EMPTY_DOCUMENT_COLLECTION",
        collection.path,
        "The document collection is empty.",
      );
    }

    for (
      const duplicate
      of findDuplicateIds(collection.records)
    ) {
      add(
        "error",
        "DUPLICATE_DOCUMENT_ID",
        collection.path,
        `Duplicate document ID: ${duplicate}.`,
      );
    }
  }

  const issuedDocumentIds = new Set(
    documents.issuedDocuments.map(
      (document) => document.id,
    ),
  );

  documents.issuedDocuments.forEach(
    (document, index) => {
      const path =
        `documents.issuedDocuments[${index}]`;

      for (const [field, value] of [
        ["id", document.id],
        ["requestId", document.requestId],
        ["applicantName", document.applicantName],
        ["documentType", document.documentType],
        ["issuedAt", document.issuedAt],
      ] as const) {
        if (!isNonEmptyString(value)) {
          add(
            "error",
            "MISSING_ISSUED_DOCUMENT_FIELD",
            `${path}.${field}`,
            `${field} must be a non-empty string.`,
          );
        }
      }

      if (!isValidDate(document.issuedAt)) {
        add(
          "error",
          "INVALID_DOCUMENT_DATE",
          `${path}.issuedAt`,
          `Invalid issuance date: ${document.issuedAt}.`,
        );
      }

      if (
        document.expiresAt &&
        !isValidDate(document.expiresAt)
      ) {
        add(
          "error",
          "INVALID_DOCUMENT_DATE",
          `${path}.expiresAt`,
          `Invalid expiry date: ${document.expiresAt}.`,
        );
      }

      if (document.views < 0) {
        add(
          "error",
          "INVALID_DOCUMENT_VIEW_COUNT",
          `${path}.views`,
          "Document views cannot be negative.",
        );
      }
    },
  );

  documents.reviewQueue.forEach(
    (review, index) => {
      const path =
        `documents.reviewQueue[${index}]`;

      for (const [field, value] of [
        ["id", review.id],
        ["requestId", review.requestId],
        ["applicantName", review.applicantName],
        ["documentType", review.documentType],
        ["reviewerName", review.reviewerName],
        ["submittedAt", review.submittedAt],
        ["dueAt", review.dueAt],
      ] as const) {
        if (!isNonEmptyString(value)) {
          add(
            "error",
            "MISSING_DOCUMENT_REVIEW_FIELD",
            `${path}.${field}`,
            `${field} must be a non-empty string.`,
          );
        }
      }

      const submittedAt = Date.parse(
        review.submittedAt,
      );
      const dueAt = Date.parse(review.dueAt);

      if (Number.isNaN(submittedAt)) {
        add(
          "error",
          "INVALID_DOCUMENT_DATE",
          `${path}.submittedAt`,
          `Invalid submission date: ${review.submittedAt}.`,
        );
      }

      if (Number.isNaN(dueAt)) {
        add(
          "error",
          "INVALID_DOCUMENT_DATE",
          `${path}.dueAt`,
          `Invalid due date: ${review.dueAt}.`,
        );
      }

      if (
        !Number.isNaN(submittedAt) &&
        !Number.isNaN(dueAt) &&
        dueAt < submittedAt
      ) {
        add(
          "error",
          "REVIEW_DUE_BEFORE_SUBMISSION",
          path,
          "Review due date cannot precede submission.",
        );
      }
    },
  );

  documents.verificationLogs.forEach(
    (log, index) => {
      const path =
        `documents.verificationLogs[${index}]`;

      for (const [field, value] of [
        ["id", log.id],
        ["documentId", log.documentId],
        ["applicantName", log.applicantName],
        ["documentType", log.documentType],
        ["verifiedAt", log.verifiedAt],
        ["verifiedBy", log.verifiedBy],
      ] as const) {
        if (!isNonEmptyString(value)) {
          add(
            "error",
            "MISSING_VERIFICATION_LOG_FIELD",
            `${path}.${field}`,
            `${field} must be a non-empty string.`,
          );
        }
      }

      if (
        !issuedDocumentIds.has(log.documentId)
      ) {
        add(
          "error",
          "UNKNOWN_ISSUED_DOCUMENT",
          `${path}.documentId`,
          `Unknown issued document: ${log.documentId}.`,
        );
      }

      if (!isValidDate(log.verifiedAt)) {
        add(
          "error",
          "INVALID_DOCUMENT_DATE",
          `${path}.verifiedAt`,
          `Invalid verification date: ${log.verifiedAt}.`,
        );
      }
    },
  );

  return issues;
}
