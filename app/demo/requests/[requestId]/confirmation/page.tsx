import { DemoPublicRoutePlaceholder } from "@/components/demo/shell";

export default function Page() {
  return (
    <DemoPublicRoutePlaceholder
      eyebrow="Submission confirmation"
      title="The service request has been received"
      route="/demo/requests/[requestId]/confirmation"
      description="This route will show the generated reference number, submitted information, supporting documents and clear next steps."
      nextHref="/demo/track/REQ-DEMO-001"
      nextLabel="Track request progress"
    />
  );
}
