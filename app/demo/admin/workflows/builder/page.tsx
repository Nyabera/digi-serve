import { redirect } from "next/navigation";

import {
  buildAdminWorkflowBuilderHref,
  type AdminWorkflowRouteSearchParams,
} from "@/features/demo-engine/navigation/admin-workflow-route-compatibility";

type LegacyAdminWorkflowBuilderPageProps = {
  searchParams: Promise<
    Pick<AdminWorkflowRouteSearchParams, "template">
  >;
};

function firstTemplate(
  value: string | string[] | undefined,
): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * D34-6 legacy compatibility route.
 *
 * This route no longer owns a second workflow-builder page. It redirects to
 * the canonical admin Workflow Builder destination and preserves the selected
 * template query parameter.
 */
export default async function LegacyAdminWorkflowBuilderPage({
  searchParams,
}: LegacyAdminWorkflowBuilderPageProps) {
  const resolved = await searchParams;

  redirect(
    buildAdminWorkflowBuilderHref(
      firstTemplate(resolved.template),
    ),
  );
}
