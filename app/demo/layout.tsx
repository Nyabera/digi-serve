import type { ReactNode } from "react";

import { DemoControlBar } from "@/components/demo/controls";
import { DemoPresentationFrame } from "@/components/demo/presentation";
import { DemoRoleNavigationBridge } from "@/components/demo/role-switch/demo-role-navigation-bridge";
import { DemoWorkspaceRoleProvider } from "@/features/demo/roles";
import { DemoStateProvider } from "@/features/demo/state";
import { ActiveDemoPackProvider } from "@/features/demo-engine/config";

import "./demo-calibration.css";
import "./demo-presentation.css";
import "./demo-accessibility.css";
import "./demo-internal-shell.css";

type DemoLayoutProps = {
  readonly children: ReactNode;
};

export default function DemoLayout({ children }: DemoLayoutProps) {
  return (
    <ActiveDemoPackProvider>
      <DemoStateProvider>
        <DemoWorkspaceRoleProvider>
          <a href="#demo-main-content" className="demo-skip-link">
            Skip to main content
          </a>
          <DemoPresentationFrame controls={<DemoControlBar />}>
            <DemoRoleNavigationBridge />
            {children}
          </DemoPresentationFrame>
        </DemoWorkspaceRoleProvider>
      </DemoStateProvider>
    </ActiveDemoPackProvider>
  );
}
