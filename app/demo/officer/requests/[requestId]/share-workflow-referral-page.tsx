import { notFound } from "next/navigation";

import { OfficerRequestReview } from "@/components/demo/officer/officer-request-review";
import { getDefaultDemoClient } from "@/config/demo";

import { ExternalRecipientSharePanel } from "@/components/demo/officer/referral";
type DemoOfficerRequestPageProps = {
  readonly params: Promise<{
    readonly requestId: string;
  }>;
  readonly searchParams: Promise<{
    readonly service?: string | readonly string[];
  }>;
};

const SERVICE_BY_REQUEST_ID: Readonly<Record<string, string>> = {
  "REQ-DEMO-001": "transcript-request",
  "REQ-DEMO-002": "student-clearance",
  "REQ-DEMO-003": "certificate-replacement",
  "REQ-DEMO-004": "transcript-request",
};

export default async function DemoOfficerRequestPage({
  params,
  searchParams,
}: DemoOfficerRequestPageProps) {
  const client = getDefaultDemoClient();
  const { requestId } = await params;
  const resolvedSearchParams = await searchParams;

  const requestedService = Array.isArray(resolvedSearchParams.service)
    ? resolvedSearchParams.service[0]
    : resolvedSearchParams.service;

  const serviceSlug =
    requestedService ??
    SERVICE_BY_REQUEST_ID[requestId] ??
    "transcript-request";

  const service = client.services.find(
    (candidate) =>
      candidate.active && candidate.slug === serviceSlug,
  );

  if (!service) {
    notFound();
  }

  const departments = client.departments.map((department) => ({
    id: department.id,
    name: department.name,
  }));

  return (
    <>
      <ExternalRecipientSharePanel />
      <OfficerRequestReview
      requestId={requestId}
      organizationName={client.organization.name}
      service={service}
      departments={departments}
    />
    </>
  );
}
