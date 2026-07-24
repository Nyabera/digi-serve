import type { ReactNode } from "react";

import { DemoControlBar } from "@/components/demo/controls";
import { DemoPresentationFrame } from "@/components/demo/presentation";
import { DemoStateProvider } from "@/features/demo/state";
import { DemoWorkspaceRoleProvider } from "@/features/demo/roles";

import "./demo-calibration.css";
import "./demo-presentation.css";
import "./demo-accessibility.css";
import "./demo-internal-shell.css";

type DemoLayoutProps = {
  readonly children: ReactNode;
};

export default function DemoLayout({
  children,
}: DemoLayoutProps) {
  return (
    <DemoStateProvider>
      <DemoWorkspaceRoleProvider>
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
          </DemoWorkspaceRoleProvider>
    </DemoStateProvider>
  );
}
