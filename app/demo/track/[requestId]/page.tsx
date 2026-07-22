import { DemoRoutePlaceholder } from "@/components/demo/shared/demo-route-placeholder";

export default function Page() {
  return (
    <DemoRoutePlaceholder
      title="Applicant progress tracking"
      route="/demo/track/[requestId]"
      description="This route will show applicant-safe status information and the public request timeline."
      nextHref="/demo/officer"
      nextLabel="Open officer dashboard"
    />
  );
}
