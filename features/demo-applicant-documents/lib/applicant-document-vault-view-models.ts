import type {
  DemoApplicantDocumentConfig,
  DemoApplicantDocumentKind,
  DemoApplicantDocumentStatus,
} from "@/features/demo-engine/config";

export function formatVaultDate(value: string): string {
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

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const kilobytes = bytes / 1024;
  if (kilobytes < 1024) {
    return `${kilobytes.toFixed(0)} KB`;
  }

  const megabytes = kilobytes / 1024;
  if (megabytes < 1024) {
    return `${megabytes.toFixed(1)} MB`;
  }

  return `${(megabytes / 1024).toFixed(1)} GB`;
}

export function displayVaultStatus(
  status: DemoApplicantDocumentStatus,
): string {
  switch (status) {
    case "verified":
      return "Verified";
    case "under-review":
      return "Under Review";
    case "issued":
      return "Issued";
    case "expired":
      return "Expired";
    case "rejected":
      return "Rejected";
  }
}

export function tabForKind(
  kind: DemoApplicantDocumentKind,
): "uploads" | "letters" | "certificates" {
  switch (kind) {
    case "upload":
      return "uploads";
    case "generated-letter":
      return "letters";
    case "certificate":
      return "certificates";
  }
}

export function filterVaultDocuments(
  documents: readonly DemoApplicantDocumentConfig[],
  tab: "uploads" | "letters" | "certificates",
  query: string,
): readonly DemoApplicantDocumentConfig[] {
  const normalized = query.trim().toLowerCase();

  return documents.filter((document) => {
    const matchesTab = tabForKind(document.kind) === tab;
    const matchesQuery =
      !normalized ||
      document.fileName.toLowerCase().includes(normalized) ||
      document.displayName.toLowerCase().includes(normalized) ||
      document.category.toLowerCase().includes(normalized) ||
      document.requestId?.toLowerCase().includes(normalized) ||
      document.verificationCode?.toLowerCase().includes(normalized);

    return matchesTab && matchesQuery;
  });
}
