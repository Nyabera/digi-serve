import { DemoRoutePlaceholder } from "@/components/demo/shared/demo-route-placeholder";

export default function Page() {
  return (
    <DemoRoutePlaceholder
      title="Simulated applicant sign-up"
      route="/demo/sign-up"
      description="This route will simulate applicant account creation without creating a production Supabase Auth user."
      nextHref="/demo/apply/transcript-request"
      nextLabel="Continue to application"
    />
  );
}
