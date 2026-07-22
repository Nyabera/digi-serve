import { DemoPublicRoutePlaceholder } from "@/components/demo/shell";

export default function Page() {
  return (
    <DemoPublicRoutePlaceholder
      eyebrow="Request tracking"
      title="Follow progress without internal bureaucracy"
      route="/demo/track/[requestId]"
      description="This route will show applicant-safe status information, important messages and a controlled public timeline."
      nextHref="/demo/officer"
      nextLabel="Continue to officer demonstration"
    />
  );
}
