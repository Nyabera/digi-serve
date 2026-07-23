import type { ReactNode } from "react";

import { DemoControlBar } from "@/components/demo/controls";
import { DemoPresentationFrame } from "@/components/demo/presentation";
import { DemoStateProvider } from "@/features/demo/state";

import "./demo-calibration.css";
import "./demo-presentation.css";

type DemoLayoutProps = {
  readonly children: ReactNode;
};

export default function DemoLayout({
  children,
}: DemoLayoutProps) {
  return (
    <DemoStateProvider>
      <DemoPresentationFrame
        controls={<DemoControlBar />}
      >
        {children}
      </DemoPresentationFrame>
    </DemoStateProvider>
  );
}
