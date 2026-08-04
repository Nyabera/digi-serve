import { notFound } from "next/navigation";

import { RequestConfirmationPage } from "@/components/demo/public/request-confirmation-page";
import { getDefaultDemoClient } from "@/config/demo";

type DemoRequestConfirmationPageProps = {
  readonly params: Promise<{
    readonly requestId: string;
  }>;
  readonly searchParams: Promise<{
    readonly service?: string | readonly string[];
    readonly submitted?: string | readonly string[];
  }>;
};

export default async function DemoRequestConfirmationPage({
  params,
  searchParams,
}: DemoRequestConfirmationPageProps) {
  const client = getDefaultDemoClient();
  const { requestId } = await params;
  const resolvedSearchParams = await searchParams;

  const requestedService = Array.isArray(
    resolvedSearchParams.service,
  )
    ? resolvedSearchParams.service[0]
    : resolvedSearchParams.service;

  const serviceSlug = requestedService ?? "transcript-request";

  const service = client.services.find(
    (candidate) =>
      candidate.active && candidate.slug === serviceSlug,
  );

  if (!service) {
    notFound();
  }

  return (
    <RequestConfirmationPage
      requestId={requestId}
      service={service}
    />
  );
}
