import { DemoRoutePlaceholder } from "@/components/demo/shared/demo-route-placeholder";

export default function Page() {
  return (
    <DemoRoutePlaceholder
      title="Supervisor approval"
      route="/demo/supervisor/approvals/[requestId]"
      description="This route will demonstrate final review, approval or rejection before controlled outcome issuance."
      nextHref="/demo/outcomes/REQ-DEMO-001"
      nextLabel="View issued outcome"
    />
  );
}
