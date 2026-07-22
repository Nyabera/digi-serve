import { DemoRoutePlaceholder } from "@/components/demo/shared/demo-route-placeholder";

export default function Page() {
  return (
    <DemoRoutePlaceholder
      title="Configurable application form"
      route="/demo/apply/[serviceSlug]"
      description="This route will render the selected service form and simulated document-upload controls."
      nextHref="/demo/requests/REQ-DEMO-001/confirmation"
      nextLabel="Simulate submission"
    />
  );
}
