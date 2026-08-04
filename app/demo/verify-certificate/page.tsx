import type { Metadata } from "next";

import {
  PublicVerificationPage,
} from "@/features/demo-verification/components/public-verification-page";

export const metadata: Metadata = {
  title: "Verify Certificate | FAIDIA Demo",
  description:
    "Verify a controlled institutional certificate record.",
};

type VerifyCertificatePageProps = {
  readonly searchParams: Promise<{
    readonly code?: string | string[];
  }>;
};

export default async function VerifyCertificatePage({
  searchParams,
}: VerifyCertificatePageProps) {
  const parameters = await searchParams;

  const code = Array.isArray(parameters.code)
    ? parameters.code[0]
    : parameters.code;

  return (
    <PublicVerificationPage initialCode={code} />
  );
}
