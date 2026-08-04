import {
  ServiceApplicationWorkspace,
  getWorkflowBySlug,
} from "@/features/demo-service-workflows";

export default function ServiceApplicationPage() {
  return (
    <ServiceApplicationWorkspace
      workflow={getWorkflowBySlug("industrial-attachment-letter")}
    />
  );
}
