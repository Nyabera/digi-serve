import { DemoRoutePlaceholder } from "@/components/demo/shared/demo-route-placeholder";

export default function Page() {
  return (
    <DemoRoutePlaceholder
      title="Controlled outcome issuance"
      route="/demo/outcomes/[requestId]"
      description="This route will show the approved result and a synthetic institutional outcome document."
      nextHref="/demo/reports"
      nextLabel="Open reports"
    />
  );
}
