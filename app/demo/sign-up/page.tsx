import { DemoPublicRoutePlaceholder } from "@/components/demo/shell";

export default function Page() {
  return (
    <DemoPublicRoutePlaceholder
      eyebrow="Applicant access"
      title="Create a simulated applicant profile"
      route="/demo/sign-up"
      description="This route will collect the minimum applicant details required to continue the demonstration without creating a production authentication user."
      nextHref="/demo/apply/transcript-request"
      nextLabel="Continue to application"
    />
  );
}
