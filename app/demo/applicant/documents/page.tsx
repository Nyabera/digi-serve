import type {
  Metadata,
} from "next";

import {
  ApplicantDocumentVault,
} from "@/features/demo-applicant-documents/components/applicant-document-vault";

export const metadata: Metadata = {
  title: "Applicant Document Vault | FAIDIA Demo",
  description:
    "Manage applicant uploads, generated letters and certificates.",
};

type ApplicantDocumentsPageProps = {
  readonly searchParams: Promise<{
    readonly tab?: string | string[];
  }>;
};

const tabs = new Set([
  "uploads",
  "letters",
  "certificates",
]);

export default async function ApplicantDocumentsPage({
  searchParams,
}: ApplicantDocumentsPageProps) {
  const parameters = await searchParams;
  const requested = Array.isArray(parameters.tab)
    ? parameters.tab[0]
    : parameters.tab;

  const initialTab =
    requested && tabs.has(requested)
      ? (requested as
          | "uploads"
          | "letters"
          | "certificates")
      : "uploads";

  return (
    <ApplicantDocumentVault initialTab={initialTab} />
  );
}
