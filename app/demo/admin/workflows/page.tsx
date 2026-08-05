import {
  WorkflowBuilder,
} from "@/features/demo-admin-workflows/components/workflow-builder";
import {
  WorkflowOverview,
} from "@/features/demo-admin-workflows/components/workflow-overview";
import {
  resolveAdminWorkflowRouteSurface,
  type AdminWorkflowRouteSearchParams,
} from "@/features/demo-engine/navigation/admin-workflow-route-compatibility";

type CanonicalAdminWorkflowsPageProps = {
  searchParams: Promise<AdminWorkflowRouteSearchParams>;
};

/**
 * D34-6 canonical admin workflow destination.
 *
 * /demo/admin/workflows is the visible Workflow Builder route.
 * The pre-existing overview remains available through ?view=overview.
 */
export default async function CanonicalAdminWorkflowsPage({
  searchParams,
}: CanonicalAdminWorkflowsPageProps) {
  const surface = resolveAdminWorkflowRouteSurface(
    await searchParams,
  );

  if (surface.kind === "overview") {
    return (
      <WorkflowOverview
        initialTab={surface.initialTab}
      />
    );
  }

  return (
    <WorkflowBuilder
      initialTemplateId={surface.initialTemplateId}
    />
  );
}
