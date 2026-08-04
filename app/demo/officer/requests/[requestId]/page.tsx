import type {
  JSXElementConstructor,
} from "react";

import {
  OfficerIndividualCaseShell,
} from "@/components/demo/officer/individual-case";

import ShareWorkflowReferralPage from "./share-workflow-referral-page";

type OfficerRequestSearchParams = Record<
  string,
  string | string[] | undefined
>;

type OfficerRequestPageProps = {
  readonly params: Promise<{
    requestId: string;
  }>;
  readonly searchParams?: Promise<
    OfficerRequestSearchParams
  >;
};

type ReferralPageProps = {
  readonly params: Promise<{
    requestId: string;
  }>;
  readonly searchParams: Promise<
    OfficerRequestSearchParams
  >;
};

export default async function OfficerRequestPage({
  params,
  searchParams,
}: OfficerRequestPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = searchParams
    ? await searchParams
    : {};

  const viewValue = resolvedSearchParams.view;
  const view = Array.isArray(viewValue)
    ? viewValue[0]
    : viewValue;

  if (view === "refer") {
    const ReferralPage =
      ShareWorkflowReferralPage as unknown as
        JSXElementConstructor<ReferralPageProps>;

    return (
      <ReferralPage
        params={Promise.resolve(resolvedParams)}
        searchParams={Promise.resolve(
          resolvedSearchParams,
        )}
      />
    );
  }

  return (
    <OfficerIndividualCaseShell
      requestId={resolvedParams.requestId}
    />
  );
}
