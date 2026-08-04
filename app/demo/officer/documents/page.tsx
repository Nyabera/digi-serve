import type { Metadata } from "next";

import {
  OfficerDocumentHub,
  type OfficerDocumentHubTab,
} from "@/features/demo-documents/components/officer-document-hub";

export const metadata: Metadata = {
  title:
    "Documents & Verification Hub | FAIDIA Demo",
  description:
    "Manage issued documents, review queues and verification activity.",
};

type Props = {
  readonly searchParams: Promise<{
    readonly tab?: string | string[];
  }>;
};

const validTabs =
  new Set<OfficerDocumentHubTab>([
    "issued",
    "review",
    "verifications",
  ]);

export default async function OfficerDocumentsPage({
  searchParams,
}: Props) {
  const params = await searchParams;
  const requested = Array.isArray(params.tab)
    ? params.tab[0]
    : params.tab;

  const initialTab =
    requested &&
    validTabs.has(
      requested as OfficerDocumentHubTab,
    )
      ? (
          requested as OfficerDocumentHubTab
        )
      : "issued";

  return (
    <OfficerDocumentHub
      initialTab={initialTab}
    />
  );
}
