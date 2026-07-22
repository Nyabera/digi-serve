import { notFound } from "next/navigation";

import { ServiceApplicationPage } from "@/components/demo/public/service-application-page";
import { getDefaultDemoClient } from "@/config/demo";

type DemoApplicationPageProps = {
  readonly params: Promise<{
    readonly serviceSlug: string;
  }>;
};

export default async function DemoApplicationPage({
  params,
}: DemoApplicationPageProps) {
  const client = getDefaultDemoClient();
  const { serviceSlug } = await params;

  const service = client.services.find(
    (candidate) => candidate.active && candidate.slug === serviceSlug,
  );

  if (!service) {
    notFound();
  }

  return <ServiceApplicationPage service={service} />;
}
