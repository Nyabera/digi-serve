import { DemoRoutePlaceholder } from "@/components/demo/shared/demo-route-placeholder";

export default function Page() {
  return (
    <DemoRoutePlaceholder
      title="Officer dashboard"
      route="/demo/officer"
      description="This route will show assigned requests, due work, overdue work and requests waiting on another department."
      nextHref="/demo/officer/requests/REQ-DEMO-001"
      nextLabel="Open request"
    />
  );
}
