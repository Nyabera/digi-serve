import type {
  DemoDocumentHubConfig,
  DemoDocumentReviewStatus,
  DemoIssuedDocumentStatus,
  DemoVerificationLogResult,
} from "@/features/demo-engine/config";

export function formatHubDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Africa/Nairobi",
  }).format(date);
}

export function formatHubTimestamp(
  value: string,
): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Africa/Nairobi",
  }).format(date);
}

export function issuedLabel(
  status: DemoIssuedDocumentStatus,
): string {
  return {
    valid: "Valid",
    revoked: "Revoked",
    expired: "Expired",
    replaced: "Replaced",
  }[status];
}

export function reviewLabel(
  status: DemoDocumentReviewStatus,
): string {
  return {
    pending: "Pending",
    "in-review": "In Review",
    approved: "Approved",
    rejected: "Rejected",
  }[status];
}

export function verificationLabel(
  result: DemoVerificationLogResult,
): string {
  return {
    successful: "Successful",
    failed: "Failed",
    pending: "Pending",
  }[result];
}

export function hubMetrics(
  documents: DemoDocumentHubConfig,
) {
  return {
    issued: documents.issuedDocuments.length,
    revoked: documents.issuedDocuments.filter(
      (item) => item.status === "revoked",
    ).length,
    pendingReviews: documents.reviewQueue.filter(
      (item) => item.status === "pending",
    ).length,
    inReview: documents.reviewQueue.filter(
      (item) => item.status === "in-review",
    ).length,
    successful: documents.verificationLogs.filter(
      (item) => item.result === "successful",
    ).length,
    failed: documents.verificationLogs.filter(
      (item) => item.result === "failed",
    ).length,
    pendingVerification:
      documents.verificationLogs.filter(
        (item) => item.result === "pending",
      ).length,
  };
}
