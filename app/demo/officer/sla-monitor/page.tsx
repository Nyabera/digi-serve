import { DemoControlBar } from "@/components/demo/controls";
import { DemoPresentationFrame } from "@/components/demo/presentation";
import { OfficerSlaWorkspace } from "@/features/demo-operations";

export default function OfficerSlaMonitorPage() {
  return (
    <DemoPresentationFrame
        controls={<DemoControlBar />}
      >
      <OfficerSlaWorkspace />
    </DemoPresentationFrame>
  );
}
