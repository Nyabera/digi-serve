import { DemoRoutePlaceholder } from "@/components/demo/shared/demo-route-placeholder";

export default function Page() {
  return (
    <DemoRoutePlaceholder
      title="Officer request review"
      route="/demo/officer/requests/[requestId]"
      description="This route will show applicant information, submitted responses, documents, internal workflow state and available officer actions."
      nextHref="/demo/department"
      nextLabel="Open receiving department"
    />
  );
}
