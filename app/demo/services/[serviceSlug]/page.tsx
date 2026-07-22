import { DemoRoutePlaceholder } from "@/components/demo/shared/demo-route-placeholder";

export default function Page() {
  return (
    <DemoRoutePlaceholder
      title="Service information"
      route="/demo/services/[serviceSlug]"
      description="This route will explain the selected institutional service, its eligibility rules, requirements, documents, fees and expected processing time."
      nextHref="/demo/sign-up"
      nextLabel="Continue to sign-up"
    />
  );
}
