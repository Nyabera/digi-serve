import type { ReactNode } from "react";

import { DemoControlBar } from "@/components/demo/controls";
import { DemoPresentationFrame } from "@/components/demo/presentation";
import { DemoStateProvider } from "@/features/demo/state";

import "./demo-calibration.css";
import "./demo-presentation.css";
import "./demo-accessibility.css";

type DemoLayoutProps = {
  readonly children: ReactNode;
};

export default function DemoLayout({
  children,
}: DemoLayoutProps) {
  return (
    <DemoStateProvider>
      <a
        href="#demo-main-content"
        className="demo-skip-link"
      >
        Skip to main content
      </a>
      <DemoPresentationFrame
        controls={<DemoControlBar />}
      >
        {children}
      </DemoPresentationFrame>
    </DemoStateProvider>
  );
}
