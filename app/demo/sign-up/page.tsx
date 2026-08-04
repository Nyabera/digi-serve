import { notFound } from "next/navigation";

import { ApplicantSignUpPage } from "@/components/demo/public/applicant-sign-up-page";
import { getDefaultDemoClient } from "@/config/demo";

type DemoSignUpPageProps = {
  readonly searchParams: Promise<{
    readonly service?: string | string[];
  }>;
};

export default async function DemoSignUpPage({
  searchParams,
}: DemoSignUpPageProps) {
  const client = getDefaultDemoClient();
  const resolvedSearchParams = await searchParams;

  const requestedService = Array.isArray(resolvedSearchParams.service)
    ? resolvedSearchParams.service[0]
    : resolvedSearchParams.service;

  const serviceSlug = requestedService ?? "transcript-request";

  const service = client.services.find(
    (candidate) => candidate.active && candidate.slug === serviceSlug,
  );

  if (!service) {
    notFound();
  }

  return <ApplicantSignUpPage service={service} />;
}
