import { DepartmentHandoffProcessingWorkspace } from "@/components/demo/department/department-handoff-processing-workspace";
import { getDefaultDemoClient } from "@/config/demo";

type DemoDepartmentHandoffPageProps = {
  readonly params: Promise<{
    readonly handoffId: string;
  }>;
};

export default async function DemoDepartmentHandoffPage({
  params,
}: DemoDepartmentHandoffPageProps) {
  const { handoffId } = await params;
  const client = getDefaultDemoClient();

  return (
    <DepartmentHandoffProcessingWorkspace
      handoffId={handoffId}
      organizationName={client.organization.name}
      departments={client.departments.map((department) => ({
        id: department.id,
        name: department.name,
      }))}
      serviceSlugs={client.services
        .filter((service) => service.active)
        .map((service) => service.slug)}
    />
  );
}
