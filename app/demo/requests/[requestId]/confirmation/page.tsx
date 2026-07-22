import { DemoRoutePlaceholder } from "@/components/demo/shared/demo-route-placeholder";

export default function Page() {
  return (
    <DemoRoutePlaceholder
      title="Submission confirmation"
      route="/demo/requests/[requestId]/confirmation"
      description="This route will show the generated request reference, submission summary and next steps."
      nextHref="/demo/track/REQ-DEMO-001"
      nextLabel="Track request"
    />
  );
}
