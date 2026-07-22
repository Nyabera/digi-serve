import { notFound } from "next/navigation";

import { ServiceApplicationPage } from "@/components/demo/public/service-application-page";
import { ServiceDocumentsPage } from "@/components/demo/public/service-documents-page";
import { getDefaultDemoClient } from "@/config/demo";

type DemoApplicationPageProps = {
  readonly params: Promise<{
    readonly serviceSlug: string;
  }>;
  readonly searchParams: Promise<{
    readonly step?: string | readonly string[];
  }>;
};

export default async function DemoApplicationPage({
  params,
  searchParams,
}: DemoApplicationPageProps) {
  const client = getDefaultDemoClient();
  const { serviceSlug } = await params;
  const resolvedSearchParams = await searchParams;

  const requestedStep = Array.isArray(resolvedSearchParams.step)
    ? resolvedSearchParams.step[0]
    : resolvedSearchParams.step;

  const service = client.services.find(
    (candidate) =>
      candidate.active && candidate.slug === serviceSlug,
  );

  if (!service) {
    notFound();
  }

  if (requestedStep === "documents") {
    return <ServiceDocumentsPage service={service} />;
  }

  return <ServiceApplicationPage service={service} />;
}
