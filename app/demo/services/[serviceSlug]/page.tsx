import { notFound } from "next/navigation";

import { ServiceInformationPage } from "@/components/demo/public/service-information-page";
import { getDefaultDemoClient } from "@/config/demo";

type ServiceInformationRouteProps = {
  readonly params: Promise<{
    readonly serviceSlug: string;
  }>;
};

export function generateStaticParams() {
  const client = getDefaultDemoClient();

  return client.services
    .filter((service) => service.active)
    .map((service) => ({
      serviceSlug: service.slug,
    }));
}

export default async function ServiceInformationRoute({
  params,
}: ServiceInformationRouteProps) {
  const { serviceSlug } = await params;
  const client = getDefaultDemoClient();

  const service = client.services.find(
    (candidate) => candidate.slug === serviceSlug && candidate.active,
  );

  if (!service) {
    notFound();
  }

  const workflow = client.workflows.find(
    (candidate) => candidate.id === service.workflowId,
  );

  const relatedServices = client.services.filter(
    (candidate) => candidate.active && candidate.id !== service.id,
  );

  return (
    <ServiceInformationPage
      client={client}
      service={service}
      workflowVersion={workflow?.version ?? 1}
      relatedServices={relatedServices}
    />
  );
}
