import { DemoRoutePlaceholder } from "@/components/demo/shared/demo-route-placeholder";

export default function Page() {
  return (
    <DemoRoutePlaceholder
      title="Department handoff processing"
      route="/demo/department/handoffs/[handoffId]"
      description="This route will demonstrate accepting a referral, performing the requested check and returning the result to the originating officer."
      nextHref="/demo/supervisor"
      nextLabel="Open supervisor dashboard"
    />
  );
}
