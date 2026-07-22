import { DemoRoutePlaceholder } from "@/components/demo/shared/demo-route-placeholder";

export default function Page() {
  return (
    <DemoRoutePlaceholder
      title="Demo Engine reports"
      route="/demo/reports"
      description="This route will contain Recharts reporting for requests, departments, handoffs, turnaround time and workflow completion."
      nextHref="/demo"
      nextLabel="Return to route index"
    />
  );
}
