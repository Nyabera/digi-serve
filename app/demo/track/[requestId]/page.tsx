import { DemoRequestTrackingPage } from "@/components/demo/tracking";

type TrackRequestPageProps = {
  params: Promise<{
    requestId: string;
  }>;
};

export default async function TrackRequestPage({
  params,
}: TrackRequestPageProps) {
  const { requestId } = await params;

  return (
    <DemoRequestTrackingPage
      requestId={decodeURIComponent(requestId)}
    />
  );
}
