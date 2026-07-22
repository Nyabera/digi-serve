import { DemoRoutePlaceholder } from "@/components/demo/shared/demo-route-placeholder";

export default function Page() {
  return (
    <DemoRoutePlaceholder
      title="Supervisor dashboard"
      route="/demo/supervisor"
      description="This route will show departmental workload, pending handoffs, overdue work and requests awaiting approval."
      nextHref="/demo/supervisor/approvals/REQ-DEMO-001"
      nextLabel="Open approval"
    />
  );
}
