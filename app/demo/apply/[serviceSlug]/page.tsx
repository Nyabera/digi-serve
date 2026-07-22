import { DemoPublicRoutePlaceholder } from "@/components/demo/shell";

export default function Page() {
  return (
    <DemoPublicRoutePlaceholder
      eyebrow="Application form"
      title="Complete the configured service request"
      route="/demo/apply/[serviceSlug]"
      description="This route will render the selected service form, document requirements, draft state and simulated file-selection controls."
      nextHref="/demo/requests/REQ-DEMO-001/confirmation"
      nextLabel="Review simulated submission"
    />
  );
}
