import { DemoRoutePlaceholder } from "@/components/demo/shared/demo-route-placeholder";

export default function Page() {
  return (
    <DemoRoutePlaceholder
      title="Receiving department dashboard"
      route="/demo/department"
      description="This route will show incoming referrals, pending acceptance, assigned work and completed departmental checks."
      nextHref="/demo/department/handoffs/HND-DEMO-001"
      nextLabel="Open handoff"
    />
  );
}
