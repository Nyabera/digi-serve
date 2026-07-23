import { DepartmentInboxWorkspace } from "@/components/demo/department/department-inbox-workspace";
import { getDefaultDemoClient } from "@/config/demo";

export default function DemoDepartmentPage() {
  const client = getDefaultDemoClient();

  return (
    <DepartmentInboxWorkspace
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
