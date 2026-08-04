import {
  ServiceTrackingWorkspace,
  getWorkflowBySlug,
} from "@/features/demo-service-workflows";

export default function ServiceTrackingPage() {
  return (
    <ServiceTrackingWorkspace
      workflow={getWorkflowBySlug("course-application")}
    />
  );
}
