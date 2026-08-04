import type {
  DemoDepartmentConfig,
  DemoPack,
  DemoRequestConfig,
  DemoServiceConfig,
  DemoUserConfig,
  DemoWorkflowConfig,
} from "./demo-pack.types";

export function getDemoDepartmentById(
  pack: DemoPack,
  departmentId: string,
): DemoDepartmentConfig | undefined {
  return pack.departments.find(
    (department) => department.id === departmentId,
  );
}

export function getDemoUserById(
  pack: DemoPack,
  userId: string,
): DemoUserConfig | undefined {
  return pack.users.find((user) => user.id === userId);
}

export function getDemoServiceById(
  pack: DemoPack,
  serviceId: string,
): DemoServiceConfig | undefined {
  return pack.services.find(
    (service) => service.id === serviceId,
  );
}

export function getDemoWorkflowById(
  pack: DemoPack,
  workflowId: string,
): DemoWorkflowConfig | undefined {
  return pack.workflows.find(
    (workflow) => workflow.id === workflowId,
  );
}

export function getDemoRequestById(
  pack: DemoPack,
  requestId: string,
): DemoRequestConfig | undefined {
  return pack.requests.find(
    (request) => request.id === requestId,
  );
}

export function getDefaultDemoRequest(
  pack: DemoPack,
): DemoRequestConfig | undefined {
  if (!pack.defaultRequestId) {
    return undefined;
  }

  return getDemoRequestById(pack, pack.defaultRequestId);
}
