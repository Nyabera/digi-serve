import { notFound } from "next/navigation";

import { ControlledOutcomeShell } from "@/components/demo/outcomes/controlled-outcome-shell";
import { getDefaultDemoClient } from "@/config/demo";

type DemoOutcomePageProps = {
  readonly params: Promise<{
    readonly requestId: string;
  }>;
  readonly searchParams: Promise<{
    readonly service?:
      | string
      | readonly string[];
  }>;
};

export default async function DemoOutcomePage({
  params,
  searchParams,
}: DemoOutcomePageProps) {
  const client = getDefaultDemoClient();
  const { requestId } = await params;
  const resolvedSearchParams =
    await searchParams;

  const requestedService =
    Array.isArray(
      resolvedSearchParams.service,
    )
      ? resolvedSearchParams.service[0]
      : resolvedSearchParams.service;

  const serviceSlug =
    requestedService ??
    "transcript-request";

  const service =
    client.services.find(
      (candidate) =>
        candidate.active &&
        candidate.slug === serviceSlug,
    ) ??
    client.services.find(
      (candidate) =>
        candidate.active &&
        candidate.slug ===
          "transcript-request",
    );

  if (!service) {
    notFound();
  }

  return (
    <ControlledOutcomeShell
      requestId={requestId}
      organizationName={
        client.organization.name
      }
      service={service}
    />
  );
}
