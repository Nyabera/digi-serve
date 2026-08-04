import {
  ServiceInformationWorkspace,
  getWorkflowBySlug,
} from "@/features/demo-service-workflows";

export default function ServiceInformationPage() {
  return (
    <ServiceInformationWorkspace
      workflow={getWorkflowBySlug("class-registration")}
    />
  );
}
