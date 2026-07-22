import { DemoPublicRoutePlaceholder } from "@/components/demo/shell";

export default function Page() {
  return (
    <DemoPublicRoutePlaceholder
      eyebrow="Service information"
      title="Understand the service before applying"
      route="/demo/services/[serviceSlug]"
      description="This route will explain eligibility, requirements, documents, fees, processing time and the expected institutional outcome."
      nextHref="/demo/sign-up"
      nextLabel="Continue to sign-up"
    />
  );
}
